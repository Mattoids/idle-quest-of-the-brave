<?php
declare(strict_types=1);

namespace App\Game;

use App\Util\Random;

/**
 * BOSS 技能触发器
 *
 * 调用入口：每次 swing/skill/tick 之前调 `tickBossSkills($player, $enemy, $stats)`
 * 服务端按 wall-clock 比较 lastCast + interval 触发 boss 技能。
 *
 * 反制状态在 SkillEngine.cast 中写入 player.counterState，由本类消费：
 *   voidShield      ✨ 圣光 → 抵消下一次 void_drain
 *   chaosReflux     🌑 暗   → 下次 chaos_purge 反弹给 BOSS
 *   stunImmune      🗿 雷   → 雷克土：50% 概率打断石化（在 SkillEngine 里直接重置 lastCast）
 *   poisonSuspendUntil  🔥 火 → 抑制毒雾光环到该时间戳
 *   thunderCdReset  ❄️ 冰  → 重置 thunder_strike 的 lastCast
 */
final class BossSkillEngine
{
    /**
     * 触发本 tick 内到 CD 的 BOSS 技能
     *
     * @return array{player:array, enemy:array, log:array<int,array>}
     */
    public static function tick(array $player, array $enemy, array $stats): array
    {
        $log = [];
        if (empty($enemy['isBoss']) || empty($enemy['bossSkills'])) {
            return ['player' => $player, 'enemy' => $enemy, 'log' => $log];
        }
        $now = BuffSystem::nowMs();
        $player['counterState'] = $player['counterState'] ?? [];

        foreach ($enemy['bossSkills'] as &$skill) {
            $type = (string) ($skill['type'] ?? '');
            // damage_reduce / stun_chance 是被动型，无需 tick
            if ($type === 'damage_reduce' || $type === 'stun_chance') continue;

            $interval = (int) ($skill['interval'] ?? 0);
            if ($interval <= 0) continue;

            $lastCast = (int) ($skill['lastCast'] ?? 0);
            if ($now - $lastCast < $interval) continue;

            switch ($type) {
                case 'petrify':
                    // 玩家被反制：雷克土在 SkillEngine 内已将 lastCast 设为 now，本帧不触发
                    $dur = (int) ($skill['duration'] ?? 2000);
                    $dur = (int) round($dur * (1 - ($stats['earthRes'] ?? 0)) * (1 - ($stats['tenacity'] ?? 0)));
                    // 霸体免疫
                    $immune = (int) ($player['counterState']['stunImmune'] ?? 0);
                    if ($immune > $now) {
                        $log[] = ['t' => 'boss_petrify_immune', 'src' => 'tenacity_aegis'];
                    } else {
                        $player['stunnedUntil'] = $now + $dur;
                        $player['counterState']['stunImmune'] = $now + $dur + 3000; // 霸体 3s
                        $log[] = ['t' => 'boss_petrify', 'dur' => $dur, 'earthRes' => $stats['earthRes'] ?? 0];
                    }
                    $skill['lastCast'] = $now;
                    break;

                case 'thunder_strike': {
                    $dmg = (int) floor(($stats['maxHp'] ?? 100) * ($skill['damage'] ?? 0.10) * (1 - ($stats['lightningRes'] ?? 0)));
                    $player['hp'] = max(0, (int) $player['hp'] - $dmg);
                    $log[] = ['t' => 'boss_thunder', 'dmg' => $dmg, 'lightningRes' => $stats['lightningRes'] ?? 0, 'player_hp' => $player['hp']];
                    $skill['lastCast'] = $now;
                    break;
                }

                case 'void_drain': {
                    if (!empty($player['counterState']['voidShield'])) {
                        $player['counterState']['voidShield'] = false;
                        $log[] = ['t' => 'boss_void_shielded'];
                    } else {
                        $drain = (int) floor(($player['hp'] ?? 0) * ($skill['drain'] ?? 0.15) * (1 - ($stats['voidRes'] ?? 0)));
                        $player['hp'] = max(0, (int) $player['hp'] - $drain);
                        $enemy['hp']  = min((int) $enemy['maxHp'], (int) $enemy['hp'] + $drain);
                        $log[] = ['t' => 'boss_void_drain', 'amount' => $drain, 'voidRes' => $stats['voidRes'] ?? 0, 'player_hp' => $player['hp'], 'enemy_hp' => $enemy['hp']];
                    }
                    $skill['lastCast'] = $now;
                    break;
                }

                case 'poison_aura': {
                    // 火克毒抑制
                    $suspendUntil = (int) ($player['counterState']['poisonSuspendUntil'] ?? 0);
                    if ($suspendUntil > $now) {
                        $skill['lastCast'] = $now;
                        break;
                    }
                    $dmg = (int) floor(($stats['maxHp'] ?? 100) * ($skill['dps'] ?? 0.02) * (1 - ($stats['poisonRes'] ?? 0)));
                    $player['hp'] = max(0, (int) $player['hp'] - $dmg);
                    $log[] = ['t' => 'boss_poison_aura', 'dmg' => $dmg, 'poisonRes' => $stats['poisonRes'] ?? 0, 'player_hp' => $player['hp']];
                    $skill['lastCast'] = $now;
                    break;
                }

                case 'chaos_purge': {
                    if (!empty($player['counterState']['chaosReflux'])) {
                        $player['counterState']['chaosReflux'] = false;
                        // 反弹：清掉 BOSS 自己身上的 buffs（如有）+ 不清玩家
                        $enemy['debuffs'] = $enemy['debuffs'] ?? [];
                        $log[] = ['t' => 'boss_chaos_reflux'];
                    } elseif (Random::chance((float) ($stats['chaosRes'] ?? 0))) {
                        $log[] = ['t' => 'boss_chaos_resisted', 'chaosRes' => $stats['chaosRes'] ?? 0];
                    } else {
                        $player['buffs'] = [];
                        $log[] = ['t' => 'boss_chaos_purge'];
                    }
                    $skill['lastCast'] = $now;
                    break;
                }
            }
        }
        unset($skill);

        return ['player' => $player, 'enemy' => $enemy, 'log' => $log];
    }

    /**
     * 是否处于眩晕中（普攻/技能被阻断）
     */
    public static function isStunned(array $player): bool
    {
        $now = BuffSystem::nowMs();
        return (int) ($player['stunnedUntil'] ?? 0) > $now;
    }

    /**
     * BOSS damage_reduce 倍率（对玩家伤害做衰减）
     */
    public static function damageReduceMult(array $enemy): float
    {
        if (empty($enemy['isBoss']) || empty($enemy['bossSkills'])) return 1.0;
        foreach ($enemy['bossSkills'] as $s) {
            if (($s['type'] ?? '') === 'damage_reduce') {
                return max(0.1, 1.0 - (float) ($s['rate'] ?? 0));
            }
        }
        return 1.0;
    }

    /**
     * stun_chance：BOSS 物理攻击 20% 概率 + 1s 眩晕
     */
    public static function tryStunChance(array $player, array $enemy): array
    {
        if (empty($enemy['isBoss']) || empty($enemy['bossSkills'])) {
            return ['player' => $player, 'stunned' => false];
        }
        foreach ($enemy['bossSkills'] as $s) {
            if (($s['type'] ?? '') !== 'stun_chance') continue;
            if (!Random::chance((float) ($s['chance'] ?? 0))) continue;
            $now = BuffSystem::nowMs();
            $immune = (int) ($player['counterState']['stunImmune'] ?? 0);
            if ($immune > $now) {
                return ['player' => $player, 'stunned' => false];
            }
            $dur = (int) ($s['duration'] ?? 1000);
            $player['stunnedUntil'] = $now + $dur;
            return ['player' => $player, 'stunned' => true, 'dur' => $dur];
        }
        return ['player' => $player, 'stunned' => false];
    }
}
