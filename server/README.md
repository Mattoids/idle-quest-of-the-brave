# 勇者挂机传说 — 服务端

服务端用于：
- 管理玩家账号与存档（每用户一个 JSON 文件）
- 后端权威跑战斗 / 掉落 / 升级，前端只能展示
- 管理交易市场：挂售、购买、取消、列表

技术栈：纯 PHP 8.1+，无框架；可选 APCu 缓存，否则文件缓存。

---

## 🚀 快速开始

```bash
cd server

# 用 PHP 内置服务器跑（开发用）
php -S 127.0.0.1:8787 -t public

# 测试
curl http://127.0.0.1:8787/health
```

部署到 Nginx / Apache：

- Nginx：把站点根设为 `server/public/`，所有非静态请求 rewrite 到 `index.php`
- Apache：直接放在 `server/public/`，已带 `.htaccess`

> 可选：执行 `composer install` 让 autoload 走 vendor；不装 composer 也能跑（Bootstrap 内置了简易 PSR-4 autoloader）。

---

## 📁 目录结构

```
server/
├── public/
│   ├── index.php          # 统一入口
│   └── .htaccess          # Apache 重写
├── config/
│   ├── app.php            # 主配置（环境变量 / .env 优先）
│   └── local.example.php  # 本地 PHP 配置覆盖模板（可选）
├── .env.example           # 本地开发环境变量模板
├── src/
│   ├── Bootstrap.php      # 启动器：autoload / .env / 配置 / CORS / dispatch
│   ├── Router.php         # 极简路由（:param + middleware）
│   ├── Routes.php         # 路由表
│   ├── Http/              # Request / Response / JsonResponse / HttpException
│   ├── Util/              # Random（CSPRNG） / Uuid / Json / EnvLoader
│   ├── Storage/
│   │   ├── FileStore.php          # 原子读写 + flock
│   │   ├── Cache.php              # APCu→file fallback
│   │   ├── SaveRepository.php     # 每用户一个文件
│   │   └── MarketRepository.php   # 按 type 分文件
│   ├── Auth/
│   │   ├── AuthService.php        # 设备 ID + 恢复码
│   │   ├── TokenStore.php         # token → device_hash 缓存
│   │   └── AuthMiddleware.php
│   ├── Game/
│   │   ├── Constants.php          # 区域/稀有度/爆率等常量
│   │   ├── ItemPools.php          # 完整装备/宝物/技能/商店池
│   │   ├── Defaults.php           # 默认存档
│   │   ├── DropTable.php          # 爆率验证 + 加权抽签
│   │   ├── PlayerService.php      # 升级/属性/入背包
│   │   └── BattleEngine.php       # 战斗模拟（MVP）
│   ├── Market/
│   │   └── ListingService.php     # 挂售/购买/取消
│   └── Controllers/
│       ├── AuthController.php
│       ├── SaveController.php
│       ├── BattleController.php
│       ├── MarketController.php
│       └── HealthController.php
└── data/
    ├── saves/<hash[0..1]>/<device_hash>.json
    ├── market/listings.{eq|tr|it|sb}.json
    ├── auth/devices/<hash[0..1]>/<device_hash>.json
    ├── auth/recoveries/<hash[0..1]>/<recovery_hash>.json
    ├── cache/                     # 文件缓存
    └── logs/                      # 错误日志
```

---

## 🔐 身份与认证

### 注册流程

服务端生成 `device_id`（UUID v4）+ `recovery_code`（24 字符可读码），返回 `token`：

```bash
curl -X POST http://127.0.0.1:8787/auth/register \
     -H 'Content-Type: application/json' \
     -d '{"meta":{"client_version":"v3.4"}}'
```

返回：

```json
{
  "ok": true,
  "data": {
    "device_id": "8e8c8a9c-...",
    "recovery_code": "ABCD-EFGH-JKMN-PQRS-TUVW-XYZ2",
    "token": "Xv3uQ...",
    "note": "请妥善保存 recovery_code..."
  }
}
```

客户端应把 `device_id` + `token` 写入 `localStorage`，把 `recovery_code` 显式提示用户保存。

### 登录 / 恢复

```bash
# 凭 device_id 登录
curl -X POST .../auth/login -d '{"device_id":"..."}'

# 跨设备恢复（凭 recovery_code）
curl -X POST .../auth/recover -d '{"recovery_code":"ABCD-..."}'
```

### 后续请求

```
Authorization: Bearer <token>
```

中间件 `AuthMiddleware` 会把 `device_hash` 注入到 Request，供下游 Controller 使用。

`device_hash = sha256(device_id + salt)`，存档与挂售都以 hash 为主键，**服务端不保存 device_id 原文**。

---

## 📦 API 一览

| 方法 | 路径 | 鉴权 | 说明 |
|------|------|------|------|
| GET  | `/health`            | -  | 心跳 + 版本信息 |
| GET  | `/data/constants`    | -  | 暴露只读常量（区域、稀有度权重、爆率） |
| POST | `/auth/register`     | -  | 注册新账号，返回 device_id + recovery_code + token |
| POST | `/auth/login`        | -  | 凭 device_id 登录，获取 token |
| POST | `/auth/recover`      | -  | 凭 recovery_code 恢复账号 |
| POST | `/auth/logout`       | ✅ | 注销当前 token |
| POST | `/auth/rotate-recovery` | ✅ | 重置恢复码（旧码失效） |
| GET  | `/save`              | ✅ | 获取存档 |
| PUT  | `/save`              | ✅ | 覆盖存档（仅调试/迁移用） |
| POST | `/save/diff`         | ✅ | 局部更新：`{ "changes": { "player.gold": 100 } }` |
| POST | `/battle/start`      | ✅ | `{ area: 0 }` 进入指定区域 |
| POST | `/battle/attack`     | ✅ | 玩家普攻一次（节流：≥ min_action_interval_ms） |
| POST | `/battle/tick`       | ✅ | 自动战斗心跳，服务端按 elapsed_ms / aspd 批量结算（上限 max_tick_batch） |
| GET  | `/battle/status`     | ✅ | 查看当前战斗状态 |
| POST | `/battle/end`        | ✅ | 主动退出战斗 |
| GET  | `/market/listings?type=eq` | -  | 列出在售挂售 |
| GET  | `/market/listings/:type/:id` | - | 查看某个挂售 |
| POST | `/market/list`       | ✅ | 挂售：`{ type, payload, price_gold }` |
| POST | `/market/buy`        | ✅ | 购买：`{ type, id }` |
| POST | `/market/cancel`     | ✅ | 取消：`{ type, id }`，物品归还 |
| GET  | `/market/my`         | ✅ | 我的挂售（按 type 分组） |

### 统一响应

```json
{ "ok": true,  "data": { ... } }
{ "ok": false, "error": "code", "details": { ... } }
```

### 市场物品类型 `type`

| type | 说明 | payload 关键字段 |
|------|------|----------------|
| `eq` | 装备 | `id, level, refine, attrMult, appraised` |
| `tr` | 宝物 | `id, level` |
| `it` | 道具 | `id, count` |
| `sb` | 技能书 | `id, count, appraised, skillId` |

挂售时服务端会做：
1. `id` 是否在 `EQUIPMENT_POOL / TREASURE_POOL / SHOP_ITEMS / SKILL_BOOKS` 中
2. 物品是否真的在玩家背包（装备会按 id+level+refine+attrMult+appraised 完整匹配）
3. 卖家挂售数 ≤ `game.listing_per_user_max`
4. 价格 ∈ [1, 1e8]
5. 锁定的宝物不可上架

---

## 🎲 防作弊设计

| 风险 | 处置 |
|------|------|
| 客户端伪造伤害 / 掉落 | 全部由 `BattleEngine` + `DropTable` 服务端计算；客户端只发"开始/普攻/技能/tick" 指令 |
| 客户端复制金币 | 金币变更全部走 `BattleEngine::processKill` 或 `ListingService` 流水线，`SaveController` 的 diff 路径限可写字段且不参与战斗结算 |
| 客户端加速攻击 | `min_action_interval_ms` 节流 + 服务端 `aspd_ms` 校验，超频返回 429 |
| 自动战斗刷分 | `max_tick_batch` 上限，单次 tick 最多模拟 N 次攻击 |
| 客户端 seed 注入 | 所有随机走 `Util\Random`（`random_int` CSPRNG），从不读取客户端 seed |
| 挂售卖虚物 | 挂售时立即从背包扣除，并完整匹配 payload；id 不在物品池直接拒 |
| 重复购买 | 挂售带 `status: open|sold|cancelled|expired`，buy 时锁状态切换；同一时刻只能成交一次（文件锁串行） |

---

## ⚙️ 配置

### 方式一：.env 文件（推荐）

启动时会自动加载 `server/.env`（默认）和项目根目录 `.env`（覆盖）。

```bash
cp .env.example .env
# 编辑 .env 修改以下关键项
```

常用环境变量：

| 变量 | 说明 | 示例 |
|------|------|------|
| `APP_ENV` | 运行环境 | `development` / `production` |
| `APP_DEBUG` | 调试模式 | `true` / `false` |
| `AUTH_DEVICE_SALT` | 设备哈希盐（**生产务必修改**） | `your-random-salt` |
| `REDIS_ENABLED` | 是否启用 Redis | `false` / `true` |
| `REDIS_HOST` / `REDIS_PORT` | Redis 地址 | `127.0.0.1` / `6379` |
| `MYSQL_ENABLED` | 是否启用 MySQL | `false` / `true` |
| `MYSQL_HOST` / `MYSQL_PORT` / `MYSQL_DATABASE` / `MYSQL_USERNAME` / `MYSQL_PASSWORD` | MySQL 连接信息 | `127.0.0.1` / `3306` / `iqotb` / `iqotb` / `your-password` |

### 方式二：local.php（复杂配置覆盖）

如需更细粒度的配置覆盖（如自定义路径、CORS 规则等）：

```bash
cp config/local.example.php config/local.php
# 编辑 local.php，返回部分配置数组即可覆盖
```

### 配置优先级

系统环境变量 > 根目录 `.env` > `server/.env` > `config/local.php` > `config/app.php` 默认值

### `config/app.php` 关键项（代码级默认值）

```php
'auth' => [
    'token_ttl'        => 86400 * 30,    // 30 天
    'device_salt'      => 'change-me',    // 哈希盐，生产务必改
    'recovery_length'  => 24,
],
'game' => [
    'min_action_interval_ms' => 80,       // 攻击下限间隔
    'max_tick_batch'         => 200,      // 单次 tick 模拟上限
    'listing_ttl'            => 7 * 86400,
    'listing_per_user_max'   => 30,
],
'cache' => [
    'driver' => 'apcu',   // 或 'file'
    'prefix' => 'iqotb:',
],
```

### 生产部署清单
- [ ] 修改 `.env` 中的 `AUTH_DEVICE_SALT`
- [ ] `.env` 中设置 `APP_DEBUG=false`
- [ ] 启用 OPcache + APCu
- [ ] `data/` 目录写权限给 web 用户
- [ ] CORS 白名单收紧到游戏域名
- [ ] Nginx 限频（`limit_req`）作为节流后备

---

## 🧪 端到端示例

```bash
# 1) 注册
RESP=$(curl -s -X POST localhost:8787/auth/register -H 'Content-Type: application/json' -d '{}')
TOKEN=$(echo "$RESP" | jq -r .data.token)

# 2) 拿存档
curl -s localhost:8787/save -H "Authorization: Bearer $TOKEN" | jq .data.player.level

# 3) 进入新手村
curl -s -X POST localhost:8787/battle/start -H "Authorization: Bearer $TOKEN" \
     -H 'Content-Type: application/json' -d '{"area":0}'

# 4) 自动战斗一次（按 elapsed 计算）
curl -s -X POST localhost:8787/battle/tick -H "Authorization: Bearer $TOKEN"

# 5) 看市场
curl -s 'localhost:8787/market/listings?type=tr'

# 6) 挂售一件宝物
curl -s -X POST localhost:8787/market/list -H "Authorization: Bearer $TOKEN" \
     -H 'Content-Type: application/json' \
     -d '{"type":"tr","payload":{"id":"w_stone","level":1},"price_gold":50}'
```

---

## 🛣️ 后续 Roadmap（本版本未实现，已留出扩展点）

战斗 MVP 只覆盖核心循环，下列高级特性需要继续按 `js/game.js` 移植：

- 技能系统：mp 消耗 / cooldown / 元素克制 / debuff
- buff/debuff：限时增减益 + 状态栏
- 怪物类型行为：吸血、闪避、狂暴、复活、施加 debuff
- 区域被动机制：燃烧/霜冻/吸血/反伤/破甲/诅咒
- BOSS 专属技能（石化、毒雾、雷霆、虚空吞噬、混沌净化）+ 反制
- 套装"虚空护盾"/"混沌逆流" 等状态
- 鉴定 / 锻造 / 强化（铁匠交互）
- 商店购买 / 客栈休息 / 学习技能 / 精神修炼
- 死亡惩罚：丢失未锁定宝物（已在战败结算中预留 placeholder）
- 无尽模式：层数推进、特有掉落、禁咒书
- 离线挂机算法：登录时按 `lastBattleEndTime` 推算补偿
- 套装效果中的 `Mult` / `tenacity` 已计算，但未应用反控（霸体）逻辑
- 排行榜、好友、聊天

数据池（`ItemPools.php`）与 `js/game.js` 中的常量必须保持一致；建议加一个对比脚本：从 `js/game.js` 抽出 `EQUIPMENT_POOL` / `TREASURE_POOL` 等，与 PHP 数组 diff，发现不一致就 fail CI。

---

## 🗂️ 数据布局示例

```
data/
├── auth/
│   ├── devices/8e/8e8c8a9c....json
│   │   { "device_hash":"...", "recovery_hash":"...", "created_at":..., "meta":{} }
│   └── recoveries/3a/3a4b....json
│       { "recovery_hash":"...", "device_hash":"..." }
├── saves/
│   └── 8e/8e8c8a9c....json
│       {
│         "device_hash":"...",
│         "schema_version":1,
│         "player": { ... },
│         "world":  { ... },
│         "battle": { ... } | null,
│         "meta":   { ... }
│       }
├── market/
│   ├── listings.eq.json
│   ├── listings.tr.json
│   ├── listings.it.json
│   └── listings.sb.json
├── cache/      # APCu 不可用时落到这里
└── logs/error-2026-05-17.log
```

存档与挂售文件都通过 `FileStore::update($path, $mutator)` 做"读-改-写"原子事务，避免并发写丢更新。

---

## 🛡️ 安全提醒

- `data/` 目录不能直接通过 HTTP 访问（已在 `.gitignore` 排除，public 入口不会路由到此）
- 生产部署务必修改 `auth.device_salt`，否则恢复码可被字典攻击
- 强烈建议在反向代理层加上 `limit_req`、`limit_conn`、TLS、HSTS
- 日志中不输出 device_id / recovery_code 原文（只有 hash 落盘）

---

## 📜 版本

服务端与前端通过 `GAME_VERSION` 对齐（`v3.4`）；不兼容升级时 `schema_version` 自增并在 `SaveController` 增加迁移分支。
