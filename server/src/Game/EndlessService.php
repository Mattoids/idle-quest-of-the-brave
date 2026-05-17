<?php
declare(strict_types=1);

namespace App\Game;

use App\Http\HttpException;
use App\Util\Random;

/**
 * 无尽模式
 *
 * 解锁条件：bossDefeated[14] = true
 *
 * 无尽规则（与 game.js 对齐）：
 *   - 击败一只敌人即进入下一层（currentArea++，从 15 起）
 *   - 怪物等级 = 100 + 2 × 层数；难度倍率 = 15.5 × 1.08^层数（已在 BattleEngine.spawnEnemy 中计算）
 *   - 每 5 层必出精英，每 10 层必出 BOSS
 *   - 精英/Boss 神器装备掉率最高 25%
 *   - 精英/Boss 超脱套装/无尽道具/禁咒书掉率最高 20%
 *   - 普通小怪 1% 概率掉落神器装备/宝物，并按层数掉落恢复/加成道具（已在 DropTable 中）
 */
final class EndlessService
{
    public const FIRST_LAYER_AREA = 15;

    public static function enter(array $save): array
    {
        if (empty($save['world']['bossDefeated'][14])) {
            throw HttpException::forbidden('endless_not_unlocked', ['hint' => 'defeat boss 14 first']);
        }
        $save['world']['currentArea']  = self::FIRST_LAYER_AREA;
        $save['world']['inCity']       = false;
        $save['world']['fightingBoss'] = false;
        return $save;
    }

    public static function layerOf(int $areaIndex): int
    {
        return max(1, $areaIndex - 14);
    }

    /**
     * 判断本层是否应该出 Boss / 精英（与 game.js 一致）
     *
     * @return array{isBoss:bool, isElite:bool}
     */
    public static function tierOfLayer(int $layer): array
    {
        $isBoss = $layer > 0 && $layer % 10 === 0;
        $isElite = !$isBoss && $layer > 0 && $layer % 5 === 0;
        return ['isBoss' => $isBoss, 'isElite' => $isElite];
    }

    /**
     * 无尽精英 / Boss 的特殊掉落
     *
     * @return array<int, array{type:string, payload:array, tag:string}>
     */
    public static function rollSpecialDrops(int $layer, array $enemy): array
    {
        $drops = [];
        if (empty($enemy['isElite']) && empty($enemy['isBoss'])) {
            return $drops;
        }

        // 神器装备：最高 25%（与 game.js: 0.08 + layer*0.003 上限 0.25）
        $divineRate = min(0.25, 0.08 + $layer * 0.003);
        if (Random::chance($divineRate)) {
            $pool = array_values(array_filter(Constants::equipment(), fn($e) => ($e['rarity'] ?? '') === 'divine'));
            if (!empty($pool)) {
                $e = $pool[Random::int(0, count($pool) - 1)];
                $drops[] = [
                    'type' => 'equipment',
                    'payload' => ['id' => $e['id'], 'level' => 1, 'appraised' => true, 'refine' => 0, 'attrMult' => 1.0],
                    'tag' => 'endless_divine',
                ];
            }
        }

        // 超脱套装：最高 20%（与 game.js: 0.03 + layer*0.002 上限 0.20）
        $transRate = min(0.20, 0.03 + $layer * 0.002);
        if (Random::chance($transRate)) {
            $transcendentSets = ['set_void_annihilator', 'set_eternal_throne'];
            $setId = $transcendentSets[Random::int(0, count($transcendentSets) - 1)];
            $pool = array_values(array_filter(Constants::equipment(), fn($e) => ($e['setId'] ?? null) === $setId));
            if (!empty($pool)) {
                $e = $pool[Random::int(0, count($pool) - 1)];
                $drops[] = [
                    'type' => 'equipment',
                    'payload' => ['id' => $e['id'], 'level' => 1, 'appraised' => true, 'refine' => 0, 'attrMult' => 1.0],
                    'tag' => 'endless_transcendent',
                ];
            }
        }

        // 无尽特有道具：最高 20%
        $itemRate = min(0.20, 0.05 + $layer * 0.002);
        if (Random::chance($itemRate)) {
            $ids = ['endless_core', 'divine_blessing', 'chaos_core', 'void_essence', 'annihilation_potion'];
            $id = $ids[Random::int(0, count($ids) - 1)];
            $drops[] = [
                'type' => 'item',
                'payload' => ['id' => $id, 'count' => 1],
                'tag' => 'endless_item',
            ];
        }

        // 禁咒技能书：最高 20%
        $forbRate = min(0.20, 0.03 + $layer * 0.002);
        if (Random::chance($forbRate)) {
            $drops[] = [
                'type' => 'skill_book',
                'payload' => ['id' => 'book_void_annihilation', 'appraised' => false, 'count' => 1],
                'tag' => 'endless_forbidden',
            ];
        }

        return $drops;
    }

    /**
     * 推进无尽层数（在敌人死亡后调用）
     */
    public static function advanceLayer(array $save, array $session): array
    {
        $cur = (int) ($save['world']['currentArea'] ?? self::FIRST_LAYER_AREA);
        $save['world']['currentArea'] = $cur + 1;
        return $save;
    }
}
