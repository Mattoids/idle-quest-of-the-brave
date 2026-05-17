<?php
declare(strict_types=1);

namespace App\Auth;

use App\Storage\Cache;

/**
 * Token 存储：token → device_hash 映射，存在缓存层
 *
 * Token 是不透明字符串（base64url(32 字节随机）），TTL 由 config('auth.token_ttl') 决定。
 */
final class TokenStore
{
    private Cache $cache;
    private int $ttl;

    public function __construct(?Cache $cache = null)
    {
        $this->cache = $cache ?? new Cache();
        $this->ttl = (int) \App\Bootstrap::config('auth.token_ttl', 86400 * 30);
    }

    public function issue(string $deviceHash): string
    {
        $token = self::generate();
        $this->cache->set($this->key($token), $deviceHash, $this->ttl);
        return $token;
    }

    public function resolve(string $token): ?string
    {
        if ($token === '') return null;
        $v = $this->cache->get($this->key($token));
        return is_string($v) && $v !== '' ? $v : null;
    }

    public function revoke(string $token): void
    {
        $this->cache->delete($this->key($token));
    }

    public static function generate(): string
    {
        $raw = random_bytes(32);
        return rtrim(strtr(base64_encode($raw), '+/', '-_'), '=');
    }

    private function key(string $token): string
    {
        return 'auth:token:' . hash('sha256', $token);
    }
}
