<?php
declare(strict_types=1);

namespace App\Game\Npc;

use App\Http\HttpException;

/**
 * 精神修炼：花金币 +2 精神 + 6 maxMp（费用按等级递增）
 */
final class SpiritService
{
    public static function train(array $player): array
    {
        $level = (int) ($player['spiLevel'] ?? 0);
        // 与 game.js 一致：基础 150 × 1.18^level
        $cost = (int) floor(150 * pow(1.18, $level));
        if (($player['gold'] ?? 0) < $cost) {
            throw HttpException::badRequest('insufficient_gold', ['need' => $cost]);
        }
        $player['gold']    -= $cost;
        $player['spiLevel'] = $level + 1;
        $player['spi']      = (int) ($player['spi'] ?? 10) + 2;
        // 重算最大魔力
        $player['maxMp']    = 50 + ($player['spi']) * 3 + (int) ($player['level'] ?? 1) * 2;
        $player['mp']       = $player['maxMp'];
        return ['player' => $player, 'cost' => $cost, 'spi' => $player['spi']];
    }
}
