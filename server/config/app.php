<?php
declare(strict_types=1);

/**
 * 应用配置
 *
 * 可通过环境变量覆盖；也可创建 config/local.php 返回部分覆盖数组（被 .gitignore 排除）。
 */

$dataDir = dirname(__DIR__) . '/data';

$base = [
    // 当前部署环境：development | production
    'env' => getenv('APP_ENV') ?: 'development',

    // 调试模式：true 时返回详细错误堆栈
    'debug' => filter_var(getenv('APP_DEBUG') ?: 'true', FILTER_VALIDATE_BOOLEAN),

    // 数据根目录
    'data_dir' => $dataDir,

    'paths' => [
        'saves'  => $dataDir . '/saves',
        'market' => $dataDir . '/market',
        'cache'  => $dataDir . '/cache',
        'logs'   => $dataDir . '/logs',
    ],

    // 缓存驱动：apcu | file
    'cache' => [
        'driver' => extension_loaded('apcu') && ini_get('apc.enable_cli') ? 'apcu' : 'file',
        'prefix' => 'iqotb:',
        // 文件缓存 TTL 扫描间隔（秒）
        'gc_probability' => 0.01,
    ],

    // ---------------- 存档持久化 ----------------
    // 三级存储：Redis（实时缓存，优先）+ MySQL（持久备份，仅 save）+ File（兜底）
    // 任何一层异常都会自动降级，保证至少一层可用
    'storage' => [
        // 是否启用 Redis 加速；未启用 / 连接失败时直接走 MySQL → File
        'redis' => [
            'enabled' => filter_var(getenv('REDIS_ENABLED') ?: 'false', FILTER_VALIDATE_BOOLEAN),
            'host'    => getenv('REDIS_HOST') ?: '127.0.0.1',
            'port'    => (int) (getenv('REDIS_PORT') ?: 6379),
            'auth'    => getenv('REDIS_AUTH') ?: null,
            'db'      => (int) (getenv('REDIS_DB') ?: 0),
            // 连接超时（秒）
            'timeout' => 1.0,
            // save 在 Redis 中的 TTL（0 = 永久；> 0 可避免脏数据）
            'ttl'     => 0,
            'prefix'  => 'iqotb:save:',
        ],
        // 是否启用 MySQL 持久化；未启用 / 连接失败时存档完全走 File
        // 仅用于"存档信息"持久化，不影响 market / auth
        'mysql' => [
            'enabled'  => filter_var(getenv('MYSQL_ENABLED') ?: 'false', FILTER_VALIDATE_BOOLEAN),
            'host'     => getenv('MYSQL_HOST') ?: '127.0.0.1',
            'port'     => (int) (getenv('MYSQL_PORT') ?: 3306),
            'database' => getenv('MYSQL_DATABASE') ?: 'iqotb',
            'username' => getenv('MYSQL_USERNAME') ?: 'iqotb',
            'password' => getenv('MYSQL_PASSWORD') ?: '',
            'charset'  => 'utf8mb4',
        ],
    ],

    // 认证配置
    'auth' => [
        // token 有效期（秒）
        'token_ttl' => 86400 * 30, // 30 天
        // 设备 ID 哈希盐
        'device_salt' => getenv('AUTH_DEVICE_SALT') ?: 'iqotb-device-salt-change-me',
        // 恢复码字符集与长度
        'recovery_length' => 24,
    ],

    // 游戏相关配置
    'game' => [
        // 单次战斗动作间隔下限（毫秒），用于反作弊节流
        'min_action_interval_ms' => 80,
        // 自动战斗 tick 最大批处理次数
        'max_tick_batch' => 200,
        // 挂售有效期（秒）
        'listing_ttl' => 7 * 86400,
        // 单用户最大挂售数
        'listing_per_user_max' => 30,
    ],

    // OAuth 授权配置（药丸 / invites.fun）
    'oauth' => [
        'enabled'       => filter_var(getenv('OAUTH_ENABLED') ?: 'false', FILTER_VALIDATE_BOOLEAN),
        'client_id'     => getenv('OAUTH_CLIENT_ID') ?: '',
        'client_secret' => getenv('OAUTH_CLIENT_SECRET') ?: '',
        'base_url'      => rtrim(getenv('OAUTH_BASE_URL') ?: 'https://www.invites.fun', '/'),
        'redirect_uri'  => getenv('OAUTH_REDIRECT_URI') ?: '',
        'scope'         => getenv('OAUTH_SCOPE') ?: 'user.read',
    ],

    // CORS 允许的来源（开发期可放宽）
    'cors' => [
        'allow_origins' => ['*'],
        'allow_headers' => ['Content-Type', 'Authorization', 'X-Device-Id'],
        'allow_methods' => ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    ],
];

// 允许 config/local.php 覆盖任意键
$localFile = __DIR__ . '/local.php';
if (is_file($localFile)) {
    $override = require $localFile;
    if (is_array($override)) {
        $base = array_replace_recursive($base, $override);
    }
}

return $base;
