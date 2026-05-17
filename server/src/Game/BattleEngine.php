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

        return ['session' => $session, 'player' => $save['player']];
    }

    public function end(string $deviceHash): array
    {
        $this->cache->delete($this->sessionKey($deviceHash));
        $save = $this->saves->loadOrThrow($deviceHash);
        $save['battle'] = null;
        $save['world']['inCity'] = true;
        $this->saves->replace($deviceHash, $save);
        return ['ended' => true];
    }

    public function status(string $deviceHash): array
    {
        $session = $this->loadSession($deviceHash);
        $save = $this->saves->loadOrThrow($deviceHash);
        return [
            'session' => $session,
            'player'  => $save['player'],
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

        $report = $this->resolveSwing($save['player'], $session['enemy'], $stats, false);
        $log[] = $report['log'];
        $save['player'] = $report['player'];
        $session['enemy'] = $report['enemy'];
        $session['last_tick_ms'] = $nowMs;

        if ($session['enemy']['hp'] > 0 && $save['player']['hp'] > 0) {
            $counter = $this->enemySwing($save['player'], $session['enemy'], $stats);
            $log[] = $counter['log'];
            $save['player'] = $counter['player'];
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

        [$save['player'], $session['enemy'], $skillLog] = SkillEngine::cast(
            $save['player'], $session['enemy'], $stats, $skillId
        );
        foreach ($skillLog as $l) $log[] = $l;
        $session['last_tick_ms'] = $nowMs;

        // 技能命中后给敌人一次反击机会（与 game.js 一致：技能释放后敌人正常 swing）
        if ($session['enemy']['hp'] > 0 && $save['player']['hp'] > 0) {
            $counter = $this->enemySwing($save['player'], $session['enemy'], $stats);
            $log[] = $counter['log'];
            $save['player'] = $counter['player'];
        }

        return $this->finalize($deviceHash, $save, $session, $log);
    }

    /**
     * 自动 tick：按 elapsed_ms 推算攻击次数（双方都打），最多 max_tick_batch
     */
    public function autoTick(string $deviceHash): array
    {
        $session = $this->requireSession($deviceHash);
        $save    = $this->saves->loadOrThrow($deviceHash);

        $stats   = $this->resolvedStats($save['player']);
        $aspdMs  = (int) max(100, $stats['aspd']);
        $nowMs   = BuffSystem::nowMs();
        $elapsed = max(0, $nowMs - ($session['last_tick_ms'] ?? $nowMs));

        // 先 tick buff/debuff（涵盖 elapsed 全部时间）
        $tickRes = BuffSystem::tick($save['player'], $session['enemy'], $nowMs);
        $save['player']   = $tickRes['player'];
        $session['enemy'] = $tickRes['enemy'];
        $log = $tickRes['log'];

        $maxBatch = (int) Bootstrap::config('game.max_tick_batch', 200);
        $swings = (int) min($maxBatch, floor($elapsed / $aspdMs));
        if ($swings <= 0) {
            $session['last_tick_ms'] = $nowMs;
            $this->saveSession($deviceHash, $session);
            return ['ticked' => 0, 'log' => $log, 'session' => $session, 'player' => $save['player']];
        }

        for ($i = 0; $i < $swings; $i++) {
            if ($save['player']['hp'] <= 0 || $session['enemy']['hp'] <= 0) break;
            $report = $this->resolveSwing($save['player'], $session['enemy'], $stats, false);
            $log[] = $report['log'];
            $save['player']   = $report['player'];
            $session['enemy'] = $report['enemy'];

            if ($session['enemy']['hp'] > 0 && $save['player']['hp'] > 0) {
                $counter = $this->enemySwing($save['player'], $session['enemy'], $stats);
                $log[] = $counter['log'];
                $save['player'] = $counter['player'];
            }
        }
        $session['last_tick_ms'] = $nowMs;

        $result = $this->finalize($deviceHash, $save, $session, $log);
        $result['ticked'] = $swings;
        return $result;
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
     * @return array{log:array, player:array, enemy:array}
     */
    private function resolveSwing(array $player, array $enemy, array $stats, bool $isSkill): array
    {
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
        $damage = (int) floor($base);
        $enemy['hp'] = max(0, ($enemy['hp'] ?? 0) - $damage);

        // 吸血
        if (($stats['vamp'] ?? 0) > 0 && $damage > 0) {
            $heal = (int) ($damage * $stats['vamp']);
            $player['hp'] = min((int) $stats['maxHp'], ($player['hp'] ?? 0) + $heal);
        }

        return [
            'log'    => ['t' => 'player_hit', 'dmg' => $damage, 'crit' => $isCrit, 'enemy_hp' => $enemy['hp']],
            'player' => $player,
            'enemy'  => $enemy,
        ];
    }

    private function enemySwing(array $player, array $enemy, array $stats): array
    {
        // 敌人 debuff 调整
        $enemyEff = BuffSystem::applyEnemyDebuffsToStats($enemy);
        $atk = (float) ($enemyEff['atk'] ?? 1);
        $def = (float) ($stats['def'] ?? 0);
        $base = max(1.0, $atk * $atk / max(1, $atk + $def));
        $damage = (int) floor($base);
        $player['hp'] = max(0, ($player['hp'] ?? 0) - $damage);

        return [
            'log'    => ['t' => 'enemy_hit', 'dmg' => $damage, 'player_hp' => $player['hp']],
            'player' => $player,
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
            $save['battle'] = null;
            $save['world']['inCity'] = true;
            $log[] = ['t' => 'player_died', 'gold_lost' => $penalty];
            $this->cache->delete($this->sessionKey($deviceHash));
        } elseif (($session['enemy']['hp'] ?? 0) <= 0) {
            // 敌人死亡 → 结算
            $drops = $this->processKill($save, $session);
            $save = $drops['save'];
            $log[] = ['t' => 'enemy_killed', 'drops' => $drops['drops']];

            // 生成下一个敌人
            $session['enemy'] = $this->spawnEnemy((int) ($session['area'] ?? 0));
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
        // BOSS 额外掉落
        if (!empty($enemy['isBoss'])) {
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
        // 无尽普通怪：恢复/加成道具
        if ($area >= 15 && empty($enemy['isElite']) && empty($enemy['isBoss'])) {
            $extra = DropTable::rollEndlessNormalItem($area - 14);
            if ($extra) {
                $save['player'] = PlayerService::addItem($save['player'], $extra['id'], $extra['count']);
                $drops['items'][] = ['type' => 'item', 'payload' => $extra];
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

        $isElite = Random::chance(Constants::ELITE_SPAWN_RATE);
        $tplPool = Constants::ENEMIES;
        $tpl = $tplPool[Random::int(0, count($tplPool) - 1)];

        $hp  = (int) (50 * $mult * ($isElite ? 1.5 : 1));
        $atk = (int) (5  * $mult * ($isElite ? 1.3 : 1));
        $def = (int) (2  * $mult * ($isElite ? 1.2 : 1));
        $exp = (int) (8  * $mult);
        $gold = (int) (5 * $mult);

        return [
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
            'isBoss'  => false,
        ];
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
}
