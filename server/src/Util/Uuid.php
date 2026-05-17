<?php
declare(strict_types=1);

namespace App\Util;

final class Uuid
{
    /**
     * 生成 RFC 4122 v4 UUID
     */
    public static function v4(): string
    {
        $data = random_bytes(16);
        $data[6] = chr((ord($data[6]) & 0x0f) | 0x40); // version 4
        $data[8] = chr((ord($data[8]) & 0x3f) | 0x80); // variant 10
        return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
    }

    /**
     * 验证 UUID 格式（v4 / 任意 v）
     */
    public static function isValid(string $candidate): bool
    {
        return (bool) preg_match(
            '/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i',
            $candidate
        );
    }
}
