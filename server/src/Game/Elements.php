<?php
declare(strict_types=1);

namespace App\Game;

/**
 * 元素克制系统
 *
 * 与 js/game.js 中 ENEMY_ELEMENTS / getElementMultiplier 一致：
 *   - 弱点：×1.5
 *   - 抗性：×0.5
 *   - 哥布林抗所有魔法（physical 除外）
 */
final class Elements
{
    public const ENEMY_ELEMENTS = [
        '小恶魔'  => ['weak' => 'holy',      'resist' => 'dark'],
        '史莱姆'  => ['weak' => 'ice',       'resist' => 'physical'],
        '骷髅兵'  => ['weak' => 'holy',      'resist' => 'ice'],
        '蝙蝠'    => ['weak' => 'lightning', 'resist' => 'dark'],
        '野狼'    => ['weak' => 'fire',      'resist' => 'nature'],
        '哥布林'  => ['weak' => 'physical',  'resist' => 'magic'],
        '僵尸'    => ['weak' => 'fire',      'resist' => 'ice'],
        '蜘蛛'    => ['weak' => 'ice',       'resist' => 'nature'],
        '幽灵'    => ['weak' => 'holy',      'resist' => 'physical'],
        '兽人'    => ['weak' => 'nature',    'resist' => 'fire'],
    ];

    public const NAMES = [
        'fire'      => '火',
        'ice'       => '冰',
        'lightning' => '雷',
        'holy'      => '圣',
        'dark'      => '暗',
        'nature'    => '自然',
        'physical'  => '物',
    ];

    /**
     * 返回伤害倍率（1.5 / 1.0 / 0.5）
     */
    public static function multiplier(string $skillElement, string $enemyName): float
    {
        $data = self::ENEMY_ELEMENTS[$enemyName] ?? null;
        if (!$data) return 1.0;
        // 哥布林抗所有魔法（physical 不受影响）
        if (($data['resist'] ?? '') === 'magic' && $skillElement !== 'physical') {
            return 0.5;
        }
        if (($data['weak'] ?? '') === $skillElement)   return 1.5;
        if (($data['resist'] ?? '') === $skillElement) return 0.5;
        return 1.0;
    }
}
