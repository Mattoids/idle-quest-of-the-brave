<?php
declare(strict_types=1);

namespace App;

use App\Auth\AuthMiddleware;
use App\Controllers\AuthController;
use App\Controllers\BattleController;
use App\Controllers\HealthController;
use App\Controllers\MarketController;
use App\Controllers\NpcController;
use App\Controllers\OAuthController;
use App\Controllers\ProgressController;
use App\Controllers\SaveController;
use App\Controllers\SkillController;

/**
 * 路由表
 */
final class Routes
{
    public static function register(Router $r): void
    {
        // ---- public ----
        $r->get('/',                [HealthController::class, 'ping']);
        $r->get('/health',          [HealthController::class, 'ping']);
        $r->get('/data/constants',  [HealthController::class, 'constants']);

        // ---- auth ----
        $r->post('/auth/register',  [AuthController::class, 'register']);
        $r->post('/auth/login',     [AuthController::class, 'login']);
        $r->post('/auth/recover',   [AuthController::class, 'recover']);
        $r->post('/auth/by-hash',   [AuthController::class, 'loginByHash']);

        // ---- oauth (药丸 / invites.fun) ----
        $r->get('/auth/oauth/redirect',  [OAuthController::class, 'redirect']);
        $r->get('/auth/oauth/callback',  [OAuthController::class, 'callback']);

        // 需要 token
        $r->post('/auth/logout',           [AuthController::class, 'logout'])->middleware(AuthMiddleware::class);
        $r->post('/auth/rotate-recovery',  [AuthController::class, 'rotateRecovery'])->middleware(AuthMiddleware::class);

        // ---- save ----
        $r->get('/save',       [SaveController::class, 'show'])->middleware(AuthMiddleware::class);
        $r->put('/save',       [SaveController::class, 'replace'])->middleware(AuthMiddleware::class);
        $r->post('/save/diff',  [SaveController::class, 'diff'])->middleware(AuthMiddleware::class);
        $r->post('/save/reset', [SaveController::class, 'reset'])->middleware(AuthMiddleware::class);

        // ---- battle ----
        $r->post('/battle/start',  [BattleController::class, 'start'])->middleware(AuthMiddleware::class);
        $r->post('/battle/boss',   [BattleController::class, 'startBoss'])->middleware(AuthMiddleware::class);
        $r->post('/battle/attack', [BattleController::class, 'attack'])->middleware(AuthMiddleware::class);
        $r->post('/battle/skill',  [BattleController::class, 'skill'])->middleware(AuthMiddleware::class);
        $r->post('/battle/tick',   [BattleController::class, 'tick'])->middleware(AuthMiddleware::class);
        $r->get('/battle/status',  [BattleController::class, 'status'])->middleware(AuthMiddleware::class);
        $r->post('/battle/end',    [BattleController::class, 'end'])->middleware(AuthMiddleware::class);

        // ---- skills (NPC 技能导师) ----
        $r->get('/skills',         [SkillController::class, 'show'])->middleware(AuthMiddleware::class);
        $r->post('/skills/learn',  [SkillController::class, 'learn'])->middleware(AuthMiddleware::class);
        $r->post('/skills/upgrade',[SkillController::class, 'upgrade'])->middleware(AuthMiddleware::class);

        // ---- npc (铁匠 / 鉴定师 / 商店 / 客栈 / 精神修炼) ----
        $r->post('/npc/blacksmith/forge',     [NpcController::class, 'forge'])->middleware(AuthMiddleware::class);
        $r->post('/npc/blacksmith/refine',    [NpcController::class, 'refine'])->middleware(AuthMiddleware::class);
        $r->post('/npc/appraiser/equipment',  [NpcController::class, 'appraiseEquipment'])->middleware(AuthMiddleware::class);
        $r->post('/npc/appraiser/skillbook',  [NpcController::class, 'appraiseSkillBook'])->middleware(AuthMiddleware::class);
        $r->post('/npc/shop/buy',             [NpcController::class, 'buy'])->middleware(AuthMiddleware::class);
        $r->post('/npc/shop/use',             [NpcController::class, 'useItem'])->middleware(AuthMiddleware::class);
        $r->post('/npc/shop/sell',            [NpcController::class, 'sell'])->middleware(AuthMiddleware::class);
        $r->post('/npc/inn/rest',             [NpcController::class, 'rest'])->middleware(AuthMiddleware::class);
        $r->post('/npc/spirit/train',         [NpcController::class, 'trainSpirit'])->middleware(AuthMiddleware::class);

        // ---- progress (无尽模式 / 离线挂机) ----
        $r->post('/endless/enter',  [ProgressController::class, 'enterEndless'])->middleware(AuthMiddleware::class);
        $r->post('/offline/claim',  [ProgressController::class, 'claimOffline'])->middleware(AuthMiddleware::class);

        // ---- market ----
        $r->get('/market/listings',           [MarketController::class, 'listings']);
        $r->get('/market/listings/:type/:id', [MarketController::class, 'show']);
        $r->post('/market/list',              [MarketController::class, 'create'])->middleware(AuthMiddleware::class);
        $r->post('/market/buy',               [MarketController::class, 'buy'])->middleware(AuthMiddleware::class);
        $r->post('/market/cancel',            [MarketController::class, 'cancel'])->middleware(AuthMiddleware::class);
        $r->get('/market/my',                 [MarketController::class, 'my'])->middleware(AuthMiddleware::class);
    }
}
