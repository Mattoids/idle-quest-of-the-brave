<?php
declare(strict_types=1);

namespace App\Game;

use App\Bootstrap;
use App\Http\HttpException;
use App\Storage\Cache;
use App\Storage\SaveRepository;
use App\Util\Random;

/**
 * 战斗引擎（MVP）
 *
 * - 战斗会话 BattleSession：保存在 cache (TTL 30 分钟)，同时投影到存档 battle 字段
 * - 单次普攻：服务端权威计算伤害；同时计算敌人反击
 * - 自动 tick：按 elapsed_ms 与 aspd 推算攻击次数，上限 max_tick_batch
 * - 敌人死亡后 processKill() 处理经验/金币/掉落 → 入存档
 *
 * 注意：本 MVP 未实现 buff/debuff/技能反制/区域被动机制/复活等高级特性，
 * 留给后续按 js/game.js 中 enemyDefeated / attack / castSkill 等逻辑迭代补齐。
 */
final class BattleEngine
{
    private Cache $cache;
    private SaveRepository $saves;

    public function __construct(?Cache $cache = null, ?SaveRepository $saves = null)
    {
        $this->cache = $cache ?? new Cache();
        $this->saves = $saves ?? new SaveRepository();
    }

    /* ---------------- 会话管理 ---------------- */

    public function start(string $deviceHash, int $areaIndex): array
    {
        if ($areaIndex < 0 || $areaIndex > 50) {
            throw HttpException::badRequest('invalid_area', ['areaIndex' => $areaIndex]);
        }
        $save = $this->saves->loadOrThrow($deviceHash);
        $area = Constants::AREAS[$areaIndex] ?? null;
        if (!$area && $areaIndex < 15) {
            throw HttpException::badRequest('area_not_found');
        }
        // 等级限制
        if ($areaIndex < 15) {
            $required = $area['level'];
            if (($save['player']['level'] ?? 1) < $required) {
                throw HttpException::forbidden('level_too_low', ['required' => $required]);
            }
        }

        $enemy = $this->spawnEnemy($areaIndex);
        $session = [
            'session_id'  => bin2hex(random_bytes(8)),
            'area'        => $areaIndex,
            'enemy'       => $enemy,
            'started_at'  => microtime(true),
            'last_tick_ms'=> (int) (microtime(true) * 1000),
        ];

        $this->saveSession($deviceHash, $session);
        $save['battle'] = $session;
        $save['world']['inCity'] = false;
        $save['world']['currentArea'] = $areaIndex;
        $this->saves->replace($deviceHash, $save);

        return ['session' => $session, 'player' => $save['player'], 'world' => $save['world']];
    }

    public function end(string $deviceHash): array
    {
        // 在清缓存前先读取 session，判断是否是 boss 战逃跑
        $session = $this->loadSession($deviceHash);
        $this->cache->delete($this->sessionKey($deviceHash));
        $save = $this->saves->loadOrThrow($deviceHash);
        // 若是 boss 战中途退出，标记 bossFled[area]=true 便于前端 UI 提示"BOSS 逃走"
        if ($session && !empty($session['enemy']['isBoss']) && isset($session['area'])) {
            $area = (int) $session['area'];
            if ($area < 15) {
                $save['world']['bossFled'][$area] = true;
            }
        }
        $save['battle'] = null;
        $save['world']['inCity'] = true;
        $save['world']['fightingBoss'] = false;
        $this->saves->replace($deviceHash, $save);
        return ['ended' => true, 'world' => $save['world']];
    }

    /**
     * 挑战 BOSS：需要 BOSS 未被击败 + 线索足够
     */
    public function startBoss(string $deviceHash, int $areaIndex): array
    {
        if (!in_array($areaIndex, Constants::BOSS_AREAS, true)) {
            throw HttpException::badRequest('not_a_boss_area');
        }
        $save = $this->saves->loadOrThrow($deviceHash);

        if (!empty($save['world']['bossDefeated'][$areaIndex])) {
            throw HttpException::conflict('boss_already_defeated');
        }
        $required = Constants::CLUE_REQUIRED[$areaIndex] ?? 0;
        $have     = (int) (($save['world']['clues'] ?? [])[$areaIndex] ?? 0);
        if ($have < $required) {
            throw HttpException::badRequest('insufficient_clues', ['need' => $required, 'have' => $have]);
        }

        $enemy = BossDefs::spawn($areaIndex);
        // 初始化 lastCast = nowMs，避免第一次 attack 就立即触发 BOSS 技能
        $nowMs = BuffSystem::nowMs();
        foreach ($enemy['bossSkills'] as &$bs) {
            if (isset($bs['lastCast'])) $bs['lastCast'] = $nowMs;
        }
        unset($bs);
        $session = [
            'session_id'  => bin2hex(random_bytes(8)),
            'area'        => $areaIndex,
            'enemy'       => $enemy,
            'started_at'  => microtime(true),
            'last_tick_ms'=> $nowMs,
        ];
        $this->saveSession($deviceHash, $session);

        $save['battle'] = $session;
        $save['world']['inCity']       = false;
        $save['world']['currentArea']  = $areaIndex;
        $save['world']['fightingBoss'] = true;
        $this->saves->replace($deviceHash, $save);

        return ['session' => $session, 'player' => $save['player'], 'world' => $save['world']];
    }

    public function status(string $deviceHash): array
    {
        $session = $this->loadSession($deviceHash);
        $save = $this->saves->loadOrThrow($deviceHash);
        return [
            'session' => $session,
            'player'  => $save['player'],
            'world'   => $save['world'],
        ];
    }

    /* ---------------- 战斗 tick ---------------- */

    /**
     * 玩家普攻一次：节流 + 计算双方伤害 + 入掉落
     */
    public function attack(string $deviceHash): array
    {
        $session = $this->requireSession($deviceHash);
        $save    = $this->saves->loadOrThrow($deviceHash);

        $stats  = $this->resolvedStats($save['player']);
        $aspdMs = (int) max(100, $stats['aspd']);
        $nowMs  = BuffSystem::nowMs();

        $minInterval = (int) Bootstrap::config('game.min_action_interval_ms', 80);
        $elapsed = $nowMs - ($session['last_tick_ms'] ?? 0);
        if ($elapsed < min($aspdMs, $minInterval)) {
            throw HttpException::tooMany('attack_too_fast');
        }

        // 先 tick buff/debuff
        $tickRes = BuffSystem::tick($save['player'], $session['enemy'], $nowMs);
        $save['player']    = $tickRes['player'];
        $session['enemy']  = $tickRes['enemy'];
        $log = $tickRes['log'];
        // 推进 BOSS 技能（如有）
        $bossTick = BossSkillEngine::tick($save['player'], $session['enemy'], $stats);
        $save['player']    = $bossTick['player'];
        $session['enemy']  = $bossTick['enemy'];
        foreach ($bossTick['log'] as $l) $log[] = $l;

        // 眩晕拒绝普攻
        if (BossSkillEngine::isStunned($save['player'])) {
            $session['last_tick_ms'] = $nowMs;
            $log[] = ['t' => 'player_stunned'];
            $this->saveSession($deviceHash, $session);
            $save['battle'] = $session;
            $this->saves->replace($deviceHash, $save);
            return ['log' => $log, 'session' => $session, 'player' => $save['player']];
        }

        $report = $this->resolveSwing($save['player'], $session['enemy'], $stats, false);
        $log[] = $report['log'];
        foreach (($report['extra_logs'] ?? []) as $l) $log[] = $l;
        $save['player'] = $report['player'];
        $session['enemy'] = $report['enemy'];
        $session['last_tick_ms'] = $nowMs;

        // 敌人反击
        if ($session['enemy']['hp'] > 0 && $save['player']['hp'] > 0) {
            $counter = $this->enemySwing($save['player'], $session['enemy'], $stats, (int) $session['area']);
            foreach ($counter['logs'] as $l) $log[] = $l;
            $save['player']   = $counter['player'];
            $session['enemy'] = $counter['enemy'];
        }

        return $this->finalize($deviceHash, $save, $session, $log);
    }

    /**
     * 释放技能：服务端权威计算，含 mp/cd/克制/debuff
     */
    public function castSkill(string $deviceHash, string $skillId): array
    {
        $session = $this->requireSession($deviceHash);
        $save    = $this->saves->loadOrThrow($deviceHash);

        $stats = $this->resolvedStats($save['player']);
        $nowMs = BuffSystem::nowMs();

        // 先 tick buff/debuff
        $tickRes = BuffSystem::tick($save['player'], $session['enemy'], $nowMs);
        $save['player']   = $tickRes['player'];
        $session['enemy'] = $tickRes['enemy'];
        $log = $tickRes['log'];
        // BOSS 技能 tick
        $bossTick = BossSkillEngine::tick($save['player'], $session['enemy'], $stats);
        $save['player']   = $bossTick['player'];
        $session['enemy'] = $bossTick['enemy'];
        foreach ($bossTick['log'] as $l) $log[] = $l;

        [$save['player'], $session['enemy'], $skillLog] = SkillEngine::cast(
            $save['player'], $session['enemy'], $stats, $skillId
        );
        foreach ($skillLog as $l) $log[] = $l;

        // 技能命中后也检查 berserker 触发
        $session['enemy'] = EnemyBehavior::tryBerserk($session['enemy']);
        $session['last_tick_ms'] = $nowMs;

        // 技能命中后给敌人一次反击机会
        if ($session['enemy']['hp'] > 0 && $save['player']['hp'] > 0) {
            $counter = $this->enemySwing($save['player'], $session['enemy'], $stats, (int) $session['area']);
            foreach ($counter['logs'] as $l) $log[] = $l;
            $save['player']   = $counter['player'];
            $session['enemy'] = $counter['enemy'];
        }

        return $this->finalize($deviceHash, $save, $session, $log);
    }

    /**
     * 批量战斗 tick：一次计算固定 rounds 回合（默认 30），并将每回合分组返回供前端按 aspd 节奏逐步播放。
     *
     * 设计目标：
     *   - 一次请求 → 一批回合（默认 30）→ 减少 HTTP 抖动 / 服务端 IO 压力
     *   - 前端按 `aspd_ms` 节奏逐回合渲染，全部播完再发下一次请求
     *   - 服务端用 session.next_batch_at_ms 节流：未到时间再次请求返回 too_many('batch_in_progress', wait_ms)
     *
     * 返回结构：
     *   {
     *     ticked:        实际执行回合数（可能 < rounds，若中途玩家死亡或 BOSS 击败）
     *     rounds:        [{round, ts_offset_ms, log: [...]}, ...]
     *     duration_ms:   总时长 = ticked × aspd_ms
     *     aspd_ms:       玩家攻速间隔（前端按这个节奏播放）
     *     log:           扁平合并的全部日志（向后兼容旧前端）
     *     session/player/world: 最终状态
     *     ended_early:   是否提前结束（玩家死亡 / BOSS 击败 / 普通 BOSS 被打死等）
     *   }
     */
    public function autoTick(string $deviceHash, int $rounds = 30): array
    {
        $rounds = (int) max(1, min(60, $rounds));
        $session = $this->requireSession($deviceHash);
        $save    = $this->saves->loadOrThrow($deviceHash);

        $stats   = $this->resolvedStats($save['player']);
        $aspdMs  = (int) max(100, $stats['aspd']);
        $nowMs   = BuffSystem::nowMs();

        // 节流：上次 batch 尚未播完不允许新请求
        $nextBatchAt = (int) ($session['next_batch_at_ms'] ?? 0);
        if ($nowMs < $nextBatchAt) {
            throw HttpException::tooMany('batch_in_progress', [
                'wait_ms' => $nextBatchAt - $nowMs,
            ]);
        }

        $roundLogs  = [];
        $flatLog    = [];
        $endedEarly = false;

        for ($r = 0; $r < $rounds; $r++) {
            if (($save['player']['hp'] ?? 0) <= 0) { $endedEarly = true; break; }

            $roundOffset = $r * $aspdMs;
            $simNow      = $nowMs + $roundOffset;
            $roundLog    = [];

            // 1. buff/debuff tick
            $tickRes = BuffSystem::tick($save['player'], $session['enemy'], $simNow);
            $save['player']   = $tickRes['player'];
            $session['enemy'] = $tickRes['enemy'];
            foreach ($tickRes['log'] as $l) $roundLog[] = $l;

            // 重算 stats（buff 可能变化）
            $stats = $this->resolvedStats($save['player']);

            // 2. BOSS 技能 tick
            $bossTick = BossSkillEngine::tick($save['player'], $session['enemy'], $stats);
            $save['player']   = $bossTick['player'];
            $session['enemy'] = $bossTick['enemy'];
            foreach ($bossTick['log'] as $l) $roundLog[] = $l;

            // 3. 自动施法（服务端权威决策）—— 传入 simNow 让 cd 在批量内按攻速节奏流逝
            if ($session['enemy']['hp'] > 0 && $save['player']['hp'] > 0) {
                $autoSid = SkillEngine::pickAutoSkill($save['player'], $session['enemy'], $stats, $simNow);
                if ($autoSid !== null) {
                    try {
                        [$save['player'], $session['enemy'], $skillLog] = SkillEngine::cast(
                            $save['player'], $session['enemy'], $stats, $autoSid, $simNow
                        );
                        foreach ($skillLog as $l) $roundLog[] = $l;
                    } catch (\Throwable $e) { /* cd 漂移/沉默等静默 */ }
                }
            }

            // 4. 玩家普攻
            if ($session['enemy']['hp'] > 0 && $save['player']['hp'] > 0) {
                if (BossSkillEngine::isStunned($save['player'])) {
                    $roundLog[] = ['t' => 'player_stunned'];
                } else {
                    $report = $this->resolveSwing($save['player'], $session['enemy'], $stats, false);
                    $roundLog[] = $report['log'];
                    foreach (($report['extra_logs'] ?? []) as $l) $roundLog[] = $l;
                    $save['player']   = $report['player'];
                    $session['enemy'] = $report['enemy'];
                }
            }

            // 5. 敌人反击
            if ($session['enemy']['hp'] > 0 && $save['player']['hp'] > 0) {
                $counter = $this->enemySwing($save['player'], $session['enemy'], $stats, (int) $session['area']);
                foreach ($counter['logs'] as $l) $roundLog[] = $l;
                $save['player']   = $counter['player'];
                $session['enemy'] = $counter['enemy'];
            }

            // 6. 玩家死亡 → 结算 + 终止 batch
            if (($save['player']['hp'] ?? 0) <= 0) {
                $gold = (int) ($save['player']['gold'] ?? 0);
                $penalty = (int) min(500, $gold * 0.05 + 50);
                $save['player']['gold'] = max(0, $gold - $penalty);
                $save['player']['hp']   = max(1, (int) (PlayerService::computeStats($save['player'])['maxHp'] * 0.3));
                // 若死在 BOSS 战，清线索 + 标记 bossFled（"BOSS 逃走"）
                if (!empty($session['enemy']['isBoss']) && isset($session['area'])) {
                    $bossArea = (int) $session['area'];
                    if ($bossArea < 15) {
                        $save['world']['clues'][$bossArea]    = 0;
                        $save['world']['bossFled'][$bossArea] = true;
                        $save['world']['fightingBoss']        = false;
                        $roundLog[] = ['t' => 'boss_fled', 'area' => $bossArea];
                    }
                }
                $save['battle'] = null;
                $save['world']['inCity'] = true;
                $roundLog[] = ['t' => 'player_died', 'gold_lost' => $penalty];
                $this->cache->delete($this->sessionKey($deviceHash));
                $session = null;
                $roundLogs[] = [
                    'round'        => $r + 1,
                    'ts_offset_ms' => $roundOffset,
                    'log'          => $roundLog,
                    'player_hp'    => (int) $save['player']['hp'],
                    'player_mp'    => (int) ($save['player']['mp'] ?? 0),
                    'enemy_hp'     => 0,
                    'enemy'        => null,
                    'skills'       => $save['player']['skills'] ?? new \stdClass(),
                    'player_state' => self::roundPlayerState($save['player']),
                ];
                foreach ($roundLog as $l) $flatLog[] = $l;
                $endedEarly = true;
                break;
            }

            // 7. 敌人死亡 → 结算 + 可能 spawn 下一只继续
            if (($session['enemy']['hp'] ?? 0) <= 0) {
                $isBoss  = !empty($session['enemy']['isBoss']);
                $revived = false;
                if (!$isBoss) {
                    $rev = EnemyBehavior::tryRevive($session['enemy']);
                    $session['enemy'] = $rev['enemy'];
                    $revived = $rev['revived'];
                    if (!$revived) {
                        $rev2 = AreaPassive::tryAreaRevive($session['enemy']);
                        $session['enemy'] = $rev2['enemy'];
                        $revived = $rev2['revived'];
                    }
                }
                if ($revived) {
                    $roundLog[] = ['t' => 'enemy_revived', 'hp' => $session['enemy']['hp']];
                } else {
                    $drops = $this->processKill($save, $session);
                    $save  = $drops['save'];
                    $roundLog[] = ['t' => 'enemy_killed', 'drops' => $drops['drops']];
                    $save['world']['lastBattleEndTime'] = time() * 1000;

                    $area = (int) ($session['area'] ?? 0);
                    if ($isBoss && $area < 15) {
                        // 普通 BOSS 击败：标记 + 清线索 + 退出战斗，提前结束 batch
                        $save['world']['bossDefeated'][$area] = true;
                        $save['world']['clues'][$area]        = 0;
                        $save['world']['fightingBoss']        = false;
                        $save['world']['inCity']              = true;
                        $save['battle'] = null;
                        $roundLog[] = ['t' => 'boss_defeated', 'area' => $area];
                        if ($area === 14) $roundLog[] = ['t' => 'endless_unlocked'];
                        $this->cache->delete($this->sessionKey($deviceHash));
                        $session = null;
                        $roundLogs[] = [
                            'round'        => $r + 1,
                            'ts_offset_ms' => $roundOffset,
                            'log'          => $roundLog,
                            'player_hp'    => (int) ($save['player']['hp'] ?? 0),
                            'player_mp'    => (int) ($save['player']['mp'] ?? 0),
                            'enemy_hp'     => 0,
                            'enemy'        => null,
                            'skills'       => $save['player']['skills'] ?? new \stdClass(),
                            'player_state' => self::roundPlayerState($save['player']),
                        ];
                        foreach ($roundLog as $l) $flatLog[] = $l;
                        $endedEarly = true;
                        break;
                    }
                    if ($area >= 15) {
                        $save = EndlessService::advanceLayer($save, $session);
                        $session['area'] = (int) $save['world']['currentArea'];
                        $roundLog[] = ['t' => 'endless_layer', 'layer' => $session['area'] - 14];
                    }
                    // 生成下一个敌人，本回合结束、下一回合继续
                    $session['enemy'] = $this->spawnEnemy((int) ($session['area'] ?? 0));
                }
            }

            $roundLogs[] = [
                'round'        => $r + 1,
                'ts_offset_ms' => $roundOffset,
                'log'          => $roundLog,
                'player_hp'    => (int) ($save['player']['hp'] ?? 0),
                'player_mp'    => (int) ($save['player']['mp'] ?? 0),
                'enemy_hp'     => $session ? (int) ($session['enemy']['hp'] ?? 0) : 0,
                'enemy'        => $session ? $session['enemy'] : null,
                'skills'       => $save['player']['skills'] ?? new \stdClass(),
                'player_state' => self::roundPlayerState($save['player']),
            ];
            foreach ($roundLog as $l) $flatLog[] = $l;
        }

        // 8. 统一收尾：写 session + replace 一次
        $playedRounds = count($roundLogs);
        $durationMs   = $playedRounds * $aspdMs;

        if ($session !== null) {
            $session['last_tick_ms']      = $nowMs + $durationMs;
            $session['next_batch_at_ms']  = $nowMs + $durationMs;
            $this->saveSession($deviceHash, $session);
            $save['battle'] = $session;
        }
        $this->saves->replace($deviceHash, $save);

        return [
            'ticked'      => $playedRounds,
            'rounds'      => $roundLogs,
            'duration_ms' => $durationMs,
            'aspd_ms'     => $aspdMs,
            'log'         => $flatLog,
            'session'     => $session,
            'player'      => $save['player'],
            'world'       => $save['world'] ?? null,
            'ended_early' => $endedEarly,
        ];
    }

    /**
     * 计算最终生效 stats（含 buff/debuff 修饰）
     */
    private function resolvedStats(array $player): array
    {
        $stats = PlayerService::computeStats($player);
        return BuffSystem::applyPlayerBuffsToStats($player, $stats);
    }

    /* ---------------- 单次"挥砍"伤害解算 ---------------- */

    /**
     * @return array{log:array, player:array, enemy:array, extra_logs?:array}
     */
    private function resolveSwing(array $player, array $enemy, array $stats, bool $isSkill): array
    {
        // ethereal 15% 闪避（仅普通攻击，不影响技能）
        if (!$isSkill && EnemyBehavior::tryDodge($enemy)) {
            return [
                'log'    => ['t' => 'player_miss', 'reason' => 'dodge', 'enemy_hp' => $enemy['hp'] ?? 0],
                'player' => $player,
                'enemy'  => $enemy,
            ];
        }

        // 应用敌人 debuff 修饰后的实际防御/攻击
        $enemyEff = BuffSystem::applyEnemyDebuffsToStats($enemy);

        $atk = (float) $stats['atk'];
        $def = (float) ($enemyEff['def'] ?? 0);

        // 破甲
        $def -= ($stats['armorPenFlat'] ?? 0) * 1.5;
        $def -= $def * min(0.35, $stats['armorPenPercent'] ?? 0);
        $def = max(0, $def);

        $base = max(1.0, $atk * $atk / max(1, $atk + $def));

        // 暴击
        $isCrit = Random::chance(min(1.0, ($stats['crit'] ?? 0) / 100.0));
        if ($isCrit) {
            $base *= max(1.0, (float) ($stats['critDmg'] ?? 2));
        }
        // BOSS damage_reduce 衰减玩家伤害
        $base *= BossSkillEngine::damageReduceMult($enemy);
        $damage = (int) floor($base);
        $enemy['hp'] = max(0, ($enemy['hp'] ?? 0) - $damage);

        // 命中后检查 berserker 触发（敌人血量低于 30%）
        $enemy = EnemyBehavior::tryBerserk($enemy);

        // 区域被动：荆棘反伤
        $extraLogs = [];
        $thornsRes = AreaPassive::onPlayerHitEnemy($player, $enemy, $damage);
        $player = $thornsRes['player'];
        foreach ($thornsRes['log'] as $l) $extraLogs[] = $l;

        // 吸血
        if (($stats['vamp'] ?? 0) > 0 && $damage > 0) {
            $heal = (int) ($damage * $stats['vamp']);
            $player['hp'] = min((int) $stats['maxHp'], ($player['hp'] ?? 0) + $heal);
        }

        return [
            'log'        => ['t' => 'player_hit', 'dmg' => $damage, 'crit' => $isCrit, 'enemy_hp' => $enemy['hp']],
            'player'     => $player,
            'enemy'      => $enemy,
            'extra_logs' => $extraLogs,
        ];
    }

    private function enemySwing(array $player, array $enemy, array $stats, int $areaIndex = 0): array
    {
        // 敌人 debuff 调整
        $enemyEff = BuffSystem::applyEnemyDebuffsToStats($enemy);
        $atk = (float) ($enemyEff['atk'] ?? 1);
        $def = (float) ($stats['def'] ?? 0);
        $base = max(1.0, $atk * $atk / max(1, $atk + $def));
        $damage = (int) floor($base);
        $player['hp'] = max(0, ($player['hp'] ?? 0) - $damage);

        $logs = [['t' => 'enemy_hit', 'dmg' => $damage, 'player_hp' => $player['hp']]];

        // vampiric 攻击吸血（怪物类型）
        $enemy = EnemyBehavior::applyVampire($enemy, $damage);

        // 区域被动：吸血 / 燃烧 / 破甲
        $areaRes = AreaPassive::onEnemyHitPlayer($player, $enemy, $damage, $stats);
        $player = $areaRes['player'];
        $enemy  = $areaRes['enemy'];
        foreach ($areaRes['log'] as $l) $logs[] = $l;

        // 怪物类型 / 精英 / Boss 施加 debuff
        $rolled = EnemyBehavior::rollAttackDebuffs($player, $enemy, $areaIndex);
        $player = $rolled['player'];
        foreach ($rolled['log'] as $l) $logs[] = $l;

        // BOSS stun_chance（天空领主 20% +1s 眩晕）
        $stun = BossSkillEngine::tryStunChance($player, $enemy);
        $player = $stun['player'];
        if (!empty($stun['stunned'])) {
            $logs[] = ['t' => 'boss_stun', 'dur' => $stun['dur'] ?? 0];
        }

        return [
            'logs'   => $logs,
            'player' => $player,
            'enemy'  => $enemy,
        ];
    }

    /* ---------------- 结算 ---------------- */

    private function finalize(string $deviceHash, array $save, array $session, array $log): array
    {
        if (($save['player']['hp'] ?? 0) <= 0) {
            // 玩家阵亡：金币惩罚 + 退出战斗
            $gold = (int) ($save['player']['gold'] ?? 0);
            $penalty = (int) min(500, $gold * 0.05 + 50);
            $save['player']['gold'] = max(0, $gold - $penalty);
            $save['player']['hp'] = max(1, (int) (PlayerService::computeStats($save['player'])['maxHp'] * 0.3));
            // 若是 BOSS 战中死亡，清空该区域线索 + 标记 bossFled（与离线模式一致：BOSS 逃走、需重新攒线索）
            if (!empty($session['enemy']['isBoss']) && isset($session['area'])) {
                $area = (int) $session['area'];
                if ($area < 15) {
                    $save['world']['clues'][$area]    = 0;
                    $save['world']['bossFled'][$area] = true;
                    $save['world']['fightingBoss']    = false;
                    $log[] = ['t' => 'boss_fled', 'area' => $area];
                }
            }
            $save['battle'] = null;
            $save['world']['inCity'] = true;
            $log[] = ['t' => 'player_died', 'gold_lost' => $penalty];
            $this->cache->delete($this->sessionKey($deviceHash));
        } elseif (($session['enemy']['hp'] ?? 0) <= 0) {
            $isBoss = !empty($session['enemy']['isBoss']);
            $revived = false;
            if (!$isBoss) {
                // 复活：undead 类型 + 区域级 revive 共用 hasRevived
                $rev = EnemyBehavior::tryRevive($session['enemy']);
                $session['enemy'] = $rev['enemy'];
                $revived = $rev['revived'];
                if (!$revived) {
                    $rev2 = AreaPassive::tryAreaRevive($session['enemy']);
                    $session['enemy'] = $rev2['enemy'];
                    $revived = $rev2['revived'];
                }
            }
            if ($revived) {
                $log[] = ['t' => 'enemy_revived', 'hp' => $session['enemy']['hp']];
            } else {
                // 敌人死亡 → 结算
                $drops = $this->processKill($save, $session);
                $save = $drops['save'];
                $log[] = ['t' => 'enemy_killed', 'drops' => $drops['drops']];

                // 更新 lastBattleEndTime（供离线挂机算法用）
                $save['world']['lastBattleEndTime'] = time() * 1000;

                $area = (int) ($session['area'] ?? 0);

                if ($isBoss && $area < 15) {
                    // 普通 BOSS 被击败：标记 + 清线索 + 退出战斗
                    $save['world']['bossDefeated'][$area] = true;
                    $save['world']['clues'][$area] = 0;
                    $save['world']['fightingBoss'] = false;
                    $save['world']['inCity'] = true;
                    $save['battle'] = null;
                    $log[] = ['t' => 'boss_defeated', 'area' => $area];
                    // 击败 boss 14 → 自动解锁无尽（仅状态标记，不进入）
                    if ($area === 14) {
                        $log[] = ['t' => 'endless_unlocked'];
                    }
                    $this->cache->delete($this->sessionKey($deviceHash));
                    $this->saves->replace($deviceHash, $save);
                    return ['log' => $log, 'session' => null, 'player' => $save['player'], 'world' => $save['world']];
                }

                // 无尽模式：每次击杀（含 endless boss）推进 layer
                if ($area >= 15) {
                    $save = EndlessService::advanceLayer($save, $session);
                    $session['area'] = (int) $save['world']['currentArea'];
                    $log[] = ['t' => 'endless_layer', 'layer' => $session['area'] - 14];
                }

                // 生成下一个敌人
                $session['enemy'] = $this->spawnEnemy((int) ($session['area'] ?? 0));
            }
        } else {
            // 战斗继续，不需要落库存档
        }

        $this->saveSession($deviceHash, $session);
        $save['battle'] = $session;
        $this->saves->replace($deviceHash, $save);

        return [
            'log'     => $log,
            'session' => $session,
            'player'  => $save['player'],
            'world'   => $save['world'],
        ];
    }

    /**
     * 敌人死亡处理：经验/金币/掉落
     *
     * @return array{save:array, drops:array}
     */
    private function processKill(array $save, array $session): array
    {
        $area = (int) $session['area'];
        $enemy = $session['enemy'];

        $expGain = (int) ($enemy['exp'] ?? 5);
        $goldGain = (int) ($enemy['gold'] ?? 2);

        $stats = PlayerService::computeStats($save['player']);
        $expGain = (int) floor($expGain * (1 + ($stats['expBonus'] ?? 0)));
        $goldGain = (int) floor($goldGain * (1 + ($stats['goldBonus'] ?? 0)));

        // 无尽模式金币翻三倍
        if ($area >= 15) {
            $goldGain = (int) floor($goldGain * 3);
        }

        $save['player'] = PlayerService::gainExp($save['player'], $expGain);
        $save['player']['gold'] = (int) ($save['player']['gold'] ?? 0) + $goldGain;
        $save['player']['kills'] = (int) ($save['player']['kills'] ?? 0) + 1;

        $drops = [
            'exp'  => $expGain,
            'gold' => $goldGain,
            'items' => [],
        ];

        // 装备
        $eqRate = DropTable::equipmentDropRate($area);
        if (Random::chance($eqRate)) {
            $eq = DropTable::rollEquipmentDrop($area);
            if ($eq) {
                $save['player'] = PlayerService::addEquipmentToBag($save['player'], $eq);
                $drops['items'][] = ['type' => 'equipment', 'payload' => $eq];
            }
        }
        // 技能书
        $book = DropTable::rollSkillBookDrop($area, $area >= 15);
        if ($book) {
            $save['player'] = PlayerService::addSkillBook($save['player'], $book);
            $drops['items'][] = ['type' => 'skill_book', 'payload' => $book];
        }
        // 宝物
        $treasure = DropTable::rollTreasureDrop($area, null, $area >= 15);
        if ($treasure) {
            $save['player'] = PlayerService::addTreasure($save['player'], $treasure);
            $drops['items'][] = ['type' => 'treasure', 'payload' => $treasure];
        }
        // 精英特有
        if (!empty($enemy['isElite'])) {
            foreach (DropTable::rollEliteSpecial() as $it) {
                $save['player'] = PlayerService::addItem($save['player'], $it['id'], $it['count']);
                $drops['items'][] = ['type' => 'item', 'payload' => $it];
            }
        }
        // BOSS 额外掉落（必掉宝物/装备/技能书，且品质更高）
        if (!empty($enemy['isBoss'])) {
            // BOSS 宝物 60%，最低 epic
            if (Random::chance(0.60)) {
                $bossT = DropTable::rollTreasureDrop($area, 'epic', $area >= 15);
                if ($bossT) {
                    $save['player'] = PlayerService::addTreasure($save['player'], $bossT);
                    $drops['items'][] = ['type' => 'treasure', 'payload' => $bossT, 'tag' => 'boss'];
                }
            }
            // BOSS 装备：基础 ×1.2，最低 rare
            if (Random::chance(min(0.85, DropTable::equipmentDropRate($area) * 1.2))) {
                $bossEq = DropTable::rollEquipmentDrop($area, 'rare');
                if ($bossEq) {
                    $save['player'] = PlayerService::addEquipmentToBag($save['player'], $bossEq);
                    $drops['items'][] = ['type' => 'equipment', 'payload' => $bossEq, 'tag' => 'boss'];
                }
            }
            // BOSS 技能书：基础 ×1.5
            if (Random::chance(min(0.85, DropTable::skillBookDropRate($area) * 1.5))) {
                $bossB = DropTable::rollSkillBookDrop($area, $area >= 15);
                if ($bossB) {
                    $save['player'] = PlayerService::addSkillBook($save['player'], $bossB);
                    $drops['items'][] = ['type' => 'skill_book', 'payload' => $bossB, 'tag' => 'boss'];
                }
            }
            $stone = DropTable::rollBossEnhanceStone();
            if ($stone) {
                $save['player'] = PlayerService::addItem($save['player'], $stone['id'], $stone['count']);
                $drops['items'][] = ['type' => 'item', 'payload' => $stone];
            }
            $passive = DropTable::rollPassiveBookDrop();
            if ($passive) {
                $save['player'] = PlayerService::addPassiveBook($save['player'], $passive);
                $drops['items'][] = ['type' => 'passive_book', 'payload' => ['id' => $passive['id']]];
            }
        }
        // 线索掉落：在 BOSS 区域击败普通怪 15% 概率（且 BOSS 未击败）
        if (
            empty($enemy['isBoss']) &&
            in_array($area, Constants::BOSS_AREAS, true) &&
            empty($save['world']['bossDefeated'][$area]) &&
            Random::chance(Constants::CLUE_DROP_RATE)
        ) {
            $cur = (int) (($save['world']['clues'] ?? [])[$area] ?? 0);
            $req = (int) (Constants::CLUE_REQUIRED[$area] ?? 0);
            if ($cur < $req) {
                $save['world']['clues'][$area] = $cur + 1;
                $drops['items'][] = ['type' => 'clue', 'payload' => ['area' => $area, 'count' => $cur + 1, 'need' => $req]];
            }
        }
        // 无尽普通怪：恢复/加成道具
        if ($area >= 15 && empty($enemy['isElite']) && empty($enemy['isBoss'])) {
            $extra = DropTable::rollEndlessNormalItem($area - 14);
            if ($extra) {
                $save['player'] = PlayerService::addItem($save['player'], $extra['id'], $extra['count']);
                $drops['items'][] = ['type' => 'item', 'payload' => $extra];
            }
        }

        // 无尽精英/Boss 特殊掉落（神器装备/超脱套装/无尽道具/禁咒书）
        if ($area >= 15 && (!empty($enemy['isElite']) || !empty($enemy['isBoss']))) {
            $special = EndlessService::rollSpecialDrops($area - 14, $enemy);
            foreach ($special as $sp) {
                switch ($sp['type']) {
                    case 'equipment':
                        $save['player'] = PlayerService::addEquipmentToBag($save['player'], $sp['payload']);
                        break;
                    case 'item':
                        $save['player'] = PlayerService::addItem($save['player'], $sp['payload']['id'], $sp['payload']['count'] ?? 1);
                        break;
                    case 'skill_book':
                        $save['player'] = PlayerService::addSkillBook($save['player'], $sp['payload']);
                        break;
                }
                $drops['items'][] = $sp;
            }
        }

        return ['save' => $save, 'drops' => $drops];
    }

    /* ---------------- 敌人生成 ---------------- */

    public function spawnEnemy(int $areaIndex): array
    {
        $mult = $areaIndex >= 15
            ? 15.5 * pow(1.08, $areaIndex - 14)
            : (Constants::AREAS[$areaIndex]['multiplier'] ?? 1.0);

        $baseLevel = $areaIndex >= 15
            ? 100 + 2 * ($areaIndex - 14)
            : (Constants::AREAS[$areaIndex]['level'] ?? 1);

        // 无尽层数特殊：每 5 层精英、每 10 层 BOSS
        $isElite = false;
        $isEndlessBoss = false;
        if ($areaIndex >= 15) {
            $tier = EndlessService::tierOfLayer($areaIndex - 14);
            $isElite = $tier['isElite'];
            $isEndlessBoss = $tier['isBoss'];
        }
        if (!$isElite && !$isEndlessBoss) {
            $isElite = Random::chance(Constants::ELITE_SPAWN_RATE);
        }
        $tplPool = Constants::ENEMIES;
        $tpl = $tplPool[Random::int(0, count($tplPool) - 1)];

        $hp  = (int) (50 * $mult * ($isEndlessBoss ? 1.8 : ($isElite ? 1.5 : 1)));
        $atk = (int) (5  * $mult * ($isEndlessBoss ? 1.5 : ($isElite ? 1.3 : 1)));
        $def = (int) (2  * $mult * ($isEndlessBoss ? 1.4 : ($isElite ? 1.2 : 1)));
        $exp = (int) (8  * $mult * ($isEndlessBoss ? 2.0 : 1));
        $gold = (int) (5 * $mult * ($isEndlessBoss ? 3.0 : 1));

        $enemy = [
            'name'    => $tpl['name'],
            'emoji'   => $tpl['emoji'],
            'type'    => $tpl['type'],
            'level'   => $baseLevel,
            'hp'      => $hp,
            'maxHp'   => $hp,
            'atk'     => $atk,
            'def'     => $def,
            'exp'     => $exp,
            'gold'    => $gold,
            'isElite' => $isElite,
            'isBoss'  => $isEndlessBoss,
        ];
        // 应用怪物类型修饰（aggressive/tank/fragile 调整属性；pack 调 aspd；标准化 enemyType/debuffs/berserkActive/hasRevived 字段）
        $enemy = EnemyBehavior::decorateSpawn($enemy);
        // 应用区域被动机制（burn/lifeSteal/thorns/armorPen/revive）
        return AreaPassive::decorateSpawn($enemy, $areaIndex);
    }

    /* ---------------- 缓存 helper ---------------- */

    private function requireSession(string $deviceHash): array
    {
        $s = $this->loadSession($deviceHash);
        if (!$s) throw HttpException::badRequest('no_active_battle');
        return $s;
    }

    private function loadSession(string $deviceHash): ?array
    {
        $v = $this->cache->get($this->sessionKey($deviceHash));
        return is_array($v) ? $v : null;
    }

    private function saveSession(string $deviceHash, array $session): void
    {
        $this->cache->set($this->sessionKey($deviceHash), $session, 1800); // 30 min
    }

    private function sessionKey(string $deviceHash): string
    {
        return 'battle:' . $deviceHash;
    }

    /**
     * 提取 player 中"会在战斗中变化的标量字段"快照，用于每回合下发给前端实时更新 UI
     * （金币、经验、等级、击杀数、被升级影响的基础属性等）。
     * 不包含 equipments/treasures/skillBooks/items 等大对象——这些在 batch 内不会变。
     */
    private static function roundPlayerState(array $player): array
    {
        return [
            'gold'    => (int) ($player['gold']    ?? 0),
            'exp'     => (int) ($player['exp']     ?? 0),
            'maxExp'  => (int) ($player['maxExp']  ?? 100),
            'level'   => (int) ($player['level']   ?? 1),
            'kills'   => (int) ($player['kills']   ?? 0),
            'hp'      => (int) ($player['hp']      ?? 0),
            'mp'      => (int) ($player['mp']      ?? 0),
            'maxHp'   => (int) ($player['maxHp']   ?? 100),
            'maxMp'   => (int) ($player['maxMp']   ?? 50),
            'atk'     => (int) ($player['atk']     ?? 10),
            'def'     => (int) ($player['def']     ?? 5),
            'spi'     => (int) ($player['spi']     ?? 10),
            'aspd'    => (int) ($player['aspd']    ?? 1000),
            'crit'    => (float) ($player['crit']    ?? 0),
            'critDmg' => (float) ($player['critDmg'] ?? 2),
            'vamp'    => (float) ($player['vamp']    ?? 0),
        ];
    }
}
