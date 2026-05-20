<?php
declare(strict_types=1);

namespace App\Storage;

use App\Bootstrap;
use App\Http\HttpException;

/**
 * 存档仓库：三级存储 cache-aside 模式
 *
 *   主权威 + 互斥锁：FileStore（本地磁盘，路径见 paths.saves）
 *   读取缓存：RedisStore（启用且可用时优先）
 *   持久备份：MysqlStore（启用且可用时同步写）
 *
 * 调用关系：
 *   - load(): Redis hit → 返回；miss → File；File miss → MySQL；命中后回填上层
 *   - replace / mutate / create: 文件锁内更新文件，成功后同步刷新 Redis + MySQL
 *   - delete: 三层都清
 *
 * 任何一层异常都自动降级（RedisStore / MysqlStore 内部带 disabled flag），
 * 文件层始终可用，保证最终存档不丢。
 *
 * 文件结构（顶层）：
 *   {
 *     "device_hash": "...",
 *     "schema_version": 1,
 *     "created_at": 1700000000,
 *     "updated_at": 1700000000,
 *     "player":  { ... 玩家状态 ... },
 *     "world":   { ... 区域/线索/BOSS 进度 ... },
 *     "battle":  null | { ... 当前战斗会话 ... },
 *     "meta":    { ... 客户端版本号等 ... }
 *   }
 */
final class SaveRepository
{
    private FileStore $files;
    private RedisStore $redis;
    private MysqlStore $mysql;
    private string $rootDir;

    public function __construct(
        ?FileStore $files = null,
        ?RedisStore $redis = null,
        ?MysqlStore $mysql = null
    ) {
        $this->files = $files ?? new FileStore();
        $this->redis = $redis ?? new RedisStore();
        $this->mysql = $mysql ?? new MysqlStore();
        $this->rootDir = (string) Bootstrap::config('paths.saves');
    }

    public function exists(string $deviceHash): bool
    {
        // 任一层存在即视为已注册
        if ($this->redis->isAvailable() && $this->redis->get($deviceHash) !== null) return true;
        if ($this->files->exists($this->pathFor($deviceHash))) return true;
        if ($this->mysql->isAvailable() && $this->mysql->get($deviceHash) !== null) return true;
        return false;
    }

    /**
     * 三级读取：Redis → File → MySQL（命中后回填上层）
     *
     * File hit 时若 MySQL 缺失或过期，自动回填 MySQL，确保持久层始终最新。
     */
    public function load(string $deviceHash): ?array
    {
        // 1. Redis 优先
        $hit = $this->redis->get($deviceHash);
        if ($hit !== null) {
            return $hit;
        }
        // 2. File 兜底（权威层）
        $hit = $this->files->readJson($this->pathFor($deviceHash));
        if ($hit !== null) {
            // 回填 Redis（仅缓存，失败静默）
            $this->redis->set($deviceHash, $hit);
            // 若 MySQL 缺失或文件比 MySQL 新，同步到 MySQL
            $this->backfillMysqlIfStale($deviceHash, $hit);
            return $hit;
        }
        // 3. MySQL 持久层（File 丢失后的最后救援）
        $hit = $this->mysql->get($deviceHash);
        if ($hit !== null) {
            // 回填 File 与 Redis
            try {
                $this->files->writeJson($this->pathFor($deviceHash), $hit);
            } catch (\Throwable $e) { /* 文件不可写时静默 */ }
            $this->redis->set($deviceHash, $hit);
            return $hit;
        }
        return null;
    }

    public function loadOrThrow(string $deviceHash): array
    {
        $data = $this->load($deviceHash);
        if ($data === null) {
            throw HttpException::notFound('save_not_found');
        }
        return $data;
    }

    /**
     * 创建新存档（带默认 player）
     */
    public function create(string $deviceHash, array $defaultPlayer, array $defaultWorld): array
    {
        $path = $this->pathFor($deviceHash);
        // 已存在校验：检查任一层
        if ($this->exists($deviceHash)) {
            throw HttpException::conflict('save_already_exists');
        }
        $now = time();
        $save = [
            'device_hash'    => $deviceHash,
            'schema_version' => 1,
            'created_at'     => $now,
            'updated_at'     => $now,
            'player'         => $defaultPlayer,
            'world'          => $defaultWorld,
            'battle'         => null,
            'meta'           => [
                'client_version' => null,
                'last_action_ms' => null,
            ],
        ];
        $normalized = self::normalize($save);
        $this->files->writeJson($path, $normalized);
        $this->fanoutWrite($deviceHash, $normalized);
        return $save;
    }

    /**
     * 完整覆盖存档（保留 created_at）
     *
     * 防御性：若调用方 payload 缺 battle 字段，保留旧值；
     * 这样前端 PUT 整存档时不会清掉服务端正在进行的战斗会话。
     */
    public function replace(string $deviceHash, array $save): array
    {
        $written = $this->files->update($this->pathFor($deviceHash), function (array $cur) use ($save, $deviceHash) {
            $cur = $cur ?: [];
            $save['device_hash'] = $deviceHash;
            $save['schema_version'] = $save['schema_version'] ?? ($cur['schema_version'] ?? 1);
            $save['created_at'] = $cur['created_at'] ?? time();
            $save['updated_at'] = time();
            // 若调用方未带 battle 字段，保留旧值（避免误清战斗会话）
            if (!array_key_exists('battle', $save)) {
                $save['battle'] = $cur['battle'] ?? null;
            }
            return self::normalize($save);
        });
        $this->fanoutWrite($deviceHash, $written);
        return $written;
    }

    /**
     * 原子事务：读 → 改 → 写
     *
     * @param callable(array):array $mutator
     */
    public function mutate(string $deviceHash, callable $mutator): array
    {
        $written = $this->files->update($this->pathFor($deviceHash), function (array $cur) use ($mutator, $deviceHash) {
            // 文件 miss 时尝试从 Redis/MySQL 拉回
            if (empty($cur)) {
                $cur = $this->redis->get($deviceHash) ?? $this->mysql->get($deviceHash) ?? null;
            }
            if (empty($cur)) {
                throw HttpException::notFound('save_not_found');
            }
            $next = $mutator($cur);
            $next['updated_at'] = time();
            return self::normalize($next);
        });
        $this->fanoutWrite($deviceHash, $written);
        return $written;
    }

    public function delete(string $deviceHash): bool
    {
        $path = $this->pathFor($deviceHash);
        $fileDeleted = $this->files->exists($path) ? $this->files->delete($path) : false;
        // Redis / MySQL 同步清，失败静默
        $this->redis->delete($deviceHash);
        $this->mysql->delete($deviceHash);
        return $fileDeleted;
    }

    public function pathFor(string $deviceHash): string
    {
        $deviceHash = strtolower($deviceHash);
        if (!preg_match('/^[a-z0-9_-]{1,128}$/', $deviceHash)) {
            throw new \InvalidArgumentException('invalid device hash');
        }
        $prefix = substr($deviceHash, 0, 2);
        return $this->rootDir . '/' . $prefix . '/' . $deviceHash . '.json';
    }

    /**
     * 规范化"必须是 object"的字段：把空 PHP 数组 [] 转成 stdClass，
     * 这样 json_encode 输出 `{}` 而不是 `[]`，前端 JS 用 `obj[key] = ...`
     * 才不会丢失（数组上设置字符串属性会被 JSON.stringify 忽略）。
     */
    public static function normalize(array $save): array
    {
        $objectFields = ['equipments', 'treasures', 'skills', 'skillBooks', 'items', 'buffs', 'debuffs', 'passives', 'counterState'];
        if (isset($save['player']) && is_array($save['player'])) {
            foreach ($objectFields as $k) {
                if (!array_key_exists($k, $save['player'])) continue;
                $v = $save['player'][$k];
                if (is_array($v) && empty($v)) {
                    $save['player'][$k] = new \stdClass();
                }
            }
        }
        return $save;
    }

    /**
     * 文件写入成功后，同步刷新 Redis + MySQL（失败不影响主流程）
     *
     * MySQL 写入失败时将 device_hash 记录到待同步队列，供后续补偿。
     */
    private function fanoutWrite(string $deviceHash, array $save): void
    {
        // RedisStore / MysqlStore 内部已 try/catch + disable 旗标，这里直接调用即可
        $this->redis->set($deviceHash, $save);
        $ok = $this->mysql->set($deviceHash, $save);
        if (!$ok) {
            $this->queuePending($deviceHash);
        }
    }

    /**
     * 强制将文件存档同步到 MySQL（单条）
     */
    public function syncToMysql(string $deviceHash): bool
    {
        $save = $this->files->readJson($this->pathFor($deviceHash));
        if ($save === null) return false;
        return $this->mysql->set($deviceHash, $save);
    }

    /**
     * 批量同步：扫描所有文件存档，将缺失 / 过期的记录同步到 MySQL
     *
     * @return array{total:int, synced:int, failed:int}
     */
    public function syncAllToMysql(): array
    {
        $total  = 0;
        $synced = 0;
        $failed = 0;
        $it = new \RecursiveIteratorIterator(
            new \RecursiveDirectoryIterator($this->rootDir, \FilesystemIterator::SKIP_DOTS),
            \RecursiveIteratorIterator::LEAVES_ONLY
        );
        foreach ($it as $file) {
            if ($file->getExtension() !== 'json') continue;
            $name = $file->getBasename('.json');
            if (!preg_match('/^[a-z0-9_-]{1,128}$/', $name)) continue;
            $total++;
            $save = $this->files->readJson($file->getPathname());
            if ($save === null) { $failed++; continue; }
            $ok = $this->mysql->set($name, $save);
            $ok ? $synced++ : $failed++;
        }
        // 同时清空待同步队列
        $this->clearPending();
        return ['total' => $total, 'synced' => $synced, 'failed' => $failed];
    }

    /**
     * 同步待同步队列中的存档（MySQL 曾经写入失败的补偿）
     *
     * @return array{total:int, synced:int, failed:int}
     */
    public function syncPendingToMysql(): array
    {
        $pending = $this->getPending();
        $synced  = 0;
        $failed  = 0;
        foreach ($pending as $deviceHash) {
            $save = $this->files->readJson($this->pathFor($deviceHash));
            if ($save === null) { $failed++; continue; }
            $ok = $this->mysql->set($deviceHash, $save);
            $ok ? $synced++ : $failed++;
        }
        if ($synced > 0) {
            $this->clearPending();
        }
        return ['total' => count($pending), 'synced' => $synced, 'failed' => $failed];
    }

    // ---------- 内部：MySQL 回填与待同步队列 ----------

    /**
     * 若 MySQL 中无此存档，或文件比 MySQL 更新，则同步到 MySQL
     */
    private function backfillMysqlIfStale(string $deviceHash, array $fileSave): void
    {
        if (!$this->mysql->isAvailable()) return;
        $mysqlSave = $this->mysql->get($deviceHash);
        if ($mysqlSave === null) {
            // MySQL 缺失，直接同步
            $this->mysql->set($deviceHash, $fileSave);
            return;
        }
        $fileUpdated = (int) ($fileSave['updated_at'] ?? 0);
        $mysqlUpdated = (int) ($mysqlSave['updated_at'] ?? 0);
        if ($fileUpdated > $mysqlUpdated) {
            $this->mysql->set($deviceHash, $fileSave);
        }
    }

    private function queuePending(string $deviceHash): void
    {
        $path = $this->rootDir . '/.mysql_pending.json';
        $list = [];
        if (is_file($path)) {
            $raw = @file_get_contents($path);
            $list = is_string($raw) ? (json_decode($raw, true) ?: []) : [];
        }
        if (!is_array($list)) $list = [];
        if (!in_array($deviceHash, $list, true)) {
            $list[] = $deviceHash;
        }
        @file_put_contents($path, json_encode($list), LOCK_EX);
    }

    private function getPending(): array
    {
        $path = $this->rootDir . '/.mysql_pending.json';
        if (!is_file($path)) return [];
        $raw = @file_get_contents($path);
        $list = is_string($raw) ? (json_decode($raw, true) ?: []) : [];
        return is_array($list) ? $list : [];
    }

    private function clearPending(): void
    {
        $path = $this->rootDir . '/.mysql_pending.json';
        if (is_file($path)) @unlink($path);
    }
}
