# 仪表板API文档

## 概述

仪表板API提供基于系统时间的财务数据概览，包括最近7天的收入、支出、利润数据，以及趋势分析。**数据来源从database_flow.js获取真实交易记录，利润和增长率计算在前端进行**，确保数据一致性和实时性。

## 基础信息

- **基础路径**: `/api/dashboard`
- **请求方式**: POST
- **认证方式**: 需要在请求头中设置 `auth` 字段，值为用户登录后的token
- **数据基准**: 以系统当前时间为基准，获取当天及往前6天的数据
- **计算方式**: 利润 = 收入 - 支出，增长率 = (当前值 - 前值) / |前值| × 100%

## Mock数据支持

### 启用Mock模式
- **自动启用**：开发环境首次访问时自动启用Mock模式
- **UI控制**：在登录页面可以切换Mock模式开关
- **手动设置**：`localStorage.setItem('useMock', 'true')`

### Mock数据特性
- **数据来源**：从database_flow.js获取真实的交易记录数据
- **时间基准**：基于系统当前时间获取最近7天的实际交易数据
- **数据处理**：自动累加支出(INBOUND/采购)和收入(OUTBOUND/销售)交易
- **今日数据**：实时获取当前日期的收支数据计算利润
- **网络延迟**：模拟0.6-0.8秒的网络请求延迟
- **数据完整性**：确保7天数据完整，无数据日期显示为0

## 前端计算逻辑

### 利润计算
- **计算公式**: `net_profit = total_income - total_expense`
- **计算位置**: 前端统一计算，确保数据一致性

### 增长率计算
- **收入增长率**: `(今日收入 - 昨日收入) / |昨日收入| × 100%`
- **支出增长率**: `(今日支出 - 昨日支出) / |昨日支出| × 100%`
- **利润增长率**: `(今日利润 - 昨日利润) / |昨日利润| × 100%`
- **计算位置**: 前端实时计算，基于历史数据

## API接口

### 1. 获取最近7天财务数据

**接口地址**: `POST /api/dashboard/recent_week_data`

**请求参数**:
```json
{
  "userId": 1
}
```

**响应格式**:
```json
{
  "error": 0,
  "body": {
    "current_date": "2024-07-31",
    "data": [
      {
        "date": "2024-07-25",
        "total_income": 2500,
        "total_expense": 1400,
        "net_profit": 1100
      },
      {
        "date": "2024-07-26",
        "total_income": 3200,
        "total_expense": 1800,
        "net_profit": 1400
      }
    ],
    "summary": {
      "total_income": 15300,
      "total_expense": 10100,
      "net_profit": 5200,
      "transaction_count": 45
    },
    "charts": {
      "incomeExpense": {
        "labels": ["7/25", "7/26", "7/27", "7/28", "7/29", "7/30", "7/31"],
        "datasets": [
          {
            "label": "收入",
            "data": [2500, 3200, 1800, 2900, 0, 1500, 3400],
            "borderColor": "#10b981",
            "backgroundColor": "rgba(16, 185, 129, 0.1)"
          },
          {
            "label": "支出",
            "data": [1400, 1800, 1200, 2100, 0, 800, 2800],
            "borderColor": "#ef4444",
            "backgroundColor": "rgba(239, 68, 68, 0.1)"
          }
        ]
      }
    }
  },
  "message": "获取成功"
}
```

### 2. 获取今日财务数据

**接口地址**: `POST /api/dashboard/today_data`

**请求参数**:
```json
{
  "userId": 1
}
```

**响应格式**:
```json
{
  "error": 0,
  "body": {
    "date": "2024-07-31",
    "total_income": 1000,
    "total_expense": 1800,
    "net_profit": -800
  },
  "message": "获取成功"
}
```

### 3. 获取财务趋势数据

**接口地址**: `POST /api/dashboard/trend_data`

**请求参数**:
```json
{
  "userId": 1,
  "period": "week",
  "startDate": "2024-07-25",
  "endDate": "2024-07-31"
}
```

**响应格式**:
```json
{
  "error": 0,
  "body": {
    "period": "week",
    "data": [
      {
        "date": "2024-07-25",
        "total_income": 2500,
        "total_expense": 1400,
        "net_profit": 1100
      }
    ],
    "growth_analysis": {
      "income_growth_rate": -12.0,
      "expense_growth_rate": 7.1,
      "profit_growth_rate": -36.4
    }
  },
  "message": "获取成功"
}
```

## 前端计算函数

### 利润计算函数
```javascript
export const calculateNetProfit = (totalIncome, totalExpense) => {
  return totalIncome - totalExpense
}
```

### 增长率计算函数
```javascript
export const calculateGrowthRate = (currentValue, previousValue) => {
  if (previousValue === 0) return 0
  return ((currentValue - previousValue) / Math.abs(previousValue) * 100).toFixed(1)
}
```

## 错误码说明

| 错误码 | 说明 |
|--------|------|
| 0 | 成功 |
| 401 | 需要登录 |
| 500 | 系统异常 |
| 1001 | 参数错误 |
| 1002 | 数据不存在 |

## 数据来源说明

### database_flow.js数据结构
- **交易类型**：INBOUND(入库/采购) 和 OUTBOUND(出库/销售)
- **数据字段**：包含id、type、date、amount、quantity、unit_price、product_name等
- **数据获取**：通过getTransactionsByDateRange和getTransactionsByDate函数获取
- **数据处理**：自动按日期分组并累加同类型交易金额

### 数据处理逻辑
1. **最近7天数据**：获取从6天前到今天的所有交易记录
2. **收入计算**：累加所有OUTBOUND类型交易的amount字段（销售收入）
3. **支出计算**：累加所有INBOUND类型交易的amount字段（采购成本）
4. **利润计算**：收入 - 支出
5. **今日数据**：单独获取当前日期的交易记录进行计算

## 注意事项

1. 所有请求都需要在请求头中携带有效的认证token
2. 请求参数必须使用JSON格式，即使是空对象也要传递 `{}`
3. 响应数据统一使用 `{error, body, message}` 格式
4. **数据来源**：从database_flow.js的真实交易记录获取
5. **利润计算在前端进行**，确保数据一致性
6. **周度逻辑保持不变**，仍使用原有的增长率计算方式
7. 数据基于系统时间和实际交易记录，确保时间和金额准确性
8. 金额数据统一使用数字类型，单位为元
9. 日期格式统一使用ISO 8601格式 (YYYY-MM-DD)
10. **无交易数据的日期显示为0**，确保7天数据完整性