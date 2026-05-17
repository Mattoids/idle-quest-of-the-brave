<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Bootstrap;
use App\Game\Constants;
use App\Http\Request;

/**
 * 健康检查与配置元信息
 */
final class HealthController
{
    public function ping(Request $req): array
    {
        return [
            'ok'        => true,
            'service'   => 'iqotb-server',
            'version'   => Constants::GAME_VERSION,
            'env'       => (string) Bootstrap::config('env'),
            'time'      => time(),
            'php'       => PHP_VERSION,
            'cache'     => (string) Bootstrap::config('cache.driver'),
        ];
    }

    public function constants(Request $req): array
    {
        // 仅暴露只读元数据，方便前端校验本地常量是否与服务端对齐
        return [
            'game_version'    => Constants::GAME_VERSION,
            'areas'           => Constants::AREAS,
            'rarity_weights'  => Constants::RARITY_WEIGHTS,
            'boss_areas'      => Constants::BOSS_AREAS,
            'clue_required'   => Constants::CLUE_REQUIRED,
            'drop_rates'      => [
                'area'        => Constants::AREA_DROP_RATES,
                'equipment'   => Constants::EQUIPMENT_DROP_RATES,
                'skill_book'  => Constants::SKILL_BOOK_DROP_RATES,
                'passive_book'=> Constants::PASSIVE_BOOK_DROP_RATE,
            ],
        ];
    }
}
