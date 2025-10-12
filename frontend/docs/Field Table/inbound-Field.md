# 入库记录字段表列表

## frontend\src\views\InboundForm.vue
功能：入库记录表单页面

### 表单字段
- 唯一标识符 = 字段 `formData.id`（格式：'inbound' + 日期时间，例如：'inbound202507151430'）
- 物料名称 = 字段 `formData.materialName`
- 物料类型 = 字段 `formData.materialType`
- 入库数量 = 字段 `formData.quantity`
- 计量单位 = 字段 `formData.unit`
- 物料等级 = 字段 `formData.materialGrade`
- 批次号 = 字段 `formData.batchNumber`
- 物料编号 = 字段 `formData.materialCode`
- 单价 = 字段 `formData.unitPrice`
- 总金额 = 字段 `totalPrice`（计算属性）
- 供应商 = 字段 `formData.supplierId`
- 入库日期 = 字段 `formData.date`
- 入库时间 = 字段 `formData.time`
- 保质期 = 字段 `formData.expiryDate`
- 保质期时长 = 字段 `formData.shelfLifeDays`
- 存放位置 = 字段 `formData.warehouseLocation`
- 备注说明 = 字段 `formData.description`
- 检验状态 = 字段 `formData.qualityStatus`
- 检验员 = 字段 `formData.inspector`
- 检验日期 = 字段 `formData.inspectionDate`
- 检验备注 = 字段 `formData.qualityRemarks`
- 图片列表 = 字段 `formData.images`
- 交易类型 = 字段 `formData.type`（固定值：'INBOUND'）

### 供应商评价字段
- 产品质量评分 = 字段 `ratings.quality`
- 交付及时性评分 = 字段 `ratings.delivery`
- 价格合理性评分 = 字段 `ratings.price`
- 服务态度评分 = 字段 `ratings.service`
- 综合评分 = 字段 `overallRating`（计算属性）

### 状态字段
- 加载状态 = 字段 `loading`
- 显示搜索结果 = 字段 `showSearchResults`
- 搜索关键词 = 字段 `searchKeyword`
- 搜索结果列表 = 字段 `searchResults`
- 显示供应商评价 = 字段 `showSupplierRating`
- 显示模板名称弹窗 = 字段 `showTemplateNameModal`
- 模板名称 = 字段 `templateName`

### 基础数据字段
- 物料类型列表 = 字段 `baseData.materialTypes`
- 物料等级列表 = 字段 `baseData.materialGrades`
- 仓库位置列表 = 字段 `baseData.warehouseLocations`
- 供应商列表 = 字段 `baseData.suppliers`
- 质检状态列表 = 字段 `baseData.qualityStatuses`

### 方法
- 计算总金额 = 方法 `calculateTotal`
- 更新物料编码 = 方法 `updateMaterialCode`
- 搜索物料 = 方法 `searchMaterials`
- 选择物料 = 方法 `selectMaterial`
- 处理输入框失焦 = 方法 `handleInputBlur`
- 处理供应商变更 = 方法 `handleSupplierChange`
- 设置评分 = 方法 `setRating`
- 计算到期日期 = 方法 `calculateExpiryDate`
- 选择模板 = 方法 `selectTemplate`
- 处理保存 = 方法 `handleSave`
- 处理提交 = 方法 `handleSubmit`
- 打开模板名称弹窗 = 方法 `openTemplateNameModal`
- 关闭模板名称弹窗 = 方法 `closeTemplateNameModal`
- 确认保存模板 = 方法 `confirmSaveTemplate`
- 加载基础数据 = 方法 `loadBaseData`
- 加载物料图片 = 方法 `loadMaterialImages`
- 移除图片 = 方法 `removeImage`

————————————————————————————————————————————————
## frontend\src\views\InboundRecords.vue
功能：入库记录列表页面

### 展示字段
- 物料信息 = 字段 `summary.materialName`、`summary.materialType`、`summary.materialGrade`
- 物料编码 = 字段 `summary.materialCode`
- 批次号 = 字段 `summary.batchNumber`
- 入库时间 = 字段 `summary.latestDate`、`summary.latestTime`
- 物料总量 = 字段 `summary.totalQuantity`
- 计量单位 = 字段 `summary.unit`
- 单价 = 字段 `(summary.totalAmount / summary.totalQuantity).toFixed(2)`
- 物料总价值 = 字段 `summary.totalAmount` (累加自 `record.totalPrice`)
- 供应商 = 字段 `summary.supplierId`
- 仓库位置 = 字段 `summary.warehouseLocation`
- 保质期 = 字段 `summary.expiryDate`
- 质检状态 = 字段 `summary.qualityStatus`

### 状态字段
- 记录列表 = 字段 `records`
- 物料汇总 = 字段 `materialSummary`（计算属性）
- 仓库位置列表 = 字段 `warehouseLocations`
- 供应商列表 = 字段 `suppliers`
- 显示新增入库弹窗 = 字段 `showAddInboundModal`
- 搜索关键词 = 字段 `searchQuery`
- 当前页码 = 字段 `currentPage`
- 每页数量 = 字段 `pageSize`
- 显示图片预览 = 字段 `showImagePreview`
- 预览图片列表 = 字段 `previewImages`
- 当前图片索引 = 字段 `currentImageIndex`
- 当前物料名称 = 字段 `currentMaterialName`
- 物料图片缓存 = 字段 `materialImagesCache`
- 自定义物料类型 = 字段 `customMaterialTypes`
- 自定义物料等级 = 字段 `customMaterialGrades`
- 自定义仓库位置 = 字段 `customWarehouseLocations`

### 计算属性
- 过滤后的记录 = 字段 `filteredRecords`
- 总记录数 = 字段 `totalRecords`
- 总页数 = 字段 `totalPages`
- 可见页码 = 字段 `visiblePages`

### 方法
- 获取物料图片 = 方法 `getMaterialImages`
- 获取物料类型名称 = 方法 `getMaterialTypeName`
- 获取物料等级名称 = 方法 `getMaterialGradeName`
- 格式化日期时间 = 方法 `formatDateTime`
- 格式化日期 = 方法 `formatDate`
- 获取供应商名称 = 方法 `getSupplierName`
- 获取仓库位置名称 = 方法 `getWarehouseLocationName`
- 获取质检状态名称 = 方法 `getQualityStatusName`
- 获取质检状态样式类 = 方法 `getQualityStatusClass`
- 跳转到页码 = 方法 `goToPage`
- 处理新增入库 = 方法 `handleAddInbound`
- 处理语音记录 = 方法 `handleVoiceRecord`
- 处理OCR扫描 = 方法 `handleOCRScan`
- 处理自定义模板 = 方法 `handleCustomTemplate`
- 关闭弹窗 = 方法 `closeModal`
- 打开图片预览 = 方法 `openImagePreview`
- 添加物料类型 = 方法 `addMaterialType`
- 保存物料类型 = 方法 `saveMaterialType`
- 删除物料类型 = 方法 `deleteMaterialType`
- 添加物料等级 = 方法 `addMaterialGrade`
- 保存物料等级 = 方法 `saveMaterialGrade`
- 删除物料等级 = 方法 `deleteMaterialGrade`
- 添加仓库位置 = 方法 `addWarehouseLocation`
- 保存仓库位置 = 方法 `saveWarehouseLocation`
- 删除仓库位置 = 方法 `deleteWarehouseLocation`

————————————————————————————————————————————————
## frontend\src\views\InboundTemplates.vue
功能：入库模板管理页面

### 模板字段
- 模板名称 = 字段 `template.inboundTempname`
- 物料名称 = 字段 `template.materialName`
- 物料类型 = 字段 `template.materialType`
- 物料等级 = 字段 `template.materialGrade`
- 批次号 = 字段 `template.batchNumber`
- 物料编码 = 字段 `template.materialCode`
- 单价 = 字段 `template.unitPrice`
- 数量 = 字段 `template.quantity`
- 计量单位 = 字段 `template.unit`
- 总价 = 字段 `template.unitPrice * template.quantity`
- 供应商 = 字段 `template.supplierId`
- 存放位置 = 字段 `template.warehouseLocation`
- 保质期时长 = 字段 `template.shelfLifeDays`
- 质量状态 = 字段 `template.qualityStatus`
- 创建时间 = 字段 `template.createdAt`
- 更新时间 = 字段 `template.updatedAt`

### 表单字段
- 模板名称 = 字段 `templateForm.inboundTempname`
- 模板描述 = 字段 `templateForm.description`
- 物料名称 = 字段 `templateForm.materialName`
- 物料类型 = 字段 `templateForm.materialType`
- 数量 = 字段 `templateForm.quantity`
- 单位 = 字段 `templateForm.unit`
- 物料等级 = 字段 `templateForm.materialGrade`
- 批次号 = 字段 `templateForm.batchNumber`
- 单价 = 字段 `templateForm.unitPrice`
- 供应商 = 字段 `templateForm.supplierId`
- 保质期时长 = 字段 `templateForm.shelfLifeDays`
- 仓库位置 = 字段 `templateForm.warehouseLocation`
- 质检状态 = 字段 `templateForm.qualityStatus`

### 编辑表单字段
- 模板名称 = 字段 `editForm.inboundTempname`
- 物料名称 = 字段 `editForm.materialName`
- 物料类型 = 字段 `editForm.materialType`
- 物料等级 = 字段 `editForm.materialGrade`
- 批次号 = 字段 `editForm.batchNumber`
- 物料编码 = 字段 `editForm.materialCode`
- 单价 = 字段 `editForm.unitPrice`
- 数量 = 字段 `editForm.quantity`
- 单位 = 字段 `editForm.unit`
- 供应商 = 字段 `editForm.supplierId`
- 仓库位置 = 字段 `editForm.warehouseLocation`
- 保质期时长 = 字段 `editForm.shelfLifeDays`
- 质检状态 = 字段 `editForm.qualityStatus`

### 状态字段
- 模板列表 = 字段 `templates`
- 搜索关键词 = 字段 `searchKeyword`
- 筛选类型 = 字段 `filterType`
- 选中的模板 = 字段 `selectedTemplate`
- 正在编辑的模板ID = 字段 `editingTemplateId`
- 显示创建弹窗 = 字段 `showCreateModal`
- 显示编辑弹窗 = 字段 `showEditModal`
- 基础数据 = 字段 `baseData`
- 物料类型列表 = 字段 `materialTypes`（计算属性）
- 物料等级列表 = 字段 `materialGrades`（计算属性）
- 供应商选项 = 字段 `supplierOptions`
- 仓库位置列表 = 字段 `warehouseLocations`

### 计算属性
- 过滤后的模板 = 字段 `filteredTemplates`

### 方法
- 返回上一页 = 方法 `goBack`
- 选择模板 = 方法 `selectTemplate`
- 使用模板 = 方法 `useTemplate`
- 开始编辑模板 = 方法 `startEditTemplate`
- 保存模板编辑 = 方法 `saveTemplateEdit`
- 取消模板编辑 = 方法 `cancelTemplateEdit`
- 删除模板 = 方法 `deleteTemplate`
- 关闭弹窗 = 方法 `closeModal`
- 保存模板 = 方法 `saveTemplate`
- 获取物料类型标签 = 方法 `getMaterialTypeLabel`
- 获取物料等级标签 = 方法 `getMaterialGradeLabel`
- 获取供应商名称 = 方法 `getSupplierName`
- 获取保质期文本 = 方法 `getShelfLifeText`
- 格式化日期 = 方法 `formatDate`
- 加载基础数据 = 方法 `loadBaseData`

————————————————————————————————————————————————
## frontend\src\mock\warehouse_data.js
功能：入库记录后端数据管理

### 常量数据
- 物料类型配置 = 常量 `MATERIAL_TYPES`
- 物料等级配置 = 常量 `MATERIAL_GRADES`
- 质量检测状态 = 常量 `QUALITY_STATUS`
- 仓库位置配置 = 常量 `WAREHOUSE_LOCATIONS`
- 入库模板数据 = 常量 `INBOUND_TEMPLATES`

### 方法
- 获取交易记录 = 方法 `getTransactionsByType`
- 获取入库记录 = 方法 `getInboundRecords`
- 获取出库记录 = 方法 `getOutboundRecords`
- 根据日期范围获取记录 = 方法 `getTransactionsByDateRange`
- 根据物料获取记录 = 方法 `getTransactionsByMaterial`
- 根据供应商获取记录 = 方法 `getTransactionsBySupplier`
- 获取库存统计 = 方法 `getInventoryStatistics`
- 获取物料选项 = 方法 `getMaterialOptions`
- 获取供应商选项 = 方法 `getSupplierOptions`
- 获取仓库位置选项 = 方法 `getWarehouseLocationOptions`
- 获取物料类型选项 = 方法 `getMaterialTypeOptions`
- 获取物料等级选项 = 方法 `getMaterialGradeOptions`
- 获取质量状态选项 = 方法 `getQualityStatusOptions`
- 获取入库模板选项 = 方法 `getInboundTemplateOptions`
- 获取入库模板 = 方法 `getInboundTemplates`
- 根据ID获取入库模板 = 方法 `getInboundTemplateById`
- 保存入库模板 = 方法 `saveInboundTemplate`
- 获取所有模板ID = 方法 `getAllTemplateIds`
- 删除入库模板 = 方法 `deleteInboundTemplate`
- 获取仓库数据 = 方法 `getWarehouseData`

————————————————————————————————————————————————
## frontend\src\mock\database_flow.js
功能：数据库流水记录管理

### 入库记录数据结构
- 交易类型 = 字段 `type`（值为"INBOUND"）
- 日期 = 字段 `date`
- 时间 = 字段 `time`
- 物料名称 = 字段 `materialName`
- 物料编码 = 字段 `materialCode`
- 批次号 = 字段 `batchNumber`
- 物料类型 = 字段 `materialType`
- 物料等级 = 字段 `materialGrade`
- 总价 = 字段 `totalPrice`
- 数量 = 字段 `quantity`
- 单位 = 字段 `unit`
- 单价 = 字段 `unitPrice`
- 供应商ID = 字段 `supplierId`
- 质量评分 = 字段 `quality`
- 交付评分 = 字段 `delivery`
- 价格评分 = 字段 `price`
- 服务评分 = 字段 `service`
- 到期日期 = 字段 `expiryDate`
- 保质期天数 = 字段 `shelfLifeDays`
- 仓库位置 = 字段 `warehouseLocation`
- 描述 = 字段 `description`
- 质检状态 = 字段 `qualityStatus`
- 检验员 = 字段 `inspector`
- 检验日期 = 字段 `inspectionDate`
- 质检备注 = 字段 `qualityRemarks`

### 方法
- 获取所有交易记录 = 方法 `getAllTransactions`
- 添加交易记录 = 方法 `addTransaction`
- 更新交易记录 = 方法 `updateTransaction`
- 删除交易记录 = 方法 `deleteTransaction`
- 根据日期范围获取交易记录 = 方法 `getTransactionsByDateRange`
- 获取7天交易记录 = 方法 `get7dayTransactions`
- 获取最近一周交易记录 = 方法 `getRecentWeekTransactions`
- 根据类型获取交易记录 = 方法 `getTransactionsByType`
- 根据日期获取交易记录 = 方法 `getTransactionsByDate`
- 获取交易统计 = 方法 `getTransactionStatistics`
- 重置交易数据 = 方法 `resetTransactionData`
- 初始化交易数据 = 方法 `initializeTransactionData`

————————————————————————————————————————————————
## 字段映射关系

### 前端展示与后端数据字段映射
- 物料名称：前端 `materialName` ↔ 后端 `materialName`
- 物料编码：前端 `materialCode` ↔ 后端 `materialCode`
- 物料类型：前端 `materialType` ↔ 后端 `materialType`
- 物料等级：前端 `materialGrade` ↔ 后端 `materialGrade`
- 批次号：前端 `batchNumber` ↔ 后端 `batchNumber`
- 数量：前端 `quantity` ↔ 后端 `quantity`
- 单位：前端 `unit` ↔ 后端 `unit`
- 单价：前端 `unitPrice` ↔ 后端 `unitPrice`
- 总金额：前端 `totalPrice` ↔ 后端 `totalPrice`
- 供应商ID：前端 `supplierId` ↔ 后端 `supplierId`
- 入库日期：前端 `date` ↔ 后端 `date`
- 入库时间：前端 `time` ↔ 后端 `time`
- 到期日期：前端 `expiryDate` ↔ 后端 `expiryDate`
- 保质期天数：前端 `shelfLifeDays` ↔ 后端 `shelfLifeDays`
- 仓库位置：前端 `warehouseLocation` ↔ 后端 `warehouseLocation`
- 备注说明：前端 `description` ↔ 后端 `description`
- 质检状态：前端 `qualityStatus` ↔ 后端 `qualityStatus`
- 检验员：前端 `inspector` ↔ 后端 `inspector`
- 检验日期：前端 `inspectionDate` ↔ 后端 `inspectionDate`
- 质检备注：前端 `qualityRemarks` ↔ 后端 `qualityRemarks`
- 供应商评价：前端 `ratings` ↔ 后端 `quality`, `delivery`, `price`, `service`

————————————————————————————————————————————————
## 潜在问题和改进建议

1. **字段命名已统一**：
   - 总金额已统一使用`totalPrice`字段
   - 供应商ID已统一使用`supplierId`字段

2. **数据结构不规范**：
   - 供应商评分在database_flow.js中直接作为顶级字段，而不是作为一个对象，这与前端的`ratings`对象不一致
   - 建议将评分统一为一个`ratings`或`supplierRatings`对象

3. **字段缺失**：
   - ~~入库记录缺少唯一标识符`id`字段，建议添加~~ (已添加)
   - 缺少创建时间和更新时间字段，建议添加`createdAt`和`updatedAt`

4. **枚举值不一致**：
   - 质检状态在不同地方使用了不同的值（如"合格"、"PASSED"、"passed"等），建议统一枚举值

5. **图片处理改进**：
   - 图片存储结构不够清晰，建议统一为一个标准格式，包含url、name、size等属性
   - 建议添加图片压缩和格式转换功能

6. **模板功能优化**：
   - 模板与实际入库记录的字段映射不完全一致，建议完全统一
   - 建议添加模板分类和标签功能，方便管理

7. **数据验证**：
   - 缺少前端和后端的一致性数据验证规则，建议添加统一的验证逻辑
   - 建议添加必填字段的明确标记和验证

8. **代码结构优化**：
   - 建议将共用的字段定义和验证逻辑抽取到单独的文件中
   - 建议使用TypeScript定义接口，提高类型安全性