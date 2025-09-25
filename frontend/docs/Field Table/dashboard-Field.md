# 仪表板字段表列表

## frontend\src\views\Dashboard.vue
功能：前端展示页面

### 展示字段
- 今日收入 = 字段 `dashboardStore.totalIncome`
- 今日支出 = 字段 `dashboardStore.totalExpense`
- 今日利润 = 字段 `dashboardStore.netProfit`
- 收入趋势 = 字段 `dashboardStore.incomeTrend`
- 支出趋势 = 字段 `dashboardStore.expenseTrend`
- 利润趋势 = 字段 `dashboardStore.profitTrend`
- 近7天收入 = 字段 `dashboardStore.total7dayIncome`
- 近7天支出 = 字段 `dashboardStore.total7dayExpense`
- 近7天利润 = 字段 `dashboardStore.total7dayProfit`
- 图表数据 = 字段 `incomeExpenseData`（从`dashboardStore.weekData.charts.incomeExpense`获取）

### 状态字段
- 加载状态 = 字段 `dashboardStore.loading`
- 错误状态 = 字段 `dashboardStore.error`
- 数据是否存在 = 字段 `dashboardStore.hasData`
- 重置加载状态 = 字段 `resetLoading`

————————————————————————————————————————————————
## frontend\src\stores\dashboard.js
功能：管理仪表板数据状态和计算属性

### 状态字段
- 今日数据 = 字段 `todayData`（ref对象）
- 周数据 = 字段 `weekData`（ref对象）
- 图表数据 = 字段 `chartData`（ref对象）
- 加载状态 = 字段 `loading`（ref对象）
- 错误信息 = 字段 `error`（ref对象）

### 计算属性
- 数据是否存在 = 字段 `hasData`
- 今日收入 = 字段 `totalIncome`（从`todayData.value?.total_income`获取）
- 今日支出 = 字段 `totalExpense`（从`todayData.value?.total_expense`获取）
- 今日利润 = 字段 `netProfit`（计算得出：`totalIncome - totalExpense`）
- 周总收入 = 字段 `weekTotalIncome`（从`weekData.value?.summary?.week_total_income`获取）
- 周总支出 = 字段 `weekTotalExpense`（从`weekData.value?.summary?.week_total_expense`获取）
- 周净利润 = 字段 `weekNetProfit`（计算得出：`weekTotalIncome - weekTotalExpense`）
- 近7天收入 = 字段 `total7dayIncome`（等同于`weekTotalIncome`）
- 近7天支出 = 字段 `total7dayExpense`（等同于`weekTotalExpense`）
- 近7天利润 = 字段 `total7dayProfit`（等同于`weekNetProfit`）
- 收入趋势 = 字段 `incomeTrend`（计算得出：今日与昨日收入的增长率）
- 支出趋势 = 字段 `expenseTrend`（计算得出：今日与昨日支出的增长率）
- 利润趋势 = 字段 `profitTrend`（计算得出：今日与昨日利润的增长率）

### 方法
- 获取最近7天财务数据 = 方法 `fetchRecentWeekData`
- 获取今日财务数据 = 方法 `fetchTodayData`
- 获取财务趋势数据 = 方法 `fetchTrendData`
- 获取图表数据 = 方法 `fetchChartData`
- 获取所有数据 = 方法 `fetchAllData`
- 清除数据 = 方法 `clearData`
- 重置错误 = 方法 `resetError`

### frontend\src\stores\dashboard_Calculations.js
功能：集中提供财务计算函数

- 计算净利润 = 方法 `calculateNetProfit`
- 计算增长率 = 方法 `calculateGrowthRate`
- 计算总收入 = 方法 `calculateTotalIncome`
- 计算总支出 = 方法 `calculateTotalExpense`
- 计算财务汇总 = 方法 `calculateSummary`
- 计算增长率分析 = 方法 `calculateGrowthAnalysis`


### frontend\src\api\dashboard.js
功能：提供仪表板相关的API接口

- 获取最近7天财务数据 = 方法 `getRecentWeekData`
- 获取今日财务数据 = 方法 `getTodayData`
- 获取财务趋势数据 = 方法 `getTrendData`

——————————————————————————————————————————————
后端文件：
### frontend\src\mock\dashboard.js
功能：提供仪表板相关的Mock数据

- 获取最近7天财务数据 = 方法 `mockGetRecentWeekData`
- 获取今日财务数据 = 方法 `mockGetTodayData`
- 获取财务趋势数据 = 方法 `mockGetTrendData`
- 兼容性函数 = 方法 `mockGetDashboardOverview`、`mockGetDashboardStats`、`mockGetChartData`


————————————————————————————————————————————————
## 最终获取的数据文件：
### frontend\src\mock\database_flow.js
功能：提供交易数据源，模拟真实的入库和出库交易记录

#### 交易记录核心字段
- 交易类型 = 字段 `type`（值为"INBOUND"或"OUTBOUND"）
- 日期 = 字段 `date`（格式：YYYY-MM-DD）
- 时间 = 字段 `time`（格式：HH:MM:SS）
- 总价格 = 字段 `totalPrice`（统一使用此字段表示交易金额）


#### 方法
- 获取所有交易记录 = 方法 `getAllTransactions`
- 获取简化的交易记录 = 方法 `getSimplifiedTransactions`
- 获取简化的最近7天交易记录 = 方法 `getSimplifiedRecentWeekTransactions`
- 根据时间范围获取交易记录 = 方法 `getTransactionsByDateRange`
- 获取最近7天的交易记录 = 方法 `getRecentWeekTransactions`
- 根据交易类型获取交易记录 = 方法 `getTransactionsByType`
- 获取指定日期的交易记录 = 方法 `getTransactionsByDate`
- 获取交易统计信息 = 方法 `getTransactionStatistics`
- 重置交易数据 = 方法 `resetTransactionData`
- 初始化交易数据 = 方法 `initializeTransactionData`



