# 供应商字段表列表

## frontend\src\views\Suppliers.vue
功能：供应商列表页面

### 展示字段
- 供应商名称 = 字段 `supplier.name`
- 供应商类型 = 字段 `supplier.category`
- 供应商等级 = 字段 `supplier.grade`
- 联系电话 = 字段 `supplier.phone`
- 供应商地址 = 字段 `supplier.address`
- 主营产品 = 字段 `supplier.mainProducts`
- 合作次数 = 字段 `supplier.transactionCount`
- 采购金额 = 字段 `supplier.transactionAmount`
- 最后交易时间 = 字段 `supplier.lastTransactionTime`
- 评分 = 字段 `supplier.rating`
- 状态 = 字段 `supplier.status`

### 状态字段
- 加载状态 = 字段 `loading`
- 刷新状态 = 字段 `refreshing`
- 加载更多状态 = 字段 `loadingMore`
- 是否已完成 = 字段 `finished`
- 当前页码 = 字段 `page`
- 每页数量 = 字段 `pageSize`
- 供应商列表 = 字段 `supplierList`
- 搜索文本 = 字段 `searchText`
- 状态筛选 = 字段 `statusFilter`
- 是否有供应商数据 = 字段 `hasSuppliers`（计算属性）

### 方法
- 获取供应商数据 = 方法 `fetchSupplierData`
- 应用筛选 = 方法 `applyFilters`
- 搜索处理 = 方法 `handleSearch`
- 状态筛选变化 = 方法 `handleStatusChange`
- 下拉刷新 = 方法 `onRefresh`
- 加载更多 = 方法 `onLoad`
- 获取状态标签类型 = 方法 `getStatusTagType`
- 获取状态文本 = 方法 `getStatusText`
- 格式化价格 = 方法 `formatPrice`
- 格式化日期 = 方法 `formatDate`
- 编辑供应商 = 方法 `editSupplier`
- 从供应商采购 = 方法 `purchaseFromSupplier`
- 跳转到添加供应商 = 方法 `goToAddSupplier`
- 跳转到供应商分析 = 方法 `goToAnalysis`

————————————————————————————————————————————————
## frontend\src\views\SuppliersAdd.vue
功能：供应商添加/编辑页面

### 表单字段
- 供应商名称 = 字段 `supplierForm.suppliername`
- 供应商编码 = 字段 `supplierForm.supplierId`
- 联系人 = 字段 `supplierForm.supplierContact`
- 联系电话 = 字段 `supplierForm.supplierPhone`
- 详细地址 = 字段 `supplierForm.supplieraddress`
- 主营产品 = 字段 `supplierForm.mainProducts`
- 供应商类别 = 字段 `supplierForm.supplierCategory`
- 供应商等级 = 字段 `supplierForm.supplierGrade`
- 合作年限 = 字段 `supplierForm.cooperationYears`
- 状态 = 字段 `supplierForm.supplierStatus`
- 备注 = 字段 `supplierForm.notes`

### 状态字段
- 是否为编辑模式 = 字段 `isEdit`（计算属性）
- 供应商ID = 字段 `supplierId`（计算属性）
- 供应商类别选项 = 字段 `categoryOptions`
- 供应商等级选项 = 字段 `gradeOptions`

### 方法
- 生成供应商编码 = 方法 `generateSupplierId`
- 获取供应商详情 = 方法 `getSupplierDetail`
- 保存供应商信息 = 方法 `saveSupplier`
- 表单提交 = 方法 `handleSubmit`
- 返回列表 = 方法 `goBack`

————————————————————————————————————————————————
## frontend\src\stores\Supplier_Calculations.js
功能：供应商计算逻辑

### 导出函数
- 计算供应商状态 = 方法 `calculateSupplierStatus`
- 计算供应商交易统计数据 = 方法 `calculateSupplierTransactionStats`
- 批量计算供应商状态和交易统计 = 方法 `calculateSuppliersWithStats`
- 获取供应商状态分布统计 = 方法 `getSupplierStatusDistribution`
- 获取按交易金额排序的前N名供应商 = 方法 `getTopSuppliersByAmount`
- 获取按交易次数排序的前N名供应商 = 方法 `getTopSuppliersByCount`
- 获取供应商统计数据 = 方法 `getSupplierStatistics`

### 导出常量
- 供应商状态文本映射 = 常量 `supplierStatusText`
- 供应商状态标签类型映射 = 常量 `supplierStatusTagType`


————————————————————————————————————————————————
## frontend\src\mock\api\suppliersApi.js
功能：供应商相关API接口

### API方法
- 获取供应商列表 = 方法 `getList`
- 获取供应商详情 = 方法 `getDetail`
- 获取供应商统计数据 = 方法 `getStatistics`
- 添加供应商 = 方法 `add`
- 更新供应商 = 方法 `update`

### 辅助方法
- 计算供应商状态 = 方法 `calculateSupplierStatus`
- 计算供应商交易统计数据 = 方法 `calculateSupplierTransactionStats`

### 返回字段
#### getList 返回字段
- 总数 = 字段 `total`
- 当前页 = 字段 `page`
- 每页数量 = 字段 `pageSize`
- 供应商列表 = 字段 `list`，包含以下字段：
  - ID = 字段 `supplierId`
  - 名称 = 字段 `suppliername`
  - 电话 = 字段 `supplierPhone`
  - 地址 = 字段 `supplieraddress`
  - 类别 = 字段 `supplierCategory`
  - 等级 = 字段 `supplierGrade`
  - 主营产品 = 字段 `mainProducts`
  - 合作年限 = 字段 `cooperationYears`
  - 交易次数 = 字段 `transactionCount`
  - 交易金额 = 字段 `transactionAmount`
  - 最后交易时间 = 字段 `lastTransactionTime`
  - 备注 = 字段 `notes`
  - 评分 = 字段 `rating`
  - 状态 = 字段 `supplierstatus`

#### getDetail 返回字段
- ID = 字段 `supplierId`
- 名称 = 字段 `suppliername`
- 电话 = 字段 `supplierPhone`
- 地址 = 字段 `supplieraddress`
- 类别 = 字段 `supplierCategory`
- 等级 = 字段 `supplierGrade`
- 主营产品 = 字段 `mainProducts`
- 合作年限 = 字段 `cooperationYears`
- 交易次数 = 字段 `transactionCount`
- 交易金额 = 字段 `transactionAmount`
- 最后交易时间 = 字段 `lastTransactionTime`
- 评分 = 字段 `rating`
- 状态 = 字段 `supplierStatus`
- 交易记录 = 字段 `transactions`

#### getStatistics 返回字段
- 总供应商数 = 字段 `totalSuppliers`
- 活跃供应商数 = 字段 `activeSuppliers`
- 总交易次数 = 字段 `totalTransactions`
- 总交易金额 = 字段 `totalAmount`
- 状态分布 = 字段 `statusDistribution`
- 按交易金额排序的前10名供应商 = 字段 `topSuppliersByAmount`
- 按交易次数排序的前10名供应商 = 字段 `topSuppliersByCount`

#### add 返回字段
- 供应商ID = 字段 `supplierId`

#### update 返回字段
- 无返回数据，仅返回成功消息

————————————————————————————————————————————————
## frontend\src\mock\data\suppliers_data.js
功能：供应商数据存储

### 数据结构
- 供应商ID = 字段 `supplierId`
- 供应商名称 = 字段 `suppliername`
- 联系人 = 字段 `supplierContact`
- 联系电话 = 字段 `supplierPhone`
- 供应商地址 = 字段 `supplieraddress`
- 供应商类别 = 字段 `supplierCategory`
- 供应商等级 = 字段 `supplierGrade`
- 供应商状态 = 字段 `supplierStatus`
- 主营产品 = 字段 `mainProducts`
- 合作年限 = 字段 `cooperationYears`
- 备注 = 字段 `notes`
- 创建时间 = 字段 `createTime`
- 更新时间 = 字段 `updateTime`

### 方法
- 获取供应商选项 = 方法 `getSupplierOptions`

————————————————————————————————————————————————
## 字段映射关系

### 前端展示与后端数据字段映射
- 供应商名称：前端 `supplier.name` ↔ 后端 `suppliername`
- 供应商ID/编码：前端 `supplier.id` ↔ 后端 `supplierId`
- 联系人：前端无直接展示 ↔ 后端 `supplierContact`
- 联系电话：前端 `supplier.phone` ↔ 后端 `supplierPhone`
- 供应商地址：前端 `supplier.supplieraddress` ↔ 后端 `supplieraddress`（注意：这里存在不一致，API返回的是`address`）
- 供应商类别：前端 `supplier.category` ↔ 后端 `supplierCategory`
- 供应商等级：前端 `supplier.grade` ↔ 后端 `supplierGrade`
- 供应商状态：前端 `supplier.status` ↔ 后端 `supplierStatus`（注意：API计算后返回的是`status`）
- 主营产品：前端 `supplier.mainProducts` ↔ 后端 `mainProducts`
- 合作年限：前端无直接展示 ↔ 后端 `cooperationYears`
- 交易次数：前端 `supplier.transactionCount` ↔ 后端动态计算
- 交易金额：前端 `supplier.transactionAmount` ↔ 后端动态计算
- 最后交易时间：前端 `supplier.lastTransactionTime` ↔ 后端动态计算
- 评分：前端 `supplier.rating` ↔ 后端动态计算

### 表单字段与数据字段映射
- 供应商名称：表单 `supplierForm.suppliername` ↔ 后端 `suppliername`
- 供应商编码：表单 `supplierForm.supplierId` ↔ 后端 `supplierId`
- 联系人：表单 `supplierForm.supplierContact` ↔ 后端 `supplierContact`
- 联系电话：表单 `supplierForm.supplierPhone` ↔ 后端 `supplierPhone`
- 详细地址：表单 `supplierForm.address` ↔ 后端 `supplieraddress'
- 主营产品：表单 `supplierForm.mainProducts` ↔ 后端 `mainProducts`
- 供应商类别：表单 `supplierForm.supplierCategory` ↔ 后端 `supplierCategory`
- 供应商等级：表单 `supplierForm.supplierGrade` ↔ 后端 `supplierGrade`
- 合作年限：表单 `supplierForm.cooperationYears` ↔ 后端 `cooperationYears`
- 状态：表单 `supplierForm.supplierStatus` ↔ 后端 `supplierStatus`
- 备注：表单 `supplierForm.notes` ↔ 后端 `notes`

————————————————————————————————————————————————
## 潜在问题和改进建议



3. **状态字段计算逻辑**：
   - 供应商状态由后端动态计算，但也可以由用户手动设置
   - 在SuppliersAdd.vue中，状态选项只有`active`和`inactive`
   - 但在Suppliers.vue中，状态有`new`、`active`、`normal`、`pending`、`disabled`
   - 建议统一状态选项和处理逻辑
