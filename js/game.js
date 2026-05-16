const SAVE_KEY = 'idleRpgGame_save_v6';
const GAME_VERSION = 'v3.3';
const MAX_ATK_SPEED = 10;
const AREA_DROP_RATES = [0.005, 0.015, 0.025, 0.035, 0.045, 0.055, 0.065, 0.075, 0.085, 0.095, 0.105, 0.115, 0.125, 0.135, 0.15];
const BOSS_AREAS = [3, 6, 9, 14];
const BOSS_CONFIG = {
    3: { name: '遗迹守卫', emoji: '🗿' },
    6: { name: '沼泽之主', emoji: '🐊' },
    9: { name: '天空领主', emoji: '☁️' },
    14: { name: '混沌魔神', emoji: '👹' }
};
const CLUE_REQUIRED = { 3: 8, 6: 12, 9: 20, 14: 40 };
const CLUE_DROP_RATE = 0.15;
const ELITE_SPAWN_RATE = 0.15;

const TREASURE_POOL = [
    { id: 'w_stone', name: '磨刀石', emoji: '🪨', rarity: 'common', stat: 'atk', value: 3, sellPrice: 15 },
    { id: 'w_shield', name: '木盾', emoji: '🛡️', rarity: 'common', stat: 'def', value: 2, sellPrice: 15 },
    { id: 'w_berry', name: '野莓', emoji: '🫐', rarity: 'common', stat: 'maxHp', value: 15, sellPrice: 12 },
    { id: 'w_luck', name: '幸运符', emoji: '🍀', rarity: 'common', stat: 'critDmg', value: 0.10, sellPrice: 18 },
    { id: 'w_book', name: '旧书', emoji: '📖', rarity: 'common', stat: 'expBonus', value: 0.05, sellPrice: 15 },
    { id: 'w_coin', name: '铜币袋', emoji: '🪙', rarity: 'common', stat: 'goldBonus', value: 0.05, sellPrice: 20 },
    { id: 'b_sword', name: '精钢剑', emoji: '⚔️', rarity: 'rare', stat: 'atk', value: 7, sellPrice: 40 },
    { id: 'b_armor', name: '铁甲', emoji: '👕', rarity: 'rare', stat: 'def', value: 4, sellPrice: 40 },
    { id: 'b_ring', name: '生命戒指', emoji: '💍', rarity: 'rare', stat: 'maxHp', value: 35, sellPrice: 35 },
    { id: 'b_eye', name: '鹰眼', emoji: '👁️', rarity: 'rare', stat: 'critDmg', value: 0.25, sellPrice: 45 },
    { id: 'b_scroll', name: '卷轴', emoji: '📜', rarity: 'rare', stat: 'expBonus', value: 0.10, sellPrice: 40 },
    { id: 'b_pouch', name: '银袋', emoji: '💰', rarity: 'rare', stat: 'goldBonus', value: 0.10, sellPrice: 50 },
    { id: 'p_axe', name: '战斧', emoji: '🪓', rarity: 'epic', stat: 'atk', value: 15, sellPrice: 100 },
    { id: 'p_plate', name: '板甲', emoji: '🦺', rarity: 'epic', stat: 'def', value: 8, sellPrice: 100 },
    { id: 'p_heart', name: '巨龙之心', emoji: '❤️', rarity: 'epic', stat: 'maxHp', value: 70, sellPrice: 90 },
    { id: 'p_gem', name: '暴击宝石', emoji: '💎', rarity: 'epic', stat: 'critDmg', value: 0.50, sellPrice: 110 },
    { id: 'p_tome', name: '魔法典籍', emoji: '📚', rarity: 'epic', stat: 'expBonus', value: 0.18, sellPrice: 100 },
    { id: 'p_chest', name: '小宝箱', emoji: '📦', rarity: 'epic', stat: 'goldBonus', value: 0.18, sellPrice: 120 },
    { id: 'l_blade', name: '屠龙刀', emoji: '🔪', rarity: 'legendary', stat: 'atk', value: 30, sellPrice: 250 },
    { id: 'l_shield', name: '圣盾', emoji: '🛡️', rarity: 'legendary', stat: 'def', value: 15, sellPrice: 250 },
    { id: 'l_phoenix', name: '凤凰之血', emoji: '🔥', rarity: 'legendary', stat: 'maxHp', value: 150, sellPrice: 230 },
    { id: 'l_star', name: '星辰碎片', emoji: '⭐', rarity: 'legendary', stat: 'critDmg', value: 1.00, sellPrice: 260 },
    { id: 'l_crown', name: '智慧之冠', emoji: '👑', rarity: 'legendary', stat: 'expBonus', value: 0.30, sellPrice: 250 },
    { id: 'l_gold', name: '聚宝盆', emoji: '🏆', rarity: 'legendary', stat: 'goldBonus', value: 0.30, sellPrice: 300 },
    { id: 'w_stone2', name: '破甲石', emoji: '🔨', rarity: 'common', stat: 'armorPenFlat', value: 2, sellPrice: 20 },
    { id: 'b_arrow', name: '精钢箭头', emoji: '➡️', rarity: 'rare', stat: 'armorPenFlat', value: 5, sellPrice: 50 },
    { id: 'p_hammer', name: '破甲锤', emoji: '🔨', rarity: 'epic', stat: 'armorPenFlat', value: 10, sellPrice: 120 },
    { id: 'l_spear', name: '神之矛', emoji: '🔱', rarity: 'legendary', stat: 'armorPenFlat', value: 20, sellPrice: 300 },
    { id: 'w_claw', name: '锐利之爪', emoji: '🐾', rarity: 'common', stat: 'armorPenPercent', value: 0.03, sellPrice: 20 },
    { id: 'b_powder', name: '腐蚀粉', emoji: '🧪', rarity: 'rare', stat: 'armorPenPercent', value: 0.06, sellPrice: 50 },
    { id: 'p_crossbow', name: '穿甲弩', emoji: '🏹', rarity: 'epic', stat: 'armorPenPercent', value: 0.10, sellPrice: 120 },
    { id: 'l_void', name: '虚空之刃', emoji: '⚫', rarity: 'legendary', stat: 'armorPenPercent', value: 0.15, sellPrice: 300 },
    // 神器级宝物（无尽模式专属）
    { id: 'd_nucleus', name: '无尽之核', emoji: '💠', rarity: 'divine', stat: 'atk', value: 60, sellPrice: 800 },
    { id: 'd_tear', name: '永恒之泪', emoji: '💧', rarity: 'divine', stat: 'maxHp', value: 300, sellPrice: 800 },
    { id: 'd_blessing', name: '神明祝福', emoji: '✨', rarity: 'divine', stat: 'expBonus', value: 0.60, sellPrice: 1000 },
    // 超脱级宝物（超越神器，无尽模式深层专属）
    { id: 't_eye', name: '虚空之眼', emoji: '👁️', rarity: 'divine', stat: 'critDmg', value: 2.00, sellPrice: 1200 },
    { id: 't_heart', name: '湮灭之心', emoji: '💀', rarity: 'divine', stat: 'maxHp', value: 500, sellPrice: 1200 },
    { id: 't_source', name: '混沌之源', emoji: '🔥', rarity: 'divine', stat: 'atk', value: 100, sellPrice: 1200 },
    { id: 't_wheel', name: '永恒之轮', emoji: '🌀', rarity: 'divine', stat: 'expBonus', value: 0.80, sellPrice: 1500 },
    { id: 't_web', name: '命运织网', emoji: '🕸️', rarity: 'divine', stat: 'vamp', value: 0.15, sellPrice: 1200 },
    // 克制属性宝物（少量抗性，稀有度限定史诗/传说）
    { id: 'r_earth', name: '石化碎片', emoji: '🗿', rarity: 'epic', stat: 'earthRes', value: 0.05, sellPrice: 80 },
    { id: 'r_poison', name: '解毒草', emoji: '🌿', rarity: 'epic', stat: 'poisonRes', value: 0.05, sellPrice: 80 },
    { id: 'r_lightning', name: '避雷针', emoji: '⚡', rarity: 'epic', stat: 'lightningRes', value: 0.05, sellPrice: 80 },
    { id: 'r_void', name: '虚空残渣', emoji: '🌑', rarity: 'epic', stat: 'voidRes', value: 0.05, sellPrice: 80 },
    { id: 'r_chaos', name: '秩序水晶', emoji: '🔮', rarity: 'epic', stat: 'chaosRes', value: 0.05, sellPrice: 80 },
    { id: 'r_fire', name: '耐火鳞片', emoji: '🔥', rarity: 'epic', stat: 'fireRes', value: 0.05, sellPrice: 80 }
];

const RARITY_CONFIG = {
    common: { weight: 55, color: '#ccc', label: '普通' },
    rare: { weight: 30, color: '#4facfe', label: '稀有' },
    epic: { weight: 12, color: '#a55eea', label: '史诗' },
    legendary: { weight: 3, color: '#ff9f43', label: '传说' },
    divine: { weight: 1, color: '#ff0044', label: '神器' }
};

// ========== 装备系统常量 ==========
const ARMOR_SETS = {
    set_novice_arm: { id: 'set_novice_arm', name: '学徒战甲', slots: ['weapon','helmet','armor','belt','boots'], bonus: { atkMult: 0.08, critDmg: 0.20, earthRes: 0.05 }, desc: '攻击力+8%、暴击伤害+20%、土抗+5%', rarity: 'common' },
    set_miner_arm: { id: 'set_miner_arm', name: '矿工战甲', slots: ['weapon','helmet','armor','belt','boots'], bonus: { atkMult: 0.10, critDmg: 0.30, earthRes: 0.05 }, desc: '攻击力+10%、暴击伤害+30%、土抗+5%', rarity: 'common' },
    set_guardian_arm: { id: 'set_guardian_arm', name: '守卫战甲', slots: ['weapon','helmet','armor','belt','boots'], bonus: { atkMult: 0.12, critDmg: 0.35, earthRes: 0.10 }, desc: '攻击力+12%、暴击伤害+35%、土抗+10%', rarity: 'rare' },
    set_frost_arm: { id: 'set_frost_arm', name: '寒冰战甲', slots: ['weapon','helmet','armor','belt','boots'], bonus: { atkMult: 0.13, critDmg: 0.40, lightningRes: 0.10 }, desc: '攻击力+13%、暴击伤害+40%、雷抗+10%', rarity: 'rare' },
    set_shadow_arm: { id: 'set_shadow_arm', name: '暗影战甲', slots: ['weapon','helmet','armor','belt','boots'], bonus: { atkMult: 0.15, critDmg: 0.45, chaosRes: 0.10 }, desc: '攻击力+15%、暴击伤害+45%、混沌抗+10%', rarity: 'epic' },
    set_dragon_arm: { id: 'set_dragon_arm', name: '龙鳞战甲', slots: ['weapon','helmet','armor','belt','boots'], bonus: { atkMult: 0.18, critDmg: 0.50, voidRes: 0.10 }, desc: '攻击力+18%、暴击伤害+50%、虚空抗+10%', rarity: 'epic' },
    set_void_arm: { id: 'set_void_arm', name: '虚空战甲', slots: ['weapon','helmet','armor','belt','boots'], bonus: { atkMult: 0.20, critDmg: 0.55, voidRes: 0.10 }, desc: '攻击力+20%、暴击伤害+55%、虚空抗+10%', rarity: 'epic' },
    set_demon_arm: { id: 'set_demon_arm', name: '恶魔战甲', slots: ['weapon','helmet','armor','belt','boots'], bonus: { atkMult: 0.25, critDmg: 0.65, fireRes: 0.10 }, desc: '攻击力+25%、暴击伤害+65%、火抗+10%', rarity: 'legendary' },
    set_chaos_arm: { id: 'set_chaos_arm', name: '混沌战甲', slots: ['weapon','helmet','armor','belt','boots'], bonus: { atkMult: 0.30, critDmg: 0.80, chaosRes: 0.15 }, desc: '攻击力+30%、暴击伤害+80%、混沌抗+15%', rarity: 'legendary' },
    set_endless_conqueror: { id: 'set_endless_conqueror', name: '无尽征服者', slots: ['weapon','helmet','armor','belt','boots'], bonus: { atkMult: 0.35, critDmg: 1.50, earthRes: 0.10, lightningRes: 0.10, poisonRes: 0.10 }, desc: '攻击力+35%、暴击伤害+150%、全元素抗性+10%', rarity: 'divine' },
    set_endless_guardian: { id: 'set_endless_guardian', name: '永恒守护者', slots: ['weapon','helmet','armor','belt','boots'], bonus: { defMult: 0.25, hpMult: 0.25, vamp: 0.10, aspdMult: 0.15, voidRes: 0.10, chaosRes: 0.10 }, desc: '防御力+25%、生命+25%、吸血+10%、攻速+15%、虚空抗+10%、混沌抗+10%', rarity: 'divine' },
    // 无尽模式超脱级战甲套装（超越神器）
    set_void_annihilator: { id: 'set_void_annihilator', name: '虚空湮灭者', slots: ['weapon','helmet','armor','belt','boots'], bonus: { atkMult: 0.60, critDmg: 2.00, armorPenFlat: 50, voidRes: 0.15, chaosRes: 0.15 }, desc: '攻击力+60%、暴击伤害+200%、破甲+50、虚空抗+15%、混沌抗+15%', rarity: 'divine' }
};
const ACCESSORY_SETS = {
    set_novice_acc: { id: 'set_novice_acc', name: '学徒饰品', slots: ['bracelet','bracelet','necklace','jade'], bonus: { aspdMult: 0.10, vamp: 0.02, expBonus: 0.10, earthRes: 0.05 }, desc: '攻速+10%、吸血+2%、经验+10%、土抗+5%', rarity: 'common' },
    set_flame_acc: { id: 'set_flame_acc', name: '烈焰饰品', slots: ['bracelet','bracelet','necklace','jade'], bonus: { aspdMult: 0.15, vamp: 0.03, expBonus: 0.15, fireRes: 0.10 }, desc: '攻速+15%、吸血+3%、经验+15%、火抗+10%', rarity: 'rare' },
    set_swamp_acc: { id: 'set_swamp_acc', name: '沼泽饰品', slots: ['bracelet','bracelet','necklace','jade'], bonus: { aspdMult: 0.18, vamp: 0.04, expBonus: 0.20, poisonRes: 0.10 }, desc: '攻速+18%、吸血+4%、经验+20%、毒抗+10%', rarity: 'epic' },
    set_sky_acc: { id: 'set_sky_acc', name: '天空饰品', slots: ['bracelet','bracelet','necklace','jade'], bonus: { aspdMult: 0.22, vamp: 0.05, expBonus: 0.25, lightningRes: 0.10 }, desc: '攻速+22%、吸血+5%、经验+25%、雷抗+10%', rarity: 'epic' },
    set_abyss_acc: { id: 'set_abyss_acc', name: '深渊饰品', slots: ['bracelet','bracelet','necklace','jade'], bonus: { aspdMult: 0.25, vamp: 0.06, expBonus: 0.30, chaosRes: 0.10 }, desc: '攻速+25%、吸血+6%、经验+30%、混沌抗+10%', rarity: 'legendary' },
    set_godfall_acc: { id: 'set_godfall_acc', name: '神陨饰品', slots: ['bracelet','bracelet','necklace','jade'], bonus: { aspdMult: 0.30, vamp: 0.08, expBonus: 0.35, lightningRes: 0.10 }, desc: '攻速+30%、吸血+8%、经验+35%、雷抗+10%', rarity: 'legendary' },
    // 无尽模式超脱级饰品套装（超越神器）
    set_eternal_throne: { id: 'set_eternal_throne', name: '永恒圣座', slots: ['bracelet','bracelet','necklace','jade'], bonus: { aspdMult: 0.50, vamp: 0.15, expBonus: 0.60, goldBonus: 0.50, earthRes: 0.10, poisonRes: 0.10, lightningRes: 0.10, fireRes: 0.10 }, desc: '攻速+50%、吸血+15%、经验+60%、金币+50%、四元素抗性+10%', rarity: 'divine' }
};
const ALL_SETS = { ...ARMOR_SETS, ...ACCESSORY_SETS };
const AREA_SETS = {
    0: 'set_novice_arm', 1: 'set_novice_acc',
    2: 'set_miner_arm', 3: 'set_guardian_arm',
    4: 'set_flame_acc', 5: 'set_frost_arm',
    6: 'set_swamp_acc', 7: 'set_shadow_arm',
    8: 'set_dragon_arm', 9: 'set_sky_acc',
    10: 'set_void_arm', 11: 'set_abyss_acc',
    12: 'set_demon_arm', 13: 'set_godfall_acc',
    14: 'set_chaos_arm'
};

function buildArmorSet(id, name, rarity, tier) {
    const m = { common: 1, rare: 2.4, epic: 5, legendary: 10, divine: 15 }[rarity] || 1;
    return [
        { id: `${id}_weapon`, setId: id, name: `${name}剑`, emoji: '⚔️', slot: 'weapon', rarity: rarity, atk: Math.round(5 * m), sellPrice: Math.round(30 * tier) },
        { id: `${id}_helmet`, setId: id, name: `${name}盔`, emoji: '🪖', slot: 'helmet', rarity: rarity, def: Math.round(3 * m), maxHp: Math.round(10 * m), sellPrice: Math.round(25 * tier) },
        { id: `${id}_armor`, setId: id, name: `${name}甲`, emoji: '👕', slot: 'armor', rarity: rarity, def: Math.round(5 * m), maxHp: Math.round(20 * m), sellPrice: Math.round(30 * tier) },
        { id: `${id}_boots`, setId: id, name: `${name}靴`, emoji: '👢', slot: 'boots', rarity: rarity, def: Math.round(2 * m), aspd: Math.round(50 * m), sellPrice: Math.round(25 * tier) },
        { id: `${id}_belt`, setId: id, name: `${name}带`, emoji: '🎗️', slot: 'belt', rarity: rarity, maxHp: Math.round(15 * m), atk: Math.round(2 * m), sellPrice: Math.round(25 * tier) }
    ];
}
function buildAccessorySet(id, name, rarity, tier) {
    const m = { common: 1, rare: 2.4, epic: 5, legendary: 10, divine: 15 }[rarity] || 1;
    return [
        { id: `${id}_bracelet`, setId: id, name: `${name}镯`, emoji: '💎', slot: 'bracelet', rarity: rarity, critDmg: Math.round(100 * m) / 1000, sellPrice: Math.round(25 * tier) },
        { id: `${id}_bracelet2`, setId: id, name: `${name}镯`, emoji: '💎', slot: 'bracelet', rarity: rarity, critDmg: Math.round(100 * m) / 1000, sellPrice: Math.round(25 * tier) },
        { id: `${id}_necklace`, setId: id, name: `${name}链`, emoji: '📿', slot: 'necklace', rarity: rarity, vamp: Math.round(10 * m) / 1000, expBonus: Math.round(30 * m) / 1000, sellPrice: Math.round(25 * tier) },
        { id: `${id}_jade`, setId: id, name: `${name}玉`, emoji: '🏵️', slot: 'jade', rarity: rarity, def: Math.round(3 * m), spi: Math.round(1 * m), sellPrice: Math.round(25 * tier) }
    ];
}

const EQUIPMENT_SLOTS = {
    necklace: { name: '项链', emoji: '📿' },
    helmet: { name: '帽子', emoji: '🪖' },
    jade: { name: '玉佩', emoji: '🏵️' },
    weapon: { name: '武器', emoji: '⚔️' },
    armor: { name: '衣服', emoji: '👕' },
    belt: { name: '腰带', emoji: '🎗️' },
    bracelet_0: { name: '手镯', emoji: '💎' },
    boots: { name: '靴子', emoji: '👢' },
    bracelet_1: { name: '手镯', emoji: '💎' }
};

const EQUIPMENT_POOL = [
    // 武器
    { id: 'eq_w_iron', name: '铁剑', emoji: '⚔️', slot: 'weapon', rarity: 'common', atk: 5, sellPrice: 30 },
    { id: 'eq_w_steel', name: '精钢剑', emoji: '⚔️', slot: 'weapon', rarity: 'rare', atk: 12, sellPrice: 80 },
    { id: 'eq_w_mithril', name: '秘银剑', emoji: '⚔️', slot: 'weapon', rarity: 'epic', atk: 25, sellPrice: 200 },
    { id: 'eq_w_dragon', name: '屠龙剑', emoji: '⚔️', slot: 'weapon', rarity: 'legendary', atk: 50, sellPrice: 500 },
    // 帽子
    { id: 'eq_h_cloth', name: '布帽', emoji: '🪖', slot: 'helmet', rarity: 'common', def: 3, maxHp: 10, sellPrice: 25 },
    { id: 'eq_h_iron', name: '铁盔', emoji: '🪖', slot: 'helmet', rarity: 'rare', def: 8, maxHp: 25, sellPrice: 70 },
    { id: 'eq_h_mithril', name: '秘银盔', emoji: '🪖', slot: 'helmet', rarity: 'epic', def: 15, maxHp: 50, sellPrice: 180 },
    { id: 'eq_h_dragon', name: '龙鳞盔', emoji: '🪖', slot: 'helmet', rarity: 'legendary', def: 30, maxHp: 100, sellPrice: 450 },
    // 衣服
    { id: 'eq_a_cloth', name: '布衣', emoji: '👕', slot: 'armor', rarity: 'common', def: 5, maxHp: 20, sellPrice: 30 },
    { id: 'eq_a_iron', name: '铁甲', emoji: '👕', slot: 'armor', rarity: 'rare', def: 12, maxHp: 50, sellPrice: 85 },
    { id: 'eq_a_mithril', name: '秘银甲', emoji: '👕', slot: 'armor', rarity: 'epic', def: 25, maxHp: 100, sellPrice: 220 },
    { id: 'eq_a_dragon', name: '龙鳞甲', emoji: '👕', slot: 'armor', rarity: 'legendary', def: 50, maxHp: 200, sellPrice: 550 },
    // 靴子
    { id: 'eq_b_leather', name: '皮靴', emoji: '👢', slot: 'boots', rarity: 'common', def: 2, aspd: 50, sellPrice: 25 },
    { id: 'eq_b_iron', name: '铁靴', emoji: '👢', slot: 'boots', rarity: 'rare', def: 5, aspd: 100, sellPrice: 70 },
    { id: 'eq_b_mithril', name: '秘银靴', emoji: '👢', slot: 'boots', rarity: 'epic', def: 10, aspd: 200, sellPrice: 180 },
    { id: 'eq_b_dragon', name: '龙鳞靴', emoji: '👢', slot: 'boots', rarity: 'legendary', def: 20, aspd: 400, sellPrice: 450 },
    // 腰带
    { id: 'eq_be_leather', name: '皮带', emoji: '🎗️', slot: 'belt', rarity: 'common', maxHp: 15, atk: 2, sellPrice: 25 },
    { id: 'eq_be_iron', name: '铁腰带', emoji: '🎗️', slot: 'belt', rarity: 'rare', maxHp: 40, atk: 5, sellPrice: 70 },
    { id: 'eq_be_mithril', name: '秘银腰带', emoji: '🎗️', slot: 'belt', rarity: 'epic', maxHp: 80, atk: 10, sellPrice: 180 },
    { id: 'eq_be_dragon', name: '龙鳞腰带', emoji: '🎗️', slot: 'belt', rarity: 'legendary', maxHp: 160, atk: 20, sellPrice: 450 },
    // 手镯
    { id: 'eq_br_bronze', name: '铜手镯', emoji: '💎', slot: 'bracelet', rarity: 'common', critDmg: 0.10, sellPrice: 25 },
    { id: 'eq_br_silver', name: '银手镯', emoji: '💎', slot: 'bracelet', rarity: 'rare', critDmg: 0.25, sellPrice: 70 },
    { id: 'eq_br_gold', name: '金手镯', emoji: '💎', slot: 'bracelet', rarity: 'epic', critDmg: 0.50, sellPrice: 180 },
    { id: 'eq_br_dragon', name: '龙鳞手镯', emoji: '💎', slot: 'bracelet', rarity: 'legendary', critDmg: 1.00, sellPrice: 450 },
    // 玉佩
    { id: 'eq_j_pearl', name: '珍珠玉佩', emoji: '🏵️', slot: 'jade', rarity: 'common', def: 3, spi: 1, sellPrice: 25 },
    { id: 'eq_j_green', name: '翡翠玉佩', emoji: '🏵️', slot: 'jade', rarity: 'rare', def: 7, spi: 2, sellPrice: 70 },
    { id: 'eq_j_royal', name: '皇家玉佩', emoji: '🏵️', slot: 'jade', rarity: 'epic', def: 15, spi: 4, sellPrice: 180 },
    { id: 'eq_j_dragon', name: '龙纹玉佩', emoji: '🏵️', slot: 'jade', rarity: 'legendary', def: 30, spi: 8, sellPrice: 450 },
    // 项链
    { id: 'eq_n_copper', name: '铜项链', emoji: '📿', slot: 'necklace', rarity: 'common', vamp: 0.01, expBonus: 0.03, sellPrice: 25 },
    { id: 'eq_n_silver', name: '银项链', emoji: '📿', slot: 'necklace', rarity: 'rare', vamp: 0.02, expBonus: 0.06, sellPrice: 70 },
    { id: 'eq_n_gold', name: '金项链', emoji: '📿', slot: 'necklace', rarity: 'epic', vamp: 0.04, expBonus: 0.12, sellPrice: 180 },
    { id: 'eq_n_dragon', name: '龙纹项链', emoji: '📿', slot: 'necklace', rarity: 'legendary', vamp: 0.08, expBonus: 0.25, sellPrice: 450 },
    // 套装装备
    ...buildArmorSet('set_novice_arm', '学徒', 'common', 1),
    ...buildAccessorySet('set_novice_acc', '学徒', 'common', 1),
    ...buildArmorSet('set_miner_arm', '矿工', 'common', 1.2),
    ...buildArmorSet('set_guardian_arm', '守卫', 'rare', 2.7),
    ...buildAccessorySet('set_flame_acc', '烈焰', 'rare', 2.7),
    ...buildArmorSet('set_frost_arm', '寒冰', 'rare', 2.7),
    ...buildAccessorySet('set_swamp_acc', '沼泽', 'epic', 7),
    ...buildArmorSet('set_shadow_arm', '暗影', 'epic', 7),
    ...buildArmorSet('set_dragon_arm', '龙鳞', 'epic', 7),
    ...buildAccessorySet('set_sky_acc', '天空', 'epic', 7),
    ...buildArmorSet('set_void_arm', '虚空', 'epic', 7),
    ...buildAccessorySet('set_abyss_acc', '深渊', 'legendary', 18),
    ...buildArmorSet('set_demon_arm', '恶魔', 'legendary', 18),
    ...buildAccessorySet('set_godfall_acc', '神陨', 'legendary', 18),
    ...buildArmorSet('set_chaos_arm', '混沌', 'legendary', 18),
    // 无尽模式神器套装
    ...buildArmorSet('set_endless_conqueror', '无尽征服者', 'divine', 30),
    ...buildArmorSet('set_endless_guardian', '永恒守护者', 'divine', 30),
    // 无尽模式超脱级套装（超越神器）
    // 虚空湮灭者 - 战甲5件套
    { id: 'set_void_annihilator_weapon', setId: 'set_void_annihilator', name: '湮灭之刃', emoji: '⚔️', slot: 'weapon', rarity: 'divine', atk: 125, sellPrice: 1500 },
    { id: 'set_void_annihilator_helmet', setId: 'set_void_annihilator', name: '湮灭之盔', emoji: '🪖', slot: 'helmet', rarity: 'divine', def: 75, maxHp: 250, sellPrice: 1200 },
    { id: 'set_void_annihilator_armor', setId: 'set_void_annihilator', name: '湮灭之甲', emoji: '👕', slot: 'armor', rarity: 'divine', def: 125, maxHp: 500, sellPrice: 1500 },
    { id: 'set_void_annihilator_boots', setId: 'set_void_annihilator', name: '湮灭之靴', emoji: '👢', slot: 'boots', rarity: 'divine', def: 50, aspd: 1250, sellPrice: 1200 },
    { id: 'set_void_annihilator_belt', setId: 'set_void_annihilator', name: '湮灭之带', emoji: '🎗️', slot: 'belt', rarity: 'divine', maxHp: 375, atk: 50, sellPrice: 1200 },
    // 永恒圣座 - 饰品4件套
    { id: 'set_eternal_throne_bracelet', setId: 'set_eternal_throne', name: '圣座之镯', emoji: '💎', slot: 'bracelet', rarity: 'divine', critDmg: 2.50, sellPrice: 1200 },
    { id: 'set_eternal_throne_bracelet2', setId: 'set_eternal_throne', name: '圣座之镯', emoji: '💎', slot: 'bracelet', rarity: 'divine', critDmg: 2.50, sellPrice: 1200 },
    { id: 'set_eternal_throne_necklace', setId: 'set_eternal_throne', name: '圣座之链', emoji: '📿', slot: 'necklace', rarity: 'divine', vamp: 0.25, expBonus: 0.75, sellPrice: 1200 },
    { id: 'set_eternal_throne_jade', setId: 'set_eternal_throne', name: '圣座之玉', emoji: '🏵️', slot: 'jade', rarity: 'divine', def: 75, spi: 25, sellPrice: 1200 }
];

const EQUIPMENT_DROP_RATES = [0.04, 0.06, 0.075, 0.09, 0.11, 0.13, 0.15, 0.165, 0.18, 0.19, 0.20, 0.21, 0.225, 0.24, 0.26];

// ========== 商店商品 ==========
const SHOP_ITEMS = [
    { id: 'hp_potion_s', name: '小生命药水', emoji: '🩹', desc: '恢复30%最大生命值', basePrice: 50, type: 'heal', value: 0.30 },
    { id: 'hp_potion_l', name: '大生命药水', emoji: '🧪', desc: '恢复100%最大生命值', basePrice: 150, type: 'heal', value: 1.0 },
    { id: 'mp_potion', name: '魔力药水', emoji: '💧', desc: '恢复50%最大魔力值', basePrice: 80, type: 'mp', value: 0.50 },
    { id: 'exp_scroll', name: '经验卷轴', emoji: '📜', desc: '经验加成+20%，持续10分钟', basePrice: 300, type: 'buff_exp', value: 0.20, duration: 600000 },
    { id: 'atk_stone', name: '攻击强化石', emoji: '⚔️', desc: '攻击力+15%，持续10分钟', basePrice: 500, type: 'buff_atk', value: 0.15, duration: 600000 },
    { id: 'def_stone', name: '防御强化石', emoji: '🛡️', desc: '防御力+15%，持续10分钟', basePrice: 500, type: 'buff_def', value: 0.15, duration: 600000 },
    { id: 'elite_core', name: '精英核心', emoji: '💠', desc: '蕴含精英怪物力量的核心，使用后永久攻击力+2', basePrice: 1000, type: 'permanent_atk', value: 2, dropOnly: true },
    { id: 'enhance_stone', name: '强化石', emoji: '🔮', desc: '铁匠铺锻造时使用，每个增加5%成功率', basePrice: 200, type: 'enhance_stone', dropOnly: true },
    // 无尽模式特有道具
    { id: 'endless_core', name: '无尽核心', emoji: '💎', desc: '蕴含无尽虚空之力的核心，使用后永久攻击力+5、防御力+3、最大生命+30', basePrice: 2000, type: 'permanent_all', value: { atk: 5, def: 3, maxHp: 30 }, dropOnly: true },
    { id: 'divine_blessing', name: '神之恩赐', emoji: '🌟', desc: '神明的祝福，经验加成+50%、金币加成+50%，持续30分钟', basePrice: 1500, type: 'buff_exp_gold', value: { expBonus: 0.50, goldBonus: 0.50 }, duration: 1800000, dropOnly: true },
    // 无尽模式超脱级道具（超越现有）
    { id: 'chaos_core', name: '混沌核心', emoji: '🔴', desc: '蕴含混沌之力的核心，使用后永久攻击力+15、防御力+10、最大生命+100、精神+5', basePrice: 5000, type: 'permanent_all', value: { atk: 15, def: 10, maxHp: 100, spi: 5 }, dropOnly: true },
    { id: 'void_essence', name: '虚空精华', emoji: '💜', desc: '虚空凝聚的精华，使用后永久暴击伤害+35%', basePrice: 4000, type: 'permanent_crit', value: { critDmg: 0.35 }, dropOnly: true },
    { id: 'annihilation_potion', name: '湮灭药水', emoji: '⚗️', desc: '传说中的禁药，攻击力+80%、攻速+80%，持续20分钟', basePrice: 3000, type: 'buff_atk_aspd', value: { atkMult: 0.80, aspdMult: 0.80 }, duration: 1200000, dropOnly: true },
    // 无尽模式普通怪掉落的恢复/加成型道具
    { id: 'endless_hp_potion', name: '无尽生命药剂', emoji: '🍷', desc: '蕴含无尽生命力的药剂，使用后完全恢复生命值', basePrice: 400, type: 'heal', value: 1.0, dropOnly: true },
    { id: 'endless_mp_potion', name: '无尽魔力药剂', emoji: '🧴', desc: '蕴含无尽魔力的药剂，使用后完全恢复魔力值', basePrice: 350, type: 'mp', value: 1.0, dropOnly: true },
    { id: 'phoenix_feather', name: '凤凰之羽', emoji: '🪶', desc: '神鸟的羽毛，使用后完全恢复生命与魔力', basePrice: 800, type: 'heal_full', dropOnly: true },
    { id: 'battle_scroll', name: '战吼卷轴', emoji: '📯', desc: '激发战意的卷轴，攻击力+30%，持续15分钟', basePrice: 700, type: 'buff_atk', value: 0.30, duration: 900000, dropOnly: true },
    { id: 'guardian_scroll', name: '守护卷轴', emoji: '📜', desc: '守护之力的卷轴，防御力+30%，持续15分钟', basePrice: 700, type: 'buff_def', value: 0.30, duration: 900000, dropOnly: true },
    { id: 'haste_scroll', name: '疾速卷轴', emoji: '💨', desc: '蕴含风之神力的卷轴，攻速+30%，持续15分钟', basePrice: 800, type: 'buff_aspd', value: 0.30, duration: 900000, dropOnly: true },
];

// 无尽模式普通小怪可掉落的恢复/加成型道具池
const ENDLESS_NORMAL_DROP_ITEMS = [
    'endless_hp_potion', 'endless_mp_potion', 'phoenix_feather',
    'battle_scroll', 'guardian_scroll', 'haste_scroll'
];

// 铁匠打造价格配置
const FORGE_BASE_COST = 200;
const FORGE_SLOT_COST = {
    weapon: 1.0, helmet: 0.8, armor: 0.9, ring: 0.7, bracelet: 0.7, necklace: 0.8
};

// ========== 技能系统常量 ==========
const ELEMENTS = {
    fire: { name: '火', emoji: '🔥', color: '#e74c3c' },
    ice: { name: '冰', emoji: '❄️', color: '#3498db' },
    lightning: { name: '雷', emoji: '⚡', color: '#f1c40f' },
    holy: { name: '圣', emoji: '✨', color: '#f39c12' },
    dark: { name: '暗', emoji: '🌑', color: '#8e44ad' },
    nature: { name: '自然', emoji: '🌿', color: '#2ecc71' },
    physical: { name: '物', emoji: '⚔️', color: '#95a5a6' }
};

const SKILLS = [
    { id: 'fireball', name: '火球术', emoji: '🔥', element: 'fire', type: 'damage',
      desc: '发射火球造成单体魔法伤害，有概率灼烧敌人', baseDmg: 20, mpCost: 15, cooldown: 3000,
      learnCost: 100, upgradeCost: 80, maxLevel: 10, isBasic: true,
      debuff: { type: 'burn', duration: 5000, value: 0.03, chance: 0.50 } },
    { id: 'ice_arrow', name: '冰箭', emoji: '❄️', element: 'ice', type: 'damage',
      desc: '射出冰箭造成单体伤害，有概率冰冻减速', baseDmg: 18, mpCost: 12, cooldown: 2500,
      learnCost: 100, upgradeCost: 80, maxLevel: 10, isBasic: true,
      debuff: { type: 'freeze', duration: 4000, value: 0.25, chance: 0.55 } },
    { id: 'heal', name: '治疗术', emoji: '💚', element: 'holy', type: 'heal',
      desc: '恢复自身生命值', baseDmg: 30, mpCost: 20, cooldown: 5000,
      learnCost: 100, upgradeCost: 80, maxLevel: 10, isBasic: true },
    { id: 'shield', name: '护盾术', emoji: '🛡️', element: 'holy', type: 'buff',
      desc: '获得临时防御加成（持续10秒）', baseDmg: 15, mpCost: 15, cooldown: 8000, buffDuration: 10000,
      learnCost: 120, upgradeCost: 90, maxLevel: 10, isBasic: true },
    { id: 'flame_storm', name: '烈焰风暴', emoji: '🌋', element: 'fire', type: 'damage',
      desc: '召唤烈焰风暴造成大量伤害，高概率灼烧', baseDmg: 60, mpCost: 40, cooldown: 6000,
      learnCost: 0, upgradeCost: 200, maxLevel: 5, isBasic: false,
      debuff: { type: 'burn', duration: 6000, value: 0.04, chance: 0.70 } },
    { id: 'thunder_strike', name: '雷霆一击', emoji: '⚡', element: 'lightning', type: 'damage',
      desc: '召唤雷电造成巨大伤害，有概率麻痹减速', baseDmg: 70, mpCost: 45, cooldown: 7000,
      learnCost: 0, upgradeCost: 220, maxLevel: 5, isBasic: false,
      debuff: { type: 'freeze', duration: 3000, value: 0.35, chance: 0.50 } },
    { id: 'shadow_bolt', name: '暗影箭', emoji: '🌑', element: 'dark', type: 'damage_lifesteal',
      desc: '暗影箭造成伤害并吸血30%，有概率诅咒削弱攻击', baseDmg: 45, mpCost: 30, cooldown: 5000,
      learnCost: 0, upgradeCost: 180, maxLevel: 5, isBasic: false,
      debuff: { type: 'curse', duration: 5000, value: 0.25, chance: 0.50 } },
    { id: 'holy_judgment', name: '圣光审判', emoji: '✨', element: 'holy', type: 'damage',
      desc: '圣光对邪恶生物造成额外50%伤害，有概率虚弱防御', baseDmg: 50, mpCost: 35, cooldown: 6000,
      learnCost: 0, upgradeCost: 200, maxLevel: 5, isBasic: false,
      debuff: { type: 'weaken', duration: 5000, value: 0.25, chance: 0.45 } },
    { id: 'frost_nova', name: '冰冻新星', emoji: '❄️', element: 'ice', type: 'damage',
      desc: '释放冰冻新星造成高额伤害，高概率冰冻减速', baseDmg: 55, mpCost: 38, cooldown: 6500,
      learnCost: 0, upgradeCost: 200, maxLevel: 5, isBasic: false,
      debuff: { type: 'freeze', duration: 5000, value: 0.40, chance: 0.65 } },
    { id: 'poison_mist', name: '毒雾', emoji: '💀', element: 'nature', type: 'dot',
      desc: '释放毒雾持续造成伤害（5秒内每秒一次），高概率中毒', baseDmg: 12, mpCost: 25, cooldown: 10000,
      learnCost: 0, upgradeCost: 180, maxLevel: 5, isBasic: false, dotDuration: 5000, dotInterval: 1000,
      debuff: { type: 'poison', duration: 5000, value: 0.02, chance: 0.70 } },
    // 禁咒级技能（无尽模式专属）
    { id: 'void_annihilation', name: '虚空湮灭', emoji: '☠️', element: 'dark', type: 'damage',
      desc: '召唤虚空之力对敌人造成毁灭性打击，伤害无视防御', baseDmg: 180, mpCost: 100, cooldown: 18000,
      learnCost: 0, upgradeCost: 800, maxLevel: 3, isBasic: false, isForbidden: true }
];

const SKILL_BOOKS = [
    { id: 'book_flame_storm', skillId: 'flame_storm', name: '烈焰风暴秘籍', emoji: '📕', rarity: 'epic', sellPrice: 150 },
    { id: 'book_thunder_strike', skillId: 'thunder_strike', name: '雷霆一击秘籍', emoji: '📕', rarity: 'epic', sellPrice: 160 },
    { id: 'book_shadow_bolt', skillId: 'shadow_bolt', name: '暗影箭秘籍', emoji: '📕', rarity: 'rare', sellPrice: 120 },
    { id: 'book_holy_judgment', skillId: 'holy_judgment', name: '圣光审判秘籍', emoji: '📕', rarity: 'epic', sellPrice: 150 },
    { id: 'book_frost_nova', skillId: 'frost_nova', name: '冰冻新星秘籍', emoji: '📕', rarity: 'epic', sellPrice: 150 },
    { id: 'book_poison_mist', skillId: 'poison_mist', name: '毒雾秘籍', emoji: '📕', rarity: 'rare', sellPrice: 120 },
    // 禁咒级技能书（无尽模式专属）
    { id: 'book_void_annihilation', skillId: 'void_annihilation', name: '虚空湮灭禁咒', emoji: '📕', rarity: 'divine', sellPrice: 2000 }
];

// 被动技能书定义（BOSS专属掉落，超低概率）
const PASSIVE_BOOKS = [
    { id: 'passive_earth', name: '石化抗性手册', emoji: '📘', rarity: 'epic', desc: '减少石化持续时间20%', effect: { earthRes: 0.20 }, sellPrice: 300 },
    { id: 'passive_poison', name: '毒物免疫指南', emoji: '📗', rarity: 'epic', desc: '毒伤降低20%', effect: { poisonRes: 0.20 }, sellPrice: 300 },
    { id: 'passive_lightning', name: '雷霆屏障卷轴', emoji: '📙', rarity: 'epic', desc: '雷伤降低20%', effect: { lightningRes: 0.20 }, sellPrice: 300 },
    { id: 'passive_void', name: '虚空护盾典籍', emoji: '📕', rarity: 'legendary', desc: '虚空吞噬效果降低20%', effect: { voidRes: 0.20 }, sellPrice: 500 },
    { id: 'passive_chaos', name: '混沌守护秘典', emoji: '📓', rarity: 'legendary', desc: '混沌领域抵抗率+20%', effect: { chaosRes: 0.20 }, sellPrice: 500 },
    { id: 'passive_fire', name: '耐火皮肤手册', emoji: '📔', rarity: 'epic', desc: '燃烧伤害降低20%', effect: { fireRes: 0.20 }, sellPrice: 300 },
    { id: 'passive_tenacity', name: '坚韧之心', emoji: '💎', rarity: 'legendary', desc: '控制减免+20%，每次被控后获得3秒霸体', effect: { tenacity: 0.20 }, sellPrice: 600 }
];
const PASSIVE_BOOK_DROP_RATE = 0.005; // BOSS掉落被动技能书的基础概率 0.5%

const ENEMY_ELEMENTS = {
    '小恶魔': { weak: 'holy', resist: 'dark' },
    '史莱姆': { weak: 'ice', resist: 'physical' },
    '骷髅兵': { weak: 'holy', resist: 'ice' },
    '蝙蝠': { weak: 'lightning', resist: 'dark' },
    '野狼': { weak: 'fire', resist: 'nature' },
    '哥布林': { weak: 'physical', resist: 'magic' },
    '僵尸': { weak: 'fire', resist: 'ice' },
    '蜘蛛': { weak: 'ice', resist: 'nature' },
    '幽灵': { weak: 'holy', resist: 'physical' },
    '兽人': { weak: 'nature', resist: 'fire' }
};

const SKILL_BOOK_DROP_RATES = [0, 0, 0.01, 0.015, 0.02, 0.025, 0.03, 0.035, 0.04, 0.045, 0.05, 0.055, 0.06, 0.065, 0.075];

function createDefaultSave() {
    return {
        player: {
            level: 1, exp: 0, maxExp: 100, hp: 100, maxHp: 100,
            atk: 10, def: 5, aspd: 1000, gold: 0, kills: 0,
            crit: 0, critDmg: 2, vamp: 0,
            spi: 10, maxMp: 50, mp: 50,
            treasures: {},
            atkLevel: 0, defLevel: 0, hpLevel: 0,
            aspdLevel: 0, critLevel: 0, vampLevel: 0,
            spiLevel: 0,
            skills: {},
            skillBooks: {},
            passives: {},
            buffs: {},
            equipments: {},
            equipmentBag: [],
            // 抗性字段（克制体系）
            earthRes: 0, poisonRes: 0, lightningRes: 0,
            voidRes: 0, chaosRes: 0, fireRes: 0,
            tenacity: 0,
            // 反制状态
            counterState: { voidShield: false, chaosReflux: false, stunImmune: 0 },
            // 说定状态：开启后不掉落物品，改为扣除金币
            settledMode: false,
            // 负面状态（怪物施加的限时debuff）
            debuffs: {}
        },
        currentArea: 0,
        bossDefeated: Array(15).fill(false),
        bossFled: Array(15).fill(false),
        clues: { 3: 0, 6: 0, 9: 0, 14: 0 },
        fightingBoss: false
    };
}

let game = {
    player: null, enemy: null,
    autoBattle: false, autoBattleTimer: null,
    autoStrengthen: false,
    autoRecover: false,
    autoSell: { equipment: false, skillBooks: false, equipMaxRarity: 'rare', bookMaxRarity: 'rare' },
    _renderBagTimeout: null,
    lastPlayerAttack: 0, lastEnemyAttack: 0,
    lastBattleEndTime: null,
    currentArea: 0,
    inCity: false,
    bossDefeated: Array(15).fill(false),
    bossFled: Array(15).fill(false),
    clues: { 3: 0, 6: 0, 9: 0, 14: 0 },
    fightingBoss: false,
    areas: [
        { name: '新手村', emoji: '🌲', level: 1, multiplier: 1.0 },
        { name: '幽暗密林', emoji: '🌿', level: 8, multiplier: 1.3 },
        { name: '废弃矿坑', emoji: '⛏️', level: 15, multiplier: 1.7 },
        { name: '古代遗迹', emoji: '🏛️', level: 22, multiplier: 2.2 },
        { name: '熔岩洞穴', emoji: '🌋', level: 29, multiplier: 2.8 },
        { name: '冰封雪原', emoji: '❄️', level: 36, multiplier: 3.5 },
        { name: '毒雾沼泽', emoji: '🐊', level: 43, multiplier: 4.3 },
        { name: '暗影城堡', emoji: '🏰', level: 50, multiplier: 5.2 },
        { name: '龙之巢穴', emoji: '🐉', level: 57, multiplier: 6.3 },
        { name: '天空之城', emoji: '☁️', level: 64, multiplier: 7.5 },
        { name: '虚空裂隙', emoji: '💠', level: 71, multiplier: 8.8 },
        { name: '深渊入口', emoji: '🌀', level: 78, multiplier: 10.2 },
        { name: '恶魔王座', emoji: '👿', level: 85, multiplier: 11.8 },
        { name: '神陨之地', emoji: '💀', level: 92, multiplier: 13.5 },
        { name: '混沌核心', emoji: '🔥', level: 100, multiplier: 15.5 }
    ],
    enemies: [
        { name: '小恶魔', emoji: '👹', type: 'aggressive', desc: '攻击力较高' },
        { name: '史莱姆', emoji: '🟢', type: 'tank', desc: '生命值较高' },
        { name: '骷髅兵', emoji: '💀', type: 'fragile', desc: '攻高血低' },
        { name: '蝙蝠', emoji: '🦇', type: 'vampiric', desc: '攻击附带吸血' },
        { name: '野狼', emoji: '🐺', type: 'pack', desc: '攻击速度较快' },
        { name: '哥布林', emoji: '👺', type: 'mage', desc: '拥有魔法抗性' },
        { name: '僵尸', emoji: '🧟', type: 'undead', desc: '死亡可复活一次' },
        { name: '蜘蛛', emoji: '🕷️', type: 'poison', desc: '攻击附带中毒' },
        { name: '幽灵', emoji: '👻', type: 'ethereal', desc: '拥有闪避能力' },
        { name: '兽人', emoji: '👾', type: 'berserker', desc: '低血时狂暴' }
    ]
};

const TREASURE_FILTERS = new Set();
let currentBagTab = 'treasure';
let currentEquipmentFilter = 'all';
let currentItemFilter = 'all';
let currentAppraiserFilter = 'all';

let _confirmResolve = null;

function showConfirm(message) {
    return new Promise((resolve) => {
        _confirmResolve = resolve;
        const modal = document.getElementById('confirmModal');
        const msg = document.getElementById('confirmMessage');
        const okBtn = document.getElementById('confirmOkBtn');
        const cancelBtn = document.getElementById('confirmCancelBtn');
        if (!modal || !msg) { resolve(false); return; }
        msg.textContent = message;
        modal.style.display = 'flex';

        const onOk = () => { cleanup(); resolveConfirm(true); };
        const onCancel = () => { cleanup(); resolveConfirm(false); };
        const onKey = (e) => {
            if (e.key === 'Escape') { cleanup(); resolveConfirm(false); }
            else if (e.key === 'Enter') { cleanup(); resolveConfirm(true); }
        };

        function cleanup() {
            okBtn.removeEventListener('click', onOk);
            cancelBtn.removeEventListener('click', onCancel);
            document.removeEventListener('keydown', onKey);
        }

        okBtn.addEventListener('click', onOk);
        cancelBtn.addEventListener('click', onCancel);
        document.addEventListener('keydown', onKey);
    });
}

function resolveConfirm(result) {
    const modal = document.getElementById('confirmModal');
    if (modal) modal.style.display = 'none';
    if (_confirmResolve) {
        _confirmResolve(result);
        _confirmResolve = null;
    }
}

function switchBagTab(tab) {
    currentBagTab = tab;
    document.querySelectorAll('.bag-tab').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tab);
    });
    renderBag();
}

function toggleAutoStrengthen() {
    game.autoStrengthen = !game.autoStrengthen;
    renderBag();
    log(game.autoStrengthen ? '⚡ 自动强化已开启' : '⚡ 自动强化已关闭', 'log-loot');
}

function checkAutoStrengthen() {
    if (!game.autoStrengthen || !game.player) return;
    const treasures = game.player.treasures || {};
    let entries = Object.entries(treasures).filter(([_, d]) => d && d.count > 0);
    if (TREASURE_FILTERS.size > 0) {
        const typeFilters = Array.from(TREASURE_FILTERS).filter(f => f !== 'upgradeable');
        if (typeFilters.length > 0) {
            entries = entries.filter(([tid, _]) => {
                const t = TREASURE_POOL.find(x => x.id === tid);
                return t && typeFilters.includes(t.stat);
            });
        }
    }
    if (TREASURE_FILTERS.has('upgradeable')) {
        entries = entries.filter(([_, d]) => d.count > 1);
    }
    for (const [tid, data] of entries) {
        if (data.count <= 1) continue;
        const t = TREASURE_POOL.find(x => x.id === tid);
        if (!t) continue;
        const cost = Math.floor(t.sellPrice * 0.5 * (data.level || 1));
        if (game.player.gold >= cost) {
            strengthenTreasure(tid);
            return;
        }
    }
}

setInterval(checkAutoStrengthen, 300);

function toggleAutoSell(type) {
    const as = game.autoSell;
    as[type] = !as[type];
    renderBag();
    const typeLabel = type === 'equipment' ? '装备' : '技能书';
    log(as[type] ? `💰 ${typeLabel}自动出售已开启` : `💰 ${typeLabel}自动出售已关闭`, 'log-loot');
}

function setAutoSellRarity(type, rarity) {
    const as = game.autoSell;
    if (type === 'equipment') {
        as.equipMaxRarity = rarity;
    } else {
        as.bookMaxRarity = rarity;
    }
    renderBag();
}

function checkAutoSell() {
    if (!game.autoSell || !game.player) return;
    const as = game.autoSell;
    if (!as.equipment && !as.skillBooks) return;
    const equipMaxOrder = RARITY_ORDER[as.equipMaxRarity] || 2;
    const bookMaxOrder = RARITY_ORDER[as.bookMaxRarity] || 2;
    let soldCount = 0;
    const maxSellPerCheck = 5;

    // 自动出售装备
    if (as.equipment) {
        const bag = game.player.equipmentBag || [];
        for (let i = bag.length - 1; i >= 0 && soldCount < maxSellPerCheck; i--) {
            const item = bag[i];
            const eqDef = EQUIPMENT_POOL.find(e => e.id === item.id);
            if (!eqDef) continue;
            if (item.refine > 0) continue;
            const rarityOrder = RARITY_ORDER[eqDef.rarity] || 0;
            if (rarityOrder <= equipMaxOrder) {
                bag.splice(i, 1);
                game.player.gold += eqDef.sellPrice;
                log(`💰 自动出售了 ${eqDef.emoji} ${eqDef.name}，获得 ${formatNumber(eqDef.sellPrice)} 金币`, 'log-loot');
                soldCount++;
            }
        }
    }

    // 自动出售技能书
    if (as.skillBooks) {
        const books = game.player.skillBooks || {};
        for (const [bookId, data] of Object.entries(books)) {
            if (soldCount >= maxSellPerCheck) break;
            if (!data || data.count <= 0) continue;
            const book = SKILL_BOOKS.find(b => b.id === bookId);
            if (!book) continue;
            const rarityOrder = RARITY_ORDER[book.rarity] || 0;
            if (rarityOrder <= bookMaxOrder) {
                data.count--;
                if (data.count <= 0) delete game.player.skillBooks[bookId];
                game.player.gold += book.sellPrice;
                log(`💰 自动出售了 ${book.emoji} ${book.name}，获得 ${formatNumber(book.sellPrice)} 金币`, 'log-loot');
                soldCount++;
            }
        }
    }

    if (soldCount > 0) { updateUI(); renderBag(); }
}

setInterval(checkAutoSell, 500);

function toggleTreasureFilter(filter) {
    if (filter === 'upgradeable') {
        const isActive = TREASURE_FILTERS.has('upgradeable');
        if (isActive) TREASURE_FILTERS.delete('upgradeable');
        else TREASURE_FILTERS.add('upgradeable');
    } else {
        if (TREASURE_FILTERS.has(filter)) TREASURE_FILTERS.delete(filter);
        else TREASURE_FILTERS.add(filter);
    }
    renderBag();
}

function clearTreasureFilters() {
    TREASURE_FILTERS.clear();
    renderBag();
}

const upgrades = [
    { id: 'atk', name: '💪 强化攻击', desc: '攻击力 +3', cost: 50, type: 'atk', value: 3 },
    { id: 'def', name: '🛡️ 强化防御', desc: '防御力 +5', cost: 50, type: 'def', value: 5 },
    { id: 'hp', name: '❤️ 生命强化', desc: '最大生命 +35', cost: 40, type: 'maxHp', value: 35 },
    { id: 'aspd', name: '⚡ 攻速提升', desc: '攻击速度提升 (满级100)', cost: 100, type: 'aspd', value: 0.9 },
    { id: 'crit', name: '💥 暴击精通', desc: '暴击率 +5%（满爆后转为暴击伤害 +20%）', cost: 150, type: 'crit', value: 0.05, dmgValue: 0.2 },
    { id: 'vamp', name: '🧛 生命偷取', desc: '吸血 +2%', cost: 200, type: 'vamp', value: 0.02 }
];

// ========== 存档签名 ==========
function computeSignature(dataStr) {
    const secret = 'BQ2025v31_Salt';
    let hash = 0;
    const combined = dataStr + secret;
    for (let i = 0; i < combined.length; i++) {
        const char = combined.charCodeAt(i);
        hash = ((hash << 5) - hash) + char + (i * 7);
        hash = hash & hash;
    }
    return Math.abs(hash).toString(16).toUpperCase().padStart(8, '0');
}

function wrapSaveData(data) {
    const dataStr = JSON.stringify(data);
    return { data: data, signature: computeSignature(dataStr), version: 1 };
}

function unwrapSaveData(wrapped) {
    // 旧存档兼容：没有 signature 的直接返回
    if (!wrapped || wrapped.signature === undefined) {
        return { valid: true, data: wrapped };
    }
    const dataStr = JSON.stringify(wrapped.data);
    const expected = computeSignature(dataStr);
    if (expected !== wrapped.signature) {
        return { valid: false, data: null };
    }
    return { valid: true, data: wrapped.data };
}

function saveGame() {
    const data = { player: game.player, currentArea: game.currentArea, bossDefeated: game.bossDefeated, bossFled: game.bossFled, clues: game.clues, fightingBoss: game.fightingBoss, autoStrengthen: game.autoStrengthen, autoSell: game.autoSell, savedAt: Date.now() };
    localStorage.setItem(SAVE_KEY, JSON.stringify(wrapSaveData(data)));
    showNotification('💾 游戏已保存！');
    log('游戏进度已保存', 'log-loot');
}

function loadGame() {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) { showNotification('没有找到存档'); return false; }
    try {
        const wrapped = JSON.parse(raw);
        const result = unwrapSaveData(wrapped);
        if (!result.valid) { showNotification('存档数据已被篡改或损坏！'); return false; }
        const data = result.data;
        if (data.player) game.player = data.player;
        if (data.currentArea !== undefined) game.currentArea = data.currentArea;
        if (data.bossDefeated) game.bossDefeated = data.bossDefeated;
        if (data.bossFled) game.bossFled = data.bossFled;
        if (data.clues) game.clues = data.clues;
        if (data.fightingBoss !== undefined) game.fightingBoss = data.fightingBoss;
        if (data.autoStrengthen !== undefined) game.autoStrengthen = data.autoStrengthen;
        if (data.autoSell !== undefined) {
            game.autoSell = { ...game.autoSell, ...data.autoSell };
            // 兼容旧存档：maxRarity 拆分为 equipMaxRarity / bookMaxRarity
            if (game.autoSell.maxRarity && !game.autoSell.equipMaxRarity) {
                game.autoSell.equipMaxRarity = game.autoSell.maxRarity;
            }
            if (game.autoSell.maxRarity && !game.autoSell.bookMaxRarity) {
                game.autoSell.bookMaxRarity = game.autoSell.maxRarity;
            }
        }
        migrateOldSave();
        spawnEnemy(); renderAreas(); renderUpgrades(); renderBag(); updateClueUI(); updateUI(); updateSkillButtons();
        showNotification('📂 存档读取成功！'); log('游戏进度已读取', 'log-loot');
        return true;
    } catch (e) { showNotification('存档读取失败'); console.error(e); return false; }
}

function migrateOldSave() {
    if (!game.player) return;
    // 旧存档 treasures 格式迁移
    if (game.player.treasures && typeof Object.values(game.player.treasures)[0] === 'number') {
        const old = game.player.treasures; game.player.treasures = {};
        for (const [k, v] of Object.entries(old)) { if (v > 0) game.player.treasures[k] = { count: v, level: 1, locked: false }; }
    }
    if (game.player.treasures) {
        for (const d of Object.values(game.player.treasures)) { if (d.locked === undefined) d.locked = false; }
    }
    // 新属性默认值
    if (game.player.spi === undefined) game.player.spi = 10;
    if (game.player.maxMp === undefined) game.player.maxMp = 50;
    if (game.player.mp === undefined) game.player.mp = game.player.maxMp;
    if (game.player.spiLevel === undefined) game.player.spiLevel = 0;
    if (game.player.skills === undefined) game.player.skills = {};
    if (game.player.skillBooks === undefined) game.player.skillBooks = {};
    if (game.player.buffs === undefined) game.player.buffs = {};
    if (game.player.equipments === undefined) game.player.equipments = {};
    if (game.player.equipmentBag === undefined) game.player.equipmentBag = [];
    // 克制体系：抗性与被动技能
    if (game.player.earthRes === undefined) game.player.earthRes = 0;
    if (game.player.poisonRes === undefined) game.player.poisonRes = 0;
    if (game.player.lightningRes === undefined) game.player.lightningRes = 0;
    if (game.player.voidRes === undefined) game.player.voidRes = 0;
    if (game.player.chaosRes === undefined) game.player.chaosRes = 0;
    if (game.player.fireRes === undefined) game.player.fireRes = 0;
    if (game.player.tenacity === undefined) game.player.tenacity = 0;
    if (game.player.passives === undefined) game.player.passives = {};
    if (game.player.counterState === undefined) game.player.counterState = { voidShield: false, chaosReflux: false, stunImmune: 0 };
    if (game.player.settledMode === undefined) game.player.settledMode = false;
    if (game.player.debuffs === undefined) game.player.debuffs = {};
    // 旧存档装备默认已鉴定（兼容）
    for (const eq of game.player.equipmentBag) { if (eq.appraised === undefined) eq.appraised = true; }
    if (game.player.items === undefined) game.player.items = {};
    // 旧存档攻速迁移：新版使用基于等级的曲线计算，固定基础值为1000
    if (game.player.aspdLevel > 0 && game.player.aspd !== 1000) {
        game.player.aspd = 1000;
    }
    // 区域扩展兼容：旧存档8区域 → 新存档15区域
    if (game.bossDefeated && game.bossDefeated.length === 8) {
        const oldDefeated = game.bossDefeated;
        const oldFled = game.bossFled;
        game.bossDefeated = Array(15).fill(false);
        game.bossFled = Array(15).fill(false);
        // 旧区域0-2保持不变，旧区域3-4映射到新区域3-4，旧区域5(龙)映射到新区域8，旧区域6(天空)映射到新区域9，旧区域7(地狱)映射到新区域12
        for (let i = 0; i < 8; i++) {
            const newIdx = i <= 4 ? i : (i === 5 ? 8 : (i === 6 ? 9 : 12));
            game.bossDefeated[newIdx] = oldDefeated[i];
            game.bossFled[newIdx] = oldFled[i];
        }
    }
    if (game.clues && game.clues['5'] !== undefined) {
        const oldClues = game.clues;
        game.clues = { 3: 0, 6: 0, 9: 0, 14: 0 };
        // 旧线索映射到新线索
        if (oldClues['5'] > 0) game.clues[8] = oldClues['5'];
        if (oldClues['6'] > 0) game.clues[9] = oldClues['6'];
        if (oldClues['7'] > 0) game.clues[12] = oldClues['7'];
    }
    if (!game.clues || Object.keys(game.clues).length === 0) {
        game.clues = { 3: 0, 6: 0, 9: 0, 14: 0 };
    }
    // 确保 bossDefeated/bossFled 长度为15
    if (game.bossDefeated && game.bossDefeated.length < 15) {
        while (game.bossDefeated.length < 15) game.bossDefeated.push(false);
    }
    if (game.bossFled && game.bossFled.length < 15) {
        while (game.bossFled.length < 15) game.bossFled.push(false);
    }
    // 当前区域超出范围时重置
    if (game.currentArea >= 15) game.currentArea = 14;
}

// 定期检查buff过期
setInterval(() => {
    let changed = false;
    if (game.player) {
        if (cleanExpiredBuffs()) changed = true;
        if (cleanExpiredDebuffs()) changed = true;
    }
    if (cleanExpiredEnemyDebuffs()) changed = true;
    if (changed) {
        updateUI();
        updateEnemyUI();
        renderBag();
    }
}, 5000);

// BUFF/DEBUFF 倒计时独立刷新（不依赖自动战斗）
setInterval(() => {
    if (!game.player) return;
    const hasPlayerBuffs = getActiveBuffs().length > 0 || getActiveDebuffs().length > 0;
    const hasEnemyDebuffs = game.enemy && getActiveEnemyDebuffs().length > 0;
    if (hasPlayerBuffs || hasEnemyDebuffs) {
        updateUI();
        updateEnemyUI();
    }
}, 1000);

// 技能冷却进度条持续刷新（无论是否战斗）
setInterval(() => {
    if (game.player && game.player.skills && Object.keys(game.player.skills).length > 0) {
        updateSkillButtons();
    }
}, 300);

// 战斗外魔力恢复：战斗结束30秒后开始，每秒恢复，恢复量与精神力相关
setInterval(() => {
    if (!game.player) return;
    if (game.enemy) return; // 战斗中不恢复
    if (!game.lastBattleEndTime) return;
    const elapsed = Date.now() - game.lastBattleEndTime;
    if (elapsed < 30 * 1000) return; // 战斗结束30秒内不恢复
    if (game.player.mp < game.player.maxMp) {
        const regen = Math.max(1, Math.floor(game.player.spi * 0.5));
        game.player.mp = Math.min(game.player.maxMp, game.player.mp + regen);
        updateUI();
    }
}, 1000);

function utf8ToBase64(str) {
    try {
        return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (m, p1) => String.fromCharCode('0x' + p1)));
    } catch (e) {
        console.error('utf8ToBase64 failed:', e);
        throw e;
    }
}
function base64ToUtf8(str) {
    try {
        return decodeURIComponent(atob(str).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
    } catch (e) {
        console.error('base64ToUtf8 failed:', e);
        throw e;
    }
}

function exportSave() {
    const data = { player: game.player, currentArea: game.currentArea, bossDefeated: game.bossDefeated, bossFled: game.bossFled, clues: game.clues, fightingBoss: game.fightingBoss, autoStrengthen: game.autoStrengthen, autoSell: game.autoSell, savedAt: Date.now() };
    const wrapped = wrapSaveData(data);
    let base64;
    try { base64 = utf8ToBase64(JSON.stringify(wrapped)); } catch (e) { alert('存档编码失败：' + e.message); return; }
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(base64).then(() => showNotification('📤 存档已复制到剪贴板！')).catch(() => prompt('请复制以下存档代码（Ctrl+C）：', base64));
    } else { prompt('请复制以下存档代码（Ctrl+C）：', base64); }
}

function importSave() {
    const input = prompt('请输入存档代码：');
    if (!input) return;
    try {
        const cleaned = input.replace(/\s/g, '');
        const jsonStr = base64ToUtf8(cleaned);
        const wrapped = JSON.parse(jsonStr);
        const result = unwrapSaveData(wrapped);
        if (!result.valid) { alert('存档数据验证失败！\n该存档可能已被篡改或损坏。'); return; }
        const data = result.data;
        if (data.player) game.player = data.player;
        if (data.currentArea !== undefined) game.currentArea = data.currentArea;
        if (data.bossDefeated) game.bossDefeated = data.bossDefeated;
        if (data.bossFled) game.bossFled = data.bossFled;
        if (data.clues) game.clues = data.clues;
        if (data.fightingBoss !== undefined) game.fightingBoss = data.fightingBoss;
        if (data.autoStrengthen !== undefined) game.autoStrengthen = data.autoStrengthen;
        if (data.autoSell !== undefined) {
            game.autoSell = { ...game.autoSell, ...data.autoSell };
            // 兼容旧存档：maxRarity 拆分为 equipMaxRarity / bookMaxRarity
            if (game.autoSell.maxRarity && !game.autoSell.equipMaxRarity) {
                game.autoSell.equipMaxRarity = game.autoSell.maxRarity;
            }
            if (game.autoSell.maxRarity && !game.autoSell.bookMaxRarity) {
                game.autoSell.bookMaxRarity = game.autoSell.maxRarity;
            }
        }
        migrateOldSave();
        spawnEnemy(); renderAreas(); renderUpgrades(); renderBag(); updateClueUI(); updateUI(); updateSkillButtons();
        showNotification('📥 存档导入成功！'); log('外部存档已导入', 'log-loot');
    } catch (e) { alert('存档代码无效！\n错误：' + e.message + '\n请检查是否复制完整，不要有多余空格或换行。'); }
}

async function resetGame() {
    const confirmed = await showConfirm('确定要重置所有进度吗？此操作不可撤销！');
    if (!confirmed) return;
    localStorage.removeItem(SAVE_KEY);
    const defaults = createDefaultSave();
    game.player = defaults.player;
    game.currentArea = defaults.currentArea;
    game.bossDefeated = defaults.bossDefeated;
    game.bossFled = defaults.bossFled;
    game.clues = defaults.clues;
    game.fightingBoss = defaults.fightingBoss;
    stopAutoBattle();
    spawnEnemy(); renderAreas(); renderUpgrades(); renderBag(); updateClueUI(); updateUI(); updateSkillButtons();
    log('游戏已重置', 'log-death'); showNotification('游戏已重置');
}

setInterval(() => {
    if (game.player) {
        const data = { player: game.player, currentArea: game.currentArea, bossDefeated: game.bossDefeated, bossFled: game.bossFled, clues: game.clues, fightingBoss: game.fightingBoss, autoStrengthen: game.autoStrengthen, autoSell: game.autoSell, savedAt: Date.now() };
        localStorage.setItem(SAVE_KEY, JSON.stringify(wrapSaveData(data)));
    }
}, 30000);

// ========== 宝物系统 ==========
function getTreasureBonuses() {
    const bonuses = { atk: 0, def: 0, maxHp: 0, crit: 0, critDmg: 0, vamp: 0, expBonus: 0, goldBonus: 0, armorPenFlat: 0, armorPenPercent: 0, earthRes: 0, poisonRes: 0, lightningRes: 0, voidRes: 0, chaosRes: 0, fireRes: 0 };
    const treasures = game.player.treasures || {};
    for (const [tid, data] of Object.entries(treasures)) {
        if (!data || data.count <= 0) continue;
        const t = TREASURE_POOL.find(x => x.id === tid);
        if (!t) continue;
        const level = data.level || 1;
        const bonusPerLevel = t.value * 0.5;
        const totalValue = t.value + (level - 1) * bonusPerLevel;
        if (bonuses[t.stat] !== undefined) bonuses[t.stat] += totalValue;
    }
    return bonuses;
}

function getEquipmentBonuses() {
    const bonuses = { atk: 0, def: 0, maxHp: 0, aspd: 0, crit: 0, critDmg: 0, vamp: 0, expBonus: 0, spi: 0, armorPenFlat: 0, armorPenPercent: 0, atkMult: 0, defMult: 0, hpMult: 0, aspdMult: 0, critMult: 0, critDmgMult: 0, vampMult: 0, expMult: 0, earthRes: 0, poisonRes: 0, lightningRes: 0, voidRes: 0, chaosRes: 0, fireRes: 0, activeSets: [], activeSetDescs: [] };
    const eqs = game.player.equipments || {};
    const setCount = {};
    for (const [slotKey, data] of Object.entries(eqs)) {
        if (!data) continue;
        const eqDef = EQUIPMENT_POOL.find(e => e.id === data.id);
        if (!eqDef) continue;
        if (eqDef.setId) {
            setCount[eqDef.setId] = (setCount[eqDef.setId] || 0) + 1;
        }
        const level = data.level || 1;
        const refine = data.refine || 0;
        const refineMult = 1 + refine * 0.1;
        const attrMult = data.attrMult || 1;
        const levelMult = (1 + (level - 1) * 0.1) * refineMult * attrMult;
        if (eqDef.atk) bonuses.atk += eqDef.atk * levelMult;
        if (eqDef.def) bonuses.def += eqDef.def * levelMult;
        if (eqDef.maxHp) bonuses.maxHp += eqDef.maxHp * levelMult;
        if (eqDef.aspd) bonuses.aspd += eqDef.aspd * levelMult;
        if (eqDef.crit) bonuses.crit += eqDef.crit * levelMult;
        if (eqDef.critDmg) bonuses.critDmg += eqDef.critDmg * levelMult;
        if (eqDef.vamp) bonuses.vamp += eqDef.vamp * levelMult;
        if (eqDef.expBonus) bonuses.expBonus += eqDef.expBonus * levelMult;
        if (eqDef.spi) bonuses.spi += eqDef.spi * levelMult;
        if (eqDef.armorPenFlat) bonuses.armorPenFlat += eqDef.armorPenFlat * levelMult;
        if (eqDef.armorPenPercent) bonuses.armorPenPercent += eqDef.armorPenPercent * levelMult;
    }
    for (const [setId, count] of Object.entries(setCount)) {
        const set = ALL_SETS[setId];
        if (!set) continue;
        if (count >= set.slots.length) {
            bonuses.activeSets.push(setId);
            bonuses.activeSetDescs.push(`${set.name}：${set.desc}`);
            for (const [stat, val] of Object.entries(set.bonus)) {
                bonuses[stat] = (bonuses[stat] || 0) + val;
            }
        }
    }
    return bonuses;
}

function getAchievementBonuses() {
    const p = game.player;
    const lvl = Math.floor((p.level || 1) / 10);
    return {
        atk: lvl * 2 + Math.floor((p.atkLevel || 0) / 10) * 3,
        def: lvl * 1 + Math.floor((p.defLevel || 0) / 10) * 3,
        maxHp: lvl * 10 + Math.floor((p.hpLevel || 0) / 10) * 20,
        crit: Math.floor((p.critLevel || 0) / 10) * 0.02,
        vamp: Math.floor((p.vampLevel || 0) / 10) * 0.01,
        spi: Math.floor((p.spiLevel || 0) / 10) * 2
    };
}

function getAreaDropRate() {
    const rate = AREA_DROP_RATES[game.currentArea];
    if (rate !== undefined) return rate;
    // 无尽模式沿用最后一个区域的掉率
    return AREA_DROP_RATES[AREA_DROP_RATES.length - 1] || 0;
}

function getAreaRarityWeights() {
    const area = game.currentArea;
    if (area <= 2) return { common: 55, rare: 35, epic: 9, legendary: 1 };
    if (area <= 5) return { common: 40, rare: 35, epic: 20, legendary: 5 };
    if (area <= 8) return { common: 25, rare: 35, epic: 30, legendary: 10 };
    if (area <= 11) return { common: 15, rare: 30, epic: 35, legendary: 20 };
    return { common: 5, rare: 20, epic: 40, legendary: 35 };
}

function rollEquipmentDrop(minRarity) {
    const areaSetId = AREA_SETS[game.currentArea];
    // 30% 概率出当前地图的套装件
    if (areaSetId && Math.random() < 0.30) {
        const setItems = EQUIPMENT_POOL.filter(e => e.setId === areaSetId);
        if (setItems.length > 0) {
            return setItems[Math.floor(Math.random() * setItems.length)];
        }
    }
    // 70% 概率出非套装杂件，使用区域稀有度权重
    const weights = getAreaRarityWeights();
    const rarities = ['common','rare','epic','legendary'];
    const w = rarities.map(r => weights[r]);
    const totalWeight = w.reduce((a, b) => a + b, 0);
    let roll = Math.random() * totalWeight;
    let selectedRarity = 'common';
    for (let i = 0; i < rarities.length; i++) { roll -= w[i]; if (roll <= 0) { selectedRarity = rarities[i]; break; } }
    if (minRarity) {
        const minIdx = rarities.indexOf(minRarity);
        const currentIdx = rarities.indexOf(selectedRarity);
        if (currentIdx < minIdx) selectedRarity = minRarity;
    }
    const pool = EQUIPMENT_POOL.filter(e => !e.setId && e.rarity === selectedRarity);
    return pool[Math.floor(Math.random() * pool.length)];
}

// 说定状态：不掉落物品，改为扣除金币
// 金币消耗按"角色等级 + 当前地图典型怪物金币掉落 + 剩余金币比例"综合评定，
// 而非按宝物价值；宝物价值仅作为最低下限（3 倍）兜底。
function handleSettledDrop(itemValue, itemName, itemEmoji) {
    if (!game.player) return;
    const playerLevel = Math.max(1, game.player.level || 1);
    const areaIndex = game.currentArea;
    const isEndless = areaIndex >= 15;
    const baseMult = isEndless
        ? getEndlessMultiplier(Math.max(1, areaIndex - 14))
        : (game.areas[areaIndex]?.multiplier || 1);
    // 估算当前地图典型小怪金币掉落（参考 spawnEnemy + enemyDefeated 中的乘数）
    const endlessExtra = isEndless ? (1.5 + (areaIndex - 14) * 0.02) * 2 : 1;
    const monsterGoldEstimate = Math.max(1, Math.floor(15 * playerLevel * baseMult * endlessExtra));

    const minCost = Math.max(Math.floor((itemValue || 0) * 3), 10);
    // 综合上限：等级×80 + 地图怪物典型金币×20 + 剩余金币×15%
    const levelPart = playerLevel * 80;
    const mapPart = monsterGoldEstimate * 20;
    const goldPart = Math.floor((game.player.gold || 0) * 0.15);
    const upperBound = Math.max(minCost, levelPart + mapPart + goldPart);
    // 在 [最低, 上限] 区间内随机取值，偏向上限以体现"说定"的代价
    const rand = 0.65 + Math.random() * 0.35;
    let cost = Math.floor(minCost + (upperBound - minCost) * rand);
    cost = Math.max(minCost, Math.min(cost, game.player.gold || 0));
    if (cost <= 0) return;
    game.player.gold -= cost;
    log(`🧘 说定状态：未获得 ${itemEmoji} ${itemName}，扣除 ${formatNumber(cost)} 金币（最低${formatNumber(minCost)}）`, 'log-damage');
}

function addEquipmentToBag(equipment) {
    if (game.player.settledMode) {
        const eqDef = EQUIPMENT_POOL.find(e => e.id === equipment.id);
        handleSettledDrop(eqDef?.sellPrice || 0, eqDef?.name || '装备', eqDef?.emoji || '🛡️');
        return;
    }
    game.player.equipmentBag = game.player.equipmentBag || [];
    game.player.equipmentBag.push({ id: equipment.id, level: 1, appraised: false });
}

function rollTreasureDrop(minRarity, customRate, allowDivine) {
    const rate = customRate !== undefined ? customRate : getAreaDropRate();
    if (rate <= 0 || Math.random() > rate) return null;
    let rarities = Object.keys(RARITY_CONFIG);
    // 只有在明确允许（无尽精英/Boss）时才开放 divine；非无尽模式一律排除
    if (game.currentArea < 15 || !allowDivine) {
        rarities = rarities.filter(r => r !== 'divine');
    }
    const weights = rarities.map(r => RARITY_CONFIG[r].weight);
    const totalWeight = weights.reduce((a, b) => a + b, 0);
    let roll = Math.random() * totalWeight;
    let selectedRarity = 'common';
    for (let i = 0; i < rarities.length; i++) { roll -= weights[i]; if (roll <= 0) { selectedRarity = rarities[i]; break; } }
    if (minRarity) {
        const minIdx = rarities.indexOf(minRarity);
        const currentIdx = rarities.indexOf(selectedRarity);
        if (currentIdx < minIdx) selectedRarity = minRarity;
    }
    const pool = TREASURE_POOL.filter(t => {
        if (t.rarity !== selectedRarity) return false;
        // 只有无尽精英/Boss 才开放无尽专属宝物 (d_/t_)
        if (!allowDivine && (t.id.startsWith('d_') || t.id.startsWith('t_'))) return false;
        return true;
    });
    return pool[Math.floor(Math.random() * pool.length)];
}

function addTreasure(treasure) {
    if (game.player.settledMode) {
        handleSettledDrop(treasure.sellPrice || 0, treasure.name, treasure.emoji);
        return;
    }
    game.player.treasures = game.player.treasures || {};
    if (!game.player.treasures[treasure.id]) game.player.treasures[treasure.id] = { count: 0, level: 1, locked: false };
    game.player.treasures[treasure.id].count++;
}

function toggleTreasureLock(tid) {
    const data = game.player.treasures?.[tid];
    if (!data) return;
    data.locked = !data.locked;
    const t = TREASURE_POOL.find(x => x.id === tid);
    if (data.locked) {
        log(`🔒 ${t.emoji} ${t.name} 已锁定`, 'log-loot');
    } else {
        log(`🔓 ${t.emoji} ${t.name} 已解锁`, 'log-loot');
    }
    renderBag();
}

function loseRandomTreasure() {
    const treasures = game.player.treasures || {};
    const owned = Object.entries(treasures).filter(([_, d]) => d.count > 0 && !d.locked);
    if (owned.length === 0) return null;
    const [tid, data] = owned[Math.floor(Math.random() * owned.length)];
    const t = TREASURE_POOL.find(x => x.id === tid);
    data.count--;
    if (data.count <= 0) delete game.player.treasures[tid];
    return t;
}

function strengthenTreasure(tid) {
    const data = game.player.treasures?.[tid];
    const t = TREASURE_POOL.find(x => x.id === tid);
    if (!data || !t || data.count <= 1) return;
    const cost = Math.floor(t.sellPrice * 0.5 * data.level);
    if (game.player.gold < cost) { log('金币不足，无法强化！', 'log-damage'); return; }
    game.player.gold -= cost;
    data.count--;
    data.level++;
    log(`✨ ${t.emoji} ${t.name} 强化到 Lv.${data.level}！`, 'log-epic');
    updateUI();
}

function sellTreasure(tid) {
    const data = game.player.treasures?.[tid];
    const t = TREASURE_POOL.find(x => x.id === tid);
    if (!data || !t || data.count <= 0) return;
    if (data.locked) { log('🔒 该宝物已锁定，无法出售！', 'log-death'); return; }
    data.count--;
    if (data.count <= 0) delete game.player.treasures[tid];
    game.player.gold += t.sellPrice;
    log(`💰 出售了 ${t.emoji} ${t.name}，获得 ${formatNumber(t.sellPrice)} 金币`, 'log-loot');
    updateUI();
}

// ========== 线索系统 ==========
function isBossArea(index) { return BOSS_AREAS.includes(index); }
function isBossDefeated(index) { return game.bossDefeated[index] || false; }
function isBossFled(index) { return game.bossFled[index] || false; }
function getClues(index) { return game.clues[index] || 0; }
function getCluesRequired(index) { return CLUE_REQUIRED[index] || 0; }
function hasEnoughClues(index) { return getClues(index) >= getCluesRequired(index); }
function isFightingBoss() { return game.fightingBoss; }

function addClue() {
    if (!isBossArea(game.currentArea)) return;
    if (isBossDefeated(game.currentArea)) return;
    if (Math.random() > CLUE_DROP_RATE) return;
    const required = getCluesRequired(game.currentArea);
    if (game.clues[game.currentArea] < required) {
        game.clues[game.currentArea]++;
        log(`🔍 发现了BOSS线索！(${game.clues[game.currentArea]}/${required})`, 'log-clue');
        showNotification(`🔍 发现BOSS线索！${game.clues[game.currentArea]}/${required}`);
        updateClueUI();
    }
}

function enterEndlessMode() {
    game.currentArea = 15;
    game.fightingBoss = false;
    stopAutoBattle();
    spawnEnemy();
    log('♾️ 进入无尽模式！敌人将无限变强！', 'log-boss');
    showNotification('♾️ 进入无尽模式！');
    updateUI();
    showBattleView();
}

function getEndlessMultiplier(layer) {
    return Math.pow(1.08, layer);
}

function challengeBoss() {
    if (!hasEnoughClues(game.currentArea)) {
        showNotification('线索不足！继续刷怪收集线索吧！');
        return;
    }
    game.fightingBoss = true;
    game.bossFled[game.currentArea] = false;
    stopAutoBattle();
    spawnBoss(game.currentArea);
    updateClueUI();
    const bossCfg = BOSS_CONFIG[game.currentArea];
    log(`👹 你闯入了BOSS房间！${bossCfg.emoji} ${bossCfg.name} 出现了！`, 'log-boss');
    showNotification(`👹 BOSS ${bossCfg.emoji} ${bossCfg.name} 出现！`);
}

function bossDefeatedByPlayer() {
    game.bossDefeated[game.currentArea] = true;
    game.fightingBoss = false;
    game.clues[game.currentArea] = 0;
    // 击败BOSS后自动刷新区域按钮（解锁新地图）和线索面板
    renderAreas();
    updateClueUI();
}

function bossEscaped() {
    game.bossFled[game.currentArea] = true;
    game.fightingBoss = false;
    game.clues[game.currentArea] = 0;
    log('💨 BOSS逃走了！需要重新收集线索...', 'log-death');
    showNotification('💨 BOSS逃走了！重新收集线索吧！');
}

function spawnBoss(index) {
    const area = game.areas[index];
    const bossCfg = BOSS_CONFIG[index];
    const mult = area.multiplier;
    const baseLevel = area.level + 5;
    const areaIndex = index;
    let hpMult = 2.5, atkMult = 1.2, defMult = 1.5;
    let bossSkills = [];
    if (areaIndex === 3) { // 遗迹守卫
        hpMult = 2.5; atkMult = 1.2; defMult = 1.5;
        bossSkills = [{ type: 'petrify', interval: 10000, duration: 2000, lastCast: 0 }];
    } else if (areaIndex === 6) { // 沼泽之主
        hpMult = 2.5; atkMult = 1.0; defMult = 2.0;
        bossSkills = [{ type: 'poison_aura', dps: 0.02, interval: 1000, lastCast: 0 }];
    } else if (areaIndex === 9) { // 天空领主
        hpMult = 3.0; atkMult = 1.5; defMult = 1.8;
        bossSkills = [{ type: 'thunder_strike', damage: 0.10, interval: 8000, lastCast: 0 }, { type: 'stun_chance', chance: 0.20, duration: 1000 }];
    } else if (areaIndex === 14) { // 混沌魔神
        hpMult = 4.0; atkMult = 2.0; defMult = 2.5;
        bossSkills = [{ type: 'void_drain', drain: 0.15, interval: 12000, lastCast: 0 }, { type: 'chaos_purge', interval: 15000, lastCast: 0 }, { type: 'damage_reduce', rate: 0.30 }];
    }
    game.enemy = {
        name: bossCfg.name, emoji: bossCfg.emoji, level: baseLevel, isBoss: true,
        maxHp: Math.floor(60 * baseLevel * mult * hpMult), hp: 0,
        atk: Math.floor(10 * baseLevel * mult * atkMult),
        def: Math.floor(4 * baseLevel * mult * defMult),
        exp: Math.floor(30 * baseLevel * mult * 2),
        gold: Math.floor(15 * baseLevel * mult * 5),
        bossSkills: bossSkills,
        debuffs: {}
    };
    game.enemy.hp = game.enemy.maxHp;
    updateEnemyUI();
}

function spawnEnemy() {
    game.lastBattleEndTime = null;
    // 清除玩家临时debuff
    if (game.player) {
        game.player.armorPenDebuff = false;
        game.player.stunnedUntil = 0;
    }
    const areaIndex = game.currentArea;
    let area = game.areas[areaIndex];
    let baseLevel, mult;
    let endlessLayer = 0;
    if (areaIndex >= 15) {
        // 无尽模式
        endlessLayer = areaIndex - 14;
        baseLevel = Math.max(1, 100 + endlessLayer * 2 + Math.floor(Math.random() * 3) - 1);
        mult = getEndlessMultiplier(endlessLayer);
    } else {
        baseLevel = Math.max(1, area.level + Math.floor(Math.random() * 3) - 1);
        mult = area.multiplier;
    }
    // 无尽模式层数特殊敌人
    let isElite = false;
    let isEndlessBoss = false;
    if (areaIndex >= 15) {
        const layer = areaIndex - 14;
        if (layer > 0 && layer % 10 === 0) {
            isEndlessBoss = true;
        } else if (layer > 0 && layer % 5 === 0) {
            isElite = true;
        }
    }

    const template = game.enemies[Math.floor(Math.random() * game.enemies.length)];
    const eliteRate = areaIndex === 0 ? 0 : (isBossArea(game.currentArea) ? 0.30 : 0.15);
    if (areaIndex < 15 && !isElite) {
        isElite = Math.random() < eliteRate;
    }
    const scale = 1 + Math.min(areaIndex, 14) * 0.05;
    let maxHp = Math.floor(60 * baseLevel * mult * 0.5 * scale);
    let atk = Math.floor(10 * baseLevel * mult * 0.28 * (1 + Math.min(areaIndex, 14) * 0.025));
    let def = Math.floor(4 * baseLevel * mult * 0.22 * (1 + Math.min(areaIndex, 14) * 0.018));
    let exp = Math.floor(30 * baseLevel * mult * 0.4);
    let gold = Math.floor(15 * baseLevel * mult * 1.0);
    // 怪物类型加成
    if (template.type === 'aggressive') atk = Math.floor(atk * 1.15);
    if (template.type === 'tank') maxHp = Math.floor(maxHp * 1.30);
    if (template.type === 'fragile') { atk = Math.floor(atk * 1.30); maxHp = Math.floor(maxHp * 0.70); }
    if (isElite) {
        maxHp = Math.floor(60 * baseLevel * mult * 0.9);
        atk = Math.floor(10 * baseLevel * mult * 0.50);
        def = Math.floor(4 * baseLevel * mult * 0.40);
        exp = Math.floor(30 * baseLevel * mult * 1.0);
        gold = Math.floor(15 * baseLevel * mult * 2.5);
    }
    if (isEndlessBoss) {
        maxHp = Math.floor(60 * baseLevel * mult * 1.8);
        atk = Math.floor(10 * baseLevel * mult * 0.80);
        def = Math.floor(4 * baseLevel * mult * 0.60);
        exp = Math.floor(30 * baseLevel * mult * 2.0);
        gold = Math.floor(15 * baseLevel * mult * 5.0);
    }
    game.enemy = {
        name: template.name, emoji: template.emoji, level: baseLevel, isBoss: isEndlessBoss, isElite: isElite,
        maxHp: maxHp, hp: 0,
        atk: atk,
        def: def,
        exp: exp,
        gold: gold,
        enemyType: template.type,
        aspd: template.type === 'pack' ? 750 : 900,
        endlessLayer: endlessLayer,
        debuffs: {}
    };
    // 区域被动技能（逐层递进，更平滑）
    if (areaIndex >= 5) game.enemy.burn = true;
    if (areaIndex >= 6) game.enemy.frost = true;
    if (areaIndex >= 8) game.enemy.lifeSteal = 0.12;
    if (areaIndex >= 9) game.enemy.thorns = 0.08;
    if (areaIndex >= 11) game.enemy.armorPen = 0.15;
    if (areaIndex >= 12) game.enemy.curse = true;
    if (areaIndex >= 13) game.enemy.berserk = true;
    if (areaIndex >= 14) game.enemy.revive = true;
    if (isEndlessBoss) {
        game.enemy.bossSkills = [
            { type: 'chaos_purge', interval: 12000, lastCast: 0 },
            { type: 'damage_reduce', rate: 0.20 }
        ];
    }
    if (isElite) {
        const basicSkills = SKILLS.filter(s => s.isBasic);
        const skillCount = 1 + Math.floor(Math.random() * 2);
        game.enemy.skills = [];
        const shuffled = basicSkills.sort(() => Math.random() - 0.5);
        for (let i = 0; i < Math.min(skillCount, shuffled.length); i++) {
            game.enemy.skills.push({ id: shuffled[i].id, cooldownEnd: 0 });
        }
    }
    game.enemy.hp = game.enemy.maxHp;
    updateEnemyUI();
}

// ========== 战斗逻辑 ==========
function init() {
    const raw = localStorage.getItem(SAVE_KEY);
    const defaults = createDefaultSave();
    if (raw) {
        try {
            const parsed = JSON.parse(raw);
            // 兼容两种存档格式：wrapSaveData 包装格式 vs 裸格式
            let data;
            if (parsed.signature !== undefined && parsed.data !== undefined) {
                const result = unwrapSaveData(parsed);
                if (!result.valid) {
                    log('⚠️ 存档签名验证失败，尝试裸格式读取...', 'log-death');
                    data = parsed.data || parsed;
                } else {
                    data = result.data;
                }
            } else {
                data = parsed;
            }
            game.player = data.player || defaults.player;
            game.currentArea = data.currentArea ?? defaults.currentArea;
            game.bossDefeated = data.bossDefeated || defaults.bossDefeated;
            game.bossFled = data.bossFled || defaults.bossFled;
            game.clues = data.clues || defaults.clues;
            game.fightingBoss = data.fightingBoss || defaults.fightingBoss;
            game.autoStrengthen = data.autoStrengthen || false;
            migrateOldSave();
            log('📂 已自动读取上次存档', 'log-loot');
        } catch (e) { game.player = defaults.player; game.currentArea = defaults.currentArea; game.bossDefeated = defaults.bossDefeated; game.bossFled = defaults.bossFled; game.clues = defaults.clues; game.fightingBoss = defaults.fightingBoss; }
    } else { game.player = defaults.player; game.currentArea = defaults.currentArea; game.bossDefeated = defaults.bossDefeated; game.bossFled = defaults.bossFled; game.clues = defaults.clues; game.fightingBoss = defaults.fightingBoss; log('欢迎来到勇者挂机传说！点击"开始挂机"开始战斗吧！', 'log-loot'); }
    spawnEnemy(); renderAreas(); renderUpgrades(); renderBag(); updateClueUI(); updateUI(); updateSkillButtons();
    const verEl = document.getElementById('gameVersion');
    if (verEl) verEl.textContent = GAME_VERSION;
}

function getPlayerStats(includeBuffs = true) {
    const b = getTreasureBonuses();
    const eq = getEquipmentBonuses();
    const p = game.player;
    const aspdLevel = p.aspdLevel || 0;
    let baseInterval, speedMultiplier;
    if (aspdLevel <= 40) {
        // 1-40级：攻速增长，40级时达到10次/秒
        const attackSpeed = 1 + 0.005625 * aspdLevel * aspdLevel;
        baseInterval = Math.max(100, Math.floor(1000 / attackSpeed));
        speedMultiplier = 1.0;
    } else {
        // 41-100级：攻速已达上限，伤害倍率线性增长，100级时达到3倍
        baseInterval = 100;
        const dmgLevel = Math.min(60, aspdLevel - 40);
        speedMultiplier = Math.min(3, 1 + (2 / 60) * dmgLevel);
    }
    // buff加成（战力计算时可忽略）
    let buffDef = 0;
    let buffAtkMult = 1.0;
    let buffDefMult = 1.0;
    let buffExpMult = 0;
    let buffGoldMult = 0;
    let buffAspdMult = 0;
    let debuffAtkMult = 0;
    let debuffDefMult = 0;
    let debuffAspdMult = 0;
    let isSilenced = false;
    if (includeBuffs) {
        const now = Date.now();
        if (p.buffs) {
            if (p.buffs.shield && p.buffs.shield.endTime > now) {
                buffDef = p.buffs.shield.defBonus || 0;
            }
            if (p.buffs.atkBonus && p.buffs.atkBonus.endTime > now) {
                buffAtkMult = 1 + p.buffs.atkBonus.value;
            }
            if (p.buffs.defBonus && p.buffs.defBonus.endTime > now) {
                buffDefMult = 1 + p.buffs.defBonus.value;
            }
            if (p.buffs.expBonus && p.buffs.expBonus.endTime > now) {
                buffExpMult = p.buffs.expBonus.value;
            }
            if (p.buffs.goldBonus && p.buffs.goldBonus.endTime > now) {
                buffGoldMult = p.buffs.goldBonus.value;
            }
            if (p.buffs.aspdMultBuff && p.buffs.aspdMultBuff.endTime > now) {
                buffAspdMult = p.buffs.aspdMultBuff.value;
            }
        }
        // 负面状态debuff
        const debuffs = p.debuffs || {};
        if (debuffs.weakness && debuffs.weakness.endTime > now) {
            debuffAtkMult = debuffs.weakness.value;
        }
        if (debuffs.fragile && debuffs.fragile.endTime > now) {
            debuffDefMult = debuffs.fragile.value;
        }
        if (debuffs.slow && debuffs.slow.endTime > now) {
            debuffAspdMult = debuffs.slow.value;
        }
        if (debuffs.silence && debuffs.silence.endTime > now) {
            isSilenced = true;
        }
    }
    const ach = getAchievementBonuses();
    const baseAtk = (p.atk + b.atk + eq.atk + ach.atk) * (1 + eq.atkMult);
    let baseDef = (p.def + b.def + (includeBuffs ? buffDef : 0) + eq.def + ach.def) * (1 + eq.defMult);
    if (includeBuffs && game.player.armorPenDebuff) baseDef = Math.floor(baseDef * 0.8);
    const baseHp = (p.maxHp + b.maxHp + eq.maxHp + ach.maxHp) * (1 + eq.hpMult);
    const realAspd = Math.max(100, Math.floor(Math.max(1, baseInterval - eq.aspd) / (1 + eq.aspdMult + (includeBuffs ? buffAspdMult : 0) + (includeBuffs ? debuffAspdMult : 0))));
    // 抗性计算：基础 + 宝物 + 装备 + 被动技能，上限40%
    const capRes = (v) => Math.min(0.40, v);
    let passiveRes = { earthRes: 0, poisonRes: 0, lightningRes: 0, voidRes: 0, chaosRes: 0, fireRes: 0, tenacity: 0 };
    const passives = p.passives || {};
    for (const [pid, pdata] of Object.entries(passives)) {
        if (!pdata || pdata.level <= 0) continue;
        const book = PASSIVE_BOOKS.find(b => b.id === pid);
        if (!book || !book.effect) continue;
        for (const [k, v] of Object.entries(book.effect)) {
            if (passiveRes[k] !== undefined) passiveRes[k] += v;
        }
    }
    const earthRes = capRes((p.earthRes || 0) + b.earthRes + eq.earthRes + passiveRes.earthRes);
    const poisonRes = capRes((p.poisonRes || 0) + b.poisonRes + eq.poisonRes + passiveRes.poisonRes);
    const lightningRes = capRes((p.lightningRes || 0) + b.lightningRes + eq.lightningRes + passiveRes.lightningRes);
    const voidRes = capRes((p.voidRes || 0) + b.voidRes + eq.voidRes + passiveRes.voidRes);
    const chaosRes = capRes((p.chaosRes || 0) + b.chaosRes + eq.chaosRes + passiveRes.chaosRes);
    const fireRes = capRes((p.fireRes || 0) + b.fireRes + eq.fireRes + passiveRes.fireRes);
    const tenacity = capRes((p.tenacity || 0) + passiveRes.tenacity);
    return {
        atk: Math.floor(baseAtk * (includeBuffs ? buffAtkMult : 1.0) * (includeBuffs ? (1 - debuffAtkMult) : 1.0)),
        def: Math.floor(baseDef * (includeBuffs ? buffDefMult : 1.0) * (includeBuffs ? (1 - debuffDefMult) : 1.0)),
        maxHp: Math.floor(baseHp),
        aspd: realAspd, speedMultiplier,
        crit: Math.min(1.0, p.crit + b.crit + eq.crit + eq.critMult + ach.crit), critDmg: p.critDmg + b.critDmg + eq.critDmg + eq.critDmgMult,
        vamp: p.vamp + b.vamp + eq.vamp + eq.vampMult + ach.vamp, expBonus: b.expBonus + eq.expBonus + (includeBuffs ? buffExpMult : 0) + eq.expMult, goldBonus: b.goldBonus + (includeBuffs ? buffGoldMult : 0),
        armorPenFlat: b.armorPenFlat + eq.armorPenFlat, armorPenPercent: Math.min(0.35, b.armorPenPercent + eq.armorPenPercent),
        spi: p.spi + eq.spi + ach.spi, maxMp: p.maxMp, mp: p.mp,
        activeSets: eq.activeSets, activeSetDescs: eq.activeSetDescs, ach: ach,
        earthRes, poisonRes, lightningRes, voidRes, chaosRes, fireRes, tenacity,
        isSilenced
    };
}

function attack(attacker, defender, isPlayer) {
    const stats = isPlayer ? getPlayerStats() : attacker;
    let effectiveDef = isPlayer ? getEnemyEffectiveDef() : defender.def;
    if (defender.buffs && defender.buffs.shield) {
        const now = Date.now();
        if (defender.buffs.shield.endTime > now) {
            effectiveDef += defender.buffs.shield.defBonus || 0;
        }
    }
    if (isPlayer && stats.armorPenFlat > 0) {
        effectiveDef = Math.max(0, effectiveDef - stats.armorPenFlat * 1.5);
    }
    if (isPlayer && stats.armorPenPercent > 0) {
        effectiveDef = Math.max(0, effectiveDef * (1 - stats.armorPenPercent));
    }
    const atk = isPlayer ? stats.atk : getEnemyEffectiveAtk();
    const baseDmg = Math.max(1, (atk * atk) / (atk + effectiveDef));
    const isCrit = isPlayer && Math.random() < (stats.crit || 0);
    const critMultiplier = isCrit ? (stats.critDmg || 2) : 1;
    const speedMultiplier = isPlayer ? (stats.speedMultiplier || 1.0) : 1.0;
    const dmg = Math.floor(baseDmg * critMultiplier * speedMultiplier);
    defender.hp = Math.max(0, defender.hp - dmg);
    if (isPlayer && stats.vamp) {
        const heal = Math.floor(dmg * stats.vamp);
        if (heal > 0) {
            game.player.hp = Math.min(game.player.maxHp + getTreasureBonuses().maxHp, game.player.hp + heal);
            log(`🩸 吸血恢复了 ${formatNumber(heal)} 点生命`, 'log-heal');
        }
    }
    showDamage(isPlayer ? 'enemyChar' : 'playerChar', dmg, isCrit);
    const attackerEl = document.getElementById(isPlayer ? 'playerChar' : 'enemyChar');
    attackerEl.classList.add('attacking');
    setTimeout(() => attackerEl.classList.remove('attacking'), 300);
    const targetEl = document.getElementById(isPlayer ? 'enemyChar' : 'playerChar');
    targetEl.classList.add('hit');
    setTimeout(() => targetEl.classList.remove('hit'), 300);
    return dmg;
}

function showDamage(targetId, damage, isCrit) {
    const target = document.getElementById(targetId);
    const el = document.createElement('div');
    el.className = 'damage-text';
    el.textContent = (isCrit ? '暴击! ' : '') + '-' + formatNumber(damage);
    el.style.color = isCrit ? '#ff0000' : '#e94560';
    target.appendChild(el);
    setTimeout(() => el.remove(), 1000);
}

function battleRound(skipUI = false) {
    if (!game.enemy || game.enemy.hp <= 0) return;
    if (game.player.hp <= 0) { playerDeath(); return; }
    const playerDmg = attack(game.player, game.enemy, true);
    let enemyName;
    if (game.enemy.isBoss) enemyName = `【BOSS】${game.enemy.name}`;
    else if (game.enemy.isElite) enemyName = `【精英】${game.enemy.name}`;
    else enemyName = game.enemy.name;
    log(`你对${enemyName}造成了 ${formatNumber(playerDmg)} 点伤害`, 'log-damage');
    if (game.enemy.hp <= 0) { enemyDefeated(); return; }
    if (!skipUI) updateUI();
}

function enemyCastSkill() {
    if (!game.enemy || !game.enemy.skills || game.enemy.skills.length === 0) return false;
    const now = Date.now();
    const availableSkills = game.enemy.skills.filter(s => s.cooldownEnd <= now);
    if (availableSkills.length === 0) return false;
    const skillInfo = availableSkills[Math.floor(Math.random() * availableSkills.length)];
    const skillDef = SKILLS.find(s => s.id === skillInfo.id);
    if (!skillDef) return false;
    skillInfo.cooldownEnd = now + skillDef.cooldown;
    const enemyName = `【精英】${game.enemy.name}`;
    if (skillDef.type === 'heal') {
        const healAmount = Math.floor(game.enemy.maxHp * 0.15 + skillDef.baseDmg);
        game.enemy.hp = Math.min(game.enemy.maxHp, game.enemy.hp + healAmount);
        log(`💚 ${enemyName}释放了 ${skillDef.emoji}${skillDef.name}，恢复了 ${formatNumber(healAmount)} 点生命！`, 'log-heal');
        updateUI();
        return true;
    } else if (skillDef.type === 'buff') {
        const buffDef = Math.floor(game.enemy.def * 0.3 + skillDef.baseDmg);
        game.enemy.buffs = game.enemy.buffs || {};
        game.enemy.buffs.shield = { endTime: now + (skillDef.buffDuration || 10000), defBonus: buffDef };
        log(`🛡️ ${enemyName}释放了 ${skillDef.emoji}${skillDef.name}，获得 ${formatNumber(buffDef)} 点临时防御！`, 'log-skill');
        updateUI();
        return true;
    } else {
        const dmg = Math.floor(game.enemy.atk * 1.2 + skillDef.baseDmg * 0.5);
        game.player.hp = Math.max(0, game.player.hp - dmg);
        log(`💥 ${enemyName}释放了 ${skillDef.emoji}${skillDef.name}，对你造成 ${formatNumber(dmg)} 点伤害！`, 'log-skill');
        showDamage('playerChar', dmg, false);
        const attackerEl = document.getElementById('enemyChar');
        attackerEl.classList.add('attacking');
        setTimeout(() => attackerEl.classList.remove('attacking'), 300);
        const targetEl = document.getElementById('playerChar');
        targetEl.classList.add('hit');
        setTimeout(() => targetEl.classList.remove('hit'), 300);
        if (game.player.hp <= 0) playerDeath();
        else updateUI();
        return true;
    }
}

function enemyAttack(skipUI = false) {
    if (!game.enemy || game.enemy.hp <= 0) return;
    if (game.player.hp <= 0) { playerDeath(); return; }
    const now = Date.now();
    // BOSS技能（应用抗性）
    const playerRes = getPlayerStats(false);
    if (game.enemy.isBoss && game.enemy.bossSkills) {
        for (const skill of game.enemy.bossSkills) {
            if (skill.interval && now - (skill.lastCast || 0) >= skill.interval) {
                skill.lastCast = now;
                if (skill.type === 'petrify') {
                    let dur = skill.duration * (1 - playerRes.earthRes);
                    // 韧性减少眩晕时间
                    dur *= (1 - playerRes.tenacity);
                    game.player.stunnedUntil = now + dur;
                    game.player.counterState = game.player.counterState || {};
                    game.player.counterState.stunImmune = now + dur + 3000;
                    log(`🗿 ${game.enemy.name} 使用了石化凝视！${playerRes.earthRes > 0 ? '【土抗减免】' : ''}你被眩晕了 ${(dur/1000).toFixed(1)} 秒！`, 'log-damage');
                } else if (skill.type === 'thunder_strike') {
                    const thunderDmg = Math.floor(game.player.maxHp * skill.damage * (1 - playerRes.lightningRes));
                    game.player.hp = Math.max(0, game.player.hp - thunderDmg);
                    log(`⚡ ${game.enemy.name} 召唤了雷霆审判！${playerRes.lightningRes > 0 ? '【雷抗减免】' : ''}你受到了 ${formatNumber(thunderDmg)} 点闪电伤害！`, 'log-damage');
                } else if (skill.type === 'void_drain') {
                    // 虚空护盾抵消
                    game.player.counterState = game.player.counterState || {};
                    if (game.player.counterState.voidShield) {
                        game.player.counterState.voidShield = false;
                        log(`🛡️ 虚空护盾抵消了 ${game.enemy.name} 的虚空吞噬！`, 'log-skill');
                    } else {
                        const drain = Math.floor(game.player.hp * skill.drain * (1 - playerRes.voidRes));
                        game.player.hp = Math.max(0, game.player.hp - drain);
                        game.enemy.hp = Math.min(game.enemy.maxHp, game.enemy.hp + drain);
                        log(`🌑 ${game.enemy.name} 使用了虚空吞噬！${playerRes.voidRes > 0 ? '【虚空抗减免】' : ''}你失去了 ${formatNumber(drain)} 点生命！`, 'log-damage');
                    }
                } else if (skill.type === 'poison_aura') {
                    const poisonDmg = Math.floor(game.player.maxHp * skill.dps * (1 - playerRes.poisonRes));
                    game.player.hp = Math.max(0, game.player.hp - poisonDmg);
                    log(`☠️ 毒雾弥漫！${playerRes.poisonRes > 0 ? '【毒抗减免】' : ''}你受到了 ${formatNumber(poisonDmg)} 点毒伤！`, 'log-damage');
                } else if (skill.type === 'chaos_purge') {
                    game.player.counterState = game.player.counterState || {};
                    if (game.player.counterState.chaosReflux) {
                        game.player.counterState.chaosReflux = false;
                        log(`🌀 混沌逆流反弹！${game.enemy.name} 的混沌领域被反噬！`, 'log-skill');
                    } else if (Math.random() < playerRes.chaosRes) {
                        log(`🌀 你抵抗了 ${game.enemy.name} 的混沌领域！`, 'log-skill');
                    } else {
                        game.player.buffs = {};
                        log(`🌀 ${game.enemy.name} 展开了混沌领域！你的所有增益效果被清除了！`, 'log-damage');
                    }
                }
            }
        }
    }
    // 眩晕检查（含韧性霸体）
    game.player.counterState = game.player.counterState || {};
    if (game.player.counterState.stunImmune && now < game.player.counterState.stunImmune) {
        // 霸体期间免疫眩晕，但如果 stunUntil 还有效，清除它
        if (game.player.stunnedUntil && now < game.player.stunnedUntil) {
            log(`🛡️ 霸体！免疫了眩晕效果！`, 'log-skill');
            game.player.stunnedUntil = 0;
        }
    }
    if (game.player.stunnedUntil && now < game.player.stunnedUntil) {
        log(`😵 你被眩晕了，无法行动！`, 'log-damage');
        if (!skipUI) updateUI();
        return;
    }
    if (game.enemy.isElite && Math.random() < 0.4 && enemyCastSkill()) return;
    // 怪物类型：闪避
    if (game.enemy.enemyType === 'ethereal' && Math.random() < 0.15) {
        log(`👻 ${game.enemy.name} 闪避了你的攻击！`, 'log-damage');
        if (!skipUI) updateUI();
        return;
    }
    // 怪物类型：低血狂暴
    if (game.enemy.enemyType === 'berserker' && game.enemy.hp / game.enemy.maxHp < 0.3 && !game.enemy.berserkActive) {
        game.enemy.berserkActive = true;
        game.enemy.atk = Math.floor(game.enemy.atk * 1.5);
        log(`😡 ${game.enemy.name} 进入了狂暴状态！攻击力大幅提升！`, 'log-damage');
    }
    const enemyDmg = attack(game.enemy, game.player, false);
    // 怪物被动：吸血
    if (game.enemy.lifeSteal) {
        const heal = Math.floor(enemyDmg * game.enemy.lifeSteal);
        game.enemy.hp = Math.min(game.enemy.maxHp, game.enemy.hp + heal);
    }
    // 怪物被动：荆棘（反弹给玩家）
    if (game.enemy.thorns) {
        const reflect = Math.floor(enemyDmg * game.enemy.thorns);
        game.player.hp = Math.max(0, game.player.hp - reflect);
        if (reflect > 0) log(`🌵 荆棘反弹了 ${formatNumber(reflect)} 点伤害！`, 'log-damage');
    }
    // 怪物被动：燃烧（应用火抗）
    if (game.enemy.burn) {
        const playerRes = getPlayerStats(false);
        const burnDmg = Math.floor(game.player.maxHp * 0.03 * (1 - playerRes.fireRes));
        game.player.hp = Math.max(0, game.player.hp - burnDmg);
        log(`🔥 燃烧造成了 ${formatNumber(burnDmg)} 点伤害！${playerRes.fireRes > 0 ? '【火抗减免】' : ''}`, 'log-damage');
    }
    // 怪物被动：破甲
    if (game.enemy.armorPen && !game.player.armorPenDebuff) {
        game.player.armorPenDebuff = true;
        log(`💥 ${game.enemy.name} 的攻击破开了你的防御！`, 'log-damage');
    }
    // 怪物类型debuff施加（基础概率，受韧性影响）
    const playerResForDebuff = getPlayerStats(false);
    const debuffResist = playerResForDebuff.tenacity || 0;
    const type = game.enemy.enemyType;
    const debuffChance = 0.25 * (1 - debuffResist);
    if (type === 'poison' && Math.random() < debuffChance) {
        applyDebuff('poison', 8000, 0.015, game.enemy.name);
    }
    if (type === 'vampiric' && Math.random() < debuffChance) {
        applyDebuff('bleed', 6000, 0.02, game.enemy.name);
    }
    if (type === 'mage' && Math.random() < debuffChance) {
        applyDebuff('weakness', 6000, 0.20, game.enemy.name);
    }
    if (type === 'ethereal' && Math.random() < debuffChance) {
        applyDebuff('slow', 5000, 0.25, game.enemy.name);
    }
    if (type === 'undead' && Math.random() < debuffChance) {
        applyDebuff('fragile', 7000, 0.20, game.enemy.name);
    }
    if (type === 'berserker' && game.enemy.berserkActive && Math.random() < debuffChance * 1.5) {
        applyDebuff('weakness', 5000, 0.30, game.enemy.name);
    }
    // 精英/Boss额外debuff
    if (game.enemy.isElite && Math.random() < 0.15 * (1 - debuffResist)) {
        const eliteDebuffs = ['weakness', 'slow', 'fragile'];
        const dKey = eliteDebuffs[Math.floor(Math.random() * eliteDebuffs.length)];
        const dVals = { weakness: 0.25, slow: 0.30, fragile: 0.25 };
        applyDebuff(dKey, 8000, dVals[dKey], `【精英】${game.enemy.name}`);
    }
    if (game.enemy.isBoss && Math.random() < 0.20 * (1 - debuffResist)) {
        const bossDebuffs = ['weakness', 'slow', 'fragile', 'silence'];
        const dKey = bossDebuffs[Math.floor(Math.random() * bossDebuffs.length)];
        const dVals = { weakness: 0.35, slow: 0.40, fragile: 0.35, silence: 0 };
        const dDurs = { weakness: 10000, slow: 8000, fragile: 10000, silence: 5000 };
        applyDebuff(dKey, dDurs[dKey], dVals[dKey], `【BOSS】${game.enemy.name}`);
    }
    // debuff持续伤害结算
    processDebuffDamage();
    const enemyName = game.enemy.isBoss ? `【BOSS】${game.enemy.name}` : game.enemy.isElite ? `【精英】${game.enemy.name}` : game.enemy.name;
    log(`${enemyName}对你造成了 ${formatNumber(enemyDmg)} 点伤害`, 'log-damage');
    if (game.player.hp <= 0) playerDeath();
    else if (!skipUI) updateUI();
}

function enemyDefeated() {
    // 怪物被动：复活
    if (game.enemy.revive && !game.enemy.hasRevived) {
        game.enemy.hasRevived = true;
        game.enemy.hp = Math.floor(game.enemy.maxHp * 0.30);
        log(`💀 ${game.enemy.name} 从死亡中复活了！恢复了30%的生命值！`, 'log-damage');
        updateEnemyUI();
        return;
    }
    const stats = getPlayerStats();
    let exp = Math.floor(game.enemy.exp * (1 + stats.expBonus));
    let baseGold = game.enemy.gold;
    let gold = Math.floor(baseGold * (1 + stats.goldBonus));

    // 无尽模式普通怪：经验和金币额外加成，但不掉落特有道具/装备/宝物
    if (game.currentArea >= 15 && !game.enemy.isElite && !game.enemy.isBoss) {
        const extraMult = 1.5 + (game.currentArea - 14) * 0.02;
        exp = Math.floor(exp * extraMult);
        gold = Math.floor(gold * extraMult);
    }
    // 无尽模式金币整体翻倍
    if (game.currentArea >= 15) {
        gold = Math.floor(gold * 2);
    }

    game.player.exp += exp;
    game.player.gold += gold;
    game.player.kills++;

    let enemyName;
    if (game.enemy.isBoss) enemyName = `【BOSS】${game.enemy.name}`;
    else if (game.enemy.isElite) enemyName = `【精英】${game.enemy.name}`;
    else enemyName = game.enemy.name;

    if (game.enemy.isBoss) {
        bossDefeatedByPlayer();
        log(`🏆 击败了 ${enemyName}！获得 ${formatNumber(exp)} 经验值和 ${formatNumber(gold)} 金币！`, 'log-boss');
        showNotification(`🎉 击败BOSS ${game.enemy.emoji} ${game.enemy.name}！`);
        dropLog(`🏆 击败BOSS：${game.enemy.emoji} ${game.enemy.name} — ${formatNumber(exp)}经验 ${formatNumber(gold)}金币`);

        // BOSS宝物：60%概率，最低史诗；无尽模式开放神器/超脱掉落
        if (Math.random() < 0.60) {
            const bossTreasure = rollTreasureDrop('epic', undefined, game.currentArea >= 15);
            if (bossTreasure) {
                addTreasure(bossTreasure);
                const rc = RARITY_CONFIG[bossTreasure.rarity];
                log(`🎁 BOSS掉落了 [${rc.label}] ${bossTreasure.emoji} ${bossTreasure.name}！`, 'log-legendary');
                dropLog(`🎁 BOSS掉落：[${rc.label}] ${bossTreasure.emoji} ${bossTreasure.name}`);
                showNotification(`🎉 BOSS掉落${rc.label}宝物：${bossTreasure.name}！`);
            }
        }

        // BOSS装备：高概率，最低稀有
        const eqDropRate = (EQUIPMENT_DROP_RATES[game.currentArea] || EQUIPMENT_DROP_RATES[EQUIPMENT_DROP_RATES.length - 1] || 0) * 1.2;
        if (eqDropRate > 0 && Math.random() < eqDropRate) {
            const equipment = rollEquipmentDrop('rare');
            if (equipment) {
                addEquipmentToBag(equipment);
                const rc = RARITY_CONFIG[equipment.rarity];
                log(`🛡️ BOSS掉落了 [${rc.label}] 装备：${equipment.emoji} ${equipment.name}！`, 'log-epic');
                dropLog(`🛡️ [${rc.label}] ${equipment.emoji} ${equipment.name}`);
                showNotification(`🛡️ BOSS掉落${rc.label}装备：${equipment.name}！`);
            }
        }

        // BOSS技能书：高概率
        const bookDropRate = (SKILL_BOOK_DROP_RATES[game.currentArea] || SKILL_BOOK_DROP_RATES[SKILL_BOOK_DROP_RATES.length - 1] || 0) * 1.5;
        if (bookDropRate > 0 && Math.random() < bookDropRate) {
            const book = SKILL_BOOKS[Math.floor(Math.random() * SKILL_BOOKS.length)];
            addSkillBook(book);
            const rc = RARITY_CONFIG[book.rarity];
            log(`📕 BOSS掉落了 [${rc.label}] 技能书：${book.name}！`, 'log-epic');
            dropLog(`📕 [${rc.label}] ${book.emoji} ${book.name}`);
            showNotification(`📕 BOSS掉落${rc.label}技能书：${book.name}！`);
        }

        // BOSS强化石：50%概率，1-2个
        if (Math.random() < 0.50) {
            const stoneCount = 1 + Math.floor(Math.random() * 2);
            const stone = SHOP_ITEMS.find(i => i.id === 'enhance_stone');
            if (stone) {
                game.player.items = game.player.items || {};
                if (!game.player.items[stone.id]) game.player.items[stone.id] = { count: 0 };
                game.player.items[stone.id].count += stoneCount;
                log(`🔮 BOSS掉落了 ${stone.emoji} ${stone.name} ×${formatNumber(stoneCount)}！`, 'log-epic');
                dropLog(`🔮 BOSS掉落：${stone.emoji} ${stone.name} ×${formatNumber(stoneCount)}`);
                showNotification(`🔮 BOSS掉落${stone.name} ×${stoneCount}！`);
            }
        }

        // 被动技能书：超低概率，仅BOSS掉落
        if (Math.random() < PASSIVE_BOOK_DROP_RATE) {
            const pBook = PASSIVE_BOOKS[Math.floor(Math.random() * PASSIVE_BOOKS.length)];
            game.player.passives = game.player.passives || {};
            if (!game.player.passives[pBook.id]) {
                game.player.passives[pBook.id] = { level: 1 };
                log(`📘 BOSS掉落了稀有被动技能书：${pBook.emoji} ${pBook.name}！${pBook.desc}`, 'log-legendary');
                dropLog(`📘 稀有被动：${pBook.emoji} ${pBook.name}`);
                showNotification(`📘 获得稀有被动：${pBook.name}！`);
            }
        }
    } else if (game.enemy.isElite) {
        log(`🌟 击败了 ${enemyName}！获得 ${formatNumber(exp)} 经验值和 ${formatNumber(gold)} 金币！`, 'log-epic');
        showNotification(`🌟 击败精英 ${game.enemy.emoji} ${game.enemy.name}！`);
        dropLog(`🌟 击败精英：${game.enemy.emoji} ${game.enemy.name} — ${formatNumber(exp)}经验 ${formatNumber(gold)}金币`);
        addClue();

        // 精英宝物：1.5倍概率，最低稀有；无尽精英开放神器/超脱
        const treasureRate = (AREA_DROP_RATES[game.currentArea] || getAreaDropRate()) * 1.5;
        if (treasureRate > 0 && Math.random() < treasureRate) {
            const treasure = rollTreasureDrop('rare', undefined, game.currentArea >= 15);
            if (treasure) {
                addTreasure(treasure);
                const rc = RARITY_CONFIG[treasure.rarity];
                const lc = treasure.rarity === 'legendary' ? 'log-legendary' : treasure.rarity === 'epic' ? 'log-epic' : 'log-rare';
                log(`🎁 精英掉落了 [${rc.label}] ${treasure.emoji} ${treasure.name}！${formatValue(treasure.stat, treasure.value)}`, lc);
                dropLog(`🎁 [${rc.label}] ${treasure.emoji} ${treasure.name} — ${formatValue(treasure.stat, treasure.value)}`);
                if (treasure.rarity === 'legendary' || treasure.rarity === 'epic') {
                    showNotification(`🎉 获得${rc.label}宝物：${treasure.name}！`);
                }
            }
        }

        // 精英装备：1.5倍概率，最低稀有
        const eqDropRate = (EQUIPMENT_DROP_RATES[game.currentArea] || EQUIPMENT_DROP_RATES[EQUIPMENT_DROP_RATES.length - 1] || 0) * 1.5;
        if (eqDropRate > 0 && Math.random() < eqDropRate) {
            const equipment = rollEquipmentDrop('rare');
            if (equipment) {
                addEquipmentToBag(equipment);
                const rc = RARITY_CONFIG[equipment.rarity];
                log(`🛡️ 精英掉落了 [${rc.label}] 装备：${equipment.emoji} ${equipment.name}！`, 'log-epic');
                dropLog(`🛡️ [${rc.label}] ${equipment.emoji} ${equipment.name}`);
                showNotification(`🛡️ 获得${rc.label}装备：${equipment.name}！`);
            }
        }

        // 精英技能书：1.5倍概率
        const bookDropRate = (SKILL_BOOK_DROP_RATES[game.currentArea] || SKILL_BOOK_DROP_RATES[SKILL_BOOK_DROP_RATES.length - 1] || 0) * 1.5;
        if (bookDropRate > 0 && Math.random() < bookDropRate) {
            const book = SKILL_BOOKS[Math.floor(Math.random() * SKILL_BOOKS.length)];
            addSkillBook(book);
            const rc = RARITY_CONFIG[book.rarity];
            log(`📕 精英掉落了 [${rc.label}] 技能书：${book.name}！`, 'log-epic');
            dropLog(`📕 [${rc.label}] ${book.emoji} ${book.name}`);
            showNotification(`📕 获得${rc.label}技能书：${book.name}！`);
        }

        // 精英核心：10%概率
        if (Math.random() < 0.10) {
            const eliteItem = SHOP_ITEMS.find(i => i.id === 'elite_core');
            if (eliteItem) {
                game.player.items = game.player.items || {};
                if (!game.player.items[eliteItem.id]) game.player.items[eliteItem.id] = { count: 0 };
                game.player.items[eliteItem.id].count++;
                log(`💠 精英怪物掉落了 ${eliteItem.emoji} ${eliteItem.name}！`, 'log-epic');
                dropLog(`💠 精英掉落：${eliteItem.emoji} ${eliteItem.name}`);
                showNotification(`💠 获得精英掉落：${eliteItem.name}！`);
            }
        }

        // 精英强化石：30%概率
        if (Math.random() < 0.30) {
            const stone = SHOP_ITEMS.find(i => i.id === 'enhance_stone');
            if (stone) {
                game.player.items = game.player.items || {};
                if (!game.player.items[stone.id]) game.player.items[stone.id] = { count: 0 };
                game.player.items[stone.id].count++;
                log(`🔮 精英怪物掉落了 ${stone.emoji} ${stone.name}！`, 'log-epic');
                dropLog(`🔮 精英掉落：${stone.emoji} ${stone.name}`);
                showNotification(`🔮 获得精英掉落：${stone.name}！`);
            }
        }
    } else {
        log(`击败了 ${enemyName}！获得 ${formatNumber(exp)} 经验值和 ${formatNumber(gold)} 金币！`, 'log-exp');
        addClue();

        // 普通怪物装备：基础概率（无尽模式沿用最后一个区域）
        const eqDropRate = EQUIPMENT_DROP_RATES[game.currentArea] || EQUIPMENT_DROP_RATES[EQUIPMENT_DROP_RATES.length - 1] || 0;
        if (eqDropRate > 0 && Math.random() < eqDropRate) {
            const equipment = rollEquipmentDrop();
            if (equipment) {
                addEquipmentToBag(equipment);
                const rc = RARITY_CONFIG[equipment.rarity];
                log(`🛡️ 掉落了 [${rc.label}] 装备：${equipment.emoji} ${equipment.name}！`, 'log-epic');
                dropLog(`🛡️ [${rc.label}] ${equipment.emoji} ${equipment.name}`);
                showNotification(`🛡️ 获得${rc.label}装备：${equipment.name}！`);
            }
        }

        // 普通怪物技能书：基础概率（无尽模式沿用最后一个区域）
        const bookDropRate = SKILL_BOOK_DROP_RATES[game.currentArea] || SKILL_BOOK_DROP_RATES[SKILL_BOOK_DROP_RATES.length - 1] || 0;
        if (bookDropRate > 0 && Math.random() < bookDropRate) {
            // 非无尽模式过滤禁咒技能书
            const eligibleBooks = game.currentArea >= 15 ? SKILL_BOOKS : SKILL_BOOKS.filter(b => b.id !== 'book_void_annihilation');
            const book = eligibleBooks[Math.floor(Math.random() * eligibleBooks.length)];
            addSkillBook(book);
            const rc = RARITY_CONFIG[book.rarity];
            log(`📕 掉落了 [${rc.label}] 技能书：${book.name}！`, 'log-epic');
            dropLog(`📕 [${rc.label}] ${book.emoji} ${book.name}`);
            showNotification(`📕 获得${rc.label}技能书：${book.name}！`);
        }

        // 普通怪物宝物：基础概率
        const treasure = rollTreasureDrop();
        if (treasure) {
            addTreasure(treasure);
            const rc = RARITY_CONFIG[treasure.rarity];
            const lc = treasure.rarity === 'legendary' ? 'log-legendary' : treasure.rarity === 'epic' ? 'log-epic' : treasure.rarity === 'rare' ? 'log-rare' : 'log-loot';
            log(`🎁 掉落了 [${rc.label}] ${treasure.emoji} ${treasure.name}！${formatValue(treasure.stat, treasure.value)}`, lc);
            dropLog(`🎁 [${rc.label}] ${treasure.emoji} ${treasure.name} — ${formatValue(treasure.stat, treasure.value)}`);
            if (treasure.rarity === 'legendary' || treasure.rarity === 'epic') {
                showNotification(`🎉 获得${rc.label}宝物：${treasure.name}！`);
            }
        }
        // 无尽模式普通怪：千分之一概率掉落神器/超脱级宝物
        if (game.currentArea >= 15 && Math.random() < 0.001) {
            const divinePool = TREASURE_POOL.filter(t => t.rarity === 'divine');
            const dTreasure = divinePool[Math.floor(Math.random() * divinePool.length)];
            if (dTreasure) {
                addTreasure(dTreasure);
                const rc = RARITY_CONFIG['divine'];
                log(`🎁 无尽模式奇迹掉落！${dTreasure.emoji} ${dTreasure.name}！`, 'log-legendary');
                dropLog(`🎁 无尽奇迹：[${rc.label}] ${dTreasure.emoji} ${dTreasure.name}`);
                showNotification(`🎉 无尽模式奇迹掉落${rc.label}宝物：${dTreasure.name}！`);
            }
        }
        // 无尽模式普通怪：千分之一概率掉落神器级装备
        if (game.currentArea >= 15 && Math.random() < 0.001) {
            const divineEqPool = EQUIPMENT_POOL.filter(e => e.rarity === 'divine');
            if (divineEqPool.length > 0) {
                const equipment = divineEqPool[Math.floor(Math.random() * divineEqPool.length)];
                addEquipmentToBag(equipment);
                const rc = RARITY_CONFIG['divine'];
                log(`🛡️ 无尽模式奇迹掉落！[${rc.label}] 装备：${equipment.emoji} ${equipment.name}！`, 'log-legendary');
                dropLog(`🛡️ 无尽奇迹：[${rc.label}] ${equipment.emoji} ${equipment.name}`);
                showNotification(`🎉 无尽模式奇迹掉落${rc.label}装备：${equipment.name}！`);
            }
        }
        // 无尽模式普通怪：恢复类/加成型道具掉落（随层数小幅提升）
        if (game.currentArea >= 15) {
            const layer = game.currentArea - 14;
            const normalItemRate = Math.min(0.05, 0.015 + layer * 0.0003);
            if (Math.random() < normalItemRate) {
                const normalItemIds = ENDLESS_NORMAL_DROP_ITEMS;
                const pool = SHOP_ITEMS.filter(i => normalItemIds.includes(i.id));
                const item = pool[Math.floor(Math.random() * pool.length)];
                if (item) {
                    game.player.items = game.player.items || {};
                    if (!game.player.items[item.id]) game.player.items[item.id] = { count: 0 };
                    game.player.items[item.id].count++;
                    log(`🧪 无尽小怪掉落了 ${item.emoji} ${item.name}！`, 'log-epic');
                    dropLog(`🧪 无尽掉落：${item.emoji} ${item.name}`);
                    showNotification(`🧪 获得无尽掉落：${item.name}！`);
                }
            }
        }
    }

    // 无尽模式：所有敌人击败后都进入下一层 + 特有掉落
    if (game.currentArea >= 15) {
        const layer = game.currentArea - 14;

        // 无尽模式特有掉落仅限精英及以上怪物
        if (game.enemy.isElite || game.enemy.isBoss) {
            // 神器装备掉落（最高10%）
            const divineRate = Math.min(0.10, 0.02 + layer * 0.001);
            if (Math.random() < divineRate) {
                const divinePool = EQUIPMENT_POOL.filter(e => e.rarity === 'divine');
                if (divinePool.length > 0) {
                    const equipment = divinePool[Math.floor(Math.random() * divinePool.length)];
                    addEquipmentToBag(equipment);
                    const rc = RARITY_CONFIG['divine'];
                    log(`🛡️ 掉落了 [${rc.label}] 装备：${equipment.emoji} ${equipment.name}！`, 'log-legendary');
                    dropLog(`🛡️ [${rc.label}] ${equipment.emoji} ${equipment.name}`);
                    showNotification(`🎉 获得${rc.label}装备：${equipment.name}！`);
                }
            }

            // 超脱级套装掉落（独立概率，最高10%）
            const transcendentRate = Math.min(0.10, 0.005 + layer * 0.001);
            if (Math.random() < transcendentRate) {
                const newSets = ['set_void_annihilator', 'set_eternal_throne'];
                const setId = newSets[Math.floor(Math.random() * newSets.length)];
                const setItems = EQUIPMENT_POOL.filter(e => e.setId === setId);
                if (setItems.length > 0) {
                    const item = setItems[Math.floor(Math.random() * setItems.length)];
                    addEquipmentToBag(item);
                    const rc = RARITY_CONFIG['divine'];
                    log(`🛡️ 掉落了 [${rc.label}] 装备：${item.emoji} ${item.name}！`, 'log-legendary');
                    dropLog(`🛡️ [${rc.label}] ${item.emoji} ${item.name}`);
                    showNotification(`🎉 获得${rc.label}装备：${item.name}！`);
                }
            }

            // 无尽模式特有道具掉落（最高10%）
            const endlessItemRate = Math.min(0.10, 0.01 + layer * 0.0005);
            if (Math.random() < endlessItemRate) {
                const endlessItemIds = ['endless_core', 'divine_blessing', 'chaos_core', 'void_essence', 'annihilation_potion'];
                const endlessItems = SHOP_ITEMS.filter(i => endlessItemIds.includes(i.id));
                const item = endlessItems[Math.floor(Math.random() * endlessItems.length)];
                if (item) {
                    game.player.items = game.player.items || {};
                    if (!game.player.items[item.id]) game.player.items[item.id] = { count: 0 };
                    game.player.items[item.id].count++;
                    log(`💎 无尽怪物掉落了 ${item.emoji} ${item.name}！`, 'log-legendary');
                    dropLog(`💎 无尽掉落：${item.emoji} ${item.name}`);
                    showNotification(`🎉 获得无尽掉落：${item.name}！`);
                }
            }

            // 禁咒技能书掉落（最高10%）
            const forbiddenBookRate = Math.min(0.10, 0.005 + layer * 0.001);
            if (Math.random() < forbiddenBookRate) {
                const forbiddenBook = SKILL_BOOKS.find(b => b.id === 'book_void_annihilation');
                if (forbiddenBook) {
                    addSkillBook(forbiddenBook);
                    const rc = RARITY_CONFIG['divine'];
                    log(`📕 掉落了 [${rc.label}] 禁咒：${forbiddenBook.name}！`, 'log-legendary');
                    dropLog(`📕 [${rc.label}] ${forbiddenBook.emoji} ${forbiddenBook.name}`);
                    showNotification(`🎉 获得禁咒技能书：${forbiddenBook.name}！`);
                }
            }
        }

        // 进入下一层
        game.currentArea++;
        const nextLayer = game.currentArea - 14;
        if (game.enemy.isBoss) {
            log(`♾️ 击败无尽BOSS！进入第 ${nextLayer} 层！`, 'log-boss');
        } else {
            log(`♾️ 无尽模式第 ${nextLayer} 层！敌人变得更加强大了！`, 'log-boss');
        }
    }
    while (game.player.exp >= game.player.maxExp) levelUp();
    updateUI();
    // 非BOSS敌人或无尽模式所有敌人击败后生成下一个
    if (!game.enemy.isBoss || game.currentArea >= 15) {
        if (game.autoBattle) {
            spawnEnemy();
            const encounterName = game.enemy.isElite ? `【精英】${game.enemy.name} Lv.${game.enemy.level}` : game.enemy.isBoss ? `【BOSS】${game.enemy.name} Lv.${game.enemy.level}` : `${game.enemy.name} Lv.${game.enemy.level}`;
            log(`遇到了新的敌人：${encounterName}`, 'log-loot');
        } else {
            setTimeout(() => { spawnEnemy(); const encounterName = game.enemy.isElite ? `【精英】${game.enemy.name} Lv.${game.enemy.level}` : game.enemy.isBoss ? `【BOSS】${game.enemy.name} Lv.${game.enemy.level}` : `${game.enemy.name} Lv.${game.enemy.level}`; log(`遇到了新的敌人：${encounterName}`, 'log-loot'); }, 800);
        }
    }
    game.lastBattleEndTime = Date.now();
}

function levelUp() {
    game.player.exp -= game.player.maxExp;
    game.player.level++;
    game.player.maxExp = Math.floor(game.player.maxExp * 1.15);
    game.player.maxHp += 30;
    game.player.hp = game.player.maxHp;
    game.player.atk += 4;
    game.player.def += 2;
    game.player.spi += 1;
    game.player.maxMp = 50 + game.player.spi * 3 + game.player.level * 2;
    game.player.mp = game.player.maxMp;
    if (game.player.level % 10 === 0) {
        log(`🏆 等级成就！Lv.${game.player.level} 达成！攻击+2 防御+1 生命+10`, 'log-epic');
        showNotification(`🏆 等级成就奖励！`);
    }
    log(`🎉 升级了！当前等级：${game.player.level}，精神+1，魔力恢复满！`, 'log-level');
    showNotification(`升级了！Lv.${game.player.level}`);
    renderAreas();
}

function playerDeath() {
    if (game.fightingBoss && game.enemy && game.enemy.isBoss) {
        bossEscaped();
        const goldLoss = Math.min(500, Math.floor(game.player.gold * 0.05 + 50));
        game.player.gold = Math.max(0, game.player.gold - goldLoss);
        log(`💀 被BOSS击败了... 掉落了 ${formatNumber(goldLoss)} 金币，BOSS逃走了！`, 'log-death');
        game.player.hp = game.player.maxHp;
        game.player.mp = game.player.maxMp;
        stopAutoBattle();
        spawnEnemy();
        updateClueUI();
        updateUI();
        return;
    }

    const goldLoss = Math.min(500, Math.floor(game.player.gold * 0.05 + 50));
    game.player.gold = Math.max(0, game.player.gold - goldLoss);
    let msg = `💀 你倒下了... 掉落了 ${formatNumber(goldLoss)} 金币`;
    const lostTreasure = Math.random() < 0.3 ? loseRandomTreasure() : null;
    if (lostTreasure) {
        msg += `，宝物 ${lostTreasure.emoji} ${lostTreasure.name} 也掉落了`;
        dropLog(`💀 死亡掉落：${lostTreasure.emoji} ${lostTreasure.name}`);
    }
    msg += '，生命值已恢复';
    log(msg, 'log-death');
    game.player.hp = game.player.maxHp;
    game.player.mp = game.player.maxMp;
    stopAutoBattle();
    spawnEnemy();
    updateUI();
    game.lastBattleEndTime = Date.now();
}

function stopAutoBattle() {
    game.autoBattle = false;
    if (game.autoBattleTimer) { clearTimeout(game.autoBattleTimer); game.autoBattleTimer = null; }
    document.getElementById('autoBattleBtn').textContent = '开始挂机';
}

function manualAttack() {
    if (game.player.hp > 0 && game.enemy && game.enemy.hp > 0) {
        battleRound();
        setTimeout(() => { if (game.enemy && game.enemy.hp > 0 && game.player.hp > 0) enemyAttack(); }, 400);
    }
}

function autoBattleLoop() {
    if (!game.autoBattle) return;
    const now = Date.now();
    const stats = getPlayerStats();
    const maxBatch = document.hidden ? 500 : 5;

    // 自动恢复生命和魔力
    if (game.autoRecover) {
        autoRecover(stats);
    }

    // 自动释放技能
    if (!document.hidden) {
        tryAutoCastSkill();
    }

    const playerElapsed = now - game.lastPlayerAttack;
    const playerAttacks = Math.min(Math.floor(playerElapsed / stats.aspd), maxBatch);
    for (let i = 0; i < playerAttacks; i++) {
        if (!game.enemy) spawnEnemy();
        if (!game.enemy || game.enemy.hp <= 0 || game.player.hp <= 0) break;
        battleRound(true);
    }
    if (playerAttacks > 0) game.lastPlayerAttack += playerAttacks * stats.aspd;

    // 敌人debuff持续伤害结算
    if (game.enemy && game.enemy.hp > 0) {
        processEnemyDebuffDamage();
    }

    // 玩家眩晕时跳过攻击
    if (game.player.stunnedUntil && now < game.player.stunnedUntil) {
        game.lastPlayerAttack = now;
    }
    const enemyInterval = game.enemy ? getEnemyEffectiveAspd() : 900;
    const enemyElapsed = now - game.lastEnemyAttack;
    const enemyAttacks = Math.min(Math.floor(enemyElapsed / enemyInterval), maxBatch);
    for (let i = 0; i < enemyAttacks; i++) {
        if (!game.enemy) spawnEnemy();
        if (!game.enemy || game.enemy.hp <= 0 || game.player.hp <= 0) break;
        enemyAttack(true);
    }
    if (enemyAttacks > 0) game.lastEnemyAttack += enemyAttacks * enemyInterval;

    // 批量攻击结束后统一更新一次UI
    if (playerAttacks > 0 || enemyAttacks > 0) {
        updateUI();
    }

    // 持续更新技能冷却进度条
    updateSkillButtons();

    // 自动出售（战斗中获得的物品立即处理）
    checkAutoSell();

    // 链式调度下一次执行，确保固定间隔
    if (game.autoBattle) {
        game.autoBattleTimer = setTimeout(autoBattleLoop, 300);
    }
}

function toggleAutoBattle() {
    game.autoBattle = !game.autoBattle;
    const btn = document.getElementById('autoBattleBtn');
    if (game.autoBattle) {
        btn.textContent = '停止挂机';
        game.lastPlayerAttack = Date.now();
        game.lastEnemyAttack = Date.now();
        log('开始自动战斗！', 'log-loot');
        autoBattleLoop();
    } else { stopAutoBattle(); log('停止自动战斗', 'log-loot'); }
}

function toggleAutoRecover() {
    game.autoRecover = !game.autoRecover;
    const btn = document.getElementById('autoRecoverBtn');
    btn.textContent = game.autoRecover ? '🩹 自动恢复: 开' : '🩹 自动恢复: 关';
    if (game.autoRecover) {
        btn.classList.remove('btn-secondary');
        btn.classList.add('btn-primary');
        log('🩹 已开启自动恢复，战斗中会自动使用药水', 'log-heal');
    } else {
        btn.classList.remove('btn-primary');
        btn.classList.add('btn-secondary');
        log('🩹 已关闭自动恢复', 'log-loot');
    }
}

function autoRecover(stats) {
    const items = game.player.items || {};
    let consumed = false;

    // 生命恢复：低于 30% 才使用，优先大药水
    if (game.player.hp < stats.maxHp * 0.3) {
        const bigPotion = items['hp_potion_l'];
        const smallPotion = items['hp_potion_s'];
        if (bigPotion && bigPotion.count > 0) {
            bigPotion.count--;
            if (bigPotion.count <= 0) delete items['hp_potion_l'];
            const healAmount = Math.floor(stats.maxHp * 1.0);
            game.player.hp = Math.min(stats.maxHp, game.player.hp + healAmount);
            log(`🩹 自动使用了大生命药水，恢复 ${formatNumber(healAmount)} 点生命值`, 'log-heal');
            consumed = true;
        } else if (smallPotion && smallPotion.count > 0) {
            smallPotion.count--;
            if (smallPotion.count <= 0) delete items['hp_potion_s'];
            const healAmount = Math.floor(stats.maxHp * 0.3);
            game.player.hp = Math.min(stats.maxHp, game.player.hp + healAmount);
            log(`🩹 自动使用了小生命药水，恢复 ${formatNumber(healAmount)} 点生命值`, 'log-heal');
            consumed = true;
        }
    }

    // 魔力恢复：低于 30% 才使用
    if (game.player.mp < stats.maxMp * 0.3) {
        const mpPotion = items['mp_potion'];
        if (mpPotion && mpPotion.count > 0) {
            mpPotion.count--;
            if (mpPotion.count <= 0) delete items['mp_potion'];
            const mpAmount = Math.floor(stats.maxMp * 0.5);
            game.player.mp = Math.min(stats.maxMp, game.player.mp + mpAmount);
            log(`💧 自动使用了魔力药水，恢复 ${formatNumber(mpAmount)} 点魔力值`, 'log-heal');
            consumed = true;
        }
    }

    if (consumed) {
        updateUI();
        // 防抖刷新背包：取消旧的延迟，设置新的 1 秒后刷新
        if (game._renderBagTimeout) clearTimeout(game._renderBagTimeout);
        game._renderBagTimeout = setTimeout(() => {
            game._renderBagTimeout = null;
            renderBag();
        }, 1000);
    }

    // 检查是否还有可用药水，没有则关闭自动恢复
    if (game.autoRecover) {
        const hasHpPotion = (items['hp_potion_l']?.count || 0) > 0 || (items['hp_potion_s']?.count || 0) > 0;
        const hasMpPotion = (items['mp_potion']?.count || 0) > 0;
        if (!hasHpPotion && !hasMpPotion) {
            game.autoRecover = false;
            const btn = document.getElementById('autoRecoverBtn');
            if (btn) {
                btn.textContent = '🩹 自动恢复: 关';
                btn.classList.remove('btn-primary');
                btn.classList.add('btn-secondary');
            }
            log('🩹 药水已耗尽，自动恢复已关闭', 'log-damage');
            if (game._renderBagTimeout) clearTimeout(game._renderBagTimeout);
            game._renderBagTimeout = setTimeout(() => {
                game._renderBagTimeout = null;
                renderBag();
            }, 1000);
        }
    }
}

function heal() {
    const stats = getPlayerStats();
    const cost = Math.floor(stats.maxHp * 0.1);
    if (game.player.gold >= cost) {
        game.player.gold -= cost;
        game.player.hp = stats.maxHp;
        log(`花费 ${formatNumber(cost)} 金币恢复了生命值`, 'log-heal');
        updateUI();
    } else { log('金币不足！', 'log-damage'); }
}

function buyUpgrade(upgradeId) {
    const upgrade = upgrades.find(u => u.id === upgradeId);
    if (!upgrade) return;
    const levelKey = upgradeId + 'Level';
    const level = game.player[levelKey] || 0;
    if (level >= game.player.level) {
        log('⛔ 能力等级不能超过角色等级！', 'log-damage');
        showNotification('⛔ 能力等级已达上限');
        return;
    }
    const cost = Math.floor(upgrade.cost * Math.pow(1.18, level));
    if (game.player.gold >= cost) {
        game.player.gold -= cost;
        game.player[levelKey] = level + 1;
        if ((level + 1) % 10 === 0) {
            const labels = { atk: '攻击+3', def: '防御+3', maxHp: '生命+20', crit: '暴击+2%', vamp: '吸血+1%', spi: '精神+2', aspd: '攻速上限提升' };
            const label = labels[upgrade.type] || '属性提升';
            log(`🏆 能力成就！${upgrade.name} Lv.${level + 1} 达成！${label}`, 'log-epic');
            showNotification(`🏆 能力成就奖励！`);
        }
        if (upgrade.type === 'aspd') {
            // 攻速升级只增加等级，实际攻速在 getPlayerStats 中按曲线计算
        } else if (upgrade.type === 'crit') {
            if (game.player.crit < 1.0) {
                game.player.crit = Math.min(1.0, game.player.crit + upgrade.value);
                const overflow = game.player.crit + upgrade.value - 1.0;
                if (overflow > 0) game.player.critDmg = (game.player.critDmg || 2) + overflow * 4;
            } else {
                game.player.critDmg = (game.player.critDmg || 2) + (upgrade.dmgValue || 0.2);
            }
        } else if (upgrade.type === 'vamp') {
            let bonus = upgrade.value;
            bonus += Math.floor(level / 10) * (upgrade.value * 0.5);
            game.player[upgrade.type] = (game.player[upgrade.type] || 0) + bonus;
        } else {
            let bonus = upgrade.value;
            const extra = Math.floor(level / 10);
            if (upgrade.type === 'atk' || upgrade.type === 'def') {
                bonus += extra * 2;
            } else if (upgrade.type === 'maxHp') {
                bonus += extra * 5;
            }
            game.player[upgrade.type] += bonus;
            log(`购买了 ${upgrade.name} Lv.${level + 1}！+${formatNumber(bonus)}！`, 'log-loot');
        }
        updateUI(); renderUpgrades();
    } else { log('金币不足！', 'log-damage'); }
}

function getMaxAllowedArea() {
    for (const bossArea of BOSS_AREAS) {
        if (!isBossDefeated(bossArea)) {
            return bossArea;
        }
    }
    return 14;
}

function changeArea(index) {
    const area = game.areas[index];
    if (game.player.level >= area.level) {
        const maxAllowed = getMaxAllowedArea();
        if (index > maxAllowed) {
            const nextBoss = BOSS_AREAS.find(a => a >= maxAllowed && !isBossDefeated(a));
            if (nextBoss !== undefined) {
                const bossCfg = BOSS_CONFIG[nextBoss];
                showNotification(`⚠️ 必须先击败 ${bossCfg.emoji} ${bossCfg.name} 才能进入下一关！`);
                log(`进入${area.name}需要先击败${bossCfg.name}！`, 'log-death');
                return;
            }
        }
        game.currentArea = index;
        game.fightingBoss = false;
        stopAutoBattle();
        spawnEnemy();
        log(`进入${area.name}！`, 'log-loot');
        updateClueUI();
        updateUI();
        showBattleView();
    }
}

function renderAreas() {
    const container = document.getElementById('areaSelector');

    // 主城按钮
    let cityBtn = container.querySelector('[data-area="city"]');
    if (!cityBtn) {
        cityBtn = document.createElement('button');
        cityBtn.setAttribute('data-area', 'city');
        cityBtn.onclick = () => showNpcView();
        container.appendChild(cityBtn);
    }
    cityBtn.className = 'area-btn' + (game.inCity ? ' active' : '');
    cityBtn.textContent = '🏰 主城';
    cityBtn.disabled = false;
    cityBtn.title = '';

    const activeIndices = new Set();
    game.areas.forEach((area, index) => {
        activeIndices.add(index);
        const isBoss = isBossArea(index);
        const defeated = isBossDefeated(index);
        const isActive = !game.inCity && index === game.currentArea;
        let className = 'area-btn' + (isActive ? ' active' : '');
        if (isBoss && defeated) className += ' boss-defeated';

        const dropRate = AREA_DROP_RATES[index];
        const dropText = dropRate > 0 ? ` 掉率${Math.round(dropRate*100)}%` : '';

        let badge = '';
        if (isBoss) {
            if (defeated) {
                badge = '<span class="boss-defeated-badge">已击败</span>';
            } else {
                const clues = getClues(index);
                const required = getCluesRequired(index);
                if (clues >= required) {
                    badge = '<span class="clue-badge">可挑战</span>';
                } else {
                    badge = '<span class="boss-badge">BOSS</span>';
                }
            }
        }

        const maxAllowed = getMaxAllowedArea();
        const isLocked = index > maxAllowed;

        let btn = container.querySelector(`[data-area-index="${index}"]`);
        if (!btn) {
            btn = document.createElement('button');
            btn.setAttribute('data-area-index', index);
            btn.onclick = () => changeArea(index);
            container.appendChild(btn);
        }
        btn.className = className;
        btn.innerHTML = `${area.emoji} ${area.name}${badge}${isActive ? '' : dropText}`;
        if (isLocked) {
            const nextBoss = BOSS_AREAS.find(a => a >= maxAllowed && !isBossDefeated(a));
            if (nextBoss !== undefined) {
                const bossCfg = BOSS_CONFIG[nextBoss];
                btn.title = `需先击败 ${bossCfg.emoji} ${bossCfg.name}`;
            }
        } else {
            btn.title = `需要等级 ${area.level}`;
        }
        btn.disabled = game.player.level < area.level || isLocked;
    });

    // 移除超出范围的旧按钮
    Array.from(container.children).forEach(child => {
        const idx = child.getAttribute('data-area-index');
        if (idx !== null && !activeIndices.has(parseInt(idx, 10))) {
            container.removeChild(child);
        }
    });

    // 无尽模式入口
    let endlessBtn = container.querySelector('[data-area="endless"]');
    if (isBossDefeated(14)) {
        if (!endlessBtn) {
            endlessBtn = document.createElement('button');
            endlessBtn.setAttribute('data-area', 'endless');
            endlessBtn.onclick = () => enterEndlessMode();
            container.appendChild(endlessBtn);
        }
        const isEndlessActive = !game.inCity && game.currentArea >= 15;
        endlessBtn.className = 'area-btn' + (isEndlessActive ? ' active' : '');
        endlessBtn.textContent = '♾️ 无尽模式';
        endlessBtn.title = '挑战无限强大的敌人';
        endlessBtn.disabled = false;
    } else if (endlessBtn) {
        container.removeChild(endlessBtn);
    }
}

function updateClueUI() {
    const cluePanel = document.getElementById('cluePanel');
    const bossPanel = document.getElementById('bossPanel');

    if (game.inCity || !isBossArea(game.currentArea) || isBossDefeated(game.currentArea)) {
        cluePanel.style.display = 'none';
        bossPanel.style.display = 'none';
        return;
    }

    cluePanel.style.display = 'block';
    const clues = getClues(game.currentArea);
    const required = getCluesRequired(game.currentArea);
    const percent = Math.min(100, (clues / required) * 100);

    document.getElementById('clueText').textContent = `${clues}/${required}`;
    document.getElementById('clueBar').style.width = percent + '%';
    document.getElementById('clueBarText').textContent = clues >= required ? '线索已集齐！可以挑战BOSS了！' : '击败小怪有几率发现线索';

    if (clues >= required && !game.fightingBoss) {
        bossPanel.style.display = 'block';
    } else {
        bossPanel.style.display = 'none';
    }
}

function renderUpgrades() {
    const container = document.getElementById('upgradeList');
    upgrades.forEach(upgrade => {
        const levelKey = upgrade.id + 'Level';
        const level = game.player[levelKey] || 0;
        const cost = Math.floor(upgrade.cost * Math.pow(1.18, level));
        const canAfford = game.player.gold >= cost;
        let nextDesc = upgrade.desc;
        const aspdLevel = game.player.aspdLevel || 0;
        const aspdCapped = upgrade.type === 'aspd' && aspdLevel >= 100;
        if (upgrade.type === 'aspd') {
            if (aspdCapped) {
                nextDesc = '⚡ 已满级 (10次/秒 伤害×3)';
            } else if (aspdLevel < 40) {
                // 1-40级：攻速增长
                const curSpeed = 1 + 0.005625 * aspdLevel * aspdLevel;
                const nextSpeed = 1 + 0.005625 * (aspdLevel + 1) * (aspdLevel + 1);
                const speedGain = (nextSpeed - curSpeed).toFixed(2);
                nextDesc = `⚡ 攻速 +${speedGain}次/秒`;
            } else {
                // 41-100级：攻速已达上限，伤害倍率线性增长
                nextDesc = `⚡ 伤害倍率 +${(2/60).toFixed(2)}`;
            }
        } else if (upgrade.type === 'crit') {
            if (game.player.crit < 1.0) {
                nextDesc = `💥 暴击率 +${Math.round(upgrade.value*100)}%`;
            } else {
                nextDesc = `💥 暴击伤害 +${Math.round((upgrade.dmgValue || 0.2)*100)}%`;
            }
        } else if (upgrade.type === 'atk') {
            const total = upgrade.value + Math.floor(level / 10) * 2;
            nextDesc = `💪 攻击力 +${total}`;
        } else if (upgrade.type === 'def') {
            const total = upgrade.value + Math.floor(level / 10) * 2;
            nextDesc = `🛡️ 防御力 +${total}`;
        } else if (upgrade.type === 'maxHp') {
            const total = upgrade.value + Math.floor(level / 10) * 5;
            nextDesc = `❤️ 最大生命 +${total}`;
        } else if (upgrade.type === 'vamp') {
            const bonus = upgrade.value + Math.floor(level / 30) * upgrade.value;
            nextDesc = `🧛 吸血 +${Math.round(bonus*100)}%`;
        }
        let item = container.querySelector(`[data-upgrade="${upgrade.id}"]`);
        if (!item) {
            item = document.createElement('div');
            item.className = 'upgrade-item';
            item.setAttribute('data-upgrade', upgrade.id);
            item.innerHTML = `<div class="upgrade-info"><div class="upgrade-name"></div><div class="upgrade-desc"></div></div><div style="display:flex;align-items:center;"><span class="upgrade-cost"></span><button class="btn btn-primary" onclick="buyUpgrade('${upgrade.id}')">升级</button></div>`;
            container.appendChild(item);
        }
        const levelCapped = level >= game.player.level;
        item.querySelector('.upgrade-name').textContent = `${upgrade.name} Lv.${level}`;
        item.querySelector('.upgrade-desc').textContent = nextDesc;
        if (aspdCapped) {
            item.querySelector('.upgrade-cost').textContent = '⚡ 已满级';
        } else if (levelCapped) {
            item.querySelector('.upgrade-cost').textContent = '⛔ 已达等级上限';
        } else {
            item.querySelector('.upgrade-cost').textContent = `💰 ${formatNumber(cost)}`;
        }
        item.querySelector('button').disabled = !canAfford || aspdCapped || levelCapped;
    });
}

function _ensureBagPane(container, tabName) {
    let pane = container.querySelector(`[data-bag-tab="${tabName}"]`);
    if (!pane || !pane.querySelector('[data-header]')) {
        container.innerHTML = '';
        pane = document.createElement('div');
        pane.setAttribute('data-bag-tab', tabName);
        pane.innerHTML = `
            <div data-header style="position:sticky;top:0;z-index:3;padding:6px 10px;border-radius:8px;border:1px solid rgba(255,255,255,0.08);">
                <div data-toolbar style="display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin-bottom:8px;"></div>
                <div data-filter style="display:flex;flex-wrap:wrap;gap:4px;align-items:center;"></div>
            </div>
            <div data-content></div>
        `;
        container.appendChild(pane);
    }
    return pane;
}

function _bagBtn(parent, action, text, onClick, isActive, activeBg, padding) {
    let btn = parent.querySelector(`[data-action="${action}"]`);
    if (!btn) {
        btn = document.createElement('button');
        btn.className = 'btn btn-secondary';
        btn.setAttribute('data-action', action);
        btn.style.cssText = `padding:${padding || '2px 8px'};font-size:0.7em;`;
        btn.onclick = onClick;
        parent.appendChild(btn);
    }
    btn.textContent = text;
    if (isActive && activeBg) {
        btn.style.background = activeBg;
        btn.style.borderColor = 'transparent';
        btn.style.color = '#fff';
    } else {
        btn.style.background = '';
        btn.style.borderColor = '';
        btn.style.color = '';
    }
    return btn;
}

function _bagText(parent, textKey, text, visible) {
    let el = parent.querySelector(`[data-text="${textKey}"]`);
    if (!el) {
        el = document.createElement('span');
        el.setAttribute('data-text', textKey);
        el.style.cssText = 'color:#888;font-size:0.7em;margin-left:4px;';
        parent.appendChild(el);
    }
    el.textContent = text;
    el.style.display = visible ? '' : 'none';
    return el;
}

function renderBag() {
    const container = document.getElementById('bagContent');
    if (!container) return;
    if (currentBagTab === 'treasure') renderBagTreasures(container);
    else if (currentBagTab === 'equipment') renderBagEquipments(container);
    else if (currentBagTab === 'item') renderBagItems(container);
}

const RARITY_ORDER = { divine: 5, legendary: 4, epic: 3, rare: 2, common: 1 };

function renderBagTreasures(container) {
    const treasures = game.player.treasures || {};
    let entries = Object.entries(treasures).filter(([_, d]) => d && d.count > 0);

    if (TREASURE_FILTERS.size > 0) {
        const typeFilters = Array.from(TREASURE_FILTERS).filter(f => f !== 'upgradeable');
        if (typeFilters.length > 0) {
            entries = entries.filter(([tid, _]) => {
                const t = TREASURE_POOL.find(x => x.id === tid);
                return t && typeFilters.includes(t.stat);
            });
        }
    }
    if (TREASURE_FILTERS.has('upgradeable')) {
        entries = entries.filter(([_, d]) => d.count > 1);
    }

    entries.sort((a, b) => {
        const ta = TREASURE_POOL.find(x => x.id === a[0]);
        const tb = TREASURE_POOL.find(x => x.id === b[0]);
        return (RARITY_ORDER[tb?.rarity] || 0) - (RARITY_ORDER[ta?.rarity] || 0);
    });

    const pane = _ensureBagPane(container, 'treasure');
    const toolbar = pane.querySelector('[data-toolbar]');
    const filterBar = pane.querySelector('[data-filter]');
    const content = pane.querySelector('[data-content]');

    _bagBtn(toolbar, 'autoStrengthen', `⚡ 自动强化: ${game.autoStrengthen ? '开' : '关'}`, toggleAutoStrengthen, game.autoStrengthen, 'linear-gradient(45deg,#2ecc71,#27ae60)');

    const treasureFilterBtns = [
        { key: 'all', label: '📦 全部' },
        { key: 'atk', label: '攻击' },
        { key: 'def', label: '防御' },
        { key: 'maxHp', label: '生命' },
        { key: 'crit', label: '暴击' },
        { key: 'expBonus', label: '经验' },
        { key: 'goldBonus', label: '金币' },
        { key: 'armorPenFlat', label: '破甲(固)' },
        { key: 'armorPenPercent', label: '破甲(%)' },
        { key: 'upgradeable', label: '🔨 可强化' },
    ];
    treasureFilterBtns.forEach(btn => {
        const isActive = btn.key === 'all' ? TREASURE_FILTERS.size === 0 : TREASURE_FILTERS.has(btn.key);
        const onClick = btn.key === 'all' ? clearTreasureFilters : () => toggleTreasureFilter(btn.key);
        _bagBtn(filterBar, btn.key, btn.label, onClick, isActive, 'linear-gradient(45deg,#e94560,#ff6b6b)', '2px 7px');
    });

    const totalCount = entries.reduce((sum, [_, d]) => sum + d.count, 0);
    const b = getTreasureBonuses();
    const texts = [];
    if (b.atk) texts.push(`攻击+${formatNumber(b.atk)}`);
    if (b.def) texts.push(`防御+${formatNumber(b.def)}`);
    if (b.maxHp) texts.push(`生命+${formatNumber(b.maxHp)}`);
    if (b.crit) texts.push(`暴击+${Math.round(b.crit*100)}%`);
    if (b.expBonus) texts.push(`经验+${Math.round(b.expBonus*100)}%`);
    if (b.goldBonus) texts.push(`金币+${Math.round(b.goldBonus*100)}%`);
    if (b.armorPenFlat) texts.push(`破甲(固)+${formatNumber(b.armorPenFlat)}`);
    if (b.armorPenPercent) texts.push(`破甲(%)+${Math.round(b.armorPenPercent*100)}%`);

    // 更新或创建信息栏
    let infoBar = content.querySelector('.treasure-info');
    if (!infoBar) {
        infoBar = document.createElement('div');
        infoBar.className = 'treasure-info';
        content.insertBefore(infoBar, content.firstChild);
    }
    if (entries.length === 0) {
        infoBar.textContent = '';
        infoBar.style.cssText = 'text-align:center;color:#666;padding:20px;';
        infoBar.innerHTML = '暂无符合条件的宝物';
    } else {
        infoBar.style.cssText = '';
        infoBar.textContent = `共 ${formatNumber(totalCount)} 件宝物 | ${texts.join(' | ')}`;
    }

    // 确保网格容器存在
    let grid = content.querySelector('.treasure-grid');
    if (!grid) {
        grid = document.createElement('div');
        grid.className = 'treasure-grid';
        content.appendChild(grid);
    }
    if (entries.length === 0) {
        grid.innerHTML = '';
        return;
    }

    const activeIds = new Set();
    entries.forEach(([tid, data]) => {
        const t = TREASURE_POOL.find(x => x.id === tid);
        if (!t) return;
        activeIds.add(tid);
        const rc = RARITY_CONFIG[t.rarity];
        const level = data.level || 1;
        const bonusPerLevel = t.value * 0.5;
        const currentValue = t.value + (level - 1) * bonusPerLevel;
        const canStrengthen = data.count > 1;
        const strengthenCost = Math.floor(t.sellPrice * 0.5 * level);
        const isLocked = data.locked || false;

        let card = grid.querySelector(`[data-treasure-id="${tid}"]`);
        if (!card) {
            card = document.createElement('div');
            card.setAttribute('data-treasure-id', tid);
            grid.appendChild(card);
        }
        card.className = `treasure-item ${t.rarity}`;
        card.style.borderColor = isLocked ? 'rgba(233,69,96,0.6)' : '';
        card.innerHTML = `
            <div style="position: absolute; top: 5px; left: 8px; font-size: 1em; cursor: pointer;" onclick="toggleTreasureLock('${tid}')" title="${isLocked ? '点击解锁' : '点击锁定'}">${isLocked ? '🔒' : '🔓'}</div>
            <div class="treasure-count">×${data.count}</div>
            <div class="treasure-emoji">${t.emoji}</div>
            <div class="rarity-label ${t.rarity}">${rc.label}</div>
            <div class="treasure-name" style="color:${rc.color}">${t.name}</div>
            <div class="treasure-level">Lv.${level} | ${formatValue(t.stat, currentValue)}</div>
            <div class="treasure-stat">基础 ${formatValue(t.stat, t.value)}</div>
            <div class="treasure-actions">
                <button class="btn btn-success" onclick="strengthenTreasure('${tid}')" ${!canStrengthen ? 'disabled' : ''} title="消耗1个+${formatNumber(strengthenCost)}金币强化">🔨 强化</button>
                <button class="btn btn-warning" onclick="sellTreasure('${tid}')" ${isLocked ? 'disabled' : ''}>💰 ${formatNumber(t.sellPrice)}</button>
            </div>
        `;
    });

    // 移除不再存在的卡片
    Array.from(grid.children).forEach(child => {
        const cid = child.getAttribute('data-treasure-id');
        if (cid && !activeIds.has(cid)) grid.removeChild(child);
    });
}

function renderBagEquipments(container) {
    const bag = game.player.equipmentBag || [];
    const pane = _ensureBagPane(container, 'equipment');
    const toolbar = pane.querySelector('[data-toolbar]');
    const filterBar = pane.querySelector('[data-filter]');
    const content = pane.querySelector('[data-content]');
    filterBar.style.gap = '6px';

    const as = game.autoSell;
    const rarityOptions = [
        { key: 'common', label: '普通', color: '#ccc' },
        { key: 'rare', label: '稀有', color: '#4facfe' },
        { key: 'epic', label: '史诗', color: '#a55eea' },
        { key: 'legendary', label: '传说', color: '#f1c40f' },
        { key: 'divine', label: '神器', color: '#ff0044' },
    ];

    _bagBtn(toolbar, 'autoSellEquip', `💰 自动出售: ${as.equipment ? '开' : '关'}`, () => toggleAutoSell('equipment'), as.equipment, 'linear-gradient(45deg,#2ecc71,#27ae60)');
    _bagText(toolbar, 'rarityLabel', '≤', as.equipment);
    rarityOptions.forEach(r => {
        _bagBtn(toolbar, `rarity_${r.key}`, r.label, () => setAutoSellRarity('equipment', r.key), as.equipMaxRarity === r.key, 'linear-gradient(45deg,#f39c12,#e67e22)', '2px 6px').style.display = as.equipment ? '' : 'none';
    });

    const filterSlots = [
        { key: 'all', name: '全部', emoji: '📦' },
        { key: 'weapon', name: '武器', emoji: '⚔️' },
        { key: 'helmet', name: '帽子', emoji: '🪖' },
        { key: 'armor', name: '衣服', emoji: '👕' },
        { key: 'boots', name: '靴子', emoji: '👢' },
        { key: 'belt', name: '腰带', emoji: '🎗️' },
        { key: 'bracelet', name: '手镯', emoji: '💎' },
        { key: 'jade', name: '玉佩', emoji: '🏵️' },
        { key: 'necklace', name: '项链', emoji: '📿' },
    ];
    filterSlots.forEach(slot => {
        const isActive = currentEquipmentFilter === slot.key;
        _bagBtn(filterBar, slot.key, `${slot.emoji} ${slot.name}`, () => setEquipmentFilter(slot.key), isActive, 'linear-gradient(45deg,#e94560,#ff6b6b)', '2px 7px');
    });

    const bagWithIndex = bag.map((item, idx) => ({ item, idx }));
    bagWithIndex.sort((a, b) => {
        const ea = EQUIPMENT_POOL.find(e => e.id === a.item.id);
        const eb = EQUIPMENT_POOL.find(e => e.id === b.item.id);
        const ra = RARITY_ORDER[ea?.rarity] || 0;
        const rb = RARITY_ORDER[eb?.rarity] || 0;
        if (rb !== ra) return rb - ra;
        const refineA = a.item.refine || 0;
        const refineB = b.item.refine || 0;
        if (refineB !== refineA) return refineB - refineA;
        const appraisedA = a.item.appraised !== false ? 1 : 0;
        const appraisedB = b.item.appraised !== false ? 1 : 0;
        return appraisedB - appraisedA;
    });

    // 过滤并记录可见项
    const visibleItems = [];
    bagWithIndex.forEach(({ item, idx: index }) => {
        const eqDef = EQUIPMENT_POOL.find(e => e.id === item.id);
        if (!eqDef) return;
        if (currentEquipmentFilter !== 'all' && eqDef.slot !== currentEquipmentFilter) return;
        visibleItems.push({ item, index, eqDef });
    });

    // 确保网格容器存在
    let grid = content.querySelector('.equipment-bag');
    if (!grid) {
        grid = document.createElement('div');
        grid.className = 'equipment-bag';
        content.appendChild(grid);
    }

    // 更新或创建每个卡片
    visibleItems.forEach(({ item, index, eqDef }, i) => {
        const rc = RARITY_CONFIG[eqDef.rarity];
        const refine = item.refine || 0;
        const refineTag = refine > 0 ? `<span style="color:#ff9f43;font-size:0.7em;">+${refine}</span>` : '';
        const isAppraised = item.appraised !== false;
        const setName = (isAppraised && eqDef.setId && ALL_SETS[eqDef.setId]) ? ALL_SETS[eqDef.setId].name : '';
        const setTag = setName ? `<div style="font-size:0.6em;color:#f1c40f;">${setName}</div>` : '';

        let card = grid.querySelector(`[data-sort-index="${i}"]`);
        if (!card) {
            card = document.createElement('div');
            card.setAttribute('data-sort-index', i);
            grid.appendChild(card);
        }
        card.className = `equipment-bag-item ${eqDef.rarity}`;
        card.innerHTML = `
            <div class="eq-bag-emoji">${isAppraised ? eqDef.emoji : '❓'}</div>
            <div class="eq-bag-name" style="color:${isAppraised ? rc.color : '#888'}">${!isAppraised ? '❓' : ''}${eqDef.name} ${refineTag}</div>
            ${setTag}
            <div class="eq-bag-stat">${isAppraised ? formatEqStat(eqDef, item) : '需要鉴定后才能使用'}</div>
            <div class="eq-bag-actions">
                ${isAppraised ? `<button class="btn btn-success" onclick="equipItem(${index})">穿戴</button>` : ''}
                <button class="btn btn-warning" onclick="sellEquipment(${index})">💰 ${formatNumber(eqDef.sellPrice)}</button>
            </div>
        `;
    });

    // 移除超出数量的旧卡片
    Array.from(grid.children).forEach(child => {
        const si = parseInt(child.getAttribute('data-sort-index'), 10);
        if (si >= visibleItems.length) grid.removeChild(child);
    });

    // 空状态提示
    let emptyMsg = content.querySelector('.equipment-empty-msg');
    if (visibleItems.length === 0) {
        if (!emptyMsg) {
            emptyMsg = document.createElement('div');
            emptyMsg.className = 'equipment-empty-msg';
            emptyMsg.style.cssText = 'text-align:center;color:#666;padding:20px;';
            content.appendChild(emptyMsg);
        }
        emptyMsg.textContent = '暂无未穿戴装备';
    } else if (emptyMsg) {
        content.removeChild(emptyMsg);
    }
}

function setEquipmentFilter(filter) {
    currentEquipmentFilter = filter;
    renderBag();
    renderBlacksmithContent();
}

function setItemFilter(filter) {
    currentItemFilter = filter;
    renderBag();
}

function renderBagItems(container) {
    const itemFilters = [
        { key: 'all', name: '全部', emoji: '📦' },
        { key: 'consumable', name: '消耗品', emoji: '🧪' },
        { key: 'skillbook', name: '技能书', emoji: '📕' },
        { key: 'appraised', name: '已鉴定', emoji: '🔍' },
        { key: 'unappraised', name: '未鉴定', emoji: '❓' },
    ];

    const as = game.autoSell;
    const rarityOptions = [
        { key: 'common', label: '普通' },
        { key: 'rare', label: '稀有' },
        { key: 'epic', label: '史诗' },
        { key: 'legendary', label: '传说' },
        { key: 'divine', label: '禁咒' },
    ];

    const pane = _ensureBagPane(container, 'item');
    const toolbar = pane.querySelector('[data-toolbar]');
    const filterBar = pane.querySelector('[data-filter]');
    const content = pane.querySelector('[data-content]');
    filterBar.style.gap = '6px';

    _bagBtn(toolbar, 'autoSellBooks', `💰 自动出售: ${as.skillBooks ? '开' : '关'}`, () => toggleAutoSell('skillBooks'), as.skillBooks, 'linear-gradient(45deg,#2ecc71,#27ae60)');
    _bagText(toolbar, 'rarityLabel', '≤', as.skillBooks);
    rarityOptions.forEach(r => {
        _bagBtn(toolbar, `rarity_${r.key}`, r.label, () => setAutoSellRarity('skillBooks', r.key), as.bookMaxRarity === r.key, 'linear-gradient(45deg,#f39c12,#e67e22)', '2px 6px').style.display = as.skillBooks ? '' : 'none';
    });

    itemFilters.forEach(f => {
        const isActive = currentItemFilter === f.key;
        _bagBtn(filterBar, f.key, `${f.emoji} ${f.name}`, () => setItemFilter(f.key), isActive, 'linear-gradient(45deg,#e94560,#ff6b6b)', '2px 7px');
    });

    let allEntries = [];
    const items = game.player.items || {};
    const itemEntries = Object.entries(items).filter(([_, d]) => d && d.count > 0);
    const showConsumables = currentItemFilter === 'all' || currentItemFilter === 'consumable';
    if (showConsumables) {
        itemEntries.forEach(([itemId, data]) => {
            const itemDef = SHOP_ITEMS.find(i => i.id === itemId);
            if (!itemDef) return;
            allEntries.push({ type: 'item', id: itemId, data, def: itemDef });
        });
    }

    const books = game.player.skillBooks || {};
    let bookEntries = Object.entries(books).filter(([_, d]) => d && d.count > 0);
    if (currentItemFilter === 'appraised') {
        bookEntries = bookEntries.filter(([_, d]) => d.appraised);
    } else if (currentItemFilter === 'unappraised') {
        bookEntries = bookEntries.filter(([_, d]) => !d.appraised);
    }
    const showSkillbooks = currentItemFilter === 'all' || currentItemFilter === 'skillbook' || currentItemFilter === 'appraised' || currentItemFilter === 'unappraised';
    if (showSkillbooks) {
        bookEntries.forEach(([bookId, data]) => {
            const book = SKILL_BOOKS.find(b => b.id === bookId);
            if (!book) return;
            allEntries.push({ type: 'book', id: bookId, data, def: book });
        });
    }

    // 初始化事件委托（只执行一次）
    if (!content._delegated) {
        content._delegated = true;
        let lpTimer = null;
        let lpTriggered = false;

        const clearLp = () => {
            if (lpTimer) { clearTimeout(lpTimer); lpTimer = null; }
        };

        const startLp = (btn) => {
            clearLp();
            lpTriggered = false;
            lpTimer = setTimeout(() => {
                lpTriggered = true;
                lpTimer = null;
                const id = btn.dataset.id;
                useAllItems(id);
            }, 600);
        };

        content.addEventListener('mousedown', (e) => {
            const btn = e.target.closest('[data-action="use"]');
            if (btn) startLp(btn);
        });
        content.addEventListener('touchstart', (e) => {
            const btn = e.target.closest('[data-action="use"]');
            if (btn) { startLp(btn); }
        }, { passive: true });
        content.addEventListener('mouseup', clearLp);
        content.addEventListener('mouseleave', clearLp);
        content.addEventListener('touchend', clearLp);
        content.addEventListener('touchcancel', clearLp);

        content.addEventListener('click', (e) => {
            if (lpTriggered) {
                lpTriggered = false;
                e.stopPropagation();
                e.preventDefault();
                return;
            }
            const btn = e.target.closest('[data-action]');
            if (!btn) return;
            const action = btn.dataset.action;
            const id = btn.dataset.id;
            if (action === 'use') useItem(id);
            else if (action === 'sell') sellItem(id);
            else if (action === 'learn') learnFromBook(id);
            else if (action === 'sell-book') sellSkillBook(id);
        });
    }

    if (allEntries.length === 0) {
        Array.from(content.children).forEach(c => {
            if (!c.classList.contains('treasure-grid')) content.removeChild(c);
        });
        let empty = content.querySelector('.bag-empty-msg');
        if (!empty) {
            empty = document.createElement('div');
            empty.className = 'bag-empty-msg';
            empty.style.cssText = 'text-align:center;color:#666;padding:30px;';
            empty.textContent = '暂无符合条件的道具';
            content.appendChild(empty);
        }
        let grid = content.querySelector('.treasure-grid');
        if (grid) grid.innerHTML = '';
        return;
    }

    let empty = content.querySelector('.bag-empty-msg');
    if (empty) content.removeChild(empty);

    allEntries.sort((a, b) => {
        const ra = RARITY_ORDER[a.def?.rarity] || 0;
        const rb = RARITY_ORDER[b.def?.rarity] || 0;
        return rb - ra;
    });

    let grid = content.querySelector('.treasure-grid');
    if (!grid) {
        grid = document.createElement('div');
        grid.className = 'treasure-grid';
        content.appendChild(grid);
    }

    const activeIds = new Set();
    allEntries.forEach(entry => {
        const cardId = entry.type === 'item' ? `item-${entry.id}` : `book-${entry.id}`;
        activeIds.add(cardId);

        let card = grid.querySelector(`[data-card-id="${cardId}"]`);
        if (!card) {
            card = document.createElement('div');
            card.setAttribute('data-card-id', cardId);
            grid.appendChild(card);
        }

        if (entry.type === 'item') {
            const itemDef = entry.def;
            const data = entry.data;
            card.className = 'treasure-item';
            card.style.borderColor = 'rgba(46,204,113,0.3)';
            card.innerHTML = `
                <div class="treasure-emoji">${itemDef.emoji}</div>
                <div class="rarity-label" style="background:rgba(46,204,113,0.15);color:#2ecc71;">道具</div>
                <div class="treasure-name" style="color:#2ecc71;">${itemDef.name} ×${data.count}</div>
                <div class="treasure-stat">${itemDef.desc}</div>
                <div class="treasure-actions">
                    ${itemDef.type !== 'enhance_stone' ? `<button class="btn btn-success" data-action="use" data-id="${itemDef.id}">使用</button>` : '<span style="font-size:0.7em;color:#888">铁匠铺使用</span>'}
                    <button class="btn btn-warning" data-action="sell" data-id="${itemDef.id}">💰 ${formatNumber(Math.floor(itemDef.basePrice * 0.3))}</button>
                </div>
            `;
        } else {
            const book = entry.def;
            const data = entry.data;
            const rc = RARITY_CONFIG[book.rarity];
            const isAppraised = data.appraised;
            card.className = `treasure-item ${book.rarity}`;
            card.style.borderColor = '';
            card.innerHTML = `
                <div class="treasure-emoji">${book.emoji}</div>
                <div class="rarity-label ${book.rarity}">${rc.label}</div>
                <div class="treasure-name" style="color:${rc.color}">${book.name} ×${data.count}</div>
                <div class="treasure-stat">${isAppraised ? '🔍 已鉴定' : '❓ 未鉴定'}</div>
                <div class="treasure-actions">
                    ${isAppraised ? (game.player.skills[book.skillId]?.level > 0 ? '<span style="font-size:0.7em;color:#2ecc71">已学会</span>' : `<button class="btn btn-success" data-action="learn" data-id="${book.id}">学习</button>`) : `<span style="font-size:0.7em;color:#888">❓ 未鉴定</span>`}
                    <button class="btn btn-warning" data-action="sell-book" data-id="${book.id}">💰 ${formatNumber(book.sellPrice)}</button>
                </div>
            `;
        }
    });

    Array.from(grid.children).forEach(child => {
        const cid = child.getAttribute('data-card-id');
        if (cid && !activeIds.has(cid)) grid.removeChild(child);
    });
}

function _applyItemEffect(item, now) {
    switch (item.type) {
        case 'permanent_atk': {
            game.player.atk += item.value;
            log(`💠 使用了${item.name}，永久攻击力+${formatNumber(item.value)}！`, 'log-skill');
            break;
        }
        case 'heal': {
            const stats = getPlayerStats();
            const healAmount = Math.floor(stats.maxHp * item.value);
            game.player.hp = Math.min(stats.maxHp, game.player.hp + healAmount);
            log(`🩹 使用了${item.name}，恢复 ${formatNumber(healAmount)} 点生命值`, 'log-heal');
            showNotification(`🩹 ${item.name}生效！`);
            break;
        }
        case 'mp': {
            const stats = getPlayerStats();
            const mpAmount = Math.floor(stats.maxMp * item.value);
            game.player.mp = Math.min(stats.maxMp, game.player.mp + mpAmount);
            log(`💧 使用了${item.name}，恢复 ${formatNumber(mpAmount)} 点魔力值`, 'log-heal');
            showNotification(`💧 ${item.name}生效！`);
            break;
        }
        case 'buff_exp': {
            game.player.buffs = game.player.buffs || {};
            const existingExp = game.player.buffs.expBonus;
            let expMins;
            if (existingExp && existingExp.endTime > now) {
                existingExp.endTime += item.duration;
                expMins = Math.floor((existingExp.endTime - now) / 60000);
                log(`📜 使用了${item.name}，经验加成持续时间延长，剩余${expMins}分钟！`, 'log-epic');
            } else {
                game.player.buffs.expBonus = { value: item.value, endTime: now + item.duration };
                expMins = Math.floor(item.duration / 60000);
                log(`📜 使用了${item.name}，经验加成+${Math.round(item.value * 100)}%，持续${expMins}分钟！`, 'log-epic');
            }
            showNotification(`📜 经验加成+${Math.round(item.value * 100)}%，剩余${expMins}分钟！`);
            break;
        }
        case 'buff_atk': {
            game.player.buffs = game.player.buffs || {};
            const existingAtk = game.player.buffs.atkBonus;
            let atkMins;
            if (existingAtk && existingAtk.endTime > now) {
                existingAtk.endTime += item.duration;
                atkMins = Math.floor((existingAtk.endTime - now) / 60000);
                log(`⚔️ 使用了${item.name}，攻击加成持续时间延长，剩余${atkMins}分钟！`, 'log-epic');
            } else {
                game.player.buffs.atkBonus = { value: item.value, endTime: now + item.duration };
                atkMins = Math.floor(item.duration / 60000);
                log(`⚔️ 使用了${item.name}，攻击力+${Math.round(item.value * 100)}%，持续${atkMins}分钟！`, 'log-epic');
            }
            showNotification(`⚔️ 攻击力+${Math.round(item.value * 100)}%，剩余${atkMins}分钟！`);
            break;
        }
        case 'buff_def': {
            game.player.buffs = game.player.buffs || {};
            const existingDef = game.player.buffs.defBonus;
            let defMins;
            if (existingDef && existingDef.endTime > now) {
                existingDef.endTime += item.duration;
                defMins = Math.floor((existingDef.endTime - now) / 60000);
                log(`🛡️ 使用了${item.name}，防御加成持续时间延长，剩余${defMins}分钟！`, 'log-epic');
            } else {
                game.player.buffs.defBonus = { value: item.value, endTime: now + item.duration };
                defMins = Math.floor(item.duration / 60000);
                log(`🛡️ 使用了${item.name}，防御力+${Math.round(item.value * 100)}%，持续${defMins}分钟！`, 'log-epic');
            }
            showNotification(`🛡️ 防御力+${Math.round(item.value * 100)}%，剩余${defMins}分钟！`);
            break;
        }
        case 'permanent_all': {
            const v = item.value;
            game.player.atk += v.atk;
            game.player.def += v.def;
            game.player.maxHp += v.maxHp;
            log(`💠 使用了${item.name}，永久攻击力+${v.atk}、防御力+${v.def}、最大生命+${v.maxHp}！`, 'log-skill');
            break;
        }
        case 'buff_exp_gold': {
            game.player.buffs = game.player.buffs || {};
            const v = item.value;
            const existingExp = game.player.buffs.expBonus;
            const existingGold = game.player.buffs.goldBonus;
            let mins;
            if (existingExp && existingExp.endTime > now) {
                existingExp.endTime += item.duration;
                existingGold.endTime += item.duration;
                mins = Math.floor((existingExp.endTime - now) / 60000);
                log(`🌟 使用了${item.name}，经验与金币加成持续时间延长，剩余${mins}分钟！`, 'log-epic');
            } else {
                game.player.buffs.expBonus = { value: v.expBonus, endTime: now + item.duration };
                game.player.buffs.goldBonus = { value: v.goldBonus, endTime: now + item.duration };
                mins = Math.floor(item.duration / 60000);
                log(`🌟 使用了${item.name}，经验加成+${Math.round(v.expBonus * 100)}%、金币加成+${Math.round(v.goldBonus * 100)}%，持续${mins}分钟！`, 'log-epic');
            }
            showNotification(`🌟 经验+${Math.round(v.expBonus * 100)}%、金币+${Math.round(v.goldBonus * 100)}%，剩余${mins}分钟！`);
            break;
        }
        case 'permanent_crit': {
            const v = item.value;
            game.player.critDmg += v.critDmg;
            log(`💠 使用了${item.name}，永久暴击伤害+${Math.round(v.critDmg * 100)}%！`, 'log-skill');
            break;
        }
        case 'buff_atk_aspd': {
            game.player.buffs = game.player.buffs || {};
            const v = item.value;
            const existingAtk = game.player.buffs.atkBonus;
            const existingAspd = game.player.buffs.aspdMultBuff;
            let mins;
            if (existingAtk && existingAtk.endTime > now) {
                existingAtk.endTime += item.duration;
                existingAspd.endTime += item.duration;
                mins = Math.floor((existingAtk.endTime - now) / 60000);
                log(`⚗️ 使用了${item.name}，攻击与攻速加成持续时间延长，剩余${mins}分钟！`, 'log-epic');
            } else {
                game.player.buffs.atkBonus = { value: v.atkMult, endTime: now + item.duration };
                game.player.buffs.aspdMultBuff = { value: v.aspdMult, endTime: now + item.duration };
                mins = Math.floor(item.duration / 60000);
                log(`⚗️ 使用了${item.name}，攻击力+${Math.round(v.atkMult * 100)}%、攻速+${Math.round(v.aspdMult * 100)}%，持续${mins}分钟！`, 'log-epic');
            }
            showNotification(`⚗️ 攻击+${Math.round(v.atkMult * 100)}%、攻速+${Math.round(v.aspdMult * 100)}%，剩余${mins}分钟！`);
            break;
        }
        case 'heal_full': {
            const stats = getPlayerStats();
            const hpAmount = stats.maxHp - game.player.hp;
            const mpAmount = stats.maxMp - game.player.mp;
            game.player.hp = stats.maxHp;
            game.player.mp = stats.maxMp;
            log(`🪶 使用了${item.name}，恢复 ${formatNumber(hpAmount)} 点生命、${formatNumber(mpAmount)} 点魔力`, 'log-heal');
            showNotification(`🪶 ${item.name}生效！`);
            break;
        }
        case 'buff_aspd': {
            game.player.buffs = game.player.buffs || {};
            const existing = game.player.buffs.aspdMultBuff;
            let mins;
            if (existing && existing.endTime > now) {
                existing.endTime += item.duration;
                mins = Math.floor((existing.endTime - now) / 60000);
                log(`💨 使用了${item.name}，攻速加成持续时间延长，剩余${mins}分钟！`, 'log-epic');
            } else {
                game.player.buffs.aspdMultBuff = { value: item.value, endTime: now + item.duration };
                mins = Math.floor(item.duration / 60000);
                log(`💨 使用了${item.name}，攻速+${Math.round(item.value * 100)}%，持续${mins}分钟！`, 'log-epic');
            }
            showNotification(`💨 攻速+${Math.round(item.value * 100)}%，剩余${mins}分钟！`);
            break;
        }
    }
}

function useItem(itemId) {
    const item = SHOP_ITEMS.find(i => i.id === itemId);
    if (!item) return;
    if (item.type === 'enhance_stone') { log('🔮 强化石只能在铁匠铺锻造时使用！', 'log-damage'); return; }
    const playerItems = game.player.items || {};
    const data = playerItems[itemId];
    if (!data || data.count <= 0) { log('道具数量不足！', 'log-damage'); return; }

    data.count--;
    if (data.count <= 0) delete playerItems[itemId];

    _applyItemEffect(item, Date.now());

    renderBag();
    updateUI();
}

async function useAllItems(itemId) {
    const item = SHOP_ITEMS.find(i => i.id === itemId);
    if (!item) return;
    if (item.type === 'enhance_stone') { log('🔮 强化石只能在铁匠铺锻造时使用！', 'log-damage'); return; }
    const playerItems = game.player.items || {};
    const data = playerItems[itemId];
    if (!data || data.count <= 0) { log('道具数量不足！', 'log-damage'); return; }

    const count = data.count;
    const confirmed = await showConfirm(`确定要一次性使用全部 ${count} 个 ${item.name} 吗？`);
    if (!confirmed) return;

    delete playerItems[itemId];
    const now = Date.now();
    for (let i = 0; i < count; i++) {
        _applyItemEffect(item, now);
    }
    log(`🏪 批量使用了 ${item.emoji} ${item.name} ×${count}！`, 'log-epic');
    showNotification(`🏪 已使用 ${item.name} ×${count}`);

    renderBag();
    updateUI();
}

function sellItem(itemId) {
    const item = SHOP_ITEMS.find(i => i.id === itemId);
    if (!item) return;
    const playerItems = game.player.items || {};
    const data = playerItems[itemId];
    if (!data || data.count <= 0) return;
    data.count--;
    if (data.count <= 0) delete playerItems[itemId];
    const sellPrice = Math.floor(item.basePrice * 0.3);
    game.player.gold += sellPrice;
    log(`💰 出售了 ${item.emoji} ${item.name}，获得 ${formatNumber(sellPrice)} 金币`, 'log-loot');
    renderBag();
    updateUI();
}

function getActiveBuffs() {
    const buffs = game.player.buffs || {};
    const now = Date.now();
    const active = [];
    if (buffs.expBonus && buffs.expBonus.endTime > now) active.push({ name: '经验加成', emoji: '📜', value: buffs.expBonus.value, endTime: buffs.expBonus.endTime });
    if (buffs.goldBonus && buffs.goldBonus.endTime > now) active.push({ name: '金币加成', emoji: '💰', value: buffs.goldBonus.value, endTime: buffs.goldBonus.endTime });
    if (buffs.atkBonus && buffs.atkBonus.endTime > now) active.push({ name: '攻击加成', emoji: '⚔️', value: buffs.atkBonus.value, endTime: buffs.atkBonus.endTime });
    if (buffs.defBonus && buffs.defBonus.endTime > now) active.push({ name: '防御加成', emoji: '🛡️', value: buffs.defBonus.value, endTime: buffs.defBonus.endTime });
    if (buffs.shield && buffs.shield.endTime > now) active.push({ name: '护盾', emoji: '🛡️', value: buffs.shield.defBonus, endTime: buffs.shield.endTime });
    if (buffs.aspdMultBuff && buffs.aspdMultBuff.endTime > now) active.push({ name: '攻速加成', emoji: '💨', value: buffs.aspdMultBuff.value, endTime: buffs.aspdMultBuff.endTime });
    return active;
}

function cleanExpiredBuffs() {
    const buffs = game.player.buffs || {};
    const now = Date.now();
    let expired = false;
    for (const [key, buff] of Object.entries(buffs)) {
        if (buff.endTime && buff.endTime <= now) {
            delete buffs[key];
            expired = true;
            const names = { expBonus: '📜 经验加成', goldBonus: '💰 金币加成', atkBonus: '⚔️ 攻击加成', defBonus: '🛡️ 防御加成', shield: '🛡️ 护盾', aspdMultBuff: '💨 攻速加成' };
            log(`${names[key] || key} 效果已消失`, 'log-death');
        }
    }
    return expired;
}

function cleanExpiredDebuffs() {
    const debuffs = game.player.debuffs || {};
    const now = Date.now();
    let expired = false;
    const names = { bleed: '🩸 流血', poison: '☠️ 中毒', weakness: '💔 虚弱', slow: '🐢 迟缓', fragile: '💥 脆弱', silence: '🔇 沉默' };
    for (const [key, debuff] of Object.entries(debuffs)) {
        if (debuff.endTime && debuff.endTime <= now) {
            delete debuffs[key];
            expired = true;
            log(`${names[key] || key} 效果已解除`, 'log-heal');
        }
    }
    return expired;
}

function getActiveDebuffs() {
    const debuffs = game.player.debuffs || {};
    const now = Date.now();
    const active = [];
    const meta = {
        bleed: { name: '流血', emoji: '🩸', isPercent: true },
        poison: { name: '中毒', emoji: '☠️', isPercent: true },
        weakness: { name: '虚弱', emoji: '💔', isPercent: true },
        slow: { name: '迟缓', emoji: '🐢', isPercent: true },
        fragile: { name: '脆弱', emoji: '💥', isPercent: true },
        silence: { name: '沉默', emoji: '🔇', isPercent: false }
    };
    for (const [key, debuff] of Object.entries(debuffs)) {
        if (debuff.endTime && debuff.endTime > now) {
            const m = meta[key] || { name: key, emoji: '⚠️', isPercent: true };
            active.push({ key, name: m.name, emoji: m.emoji, value: debuff.value || 0, endTime: debuff.endTime, isPercent: m.isPercent });
        }
    }
    return active;
}

function applyDebuff(key, duration, value, source) {
    game.player.debuffs = game.player.debuffs || {};
    const now = Date.now();
    const existing = game.player.debuffs[key];
    const debuffNames = { bleed: '流血', poison: '中毒', weakness: '虚弱', slow: '迟缓', fragile: '脆弱', silence: '沉默' };
    const debuffEmojis = { bleed: '🩸', poison: '☠️', weakness: '💔', slow: '🐢', fragile: '💥', silence: '🔇' };
    if (existing && existing.endTime > now) {
        existing.endTime = Math.max(existing.endTime, now + duration);
    } else {
        const base = { endTime: now + duration, value: value || 0, source: source || '' };
        if (key === 'bleed' || key === 'poison') {
            base.tickInterval = 3000;
            base.nextTick = now + 3000;
        }
        game.player.debuffs[key] = base;
    }
    const name = debuffNames[key] || key;
    const emoji = debuffEmojis[key] || '⚠️';
    log(`${emoji} ${source} 使你陷入【${name}】状态！`, 'log-damage');
}

function processDebuffDamage() {
    const debuffs = game.player.debuffs || {};
    const now = Date.now();
    const stats = getPlayerStats(false);
    let totalDmg = 0;
    const playerRes = getPlayerStats(false);
    if (debuffs.bleed && debuffs.bleed.endTime > now && debuffs.bleed.nextTick <= now) {
        const dmg = Math.max(1, Math.floor(stats.maxHp * (debuffs.bleed.value || 0.02)));
        totalDmg += dmg;
        debuffs.bleed.nextTick = now + debuffs.bleed.tickInterval;
        log(`🩸 流血造成了 ${formatNumber(dmg)} 点伤害！`, 'log-damage');
    }
    if (debuffs.poison && debuffs.poison.endTime > now && debuffs.poison.nextTick <= now) {
        const dmg = Math.max(1, Math.floor(stats.maxHp * (debuffs.poison.value || 0.015) * (1 - playerRes.poisonRes)));
        totalDmg += dmg;
        debuffs.poison.nextTick = now + debuffs.poison.tickInterval;
        log(`☠️ 中毒造成了 ${formatNumber(dmg)} 点伤害！${playerRes.poisonRes > 0 ? '【毒抗减免】' : ''}`, 'log-damage');
    }
    if (totalDmg > 0) {
        game.player.hp = Math.max(0, game.player.hp - totalDmg);
        if (game.player.hp <= 0) playerDeath();
    }
}

// ========== 敌人debuff系统 ==========
function getEnemyDebuffResist() {
    if (!game.enemy) return 0;
    const areaIndex = game.currentArea;
    let baseResist = Math.min(0.25, areaIndex * 0.012);
    if (areaIndex >= 15) {
        const layer = areaIndex - 14;
        baseResist = Math.min(0.40, 0.20 + layer * 0.008);
    }
    if (game.enemy.isBoss) baseResist += 0.10;
    else if (game.enemy.isElite) baseResist += 0.05;
    return Math.min(0.60, baseResist);
}

function calculateDebuffSuccess(baseChance) {
    if (!game.enemy) return false;
    const levelDiff = (game.player.level || 1) - (game.enemy.level || 1);
    const levelBonus = Math.min(0.30, Math.max(-0.20, levelDiff * 0.02));
    const enemyResist = getEnemyDebuffResist();
    const successRate = Math.max(0.05, Math.min(0.95, baseChance + levelBonus - enemyResist));
    return Math.random() < successRate;
}

function applyEnemyDebuff(key, duration, value, source) {
    if (!game.enemy) return;
    game.enemy.debuffs = game.enemy.debuffs || {};
    const now = Date.now();
    const existing = game.enemy.debuffs[key];
    const names = { burn: '灼烧', freeze: '冰冻', curse: '诅咒', weaken: '虚弱', poison: '中毒' };
    const emojis = { burn: '🔥', freeze: '❄️', curse: '🌑', weaken: '✨', poison: '💀' };
    if (existing && existing.endTime > now) {
        existing.endTime = Math.max(existing.endTime, now + duration);
    } else {
        const base = { endTime: now + duration, value: value || 0, source: source || '' };
        if (key === 'burn' || key === 'poison') {
            base.tickInterval = 3000;
            base.nextTick = now + 3000;
        }
        game.enemy.debuffs[key] = base;
    }
    const name = names[key] || key;
    const emoji = emojis[key] || '⚠️';
    log(`${emoji} ${source} 使敌人陷入【${name}】状态！`, 'log-skill');
}

function processEnemyDebuffDamage() {
    if (!game.enemy || !game.enemy.debuffs) return;
    const debuffs = game.enemy.debuffs;
    const now = Date.now();
    let totalDmg = 0;
    if (debuffs.burn && debuffs.burn.endTime > now && debuffs.burn.nextTick <= now) {
        const dmg = Math.max(1, Math.floor(game.enemy.maxHp * (debuffs.burn.value || 0.03)));
        totalDmg += dmg;
        debuffs.burn.nextTick = now + debuffs.burn.tickInterval;
        log(`🔥 灼烧对敌人造成了 ${formatNumber(dmg)} 点伤害！`, 'log-skill');
    }
    if (debuffs.poison && debuffs.poison.endTime > now && debuffs.poison.nextTick <= now) {
        const dmg = Math.max(1, Math.floor(game.enemy.maxHp * (debuffs.poison.value || 0.02)));
        totalDmg += dmg;
        debuffs.poison.nextTick = now + debuffs.poison.tickInterval;
        log(`💀 中毒对敌人造成了 ${formatNumber(dmg)} 点伤害！`, 'log-skill');
    }
    if (totalDmg > 0) {
        game.enemy.hp = Math.max(0, game.enemy.hp - totalDmg);
        if (game.enemy.hp <= 0) {
            enemyDefeated();
        }
    }
}

function getEnemyEffectiveAtk() {
    if (!game.enemy) return 0;
    let atk = game.enemy.atk;
    const debuffs = game.enemy.debuffs || {};
    const now = Date.now();
    if (debuffs.curse && debuffs.curse.endTime > now) {
        atk = Math.floor(atk * (1 - debuffs.curse.value));
    }
    return atk;
}

function getEnemyEffectiveDef() {
    if (!game.enemy) return 0;
    let def = game.enemy.def;
    const debuffs = game.enemy.debuffs || {};
    const now = Date.now();
    if (debuffs.weaken && debuffs.weaken.endTime > now) {
        def = Math.floor(def * (1 - debuffs.weaken.value));
    }
    return def;
}

function getEnemyEffectiveAspd() {
    if (!game.enemy) return 900;
    let aspd = game.enemy.aspd || 900;
    const debuffs = game.enemy.debuffs || {};
    const now = Date.now();
    if (debuffs.freeze && debuffs.freeze.endTime > now) {
        aspd = Math.floor(aspd * (1 + debuffs.freeze.value));
    }
    return aspd;
}

function getActiveEnemyDebuffs() {
    if (!game.enemy || !game.enemy.debuffs) return [];
    const debuffs = game.enemy.debuffs;
    const now = Date.now();
    const active = [];
    const meta = {
        burn: { name: '灼烧', emoji: '🔥', isPercent: true },
        freeze: { name: '冰冻', emoji: '❄️', isPercent: true },
        curse: { name: '诅咒', emoji: '🌑', isPercent: true },
        weaken: { name: '虚弱', emoji: '✨', isPercent: true },
        poison: { name: '中毒', emoji: '💀', isPercent: true }
    };
    for (const [key, debuff] of Object.entries(debuffs)) {
        if (debuff.endTime && debuff.endTime > now) {
            const m = meta[key] || { name: key, emoji: '⚠️', isPercent: true };
            active.push({ key, name: m.name, emoji: m.emoji, value: debuff.value || 0, endTime: debuff.endTime, isPercent: m.isPercent });
        }
    }
    return active;
}

function cleanExpiredEnemyDebuffs() {
    if (!game.enemy || !game.enemy.debuffs) return false;
    const debuffs = game.enemy.debuffs;
    const now = Date.now();
    let expired = false;
    for (const [key, debuff] of Object.entries(debuffs)) {
        if (debuff.endTime && debuff.endTime <= now) {
            delete debuffs[key];
            expired = true;
        }
    }
    return expired;
}

// 数值单位规则：K(千) M(百万) B(十亿) T(万亿) Qa(10^15) Qi(10^18) Sx(10^21) Sp(10^24) Oc(10^27) No(10^30) Dc(10^33)
const NUMBER_UNITS = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc'];

function formatNumber(num) {
    if (num === null || num === undefined || isNaN(num)) return '0';
    const n = Number(num);
    const abs = Math.abs(n);
    if (abs < 1000) return Math.floor(n).toString();
    let tier = Math.floor(Math.log10(abs) / 3);
    if (tier >= NUMBER_UNITS.length) {
        // 超出单位表使用科学计数法
        return n.toExponential(2);
    }
    const scaled = n / Math.pow(1000, tier);
    // 保留合适的精度：>=100 不保留小数，>=10 保留1位，<10 保留2位
    let formatted;
    const absScaled = Math.abs(scaled);
    if (absScaled >= 100) formatted = scaled.toFixed(0);
    else if (absScaled >= 10) formatted = scaled.toFixed(1);
    else formatted = scaled.toFixed(2);
    formatted = formatted.replace(/\.?0+$/, '');
    return formatted + NUMBER_UNITS[tier];
}

function formatValue(stat, value) {
    const names = { atk: '攻击力', def: '防御力', maxHp: '生命', crit: '暴击率', critDmg: '暴击伤害', expBonus: '经验加成', goldBonus: '金币加成', armorPenFlat: '破甲(固定)', armorPenPercent: '破甲(%)' };
    const name = names[stat] || stat;
    if (stat === 'crit' || stat === 'critDmg' || stat === 'expBonus' || stat === 'goldBonus' || stat === 'armorPenPercent') return `${name}+${Math.round(value*100)}%`;
    return `${name}+${formatNumber(value)}`;
}

function formatEqStat(eqDef, item) {
    const m = (item && item.attrMult) ? item.attrMult : 1;
    const scale = (v) => v * m;
    const texts = [];
    if (eqDef.atk) texts.push(`攻击+${formatNumber(scale(eqDef.atk))}`);
    if (eqDef.def) texts.push(`防御+${formatNumber(scale(eqDef.def))}`);
    if (eqDef.maxHp) texts.push(`生命+${formatNumber(scale(eqDef.maxHp))}`);
    if (eqDef.aspd) texts.push(`攻速+${formatNumber(scale(eqDef.aspd))}`);
    if (eqDef.crit) texts.push(`暴击+${Math.round(scale(eqDef.crit)*100)}%`);
    if (eqDef.critDmg) texts.push(`爆伤+${Math.round(scale(eqDef.critDmg)*100)}%`);
    if (eqDef.vamp) texts.push(`吸血+${Math.round(scale(eqDef.vamp)*100)}%`);
    if (eqDef.expBonus) texts.push(`经验+${Math.round(scale(eqDef.expBonus)*100)}%`);
    if (eqDef.spi) texts.push(`精神+${formatNumber(scale(eqDef.spi))}`);
    return texts.join(' ');
}

function renderEquipments() {
    const grid = document.getElementById('equipmentGrid');
    const info = document.getElementById('equipmentInfo');
    if (!grid) return;
    const eqs = game.player.equipments || {};
    const eqBonuses = getEquipmentBonuses();
    const bonusTexts = [];
    if (eqBonuses.atk) bonusTexts.push(`攻击+${formatNumber(eqBonuses.atk)}`);
    if (eqBonuses.def) bonusTexts.push(`防御+${formatNumber(eqBonuses.def)}`);
    if (eqBonuses.maxHp) bonusTexts.push(`生命+${formatNumber(eqBonuses.maxHp)}`);
    if (eqBonuses.aspd) bonusTexts.push(`攻速+${formatNumber(eqBonuses.aspd)}`);
    if (eqBonuses.crit) bonusTexts.push(`暴击+${Math.round(eqBonuses.crit*100)}%`);
    if (eqBonuses.vamp) bonusTexts.push(`吸血+${Math.round(eqBonuses.vamp*100)}%`);
    if (eqBonuses.expBonus) bonusTexts.push(`经验+${Math.round(eqBonuses.expBonus*100)}%`);
    if (eqBonuses.spi) bonusTexts.push(`精神+${formatNumber(eqBonuses.spi)}`);
    const bonusLine = bonusTexts.length > 0 ? `装备加成: ${bonusTexts.join(' | ')}` : '暂无装备加成';
    let setLine = '';
    if (eqBonuses.activeSetDescs && eqBonuses.activeSetDescs.length > 0) {
        setLine = eqBonuses.activeSetDescs.join('<br>');
    }
    info.innerHTML = setLine ? `${bonusLine}<br><br>${setLine}` : bonusLine;

    for (const [slotKey, slotDef] of Object.entries(EQUIPMENT_SLOTS)) {
        let slot = grid.querySelector(`[data-slot="${slotKey}"]`);
        if (!slot) {
            slot = document.createElement('div');
            slot.setAttribute('data-slot', slotKey);
            slot.onclick = () => unequipItem(slotKey);
            grid.appendChild(slot);
        }

        const data = eqs[slotKey];
        if (data) {
            const eqDef = EQUIPMENT_POOL.find(e => e.id === data.id);
            if (eqDef) {
                const rc = RARITY_CONFIG[eqDef.rarity];
                const refine = data.refine || 0;
                const refineTag = refine > 0 ? `<span style="color:#ff9f43;font-size:0.65em;">+${refine}</span>` : '';
                const setTag = eqDef.setId ? `<div style="font-size:0.6em;color:#f1c40f;margin-top:2px;">${ALL_SETS[eqDef.setId]?.name || ''}</div>` : '';
                slot.className = `equipment-slot ${eqDef.rarity}`;
                slot.title = '点击卸下';
                slot.innerHTML = `
                    <div class="slot-emoji">${eqDef.emoji}</div>
                    <div class="eq-name" style="color:${rc.color}">${eqDef.name} ${refineTag}</div>
                    <div class="eq-stat">${formatEqStat(eqDef, data)}</div>
                    ${setTag}
                `;
                continue;
            }
        }
        slot.className = 'equipment-slot empty';
        slot.title = '';
        slot.innerHTML = `
            <div class="slot-emoji" style="opacity:0.4">${slotDef.emoji}</div>
            <div class="eq-name">${slotDef.name}</div>
            <div class="eq-stat" style="opacity:0;">&nbsp;</div>
        `;
    }
}

function updateUI() {
    const stats = getPlayerStats();
    document.getElementById('level').textContent = game.player.level;
    document.getElementById('hpBar').style.width = (game.player.hp / stats.maxHp * 100) + '%';
    document.getElementById('hpText').textContent = `${formatNumber(game.player.hp)}/${formatNumber(stats.maxHp)}`;
    document.getElementById('expBar').style.width = (game.player.exp / game.player.maxExp * 100) + '%';
    document.getElementById('expText').textContent = `${formatNumber(game.player.exp)}/${formatNumber(game.player.maxExp)}`;
    document.getElementById('mpBar').style.width = (game.player.mp / stats.maxMp * 100) + '%';
    document.getElementById('mpText').textContent = `${formatNumber(game.player.mp)}/${formatNumber(stats.maxMp)}`;
    document.getElementById('atk').textContent = `${formatNumber(game.player.atk)} (+${formatNumber(stats.atk - game.player.atk)})`;
    document.getElementById('def').textContent = `${formatNumber(game.player.def)} (+${formatNumber(stats.def - game.player.def)})`;
    document.getElementById('maxHp').textContent = `${formatNumber(game.player.maxHp)} (+${formatNumber(stats.maxHp - game.player.maxHp)})`;
    document.getElementById('spi').textContent = formatNumber(game.player.spi);
    const cappedAspd = Math.min(1000 / stats.aspd, MAX_ATK_SPEED);
    let aspdText = `${cappedAspd.toFixed(1)}/s`;
    if (stats.speedMultiplier > 1.0) aspdText += ` (×${stats.speedMultiplier.toFixed(1)} 伤害)`;
    document.getElementById('aspd').textContent = aspdText;
    document.getElementById('crit').textContent = `${Math.round(stats.crit*100)}% (${Math.round(game.player.crit*100)}% + ${Math.round((stats.crit-game.player.crit)*100)}%)`;
    document.getElementById('critDmg').textContent = `${Math.round(stats.critDmg*100)}%`;
    document.getElementById('vamp').textContent = `${Math.round(stats.vamp*100)}% (${Math.round(game.player.vamp*100)}% + ${Math.round((stats.vamp-game.player.vamp)*100)}%)`;
    document.getElementById('expBonus').textContent = `${Math.round(stats.expBonus*100)}%`;
    document.getElementById('gold').textContent = formatNumber(game.player.gold);
    document.getElementById('kills').textContent = formatNumber(game.player.kills);
    document.getElementById('armorPenFlat').textContent = formatNumber(stats.armorPenFlat);
    document.getElementById('armorPenPercent').textContent = `${Math.round(stats.armorPenPercent*100)}%`;
    document.getElementById('battleLevel').textContent = game.player.level;

    // 战力忽略临时 buff，使用基础属性计算
    const baseStats = getPlayerStats(false);
    const power = Math.floor((baseStats.atk * 2 + baseStats.def * 1.5 + baseStats.maxHp * 0.5 + baseStats.crit * 100 + baseStats.critDmg * 20 + baseStats.armorPenFlat * 5 + baseStats.armorPenPercent * 300 + baseStats.spi * 5) * baseStats.speedMultiplier);
    document.getElementById('power').textContent = formatNumber(power);

    // 更新buff与成就显示
    const buffPanel = document.getElementById('buffPanel');
    const activeBuffs = getActiveBuffs();
    let hasAny = false;
    if (buffPanel) {
        // 成就文本
        let achText = '';
        if (stats.ach && (stats.ach.atk || stats.ach.def || stats.ach.maxHp || stats.ach.crit || stats.ach.vamp || stats.ach.spi)) {
            const achTexts = [];
            if (stats.ach.atk) achTexts.push(`攻击+${stats.ach.atk}`);
            if (stats.ach.def) achTexts.push(`防御+${stats.ach.def}`);
            if (stats.ach.maxHp) achTexts.push(`生命+${stats.ach.maxHp}`);
            if (stats.ach.crit) achTexts.push(`暴击+${Math.round(stats.ach.crit*100)}%`);
            if (stats.ach.vamp) achTexts.push(`吸血+${Math.round(stats.ach.vamp*100)}%`);
            if (stats.ach.spi) achTexts.push(`精神+${stats.ach.spi}`);
            achText = `🏆 成就加成: ${achTexts.join(' | ')}`;
            hasAny = true;
        }

        // 复用/创建成就元素
        let achEl = buffPanel.querySelector('[data-ach]');
        if (achText) {
            if (!achEl) {
                achEl = document.createElement('div');
                achEl.setAttribute('data-ach', '');
                achEl.style.cssText = 'margin-top:4px;font-size:0.7em;color:#f1c40f;';
                buffPanel.appendChild(achEl);
            }
            achEl.textContent = achText;
            achEl.style.display = '';
        } else if (achEl) {
            achEl.style.display = 'none';
        }

        // 复用/创建buff元素
        const buffIds = new Set();
        activeBuffs.forEach(buff => {
            const bid = `buff-${buff.name}`;
            buffIds.add(bid);
            let el = buffPanel.querySelector(`[data-buff="${bid}"]`);
            if (!el) {
                el = document.createElement('div');
                el.setAttribute('data-buff', bid);
                el.style.cssText = 'display:block;background:rgba(46,204,113,0.15);color:#2ecc71;padding:2px 8px;border-radius:10px;font-size:0.7em;margin:2px 0;';
                buffPanel.appendChild(el);
            }
            el.style.display = 'block';
            el.style.margin = '2px 0';
            const remaining = Math.max(0, Math.ceil((buff.endTime - Date.now()) / 1000));
            const mins = Math.floor(remaining / 60);
            const secs = remaining % 60;
            const timeStr = mins > 0 ? `${mins}分${secs}秒` : `${secs}秒`;
            const isPercentBuff = buff.name !== '护盾';
            const buffVal = isPercentBuff ? `+${Math.round(buff.value * 100)}%` : `+${formatNumber(buff.value)}`;
            el.textContent = `${buff.emoji} ${buff.name} ${buffVal} (${timeStr})`;
            el.style.display = '';
            hasAny = true;
        });

        // 移除过期的buff元素
        Array.from(buffPanel.children).forEach(child => {
            const bid = child.getAttribute('data-buff');
            if (bid && !buffIds.has(bid)) buffPanel.removeChild(child);
        });

        buffPanel.style.display = hasAny ? 'block' : 'none';
    }

    // 负面状态（debuff）显示
    const debuffPanel = document.getElementById('debuffPanel');
    const activeDebuffs = getActiveDebuffs();
    if (debuffPanel) {
        const debuffIds = new Set();
        let hasDebuff = false;
        activeDebuffs.forEach(debuff => {
            const did = `debuff-${debuff.key}`;
            debuffIds.add(did);
            let el = debuffPanel.querySelector(`[data-debuff="${did}"]`);
            if (!el) {
                el = document.createElement('div');
                el.setAttribute('data-debuff', did);
                el.style.cssText = 'display:block;background:rgba(231,76,60,0.15);color:#e74c3c;padding:2px 8px;border-radius:10px;font-size:0.7em;margin:2px 0;';
                debuffPanel.appendChild(el);
            }
            el.style.display = 'block';
            const remaining = Math.max(0, Math.ceil((debuff.endTime - Date.now()) / 1000));
            const mins = Math.floor(remaining / 60);
            const secs = remaining % 60;
            const timeStr = mins > 0 ? `${mins}分${secs}秒` : `${secs}秒`;
            const debuffVal = debuff.isPercent ? `-${Math.round(debuff.value * 100)}%` : '';
            el.textContent = `${debuff.emoji} ${debuff.name} ${debuffVal} (${timeStr})`;
            el.style.display = '';
            hasDebuff = true;
        });
        // 移除过期的debuff元素
        Array.from(debuffPanel.children).forEach(child => {
            const did = child.getAttribute('data-debuff');
            if (did && !debuffIds.has(did)) debuffPanel.removeChild(child);
        });
        debuffPanel.style.display = hasDebuff ? 'block' : 'none';
    }

    // 抗性面板更新
    const resistPanel = document.getElementById('resistPanel');
    if (resistPanel) {
        const r = baseStats;
        const hasResist = r.earthRes > 0 || r.poisonRes > 0 || r.lightningRes > 0 || r.voidRes > 0 || r.chaosRes > 0 || r.fireRes > 0 || r.tenacity > 0;
        if (hasResist) {
            const resTexts = [];
            if (r.earthRes > 0) resTexts.push(`🗿 土抗 ${Math.round(r.earthRes*100)}%`);
            if (r.poisonRes > 0) resTexts.push(`☠️ 毒抗 ${Math.round(r.poisonRes*100)}%`);
            if (r.lightningRes > 0) resTexts.push(`⚡ 雷抗 ${Math.round(r.lightningRes*100)}%`);
            if (r.voidRes > 0) resTexts.push(`🌑 虚空抗 ${Math.round(r.voidRes*100)}%`);
            if (r.chaosRes > 0) resTexts.push(`🌀 混沌抗 ${Math.round(r.chaosRes*100)}%`);
            if (r.fireRes > 0) resTexts.push(`🔥 火抗 ${Math.round(r.fireRes*100)}%`);
            if (r.tenacity > 0) resTexts.push(`💎 韧性 ${Math.round(r.tenacity*100)}%`);
            const passives = game.player.passives || {};
            const passiveTexts = [];
            for (const [pid, pdata] of Object.entries(passives)) {
                if (!pdata || pdata.level <= 0) continue;
                const pb = PASSIVE_BOOKS.find(b => b.id === pid);
                if (pb) passiveTexts.push(`${pb.emoji} ${pb.name}`);
            }
            let html = `<div style="font-size:0.75em;color:#aaa;margin-bottom:4px;">克制属性</div><div style="display:flex;flex-wrap:wrap;gap:4px;">${resTexts.map(t => `<span style="background:rgba(155,89,182,0.15);color:#a55eea;padding:2px 6px;border-radius:6px;font-size:0.7em;">${t}</span>`).join('')}</div>`;
            if (passiveTexts.length > 0) {
                html += `<div style="font-size:0.75em;color:#aaa;margin-top:6px;margin-bottom:4px;">被动技能</div><div style="display:flex;flex-wrap:wrap;gap:4px;">${passiveTexts.map(t => `<span style="background:rgba(241,196,15,0.15);color:#f1c40f;padding:2px 6px;border-radius:6px;font-size:0.7em;">${t}</span>`).join('')}</div>`;
            }
            resistPanel.innerHTML = html;
            resistPanel.style.display = 'block';
        } else {
            resistPanel.style.display = 'none';
        }
    }

    updateEnemyUI();
    renderUpgrades();
    renderEquipments();
}

function updateEnemyUI() {
    if (game.inCity) {
        document.getElementById('enemyEmoji').textContent = '🏰';
        document.getElementById('enemyName').textContent = '主城';
        document.getElementById('enemyName').style.color = '#f1c40f';
        document.getElementById('enemyHpBar').style.width = '100%';
        document.getElementById('enemyHpText').textContent = '--/--';
        document.title = '勇者挂机传说 - 🏰 主城';
        return;
    }
    if (!game.enemy) {
        document.title = '勇者挂机传说';
        return;
    }
    document.getElementById('enemyEmoji').textContent = game.enemy.emoji;
    let nameText;
    if (game.enemy.isBoss) nameText = `【BOSS】${game.enemy.name} Lv.${game.enemy.level}`;
    else if (game.enemy.isElite) nameText = `【精英】${game.enemy.name} Lv.${game.enemy.level}`;
    else nameText = `${game.enemy.name} Lv.${game.enemy.level}`;
    if (game.currentArea >= 15) {
        nameText += ` [无尽${game.enemy.endlessLayer || (game.currentArea - 14)}层]`;
    }
    document.getElementById('enemyName').textContent = nameText;
    document.getElementById('enemyName').style.color = game.enemy.isBoss ? '#ff4757' : game.enemy.isElite ? '#a55eea' : '#fff';
    document.getElementById('enemyHpBar').style.width = (game.enemy.hp / game.enemy.maxHp * 100) + '%';
    document.getElementById('enemyHpText').textContent = `${formatNumber(game.enemy.hp)}/${formatNumber(game.enemy.maxHp)}`;
    document.title = `勇者挂机传说 - ${game.enemy.emoji} ${nameText}`;

    // 敌人debuff显示
    const enemyDebuffPanel = document.getElementById('enemyDebuffPanel');
    if (enemyDebuffPanel) {
        const activeDebuffs = getActiveEnemyDebuffs();
        const debuffIds = new Set();
        let hasDebuff = false;
        activeDebuffs.forEach(debuff => {
            const did = `enemy-debuff-${debuff.key}`;
            debuffIds.add(did);
            let el = enemyDebuffPanel.querySelector(`[data-enemy-debuff="${did}"]`);
            if (!el) {
                el = document.createElement('span');
                el.setAttribute('data-enemy-debuff', did);
                el.style.cssText = 'display:inline-block;background:rgba(231,76,60,0.2);color:#e74c3c;padding:1px 6px;border-radius:8px;font-size:0.65em;margin:1px 3px 1px 0;';
                enemyDebuffPanel.appendChild(el);
            }
            el.style.display = 'inline-block';
            const remaining = Math.max(0, Math.ceil((debuff.endTime - Date.now()) / 1000));
            const debuffVal = debuff.isPercent ? `-${Math.round(debuff.value * 100)}%` : '';
            el.textContent = `${debuff.emoji} ${debuff.name} ${debuffVal}`;
            hasDebuff = true;
        });
        Array.from(enemyDebuffPanel.children).forEach(child => {
            const did = child.getAttribute('data-enemy-debuff');
            if (did && !debuffIds.has(did)) enemyDebuffPanel.removeChild(child);
        });
        enemyDebuffPanel.style.display = hasDebuff ? 'block' : 'none';
    }
}

function log(message, className = '') {
    const logEl = document.getElementById('battleLog');
    const entry = document.createElement('div');
    entry.className = 'log-entry ' + className;
    entry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
    logEl.insertBefore(entry, logEl.firstChild);
    while (logEl.children.length > 50) logEl.removeChild(logEl.lastChild);
}

function dropLog(message) {
    const logEl = document.getElementById('dropLog');
    const entry = document.createElement('div');
    entry.className = 'log-entry log-loot';
    entry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
    logEl.insertBefore(entry, logEl.firstChild);
    while (logEl.children.length > 30) logEl.removeChild(logEl.lastChild);
}

function showNotification(message) {
    const notif = document.createElement('div');
    notif.className = 'notification';
    notif.textContent = message;
    document.body.appendChild(notif);
    setTimeout(() => notif.remove(), 3000);
}

document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        if (game.autoBattle) autoBattleLoop();
        updateUI();
        renderBag();
        renderUpgrades();
        renderAreas();
        updateClueUI();
        updateSkillButtons();
    }
});

window.addEventListener('beforeunload', () => {
    localStorage.setItem(SAVE_KEY, JSON.stringify({ player: game.player, currentArea: game.currentArea, bossDefeated: game.bossDefeated, bossFled: game.bossFled, clues: game.clues, fightingBoss: game.fightingBoss, autoStrengthen: game.autoStrengthen, autoSell: game.autoSell, savedAt: Date.now() }));
});

// ========== 技能系统 ==========

function addSkillBook(book) {
    if (game.player.settledMode) {
        handleSettledDrop(book.sellPrice || 0, book.name, book.emoji);
        return;
    }
    game.player.skillBooks = game.player.skillBooks || {};
    if (!game.player.skillBooks[book.id]) game.player.skillBooks[book.id] = { count: 0, appraised: false, skillId: null };
    game.player.skillBooks[book.id].count++;
}

function getElementMultiplier(skillElement, enemyName) {
    const enemyData = ENEMY_ELEMENTS[enemyName];
    if (!enemyData) return 1.0;
    // 哥布林抗所有魔法
    if (enemyData.resist === 'magic' && skillElement !== 'physical') return 0.5;
    if (enemyData.weak === skillElement) return 1.5;
    if (enemyData.resist === skillElement) return 0.5;
    return 1.0;
}

function calculateSkillDamage(skill, skillLevel) {
    const p = game.player;
    const levelMult = 1 + (skillLevel - 1) * 0.15;
    const spiMult = 1 + p.spi * 0.03;
    const atkBonus = p.atk * 0.5;
    return Math.floor((skill.baseDmg + atkBonus) * levelMult * spiMult);
}

function castSkill(skillId) {
    const skill = SKILLS.find(s => s.id === skillId);
    if (!skill || !game.enemy || game.enemy.hp <= 0 || game.player.hp <= 0) return;
    const skillData = game.player.skills[skillId];
    if (!skillData) return;

    const now = Date.now();
    // 沉默状态无法施放技能
    const playerStats = getPlayerStats();
    if (playerStats.isSilenced) {
        log(`🔇 你被沉默了，无法使用技能！`, 'log-damage');
        return;
    }
    if (skillData.cooldownEnd > now) {
        log(`⏳ ${skill.name} 冷却中...`, 'log-skill');
        return;
    }
    if (game.player.mp < skill.mpCost) {
        log(`💧 魔力不足！需要 ${skill.mpCost} 点魔力`, 'log-damage');
        return;
    }

    game.player.mp -= skill.mpCost;
    skillData.cooldownEnd = now + skill.cooldown;

    const dmg = calculateSkillDamage(skill, skillData.level);
    const elementMult = getElementMultiplier(skill.element, game.enemy.name);
    const finalDmg = Math.floor(dmg * elementMult);

    let enemyName;
    if (game.enemy.isBoss) enemyName = `【BOSS】${game.enemy.name}`;
    else if (game.enemy.isElite) enemyName = `【精英】${game.enemy.name}`;
    else enemyName = game.enemy.name;
    const elInfo = ELEMENTS[skill.element];

    if (skill.type === 'heal') {
        const healAmount = Math.floor(finalDmg + (game.player.maxHp + getTreasureBonuses().maxHp) * 0.15);
        game.player.hp = Math.min(game.player.maxHp + getTreasureBonuses().maxHp, game.player.hp + healAmount);
        log(`💚 ${skill.emoji} ${skill.name} 恢复了 ${formatNumber(healAmount)} 点生命`, 'log-heal');
    } else if (skill.type === 'buff') {
        const stats = getPlayerStats();
        const buffDef = Math.floor(finalDmg + stats.def * 0.3);
        game.player.buffs = game.player.buffs || {};
        game.player.buffs.shield = { endTime: now + (skill.buffDuration || 10000), defBonus: buffDef };
        log(`🛡️ ${skill.emoji} ${skill.name} 获得 ${formatNumber(buffDef)} 点临时防御（10秒）`, 'log-skill');
    } else {
        // damage / damage_lifesteal / dot
        game.enemy.hp = Math.max(0, game.enemy.hp - finalDmg);
        let logMsg = `${skill.emoji} ${skill.name} 对${enemyName}造成 ${formatNumber(finalDmg)} 点${elInfo.name}伤害`;
        if (elementMult > 1) logMsg += ' ⚡克制！';
        else if (elementMult < 1) logMsg += ' 🛡️被抵抗';
        const logClass = elementMult > 1 ? 'log-skill-weak' : elementMult < 1 ? 'log-skill-resist' : 'log-skill';
        log(logMsg, logClass);

        showDamage('enemyChar', finalDmg, false);
        const attackerEl = document.getElementById('playerChar');
        attackerEl.classList.add('attacking');
        setTimeout(() => attackerEl.classList.remove('attacking'), 300);
        const targetEl = document.getElementById('enemyChar');
        targetEl.classList.add('hit');
        setTimeout(() => targetEl.classList.remove('hit'), 300);

        if (skill.type === 'damage_lifesteal') {
            const heal = Math.floor(finalDmg * 0.3);
            game.player.hp = Math.min(game.player.maxHp + getTreasureBonuses().maxHp, game.player.hp + heal);
            log(`🩸 暗影箭吸血恢复了 ${formatNumber(heal)} 点生命`, 'log-heal');
        }

        // 元素反制（仅对BOSS触发）
        if (game.enemy.isBoss && game.enemy.bossSkills) {
            game.player.counterState = game.player.counterState || {};
            for (const bossSkill of game.enemy.bossSkills) {
                if (skill.element === 'fire' && bossSkill.type === 'poison_aura') {
                    bossSkill.lastCast = now + 3000;
                    log(`🔥 火技能反制！毒雾光环被压制 3 秒！`, 'log-skill');
                }
                if (skill.element === 'ice' && bossSkill.type === 'thunder_strike') {
                    bossSkill.lastCast = now;
                    log(`❄️ 冰技能反制！雷霆审判被打断重置！`, 'log-skill');
                }
                if (skill.element === 'holy' && bossSkill.type === 'void_drain') {
                    game.player.counterState.voidShield = true;
                    log(`✨ 圣光护盾！下一次虚空吞噬将被抵消！`, 'log-skill');
                }
                if (skill.element === 'lightning' && bossSkill.type === 'petrify' && Math.random() < 0.5) {
                    bossSkill.lastCast = now;
                    log(`⚡ 雷霆打断！石化凝视被打断！`, 'log-skill');
                }
                if (skill.element === 'dark' && bossSkill.type === 'chaos_purge') {
                    game.player.counterState.chaosReflux = true;
                    log(`🌑 混沌逆流！下一次清buff将反弹给BOSS！`, 'log-skill');
                }
            }
        }

        // 技能debuff施加
        if (skill.debuff) {
            if (calculateDebuffSuccess(skill.debuff.chance)) {
                applyEnemyDebuff(skill.debuff.type, skill.debuff.duration, skill.debuff.value, skill.name);
            } else {
                const resistPct = Math.round(getEnemyDebuffResist() * 100);
                log(`🛡️ ${enemyName} 抵抗了 ${skill.name} 的负面效果！（抗性${resistPct}%）`, 'log-skill-resist');
            }
        }

        if (game.enemy.hp <= 0) {
            enemyDefeated();
            updateUI();
            updateSkillButtons();
            return;
        }
    }

    updateUI();
    updateSkillButtons();
}

function tryAutoCastSkill() {
    if (!game.enemy || game.enemy.hp <= 0 || game.player.hp <= 0) return;
    const now = Date.now();
    const availableSkills = Object.entries(game.player.skills || {})
        .filter(([_, d]) => d && d.level > 0)
        .map(([sid, d]) => {
            const skill = SKILLS.find(s => s.id === sid);
            return { skill, data: d };
        })
        .filter(({ skill, data }) => skill && data.cooldownEnd <= now && game.player.mp >= skill.mpCost);

    // 1. 血量低于 70% 优先治疗
    const maxHp = game.player.maxHp + getTreasureBonuses().maxHp;
    if (game.player.hp / maxHp < 0.7) {
        const healSkills = availableSkills.filter(({ skill }) => skill.type === 'heal')
            .sort((a, b) => calculateSkillDamage(b.skill, b.data.level) - calculateSkillDamage(a.skill, a.data.level));
        if (healSkills.length > 0) {
            castSkill(healSkills[0].skill.id);
            return;
        }
    }

    // 2. 没有护盾时优先上 buff
    const hasShield = game.player.buffs && game.player.buffs.shield && game.player.buffs.shield.endTime > now;
    if (!hasShield) {
        const buffSkills = availableSkills.filter(({ skill }) => skill.type === 'buff');
        if (buffSkills.length > 0) {
            castSkill(buffSkills[0].skill.id);
            return;
        }
    }

    // 3. 按伤害排序释放输出技能（damage / damage_lifesteal / dot）
    const attackSkills = availableSkills.filter(({ skill }) => skill.type.startsWith('damage') || skill.type === 'dot')
        .sort((a, b) => calculateSkillDamage(b.skill, b.data.level) - calculateSkillDamage(a.skill, a.data.level));
    if (attackSkills.length > 0) {
        castSkill(attackSkills[0].skill.id);
    }
}

function updateSkillButtons() {
    const container = document.getElementById('skillBar');
    if (!container) return;
    const now = Date.now();
    const skills = game.player.skills || {};
    const activeSkillIds = new Set();

    Object.entries(skills).forEach(([skillId, data]) => {
        if (!data || data.level <= 0) return;
        const skill = SKILLS.find(s => s.id === skillId);
        if (!skill) return;
        activeSkillIds.add(skillId);
        const cdRemaining = Math.max(0, data.cooldownEnd - now);
        const cdPercent = skill.cooldown > 0 ? (cdRemaining / skill.cooldown) * 100 : 0;
        const canUse = cdRemaining <= 0 && game.player.mp >= skill.mpCost;
        const elInfo = ELEMENTS[skill.element];

        let btn = container.querySelector(`[data-skill-id="${skillId}"]`);
        if (!btn) {
            btn = document.createElement('button');
            btn.className = 'skill-btn';
            btn.setAttribute('data-skill-id', skillId);
            btn.innerHTML = `<span class="skill-label"></span><span class="skill-mp"></span><span class="skill-cd"></span>`;
            btn.onclick = () => castSkill(skillId);
            container.appendChild(btn);
        }
        btn.disabled = !canUse;
        btn.style.borderColor = elInfo.color;
        btn.querySelector('.skill-label').textContent = `${skill.emoji} ${skill.name}`;
        btn.querySelector('.skill-mp').textContent = `💧${skill.mpCost}`;
        const cdEl = btn.querySelector('.skill-cd');
        if (cdRemaining > 0) {
            cdEl.style.display = '';
            cdEl.style.width = `${cdPercent}%`;
        } else {
            cdEl.style.display = 'none';
        }
    });

    // 移除已不再激活的技能按钮与占位提示
    Array.from(container.children).forEach(child => {
        const sid = child.getAttribute && child.getAttribute('data-skill-id');
        if (sid) {
            if (!activeSkillIds.has(sid)) container.removeChild(child);
        } else if (activeSkillIds.size > 0) {
            container.removeChild(child);
        }
    });

    if (activeSkillIds.size === 0 && !container.querySelector('.skill-empty-placeholder')) {
        container.innerHTML = '<span class="skill-empty-placeholder" style="color: #666; font-size: 0.85em;">前往主城学习技能</span>';
    }
}

// ========== 装备穿戴系统 ==========
function getSlotKeyForEquipment(equipmentDef) {
    if (equipmentDef.slot === 'bracelet') {
        const eqs = game.player.equipments || {};
        if (!eqs.bracelet_0) return 'bracelet_0';
        if (!eqs.bracelet_1) return 'bracelet_1';
        return 'bracelet_0';
    }
    return equipmentDef.slot;
}

function equipItem(bagIndex) {
    const bag = game.player.equipmentBag || [];
    if (bagIndex < 0 || bagIndex >= bag.length) return;
    const item = bag[bagIndex];
    if (item.appraised === false) { log('该装备尚未鉴定，无法穿戴！', 'log-damage'); return; }
    const eqDef = EQUIPMENT_POOL.find(e => e.id === item.id);
    if (!eqDef) return;
    const slotKey = getSlotKeyForEquipment(eqDef);
    game.player.equipments = game.player.equipments || {};
    // 如果槽位已有装备，卸下旧装备到背包
    if (game.player.equipments[slotKey]) {
        const oldEq = game.player.equipments[slotKey];
        bag.push(oldEq);
    }
    game.player.equipments[slotKey] = item;
    bag.splice(bagIndex, 1);
    log(`🛡️ 穿戴了 ${eqDef.emoji} ${eqDef.name}！`, 'log-loot');
    showNotification(`🛡️ 穿戴了 ${eqDef.name}！`);
    updateUI();
    renderEquipments();
    renderBag();
    renderBlacksmithContent();
}

function unequipItem(slotKey) {
    game.player.equipments = game.player.equipments || {};
    const item = game.player.equipments[slotKey];
    if (!item) return;
    game.player.equipmentBag = game.player.equipmentBag || [];
    game.player.equipmentBag.push(item);
    delete game.player.equipments[slotKey];
    const eqDef = EQUIPMENT_POOL.find(e => e.id === item.id);
    log(`🛡️ 卸下了 ${eqDef ? eqDef.emoji : ''} ${eqDef ? eqDef.name : ''}`, 'log-loot');
    if (game.autoSell && game.autoSell.equipment) {
        game.autoSell.equipment = false;
        log('💰 自动出售已关闭（卸下装备）', 'log-loot');
    }
    updateUI();
    renderEquipments();
    renderBag();
    renderBlacksmithContent();
}

function sellEquipment(bagIndex) {
    const bag = game.player.equipmentBag || [];
    if (bagIndex < 0 || bagIndex >= bag.length) return;
    const item = bag[bagIndex];
    const eqDef = EQUIPMENT_POOL.find(e => e.id === item.id);
    if (!eqDef) return;
    bag.splice(bagIndex, 1);
    game.player.gold += eqDef.sellPrice;
    log(`💰 出售了 ${eqDef.emoji} ${eqDef.name}，获得 ${formatNumber(eqDef.sellPrice)} 金币`, 'log-loot');
    updateUI();
    renderBag();
    renderBlacksmithContent();
}

// ========== 主城/NPC系统 ==========
let currentNpcTab = 'learn';

function showNpcView() {
    game.inCity = true;
    stopAutoBattle();
    document.getElementById('battleView').style.display = 'none';
    document.getElementById('npcView').style.display = '';
    document.getElementById('npcSelectView').style.display = '';
    document.getElementById('npcMentorView').style.display = 'none';
    document.getElementById('npcAppraiserView').style.display = 'none';
    document.getElementById('npcBlacksmithView').style.display = 'none';
    document.getElementById('npcShopView').style.display = 'none';
    document.getElementById('npcInnView').style.display = 'none';
    renderAreas();
    updateClueUI();
    updateEnemyUI();
}

function showMentorView() {
    document.getElementById('npcSelectView').style.display = 'none';
    document.getElementById('npcMentorView').style.display = '';
    document.getElementById('npcAppraiserView').style.display = 'none';
    switchNpcTab('skills');
}

function showAppraiserView() {
    document.getElementById('npcSelectView').style.display = 'none';
    document.getElementById('npcMentorView').style.display = 'none';
    document.getElementById('npcAppraiserView').style.display = '';
    renderAppraiserContent();
}

function showNpcSelect() {
    document.getElementById('npcSelectView').style.display = '';
    document.getElementById('npcMentorView').style.display = 'none';
    document.getElementById('npcAppraiserView').style.display = 'none';
    document.getElementById('npcBlacksmithView').style.display = 'none';
    document.getElementById('npcShopView').style.display = 'none';
    document.getElementById('npcInnView').style.display = 'none';
}

function showInnView() {
    document.getElementById('npcSelectView').style.display = 'none';
    document.getElementById('npcMentorView').style.display = 'none';
    document.getElementById('npcAppraiserView').style.display = 'none';
    document.getElementById('npcBlacksmithView').style.display = 'none';
    document.getElementById('npcShopView').style.display = 'none';
    document.getElementById('npcInnView').style.display = '';
    renderInnContent();
}

function renderInnContent() {
    const container = document.getElementById('innContent');
    const stats = getPlayerStats();
    const hpPercent = Math.round((game.player.hp / stats.maxHp) * 100);
    const mpPercent = Math.round((game.player.mp / stats.maxMp) * 100);
    const isFull = game.player.hp >= stats.maxHp && game.player.mp >= stats.maxMp;

    if (!container.querySelector('.inn-panel')) {
        container.innerHTML = `
            <div class="inn-panel" style="text-align:center;padding:20px 0;">
                <div style="font-size:4em;margin-bottom:15px;">🏨</div>
                <div style="font-size:1.2em;font-weight:bold;color:#3498db;margin-bottom:10px;">欢迎光临勇者客栈</div>
                <div style="color:#aaa;margin-bottom:20px;font-size:0.9em;">在这里好好休息，恢复所有战斗状态</div>
                <div style="max-width:300px;margin:0 auto;text-align:left;">
                    <div style="margin-bottom:15px;">
                        <div style="display:flex;justify-content:space-between;margin-bottom:5px;">
                            <span>生命值</span><span class="inn-hp-text"></span>
                        </div>
                        <div class="hp-bar"><div class="hp-fill" style="width:0%"></div></div>
                    </div>
                    <div style="margin-bottom:20px;">
                        <div style="display:flex;justify-content:space-between;margin-bottom:5px;">
                            <span>魔力值</span><span class="inn-mp-text"></span>
                        </div>
                        <div class="mp-bar"><div class="mp-fill" style="width:0%"></div></div>
                    </div>
                </div>
                <div class="inn-action" style="margin-top:25px;"></div>
            </div>
        `;
    }

    container.querySelector('.inn-hp-text').textContent = formatNumber(game.player.hp) + '/' + formatNumber(stats.maxHp) + ' (' + hpPercent + '%)';
    container.querySelector('.hp-fill').style.width = hpPercent + '%';
    container.querySelector('.inn-mp-text').textContent = formatNumber(game.player.mp) + '/' + formatNumber(stats.maxMp) + ' (' + mpPercent + '%)';
    container.querySelector('.mp-fill').style.width = mpPercent + '%';

    const actionEl = container.querySelector('.inn-action');
    if (isFull) {
        actionEl.innerHTML = '<div style="color:#2ecc71;font-weight:bold;margin-bottom:10px;">✅ 状态已满，无需休息</div><button class="btn btn-secondary" disabled>💤 休息</button>';
    } else {
        actionEl.innerHTML = '<button class="btn btn-primary" onclick="restAtInn()" style="font-size:1.1em;padding:10px 30px;">💤 休息恢复</button>';
    }
}

function restAtInn() {
    const stats = getPlayerStats();
    game.player.hp = stats.maxHp;
    game.player.mp = stats.maxMp;
    log('🏨 在客栈好好休息了一番，状态完全恢复！', 'log-heal');
    showNotification('🏨 休息完毕，状态全满！');
    renderInnContent();
    updateUI();
}

function showBlacksmithView() {
    document.getElementById('npcSelectView').style.display = 'none';
    document.getElementById('npcMentorView').style.display = 'none';
    document.getElementById('npcAppraiserView').style.display = 'none';
    document.getElementById('npcBlacksmithView').style.display = '';
    document.getElementById('npcShopView').style.display = 'none';
    switchBlacksmithTab('forge');
}

function showShopView() {
    document.getElementById('npcSelectView').style.display = 'none';
    document.getElementById('npcMentorView').style.display = 'none';
    document.getElementById('npcAppraiserView').style.display = 'none';
    document.getElementById('npcBlacksmithView').style.display = 'none';
    document.getElementById('npcShopView').style.display = '';
    renderShopContent();
}

function showBattleView() {
    game.inCity = false;
    document.getElementById('npcView').style.display = 'none';
    document.getElementById('battleView').style.display = 'block';
    renderAreas();
    updateClueUI();
    updateEnemyUI();
}

function switchNpcTab(tab) {
    if (currentNpcTab !== tab) {
        // 切换 tab 时清空容器，避免上一 tab 的 DOM（如精神修炼面板）残留
        const container = document.getElementById('npcContent');
        if (container) container.innerHTML = '';
    }
    currentNpcTab = tab;
    document.querySelectorAll('.npc-tab').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tab);
    });
    renderNpcContent();
}

function renderNpcContent() {
    const container = document.getElementById('npcContent');
    if (currentNpcTab === 'skills') renderSkillList(container);
    else if (currentNpcTab === 'train') renderTrainSpirit(container);
}

function switchAppraiserFilter(filter) {
    currentAppraiserFilter = filter;
    renderAppraiserContent();
}

function renderAppraiserContent() {
    const container = document.getElementById('appraiserContent');

    // 筛选按钮（局部更新）
    const filters = [
        { key: 'all', name: '全部', emoji: '📦' },
        { key: 'equipment', name: '装备', emoji: '🛡️' },
        { key: 'skillBook', name: '技能书', emoji: '📕' }
    ];
    let filterBar = container.querySelector('[data-appraiser-filter]');
    if (!filterBar) {
        container.innerHTML = '<div style="display:flex;flex-direction:column;height:100%;"><div data-appraiser-filter style="flex-shrink:0;display:flex;gap:6px;margin-bottom:12px;flex-wrap:wrap;"></div><div data-appraiser-list class="npc-scroll-content" style="flex:1;min-height:0;overflow-y:auto;"></div></div>';
        filterBar = container.querySelector('[data-appraiser-filter]');
    }
    filters.forEach(f => {
        let btn = filterBar.querySelector(`[data-filter="${f.key}"]`);
        if (!btn) {
            btn = document.createElement('button');
            btn.setAttribute('data-filter', f.key);
            btn.className = 'btn btn-secondary';
            btn.style.cssText = 'padding:4px 10px;font-size:0.8em;';
            btn.onclick = () => switchAppraiserFilter(f.key);
            filterBar.appendChild(btn);
        }
        const isActive = currentAppraiserFilter === f.key;
        btn.textContent = `${f.emoji} ${f.name}`;
        if (isActive) {
            btn.style.background = 'linear-gradient(45deg,#e94560,#ff6b6b)';
            btn.style.borderColor = 'transparent';
            btn.style.color = '#fff';
        } else {
            btn.style.background = '';
            btn.style.borderColor = '';
            btn.style.color = '';
        }
    });

    const listContainer = container.querySelector('[data-appraiser-list]');
    const showEquip = currentAppraiserFilter === 'all' || currentAppraiserFilter === 'equipment';
    const showBooks = currentAppraiserFilter === 'all' || currentAppraiserFilter === 'skillBook';

    const activeIds = new Set();

    // 未鉴定装备
    const unappraisedEquips = [];
    (game.player.equipmentBag || []).forEach((item, idx) => {
        if (item.appraised === false) unappraisedEquips.push({ item, idx });
    });
    unappraisedEquips.sort((a, b) => {
        const ea = EQUIPMENT_POOL.find(e => e.id === a.item.id);
        const eb = EQUIPMENT_POOL.find(e => e.id === b.item.id);
        return (RARITY_ORDER[eb?.rarity] || 0) - (RARITY_ORDER[ea?.rarity] || 0);
    });

    let hasContent = false;
    if (showEquip && unappraisedEquips.length > 0) {
        let header = listContainer.querySelector('[data-section="equip-header"]');
        if (!header) {
            header = document.createElement('div');
            header.setAttribute('data-section', 'equip-header');
            header.style.cssText = 'font-size:0.9em;color:#e94560;margin-bottom:10px;font-weight:bold;';
            listContainer.appendChild(header);
        }
        header.textContent = '🛡️ 未鉴定装备';
        header.style.display = '';
        hasContent = true;

        unappraisedEquips.forEach(({ item, idx }) => {
            const eqDef = EQUIPMENT_POOL.find(e => e.id === item.id);
            if (!eqDef) return;
            const id = `appraise-eq-${idx}`;
            activeIds.add(id);
            const rc = RARITY_CONFIG[eqDef.rarity];
            const cost = Math.floor(eqDef.sellPrice * 0.5);
            const canAfford = game.player.gold >= cost;

            let el = listContainer.querySelector(`[data-appraise-id="${id}"]`);
            if (!el) {
                el = document.createElement('div');
                el.setAttribute('data-appraise-id', id);
                el.className = 'skill-list-item';
                listContainer.appendChild(el);
            }
            el.style.borderColor = rc.color;
            el.innerHTML = `
                <div class="skill-list-info">
                    <div class="skill-list-name" style="color:${rc.color};">${eqDef.emoji} ${eqDef.name}</div>
                    <div class="skill-list-desc"><span class="skill-book-status unidentified">❓ 未鉴定</span> 需要鉴定后才能穿戴</div>
                    <div class="skill-list-meta">${rc.label}品质 | 出售价: ${formatNumber(eqDef.sellPrice)}金币</div>
                </div>
                <div style="display:flex;align-items:center;gap:6px;">
                    <span class="skill-list-cost">💰 ${formatNumber(cost)}</span>
                    <button class="btn btn-primary" onclick="appraiseEquipment(${idx})" ${!canAfford ? 'disabled' : ''}>鉴定</button>
                </div>
            `;
        });
    } else {
        const header = listContainer.querySelector('[data-section="equip-header"]');
        if (header) header.style.display = 'none';
        listContainer.querySelectorAll('[data-appraise-id^="appraise-eq-"]').forEach(el => {
            if (el.parentNode) el.parentNode.removeChild(el);
        });
    }

    // 未鉴定技能书
    const books = game.player.skillBooks || {};
    let unappraisedBooks = Object.entries(books).filter(([_, d]) => d && d.count > 0 && !d.appraised);
    unappraisedBooks.sort((a, b) => {
        const ba = SKILL_BOOKS.find(x => x.id === a[0]);
        const bb = SKILL_BOOKS.find(x => x.id === b[0]);
        return (RARITY_ORDER[bb?.rarity] || 0) - (RARITY_ORDER[ba?.rarity] || 0);
    });

    if (showBooks && unappraisedBooks.length > 0) {
        let header = listContainer.querySelector('[data-section="book-header"]');
        if (!header) {
            header = document.createElement('div');
            header.setAttribute('data-section', 'book-header');
            header.style.cssText = 'font-size:0.9em;color:#e94560;margin-bottom:10px;font-weight:bold;';
            listContainer.appendChild(header);
        }
        header.textContent = '📕 未鉴定技能书';
        header.style.display = '';
        hasContent = true;

        unappraisedBooks.forEach(([bookId, data]) => {
            const book = SKILL_BOOKS.find(b => b.id === bookId);
            if (!book) return;
            const id = `appraise-book-${bookId}`;
            activeIds.add(id);
            const cost = Math.floor(book.sellPrice * 0.8);
            const canAfford = game.player.gold >= cost;
            const rc = RARITY_CONFIG[book.rarity];

            let el = listContainer.querySelector(`[data-appraise-id="${id}"]`);
            if (!el) {
                el = document.createElement('div');
                el.setAttribute('data-appraise-id', id);
                el.className = 'skill-list-item';
                listContainer.appendChild(el);
            }
            el.style.borderColor = rc.color;
            el.innerHTML = `
                <div class="skill-list-info">
                    <div class="skill-list-name" style="color:${rc.color};">${book.emoji} ${book.name} ×${data.count}</div>
                    <div class="skill-list-desc"><span class="skill-book-status unidentified">❓ 未鉴定</span> 需要鉴定后才能学习</div>
                    <div class="skill-list-meta">${rc.label}品质 | 出售价: ${formatNumber(book.sellPrice)}金币</div>
                </div>
                <div style="display:flex;align-items:center;gap:6px;">
                    <span class="skill-list-cost">💰 ${formatNumber(cost)}</span>
                    <button class="btn btn-primary" onclick="appraiseBook('${book.id}')" ${!canAfford ? 'disabled' : ''}>鉴定</button>
                </div>
            `;
        });
    } else {
        const header = listContainer.querySelector('[data-section="book-header"]');
        if (header) header.style.display = 'none';
        listContainer.querySelectorAll('[data-appraise-id^="appraise-book-"]').forEach(el => {
            if (el.parentNode) el.parentNode.removeChild(el);
        });
    }

    // 清理：移除所有不在 activeIds 中的鉴定卡片（避免已鉴定/已售出条目残留）
    listContainer.querySelectorAll('[data-appraise-id]').forEach(el => {
        const id = el.getAttribute('data-appraise-id');
        if (!activeIds.has(id) && el.parentNode) el.parentNode.removeChild(el);
    });

    // 空状态
    let emptyMsg = '你暂时没有需要鉴定的物品';
    if (currentAppraiserFilter === 'equipment') emptyMsg = '暂无未鉴定装备';
    else if (currentAppraiserFilter === 'skillBook') emptyMsg = '暂无未鉴定技能书';
    let emptyEl = listContainer.querySelector('[data-appraiser-empty]');
    if (!hasContent) {
        if (!emptyEl) {
            emptyEl = document.createElement('div');
            emptyEl.setAttribute('data-appraiser-empty', '');
            emptyEl.style.cssText = 'text-align:center;color:#666;padding:30px';
            listContainer.appendChild(emptyEl);
        }
        emptyEl.textContent = emptyMsg;
        emptyEl.style.display = '';
    } else if (emptyEl) {
        emptyEl.style.display = 'none';
    }
}

// ========== 铁匠系统 ==========
let currentBlacksmithTab = 'forge';

function switchBlacksmithTab(tab) {
    currentBlacksmithTab = tab;
    document.querySelectorAll('#npcBlacksmithView .npc-tab').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tab);
    });
    renderBlacksmithContent();
}

function renderBlacksmithContent() {
    const container = document.getElementById('blacksmithContent');
    if (currentBlacksmithTab === 'forge') renderBlacksmithForge(container);
    else if (currentBlacksmithTab === 'refine') renderBlacksmithRefine(container);
}

function renderBlacksmithForge(container) {
    const playerLevel = game.player.level;
    const levelMult = 1 + (playerLevel - 1) * 0.15;
    const forgeCost = Math.floor(FORGE_BASE_COST * levelMult);
    const canAfford = game.player.gold >= forgeCost;

    let html = '<div style="text-align:center;padding:10px 0;">';
    html += '<div style="color:#aaa;margin-bottom:15px;">铁匠可以为你打造装备，装备品质与等级相关</div>';
    html += '<div style="font-size:1.1em;margin-bottom:10px;">当前打造费用: <span style="color:#f1c40f;font-weight:bold;">💰 ' + formatNumber(forgeCost) + '</span></div>';
    html += '<div style="color:#888;font-size:0.85em;margin-bottom:8px;">等级越高，打造出的装备越好</div>';
    html += '<div style="color:#2ecc71;font-size:0.8em;margin-bottom:4px;">✓ 打造装备无需鉴定，直接可用</div>';
    html += '<div style="color:#3498db;font-size:0.8em;margin-bottom:4px;">⚡ 基础属性在 50%-120% 之间随机浮动</div>';
    html += '<div style="color:#ff0044;font-size:0.8em;margin-bottom:20px;">🌟 万分之一概率打造神器（属性固定，与无尽模式掉落一致）</div>';
    html += '<div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;">';
    html += '<button class="btn btn-primary" onclick="forgeEquipment()" ' + (!canAfford ? 'disabled' : '') + '>🔨 随机打造</button>';
    html += '</div>';
    html += '</div>';

    // 显示可打造的品质范围
    let possibleRarities = ['common'];
    if (playerLevel >= 5) possibleRarities.push('rare');
    if (playerLevel >= 15) possibleRarities.push('epic');
    if (playerLevel >= 30) possibleRarities.push('legendary');
    html += '<div style="text-align:center;margin-top:15px;color:#aaa;font-size:0.85em;">';
    html += '可能获得: ' + possibleRarities.map(r => RARITY_CONFIG[r].label).join(' / ') + ' / <span style="color:#ff0044;">神器(0.01%)</span></div>';

    container.innerHTML = html;
}

function forgeEquipment() {
    const playerLevel = game.player.level;
    const levelMult = 1 + (playerLevel - 1) * 0.15;
    const forgeCost = Math.floor(FORGE_BASE_COST * levelMult);
    if (game.player.gold < forgeCost) { log('金币不足，无法打造装备！', 'log-damage'); return; }

    game.player.gold -= forgeCost;

    // 万分之一概率打造神器
    let selectedRarity;
    if (Math.random() < 0.0001) {
        selectedRarity = 'divine';
    } else {
        // 根据等级决定品质
        const rarityWeights = [];
        rarityWeights.push({ rarity: 'common', weight: Math.max(10, 100 - playerLevel * 3) });
        if (playerLevel >= 5) rarityWeights.push({ rarity: 'rare', weight: Math.min(50, playerLevel * 2) });
        if (playerLevel >= 15) rarityWeights.push({ rarity: 'epic', weight: Math.min(30, (playerLevel - 10) * 1.5) });
        if (playerLevel >= 30) rarityWeights.push({ rarity: 'legendary', weight: Math.min(15, (playerLevel - 25)) });

        const totalWeight = rarityWeights.reduce((a, b) => a + b.weight, 0);
        let roll = Math.random() * totalWeight;
        selectedRarity = 'common';
        for (const rw of rarityWeights) {
            roll -= rw.weight;
            if (roll <= 0) { selectedRarity = rw.rarity; break; }
        }
    }

    const pool = EQUIPMENT_POOL.filter(e => e.rarity === selectedRarity);
    const eqDef = pool[Math.floor(Math.random() * pool.length)];
    if (!eqDef) { log('打造失败，请重试', 'log-damage'); return; }

    // 铁匠打造装备不需要鉴定，非神器属性浮动50%-120%
    const attrMult = selectedRarity === 'divine' ? 1 : 0.5 + Math.random() * 0.7;
    const forgedItem = { id: eqDef.id, level: 1, appraised: true, attrMult: parseFloat(attrMult.toFixed(2)) };
    game.player.equipmentBag = game.player.equipmentBag || [];
    game.player.equipmentBag.push(forgedItem);

    const rc = RARITY_CONFIG[eqDef.rarity];
    if (selectedRarity === 'divine') {
        log(`⚒️ 铁匠打造了 [${rc.label}] ${eqDef.emoji} ${eqDef.name}！属性完美！`, 'log-legendary');
        showNotification(`⚒️ 奇迹！打造了${rc.label}装备：${eqDef.name}！`);
    } else {
        log(`⚒️ 铁匠打造了 [${rc.label}] ${eqDef.emoji} ${eqDef.name}！`, 'log-epic');
        showNotification(`⚒️ 打造了${rc.label}装备：${eqDef.name}！`);
    }
    renderBlacksmithContent();
    renderBag();
    updateUI();
}

function renderBlacksmithRefine(container) {
    const bag = game.player.equipmentBag || [];
    const stoneCount = (game.player.items && game.player.items['enhance_stone']) ? game.player.items['enhance_stone'].count : 0;
    if (bag.length === 0) {
        container.innerHTML = '<div style="text-align:center;color:#666;padding:30px;">背包中没有装备可以锻造</div>';
        return;
    }

    // 保存输入框值和焦点
    const focusedId = document.activeElement?.id;
    const inputValues = {};
    container.querySelectorAll('input[type="number"]').forEach(input => {
        inputValues[input.id] = input.value;
    });

    const filterSlots = [
        { key: 'all', name: '全部', emoji: '📦' },
        { key: 'weapon', name: '武器', emoji: '⚔️' },
        { key: 'helmet', name: '帽子', emoji: '🪖' },
        { key: 'armor', name: '衣服', emoji: '👕' },
        { key: 'boots', name: '靴子', emoji: '👢' },
        { key: 'belt', name: '腰带', emoji: '🎗️' },
        { key: 'bracelet', name: '手镯', emoji: '💎' },
        { key: 'jade', name: '玉佩', emoji: '🏵️' },
        { key: 'necklace', name: '项链', emoji: '📿' },
    ];

    let html = '<div style="display:flex;flex-direction:column;height:100%;">';
    html += '<div style="flex-shrink:0;">';
    html += '<div style="text-align:center;color:#aaa;margin-bottom:15px;font-size:0.9em;">选择装备进行锻造强化，成功提升属性，失败装备消失</div>';
    html += `<div style="text-align:center;color:#f1c40f;margin-bottom:12px;font-size:0.85em;">🔮 强化石 ×${stoneCount}（每个+5%成功率，最高100%）</div>`;
    html += '<div style="display:flex;gap:6px;margin-bottom:10px;flex-wrap:wrap;">';
    filterSlots.forEach(slot => {
        const isActive = currentEquipmentFilter === slot.key;
        const activeStyle = isActive ? 'background:linear-gradient(45deg,#e94560,#ff6b6b);border-color:transparent;color:#fff;' : '';
        html += `<button class="btn btn-secondary" onclick="setEquipmentFilter('${slot.key}')" style="padding:2px 7px;font-size:0.7em;${activeStyle}">${slot.emoji} ${slot.name}</button>`;
    });
    html += '</div>';
    html += '</div>';
    html += '<div class="npc-scroll-content" style="flex:1;min-height:0;overflow-y:auto;">';
    html += '<div class="equipment-bag">';

    const bagWithIndex = bag.map((item, idx) => ({ item, idx }));
    bagWithIndex.sort((a, b) => {
        const ea = EQUIPMENT_POOL.find(e => e.id === a.item.id);
        const eb = EQUIPMENT_POOL.find(e => e.id === b.item.id);
        const ra = RARITY_ORDER[ea?.rarity] || 0;
        const rb = RARITY_ORDER[eb?.rarity] || 0;
        if (rb !== ra) return rb - ra;
        const refineA = a.item.refine || 0;
        const refineB = b.item.refine || 0;
        if (refineB !== refineA) return refineB - refineA;
        const appraisedA = a.item.appraised !== false ? 1 : 0;
        const appraisedB = b.item.appraised !== false ? 1 : 0;
        return appraisedB - appraisedA;
    });

    let hasItem = false;
    bagWithIndex.forEach(({ item, idx: index }) => {
        if (item.appraised === false) return;
        const eqDef = EQUIPMENT_POOL.find(e => e.id === item.id);
        if (!eqDef) return;
        if (currentEquipmentFilter !== 'all' && eqDef.slot !== currentEquipmentFilter) return;
        hasItem = true;
        const rc = RARITY_CONFIG[eqDef.rarity];
        const refineLevel = item.refine || 0;
        const refineCost = Math.floor(eqDef.sellPrice * 0.5 * Math.pow(1.5, refineLevel));
        const baseRate = Math.max(10, 100 - refineLevel * 15);
        const maxStones = Math.min(stoneCount, Math.ceil((100 - baseRate) / 5));
        const canAfford = game.player.gold >= refineCost;

        html += `
            <div class="equipment-bag-item ${eqDef.rarity}">
                <div class="eq-bag-emoji">${eqDef.emoji}</div>
                <div class="eq-bag-name" style="color:${rc.color}">${eqDef.name}</div>
                <div class="eq-bag-stat">${formatEqStat(eqDef, item)}</div>
                <div style="font-size:0.65em;color:#f1c40f;margin-bottom:3px;">锻造+${refineLevel}</div>
                <div style="font-size:0.65em;color:#aaa;margin-bottom:4px;">💰 ${formatNumber(refineCost)} | 基础成功率 ${baseRate}%</div>
                <div style="font-size:0.7em;margin-bottom:4px;">
                    <input type="number" id="stone-${index}" min="0" max="${maxStones}" value="0" style="width:45px;text-align:center;border-radius:4px;border:1px solid rgba(255,255,255,0.2);background:rgba(0,0,0,0.3);color:#fff;padding:2px;" onchange="updateRefineRate(${index}, ${baseRate})">
                    <span style="color:#888;">🔮 | 成功率 <span id="rate-${index}" style="color:#2ecc71;font-weight:bold;">${baseRate}%</span></span>
                </div>
                <div class="eq-bag-actions">
                    <button class="btn btn-primary" onclick="refineEquipment(${index})" ${!canAfford ? 'disabled' : ''}>🔥 锻造</button>
                </div>
            </div>
        `;
    });
    html += '</div>';
    if (!hasItem) {
        html += '<div style="text-align:center;color:#666;padding:20px;">暂无已鉴定的装备</div>';
    }
    html += '</div></div>';
    container.innerHTML = html;

    // 恢复输入框值和焦点
    Object.entries(inputValues).forEach(([id, val]) => {
        const input = document.getElementById(id);
        if (input) input.value = val;
    });
    if (focusedId) {
        const el = document.getElementById(focusedId);
        if (el) el.focus();
    }
}

function updateRefineRate(index, baseRate) {
    const input = document.getElementById(`stone-${index}`);
    if (!input) return;
    let stones = parseInt(input.value) || 0;
    const maxStones = parseInt(input.max) || 0;
    if (stones < 0) stones = 0;
    if (stones > maxStones) stones = maxStones;
    input.value = stones;
    const rateEl = document.getElementById(`rate-${index}`);
    if (rateEl) {
        const newRate = Math.min(100, baseRate + stones * 5);
        rateEl.textContent = newRate + '%';
    }
}

function refineEquipment(bagIndex) {
    const bag = game.player.equipmentBag || [];
    if (bagIndex < 0 || bagIndex >= bag.length) return;
    const item = bag[bagIndex];
    if (item.appraised === false) { log('❓ 未鉴定装备无法锻造！', 'log-damage'); return; }
    const eqDef = EQUIPMENT_POOL.find(e => e.id === item.id);
    if (!eqDef) return;

    const refineLevel = item.refine || 0;
    const refineCost = Math.floor(eqDef.sellPrice * 0.5 * Math.pow(1.5, refineLevel));
    let baseRate = Math.max(10, 100 - refineLevel * 15);

    const stoneInput = document.getElementById(`stone-${bagIndex}`);
    let useStones = 0;
    if (stoneInput) {
        useStones = parseInt(stoneInput.value) || 0;
        if (useStones < 0) useStones = 0;
    }
    const playerStoneCount = (game.player.items && game.player.items['enhance_stone']) ? game.player.items['enhance_stone'].count : 0;
    if (useStones > playerStoneCount) useStones = playerStoneCount;

    const successRate = Math.min(100, baseRate + useStones * 5);

    if (game.player.gold < refineCost) { log('金币不足，无法锻造！', 'log-damage'); return; }
    game.player.gold -= refineCost;

    if (useStones > 0) {
        game.player.items['enhance_stone'].count -= useStones;
        if (game.player.items['enhance_stone'].count <= 0) delete game.player.items['enhance_stone'];
    }

    const roll = Math.random() * 100;
    if (roll <= successRate) {
        item.refine = refineLevel + 1;
        const rc = RARITY_CONFIG[eqDef.rarity];
        log(`🔥 锻造成功！${eqDef.emoji} ${eqDef.name} 锻造+${item.refine}！`, 'log-epic');
        showNotification(`🔥 锻造成功！${eqDef.name} +${item.refine}`);
    } else {
        if (refineLevel > 0) {
            item.refine = refineLevel - 1;
            log(`💥 锻造失败！${eqDef.emoji} ${eqDef.name} 锻造等级降至+${item.refine}`, 'log-death');
            showNotification(`💥 锻造失败，锻造等级-1`);
        } else {
            bag.splice(bagIndex, 1);
            log(`💥 锻造失败！${eqDef.emoji} ${eqDef.name} 在火焰中化为灰烬...`, 'log-death');
            showNotification('💥 锻造失败，装备已损毁');
        }
    }

    renderBlacksmithContent();
    renderBag();
    updateUI();
}

// ========== 商店系统 ==========
function renderShopContent() {
    const container = document.getElementById('shopContent');
    const playerLevel = game.player.level;
    const levelMult = 1 + (playerLevel - 1) * 0.1;

    let grid = container.querySelector('.shop-grid');
    if (!grid) {
        grid = document.createElement('div');
        grid.className = 'shop-grid';
        grid.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:12px;';
        container.appendChild(grid);
    }

    const activeIds = new Set();
    SHOP_ITEMS.forEach(item => {
        if (item.dropOnly) return;
        const price = Math.floor(item.basePrice * levelMult);
        const canAfford = game.player.gold >= price;
        activeIds.add(item.id);

        let card = grid.querySelector(`[data-shop-id="${item.id}"]`);
        if (!card) {
            card = document.createElement('div');
            card.setAttribute('data-shop-id', item.id);
            card.style.cssText = 'background:rgba(255,255,255,0.03);border-radius:10px;padding:12px;text-align:center;border:1px solid rgba(255,255,255,0.08);';
            grid.appendChild(card);
        }
        card.innerHTML = `
            <div style="font-size:2em;margin-bottom:5px;">${item.emoji}</div>
            <div style="font-weight:bold;font-size:0.9em;margin-bottom:4px;">${item.name}</div>
            <div style="font-size:0.75em;color:#aaa;margin-bottom:8px;">${item.desc}</div>
            <div style="color:#f1c40f;font-weight:bold;font-size:0.9em;margin-bottom:8px;">💰 ${formatNumber(price)}</div>
            <div style="display:flex;gap:6px;justify-content:center;">
                <button class="btn btn-success" onclick="buyShopItem('${item.id}')" ${!canAfford ? 'disabled' : ''} style="padding:4px 12px;font-size:0.8em;">购买</button>
                <button class="btn btn-primary" onclick="buyShopItem('${item.id}', 10)" ${game.player.gold < price * 10 ? 'disabled' : ''} style="padding:4px 12px;font-size:0.8em;">购买×10</button>
            </div>
        `;
    });

    Array.from(grid.children).forEach(child => {
        const sid = child.getAttribute('data-shop-id');
        if (sid && !activeIds.has(sid)) grid.removeChild(child);
    });
}

function buyShopItem(itemId, count = 1) {
    const item = SHOP_ITEMS.find(i => i.id === itemId);
    if (!item) return;
    const playerLevel = game.player.level;
    const levelMult = 1 + (playerLevel - 1) * 0.1;
    const price = Math.floor(item.basePrice * levelMult);
    const totalPrice = price * count;

    if (game.player.gold < totalPrice) { log('金币不足！', 'log-damage'); return; }

    game.player.gold -= totalPrice;

    // 存入背包
    game.player.items = game.player.items || {};
    if (!game.player.items[item.id]) game.player.items[item.id] = { count: 0 };
    game.player.items[item.id].count += count;

    log(`🏪 购买了 ${item.emoji} ${item.name} ×${count}`, 'log-loot');
    showNotification(`🏪 购买成功！${item.name} ×${count}`);
    renderShopContent();
    updateUI();
}

function renderSkillList(container) {
    const activeIds = new Set();
    let hasContent = false;

    // 基础技能：未学会的可学习，已学会的可升级
    const basicSkills = SKILLS.filter(s => s.isBasic);
    if (basicSkills.length > 0) {
        let header = container.querySelector('[data-section="basic-skills"]');
        if (!header) {
            header = document.createElement('div');
            header.setAttribute('data-section', 'basic-skills');
            header.style.cssText = 'font-size:0.85em;color:#aaa;margin:10px 0 5px;border-bottom:1px solid rgba(255,255,255,0.1);padding-bottom:5px;';
            container.appendChild(header);
        }
        header.textContent = '基础技能';
        header.style.display = '';

        basicSkills.forEach(skill => {
            const id = `skill-basic-${skill.id}`;
            activeIds.add(id);
            const learned = game.player.skills[skill.id];
            const isLearned = learned && learned.level > 0;
            const elInfo = ELEMENTS[skill.element];

            let actionHtml = '';
            if (!isLearned) {
                const canAfford = game.player.gold >= skill.learnCost;
                actionHtml = `<span class="skill-list-cost">💰 ${formatNumber(skill.learnCost)}</span><button class="btn btn-primary" onclick="learnSkill('${skill.id}')" ${!canAfford ? 'disabled' : ''}>学习</button>`;
            } else {
                const isMax = learned.level >= skill.maxLevel;
                const cost = Math.floor(skill.upgradeCost * Math.pow(1.3, learned.level - 1));
                const canAfford = game.player.gold >= cost;
                actionHtml = isMax ? '<span style="color:#f1c40f;margin-right:10px">已满级</span>' : `<span class="skill-list-cost">💰 ${formatNumber(cost)}</span><button class="btn btn-primary" onclick="upgradeSkill('${skill.id}')" ${!canAfford ? 'disabled' : ''}>升级</button>`;
            }

            let el = container.querySelector(`[data-skill-id="${id}"]`);
            if (!el) {
                el = document.createElement('div');
                el.setAttribute('data-skill-id', id);
                el.className = 'skill-list-item';
                container.appendChild(el);
            }
            el.innerHTML = `
                <div class="skill-list-info">
                    <div class="skill-list-name" style="color: ${elInfo.color}">${skill.emoji} ${skill.name} ${isLearned ? `Lv.${learned.level}` : '<span style="color:#666">[未学会]</span>'}</div>
                    <div class="skill-list-desc">${skill.desc}</div>
                    <div class="skill-list-meta">${elInfo.emoji} ${elInfo.name}属性 | 💧消耗${skill.mpCost} | ⏱️冷却${skill.cooldown/1000}秒 | ${isLearned ? `当前伤害: ${formatNumber(calculateSkillDamage(skill, learned.level))}` : `基础伤害: ${formatNumber(skill.baseDmg)}`}</div>
                </div>
                <div style="display:flex;align-items:center;">
                    ${actionHtml}
                </div>
            `;
            hasContent = true;
        });
    }

    // 高阶技能：只显示已学会的（可升级）
    const learnedAdvanced = Object.entries(game.player.skills || {}).filter(([sid, d]) => d && d.level > 0 && !SKILLS.find(s => s.id === sid)?.isBasic);
    if (learnedAdvanced.length > 0) {
        let header = container.querySelector('[data-section="advanced-skills"]');
        if (!header) {
            header = document.createElement('div');
            header.setAttribute('data-section', 'advanced-skills');
            header.style.cssText = 'font-size:0.85em;color:#aaa;margin:15px 0 5px;border-bottom:1px solid rgba(255,255,255,0.1);padding-bottom:5px;';
            container.appendChild(header);
        }
        header.textContent = '高阶技能';
        header.style.display = '';

        learnedAdvanced.forEach(([skillId, data]) => {
            const skill = SKILLS.find(s => s.id === skillId);
            if (!skill) return;
            const id = `skill-adv-${skillId}`;
            activeIds.add(id);
            const isMax = data.level >= skill.maxLevel;
            const cost = Math.floor(skill.upgradeCost * Math.pow(1.3, data.level - 1));
            const canAfford = game.player.gold >= cost;
            const elInfo = ELEMENTS[skill.element];

            let el = container.querySelector(`[data-skill-id="${id}"]`);
            if (!el) {
                el = document.createElement('div');
                el.setAttribute('data-skill-id', id);
                el.className = 'skill-list-item';
                container.appendChild(el);
            }
            el.innerHTML = `
                <div class="skill-list-info">
                    <div class="skill-list-name" style="color: ${elInfo.color}">${skill.emoji} ${skill.name} Lv.${data.level}${isMax ? ' <span style="color:#f1c40f">[满级]</span>' : ''}</div>
                    <div class="skill-list-desc">${skill.desc}</div>
                    <div class="skill-list-meta">当前伤害: ${formatNumber(calculateSkillDamage(skill, data.level))} | ${!isMax ? `升级后: ${formatNumber(calculateSkillDamage(skill, data.level + 1))}` : '已达最高等级'}</div>
                </div>
                <div style="display:flex;align-items:center;">
                    ${isMax ? '<span style="color:#f1c40f;margin-right:10px">已满级</span>' : `<span class="skill-list-cost">💰 ${formatNumber(cost)}</span><button class="btn btn-primary" onclick="upgradeSkill('${skill.id}')" ${!canAfford ? 'disabled' : ''}>升级</button>`}
                </div>
            `;
            hasContent = true;
        });
    }

    // 隐藏未使用的header
    if (!basicSkills.length) {
        const h = container.querySelector('[data-section="basic-skills"]');
        if (h) h.style.display = 'none';
    }
    if (!learnedAdvanced.length) {
        const h = container.querySelector('[data-section="advanced-skills"]');
        if (h) h.style.display = 'none';
    }

    // 移除不再存在的技能元素
    Array.from(container.children).forEach(child => {
        const sid = child.getAttribute('data-skill-id');
        if (sid && !activeIds.has(sid)) container.removeChild(child);
    });

    // 空状态
    let emptyEl = container.querySelector('[data-skill-empty]');
    if (!hasContent) {
        if (!emptyEl) {
            emptyEl = document.createElement('div');
            emptyEl.setAttribute('data-skill-empty', '');
            emptyEl.style.cssText = 'text-align:center;color:#666;padding:30px';
            container.appendChild(emptyEl);
        }
        emptyEl.textContent = '暂无可操作技能';
        emptyEl.style.display = '';
    } else if (emptyEl) {
        emptyEl.style.display = 'none';
    }
}

function renderAppraiseBooks(container) {
    const books = game.player.skillBooks || {};
    const entries = Object.entries(books).filter(([_, d]) => d && d.count > 0);
    if (entries.length === 0) {
        container.innerHTML = '<div style="text-align:center;color:#666;padding:30px">你没有技能书，击败怪物有几率掉落</div>';
        return;
    }
    let html = '';
    entries.forEach(([bookId, data]) => {
        const book = SKILL_BOOKS.find(b => b.id === bookId);
        if (!book) return;
        const isAppraised = data.appraised;
        const appraisalCost = Math.floor(book.sellPrice * 0.8);
        const canAfford = game.player.gold >= appraisalCost;
        const rc = RARITY_CONFIG[book.rarity];
        const skill = isAppraised ? SKILLS.find(s => s.id === book.skillId) : null;
        const elInfo = skill ? ELEMENTS[skill.element] : null;

        html += `
            <div class="skill-list-item">
                <div class="skill-list-info">
                    <div class="skill-list-name">${book.emoji} ${book.name} ×${data.count}</div>
                    <div class="skill-list-desc">
                        ${isAppraised
                            ? `<span class="skill-book-status identified">🔍 已鉴定</span> 内含技能: <span style="color:${elInfo.color}">${skill.emoji} ${skill.name}</span> (${elInfo.name}属性)`
                            : `<span class="skill-book-status unidentified">❓ 未鉴定</span> 需要鉴定后才能学习`
                        }
                    </div>
                    <div class="skill-list-meta">${rc.label}品质 | 出售价: ${formatNumber(book.sellPrice)}金币</div>
                </div>
                <div style="display:flex;align-items:center;gap:6px;">
                    ${!isAppraised
                        ? `<span class="skill-list-cost">💰 ${formatNumber(appraisalCost)}</span><button class="btn btn-primary" onclick="appraiseBook('${book.id}')" ${!canAfford ? 'disabled' : ''}>鉴定</button>`
                        : (game.player.skills[book.skillId]?.level > 0
                            ? `<span style="color:#2ecc71">已学会</span><button class="btn btn-warning" onclick="sellSkillBook('${book.id}')">出售</button>`
                            : `<button class="btn btn-success" onclick="learnFromBook('${book.id}')">学习</button><button class="btn btn-warning" onclick="sellSkillBook('${book.id}')">出售</button>`)
                    }
                </div>
            </div>
        `;
    });
    container.innerHTML = html;
}

function renderTrainSpirit(container) {
    const level = game.player.spiLevel || 0;
    const cost = Math.floor(80 * Math.pow(1.2, level));
    const canAfford = game.player.gold >= cost;

    if (!container.querySelector('.train-panel')) {
        container.innerHTML = `
            <div class="train-panel">
                <div class="train-desc">通过冥想修炼提升精神力，增加魔力上限和技能伤害</div>
                <div class="train-stat">当前精神: <span class="train-spi" style="color:#e94560;font-size:1.3em"></span> | 当前等级: <span class="train-lvl" style="color:#f1c40f"></span></div>
                <div class="train-stat">最大魔力: <span class="train-mp"></span> | 每次修炼: 精神+2，魔力上限+6</div>
                <button class="btn btn-primary train-btn" onclick="trainSpirit()" style="font-size:1.1em;padding:10px 24px"></button>
            </div>
        `;
    }

    container.querySelector('.train-spi').textContent = formatNumber(game.player.spi);
    container.querySelector('.train-lvl').textContent = level;
    container.querySelector('.train-mp').textContent = formatNumber(game.player.maxMp);
    const btn = container.querySelector('.train-btn');
    btn.textContent = `🧘 修炼精神 (💰 ${formatNumber(cost)})`;
    btn.disabled = !canAfford;
}

function learnSkill(skillId) {
    const skill = SKILLS.find(s => s.id === skillId);
    if (!skill) return;
    if (game.player.gold < skill.learnCost) { log('金币不足！', 'log-damage'); return; }
    game.player.gold -= skill.learnCost;
    game.player.skills[skillId] = { level: 1, cooldownEnd: 0 };
    log(`📖 学会了 ${skill.emoji} ${skill.name}！`, 'log-skill');
    showNotification(`📖 学会了 ${skill.name}！`);
    renderNpcContent();
    updateUI();
    updateSkillButtons();
}

function upgradeSkill(skillId) {
    const skill = SKILLS.find(s => s.id === skillId);
    const data = game.player.skills[skillId];
    if (!skill || !data) return;
    if (data.level >= skill.maxLevel) { log('已达到最高等级！', 'log-damage'); return; }
    const cost = Math.floor(skill.upgradeCost * Math.pow(1.3, data.level - 1));
    if (game.player.gold < cost) { log('金币不足！', 'log-damage'); return; }
    game.player.gold -= cost;
    data.level++;
    log(`⬆️ ${skill.emoji} ${skill.name} 升级到 Lv.${data.level}！伤害: ${calculateSkillDamage(skill, data.level)}`, 'log-skill');
    showNotification(`⬆️ ${skill.name} Lv.${data.level}！`);
    renderNpcContent();
    updateUI();
}

function appraiseEquipment(bagIndex) {
    const bag = game.player.equipmentBag || [];
    if (bagIndex < 0 || bagIndex >= bag.length) return;
    const item = bag[bagIndex];
    if (item.appraised !== false) return;
    const eqDef = EQUIPMENT_POOL.find(e => e.id === item.id);
    if (!eqDef) return;
    const cost = Math.floor(eqDef.sellPrice * 0.5);
    if (game.player.gold < cost) { log('金币不足，无法鉴定！', 'log-damage'); return; }
    game.player.gold -= cost;
    item.appraised = true;
    log(`🔍 鉴定成功！${eqDef.emoji} ${eqDef.name} 已可以穿戴`, 'log-skill');
    showNotification(`🔍 鉴定成功: ${eqDef.name}！`);
    renderAppraiserContent();
    renderBag();
    updateUI();
}

function appraiseBook(bookId) {
    const book = SKILL_BOOKS.find(b => b.id === bookId);
    const data = game.player.skillBooks?.[bookId];
    if (!book || !data || data.count <= 0) return;
    const cost = Math.floor(book.sellPrice * 0.8);
    if (game.player.gold < cost) { log('金币不足，无法鉴定！', 'log-damage'); return; }
    game.player.gold -= cost;
    data.appraised = true;
    data.skillId = book.skillId;
    const skill = SKILLS.find(s => s.id === book.skillId);
    log(`🔍 鉴定成功！${book.emoji} ${book.name} 内含技能: ${skill.emoji} ${skill.name}`, 'log-skill');
    showNotification(`🔍 鉴定成功: ${skill.name}！`);
    renderAppraiserContent();
    renderBag();
    updateUI();
}

function learnFromBook(bookId) {
    const book = SKILL_BOOKS.find(b => b.id === bookId);
    const data = game.player.skillBooks?.[bookId];
    if (!book || !data || data.count <= 0 || !data.appraised) return;
    if (game.player.skills[book.skillId]?.level > 0) { log('你已经学会这个技能了！', 'log-damage'); return; }
    data.count--;
    if (data.count <= 0) delete game.player.skillBooks[bookId];
    game.player.skills[book.skillId] = { level: 1, cooldownEnd: 0 };
    const skill = SKILLS.find(s => s.id === book.skillId);
    log(`📖 通过技能书学会了 ${skill.emoji} ${skill.name}！`, 'log-skill');
    showNotification(`📖 学会了 ${skill.name}！`);
    renderNpcContent();
    renderAppraiserContent();
    renderBag();
    updateUI();
    updateSkillButtons();
}

function sellSkillBook(bookId) {
    const book = SKILL_BOOKS.find(b => b.id === bookId);
    const data = game.player.skillBooks?.[bookId];
    if (!book || !data || data.count <= 0) return;
    data.count--;
    if (data.count <= 0) delete game.player.skillBooks[bookId];
    game.player.gold += book.sellPrice;
    log(`💰 出售了 ${book.emoji} ${book.name}，获得 ${formatNumber(book.sellPrice)} 金币`, 'log-loot');
    renderNpcContent();
    renderAppraiserContent();
    renderBag();
    updateUI();
}

function trainSpirit() {
    const level = game.player.spiLevel || 0;
    const cost = Math.floor(80 * Math.pow(1.2, level));
    if (game.player.gold < cost) { log('金币不足！', 'log-damage'); return; }
    game.player.gold -= cost;
    game.player.spiLevel = level + 1;
    game.player.spi += 2;
    game.player.maxMp += 6;
    game.player.mp = Math.min(game.player.maxMp, game.player.mp + 6);
    log(`🧘 精神修炼成功！精神+2，魔力上限+6`, 'log-skill');
    showNotification('🧘 精神修炼成功！');
    renderNpcContent();
    updateUI();
}

// 战斗外自动回蓝
setInterval(() => {
    if (game.player && game.player.mp < game.player.maxMp) {
        const regen = Math.max(1, Math.floor(game.player.maxMp * 0.05));
        game.player.mp = Math.min(game.player.maxMp, game.player.mp + regen);
        // 只在NPC界面打开时更新UI，避免频繁刷新
        if (document.getElementById('npcView').style.display !== 'none') {
            updateUI();
        }
    }
}, 2000);

init();
