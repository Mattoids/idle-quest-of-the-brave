<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Auth\OAuthService;
use App\Http\HttpException;
use App\Http\Request;

/**
 * OAuth 授权控制器（药丸 / invites.fun）
 *
 *   GET /auth/oauth/redirect   → 返回授权跳转 URL
 *   GET /auth/oauth/callback   → 药丸回调，完成授权后重定向回前端
 */
final class OAuthController
{
    private OAuthService $oauth;

    public function __construct(?OAuthService $oauth = null)
    {
        $this->oauth = $oauth ?? new OAuthService();
    }

    /**
     * 获取药丸授权跳转 URL
     *
     * 可选传参 redirect_uri（覆盖 .env 配置）
     */
    public function redirect(Request $req): array
    {
        $redirectUri = (string) ($req->input('redirect_uri') ?? '');
        $url = $this->oauth->authorizeUrl($redirectUri);
        return ['url' => $url];
    }

    /**
     * 药丸 OAuth 回调
     *
     * 药丸会重定向到：/auth/oauth/callback?code=xxx&state=xxx
     * 后端完成 code → token → user → loginByHash 后，
     * 重定向回前端页面并带上 oauth_token。
     */
    public function callback(Request $req): void
    {
        $code  = (string) ($req->input('code') ?? '');
        $state = (string) ($req->input('state') ?? '');

        if ($code === '' || $state === '') {
            $this->redirectFront(['oauth_error' => 'missing_code_or_state']);
            return;
        }

        try {
            $result = $this->oauth->handleCallback($code, $state);
        } catch (HttpException $e) {
            $this->redirectFront([
                'oauth_error' => $e->getMessage(),
                'oauth_details' => $e->getDetails(),
            ]);
            return;
        }

        $this->redirectFront(['oauth_token' => $result['token']]);
    }

    /**
     * 重定向回前端页面
     *
     * 把结果参数附加到前端 URL 中，然后发送 302 重定向。
     */
    private function redirectFront(array $params): void
    {
        $frontendUrl = $this->inferFrontendUrl();
        $sep = strpos($frontendUrl, '?') === false ? '?' : '&';
        $query = http_build_query($params);
        $location = $frontendUrl . $sep . $query;

        header('Location: ' . $location, true, 302);
        exit;
    }

    /**
     * 推断前端页面地址
     *
     * 基于 Referer 或当前请求的 scheme/host，去掉后端路径后缀得到前端根地址。
     */
    private function inferFrontendUrl(): string
    {
        // 优先用 Referer（用户从哪个页面跳转过来的）
        $referer = $_SERVER['HTTP_REFERER'] ?? '';
        if ($referer !== '' && filter_var($referer, FILTER_VALIDATE_URL)) {
            $parsed = parse_url($referer);
            if (is_array($parsed)) {
                $scheme = $parsed['scheme'] ?? 'https';
                $host   = $parsed['host'] ?? '';
                $port   = isset($parsed['port']) ? ':' . $parsed['port'] : '';
                $path   = $parsed['path'] ?? '/';
                // 去掉可能的尾部路径，只保留到前端根
                $path = preg_replace('#/(server/)?public/.*$#', '', $path);
                if ($path === '') $path = '/';
                return $scheme . '://' . $host . $port . $path;
            }
        }

        // 回退：基于当前请求构造
        $scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
        $host   = $_SERVER['HTTP_HOST'] ?? 'localhost';
        $script = $_SERVER['SCRIPT_NAME'] ?? '/index.php';
        $base = preg_replace('#/server/public/index\.php$#', '', $script);
        if ($base === '') $base = '/game/idle-quest-of-the-brave';

        return $scheme . '://' . $host . $base . '/';
    }
}
