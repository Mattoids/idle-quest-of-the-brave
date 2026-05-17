<?php
declare(strict_types=1);

/**
 * 应用入口
 *
 * 运行方式：
 *   1) PHP 内置服务器（开发用）：
 *      php -S 127.0.0.1:8787 -t server/public
 *   2) Nginx + PHP-FPM：将 server/public 设为站点根，重写所有非静态请求到 index.php
 *   3) Apache：使用同目录下 .htaccess
 */

require_once __DIR__ . '/../src/Bootstrap.php';

App\Bootstrap::run(__DIR__ . '/../');
