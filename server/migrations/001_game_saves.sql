-- 勇者挂机传说 · 存档持久化表（MySQL）
-- 用途：仅作为存档持久化备份；market / auth 数据仍走文件系统
-- 触发：MysqlStore 启动时自动 CREATE IF NOT EXISTS，无需手动跑这个文件

CREATE TABLE IF NOT EXISTS game_saves (
    device_hash CHAR(64)    NOT NULL                                COMMENT '设备哈希（sha256(device_id + salt)），同一用户跨设备共享',
    payload     LONGTEXT    NOT NULL                                COMMENT '存档完整 JSON：{device_hash, schema_version, created_at, updated_at, player, world, battle, meta}',
    updated_at  BIGINT      NOT NULL                                COMMENT '最近一次写入的 Unix 秒级时间戳；与 payload.updated_at 一致',
    created_at  BIGINT      NOT NULL                                COMMENT '存档首次创建的 Unix 秒级时间戳；与 payload.created_at 一致',
    PRIMARY KEY (device_hash),
    INDEX idx_updated (updated_at)                                  COMMENT '按更新时间过滤的辅助索引（用于离线挂机统计 / 数据治理）'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='勇者挂机传说 玩家存档主表（Redis miss 时回源/兜底）';
