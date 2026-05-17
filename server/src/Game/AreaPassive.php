<?php
declare(strict_types=1);

namespace App\Game;

/**
 * 区域被动机制（与 js/game.js spawnEnemy 中 areaIndex >= 5 起的递进对齐）
 *
 *  areaIndex >= 5  burn         玩家被攻击后受 maxHp × 3% 火伤（受火抗减免）
 *  areaIndex >= 6  frost        霜冻（stub，前端也未具体实现）
 *  areaIndex >= 8  lifeSteal=0.12   敌人攻击吸血 12%
 *  areaIndex >= 9  thorns=0.08      敌人被攻击时荆棘反弹 8% 给玩家
 *  areaIndex >= 11 armorPen=0.15    敌人首次命中后标记玩家 armorPenDebuff
 *  areaIndex >= 12 curse        stub
 *  areaIndex >= 13 berserk      stub（不与 enemyType=berserker 冲突）
 *  areaIndex >= 14 revive       敌人额外一次复活（与 undead 共用 hasRevived 字段）
 */
final class AreaPassive
{
    public static function decorateSpawn(array $enemy, int $areaIndex): array
    {
        // 注意：不要覆盖已存在的 enemyType / debuffs 字段
        if ($areaIndex >= 5)  $enemy['burn']      = true;
        if ($areaIndex >= 6)  $enemy['frost']     = true;
        if ($areaIndex >= 8)  $enemy['lifeSteal'] = 0.12;
        if ($areaIndex >= 9)  $enemy['thorns']    = 0.08;
        if ($areaIndex >= 11) $enemy['armorPen']  = 0.15;
        if ($areaIndex >= 12) $enemy['curse']     = true;
        if ($areaIndex >= 13) $enemy['berserk']   = true;
        if ($areaIndex >= 14) $enemy['revive']    = true;
        return $enemy;
    }

    /**
     * 玩家普攻命中敌人时的"附带"机制：
     *   - 荆棘反伤：玩家受额外 thorns × damage 反伤
     *
     * @return array{player:array, log:array<int,array>}
     */
    public static function onPlayerHitEnemy(array $player, array $enemy, int $damageDealt): array
    {
        $log = [];
        $thorns = (float) ($enemy['thorns'] ?? 0);
        if ($thorns > 0 && $damageDealt > 0) {
            $reflect = (int) max(1, floor($damageDealt * $thorns));
            $player['hp'] = max(0, (int) ($player['hp'] ?? 0) - $reflect);
            $log[] = ['t' => 'area_thorns', 'dmg' => $reflect, 'player_hp' => $player['hp']];
        }
        return ['player' => $player, 'log' => $log];
    }

    /**
     * 敌人攻击玩家时的附带机制：lifeSteal / burn / armorPen
     *
     * @return array{player:array, enemy:array, log:array<int,array>}
     */
    public static function onEnemyHitPlayer(array $player, array $enemy, int $damageDealt, array $stats): array
    {
        $log = [];

        // 怪物吸血
        $ls = (float) ($enemy['lifeSteal'] ?? 0);
        if ($ls > 0 && $damageDealt > 0) {
            $heal = (int) floor($damageDealt * $ls);
            $enemy['hp'] = min((int) ($enemy['maxHp'] ?? 0), (int) ($enemy['hp'] ?? 0) + $heal);
            if ($heal > 0) $log[] = ['t' => 'area_lifesteal', 'heal' => $heal, 'enemy_hp' => $enemy['hp']];
        }

        // 燃烧：玩家受 maxHp × 3% 火伤，受火抗减免
        if (!empty($enemy['burn'])) {
            $fireRes = (float) ($stats['fireRes'] ?? 0);
            $burnDmg = (int) max(1, floor(($stats['maxHp'] ?? 100) * 0.03 * (1 - $fireRes)));
            $player['hp'] = max(0, (int) $player['hp'] - $burnDmg);
            $log[] = ['t' => 'area_burn', 'dmg' => $burnDmg, 'fireRes' => $fireRes, 'player_hp' => $player['hp']];
        }

        // 破甲：仅首次命中标记
        if (!empty($enemy['armorPen']) && empty($player['armorPenDebuff'])) {
            $player['armorPenDebuff'] = true;
            $log[] = ['t' => 'area_armorpen', 'source' => $enemy['name'] ?? null];
        }

        return ['player' => $player, 'enemy' => $enemy, 'log' => $log];
    }

    /**
     * 区域级复活：与 undead 复用 hasRevived 字段；revive flag 提供"区域级"加成
     *
     * @return array{enemy:array, revived:bool}
     */
    public static function tryAreaRevive(array $enemy): array
    {
        if (empty($enemy['revive']))                  return ['enemy' => $enemy, 'revived' => false];
        if (!empty($enemy['hasRevived']))             return ['enemy' => $enemy, 'revived' => false];
        if (($enemy['hp'] ?? 0) > 0)                  return ['enemy' => $enemy, 'revived' => false];
        $enemy['hasRevived'] = true;
        $enemy['hp'] = max(1, (int) floor(($enemy['maxHp'] ?? 1) * 0.30));
        return ['enemy' => $enemy, 'revived' => true];
    }
}
