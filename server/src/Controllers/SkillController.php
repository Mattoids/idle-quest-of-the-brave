<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Game\SkillEngine;
use App\Http\HttpException;
use App\Http\Request;
use App\Storage\SaveRepository;

/**
 * 技能管理：学习 / 升级
 *
 *   POST /skills/learn     { skill_id }
 *   POST /skills/upgrade   { skill_id }
 *   GET  /skills            列出已学技能
 */
final class SkillController
{
    private SaveRepository $saves;

    public function __construct(?SaveRepository $saves = null)
    {
        $this->saves = $saves ?? new SaveRepository();
    }

    public function show(Request $req): array
    {
        if (!$req->deviceHash) throw HttpException::unauthorized();
        $save = $this->saves->loadOrThrow($req->deviceHash);
        return [
            'skills' => (object) ($save['player']['skills'] ?? []),
            'mp'     => $save['player']['mp']    ?? 0,
            'maxMp'  => $save['player']['maxMp'] ?? 0,
            'spi'    => $save['player']['spi']   ?? 0,
            'gold'   => $save['player']['gold']  ?? 0,
        ];
    }

    public function learn(Request $req): array
    {
        if (!$req->deviceHash) throw HttpException::unauthorized();
        $skillId = (string) $req->require('skill_id');
        $next = $this->saves->mutate($req->deviceHash, function (array $save) use ($skillId): array {
            $save['player'] = SkillEngine::learn($save['player'], $skillId);
            return $save;
        });
        return ['ok' => true, 'skills' => (object) ($next['player']['skills'] ?? []), 'gold' => $next['player']['gold'] ?? 0];
    }

    public function upgrade(Request $req): array
    {
        if (!$req->deviceHash) throw HttpException::unauthorized();
        $skillId = (string) $req->require('skill_id');
        $next = $this->saves->mutate($req->deviceHash, function (array $save) use ($skillId): array {
            $save['player'] = SkillEngine::upgrade($save['player'], $skillId);
            return $save;
        });
        return ['ok' => true, 'skills' => (object) ($next['player']['skills'] ?? []), 'gold' => $next['player']['gold'] ?? 0];
    }
}
