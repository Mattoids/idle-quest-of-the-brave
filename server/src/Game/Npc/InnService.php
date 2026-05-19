<?php
declare(strict_types=1);

namespace App\Game\Npc;

use App\Game\PlayerService;
use App\Http\HttpException;

/**
 * 客栈：完全恢复生命与魔力（战斗中不可用）
 *
 * hp/mp 封顶值需经过 computeStats（含装备/宝物/套装），否则休息后反而比战斗中还低。
 */
final class InnService
{
    public static function rest(array $player, ?array $battle = null): array
    {
        if ($battle && !empty($battle['enemy']) && (int) ($battle['enemy']['hp'] ?? 0) > 0) {
            throw HttpException::conflict('cannot_rest_in_battle');
        }
        $stats = PlayerService::computeStats($player);
        $player['hp'] = (int) ($stats['maxHp'] ?? ($player['maxHp'] ?? 100));
        $player['mp'] = (int) ($stats['maxMp'] ?? ($player['maxMp'] ?? 50));
        return ['player' => $player];
    }
}
