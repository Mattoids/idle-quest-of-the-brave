<?php
declare(strict_types=1);

namespace App\Controllers;

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
        if ($req->query('min_price')) {
            $filter['min_price'] = (int) $req->query('min_price');
        }
        if ($req->query('max_price')) {
            $filter['max_price'] = (int) $req->query('max_price');
        }
        return $this->svc->listOpen($type, $filter);
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
