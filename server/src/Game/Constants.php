<?php
declare(strict_types=1);

namespace App\Game;

/**
 * 游戏配置常量（与 js/game.js 保持权威同步）
 *
 * 维护约定：前端的 EQUIPMENT_POOL/TREASURE_POOL/SHOP_ITEMS/SKILLS/PASSIVE_BOOKS 等
 * 必须以此处为准。前端任何与服务端不一致的物品会在交易/战斗时被拒绝。
 *
 * 注意：本文件按 v4.0 版本对齐。修改时请同步更新 js/game.js。
 */
final class Constants
{
    public const GAME_VERSION = 'v4.0';

    public const MAX_ATK_SPEED = 10;
    public const AREA_DROP_RATES = [
        0.005, 0.015, 0.025, 0.035, 0.045, 0.055, 0.065, 0.075,
        0.085, 0.095, 0.105, 0.115, 0.125, 0.135, 0.15,
    ];
    public const BOSS_AREAS = [3, 6, 9, 14];
    public const CLUE_REQUIRED = [3 => 8, 6 => 12, 9 => 20, 14 => 40];
    public const CLUE_DROP_RATE = 0.15;
    public const ELITE_SPAWN_RATE = 0.15;
    public const PASSIVE_BOOK_DROP_RATE = 0.005;
    public const EQUIPMENT_DROP_RATES = [
        0.04, 0.06, 0.075, 0.09, 0.11, 0.13, 0.15, 0.165,
        0.18, 0.19, 0.20, 0.21, 0.225, 0.24, 0.26,
    ];
    public const SKILL_BOOK_DROP_RATES = [
        0, 0, 0.01, 0.015, 0.02, 0.025, 0.03, 0.035, 0.04,
        0.045, 0.05, 0.055, 0.06, 0.065, 0.075,
    ];

    public const RARITY_WEIGHTS = [
        'common'    => 55,
        'rare'      => 30,
        'epic'      => 12,
        'legendary' => 3,
        'divine'    => 1,
    ];

    public const RARITY_ORDER = [
        'common' => 1, 'rare' => 2, 'epic' => 3, 'legendary' => 4, 'divine' => 5,
    ];

    public const FORGE_BASE_COST = 200;

    public const AREAS = [
        ['name' => '新手村',   'emoji' => '🌲', 'level' => 1,   'multiplier' => 1.0],
        ['name' => '幽暗密林', 'emoji' => '🌿', 'level' => 8,   'multiplier' => 1.3],
        ['name' => '废弃矿坑', 'emoji' => '⛏️', 'level' => 15,  'multiplier' => 1.7],
        ['name' => '古代遗迹', 'emoji' => '🏛️', 'level' => 22,  'multiplier' => 2.2],
        ['name' => '熔岩洞穴', 'emoji' => '🌋', 'level' => 29,  'multiplier' => 2.8],
        ['name' => '冰封雪原', 'emoji' => '❄️', 'level' => 36,  'multiplier' => 3.5],
        ['name' => '毒雾沼泽', 'emoji' => '🐊', 'level' => 43,  'multiplier' => 4.3],
        ['name' => '暗影城堡', 'emoji' => '🏰', 'level' => 50,  'multiplier' => 5.2],
        ['name' => '龙之巢穴', 'emoji' => '🐉', 'level' => 57,  'multiplier' => 6.3],
        ['name' => '天空之城', 'emoji' => '☁️', 'level' => 64,  'multiplier' => 7.5],
        ['name' => '虚空裂隙', 'emoji' => '💠', 'level' => 71,  'multiplier' => 8.8],
        ['name' => '深渊入口', 'emoji' => '🌀', 'level' => 78,  'multiplier' => 10.2],
        ['name' => '恶魔王座', 'emoji' => '👿', 'level' => 85,  'multiplier' => 11.8],
        ['name' => '神陨之地', 'emoji' => '💀', 'level' => 92,  'multiplier' => 13.5],
        ['name' => '混沌核心', 'emoji' => '🔥', 'level' => 100, 'multiplier' => 15.5],
    ];

    public const ENEMIES = [
        ['name' => '小恶魔', 'emoji' => '👹', 'type' => 'aggressive'],
        ['name' => '史莱姆', 'emoji' => '🟢', 'type' => 'tank'],
        ['name' => '骷髅兵', 'emoji' => '💀', 'type' => 'fragile'],
        ['name' => '蝙蝠',   'emoji' => '🦇', 'type' => 'vampiric'],
        ['name' => '野狼',   'emoji' => '🐺', 'type' => 'pack'],
        ['name' => '哥布林', 'emoji' => '👺', 'type' => 'mage'],
        ['name' => '僵尸',   'emoji' => '🧟', 'type' => 'undead'],
        ['name' => '蜘蛛',   'emoji' => '🕷️', 'type' => 'poison'],
        ['name' => '幽灵',   'emoji' => '👻', 'type' => 'ethereal'],
        ['name' => '兽人',   'emoji' => '👾', 'type' => 'berserker'],
    ];

    public const BOSS_CONFIG = [
        3  => ['name' => '遗迹守卫', 'emoji' => '🗿'],
        6  => ['name' => '沼泽之主', 'emoji' => '🐊'],
        9  => ['name' => '天空领主', 'emoji' => '☁️'],
        14 => ['name' => '混沌魔神', 'emoji' => '👹'],
    ];

    /**
     * 数据池：宝物 / 装备 / 商店 / 技能 / 技能书 / 被动技能书 / 套装
     *
     * 因数据量大，按需放到 itemPools() 中懒加载（避免常量字面量长度限制）。
     */
    public static function itemPools(): array
    {
        static $cache = null;
        if ($cache !== null) return $cache;
        $cache = require __DIR__ . '/ItemPools.php';
        return $cache;
    }

    public static function treasures(): array      { return self::itemPools()['treasures']; }
    public static function equipment(): array      { return self::itemPools()['equipment']; }
    public static function shopItems(): array      { return self::itemPools()['shop_items']; }
    public static function skills(): array         { return self::itemPools()['skills']; }
    public static function skillBooks(): array     { return self::itemPools()['skill_books']; }
    public static function passiveBooks(): array   { return self::itemPools()['passive_books']; }
    public static function armorSets(): array      { return self::itemPools()['armor_sets']; }
    public static function accessorySets(): array  { return self::itemPools()['accessory_sets']; }
    public static function allSets(): array
    {
        $p = self::itemPools();
        return ($p['armor_sets'] ?? []) + ($p['accessory_sets'] ?? []);
    }

    public static function findTreasure(string $id): ?array
    {
        foreach (self::treasures() as $t) if ($t['id'] === $id) return $t;
        return null;
    }

    public static function findEquipment(string $id): ?array
    {
        foreach (self::equipment() as $e) if ($e['id'] === $id) return $e;
        return null;
    }

    public static function findShopItem(string $id): ?array
    {
        foreach (self::shopItems() as $i) if ($i['id'] === $id) return $i;
        return null;
    }

    public static function findSkill(string $id): ?array
    {
        foreach (self::skills() as $s) if ($s['id'] === $id) return $s;
        return null;
    }

    public static function findSkillBook(string $id): ?array
    {
        foreach (self::skillBooks() as $b) if ($b['id'] === $id) return $b;
        return null;
    }
}
