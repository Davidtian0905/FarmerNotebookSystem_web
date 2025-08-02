-- 创建数据库
CREATE DATABASE IF NOT EXISTS farmer_notebook DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE farmer_notebook;

-- 用户表
CREATE TABLE IF NOT EXISTS `user` (
    `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `username` varchar(50) NOT NULL COMMENT '用户名',
    `password` varchar(100) NOT NULL COMMENT '密码',
    `nickname` varchar(50) DEFAULT NULL COMMENT '昵称',
    `phone` varchar(20) DEFAULT NULL COMMENT '手机号',
    `email` varchar(100) DEFAULT NULL COMMENT '邮箱',
    `avatar` varchar(255) DEFAULT NULL COMMENT '头像',
    `status` tinyint(1) DEFAULT 1 COMMENT '状态（0：禁用，1：启用）',
    `role` varchar(20) DEFAULT 'USER' COMMENT '角色（ADMIN：管理员，USER：普通用户）',
    `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` tinyint(1) DEFAULT 0 COMMENT '逻辑删除标识（0：未删除，1：已删除）',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

-- 笔记本表
CREATE TABLE IF NOT EXISTS `notebook` (
    `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `user_id` bigint(20) NOT NULL COMMENT '用户ID',
    `title` varchar(200) NOT NULL COMMENT '笔记本标题',
    `content` text COMMENT '笔记本内容',
    `type` varchar(20) DEFAULT 'NOTE' COMMENT '笔记本类型（DIARY：日记，NOTE：笔记，PLAN：计划）',
    `tags` varchar(500) DEFAULT NULL COMMENT '标签',
    `status` tinyint(1) DEFAULT 0 COMMENT '状态（0：草稿，1：已发布）',
    `sort` int(11) DEFAULT 0 COMMENT '排序',
    `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` tinyint(1) DEFAULT 0 COMMENT '逻辑删除标识（0：未删除，1：已删除）',
    PRIMARY KEY (`id`),
    KEY `idx_user_id` (`user_id`),
    KEY `idx_type` (`type`),
    KEY `idx_create_time` (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='笔记本表';

-- 插入默认管理员用户（密码：admin123）
INSERT INTO `user` (`username`, `password`, `nickname`, `role`, `status`) 
VALUES ('admin', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', '管理员', 'ADMIN', 1);

-- 插入测试用户（密码：123456）
INSERT INTO `user` (`username`, `password`, `nickname`, `role`, `status`) 
VALUES ('farmer', '$2a$10$7JB720yubVSOfvVWdBYoOeymFJgXvVqHqHqHqHqHqHqHqHqHqHqHq', '农户', 'USER', 1); 