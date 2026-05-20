<?php
declare(strict_types=1);

namespace App;

use App\Http\HttpException;
use App\Http\JsonResponse;
use App\Http\Request;
use App\Http\Response;
use App\Util\EnvLoader;
use Throwable;

/**
 * 应用启动器：注册 autoloader、加载配置、构建路由、处理请求。
 */
final class Bootstrap
{
    private static ?array $config = null;
    private static ?string $basePath = null;

    public static function run(string $basePath): void
    {
        self::$basePath = rtrim($basePath, '/');

        self::registerAutoloader();
        EnvLoader::load(self::$basePath . '/.env');                      // server/.env 默认配置
        EnvLoader::load(dirname(self::$basePath) . '/.env', true);       // 根目录 .env 覆盖（用户自定义优先）
        self::loadConfig();
        self::handleCors();

        try {
            $router = new Router();
            \App\Routes::register($router);

            $request = Request::fromGlobals();
            $response = $router->dispatch($request);
        } catch (HttpException $e) {
            $response = JsonResponse::error(
                $e->getMessage() ?: 'http_error',
                $e->getStatusCode(),
                $e->getDetails()
            );
        } catch (Throwable $e) {
            $debug = (bool) (self::$config['debug'] ?? false);
            $payload = ['error' => 'internal_error', 'message' => $debug ? $e->getMessage() : 'internal error'];
            if ($debug) {
                $payload['trace'] = explode("\n", $e->getTraceAsString());
            }
            self::logError($e);
            $response = JsonResponse::raw($payload, 500);
        }

        $response->send();
    }

    public static function config(?string $key = null, $default = null)
    {
        if (self::$config === null) {
            self::loadConfig();
        }
        if ($key === null) {
            return self::$config;
        }
        $parts = explode('.', $key);
        $cur = self::$config;
        foreach ($parts as $p) {
            if (!is_array($cur) || !array_key_exists($p, $cur)) {
                return $default;
            }
            $cur = $cur[$p];
        }
        return $cur;
    }

    public static function basePath(): string
    {
        return self::$basePath ?? dirname(__DIR__);
    }

    /**
     * 简易 PSR-4 autoloader：App\Foo\Bar 映射 src/Foo/Bar.php
     */
    private static function registerAutoloader(): void
    {
        // 若 composer autoload 存在，则优先使用
        $composerAutoload = self::$basePath . '/vendor/autoload.php';
        if (is_file($composerAutoload)) {
            require_once $composerAutoload;
            return;
        }

        spl_autoload_register(static function (string $class): void {
            $prefix = 'App\\';
            if (strncmp($class, $prefix, strlen($prefix)) !== 0) {
                return;
            }
            $relative = substr($class, strlen($prefix));
            $file = self::$basePath . '/src/' . str_replace('\\', '/', $relative) . '.php';
            if (is_file($file)) {
                require_once $file;
            }
        });
    }

    private static function loadConfig(): void
    {
        $configFile = self::$basePath . '/config/app.php';
        if (!is_file($configFile)) {
            throw new \RuntimeException('config/app.php not found');
        }
        self::$config = require $configFile;

        // 确保运行目录存在
        foreach ((self::$config['paths'] ?? []) as $dir) {
            if (!is_dir($dir)) {
                @mkdir($dir, 0775, true);
            }
        }
    }

    private static function handleCors(): void
    {
        $cors = self::$config['cors'] ?? null;
        if (!$cors) return;

        $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
        $allowed = $cors['allow_origins'] ?? ['*'];
        if (in_array('*', $allowed, true)) {
            header('Access-Control-Allow-Origin: *');
        } elseif ($origin !== '' && in_array($origin, $allowed, true)) {
            header('Access-Control-Allow-Origin: ' . $origin);
            header('Vary: Origin');
        }
        header('Access-Control-Allow-Headers: ' . implode(', ', $cors['allow_headers'] ?? []));
        header('Access-Control-Allow-Methods: ' . implode(', ', $cors['allow_methods'] ?? []));

        if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
            http_response_code(204);
            exit;
        }
    }

    private static function logError(Throwable $e): void
    {
        $dir = self::$config['paths']['logs'] ?? sys_get_temp_dir();
        if (!is_dir($dir)) @mkdir($dir, 0775, true);
        $file = $dir . '/error-' . date('Y-m-d') . '.log';
        $msg = sprintf(
            "[%s] %s: %s in %s:%d\n%s\n\n",
            date('c'),
            get_class($e),
            $e->getMessage(),
            $e->getFile(),
            $e->getLine(),
            $e->getTraceAsString()
        );
        @file_put_contents($file, $msg, FILE_APPEND | LOCK_EX);
    }
}
