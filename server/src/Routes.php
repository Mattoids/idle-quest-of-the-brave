<?php
declare(strict_types=1);

namespace App;

use App\Auth\AuthMiddleware;
use App\Controllers\AuthController;
use App\Controllers\BattleController;
use App\Controllers\HealthController;
use App\Controllers\MarketController;
use App\Controllers\SaveController;

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

        // 需要 token
        $r->post('/auth/logout',           [AuthController::class, 'logout'])->middleware(AuthMiddleware::class);
        $r->post('/auth/rotate-recovery',  [AuthController::class, 'rotateRecovery'])->middleware(AuthMiddleware::class);

        // ---- save ----
        $r->get('/save',       [SaveController::class, 'show'])->middleware(AuthMiddleware::class);
        $r->put('/save',       [SaveController::class, 'replace'])->middleware(AuthMiddleware::class);
        $r->post('/save/diff', [SaveController::class, 'diff'])->middleware(AuthMiddleware::class);

        // ---- battle ----
        $r->post('/battle/start',  [BattleController::class, 'start'])->middleware(AuthMiddleware::class);
        $r->post('/battle/attack', [BattleController::class, 'attack'])->middleware(AuthMiddleware::class);
        $r->post('/battle/tick',   [BattleController::class, 'tick'])->middleware(AuthMiddleware::class);
        $r->get('/battle/status',  [BattleController::class, 'status'])->middleware(AuthMiddleware::class);
        $r->post('/battle/end',    [BattleController::class, 'end'])->middleware(AuthMiddleware::class);

        // ---- market ----
        $r->get('/market/listings',           [MarketController::class, 'listings']);
        $r->get('/market/listings/:type/:id', [MarketController::class, 'show']);
        $r->post('/market/list',              [MarketController::class, 'create'])->middleware(AuthMiddleware::class);
        $r->post('/market/buy',               [MarketController::class, 'buy'])->middleware(AuthMiddleware::class);
        $r->post('/market/cancel',            [MarketController::class, 'cancel'])->middleware(AuthMiddleware::class);
        $r->get('/market/my',                 [MarketController::class, 'my'])->middleware(AuthMiddleware::class);
    }
}
