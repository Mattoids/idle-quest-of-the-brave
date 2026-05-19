<?php
declare(strict_types=1);

namespace App\Game;

use App\Http\HttpException;

/**
 * 技能引擎：施放、伤害公式、debuff 施加、元素克制
 *
 * 调用方式：
 *   [$player, $enemy, $log] = SkillEngine::cast($player, $enemy, $stats, 'fireball');
 *
 * 注意：调用前请确保 $stats 已包含 buff 修饰（PlayerService::computeStats + BuffSystem::applyPlayerBuffsToStats）
 */
final class SkillEngine
{
    /**
     * @param int|null $nowMs  覆盖时间戳，用于"批量战斗模拟"——每回合传 simulated time，让 cd 在批量内自然流逝
     * @return array{0:array, 1:array, 2:array<int,array>}
     */
    public static function cast(array $player, array $enemy, array $stats, string $skillId, ?int $nowMs = null): array
    {
        $skill = Constants::findSkill($skillId);
        if (!$skill) {
            throw HttpException::badRequest('skill_not_found');
        }
        $learned = ($player['skills'] ?? [])[$skillId] ?? null;
        if (!$learned) {
            throw HttpException::forbidden('skill_not_learned');
        }
        if (BuffSystem::isSilenced($player)) {
            throw HttpException::badRequest('silenced');
        }
        if (BossSkillEngine::isStunned($player)) {
            throw HttpException::badRequest('stunned');
        }

        $nowMs = $nowMs ?? BuffSystem::nowMs();
        $cdEnd = (int) ($learned['cooldownEnd'] ?? 0);
        if ($cdEnd > $nowMs) {
            throw HttpException::tooMany('skill_cooldown', ['remaining_ms' => $cdEnd - $nowMs]);
        }
        $mpCost = (int) $skill['mpCost'];
        if (($player['mp'] ?? 0) < $mpCost) {
            throw HttpException::badRequest('insufficient_mp', ['need' => $mpCost, 'have' => $player['mp'] ?? 0]);
        }

        // 消耗 mp + 设置冷却
        $player['mp'] = max(0, (int) $player['mp'] - $mpCost);
        $player['skills'][$skillId]['cooldownEnd'] = $nowMs + (int) $skill['cooldown'];

        $skillLevel = (int) ($learned['level'] ?? 1);
        $dmg = self::skillDamage($player, $stats, $skill, $skillLevel);

        $log = [];
        $type = (string) ($skill['type'] ?? 'damage');

        switch ($type) {
            case 'heal':
                $heal = (int) ($dmg + ($stats['maxHp'] ?? 100) * 0.15);
                $player['hp'] = min((int) $stats['maxHp'], (int) ($player['hp'] ?? 0) + $heal);
                $log[] = ['t' => 'skill_heal', 'id' => $skillId, 'heal' => $heal, 'hp' => $player['hp']];
                break;

            case 'buff':
                $buffDef = (int) ($dmg + ($stats['def'] ?? 0) * 0.3);
                $player = BuffSystem::applyPlayerBuff($player, 'shield', (int) ($skill['buffDuration'] ?? 10000), [
                    'type'     => 'shield',
                    'defBonus' => $buffDef,
                ]);
                $log[] = ['t' => 'skill_buff', 'id' => $skillId, 'defBonus' => $buffDef];
                break;

            case 'damage':
            case 'damage_lifesteal':
            case 'dot': {
                $element = (string) ($skill['element'] ?? 'physical');
                $mult = Elements::multiplier($element, (string) ($enemy['name'] ?? ''));
                $final = (int) floor($dmg * $mult);
                if (!empty($skill['ignoreDef'])) {
                    // 禁咒：无视防御，伤害直接计入（已通过 dmg 公式给出）
                }
                // BOSS damage_reduce 衰减玩家伤害
                $final = (int) floor($final * BossSkillEngine::damageReduceMult($enemy));
                $enemy['hp'] = max(0, (int) ($enemy['hp'] ?? 0) - $final);
                $log[] = [
                    't'   => 'skill_hit',
                    'id'  => $skillId,
                    'dmg' => $final,
                    'mult'=> $mult,
                    'element' => $element,
                    'enemy_hp' => $enemy['hp'],
                ];
                if ($type === 'damage_lifesteal') {
                    $heal = (int) floor($final * 0.30);
                    $player['hp'] = min((int) ($stats['maxHp'] ?? 100), (int) $player['hp'] + $heal);
                    $log[] = ['t' => 'lifesteal', 'heal' => $heal, 'hp' => $player['hp']];
                }
                if ($type === 'dot') {
                    $dur = (int) ($skill['dotDuration'] ?? 5000);
                    $iv  = (int) ($skill['dotInterval'] ?? 1000);
                    $value = (float) (($skill['baseDmg'] ?? 1) / max(1, $stats['maxHp'] ?? 100)) * $skillLevel;
                    $enemy = BuffSystem::applyEnemyDebuff($enemy, $skill['debuff']['type'] ?? 'poison', $dur, max(0.005, $value));
                }
                // debuff 命中
                if (!empty($skill['debuff'])) {
                    $resist = self::debuffResistOf($enemy);
                    $hit = BuffSystem::rollDebuffHit(
                        (float) $skill['debuff']['chance'],
                        (int) ($player['level'] ?? 1),
                        (int) ($enemy['level'] ?? 1),
                        $resist
                    );
                    if ($hit) {
                        $enemy = BuffSystem::applyEnemyDebuff(
                            $enemy,
                            (string) $skill['debuff']['type'],
                            (int)    $skill['debuff']['duration'],
                            (float)  $skill['debuff']['value'],
                            (string) $skillId
                        );
                        $log[] = ['t' => 'debuff_applied', 'who' => 'enemy', 'type' => $skill['debuff']['type'], 'value' => $skill['debuff']['value']];
                    } else {
                        $log[] = ['t' => 'debuff_resisted', 'who' => 'enemy', 'type' => $skill['debuff']['type'], 'resist' => $resist];
                    }
                }
                // 元素反制（仅对 BOSS 生效）
                if (!empty($enemy['isBoss']) && !empty($enemy['bossSkills'])) {
                    [$player, $enemy, $cLog] = self::applyElementCounter($player, $enemy, $element);
                    foreach ($cLog as $l) $log[] = $l;
                }
                break;
            }

            default:
                throw HttpException::badRequest('unsupported_skill_type', ['type' => $type]);
        }

        return [$player, $enemy, $log];
    }

    /**
     * 自动选技能（服务端权威决策，避免前后端不一致）
     *
     * 决策优先级（与原前端 tryAutoCastSkill 一致）：
     *   1. 沉默 / 眩晕 / 战斗外（无敌人或敌人已死）→ null
     *   2. 玩家 hp/maxHp < 0.7 时优先选 heal 类（按估算治疗量从高到低）
     *   3. 当前没有 shield buff 时选第一个 buff 类
     *   4. 否则按估算伤害从高到低选 damage / damage_lifesteal / dot 类
     *
     * 仅返回可用技能 id（cd 已就绪 + mp 充足），其余条件不满足返回 null。
     */
    public static function pickAutoSkill(array $player, array $enemy, array $stats, ?int $nowMs = null): ?string
    {
        if (BuffSystem::isSilenced($player) || BossSkillEngine::isStunned($player)) return null;
        if (empty($enemy) || (int) ($enemy['hp'] ?? 0) <= 0) return null;
        if ((int) ($player['hp'] ?? 0) <= 0) return null;

        $nowMs  = $nowMs ?? BuffSystem::nowMs();
        $skills = (array) ($player['skills'] ?? []);
        if (!$skills) return null;

        $available = [];
        foreach ($skills as $sid => $data) {
            if (empty($data) || (int) ($data['level'] ?? 0) <= 0) continue;
            if ((int) ($data['cooldownEnd'] ?? 0) > $nowMs) continue;
            $def = Constants::findSkill((string) $sid);
            if (!$def) continue;
            if ((int) ($player['mp'] ?? 0) < (int) ($def['mpCost'] ?? 0)) continue;
            $level = (int) ($data['level'] ?? 1);
            $available[] = [
                'id'    => (string) $sid,
                'def'   => $def,
                'level' => $level,
                'est'   => self::skillDamage($player, $stats, $def, $level),
            ];
        }
        if (!$available) return null;

        $maxHp = (int) ($stats['maxHp'] ?? ($player['maxHp'] ?? 100));
        $hpRatio = $maxHp > 0 ? ((float) $player['hp'] / $maxHp) : 1.0;

        // 1. 低血优先治疗
        if ($hpRatio < 0.7) {
            $heals = array_values(array_filter($available, fn($a) => ($a['def']['type'] ?? '') === 'heal'));
            if ($heals) {
                usort($heals, fn($a, $b) => $b['est'] <=> $a['est']);
                return $heals[0]['id'];
            }
        }

        // 2. 没护盾选 buff
        $hasShield = false;
        $shield = (($player['buffs'] ?? [])['shield'] ?? null);
        if ($shield && (int) ($shield['endTime'] ?? 0) > $nowMs) $hasShield = true;
        if (!$hasShield) {
            foreach ($available as $a) {
                if (($a['def']['type'] ?? '') === 'buff') return $a['id'];
            }
        }

        // 3. 选伤害最高的输出技能
        $damagers = array_values(array_filter($available, function ($a) {
            $t = (string) ($a['def']['type'] ?? '');
            return $t === 'damage' || $t === 'damage_lifesteal' || $t === 'dot';
        }));
        if ($damagers) {
            usort($damagers, fn($a, $b) => $b['est'] <=> $a['est']);
            return $damagers[0]['id'];
        }
        return null;
    }

    /**
     * 技能学习
     */
    public static function learn(array $player, string $skillId): array
    {
        $skill = Constants::findSkill($skillId);
        if (!$skill) throw HttpException::badRequest('skill_not_found');
        if (isset($player['skills'][$skillId])) {
            throw HttpException::conflict('already_learned');
        }
        $cost = (int) ($skill['learnCost'] ?? 0);
        if ($cost > 0) {
            if (($player['gold'] ?? 0) < $cost) {
                throw HttpException::badRequest('insufficient_gold', ['need' => $cost]);
            }
            $player['gold'] -= $cost;
        }
        $player['skills'] = $player['skills'] ?? [];
        $player['skills'][$skillId] = ['level' => 1, 'cooldownEnd' => 0];
        return $player;
    }

    /**
     * 技能升级
     */
    public static function upgrade(array $player, string $skillId): array
    {
        $skill = Constants::findSkill($skillId);
        if (!$skill) throw HttpException::badRequest('skill_not_found');
        $learned = ($player['skills'] ?? [])[$skillId] ?? null;
        if (!$learned) throw HttpException::badRequest('skill_not_learned');
        $level = (int) ($learned['level'] ?? 1);
        if ($level >= (int) $skill['maxLevel']) {
            throw HttpException::conflict('skill_max_level');
        }
        $base = (int) ($skill['upgradeCost'] ?? 80);
        $cost = (int) floor($base * pow(1.3, $level - 1));
        if (($player['gold'] ?? 0) < $cost) {
            throw HttpException::badRequest('insufficient_gold', ['need' => $cost]);
        }
        $player['gold'] -= $cost;
        $player['skills'][$skillId]['level'] = $level + 1;
        return $player;
    }

    /* ---------------- 私有计算 ---------------- */

    private static function skillDamage(array $player, array $stats, array $skill, int $skillLevel): int
    {
        $base = (float) ($skill['baseDmg'] ?? 1);
        $atkBonus = (float) ($stats['atk'] ?? 0) * 0.5;
        $levelMult = 1 + ($skillLevel - 1) * 0.15;
        $spiMult = 1 + (int) ($player['spi'] ?? 0) * 0.03;
        return (int) floor(($base + $atkBonus) * $levelMult * $spiMult);
    }

    /**
     * 敌人 debuff 抗性（与 game.js getEnemyDebuffResist 简化对齐）
     */
    public static function debuffResistOf(array $enemy): float
    {
        $level = (int) ($enemy['level'] ?? 1);
        $base = max(0, min(0.15, ($level - 1) * 0.003));
        if ($level > 100) {
            $base = min(0.40, 0.20 + ($level - 100) * 0.002);
        }
        if (!empty($enemy['isBoss'])) $base += 0.10;
        return min(0.50, $base);
    }

    /**
     * 元素反制：玩家技能 vs BOSS 技能产生克制效果
     *
     *  fire      -> poison_aura     抑制 3 秒
     *  ice       -> thunder_strike  重置 lastCast → 延后一个 interval
     *  holy      -> void_drain      获得 voidShield 抵消下一次
     *  lightning -> petrify         50% 概率打断
     *  dark      -> chaos_purge     获得 chaosReflux 下次反弹
     *
     * @return array{0:array, 1:array, 2:array<int,array>}
     */
    private static function applyElementCounter(array $player, array $enemy, string $element): array
    {
        $log = [];
        $now = BuffSystem::nowMs();
        $player['counterState'] = $player['counterState'] ?? [];

        foreach ($enemy['bossSkills'] ?? [] as &$skill) {
            $type = (string) ($skill['type'] ?? '');
            switch (true) {
                case $element === 'fire' && $type === 'poison_aura':
                    $player['counterState']['poisonSuspendUntil'] = $now + 3000;
                    $log[] = ['t' => 'counter', 'effect' => 'fire_suppress_poison', 'duration' => 3000];
                    break;
                case $element === 'ice' && $type === 'thunder_strike':
                    $skill['lastCast'] = $now;
                    $log[] = ['t' => 'counter', 'effect' => 'ice_reset_thunder'];
                    break;
                case $element === 'holy' && $type === 'void_drain':
                    $player['counterState']['voidShield'] = true;
                    $log[] = ['t' => 'counter', 'effect' => 'holy_void_shield'];
                    break;
                case $element === 'lightning' && $type === 'petrify':
                    if (\App\Util\Random::chance(0.5)) {
                        $skill['lastCast'] = $now;
                        $log[] = ['t' => 'counter', 'effect' => 'lightning_break_petrify'];
                    }
                    break;
                case $element === 'dark' && $type === 'chaos_purge':
                    $player['counterState']['chaosReflux'] = true;
                    $log[] = ['t' => 'counter', 'effect' => 'dark_chaos_reflux'];
                    break;
            }
        }
        unset($skill);
        return [$player, $enemy, $log];
    }
}
