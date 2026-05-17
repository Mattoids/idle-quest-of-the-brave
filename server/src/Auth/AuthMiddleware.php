<?php
declare(strict_types=1);

namespace App\Auth;

use App\Http\HttpException;
use App\Http\Request;
use App\Http\Response;

/**
 * 认证中间件：要求请求带 Authorization: Bearer <token>
 *
 * 解析成功后将 device_hash / token 注入 Request，供下游 Controller 使用。
 */
final class AuthMiddleware
{
    private TokenStore $tokens;

    public function __construct(?TokenStore $tokens = null)
    {
        $this->tokens = $tokens ?? new TokenStore();
    }

    public function handle(Request $req, callable $next): Response
    {
        $token = $req->bearerToken();
        if (!$token) {
            throw HttpException::unauthorized('missing_token');
        }
        $deviceHash = $this->tokens->resolve($token);
        if (!$deviceHash) {
            throw HttpException::unauthorized('invalid_or_expired_token');
        }
        $req->token = $token;
        $req->deviceHash = $deviceHash;
        return $next($req);
    }
}
