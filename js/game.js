const SAVE_KEY = 'idleRpgGame_save_v6';
const MAX_ATK_SPEED = 10;
const AREA_DROP_RATES = [0, 0, 0, 0.03, 0.08, 0.12, 0.18, 0.25];
const BOSS_AREAS = [5, 6, 7];
const BOSS_CONFIG = {
    5: { name: '龙王', emoji: '🐉' },
    6: { name: '天空领主', emoji: '☁️' },
    7: { name: '深渊魔王', emoji: '👿' }
};
const CLUE_REQUIRED = { 5: 10, 6: 15, 7: 35 };
const CLUE_DROP_RATE = 0.15;
const ELITE_SPAWN_RATE = 0.15;

const TREASURE_POOL = [
    { id: 'w_stone', name: '磨刀石', emoji: '🪨', rarity: 'common', stat: 'atk', value: 3, sellPrice: 15 },
    { id: 'w_shield', name: '木盾', emoji: '🛡️', rarity: 'common', stat: 'def', value: 2, sellPrice: 15 },
    { id: 'w_berry', name: '野莓', emoji: '🫐', rarity: 'common', stat: 'maxHp', value: 15, sellPrice: 12 },
    { id: 'w_luck', name: '幸运符', emoji: '🍀', rarity: 'common', stat: 'crit', value: 0.02, sellPrice: 18 },
    { id: 'w_book', name: '旧书', emoji: '📖', rarity: 'common', stat: 'expBonus', value: 0.05, sellPrice: 15 },
    { id: 'w_coin', name: '铜币袋', emoji: '🪙', rarity: 'common', stat: 'goldBonus', value: 0.05, sellPrice: 20 },
    { id: 'b_sword', name: '精钢剑', emoji: '⚔️', rarity: 'rare', stat: 'atk', value: 7, sellPrice: 40 },
    { id: 'b_armor', name: '铁甲', emoji: '👕', rarity: 'rare', stat: 'def', value: 4, sellPrice: 40 },
    { id: 'b_ring', name: '生命戒指', emoji: '💍', rarity: 'rare', stat: 'maxHp', value: 35, sellPrice: 35 },
    { id: 'b_eye', name: '鹰眼', emoji: '👁️', rarity: 'rare', stat: 'crit', value: 0.04, sellPrice: 45 },
    { id: 'b_scroll', name: '卷轴', emoji: '📜', rarity: 'rare', stat: 'expBonus', value: 0.10, sellPrice: 40 },
    { id: 'b_pouch', name: '银袋', emoji: '💰', rarity: 'rare', stat: 'goldBonus', value: 0.10, sellPrice: 50 },
    { id: 'p_axe', name: '战斧', emoji: '🪓', rarity: 'epic', stat: 'atk', value: 15, sellPrice: 100 },
    { id: 'p_plate', name: '板甲', emoji: '🦺', rarity: 'epic', stat: 'def', value: 8, sellPrice: 100 },
    { id: 'p_heart', name: '巨龙之心', emoji: '❤️', rarity: 'epic', stat: 'maxHp', value: 70, sellPrice: 90 },
    { id: 'p_gem', name: '暴击宝石', emoji: '💎', rarity: 'epic', stat: 'crit', value: 0.08, sellPrice: 110 },
    { id: 'p_tome', name: '魔法典籍', emoji: '📚', rarity: 'epic', stat: 'expBonus', value: 0.18, sellPrice: 100 },
    { id: 'p_chest', name: '小宝箱', emoji: '📦', rarity: 'epic', stat: 'goldBonus', value: 0.18, sellPrice: 120 },
    { id: 'l_blade', name: '屠龙刀', emoji: '🔪', rarity: 'legendary', stat: 'atk', value: 30, sellPrice: 250 },
    { id: 'l_shield', name: '圣盾', emoji: '🛡️', rarity: 'legendary', stat: 'def', value: 15, sellPrice: 250 },
    { id: 'l_phoenix', name: '凤凰之血', emoji: '🔥', rarity: 'legendary', stat: 'maxHp', value: 150, sellPrice: 230 },
    { id: 'l_star', name: '星辰碎片', emoji: '⭐', rarity: 'legendary', stat: 'crit', value: 0.12, sellPrice: 260 },
    { id: 'l_crown', name: '智慧之冠', emoji: '👑', rarity: 'legendary', stat: 'expBonus', value: 0.30, sellPrice: 250 },
    { id: 'l_gold', name: '聚宝盆', emoji: '🏆', rarity: 'legendary', stat: 'goldBonus', value: 0.30, sellPrice: 300 },
    { id: 'w_stone2', name: '破甲石', emoji: '🔨', rarity: 'common', stat: 'armorPenFlat', value: 2, sellPrice: 20 },
    { id: 'b_arrow', name: '精钢箭头', emoji: '➡️', rarity: 'rare', stat: 'armorPenFlat', value: 5, sellPrice: 50 },
    { id: 'p_hammer', name: '破甲锤', emoji: '🔨', rarity: 'epic', stat: 'armorPenFlat', value: 10, sellPrice: 120 },
    { id: 'l_spear', name: '神之矛', emoji: '🔱', rarity: 'legendary', stat: 'armorPenFlat', value: 20, sellPrice: 300 },
    { id: 'w_claw', name: '锐利之爪', emoji: '🐾', rarity: 'common', stat: 'armorPenPercent', value: 0.03, sellPrice: 20 },
    { id: 'b_powder', name: '腐蚀粉', emoji: '🧪', rarity: 'rare', stat: 'armorPenPercent', value: 0.06, sellPrice: 50 },
    { id: 'p_crossbow', name: '穿甲弩', emoji: '🏹', rarity: 'epic', stat: 'armorPenPercent', value: 0.10, sellPrice: 120 },
    { id: 'l_void', name: '虚空之刃', emoji: '⚫', rarity: 'legendary', stat: 'armorPenPercent', value: 0.15, sellPrice: 300 }
];

const RARITY_CONFIG = {
    common: { weight: 55, color: '#ccc', label: '普通' },
    rare: { weight: 30, color: '#4facfe', label: '稀有' },
    epic: { weight: 12, color: '#a55eea', label: '史诗' },
    legendary: { weight: 3, color: '#ff9f43', label: '传说' }
};

// ========== 装备系统常量 ==========
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
    { id: 'eq_br_bronze', name: '铜手镯', emoji: '💎', slot: 'bracelet', rarity: 'common', crit: 0.02, sellPrice: 25 },
    { id: 'eq_br_silver', name: '银手镯', emoji: '💎', slot: 'bracelet', rarity: 'rare', crit: 0.04, sellPrice: 70 },
    { id: 'eq_br_gold', name: '金手镯', emoji: '💎', slot: 'bracelet', rarity: 'epic', crit: 0.08, sellPrice: 180 },
    { id: 'eq_br_dragon', name: '龙鳞手镯', emoji: '💎', slot: 'bracelet', rarity: 'legendary', crit: 0.12, sellPrice: 450 },
    // 玉佩
    { id: 'eq_j_pearl', name: '珍珠玉佩', emoji: '🏵️', slot: 'jade', rarity: 'common', def: 3, spi: 1, sellPrice: 25 },
    { id: 'eq_j_green', name: '翡翠玉佩', emoji: '🏵️', slot: 'jade', rarity: 'rare', def: 7, spi: 2, sellPrice: 70 },
    { id: 'eq_j_royal', name: '皇家玉佩', emoji: '🏵️', slot: 'jade', rarity: 'epic', def: 15, spi: 4, sellPrice: 180 },
    { id: 'eq_j_dragon', name: '龙纹玉佩', emoji: '🏵️', slot: 'jade', rarity: 'legendary', def: 30, spi: 8, sellPrice: 450 },
    // 项链
    { id: 'eq_n_copper', name: '铜项链', emoji: '📿', slot: 'necklace', rarity: 'common', vamp: 0.01, expBonus: 0.03, sellPrice: 25 },
    { id: 'eq_n_silver', name: '银项链', emoji: '📿', slot: 'necklace', rarity: 'rare', vamp: 0.02, expBonus: 0.06, sellPrice: 70 },
    { id: 'eq_n_gold', name: '金项链', emoji: '📿', slot: 'necklace', rarity: 'epic', vamp: 0.04, expBonus: 0.12, sellPrice: 180 },
    { id: 'eq_n_dragon', name: '龙纹项链', emoji: '📿', slot: 'necklace', rarity: 'legendary', vamp: 0.08, expBonus: 0.25, sellPrice: 450 }
];

const EQUIPMENT_DROP_RATES = [0.05, 0.08, 0.12, 0.15, 0.20, 0.25, 0.30, 0.35];

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
      desc: '发射火球造成单体魔法伤害', baseDmg: 20, mpCost: 15, cooldown: 3000,
      learnCost: 100, upgradeCost: 80, maxLevel: 10, isBasic: true },
    { id: 'ice_arrow', name: '冰箭', emoji: '❄️', element: 'ice', type: 'damage',
      desc: '射出冰箭造成单体伤害', baseDmg: 18, mpCost: 12, cooldown: 2500,
      learnCost: 100, upgradeCost: 80, maxLevel: 10, isBasic: true },
    { id: 'heal', name: '治疗术', emoji: '💚', element: 'holy', type: 'heal',
      desc: '恢复自身生命值', baseDmg: 30, mpCost: 20, cooldown: 5000,
      learnCost: 100, upgradeCost: 80, maxLevel: 10, isBasic: true },
    { id: 'shield', name: '护盾术', emoji: '🛡️', element: 'holy', type: 'buff',
      desc: '获得临时防御加成（持续10秒）', baseDmg: 15, mpCost: 15, cooldown: 8000, buffDuration: 10000,
      learnCost: 120, upgradeCost: 90, maxLevel: 10, isBasic: true },
    { id: 'flame_storm', name: '烈焰风暴', emoji: '🌋', element: 'fire', type: 'damage',
      desc: '召唤烈焰风暴造成大量伤害', baseDmg: 60, mpCost: 40, cooldown: 6000,
      learnCost: 0, upgradeCost: 200, maxLevel: 5, isBasic: false },
    { id: 'thunder_strike', name: '雷霆一击', emoji: '⚡', element: 'lightning', type: 'damage',
      desc: '召唤雷电造成巨大伤害', baseDmg: 70, mpCost: 45, cooldown: 7000,
      learnCost: 0, upgradeCost: 220, maxLevel: 5, isBasic: false },
    { id: 'shadow_bolt', name: '暗影箭', emoji: '🌑', element: 'dark', type: 'damage_lifesteal',
      desc: '暗影箭造成伤害并吸血30%', baseDmg: 45, mpCost: 30, cooldown: 5000,
      learnCost: 0, upgradeCost: 180, maxLevel: 5, isBasic: false },
    { id: 'holy_judgment', name: '圣光审判', emoji: '✨', element: 'holy', type: 'damage',
      desc: '圣光对邪恶生物造成额外50%伤害', baseDmg: 50, mpCost: 35, cooldown: 6000,
      learnCost: 0, upgradeCost: 200, maxLevel: 5, isBasic: false },
    { id: 'frost_nova', name: '冰冻新星', emoji: '❄️', element: 'ice', type: 'damage',
      desc: '释放冰冻新星造成高额伤害', baseDmg: 55, mpCost: 38, cooldown: 6500,
      learnCost: 0, upgradeCost: 200, maxLevel: 5, isBasic: false },
    { id: 'poison_mist', name: '毒雾', emoji: '💀', element: 'nature', type: 'dot',
      desc: '释放毒雾持续造成伤害（5秒内每秒一次）', baseDmg: 12, mpCost: 25, cooldown: 10000,
      learnCost: 0, upgradeCost: 180, maxLevel: 5, isBasic: false, dotDuration: 5000, dotInterval: 1000 }
];

const SKILL_BOOKS = [
    { id: 'book_flame_storm', skillId: 'flame_storm', name: '烈焰风暴秘籍', emoji: '📕', rarity: 'epic', sellPrice: 150 },
    { id: 'book_thunder_strike', skillId: 'thunder_strike', name: '雷霆一击秘籍', emoji: '📕', rarity: 'epic', sellPrice: 160 },
    { id: 'book_shadow_bolt', skillId: 'shadow_bolt', name: '暗影箭秘籍', emoji: '📕', rarity: 'rare', sellPrice: 120 },
    { id: 'book_holy_judgment', skillId: 'holy_judgment', name: '圣光审判秘籍', emoji: '📕', rarity: 'epic', sellPrice: 150 },
    { id: 'book_frost_nova', skillId: 'frost_nova', name: '冰冻新星秘籍', emoji: '📕', rarity: 'epic', sellPrice: 150 },
    { id: 'book_poison_mist', skillId: 'poison_mist', name: '毒雾秘籍', emoji: '📕', rarity: 'rare', sellPrice: 120 }
];

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

const SKILL_BOOK_DROP_RATES = [0, 0, 0.02, 0.04, 0.06, 0.08, 0.10, 0.12];

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
            buffs: {},
            equipments: {},
            equipmentBag: []
        },
        currentArea: 0,
        bossDefeated: [false, false, false, false, false, false, false, false],
        bossFled: [false, false, false, false, false, false, false, false],
        clues: { 5: 0, 6: 0, 7: 0 },
        fightingBoss: false
    };
}

let game = {
    player: null, enemy: null,
    autoBattle: false, autoBattleTimer: null,
    autoStrengthen: false,
    lastPlayerAttack: 0, lastEnemyAttack: 0,
    currentArea: 0,
    inCity: false,
    bossDefeated: [false, false, false, false, false, false, false, false],
    bossFled: [false, false, false, false, false, false, false, false],
    clues: { 5: 0, 6: 0, 7: 0 },
    fightingBoss: false,
    areas: [
        { name: '新手村', emoji: '🌲', level: 1, multiplier: 1 },
        { name: '暗黑森林', emoji: '🌲', level: 5, multiplier: 2 },
        { name: '熔岩洞穴', emoji: '🌋', level: 10, multiplier: 3 },
        { name: '冰雪山脉', emoji: '❄️', level: 15, multiplier: 4 },
        { name: '恶魔城堡', emoji: '🏰', level: 20, multiplier: 5 },
        { name: '龙之巢穴', emoji: '🐉', level: 30, multiplier: 7 },
        { name: '天空之城', emoji: '☁️', level: 40, multiplier: 10 },
        { name: '地狱深渊', emoji: '🔥', level: 50, multiplier: 15 }
    ],
    enemies: [
        { name: '小恶魔', emoji: '👹' }, { name: '史莱姆', emoji: '🟢' },
        { name: '骷髅兵', emoji: '💀' }, { name: '蝙蝠', emoji: '🦇' },
        { name: '野狼', emoji: '🐺' }, { name: '哥布林', emoji: '👺' },
        { name: '僵尸', emoji: '🧟' }, { name: '蜘蛛', emoji: '🕷️' },
        { name: '幽灵', emoji: '👻' }, { name: '兽人', emoji: '👾' }
    ]
};

const TREASURE_FILTERS = new Set();
let currentBagTab = 'treasure';
let currentEquipmentFilter = 'all';

function switchBagTab(tab) {
    currentBagTab = tab;
    document.querySelectorAll('.bag-tab').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tab);
    });
    renderBag();
}

function toggleAutoStrengthen() {
    game.autoStrengthen = !game.autoStrengthen;
    const btn = document.getElementById('autoStrengthenBtn');
    if (game.autoStrengthen) {
        btn.textContent = '⚡ 自动强化: 开';
        btn.style.background = 'linear-gradient(45deg, #2ecc71, #27ae60)';
        btn.style.borderColor = 'transparent';
        log('⚡ 自动强化已开启', 'log-loot');
    } else {
        btn.textContent = '⚡ 自动强化: 关';
        btn.style.background = '';
        btn.style.borderColor = '';
        log('⚡ 自动强化已关闭', 'log-loot');
    }
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

function toggleTreasureFilter(filter) {
    const btn = document.querySelector(`.treasure-filter-btn[data-filter="${filter}"]`);
    if (filter === 'upgradeable') {
        const isActive = TREASURE_FILTERS.has('upgradeable');
        if (isActive) {
            TREASURE_FILTERS.delete('upgradeable');
            btn.style.background = '';
            btn.style.borderColor = '';
        } else {
            TREASURE_FILTERS.add('upgradeable');
            btn.style.background = 'linear-gradient(45deg, #e94560, #ff6b6b)';
            btn.style.borderColor = 'transparent';
        }
    } else {
        if (TREASURE_FILTERS.has(filter)) {
            TREASURE_FILTERS.delete(filter);
            btn.style.background = '';
            btn.style.borderColor = '';
        } else {
            TREASURE_FILTERS.add(filter);
            btn.style.background = 'linear-gradient(45deg, #e94560, #ff6b6b)';
            btn.style.borderColor = 'transparent';
        }
    }
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

function saveGame() {
    const data = { player: game.player, currentArea: game.currentArea, bossDefeated: game.bossDefeated, bossFled: game.bossFled, clues: game.clues, fightingBoss: game.fightingBoss, autoStrengthen: game.autoStrengthen, savedAt: Date.now() };
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
    showNotification('💾 游戏已保存！');
    log('游戏进度已保存', 'log-loot');
}

function loadGame() {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) { showNotification('没有找到存档'); return false; }
    try {
        const data = JSON.parse(raw);
        if (data.player) game.player = data.player;
        if (data.currentArea !== undefined) game.currentArea = data.currentArea;
        if (data.bossDefeated) game.bossDefeated = data.bossDefeated;
        if (data.bossFled) game.bossFled = data.bossFled;
        if (data.clues) game.clues = data.clues;
        if (data.fightingBoss !== undefined) game.fightingBoss = data.fightingBoss;
        if (data.autoStrengthen !== undefined) game.autoStrengthen = data.autoStrengthen;
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
    if (game.player.items === undefined) game.player.items = {};
    // 旧存档攻速迁移：新版使用基于等级的曲线计算，固定基础值为1000
    if (game.player.aspdLevel > 0 && game.player.aspd !== 1000) {
        game.player.aspd = 1000;
    }
}

// 定期检查buff过期
setInterval(() => {
    if (game.player && cleanExpiredBuffs()) {
        updateUI();
        renderBag();
    }
}, 5000);

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
    const data = { player: game.player, currentArea: game.currentArea, bossDefeated: game.bossDefeated, bossFled: game.bossFled, clues: game.clues, fightingBoss: game.fightingBoss, autoStrengthen: game.autoStrengthen, savedAt: Date.now() };
    let base64;
    try { base64 = utf8ToBase64(JSON.stringify(data)); } catch (e) { alert('存档编码失败：' + e.message); return; }
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
        const data = JSON.parse(jsonStr);
        if (data.player) game.player = data.player;
        if (data.currentArea !== undefined) game.currentArea = data.currentArea;
        if (data.bossDefeated) game.bossDefeated = data.bossDefeated;
        if (data.bossFled) game.bossFled = data.bossFled;
        if (data.clues) game.clues = data.clues;
        if (data.fightingBoss !== undefined) game.fightingBoss = data.fightingBoss;
        if (data.autoStrengthen !== undefined) game.autoStrengthen = data.autoStrengthen;
        migrateOldSave();
        const autoBtn = document.getElementById('autoStrengthenBtn');
        if (game.autoStrengthen) {
            autoBtn.textContent = '⚡ 自动强化: 开';
            autoBtn.style.background = 'linear-gradient(45deg, #2ecc71, #27ae60)';
            autoBtn.style.borderColor = 'transparent';
        } else {
            autoBtn.textContent = '⚡ 自动强化: 关';
            autoBtn.style.background = '';
            autoBtn.style.borderColor = '';
        }
        spawnEnemy(); renderAreas(); renderUpgrades(); renderBag(); updateClueUI(); updateUI(); updateSkillButtons();
        showNotification('📥 存档导入成功！'); log('外部存档已导入', 'log-loot');
    } catch (e) { alert('存档代码无效！\n错误：' + e.message + '\n请检查是否复制完整，不要有多余空格或换行。'); }
}

function resetGame() {
    if (!confirm('确定要重置所有进度吗？此操作不可撤销！')) return;
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
        localStorage.setItem(SAVE_KEY, JSON.stringify({ player: game.player, currentArea: game.currentArea, bossDefeated: game.bossDefeated, bossFled: game.bossFled, clues: game.clues, fightingBoss: game.fightingBoss, autoStrengthen: game.autoStrengthen, savedAt: Date.now() }));
    }
}, 30000);

// ========== 宝物系统 ==========
function getTreasureBonuses() {
    const bonuses = { atk: 0, def: 0, maxHp: 0, crit: 0, critDmg: 0, vamp: 0, expBonus: 0, goldBonus: 0, armorPenFlat: 0, armorPenPercent: 0 };
    const treasures = game.player.treasures || {};
    for (const [tid, data] of Object.entries(treasures)) {
        if (!data || data.count <= 0) continue;
        const t = TREASURE_POOL.find(x => x.id === tid);
        if (!t) continue;
        const level = data.level || 1;
        const bonusPerLevel = t.value * 0.5;
        const totalValue = t.value + (level - 1) * bonusPerLevel;
        bonuses[t.stat] += totalValue;
    }
    return bonuses;
}

function getEquipmentBonuses() {
    const bonuses = { atk: 0, def: 0, maxHp: 0, aspd: 0, crit: 0, critDmg: 0, vamp: 0, expBonus: 0, spi: 0 };
    const eqs = game.player.equipments || {};
    for (const [slotKey, data] of Object.entries(eqs)) {
        if (!data) continue;
        const eqDef = EQUIPMENT_POOL.find(e => e.id === data.id);
        if (!eqDef) continue;
        const level = data.level || 1;
        const refine = data.refine || 0;
        const refineMult = 1 + refine * 0.1;
        const levelMult = (1 + (level - 1) * 0.1) * refineMult;
        if (eqDef.atk) bonuses.atk += eqDef.atk * levelMult;
        if (eqDef.def) bonuses.def += eqDef.def * levelMult;
        if (eqDef.maxHp) bonuses.maxHp += eqDef.maxHp * levelMult;
        if (eqDef.aspd) bonuses.aspd += eqDef.aspd * levelMult;
        if (eqDef.crit) bonuses.crit += eqDef.crit * levelMult;
        if (eqDef.critDmg) bonuses.critDmg += eqDef.critDmg * levelMult;
        if (eqDef.vamp) bonuses.vamp += eqDef.vamp * levelMult;
        if (eqDef.expBonus) bonuses.expBonus += eqDef.expBonus * levelMult;
        if (eqDef.spi) bonuses.spi += eqDef.spi * levelMult;
    }
    return bonuses;
}

function getAreaDropRate() { return AREA_DROP_RATES[game.currentArea] || 0; }

function rollEquipmentDrop(minRarity) {
    const rarities = Object.keys(RARITY_CONFIG);
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
    const pool = EQUIPMENT_POOL.filter(e => e.rarity === selectedRarity);
    return pool[Math.floor(Math.random() * pool.length)];
}

function addEquipmentToBag(equipment) {
    game.player.equipmentBag = game.player.equipmentBag || [];
    game.player.equipmentBag.push({ id: equipment.id, level: 1 });
}

function rollTreasureDrop(minRarity, customRate) {
    const rate = customRate !== undefined ? customRate : getAreaDropRate();
    if (rate <= 0 || Math.random() > rate) return null;
    const rarities = Object.keys(RARITY_CONFIG);
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
    const pool = TREASURE_POOL.filter(t => t.rarity === selectedRarity);
    return pool[Math.floor(Math.random() * pool.length)];
}

function addTreasure(treasure) {
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
    log(`💰 出售了 ${t.emoji} ${t.name}，获得 ${t.sellPrice} 金币`, 'log-loot');
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
    game.enemy = {
        name: bossCfg.name, emoji: bossCfg.emoji, level: baseLevel, isBoss: true,
        maxHp: Math.floor(50 * baseLevel * mult * 2.5), hp: 0,
        atk: Math.floor(8 * baseLevel * mult * 1.5),
        def: Math.floor(3 * baseLevel * mult * 5),
        exp: Math.floor(20 * baseLevel * mult * 5),
        gold: Math.floor(10 * baseLevel * mult * 5)
    };
    game.enemy.hp = game.enemy.maxHp;
    updateEnemyUI();
}

function spawnEnemy() {
    const area = game.areas[game.currentArea];
    const baseLevel = Math.max(1, area.level + Math.floor(Math.random() * 3) - 1);
    const template = game.enemies[Math.floor(Math.random() * game.enemies.length)];
    const mult = area.multiplier;
    const isElite = isBossArea(game.currentArea) && Math.random() < ELITE_SPAWN_RATE;
    game.enemy = {
        name: template.name, emoji: template.emoji, level: baseLevel, isBoss: false, isElite: isElite,
        maxHp: Math.floor(50 * baseLevel * mult * (isElite ? 1.2 : 0.5)), hp: 0,
        atk: Math.floor(8 * baseLevel * mult * (isElite ? 0.8 : 0.3)),
        def: Math.floor(3 * baseLevel * mult * (isElite ? 0.6 : 0.2)),
        exp: Math.floor(20 * baseLevel * mult * (isElite ? 2.5 : 1)),
        gold: Math.floor(10 * baseLevel * mult * (isElite ? 2.5 : 1))
    };
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
            const data = JSON.parse(raw);
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
}

function getPlayerStats() {
    const b = getTreasureBonuses();
    const eq = getEquipmentBonuses();
    const p = game.player;
    const aspdLevel = p.aspdLevel || 0;
    let baseInterval, speedMultiplier;
    if (aspdLevel <= 40) {
        // 前40级：只提升攻速，不增加伤害倍数，40级时达到10次/秒
        const attackSpeed = 1 + 0.005625 * aspdLevel * aspdLevel;
        baseInterval = Math.max(100, Math.floor(1000 / attackSpeed));
        speedMultiplier = 1.0;
    } else {
        // 41-100级：攻速保持10次/秒，伤害倍数提升，100级时达到10倍
        baseInterval = 100;
        const dmgLevel = Math.min(60, aspdLevel - 40);
        speedMultiplier = Math.min(10, 1 + 0.0025 * dmgLevel * dmgLevel);
    }
    const rawAspd = Math.max(1, baseInterval - eq.aspd);
    const realAspd = Math.max(100, rawAspd);
    // buff加成
    let buffDef = 0;
    let buffAtkMult = 1.0;
    let buffDefMult = 1.0;
    let buffExpMult = 0;
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
    }
    const baseAtk = p.atk + b.atk + eq.atk;
    const baseDef = p.def + b.def + buffDef + eq.def;
    return {
        atk: Math.floor(baseAtk * buffAtkMult), def: Math.floor(baseDef * buffDefMult), maxHp: p.maxHp + b.maxHp + eq.maxHp,
        aspd: realAspd, speedMultiplier,
        crit: Math.min(1.0, p.crit + b.crit + eq.crit), critDmg: p.critDmg + b.critDmg + eq.critDmg,
        vamp: p.vamp + b.vamp + eq.vamp, expBonus: b.expBonus + eq.expBonus + buffExpMult, goldBonus: b.goldBonus,
        armorPenFlat: b.armorPenFlat, armorPenPercent: Math.min(0.35, b.armorPenPercent),
        spi: p.spi + eq.spi, maxMp: p.maxMp, mp: p.mp
    };
}

function attack(attacker, defender, isPlayer) {
    const stats = isPlayer ? getPlayerStats() : attacker;
    let effectiveDef = defender.def;
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
    const baseDmg = Math.max(1, stats.atk - effectiveDef * 0.5);
    const isCrit = isPlayer && Math.random() < (stats.crit || 0);
    const critMultiplier = isCrit ? (stats.critDmg || 2) : 1;
    const speedMultiplier = isPlayer ? (stats.speedMultiplier || 1.0) : 1.0;
    const dmg = Math.floor(baseDmg * critMultiplier * speedMultiplier);
    defender.hp = Math.max(0, defender.hp - dmg);
    if (isPlayer && stats.vamp) {
        const heal = Math.floor(dmg * stats.vamp);
        if (heal > 0) {
            game.player.hp = Math.min(game.player.maxHp + getTreasureBonuses().maxHp, game.player.hp + heal);
            log(`🩸 吸血恢复了 ${heal} 点生命`, 'log-heal');
        }
    }
    // 攻击恢复1点MP
    if (isPlayer && game.player.mp < game.player.maxMp) {
        game.player.mp = Math.min(game.player.maxMp, game.player.mp + 1);
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
    el.textContent = (isCrit ? '暴击! ' : '') + '-' + damage;
    el.style.color = isCrit ? '#ff0000' : '#e94560';
    target.appendChild(el);
    setTimeout(() => el.remove(), 1000);
}

function battleRound() {
    if (!game.enemy || game.enemy.hp <= 0) return;
    if (game.player.hp <= 0) { playerDeath(); return; }
    const playerDmg = attack(game.player, game.enemy, true);
    let enemyName;
    if (game.enemy.isBoss) enemyName = `【BOSS】${game.enemy.name}`;
    else if (game.enemy.isElite) enemyName = `【精英】${game.enemy.name}`;
    else enemyName = game.enemy.name;
    log(`你对${enemyName}造成了 ${playerDmg} 点伤害`, 'log-damage');
    if (game.enemy.hp <= 0) { enemyDefeated(); return; }
    updateUI();
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
        log(`💚 ${enemyName}释放了 ${skillDef.emoji}${skillDef.name}，恢复了 ${healAmount} 点生命！`, 'log-heal');
        updateUI();
        return true;
    } else if (skillDef.type === 'buff') {
        const buffDef = Math.floor(game.enemy.def * 0.3 + skillDef.baseDmg);
        game.enemy.buffs = game.enemy.buffs || {};
        game.enemy.buffs.shield = { endTime: now + (skillDef.buffDuration || 10000), defBonus: buffDef };
        log(`🛡️ ${enemyName}释放了 ${skillDef.emoji}${skillDef.name}，获得 ${buffDef} 点临时防御！`, 'log-skill');
        updateUI();
        return true;
    } else {
        const dmg = Math.floor(game.enemy.atk * 1.2 + skillDef.baseDmg * 0.5);
        game.player.hp = Math.max(0, game.player.hp - dmg);
        log(`💥 ${enemyName}释放了 ${skillDef.emoji}${skillDef.name}，对你造成 ${dmg} 点伤害！`, 'log-skill');
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

function enemyAttack() {
    if (!game.enemy || game.enemy.hp <= 0) return;
    if (game.player.hp <= 0) { playerDeath(); return; }
    if (game.enemy.isElite && Math.random() < 0.4 && enemyCastSkill()) return;
    const enemyDmg = attack(game.enemy, game.player, false);
    const enemyName = game.enemy.isBoss ? `【BOSS】${game.enemy.name}` : game.enemy.isElite ? `【精英】${game.enemy.name}` : game.enemy.name;
    log(`${enemyName}对你造成了 ${enemyDmg} 点伤害`, 'log-damage');
    if (game.player.hp <= 0) playerDeath();
    else updateUI();
}

function enemyDefeated() {
    const stats = getPlayerStats();
    const exp = Math.floor(game.enemy.exp * (1 + stats.expBonus));
    const baseGold = game.enemy.gold;
    const gold = Math.floor(baseGold * (1 + stats.goldBonus));
    game.player.exp += exp;
    game.player.gold += gold;
    game.player.kills++;

    let enemyName;
    if (game.enemy.isBoss) enemyName = `【BOSS】${game.enemy.name}`;
    else if (game.enemy.isElite) enemyName = `【精英】${game.enemy.name}`;
    else enemyName = game.enemy.name;

    if (game.enemy.isBoss) {
        bossDefeatedByPlayer();
        log(`🏆 击败了 ${enemyName}！获得 ${exp} 经验值和 ${gold} 金币！`, 'log-boss');
        showNotification(`🎉 击败BOSS ${game.enemy.emoji} ${game.enemy.name}！`);
        dropLog(`🏆 击败BOSS：${game.enemy.emoji} ${game.enemy.name} — ${exp}经验 ${gold}金币`);

        // BOSS宝物：60%概率，最低史诗
        if (Math.random() < 0.60) {
            const bossTreasure = rollTreasureDrop('epic');
            if (bossTreasure) {
                addTreasure(bossTreasure);
                const rc = RARITY_CONFIG[bossTreasure.rarity];
                log(`🎁 BOSS掉落了 [${rc.label}] ${bossTreasure.emoji} ${bossTreasure.name}！`, 'log-legendary');
                dropLog(`🎁 BOSS掉落：[${rc.label}] ${bossTreasure.emoji} ${bossTreasure.name}`);
                showNotification(`🎉 BOSS掉落${rc.label}宝物：${bossTreasure.name}！`);
            }
        }

        // BOSS装备：高概率，最低稀有
        const eqDropRate = (EQUIPMENT_DROP_RATES[game.currentArea] || 0) * 1.2;
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
        const bookDropRate = (SKILL_BOOK_DROP_RATES[game.currentArea] || 0) * 1.5;
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
                log(`🔮 BOSS掉落了 ${stone.emoji} ${stone.name} ×${stoneCount}！`, 'log-epic');
                dropLog(`🔮 BOSS掉落：${stone.emoji} ${stone.name} ×${stoneCount}`);
                showNotification(`🔮 BOSS掉落${stone.name} ×${stoneCount}！`);
            }
        }
    } else if (game.enemy.isElite) {
        log(`🌟 击败了 ${enemyName}！获得 ${exp} 经验值和 ${gold} 金币！`, 'log-epic');
        showNotification(`🌟 击败精英 ${game.enemy.emoji} ${game.enemy.name}！`);
        dropLog(`🌟 击败精英：${game.enemy.emoji} ${game.enemy.name} — ${exp}经验 ${gold}金币`);
        addClue();

        // 精英宝物：1.5倍概率，最低稀有
        const treasureRate = (AREA_DROP_RATES[game.currentArea] || 0) * 1.5;
        if (treasureRate > 0 && Math.random() < treasureRate) {
            const treasure = rollTreasureDrop('rare');
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
        const eqDropRate = (EQUIPMENT_DROP_RATES[game.currentArea] || 0) * 1.5;
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
        const bookDropRate = (SKILL_BOOK_DROP_RATES[game.currentArea] || 0) * 1.5;
        if (bookDropRate > 0 && Math.random() < bookDropRate) {
            const book = SKILL_BOOKS[Math.floor(Math.random() * SKILL_BOOKS.length)];
            addSkillBook(book);
            const rc = RARITY_CONFIG[book.rarity];
            log(`📕 精英掉落了 [${rc.label}] 技能书：${book.name}！`, 'log-epic');
            dropLog(`📕 [${rc.label}] ${book.emoji} ${book.name}`);
            showNotification(`📕 获得${rc.label}技能书：${book.name}！`);
        }

        // 精英核心：50%概率
        if (Math.random() < 0.50) {
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
        log(`击败了 ${enemyName}！获得 ${exp} 经验值和 ${gold} 金币！`, 'log-exp');
        addClue();

        // 普通怪物装备：基础概率
        const eqDropRate = EQUIPMENT_DROP_RATES[game.currentArea] || 0;
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

        // 普通怪物技能书：基础概率
        const bookDropRate = SKILL_BOOK_DROP_RATES[game.currentArea] || 0;
        if (bookDropRate > 0 && Math.random() < bookDropRate) {
            const book = SKILL_BOOKS[Math.floor(Math.random() * SKILL_BOOKS.length)];
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
    }

    while (game.player.exp >= game.player.maxExp) levelUp();
    updateUI();
    if (!game.enemy.isBoss) {
        if (game.autoBattle) {
            spawnEnemy();
            const encounterName = game.enemy.isElite ? `【精英】${game.enemy.name} Lv.${game.enemy.level}` : `${game.enemy.name} Lv.${game.enemy.level}`;
            log(`遇到了新的敌人：${encounterName}`, 'log-loot');
        } else {
            setTimeout(() => { spawnEnemy(); const encounterName = game.enemy.isElite ? `【精英】${game.enemy.name} Lv.${game.enemy.level}` : `${game.enemy.name} Lv.${game.enemy.level}`; log(`遇到了新的敌人：${encounterName}`, 'log-loot'); }, 800);
        }
    }
}

function levelUp() {
    game.player.exp -= game.player.maxExp;
    game.player.level++;
    game.player.maxExp = Math.floor(game.player.maxExp * 1.2);
    game.player.maxHp += 20;
    game.player.hp = game.player.maxHp;
    game.player.atk += 3;
    game.player.def += 2;
    game.player.spi += 1;
    game.player.maxMp = 50 + game.player.spi * 3 + game.player.level * 2;
    game.player.mp = game.player.maxMp;
    log(`🎉 升级了！当前等级：${game.player.level}，精神+1，魔力恢复满！`, 'log-level');
    showNotification(`升级了！Lv.${game.player.level}`);
    renderAreas();
}

function playerDeath() {
    if (game.fightingBoss && game.enemy && game.enemy.isBoss) {
        bossEscaped();
        const goldLoss = Math.floor(50 + Math.random() * 200);
        game.player.gold = Math.max(0, game.player.gold - goldLoss);
        log(`💀 被BOSS击败了... 掉落了 ${goldLoss} 金币，BOSS逃走了！`, 'log-death');
        game.player.hp = game.player.maxHp;
        game.player.mp = game.player.maxMp;
        stopAutoBattle();
        spawnEnemy();
        updateClueUI();
        updateUI();
        return;
    }

    const goldLoss = Math.floor(50 + Math.random() * 200);
    game.player.gold = Math.max(0, game.player.gold - goldLoss);
    let msg = `💀 你倒下了... 掉落了 ${goldLoss} 金币`;
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
}

function stopAutoBattle() {
    game.autoBattle = false;
    if (game.autoBattleTimer) { clearInterval(game.autoBattleTimer); game.autoBattleTimer = null; }
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

    // 自动释放技能
    if (!document.hidden) {
        tryAutoCastSkill();
    }

    const playerElapsed = now - game.lastPlayerAttack;
    const playerAttacks = Math.min(Math.floor(playerElapsed / stats.aspd), maxBatch);
    for (let i = 0; i < playerAttacks; i++) {
        if (!game.enemy) spawnEnemy();
        if (!game.enemy || game.enemy.hp <= 0 || game.player.hp <= 0) break;
        battleRound();
    }
    if (playerAttacks > 0) game.lastPlayerAttack += playerAttacks * stats.aspd;

    const enemyElapsed = now - game.lastEnemyAttack;
    const enemyAttacks = Math.min(Math.floor(enemyElapsed / 700), maxBatch);
    for (let i = 0; i < enemyAttacks; i++) {
        if (!game.enemy) spawnEnemy();
        if (!game.enemy || game.enemy.hp <= 0 || game.player.hp <= 0) break;
        enemyAttack();
    }
    if (enemyAttacks > 0) game.lastEnemyAttack += enemyAttacks * 700;
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
        game.autoBattleTimer = setInterval(autoBattleLoop, 100);
    } else { stopAutoBattle(); log('停止自动战斗', 'log-loot'); }
}

function heal() {
    const stats = getPlayerStats();
    const cost = Math.floor(stats.maxHp * 0.1);
    if (game.player.gold >= cost) {
        game.player.gold -= cost;
        game.player.hp = stats.maxHp;
        log(`花费 ${cost} 金币恢复了生命值`, 'log-heal');
        updateUI();
    } else { log('金币不足！', 'log-damage'); }
}

function buyUpgrade(upgradeId) {
    const upgrade = upgrades.find(u => u.id === upgradeId);
    if (!upgrade) return;
    const levelKey = upgradeId + 'Level';
    const level = game.player[levelKey] || 0;
    const cost = Math.floor(upgrade.cost * Math.pow(1.15, level));
    if (game.player.gold >= cost) {
        game.player.gold -= cost;
        game.player[levelKey] = level + 1;
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
            bonus += Math.floor(level / 30) * upgrade.value;
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
            log(`购买了 ${upgrade.name} Lv.${level + 1}！+${bonus}！`, 'log-loot');
        }
        updateUI(); renderUpgrades();
    } else { log('金币不足！', 'log-damage'); }
}

function changeArea(index) {
    const area = game.areas[index];
    if (game.player.level >= area.level) {
        if (index > game.currentArea && index > 0 && isBossArea(index - 1) && !isBossDefeated(index - 1)) {
            const bossCfg = BOSS_CONFIG[index - 1];
            showNotification(`⚠️ 必须先击败 ${bossCfg.emoji} ${bossCfg.name} 才能进入下一关！`);
            log(`进入${area.name}需要先击败${bossCfg.name}！`, 'log-death');
            return;
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
    container.innerHTML = '';
    const cityBtn = document.createElement('button');
    cityBtn.className = 'area-btn' + (game.inCity ? ' active' : '');
    cityBtn.innerHTML = '🏰 主城';
    cityBtn.onclick = () => showNpcView();
    container.appendChild(cityBtn);
    game.areas.forEach((area, index) => {
        const btn = document.createElement('button');
        const isBoss = isBossArea(index);
        const defeated = isBossDefeated(index);
        const isActive = !game.inCity && index === game.currentArea;
        let className = 'area-btn' + (isActive ? ' active' : '');
        if (isBoss && defeated) className += ' boss-defeated';
        btn.className = className;

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

        btn.innerHTML = `${area.emoji} ${area.name}${badge}${isActive ? '' : dropText}`;
        btn.title = `需要等级 ${area.level}`;
        btn.disabled = game.player.level < area.level;
        btn.onclick = () => changeArea(index);
        container.appendChild(btn);
    });
}

function updateClueUI() {
    const cluePanel = document.getElementById('cluePanel');
    const bossPanel = document.getElementById('bossPanel');

    if (!isBossArea(game.currentArea) || isBossDefeated(game.currentArea)) {
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
        const cost = Math.floor(upgrade.cost * Math.pow(1.15, level));
        const canAfford = game.player.gold >= cost;
        let nextDesc = upgrade.desc;
        const aspdLevel = game.player.aspdLevel || 0;
        const aspdCapped = upgrade.type === 'aspd' && aspdLevel >= 100;
        if (upgrade.type === 'aspd') {
            if (aspdCapped) {
                nextDesc = '⚡ 已满级 (10次/秒 伤害×10)';
            } else if (aspdLevel < 40) {
                // 前40级：只提升攻速
                const curSpeed = 1 + 0.005625 * aspdLevel * aspdLevel;
                const nextSpeed = 1 + 0.005625 * (aspdLevel + 1) * (aspdLevel + 1);
                const curInterval = Math.floor(1000 / curSpeed);
                const nextInterval = Math.floor(1000 / nextSpeed);
                nextDesc = `攻速 ${curSpeed.toFixed(2)}次/秒 → ${nextSpeed.toFixed(2)}次/秒 (间隔 ${curInterval}ms → ${nextInterval}ms)`;
            } else {
                // 41-100级：攻速已达上限，只提升伤害倍率
                const dmgLevel = aspdLevel - 40;
                const nextDmgLevel = dmgLevel + 1;
                const curDmg = (1 + 0.0025 * dmgLevel * dmgLevel).toFixed(1);
                const nextDmg = (1 + 0.0025 * nextDmgLevel * nextDmgLevel).toFixed(1);
                nextDesc = `伤害倍率 ×${curDmg} → ×${nextDmg} (攻速已达上限 10次/秒)`;
            }
        } else if (upgrade.type === 'crit') {
            if (game.player.crit < 1.0) {
                const nextCrit = Math.min(1.0, game.player.crit + upgrade.value);
                nextDesc = `暴击率 ${Math.round(game.player.crit*100)}% → ${Math.round(nextCrit*100)}%`;
            } else {
                const nextDmg = (game.player.critDmg || 2) + (upgrade.dmgValue || 0.2);
                nextDesc = `暴击伤害 ${Math.round((game.player.critDmg||2)*100)}% → ${Math.round(nextDmg*100)}%`;
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
        item.querySelector('.upgrade-name').textContent = `${upgrade.name} Lv.${level}`;
        item.querySelector('.upgrade-desc').textContent = nextDesc;
        item.querySelector('.upgrade-cost').textContent = aspdCapped ? '⚡ 已满级' : `💰 ${cost}`;
        item.querySelector('button').disabled = !canAfford || aspdCapped;
    });
}

function renderBag() {
    const container = document.getElementById('bagContent');
    if (!container) return;
    if (currentBagTab === 'treasure') renderBagTreasures(container);
    else if (currentBagTab === 'equipment') renderBagEquipments(container);
    else if (currentBagTab === 'item') renderBagItems(container);
}

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

    let html = '<div style="margin-bottom: 8px; display: flex; flex-wrap: wrap; gap: 4px; align-items: center;">';
    html += '<button class="btn btn-secondary treasure-filter-btn" data-filter="atk" onclick="toggleTreasureFilter(\'atk\')" style="padding: 2px 7px; font-size: 0.7em;">攻击</button>';
    html += '<button class="btn btn-secondary treasure-filter-btn" data-filter="def" onclick="toggleTreasureFilter(\'def\')" style="padding: 2px 7px; font-size: 0.7em;">防御</button>';
    html += '<button class="btn btn-secondary treasure-filter-btn" data-filter="maxHp" onclick="toggleTreasureFilter(\'maxHp\')" style="padding: 2px 7px; font-size: 0.7em;">生命</button>';
    html += '<button class="btn btn-secondary treasure-filter-btn" data-filter="crit" onclick="toggleTreasureFilter(\'crit\')" style="padding: 2px 7px; font-size: 0.7em;">暴击</button>';
    html += '<button class="btn btn-secondary treasure-filter-btn" data-filter="expBonus" onclick="toggleTreasureFilter(\'expBonus\')" style="padding: 2px 7px; font-size: 0.7em;">经验</button>';
    html += '<button class="btn btn-secondary treasure-filter-btn" data-filter="goldBonus" onclick="toggleTreasureFilter(\'goldBonus\')" style="padding: 2px 7px; font-size: 0.7em;">金币</button>';
    html += '<button class="btn btn-secondary treasure-filter-btn" data-filter="armorPenFlat" onclick="toggleTreasureFilter(\'armorPenFlat\')" style="padding: 2px 7px; font-size: 0.7em;">破甲(固)</button>';
    html += '<button class="btn btn-secondary treasure-filter-btn" data-filter="armorPenPercent" onclick="toggleTreasureFilter(\'armorPenPercent\')" style="padding: 2px 7px; font-size: 0.7em;">破甲(%)</button>';
    html += '<button class="btn btn-secondary treasure-filter-btn" id="upgradeableFilterBtn" data-filter="upgradeable" onclick="toggleTreasureFilter(\'upgradeable\')" style="padding: 2px 7px; font-size: 0.7em;">🔨 可强化</button>';
    html += '</div>';

    if (entries.length === 0) {
        html += '<div class="treasure-info" style="text-align:center;color:#666;padding:20px;">暂无符合条件的宝物</div>';
        container.innerHTML = html;
        return;
    }

    const totalCount = entries.reduce((sum, [_, d]) => sum + d.count, 0);
    const b = getTreasureBonuses();
    const texts = [];
    if (b.atk) texts.push(`攻击+${b.atk}`);
    if (b.def) texts.push(`防御+${b.def}`);
    if (b.maxHp) texts.push(`生命+${b.maxHp}`);
    if (b.crit) texts.push(`暴击+${Math.round(b.crit*100)}%`);
    if (b.expBonus) texts.push(`经验+${Math.round(b.expBonus*100)}%`);
    if (b.goldBonus) texts.push(`金币+${Math.round(b.goldBonus*100)}%`);
    if (b.armorPenFlat) texts.push(`破甲(固)+${b.armorPenFlat}`);
    if (b.armorPenPercent) texts.push(`破甲(%)+${Math.round(b.armorPenPercent*100)}%`);
    html += `<div class="treasure-info">共 ${totalCount} 件宝物 | ${texts.join(' | ')}</div>`;

    html += '<div class="treasure-grid">';
    entries.forEach(([tid, data]) => {
        const t = TREASURE_POOL.find(x => x.id === tid);
        if (!t) return;
        const rc = RARITY_CONFIG[t.rarity];
        const level = data.level || 1;
        const bonusPerLevel = t.value * 0.5;
        const currentValue = t.value + (level - 1) * bonusPerLevel;
        const canStrengthen = data.count > 1;
        const strengthenCost = Math.floor(t.sellPrice * 0.5 * level);
        const isLocked = data.locked || false;
        html += `
            <div class="treasure-item ${t.rarity}" ${isLocked ? 'style="border-color:rgba(233,69,96,0.6)"' : ''}>
                <div style="position: absolute; top: 5px; left: 8px; font-size: 1em; cursor: pointer;" onclick="toggleTreasureLock('${tid}')" title="${isLocked ? '点击解锁' : '点击锁定'}">${isLocked ? '🔒' : '🔓'}</div>
                <div class="treasure-count">×${data.count}</div>
                <div class="treasure-emoji">${t.emoji}</div>
                <div class="rarity-label ${t.rarity}">${rc.label}</div>
                <div class="treasure-name" style="color:${rc.color}">${t.name}</div>
                <div class="treasure-level">Lv.${level} | ${formatValue(t.stat, currentValue)}</div>
                <div class="treasure-stat">基础 ${formatValue(t.stat, t.value)}</div>
                <div class="treasure-actions">
                    <button class="btn btn-success" onclick="strengthenTreasure('${tid}')" ${!canStrengthen ? 'disabled' : ''} title="消耗1个+${strengthenCost}金币强化">🔨 强化</button>
                    <button class="btn btn-warning" onclick="sellTreasure('${tid}')" ${isLocked ? 'disabled' : ''}>💰 ${t.sellPrice}</button>
                </div>
            </div>
        `;
    });
    html += '</div>';
    container.innerHTML = html;
}

function renderBagEquipments(container) {
    const bag = game.player.equipmentBag || [];
    if (bag.length === 0) {
        container.innerHTML = '<div style="text-align:center;color:#666;padding:30px;">暂无未穿戴装备</div>';
        return;
    }

    const filterSlots = [
        { key: 'all', name: '全部', emoji: '📦' },
        { key: 'weapon', name: '武器', emoji: '⚔️' },
        { key: 'helmet', name: '帽子', emoji: '🪖' },
        { key: 'armor', name: '衣服', emoji: '👕' },
        { key: 'boots', name: '靴子', emoji: '👢' },
        { key: 'belt', name: '腰带', emoji: '🎗️' },
        { key: 'bracelet', name: '手镯', emoji: '💎' },
        { key: 'jade', name: '玉佩', emoji: '🏵️' },
    ];

    let html = '<div style="font-size:0.85em;color:#aaa;margin-bottom:8px;">点击穿戴或出售</div>';
    html += '<div style="display:flex;gap:6px;margin-bottom:10px;flex-wrap:wrap;">';
    filterSlots.forEach(slot => {
        const isActive = currentEquipmentFilter === slot.key;
        const activeStyle = isActive ? 'background:linear-gradient(45deg,#e94560,#ff6b6b);border-color:transparent;color:#fff;' : '';
        html += `<button class="btn btn-secondary" onclick="setEquipmentFilter('${slot.key}')" style="padding:2px 7px;font-size:0.7em;${activeStyle}">${slot.emoji} ${slot.name}</button>`;
    });
    html += '</div>';
    html += '<div class="equipment-bag">';

    let hasItem = false;
    bag.forEach((item, index) => {
        const eqDef = EQUIPMENT_POOL.find(e => e.id === item.id);
        if (!eqDef) return;
        if (currentEquipmentFilter !== 'all' && eqDef.slot !== currentEquipmentFilter) return;
        hasItem = true;
        const rc = RARITY_CONFIG[eqDef.rarity];
        const refine = item.refine || 0;
        const refineTag = refine > 0 ? `<span style="color:#ff9f43;font-size:0.7em;">+${refine}</span>` : '';
        html += `
            <div class="equipment-bag-item ${eqDef.rarity}">
                <div class="eq-bag-emoji">${eqDef.emoji}</div>
                <div class="eq-bag-name" style="color:${rc.color}">${eqDef.name} ${refineTag}</div>
                <div class="eq-bag-stat">${formatEqStat(eqDef)}</div>
                <div class="eq-bag-actions">
                    <button class="btn btn-success" onclick="equipItem(${index})">穿戴</button>
                    <button class="btn btn-warning" onclick="sellEquipment(${index})">💰 ${eqDef.sellPrice}</button>
                </div>
            </div>
        `;
    });
    html += '</div>';
    if (!hasItem) {
        html += '<div style="text-align:center;color:#666;padding:20px;">该分类下暂无装备</div>';
    }
    container.innerHTML = html;
}

function setEquipmentFilter(filter) {
    currentEquipmentFilter = filter;
    renderBag();
}

function renderBagItems(container) {
    let html = '';

    // 道具（商店购买）
    const items = game.player.items || {};
    const itemEntries = Object.entries(items).filter(([_, d]) => d && d.count > 0);
    if (itemEntries.length > 0) {
        html += '<div style="font-size:0.85em;color:#aaa;margin-bottom:8px;">消耗品</div>';
        html += '<div class="treasure-grid">';
        itemEntries.forEach(([itemId, data]) => {
            const itemDef = SHOP_ITEMS.find(i => i.id === itemId);
            if (!itemDef) return;
            html += `
                <div class="treasure-item" style="border-color:rgba(46,204,113,0.3);">
                    <div class="treasure-emoji">${itemDef.emoji}</div>
                    <div class="rarity-label" style="background:rgba(46,204,113,0.15);color:#2ecc71;">道具</div>
                    <div class="treasure-name" style="color:#2ecc71;">${itemDef.name} ×${data.count}</div>
                    <div class="treasure-stat">${itemDef.desc}</div>
                    <div class="treasure-actions">
                        <button class="btn btn-success" onclick="useItem('${itemDef.id}')">使用</button>
                        <button class="btn btn-warning" onclick="sellItem('${itemDef.id}')">💰 ${Math.floor(itemDef.basePrice * 0.3)}</button>
                    </div>
                </div>
            `;
        });
        html += '</div>';
    }

    // 技能书
    const books = game.player.skillBooks || {};
    const bookEntries = Object.entries(books).filter(([_, d]) => d && d.count > 0);
    if (bookEntries.length > 0) {
        html += '<div style="font-size:0.85em;color:#aaa;margin:15px 0 8px;">技能书</div>';
        html += '<div class="treasure-grid">';
        bookEntries.forEach(([bookId, data]) => {
            const book = SKILL_BOOKS.find(b => b.id === bookId);
            if (!book) return;
            const rc = RARITY_CONFIG[book.rarity];
            const isAppraised = data.appraised;
            html += `
                <div class="treasure-item ${book.rarity}">
                    <div class="treasure-emoji">${book.emoji}</div>
                    <div class="rarity-label ${book.rarity}">${rc.label}</div>
                    <div class="treasure-name" style="color:${rc.color}">${book.name} ×${data.count}</div>
                    <div class="treasure-stat">${isAppraised ? '🔍 已鉴定' : '❓ 未鉴定'}</div>
                    <div class="treasure-actions">
                        ${!isAppraised ? `<button class="btn btn-primary" onclick="appraiseBook('${book.id}')">鉴定</button>` : (game.player.skills[book.skillId]?.level > 0 ? '<span style="font-size:0.7em;color:#2ecc71">已学会</span>' : `<button class="btn btn-success" onclick="learnFromBook('${book.id}')">学习</button>`)}
                        <button class="btn btn-warning" onclick="sellSkillBook('${book.id}')">💰 ${book.sellPrice}</button>
                    </div>
                </div>
            `;
        });
        html += '</div>';
    }

    if (html === '') {
        html = '<div style="text-align:center;color:#666;padding:30px;">暂无道具</div>';
    }
    container.innerHTML = html;
}

function useItem(itemId) {
    const item = SHOP_ITEMS.find(i => i.id === itemId);
    if (!item) return;
    const playerItems = game.player.items || {};
    const data = playerItems[itemId];
    if (!data || data.count <= 0) { log('道具数量不足！', 'log-damage'); return; }

    data.count--;
    if (data.count <= 0) delete playerItems[itemId];

    const now = Date.now();
    switch (item.type) {
        case 'permanent_atk': {
            game.player.atk += item.value;
            log(`💠 使用了${item.name}，永久攻击力+${item.value}！`, 'log-skill');
            break;
        }
        case 'heal': {
            const stats = getPlayerStats();
            const healAmount = Math.floor(stats.maxHp * item.value);
            game.player.hp = Math.min(stats.maxHp, game.player.hp + healAmount);
            log(`🩹 使用了${item.name}，恢复 ${healAmount} 点生命值`, 'log-heal');
            showNotification(`🩹 ${item.name}生效！`);
            break;
        }
        case 'mp': {
            const stats = getPlayerStats();
            const mpAmount = Math.floor(stats.maxMp * item.value);
            game.player.mp = Math.min(stats.maxMp, game.player.mp + mpAmount);
            log(`💧 使用了${item.name}，恢复 ${mpAmount} 点魔力值`, 'log-heal');
            showNotification(`💧 ${item.name}生效！`);
            break;
        }
        case 'buff_exp': {
            game.player.buffs = game.player.buffs || {};
            game.player.buffs.expBonus = { value: item.value, endTime: now + item.duration };
            const mins = Math.floor(item.duration / 60000);
            log(`📜 使用了${item.name}，经验加成+${Math.round(item.value * 100)}%，持续${mins}分钟！`, 'log-epic');
            showNotification(`📜 经验加成+${Math.round(item.value * 100)}%，持续${mins}分钟！`);
            break;
        }
        case 'buff_atk': {
            game.player.buffs = game.player.buffs || {};
            game.player.buffs.atkBonus = { value: item.value, endTime: now + item.duration };
            const mins = Math.floor(item.duration / 60000);
            log(`⚔️ 使用了${item.name}，攻击力+${Math.round(item.value * 100)}%，持续${mins}分钟！`, 'log-epic');
            showNotification(`⚔️ 攻击力+${Math.round(item.value * 100)}%，持续${mins}分钟！`);
            break;
        }
        case 'buff_def': {
            game.player.buffs = game.player.buffs || {};
            game.player.buffs.defBonus = { value: item.value, endTime: now + item.duration };
            const mins = Math.floor(item.duration / 60000);
            log(`🛡️ 使用了${item.name}，防御力+${Math.round(item.value * 100)}%，持续${mins}分钟！`, 'log-epic');
            showNotification(`🛡️ 防御力+${Math.round(item.value * 100)}%，持续${mins}分钟！`);
            break;
        }
    }

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
    log(`💰 出售了 ${item.emoji} ${item.name}，获得 ${sellPrice} 金币`, 'log-loot');
    renderBag();
    updateUI();
}

function getActiveBuffs() {
    const buffs = game.player.buffs || {};
    const now = Date.now();
    const active = [];
    if (buffs.expBonus && buffs.expBonus.endTime > now) active.push({ name: '经验加成', emoji: '📜', value: buffs.expBonus.value, endTime: buffs.expBonus.endTime });
    if (buffs.atkBonus && buffs.atkBonus.endTime > now) active.push({ name: '攻击加成', emoji: '⚔️', value: buffs.atkBonus.value, endTime: buffs.atkBonus.endTime });
    if (buffs.defBonus && buffs.defBonus.endTime > now) active.push({ name: '防御加成', emoji: '🛡️', value: buffs.defBonus.value, endTime: buffs.defBonus.endTime });
    if (buffs.shield && buffs.shield.endTime > now) active.push({ name: '护盾', emoji: '🛡️', value: buffs.shield.defBonus, endTime: buffs.shield.endTime });
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
            const names = { expBonus: '📜 经验加成', atkBonus: '⚔️ 攻击加成', defBonus: '🛡️ 防御加成', shield: '🛡️ 护盾' };
            log(`${names[key] || key} 效果已消失`, 'log-death');
        }
    }
    return expired;
}

function formatValue(stat, value) {
    const names = { atk: '攻击力', def: '防御力', maxHp: '生命', crit: '暴击率', expBonus: '经验加成', goldBonus: '金币加成', armorPenFlat: '破甲(固定)', armorPenPercent: '破甲(%)' };
    const name = names[stat] || stat;
    if (stat === 'crit' || stat === 'expBonus' || stat === 'goldBonus' || stat === 'armorPenPercent') return `${name}+${Math.round(value*100)}%`;
    return `${name}+${Math.floor(value)}`;
}

function formatEqStat(eqDef) {
    const texts = [];
    if (eqDef.atk) texts.push(`攻击+${eqDef.atk}`);
    if (eqDef.def) texts.push(`防御+${eqDef.def}`);
    if (eqDef.maxHp) texts.push(`生命+${eqDef.maxHp}`);
    if (eqDef.aspd) texts.push(`攻速+${eqDef.aspd}`);
    if (eqDef.crit) texts.push(`暴击+${Math.round(eqDef.crit*100)}%`);
    if (eqDef.vamp) texts.push(`吸血+${Math.round(eqDef.vamp*100)}%`);
    if (eqDef.expBonus) texts.push(`经验+${Math.round(eqDef.expBonus*100)}%`);
    if (eqDef.spi) texts.push(`精神+${eqDef.spi}`);
    return texts.join(' ');
}

function renderEquipments() {
    const grid = document.getElementById('equipmentGrid');
    const info = document.getElementById('equipmentInfo');
    if (!grid) return;
    const eqs = game.player.equipments || {};
    let html = '';
    const eqBonuses = getEquipmentBonuses();
    const bonusTexts = [];
    if (eqBonuses.atk) bonusTexts.push(`攻击+${eqBonuses.atk.toFixed(0)}`);
    if (eqBonuses.def) bonusTexts.push(`防御+${eqBonuses.def.toFixed(0)}`);
    if (eqBonuses.maxHp) bonusTexts.push(`生命+${eqBonuses.maxHp.toFixed(0)}`);
    if (eqBonuses.aspd) bonusTexts.push(`攻速+${eqBonuses.aspd.toFixed(0)}`);
    if (eqBonuses.crit) bonusTexts.push(`暴击+${Math.round(eqBonuses.crit*100)}%`);
    if (eqBonuses.vamp) bonusTexts.push(`吸血+${Math.round(eqBonuses.vamp*100)}%`);
    if (eqBonuses.expBonus) bonusTexts.push(`经验+${Math.round(eqBonuses.expBonus*100)}%`);
    if (eqBonuses.spi) bonusTexts.push(`精神+${eqBonuses.spi.toFixed(0)}`);
    info.textContent = bonusTexts.length > 0 ? `装备加成: ${bonusTexts.join(' | ')}` : '暂无装备加成';

    for (const [slotKey, slotDef] of Object.entries(EQUIPMENT_SLOTS)) {
        const data = eqs[slotKey];
        if (data) {
            const eqDef = EQUIPMENT_POOL.find(e => e.id === data.id);
            if (eqDef) {
                const rc = RARITY_CONFIG[eqDef.rarity];
                const refine = data.refine || 0;
                const refineTag = refine > 0 ? `<span style="color:#ff9f43;font-size:0.65em;">+${refine}</span>` : '';
                html += `
                    <div class="equipment-slot ${eqDef.rarity}" onclick="unequipItem('${slotKey}')" title="点击卸下">
                        <div class="slot-emoji">${eqDef.emoji}</div>
                        <div class="eq-name" style="color:${rc.color}">${eqDef.name} ${refineTag}</div>
                        <div class="eq-stat">${formatEqStat(eqDef)}</div>
                    </div>
                `;
                continue;
            }
        }
        html += `
            <div class="equipment-slot empty">
                <div class="slot-emoji" style="opacity:0.4">${slotDef.emoji}</div>
                <div class="slot-name">${slotDef.name}</div>
            </div>
        `;
    }
    grid.innerHTML = html;
}

function updateUI() {
    const stats = getPlayerStats();
    document.getElementById('level').textContent = game.player.level;
    document.getElementById('hpBar').style.width = (game.player.hp / stats.maxHp * 100) + '%';
    document.getElementById('hpText').textContent = `${Math.floor(game.player.hp)}/${Math.floor(stats.maxHp)}`;
    document.getElementById('expBar').style.width = (game.player.exp / game.player.maxExp * 100) + '%';
    document.getElementById('expText').textContent = `${game.player.exp}/${game.player.maxExp}`;
    document.getElementById('mpBar').style.width = (game.player.mp / stats.maxMp * 100) + '%';
    document.getElementById('mpText').textContent = `${Math.floor(game.player.mp)}/${Math.floor(stats.maxMp)}`;
    document.getElementById('atk').textContent = `${game.player.atk} (+${stats.atk - game.player.atk})`;
    document.getElementById('def').textContent = `${game.player.def} (+${stats.def - game.player.def})`;
    document.getElementById('maxHp').textContent = `${game.player.maxHp} (+${stats.maxHp - game.player.maxHp})`;
    document.getElementById('spi').textContent = game.player.spi;
    const cappedAspd = Math.min(1000 / stats.aspd, MAX_ATK_SPEED);
    let aspdText = `${cappedAspd.toFixed(1)}/s`;
    if (stats.speedMultiplier > 1.0) aspdText += ` (×${stats.speedMultiplier.toFixed(1)} 伤害)`;
    document.getElementById('aspd').textContent = aspdText;
    document.getElementById('crit').textContent = `${Math.round(stats.crit*100)}% (${Math.round(game.player.crit*100)}% + ${Math.round((stats.crit-game.player.crit)*100)}%)`;
    document.getElementById('critDmg').textContent = `${Math.round(stats.critDmg*100)}%`;
    document.getElementById('vamp').textContent = `${Math.round(stats.vamp*100)}% (${Math.round(game.player.vamp*100)}% + ${Math.round((stats.vamp-game.player.vamp)*100)}%)`;
    document.getElementById('expBonus').textContent = `${Math.round(stats.expBonus*100)}%`;
    document.getElementById('gold').textContent = game.player.gold;
    document.getElementById('kills').textContent = game.player.kills;
    document.getElementById('armorPenFlat').textContent = stats.armorPenFlat;
    document.getElementById('armorPenPercent').textContent = `${Math.round(stats.armorPenPercent*100)}%`;
    document.getElementById('battleLevel').textContent = game.player.level;

    const power = Math.floor((stats.atk * 2 + stats.def * 1.5 + stats.maxHp * 0.5 + stats.crit * 100 + stats.critDmg * 20 + stats.armorPenFlat * 5 + stats.armorPenPercent * 300 + stats.spi * 5) * stats.speedMultiplier);
    document.getElementById('power').textContent = power;

    // 更新buff显示
    const buffPanel = document.getElementById('buffPanel');
    const activeBuffs = getActiveBuffs();
    if (activeBuffs.length > 0 && buffPanel) {
        let buffHtml = '';
        activeBuffs.forEach(buff => {
            const remaining = Math.max(0, Math.ceil((buff.endTime - Date.now()) / 1000));
            const mins = Math.floor(remaining / 60);
            const secs = remaining % 60;
            const timeStr = mins > 0 ? `${mins}分${secs}秒` : `${secs}秒`;
            buffHtml += `<span style="display:inline-block;background:rgba(46,204,113,0.15);color:#2ecc71;padding:2px 8px;border-radius:10px;font-size:0.7em;margin:2px;">${buff.emoji} ${buff.name} +${Math.round(buff.value * 100)}% (${timeStr})</span>`;
        });
        buffPanel.innerHTML = buffHtml;
        buffPanel.style.display = 'block';
    } else if (buffPanel) {
        buffPanel.style.display = 'none';
    }

    updateEnemyUI();
    renderUpgrades();
    renderBag();
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
    document.getElementById('enemyName').textContent = nameText;
    document.getElementById('enemyName').style.color = game.enemy.isBoss ? '#ff4757' : game.enemy.isElite ? '#a55eea' : '#fff';
    document.getElementById('enemyHpBar').style.width = (game.enemy.hp / game.enemy.maxHp * 100) + '%';
    document.getElementById('enemyHpText').textContent = `${Math.floor(game.enemy.hp)}/${game.enemy.maxHp}`;
    document.title = `勇者挂机传说 - ${game.enemy.emoji} ${nameText}`;
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
    localStorage.setItem(SAVE_KEY, JSON.stringify({ player: game.player, currentArea: game.currentArea, bossDefeated: game.bossDefeated, bossFled: game.bossFled, clues: game.clues, fightingBoss: game.fightingBoss, autoStrengthen: game.autoStrengthen, savedAt: Date.now() }));
});

// ========== 技能系统 ==========

function addSkillBook(book) {
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
    return Math.floor(skill.baseDmg * levelMult * spiMult);
}

function castSkill(skillId) {
    const skill = SKILLS.find(s => s.id === skillId);
    if (!skill || !game.enemy || game.enemy.hp <= 0 || game.player.hp <= 0) return;
    const skillData = game.player.skills[skillId];
    if (!skillData) return;

    const now = Date.now();
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
        const healAmount = finalDmg;
        game.player.hp = Math.min(game.player.maxHp + getTreasureBonuses().maxHp, game.player.hp + healAmount);
        log(`💚 ${skill.emoji} ${skill.name} 恢复了 ${healAmount} 点生命`, 'log-heal');
    } else if (skill.type === 'buff') {
        const buffDef = Math.floor(finalDmg);
        game.player.buffs = game.player.buffs || {};
        game.player.buffs.shield = { endTime: now + (skill.buffDuration || 10000), defBonus: buffDef };
        log(`🛡️ ${skill.emoji} ${skill.name} 获得 ${buffDef} 点临时防御（10秒）`, 'log-skill');
    } else {
        // damage / damage_lifesteal / dot
        game.enemy.hp = Math.max(0, game.enemy.hp - finalDmg);
        let logMsg = `${skill.emoji} ${skill.name} 对${enemyName}造成 ${finalDmg} 点${elInfo.name}伤害`;
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
            log(`🩸 暗影箭吸血恢复了 ${heal} 点生命`, 'log-heal');
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
    const sortedSkills = Object.entries(game.player.skills || {})
        .filter(([_, d]) => d && d.level > 0)
        .map(([sid, d]) => {
            const skill = SKILLS.find(s => s.id === sid);
            return { skill, data: d };
        })
        .filter(({ skill, data }) => skill && data.cooldownEnd <= now && game.player.mp >= skill.mpCost && skill.type.startsWith('damage'))
        .sort((a, b) => calculateSkillDamage(b.skill, b.data.level) - calculateSkillDamage(a.skill, a.data.level));

    if (sortedSkills.length > 0) {
        castSkill(sortedSkills[0].skill.id);
    }
}

function updateSkillButtons() {
    const container = document.getElementById('skillBar');
    if (!container) return;
    container.innerHTML = '';
    const now = Date.now();
    const skills = game.player.skills || {};

    Object.entries(skills).forEach(([skillId, data]) => {
        if (!data || data.level <= 0) return;
        const skill = SKILLS.find(s => s.id === skillId);
        if (!skill) return;
        const cdRemaining = Math.max(0, data.cooldownEnd - now);
        const cdPercent = skill.cooldown > 0 ? (cdRemaining / skill.cooldown) * 100 : 0;
        const canUse = cdRemaining <= 0 && game.player.mp >= skill.mpCost;
        const elInfo = ELEMENTS[skill.element];

        const btn = document.createElement('button');
        btn.className = 'skill-btn';
        btn.disabled = !canUse;
        btn.style.borderColor = elInfo.color;
        btn.innerHTML = `
            ${skill.emoji} ${skill.name}
            <span class="skill-mp">💧${skill.mpCost}</span>
            ${cdRemaining > 0 ? `<span class="skill-cd" style="width: ${cdPercent}%"></span>` : ''}
        `;
        btn.onclick = () => castSkill(skillId);
        container.appendChild(btn);
    });

    if (container.children.length === 0) {
        container.innerHTML = '<span style="color: #666; font-size: 0.85em;">前往主城学习技能</span>';
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
    updateUI();
}

function sellEquipment(bagIndex) {
    const bag = game.player.equipmentBag || [];
    if (bagIndex < 0 || bagIndex >= bag.length) return;
    const item = bag[bagIndex];
    const eqDef = EQUIPMENT_POOL.find(e => e.id === item.id);
    if (!eqDef) return;
    bag.splice(bagIndex, 1);
    game.player.gold += eqDef.sellPrice;
    log(`💰 出售了 ${eqDef.emoji} ${eqDef.name}，获得 ${eqDef.sellPrice} 金币`, 'log-loot');
    updateUI();
}

// ========== 主城/NPC系统 ==========
let currentNpcTab = 'learn';

function showNpcView() {
    game.inCity = true;
    stopAutoBattle();
    document.getElementById('battleView').style.display = 'none';
    document.getElementById('npcView').style.display = 'block';
    document.getElementById('npcSelectView').style.display = 'block';
    document.getElementById('npcMentorView').style.display = 'none';
    document.getElementById('npcAppraiserView').style.display = 'none';
    document.getElementById('npcBlacksmithView').style.display = 'none';
    document.getElementById('npcShopView').style.display = 'none';
    renderAreas();
    updateEnemyUI();
}

function showMentorView() {
    document.getElementById('npcSelectView').style.display = 'none';
    document.getElementById('npcMentorView').style.display = 'block';
    document.getElementById('npcAppraiserView').style.display = 'none';
    switchNpcTab('skills');
}

function showAppraiserView() {
    document.getElementById('npcSelectView').style.display = 'none';
    document.getElementById('npcMentorView').style.display = 'none';
    document.getElementById('npcAppraiserView').style.display = 'block';
    renderAppraiserContent();
}

function showNpcSelect() {
    document.getElementById('npcSelectView').style.display = 'block';
    document.getElementById('npcMentorView').style.display = 'none';
    document.getElementById('npcAppraiserView').style.display = 'none';
    document.getElementById('npcBlacksmithView').style.display = 'none';
    document.getElementById('npcShopView').style.display = 'none';
}

function showBlacksmithView() {
    document.getElementById('npcSelectView').style.display = 'none';
    document.getElementById('npcMentorView').style.display = 'none';
    document.getElementById('npcAppraiserView').style.display = 'none';
    document.getElementById('npcBlacksmithView').style.display = 'block';
    document.getElementById('npcShopView').style.display = 'none';
    switchBlacksmithTab('forge');
}

function showShopView() {
    document.getElementById('npcSelectView').style.display = 'none';
    document.getElementById('npcMentorView').style.display = 'none';
    document.getElementById('npcAppraiserView').style.display = 'none';
    document.getElementById('npcBlacksmithView').style.display = 'none';
    document.getElementById('npcShopView').style.display = 'block';
    renderShopContent();
}

function showBattleView() {
    game.inCity = false;
    document.getElementById('npcView').style.display = 'none';
    document.getElementById('battleView').style.display = 'block';
    renderAreas();
    updateEnemyUI();
}

function switchNpcTab(tab) {
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

function renderAppraiserContent() {
    const container = document.getElementById('appraiserContent');
    renderAppraiseBooks(container);
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
    html += '<div style="font-size:1.1em;margin-bottom:10px;">当前打造费用: <span style="color:#f1c40f;font-weight:bold;">💰 ' + forgeCost + '</span></div>';
    html += '<div style="color:#888;font-size:0.85em;margin-bottom:20px;">等级越高，打造出的装备越好</div>';
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
    html += '可能获得: ' + possibleRarities.map(r => RARITY_CONFIG[r].label).join(' / ') + '</div>';

    container.innerHTML = html;
}

function forgeEquipment() {
    const playerLevel = game.player.level;
    const levelMult = 1 + (playerLevel - 1) * 0.15;
    const forgeCost = Math.floor(FORGE_BASE_COST * levelMult);
    if (game.player.gold < forgeCost) { log('金币不足，无法打造装备！', 'log-damage'); return; }

    game.player.gold -= forgeCost;

    // 根据等级决定品质
    const rarityWeights = [];
    rarityWeights.push({ rarity: 'common', weight: Math.max(10, 100 - playerLevel * 3) });
    if (playerLevel >= 5) rarityWeights.push({ rarity: 'rare', weight: Math.min(50, playerLevel * 2) });
    if (playerLevel >= 15) rarityWeights.push({ rarity: 'epic', weight: Math.min(30, (playerLevel - 10) * 1.5) });
    if (playerLevel >= 30) rarityWeights.push({ rarity: 'legendary', weight: Math.min(15, (playerLevel - 25)) });

    const totalWeight = rarityWeights.reduce((a, b) => a + b.weight, 0);
    let roll = Math.random() * totalWeight;
    let selectedRarity = 'common';
    for (const rw of rarityWeights) {
        roll -= rw.weight;
        if (roll <= 0) { selectedRarity = rw.rarity; break; }
    }

    const pool = EQUIPMENT_POOL.filter(e => e.rarity === selectedRarity);
    const eqDef = pool[Math.floor(Math.random() * pool.length)];
    if (!eqDef) { log('打造失败，请重试', 'log-damage'); return; }

    const forgedItem = { id: eqDef.id };
    game.player.equipmentBag = game.player.equipmentBag || [];
    game.player.equipmentBag.push(forgedItem);

    const rc = RARITY_CONFIG[eqDef.rarity];
    log(`⚒️ 铁匠打造了 [${rc.label}] ${eqDef.emoji} ${eqDef.name}！`, 'log-epic');
    showNotification(`⚒️ 打造了${rc.label}装备：${eqDef.name}！`);
    renderBlacksmithContent();
    updateUI();
}

function renderBlacksmithRefine(container) {
    const bag = game.player.equipmentBag || [];
    const stoneCount = (game.player.items && game.player.items['enhance_stone']) ? game.player.items['enhance_stone'].count : 0;
    if (bag.length === 0) {
        container.innerHTML = '<div style="text-align:center;color:#666;padding:30px;">背包中没有装备可以锻造</div>';
        return;
    }

    const filterSlots = [
        { key: 'all', name: '全部', emoji: '📦' },
        { key: 'weapon', name: '武器', emoji: '⚔️' },
        { key: 'helmet', name: '帽子', emoji: '🪖' },
        { key: 'armor', name: '衣服', emoji: '👕' },
        { key: 'boots', name: '靴子', emoji: '👢' },
        { key: 'belt', name: '腰带', emoji: '🎗️' },
        { key: 'bracelet', name: '手镯', emoji: '💎' },
        { key: 'jade', name: '玉佩', emoji: '🏵️' },
    ];

    let html = '<div style="text-align:center;color:#aaa;margin-bottom:15px;font-size:0.9em;">选择装备进行锻造强化，成功提升属性，失败装备消失</div>';
    html += `<div style="text-align:center;color:#f1c40f;margin-bottom:12px;font-size:0.85em;">🔮 强化石 ×${stoneCount}（每个+5%成功率，最高100%）</div>`;
    html += '<div style="display:flex;gap:6px;margin-bottom:10px;flex-wrap:wrap;">';
    filterSlots.forEach(slot => {
        const isActive = currentEquipmentFilter === slot.key;
        const activeStyle = isActive ? 'background:linear-gradient(45deg,#e94560,#ff6b6b);border-color:transparent;color:#fff;' : '';
        html += `<button class="btn btn-secondary" onclick="setEquipmentFilter('${slot.key}')" style="padding:2px 7px;font-size:0.7em;${activeStyle}">${slot.emoji} ${slot.name}</button>`;
    });
    html += '</div>';
    html += '<div class="equipment-bag">';

    let hasItem = false;
    bag.forEach((item, index) => {
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
                <div class="eq-bag-stat">${formatEqStat(eqDef)}</div>
                <div style="font-size:0.65em;color:#f1c40f;margin-bottom:3px;">锻造+${refineLevel}</div>
                <div style="font-size:0.65em;color:#aaa;margin-bottom:4px;">💰 ${refineCost} | 基础成功率 ${baseRate}%</div>
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
        html += '<div style="text-align:center;color:#666;padding:20px;">该分类下暂无装备</div>';
    }
    container.innerHTML = html;
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
        bag.splice(bagIndex, 1);
        log(`💥 锻造失败！${eqDef.emoji} ${eqDef.name} 在火焰中化为灰烬...`, 'log-death');
        showNotification('💥 锻造失败，装备已损毁');
    }

    renderBlacksmithContent();
    updateUI();
}

// ========== 商店系统 ==========
function renderShopContent() {
    const container = document.getElementById('shopContent');
    const playerLevel = game.player.level;
    const levelMult = 1 + (playerLevel - 1) * 0.1;

    let html = '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:12px;">';
    SHOP_ITEMS.forEach(item => {
        if (item.dropOnly) return;
        const price = Math.floor(item.basePrice * levelMult);
        const canAfford = game.player.gold >= price;
        html += `
            <div style="background:rgba(255,255,255,0.03);border-radius:10px;padding:12px;text-align:center;border:1px solid rgba(255,255,255,0.08);">
                <div style="font-size:2em;margin-bottom:5px;">${item.emoji}</div>
                <div style="font-weight:bold;font-size:0.9em;margin-bottom:4px;">${item.name}</div>
                <div style="font-size:0.75em;color:#aaa;margin-bottom:8px;">${item.desc}</div>
                <div style="color:#f1c40f;font-weight:bold;font-size:0.9em;margin-bottom:8px;">💰 ${price}</div>
                <button class="btn btn-success" onclick="buyShopItem('${item.id}')" ${!canAfford ? 'disabled' : ''} style="padding:4px 12px;font-size:0.8em;">购买</button>
            </div>
        `;
    });
    html += '</div>';
    container.innerHTML = html;
}

function buyShopItem(itemId) {
    const item = SHOP_ITEMS.find(i => i.id === itemId);
    if (!item) return;
    const playerLevel = game.player.level;
    const levelMult = 1 + (playerLevel - 1) * 0.1;
    const price = Math.floor(item.basePrice * levelMult);

    if (game.player.gold < price) { log('金币不足！', 'log-damage'); return; }

    game.player.gold -= price;

    // 存入背包
    game.player.items = game.player.items || {};
    if (!game.player.items[item.id]) game.player.items[item.id] = { count: 0 };
    game.player.items[item.id].count++;

    log(`🏪 购买了 ${item.emoji} ${item.name} ×1`, 'log-loot');
    showNotification(`🏪 购买成功！${item.name}`);
    renderShopContent();
    updateUI();
}

function renderSkillList(container) {
    let html = '';

    // 基础技能：未学会的可学习，已学会的可升级
    const basicSkills = SKILLS.filter(s => s.isBasic);
    if (basicSkills.length > 0) {
        html += '<div style="font-size:0.85em;color:#aaa;margin:10px 0 5px;border-bottom:1px solid rgba(255,255,255,0.1);padding-bottom:5px;">基础技能</div>';
        basicSkills.forEach(skill => {
            const learned = game.player.skills[skill.id];
            const isLearned = learned && learned.level > 0;
            const elInfo = ELEMENTS[skill.element];

            let actionHtml = '';
            if (!isLearned) {
                const canAfford = game.player.gold >= skill.learnCost;
                actionHtml = `<span class="skill-list-cost">💰 ${skill.learnCost}</span><button class="btn btn-primary" onclick="learnSkill('${skill.id}')" ${!canAfford ? 'disabled' : ''}>学习</button>`;
            } else {
                const isMax = learned.level >= skill.maxLevel;
                const cost = Math.floor(skill.upgradeCost * Math.pow(1.3, learned.level - 1));
                const canAfford = game.player.gold >= cost;
                const nextDmg = calculateSkillDamage(skill, learned.level + 1);
                actionHtml = isMax ? '<span style="color:#f1c40f;margin-right:10px">已满级</span>' : `<span class="skill-list-cost">💰 ${cost}</span><button class="btn btn-primary" onclick="upgradeSkill('${skill.id}')" ${!canAfford ? 'disabled' : ''}>升级</button>`;
            }

            html += `
                <div class="skill-list-item">
                    <div class="skill-list-info">
                        <div class="skill-list-name" style="color: ${elInfo.color}">${skill.emoji} ${skill.name} ${isLearned ? `Lv.${learned.level}` : '<span style="color:#666">[未学会]</span>'}</div>
                        <div class="skill-list-desc">${skill.desc}</div>
                        <div class="skill-list-meta">${elInfo.emoji} ${elInfo.name}属性 | 💧消耗${skill.mpCost} | ⏱️冷却${skill.cooldown/1000}秒 | ${isLearned ? `当前伤害: ${calculateSkillDamage(skill, learned.level)}` : `基础伤害: ${skill.baseDmg}`}</div>
                    </div>
                    <div style="display:flex;align-items:center;">
                        ${actionHtml}
                    </div>
                </div>
            `;
        });
    }

    // 高阶技能：只显示已学会的（可升级）
    const learnedAdvanced = Object.entries(game.player.skills || {}).filter(([sid, d]) => d && d.level > 0 && !SKILLS.find(s => s.id === sid)?.isBasic);
    if (learnedAdvanced.length > 0) {
        html += '<div style="font-size:0.85em;color:#aaa;margin:15px 0 5px;border-bottom:1px solid rgba(255,255,255,0.1);padding-bottom:5px;">高阶技能</div>';
        learnedAdvanced.forEach(([skillId, data]) => {
            const skill = SKILLS.find(s => s.id === skillId);
            if (!skill) return;
            const isMax = data.level >= skill.maxLevel;
            const cost = Math.floor(skill.upgradeCost * Math.pow(1.3, data.level - 1));
            const canAfford = game.player.gold >= cost;
            const elInfo = ELEMENTS[skill.element];

            html += `
                <div class="skill-list-item">
                    <div class="skill-list-info">
                        <div class="skill-list-name" style="color: ${elInfo.color}">${skill.emoji} ${skill.name} Lv.${data.level}${isMax ? ' <span style="color:#f1c40f">[满级]</span>' : ''}</div>
                        <div class="skill-list-desc">${skill.desc}</div>
                        <div class="skill-list-meta">当前伤害: ${calculateSkillDamage(skill, data.level)} | ${!isMax ? `升级后: ${calculateSkillDamage(skill, data.level + 1)}` : '已达最高等级'}</div>
                    </div>
                    <div style="display:flex;align-items:center;">
                        ${isMax ? '<span style="color:#f1c40f;margin-right:10px">已满级</span>' : `<span class="skill-list-cost">💰 ${cost}</span><button class="btn btn-primary" onclick="upgradeSkill('${skill.id}')" ${!canAfford ? 'disabled' : ''}>升级</button>`}
                    </div>
                </div>
            `;
        });
    }

    container.innerHTML = html || '<div style="text-align:center;color:#666;padding:30px">暂无可操作技能</div>';
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
                    <div class="skill-list-meta">${rc.label}品质 | 出售价: ${book.sellPrice}金币</div>
                </div>
                <div style="display:flex;align-items:center;gap:6px;">
                    ${!isAppraised
                        ? `<span class="skill-list-cost">💰 ${appraisalCost}</span><button class="btn btn-primary" onclick="appraiseBook('${book.id}')" ${!canAfford ? 'disabled' : ''}>鉴定</button>`
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
    container.innerHTML = `
        <div class="train-panel">
            <div class="train-desc">通过冥想修炼提升精神力，增加魔力上限和技能伤害</div>
            <div class="train-stat">当前精神: <span style="color:#e94560;font-size:1.3em">${game.player.spi}</span> | 当前等级: <span style="color:#f1c40f">${level}</span></div>
            <div class="train-stat">最大魔力: ${game.player.maxMp} | 每次修炼: 精神+2，魔力上限+6</div>
            <button class="btn btn-primary" onclick="trainSpirit()" ${!canAfford ? 'disabled' : ''} style="font-size:1.1em;padding:10px 24px">
                🧘 修炼精神 (💰 ${cost})
            </button>
        </div>
    `;
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
    renderNpcContent();
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
    log(`💰 出售了 ${book.emoji} ${book.name}，获得 ${book.sellPrice} 金币`, 'log-loot');
    renderNpcContent();
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
        if (document.getElementById('npcView').style.display === 'block') {
            updateUI();
        }
    }
}, 2000);

init();
