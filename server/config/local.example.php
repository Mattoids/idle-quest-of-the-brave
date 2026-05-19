<?php
declare(strict_types=1);

/**
 * 本地配置覆盖示例（拷贝为 local.php 后生效；local.php 已被 .gitignore 排除）
 *
 *   cp config/local.example.php config/local.php
 *   # 编辑后启动 PHP server 即可生效
 *
 * 返回的数组与 config/app.php 同结构；array_replace_recursive 合并。
 */

return [
    // 启用 Redis 缓存（需要 phpredis 扩展）
    'storage' => [
        'redis' => [
            'enabled' => true,
            'host'    => '127.0.0.1',
            'port'    => 6379,
            'auth'    => null,          // 如 redis.conf 设置了 requirepass
            'db'      => 0,
            'timeout' => 1.0,
            'ttl'     => 0,             // 0 = 永久；> 0 启用 TTL（秒）
            'prefix'  => 'iqotb:save:',
        ],
        'mysql' => [
            'enabled'  => true,
            'host'     => '127.0.0.1',
            'port'     => 3306,
            'database' => 'iqotb',
            'username' => 'iqotb',
            'password' => 'change-me',
            'charset'  => 'utf8mb4',
        ],
    ],

    // 生产环境关闭 debug
    // 'debug' => false,

    // 修改设备 ID 哈希盐（生产环境务必改！）
    // 'auth' => ['device_salt' => 'your-production-salt-here'],
];
