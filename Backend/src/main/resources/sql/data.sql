-- 插入默认管理员用户（密码：admin123）
INSERT INTO `sys_user` (`username`, `password`, `nickname`, `role`, `status`) 
VALUES ('admin', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', '管理员', 'ADMIN', 1);

-- 插入测试用户（密码：123456）
INSERT INTO `sys_user` (`username`, `password`, `nickname`, `role`, `status`) 
VALUES ('farmer', '$2a$10$7JB720yubVSZfVVwdBYoOuJHqHqHqHqHqHqHqHqHqHqHqHqHqHqHq', '茶农', 'USER', 1);

-- 插入测试客户数据
INSERT INTO `customer` (`customer_id`, `customer_name`, `customer_phone`, `customer_address`, `discount_rate`, `customer_contact`, `customer_source`, `customer_category`, `customer_grade`, `notes`, `customer_status`)
VALUES 
('CUS001', '李茶庄', '13800138001', '福建省厦门市思明区茶叶街123号', 0.90, '李老板', '老客户', '批发商', 'VIP', '重要客户', 'active'),
('CUS002', '茶香阁', '13900139002', '福建省泉州市鲤城区茶叶批发市场B区12号', 0.95, '王经理', '推荐', '零售商', '普通', '批发客户', 'active'),
('CUS003', '品茗轩', '13800138003', '浙江省杭州市西湖区茶艺街45号', 0.90, '张总', '展会', '批发商', 'VIP', '高级客户', 'active');

-- 插入测试供应商数据
INSERT INTO `supplier` (`supplier_id`, `supplier_name`, `supplier_phone`, `supplier_address`, `supplier_contact`, `supplier_category`, `notes`, `supplier_status`)
VALUES 
('SUP001', '福建安溪茶园', '15800158001', '福建省泉州市安溪县茶叶生产基地1号', '陈经理', '生产商', '优质铁观音供应商', 'active'),
('SUP002', '杭州龙井茶厂', '15900159002', '浙江省杭州市西湖区龙井村茶厂路88号', '李厂长', '生产商', '优质龙井茶供应商', 'active');

-- 插入测试仓库位置数据
INSERT INTO `warehouse_location` (`location_id`, `location_name`, `location_code`, `description`, `status`)
VALUES 
('LOC001', 'A区-001号位', 'A-001', '茶叶存放区A区第1号位置', 'active'),
('LOC002', 'A区-002号位', 'A-002', '茶叶存放区A区第2号位置', 'active'),
('LOC003', 'B区-001号位', 'B-001', '包装材料存放区B区第1号位置', 'active'),
('LOC004', 'B区-002号位', 'B-002', '包装材料存放区B区第2号位置', 'active'),
('LOC005', 'C区-001号位', 'C-001', '成品存放区C区第1号位置', 'active'),
('LOC006', 'C区-002号位', 'C-002', '成品存放区C区第2号位置', 'active');

-- 插入测试物料数据
INSERT INTO `material` (`material_id`, `material_name`, `material_code`, `material_type`, `material_grade`, `unit`, `unit_price`, `current_stock`, `description`)
VALUES 
('M001', '铁观音', 'M_TGY20250820093000', '茶叶', '特级', '斤', 280.00, 100, '福建安溪铁观音，香气浓郁'),
('M002', '茶叶罐', 'M_CYG20250820093000', '包装材料', '标准', '个', 10.00, 50, '高档铁观音茶叶罐'),
('M003', '乌龙茶', 'M_WLC20250820093000', '茶叶', '一级', '斤', 320.00, 80, '乌龙茶，口感醇厚'),
('M004', '包装盒', 'M_BZH20250820093000', '包装材料', '标准', '个', 8.00, 100, '精美包装盒'),
('M005', '大红袍', 'M_DHP20250820093000', '茶叶', '特级', '斤', 350.00, 60, '武夷山大红袍，香气独特'),
('M006', '茶叶袋', 'M_CYD20250820093000', '包装材料', '标准', '个', 2.00, 200, '茶叶包装袋');

-- 插入测试商品组合数据
INSERT INTO `product_composition` (`product_id`, `product_name`, `product_code`, `unit`, `description`, `materials`, `total_material_cost`, `profit_rate`, `suggested_price`, `product_price`, `expected_profit`, `actual_profit_rate`, `product_quantity`)
VALUES 
('PC001', '铁观音礼盒套装', 'P_TGY20250822093000', '套', '高档铁观音礼盒套装，精选优质铁观音茶叶，配备精美茶叶罐', '[{"materialId":"M001","materialName":"铁观音","materialCode":"M_TGY20250820093000","currentStock":100,"quantity":0.5,"unit":"斤","unitPrice":280.00,"subtotal":140.00,"deductMaterial":true},{"materialId":"M002","materialName":"茶叶罐","materialCode":"M_CYG20250820093000","currentStock":50,"quantity":1,"unit":"个","unitPrice":10.00,"subtotal":10.00,"deductMaterial":true}]', 150.00, 25.0, 187.50, 200.00, 50.00, 25.0, 10),
('PC002', '乌龙茶精品套装', 'P_WLC20250822093000', '盒', '精选乌龙茶叶，口感醇厚，回甘悠长', '[{"materialId":"M003","materialName":"乌龙茶","materialCode":"M_WLC20250820093000","currentStock":80,"quantity":0.3,"unit":"斤","unitPrice":320.00,"subtotal":96.00,"deductMaterial":true},{"materialId":"M004","materialName":"包装盒","materialCode":"M_BZH20250820093000","currentStock":100,"quantity":1,"unit":"个","unitPrice":8.00,"subtotal":8.00,"deductMaterial":true}]', 104.00, 30.0, 135.20, 150.00, 46.00, 30.67, 20);

-- 插入测试入库记录数据
INSERT INTO `inbound_record` (`inbound_id`, `material_id`, `material_name`, `material_code`, `material_type`, `material_grade`, `batch_number`, `quantity`, `unit`, `unit_price`, `total_price`, `supplier_id`, `supplier_name`, `warehouse_location`, `date`, `time`, `expiry_date`, `shelf_life_days`, `quality_status`, `inspector`, `inspection_date`, `quality_remarks`, `description`, `type`)
VALUES 
('IN20250115001', 'M001', '铁观音', 'M_TGY20250820093000', '茶叶', '特级', 'TGY2025011春茶5001', 50, '斤', 280.00, 14000.00, 'SUP001', '福建安溪茶园', 'A-001', '2025-01-15', '09:30:00', '2027-01-15', 730, '合格', '质检员A', '2025-01-15', '质检通过，无异常', '特级铁观音，需保存在阴凉处，避免阳光直射', 'INBOUND'),
('IN20250115002', 'M002', '茶叶罐', 'M_CYG20250820093000', '包装材料', '标准', 'CYG20250115001', 100, '个', 10.00, 1000.00, 'SUP002', '杭州龙井茶厂', 'B-001', '2025-01-15', '10:30:00', '2027-01-15', 730, '合格', '质检员B', '2025-01-15', '质检通过，无异常', '高档铁观音茶叶罐，材质优良', 'INBOUND'),
('IN20250116001', 'M003', '乌龙茶', 'M_WLC20250820093000', '茶叶', '一级', 'WLC20250116001', 30, '斤', 320.00, 9600.00, 'SUP001', '福建安溪茶园', 'A-002', '2025-01-16', '09:00:00', '2027-01-16', 730, '合格', '质检员A', '2025-01-16', '质检通过，无异常', '一级乌龙茶，口感醇厚', 'INBOUND'),
('IN20250116002', 'M004', '包装盒', 'M_BZH20250820093000', '包装材料', '标准', 'BZH20250116001', 50, '个', 8.00, 400.00, 'SUP002', '杭州龙井茶厂', 'B-002', '2025-01-16', '10:00:00', '2027-01-16', 730, '合格', '质检员B', '2025-01-16', '质检通过，无异常', '精美包装盒，适合礼品包装', 'INBOUND'),
('IN20250117001', 'M005', '大红袍', 'M_DHP20250820093000', '茶叶', '特级', 'DHP20250117001', 20, '斤', 350.00, 7000.00, 'SUP001', '福建安溪茶园', 'A-001', '2025-01-17', '09:30:00', '2027-01-17', 730, '合格', '质检员A', '2025-01-17', '质检通过，无异常', '特级大红袍，香气独特', 'INBOUND');

-- 插入测试出库记录数据
INSERT INTO `outbound_record` (`outbound_id`, `product_name`, `product_code`, `quantity`, `unit`, `unit_price`, `total_price`, `customer_id`, `customer_name`, `customer_phone`, `customer_address`, `customer_discount_rate`, `discount_amount`, `final_amount`, `channel`, `tags`, `notes`, `date`, `time`, `type`)
VALUES 
('OUT20250120001', '铁观音礼盒套装', 'P_TGY20250822093000', 5, '套', 200.00, 1000.00, 'CUS001', '李茶庄', '13800138001', '福建省厦门市思明区茶叶街123号', 0.90, 100.00, 900.00, 'OFFLINE_STORE', '["VIP客户", "礼品"]', '客户要求包装精美', '2025-01-20', '14:30:00', 'OUTBOUND'),
('OUT20250120002', '乌龙茶精品套装', 'P_WLC20250822093000', 10, '盒', 150.00, 1500.00, 'CUS002', '茶香阁', '13900139002', '福建省泉州市鲤城区茶叶批发市场B区12号', 0.95, 75.00, 1425.00, 'WHOLESALE_MARKET', '["批发", "促销"]', '批发客户，享受促销价', '2025-01-20', '15:30:00', 'OUTBOUND'),
('OUT20250121001', '铁观音礼盒套装', 'P_TGY20250822093000', 3, '套', 200.00, 600.00, 'CUS003', '品茗轩', '13800138003', '浙江省杭州市西湖区茶艺街45号', 0.90, 60.00, 540.00, 'ONLINE', '["VIP客户", "礼品"]', '线上订单，需要快递发货', '2025-01-21', '09:30:00', 'OUTBOUND');

-- 插入测试入库模板数据
INSERT INTO `inbound_template` (`template_id`, `template_name`, `material_name`, `material_type`, `material_grade`, `batch_number`, `material_code`, `unit`, `quantity`, `unit_price`, `supplier_id`, `supplier_name`, `warehouse_location`, `shelf_life_days`, `quality_status`, `description`)
VALUES 
('TPL001', '铁观音模板', '铁观音', '茶叶', '特级', '第一批春茶', 'M_TGY20250820093000', '斤', 50, 280.00, 'SUP001', '福建安溪茶园', 'A-001', 730, '合格', '品质优良，符合标准'),
('TPL002', '乌龙茶模板', '乌龙茶', '茶叶', '一级', '第一批春茶', 'M_WLC20250820093000', '斤', 30, 320.00, 'SUP001', '福建安溪茶园', 'A-002', 730, '合格', '品质优良，符合标准');

-- 插入测试出库模板数据
INSERT INTO `outbound_template` (`template_id`, `template_name`, `product_name`, `product_code`, `unit`, `quantity`, `unit_price`, `total_price`, `customer_id`, `customer_name`, `customer_phone`, `customer_address`, `customer_discount_rate`, `channel`, `tags`, `notes`)
VALUES 
('TEMPLATE_001', '铁观音出库模板', '铁观音套装', 'P_TGY20250822093000', '套', 10, 200.00, 2000.00, 'CUS001', '李茶庄', '13800138001', '福建省厦门市思明区茶叶街123号', 0.90, 'ONLINE', '["VIP客户", "礼品"]', '客户要求包装精美'),
('TEMPLATE_002', '乌龙茶出库模板', '乌龙茶套装', 'P_WLC20250822093000', '套', 10, 150.00, 1500.00, 'CUS002', '茶香阁', '13900139002', '福建省泉州市鲤城区茶叶批发市场B区12号', 0.95, 'WHOLESALE_MARKET', '["批发", "促销"]', '批发客户，享受促销价');