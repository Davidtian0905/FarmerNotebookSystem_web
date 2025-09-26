# 客户管理字段表列表

## frontend\src\views\Customers.vue
功能：客户列表展示页面

### 展示字段
- 客户名称 = 字段 `customer.customername`
- 客户类型 = 字段 `customer.customcategory`
- 客户等级 = 字段 `customer.customgrade`
- 联系电话 = 字段 `customer.customerphone`
- 客户地址 = 字段 `customer.customeraddress`
- 交易次数 = 字段 `customer.transactionCount`
- 交易金额 = 字段 `customer.transactionAmount`
- 最后交易时间 = 字段 `customer.lastTransactionTime`
- 客户状态 = 字段 `customer.customerStatus`

### 状态字段
- 搜索文本 = 字段 `searchText`
- 状态筛选 = 字段 `statusFilter`
- 加载状态 = 字段 `loading`
- 刷新状态 = 字段 `refreshing`
- 加载更多状态 = 字段 `loadingMore`
- 加载完成状态 = 字段 `finished`
- 当前页码 = 字段 `page`
- 每页数量 = 字段 `pageSize`
- 客户列表 = 字段 `customerList`
- 是否有客户数据 = 字段 `hasCustomers`（计算属性）

### 方法
- 获取客户数据 = 方法 `fetchCustomerData`
- 应用筛选 = 方法 `applyFilters`
- 搜索处理 = 方法 `handleSearch`
- 状态筛选变化 = 方法 `handleStatusChange`
- 下拉刷新 = 方法 `onRefresh`
- 加载更多 = 方法 `onLoad`
- 获取状态标签类型 = 方法 `getStatusTagType`
- 获取状态文本 = 方法 `getStatusText`
- 计算客户状态 = 方法 `calculateCustomerStatus`
- 格式化价格 = 方法 `formatPrice`
- 格式化日期 = 方法 `formatDate`
- 编辑客户 = 方法 `editCustomer`
- 复制地址 = 方法 `copyAddress`
- 导航函数 = 方法 `goBack`、`goToAddCustomer`、`goToAnalysis`

————————————————————————————————————————————————
## frontend\src\views\CustomerAdd.vue
功能：客户添加/编辑页面

### 表单字段
- 客户名称 = 字段 `formData.customername`
- 客户编码 = 字段 `formData.customerId`
- 联系人 = 字段 `formData.customercontact`
- 联系电话 = 字段 `formData.customerphone`
- 客户地址 = 字段 `formData.customeraddress`
- 客户类型 = 字段 `formData.customcategory`
- 客户等级 = 字段 `formData.customgrade`
- 客户来源 = 字段 `formData.customsource`
- 折扣率 = 字段 `formData.discountRate`
- 备注 = 字段 `formData.notes`
- 状态 = 字段 `formData.customerStatus`

### 状态字段
- 是否编辑模式 = 字段 `isEditMode`（计算属性）
- 客户ID = 字段 `customerId`（计算属性）
- 显示用的折扣率 = 字段 `displayDiscountRate`

### 选项数据
- 客户类型选项 = 字段 `customerTypes`
- 客户等级选项 = 字段 `customerGrades`
- 客户来源选项 = 字段 `customerSources`

### 方法
- 更新实际折扣率 = 方法 `updateDiscountRate`
- 生成客户编码 = 方法 `generateCustomerCode`
- 获取客户详情 = 方法 `fetchCustomerDetail`
- 保存客户信息 = 方法 `handleSave`
- 表单提交 = 方法 `handleSubmit`

————————————————————————————————————————————————
## frontend\src\mock\data\customers_data.js
功能：客户数据模块，包含系统中所有客户的基本信息

### 数据结构
- 客户ID = 字段 `customerId`
- 客户名称 = 字段 `customername`
- 客户类型 = 字段 `customcategory`
- 客户等级 = 字段 `customgrade`
- 联系电话 = 字段 `customerphone`
- 客户地址 = 字段 `customeraddress`
- 折扣率 = 字段 `discountRate`
- 联系人 = 字段 `contact`
- 客户来源 = 字段 `customsource`
- 创建时间 = 字段 `createTime`
- 更新时间 = 字段 `updateTime`
- 客户状态 = 字段 `customerStatus`
- 备注 = 字段 `notes`

### 方法
- 获取所有客户列表 = 方法 `getAllCustomers`
- 根据ID获取客户信息 = 方法 `getCustomerById`
- 获取客户选项列表 = 方法 `getCustomerOptions`

————————————————————————————————————————————————
## frontend\src\mock\api\customersApi.js
功能：Mock客户管理API接口，模拟后端API，提供客户数据和交易统计

### 计算方法
- 计算客户状态 = 方法 `calculateCustomerStatus`
  - 参数：`customer` - 客户基本信息
  - 参数：`transactions` - 该客户的交易记录
  - 参数：`lastTransactionTime` - 最后交易时间
  - 返回：客户状态（`new`、`active`、`normal`、`inactive`、`disabled`）
- 计算客户交易统计数据 = 方法 `calculateCustomerTransactionStats`
  - 参数：`customerId` - 客户ID
  - 参数：`allTransactions` - 所有交易记录
  - 返回：交易统计数据（交易次数、交易总金额、最后交易时间）

### API方法
- 获取客户列表 = 方法 `getList`
  - 参数：`page` - 页码，默认为1
  - 参数：`pageSize` - 每页记录数，默认为10
  - 参数：`keyword` - 搜索关键词
  - 参数：`customerStatus` - 客户状态筛选
  - 参数：`sortField` - 排序字段，默认为createTime
  - 参数：`sortOrder` - 排序方式，默认为desc
- 获取客户详情 = 方法 `getDetail`
  - 参数：`id` - 客户ID
- 获取客户统计数据 = 方法 `getStatistics`
  - 参数：`dateRange` - 日期范围（天数），默认为90
- 添加客户 = 方法 `add`
  - 参数：`customername` - 客户名称
  - 参数：`customerphone` - 客户电话
  - 参数：`customeraddress` - 客户地址
  - 参数：`discountRate` - 折扣率，默认为1.0
  - 参数：`customercontact` - 联系人
  - 参数：`customsource` - 客户来源
  - 参数：`notes` - 备注
  - 参数：`customerStatus` - 客户状态，默认为active
  - 参数：`customcategory` - 客户类型
  - 参数：`customergrade` - 客户等级
- 编辑客户 = 方法 `update`
  - 参数：`id` - 客户ID
  - 参数：`customername` - 客户名称
  - 参数：`customerphone` - 客户电话
  - 参数：`customeraddress` - 客户地址
  - 参数：`discountRate` - 折扣率
  - 参数：`customercontact` - 联系人
  - 参数：`customsource` - 客户来源
  - 参数：`notes` - 备注
  - 参数：`customerStatus` - 客户状态
  - 参数：`customcategory` - 客户类型
  - 参数：`customergrade` - 客户等级
- 删除客户 = 方法 `delete`
  - 参数：`id` - 客户ID
- 更新客户状态 = 方法 `updateStatus`
  - 参数：`id` - 客户ID
  - 参数：`customerStatus` - 客户状态，可选值：active(启用)、disabled(停用)

### 动态计算字段
- 交易次数 = 字段 `transactionCount`（根据客户ID筛选的出库交易记录数量）
- 交易总金额 = 字段 `transactionAmount`（根据客户ID筛选的出库交易记录总金额）
- 最后交易时间 = 字段 `lastTransactionTime`（根据客户ID筛选的最新出库交易记录时间）
- 客户状态 = 字段 `customerStatus`（根据交易记录动态计算，规则如下）
  - `new`：最近一个月内新增的客户
  - `active`：最近三个月的交易次数超过10次
  - `normal`：最近三个月的交易次数不足10次
  - `inactive`：最近三个月没有交易
  - `disabled`：在客户管理中手动设置为停用状态

————————————————————————————————————————————————
## 字段映射关系

### 前端展示与后端数据映射
- 客户名称: `customer.customername` ↔ `CUSTOMERS.customername`
- 客户类型: `customer.customcategory` ↔ `CUSTOMERS.customcategory`
- 客户等级: `customer.customgrade` ↔ `CUSTOMERS.customgrade`
- 联系电话: `customer.customerphone` ↔ `CUSTOMERS.customerphone`
- 客户地址: `customer.customeraddress` ↔ `CUSTOMERS.customeraddress`
- 折扣率: `formData.discountRate` ↔ `CUSTOMERS.discountRate`
- 联系人: `formData.customercontact` ↔ `CUSTOMERS.customercontact`
- 客户来源: `formData.customsource` ↔ `CUSTOMERS.customsource`
- 备注: `formData.notes` ↔ `CUSTOMERS.notes`
- 状态: `formData.customerStatus` ↔ `CUSTOMERS.customerStatus`
- 交易次数: `customer.transactionCount` ↔ 动态计算
- 交易金额: `customer.transactionAmount` ↔ 动态计算
- 最后交易时间: `customer.lastTransactionTime` ↔ 动态计算

### 表单字段与API提交字段映射
- 客户名称: `formData.customername` → API提交 `customername`
- 联系电话: `formData.customerphone` → API提交 `customerphone`
- 客户地址: `formData.customeraddress` → API提交 `customeraddress`
- 折扣率: `formData.discountRate` → API提交 `discountRate`
- 联系人: `formData.customercontact` → API提交 `customercontact`
- 备注: `formData.notes` → API提交 `notes`
- 状态: `formData.customerStatus` → API提交 `customerStatus`
- 客户类型: `formData.customcategory` → API提交 `customcategory`
- 客户等级: `formData.customgrade` → API提交 `customergrade`
- 客户来源: `formData.customsource` → API提交 `customsource`

————————————————————————————————————————————————
## 存在的问题和改进建议

1. **字段命名已统一**：
   - 客户名称统一使用 `customername`
   - 联系人统一使用 `customercontact`
   - 备注统一使用 `notes`
   - 客户类型统一使用 `customcategory`
   - 客户等级统一使用 `customergrade`
   - 客户状态统一使用 `customerStatus`
   - 客户来源统一使用 `customsource`

2. **已移除的字段**：
   - `email` 字段已从数据结构中移除
   - `searchQuery` 在 Customers.vue 中已删除，只保留 `searchText` 功能

3. **动态计算字段**：
   - `transactionCount`：根据客户ID筛选的出库交易记录数量
   - `transactionAmount`：根据客户ID筛选的出库交易记录总金额
   - `lastTransactionTime`：根据客户ID筛选的最新出库交易记录时间
   - `customerStatus`：根据交易记录动态计算，规则如下
     - `new`：最近一个月内新增的客户
     - `active`：最近三个月的交易次数超过10次
     - `normal`：最近三个月的交易次数不足10次
     - `inactive`：最近三个月没有交易
     - `disabled`：在客户管理中手动设置为停用状态

4. **API与前端字段已统一**：
   - API返回的字段与前端展示字段已统一命名，不再需要在获取数据后进行映射转换
   - 所有API响应消息已更新为中文，提高用户体验