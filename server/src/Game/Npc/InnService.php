<?php
declare(strict_types=1);

namespace App\Game\Npc;

use App\Http\HttpException;

/**
 * 客栈：完全恢复生命与魔力（战斗中不可用）
 */
final class InnService
{
    public static function rest(array $player, ?array $battle = null): array
    {
        if ($battle && !empty($battle['enemy']) && (int) ($battle['enemy']['hp'] ?? 0) > 0) {
            throw HttpException::conflict('cannot_rest_in_battle');
        }
        $player['hp'] = (int) ($player['maxHp'] ?? 100);
        $player['mp'] = (int) ($player['maxMp'] ?? 50);
        return ['player' => $player];
    }
}
