<?php
declare(strict_types=1);

namespace App\Game\Npc;

use App\Game\Constants;
use App\Http\HttpException;

/**
 * 鉴定师：装备 / 技能书鉴定
 *
 * 费用 = 物品 sellPrice × 0.5 ~ 0.8
 * 鉴定后装备 appraised = true（可穿戴 / 锻造）；技能书 appraised = true（可学习）
 */
final class AppraiserService
{
    /**
     * 鉴定装备
     *
     * @return array{player:array, cost:int}
     */
    public static function appraiseEquipment(array $player, int $bagIndex): array
    {
        $bag = $player['equipmentBag'] ?? [];
        if ($bagIndex < 0 || $bagIndex >= count($bag)) {
            throw HttpException::badRequest('invalid_bag_index');
        }
        $item = $bag[$bagIndex];
        if (!empty($item['appraised'])) {
            throw HttpException::conflict('already_appraised');
        }
        $eqDef = Constants::findEquipment((string) $item['id']);
        if (!$eqDef) throw HttpException::badRequest('invalid_equipment');

        $cost = self::calcCost((int) ($eqDef['sellPrice'] ?? 30));
        if (($player['gold'] ?? 0) < $cost) {
            throw HttpException::badRequest('insufficient_gold', ['need' => $cost]);
        }
        $player['gold'] -= $cost;
        $bag[$bagIndex]['appraised'] = true;
        $player['equipmentBag'] = $bag;
        return ['player' => $player, 'cost' => $cost];
    }

    /**
     * 鉴定技能书：揭示 skillId
     */
    public static function appraiseSkillBook(array $player, string $bookId): array
    {
        $entry = ($player['skillBooks'] ?? [])[$bookId] ?? null;
        if (!$entry) throw HttpException::badRequest('skill_book_not_in_bag');
        if (!empty($entry['appraised'])) throw HttpException::conflict('already_appraised');

        $bookDef = Constants::findSkillBook($bookId);
        if (!$bookDef) throw HttpException::badRequest('invalid_skill_book');

        $cost = self::calcCost((int) ($bookDef['sellPrice'] ?? 100));
        if (($player['gold'] ?? 0) < $cost) {
            throw HttpException::badRequest('insufficient_gold', ['need' => $cost]);
        }
        $player['gold'] -= $cost;
        $entry['appraised'] = true;
        $entry['skillId']   = $bookDef['skillId'] ?? null;
        $player['skillBooks'][$bookId] = $entry;
        return ['player' => $player, 'cost' => $cost, 'skillId' => $entry['skillId']];
    }

    private static function calcCost(int $sellPrice): int
    {
        $ratio = 0.5 + \App\Util\Random::float() * 0.3; // 0.5~0.8
        return (int) max(1, floor($sellPrice * $ratio));
    }
}
