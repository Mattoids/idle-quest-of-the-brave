<?php
declare(strict_types=1);

namespace App\Market;

use App\Bootstrap;
use App\Game\Constants;
use App\Http\HttpException;
use App\Storage\MarketRepository;
use App\Storage\SaveRepository;
use App\Util\Uuid;

/**
 * 市场服务：挂售、购买、取消、列表
 *
 * 物品 payload 在挂售时必须经过完整服务端验证：
 *   - eq: id 必须在 EQUIPMENT_POOL；level/refine/attrMult 不超出合理范围；卖家背包中确实存在
 *   - tr: id 必须在 TREASURE_POOL；level 合理；卖家持有
 *   - it: id 必须在 SHOP_ITEMS；卖家持有足够数量
 *   - sb: id 必须在 SKILL_BOOKS；卖家持有足够数量
 *
 * 价格由卖家自定，但限制为正整数且 ≤ 1e8（防止溢出）。
 *
 * 购买流程：扣买家金币 + 入买家背包 + 给卖家金币（卖家存档加 gold）+ 标记 sold
 */
final class ListingService
{
    private MarketRepository $market;
    private SaveRepository $saves;
    private int $listingTtl;
    private int $perUserMax;

    public function __construct(?MarketRepository $market = null, ?SaveRepository $saves = null)
    {
        $this->market = $market ?? new MarketRepository();
        $this->saves  = $saves  ?? new SaveRepository();
        $this->listingTtl = (int) Bootstrap::config('game.listing_ttl', 7 * 86400);
        $this->perUserMax = (int) Bootstrap::config('game.listing_per_user_max', 30);
    }

    /**
     * @return array{listings:array,total:int}
     */
    public function listOpen(string $type, array $filter = []): array
    {
        return $this->market->list($type, $filter);
    }

    public function find(string $type, string $id): array
    {
        $row = $this->market->find($type, $id);
        if (!$row) throw HttpException::notFound('listing_not_found');
        return $row;
    }

    /**
     * 挂售
     *
     * @param string $sellerHash  卖家 device_hash
     * @param string $type        eq|tr|it|sb
     * @param array  $payload     物品 payload（与背包同 schema）
     * @param int    $priceGold
     * @return array              created listing
     */
    public function create(string $sellerHash, string $type, array $payload, int $priceGold): array
    {
        if ($priceGold < 1 || $priceGold > 100000000) {
            throw HttpException::badRequest('invalid_price');
        }
        if ($this->market->countOpenBySeller($sellerHash) >= $this->perUserMax) {
            throw HttpException::conflict('listing_quota_exceeded', ['max' => $this->perUserMax]);
        }

        // 校验物品 + 从卖家背包扣除
        $save = $this->saves->loadOrThrow($sellerHash);
        $newSave = $this->withdrawFromBag($save, $type, $payload);

        $listing = [
            'id'         => Uuid::v4(),
            'type'       => $type,
            'seller'     => $sellerHash,
            'payload'    => $payload,
            'price_gold' => $priceGold,
            'created_at' => time(),
            'expires_at' => time() + $this->listingTtl,
            'status'     => 'open',
            'buyer'      => null,
            'sold_at'    => null,
        ];

        // 先扣物品再写市场。两次写入失败时由 client retry；后台可加补偿。
        $this->saves->replace($sellerHash, $newSave);
        $this->market->insert($type, $listing);

        return $listing;
    }

    /**
     * 购买
     */
    public function buy(string $buyerHash, string $type, string $listingId): array
    {
        if ($type === '' || !in_array($type, MarketRepository::TYPES, true)) {
            throw HttpException::badRequest('invalid_type');
        }

        $row = $this->market->find($type, $listingId);
        if (!$row)                                throw HttpException::notFound('listing_not_found');
        if (($row['status'] ?? '') !== 'open')    throw HttpException::conflict('listing_not_open');
        if (!empty($row['expires_at']) && $row['expires_at'] < time()) {
            throw HttpException::conflict('listing_expired');
        }
        if (($row['seller'] ?? '') === $buyerHash) {
            throw HttpException::badRequest('cannot_buy_own_listing');
        }

        $price = (int) ($row['price_gold'] ?? 0);

        // 扣买家金币 + 入背包
        $buyerSave = $this->saves->loadOrThrow($buyerHash);
        if (($buyerSave['player']['gold'] ?? 0) < $price) {
            throw HttpException::badRequest('insufficient_gold', ['need' => $price, 'have' => $buyerSave['player']['gold'] ?? 0]);
        }
        $buyerSave['player']['gold'] -= $price;
        $buyerSave = $this->depositToBag($buyerSave, $type, $row['payload']);
        $this->saves->replace($buyerHash, $buyerSave);

        // 给卖家金币
        $sellerHash = (string) $row['seller'];
        if ($this->saves->exists($sellerHash)) {
            $this->saves->mutate($sellerHash, function (array $s) use ($price) {
                $s['player']['gold'] = (int) ($s['player']['gold'] ?? 0) + $price;
                return $s;
            });
        }

        // 标记 listing
        $updated = $this->market->updateListing($type, $listingId, function (array $cur) use ($buyerHash) {
            if (($cur['status'] ?? '') !== 'open') {
                throw HttpException::conflict('listing_state_changed');
            }
            $cur['status']  = 'sold';
            $cur['buyer']   = $buyerHash;
            $cur['sold_at'] = time();
            return $cur;
        });

        return ['listing' => $updated, 'player_gold' => $buyerSave['player']['gold']];
    }

    /**
     * 卖家取消挂售：物品归还
     */
    public function cancel(string $sellerHash, string $type, string $listingId): array
    {
        $row = $this->market->find($type, $listingId);
        if (!$row)                                  throw HttpException::notFound('listing_not_found');
        if (($row['seller'] ?? '') !== $sellerHash) throw HttpException::forbidden('not_owner');
        if (($row['status'] ?? '') !== 'open')      throw HttpException::conflict('listing_not_open');

        $save = $this->saves->loadOrThrow($sellerHash);
        $save = $this->depositToBag($save, $type, $row['payload']);
        $this->saves->replace($sellerHash, $save);

        $updated = $this->market->updateListing($type, $listingId, function (array $cur) {
            if (($cur['status'] ?? '') !== 'open') {
                throw HttpException::conflict('listing_state_changed');
            }
            $cur['status'] = 'cancelled';
            return $cur;
        });
        return ['listing' => $updated];
    }

    /* ---------------- 背包出入 ---------------- */

    /**
     * 从存档背包中扣除物品（同时返回更新后的存档）
     */
    private function withdrawFromBag(array $save, string $type, array $payload): array
    {
        $player = $save['player'] ?? [];

        switch ($type) {
            case 'eq': {
                $id = (string) ($payload['id'] ?? '');
                if (!Constants::findEquipment($id)) throw HttpException::badRequest('invalid_equipment_id');
                $bag = $player['equipmentBag'] ?? [];
                $idx = self::findMatchingEquipmentIdx($bag, $payload);
                if ($idx === null) throw HttpException::badRequest('equipment_not_in_bag');
                array_splice($bag, $idx, 1);
                $player['equipmentBag'] = $bag;
                break;
            }
            case 'tr': {
                $id = (string) ($payload['id'] ?? '');
                if (!Constants::findTreasure($id)) throw HttpException::badRequest('invalid_treasure_id');
                $entry = ($player['treasures'] ?? [])[$id] ?? null;
                if (!$entry || ($entry['count'] ?? 0) < 1) {
                    throw HttpException::badRequest('treasure_insufficient');
                }
                if (!empty($entry['locked'])) {
                    throw HttpException::badRequest('treasure_locked');
                }
                $entry['count']--;
                if ($entry['count'] <= 0) {
                    unset($player['treasures'][$id]);
                } else {
                    $player['treasures'][$id] = $entry;
                }
                break;
            }
            case 'it': {
                $id = (string) ($payload['id'] ?? '');
                $count = max(1, (int) ($payload['count'] ?? 1));
                if (!Constants::findShopItem($id)) throw HttpException::badRequest('invalid_item_id');
                $entry = ($player['items'] ?? [])[$id] ?? null;
                if (!$entry || ($entry['count'] ?? 0) < $count) throw HttpException::badRequest('item_insufficient');
                $entry['count'] -= $count;
                if ($entry['count'] <= 0) {
                    unset($player['items'][$id]);
                } else {
                    $player['items'][$id] = $entry;
                }
                break;
            }
            case 'sb': {
                $id = (string) ($payload['id'] ?? '');
                $count = max(1, (int) ($payload['count'] ?? 1));
                if (!Constants::findSkillBook($id)) throw HttpException::badRequest('invalid_skillbook_id');
                $entry = ($player['skillBooks'] ?? [])[$id] ?? null;
                if (!$entry || ($entry['count'] ?? 0) < $count) throw HttpException::badRequest('skillbook_insufficient');
                $entry['count'] -= $count;
                if ($entry['count'] <= 0) {
                    unset($player['skillBooks'][$id]);
                } else {
                    $player['skillBooks'][$id] = $entry;
                }
                break;
            }
            default:
                throw HttpException::badRequest('invalid_type');
        }

        $save['player'] = $player;
        return $save;
    }

    private function depositToBag(array $save, string $type, array $payload): array
    {
        $player = $save['player'] ?? [];

        switch ($type) {
            case 'eq':
                $player['equipmentBag'] = $player['equipmentBag'] ?? [];
                $player['equipmentBag'][] = $payload;
                break;
            case 'tr':
                $id = (string) $payload['id'];
                $level = (int) ($payload['level'] ?? 1);
                $treasures = $player['treasures'] ?? [];
                if (!isset($treasures[$id])) $treasures[$id] = ['count' => 0, 'level' => 1, 'locked' => false];
                $treasures[$id]['count']++;
                if ($level > ($treasures[$id]['level'] ?? 1)) $treasures[$id]['level'] = $level;
                $player['treasures'] = $treasures;
                break;
            case 'it':
                $id = (string) $payload['id'];
                $count = max(1, (int) ($payload['count'] ?? 1));
                $items = $player['items'] ?? [];
                if (!isset($items[$id])) $items[$id] = ['count' => 0];
                $items[$id]['count'] += $count;
                $player['items'] = $items;
                break;
            case 'sb':
                $id = (string) $payload['id'];
                $count = max(1, (int) ($payload['count'] ?? 1));
                $books = $player['skillBooks'] ?? [];
                if (!isset($books[$id])) {
                    $book = Constants::findSkillBook($id);
                    $books[$id] = ['count' => 0, 'appraised' => (bool) ($payload['appraised'] ?? false), 'skillId' => $book['skillId'] ?? null];
                }
                $books[$id]['count'] += $count;
                $player['skillBooks'] = $books;
                break;
        }

        $save['player'] = $player;
        return $save;
    }

    /**
     * 在装备背包中找到与 payload 完全匹配的第一个 index
     */
    private static function findMatchingEquipmentIdx(array $bag, array $payload): ?int
    {
        $id = $payload['id'] ?? null;
        if (!$id) return null;
        foreach ($bag as $i => $it) {
            if (($it['id'] ?? null) !== $id) continue;
            if (($it['level'] ?? 1) !== ($payload['level'] ?? 1)) continue;
            if (($it['refine'] ?? 0) !== ($payload['refine'] ?? 0)) continue;
            if ((float)($it['attrMult'] ?? 1) !== (float)($payload['attrMult'] ?? 1)) continue;
            if ((bool)($it['appraised'] ?? false) !== (bool)($payload['appraised'] ?? false)) continue;
            return $i;
        }
        return null;
    }
}
