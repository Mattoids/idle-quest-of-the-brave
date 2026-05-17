<?php
declare(strict_types=1);

/**
 * 物品数据池：与 js/game.js 中的 EQUIPMENT_POOL / TREASURE_POOL / SHOP_ITEMS / SKILLS /
 * SKILL_BOOKS / PASSIVE_BOOKS / ARMOR_SETS / ACCESSORY_SETS 一一对应。
 *
 * !!! 维护重要 !!!
 * 改 game.js 时同步更新此文件。可写一个对比脚本：从 js/game.js 用正则抽出再 diff。
 */

$rarityMult = ['common' => 1, 'rare' => 2.4, 'epic' => 5, 'legendary' => 10, 'divine' => 15];

$buildArmorSet = function (string $id, string $name, string $rarity, float $tier) use ($rarityMult): array {
    $m = $rarityMult[$rarity] ?? 1;
    return [
        ['id' => "{$id}_weapon", 'setId' => $id, 'name' => "{$name}剑", 'emoji' => '⚔️', 'slot' => 'weapon', 'rarity' => $rarity, 'atk' => (int) round(5 * $m),   'sellPrice' => (int) round(30 * $tier)],
        ['id' => "{$id}_helmet", 'setId' => $id, 'name' => "{$name}盔", 'emoji' => '🪖', 'slot' => 'helmet', 'rarity' => $rarity, 'def' => (int) round(3 * $m),   'maxHp' => (int) round(10 * $m), 'sellPrice' => (int) round(25 * $tier)],
        ['id' => "{$id}_armor",  'setId' => $id, 'name' => "{$name}甲", 'emoji' => '👕', 'slot' => 'armor',  'rarity' => $rarity, 'def' => (int) round(5 * $m),   'maxHp' => (int) round(20 * $m), 'sellPrice' => (int) round(30 * $tier)],
        ['id' => "{$id}_boots",  'setId' => $id, 'name' => "{$name}靴", 'emoji' => '👢', 'slot' => 'boots',  'rarity' => $rarity, 'def' => (int) round(2 * $m),   'aspd' => (int) round(50 * $m),  'sellPrice' => (int) round(25 * $tier)],
        ['id' => "{$id}_belt",   'setId' => $id, 'name' => "{$name}带", 'emoji' => '🎗️', 'slot' => 'belt',   'rarity' => $rarity, 'maxHp' => (int) round(15 * $m),'atk'   => (int) round(2 * $m),  'sellPrice' => (int) round(25 * $tier)],
    ];
};

$buildAccessorySet = function (string $id, string $name, string $rarity, float $tier) use ($rarityMult): array {
    $m = $rarityMult[$rarity] ?? 1;
    return [
        ['id' => "{$id}_bracelet",  'setId' => $id, 'name' => "{$name}镯", 'emoji' => '💎', 'slot' => 'bracelet', 'rarity' => $rarity, 'critDmg' => round(100 * $m) / 1000, 'sellPrice' => (int) round(25 * $tier)],
        ['id' => "{$id}_bracelet2", 'setId' => $id, 'name' => "{$name}镯", 'emoji' => '💎', 'slot' => 'bracelet', 'rarity' => $rarity, 'critDmg' => round(100 * $m) / 1000, 'sellPrice' => (int) round(25 * $tier)],
        ['id' => "{$id}_necklace",  'setId' => $id, 'name' => "{$name}链", 'emoji' => '📿', 'slot' => 'necklace', 'rarity' => $rarity, 'vamp' => round(10 * $m) / 1000, 'expBonus' => round(30 * $m) / 1000, 'sellPrice' => (int) round(25 * $tier)],
        ['id' => "{$id}_jade",      'setId' => $id, 'name' => "{$name}玉", 'emoji' => '🏵️', 'slot' => 'jade',     'rarity' => $rarity, 'def' => (int) round(3 * $m), 'spi' => (int) round(1 * $m), 'sellPrice' => (int) round(25 * $tier)],
    ];
};

$treasures = [
    ['id' => 'w_stone', 'name' => '磨刀石', 'emoji' => '🪨', 'rarity' => 'common', 'stat' => 'atk', 'value' => 3, 'sellPrice' => 15],
    ['id' => 'w_shield', 'name' => '木盾', 'emoji' => '🛡️', 'rarity' => 'common', 'stat' => 'def', 'value' => 2, 'sellPrice' => 15],
    ['id' => 'w_berry', 'name' => '野莓', 'emoji' => '🫐', 'rarity' => 'common', 'stat' => 'maxHp', 'value' => 15, 'sellPrice' => 12],
    ['id' => 'w_luck', 'name' => '幸运符', 'emoji' => '🍀', 'rarity' => 'common', 'stat' => 'critDmg', 'value' => 0.10, 'sellPrice' => 18],
    ['id' => 'w_book', 'name' => '旧书', 'emoji' => '📖', 'rarity' => 'common', 'stat' => 'expBonus', 'value' => 0.05, 'sellPrice' => 15],
    ['id' => 'w_coin', 'name' => '铜币袋', 'emoji' => '🪙', 'rarity' => 'common', 'stat' => 'goldBonus', 'value' => 0.05, 'sellPrice' => 20],
    ['id' => 'b_sword', 'name' => '精钢剑', 'emoji' => '⚔️', 'rarity' => 'rare', 'stat' => 'atk', 'value' => 7, 'sellPrice' => 40],
    ['id' => 'b_armor', 'name' => '铁甲', 'emoji' => '👕', 'rarity' => 'rare', 'stat' => 'def', 'value' => 4, 'sellPrice' => 40],
    ['id' => 'b_ring', 'name' => '生命戒指', 'emoji' => '💍', 'rarity' => 'rare', 'stat' => 'maxHp', 'value' => 35, 'sellPrice' => 35],
    ['id' => 'b_eye', 'name' => '鹰眼', 'emoji' => '👁️', 'rarity' => 'rare', 'stat' => 'critDmg', 'value' => 0.25, 'sellPrice' => 45],
    ['id' => 'b_scroll', 'name' => '卷轴', 'emoji' => '📜', 'rarity' => 'rare', 'stat' => 'expBonus', 'value' => 0.10, 'sellPrice' => 40],
    ['id' => 'b_pouch', 'name' => '银袋', 'emoji' => '💰', 'rarity' => 'rare', 'stat' => 'goldBonus', 'value' => 0.10, 'sellPrice' => 50],
    ['id' => 'p_axe', 'name' => '战斧', 'emoji' => '🪓', 'rarity' => 'epic', 'stat' => 'atk', 'value' => 15, 'sellPrice' => 100],
    ['id' => 'p_plate', 'name' => '板甲', 'emoji' => '🦺', 'rarity' => 'epic', 'stat' => 'def', 'value' => 8, 'sellPrice' => 100],
    ['id' => 'p_heart', 'name' => '巨龙之心', 'emoji' => '❤️', 'rarity' => 'epic', 'stat' => 'maxHp', 'value' => 70, 'sellPrice' => 90],
    ['id' => 'p_gem', 'name' => '暴击宝石', 'emoji' => '💎', 'rarity' => 'epic', 'stat' => 'critDmg', 'value' => 0.50, 'sellPrice' => 110],
    ['id' => 'p_tome', 'name' => '魔法典籍', 'emoji' => '📚', 'rarity' => 'epic', 'stat' => 'expBonus', 'value' => 0.18, 'sellPrice' => 100],
    ['id' => 'p_chest', 'name' => '小宝箱', 'emoji' => '📦', 'rarity' => 'epic', 'stat' => 'goldBonus', 'value' => 0.18, 'sellPrice' => 120],
    ['id' => 'l_blade', 'name' => '屠龙刀', 'emoji' => '🔪', 'rarity' => 'legendary', 'stat' => 'atk', 'value' => 30, 'sellPrice' => 250],
    ['id' => 'l_shield', 'name' => '圣盾', 'emoji' => '🛡️', 'rarity' => 'legendary', 'stat' => 'def', 'value' => 15, 'sellPrice' => 250],
    ['id' => 'l_phoenix', 'name' => '凤凰之血', 'emoji' => '🔥', 'rarity' => 'legendary', 'stat' => 'maxHp', 'value' => 150, 'sellPrice' => 230],
    ['id' => 'l_star', 'name' => '星辰碎片', 'emoji' => '⭐', 'rarity' => 'legendary', 'stat' => 'critDmg', 'value' => 1.00, 'sellPrice' => 260],
    ['id' => 'l_crown', 'name' => '智慧之冠', 'emoji' => '👑', 'rarity' => 'legendary', 'stat' => 'expBonus', 'value' => 0.30, 'sellPrice' => 250],
    ['id' => 'l_gold', 'name' => '聚宝盆', 'emoji' => '🏆', 'rarity' => 'legendary', 'stat' => 'goldBonus', 'value' => 0.30, 'sellPrice' => 300],
    ['id' => 'w_stone2', 'name' => '破甲石', 'emoji' => '🔨', 'rarity' => 'common', 'stat' => 'armorPenFlat', 'value' => 2, 'sellPrice' => 20],
    ['id' => 'b_arrow', 'name' => '精钢箭头', 'emoji' => '➡️', 'rarity' => 'rare', 'stat' => 'armorPenFlat', 'value' => 5, 'sellPrice' => 50],
    ['id' => 'p_hammer', 'name' => '破甲锤', 'emoji' => '🔨', 'rarity' => 'epic', 'stat' => 'armorPenFlat', 'value' => 10, 'sellPrice' => 120],
    ['id' => 'l_spear', 'name' => '神之矛', 'emoji' => '🔱', 'rarity' => 'legendary', 'stat' => 'armorPenFlat', 'value' => 20, 'sellPrice' => 300],
    ['id' => 'w_claw', 'name' => '锐利之爪', 'emoji' => '🐾', 'rarity' => 'common', 'stat' => 'armorPenPercent', 'value' => 0.03, 'sellPrice' => 20],
    ['id' => 'b_powder', 'name' => '腐蚀粉', 'emoji' => '🧪', 'rarity' => 'rare', 'stat' => 'armorPenPercent', 'value' => 0.06, 'sellPrice' => 50],
    ['id' => 'p_crossbow', 'name' => '穿甲弩', 'emoji' => '🏹', 'rarity' => 'epic', 'stat' => 'armorPenPercent', 'value' => 0.10, 'sellPrice' => 120],
    ['id' => 'l_void', 'name' => '虚空之刃', 'emoji' => '⚫', 'rarity' => 'legendary', 'stat' => 'armorPenPercent', 'value' => 0.15, 'sellPrice' => 300],
    ['id' => 'd_nucleus', 'name' => '无尽之核', 'emoji' => '💠', 'rarity' => 'divine', 'stat' => 'atk', 'value' => 60, 'sellPrice' => 800],
    ['id' => 'd_tear', 'name' => '永恒之泪', 'emoji' => '💧', 'rarity' => 'divine', 'stat' => 'maxHp', 'value' => 300, 'sellPrice' => 800],
    ['id' => 'd_blessing', 'name' => '神明祝福', 'emoji' => '✨', 'rarity' => 'divine', 'stat' => 'expBonus', 'value' => 0.60, 'sellPrice' => 1000],
    ['id' => 't_eye', 'name' => '虚空之眼', 'emoji' => '👁️', 'rarity' => 'divine', 'stat' => 'critDmg', 'value' => 2.00, 'sellPrice' => 1200],
    ['id' => 't_heart', 'name' => '湮灭之心', 'emoji' => '💀', 'rarity' => 'divine', 'stat' => 'maxHp', 'value' => 500, 'sellPrice' => 1200],
    ['id' => 't_source', 'name' => '混沌之源', 'emoji' => '🔥', 'rarity' => 'divine', 'stat' => 'atk', 'value' => 100, 'sellPrice' => 1200],
    ['id' => 't_wheel', 'name' => '永恒之轮', 'emoji' => '🌀', 'rarity' => 'divine', 'stat' => 'expBonus', 'value' => 0.80, 'sellPrice' => 1500],
    ['id' => 't_web', 'name' => '命运织网', 'emoji' => '🕸️', 'rarity' => 'divine', 'stat' => 'vamp', 'value' => 0.15, 'sellPrice' => 1200],
    ['id' => 'r_earth', 'name' => '石化碎片', 'emoji' => '🗿', 'rarity' => 'epic', 'stat' => 'earthRes', 'value' => 0.05, 'sellPrice' => 80],
    ['id' => 'r_poison', 'name' => '解毒草', 'emoji' => '🌿', 'rarity' => 'epic', 'stat' => 'poisonRes', 'value' => 0.05, 'sellPrice' => 80],
    ['id' => 'r_lightning', 'name' => '避雷针', 'emoji' => '⚡', 'rarity' => 'epic', 'stat' => 'lightningRes', 'value' => 0.05, 'sellPrice' => 80],
    ['id' => 'r_void', 'name' => '虚空残渣', 'emoji' => '🌑', 'rarity' => 'epic', 'stat' => 'voidRes', 'value' => 0.05, 'sellPrice' => 80],
    ['id' => 'r_chaos', 'name' => '秩序水晶', 'emoji' => '🔮', 'rarity' => 'epic', 'stat' => 'chaosRes', 'value' => 0.05, 'sellPrice' => 80],
    ['id' => 'r_fire', 'name' => '耐火鳞片', 'emoji' => '🔥', 'rarity' => 'epic', 'stat' => 'fireRes', 'value' => 0.05, 'sellPrice' => 80],
];

$armorSets = [
    'set_novice_arm'         => ['name' => '学徒战甲',   'slots' => ['weapon','helmet','armor','belt','boots'], 'bonus' => ['atkMult' => 0.08, 'critDmg' => 0.20, 'earthRes' => 0.05], 'rarity' => 'common'],
    'set_miner_arm'          => ['name' => '矿工战甲',   'slots' => ['weapon','helmet','armor','belt','boots'], 'bonus' => ['atkMult' => 0.10, 'critDmg' => 0.30, 'earthRes' => 0.05], 'rarity' => 'common'],
    'set_guardian_arm'       => ['name' => '守卫战甲',   'slots' => ['weapon','helmet','armor','belt','boots'], 'bonus' => ['atkMult' => 0.12, 'critDmg' => 0.35, 'earthRes' => 0.10], 'rarity' => 'rare'],
    'set_frost_arm'          => ['name' => '寒冰战甲',   'slots' => ['weapon','helmet','armor','belt','boots'], 'bonus' => ['atkMult' => 0.13, 'critDmg' => 0.40, 'lightningRes' => 0.10], 'rarity' => 'rare'],
    'set_shadow_arm'         => ['name' => '暗影战甲',   'slots' => ['weapon','helmet','armor','belt','boots'], 'bonus' => ['atkMult' => 0.15, 'critDmg' => 0.45, 'chaosRes' => 0.10], 'rarity' => 'epic'],
    'set_dragon_arm'         => ['name' => '龙鳞战甲',   'slots' => ['weapon','helmet','armor','belt','boots'], 'bonus' => ['atkMult' => 0.18, 'critDmg' => 0.50, 'voidRes' => 0.10], 'rarity' => 'epic'],
    'set_void_arm'           => ['name' => '虚空战甲',   'slots' => ['weapon','helmet','armor','belt','boots'], 'bonus' => ['atkMult' => 0.20, 'critDmg' => 0.55, 'voidRes' => 0.10], 'rarity' => 'epic'],
    'set_demon_arm'          => ['name' => '恶魔战甲',   'slots' => ['weapon','helmet','armor','belt','boots'], 'bonus' => ['atkMult' => 0.25, 'critDmg' => 0.65, 'fireRes' => 0.10], 'rarity' => 'legendary'],
    'set_chaos_arm'          => ['name' => '混沌战甲',   'slots' => ['weapon','helmet','armor','belt','boots'], 'bonus' => ['atkMult' => 0.30, 'critDmg' => 0.80, 'chaosRes' => 0.15], 'rarity' => 'legendary'],
    'set_endless_conqueror'  => ['name' => '无尽征服者', 'slots' => ['weapon','helmet','armor','belt','boots'], 'bonus' => ['atkMult' => 0.35, 'critDmg' => 1.50, 'earthRes' => 0.10, 'lightningRes' => 0.10, 'poisonRes' => 0.10], 'rarity' => 'divine'],
    'set_endless_guardian'   => ['name' => '永恒守护者', 'slots' => ['weapon','helmet','armor','belt','boots'], 'bonus' => ['defMult' => 0.25, 'hpMult' => 0.25, 'vamp' => 0.10, 'aspdMult' => 0.15, 'voidRes' => 0.10, 'chaosRes' => 0.10], 'rarity' => 'divine'],
    'set_void_annihilator'   => ['name' => '虚空湮灭者', 'slots' => ['weapon','helmet','armor','belt','boots'], 'bonus' => ['atkMult' => 0.60, 'critDmg' => 2.00, 'armorPenFlat' => 50, 'voidRes' => 0.15, 'chaosRes' => 0.15], 'rarity' => 'divine'],
];
foreach ($armorSets as $id => &$s) { $s['id'] = $id; } unset($s);

$accessorySets = [
    'set_novice_acc'  => ['name' => '学徒饰品', 'slots' => ['bracelet','bracelet','necklace','jade'], 'bonus' => ['aspdMult' => 0.10, 'vamp' => 0.02, 'expBonus' => 0.10, 'earthRes' => 0.05], 'rarity' => 'common'],
    'set_flame_acc'   => ['name' => '烈焰饰品', 'slots' => ['bracelet','bracelet','necklace','jade'], 'bonus' => ['aspdMult' => 0.15, 'vamp' => 0.03, 'expBonus' => 0.15, 'fireRes' => 0.10], 'rarity' => 'rare'],
    'set_swamp_acc'   => ['name' => '沼泽饰品', 'slots' => ['bracelet','bracelet','necklace','jade'], 'bonus' => ['aspdMult' => 0.18, 'vamp' => 0.04, 'expBonus' => 0.20, 'poisonRes' => 0.10], 'rarity' => 'epic'],
    'set_sky_acc'     => ['name' => '天空饰品', 'slots' => ['bracelet','bracelet','necklace','jade'], 'bonus' => ['aspdMult' => 0.22, 'vamp' => 0.05, 'expBonus' => 0.25, 'lightningRes' => 0.10], 'rarity' => 'epic'],
    'set_abyss_acc'   => ['name' => '深渊饰品', 'slots' => ['bracelet','bracelet','necklace','jade'], 'bonus' => ['aspdMult' => 0.25, 'vamp' => 0.06, 'expBonus' => 0.30, 'chaosRes' => 0.10], 'rarity' => 'legendary'],
    'set_godfall_acc' => ['name' => '神陨饰品', 'slots' => ['bracelet','bracelet','necklace','jade'], 'bonus' => ['aspdMult' => 0.30, 'vamp' => 0.08, 'expBonus' => 0.35, 'lightningRes' => 0.10], 'rarity' => 'legendary'],
    'set_eternal_throne' => ['name' => '永恒圣座', 'slots' => ['bracelet','bracelet','necklace','jade'], 'bonus' => ['aspdMult' => 0.50, 'vamp' => 0.15, 'expBonus' => 0.60, 'goldBonus' => 0.50, 'earthRes' => 0.10, 'poisonRes' => 0.10, 'lightningRes' => 0.10, 'fireRes' => 0.10], 'rarity' => 'divine'],
];
foreach ($accessorySets as $id => &$s) { $s['id'] = $id; } unset($s);

// 基础装备池
$equipment = [
    ['id' => 'eq_w_iron', 'name' => '铁剑', 'emoji' => '⚔️', 'slot' => 'weapon', 'rarity' => 'common', 'atk' => 5, 'sellPrice' => 30],
    ['id' => 'eq_w_steel', 'name' => '精钢剑', 'emoji' => '⚔️', 'slot' => 'weapon', 'rarity' => 'rare', 'atk' => 12, 'sellPrice' => 80],
    ['id' => 'eq_w_mithril', 'name' => '秘银剑', 'emoji' => '⚔️', 'slot' => 'weapon', 'rarity' => 'epic', 'atk' => 25, 'sellPrice' => 200],
    ['id' => 'eq_w_dragon', 'name' => '屠龙剑', 'emoji' => '⚔️', 'slot' => 'weapon', 'rarity' => 'legendary', 'atk' => 50, 'sellPrice' => 500],
    ['id' => 'eq_h_cloth', 'name' => '布帽', 'emoji' => '🪖', 'slot' => 'helmet', 'rarity' => 'common', 'def' => 3, 'maxHp' => 10, 'sellPrice' => 25],
    ['id' => 'eq_h_iron', 'name' => '铁盔', 'emoji' => '🪖', 'slot' => 'helmet', 'rarity' => 'rare', 'def' => 8, 'maxHp' => 25, 'sellPrice' => 70],
    ['id' => 'eq_h_mithril', 'name' => '秘银盔', 'emoji' => '🪖', 'slot' => 'helmet', 'rarity' => 'epic', 'def' => 15, 'maxHp' => 50, 'sellPrice' => 180],
    ['id' => 'eq_h_dragon', 'name' => '龙鳞盔', 'emoji' => '🪖', 'slot' => 'helmet', 'rarity' => 'legendary', 'def' => 30, 'maxHp' => 100, 'sellPrice' => 450],
    ['id' => 'eq_a_cloth', 'name' => '布衣', 'emoji' => '👕', 'slot' => 'armor', 'rarity' => 'common', 'def' => 5, 'maxHp' => 20, 'sellPrice' => 30],
    ['id' => 'eq_a_iron', 'name' => '铁甲', 'emoji' => '👕', 'slot' => 'armor', 'rarity' => 'rare', 'def' => 12, 'maxHp' => 50, 'sellPrice' => 85],
    ['id' => 'eq_a_mithril', 'name' => '秘银甲', 'emoji' => '👕', 'slot' => 'armor', 'rarity' => 'epic', 'def' => 25, 'maxHp' => 100, 'sellPrice' => 220],
    ['id' => 'eq_a_dragon', 'name' => '龙鳞甲', 'emoji' => '👕', 'slot' => 'armor', 'rarity' => 'legendary', 'def' => 50, 'maxHp' => 200, 'sellPrice' => 550],
    ['id' => 'eq_b_leather', 'name' => '皮靴', 'emoji' => '👢', 'slot' => 'boots', 'rarity' => 'common', 'def' => 2, 'aspd' => 50, 'sellPrice' => 25],
    ['id' => 'eq_b_iron', 'name' => '铁靴', 'emoji' => '👢', 'slot' => 'boots', 'rarity' => 'rare', 'def' => 5, 'aspd' => 100, 'sellPrice' => 70],
    ['id' => 'eq_b_mithril', 'name' => '秘银靴', 'emoji' => '👢', 'slot' => 'boots', 'rarity' => 'epic', 'def' => 10, 'aspd' => 200, 'sellPrice' => 180],
    ['id' => 'eq_b_dragon', 'name' => '龙鳞靴', 'emoji' => '👢', 'slot' => 'boots', 'rarity' => 'legendary', 'def' => 20, 'aspd' => 400, 'sellPrice' => 450],
    ['id' => 'eq_be_leather', 'name' => '皮带', 'emoji' => '🎗️', 'slot' => 'belt', 'rarity' => 'common', 'maxHp' => 15, 'atk' => 2, 'sellPrice' => 25],
    ['id' => 'eq_be_iron', 'name' => '铁腰带', 'emoji' => '🎗️', 'slot' => 'belt', 'rarity' => 'rare', 'maxHp' => 40, 'atk' => 5, 'sellPrice' => 70],
    ['id' => 'eq_be_mithril', 'name' => '秘银腰带', 'emoji' => '🎗️', 'slot' => 'belt', 'rarity' => 'epic', 'maxHp' => 80, 'atk' => 10, 'sellPrice' => 180],
    ['id' => 'eq_be_dragon', 'name' => '龙鳞腰带', 'emoji' => '🎗️', 'slot' => 'belt', 'rarity' => 'legendary', 'maxHp' => 160, 'atk' => 20, 'sellPrice' => 450],
    ['id' => 'eq_br_bronze', 'name' => '铜手镯', 'emoji' => '💎', 'slot' => 'bracelet', 'rarity' => 'common', 'critDmg' => 0.10, 'sellPrice' => 25],
    ['id' => 'eq_br_silver', 'name' => '银手镯', 'emoji' => '💎', 'slot' => 'bracelet', 'rarity' => 'rare', 'critDmg' => 0.25, 'sellPrice' => 70],
    ['id' => 'eq_br_gold', 'name' => '金手镯', 'emoji' => '💎', 'slot' => 'bracelet', 'rarity' => 'epic', 'critDmg' => 0.50, 'sellPrice' => 180],
    ['id' => 'eq_br_dragon', 'name' => '龙鳞手镯', 'emoji' => '💎', 'slot' => 'bracelet', 'rarity' => 'legendary', 'critDmg' => 1.00, 'sellPrice' => 450],
    ['id' => 'eq_j_pearl', 'name' => '珍珠玉佩', 'emoji' => '🏵️', 'slot' => 'jade', 'rarity' => 'common', 'def' => 3, 'spi' => 1, 'sellPrice' => 25],
    ['id' => 'eq_j_green', 'name' => '翡翠玉佩', 'emoji' => '🏵️', 'slot' => 'jade', 'rarity' => 'rare', 'def' => 7, 'spi' => 2, 'sellPrice' => 70],
    ['id' => 'eq_j_royal', 'name' => '皇家玉佩', 'emoji' => '🏵️', 'slot' => 'jade', 'rarity' => 'epic', 'def' => 15, 'spi' => 4, 'sellPrice' => 180],
    ['id' => 'eq_j_dragon', 'name' => '龙纹玉佩', 'emoji' => '🏵️', 'slot' => 'jade', 'rarity' => 'legendary', 'def' => 30, 'spi' => 8, 'sellPrice' => 450],
    ['id' => 'eq_n_copper', 'name' => '铜项链', 'emoji' => '📿', 'slot' => 'necklace', 'rarity' => 'common', 'vamp' => 0.01, 'expBonus' => 0.03, 'sellPrice' => 25],
    ['id' => 'eq_n_silver', 'name' => '银项链', 'emoji' => '📿', 'slot' => 'necklace', 'rarity' => 'rare', 'vamp' => 0.02, 'expBonus' => 0.06, 'sellPrice' => 70],
    ['id' => 'eq_n_gold', 'name' => '金项链', 'emoji' => '📿', 'slot' => 'necklace', 'rarity' => 'epic', 'vamp' => 0.04, 'expBonus' => 0.12, 'sellPrice' => 180],
    ['id' => 'eq_n_dragon', 'name' => '龙纹项链', 'emoji' => '📿', 'slot' => 'necklace', 'rarity' => 'legendary', 'vamp' => 0.08, 'expBonus' => 0.25, 'sellPrice' => 450],
];
// 套装装备
$equipment = array_merge(
    $equipment,
    $buildArmorSet('set_novice_arm', '学徒', 'common', 1),
    $buildAccessorySet('set_novice_acc', '学徒', 'common', 1),
    $buildArmorSet('set_miner_arm', '矿工', 'common', 1.2),
    $buildArmorSet('set_guardian_arm', '守卫', 'rare', 2.7),
    $buildAccessorySet('set_flame_acc', '烈焰', 'rare', 2.7),
    $buildArmorSet('set_frost_arm', '寒冰', 'rare', 2.7),
    $buildAccessorySet('set_swamp_acc', '沼泽', 'epic', 7),
    $buildArmorSet('set_shadow_arm', '暗影', 'epic', 7),
    $buildArmorSet('set_dragon_arm', '龙鳞', 'epic', 7),
    $buildAccessorySet('set_sky_acc', '天空', 'epic', 7),
    $buildArmorSet('set_void_arm', '虚空', 'epic', 7),
    $buildAccessorySet('set_abyss_acc', '深渊', 'legendary', 18),
    $buildArmorSet('set_demon_arm', '恶魔', 'legendary', 18),
    $buildAccessorySet('set_godfall_acc', '神陨', 'legendary', 18),
    $buildArmorSet('set_chaos_arm', '混沌', 'legendary', 18),
    $buildArmorSet('set_endless_conqueror', '无尽征服者', 'divine', 30),
    $buildArmorSet('set_endless_guardian', '永恒守护者', 'divine', 30),
    [
        ['id' => 'set_void_annihilator_weapon', 'setId' => 'set_void_annihilator', 'name' => '湮灭之刃', 'emoji' => '⚔️', 'slot' => 'weapon', 'rarity' => 'divine', 'atk' => 125, 'sellPrice' => 1500],
        ['id' => 'set_void_annihilator_helmet', 'setId' => 'set_void_annihilator', 'name' => '湮灭之盔', 'emoji' => '🪖', 'slot' => 'helmet', 'rarity' => 'divine', 'def' => 75, 'maxHp' => 250, 'sellPrice' => 1200],
        ['id' => 'set_void_annihilator_armor',  'setId' => 'set_void_annihilator', 'name' => '湮灭之甲', 'emoji' => '👕', 'slot' => 'armor', 'rarity' => 'divine', 'def' => 125, 'maxHp' => 500, 'sellPrice' => 1500],
        ['id' => 'set_void_annihilator_boots',  'setId' => 'set_void_annihilator', 'name' => '湮灭之靴', 'emoji' => '👢', 'slot' => 'boots', 'rarity' => 'divine', 'def' => 50, 'aspd' => 1250, 'sellPrice' => 1200],
        ['id' => 'set_void_annihilator_belt',   'setId' => 'set_void_annihilator', 'name' => '湮灭之带', 'emoji' => '🎗️', 'slot' => 'belt', 'rarity' => 'divine', 'maxHp' => 375, 'atk' => 50, 'sellPrice' => 1200],
    ],
    [
        ['id' => 'set_eternal_throne_bracelet',  'setId' => 'set_eternal_throne', 'name' => '圣座之镯', 'emoji' => '💎', 'slot' => 'bracelet', 'rarity' => 'divine', 'critDmg' => 2.50, 'sellPrice' => 1200],
        ['id' => 'set_eternal_throne_bracelet2', 'setId' => 'set_eternal_throne', 'name' => '圣座之镯', 'emoji' => '💎', 'slot' => 'bracelet', 'rarity' => 'divine', 'critDmg' => 2.50, 'sellPrice' => 1200],
        ['id' => 'set_eternal_throne_necklace',  'setId' => 'set_eternal_throne', 'name' => '圣座之链', 'emoji' => '📿', 'slot' => 'necklace', 'rarity' => 'divine', 'vamp' => 0.25, 'expBonus' => 0.75, 'sellPrice' => 1200],
        ['id' => 'set_eternal_throne_jade',      'setId' => 'set_eternal_throne', 'name' => '圣座之玉', 'emoji' => '🏵️', 'slot' => 'jade', 'rarity' => 'divine', 'def' => 75, 'spi' => 25, 'sellPrice' => 1200],
    ]
);

$shopItems = [
    ['id' => 'hp_potion_s', 'name' => '小生命药水', 'emoji' => '🩹', 'desc' => '恢复30%最大生命值', 'basePrice' => 50, 'type' => 'heal', 'value' => 0.30],
    ['id' => 'hp_potion_l', 'name' => '大生命药水', 'emoji' => '🧪', 'desc' => '恢复100%最大生命值', 'basePrice' => 150, 'type' => 'heal', 'value' => 1.0],
    ['id' => 'mp_potion', 'name' => '魔力药水', 'emoji' => '💧', 'desc' => '恢复50%最大魔力值', 'basePrice' => 80, 'type' => 'mp', 'value' => 0.50],
    ['id' => 'exp_scroll', 'name' => '经验卷轴', 'emoji' => '📜', 'desc' => '经验加成+20%，持续10分钟', 'basePrice' => 300, 'type' => 'buff_exp', 'value' => 0.20, 'duration' => 600000],
    ['id' => 'atk_stone', 'name' => '攻击强化石', 'emoji' => '⚔️', 'desc' => '攻击力+15%，持续10分钟', 'basePrice' => 500, 'type' => 'buff_atk', 'value' => 0.15, 'duration' => 600000],
    ['id' => 'def_stone', 'name' => '防御强化石', 'emoji' => '🛡️', 'desc' => '防御力+15%，持续10分钟', 'basePrice' => 500, 'type' => 'buff_def', 'value' => 0.15, 'duration' => 600000],
    ['id' => 'elite_core', 'name' => '精英核心', 'emoji' => '💠', 'desc' => '永久攻击力+2', 'basePrice' => 1000, 'type' => 'permanent_atk', 'value' => 2, 'dropOnly' => true],
    ['id' => 'enhance_stone', 'name' => '强化石', 'emoji' => '🔮', 'desc' => '锻造时使用，+5% 成功率', 'basePrice' => 200, 'type' => 'enhance_stone', 'dropOnly' => true],
    ['id' => 'endless_core', 'name' => '无尽核心', 'emoji' => '💎', 'desc' => '永久 +5攻/+3防/+30血', 'basePrice' => 2000, 'type' => 'permanent_all', 'value' => ['atk' => 5, 'def' => 3, 'maxHp' => 30], 'dropOnly' => true],
    ['id' => 'divine_blessing', 'name' => '神之恩赐', 'emoji' => '🌟', 'desc' => '经验+50%金币+50% 30分钟', 'basePrice' => 1500, 'type' => 'buff_exp_gold', 'value' => ['expBonus' => 0.50, 'goldBonus' => 0.50], 'duration' => 1800000, 'dropOnly' => true],
    ['id' => 'chaos_core', 'name' => '混沌核心', 'emoji' => '🔴', 'desc' => '永久 +15攻/+10防/+100血/+5精神', 'basePrice' => 5000, 'type' => 'permanent_all', 'value' => ['atk' => 15, 'def' => 10, 'maxHp' => 100, 'spi' => 5], 'dropOnly' => true],
    ['id' => 'void_essence', 'name' => '虚空精华', 'emoji' => '💜', 'desc' => '永久暴击伤害+35%', 'basePrice' => 4000, 'type' => 'permanent_crit', 'value' => ['critDmg' => 0.35], 'dropOnly' => true],
    ['id' => 'annihilation_potion', 'name' => '湮灭药水', 'emoji' => '⚗️', 'desc' => '攻击+80%攻速+80% 20分钟', 'basePrice' => 3000, 'type' => 'buff_atk_aspd', 'value' => ['atkMult' => 0.80, 'aspdMult' => 0.80], 'duration' => 1200000, 'dropOnly' => true],
    ['id' => 'endless_hp_potion', 'name' => '无尽生命药剂', 'emoji' => '🍷', 'desc' => '完全恢复生命', 'basePrice' => 400, 'type' => 'heal', 'value' => 1.0, 'dropOnly' => true],
    ['id' => 'endless_mp_potion', 'name' => '无尽魔力药剂', 'emoji' => '🧴', 'desc' => '完全恢复魔力', 'basePrice' => 350, 'type' => 'mp', 'value' => 1.0, 'dropOnly' => true],
    ['id' => 'phoenix_feather', 'name' => '凤凰之羽', 'emoji' => '🪶', 'desc' => '完全恢复', 'basePrice' => 800, 'type' => 'heal_full', 'dropOnly' => true],
    ['id' => 'battle_scroll', 'name' => '战吼卷轴', 'emoji' => '📯', 'desc' => '攻击+30% 15分钟', 'basePrice' => 700, 'type' => 'buff_atk', 'value' => 0.30, 'duration' => 900000, 'dropOnly' => true],
    ['id' => 'guardian_scroll', 'name' => '守护卷轴', 'emoji' => '📜', 'desc' => '防御+30% 15分钟', 'basePrice' => 700, 'type' => 'buff_def', 'value' => 0.30, 'duration' => 900000, 'dropOnly' => true],
    ['id' => 'haste_scroll', 'name' => '疾速卷轴', 'emoji' => '💨', 'desc' => '攻速+30% 15分钟', 'basePrice' => 800, 'type' => 'buff_aspd', 'value' => 0.30, 'duration' => 900000, 'dropOnly' => true],
];

$skills = [
    ['id' => 'fireball',       'name' => '火球术',  'element' => 'fire',      'type' => 'damage',           'baseDmg' => 20, 'mpCost' => 15, 'cooldown' => 3000, 'learnCost' => 100, 'upgradeCost' => 80, 'maxLevel' => 10, 'isBasic' => true,  'debuff' => ['type' => 'burn',   'duration' => 5000, 'value' => 0.03, 'chance' => 0.50]],
    ['id' => 'ice_arrow',      'name' => '冰箭',    'element' => 'ice',       'type' => 'damage',           'baseDmg' => 18, 'mpCost' => 12, 'cooldown' => 2500, 'learnCost' => 100, 'upgradeCost' => 80, 'maxLevel' => 10, 'isBasic' => true,  'debuff' => ['type' => 'freeze', 'duration' => 4000, 'value' => 0.25, 'chance' => 0.55]],
    ['id' => 'heal',           'name' => '治疗术',  'element' => 'holy',      'type' => 'heal',             'baseDmg' => 30, 'mpCost' => 20, 'cooldown' => 5000, 'learnCost' => 100, 'upgradeCost' => 80, 'maxLevel' => 10, 'isBasic' => true],
    ['id' => 'shield',         'name' => '护盾术',  'element' => 'holy',      'type' => 'buff',             'baseDmg' => 15, 'mpCost' => 15, 'cooldown' => 8000, 'learnCost' => 120, 'upgradeCost' => 90, 'maxLevel' => 10, 'isBasic' => true,  'buffDuration' => 10000],
    ['id' => 'flame_storm',    'name' => '烈焰风暴','element' => 'fire',      'type' => 'damage',           'baseDmg' => 60, 'mpCost' => 40, 'cooldown' => 6000, 'learnCost' => 0,   'upgradeCost' => 200,'maxLevel' => 5,  'isBasic' => false, 'debuff' => ['type' => 'burn',   'duration' => 6000, 'value' => 0.04, 'chance' => 0.70]],
    ['id' => 'thunder_strike', 'name' => '雷霆一击','element' => 'lightning', 'type' => 'damage',           'baseDmg' => 70, 'mpCost' => 45, 'cooldown' => 7000, 'learnCost' => 0,   'upgradeCost' => 220,'maxLevel' => 5,  'isBasic' => false, 'debuff' => ['type' => 'freeze', 'duration' => 3000, 'value' => 0.35, 'chance' => 0.50]],
    ['id' => 'shadow_bolt',    'name' => '暗影箭',  'element' => 'dark',      'type' => 'damage_lifesteal', 'baseDmg' => 45, 'mpCost' => 30, 'cooldown' => 5000, 'learnCost' => 0,   'upgradeCost' => 180,'maxLevel' => 5,  'isBasic' => false, 'debuff' => ['type' => 'curse',  'duration' => 5000, 'value' => 0.25, 'chance' => 0.50]],
    ['id' => 'holy_judgment',  'name' => '圣光审判','element' => 'holy',      'type' => 'damage',           'baseDmg' => 50, 'mpCost' => 35, 'cooldown' => 6000, 'learnCost' => 0,   'upgradeCost' => 200,'maxLevel' => 5,  'isBasic' => false, 'debuff' => ['type' => 'weaken', 'duration' => 5000, 'value' => 0.25, 'chance' => 0.45]],
    ['id' => 'frost_nova',     'name' => '冰冻新星','element' => 'ice',       'type' => 'damage',           'baseDmg' => 55, 'mpCost' => 38, 'cooldown' => 6500, 'learnCost' => 0,   'upgradeCost' => 200,'maxLevel' => 5,  'isBasic' => false, 'debuff' => ['type' => 'freeze', 'duration' => 5000, 'value' => 0.40, 'chance' => 0.65]],
    ['id' => 'poison_mist',    'name' => '毒雾',    'element' => 'nature',    'type' => 'dot',              'baseDmg' => 12, 'mpCost' => 25, 'cooldown' => 10000,'learnCost' => 0,   'upgradeCost' => 180,'maxLevel' => 5,  'isBasic' => false, 'dotDuration' => 5000, 'dotInterval' => 1000, 'debuff' => ['type' => 'poison', 'duration' => 5000, 'value' => 0.02, 'chance' => 0.70]],
    ['id' => 'void_annihilation','name' => '虚空湮灭','element' => 'dark',    'type' => 'damage',           'baseDmg' => 180,'mpCost' => 100,'cooldown' => 18000,'learnCost' => 0,   'upgradeCost' => 800,'maxLevel' => 3,  'isBasic' => false, 'isForbidden' => true, 'ignoreDef' => true],
];

$skillBooks = [
    ['id' => 'book_flame_storm',      'skillId' => 'flame_storm',       'name' => '烈焰风暴秘籍', 'emoji' => '📕', 'rarity' => 'epic',      'sellPrice' => 150],
    ['id' => 'book_thunder_strike',   'skillId' => 'thunder_strike',    'name' => '雷霆一击秘籍', 'emoji' => '📕', 'rarity' => 'epic',      'sellPrice' => 160],
    ['id' => 'book_shadow_bolt',      'skillId' => 'shadow_bolt',       'name' => '暗影箭秘籍',   'emoji' => '📕', 'rarity' => 'rare',      'sellPrice' => 120],
    ['id' => 'book_holy_judgment',    'skillId' => 'holy_judgment',     'name' => '圣光审判秘籍', 'emoji' => '📕', 'rarity' => 'epic',      'sellPrice' => 150],
    ['id' => 'book_frost_nova',       'skillId' => 'frost_nova',        'name' => '冰冻新星秘籍', 'emoji' => '📕', 'rarity' => 'epic',      'sellPrice' => 150],
    ['id' => 'book_poison_mist',      'skillId' => 'poison_mist',       'name' => '毒雾秘籍',     'emoji' => '📕', 'rarity' => 'rare',      'sellPrice' => 120],
    ['id' => 'book_void_annihilation','skillId' => 'void_annihilation', 'name' => '虚空湮灭禁咒', 'emoji' => '📕', 'rarity' => 'divine',    'sellPrice' => 2000],
];

$passiveBooks = [
    ['id' => 'passive_earth',     'name' => '石化抗性手册', 'rarity' => 'epic',      'effect' => ['earthRes' => 0.20]],
    ['id' => 'passive_poison',    'name' => '毒物免疫指南', 'rarity' => 'epic',      'effect' => ['poisonRes' => 0.20]],
    ['id' => 'passive_lightning', 'name' => '雷霆屏障卷轴', 'rarity' => 'epic',      'effect' => ['lightningRes' => 0.20]],
    ['id' => 'passive_void',      'name' => '虚空护盾典籍', 'rarity' => 'legendary', 'effect' => ['voidRes' => 0.20]],
    ['id' => 'passive_chaos',     'name' => '混沌守护秘典', 'rarity' => 'legendary', 'effect' => ['chaosRes' => 0.20]],
    ['id' => 'passive_fire',      'name' => '耐火皮肤手册', 'rarity' => 'epic',      'effect' => ['fireRes' => 0.20]],
    ['id' => 'passive_tenacity',  'name' => '坚韧之心',     'rarity' => 'legendary', 'effect' => ['tenacity' => 0.20]],
];

return [
    'treasures'      => $treasures,
    'equipment'      => $equipment,
    'shop_items'     => $shopItems,
    'skills'         => $skills,
    'skill_books'    => $skillBooks,
    'passive_books'  => $passiveBooks,
    'armor_sets'     => $armorSets,
    'accessory_sets' => $accessorySets,
];
