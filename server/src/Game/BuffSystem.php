<?php
declare(strict_types=1);

namespace App\Game;

use App\Util\Random;

/**
 * Buff / Debuff 系统
 *
 * 数据结构：
 *   player.buffs   = { key => { type, endTime(ms), ...payload } }
 *   player.debuffs = { key => { type, endTime(ms), value, source, lastTickMs?, dotInterval? } }
 *   enemy.debuffs  = { key => { type, endTime(ms), value, source, lastTickMs?, dotInterval? } }
 *
 * 类型说明（与 game.js 对齐）：
 *   - burn   敌人持续受火伤   value = maxHp 百分比 / tick
 *   - poison 敌人/玩家持续受毒伤  同上
 *   - freeze 攻速减成（玩家或敌人）  value = 攻速降低比例
 *   - curse  攻击降成（敌人）    value = 攻击降低比例
 *   - weaken 防御降成（敌人）    value = 防御降低比例
 *   - bleed  玩家持续掉血        value = maxHp 百分比 / tick
 *   - silence 沉默（玩家无法施技能） value 忽略
 *
 * 计算抗性：debuff 抗性 = max(0, resistByAreaAndIsElite + bossExtra)。
 */
final class BuffSystem
{
    /* ---------------- 应用 ---------------- */

    /**
     * 给敌人施加 debuff
     */
    public static function applyEnemyDebuff(array $enemy, string $type, int $durationMs, float $value, string $source = ''): array
    {
        $enemy['debuffs'] = $enemy['debuffs'] ?? [];
        $now = self::nowMs();
        $key = $type;
        $existing = $enemy['debuffs'][$key] ?? null;
        $entry = [
            'type'     => $type,
            'endTime'  => $now + $durationMs,
            'value'    => $value,
            'source'   => $source,
        ];
        if (in_array($type, ['burn', 'poison'], true)) {
            $entry['lastTickMs'] = $now;
            $entry['dotInterval'] = 1000;
        }
        // 若已存在同 type，刷新到更长结束时间 + 最大 value
        if ($existing) {
            $entry['endTime'] = max($existing['endTime'] ?? 0, $entry['endTime']);
            $entry['value']   = max($existing['value']   ?? 0, $entry['value']);
        }
        $enemy['debuffs'][$key] = $entry;
        return $enemy;
    }

    /**
     * 给玩家施加 debuff（怪物攻击/区域被动等）
     */
    public static function applyPlayerDebuff(array $player, string $type, int $durationMs, float $value, string $source = ''): array
    {
        $player['debuffs'] = $player['debuffs'] ?? [];
        $now = self::nowMs();
        $entry = [
            'type'     => $type,
            'endTime'  => $now + $durationMs,
            'value'    => $value,
            'source'   => $source,
        ];
        if (in_array($type, ['poison', 'bleed', 'burn'], true)) {
            $entry['lastTickMs'] = $now;
            $entry['dotInterval'] = 1000;
        }
        $player['debuffs'][$type] = $entry;
        return $player;
    }

    /**
     * 玩家自身 buff（如护盾术）
     */
    public static function applyPlayerBuff(array $player, string $key, int $durationMs, array $payload): array
    {
        $player['buffs'] = $player['buffs'] ?? [];
        $payload['endTime'] = self::nowMs() + $durationMs;
        $player['buffs'][$key] = $payload;
        return $player;
    }

    /* ---------------- Tick：到期清理 + DOT ---------------- */

    /**
     * @return array{player:array, enemy:array, log:array<int,array>}
     */
    public static function tick(array $player, array $enemy, int $nowMs): array
    {
        $log = [];

        // 玩家 buffs 过期
        $buffs = $player['buffs'] ?? [];
        foreach ($buffs as $k => $b) {
            if (($b['endTime'] ?? 0) <= $nowMs) {
                unset($buffs[$k]);
                $log[] = ['t' => 'buff_expired', 'who' => 'player', 'key' => $k];
            }
        }
        $player['buffs'] = $buffs;

        // 玩家 debuffs：到期清理 + DOT
        [$player, $more] = self::tickEntity($player, 'debuffs', $nowMs, 'player');
        $log = array_merge($log, $more);

        // 敌人 debuffs
        [$enemy, $more] = self::tickEntity($enemy, 'debuffs', $nowMs, 'enemy');
        $log = array_merge($log, $more);

        return ['player' => $player, 'enemy' => $enemy, 'log' => $log];
    }

    /**
     * @return array{0:array, 1:array}
     */
    private static function tickEntity(array $entity, string $field, int $nowMs, string $whoLabel): array
    {
        $log = [];
        $maxHp = self::maxHpOf($entity);
        $list = $entity[$field] ?? [];

        foreach ($list as $k => $entry) {
            if (($entry['endTime'] ?? 0) <= $nowMs) {
                unset($list[$k]);
                $log[] = ['t' => 'debuff_expired', 'who' => $whoLabel, 'key' => $k];
                continue;
            }
            // DOT tick：burn/poison/bleed
            $interval = (int) ($entry['dotInterval'] ?? 0);
            if ($interval > 0) {
                $last = (int) ($entry['lastTickMs'] ?? 0);
                $ticks = (int) max(0, floor(($nowMs - $last) / $interval));
                if ($ticks > 0) {
                    $value = (float) ($entry['value'] ?? 0);
                    $damage = (int) max(1, round($maxHp * $value)) * $ticks;
                    $entity['hp'] = max(0, (int) ($entity['hp'] ?? 0) - $damage);
                    $entry['lastTickMs'] = $last + $ticks * $interval;
                    $list[$k] = $entry;
                    $log[] = [
                        't'     => 'dot_tick',
                        'who'   => $whoLabel,
                        'key'   => $k,
                        'ticks' => $ticks,
                        'dmg'   => $damage,
                        'hp'    => $entity['hp'],
                    ];
                }
            }
        }
        $entity[$field] = $list;
        return [$entity, $log];
    }

    /* ---------------- 状态查询 ---------------- */

    public static function isSilenced(array $player): bool
    {
        $d = ($player['debuffs'] ?? [])['silence'] ?? null;
        return $d && ($d['endTime'] ?? 0) > self::nowMs();
    }

    /**
     * 计算玩家 buff 对 stats 的修饰（叠加在 PlayerService::computeStats 之上）
     */
    public static function applyPlayerBuffsToStats(array $player, array $stats): array
    {
        $now = self::nowMs();
        foreach ($player['buffs'] ?? [] as $b) {
            if (($b['endTime'] ?? 0) <= $now) continue;
            // shield: def 加成
            if (!empty($b['defBonus']))   $stats['def']   = ($stats['def']   ?? 0) + $b['defBonus'];
            if (!empty($b['atkMult']))    $stats['atk']   = ($stats['atk']   ?? 0) * (1 + $b['atkMult']);
            if (!empty($b['defMult']))    $stats['def']   = ($stats['def']   ?? 0) * (1 + $b['defMult']);
            if (!empty($b['aspdMult']))   $stats['aspd']  = max(100, (int) (($stats['aspd'] ?? 1000) / (1 + $b['aspdMult'])));
            if (!empty($b['expBonus']))   $stats['expBonus']  = ($stats['expBonus']  ?? 0) + $b['expBonus'];
            if (!empty($b['goldBonus']))  $stats['goldBonus'] = ($stats['goldBonus'] ?? 0) + $b['goldBonus'];
        }

        // 玩家 debuff：影响攻速 / 攻 / 防
        foreach ($player['debuffs'] ?? [] as $d) {
            if (($d['endTime'] ?? 0) <= $now) continue;
            $val = (float) ($d['value'] ?? 0);
            switch ($d['type'] ?? '') {
                case 'freeze':  $stats['aspd']  = (int) min(2000, ($stats['aspd'] ?? 1000) * (1 + $val)); break;
                case 'curse':   $stats['atk']   = max(1, ($stats['atk'] ?? 0) * (1 - $val)); break;
                case 'weaken':  $stats['def']   = max(0, ($stats['def'] ?? 0) * (1 - $val)); break;
            }
        }
        return $stats;
    }

    /**
     * 计算敌人 debuff 对其有效攻/防/攻速的修饰
     */
    public static function applyEnemyDebuffsToStats(array $enemy): array
    {
        $now = self::nowMs();
        $atk = (float) ($enemy['atk'] ?? 0);
        $def = (float) ($enemy['def'] ?? 0);
        $aspd = (float) ($enemy['aspd'] ?? 1000);
        foreach ($enemy['debuffs'] ?? [] as $d) {
            if (($d['endTime'] ?? 0) <= $now) continue;
            $val = (float) ($d['value'] ?? 0);
            switch ($d['type'] ?? '') {
                case 'curse':   $atk  = max(1, $atk * (1 - $val)); break;
                case 'weaken':  $def  = max(0, $def * (1 - $val)); break;
                case 'freeze':  $aspd = (int) min(3000, $aspd * (1 + $val)); break;
            }
        }
        return [
            'atk' => (int) round($atk),
            'def' => (int) round($def),
            'aspd' => (int) round($aspd),
        ];
    }

    /* ---------------- helpers ---------------- */

    public static function nowMs(): int
    {
        return (int) (microtime(true) * 1000);
    }

    private static function maxHpOf(array $entity): int
    {
        return (int) ($entity['maxHp'] ?? $entity['hp'] ?? 100);
    }

    /**
     * debuff 命中判定：基础概率 + 等级差 - 抗性
     */
    public static function rollDebuffHit(float $baseChance, int $playerLevel, int $enemyLevel, float $enemyResist): bool
    {
        $diff = ($playerLevel - $enemyLevel) * 0.02;
        $p = max(0.05, min(0.95, $baseChance + $diff - $enemyResist));
        return Random::chance($p);
    }
}
