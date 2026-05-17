<?php
declare(strict_types=1);

namespace App\Storage;

use App\Util\Json;

/**
 * 文件存储：JSON 读写 + 原子写 + 排他锁
 *
 * 写入流程：write_to_tmp -> fsync -> rename，避免半写文件被读到
 * 读取流程：fopen + flock(LOCK_SH) -> 内容读完 -> 解锁
 *
 * 提供 update($path, $mutator) 做"读-改-写"的原子事务
 */
final class FileStore
{
    /**
     * 读取 JSON 文件。文件不存在时返回 $default
     */
    public function readJson(string $path, ?array $default = null): ?array
    {
        if (!is_file($path)) {
            return $default;
        }
        $fp = @fopen($path, 'rb');
        if (!$fp) {
            return $default;
        }
        try {
            @flock($fp, LOCK_SH);
            $size = filesize($path) ?: 0;
            $raw = $size > 0 ? fread($fp, $size) : '';
        } finally {
            @flock($fp, LOCK_UN);
            fclose($fp);
        }
        if ($raw === false || $raw === '') {
            return $default;
        }
        return Json::decode($raw);
    }

    /**
     * 原子写入 JSON 文件
     */
    public function writeJson(string $path, array $data, int $jsonFlags = 0): void
    {
        $dir = dirname($path);
        if (!is_dir($dir)) {
            if (!@mkdir($dir, 0775, true) && !is_dir($dir)) {
                throw new \RuntimeException("cannot create directory: $dir");
            }
        }
        $content = Json::encode($data, $jsonFlags | JSON_PRETTY_PRINT);
        $tmp = $path . '.tmp.' . bin2hex(random_bytes(4));
        $fp = @fopen($tmp, 'wb');
        if (!$fp) {
            throw new \RuntimeException("cannot open tmp file: $tmp");
        }
        try {
            @flock($fp, LOCK_EX);
            fwrite($fp, $content);
            fflush($fp);
        } finally {
            @flock($fp, LOCK_UN);
            fclose($fp);
        }
        // 原子替换
        if (!@rename($tmp, $path)) {
            @unlink($tmp);
            throw new \RuntimeException("cannot rename tmp file to: $path");
        }
    }

    /**
     * 读-改-写事务：通过单个排他锁文件实现，确保多个并发请求按顺序应用 mutator
     *
     * @param callable(array $data):array $mutator
     */
    public function update(string $path, callable $mutator, ?array $defaultOnMissing = null): array
    {
        $dir = dirname($path);
        if (!is_dir($dir)) {
            if (!@mkdir($dir, 0775, true) && !is_dir($dir)) {
                throw new \RuntimeException("cannot create directory: $dir");
            }
        }
        $lockFile = $path . '.lock';
        $lfp = @fopen($lockFile, 'cb');
        if (!$lfp) {
            throw new \RuntimeException("cannot open lock file: $lockFile");
        }
        try {
            if (!@flock($lfp, LOCK_EX)) {
                throw new \RuntimeException("cannot acquire lock on: $lockFile");
            }
            $current = $this->readJson($path, $defaultOnMissing);
            $next = $mutator($current ?? []);
            if (!is_array($next)) {
                throw new \RuntimeException('mutator must return array');
            }
            $this->writeJson($path, $next);
            return $next;
        } finally {
            @flock($lfp, LOCK_UN);
            fclose($lfp);
            // 锁文件保留以便后续复用
        }
    }

    public function delete(string $path): bool
    {
        if (!is_file($path)) {
            return false;
        }
        return @unlink($path);
    }

    public function exists(string $path): bool
    {
        return is_file($path);
    }
}
