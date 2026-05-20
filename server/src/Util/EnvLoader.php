<?php
declare(strict_types=1);

namespace App\Util;

/**
 * 简易 .env 文件加载器（不依赖外部包）
 *
 * 规则：
 *   - 忽略空行与 # 开头的注释行
 *   - KEY=VALUE 格式，等号两侧允许空格
 *   - 值可用单/双引号包裹，引号会被去除
 *   - 已存在的环境变量不会被覆盖（Docker 注入优先）
 */
final class EnvLoader
{
    /**
     * 从 .env 文件加载环境变量。
     *
     * @param string $path      .env 文件绝对路径
     * @param bool   $overwrite 是否覆盖已存在的环境变量（默认 false：Docker / 系统注入优先）
     * @return void
     */
    public static function load(string $path, bool $overwrite = false): void
    {
        if (!is_file($path)) {
            return;
        }

        $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        if ($lines === false) {
            return;
        }

        foreach ($lines as $line) {
            $line = trim($line);

            // 跳过空行和注释
            if ($line === '' || str_starts_with($line, '#')) {
                continue;
            }

            // 只处理 KEY=VALUE 格式
            if (!str_contains($line, '=')) {
                continue;
            }

            [$key, $value] = self::parseLine($line);

            if ($key === '') {
                continue;
            }

            // 不覆盖已存在的环境变量（除非显式开启 overwrite）
            if (!$overwrite && getenv($key) !== false) {
                continue;
            }

            putenv("{$key}={$value}");
            $_ENV[$key] = $value;
        }
    }

    /**
     * 解析单行 KEY=VALUE
     */
    private static function parseLine(string $line): array
    {
        $pos = strpos($line, '=');
        if ($pos === false) {
            return ['', ''];
        }

        $key = trim(substr($line, 0, $pos));
        $value = trim(substr($line, $pos + 1));

        // 去除引号
        if (strlen($value) >= 2) {
            $first = $value[0];
            $last = $value[strlen($value) - 1];
            if (($first === '"' && $last === '"') || ($first === "'" && $last === "'")) {
                $value = substr($value, 1, -1);
            }
        }

        return [$key, $value];
    }
}
