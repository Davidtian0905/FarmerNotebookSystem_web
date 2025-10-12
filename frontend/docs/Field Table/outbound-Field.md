# 出库记录字段表列表

## frontend\src\views\OutboundRecords.vue
功能：出库记录列表展示页面

### 展示字段
- 商品名称 = 字段 `record.productName`
- 商品编号 = 字段 `record.productCode`
- 物料组合信息 = 字段 `record.materials`
- 物料总成本 = 字段 `record.totalMaterialCost`
- 产品定价 = 字段 `record.productPrice`
- 利润率 = 计算方法 `calculateProfitRate(record)`
- 产品数量 = 字段 `record.productQuantity`
- 产品单位 = 字段 `record.unit`
- 库存状态 = 字段 `record.stockDeductionPreview`

### 状态字段
- 搜索关键词 = 字段 `searchQuery`
- 当前页码 = 字段 `currentPage`
- 每页数量 = 字段 `pageSize`
- 记录列表 = 字段 `records`
- 显示新增出库模态框 = 字段 `showAddoutboundModal`
- 图片预览相关 = 字段 `showImagePreview`, `previewImages`, `currentImageIndex`, `currentMaterialName`
- 物料图片缓存 = 字段 `materialImagesCache`

### 计算属性
- 过滤后的记录 = 计算属性 `filteredRecords`
- 分页后的记录 = 计算属性 `paginatedRecords`
- 总记录数 = 计算属性 `totalRecords`
- 总页数 = 计算属性 `totalPages`
- 可见页码 = 计算属性 `visiblePages`

### 方法
- 加载数据 = 方法 `loadData`
- 格式化日期 = 方法 `formatDate`
- 格式化日期时间 = 方法 `formatDateTime`
- 处理搜索 = 方法 `handleSearch`
- 页面跳转 = 方法 `goToPage`
- 刷新记录 = 方法 `refreshRecords`
- 导出记录 = 方法 `exportRecords`
- 语音记账 = 方法 `handleVoiceRecord`
- 删除记录 = 方法 `deleteRecord`
- 获取渠道名称 = 方法 `getChannelName`
- 获取渠道样式类 = 方法 `getChannelClass`
- 查看记录 = 方法 `viewRecord`
- 编辑记录 = 方法 `editRecord`
- 新增出库 = 方法 `handleAddoutbound`
- 商品组合 = 方法 `handleProductMix`
- 模板管理 = 方法 `handleTemplates`
- 关闭模态框 = 方法 `closeModal`
- 图片预览相关 = 方法 `openImagePreview`, `closeImagePreview`, `prevImage`, `nextImage`
- 加载物料图片 = 方法 `loadMaterialImages`
- 获取物料图片 = 方法 `getMaterialImages`
- 获取所有物料图片 = 方法 `getAllMaterialImages`

————————————————————————————————————————————————
## frontend\src\views\OutboundForm.vue
功能：出库记录添加/编辑页面

### 表单字段
- 产品名称 = 字段 `formData.productName`
- 产品编码 = 字段 `formData.productCode`
- 销售数量 = 字段 `formData.quantity`
- 销售单价 = 字段 `formData.unitPrice`
- 销售总价 = 字段 `formData.totalPrice`
- 客户ID = 字段 `formData.customerId`
- 客户姓名 = 字段 `formData.customerName`
- 联系电话 = 字段 `formData.customerPhone`
- 客户地址 = 字段 `formData.customerAddress`
- 客户折扣率 = 字段 `formData.customerDiscountRate`
- 销售渠道 = 字段 `formData.channel`
- 订单标签 = 字段 `formData.tags`
- 备注说明 = 字段 `formData.notes`
- 日期 = 字段 `formData.date`
- 时间 = 字段 `formData.time`
- 图片 = 字段 `formData.images`
- 类型 = 字段 `formData.type`

### 状态字段
- 加载状态 = 字段 `loading`
- 模板名称弹窗 = 字段 `showTemplateNameModal`
- 模板名称 = 字段 `templateName`
- 客户评价 = 字段 `showcustomerRating`
- 评分 = 字段 `ratings`
- 产品搜索相关 = 字段 `showSearchResults`, `searchResults`, `searchKeyword`
- 新标签 = 字段 `newTag`
- 标签建议 = 字段 `tagSuggestions`
- 图片预览相关 = 字段 `showImagePreview`, `previewImages`, `currentImageIndex`, `currentProductName`
- 产品图片 = 字段 `productImages`
- 产品图片缓存 = 字段 `productImagesCache`

### 计算属性
- 金额 = 计算属性 `amount`

### 方法
- 搜索产品 = 方法 `searchproducts`
- 选择产品 = 方法 `selectproduct`
- 加载产品图片 = 方法 `loadproductImages`
- 计算总价 = 方法 `calculateTotal`
- 更新产品编码 = 方法 `updateproductCode`
- 更新客户信息 = 方法 `updateCustomerInfo`
- 添加标签 = 方法 `addTag`
- 移除标签 = 方法 `removeTag`
- 添加建议标签 = 方法 `addSuggestedTag`
- 保存为模板 = 方法 `saveAsTemplate`
- 关闭模板名称弹窗 = 方法 `closeTemplateNameModal`
- 确认保存模板 = 方法 `confirmSaveTemplate`
- 选择模板 = 方法 `selectTemplate`
- 保存图片 = 方法 `saveImages`
- 处理保存 = 方法 `handleSave`
- 处理提交 = 方法 `handleSubmit`
- 图片预览相关 = 方法 `openImagePreview`, `closeImagePreview`, `prevImage`, `nextImage`
- 获取产品图片 = 方法 `getProductImages`

————————————————————————————————————————————————
## frontend\src\views\OutboundProductMix.vue
功能：商品组合管理页面

### 表单字段
- 商品名称 = 字段 `formData.productName`
- 商品编码 = 字段 `formData.productCode`
- 商品单位 = 字段 `formData.unit`
- 商品描述 = 字段 `formData.description`
- 物料组合 = 字段 `formData.materials`
- 利润率 = 字段 `formData.profitRate`
- 商品定价 = 字段 `formData.sellingPrice`
- 商品数量 = 字段 `formData.productQuantity`
- 商品图片 = 字段 `formData.images`

### 状态字段
- 加载状态 = 字段 `loading`
- 物料搜索相关 = 字段 `showMaterialDropdown`, `materialSearchResults`
- 模板保存相关 = 字段 `showTemplateNameModal`, `templateName`
- 编辑模式相关 = 字段 `isEditMode`, `editRecordId`, `originalRecord`

### 计算属性
- 总物料成本 = 计算属性 `totalMaterialCost`
- 建议售价 = 计算属性 `suggestedPrice`
- 实际利润 = 计算属性 `actualProfit`
- 实际利润率 = 计算属性 `actualProfitRate`
- 是否有库存不足 = 计算属性 `hasInsufficientStock`

### 方法
- 生成商品编码 = 方法 `generateProductCode`
- 添加物料 = 方法 `addMaterial`
- 移除物料 = 方法 `removeMaterial`
- 搜索物料 = 方法 `searchMaterials`
- 选择物料 = 方法 `selectMaterial`
- 更新物料成本 = 方法 `updateMaterialCost`
- 更新建议售价 = 方法 `updateSuggestedPrice`
- 更新实际利润 = 方法 `updateActualProfit`
- 检查库存是否不足 = 方法 `isInsufficientStock`
- 获取剩余库存 = 方法 `getRemainingStock`
- 更新物料库存状态 = 方法 `updateMaterialInventory`
- 图片上传相关 = 方法 `triggerFileInput`, `handleFileSelect`, `handleFileDrop`, `processFiles`
- 生成图片路径 = 方法 `generateImagePath`
- 移除图片 = 方法 `removeImage`
- 保存为模板 = 方法 `saveAsTemplate`
- 关闭模板名称弹窗 = 方法 `closeTemplateNameModal`
- 确认保存模板 = 方法 `confirmSaveTemplate`
- 加载编辑记录数据 = 方法 `loadRecordForEdit`
- 加载模板数据 = 方法 `loadTemplateData`
- 提交表单 = 方法 `handleSubmit`

————————————————————————————————————————————————
## frontend\src\views\OutboundTemplates.vue
功能：出库模板管理页面

### 展示字段
- 模板名称 = 字段 `template.outboundTempname`
- 产品名称 = 字段 `template.productName`
- 产品编码 = 字段 `template.productCode`
- 单价 = 字段 `template.unitPrice`
- 数量 = 字段 `template.quantity`
- 单位 = 字段 `template.unit`
- 总价 = 计算 `template.unitPrice * template.quantity`
- 客户 = 字段 `template.customerName`
- 销售渠道 = 字段 `template.channel`
- 备注 = 字段 `template.notes`
- 创建时间 = 字段 `template.createdAt`
- 更新时间 = 字段 `template.updatedAt`

### 状态字段
- 模板列表 = 字段 `templates`
- 搜索关键词 = 字段 `searchKeyword`
- 渠道筛选 = 字段 `filterChannel`
- 显示创建模态框 = 字段 `showCreateModal`
- 显示编辑模态框 = 字段 `showEditModal`
- 编辑中的模板 = 字段 `editingTemplate`
- 选中的模板 = 字段 `selectedTemplate`
- 编辑中的模板ID = 字段 `editingTemplateId`
- 编辑表单 = 字段 `editForm`
- 基础数据 = 字段 `baseData`
- 客户选项 = 字段 `customerOptions`
- 渠道选项 = 字段 `channelOptions`
- 模板表单 = 字段 `templateForm`

### 计算属性
- 物料类型 = 计算属性 `materialTypes`
- 物料等级 = 计算属性 `materialGrades`
- 过滤后的模板 = 计算属性 `filteredTemplates`

### 方法
- 加载数据 = 方法 `loadData`
- 返回 = 方法 `goBack`
- 获取客户名称 = 方法 `getcustomsName`
- 获取保质期文本 = 方法 `getShelfLifeText`
- 获取渠道标签 = 方法 `getChannelLabel`
- 格式化日期 = 方法 `formatDate`
- 选择模板 = 方法 `selectTemplate`
- 使用模板 = 方法 `useTemplate`
- 开始编辑模板 = 方法 `startEditTemplate`
- 保存模板编辑 = 方法 `saveTemplateEdit`
- 取消模板编辑 = 方法 `cancelTemplateEdit`
- 删除模板 = 方法 `deleteTemplate`
- 关闭模态框 = 方法 `closeModal`
- 保存模板 = 方法 `saveTemplate`

————————————————————————————————————————————————
## frontend\src\mock\outbound_data.js
功能：出库记录模拟数据模块

### 数据结构
- 销售渠道 = 常量 `SALES_CHANNELS`
- 客户信息 = 常量 `CUSTOMERS`
- 出库模板 = 常量 `OUTBOUND_TEMPLATES`
- 物料数据库 = 常量 `MATERIALS_DATABASE`

### 方法
- 获取出库记录 = 方法 `getOutboundRecords`
- 根据类型获取交易记录 = 方法 `getTransactionsByType`
- 根据日期范围获取出库记录 = 方法 `getOutboundRecordsByDateRange`
- 根据客户获取出库记录 = 方法 `getOutboundRecordsByCustomer`
- 根据ID获取单个出库记录 = 方法 `getOutboundRecordById`
- 获取客户选项 = 方法 `getCustomerOptions`
- 获取销售渠道选项 = 方法 `getSalesChannelOptions`
- 获取商品组合 = 方法 `getProductCombos`
- 获取出库模板选项 = 方法 `getOutboundTemplateOptions`
- 获取出库模板数据 = 方法 `getOutboundTemplates`
- 根据ID获取出库模板 = 方法 `getOutboundTemplateById`
- 保存出库模板 = 方法 `saveOutboundTemplate`
- 搜索物料 = 方法 `searchMaterials`
- 根据ID获取物料信息 = 方法 `getMaterialById`
- 保存商品组合为模板 = 方法 `saveProductComboAsTemplate`
- 保存商品组合 = 方法 `saveProductCombo`
- 创建出库记录 = 方法 `createOutboundRecord`
- 创建出库模板 = 方法 `createOutboundTemplate`
- 更新出库模板 = 方法 `updateOutboundTemplate`
- 删除出库模板 = 方法 `deleteOutboundTemplate`
- 获取仓库数据 = 方法 `getWarehouseData`

————————————————————————————————————————————————
## 字段映射关系

### 前端展示与后端数据映射
- 产品名称: `record.productName` ↔ `product_name`
- 产品编码: `record.productCode` ↔ `product_code`
- 产品图片: `record.productImages` ↔ `product_images`
- 销售数量: `formData.quantity` ↔ `quantity`
- 销售单位: `formData.unit` ↔ `unit`
- 销售单价: `formData.unitPrice` ↔ `unit_price`
- 销售总价: `formData.totalPrice` ↔ `total_price`
- 客户ID: `formData.customerId` ↔ `customer_id`
- 客户姓名: `formData.customerName` ↔ `customer_name`
- 客户电话: `formData.customerPhone` ↔ `customer_phone`
- 客户地址: `formData.customerAddress` ↔ `customer_address`
- 客户折扣率: `formData.customerDiscountRate` ↔ `customer_discount_rate`
- 折扣金额: 计算值 ↔ `discount_amount`
- 最终金额: 计算值 ↔ `final_amount`
- 销售渠道: `formData.channel` ↔ `channel`
- 订单标签: `formData.tags` ↔ `tags`
- 备注说明: `formData.notes` ↔ `notes`
- 创建时间: 系统生成 ↔ `created_at`
- 更新时间: 系统生成 ↔ `updated_at`

### 商品组合字段映射
- 商品名称: `formData.productName` ↔ `product_name`
- 商品编码: `formData.productCode` ↔ `product_code`
- 商品单位: `formData.unit` ↔ `unit`
- 商品描述: `formData.description` ↔ `description`
- 商品图片: `formData.images` ↔ `images`
- 物料组合: `formData.materials` ↔ `materials`
- 物料总成本: 计算值 ↔ `total_material_cost`
- 利润率: `formData.profitRate` ↔ `profit_rate`
- 建议售价: 计算值 ↔ `suggested_price`
- 商品定价: `formData.sellingPrice` ↔ `product_price`
- 预期利润: 计算值 ↔ `expected_profit`
- 实际利润率: 计算值 ↔ `actual_profit_rate`
- 商品数量: `formData.productQuantity` ↔ `product_quantity`

### 出库模板字段映射
- 模板名称: `template.outboundTempname` ↔ `template_name`
- 产品名称: `template.productName` ↔ `product_name`
- 产品编码: `template.productCode` ↔ `product_code`
- 单位: `template.unit` ↔ `unit`
- 数量: `template.quantity` ↔ `quantity`
- 单价: `template.unitPrice` ↔ `unit_price`
- 总价: 计算值 ↔ `total_price`
- 客户ID: `template.customerId` ↔ `customer_id`
- 客户名称: `template.customerName` ↔ `customer_name`
- 客户电话: `template.customerPhone` ↔ `customer_phone`
- 客户地址: `template.customerAddress` ↔ `customer_address`
- 客户折扣率: `template.customerDiscountRate` ↔ `customer_discount_rate`
- 销售渠道: `template.channel` ↔ `channel`
- 标签: `template.tags` ↔ `tags`
- 备注: `template.notes` ↔ `notes`
- 创建时间: 系统生成 ↔ `created_at`
- 更新时间: 系统生成 ↔ `updated_at`

————————————————————————————————————————————————
## 存在的问题和改进建议

1. **字段命名不一致问题**：
   - 客户名称在不同组件中使用了不同的字段名：`customerName`、`customer`，建议统一使用`customerName`
   - 产品/商品命名不一致：有些地方使用`product`，有些地方使用`material`，建议统一使用`product`
   - 模板名称使用了`outboundTempname`和`templateName`两种形式，建议统一使用`templateName`

2. **数据结构不一致问题**：
   - 在`database_flow.js`中的出库记录使用了`customerName`，而在API文档中使用了`customername`（小写），建议统一使用驼峰命名法`customerName`
   - 出库记录中的`customerContactPerson`与客户管理中的`customercontact`不一致，建议统一使用`customerContact`

3. **冗余字段**：
   - `customerEmail`字段在实际使用中很少用到，可以考虑移除
   - `productImages`和`images`两个字段功能重复，建议统一使用`images`

4. **计算字段处理**：
   - 一些计算字段如`totalPrice`、`discountAmount`、`finalAmount`等可以在前端计算，不需要每次都从后端获取
   - 建议添加计算属性来处理这些值，减少数据传输量

5. **字段类型标准化**：
   - 金额相关字段应该统一使用`decimal`类型，并保持2位小数
   - 日期时间字段应该统一使用ISO格式

6. **API与前端字段统一**：
   - 建议API返回的字段与前端展示字段保持一致的命名规范，避免在获取数据后进行映射转换
   - 所有API响应消息应该使用中文，提高用户体验

7. **状态管理优化**：
   - 出库记录的状态（如"已完成"、"处理中"等）缺少明确定义，建议添加状态字段并提供状态转换逻辑
   - 可以考虑使用Pinia进行状态管理，提高代码可维护性

8. **图片处理优化**：
   - 当前图片处理逻辑分散在多个组件中，建议抽取为公共服务
   - 图片命名规则不够清晰，建议使用更有意义的命名方式，如包含产品ID和时间戳
