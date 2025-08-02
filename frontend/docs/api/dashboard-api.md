# 仪表板API文档

## 概述

仪表板API提供基于系统时间的财务数据概览，包括最近7天的收入、支出、利润数据，以及趋势分析。**利润和增长率计算在前端进行**，确保数据一致性和实时性。

## 基础信息

- **基础路径**: `/api/dashboard`
- **请求方式**: POST
- **认证方式**: 需要在请求头中设置 `auth` 字段，值为用户登录后的token
- **数据基准**: 以系统当前时间为基准，获取当天及往前6天的数据
- **计算方式**: 利润 = 收入 - 支出，增长率 = (当前值 - 前值) / |前值| × 100%

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
      }
    ],
    "summary": {
      "week_total_income": 15300,
      "week_total_expense": 10100,
      "week_net_profit": 5200,
      "avg_daily_income": 2186,
      "avg_daily_expense": 1443,
      "avg_daily_profit": 743
    },
    "charts": {
      "incomeExpense": [
        {
          "day": "07.25",
          "income": 2500,
          "expense": 1400
        }
      ]
    },
    "growth_analysis": {
      "income_growth_rate": -54.5,
      "expense_growth_rate": 12.5,
      "profit_growth_rate": -233.3
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

## 注意事项

1. 所有请求都需要在请求头中携带有效的认证token
2. 请求参数必须使用JSON格式，即使是空对象也要传递 `{}`
3. 响应数据统一使用 `{error, body, message}` 格式
4. **利润计算在前端进行**，确保数据一致性
5. **增长率计算在前端进行**，基于历史数据实时计算
6. 数据基于系统时间自动生成，确保时间准确性
7. 金额数据统一使用数字类型，单位为元
8. 日期格式统一使用ISO 8601格式 (YYYY-MM-DD) 