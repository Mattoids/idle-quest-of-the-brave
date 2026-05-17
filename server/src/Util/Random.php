<?php
declare(strict_types=1);

namespace App\Util;

/**
 * 服务端权威随机：所有爆率/掉落计算必须经过这里，不接受前端 seed
 */
final class Random
{
    /**
     * 0~1 之间均匀分布的随机浮点数
     */
    public static function float(): float
    {
        // random_int 是 CSPRNG，足够安全
        return random_int(0, PHP_INT_MAX) / PHP_INT_MAX;
    }

    public static function int(int $min, int $max): int
    {
        if ($min > $max) {
            throw new \InvalidArgumentException('min > max');
        }
        return random_int($min, $max);
    }

    /**
     * 概率为 $p 的命中
     */
    public static function chance(float $p): bool
    {
        if ($p <= 0) return false;
        if ($p >= 1) return true;
        return self::float() < $p;
    }

    /**
     * 加权抽签
     *
     * @param array<int|string, int|float> $weights key => weight
     * @return int|string 选中的 key
     */
    public static function weighted(array $weights)
    {
        $total = 0.0;
        foreach ($weights as $w) {
            if ($w > 0) $total += $w;
        }
        if ($total <= 0) {
            throw new \InvalidArgumentException('all weights are zero');
        }
        $roll = self::float() * $total;
        foreach ($weights as $key => $w) {
            if ($w <= 0) continue;
            $roll -= $w;
            if ($roll <= 0) {
                return $key;
            }
        }
        // 浮点误差兜底，返回最后一个非零
        $lastKey = null;
        foreach ($weights as $k => $w) {
            if ($w > 0) $lastKey = $k;
        }
        return $lastKey;
    }

    /**
     * 从数组随机取一项
     */
    public static function pick(array $list)
    {
        if (empty($list)) {
            throw new \InvalidArgumentException('empty array');
        }
        return $list[array_rand($list)];
    }

    /**
     * 生成可读的恢复码：A-Z 数字 0-9，无易混字符
     */
    public static function recoveryCode(int $length = 24): string
    {
        // 去掉 0/O/1/I/L 等易混
        $alphabet = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
        $alen = strlen($alphabet);
        $out = '';
        for ($i = 0; $i < $length; $i++) {
            $out .= $alphabet[random_int(0, $alen - 1)];
            if ($i % 4 === 3 && $i !== $length - 1) {
                $out .= '-';
            }
        }
        return $out;
    }
}
