<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Http\HttpException;
use App\Http\Request;
use App\Storage\SaveRepository;

/**
 * 存档读写
 *
 *   GET    /save                 获取当前账号存档
 *   PUT    /save                 覆盖存档（仅允许 player.* 中的可写字段；危险操作）
 *   POST   /save/diff            按 path 列表局部更新（如 player.gold）
 */
final class SaveController
{
    private SaveRepository $saves;

    public function __construct(?SaveRepository $saves = null)
    {
        $this->saves = $saves ?? new SaveRepository();
    }

    public function show(Request $req): array
    {
        if (!$req->deviceHash) throw HttpException::unauthorized();
        return $this->saves->loadOrThrow($req->deviceHash);
    }

    /**
     * 直接覆盖。建议仅在调试或同设备登录初始化时使用。
     * 生产路径走 BattleController/MarketController 以避免作弊。
     *
     * 防御性兜底：前端永远不能通过 PUT /save 覆写 battle / 服务端权威字段，
     * 即使前端误传也会被这里丢弃 → 保留服务端原值。
     */
    public function replace(Request $req): array
    {
        if (!$req->deviceHash) throw HttpException::unauthorized();
        $payload = $req->body;
        if (empty($payload['player'])) {
            throw HttpException::badRequest('missing_player');
        }
        // 不允许前端覆写 battle / 服务端权威字段
        unset($payload['battle']);
        return $this->saves->replace($req->deviceHash, $payload);
    }

    /**
     * 按 path 局部更新：body 形如 {"changes": {"player.gold": 123, "world.inCity": true}}
     */
    public function diff(Request $req): array
    {
        if (!$req->deviceHash) throw HttpException::unauthorized();
        $changes = $req->require('changes');
        if (!is_array($changes)) throw HttpException::badRequest('changes_must_be_object');

        return $this->saves->mutate($req->deviceHash, function (array $save) use ($changes): array {
            foreach ($changes as $path => $value) {
                self::setByPath($save, (string) $path, $value);
            }
            return $save;
        });
    }

    public function reset(Request $req): array
    {
        if (!$req->deviceHash) throw HttpException::unauthorized();
        $this->saves->delete($req->deviceHash);
        return ['reset' => true];
    }

    private static function setByPath(array &$arr, string $path, $value): void
    {
        // 限制可写顶层：player / world / meta
        $top = explode('.', $path, 2)[0];
        if (!in_array($top, ['player', 'world', 'meta'], true)) {
            throw HttpException::badRequest('readonly_path', ['path' => $path]);
        }
        $cur = &$arr;
        $parts = explode('.', $path);
        $last = array_pop($parts);
        foreach ($parts as $p) {
            if (!isset($cur[$p]) || !is_array($cur[$p])) {
                $cur[$p] = [];
            }
            $cur = &$cur[$p];
        }
        $cur[$last] = $value;
    }
}
