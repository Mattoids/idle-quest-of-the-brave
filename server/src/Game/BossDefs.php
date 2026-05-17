<?php
declare(strict_types=1);

namespace App\Game;

/**
 * Boss 数据 & 战斗机制
 *
 * 与 js/game.js spawnBoss + enemyAttack 中 boss skills 触发逻辑对齐。
 *
 * 4 个 Boss（区域索引 → bossSkills）：
 *   3  遗迹守卫  petrify         (10s/2s)
 *   6  沼泽之主  poison_aura     (1s × 2% maxHp)
 *   9  天空领主  thunder_strike  (8s × 10% maxHp) + stun_chance (20% × 1s)
 *   14 混沌魔神  void_drain      (12s × 15% HP)
 *                chaos_purge     (15s 清 buffs)
 *                damage_reduce   (持续 -30% 玩家伤害)
 */
final class BossDefs
{
    /** areaIndex => { hpMult, atkMult, defMult, skills:[ ... ] } */
    public const SPEC = [
        3 => [
            'hpMult'  => 2.5,
            'atkMult' => 1.2,
            'defMult' => 1.5,
            'skills'  => [
                ['type' => 'petrify', 'interval' => 10000, 'duration' => 2000, 'lastCast' => 0],
            ],
        ],
        6 => [
            'hpMult'  => 2.5,
            'atkMult' => 1.0,
            'defMult' => 2.0,
            'skills'  => [
                ['type' => 'poison_aura', 'dps' => 0.02, 'interval' => 1000, 'lastCast' => 0],
            ],
        ],
        9 => [
            'hpMult'  => 3.0,
            'atkMult' => 1.5,
            'defMult' => 1.8,
            'skills'  => [
                ['type' => 'thunder_strike', 'damage' => 0.10, 'interval' => 8000, 'lastCast' => 0],
                ['type' => 'stun_chance',    'chance' => 0.20, 'duration' => 1000],
            ],
        ],
        14 => [
            'hpMult'  => 4.0,
            'atkMult' => 2.0,
            'defMult' => 2.5,
            'skills'  => [
                ['type' => 'void_drain',    'drain' => 0.15, 'interval' => 12000, 'lastCast' => 0],
                ['type' => 'chaos_purge',                    'interval' => 15000, 'lastCast' => 0],
                ['type' => 'damage_reduce', 'rate' => 0.30],
            ],
        ],
    ];

    /**
     * 生成 BOSS 敌人快照
     */
    public static function spawn(int $areaIndex): array
    {
        if (!isset(self::SPEC[$areaIndex])) {
            throw new \InvalidArgumentException("not a boss area: $areaIndex");
        }
        $spec = self::SPEC[$areaIndex];
        $area = Constants::AREAS[$areaIndex] ?? null;
        $cfg  = Constants::BOSS_CONFIG[$areaIndex] ?? null;
        if (!$area || !$cfg) {
            throw new \RuntimeException("boss config missing for area $areaIndex");
        }
        $mult      = (float) $area['multiplier'];
        $baseLevel = (int) $area['level'] + 5;
        $maxHp = (int) floor(60 * $baseLevel * $mult * $spec['hpMult']);
        $atk   = (int) floor(10 * $baseLevel * $mult * $spec['atkMult']);
        $def   = (int) floor( 4 * $baseLevel * $mult * $spec['defMult']);
        $exp   = (int) floor(30 * $baseLevel * $mult * 2);
        $gold  = (int) floor(15 * $baseLevel * $mult * 5);

        return [
            'name'       => $cfg['name'],
            'emoji'      => $cfg['emoji'],
            'level'      => $baseLevel,
            'isBoss'     => true,
            'isElite'    => false,
            'type'       => 'boss',
            'enemyType'  => 'boss',
            'maxHp'      => $maxHp,
            'hp'         => $maxHp,
            'atk'        => $atk,
            'def'        => $def,
            'exp'        => $exp,
            'gold'       => $gold,
            'aspd'       => 1000,
            'bossSkills' => $spec['skills'],
            'debuffs'    => [],
            'berserkActive' => false,
            'hasRevived'    => false,
        ];
    }
}
