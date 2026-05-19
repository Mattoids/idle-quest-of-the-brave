# 🐛 后端化回归 BUG 清单 / 待处理

> 背景：存档 + 战斗 + NPC + 技能 + 市场 + 进度全部搬到 `server/` 后，前后端对接出现一批异常。本文档列出所有待处理项，按"根因 → 严重 → 高 → 中"排序。
> 创建于 2026-05-19。

---

## 🩸 根因（必须最先解决）

### [x] R1. 双轨写存档：前端 30s 整存档 PUT 与服务端权威写库打架

- **现象**：玩家在 NPC（铁匠/商店/客栈/精神/鉴定/技能）或战斗中改完的数据，30 秒内可能被前端旧快照 PUT 覆盖回去——表现为"金币偶尔回滚、刚买的装备消失、技能等级反复、击杀数被吞"。
- **位置**：
  - `js/game.js:100-118` `_toServerSave()`
  - `js/game.js:186-189` `_serverAutosave()`
  - `js/game.js:1282-1284`（手动 saveGame 也立即 PUT）
  - `server/src/Storage/SaveRepository.php:86` `replace()` 整覆盖
- **修复方向**：
  - 联网模式禁用 `_serverAutosave`，autosave 只写本地 localStorage；
  - 或服务端 `replace` 改成"白名单字段合并"而非整覆盖；
  - 长远改为只用 `/save/diff` 增量。

---

## 🔴 严重 BUG

### [x] S1. PUT /save 把 `battle` 字段抹成 null → 战斗中保存后敌人消失 / 重连断会话

- **现象**：战斗中触发自动同步或手动保存后，下次刷新或断网重连，敌人凭空消失回到主城；自动挂机突然报 `no_active_battle`。
- **位置**：
  - `js/game.js:100-118`（`_toServerSave` 不输出 `battle`）
  - `server/src/Game/BattleEngine.php:67/77/122/477`（`replace` 总会写 battle）
  - `server/src/Controllers/SaveController.php:36-44`
- **修复方向**：`_toServerSave` 不动 battle 字段；服务端 `replace` 时若 payload 缺 `battle` 则保留旧值；或前端 PUT 改为 diff。

### [x] S2. debuff / buff 字段名前后端不一致 → 中毒 / 虚弱 / 沉默 UI 永远看不到

- **现象**：玩家被毒/被减速/被沉默时 UI 没图标、伤害 tick 也不显示。
- **位置**：
  - 服务端：`server/src/Game/BuffSystem.php:34-78`（用 `weaken / freeze / silence`，`endTime + lastTickMs + dotInterval`）
  - 前端：`js/game.js:4165-4236`（用 `weakness / fragile / slow / silence`，`endTime + nextTick + tickInterval`）
- **修复方向**：统一到服务端命名；或在 `_applyServerSave` / `_applyBattleResult` 做字段映射层。

### [x] S3. `_renderBattleLogs` 漏处理大量事件类型 → 玩家看不到反馈

- **现象**：被毒/燃烧悄无声息扣血、buff/debuff 过期没提示、击败 boss / 解锁无尽 / 进入下一层没日志；某些回合"啥都没发生"。
- **位置**：
  - `js/game.js:315-499` 的 `switch (t)`
  - 缺：`boss_defeated`、`endless_unlocked`、`endless_layer`、`heal`(NPC) 等
  - 未知 type 落入 default 被静默吃掉
- **修复方向**：补齐 case；增加 `default: console.warn('未知 log type', entry)` 兜底。

### [x] S4. 鉴定前 `await ApiClient.putSave(_toServerSave())` 触发竞态 → 装备 / 金币回滚

- **现象**：玩家刚打造或锻造一件装备就立即鉴定，鉴定成功后 refine / attrMult / 金币回到旧值；或鉴定时弹"金币不足"但金币明明够。
- **位置**：
  - `js/game.js:6607-6616` `appraiseEquipment` 联网分支
  - `js/game.js:6637-6643` `appraiseSkillBook` 联网分支
- **修复方向**：删除这两处 `putSave` 调用，服务端鉴定本就基于权威存档。

---

## 🟠 高 BUG

### [x] H1. 喝药水 / 客栈休息按"基础 maxHp"封顶 → 满装备时 hp 反被砍

- **现象**：满装备时实际 maxHp 800，玩家 hp=750 喝大药水后被截到基础 `player.maxHp=120`；客栈休息同理；魔力同病。
- **位置**：
  - `server/src/Game/Npc/ShopService.php:66-75`
  - `server/src/Game/Npc/InnService.php:18-19`
- **修复方向**：恢复封顶值改用 `PlayerService::computeStats($player)['maxHp']`（mp 同理）。

### [x] H2. NPC 返回 `r.player` 整体替换 → 战斗瞬态字段被吹掉

- **现象**：战斗中切到 NPC 页操作后回到战斗，技能 cd / counterState / 临时 buff 等本地字段消失，cd 重置为 0。
- **位置**：`js/game.js` 多处 `game.player = r.player`：`4063 / 4097 / 5229 / 5540 / 5751 / 5858 / 6701` 等。
- **修复方向**：改为合并 `game.player = { ...game.player, ...r.player }`，或显式列出要从服务端覆盖的字段（gold / equipmentBag / equipments / items / skills / treasures / skillBooks / 等级属性 ...）。

### [x] H3. 新号首次 `claimOffline` 永远返回 0

- **现象**：新建账号挂机一夜回来，离线收益显示 0；老账号正常。
- **位置**：
  - `server/src/Game/OfflineService.php:30-37`（`if ($last <= 0) return 0`）
  - 默认存档创建时 `lastBattleEndTime` 为 null：`server/src/Game/Defaults.php`
- **修复方向**：创建存档时初始化 `world.lastBattleEndTime = time() * 1000`。

### [x] H4. 离线收益可能虚高：`world.lastBattleEndTime` 被前端旧值反向 PUT 覆盖

- **现象**：战斗后立即关闭页面，几小时后再打开，`offline_ms` 算成"很久之前到现在"，收益异常多。
- **位置**：
  - `js/game.js:114, 294-308`（`_applyBattleResult` 不同步 `world.lastBattleEndTime`）
  - `server/src/Game/BattleEngine.php:440`
- **修复方向**：战斗结果里下发并应用 `world.lastBattleEndTime`；或服务端 PUT 时忽略该字段。

### [~] H5. `_toServerSave` 漏 world 字段 → 一次 PUT 后清空

复核：前端 `let game = {}` 顶层并不存在 `endlessLayer / exploredAreas / achievements / bossLog` 等字段，agent 的报告在这一项属误判；当前 `_toServerSave` 已覆盖所有前端真实使用的字段。无需修复，标记 ~（无需处理）。

- **现象**：`endlessLayer / exploredAreas / achievements / bossLog` 等字段一次 PUT 后变 undefined，前端表现为"无尽层数被重置 / 成就清空"。
- **位置**：
  - `js/game.js:101-118`（_toServerSave 字段集合不全）
  - `server/src/Game/Defaults.php:39-59`（服务端 world 默认也未声明）
- **修复方向**：补齐字段，并在 SaveController::replace 做白名单合并。

### [x] H6. 切后台几分钟回来 → `autoTick` 一次结算上百回合，日志洪水 / 瞬间死亡

- **现象**：浏览器 hidden 时 `setTimeout` 被节流到 1s，回到前台一次 tick 跑 `max_tick_batch=200` 回合，日志洪水刷屏，hp 瞬间扣到 0 触发 `player_died`。
- **位置**：
  - `server/src/Game/BattleEngine.php:241-290`
  - `js/game.js:2867-2895`
- **修复方向**：hidden 时降 tick 频率；或服务端走"批量快速结算/合并日志"路径；前端对超大 log 做折叠。

---

## 🟡 中 BUG

### [x] M1. 铁匠 refine 失败损毁装备后 `bagIndex` 错位

- **现象**：连续锻造两件相邻装备，第一件失败损毁（splice），第二件按旧 bagIndex 点击会作用到错的装备甚至超界。
- **位置**：
  - `server/src/Game/Npc/BlacksmithService.php:115` `array_splice`
  - `js/game.js:5740-5766`
- **修复方向**：后端给每件装备配稳定 uuid；前端重画后禁用旧按钮一帧。

### [~] M2. 技能 cd / mp 客户端本地状态与服务端时钟漂移 → 显示可释放但服务端拒绝

复核：当前 BattleNet.castSkill 在抛错时已 return null 静默吃掉错误（见 game.js 内 `catch` 分支），不会向用户弹 toast；前端按本地 cd/mp 判断，服务端拒绝时仅日志不弹窗。实际影响很轻，暂不深改（如需彻底解决需服务端在每次 attack/tick 回传 player.skills 的 cooldownEnd 由前端覆盖）。

- **现象**：客户端显示"技能可释放"，点击后弹 `skill_cooldown / insufficient_mp`。
- **位置**：
  - `server/src/Game/SkillEngine.php:38-46`
  - `js/game.js:4804-4811`
- **修复方向**：用服务端时钟回写 `cooldownEnd`；客户端被拒后静默或更新本地 cd。

### [x] M3. `BattleEngine::end` 不维护 `bossFled` → 逃跑后再挑战 boss 报 `insufficient_clues`

- **现象**：玩家中途 end 一场 boss 战，再点"前往 boss 房间"会因为线索被清而被拒绝。
- **位置**：`server/src/Game/BattleEngine.php:72-81`
- **修复方向**：end 时若 fightingBoss=true，标记 `world.bossFled[area]=true` 而不清线索；或保留线索数。

### [x] M4. 联网下 `_serverBoot` 拉到 `currentArea>=15` 却走本地 `spawnEnemy()`

- **现象**：进入无尽模式刷新页面后，前端看到的怪与服务端不一致（基础模板 vs endless 强化怪），直到下一次 attack 才同步。
- **位置**：
  - `js/game.js:160-163, 1791-1815`
  - `server/src/Game/EndlessService.php:26-35`
- **修复方向**：`_serverBoot` 检测 `currentArea>=15` 时直接调 `BattleNet.start(currentArea)`，不走本地 spawnEnemy。

### [~] M5. NPC mutate 期间无并发锁 → 多 tab / 快速点击 lost-update

复核：`FileStore::update` 已经用 `flock(LOCK_EX)` 包裹了"读+改+写"全流程（见 server/src/Storage/FileStore.php:81-110），单设备多 tab 并发安全在存储层已有保证；遗留隐患是 BattleEngine 内部部分路径走 `replace` 而非 `mutate`（读旧 → 写整 save），可能覆盖期间其他写入。配合 R1（前端不再 PUT）后实际影响很小，留作后续重构。

- **现象**：双开页面同时点"打造"，金币只扣一次但拿到两件装备；铁匠 + 战斗并发时数据错乱。
- **位置**：
  - `server/src/Storage/FileStore.php`（核对 flock 实现）
  - `server/src/Storage/SaveRepository.php:103-113`
  - `BattleEngine` 用 `replace` 而非 `mutate`，不在同一锁域
- **修复方向**：`FileStore::update` 用 `flock(LOCK_EX)` 包裹读+写；BattleEngine 改成 `mutate`。

### [x] M6. `addTreasure` 只认 `$drop['id']`，不兼容 `treasureId`

- **现象**：偶发 `Undefined array key "id"` 异常或宝物入背包但 level 错。
- **位置**：`server/src/Game/PlayerService.php:142-156`
- **修复方向**：兼容 `treasureId` / `id` 两种 key，或在 DropTable 出口统一。

---

## 📌 建议修复顺序

1. **先关掉双轨写**（R1 + S1）—— 是 80% 异常的源头，改完很多"偶发"问题会自动消失。
2. **补齐 `_renderBattleLogs` switch + 统一 buff/debuff 字段命名**（S2 + S3）—— 让 UI 至少能正确反映服务端真实状态，方便后续调试。
3. **删除鉴定前的 putSave + NPC 用合并赋值**（S4 + H2）。
4. **后端 maxHp/maxMp 取计算值 + 加 flock 锁**（H1 + M5）。
5. **离线收益相关、无尽模式同步**（H3 / H4 / M4）。
6. **剩下字段补齐、log 折叠、bagIndex 改 uuid**（H5 / H6 / M1 / M2 / M3 / M6）。

---

## 📝 进展记录

> 修完一条勾掉对应 checkbox，并在此处加一行说明。

### 2026-05-20 第四轮：联网体验打磨 + 跨设备恢复 + Redis/MySQL（v4.0）

- **存档对象字段修复**：PHP `json_decode($raw, true)` 把空 `{}` 解成空数组 `[]`，前端在数组上设字符串属性后 `JSON.stringify` 丢失 → `SaveRepository::normalize()` 把已知 object 字段强制 `stdClass` 序列化为 `{}`；前端 `_normalizePlayerObjectFields` 二次防御。
- **三级存储**：`RedisStore` + `MysqlStore` + `FileStore` 组合：Redis 读优先、MySQL 持久备份（仅存档）、File 兜底 + 锁。每层 try/catch + `disabled` 旗标自动降级。配置见 `config/app.php → storage.*`，`config/local.example.php` 提供本地模板。
- **数据库迁移加字段备注**：`migrations/001_game_saves.sql` 和 `MysqlStore::ensureSchema` 全字段 + 表都加 `COMMENT`。
- **市场显示自己的挂售**：`MarketController::listings` 移除默认 `exclude_seller`，每条 listing 加 `is_mine` 标记；前端 `_renderListingCard` 自己的卡片金边 + "我的"徽章 + "↩️ 取消挂售"按钮（不能买自己）；新增 `cancelListing(type, id)`。
- **能力升级 / 装备穿戴 / 出售 / 强化 / 锁定 等本地操作不丢失**：新增 `_diffSyncPlayer(fields)` helper，调 `/save/diff` 局部同步；应用到 `buyUpgrade / equipItem / unequipItem / sellEquipment / sellItem / sellSkillBook / sellTreasure / strengthenTreasure / toggleTreasureLock`。
- **自动开关持久化**：`toggleAutoRecover / toggleAutoStrengthen / toggleAutoSell` 通过 `/save/diff` 同步 `world.*`；`saveGame / loadGame / init` 也保存读取 `autoRecover / inCity`。
- **联网自动施法 cd 同步**：`SkillEngine::cast` / `pickAutoSkill` 接受可选 `nowMs` 参数；`BattleEngine::autoTick` 每回合传 `simNow`，让 cd 在批量内按攻速节奏自然流逝（之前每个 batch 内技能最多触发 1 次）。
- **每回合标量字段下发**：round 数据新增 `player_state`（gold/exp/level/maxExp/kills/atk/def/spi/maxHp/maxMp/crit/critDmg/vamp 等）→ 前端 `Object.assign(game.player, round.player_state)`，**战斗中掉落金币 / 经验 / 升级实时刷新**。
- **技能 cd 进度条不超限**：`_playBattleRounds` 同步 `round.skills` 时 clamp `cooldownEnd` ≤ `Date.now() + skill.cooldown`；`updateSkillButtons` 渲染时再 `Math.min(skill.cooldown, ...)` 二次 clamp。
- **联网自动喝药**：新增 `_autoRecoverNet()`，autoBattleLoop 联网分支每个 batch 播完后调用一次；按 `game.autoRecover` 开关决定是否吃药，通过 `/npc/shop/use` 服务端扣药水；药水耗尽自动关闭开关。
- **刷新后地图选项与中间内容一致**：`saveGame / loadGame / init` 增加 `inCity` 字段；`_serverBoot` 同步存档后按 `game.inCity` 切换 `showNpcView() / showBattleView()`。
- **BOSS 战死亡丢失 BOSS 进度**：`BattleEngine::finalize` 和 `autoTick` 内的玩家死亡分支都加：若死在 boss 战，清 `clues[area]=0` + 标 `bossFled[area]=true`；前端 `_renderBattleLogs` 新增 `boss_fled` case，同步本地状态并提示。
- **URL 跨设备共享存档**：服务端新增 `POST /auth/by-hash { device_hash }` → 直接颁发 token；前端 `ApiClient.ensureSession` 检测 `?device_hash=xxx`（64 位 hex hash）→ 调 `/auth/by-hash` 换 token、清 URL 参数；不存在时 fallback 到本地账号。
- **顶部 GitHub 链接**：右上角 fixed 浮动按钮指向仓库。
- **顶部隐藏 "存档自动同步" 文字**（联网模式下移动到服务端，不需要 UI 提示）。

### 2026-05-19 第三轮：批量战斗 30 回合 + 前端逐步回放

- 后端 `BattleEngine::autoTick($deviceHash, $rounds = 30)` 重写为"批量回合制"：
  - 一次请求固定计算 30 回合（buff tick + 自动施法 + 玩家普攻 + 敌人反击 + 死亡结算 + spawn 下个敌人）
  - 每回合输出 `{round, ts_offset_ms, log, player_hp, enemy_hp, enemy}` 供前端按节奏渲染
  - 提前结束：玩家死亡 / 普通 BOSS 击败 / 服务端切回主城
  - 返回多带 `rounds / duration_ms / aspd_ms / ended_early`，旧字段 `log / session / player / world` 保留
- 后端节流：在 `session.next_batch_at_ms = nowMs + duration_ms` 写入；下次请求若 `nowMs < next_batch_at_ms` 抛 `HttpException::tooMany('batch_in_progress', { wait_ms })`，`HttpException::tooMany` 第二参数补成 `?array $details`。
- 前端 `BattleNet.tick(rounds = 30)` 把 rounds 透传到 `/battle/tick`；收到 `batch_in_progress` 时返回 `{ _waitMs }` 让 autoBattleLoop 等待后再试。
- 前端新增 `_playBattleRounds(result)`：按 `aspd_ms` 间隔 await 逐回合渲染 log + 同步 player_hp/enemy_hp/enemy；全部播完才 resolve，autoBattleLoop 才会发下一次请求。中途 stopAutoBattle / 切回主城会立即中断回放。
- 前端 `autoBattleLoop` 联网分支彻底改造：拿到 result → `await _playBattleRounds(r)` → 提前结束就 stopAutoBattle / 否则 50ms 后下一次。日志洪水折叠 / hidden 时降频不再需要（节流由服务端 + 客户端自身节奏共同保证）。

### 2026-05-19 第二轮：自动施法决策搬到后端

- 新增 `SkillEngine::pickAutoSkill($player, $enemy, $stats)`：完全复刻原前端 `tryAutoCastSkill` 的优先级（沉默/眩晕 / 战斗外 → 跳过；hp<70% 选治疗；无 shield 选 buff；否则按伤害最高选输出）。
- `BattleEngine::autoTick` 在 tick 流程中调用 `pickAutoSkill`，命中时走 `SkillEngine::cast` + 反击；try/catch 静默吃 cd 漂移等竞态错误，避免阻塞 tick。
- `js/game.js::autoBattleLoop` 联网分支移除 `tryAutoCastSkill()` 调用——前端不再做技能决策，连"用哪个技能"都由服务端 tick 内部决定。
- 手动点击的 `castSkill(id)` 入口保留（用户主动施法 → `BattleNet.castSkill` 仍然走 /battle/skill）。
- 离线兜底分支保留（断网时前端继续跑），不影响联网态的服务端权威。

### 2026-05-19 第一轮修复（一次性提交）

- **R1 / S1**：`js/game.js` 中 `_serverAutosave` 改为 no-op，`saveGame()` 联网时不再 PUT；`SaveController::replace` 丢弃前端传入的 `battle` 字段；`SaveRepository::replace` 在 payload 缺 `battle` 时保留旧值。
- **S2**：`js/game.js` 中 `getPlayerStats` / `cleanExpiredDebuffs` / `getActiveDebuffs` 同时识别前后端两套 debuff 命名（`weakness↔curse`、`fragile↔weaken`、`slow↔freeze`）。
- **S3**：`_renderBattleLogs` 的 default 分支增加 `console.warn` 兜底；附带把超过 30 条的批量日志折叠成摘要（顺手解 H6）。
- **S4**：删除 `appraiseEquipment` / `appraiseBook` 调用前的 `putSave`，避免覆盖刚成功的鉴定/打造结果。
- **H1**：`ShopService::useItem` / `InnService::rest` 改为读 `PlayerService::computeStats($player)['maxHp' / 'maxMp']`，按真实最大值封顶。
- **H2**：新增 `_mergeServerPlayer(serverPlayer)` 帮助函数，所有 `game.player = r.player` 全部替换为浅合并，保留本地瞬态字段。
- **H3**：`Defaults::world()` 默认 `lastBattleEndTime = time()*1000`，新号首次 claimOffline 不再 0。
- **H4**：`BattleEngine::finalize / start / startBoss / end / status` 返回值带上 `world`；前端 `_applyBattleResult` 同步 `world.lastBattleEndTime / currentArea / bossDefeated / fightingBoss / inCity / clues / bossFled`。
- **H6**：`autoBattleLoop` 联网态在 `document.hidden` 时把下一轮 setTimeout 提高到 1500ms；`_renderBattleLogs` 折叠超过 30 条的批量日志为一条摘要。
- **M1**：新增 `_npcCallLock` 串行锁，`refineEquipment` 调用前加锁，防止快点导致 bagIndex 错位。
- **M3**：`BattleEngine::end` 在清缓存前读取 session，是 boss 战时标记 `world.bossFled[area]`。
- **M4**：`_serverBoot` 检测到联网态 + `currentArea>=15` + 无 active battle 时主动 `BattleNet.start`。
- **M6**：`PlayerService::addTreasure` 兼容 `id / treasureId / tid` 三种 key。

### 复核为非问题 / 暂不深改

- **H5**：复核 `let game = {}` 顶层字段，并不存在 `endlessLayer / exploredAreas / achievements / bossLog` 等被 agent 推测的字段；当前 `_toServerSave` 已覆盖前端真实使用的所有 world 字段。
- **M2**：BattleNet.castSkill 已在 `catch` 中静默返回 null，cd 漂移时不会弹错误 toast；前端按本地 cd/mp 判断，体验可接受。彻底解决需后端在每次回包带上 player.skills 的 cooldownEnd，留待后续。
- **M5**：`FileStore::update` 已用 `flock(LOCK_EX)` 保证读+改+写原子性。遗留隐患是 BattleEngine 部分路径走 `replace` 而非 `mutate`，配合 R1 关掉前端 PUT 后实际影响很小。

