# 资产总览字段表列表

## frontend\src\views\AssetsOverview.vue
功能：前端资产总览展示页面

### 展示字段
- 总收入 = 字段 `assetData.totalIncome`
- 总支出 = 字段 `assetData.totalExpense`
- 净资产 = 字段 `assetData.netAssets`
- 时间维度 = 字段 `activeTab`（值为'year'|'month'|'week'|'total'）
- 资产趋势图表 = 引用 `assetTrendChart`
- 收支趋势图表 = 引用 `incomeExpenseChart`
- 收入结构数据 = 字段 `incomeStructure`（数组）
- 成本结构数据 = 字段 `costStructure`（数组）
- 收入结构图表 = 引用 `incomeStructureChart`
- 成本结构图表 = 引用 `costStructureChart`

### 数据加载方法
- 加载所有数据 = 方法 `loadAllData(params)`
- 切换时间维度 = 方法 `handleTabChange(name)`
- 更新图表数据 = 方法 `updateChartsFromStore()`
- 更新饼图 = 方法 `updatePieCharts()`
- 更新图表标题 = 方法 `updateChartTitles(period)`

### 图表初始化方法
- 初始化净资产趋势图表 = 方法 `initAssetTrendChart()`
- 初始化收支对比图表 = 方法 `initIncomeExpenseChart()`
- 初始化收入结构饼图 = 方法 `initIncomeStructureChart()`
- 初始化成本结构饼图 = 方法 `initCostStructureChart()`

————————————————————————————————————————————————
## frontend\src\stores\assets.js
功能：管理资产数据状态和计算属性

### 状态字段
- 资产总览数据 = 字段 `assetOverview`（ref对象）
  - 总收入 = 字段 `assetOverview.totalIncome`
  - 总支出 = 字段 `assetOverview.totalExpense`
  - 净资产 = 字段 `assetOverview.netAssets`
- 资产趋势数据 = 字段 `assetTrend`（数组）
- 收支趋势数据 = 字段 `incomeExpenseTrend`（对象）
  - 收入数据 = 字段 `incomeExpenseTrend.income`（数组）
  - 支出数据 = 字段 `incomeExpenseTrend.expense`（数组）
- 收入结构数据 = 字段 `incomeStructure`（数组）
- 成本结构数据 = 字段 `costStructure`（数组）
- 资产统计数据 = 字段 `assetStatistics`（对象）
- 当前时间筛选维度 = 字段 `currentPeriod`
- 图表数据 = 字段 `chartData`（已由计算属性替代，保留向后兼容）
- 加载状态 = 字段 `loading`（布尔值）
- 错误信息 = 字段 `error`（字符串）

### 计算属性
- 格式化资产数据 = 字段 `formattedAssetData`
- 资产趋势图表数据 = 字段 `assetTrendChartData`
- 收支趋势图表数据 = 字段 `incomeExpenseChartData`

### 方法
- 获取资产总览数据 = 方法 `fetchAssetOverview(params)`
- 获取资产趋势数据 = 方法 `fetchAssetTrend(params)`
- 获取收支趋势数据 = 方法 `fetchIncomeExpenseTrend(params)`
- 获取收入结构数据 = 方法 `fetchIncomeStructure(params)`
- 获取成本结构数据 = 方法 `fetchCostStructure(params)`
- 获取资产统计数据 = 方法 `fetchAssetStatistics(params)`（用于高级分析，非基础视图使用）
- 获取所有资产数据 = 方法 `fetchAssetData(params)`
- 根据时间维度更新数据 = 方法 `updateDataByPeriod(period, params)`
- 重置状态 = 方法 `reset()`

————————————————————————————————————————————————
## frontend\src\api\assets.js
功能：提供资产相关的API接口

### 接口方法
- 获取资产汇总数据 = 方法 `getSummary(params)`
- 获取资产总览数据 = 方法 `getAssetOverview(params)`
- 获取资产趋势数据 = 方法 `getAssetTrend(params)`
- 获取收支趋势数据 = 方法 `getIncomeExpenseTrend(params)`
- 获取收入结构分析 = 方法 `getIncomeStructure(params)`
- 获取成本结构分析 = 方法 `getCostStructure(params)`
- 获取资产统计数据 = 方法 `getAssetStatistics(params)`

### 请求参数
- 时间维度 = 参数 `period`（值为'year'|'month'|'week'|'total'）
- 年份 = 参数 `year`（默认为当前年份）
- 月份 = 参数 `month`（默认为当前月份）
- 当前星期几 = 参数 `currentDayOfWeek`（周度查询时使用）
- 当前日期 = 参数 `currentDate`（周度查询时使用）

————————————————————————————————————————————————
## frontend\src\mock\database_assets.js
功能：提供资产相关的Mock数据和计算逻辑

### 导出函数
- 计算汇总数据 = 方法 `calculateSummaryFromTransactions(transactions, period, params)`
- 获取资产数据 = 方法 `getAssetDataByPeriod(period, params)`
- 获取资产总览 = 方法 `getAssetOverview(params)`
- 获取资产趋势 = 方法 `getAssetTrend(params)`
- 获取收支趋势 = 方法 `getIncomeExpenseTrend(params)`
- 获取收入结构 = 方法 `getIncomeStructure(params)`
- 获取成本结构 = 方法 `getCostStructure(params)`
- 获取资产统计 = 方法 `getAssetStatistics(params)`

### 内部函数
- 生成年度数据 = 方法 `generateYearlyDataWithGaps(transactions)`
- 创建图表数据集 = 方法 `createChartDataset(data, labels)`
- 生成总计图表数据 = 方法 `generateTotalChartData(transactions)`
- 生成年度图表数据 = 方法 `generateYearChartData(transactions, year, currentInfo)`
- 生成月度图表数据 = 方法 `generateMonthChartData(transactions, year, month, currentInfo)`
- 生成周度图表数据 = 方法 `generateWeekChartData(transactions, year, currentInfo)`
- 生成图表数据 = 方法 `generateChartData(transactions, period, params)`

### 导入的工具函数
- 获取当前日期信息 = 函数 `getCurrentDateInfo`
- 获取周数 = 函数 `getWeekNumber`
- 解析时间维度 = 函数 `parseTimeDimensions`
- 获取年份范围 = 函数 `getYearRange`
- 按时间维度筛选交易 = 函数 `filterTransactionsByPeriod`
- 按年份筛选交易 = 函数 `filterTransactionsByYear`
- 按月份筛选交易 = 函数 `filterTransactionsByMonth`
- 按周筛选交易 = 函数 `filterTransactionsByWeek`
- 获取收入交易 = 函数 `getIncomeTransactions`
- 获取支出交易 = 函数 `getExpenseTransactions`
- 计算净资产 = 函数 `calculateNetAssets`
- 计算交易统计 = 函数 `calculateTransactionStats`
- 格式化金额 = 函数 `formatAmount`
- 格式化日期 = 函数 `formatDate`

### 数据结构
- 资产总览数据结构:
  ```javascript
  {
    totalIncome: 0,    // 总收入
    totalExpense: 0,   // 总支出
    netAssets: 0,      // 净资产
    chartData: {...}   // 图表数据
  }
  ```

- 资产趋势数据结构:
  ```javascript
  [
    { month: '1月', value: 4000 },
    { month: '2月', value: 4300 },
    ...
  ]
  ```

- 收支趋势数据结构:
  ```javascript
  {
    income: [
      { month: '1月', value: 12000 },
      ...
    ],
    expense: [
      { month: '1月', value: 8000 },
      ...
    ]
  }
  ```

- 收入结构数据结构:
  ```javascript
  [
    {
      name: '铁观音销售',
      value: 45680,
      percentage: 35.5,
      color: '#10B981'
    },
    ...
  ]
  ```

- 成本结构数据结构:
  ```javascript
  [
    {
      name: '茶叶原料',
      value: 52340,
      percentage: 58.6,
      color: '#EF4444'
    },
    ...
  ]
  ```

- 资产统计数据结构:
  ```javascript
  {
    totalIncome: 128560,
    totalExpense: 89240,
    netAssets: 39320,
    profitRate: 30.58,
    period: 'year',
    dataPoints: 12
  }
  ```

————————————————————————————————————————————————
## 最终数据来源文件：
### frontend\src\mock\database_flow.js
功能：提供交易数据源，模拟真实的入库和出库交易记录

#### 交易记录核心字段
- 交易类型 = 字段 `type`（值为"INBOUND"或"OUTBOUND"）
- 日期 = 字段 `date`（格式：YYYY-MM-DD）
- 时间 = 字段 `time`（格式：HH:MM:SS）
- 物料名称 = 字段 `materialName`（INBOUND类型使用）
- 产品名称 = 字段 `productName`（OUTBOUND类型使用）
- 数量 = 字段 `quantity`
- 单价 = 字段 `unitPrice`
- 总价格 = 字段 `totalPrice`（OUTBOUND类型）（INBOUND类型）

#### 方法
- 获取所有交易记录 = 方法 `getAllTransactions`
- 添加交易记录 = 方法 `addTransaction`
- 更新交易记录 = 方法 `updateTransaction`
- 删除交易记录 = 方法 `deleteTransaction`

## 字段映射关系
| 前端展示字段 | Store状态字段 | API参数/返回字段 | 数据库字段 | 说明 |
|------------|-------------|----------------|----------|------|
| assetData.totalIncome | assetOverview.totalIncome | body.totalIncome | totalIncome | 总收入 |
| assetData.totalExpense | assetOverview.totalExpense | body.totalExpense | totalExpense | 总支出 |
| assetData.netAssets | assetOverview.netAssets | body.netAssets | netAssets | 净资产 |
| activeTab | currentPeriod | params.period | period | 时间维度 |
| incomeStructure | incomeStructure | body[].name/value/percentage/color | productName/totalPrice | 收入结构 |
| costStructure | costStructure | body[].name/value/percentage/color | materialName/totalPrice | 成本结构 |

## 未使用或逻辑不清的字段
1. `chartData`字段在Store中定义但已由计算属性`assetTrendChartData`和`incomeExpenseChartData`替代，保留向后兼容
2. `assetStatistics`字段在Store中定义但主要用于高级分析，非基础视图使用
3. 周度数据的`currentDayOfWeek`和`currentDate`参数处理逻辑较复杂，但必要
4. 交易记录统一使用`totalPrice`字段表示交易金额
5. 收支趋势数据使用动态时间键（`month`或`day`），根据时间维度自动选择