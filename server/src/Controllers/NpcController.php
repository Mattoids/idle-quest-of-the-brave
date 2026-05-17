<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Game\Npc\AppraiserService;
use App\Game\Npc\BlacksmithService;
use App\Game\Npc\InnService;
use App\Game\Npc\ShopService;
use App\Game\Npc\SpiritService;
use App\Http\HttpException;
use App\Http\Request;
use App\Storage\SaveRepository;

/**
 * NPC 业务：铁匠 / 鉴定师 / 商店 / 客栈 / 精神修炼
 *
 *   POST /npc/blacksmith/forge
 *   POST /npc/blacksmith/refine        { bag_index, use_stones? }
 *   POST /npc/appraiser/equipment      { bag_index }
 *   POST /npc/appraiser/skillbook      { book_id }
 *   POST /npc/shop/buy                 { item_id, count? }
 *   POST /npc/shop/use                 { item_id, count? }
 *   POST /npc/inn/rest
 *   POST /npc/spirit/train
 */
final class NpcController
{
    private SaveRepository $saves;

    public function __construct(?SaveRepository $saves = null)
    {
        $this->saves = $saves ?? new SaveRepository();
    }

    /* ---- 铁匠 ---- */

    public function forge(Request $req): array
    {
        return $this->mutate($req, function (array $save): array {
            $r = BlacksmithService::forge($save['player']);
            $save['player'] = $r['player'];
            $save['_result'] = ['equipment' => $r['equipment'], 'cost' => $r['cost']];
            return $save;
        });
    }

    public function refine(Request $req): array
    {
        $idx     = (int) $req->require('bag_index');
        $stones  = (int) ($req->input('use_stones') ?? 0);
        return $this->mutate($req, function (array $save) use ($idx, $stones): array {
            $r = BlacksmithService::refine($save['player'], $idx, $stones);
            $save['player'] = $r['player'];
            $save['_result'] = [
                'success' => $r['success'], 'refine' => $r['refine'],
                'destroyed' => $r['destroyed'], 'rate' => $r['rate'],
                'cost' => $r['cost'], 'stones' => $r['stones'],
            ];
            return $save;
        });
    }

    /* ---- 鉴定师 ---- */

    public function appraiseEquipment(Request $req): array
    {
        $idx = (int) $req->require('bag_index');
        return $this->mutate($req, function (array $save) use ($idx): array {
            $r = AppraiserService::appraiseEquipment($save['player'], $idx);
            $save['player'] = $r['player'];
            $save['_result'] = ['cost' => $r['cost']];
            return $save;
        });
    }

    public function appraiseSkillBook(Request $req): array
    {
        $bookId = (string) $req->require('book_id');
        return $this->mutate($req, function (array $save) use ($bookId): array {
            $r = AppraiserService::appraiseSkillBook($save['player'], $bookId);
            $save['player'] = $r['player'];
            $save['_result'] = ['cost' => $r['cost'], 'skillId' => $r['skillId']];
            return $save;
        });
    }

    /* ---- 商店 ---- */

    public function buy(Request $req): array
    {
        $itemId = (string) $req->require('item_id');
        $count  = (int) ($req->input('count') ?? 1);
        return $this->mutate($req, function (array $save) use ($itemId, $count): array {
            $r = ShopService::buy($save['player'], $itemId, $count);
            $save['player'] = $r['player'];
            $save['_result'] = ['cost' => $r['cost'], 'unit_price' => $r['unit_price'], 'count' => $r['count']];
            return $save;
        });
    }

    public function useItem(Request $req): array
    {
        $itemId = (string) $req->require('item_id');
        $count  = (int) ($req->input('count') ?? 1);
        return $this->mutate($req, function (array $save) use ($itemId, $count): array {
            $r = ShopService::useItem($save['player'], $itemId, $count);
            $save['player'] = $r['player'];
            $save['_result'] = ['log' => $r['log']];
            return $save;
        });
    }

    /* ---- 客栈 / 精神 ---- */

    public function rest(Request $req): array
    {
        return $this->mutate($req, function (array $save): array {
            $r = InnService::rest($save['player'], $save['battle'] ?? null);
            $save['player'] = $r['player'];
            $save['_result'] = ['rested' => true];
            return $save;
        });
    }

    public function trainSpirit(Request $req): array
    {
        return $this->mutate($req, function (array $save): array {
            $r = SpiritService::train($save['player']);
            $save['player'] = $r['player'];
            $save['_result'] = ['cost' => $r['cost'], 'spi' => $r['spi']];
            return $save;
        });
    }

    /* ---- helper ---- */

    /**
     * 原子事务：读 → mutator → 写；从 $next['_result'] 解开附加信息返回
     */
    private function mutate(Request $req, callable $mutator): array
    {
        if (!$req->deviceHash) throw HttpException::unauthorized();
        $result = null;
        $next = $this->saves->mutate($req->deviceHash, function (array $save) use ($mutator, &$result): array {
            $save = $mutator($save);
            $result = $save['_result'] ?? null;
            unset($save['_result']);
            return $save;
        });
        return [
            'player' => $next['player'],
            'gold'   => $next['player']['gold'] ?? 0,
            'result' => $result,
        ];
    }
}
