<?php
declare(strict_types=1);

namespace App\Game;

/**
 * 默认存档生成器（与 js/game.js 中 createDefaultSave 保持一致）
 */
final class Defaults
{
    public static function player(): array
    {
        return [
            'level' => 1, 'exp' => 0, 'maxExp' => 100,
            'hp' => 100, 'maxHp' => 100,
            'atk' => 10, 'def' => 5, 'aspd' => 1000,
            'gold' => 0, 'kills' => 0,
            'crit' => 0, 'critDmg' => 2, 'vamp' => 0,
            'spi' => 10, 'maxMp' => 50, 'mp' => 50,
            'treasures' => (object) [],
            'atkLevel' => 0, 'defLevel' => 0, 'hpLevel' => 0,
            'aspdLevel' => 0, 'critLevel' => 0, 'vampLevel' => 0, 'spiLevel' => 0,
            'skills' => (object) [],
            'skillBooks' => (object) [],
            'passives' => (object) [],
            'buffs' => (object) [],
            'equipments' => (object) [],
            'equipmentBag' => [],
            // 抗性
            'earthRes' => 0, 'poisonRes' => 0, 'lightningRes' => 0,
            'voidRes' => 0, 'chaosRes' => 0, 'fireRes' => 0,
            'tenacity' => 0,
            'counterState' => ['voidShield' => false, 'chaosReflux' => false, 'stunImmune' => 0],
            'settledMode' => false,
            'debuffs' => (object) [],
        ];
    }

    public static function world(): array
    {
        return [
            'currentArea' => 0,
            'bossDefeated' => array_fill(0, 15, false),
            'bossFled' => array_fill(0, 15, false),
            'clues' => [3 => 0, 6 => 0, 9 => 0, 14 => 0],
            'fightingBoss' => false,
            'autoBattle' => false,
            'autoStrengthen' => false,
            'autoRecover' => false,
            'autoSell' => [
                'equipment' => false,
                'skillBooks' => false,
                'equipMaxRarity' => 'rare',
                'bookMaxRarity' => 'rare',
            ],
            'inCity' => true,
            'lastBattleEndTime' => null,
        ];
    }
}
