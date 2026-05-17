<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Auth\AuthService;
use App\Http\HttpException;
use App\Http\Request;

/**
 * 认证：注册 / 登录 / 恢复 / 注销 / 重置恢复码
 *
 * 路由：
 *   POST /auth/register
 *   POST /auth/login
 *   POST /auth/recover
 *   POST /auth/logout       （需要 Bearer token）
 *   POST /auth/rotate-recovery  （需要 Bearer token）
 */
final class AuthController
{
    private AuthService $auth;

    public function __construct(?AuthService $auth = null)
    {
        $this->auth = $auth ?? new AuthService();
    }

    public function register(Request $req): array
    {
        $meta = is_array($req->input('meta')) ? $req->input('meta') : null;
        $result = $this->auth->register($meta);
        // 提示客户端务必妥善保管 recovery_code
        return $result + [
            'note' => '请妥善保存 recovery_code，丢失 device_id 时需用它恢复账号。',
        ];
    }

    public function login(Request $req): array
    {
        $deviceId = (string) $req->require('device_id');
        $recovery = $req->input('recovery_code');
        return $this->auth->login($deviceId, is_string($recovery) ? $recovery : null);
    }

    public function recover(Request $req): array
    {
        $code = (string) $req->require('recovery_code');
        return $this->auth->recover($code);
    }

    public function logout(Request $req): array
    {
        $token = $req->token;
        if (!$token) throw HttpException::unauthorized('not_logged_in');
        $this->auth->logout($token);
        return ['logged_out' => true];
    }

    public function rotateRecovery(Request $req): array
    {
        if (!$req->deviceHash) throw HttpException::unauthorized();
        $newCode = $this->auth->rotateRecovery($req->deviceHash);
        return ['recovery_code' => $newCode];
    }
}
