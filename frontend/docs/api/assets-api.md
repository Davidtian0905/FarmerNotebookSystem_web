# 资产总览API文档

## 概述

资产总览API提供农民记账系统的资产汇总、趋势分析、收支分析等核心功能。支持多种时间维度查询（年度、月度、周度、日度、总计），为前端提供完整的资产数据服务。系统采用Mock模式和真实API模式双重支持，便于开发和生产环境使用。

## 数据流架构

```
前端组件 → API接口层 → Mock/真实API → 数据处理层 → 数据存储
    ↓         ↓           ↓           ↓          ↓
用户交互   参数验证     模式切换     业务逻辑    Mock数据库/真实数据库
    ↓         ↓           ↓           ↓          ↓
数据展示 ← 响应格式化 ← 统一接口 ← 计算汇总 ← 交易记录
```

### 数据来源说明
- **交易流水**: 所有财务数据的基础，包含入库(INBOUND)和出库(OUTBOUND)记录
- **资产计算**: 基于交易流水实时计算收入、支出、净资产等指标
- **API接口**: 提供标准化的数据访问接口
- **前端展示**: 将计算结果以图表和表格形式展示

### 字段映射关系
| 计算变量 | 字段名 | 说明 | 计算公式 |
|----------|--------|------|----------|
| 【收入总额】 | totalIncome | 指定时间范围内的总收入 | SUM(OUTBOUND.amount) |
| 【支出总额】 | totalExpense | 指定时间范围内的总支出 | SUM(INBOUND.amount) |
| 【净资产】 | netAssets | 收入减去支出的净额 | totalIncome - totalExpense |
| 【交易笔数】 | transactionCount | 指定时间范围内的交易总数 | COUNT(transactions) |
| 【入库笔数】 | inboundCount | 指定时间范围内的入库交易数 | COUNT(INBOUND) |
| 【出库笔数】 | outboundCount | 指定时间范围内的出库交易数 | COUNT(OUTBOUND) |
| 【月度数据】 | monthlyData | 按月份分组的数据数组 | GROUP BY month |
| 【年度数据】 | yearlyData | 按年份分组的数据数组（total模式） | GROUP BY year |
| 【日度数据】 | dailyData | 按日期分组的数据数组（week/month模式） | GROUP BY date |

### 前端字段标准化建议

基于两个Vue文件的对比分析，建议统一使用以下字段命名：

```javascript
// 推荐的标准字段结构
const assetData = {
  // 基础汇总数据
  totalIncome: 0,
  totalExpense: 0, 
  netAssets: 0,
  transactionCount: 0,
  inboundCount: 0,
  outboundCount: 0,
  
  // 时间维度数据
  period: 'year', // year/month/week/total
  
  // 图表数据
  chartData: {
    labels: [],
    datasets: []
  },
  
  // 收支趋势数据
  incomeExpenseData: {
    income: [],
    expense: []
  },
  
  // 结构分析数据
  incomeStructure: [],
  costStructure: []
}
```

## 通用规范

### 请求格式
- **请求方式**: POST
- **Content-Type**: application/json
- **认证**: 需要在header中设置auth字段，值为当前登录后保存的token

### 请求参数
所有请求参数必须使用JSON格式，即使是空对象也要传递 `{}`

### 响应格式
后端统一返回的参数为JSON对象，格式如下：
```json
{
  "error": 0,
  "body": object,
  "message": ""
}
```

**错误码说明**:
- `error = 0`: 表示没有任何异常
- `error = 500`: 表示系统异常，需要弹出系统异常的错误
- `error = 401`: 表示需要登录
- `error = 其他值`: 表示业务异常，直接弹出message内容

## API接口列表

### 1. 获取资产汇总数据

**接口路径**: `/assets/summary` | `/api/assets/summary` | `/mock/assets/summary`  
**请求方法**: POST  
**接口描述**: 获取指定时间维度的资产汇总数据，支持年度、月度、周度、日度和总计查询

**数据来源**: 基于交易流水实时计算

#### 请求参数

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| period | string | 是 | 'year' | 时间维度：'year'\|'month'\|'week'\|'day'\|'total' |
| year | number | 否 | 当前年份 | 指定年份 |
| month | number | 否 | 当前月份 | 指定月份（period为month时必填） |
| currentDayOfWeek | number | 否 | - | 当前星期几（1-7，周度查询时使用） |
| currentDate | string | 否 | - | 当前日期 YYYY-MM-DD（周度查询时使用） |
| startDate | string | 否 | - | 开始日期 YYYY-MM-DD |
| endDate | string | 否 | - | 结束日期 YYYY-MM-DD |

**请求示例**:
```json
{
  "period": "year",
  "year": 2025,
  "month": 1
}
```

**参数详细说明**:
- `period` (必填): 时间维度
  - `year`: 本年数据（12个月）
  - `month`: 本月数据（1-31天）
  - `week`: 本周数据（7天）
  - `day`: 本日数据
  - `total`: 总统计数据（从最早年份至今）
- `year` (可选): 指定年份，默认为当前年份
- `month` (可选): 指定月份，默认为当前月份

**计算逻辑**:
- 【收入总额】 = 指定时间范围内所有OUTBOUND交易的amount总和
- 【支出总额】 = 指定时间范围内所有INBOUND交易的amount总和
- 【净资产】 = 【收入总额】 - 【支出总额】
- 【月度数据】 = 按月份分组计算每月的收入、支出、净资产

**响应示例**:
```json
{
  "error": 0,
  "body": {
    "period": "year",
    "year": 2025,
    "month": null,
    "summary": {
      "totalIncome": 128560,
      "totalExpense": 89240,
      "netAssets": 39320,
      "transactionCount": 24,
      "inboundCount": 12,
      "outboundCount": 12
    },
    "monthlyData": [
      {
        "month": 1,
        "income": 12000,
        "expense": 8000,
        "netAssets": 4000,
        "transactionCount": 2
      },
      {
        "month": 2,
        "income": 13500,
        "expense": 9200,
        "netAssets": 4300,
        "transactionCount": 2
      }
    ],
    "yearlyData": [],
    "dailyData": [],
    "weeklyData": []
  },
  "message": "获取成功"
}
```

**字段说明**:
- `period`: 查询的时间维度
- `year`: 查询的年份
- `month`: 查询的月份（月度查询时有效）
- `summary`: 汇总数据
  - `totalIncome`: 【收入总额】
  - `totalExpense`: 【支出总额】
  - `netAssets`: 【净资产】
  - `transactionCount`: 【交易笔数】
  - `inboundCount`: 入库交易笔数
  - `outboundCount`: 出库交易笔数
- `monthlyData`: 【月度数据】数组（年度查询时返回）

### 2. 获取资产趋势数据

**接口路径**: `/assets/trend` | `/api/assets/trend` | `/mock/assets/trend`  
**请求方法**: POST  
**接口描述**: 获取资产变化趋势数据，支持多种时间维度的趋势分析

**数据来源**: 基于交易流水实时计算

#### 请求参数

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| period | string | 是 | 'year' | 时间维度：'year'\|'month'\|'week'\|'total' |
| year | number | 否 | 当前年份 | 指定年份 |
| month | number | 否 | 当前月份 | 指定月份（period为month时必填） |
| currentDayOfWeek | number | 否 | - | 当前星期几（1-7，周度查询时使用） |
| currentDate | string | 否 | - | 当前日期 YYYY-MM-DD（周度查询时使用） |

**请求示例**:
```json
{
  "period": "year",
  "year": 2025,
  "month": 1
}
```

**计算逻辑**:
- 【趋势数据】 = 按时间维度分组计算累计净资产
- 【标签数据】 = 根据时间维度生成对应的标签数组
- 【图表配置】 = 预设的图表样式和颜色配置

**响应示例**:
```json
{
  "error": 0,
  "body": {
    "labels": ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
    "datasets": [
      {
        "label": "净资产",
        "data": [4000, 8300, 12700, 17200, 21800, 26500, 31300, 36200, 41200, 46300, 51500, 56800],
        "borderColor": "#10B981",
        "backgroundColor": "rgba(16, 185, 129, 0.1)",
        "tension": 0.4,
        "fill": true
      }
    ]
  },
  "message": "获取成功"
}
```

**字段说明**:
- `labels`: 【标签数据】数组，根据时间维度生成
- `datasets`: 图表数据集
  - `label`: 数据系列名称
  - `data`: 【趋势数据】数组，累计净资产值
  - `borderColor`: 线条颜色
  - `backgroundColor`: 填充颜色
  - `tension`: 线条曲度
  - `fill`: 是否填充

### 3. 获取收支趋势数据

**接口路径**: `/assets/income-expense` | `/api/assets/income-expense` | `/mock/assets/income-expense`  
**请求方法**: POST  
**接口描述**: 获取收入和支出的趋势对比数据，支持多种时间维度分析

**数据来源**: 基于交易流水实时计算

#### 请求参数

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| period | string | 是 | 'year' | 时间维度：'year'\|'month'\|'week'\|'total' |
| year | number | 否 | 当前年份 | 指定年份 |
| month | number | 否 | 当前月份 | 指定月份（period为month时必填） |
| currentDayOfWeek | number | 否 | - | 当前星期几（1-7，周度查询时使用） |
| currentDate | string | 否 | - | 当前日期 YYYY-MM-DD（周度查询时使用） |

**请求示例**:
```json
{
  "period": "year",
  "year": 2025,
  "month": 1
}
```

**计算逻辑**:
- 【收入数据】 = 按时间维度分组计算OUTBOUND交易的amount总和
- 【支出数据】 = 按时间维度分组计算INBOUND交易的amount总和
- 【标签数据】 = 根据时间维度生成对应的标签数组

**响应示例**:
```json
{
  "error": 0,
  "body": {
    "labels": ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
    "datasets": [
      {
        "label": "收入",
        "data": [12000, 13500, 14200, 15800, 16500, 18200, 18900, 20600, 21300, 23000, 23700, 25400],
        "backgroundColor": "#10B981"
      },
      {
        "label": "支出",
        "data": [8000, 9200, 9800, 11200, 11800, 13200, 13800, 15200, 15800, 17200, 17800, 19200],
        "backgroundColor": "#EF4444"
      }
    ]
  },
  "message": "获取成功"
}
```

**字段说明**:
- `labels`: 【标签数据】数组，根据时间维度生成
- `datasets`: 图表数据集数组
  - `label`: 数据系列名称（收入/支出）
  - `data`: 【收入数据】或【支出数据】数组
  - `backgroundColor`: 柱状图颜色

### 4. 获取收入结构分析

**接口路径**: `/assets/income-structure` | `/api/assets/income-structure` | `/mock/assets/income-structure`  
**请求方法**: POST  
**接口描述**: 获取收入来源的结构分析数据，按产品类别统计收入占比

**数据来源**: 基于交易流水实时计算

#### 请求参数

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| period | string | 是 | 'year' | 时间维度：'year'\|'month'\|'week'\|'total' |
| year | number | 否 | 当前年份 | 指定年份 |
| month | number | 否 | 当前月份 | 指定月份（period为month时必填） |
| currentDayOfWeek | number | 否 | - | 当前星期几（1-7，周度查询时使用） |
| currentDate | string | 否 | - | 当前日期 YYYY-MM-DD（周度查询时使用） |

**请求示例**:
```json
{
  "period": "year",
  "year": 2025,
  "month": 1
}
```

**计算逻辑**:
- 【收入结构】 = 按产品类别分组统计OUTBOUND交易的amount总和
- 【占比计算】 = 各类别收入 / 总收入 * 100%
- 【颜色配置】 = 预设的图表颜色方案

**响应示例**:
```json
{
  "error": 0,
  "body": [
    {
      "name": "铁观音销售",
      "value": 45680,
      "percentage": 35.5,
      "color": "#10B981"
    },
    {
      "name": "龙井茶销售",
      "value": 32140,
      "percentage": 25.0,
      "color": "#3B82F6"
    },
    {
      "name": "普洱茶销售",
      "value": 28920,
      "percentage": 22.5,
      "color": "#8B5CF6"
    },
    {
      "name": "其他茶类",
      "value": 21820,
      "percentage": 17.0,
      "color": "#F59E0B"
    }
  ],
  "message": "获取成功"
}
```

### 5. 获取成本结构分析

**接口路径**: `/assets/cost-structure` | `/api/assets/cost-structure` | `/mock/assets/cost-structure`  
**请求方法**: POST  
**接口描述**: 获取成本支出的结构分析数据，按支出类别统计成本占比

**数据来源**: 基于交易流水实时计算

#### 请求参数

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| period | string | 是 | 'year' | 时间维度：'year'\|'month'\|'week'\|'total' |
| year | number | 否 | 当前年份 | 指定年份 |
| month | number | 否 | 当前月份 | 指定月份（period为month时必填） |
| currentDayOfWeek | number | 否 | - | 当前星期几（1-7，周度查询时使用） |
| currentDate | string | 否 | - | 当前日期 YYYY-MM-DD（周度查询时使用） |

**请求示例**:
```json
{
  "period": "year",
  "year": 2025,
  "month": 1
}
```

**计算逻辑**:
- 【成本结构】 = 按支出类别分组统计INBOUND交易的amount总和
- 【占比计算】 = 各类别支出 / 总支出 * 100%
- 【颜色配置】 = 预设的图表颜色方案

**响应示例**:
```json
{
  "error": 0,
  "body": [
    {
      "name": "茶叶原料",
      "value": 52340,
      "percentage": 58.6,
      "color": "#EF4444"
    },
    {
      "name": "包装材料",
      "value": 18960,
      "percentage": 21.2,
      "color": "#EAB308"
    },
    {
      "name": "运输费用",
      "value": 12450,
      "percentage": 13.9,
      "color": "#6366F1"
    },
    {
      "name": "其他费用",
      "value": 5490,
      "percentage": 6.3,
      "color": "#6B7280"
    }
  ],
  "message": "获取成功"
}
```

### 6. 获取资产统计数据

**接口路径**: `/assets/statistics` | `/api/assets/statistics` | `/mock/assets/statistics`  
**请求方法**: POST  
**接口描述**: 获取资产的统计分析数据，包括平均值、增长率等指标

**数据来源**: 基于交易流水实时计算

#### 请求参数

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| period | string | 是 | 'year' | 时间维度：'year'\|'month'\|'week'\|'total' |
| year | number | 否 | 当前年份 | 指定年份 |
| month | number | 否 | 当前月份 | 指定月份（period为month时必填） |
| currentDayOfWeek | number | 否 | - | 当前星期几（1-7，周度查询时使用） |
| currentDate | string | 否 | - | 当前日期 YYYY-MM-DD（周度查询时使用） |

**请求示例**:
```json
{
  "period": "year",
  "year": 2025,
  "month": 1
}
```

**计算逻辑**:
- 【平均日收入】 = 总收入 / 时间范围天数
- 【平均日支出】 = 总支出 / 时间范围天数
- 【增长率】 = (当前期间净资产 - 上期净资产) / 上期净资产 * 100%

**响应示例**:
```json
{
  "error": 0,
  "body": {
    "totalIncome": 128560,
    "totalExpense": 89240,
    "netAssets": 39320,
    "avgDailyIncome": 10713,
    "avgDailyExpense": 7437,
    "growthRate": 12.5,
    "statistics": {
      "averageDailyIncome": 500,
      "averageDailyExpense": 300,
      "growthRate": 15.5,
      "totalTransactions": 120,
      "activeCategories": 8,
      "netAssetsGrowth": 12.3,
      "incomeGrowthRate": 8.7,
      "expenseGrowthRate": 5.2
    },
    "period": "year",
    "year": 2025,
    "month": 1
  },
  "message": "获取成功"
}
```

## 时间维度说明

### 支持的时间维度

- **year**: 年度数据，返回12个月的数据点
- **month**: 月度数据，返回指定月份每日的数据点  
- **week**: 周度数据，返回7天的数据点
- **day**: 日度数据，返回单日汇总数据
- **total**: 总计数据，返回所有时间的汇总统计信息

### 时间参数规则

1. **year参数**: 指定查询的年份，默认为当前年份
2. **month参数**: 指定查询的月份（1-12），仅在period为'month'时必填
3. **currentDayOfWeek参数**: 当前星期几（1-7），周度查询时使用，用于确定周的起始和结束
4. **currentDate参数**: 当前日期（YYYY-MM-DD格式），周度查询时使用，配合currentDayOfWeek计算周范围
5. **时间范围**: 系统会根据period自动计算数据范围

### 周度查询说明

周度查询需要提供 `currentDayOfWeek` 和 `currentDate` 参数：
- 系统会根据当前日期和星期几，计算出本周的起始日期（周一）和结束日期（周日）
- 返回本周7天的数据，包括已过去的天数和未来的天数（未来天数数据为0）

**示例**：
```json
{
  "period": "week",
  "year": 2025,
  "currentDayOfWeek": 3,
  "currentDate": "2025-01-15"
}
```

### 数据计算逻辑

- **年度数据**: 按月份分组统计，返回12个月的数据点
- **月度数据**: 按日期分组统计，返回指定月份每日数据
- **周度数据**: 按日期分组统计，返回本周7天数据
- **日度数据**: 返回指定日期的汇总数据
- **总计数据**: 返回所有交易记录的汇总统计

### 本年 (period: "year")
- **数据范围**: 当前年份的12个月数据
- **标签格式**: ["1月", "2月", ..., "12月"]
- **数据特点**: 显示每月累计的净资产、收入、支出数据

### 本月 (period: "month")
- **数据范围**: 当前月份的1-31天数据
- **标签格式**: ["1日", "2日", ..., "31日"]
- **数据特点**: 显示每日累计数据，如果当前月不足31天，只显示实际天数

### 本周 (period: "week")
- **数据范围**: 当前周的7天数据
- **标签格式**: ["周一", "周二", ..., "周日"]
- **数据特点**: 显示每日累计数据

### 总统计 (period: "total")
- **数据范围**: 从最早数据年份到当前年份的数据
- **标签格式**: ["2010年", "2011年", ..., "2025年"]
- **数据特点**: 显示每年累计数据

## 错误处理

### 错误响应格式

```json
{
  "error": 1,
  "message": "错误描述",
  "body": null
}
```

### 常见错误码

| 错误码 | 错误类型 | 说明 | 处理建议 |
|--------|----------|------|----------|
| 0 | 成功 | 请求成功 | - |
| 1 | 参数错误 | 请求参数不正确或缺失 | 检查参数格式和必填项 |
| 2 | 数据不存在 | 查询的数据不存在 | 确认查询条件是否正确 |
| 3 | 服务器内部错误 | 服务器处理异常 | 稍后重试或联系技术支持 |
| 4 | 权限不足 | 没有访问权限 | 检查用户权限设置 |
| 5 | 请求频率过高 | API调用频率超限 | 降低请求频率 |
| 400 | 参数错误 | 显示具体错误信息 | 检查请求参数 |
| 401 | 未授权 | 跳转到登录页面 | 重新登录 |
| 500 | 系统错误 | 显示系统错误提示 | 联系技术支持 |

### 错误处理最佳实践

1. **参数验证**: 前端应在发送请求前验证参数的完整性和格式
2. **错误重试**: 对于网络错误或服务器错误，可以实现自动重试机制
3. **用户提示**: 根据错误码向用户显示友好的错误提示信息
4. **日志记录**: 记录API调用错误，便于问题排查

### Mock模式错误处理

在Mock模式下，系统会模拟真实的错误场景：
- 参数验证错误
- 数据格式错误
- 模拟网络延迟和超时
- 随机错误场景（用于测试错误处理逻辑）

### 错误响应示例
```json
{
  "error": 400,
  "body": null,
  "message": "时间维度参数错误"
}
```

## Mock数据结构说明

### 交易记录结构

```javascript
{
  id: string,           // 交易ID
  date: string,         // 交易日期 (YYYY-MM-DD)
  type: 'INBOUND' | 'OUTBOUND',  // 交易类型
  amount: number,       // 交易金额
  category: string,     // 交易分类
  description: string,  // 交易描述
  productType: string   // 产品类型
}
```

### 数据生成规则

1. **时间范围**: 自动生成过去12个月的交易数据
2. **交易类型**: 随机生成收入(OUTBOUND)和支出(INBOUND)交易
3. **金额范围**: 收入1000-5000元，支出500-2000元
4. **分类多样性**: 包含多种农业相关的收入和支出分类
5. **数据一致性**: 确保生成的数据在不同API接口间保持一致

### Mock API特性

- **实时计算**: Mock数据基于模拟的交易记录实时计算，确保数据的准确性
- **参数响应**: 根据不同的查询参数返回相应的数据范围
- **错误模拟**: 支持模拟各种错误场景，便于前端错误处理测试
- **性能优化**: 使用缓存机制提高Mock API的响应速度

## 版本更新记录

### v2.1.0 (2025-01-15)
- 新增周度查询支持，添加 `currentDayOfWeek` 和 `currentDate` 参数
- 优化数据结构，统一返回格式包含 `monthlyData`、`yearlyData`、`dailyData`、`weeklyData`
- 完善错误处理机制，新增详细的错误码说明
- 更新Mock API实现，支持更真实的数据模拟

### v2.0.0 (2025-01-01)
- 重构API架构，支持Mock模式和真实API模式切换
- 统一接口路径格式，支持 `/api/` 和 `/mock/` 前缀
- 优化数据计算逻辑，提高查询性能
- 新增资产统计分析接口

### v1.0.0 (2024-12-01)
- 初始版本发布
- 基础的资产汇总、趋势、收支分析功能
- 支持年度、月度、总计查询

## 使用示例

### JavaScript调用示例
```javascript
import request from '@/api/request.js'

// 获取本年资产总览数据
const getYearlyAssets = async () => {
  try {
    const response = await request({
      url: '/assets/overview',
      method: 'post',
      data: {
        period: 'year',
        year: 2025
      }
    })
    
    if (response.error === 0) {
      return response.body
    } else {
      throw new Error(response.message)
    }
  } catch (error) {
    console.error('获取资产数据失败:', error)
    throw error
  }
}
```

### Vue组件使用示例
```javascript
// 在Vue组件中使用
const fetchAssetData = async (period = 'year') => {
  try {
    const data = await getYearlyAssets()
    // 处理数据
    updateCharts(data)
  } catch (error) {
    // 错误处理
    showErrorMessage(error.message)
  }
}
```

## Mock数据结构说明

### 交易流水数据结构 (database_flow.js)

**核心字段**:
```javascript
{
  id: "IN202501160001",           // 交易ID
  type: "INBOUND|OUTBOUND",       // 交易类型：入库/出库
  date: "2025-08-01",            // 交易日期
  time: "09:30:00",              // 交易时间
  amount: 4000,                   // 交易金额
  quantity: 50,                   // 交易数量
  unitPrice: 80,                  // 单价
  productName: "铁观音",          // 产品名称
  category: "乌龙茶",             // 产品类别
  supplier: "福建安溪茶园",   // 供应商
  status: "COMPLETED",            // 交易状态
  description: "特级铁观音采购"   // 交易描述
}
```

**数据特点**:
- 所有财务数据都基于交易流水计算
- INBOUND类型表示支出（采购成本）
- OUTBOUND类型表示收入（销售收入）
- 支持按时间、类型、产品等多维度筛选

### 资产计算数据结构 (database_assets.js)

**计算函数**:
- `calculateSummaryFromTransactions()`: 基础汇总计算
- `calculateYearlySummary()`: 年度汇总
- `calculateMonthlySummary()`: 月度汇总
- `calculateWeeklySummary()`: 周度汇总
- `generateMonthlyData()`: 生成月度数据

**计算逻辑**:
```javascript
// 收入计算
const totalIncome = outboundTransactions.reduce((sum, t) => sum + t.amount, 0)

// 支出计算  
const totalExpense = inboundTransactions.reduce((sum, t) => sum + t.amount, 0)

// 净资产计算
const netAssets = totalIncome - totalExpense
```

### API响应数据结构 (assetsApi.js)

**标准响应格式**:
```javascript
{
  error: 0,                       // 错误码
  body: {                         // 响应数据
    period: "year",               // 时间维度
    year: 2025,                   // 查询年份
    summary: {                    // 汇总数据
      totalIncome: 128560,        // 【收入总额】
      totalExpense: 89240,        // 【支出总额】
      netAssets: 39320,           // 【净资产】
      transactionCount: 24        // 【交易笔数】
    },
    monthlyData: [...]            // 【月度数据】
  },
  message: "获取成功"             // 响应消息
}
```

## 注意事项

1. **认证要求**: 所有接口都需要在请求头中携带有效的认证token
2. **参数格式**: 所有请求参数必须使用JSON格式
3. **时间处理**: 时间维度参数会影响返回数据的结构和标签格式
4. **数据缓存**: 建议在客户端实现适当的数据缓存机制
5. **错误处理**: 必须处理所有可能的错误情况，提供友好的用户提示
6. **数据一致性**: 所有数据都基于交易流水实时计算，确保数据一致性
7. **计算性能**: 大量交易数据时，建议实现数据缓存和增量计算