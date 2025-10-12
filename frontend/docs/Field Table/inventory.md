# 库存管理字段表列表

## 盘点数据存储结构与计算逻辑（明确方案）

本节明确盘点数据采用“单记录累计调整”的方案，避免新增交易或修改原始交易数据，确保盘点对库存的影响可控、可审计且不污染交易流水。

### 方案目标
- 每个盘点对象（物料或商品，在指定范围：仓库/批次/规格）仅维护一条“盘点调整记录”。
- 多次盘点只更新这条记录的值，默认调整为 `0` 表示无需调整。
- 库存显示与计算始终基于：系统库存 + 盘点调整值，不新增交易、不改动原交易数据。
- 保留可选的盘点日志（审计追踪），不参与库存计算，仅用于历史回溯。

### 存储结构
- 核心实体：`InventoryCheckAdjustment`（盘点调整记录，唯一记录）
  - `id`: 主键
  - `scope`: `per_warehouse | global`（盘点范围：按仓库/全局聚合）
  - `itemType`: `material | product`（物料或商品）
  - `itemKey`: 字符串唯一键，用于确保“每个盘点对象一条记录”。
    - 物料建议：`materialId@warehouseId@batchId?`
    - 商品建议：`productId@warehouseId@skuId?`
  - `materialId?`: 物料ID（当 `itemType=material` 时）
  - `productId?`: 商品ID（当 `itemType=product` 时）
  - `warehouseId?`: 仓库ID（当 `scope=per_warehouse` 时）
  - `batchId?`: 批次ID（物料可选）
  - `skuId?`: 规格/变体ID（商品可选）
  - `adjustQty`: 数值（可为负），累计盘点调整量，默认 `0`
  - `status`: `draft | confirmed`（草稿/已确认）
  - `lastAuditedAt`: 最近确认时间
  - `auditedBy`: 确认人
  - `note?`: 备注
  - 索引约束：唯一索引 `itemType + itemKey + scope`，保证“单对象一条记录”。

- 可选审计实体：`InventoryCheckLog`（盘点调整日志，不参与计算）
  - `id`: 主键
  - `itemType`, `itemKey`
  - `prevAdjustQty`, `delta`, `newAdjustQty`
  - `reason?`, `operator`, `ts`
  - 作用：记录每次调整的历史，满足审计与回溯需求。

### 计算逻辑（覆盖式更新）
- 系统库存 `systemQty`
  - 来源：入库、出库、生产/拆解、退货等交易的净额，必要时扣减占用/预留。
  - 计算位置：`frontend/src/stores`（按既有入库/出库/商品组合规则汇总）。

- 调整与最终库存
  - 输入：盘点输入的“实际库存量” `actualQty`
  - 计算：`adjustQty = actualQty - systemQty`
  - 展示：`finalQty = systemQty + adjustQty`
  - 差异：`difference = finalQty - systemQty = adjustQty`
  - 更新机制：覆盖式更新 `adjustQty`（不按增量累积），防止多次盘点产生叠加误差。
  - 确认：用户点击“确认盘点”时，更新 `status=confirmed`，记录 `lastAuditedAt`、`auditedBy`，可同时写一条 `InventoryCheckLog`。

- 范围与聚合
  - 当 `scope=per_warehouse`：`systemQty` 按仓库/批次/规格维度计算与展示。
  - 当 `scope=global`：`systemQty` 为同类对象在所有仓库（或所有批次）合计，`adjustQty` 与展示亦按全局口径。

- 物料 vs 商品（组合）
  - 物料盘点：基于物料维度（含批次）独立计算与调整。
  - 商品盘点：基于商品维度（含规格）独立计算与调整。
  - 二者不自动联动（避免互相污染）；可提供“联动校验”提示，用于对照 BOM/组合关系做理论校验，不直接改动对方的盘点调整。

### 前端 stores 放置与接口（建议）
- 文件：`frontend/src/stores/inventoryCheckStore.ts`
  - `state`
    - `adjustments: Record<string, AdjustmentEntry>`（key 为 `itemKey`）
  - `getters`
    - `getSystemQty(itemKey): number`
    - `getAdjustQty(itemKey): number`
    - `getFinalQty(itemKey): number`（= `getSystemQty + getAdjustQty`）
  - `actions`
    - `setActualQty(itemKey, actualQty)` 计算并覆盖 `adjustQty`
    - `confirmCheck(itemKey)` 更新 `status` 与审计信息
    - `resetAdjustment(itemKey)` 将 `adjustQty` 置回 `0`

- 类型示例
```ts
export interface AdjustmentEntry {
  id: string
  scope: 'per_warehouse' | 'global'
  itemType: 'material' | 'product'
  itemKey: string
  materialId?: string
  productId?: string
  warehouseId?: string
  batchId?: string
  skuId?: string
  adjustQty: number
  status: 'draft' | 'confirmed'
  lastAuditedAt?: string
  auditedBy?: string
  note?: string
}
```

### 需求明确性（可直接落文档的约束）
- 盘点仅通过“调整记录”影响库存，不新增交易、不修改原始交易。
- 一个盘点对象仅有一条调整记录，覆盖式更新 `adjustQty`。
- 库存展示以 `systemQty + adjustQty` 为准；`actualQty` 不长期持久化，仅作计算输入。
- 可选：记录调整日志用于审计，不参与库存计算。
- 并发盘点需加“对象级锁”或乐观并发控制，避免覆盖。
- 确认时以“当前最新 `systemQty`”为基准计算 `adjustQty`，确保幂等。


## frontend\src\views\InventoryList.vue
功能：库存列表展示页面

### 展示字段
#### 物料库存
- 物料名称 = 字段 `material.materialName`
- 物料类型 = 字段 `material.materialType`
- 物料等级 = 字段 `material.materialGrade`
- 物料编码 = 字段 `material.materialCode`
- 批次号 = 字段 `material.batchNumber`
- 仓库位置 = 字段 `material.warehouseLocation`
- 总数量 = 字段 `material.totalQuantity`
- 计量单位 = 字段 `material.unit`
- 单价 = 字段 `material.unitPrice`
- 物料总价值 = 字段 `material.totalAmount`
- 预警线 = 字段 `material.warningThreshold`
- 库存状态 = 字段 `material.stockStatus`（计算属性）
- 库存进度 = 字段 `material.stockPercentage`（计算属性）
- 最后更新时间 = 字段 `material.lastUpdatedAt`

#### 商品库存
- 商品名称 = 字段 `product.productName`
- 商品编码 = 字段 `product.productCode`
- 物料组合信息 = 字段 `product.materials`
- 总数量 = 字段 `product.totalQuantity`
- 计量单位 = 字段 `product.unit`
- 成本价 = 字段 `product.costPrice`
- 预警线 = 字段 `product.warningThreshold`
- 库存状态 = 字段 `product.stockStatus`（计算属性）
- 库存进度 = 字段 `product.stockPercentage`（计算属性）

### 状态字段
- 当前视图 = 字段 `currentView`（'inventory'或'product'）
- 搜索关键词 = 字段 `searchQuery`
- 筛选状态 = 字段 `filterStatus`（'all', 'sufficient', 'low', 'warning', 'out'）
- 物料库存列表 = 字段 `materialInventory`
- 商品库存列表 = 字段 `productInventory`
- 库存统计数据 = 字段 `inventoryStatistics`

### 计算属性
- 过滤后的物料库存 = 计算属性 `filteredMaterialInventory`
- 过滤后的商品库存 = 计算属性 `filteredProductInventory`
- 库存总价值 = 计算属性 `totalInventoryValue`
- 物料总数 = 计算属性 `totalMaterialCount`
- 低库存预警数 = 计算属性 `lowStockWarningCount`

### 方法
- 切换视图 = 方法 `switchView`
- 筛选库存 = 方法 `filterInventory`
- 加载库存数据 = 方法 `loadInventoryData`
- 获取库存状态样式 = 方法 `getStockStatusClass`
- 获取库存状态文本 = 方法 `getStockStatusText`
- 查看详情 = 方法 `viewDetails`
- 编辑库存 = 方法 `editInventory`
- 前往物料盘点 = 方法 `goToMaterialCheck`
- 前往商品盘点 = 方法 `goToProductCheck`

————————————————————————————————————————————————
## frontend\src\views\InventoryCheck.vue
功能：物料库存盘点页面

### 盘点字段
- 物料名称 = 字段 `checkItem.materialName`
- 物料类型 = 字段 `checkItem.materialType`
- 物料等级 = 字段 `checkItem.materialGrade`
- 系统库存 = 字段 `checkItem.systemQuantity`
- 实际库存 = 字段 `checkItem.actualQuantity`
- 差异数量 = 字段 `checkItem.difference`（计算属性）
- 计量单位 = 字段 `checkItem.unit`
- 盘点状态 = 字段 `checkItem.checkStatus`（'pending', 'completed'）
- 盘点备注 = 字段 `checkItem.remarks`
- 盘点时间 = 字段 `checkItem.checkTime`

### 状态字段
- 盘点列表 = 字段 `checkList`
- 盘点进度 = 字段 `checkProgress`（计算属性）
- 已完成数量 = 字段 `completedCount`（计算属性）
- 总盘点数量 = 字段 `totalCheckCount`（计算属性）
- 盘点记录ID = 字段 `checkRecordId`
- 盘点人员 = 字段 `inspector`
- 盘点日期 = 字段 `checkDate`
- 显示调整确认弹窗 = 字段 `showAdjustmentModal`
- 当前调整项 = 字段 `currentAdjustItem`

### 方法
- 确认盘点项 = 方法 `confirmCheckItem`
- 计算差异 = 方法 `calculateDifference`
- 完成盘点 = 方法 `completeCheck`
- 打开调整确认弹窗 = 方法 `openAdjustmentModal`
- 确认库存调整 = 方法 `confirmAdjustment`
- 取消库存调整 = 方法 `cancelAdjustment`
- 保存盘点记录 = 方法 `saveCheckRecord`
- 加载盘点数据 = 方法 `loadCheckData`
- 获取差异样式类 = 方法 `getDifferenceClass`

————————————————————————————————————————————————
## frontend\src\views\ProductCheck.vue
功能：商品库存盘点页面

### 盘点字段
- 商品名称 = 字段 `checkItem.productName`
- 商品编码 = 字段 `checkItem.productCode`
- 商品描述 = 字段 `checkItem.description`
- 物料组成 = 字段 `checkItem.materials`
- 系统库存 = 字段 `checkItem.systemQuantity`
- 实际库存 = 字段 `checkItem.actualQuantity`
- 差异数量 = 字段 `checkItem.difference`（计算属性）
- 计量单位 = 字段 `checkItem.unit`
- 成本价 = 字段 `checkItem.costPrice`
- 盘点状态 = 字段 `checkItem.checkStatus`（'pending', 'completed'）
- 盘点备注 = 字段 `checkItem.remarks`
- 盘点时间 = 字段 `checkItem.checkTime`

### 状态字段
- 盘点列表 = 字段 `checkList`
- 盘点进度 = 字段 `checkProgress`（计算属性）
- 已完成数量 = 字段 `completedCount`（计算属性）
- 总盘点数量 = 字段 `totalCheckCount`（计算属性）
- 盘点记录ID = 字段 `checkRecordId`
- 盘点人员 = 字段 `inspector`
- 盘点日期 = 字段 `checkDate`
- 显示调整确认弹窗 = 字段 `showAdjustmentModal`
- 当前调整项 = 字段 `currentAdjustItem`
- 上次盘点调整映射 = 字段 `lastCheckAdjustMap`（`Record<productId, number>`，无记录时默认 0）
- 商品ID列表 = 字段 `productIdList`（作为批量获取与盘点对象集合）
- 交易总量映射 = 字段 `transactionTotalMap`（`Record<productId, number>`，来源于交易汇总）

### 方法
- 开始盘点 = 方法 `startCheck`
- 确认盘点项 = 方法 `confirmCheckItem`
- 计算差异 = 方法 `calculateDifference`
- 完成盘点 = 方法 `completeCheck`
- 打开调整确认弹窗 = 方法 `openAdjustmentModal`
- 确认库存调整 = 方法 `confirmAdjustment`
- 取消库存调整 = 方法 `cancelAdjustment`
- 保存盘点记录 = 方法 `saveCheckRecord`
- 加载盘点数据 = 方法 `loadCheckData`
- 获取差异样式类 = 方法 `getDifferenceClass`
- 获取上次盘点调整 = 方法 `getLastCheckAdjust(productId)`（无记录返回 0）
- 保存盘点调整 = 方法 `saveCheckAdjust(productId, adjustQty)`（生成并持久化新的盘点调整记录）
- 计算当前实际总数 = 方法 `calculateActualTotal(productId)`（`transactionTotalMap[productId] + (lastCheckAdjustMap[productId] || 0)`）
- 加载商品ID列表 = 方法 `loadProductIdList`
- 加载交易总量 = 方法 `loadTransactionTotal(productId)`（按交易记录汇总）

————————————————————————————————————————————————
## frontend\src\stores\inventory.js
功能：库存管理状态存储

### 状态字段
- 物料库存 = 字段 `materialInventory`
- 商品库存 = 字段 `productInventory`
- 库存统计 = 字段 `inventoryStatistics`
- 盘点记录 = 字段 `checkRecords`
- 加载状态 = 字段 `loading`
- 错误信息 = 字段 `error`
- 商品盘点调整 = 字段 `productCheckAdjustments`（`Record<productId, number>`，默认值 0）
- 物料盘点调整 = 字段 `materialCheckAdjustments`（`Record<materialId|string, number>`，默认值 0）
- 商品交易总量 = 字段 `productTransactionTotals`（`Record<productId, number>`）
- 物料交易总量 = 字段 `materialTransactionTotals`（`Record<materialId|string, number>`）

### 计算属性
- 物料总数 = 计算属性 `totalMaterialCount`
- 商品总数 = 计算属性 `totalProductCount`
- 库存总价值 = 计算属性 `totalInventoryValue`
- 低库存物料 = 计算属性 `lowStockMaterials`
- 低库存商品 = 计算属性 `lowStockProducts`
- 低库存预警数 = 计算属性 `lowStockWarningCount`
- 商品最终库存 = 计算属性 `finalProductQty(productId)` = `productTransactionTotals[productId] + (productCheckAdjustments[productId] || 0)`
- 物料最终库存 = 计算属性 `finalMaterialQty(materialId)` = `materialTransactionTotals[materialId] + (materialCheckAdjustments[materialId] || 0)`
- 盘点差异 = 计算属性 `checkDifference(itemType, id)` = 对应 `adjustQty`

### 方法
- 获取物料库存 = 方法 `fetchMaterialInventory`
- 获取商品库存 = 方法 `fetchProductInventory`
- 获取库存统计 = 方法 `fetchInventoryStatistics`
- 获取盘点记录 = 方法 `fetchCheckRecords`
- 创建盘点记录 = 方法 `createCheckRecord`
- 更新盘点记录 = 方法 `updateCheckRecord`
- 完成盘点 = 方法 `completeCheckRecord`
- 调整物料库存 = 方法 `adjustMaterialInventory`
- 调整商品库存 = 方法 `adjustProductInventory`
- 计算库存状态 = 方法 `calculateStockStatus`
- 计算库存百分比 = 方法 `calculateStockPercentage`
- 获取上次盘点调整 = 方法 `getLastCheckAdjust(itemType, id)`（无记录返回 0）
- 保存盘点调整 = 方法 `saveCheckAdjust(itemType, id, adjustQty)`（覆盖式更新，持久化存储）
- 计算最终库存 = 方法 `calculateFinalQty(itemType, id)`（`systemQty + adjustQty`）
- 加载ID列表 = 方法 `loadIdList(itemType)`（返回物料或商品的全部 ID 集合）
- 加载交易总量 = 方法 `loadTransactionTotal(itemType, id)`（按交易汇总获取 `systemQty`）
- 同步盘点调整到状态 = 方法 `syncCheckAdjustments(adjustmentList)`

————————————————————————————————————————————————
## frontend\src\mock\inventory_data.js
功能：库存数据模拟模块

### 数据结构
- 物料库存数据 = 常量 `MATERIAL_INVENTORY`
- 商品库存数据 = 常量 `PRODUCT_INVENTORY`
- 库存统计数据 = 常量 `INVENTORY_STATISTICS`
- 盘点记录数据 = 常量 `CHECK_RECORDS`

### 方法
- 获取物料库存 = 方法 `getMaterialInventory`
- 获取商品库存 = 方法 `getProductInventory`
- 获取库存统计 = 方法 `getInventoryStatistics`
- 获取盘点记录 = 方法 `getCheckRecords`
- 创建盘点记录 = 方法 `createCheckRecord`
- 更新盘点记录 = 方法 `updateCheckRecord`
- 完成盘点记录 = 方法 `completeCheckRecord`
- 调整物料库存 = 方法 `adjustMaterialInventory`
- 调整商品库存 = 方法 `adjustProductInventory`
- 根据ID获取物料 = 方法 `getMaterialById`
- 根据ID获取商品 = 方法 `getProductById`
- 根据ID获取盘点记录 = 方法 `getCheckRecordById`

————————————————————————————————————————————————
## 字段映射关系

### 前端展示与后端数据映射
- 物料名称: `material.materialName` ↔ `material_name`
- 物料类型: `material.materialType` ↔ `material_type`
- 物料等级: `material.materialGrade` ↔ `material_grade`
- 物料编码: `material.materialCode` ↔ `material_code`
- 批次号: `material.batchNumber` ↔ `batch_number`
- 仓库位置: `material.warehouseLocation` ↔ `warehouse_location`
- 总数量: `material.totalQuantity` ↔ `total_quantity`
- 计量单位: `material.unit` ↔ `unit`
- 单价: `material.unitPrice` ↔ `unit_price`
- 物料总价值: `material.totalAmount` ↔ `total_amount`
- 预警线: `material.warningThreshold` ↔ `warning_threshold`
- 库存状态: `material.stockStatus` ↔ `stock_status`
- 库存进度: `material.stockPercentage` ↔ `stock_percentage`
- 最后更新时间: `material.lastUpdatedAt` ↔ `last_updated_at`

- 商品名称: `product.productName` ↔ `product_name`
- 商品编码: `product.productCode` ↔ `product_code`
- 物料组合信息: `product.materials` ↔ `materials`
- 总数量: `product.totalQuantity` ↔ `total_quantity`
- 计量单位: `product.unit` ↔ `unit`
- 成本价: `product.costPrice` ↔ `cost_price`
- 预警线: `product.warningThreshold` ↔ `warning_threshold`
- 库存状态: `product.stockStatus` ↔ `stock_status`
- 库存进度: `product.stockPercentage` ↔ `stock_percentage`

### 盘点记录字段映射
- 盘点记录ID: `checkRecord.id` ↔ `id`
- 盘点类型: `checkRecord.checkType` ↔ `check_type`
- 盘点人员: `checkRecord.inspector` ↔ `inspector`
- 盘点日期: `checkRecord.checkDate` ↔ `check_date`
- 盘点状态: `checkRecord.status` ↔ `status`
- 盘点项目: `checkRecord.items` ↔ `items`
- 创建时间: `checkRecord.createdAt` ↔ `created_at`
- 更新时间: `checkRecord.updatedAt` ↔ `updated_at`

————————————————————————————————————————————————
## 库存盘点功能设计与实现建议

### 盘点数据处理方案

1. **盘点记录独立存储**：
   - 创建独立的盘点记录表，记录每次盘点的基本信息（时间、人员、类型等）
   - 盘点项目作为子表，关联到盘点记录，记录每个物料/商品的盘点结果
   - 盘点完成后生成盘点报告，包含差异统计和调整建议

2. **库存调整处理方案**：
   - **方案一：调整交易记录**
     - 为每个库存差异创建一条特殊类型的交易记录（"INVENTORY_ADJUSTMENT"）
     - 差异为正时创建入库记录，差异为负时创建出库记录
     - 优点：保持数据一致性，可追溯调整历史
     - 缺点：增加交易数据量

   - **方案二：直接修改库存数量**
     - 直接更新物料/商品的当前库存数量
     - 记录调整前后的数值和调整原因
     - 优点：实现简单，不增加交易数据量
     - 缺点：可能导致库存数据与交易记录不一致

   - **推荐方案：混合方案**
     - 小额差异（如±5%以内）：创建调整交易记录
     - 大额差异：标记异常，要求人工审核并提供调整原因
     - 所有调整都记录在盘点历史中，便于后续追溯

3. **盘点流程优化**：
   - 分批盘点：按物料类型、仓库位置等分批进行盘点，避免一次性盘点所有库存
   - 定期盘点：设置定期盘点计划，如每月盘点高价值物料，每季度盘点全部库存
   - 抽样盘点：对于数量大的物料，可采用抽样盘点方式，减少工作量

4. **数据一致性保障**：
   - 盘点期间锁定相关物料/商品的入库出库操作
   - 盘点完成后自动计算差异并生成调整建议
   - 调整需要管理员审核确认后才能执行
   - 保留完整的调整记录，包括调整原因、操作人员等信息

5. **盘点数据分析**：
   - 记录历次盘点的差异率，分析差异趋势
   - 识别频繁出现差异的物料/商品，加强管理
   - 根据盘点结果优化库存预警阈值和采购计划

### 技术实现建议

1. **数据结构设计**：
   ```javascript
   // 盘点记录结构
   {
     id: 'CHK20250716001',
     checkType: 'MATERIAL', // 或 'PRODUCT'
     inspector: '张三',
     checkDate: '2025-07-16',
     status: 'IN_PROGRESS', // 'COMPLETED', 'CANCELLED'
     items: [
       {
         itemId: 'MAT001',
         itemName: '铁观音',
         systemQuantity: 450,
         actualQuantity: 448,
         difference: -2,
         unit: '斤',
         adjustmentApproved: false,
         adjustmentReason: '',
         checkStatus: 'completed'
       },
       // 更多盘点项...
     ],
     createdAt: '2025-07-16T10:00:00',
     updatedAt: '2025-07-16T11:30:00'
   }
   ```

2. **库存调整记录结构**：
   ```javascript
   // 库存调整记录
   {
     id: 'ADJ20250716001',
     checkRecordId: 'CHK20250716001',
     itemType: 'MATERIAL', // 或 'PRODUCT'
     itemId: 'MAT001',
     itemName: '铁观音',
     beforeQuantity: 450,
     afterQuantity: 448,
     adjustmentQuantity: -2,
     unit: '斤',
     reason: '盘点差异',
     approvedBy: '李四',
     approvedAt: '2025-07-16T12:00:00',
     createdAt: '2025-07-16T11:30:00'
   }
   ```

3. **前端实现**：
   - 使用Pinia存储盘点状态和进度
   - 实现分步盘点流程，支持保存中间结果
   - 提供差异分析和可视化展示
   - 支持批量确认和调整操作

4. **后端API**：
   - `/api/inventory/check/create` - 创建新盘点记录
   - `/api/inventory/check/update` - 更新盘点项目
   - `/api/inventory/check/complete` - 完成盘点
   - `/api/inventory/check/approve` - 审核盘点调整
   - `/api/inventory/check/history` - 获取盘点历史
   - `/api/inventory/adjustment/create` - 创建库存调整

通过以上设计和实现，可以建立一个完整、可追溯的库存盘点系统，既能保证数据准确性，又能提供良好的用户体验和管理效率。