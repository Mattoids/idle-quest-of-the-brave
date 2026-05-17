<?php
declare(strict_types=1);

namespace App\Storage;

use App\Bootstrap;

/**
 * 缓存层：APCu 优先 → 文件回退
 *
 * 用途：token 映射、战斗 session、节流计数等临时数据
 */
final class Cache
{
    private string $driver;
    private string $prefix;
    private string $fileDir;

    public function __construct()
    {
        $this->driver = (string) Bootstrap::config('cache.driver', 'file');
        $this->prefix = (string) Bootstrap::config('cache.prefix', 'iqotb:');
        $this->fileDir = (string) Bootstrap::config('paths.cache', sys_get_temp_dir());
        if ($this->driver === 'apcu' && !function_exists('apcu_fetch')) {
            $this->driver = 'file';
        }
        if ($this->driver === 'file' && !is_dir($this->fileDir)) {
            @mkdir($this->fileDir, 0775, true);
        }

        // 低概率 GC
        if ($this->driver === 'file') {
            $p = (float) Bootstrap::config('cache.gc_probability', 0.01);
            if ($p > 0 && mt_rand() / mt_getrandmax() < $p) {
                $this->gc();
            }
        }
    }

    public function get(string $key, $default = null)
    {
        $k = $this->prefix . $key;
        if ($this->driver === 'apcu') {
            $ok = false;
            $val = apcu_fetch($k, $ok);
            return $ok ? $val : $default;
        }
        $path = $this->filePath($k);
        if (!is_file($path)) return $default;
        $raw = @file_get_contents($path);
        if ($raw === false) return $default;
        $obj = @json_decode($raw, true);
        if (!is_array($obj)) return $default;
        if (isset($obj['exp']) && $obj['exp'] > 0 && $obj['exp'] < time()) {
            @unlink($path);
            return $default;
        }
        return $obj['v'] ?? $default;
    }

    public function set(string $key, $value, int $ttlSeconds = 0): bool
    {
        $k = $this->prefix . $key;
        if ($this->driver === 'apcu') {
            return apcu_store($k, $value, max(0, $ttlSeconds));
        }
        $payload = [
            'v'   => $value,
            'exp' => $ttlSeconds > 0 ? time() + $ttlSeconds : 0,
        ];
        $path = $this->filePath($k);
        $dir = dirname($path);
        if (!is_dir($dir)) @mkdir($dir, 0775, true);
        return (bool) @file_put_contents($path, json_encode($payload, JSON_UNESCAPED_UNICODE), LOCK_EX);
    }

    public function delete(string $key): bool
    {
        $k = $this->prefix . $key;
        if ($this->driver === 'apcu') {
            return apcu_delete($k);
        }
        $path = $this->filePath($k);
        return is_file($path) ? @unlink($path) : true;
    }

    public function increment(string $key, int $delta = 1, int $ttlSeconds = 60): int
    {
        $cur = (int) ($this->get($key, 0));
        $next = $cur + $delta;
        $this->set($key, $next, $ttlSeconds);
        return $next;
    }

    /**
     * 远程调用频率限制：返回当前窗口内的次数。第一次写入时会设置 TTL。
     */
    public function rateLimit(string $key, int $window, int $max): bool
    {
        $count = $this->increment("rl:$key", 1, $window);
        return $count <= $max;
    }

    private function filePath(string $key): string
    {
        $hash = sha1($key);
        $sub = substr($hash, 0, 2);
        return $this->fileDir . '/' . $sub . '/' . $hash . '.cache';
    }

    private function gc(): void
    {
        if (!is_dir($this->fileDir)) return;
        $now = time();
        $it = new \RecursiveIteratorIterator(
            new \RecursiveDirectoryIterator($this->fileDir, \FilesystemIterator::SKIP_DOTS)
        );
        foreach ($it as $f) {
            if (!$f->isFile() || $f->getExtension() !== 'cache') continue;
            $raw = @file_get_contents($f->getPathname());
            if ($raw === false) continue;
            $obj = @json_decode($raw, true);
            if (is_array($obj) && isset($obj['exp']) && $obj['exp'] > 0 && $obj['exp'] < $now) {
                @unlink($f->getPathname());
            }
        }
    }
}
