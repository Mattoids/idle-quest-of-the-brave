<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Game\EndlessService;
use App\Game\OfflineService;
use App\Http\HttpException;
use App\Http\Request;
use App\Storage\SaveRepository;

/**
 * 进度系统：无尽模式入口 + 离线挂机补偿
 *
 *   POST /endless/enter   进入无尽模式（要求 bossDefeated[14] = true）
 *   POST /offline/claim   领取离线奖励（按 lastBattleEndTime 推算）
 */
final class ProgressController
{
    private SaveRepository $saves;

    public function __construct(?SaveRepository $saves = null)
    {
        $this->saves = $saves ?? new SaveRepository();
    }

    public function enterEndless(Request $req): array
    {
        if (!$req->deviceHash) throw HttpException::unauthorized();
        $next = $this->saves->mutate($req->deviceHash, function (array $save): array {
            return EndlessService::enter($save);
        });
        return ['currentArea' => $next['world']['currentArea'], 'player' => $next['player']];
    }

    public function claimOffline(Request $req): array
    {
        if (!$req->deviceHash) throw HttpException::unauthorized();
        $rewards = null;
        $this->saves->mutate($req->deviceHash, function (array $save) use (&$rewards): array {
            $r = OfflineService::claim($save);
            $rewards = $r['rewards'];
            return $r['save'];
        });
        return ['rewards' => $rewards];
    }
}
