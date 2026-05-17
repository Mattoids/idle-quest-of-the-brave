<?php
declare(strict_types=1);

namespace App\Storage;

use App\Bootstrap;
use App\Http\HttpException;

/**
 * 市场挂售仓库：所有挂售按 type 分文件存储
 *
 *   data/market/listings.eq.json   装备
 *   data/market/listings.tr.json   宝物
 *   data/market/listings.it.json   道具
 *   data/market/listings.sb.json   技能书
 *
 * 单条挂售 schema：
 *   {
 *     "id":          "uuid",
 *     "type":        "eq" | "tr" | "it" | "sb",
 *     "seller":      "<device_hash>",
 *     "payload":     { ... 物品 snapshot ... },   // 由 ListingService 校验
 *     "price_gold":  1000,
 *     "created_at":  1234,
 *     "expires_at":  1234,
 *     "status":      "open" | "sold" | "cancelled" | "expired",
 *     "buyer":       null | "<device_hash>",
 *     "sold_at":     null | 1234
 *   }
 *
 * 已完成（sold/cancelled/expired）的挂售会保留在文件中，方便审计；
 * 可由 GC 任务定期归档到 deals.log。
 */
final class MarketRepository
{
    public const TYPES = ['eq', 'tr', 'it', 'sb'];

    private FileStore $files;
    private string $rootDir;

    public function __construct(?FileStore $files = null)
    {
        $this->files = $files ?? new FileStore();
        $this->rootDir = (string) Bootstrap::config('paths.market');
    }

    /**
     * 列出指定 type 的挂售（默认只返回 open 状态）
     *
     * @return array{listings: array<int,array>, total: int}
     */
    public function list(string $type, array $filter = []): array
    {
        $this->assertType($type);
        $all = $this->loadAll($type);
        $now = time();
        $open = [];
        foreach ($all as $row) {
            if (($row['status'] ?? 'open') !== 'open') continue;
            if (!empty($row['expires_at']) && $row['expires_at'] < $now) continue;

            if (!empty($filter['seller']) && ($row['seller'] ?? '') !== $filter['seller']) continue;
            if (isset($filter['min_price']) && ($row['price_gold'] ?? 0) < $filter['min_price']) continue;
            if (isset($filter['max_price']) && ($row['price_gold'] ?? 0) > $filter['max_price']) continue;

            $open[] = $row;
        }
        usort($open, fn($a, $b) => ($b['created_at'] ?? 0) <=> ($a['created_at'] ?? 0));
        return ['listings' => $open, 'total' => count($open)];
    }

    public function find(string $type, string $listingId): ?array
    {
        $this->assertType($type);
        foreach ($this->loadAll($type) as $row) {
            if (($row['id'] ?? '') === $listingId) {
                return $row;
            }
        }
        return null;
    }

    /**
     * 写入新挂售
     */
    public function insert(string $type, array $listing): array
    {
        $this->assertType($type);
        return $this->mutate($type, function (array $list) use ($listing) {
            $list[] = $listing;
            return $list;
        })['inserted'] ?? $listing;
    }

    /**
     * 更新已存在的挂售
     *
     * @param callable(array):array $mutator   接收旧 listing，返回新 listing
     */
    public function updateListing(string $type, string $listingId, callable $mutator): array
    {
        $this->assertType($type);
        $updated = null;
        $this->mutate($type, function (array $list) use ($listingId, $mutator, &$updated) {
            $found = false;
            foreach ($list as $idx => $row) {
                if (($row['id'] ?? '') === $listingId) {
                    $list[$idx] = $mutator($row);
                    $updated = $list[$idx];
                    $found = true;
                    break;
                }
            }
            if (!$found) {
                throw HttpException::notFound('listing_not_found');
            }
            return $list;
        });
        return $updated;
    }

    /**
     * 统计某卖家当前 open 挂售数量
     */
    public function countOpenBySeller(string $sellerHash): int
    {
        $sum = 0;
        $now = time();
        foreach (self::TYPES as $t) {
            foreach ($this->loadAll($t) as $row) {
                if (($row['seller'] ?? '') !== $sellerHash) continue;
                if (($row['status'] ?? 'open') !== 'open') continue;
                if (!empty($row['expires_at']) && $row['expires_at'] < $now) continue;
                $sum++;
            }
        }
        return $sum;
    }

    private function loadAll(string $type): array
    {
        $path = $this->pathFor($type);
        $data = $this->files->readJson($path, ['listings' => []]);
        return $data['listings'] ?? [];
    }

    /**
     * 串行修改 type 文件
     *
     * @param callable(array):array $mutator   接收/返回 listings 数组
     */
    private function mutate(string $type, callable $mutator): array
    {
        $path = $this->pathFor($type);
        $result = $this->files->update($path, function (array $cur) use ($mutator) {
            $list = $cur['listings'] ?? [];
            $next = $mutator($list);
            return ['listings' => array_values($next)];
        }, ['listings' => []]);
        return ['ok' => true, 'count' => count($result['listings'] ?? [])];
    }

    private function pathFor(string $type): string
    {
        return $this->rootDir . '/listings.' . $type . '.json';
    }

    private function assertType(string $type): void
    {
        if (!in_array($type, self::TYPES, true)) {
            throw new \InvalidArgumentException("invalid market type: $type");
        }
    }
}
