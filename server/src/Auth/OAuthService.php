<?php
declare(strict_types=1);

namespace App\Auth;

use App\Bootstrap;
use App\Http\HttpException;
use App\Storage\Cache;

/**
 * 药丸 (invites.fun) OAuth 授权服务
 *
 * 封装与第三方 OAuth 提供者的 HTTP 交互：
 *   1. 生成授权跳转 URL（含 state）
 *   2. 用 code 换取 access_token
 *   3. 用 access_token 获取用户信息
 *
 * 所有对药丸的接口调用均在 PHP 后端完成，前端只做跳转。
 */
final class OAuthService
{
    private Cache $cache;
    private array $config;
    private int $stateTtl;

    public function __construct(?Cache $cache = null)
    {
        $this->cache  = $cache ?? new Cache();
        $this->config = Bootstrap::config('oauth', []);
        $this->stateTtl = 600; // state 有效期 10 分钟
    }

    /**
     * 是否启用了 OAuth
     */
    public function enabled(): bool
    {
        return !empty($this->config['enabled'])
            && !empty($this->config['client_id'])
            && !empty($this->config['client_secret']);
    }

    /**
     * 获取药丸授权跳转 URL，同时生成并缓存 state
     *
     * @param string $redirectUri 回调地址（若为空则自动推断）
     */
    public function authorizeUrl(string $redirectUri = ''): string
    {
        if (!$this->enabled()) {
            throw HttpException::serviceUnavailable('oauth_not_configured');
        }

        $redirectUri = $redirectUri ?: $this->inferRedirectUri();
        $state = $this->generateState();
        $this->cache->set($this->stateKey($state), ['redirect_uri' => $redirectUri, 'ts' => time()], $this->stateTtl);

        $params = [
            'client_id'     => $this->config['client_id'],
            'response_type' => 'code',
            'redirect_uri'  => $redirectUri,
            'scope'         => $this->config['scope'] ?? 'user.read',
            'state'         => $state,
        ];

        return $this->config['base_url'] . '/oauth/authorize?' . http_build_query($params);
    }

    /**
     * 用授权码换取 access_token，再获取用户信息，最后以用户唯一标识登录游戏
     *
     * @return array{device_hash:string, token:string, user:array}
     */
    public function handleCallback(string $code, string $state): array
    {
        if (!$this->enabled()) {
            throw HttpException::serviceUnavailable('oauth_not_configured');
        }

        // 验证 state
        $stateData = $this->cache->get($this->stateKey($state));
        if (!is_array($stateData) || empty($stateData['redirect_uri'])) {
            throw HttpException::badRequest('invalid_state');
        }
        $this->cache->delete($this->stateKey($state));

        $redirectUri = $stateData['redirect_uri'];

        // 1. 用 code 换 token
        $tokenResp = $this->postToken($code, $redirectUri);
        $accessToken = $tokenResp['access_token'] ?? '';
        if ($accessToken === '') {
            throw HttpException::badRequest('oauth_token_failed', ['detail' => $tokenResp['error_description'] ?? 'unknown']);
        }

        // 2. 用 token 获取用户信息
        $user = $this->getUser($accessToken);
        $userId = (string) ($user['id'] ?? '');
        if ($userId === '') {
            throw HttpException::badRequest('oauth_user_id_missing');
        }

        // 3. 以用户唯一标识作为 device_hash 登录游戏
        $auth = new AuthService();
        $loginResult = $auth->loginByHash('yaowan_' . $userId);

        return [
            'device_hash' => $loginResult['device_hash'],
            'token'       => $loginResult['token'],
            'user'        => $user,
        ];
    }

    /**
     * POST /oauth/token
     */
    private function postToken(string $code, string $redirectUri): array
    {
        $url = $this->config['base_url'] . '/oauth/token';
        $payload = http_build_query([
            'client_id'     => $this->config['client_id'],
            'client_secret' => $this->config['client_secret'],
            'grant_type'    => 'authorization_code',
            'code'          => $code,
            'redirect_uri'  => $redirectUri,
        ]);

        $resp = $this->httpPost($url, $payload, ['Content-Type: application/x-www-form-urlencoded']);
        return $this->jsonDecode($resp);
    }

    /**
     * GET /api/user
     */
    private function getUser(string $accessToken): array
    {
        $url = $this->config['base_url'] . '/api/user?access_token=' . urlencode($accessToken);
        $resp = $this->httpGet($url);
        return $this->jsonDecode($resp);
    }

    // ---------- HTTP 工具 ----------

    private function httpGet(string $url): string
    {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_TIMEOUT        => 15,
            CURLOPT_SSL_VERIFYPEER => true,
            CURLOPT_HTTPHEADER     => ['Accept: application/json'],
        ]);
        $body = curl_exec($ch);
        $err  = curl_error($ch);
        $code = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($body === false || $err !== '') {
            throw HttpException::serviceUnavailable('oauth_http_error', ['error' => $err]);
        }
        if ($code < 200 || $code >= 300) {
            throw HttpException::serviceUnavailable('oauth_http_error', ['http_code' => $code, 'body' => substr((string)$body, 0, 500)]);
        }
        return (string) $body;
    }

    private function httpPost(string $url, string $body, array $headers = []): string
    {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_TIMEOUT        => 15,
            CURLOPT_SSL_VERIFYPEER => true,
            CURLOPT_POST           => true,
            CURLOPT_POSTFIELDS     => $body,
            CURLOPT_HTTPHEADER     => $headers,
        ]);
        $resp = curl_exec($ch);
        $err  = curl_error($ch);
        $code = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($resp === false || $err !== '') {
            throw HttpException::serviceUnavailable('oauth_http_error', ['error' => $err]);
        }
        if ($code < 200 || $code >= 300) {
            throw HttpException::serviceUnavailable('oauth_http_error', ['http_code' => $code, 'body' => substr((string)$resp, 0, 500)]);
        }
        return (string) $resp;
    }

    private function jsonDecode(string $json): array
    {
        $data = json_decode($json, true);
        return is_array($data) ? $data : [];
    }

    // ---------- 辅助 ----------

    private function generateState(): string
    {
        return bin2hex(random_bytes(16));
    }

    private function stateKey(string $state): string
    {
        return 'oauth:state:' . hash('sha256', $state);
    }

    /**
     * 自动推断回调地址（基于当前请求 scheme + host + 脚本路径前缀）
     */
    private function inferRedirectUri(): string
    {
        $cfg = $this->config['redirect_uri'] ?? '';
        if ($cfg !== '') {
            return $cfg;
        }

        $scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
        $host   = $_SERVER['HTTP_HOST'] ?? 'localhost';
        $script = $_SERVER['SCRIPT_NAME'] ?? '/index.php';
        // 去掉 /public/index.php 得到 base path
        $base = preg_replace('#/public/index\.php$#', '', $script);
        if ($base === '') $base = '/game/idle-quest-of-the-brave';

        return $scheme . '://' . $host . $base . '/auth/oauth/callback';
    }
}
