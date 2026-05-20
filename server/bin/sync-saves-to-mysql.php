#!/usr/bin/env php
<?php
declare(strict_types=1);

/**
 * CLI: 将文件存档批量同步到 MySQL
 *
 * 用法：
 *   php server/bin/sync-saves-to-mysql.php
 *
 * 用途：
 *   - MySQL 曾经离线导致遗漏写入时，手动补偿同步
 *   - 可加入 crontab 定期执行（如每 5 分钟），保证 MySQL 始终与文件一致
 *
 * 环境要求：
 *   - 与 server/public/index.php 相同的 PHP 环境
 *   - MySQL 配置正确且 enabled=true
 */

require_once __DIR__ . '/../src/Bootstrap.php';

App\Bootstrap::run(__DIR__ . '/../');

use App\Storage\SaveRepository;

$saves = new SaveRepository();

// 1. 先补偿之前写入失败的队列
echo "[1/2] 补偿待同步队列...\n";
$p = $saves->syncPendingToMysql();
echo "    待同步: {$p['total']}, 成功: {$p['synced']}, 失败: {$p['failed']}\n";

// 2. 全量扫描文件存档，同步缺失 / 过期的记录
echo "[2/2] 全量扫描文件存档同步到 MySQL...\n";
$r = $saves->syncAllToMysql();
echo "    扫描总数: {$r['total']}, 成功同步: {$r['synced']}, 失败: {$r['failed']}\n";

echo "Done.\n";
