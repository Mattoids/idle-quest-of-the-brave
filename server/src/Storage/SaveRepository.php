<?php
declare(strict_types=1);

namespace App\Storage;

use App\Bootstrap;
use App\Http\HttpException;

/**
 * 存档仓库：每个 device_id 对应一个 JSON 文件
 *
 *   data/saves/<hash_prefix>/<device_hash>.json
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
    private string $rootDir;

    public function __construct(?FileStore $files = null)
    {
        $this->files = $files ?? new FileStore();
        $this->rootDir = (string) Bootstrap::config('paths.saves');
    }

    public function exists(string $deviceHash): bool
    {
        return $this->files->exists($this->pathFor($deviceHash));
    }

    public function load(string $deviceHash): ?array
    {
        return $this->files->readJson($this->pathFor($deviceHash));
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
        if ($this->files->exists($path)) {
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
        $this->files->writeJson($path, $save);
        return $save;
    }

    /**
     * 完整覆盖存档（保留 created_at）
     */
    public function replace(string $deviceHash, array $save): array
    {
        return $this->files->update($this->pathFor($deviceHash), function (array $cur) use ($save, $deviceHash) {
            $cur = $cur ?: [];
            $save['device_hash'] = $deviceHash;
            $save['schema_version'] = $save['schema_version'] ?? ($cur['schema_version'] ?? 1);
            $save['created_at'] = $cur['created_at'] ?? time();
            $save['updated_at'] = time();
            return $save;
        });
    }

    /**
     * 原子事务：读 → 改 → 写
     *
     * @param callable(array):array $mutator
     */
    public function mutate(string $deviceHash, callable $mutator): array
    {
        return $this->files->update($this->pathFor($deviceHash), function (array $cur) use ($mutator) {
            if (empty($cur)) {
                throw HttpException::notFound('save_not_found');
            }
            $next = $mutator($cur);
            $next['updated_at'] = time();
            return $next;
        });
    }

    public function pathFor(string $deviceHash): string
    {
        $deviceHash = strtolower($deviceHash);
        if (!preg_match('/^[a-f0-9]{32,128}$/', $deviceHash)) {
            throw new \InvalidArgumentException('invalid device hash');
        }
        $prefix = substr($deviceHash, 0, 2);
        return $this->rootDir . '/' . $prefix . '/' . $deviceHash . '.json';
    }
}
