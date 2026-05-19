# ============================================================
# 勇者挂机传说 · 容器镜像
#   - 一个容器同时托管：前端静态资源 + PHP 后端
#   - 基础镜像：php:8.2-apache（自带 PHP + Apache，简单稳定）
#   - 启用扩展：pdo_mysql（存档持久化）、redis（缓存）、opcache（性能）
#   - 数据目录：/var/www/html/server/data（建议挂载 volume）
#
# 构建：docker build -t idle-quest-of-the-brave .
# 运行：docker run -p 80:80 idle-quest-of-the-brave
# 编排：见 docker-compose.yml（含 redis / mysql）
# ============================================================

FROM php:8.2-apache

ARG DEBIAN_FRONTEND=noninteractive

# --- 系统依赖 + PHP 扩展 ---
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        libzip-dev \
        unzip \
        ca-certificates \
    && docker-php-ext-install -j$(nproc) pdo_mysql opcache zip \
    && pecl install redis \
    && docker-php-ext-enable redis \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# --- Apache 模块 + vhost 配置 ---
RUN a2enmod rewrite headers expires
COPY docker/apache.conf /etc/apache2/sites-available/000-default.conf

# --- PHP 推荐配置（生产）---
RUN { \
        echo 'memory_limit = 256M'; \
        echo 'post_max_size = 16M'; \
        echo 'upload_max_filesize = 16M'; \
        echo 'opcache.enable = 1'; \
        echo 'opcache.memory_consumption = 128'; \
        echo 'opcache.max_accelerated_files = 4000'; \
        echo 'opcache.validate_timestamps = 0'; \
        echo 'expose_php = Off'; \
    } > /usr/local/etc/php/conf.d/iqotb.ini

# --- 项目代码 ---
WORKDIR /var/www/html
COPY . /var/www/html/

# --- 数据目录权限：Apache 以 www-data 运行，必须可写 ---
RUN set -eux; \
    mkdir -p /var/www/html/server/data/saves \
             /var/www/html/server/data/market \
             /var/www/html/server/data/cache \
             /var/www/html/server/data/logs \
             /var/www/html/server/data/auth/devices \
             /var/www/html/server/data/auth/recoveries \
             /var/www/html/server/data/auth/tokens; \
    chown -R www-data:www-data /var/www/html/server/data; \
    chmod -R 775 /var/www/html/server/data

# 数据卷：方便挂出来持久化
VOLUME ["/var/www/html/server/data"]

# --- 健康检查 ---
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
    CMD curl -fsS "http://127.0.0.1/game/idle-quest-of-the-brave/health" >/dev/null || exit 1

EXPOSE 80
CMD ["apache2-foreground"]
