<?php
declare(strict_types=1);

namespace App\Game;

/**
 * 离线挂机补偿
 *
 * 触发点：玩家从主城点击"领取离线收益"时调用
 *
 * 算法（保守取估）：
 *   offlineMs = now - lastBattleEndTime（上限 24 小时）
 *   kills = min(MAX_KILLS, offlineMs / kill_interval)
 *     - kill_interval = max(2000, 5000 - player.level * 20)   // 等级越高每只越快
 *   per_kill_exp  = base_exp(area)  × (1 + expBonus)
 *   per_kill_gold = base_gold(area) × (1 + goldBonus)
 *   离线挂机不掉装备/宝物/技能书（避免刷神器）
 */
final class OfflineService
{
    public const MAX_OFFLINE_HOURS = 24;
    public const MAX_KILLS         = 5000;

    /**
     * @return array{rewards:array, save:array}
     */
    public static function claim(array $save): array
    {
        $now    = time() * 1000;
        $last   = (int) ($save['world']['lastBattleEndTime'] ?? 0);
        if ($last <= 0) {
            return ['rewards' => ['exp' => 0, 'gold' => 0, 'kills' => 0, 'offline_ms' => 0], 'save' => $save];
        }
        $cap    = self::MAX_OFFLINE_HOURS * 3600 * 1000;
        $offset = max(0, min($cap, $now - $last));
        if ($offset < 60_000) { // 不足 1 分钟
            return ['rewards' => ['exp' => 0, 'gold' => 0, 'kills' => 0, 'offline_ms' => $offset], 'save' => $save];
        }

        $player    = $save['player'];
        $level     = (int) ($player['level'] ?? 1);
        $stats     = PlayerService::computeStats($player);
        $area      = (int) ($save['world']['currentArea'] ?? 0);
        $area      = max(0, min(14, $area)); // 无尽模式按 14 算（保守）

        $interval  = max(2000, 5000 - $level * 20);
        $kills     = (int) min(self::MAX_KILLS, floor($offset / $interval));
        if ($kills <= 0) {
            $save['world']['lastBattleEndTime'] = $now;
            return ['rewards' => ['exp' => 0, 'gold' => 0, 'kills' => 0, 'offline_ms' => $offset], 'save' => $save];
        }

        $mult     = Constants::AREAS[$area]['multiplier'] ?? 1.0;
        $baseLv   = Constants::AREAS[$area]['level'] ?? 1;
        $baseExp  = (int) floor(30 * $baseLv * $mult * 0.4);
        $baseGold = (int) floor(15 * $baseLv * $mult * 1.0);

        $totalExp  = (int) floor($baseExp  * $kills * (1 + ($stats['expBonus']  ?? 0)));
        $totalGold = (int) floor($baseGold * $kills * (1 + ($stats['goldBonus'] ?? 0)));

        $save['player'] = PlayerService::gainExp($save['player'], $totalExp);
        $save['player']['gold']  = (int) ($save['player']['gold']  ?? 0) + $totalGold;
        $save['player']['kills'] = (int) ($save['player']['kills'] ?? 0) + $kills;

        $save['world']['lastBattleEndTime'] = $now;

        return [
            'rewards' => [
                'exp'        => $totalExp,
                'gold'       => $totalGold,
                'kills'      => $kills,
                'offline_ms' => $offset,
                'interval'   => $interval,
                'capped'     => $kills >= self::MAX_KILLS,
            ],
            'save'    => $save,
        ];
    }
}
