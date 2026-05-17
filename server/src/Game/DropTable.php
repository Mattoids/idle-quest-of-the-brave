<?php
declare(strict_types=1);

namespace App\Game;

use App\Util\Random;

/**
 * 掉落表：权威爆率与稀有度抽签
 *
 * - 所有 random 均走 App\Util\Random（CSPRNG，不接受客户端 seed）
 * - 区域 / 无尽层数对应不同的稀有度权重，与 js/game.js 中 getAreaRarityWeights / getEndlessRarityWeights 对齐
 * - 返回的 drop 仅给出 itemId/装备 snapshot，BattleEngine 与 PlayerService 负责入背包
 */
final class DropTable
{
    /**
     * 普通区域稀有度权重
     */
    public static function areaRarityWeights(int $areaIndex): array
    {
        // 区域 0..14：低区偏 common，高区偏 epic/legendary
        $progress = max(0.0, min(1.0, $areaIndex / 14.0));
        return [
            'common'    => (int) round(55 * (1.0 - $progress * 0.7)),
            'rare'      => 30,
            'epic'      => (int) round(12 + $progress * 18),
            'legendary' => (int) round(3 + $progress * 12),
            'divine'    => 0,
        ];
    }

    /**
     * 无尽模式稀有度权重（层数越深，divine 概率越大）
     */
    public static function endlessRarityWeights(int $layer): array
    {
        $layer = max(1, $layer);
        return [
            'common'    => max(0, 20 - $layer),
            'rare'      => 25,
            'epic'      => 25,
            'legendary' => (int) min(40, 15 + $layer),
            'divine'    => (int) min(15, 1 + $layer * 0.2),
        ];
    }

    /**
     * 区域基础宝物掉率（含无尽加成）
     */
    public static function areaDropRate(int $areaIndex): float
    {
        if ($areaIndex >= 15) {
            return 0.25; // 无尽统一 25%
        }
        return Constants::AREA_DROP_RATES[$areaIndex] ?? 0.0;
    }

    public static function equipmentDropRate(int $areaIndex): float
    {
        if ($areaIndex >= 15) {
            $rates = Constants::EQUIPMENT_DROP_RATES;
            $base = $rates[count($rates) - 1];
            return (float) min(0.50, $base * 1.5);
        }
        return Constants::EQUIPMENT_DROP_RATES[$areaIndex] ?? 0.0;
    }

    public static function skillBookDropRate(int $areaIndex): float
    {
        if ($areaIndex >= 15) {
            $rates = Constants::SKILL_BOOK_DROP_RATES;
            $base = $rates[count($rates) - 1];
            return (float) min(0.20, $base * 2.0);
        }
        return Constants::SKILL_BOOK_DROP_RATES[$areaIndex] ?? 0.0;
    }

    /**
     * 选择稀有度（按权重）
     */
    public static function rollRarity(array $weights, ?string $minRarity = null): string
    {
        if ($minRarity !== null && isset(Constants::RARITY_ORDER[$minRarity])) {
            $threshold = Constants::RARITY_ORDER[$minRarity];
            foreach ($weights as $r => $w) {
                if ((Constants::RARITY_ORDER[$r] ?? 0) < $threshold) {
                    $weights[$r] = 0;
                }
            }
        }
        $rarity = Random::weighted($weights);
        return is_string($rarity) ? $rarity : 'common';
    }

    /**
     * 抽取一件装备（按 area + rarity 过滤）
     *
     * @return array|null 装备 snapshot（带 level/appraised/attrMult），失败返回 null
     */
    public static function rollEquipmentDrop(int $areaIndex, ?string $minRarity = null): ?array
    {
        $weights = $areaIndex >= 15
            ? self::endlessRarityWeights($areaIndex - 14)
            : self::areaRarityWeights($areaIndex);
        $rarity = self::rollRarity($weights, $minRarity);

        $pool = array_values(array_filter(
            Constants::equipment(),
            fn($e) => ($e['rarity'] ?? '') === $rarity
        ));
        if (empty($pool)) {
            return null;
        }
        $eq = $pool[Random::int(0, count($pool) - 1)];

        // 浮动属性（与铁匠打造保持一致：50%-120% 浮动，神器不浮动）
        $attrMult = $rarity === 'divine' ? 1.0 : round(0.5 + Random::float() * 0.7, 2);

        return [
            'id' => $eq['id'],
            'level' => 1,
            'appraised' => false,
            'refine' => 0,
            'attrMult' => $attrMult,
        ];
    }

    /**
     * 抽取一件宝物
     */
    public static function rollTreasureDrop(int $areaIndex, ?string $minRarity = null, bool $allowDivine = false): ?array
    {
        $rate = self::areaDropRate($areaIndex);
        if (!Random::chance($rate)) {
            return null;
        }
        $weights = $areaIndex >= 15
            ? self::endlessRarityWeights($areaIndex - 14)
            : self::areaRarityWeights($areaIndex);

        if (!$allowDivine) {
            $weights['divine'] = 0;
        }

        $rarity = self::rollRarity($weights, $minRarity);
        $pool = array_values(array_filter(
            Constants::treasures(),
            fn($t) => ($t['rarity'] ?? '') === $rarity
        ));
        if (empty($pool)) return null;
        $t = $pool[Random::int(0, count($pool) - 1)];
        return [
            'id'    => $t['id'],
            'level' => 1,
        ];
    }

    /**
     * 抽取一本技能书
     */
    public static function rollSkillBookDrop(int $areaIndex, bool $allowForbidden = false): ?array
    {
        $rate = self::skillBookDropRate($areaIndex);
        if (!Random::chance($rate)) {
            return null;
        }
        $books = Constants::skillBooks();
        if (!$allowForbidden) {
            $books = array_values(array_filter($books, fn($b) => ($b['id'] ?? '') !== 'book_void_annihilation'));
        }
        if (empty($books)) return null;
        $b = $books[Random::int(0, count($books) - 1)];
        return [
            'id'        => $b['id'],
            'appraised' => false,
            'count'     => 1,
        ];
    }

    /**
     * BOSS 掉落被动技能书（超低概率）
     */
    public static function rollPassiveBookDrop(): ?array
    {
        if (!Random::chance(Constants::PASSIVE_BOOK_DROP_RATE)) return null;
        $pool = Constants::passiveBooks();
        if (empty($pool)) return null;
        return $pool[Random::int(0, count($pool) - 1)];
    }

    /**
     * 无尽模式普通小怪掉落"恢复/加成"道具
     */
    public static function rollEndlessNormalItem(int $layer): ?array
    {
        $rate = min(0.15, 0.05 + $layer * 0.002);
        if (!Random::chance($rate)) return null;
        $ids = ['endless_hp_potion', 'endless_mp_potion', 'phoenix_feather', 'battle_scroll', 'guardian_scroll', 'haste_scroll'];
        $pool = array_values(array_filter(
            Constants::shopItems(),
            fn($i) => in_array($i['id'] ?? '', $ids, true)
        ));
        if (empty($pool)) return null;
        $i = $pool[Random::int(0, count($pool) - 1)];
        return ['id' => $i['id'], 'count' => 1];
    }

    /**
     * 精英怪掉落强化石/精英核心
     */
    public static function rollEliteSpecial(): array
    {
        $drops = [];
        if (Random::chance(0.10)) {
            $drops[] = ['id' => 'elite_core', 'count' => 1];
        }
        if (Random::chance(0.30)) {
            $drops[] = ['id' => 'enhance_stone', 'count' => 1];
        }
        return $drops;
    }

    /**
     * BOSS 强化石
     */
    public static function rollBossEnhanceStone(): ?array
    {
        if (!Random::chance(0.50)) return null;
        return ['id' => 'enhance_stone', 'count' => Random::int(1, 2)];
    }
}
