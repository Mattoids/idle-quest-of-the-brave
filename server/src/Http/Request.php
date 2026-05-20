<?php
declare(strict_types=1);

namespace App\Http;

/**
 * 请求封装：从 $_SERVER/$_GET/php://input 提取必要字段，不依赖 PSR-7
 */
final class Request
{
    public string $method;
    public string $path;
    /** @var array<string,string> */
    public array $query;
    public array $body;       // JSON 或 form
    public array $headers;
    /** @var array<string,string> */
    public array $params = []; // 路由参数（由 Router 填充）

    /** 当前已认证的设备 ID（由 AuthMiddleware 填充） */
    public ?string $deviceId = null;
    public ?string $deviceHash = null;
    public ?string $token = null;

    public function __construct(
        string $method,
        string $path,
        array $query,
        array $body,
        array $headers
    ) {
        $this->method = strtoupper($method);
        $this->path = $path;
        $this->query = $query;
        $this->body = $body;
        $this->headers = $headers;
    }

    public static function fromGlobals(): self
    {
        $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
        $uri = $_SERVER['REQUEST_URI'] ?? '/';
        $path = parse_url($uri, PHP_URL_PATH) ?? '/';
        $path = '/' . trim($path, '/');
        if ($path === '/') $path = '/';

        // 统一剥离应用前缀 /game/idle-quest-of-the-brave
        $prefix = '/game/idle-quest-of-the-brave';
        if (str_starts_with($path, $prefix)) {
            $path = substr($path, strlen($prefix));
            if ($path === '') $path = '/';
        }

        $query = $_GET;

        // 解析 body
        $body = [];
        $rawType = $_SERVER['CONTENT_TYPE'] ?? '';
        if (in_array($method, ['POST', 'PUT', 'PATCH', 'DELETE'], true)) {
            if (stripos($rawType, 'application/json') !== false) {
                $raw = file_get_contents('php://input') ?: '';
                if ($raw !== '') {
                    $decoded = json_decode($raw, true);
                    if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                        $body = $decoded;
                    } else {
                        throw HttpException::badRequest('invalid_json', ['detail' => json_last_error_msg()]);
                    }
                }
            } else {
                $body = $_POST;
            }
        }

        // 头部统一小写
        $headers = [];
        foreach ($_SERVER as $key => $value) {
            if (strncmp($key, 'HTTP_', 5) === 0) {
                $name = strtolower(str_replace('_', '-', substr($key, 5)));
                $headers[$name] = (string) $value;
            }
        }
        if (!empty($_SERVER['CONTENT_TYPE'])) {
            $headers['content-type'] = (string) $_SERVER['CONTENT_TYPE'];
        }

        return new self($method, $path, $query, $body, $headers);
    }

    public function header(string $name, ?string $default = null): ?string
    {
        return $this->headers[strtolower($name)] ?? $default;
    }

    public function query(string $name, $default = null)
    {
        return $this->query[$name] ?? $default;
    }

    public function input(string $name, $default = null)
    {
        return $this->body[$name] ?? $default;
    }

    public function require(string $name)
    {
        if (!array_key_exists($name, $this->body)) {
            throw HttpException::badRequest('missing_field', ['field' => $name]);
        }
        return $this->body[$name];
    }

    public function bearerToken(): ?string
    {
        $auth = $this->header('authorization');
        if (!$auth) return null;
        if (stripos($auth, 'Bearer ') === 0) {
            return trim(substr($auth, 7));
        }
        return null;
    }

    /**
     * 读取前端传来的 X-Device-ID 头部（优先于 token 解析出的 deviceId）
     */
    public function deviceIdHeader(): ?string
    {
        return $this->header('x-device-id');
    }
}
