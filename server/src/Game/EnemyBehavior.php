<?php
declare(strict_types=1);

namespace App\Game;

use App\Util\Random;

/**
 * 怪物类型行为
 *
 * 与 js/game.js 中的怪物 type/区域被动机制对齐：
 *
 *  type        基础属性修饰              特殊行为
 *  ----        --------                  --------
 *  aggressive  atk ×1.15                 -
 *  tank        maxHp ×1.30               -
 *  fragile     atk ×1.30 / maxHp ×0.70  -
 *  vampiric    -                         攻击吸血 + 25% bleed
 *  pack        aspd=750ms (其他 900)     -
 *  mage        -                         25% weakness (curse)；天然抗所有魔法（已在 Elements 处理）
 *  undead      -                         死后复活 1 次到 30% maxHp + 25% fragile (weaken)
 *  poison      -                         25% poison DOT
 *  ethereal    -                         15% 闪避玩家攻击 + 25% slow (freeze)
 *  berserker   -                         hp/maxHp < 30% 时 atk ×1.5（一次性）+ 狂暴后 37.5% weakness
 *
 * 同时本类负责"敌人击中玩家时尝试施加 debuff"，包括精英/Boss 的额外 debuff。
 */
final class EnemyBehavior
{
    /**
     * 出生修饰（与 game.js spawnEnemy 中"怪物类型加成"对齐）
     */
    public static function decorateSpawn(array $enemy): array
    {
        $type = (string) ($enemy['type'] ?? '');
        $aspd = ($type === 'pack') ? 750 : 900;

        $maxHp = (int) ($enemy['maxHp'] ?? $enemy['hp'] ?? 50);
        $atk   = (int) ($enemy['atk'] ?? 1);

        switch ($type) {
            case 'aggressive':  $atk = (int) round($atk * 1.15); break;
            case 'tank':        $maxHp = (int) round($maxHp * 1.30); break;
            case 'fragile':     $atk = (int) round($atk * 1.30); $maxHp = (int) round($maxHp * 0.70); break;
            // 其他类型不修改基础属性，仅在 swing/被攻击时触发
        }

        $enemy['maxHp']    = max(1, $maxHp);
        $enemy['hp']       = max(1, $maxHp); // 满血出生
        $enemy['atk']      = max(1, $atk);
        $enemy['aspd']     = $aspd;
        $enemy['enemyType']    = $type;
        $enemy['berserkActive'] = false;
        $enemy['hasRevived']    = false;
        $enemy['debuffs']  = $enemy['debuffs'] ?? [];
        return $enemy;
    }

    /**
     * 玩家攻击命中前：ethereal 15% 闪避
     */
    public static function tryDodge(array $enemy): bool
    {
        if (($enemy['enemyType'] ?? '') !== 'ethereal') return false;
        return Random::chance(0.15);
    }

    /**
     * 敌人血量 < 30% 时一次性激活狂暴：atk ×1.5
     */
    public static function tryBerserk(array $enemy): array
    {
        if (($enemy['enemyType'] ?? '') !== 'berserker') return $enemy;
        if (!empty($enemy['berserkActive'])) return $enemy;
        if (($enemy['maxHp'] ?? 0) <= 0) return $enemy;
        if (($enemy['hp'] ?? 0) / max(1, $enemy['maxHp']) < 0.30) {
            $enemy['atk'] = (int) round(($enemy['atk'] ?? 1) * 1.5);
            $enemy['berserkActive'] = true;
        }
        return $enemy;
    }

    /**
     * undead 死亡复活：仅复活一次，hp = 30% maxHp
     *
     * @return array{enemy:array, revived:bool}
     */
    public static function tryRevive(array $enemy): array
    {
        if (($enemy['enemyType'] ?? '') !== 'undead') return ['enemy' => $enemy, 'revived' => false];
        if (!empty($enemy['hasRevived']))             return ['enemy' => $enemy, 'revived' => false];
        if (($enemy['hp'] ?? 0) > 0)                  return ['enemy' => $enemy, 'revived' => false];
        $enemy['hasRevived'] = true;
        $enemy['hp'] = max(1, (int) floor(($enemy['maxHp'] ?? 1) * 0.30));
        return ['enemy' => $enemy, 'revived' => true];
    }

    /**
     * vampiric 攻击吸血：返回敌人回血量（已就地更新）
     */
    public static function applyVampire(array $enemy, int $damageDealt): array
    {
        if (($enemy['enemyType'] ?? '') !== 'vampiric') return $enemy;
        $heal = (int) floor($damageDealt * 0.30);
        $enemy['hp'] = min((int) ($enemy['maxHp'] ?? 0), (int) ($enemy['hp'] ?? 0) + $heal);
        return $enemy;
    }

    /**
     * 敌人对玩家攻击命中时尝试施加 debuff
     *
     * @return array{player:array, log:array<int,array>}
     */
    public static function rollAttackDebuffs(array $player, array $enemy, int $areaIndex): array
    {
        $log = [];
        $tenacity = (float) ($player['tenacity'] ?? 0);
        $resist   = self::areaDebuffResist($areaIndex, !empty($enemy['isElite']), !empty($enemy['isBoss']));
        $baseChance = 0.25 * (1 - $tenacity);

        $tryApply = function (string $debuffKey, int $duration, float $value, float $chance) use (&$player, &$log, $resist, $enemy) {
            $eff = max(0.05, min(0.95, $chance * (1 - $resist)));
            if (Random::chance($eff)) {
                $player = BuffSystem::applyPlayerDebuff($player, $debuffKey, $duration, $value, (string) ($enemy['name'] ?? 'enemy'));
                $log[] = ['t' => 'enemy_debuff', 'type' => $debuffKey, 'value' => $value, 'src' => $enemy['name'] ?? null];
            }
        };

        $type = (string) ($enemy['enemyType'] ?? '');
        switch ($type) {
            case 'poison':    $tryApply('poison', 8000, 0.015, $baseChance); break;
            case 'vampiric':  $tryApply('bleed',  6000, 0.02,  $baseChance); break;
            case 'mage':      $tryApply('curse',  6000, 0.20,  $baseChance); break;
            case 'ethereal':  $tryApply('freeze', 5000, 0.25,  $baseChance); break;
            case 'undead':    $tryApply('weaken', 7000, 0.20,  $baseChance); break;
            case 'berserker':
                if (!empty($enemy['berserkActive'])) {
                    $tryApply('curse', 5000, 0.30, $baseChance * 1.5);
                }
                break;
        }

        // 精英 / Boss 额外 debuff
        if (!empty($enemy['isElite'])) {
            $elitePool = [
                ['curse',  0.25, 8000],
                ['freeze', 0.30, 8000],
                ['weaken', 0.25, 8000],
            ];
            $chance = 0.15 * (1 - $tenacity) * (1 - $resist);
            if (Random::chance($chance)) {
                $pick = $elitePool[Random::int(0, count($elitePool) - 1)];
                $tryApply($pick[0], (int) $pick[2], (float) $pick[1], 1.0);
            }
        }
        if (!empty($enemy['isBoss'])) {
            $bossPool = [
                ['curse',  0.35, 10000],
                ['freeze', 0.40,  8000],
                ['weaken', 0.35, 10000],
                ['silence',0.00,  5000],
            ];
            $chance = 0.20 * (1 - $tenacity) * (1 - $resist);
            if (Random::chance($chance)) {
                $pick = $bossPool[Random::int(0, count($bossPool) - 1)];
                $tryApply($pick[0], (int) $pick[2], (float) $pick[1], 1.0);
            }
        }
        return ['player' => $player, 'log' => $log];
    }

    /**
     * 区域 debuff 抗性（与 game.js getPlayerDebuffResist 对齐的近似）
     */
    public static function areaDebuffResist(int $areaIndex, bool $isElite = false, bool $isBoss = false): float
    {
        $base = 0;
        if ($areaIndex >= 15) {
            $base = min(0.40, 0.20 + ($areaIndex - 15) * 0.005);
        } else {
            $base = min(0.15, $areaIndex * 0.01);
        }
        if ($isBoss)  $base += 0.10;
        if ($isElite) $base += 0.05;
        return min(0.60, $base);
    }
}
