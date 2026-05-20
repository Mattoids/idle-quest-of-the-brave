<?php
declare(strict_types=1);

namespace App\Game\Npc;

use App\Game\BuffSystem;
use App\Game\Constants;
use App\Game\PlayerService;
use App\Http\HttpException;

/**
 * 商店：购买（非 dropOnly）+ 使用道具
 *
 * 购买价格 = basePrice × (1 + (玩家等级 - 1) × 0.1)
 *
 * 道具类型（与 SHOP_ITEMS 的 type 字段对齐）：
 *   heal / heal_full      → 恢复生命
 *   mp                    → 恢复魔力
 *   buff_exp / buff_atk / buff_def / buff_aspd / buff_exp_gold / buff_atk_aspd → 限时增益
 *   permanent_atk         → 永久 +atk
 *   permanent_all         → 永久多属性（atk/def/maxHp/spi）
 *   permanent_crit        → 永久 critDmg
 *   enhance_stone         → 强化石（仅持有，铁匠用）
 */
final class ShopService
{
    /**
     * 购买
     */
    public static function buy(array $player, string $itemId, int $count = 1): array
    {
        $item = Constants::findShopItem($itemId);
        if (!$item) throw HttpException::badRequest('invalid_item');
        if (!empty($item['dropOnly'])) {
            throw HttpException::forbidden('item_is_drop_only');
        }
        $count = max(1, $count);
        $unit  = self::priceOf($item, (int) ($player['level'] ?? 1));
        $total = $unit * $count;
        if (($player['gold'] ?? 0) < $total) {
            throw HttpException::badRequest('insufficient_gold', ['need' => $total]);
        }
        $player['gold'] -= $total;
        $player = PlayerService::addItem($player, $itemId, $count);
        return ['player' => $player, 'cost' => $total, 'unit_price' => $unit, 'count' => $count];
    }

    /**
     * 使用道具
     */
    public static function useItem(array $player, string $itemId, int $count = 1): array
    {
        $entry = ($player['items'] ?? [])[$itemId] ?? null;
        if (!$entry || ($entry['count'] ?? 0) < $count) {
            throw HttpException::badRequest('insufficient_item');
        }
        $def = Constants::findShopItem($itemId);
        if (!$def) throw HttpException::badRequest('invalid_item');

        $type = (string) ($def['type'] ?? '');
        $val  = $def['value'] ?? null;
        $log  = [];

        // hp/mp 上限要按装备/宝物/套装等合并后的 stats 计算，否则喝药水会被截到基础值
        $stats   = PlayerService::computeStats($player);
        $maxHp   = (int) ($stats['maxHp'] ?? ($player['maxHp'] ?? 100));
        $maxMp   = (int) ($stats['maxMp'] ?? ($player['maxMp'] ?? 50));

        for ($i = 0; $i < $count; $i++) {
            switch ($type) {
                case 'heal':
                    $heal = (int) floor($maxHp * ((float) $val));
                    $player['hp'] = min($maxHp, (int) $player['hp'] + $heal);
                    $log[] = ['t' => 'heal', 'amount' => $heal];
                    break;
                case 'heal_full':
                    $player['hp'] = $maxHp;
                    $player['mp'] = $maxMp;
                    $log[] = ['t' => 'heal_full'];
                    break;
                case 'mp':
                    $heal = (int) floor($maxMp * ((float) $val));
                    $player['mp'] = min($maxMp, (int) $player['mp'] + $heal);
                    $log[] = ['t' => 'mp', 'amount' => $heal];
                    break;
                case 'permanent_atk':
                    $player['atk'] = (int) ($player['atk'] ?? 0) + (int) $val;
                    $log[] = ['t' => 'perm_atk', 'amount' => $val];
                    break;
                case 'permanent_all':
                    foreach ((array) $val as $k => $v) {
                        $player[$k] = (int) ($player[$k] ?? 0) + (int) $v;
                    }
                    $log[] = ['t' => 'perm_all', 'gains' => $val];
                    break;
                case 'permanent_crit':
                    foreach ((array) $val as $k => $v) {
                        $player[$k] = ($player[$k] ?? 0) + (float) $v;
                    }
                    $log[] = ['t' => 'perm_crit', 'gains' => $val];
                    break;
                case 'buff_exp':
                    $player = BuffSystem::applyPlayerBuff($player, 'exp_scroll',  (int) ($def['duration'] ?? 600000), ['expBonus'  => (float) $val]);
                    $log[] = ['t' => 'buff', 'key' => 'exp_scroll'];
                    break;
                case 'buff_atk':
                    $player = BuffSystem::applyPlayerBuff($player, 'atk_stone',   (int) ($def['duration'] ?? 600000), ['atkMult'   => (float) $val]);
                    $log[] = ['t' => 'buff', 'key' => 'atk_stone'];
                    break;
                case 'buff_def':
                    $player = BuffSystem::applyPlayerBuff($player, 'def_stone',   (int) ($def['duration'] ?? 600000), ['defMult'   => (float) $val]);
                    $log[] = ['t' => 'buff', 'key' => 'def_stone'];
                    break;
                case 'buff_aspd':
                    $player = BuffSystem::applyPlayerBuff($player, 'haste',       (int) ($def['duration'] ?? 900000), ['aspdMult'  => (float) $val]);
                    $log[] = ['t' => 'buff', 'key' => 'haste'];
                    break;
                case 'buff_exp_gold':
                    $payload = ['expBonus' => (float) $val['expBonus'], 'goldBonus' => (float) $val['goldBonus']];
                    $player = BuffSystem::applyPlayerBuff($player, 'divine_blessing', (int) ($def['duration'] ?? 1800000), $payload);
                    $log[] = ['t' => 'buff', 'key' => 'divine_blessing'];
                    break;
                case 'buff_atk_aspd':
                    $payload = ['atkMult' => (float) $val['atkMult'], 'aspdMult' => (float) $val['aspdMult']];
                    $player = BuffSystem::applyPlayerBuff($player, 'annihilation', (int) ($def['duration'] ?? 1200000), $payload);
                    $log[] = ['t' => 'buff', 'key' => 'annihilation'];
                    break;
                case 'enhance_stone':
                    throw HttpException::badRequest('item_not_usable', ['hint' => 'use in blacksmith']);
                default:
                    throw HttpException::badRequest('unsupported_item_type', ['type' => $type]);
            }
        }

        // 扣除道具
        $entry['count'] -= $count;
        if ($entry['count'] <= 0) {
            unset($player['items'][$itemId]);
        } else {
            $player['items'][$itemId] = $entry;
        }
        return ['player' => $player, 'log' => $log];
    }

    /**
     * 出售物品（道具 / 装备 / 宝物 / 技能书）
     *
     * @param array  $player 玩家数据
     * @param string $type   物品类型：item | equipment | treasure | skillbook
     * @param string $target 目标标识：item_id | treasure_id | book_id（equipment 时用 bag_index）
     * @param int    $count  出售数量，默认全部（equipment 固定为 1）
     */
    public static function sell(array $player, string $type, string $target, int $count = 0): array
    {
        $totalGold = 0;
        $soldName  = '';
        $soldEmoji = '';

        switch ($type) {
            case 'item':
                $entry = ($player['items'] ?? [])[$target] ?? null;
                if (!$entry || ($entry['count'] ?? 0) <= 0) {
                    throw HttpException::badRequest('insufficient_item');
                }
                $def = Constants::findShopItem($target);
                if (!$def) throw HttpException::badRequest('invalid_item');
                $maxCount = $entry['count'];
                $sellCount = $count > 0 ? min($count, $maxCount) : $maxCount;
                $unitPrice = (int) floor(((int) ($def['basePrice'] ?? 0)) * 0.3);
                $totalGold = $unitPrice * $sellCount;
                $soldName  = (string) ($def['name'] ?? $target);
                $soldEmoji = (string) ($def['emoji'] ?? '');
                $entry['count'] -= $sellCount;
                if ($entry['count'] <= 0) {
                    unset($player['items'][$target]);
                } else {
                    $player['items'][$target] = $entry;
                }
                break;

            case 'equipment':
                $bag = $player['equipmentBag'] ?? [];
                $idx = (int) $target;
                if ($idx < 0 || $idx >= count($bag)) {
                    throw HttpException::badRequest('invalid_bag_index');
                }
                $eq = $bag[$idx];
                $eqDef = Constants::findEquipment($eq['id'] ?? '');
                if (!$eqDef) throw HttpException::badRequest('invalid_equipment');
                $totalGold = (int) ($eqDef['sellPrice'] ?? 0);
                $soldName  = (string) ($eqDef['name'] ?? '');
                $soldEmoji = (string) ($eqDef['emoji'] ?? '');
                array_splice($bag, $idx, 1);
                $player['equipmentBag'] = $bag;
                break;

            case 'treasure':
                $entry = ($player['treasures'] ?? [])[$target] ?? null;
                if (!$entry || ($entry['count'] ?? 0) <= 0) {
                    throw HttpException::badRequest('insufficient_item');
                }
                if (!empty($entry['locked'])) {
                    throw HttpException::forbidden('treasure_locked');
                }
                $def = Constants::findTreasure($target);
                if (!$def) throw HttpException::badRequest('invalid_treasure');
                $maxCount = $entry['count'];
                $sellCount = $count > 0 ? min($count, $maxCount) : $maxCount;
                $totalGold = ((int) ($def['sellPrice'] ?? 0)) * $sellCount;
                $soldName  = (string) ($def['name'] ?? '');
                $soldEmoji = (string) ($def['emoji'] ?? '');
                $entry['count'] -= $sellCount;
                if ($entry['count'] <= 0) {
                    unset($player['treasures'][$target]);
                } else {
                    $player['treasures'][$target] = $entry;
                }
                break;

            case 'skillbook':
                $entry = ($player['skillBooks'] ?? [])[$target] ?? null;
                if (!$entry || ($entry['count'] ?? 0) <= 0) {
                    throw HttpException::badRequest('insufficient_item');
                }
                $def = Constants::findSkillBook($target);
                if (!$def) throw HttpException::badRequest('invalid_skillbook');
                $maxCount = $entry['count'];
                $sellCount = $count > 0 ? min($count, $maxCount) : $maxCount;
                $totalGold = ((int) ($def['sellPrice'] ?? 0)) * $sellCount;
                $soldName  = (string) ($def['name'] ?? '');
                $soldEmoji = (string) ($def['emoji'] ?? '');
                $entry['count'] -= $sellCount;
                if ($entry['count'] <= 0) {
                    unset($player['skillBooks'][$target]);
                } else {
                    $player['skillBooks'][$target] = $entry;
                }
                break;

            default:
                throw HttpException::badRequest('unsupported_sell_type', ['type' => $type]);
        }

        $player['gold'] = ((int) ($player['gold'] ?? 0)) + $totalGold;

        return [
            'player'     => $player,
            'type'       => $type,
            'target'     => $target,
            'count'      => $sellCount ?? 1,
            'gold'       => $totalGold,
            'name'       => $soldName,
            'emoji'      => $soldEmoji,
        ];
    }

    private static function priceOf(array $item, int $level): int
    {
        return (int) floor(((int) $item['basePrice']) * (1 + ($level - 1) * 0.1));
    }
}
