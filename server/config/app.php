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
