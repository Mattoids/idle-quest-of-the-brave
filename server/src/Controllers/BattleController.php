<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Game\BattleEngine;
use App\Http\HttpException;
use App\Http\Request;

/**
 * 战斗控制器
 *
 *   POST /battle/start    { area: int }
 *   POST /battle/attack
 *   POST /battle/tick      自动战斗心跳
 *   GET  /battle/status
 *   POST /battle/end
 */
final class BattleController
{
    private BattleEngine $engine;

    public function __construct(?BattleEngine $engine = null)
    {
        $this->engine = $engine ?? new BattleEngine();
    }

    public function start(Request $req): array
    {
        if (!$req->deviceHash) throw HttpException::unauthorized();
        $area = (int) $req->require('area');
        return $this->engine->start($req->deviceHash, $area);
    }

    public function startBoss(Request $req): array
    {
        if (!$req->deviceHash) throw HttpException::unauthorized();
        $area = (int) $req->require('area');
        return $this->engine->startBoss($req->deviceHash, $area);
    }

    public function attack(Request $req): array
    {
        if (!$req->deviceHash) throw HttpException::unauthorized();
        return $this->engine->attack($req->deviceHash);
    }

    public function skill(Request $req): array
    {
        if (!$req->deviceHash) throw HttpException::unauthorized();
        $skillId = (string) $req->require('skill_id');
        return $this->engine->castSkill($req->deviceHash, $skillId);
    }

    public function tick(Request $req): array
    {
        if (!$req->deviceHash) throw HttpException::unauthorized();
        $rounds = (int) ($req->input('rounds') ?? 30);
        return $this->engine->autoTick($req->deviceHash, $rounds);
    }

    public function status(Request $req): array
    {
        if (!$req->deviceHash) throw HttpException::unauthorized();
        return $this->engine->status($req->deviceHash);
    }

    public function end(Request $req): array
    {
        if (!$req->deviceHash) throw HttpException::unauthorized();
        return $this->engine->end($req->deviceHash);
    }
}
