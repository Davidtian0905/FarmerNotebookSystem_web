AssetsOverview.vue:294 === 开始切换时间维度 === week
AssetsOverview.vue:314 映射结果: {period: 'week', periodName: '本周'}
AssetsOverview.vue:329 当前时间信息: {year: 2025, month: 8, day: 19, dayOfWeek: 2, currentDate: '2025-08-19'}
AssetsOverview.vue:339 本周特殊参数: {currentDayOfWeek: 2, currentDate: '2025-08-19'}
AssetsOverview.vue:345 最终API参数: {period: 'week', year: 2025, currentDayOfWeek: 2, currentDate: '2025-08-19'}
AssetsOverview.vue:201 === 开始加载数据 === {period: 'week', year: 2025, currentDayOfWeek: 2, currentDate: '2025-08-19'}
AssetsOverview.vue:208 处理后的参数: {period: 'week', year: 2025, currentDayOfWeek: 2, currentDate: '2025-08-19'}
AssetsOverview.vue:212 🗓️ 本周数据处理: {currentDate: '2025-08-19', currentDayOfWeek: 2, year: 2025}
AssetsOverview.vue:223 开始并行获取数据...
logger.js:139 [2025-08-19T11:14:10.639Z] [DEBUG] [UTILS] Mock模式检查: {environment: 'development', mockSetting: 'true', result: true}
logger.js:139 [2025-08-19T11:14:10.639Z] [DEBUG] [UTILS] Mock模式检查: {environment: 'development', mockSetting: 'true', result: true}
assets.js:155 📊 Store: 开始获取收支趋势数据 {period: 'week', year: 2025, currentDayOfWeek: 2, currentDate: '2025-08-19'}
assets.js:123 🌐 API: 开始获取收支趋势数据 {period: 'week', year: 2025, currentDayOfWeek: 2, currentDate: '2025-08-19'}
assets.js:133 🌐 API: 处理后的参数 {period: 'week', year: 2025, month: 8, currentDayOfWeek: 2, currentDate: '2025-08-19'}
logger.js:139 [2025-08-19T11:14:10.640Z] [DEBUG] [UTILS] Mock模式检查: {environment: 'development', mockSetting: 'true', result: true}
assets.js:136 🌐 API: 使用Mock模式获取数据
logger.js:139 [2025-08-19T11:14:10.640Z] [DEBUG] [UTILS] Mock模式检查: {environment: 'development', mockSetting: 'true', result: true}
logger.js:139 [2025-08-19T11:14:10.640Z] [DEBUG] [UTILS] Mock模式检查: {environment: 'development', mockSetting: 'true', result: true}
database_assets.js:347 📊 getAssetDataByPeriod 开始 {period: 'week', params: {…}, timestamp: '2025-08-19T11:14:10.642Z'}
database_assets.js:365 📊 缓存未命中，生成新数据 {cacheKey: 'assets_week_{"period":"week","year":2025,"month":8,"currentDayOfWeek":2,"currentDate":"2025-08-19"}'}
database_assets.js:369 📊 获取交易记录 {transactionsCount: 7, sampleTransactions: Array(3)}
database_assets.js:275 🔄 generateChartData 开始 {period: 'week', params: {…}, transactionsCount: 7}
database_assets.js:284 🔄 当前时间信息 {originalCurrentInfo: {…}, extractedParams: {…}}
database_assets.js:291 🔄 覆盖 currentDayOfWeek {original: 2, new: 2}
database_assets.js:298 🔄 最终使用的参数 {period: 'week', year: 2025, month: 8, finalCurrentInfo: {…}}
database_assets.js:323 🔄 生成周度数据
database_assets.js:206 📅 生成周度图表数据开始 {transactionsCount: 7, year: 2025, currentInfo: {…}, currentDate: '2025-08-19'}
dateUtils.js:32 [DEBUG] getWeekNumber - 计算周数: {inputDate: '2025-08-19T11:14:10.643Z', utcDate: '2025-08-21T00:00:00.000Z', dayNum: 2, yearStart: '2025-01-01T00:00:00.000Z', daysDiff: 232, …}
database_assets.js:217 📅 周度数据生成参数 {weekLabels: Array(7), currentWeek: 34, currentDayOfWeek: 2}
dateUtils.js:32 [DEBUG] getWeekNumber - 计算周数: {inputDate: '2025-08-19T00:00:00.000Z', utcDate: '2025-08-21T00:00:00.000Z', dayNum: 2, yearStart: '2025-01-01T00:00:00.000Z', daysDiff: 232, …}
dateUtils.js:32 [DEBUG] getWeekNumber - 计算周数: {inputDate: '2025-08-19T00:00:00.000Z', utcDate: '2025-08-21T00:00:00.000Z', dayNum: 2, yearStart: '2025-01-01T00:00:00.000Z', daysDiff: 232, …}
dateUtils.js:32 [DEBUG] getWeekNumber - 计算周数: {inputDate: '2025-08-18T00:00:00.000Z', utcDate: '2025-08-21T00:00:00.000Z', dayNum: 1, yearStart: '2025-01-01T00:00:00.000Z', daysDiff: 232, …}
dateUtils.js:32 [DEBUG] getWeekNumber - 计算周数: {inputDate: '2025-08-18T00:00:00.000Z', utcDate: '2025-08-21T00:00:00.000Z', dayNum: 1, yearStart: '2025-01-01T00:00:00.000Z', daysDiff: 232, …}
dateUtils.js:32 [DEBUG] getWeekNumber - 计算周数: {inputDate: '2025-08-12T00:00:00.000Z', utcDate: '2025-08-14T00:00:00.000Z', dayNum: 2, yearStart: '2025-01-01T00:00:00.000Z', daysDiff: 225, …}
dateUtils.js:32 [DEBUG] getWeekNumber - 计算周数: {inputDate: '2024-08-11T00:00:00.000Z', utcDate: '2024-08-08T00:00:00.000Z', dayNum: 7, yearStart: '2024-01-01T00:00:00.000Z', daysDiff: 220, …}
dateUtils.js:32 [DEBUG] getWeekNumber - 计算周数: {inputDate: '2023-08-10T00:00:00.000Z', utcDate: '2023-08-10T00:00:00.000Z', dayNum: 4, yearStart: '2023-01-01T00:00:00.000Z', daysDiff: 221, …}
database_assets.js:237 📅 周一 (1) 的交易数据 {dayOfWeek: 1, transactionsCount: 2, transactions: Array(2)}
database_assets.js:38 [DEBUG] calculateSummaryFromTransactions - 开始汇总: {originalTransactionsCount: 2, period: 'day', params: {…}, sampleOriginalTransactions: Array(2)}
database_assets.js:53 [DEBUG] calculateSummaryFromTransactions - 过滤后数据: {filteredCount: 0, filteredTransactions: Array(0)}
calculations.js:78 [DEBUG] calculateTransactionStats - 开始计算: {transactionsCount: 0, sampleTransactions: Array(0)}
calculations.js:98 [DEBUG] calculateTransactionStats - 分类统计: {incomeTransactions: Array(0), expenseTransactions: Array(0), incomeCount: 0, expenseCount: 0, totalIncome: 0, …}
calculations.js:119 [DEBUG] calculateTransactionStats - 计算结果: {totalTransactions: 0, income: 0, expense: 0, netProfit: 0, incomeCount: 0, …}
database_assets.js:75 [DEBUG] calculateSummaryFromTransactions - 最终汇总结果: {totalIncome: 0, totalExpense: 0, netAssets: 0, transactionCount: 0, inboundCount: 0, …}
database_assets.js:249 📅 周一 汇总数据 {totalIncome: 0, totalExpense: 0, netAssets: 0, transactionCount: 0, inboundCount: 0, …}
dateUtils.js:32 [DEBUG] getWeekNumber - 计算周数: {inputDate: '2025-08-19T00:00:00.000Z', utcDate: '2025-08-21T00:00:00.000Z', dayNum: 2, yearStart: '2025-01-01T00:00:00.000Z', daysDiff: 232, …}
dateUtils.js:32 [DEBUG] getWeekNumber - 计算周数: {inputDate: '2025-08-19T00:00:00.000Z', utcDate: '2025-08-21T00:00:00.000Z', dayNum: 2, yearStart: '2025-01-01T00:00:00.000Z', daysDiff: 232, …}
dateUtils.js:32 [DEBUG] getWeekNumber - 计算周数: {inputDate: '2025-08-18T00:00:00.000Z', utcDate: '2025-08-21T00:00:00.000Z', dayNum: 1, yearStart: '2025-01-01T00:00:00.000Z', daysDiff: 232, …}
dateUtils.js:32 [DEBUG] getWeekNumber - 计算周数: {inputDate: '2025-08-18T00:00:00.000Z', utcDate: '2025-08-21T00:00:00.000Z', dayNum: 1, yearStart: '2025-01-01T00:00:00.000Z', daysDiff: 232, …}
dateUtils.js:32 [DEBUG] getWeekNumber - 计算周数: {inputDate: '2025-08-12T00:00:00.000Z', utcDate: '2025-08-14T00:00:00.000Z', dayNum: 2, yearStart: '2025-01-01T00:00:00.000Z', daysDiff: 225, …}
dateUtils.js:32 [DEBUG] getWeekNumber - 计算周数: {inputDate: '2024-08-11T00:00:00.000Z', utcDate: '2024-08-08T00:00:00.000Z', dayNum: 7, yearStart: '2024-01-01T00:00:00.000Z', daysDiff: 220, …}
dateUtils.js:32 [DEBUG] getWeekNumber - 计算周数: {inputDate: '2023-08-10T00:00:00.000Z', utcDate: '2023-08-10T00:00:00.000Z', dayNum: 4, yearStart: '2023-01-01T00:00:00.000Z', daysDiff: 221, …}
database_assets.js:237 📅 周二 (2) 的交易数据 {dayOfWeek: 2, transactionsCount: 2, transactions: Array(2)}
database_assets.js:38 [DEBUG] calculateSummaryFromTransactions - 开始汇总: {originalTransactionsCount: 2, period: 'day', params: {…}, sampleOriginalTransactions: Array(2)}
database_assets.js:53 [DEBUG] calculateSummaryFromTransactions - 过滤后数据: {filteredCount: 0, filteredTransactions: Array(0)}
calculations.js:78 [DEBUG] calculateTransactionStats - 开始计算: {transactionsCount: 0, sampleTransactions: Array(0)}
calculations.js:98 [DEBUG] calculateTransactionStats - 分类统计: {incomeTransactions: Array(0), expenseTransactions: Array(0), incomeCount: 0, expenseCount: 0, totalIncome: 0, …}
calculations.js:119 [DEBUG] calculateTransactionStats - 计算结果: {totalTransactions: 0, income: 0, expense: 0, netProfit: 0, incomeCount: 0, …}
database_assets.js:75 [DEBUG] calculateSummaryFromTransactions - 最终汇总结果: {totalIncome: 0, totalExpense: 0, netAssets: 0, transactionCount: 0, inboundCount: 0, …}
database_assets.js:249 📅 周二 汇总数据 {totalIncome: 0, totalExpense: 0, netAssets: 0, transactionCount: 0, inboundCount: 0, …}
dateUtils.js:32 [DEBUG] getWeekNumber - 计算周数: {inputDate: '2025-08-19T00:00:00.000Z', utcDate: '2025-08-21T00:00:00.000Z', dayNum: 2, yearStart: '2025-01-01T00:00:00.000Z', daysDiff: 232, …}
dateUtils.js:32 [DEBUG] getWeekNumber - 计算周数: {inputDate: '2025-08-19T00:00:00.000Z', utcDate: '2025-08-21T00:00:00.000Z', dayNum: 2, yearStart: '2025-01-01T00:00:00.000Z', daysDiff: 232, …}
dateUtils.js:32 [DEBUG] getWeekNumber - 计算周数: {inputDate: '2025-08-18T00:00:00.000Z', utcDate: '2025-08-21T00:00:00.000Z', dayNum: 1, yearStart: '2025-01-01T00:00:00.000Z', daysDiff: 232, …}
 [DEBUG] getWeekNumber - 计算周数: {inputDate: '2025-08-18T00:00:00.000Z', utcDate: '2025-08-21T00:00:00.000Z', dayNum: 1, yearStart: '2025-01-01T00:00:00.000Z', daysDiff: 232, …}
 [DEBUG] getWeekNumber - 计算周数: {inputDate: '2025-08-12T00:00:00.000Z', utcDate: '2025-08-14T00:00:00.000Z', dayNum: 2, yearStart: '2025-01-01T00:00:00.000Z', daysDiff: 225, …}
 [DEBUG] getWeekNumber - 计算周数: {inputDate: '2024-08-11T00:00:00.000Z', utcDate: '2024-08-08T00:00:00.000Z', dayNum: 7, yearStart: '2024-01-01T00:00:00.000Z', daysDiff: 220, …}
 [DEBUG] getWeekNumber - 计算周数: {inputDate: '2023-08-10T00:00:00.000Z', utcDate: '2023-08-10T00:00:00.000Z', dayNum: 4, yearStart: '2023-01-01T00:00:00.000Z', daysDiff: 221, …}
 📅 周三 (3) 的交易数据 {dayOfWeek: 3, transactionsCount: 0, transactions: Array(0)}
 [DEBUG] calculateSummaryFromTransactions - 开始汇总: {originalTransactionsCount: 0, period: 'day', params: {…}, sampleOriginalTransactions: Array(0)}
 [DEBUG] calculateSummaryFromTransactions - 过滤后数据: {filteredCount: 0, filteredTransactions: Array(0)}
 [DEBUG] calculateTransactionStats - 开始计算: {transactionsCount: 0, sampleTransactions: Array(0)}
 [DEBUG] calculateTransactionStats - 分类统计: {incomeTransactions: Array(0), expenseTransactions: Array(0), incomeCount: 0, expenseCount: 0, totalIncome: 0, …}
 [DEBUG] calculateTransactionStats - 计算结果: {totalTransactions: 0, income: 0, expense: 0, netProfit: 0, incomeCount: 0, …}
 [DEBUG] calculateSummaryFromTransactions - 最终汇总结果: {totalIncome: 0, totalExpense: 0, netAssets: 0, transactionCount: 0, inboundCount: 0, …}
 📅 周三 汇总数据 {totalIncome: 0, totalExpense: 0, netAssets: 0, transactionCount: 0, inboundCount: 0, …}
 [DEBUG] getWeekNumber - 计算周数: {inputDate: '2025-08-19T00:00:00.000Z', utcDate: '2025-08-21T00:00:00.000Z', dayNum: 2, yearStart: '2025-01-01T00:00:00.000Z', daysDiff: 232, …}
 [DEBUG] getWeekNumber - 计算周数: {inputDate: '2025-08-19T00:00:00.000Z', utcDate: '2025-08-21T00:00:00.000Z', dayNum: 2, yearStart: '2025-01-01T00:00:00.000Z', daysDiff: 232, …}
 [DEBUG] getWeekNumber - 计算周数: {inputDate: '2025-08-18T00:00:00.000Z', utcDate: '2025-08-21T00:00:00.000Z', dayNum: 1, yearStart: '2025-01-01T00:00:00.000Z', daysDiff: 232, …}
 [DEBUG] getWeekNumber - 计算周数: {inputDate: '2025-08-18T00:00:00.000Z', utcDate: '2025-08-21T00:00:00.000Z', dayNum: 1, yearStart: '2025-01-01T00:00:00.000Z', daysDiff: 232, …}
 [DEBUG] getWeekNumber - 计算周数: {inputDate: '2025-08-12T00:00:00.000Z', utcDate: '2025-08-14T00:00:00.000Z', dayNum: 2, yearStart: '2025-01-01T00:00:00.000Z', daysDiff: 225, …}
 [DEBUG] getWeekNumber - 计算周数: {inputDate: '2024-08-11T00:00:00.000Z', utcDate: '2024-08-08T00:00:00.000Z', dayNum: 7, yearStart: '2024-01-01T00:00:00.000Z', daysDiff: 220, …}
 [DEBUG] getWeekNumber - 计算周数: {inputDate: '2023-08-10T00:00:00.000Z', utcDate: '2023-08-10T00:00:00.000Z', dayNum: 4, yearStart: '2023-01-01T00:00:00.000Z', daysDiff: 221, …}
 📅 周四 (4) 的交易数据 {dayOfWeek: 4, transactionsCount: 0, transactions: Array(0)}
 [DEBUG] calculateSummaryFromTransactions - 开始汇总: {originalTransactionsCount: 0, period: 'day', params: {…}, sampleOriginalTransactions: Array(0)}
 [DEBUG] calculateSummaryFromTransactions - 过滤后数据: {filteredCount: 0, filteredTransactions: Array(0)}
 [DEBUG] calculateTransactionStats - 开始计算: {transactionsCount: 0, sampleTransactions: Array(0)}
 [DEBUG] calculateTransactionStats - 分类统计: {incomeTransactions: Array(0), expenseTransactions: Array(0), incomeCount: 0, expenseCount: 0, totalIncome: 0, …}
 [DEBUG] calculateTransactionStats - 计算结果: {totalTransactions: 0, income: 0, expense: 0, netProfit: 0, incomeCount: 0, …}
 [DEBUG] calculateSummaryFromTransactions - 最终汇总结果: {totalIncome: 0, totalExpense: 0, netAssets: 0, transactionCount: 0, inboundCount: 0, …}
 📅 周四 汇总数据 {totalIncome: 0, totalExpense: 0, netAssets: 0, transactionCount: 0, inboundCount: 0, …}
 [DEBUG] getWeekNumber - 计算周数: {inputDate: '2025-08-19T00:00:00.000Z', utcDate: '2025-08-21T00:00:00.000Z', dayNum: 2, yearStart: '2025-01-01T00:00:00.000Z', daysDiff: 232, …}
 [DEBUG] getWeekNumber - 计算周数: {inputDate: '2025-08-19T00:00:00.000Z', utcDate: '2025-08-21T00:00:00.000Z', dayNum: 2, yearStart: '2025-01-01T00:00:00.000Z', daysDiff: 232, …}
 [DEBUG] getWeekNumber - 计算周数: {inputDate: '2025-08-18T00:00:00.000Z', utcDate: '2025-08-21T00:00:00.000Z', dayNum: 1, yearStart: '2025-01-01T00:00:00.000Z', daysDiff: 232, …}
 [DEBUG] getWeekNumber - 计算周数: {inputDate: '2025-08-18T00:00:00.000Z', utcDate: '2025-08-21T00:00:00.000Z', dayNum: 1, yearStart: '2025-01-01T00:00:00.000Z', daysDiff: 232, …}
 [DEBUG] getWeekNumber - 计算周数: {inputDate: '2025-08-12T00:00:00.000Z', utcDate: '2025-08-14T00:00:00.000Z', dayNum: 2, yearStart: '2025-01-01T00:00:00.000Z', daysDiff: 225, …}
 [DEBUG] getWeekNumber - 计算周数: {inputDate: '2024-08-11T00:00:00.000Z', utcDate: '2024-08-08T00:00:00.000Z', dayNum: 7, yearStart: '2024-01-01T00:00:00.000Z', daysDiff: 220, …}
 [DEBUG] getWeekNumber - 计算周数: {inputDate: '2023-08-10T00:00:00.000Z', utcDate: '2023-08-10T00:00:00.000Z', dayNum: 4, yearStart: '2023-01-01T00:00:00.000Z', daysDiff: 221, …}
 📅 周五 (5) 的交易数据 {dayOfWeek: 5, transactionsCount: 0, transactions: Array(0)}
 [DEBUG] calculateSummaryFromTransactions - 开始汇总: {originalTransactionsCount: 0, period: 'day', params: {…}, sampleOriginalTransactions: Array(0)}
 [DEBUG] calculateSummaryFromTransactions - 过滤后数据: {filteredCount: 0, filteredTransactions: Array(0)}
 [DEBUG] calculateTransactionStats - 开始计算: {transactionsCount: 0, sampleTransactions: Array(0)}
 [DEBUG] calculateTransactionStats - 分类统计: {incomeTransactions: Array(0), expenseTransactions: Array(0), incomeCount: 0, expenseCount: 0, totalIncome: 0, …}
 [DEBUG] calculateTransactionStats - 计算结果: {totalTransactions: 0, income: 0, expense: 0, netProfit: 0, incomeCount: 0, …}
 [DEBUG] calculateSummaryFromTransactions - 最终汇总结果: {totalIncome: 0, totalExpense: 0, netAssets: 0, transactionCount: 0, inboundCount: 0, …}
 📅 周五 汇总数据 {totalIncome: 0, totalExpense: 0, netAssets: 0, transactionCount: 0, inboundCount: 0, …}
 [DEBUG] getWeekNumber - 计算周数: {inputDate: '2025-08-19T00:00:00.000Z', utcDate: '2025-08-21T00:00:00.000Z', dayNum: 2, yearStart: '2025-01-01T00:00:00.000Z', daysDiff: 232, …}
 [DEBUG] getWeekNumber - 计算周数: {inputDate: '2025-08-19T00:00:00.000Z', utcDate: '2025-08-21T00:00:00.000Z', dayNum: 2, yearStart: '2025-01-01T00:00:00.000Z', daysDiff: 232, …}
 [DEBUG] getWeekNumber - 计算周数: {inputDate: '2025-08-18T00:00:00.000Z', utcDate: '2025-08-21T00:00:00.000Z', dayNum: 1, yearStart: '2025-01-01T00:00:00.000Z', daysDiff: 232, …}
 [DEBUG] getWeekNumber - 计算周数: {inputDate: '2025-08-18T00:00:00.000Z', utcDate: '2025-08-21T00:00:00.000Z', dayNum: 1, yearStart: '2025-01-01T00:00:00.000Z', daysDiff: 232, …}
 [DEBUG] getWeekNumber - 计算周数: {inputDate: '2025-08-12T00:00:00.000Z', utcDate: '2025-08-14T00:00:00.000Z', dayNum: 2, yearStart: '2025-01-01T00:00:00.000Z', daysDiff: 225, …}
 [DEBUG] getWeekNumber - 计算周数: {inputDate: '2024-08-11T00:00:00.000Z', utcDate: '2024-08-08T00:00:00.000Z', dayNum: 7, yearStart: '2024-01-01T00:00:00.000Z', daysDiff: 220, …}
 [DEBUG] getWeekNumber - 计算周数: {inputDate: '2023-08-10T00:00:00.000Z', utcDate: '2023-08-10T00:00:00.000Z', dayNum: 4, yearStart: '2023-01-01T00:00:00.000Z', daysDiff: 221, …}
 📅 周六 (6) 的交易数据 {dayOfWeek: 6, transactionsCount: 0, transactions: Array(0)}
 [DEBUG] calculateSummaryFromTransactions - 开始汇总: {originalTransactionsCount: 0, period: 'day', params: {…}, sampleOriginalTransactions: Array(0)}
 [DEBUG] calculateSummaryFromTransactions - 过滤后数据: {filteredCount: 0, filteredTransactions: Array(0)}
 [DEBUG] calculateTransactionStats - 开始计算: {transactionsCount: 0, sampleTransactions: Array(0)}
 [DEBUG] calculateTransactionStats - 分类统计: {incomeTransactions: Array(0), expenseTransactions: Array(0), incomeCount: 0, expenseCount: 0, totalIncome: 0, …}
 [DEBUG] calculateTransactionStats - 计算结果: {totalTransactions: 0, income: 0, expense: 0, netProfit: 0, incomeCount: 0, …}
 [DEBUG] calculateSummaryFromTransactions - 最终汇总结果: {totalIncome: 0, totalExpense: 0, netAssets: 0, transactionCount: 0, inboundCount: 0, …}
 📅 周六 汇总数据 {totalIncome: 0, totalExpense: 0, netAssets: 0, transactionCount: 0, inboundCount: 0, …}
 [DEBUG] getWeekNumber - 计算周数: {inputDate: '2025-08-19T00:00:00.000Z', utcDate: '2025-08-21T00:00:00.000Z', dayNum: 2, yearStart: '2025-01-01T00:00:00.000Z', daysDiff: 232, …}
 [DEBUG] getWeekNumber - 计算周数: {inputDate: '2025-08-19T00:00:00.000Z', utcDate: '2025-08-21T00:00:00.000Z', dayNum: 2, yearStart: '2025-01-01T00:00:00.000Z', daysDiff: 232, …}
 [DEBUG] getWeekNumber - 计算周数: {inputDate: '2025-08-18T00:00:00.000Z', utcDate: '2025-08-21T00:00:00.000Z', dayNum: 1, yearStart: '2025-01-01T00:00:00.000Z', daysDiff: 232, …}
 [DEBUG] getWeekNumber - 计算周数: {inputDate: '2025-08-18T00:00:00.000Z', utcDate: '2025-08-21T00:00:00.000Z', dayNum: 1, yearStart: '2025-01-01T00:00:00.000Z', daysDiff: 232, …}
 [DEBUG] getWeekNumber - 计算周数: {inputDate: '2025-08-12T00:00:00.000Z', utcDate: '2025-08-14T00:00:00.000Z', dayNum: 2, yearStart: '2025-01-01T00:00:00.000Z', daysDiff: 225, …}
 [DEBUG] getWeekNumber - 计算周数: {inputDate: '2024-08-11T00:00:00.000Z', utcDate: '2024-08-08T00:00:00.000Z', dayNum: 7, yearStart: '2024-01-01T00:00:00.000Z', daysDiff: 220, …}
 [DEBUG] getWeekNumber - 计算周数: {inputDate: '2023-08-10T00:00:00.000Z', utcDate: '2023-08-10T00:00:00.000Z', dayNum: 4, yearStart: '2023-01-01T00:00:00.000Z', daysDiff: 221, …}
 📅 周日 (7) 的交易数据 {dayOfWeek: 7, transactionsCount: 0, transactions: Array(0)}
 [DEBUG] calculateSummaryFromTransactions - 开始汇总: {originalTransactionsCount: 0, period: 'day', params: {…}, sampleOriginalTransactions: Array(0)}
 [DEBUG] calculateSummaryFromTransactions - 过滤后数据: {filteredCount: 0, filteredTransactions: Array(0)}
 [DEBUG] calculateTransactionStats - 开始计算: {transactionsCount: 0, sampleTransactions: Array(0)}
 [DEBUG] calculateTransactionStats - 分类统计: {incomeTransactions: Array(0), expenseTransactions: Array(0), incomeCount: 0, expenseCount: 0, totalIncome: 0, …}
 [DEBUG] calculateTransactionStats - 计算结果: {totalTransactions: 0, income: 0, expense: 0, netProfit: 0, incomeCount: 0, …}
 [DEBUG] calculateSummaryFromTransactions - 最终汇总结果: {totalIncome: 0, totalExpense: 0, netAssets: 0, transactionCount: 0, inboundCount: 0, …}
 📅 周日 汇总数据 {totalIncome: 0, totalExpense: 0, netAssets: 0, transactionCount: 0, inboundCount: 0, …}
 📅 周度数据过滤结果 {currentDayIndex: 1, originalLabels: Array(7), filteredLabels: Array(2), originalDataLength: 7, filteredDataLength: 2, …}
 📅 最终周度图表数据集 {labels: Array(2), datasets: Array(1), incomeExpense: {…}}
 🔄 generateChartData 完成 {period: 'week', resultLabelsCount: 2, resultDatasetsCount: 1}
 📊 生成的图表数据 {period: 'week', labelsCount: 2, labels: Array(2), datasetsCount: 1, datasets: Array(1)}
 📊 数据已缓存 {cacheKey: 'assets_week_{"period":"week","year":2025,"month":8,"currentDayOfWeek":2,"currentDate":"2025-08-19"}'}
 ✓ 资产总览数据获取完成
 📊 getAssetDataByPeriod 开始 {period: 'week', params: {…}, timestamp: '2025-08-19T11:14:10.651Z'}
 📊 使用缓存数据 {cacheKey: 'assets_week_{"period":"week","year":2025,"month":8,"currentDayOfWeek":2,"currentDate":"2025-08-19"}', cachedLabelsCount: 2, cachedDatasetsCount: 1}
 ✓ 资产趋势数据获取完成
 💾 Mock DB: 开始生成收支趋势数据 {period: 'week', year: 2025, month: 8, currentDayOfWeek: 2, currentDate: '2025-08-19'}
 📊 getAssetDataByPeriod 开始 {period: 'week', params: {…}, timestamp: '2025-08-19T11:14:10.651Z'}
 📊 使用缓存数据 {cacheKey: 'assets_week_{"period":"week","year":2025,"month":8,"currentDayOfWeek":2,"currentDate":"2025-08-19"}', cachedLabelsCount: 2, cachedDatasetsCount: 1}
 💾 Mock DB: 获取到的原始数据 {period: 'week', hasIncomeExpenseData: true, labels: Array(2), labelsLength: 2, datasets: Array(2)}
 💾 Mock DB: 时间标签键名 {period: 'week', timeKey: 'day'}
 💾 Mock DB: 生成的收支趋势数据 {incomeLength: 2, expenseLength: 2, sampleIncomeItems: Array(2), sampleExpenseItems: Array(2)}
 🌐 API: Mock数据结果 {hasIncome: true, hasExpense: true, incomeLength: 2, expenseLength: 2, sampleIncomeItem: {…}, …}
 📊 Store: API响应数据 {error: 0, body: {…}, message: '获取收支趋势数据成功'}
 📊 Store: 收支趋势数据已更新 {period: 'week', dataStructure: {…}, sampleData: {…}}
 ✓ 收支趋势数据获取完成
 ✓ 收入结构数据获取完成
 ✓ 成本结构数据获取完成
 所有数据获取完成，耗时: 13ms
 资产总览原始数据: Proxy(Object) {totalIncome: 0, totalExpense: 0, netAssets: 0, chartData: {…}}
 更新后的资产数据: Proxy(Object) {totalIncome: 0, totalExpense: 0, netAssets: 0}
 收入结构数据: Proxy(Array) {0: {…}, 1: {…}, 2: {…}}
 成本结构数据: Proxy(Array) {0: {…}}
 开始更新图表数据...
 === 开始更新图表数据 === week
 Store中的原始数据:
 - 资产趋势数据: {labels: Array(2), data: Array(2)}
 - 收支趋势数据: Proxy(Object) {income: Array(2), expense: Array(2)}
 更新净资产趋势图表: {labels: Array(2), data: Array(2), labelsLength: 2, dataLength: 2}
 ✓ 净资产趋势图表更新完成
 收支趋势图表数据处理: {period: 'week', originalData: Proxy(Object), processedLabels: Array(2), processedIncomeData: Array(2), processedExpenseData: Array(2), …}
 🗓️ 本周数据标签检查: {incomeItems: Proxy(Array), expenseItems: Proxy(Array), extractedLabels: Array(2)}
 ✓ 收支趋势图表更新完成
 开始更新饼图...
 开始更新图表标题...
 === 图表数据更新完成 ===
 === 数据加载完成 ===
 === 时间维度切换完成 === 本周