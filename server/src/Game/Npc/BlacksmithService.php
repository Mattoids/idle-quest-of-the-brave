<?php
declare(strict_types=1);

namespace App\Game\Npc;

use App\Game\Constants;
use App\Game\PlayerService;
use App\Http\HttpException;
use App\Util\Random;

/**
 * 铁匠：随机打造装备（与 game.js forgeEquipment 对齐）+ 锻造强化
 *
 * 打造规则：
 *   花费 = FORGE_BASE_COST × (1 + (玩家等级 - 1) × 0.15)
 *   品质权重按玩家等级动态：1+ common, 5+ rare, 15+ epic, 30+ legendary
 *   万分之一概率打造神器（divine）
 *   非神器属性 attrMult ∈ [0.5, 1.2] 随机；神器固定 1.0
 *   装备无需鉴定（appraised = true）
 *
 * 锻造规则：
 *   refine 等级 0 起，每级 +10% 属性（计算在 PlayerService::computeStats）
 *   花费 = eq.sellPrice × 0.5 × 1.5^refine
 *   基础成功率 = max(10, 100 - refine × 15)
 *   每个强化石 +5% 成功率，上限 100%
 *   失败：refine -1（0 时装备损毁）
 */
final class BlacksmithService
{
    /**
     * 打造一件随机装备
     *
     * @return array{player:array, equipment:array}
     */
    public static function forge(array $player): array
    {
        $level = (int) ($player['level'] ?? 1);
        $cost  = (int) floor(Constants::FORGE_BASE_COST * (1 + ($level - 1) * 0.15));
        if (($player['gold'] ?? 0) < $cost) {
            throw HttpException::badRequest('insufficient_gold', ['need' => $cost]);
        }
        $player['gold'] -= $cost;

        // 万分之一神器
        if (Random::chance(0.0001)) {
            $rarity = 'divine';
        } else {
            $weights = [
                'common' => max(10, 100 - $level * 3),
                'rare'   => $level >= 5  ? min(50, $level * 2)      : 0,
                'epic'   => $level >= 15 ? min(30, ($level - 10) * 1.5) : 0,
                'legendary' => $level >= 30 ? min(15, $level - 25)  : 0,
            ];
            $rarity = (string) Random::weighted($weights);
        }
        $pool = array_values(array_filter(Constants::equipment(), fn($e) => ($e['rarity'] ?? '') === $rarity));
        if (empty($pool)) throw HttpException::badRequest('forge_pool_empty', ['rarity' => $rarity]);
        $eqDef = $pool[Random::int(0, count($pool) - 1)];

        $attrMult = $rarity === 'divine' ? 1.0 : round(0.5 + Random::float() * 0.7, 2);
        $eq = [
            'id'        => $eqDef['id'],
            'level'     => 1,
            'appraised' => true,
            'refine'    => 0,
            'attrMult'  => $attrMult,
        ];
        $player = PlayerService::addEquipmentToBag($player, $eq);
        return ['player' => $player, 'equipment' => $eq, 'cost' => $cost];
    }

    /**
     * 锻造强化
     *
     * @return array{player:array, success:bool, refine:int}
     */
    public static function refine(array $player, int $bagIndex, int $useStones = 0): array
    {
        $bag = $player['equipmentBag'] ?? [];
        if ($bagIndex < 0 || $bagIndex >= count($bag)) {
            throw HttpException::badRequest('invalid_bag_index');
        }
        $item = $bag[$bagIndex];
        $eqDef = Constants::findEquipment((string) ($item['id'] ?? ''));
        if (!$eqDef) throw HttpException::badRequest('invalid_equipment');
        if (empty($item['appraised'])) throw HttpException::badRequest('not_appraised');

        $refine = (int) ($item['refine'] ?? 0);
        $cost   = (int) floor(($eqDef['sellPrice'] ?? 30) * 0.5 * pow(1.5, $refine));
        if (($player['gold'] ?? 0) < $cost) throw HttpException::badRequest('insufficient_gold', ['need' => $cost]);

        $stoneEntry = ($player['items'] ?? [])['enhance_stone'] ?? null;
        $stoneHave  = (int) ($stoneEntry['count'] ?? 0);
        $useStones  = max(0, min($useStones, $stoneHave));

        $baseRate = max(10, 100 - $refine * 15);
        $rate     = min(100, $baseRate + $useStones * 5);

        // 扣金币 + 强化石（不论成败均消耗）
        $player['gold'] -= $cost;
        if ($useStones > 0) {
            $stoneEntry['count'] -= $useStones;
            if ($stoneEntry['count'] <= 0) unset($player['items']['enhance_stone']);
            else $player['items']['enhance_stone'] = $stoneEntry;
        }

        $success = Random::chance($rate / 100);
        if ($success) {
            $bag[$bagIndex]['refine'] = $refine + 1;
        } else {
            if ($refine > 0) {
                $bag[$bagIndex]['refine'] = $refine - 1;
            } else {
                // refine 0 失败 → 装备损毁
                array_splice($bag, $bagIndex, 1);
            }
        }
        $player['equipmentBag'] = $bag;
        return [
            'player'  => $player,
            'success' => $success,
            'rate'    => $rate,
            'refine'  => $success ? $refine + 1 : max(0, $refine - 1),
            'destroyed' => !$success && $refine === 0,
            'cost'    => $cost,
            'stones'  => $useStones,
        ];
    }
}
