<?php
declare(strict_types=1);

namespace App\Game;

/**
 * 玩家服务：属性计算、升级、入背包等纯函数
 *
 * 所有方法接收 player 数组（来自存档），返回更新后的 player 与可选的副产物（如升级日志）
 */
final class PlayerService
{
    /**
     * 基于装备/宝物/被动计算总属性
     */
    public static function computeStats(array $player): array
    {
        $stats = [
            'atk' => $player['atk'] ?? 10,
            'def' => $player['def'] ?? 5,
            'maxHp' => $player['maxHp'] ?? 100,
            'maxMp' => $player['maxMp'] ?? 50,
            'aspd' => $player['aspd'] ?? 1000,
            'crit' => $player['crit'] ?? 0,
            'critDmg' => $player['critDmg'] ?? 2,
            'vamp' => $player['vamp'] ?? 0,
            'expBonus' => 0.0,
            'goldBonus' => 0.0,
            'armorPenFlat' => 0,
            'armorPenPercent' => 0.0,
            // 抗性
            'earthRes'     => (float) ($player['earthRes'] ?? 0),
            'poisonRes'    => (float) ($player['poisonRes'] ?? 0),
            'lightningRes' => (float) ($player['lightningRes'] ?? 0),
            'voidRes'      => (float) ($player['voidRes'] ?? 0),
            'chaosRes'     => (float) ($player['chaosRes'] ?? 0),
            'fireRes'      => (float) ($player['fireRes'] ?? 0),
            'tenacity'     => (float) ($player['tenacity'] ?? 0),
        ];

        // 装备直接加成
        foreach ((array) ($player['equipments'] ?? []) as $slot => $item) {
            if (!is_array($item) || empty($item['id'])) continue;
            $def = Constants::findEquipment((string) $item['id']);
            if (!$def) continue;
            $mult = (float) ($item['attrMult'] ?? 1.0);
            $refine = (int) ($item['refine'] ?? 0);
            $refineMult = 1.0 + $refine * 0.10; // 每锻造等级 +10%（与 game.js 简化对齐）
            foreach (['atk', 'def', 'maxHp', 'aspd', 'spi', 'critDmg', 'vamp', 'expBonus', 'goldBonus', 'armorPenFlat', 'armorPenPercent'] as $key) {
                if (isset($def[$key])) {
                    $stats[$key] = ($stats[$key] ?? 0) + $def[$key] * $mult * $refineMult;
                }
            }
        }

        // 宝物加成
        foreach ((array) ($player['treasures'] ?? []) as $tid => $data) {
            if (!is_array($data) || empty($data['count'])) continue;
            $t = Constants::findTreasure((string) $tid);
            if (!$t || empty($t['stat'])) continue;
            $level = max(1, (int) ($data['level'] ?? 1));
            $bonus = $t['value'] * (1 + ($level - 1) * 0.5);
            $stats[$t['stat']] = ($stats[$t['stat']] ?? 0) + $bonus;
        }

        // 套装效果
        $stats = self::applySetBonus($player, $stats);

        // 抗性 cap 40%
        foreach (['earthRes','poisonRes','lightningRes','voidRes','chaosRes','fireRes','tenacity'] as $r) {
            if (isset($stats[$r])) $stats[$r] = min(0.40, $stats[$r]);
        }

        // 攻速上限：1 次/100ms = 10 次/秒
        if (isset($stats['aspd'])) {
            $stats['aspd'] = max(100, (int) $stats['aspd']); // ms 间隔
        }
        return $stats;
    }

    private static function applySetBonus(array $player, array $stats): array
    {
        $countBySet = [];
        foreach ((array) ($player['equipments'] ?? []) as $slot => $item) {
            if (!is_array($item) || empty($item['id'])) continue;
            $def = Constants::findEquipment((string) $item['id']);
            $setId = $def['setId'] ?? null;
            if (!$setId) continue;
            $countBySet[$setId] = ($countBySet[$setId] ?? 0) + 1;
        }
        $sets = Constants::allSets();
        foreach ($countBySet as $setId => $cnt) {
            $set = $sets[$setId] ?? null;
            if (!$set || $cnt < count($set['slots'] ?? [])) continue;
            foreach (($set['bonus'] ?? []) as $k => $v) {
                if (str_ends_with($k, 'Mult')) {
                    $base = substr($k, 0, -4); // atkMult -> atk
                    if (isset($stats[$base])) $stats[$base] = $stats[$base] * (1 + $v);
                    continue;
                }
                $stats[$k] = ($stats[$k] ?? 0) + $v;
            }
        }
        return $stats;
    }

    /**
     * 经验入账并处理升级链
     */
    public static function gainExp(array $player, int $exp): array
    {
        $player['exp'] = (int) ($player['exp'] ?? 0) + $exp;
        while ($player['exp'] >= (int) ($player['maxExp'] ?? 100)) {
            $player = self::levelUp($player);
        }
        return $player;
    }

    public static function levelUp(array $player): array
    {
        $player['exp'] = (int) ($player['exp'] ?? 0) - (int) ($player['maxExp'] ?? 100);
        $player['level'] = (int) ($player['level'] ?? 1) + 1;
        $player['maxExp'] = (int) floor((int) $player['maxExp'] * 1.15);
        $player['maxHp'] = (int) ($player['maxHp'] ?? 100) + 30;
        $player['atk'] = (int) ($player['atk'] ?? 10) + 4;
        $player['def'] = (int) ($player['def'] ?? 5) + 2;
        $player['spi'] = (int) ($player['spi'] ?? 10) + 1;

        $player['maxMp'] = 50 + ($player['spi'] ?? 10) * 3 + ($player['level'] ?? 1) * 2;
        $player['hp'] = $player['maxHp'];
        $player['mp'] = $player['maxMp'];
        return $player;
    }

    public static function addEquipmentToBag(array $player, array $eqSnapshot): array
    {
        $player['equipmentBag'] = $player['equipmentBag'] ?? [];
        $player['equipmentBag'][] = $eqSnapshot;
        return $player;
    }

    public static function addTreasure(array $player, array $drop): array
    {
        // 兼容 'id' / 'treasureId' / 'tid' 三种 key 命名（不同掉落入口字段不统一）
        $tid = (string) ($drop['id'] ?? $drop['treasureId'] ?? $drop['tid'] ?? '');
        if ($tid === '') return $player;
        $current = $player['treasures'] ?? [];
        if (!is_array($current)) $current = [];
        if (!isset($current[$tid])) {
            $current[$tid] = ['count' => 0, 'level' => 1, 'locked' => false];
        }
        $current[$tid]['count']++;
        if (!empty($drop['level']) && $drop['level'] > ($current[$tid]['level'] ?? 1)) {
            $current[$tid]['level'] = (int) $drop['level'];
        }
        $player['treasures'] = $current;
        return $player;
    }

    public static function addSkillBook(array $player, array $drop): array
    {
        $bid = (string) $drop['id'];
        $current = $player['skillBooks'] ?? [];
        if (!is_array($current)) $current = [];
        if (!isset($current[$bid])) {
            $book = Constants::findSkillBook($bid);
            $current[$bid] = [
                'count' => 0,
                'appraised' => (bool) ($drop['appraised'] ?? false),
                'skillId' => $book['skillId'] ?? null,
            ];
        }
        $current[$bid]['count'] += (int) ($drop['count'] ?? 1);
        $player['skillBooks'] = $current;
        return $player;
    }

    public static function addItem(array $player, string $itemId, int $count = 1): array
    {
        $current = $player['items'] ?? [];
        if (!is_array($current)) $current = [];
        if (!isset($current[$itemId])) {
            $current[$itemId] = ['count' => 0];
        }
        $current[$itemId]['count'] += $count;
        $player['items'] = $current;
        return $player;
    }

    public static function addPassiveBook(array $player, array $book): array
    {
        $pid = (string) $book['id'];
        $passives = $player['passives'] ?? [];
        if (!is_array($passives)) $passives = [];
        if (isset($passives[$pid])) return $player; // 已学习，不重复
        $passives[$pid] = ['level' => 1];
        $player['passives'] = $passives;
        // 应用效果到玩家属性字段
        foreach (($book['effect'] ?? []) as $k => $v) {
            $player[$k] = ($player[$k] ?? 0) + $v;
        }
        return $player;
    }
}
