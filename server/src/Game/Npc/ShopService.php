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

        for ($i = 0; $i < $count; $i++) {
            switch ($type) {
                case 'heal':
                    $heal = (int) floor(($player['maxHp'] ?? 100) * ((float) $val));
                    $player['hp'] = min((int) ($player['maxHp'] ?? 100), (int) $player['hp'] + $heal);
                    $log[] = ['t' => 'heal', 'amount' => $heal];
                    break;
                case 'heal_full':
                    $player['hp'] = (int) ($player['maxHp'] ?? 100);
                    $player['mp'] = (int) ($player['maxMp'] ?? 50);
                    $log[] = ['t' => 'heal_full'];
                    break;
                case 'mp':
                    $heal = (int) floor(($player['maxMp'] ?? 50) * ((float) $val));
                    $player['mp'] = min((int) ($player['maxMp'] ?? 50), (int) $player['mp'] + $heal);
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

    private static function priceOf(array $item, int $level): int
    {
        return (int) floor(((int) $item['basePrice']) * (1 + ($level - 1) * 0.1));
    }
}
