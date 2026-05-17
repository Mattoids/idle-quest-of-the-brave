<?php
declare(strict_types=1);

namespace App;

use App\Http\HttpException;
use App\Http\JsonResponse;
use App\Http\Request;
use App\Http\Response;

/**
 * 极简路由：method + path（支持 :param 路径占位）+ 链式中间件
 *
 * 用法：
 *   $r->get('/save', [SaveController::class, 'show'])->middleware(AuthMiddleware::class);
 *   $r->post('/market/buy/:id', [MarketController::class, 'buy'])->middleware(AuthMiddleware::class);
 */
final class Router
{
    /** @var array<int, array{method:string, regex:string, params:string[], handler:array|callable, middleware:string[]}> */
    private array $routes = [];

    /** 上一次注册路由的索引（用于 ->middleware() 链式附加） */
    private ?int $lastRouteRef = null;

    public function get(string $path, $handler): self    { return $this->add('GET',    $path, $handler); }
    public function post(string $path, $handler): self   { return $this->add('POST',   $path, $handler); }
    public function put(string $path, $handler): self    { return $this->add('PUT',    $path, $handler); }
    public function patch(string $path, $handler): self  { return $this->add('PATCH',  $path, $handler); }
    public function delete(string $path, $handler): self { return $this->add('DELETE', $path, $handler); }

    /**
     * 附加中间件：调用方式 ->middleware(SomeClass::class) 或 ->middleware([A::class, B::class])
     */
    public function middleware($mw): self
    {
        if ($this->lastRouteRef === null) {
            throw new \LogicException('middleware() called before route registration');
        }
        $list = is_array($mw) ? $mw : [$mw];
        foreach ($list as $cls) {
            $this->routes[$this->lastRouteRef]['middleware'][] = $cls;
        }
        return $this;
    }

    private function add(string $method, string $path, $handler): self
    {
        $params = [];
        $regex = '#^' . preg_replace_callback('#:([a-zA-Z_][a-zA-Z0-9_]*)#', function ($m) use (&$params) {
            $params[] = $m[1];
            return '([^/]+)';
        }, $path) . '$#';

        $this->routes[] = [
            'method'     => $method,
            'regex'      => $regex,
            'params'     => $params,
            'handler'    => $handler,
            'middleware' => [],
        ];
        $this->lastRouteRef = array_key_last($this->routes);
        return $this;
    }

    public function dispatch(Request $req): Response
    {
        // 严格匹配 + 收集同路径不同方法 → 405
        $allowedMethods = [];
        foreach ($this->routes as $route) {
            if (preg_match($route['regex'], $req->path, $matches)) {
                if ($route['method'] !== $req->method) {
                    $allowedMethods[] = $route['method'];
                    continue;
                }
                // 填充路由参数
                array_shift($matches);
                foreach ($route['params'] as $i => $name) {
                    $req->params[$name] = $matches[$i] ?? '';
                }
                return $this->runWithMiddleware($req, $route);
            }
        }
        if (!empty($allowedMethods)) {
            return JsonResponse::error('method_not_allowed', 405, ['allow' => array_values(array_unique($allowedMethods))]);
        }
        return JsonResponse::error('not_found', 404, ['path' => $req->path]);
    }

    private function runWithMiddleware(Request $req, array $route): Response
    {
        $stack = $route['middleware'];

        $final = function (Request $req) use ($route): Response {
            $result = $this->invokeHandler($route['handler'], $req);
            if ($result instanceof Response) {
                return $result;
            }
            // 允许 handler 返回数组 → 自动包装 JsonResponse::ok
            if (is_array($result) || $result === null) {
                return JsonResponse::ok($result);
            }
            return JsonResponse::raw(['ok' => true, 'data' => $result]);
        };

        // 倒序包裹
        $next = $final;
        foreach (array_reverse($stack) as $mwClass) {
            $mw = new $mwClass();
            $currentNext = $next;
            $next = function (Request $r) use ($mw, $currentNext): Response {
                return $mw->handle($r, $currentNext);
            };
        }

        return $next($req);
    }

    /**
     * @param array|callable $handler
     */
    private function invokeHandler($handler, Request $req)
    {
        if (is_array($handler) && count($handler) === 2) {
            [$class, $method] = $handler;
            $instance = is_string($class) ? new $class() : $class;
            if (!method_exists($instance, $method)) {
                throw new \LogicException("handler {$method} not found on " . (is_string($class) ? $class : get_class($class)));
            }
            return $instance->{$method}($req);
        }
        if (is_callable($handler)) {
            return $handler($req);
        }
        throw new \LogicException('invalid route handler');
    }
}
