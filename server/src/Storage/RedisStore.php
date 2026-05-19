<?php
declare(strict_types=1);

namespace App\Storage;

use App\Bootstrap;

/**
 * Redis 存储（KV 形式存 JSON 字符串）
 *
 * 设计：
 *   - 优先尝试 phpredis 扩展（PHP 自带 `Redis` 类）
 *   - 启动时 lazy 连接；连接失败 / 扩展缺失 → isAvailable() 返回 false，调用方自动降级
 *   - 所有读写都用 try/catch 包裹，单次失败标记 unhealthy 后短时间内直接 short-circuit
 *
 * 配置：config/app.php → storage.redis
 */
final class RedisStore
{
    private array $config;
    private ?\Redis $client = null;
    /** 连接失败标志：true 后所有调用立刻 return null/false，避免反复等连接超时 */
    private bool $disabled = false;
    private string $prefix;

    public function __construct(?array $config = null)
    {
        $this->config = $config ?? (array) Bootstrap::config('storage.redis');
        $this->prefix = (string) ($this->config['prefix'] ?? 'iqotb:save:');
        if (empty($this->config['enabled'])) {
            $this->disabled = true;
        } elseif (!class_exists(\Redis::class)) {
            // 扩展缺失，直接禁用
            $this->disabled = true;
        }
    }

    public function isAvailable(): bool
    {
        if ($this->disabled) return false;
        return $this->client !== null || $this->connect();
    }

    /**
     * 读取一个 key（自动加 prefix），不存在或异常返回 null
     */
    public function get(string $key): ?array
    {
        if (!$this->isAvailable()) return null;
        try {
            $raw = $this->client->get($this->prefix . $key);
            if ($raw === false || $raw === null) return null;
            $decoded = json_decode((string) $raw, true);
            return is_array($decoded) ? $decoded : null;
        } catch (\Throwable $e) {
            $this->disabled = true;
            return null;
        }
    }

    /**
     * 写入一个 key
     */
    public function set(string $key, array $value): bool
    {
        if (!$this->isAvailable()) return false;
        $ttl = (int) ($this->config['ttl'] ?? 0);
        try {
            $payload = json_encode($value, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
            if ($payload === false) return false;
            if ($ttl > 0) {
                return (bool) $this->client->setex($this->prefix . $key, $ttl, $payload);
            }
            return (bool) $this->client->set($this->prefix . $key, $payload);
        } catch (\Throwable $e) {
            $this->disabled = true;
            return false;
        }
    }

    /**
     * 删除一个 key
     */
    public function delete(string $key): bool
    {
        if (!$this->isAvailable()) return false;
        try {
            return $this->client->del($this->prefix . $key) > 0;
        } catch (\Throwable $e) {
            $this->disabled = true;
            return false;
        }
    }

    private function connect(): bool
    {
        if ($this->disabled) return false;
        try {
            $this->client = new \Redis();
            $ok = @$this->client->connect(
                (string) $this->config['host'],
                (int)    $this->config['port'],
                (float)  ($this->config['timeout'] ?? 1.0)
            );
            if (!$ok) {
                $this->disabled = true;
                $this->client = null;
                return false;
            }
            if (!empty($this->config['auth'])) {
                @$this->client->auth((string) $this->config['auth']);
            }
            if (isset($this->config['db'])) {
                @$this->client->select((int) $this->config['db']);
            }
            return true;
        } catch (\Throwable $e) {
            $this->disabled = true;
            $this->client = null;
            return false;
        }
    }
}
