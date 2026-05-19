<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Auth\TokenStore;
use App\Http\HttpException;
use App\Http\Request;
use App\Market\ListingService;
use App\Storage\MarketRepository;

/**
 * 市场控制器
 *
 *   GET    /market/listings?type=eq|tr|it|sb&seller=hash
 *   GET    /market/listings/:type/:id
 *   POST   /market/list           { type, payload, price_gold }
 *   POST   /market/buy            { type, id }
 *   POST   /market/cancel         { type, id }
 *   GET    /market/my             我的挂售
 */
final class MarketController
{
    private ListingService $svc;

    public function __construct(?ListingService $svc = null)
    {
        $this->svc = $svc ?? new ListingService();
    }

    public function listings(Request $req): array
    {
        $type = (string) ($req->query('type') ?? 'eq');
        $filter = [];
        if ($req->query('seller')) {
            $filter['seller'] = (string) $req->query('seller');
        }

        // 解析当前用户（可选认证）—— 用于给每条 listing 打 is_mine 标记，
        // 但默认不再自动排除自己的挂售（之前会让"自己挂的东西在市场看不到"）
        $myHash = null;
        $token = $req->bearerToken();
        if ($token) {
            $myHash = (new TokenStore())->resolve($token);
        }
        // 仅当客户端 explicit 传 ?exclude_self=1 才过滤自己
        if ($myHash && $req->query('exclude_self')) {
            $filter['exclude_seller'] = $myHash;
        }

        if ($req->query('min_price')) {
            $filter['min_price'] = (int) $req->query('min_price');
        }
        if ($req->query('max_price')) {
            $filter['max_price'] = (int) $req->query('max_price');
        }
        $result = $this->svc->listOpen($type, $filter);

        // 给每条 listing 标记是否是自己的（前端用来切按钮：购买 vs 取消）
        if ($myHash && !empty($result['listings'])) {
            foreach ($result['listings'] as &$row) {
                $row['is_mine'] = (($row['seller'] ?? '') === $myHash);
            }
            unset($row);
        }
        return $result;
    }

    public function show(Request $req): array
    {
        $type = (string) $req->params['type'];
        $id   = (string) $req->params['id'];
        return $this->svc->find($type, $id);
    }

    public function create(Request $req): array
    {
        if (!$req->deviceHash) throw HttpException::unauthorized();
        $type    = (string) $req->require('type');
        $payload = (array)   $req->require('payload');
        $price   = (int)     $req->require('price_gold');
        return $this->svc->create($req->deviceHash, $type, $payload, $price);
    }

    public function buy(Request $req): array
    {
        if (!$req->deviceHash) throw HttpException::unauthorized();
        $type = (string) $req->require('type');
        $id   = (string) $req->require('id');
        return $this->svc->buy($req->deviceHash, $type, $id);
    }

    public function cancel(Request $req): array
    {
        if (!$req->deviceHash) throw HttpException::unauthorized();
        $type = (string) $req->require('type');
        $id   = (string) $req->require('id');
        return $this->svc->cancel($req->deviceHash, $type, $id);
    }

    public function my(Request $req): array
    {
        if (!$req->deviceHash) throw HttpException::unauthorized();
        $out = [];
        foreach (MarketRepository::TYPES as $t) {
            $out[$t] = $this->svc->listOpen($t, ['seller' => $req->deviceHash]);
        }
        return $out;
    }
}
