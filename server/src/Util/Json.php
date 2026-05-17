<?php
declare(strict_types=1);

namespace App\Util;

final class Json
{
    public static function encode($value, int $flags = 0): string
    {
        $flags |= JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES;
        $out = json_encode($value, $flags);
        if ($out === false) {
            throw new \RuntimeException('json_encode failed: ' . json_last_error_msg());
        }
        return $out;
    }

    public static function decode(string $json): array
    {
        if ($json === '') {
            return [];
        }
        $out = json_decode($json, true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new \RuntimeException('json_decode failed: ' . json_last_error_msg());
        }
        if (!is_array($out)) {
            throw new \RuntimeException('json_decode: expected array, got ' . gettype($out));
        }
        return $out;
    }

    /**
     * 安全 deepGet：'player.gold' 取值；不存在返回 default
     */
    public static function deepGet(array $arr, string $path, $default = null)
    {
        foreach (explode('.', $path) as $key) {
            if (!is_array($arr) || !array_key_exists($key, $arr)) {
                return $default;
            }
            $arr = $arr[$key];
        }
        return $arr;
    }
}
