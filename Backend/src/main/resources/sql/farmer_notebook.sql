-- 创建数据库
CREATE DATABASE IF NOT EXISTS farmer_notebook DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE farmer_notebook;

-- 用户表
CREATE TABLE IF NOT EXISTS `sys_user` (
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

-- 客户表
CREATE TABLE IF NOT EXISTS `customer` (
    `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `customer_id` varchar(50) NOT NULL COMMENT '客户编号',
    `customer_name` varchar(100) NOT NULL COMMENT '客户名称',
    `customer_phone` varchar(20) DEFAULT NULL COMMENT '客户电话',
    `customer_address` varchar(200) DEFAULT NULL COMMENT '客户地址',
    `discount_rate` decimal(3,2) DEFAULT 1.00 COMMENT '折扣率',
    `customer_contact` varchar(50) DEFAULT NULL COMMENT '联系人',
    `customer_source` varchar(50) DEFAULT NULL COMMENT '客户来源',
    `customer_category` varchar(50) DEFAULT NULL COMMENT '客户类型',
    `customer_grade` varchar(20) DEFAULT NULL COMMENT '客户等级',
    `notes` varchar(500) DEFAULT NULL COMMENT '备注信息',
    `customer_status` varchar(20) DEFAULT 'active' COMMENT '客户状态（active：活跃，disabled：已停用）',
    `transaction_count` int(11) DEFAULT 0 COMMENT '交易次数',
    `transaction_amount` decimal(12,2) DEFAULT 0.00 COMMENT '交易总金额',
    `last_transaction_time` datetime DEFAULT NULL COMMENT '最后交易时间',
    `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` tinyint(1) DEFAULT 0 COMMENT '逻辑删除标识（0：未删除，1：已删除）',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_customer_id` (`customer_id`),
    KEY `idx_customer_name` (`customer_name`),
    KEY `idx_customer_phone` (`customer_phone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='客户表';

-- 供应商表
CREATE TABLE IF NOT EXISTS `supplier` (
    `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `supplier_id` varchar(50) NOT NULL COMMENT '供应商编号',
    `supplier_name` varchar(100) NOT NULL COMMENT '供应商名称',
    `supplier_phone` varchar(20) DEFAULT NULL COMMENT '供应商电话',
    `supplier_address` varchar(200) DEFAULT NULL COMMENT '供应商地址',
    `supplier_contact` varchar(50) DEFAULT NULL COMMENT '联系人',
    `supplier_category` varchar(50) DEFAULT NULL COMMENT '供应商类型',
    `notes` varchar(500) DEFAULT NULL COMMENT '备注信息',
    `supplier_status` varchar(20) DEFAULT 'active' COMMENT '供应商状态（active：活跃，disabled：已停用）',
    `transaction_count` int(11) DEFAULT 0 COMMENT '交易次数',
    `transaction_amount` decimal(12,2) DEFAULT 0.00 COMMENT '交易总金额',
    `last_transaction_time` datetime DEFAULT NULL COMMENT '最后交易时间',
    `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` tinyint(1) DEFAULT 0 COMMENT '逻辑删除标识（0：未删除，1：已删除）',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_supplier_id` (`supplier_id`),
    KEY `idx_supplier_name` (`supplier_name`),
    KEY `idx_supplier_phone` (`supplier_phone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='供应商表';

-- 物料表
CREATE TABLE IF NOT EXISTS `material` (
    `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `material_id` varchar(50) NOT NULL COMMENT '物料编号',
    `material_name` varchar(100) NOT NULL COMMENT '物料名称',
    `material_code` varchar(50) NOT NULL COMMENT '物料编码',
    `material_type` varchar(50) DEFAULT NULL COMMENT '物料类型',
    `material_grade` varchar(20) DEFAULT NULL COMMENT '物料等级',
    `unit` varchar(20) DEFAULT NULL COMMENT '计量单位',
    `unit_price` decimal(10,2) DEFAULT 0.00 COMMENT '单价',
    `current_stock` decimal(12,2) DEFAULT 0.00 COMMENT '当前库存',
    `description` varchar(500) DEFAULT NULL COMMENT '描述',
    `images` text DEFAULT NULL COMMENT '图片（JSON格式）',
    `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` tinyint(1) DEFAULT 0 COMMENT '逻辑删除标识（0：未删除，1：已删除）',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_material_id` (`material_id`),
    UNIQUE KEY `uk_material_code` (`material_code`),
    KEY `idx_material_name` (`material_name`),
    KEY `idx_material_type` (`material_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='物料表';

-- 入库记录表
CREATE TABLE IF NOT EXISTS `inbound_record` (
    `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `inbound_id` varchar(50) NOT NULL COMMENT '入库单号',
    `material_id` varchar(50) NOT NULL COMMENT '物料编号',
    `material_name` varchar(100) NOT NULL COMMENT '物料名称',
    `material_code` varchar(50) NOT NULL COMMENT '物料编码',
    `material_type` varchar(50) DEFAULT NULL COMMENT '物料类型',
    `material_grade` varchar(20) DEFAULT NULL COMMENT '物料等级',
    `batch_number` varchar(50) DEFAULT NULL COMMENT '批次号',
    `quantity` decimal(12,2) NOT NULL COMMENT '入库数量',
    `unit` varchar(20) DEFAULT NULL COMMENT '计量单位',
    `unit_price` decimal(10,2) DEFAULT 0.00 COMMENT '单价',
    `total_price` decimal(12,2) DEFAULT 0.00 COMMENT '总金额',
    `supplier_id` varchar(50) DEFAULT NULL COMMENT '供应商编号',
    `supplier_name` varchar(100) DEFAULT NULL COMMENT '供应商名称',
    `warehouse_location` varchar(50) DEFAULT NULL COMMENT '仓库位置',
    `date` date DEFAULT NULL COMMENT '入库日期',
    `time` time DEFAULT NULL COMMENT '入库时间',
    `expiry_date` date DEFAULT NULL COMMENT '到期日期',
    `shelf_life_days` int(11) DEFAULT NULL COMMENT '保质期天数',
    `quality_status` varchar(20) DEFAULT NULL COMMENT '质检状态',
    `inspector` varchar(50) DEFAULT NULL COMMENT '检验员',
    `inspection_date` date DEFAULT NULL COMMENT '检验日期',
    `quality_remarks` varchar(500) DEFAULT NULL COMMENT '质检备注',
    `description` varchar(500) DEFAULT NULL COMMENT '备注说明',
    `images` text DEFAULT NULL COMMENT '图片（JSON格式）',
    `quality_rating` decimal(2,1) DEFAULT NULL COMMENT '质量评分',
    `delivery_rating` decimal(2,1) DEFAULT NULL COMMENT '交付评分',
    `price_rating` decimal(2,1) DEFAULT NULL COMMENT '价格评分',
    `service_rating` decimal(2,1) DEFAULT NULL COMMENT '服务评分',
    `type` varchar(20) DEFAULT 'INBOUND' COMMENT '交易类型',
    `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` tinyint(1) DEFAULT 0 COMMENT '逻辑删除标识（0：未删除，1：已删除）',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_inbound_id` (`inbound_id`),
    KEY `idx_material_id` (`material_id`),
    KEY `idx_supplier_id` (`supplier_id`),
    KEY `idx_date` (`date`),
    KEY `idx_batch_number` (`batch_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='入库记录表';

-- 入库模板表
CREATE TABLE IF NOT EXISTS `inbound_template` (
    `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `template_id` varchar(50) NOT NULL COMMENT '模板编号',
    `template_name` varchar(100) NOT NULL COMMENT '模板名称',
    `material_name` varchar(100) NOT NULL COMMENT '物料名称',
    `material_type` varchar(50) DEFAULT NULL COMMENT '物料类型',
    `material_grade` varchar(20) DEFAULT NULL COMMENT '物料等级',
    `batch_number` varchar(50) DEFAULT NULL COMMENT '批次号',
    `material_code` varchar(50) DEFAULT NULL COMMENT '物料编码',
    `unit` varchar(20) DEFAULT NULL COMMENT '计量单位',
    `quantity` decimal(12,2) DEFAULT NULL COMMENT '数量',
    `unit_price` decimal(10,2) DEFAULT 0.00 COMMENT '单价',
    `supplier_id` varchar(50) DEFAULT NULL COMMENT '供应商编号',
    `supplier_name` varchar(100) DEFAULT NULL COMMENT '供应商名称',
    `warehouse_location` varchar(50) DEFAULT NULL COMMENT '仓库位置',
    `shelf_life_days` int(11) DEFAULT NULL COMMENT '保质期天数',
    `quality_status` varchar(20) DEFAULT NULL COMMENT '质检状态',
    `description` varchar(500) DEFAULT NULL COMMENT '备注说明',
    `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` tinyint(1) DEFAULT 0 COMMENT '逻辑删除标识（0：未删除，1：已删除）',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_template_id` (`template_id`),
    KEY `idx_template_name` (`template_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='入库模板表';

-- 商品组合表
CREATE TABLE IF NOT EXISTS `product_composition` (
    `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `product_id` varchar(50) NOT NULL COMMENT '商品编号',
    `product_name` varchar(100) NOT NULL COMMENT '商品名称',
    `product_code` varchar(50) NOT NULL COMMENT '商品编码',
    `unit` varchar(20) DEFAULT NULL COMMENT '商品单位',
    `description` varchar(500) DEFAULT NULL COMMENT '商品描述',
    `images` text DEFAULT NULL COMMENT '商品图片（JSON格式）',
    `materials` text NOT NULL COMMENT '物料组合信息（JSON格式）',
    `total_material_cost` decimal(12,2) DEFAULT 0.00 COMMENT '物料总成本',
    `profit_rate` decimal(5,2) DEFAULT 0.00 COMMENT '利润率(%)',
    `suggested_price` decimal(12,2) DEFAULT 0.00 COMMENT '建议售价',
    `product_price` decimal(12,2) DEFAULT 0.00 COMMENT '商品定价',
    `expected_profit` decimal(12,2) DEFAULT 0.00 COMMENT '预期利润',
    `actual_profit_rate` decimal(5,2) DEFAULT 0.00 COMMENT '实际利润率(%)',
    `product_quantity` int(11) DEFAULT 0 COMMENT '商品数量',
    `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` tinyint(1) DEFAULT 0 COMMENT '逻辑删除标识（0：未删除，1：已删除）',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_product_id` (`product_id`),
    UNIQUE KEY `uk_product_code` (`product_code`),
    KEY `idx_product_name` (`product_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品组合表';

-- 出库记录表
CREATE TABLE IF NOT EXISTS `outbound_record` (
    `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `outbound_id` varchar(50) NOT NULL COMMENT '出库单号',
    `product_name` varchar(100) NOT NULL COMMENT '产品名称',
    `product_code` varchar(50) NOT NULL COMMENT '产品编码',
    `product_images` text DEFAULT NULL COMMENT '产品图片（JSON格式）',
    `quantity` int(11) NOT NULL COMMENT '销售数量',
    `unit` varchar(20) DEFAULT NULL COMMENT '单位',
    `unit_price` decimal(10,2) DEFAULT 0.00 COMMENT '单价',
    `total_price` decimal(12,2) DEFAULT 0.00 COMMENT '总价',
    `customer_id` varchar(50) DEFAULT NULL COMMENT '客户编号',
    `customer_name` varchar(100) DEFAULT NULL COMMENT '客户名称',
    `customer_phone` varchar(20) DEFAULT NULL COMMENT '客户电话',
    `customer_address` varchar(200) DEFAULT NULL COMMENT '客户地址',
    `customer_discount_rate` decimal(3,2) DEFAULT 1.00 COMMENT '客户折扣率',
    `discount_amount` decimal(12,2) DEFAULT 0.00 COMMENT '折扣金额',
    `final_amount` decimal(12,2) DEFAULT 0.00 COMMENT '最终金额',
    `channel` varchar(50) DEFAULT NULL COMMENT '销售渠道',
    `tags` text DEFAULT NULL COMMENT '标签（JSON格式）',
    `notes` varchar(500) DEFAULT NULL COMMENT '备注',
    `date` date DEFAULT NULL COMMENT '出库日期',
    `time` time DEFAULT NULL COMMENT '出库时间',
    `type` varchar(20) DEFAULT 'OUTBOUND' COMMENT '交易类型',
    `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` tinyint(1) DEFAULT 0 COMMENT '逻辑删除标识（0：未删除，1：已删除）',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_outbound_id` (`outbound_id`),
    KEY `idx_product_code` (`product_code`),
    KEY `idx_customer_id` (`customer_id`),
    KEY `idx_date` (`date`),
    KEY `idx_channel` (`channel`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='出库记录表';

-- 出库模板表
CREATE TABLE IF NOT EXISTS `outbound_template` (
    `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `template_id` varchar(50) NOT NULL COMMENT '模板编号',
    `template_name` varchar(100) NOT NULL COMMENT '模板名称',
    `product_name` varchar(100) NOT NULL COMMENT '产品名称',
    `product_code` varchar(50) NOT NULL COMMENT '产品编码',
    `unit` varchar(20) DEFAULT NULL COMMENT '单位',
    `quantity` int(11) DEFAULT NULL COMMENT '数量',
    `unit_price` decimal(10,2) DEFAULT 0.00 COMMENT '单价',
    `total_price` decimal(12,2) DEFAULT 0.00 COMMENT '总价',
    `customer_id` varchar(50) DEFAULT NULL COMMENT '客户编号',
    `customer_name` varchar(100) DEFAULT NULL COMMENT '客户名称',
    `customer_phone` varchar(20) DEFAULT NULL COMMENT '客户电话',
    `customer_address` varchar(200) DEFAULT NULL COMMENT '客户地址',
    `customer_discount_rate` decimal(3,2) DEFAULT 1.00 COMMENT '客户折扣率',
    `channel` varchar(50) DEFAULT NULL COMMENT '销售渠道',
    `tags` text DEFAULT NULL COMMENT '标签（JSON格式）',
    `notes` varchar(500) DEFAULT NULL COMMENT '备注',
    `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` tinyint(1) DEFAULT 0 COMMENT '逻辑删除标识（0：未删除，1：已删除）',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_template_id` (`template_id`),
    KEY `idx_template_name` (`template_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='出库模板表';

-- 仓库位置表
CREATE TABLE IF NOT EXISTS `warehouse_location` (
    `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `location_id` varchar(50) NOT NULL COMMENT '位置编号',
    `location_name` varchar(100) NOT NULL COMMENT '位置名称',
    `location_code` varchar(50) NOT NULL COMMENT '位置编码',
    `description` varchar(500) DEFAULT NULL COMMENT '描述',
    `status` varchar(20) DEFAULT 'active' COMMENT '状态（active：活跃，disabled：已停用）',
    `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` tinyint(1) DEFAULT 0 COMMENT '逻辑删除标识（0：未删除，1：已删除）',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_location_id` (`location_id`),
    UNIQUE KEY `uk_location_code` (`location_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='仓库位置表';