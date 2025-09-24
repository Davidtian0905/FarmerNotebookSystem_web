# Mock 数据系统文档

## 概述

本Mock系统为农民记账系统前端提供完整的模拟数据服务，支持开发和测试环境下的数据模拟。系统采用模块化设计，提供了完整的API模拟、数据管理和工具函数支持。

## 目录结构

```
mock/
├── api/                    # API层模块
│   ├── assetsApi.js       # 资产相关API
│   ├── customersApi.js    # 客户管理API
│   ├── index.js           # API统一入口
│   └── transactionsApi.js # 交易记录API
├── data/                   # 数据模型层
│   ├── ProductCombos_data.js  # 产品组合数据
│   ├── customers_data.js      # 客户数据
│   ├── flow_data.js           # 流水数据
│   ├── inbound_data.js        # 入库数据
│   ├── inboundtemp_data.js    # 入库模板数据
│   ├── outbound_data.js       # 出库数据
│   ├── outboundtemp_data.js   # 出库模板数据
│   └── suppliers_data.js      # 供应商数据
├── utils/                  # 工具函数模块
│   ├── calculations.js    # 计算相关工具
│   ├── dataFilters.js     # 数据过滤工具
│   ├── dateUtils.js       # 日期处理工具
│   ├── index.js           # 工具函数统一导出
│   ├── logger.js          # 日志工具
│   └── responseUtils.js   # 响应格式化工具
├── auth.js                 # 认证模拟
├── dashboard.js            # 仪表板数据
├── database.js             # 基础数据库
├── database_assets.js      # 资产数据管理
├── database_flow.js        # 交易流水数据
├── event_system.js         # 事件系统
├── index.js                # Mock系统主入口
├── server.js               # 服务器模拟
├── user.js                 # 用户数据
└── utils.js                # 通用工具函数
```

## 系统架构

### 分层设计

1. **API层** (`api/`)
   - 提供RESTful API模拟
   - 统一的请求响应格式
   - 支持多种路径格式

2. **数据层** (`database_*.js`)
   - 模拟数据存储和管理
   - 数据初始化和重置
   - 数据验证和调试

3. **工具层** (`utils/`)
   - 通用工具函数
   - 日期处理、数据过滤、计算等
   - 统一的日志和响应格式

4. **业务层** (`auth.js`, `user.js`, `dashboard.js`)
   - 特定业务逻辑模拟
   - 用户认证、权限管理
   - 仪表板数据生成

## 快速开始

### 1. 初始化Mock系统

```javascript
import { initializeMockSystem } from '@/mock'

// 初始化Mock系统
await initializeMockSystem()
```

### 2. 使用API接口

```javascript
import { handleMockApiRequest } from '@/mock/api'

// 获取资产摘要
const summary = await handleMockApiRequest('/api/assets/summary', {
  period: 'month',
  year: 2024
})

// 获取交易列表
const transactions = await handleMockApiRequest('/api/transactions/list', {
  page: 1,
  pageSize: 10,
  period: 'month'
})
```

### 3. 直接使用API模块

```javascript
import { mockAssetsApi, mockTransactionsApi } from '@/mock/api'

// 使用资产API
const assetTrend = await mockAssetsApi.getTrend({
  period: 'year',
  year: 2024
})

// 使用交易API
const stats = await mockTransactionsApi.getStatistics({
  period: 'month',
  year: 2024,
  month: 12
})
```

## API 接口文档

### 资产相关API

#### 1. 获取资产摘要
- **路径**: `/api/assets/summary`
- **方法**: `mockAssetsApi.getSummary(params)`
- **参数**:
  ```javascript
  {
    period: 'year' | 'month' | 'week',  // 时间维度
    year: number,                        // 年份
    month?: number,                      // 月份(可选)
    week?: number                        // 周数(可选)
  }
  ```
- **返回**: 资产摘要数据，包含总资产、净资产、收支情况等

#### 2. 获取资产趋势
- **路径**: `/api/assets/trend`
- **方法**: `mockAssetsApi.getTrend(params)`
- **参数**: 同资产摘要
- **返回**: 资产变化趋势数据

#### 3. 获取收支趋势
- **路径**: `/api/assets/income-expense`
- **方法**: `mockAssetsApi.getIncomeExpenseTrend(params)`
- **参数**: 同资产摘要
- **返回**: 收入支出趋势数据

#### 4. 获取收入结构
- **方法**: `mockAssetsApi.getIncomeStructure(params)`
- **返回**: 收入来源结构分析

#### 5. 获取支出结构
- **方法**: `mockAssetsApi.getCostStructure(params)`
- **返回**: 支出类别结构分析

#### 6. 获取资产统计
- **方法**: `mockAssetsApi.getAssetStatistics(params)`
- **返回**: 详细的资产统计信息

### 交易记录API

#### 1. 获取交易列表
- **路径**: `/api/transactions/list`
- **方法**: `mockTransactionsApi.getList(params)`
- **参数**:
  ```javascript
  {
    page: number,           // 页码
    pageSize: number,       // 每页数量
    period?: string,        // 时间维度
    year?: number,          // 年份
    month?: number,         // 月份
    type?: string,          // 交易类型
    category?: string       // 交易分类
  }
  ```

#### 2. 添加交易记录
- **路径**: `/api/transactions/add`
- **方法**: `mockTransactionsApi.add(transactionData)`

#### 3. 更新交易记录
- **路径**: `/api/transactions/update`
- **方法**: `mockTransactionsApi.update(id, updates)`

#### 4. 删除交易记录
- **路径**: `/api/transactions/delete`
- **方法**: `mockTransactionsApi.delete(id)`

#### 5. 获取交易统计
- **路径**: `/api/transactions/statistics`
- **方法**: `mockTransactionsApi.getStatistics(params)`

## 工具函数

### 日期处理 (`utils/dateUtils.js`)

```javascript
import { 
  getCurrentDateInfo,
  getWeekNumber,
  parseTimeDimensions,
  formatDate
} from '@/mock/utils'

// 获取当前日期信息
const dateInfo = getCurrentDateInfo()

// 获取周数
const week = getWeekNumber(new Date())

// 解析时间维度
const dimensions = parseTimeDimensions('month', 2024, 12)

// 格式化日期
const formatted = formatDate(new Date())
```

### 数据过滤 (`utils/dataFilters.js`)

```javascript
import { 
  filterTransactionsByPeriod,
  filterByDateRange
} from '@/mock/utils'

// 按时间段过滤交易
const filtered = filterTransactionsByPeriod(transactions, 'month', 2024, 12)
```

### 计算工具 (`utils/calculations.js`)

```javascript
import { 
  calculateNetAssets,
  calculateTransactionStats,
  calculateMonthlyTrend
} from '@/mock/utils'

// 计算净资产
const netAssets = calculateNetAssets(transactions)

// 计算交易统计
const stats = calculateTransactionStats(transactions)
```

### 响应格式化 (`utils/responseUtils.js`)

```javascript
import { 
  createSuccessResponse,
  createErrorResponse,
  ERROR_CODES
} from '@/mock/utils'

// 创建成功响应
const response = createSuccessResponse(data, '操作成功')

// 创建错误响应
const error = createErrorResponse(ERROR_CODES.VALIDATION_ERROR, '参数错误')
```

### 日志工具 (`utils/logger.js`)

```javascript
import { createLogger } from '@/mock/utils'

const logger = createLogger('ModuleName')
logger.info('信息日志')
logger.error('错误日志')
logger.debug('调试日志')
```

## 数据管理

### 交易数据 (`database_flow.js`)

- `initializeTransactionData()` - 初始化交易数据
- `getAllTransactions()` - 获取所有交易记录
- `addTransaction(transaction)` - 添加交易记录
- `updateTransaction(id, updates)` - 更新交易记录
- `deleteTransaction(id)` - 删除交易记录
- `debugTransactionData()` - 调试交易数据

### 资产数据 (`database_assets.js`)

- `calculateSummaryFromTransactions(transactions, period, year, month, week)` - 从交易计算摘要
- `debugAssetsData()` - 调试资产数据

## 系统管理

### 初始化和重置

```javascript
import { 
  initializeMockSystem,
  resetMockSystem,
  getMockSystemStatus
} from '@/mock'

// 初始化系统
await initializeMockSystem()

// 重置系统
await resetMockSystem()

// 获取系统状态
const status = await getMockSystemStatus()
```

### 事件系统 (`event_system.js`)

提供数据变更事件监听和通知机制，支持实时数据同步。

## 配置和自定义

### 响应格式

所有API响应都遵循统一格式：

```javascript
{
  success: boolean,
  data: any,
  message: string,
  code?: string,
  timestamp: string
}
```

### 错误处理

系统提供统一的错误码和错误处理机制：

- `VALIDATION_ERROR` - 参数验证错误
- `NOT_FOUND` - 资源未找到
- `INTERNAL_ERROR` - 内部错误

### 日志级别

- `DEBUG` - 调试信息
- `INFO` - 一般信息
- `WARN` - 警告信息
- `ERROR` - 错误信息

## 开发指南

### 添加新的API接口

1. 在相应的API文件中添加方法
2. 在 `api/index.js` 中注册路由
3. 添加相应的数据处理逻辑
4. 更新文档

### 添加新的工具函数

1. 在 `utils/` 目录下创建或修改文件
2. 在 `utils/index.js` 中导出
3. 添加单元测试
4. 更新文档

### 数据结构扩展

1. 修改相应的数据库文件
2. 更新相关的计算和过滤函数
3. 调整API响应格式
4. 更新测试数据

## 注意事项

1. **数据持久化**: Mock数据仅在内存中存储，页面刷新后会重置
2. **性能考虑**: 大量数据操作时注意性能优化
3. **类型安全**: 建议使用TypeScript进行类型检查
4. **测试覆盖**: 重要功能应添加单元测试
5. **文档同步**: 代码变更时及时更新文档

## 故障排除

### 常见问题

1. **API调用失败**: 检查路径格式和参数
2. **数据不一致**: 调用 `resetMockSystem()` 重置数据
3. **性能问题**: 检查数据量和过滤条件
4. **日志输出**: 调整日志级别查看详细信息

### 调试工具

- `debugTransactionData()` - 调试交易数据
- `debugAssetsData()` - 调试资产数据
- `debugEventSystem()` - 调试事件系统
- `getMockSystemStatus()` - 获取系统状态

---

**版本**: 1.0.0  
**更新时间**: 2024-12-20  
**维护者**: 开发团队