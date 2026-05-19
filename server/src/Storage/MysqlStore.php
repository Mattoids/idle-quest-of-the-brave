<?php
declare(strict_types=1);

namespace App\Storage;

use App\Bootstrap;

/**
 * MySQL 存档持久化
 *
 * 用途：仅存"存档信息"（与用户要求一致）—— market / auth 不走 MySQL
 *
 * 表结构：
 *   CREATE TABLE IF NOT EXISTS game_saves (
 *     device_hash CHAR(64) PRIMARY KEY,
 *     payload     LONGTEXT NOT NULL,
 *     updated_at  BIGINT NOT NULL,
 *     created_at  BIGINT NOT NULL
 *   ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
 *
 * 设计：
 *   - lazy 连接，第一次使用才 PDO::__construct
 *   - 连接失败 / 任何异常 → 标记 disabled，调用方降级到 File
 *   - 配置见 config/app.php → storage.mysql
 */
final class MysqlStore
{
    private array $config;
    private ?\PDO $pdo = null;
    private bool $disabled = false;
    private bool $schemaEnsured = false;

    public function __construct(?array $config = null)
    {
        $this->config = $config ?? (array) Bootstrap::config('storage.mysql');
        if (empty($this->config['enabled'])) {
            $this->disabled = true;
        } elseif (!extension_loaded('pdo_mysql')) {
            $this->disabled = true;
        }
    }

    public function isAvailable(): bool
    {
        if ($this->disabled) return false;
        return $this->pdo !== null || $this->connect();
    }

    /**
     * 读取存档
     */
    public function get(string $deviceHash): ?array
    {
        if (!$this->isAvailable()) return null;
        try {
            $stmt = $this->pdo->prepare('SELECT payload FROM game_saves WHERE device_hash = :h LIMIT 1');
            $stmt->execute([':h' => $deviceHash]);
            $row = $stmt->fetch();
            if (!$row || empty($row['payload'])) return null;
            $decoded = json_decode((string) $row['payload'], true);
            return is_array($decoded) ? $decoded : null;
        } catch (\Throwable $e) {
            $this->disabled = true;
            return null;
        }
    }

    /**
     * 写入 / 更新存档
     */
    public function set(string $deviceHash, array $save): bool
    {
        if (!$this->isAvailable()) return false;
        try {
            $payload = json_encode($save, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
            if ($payload === false) return false;
            $now       = time();
            $createdAt = (int) ($save['created_at'] ?? $now);
            $updatedAt = (int) ($save['updated_at'] ?? $now);
            $sql = 'INSERT INTO game_saves (device_hash, payload, updated_at, created_at)
                    VALUES (:h, :p, :u, :c)
                    ON DUPLICATE KEY UPDATE payload = VALUES(payload), updated_at = VALUES(updated_at)';
            $stmt = $this->pdo->prepare($sql);
            return $stmt->execute([
                ':h' => $deviceHash,
                ':p' => $payload,
                ':u' => $updatedAt,
                ':c' => $createdAt,
            ]);
        } catch (\Throwable $e) {
            $this->disabled = true;
            return false;
        }
    }

    public function delete(string $deviceHash): bool
    {
        if (!$this->isAvailable()) return false;
        try {
            $stmt = $this->pdo->prepare('DELETE FROM game_saves WHERE device_hash = :h');
            return $stmt->execute([':h' => $deviceHash]);
        } catch (\Throwable $e) {
            $this->disabled = true;
            return false;
        }
    }

    private function connect(): bool
    {
        if ($this->disabled) return false;
        try {
            $dsn = sprintf(
                'mysql:host=%s;port=%d;dbname=%s;charset=%s',
                (string) $this->config['host'],
                (int)    $this->config['port'],
                (string) $this->config['database'],
                (string) ($this->config['charset'] ?? 'utf8mb4')
            );
            $options = [
                \PDO::ATTR_ERRMODE            => \PDO::ERRMODE_EXCEPTION,
                \PDO::ATTR_DEFAULT_FETCH_MODE => \PDO::FETCH_ASSOC,
                \PDO::ATTR_EMULATE_PREPARES   => false,
                \PDO::ATTR_TIMEOUT            => 2,
            ];
            $this->pdo = new \PDO(
                $dsn,
                (string) $this->config['username'],
                (string) $this->config['password'],
                $options
            );
            if (!$this->schemaEnsured) {
                $this->ensureSchema();
                $this->schemaEnsured = true;
            }
            return true;
        } catch (\Throwable $e) {
            $this->disabled = true;
            $this->pdo = null;
            return false;
        }
    }

    /**
     * 启动时确保表结构存在（CI/CD 环境无需手动跑 migration）
     * 与 migrations/001_game_saves.sql 保持一致：所有字段带 COMMENT 便于运维 / DBA 排查
     */
    private function ensureSchema(): void
    {
        $sql = "CREATE TABLE IF NOT EXISTS game_saves (
            device_hash CHAR(64) NOT NULL COMMENT '设备哈希（sha256(device_id + salt)），同一用户跨设备共享',
            payload     LONGTEXT NOT NULL COMMENT '存档完整 JSON：{device_hash, schema_version, created_at, updated_at, player, world, battle, meta}',
            updated_at  BIGINT   NOT NULL COMMENT '最近一次写入的 Unix 秒级时间戳；与 payload.updated_at 一致',
            created_at  BIGINT   NOT NULL COMMENT '存档首次创建的 Unix 秒级时间戳；与 payload.created_at 一致',
            PRIMARY KEY (device_hash),
            INDEX idx_updated (updated_at) COMMENT '按更新时间过滤的辅助索引（用于离线挂机统计 / 数据治理）'
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
          COMMENT='勇者挂机传说 玩家存档主表（Redis miss 时回源/兜底）'";
        $this->pdo->exec($sql);
    }
}
