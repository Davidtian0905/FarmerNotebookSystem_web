/**
 * 资产总览Mock数据库配置 - 基于交易记录的动态计算引擎
 * 所有汇总数据都基于真实的交易记录计算得出，支持事件驱动实时更新
 */

import { getAllTransactions, addTransaction, updateTransaction, deleteTransaction } from './database_flow.js'
import { emitTransactionAdded, emitTransactionUpdated, emitTransactionDeleted, getCache, setCache } from './event_system.js'
import { createLogger } from './utils/logger.js'
import {
  getCurrentDateInfo,
  getWeekNumber,
  parseTimeDimensions,
  getYearRange,
  filterTransactionsByPeriod,
  calculateNetAssets,
  calculateTransactionStats,
  formatAmount,
  formatDate
} from './utils/index.js'

const logger = createLogger('DB_ASSETS')

// Mock数据库存储键名
const DB_KEYS = {
  ASSETS_DATA: 'mock_assets_data',
  ASSETS_CONFIG: 'mock_assets_config',
  LAST_UPDATE: 'mock_assets_last_update'
}

/**
 * 根据交易记录计算汇总数据
 * @param {Array} transactions - 交易记录数组
 * @param {string} period - 时间维度 ('year', 'month', 'week', 'day')
 * @param {Object} params - 查询参数
 * @returns {Object} 汇总数据
 */
export const calculateSummaryFromTransactions = (transactions, period, params = {}) => {
  console.log('[DEBUG] calculateSummaryFromTransactions - 开始汇总:', {
    originalTransactionsCount: transactions.length,
    period,
    params,
    sampleOriginalTransactions: transactions.slice(0, 3).map(t => ({
      id: t.id,
      date: t.date,
      type: t.type,
      amount: t.amount
    }))
  })
  
  // 使用新的工具函数进行数据过滤
  const filteredTransactions = filterTransactionsByPeriod(transactions, period, params)
  
  console.log('[DEBUG] calculateSummaryFromTransactions - 过滤后数据:', {
    filteredCount: filteredTransactions.length,
    filteredTransactions: filteredTransactions.map(t => ({
      id: t.id,
      date: t.date,
      type: t.type,
      amount: t.amount
    }))
  })
  
  // 使用新的计算工具函数
  const stats = calculateTransactionStats(filteredTransactions)
  
  const result = {
    totalIncome: stats.income,
    totalExpense: stats.expense,
    netAssets: stats.netProfit,
    transactionCount: stats.totalTransactions,
    inboundCount: stats.incomeCount,
    outboundCount: stats.expenseCount
  }
  
  console.log('[DEBUG] calculateSummaryFromTransactions - 最终汇总结果:', result)
  
  return result
}

// getYearRange 函数已移至 utils/dateUtils.js

/**
 * 生成包含缺失年份并填充0值的年度数据
 * @param {Array} transactions - 交易记录数组
 * @returns {Object} 包含所有年份数据的对象
 */
const generateYearlyDataWithGaps = (transactions) => {
  const { minYear, maxYear } = getYearRange(transactions)
  const yearlyData = []
  const yearLabels = []
  
  // 为每个年份生成数据，包括缺失的年份
  for (let year = minYear; year <= maxYear; year++) {
    yearLabels.push(`${year}年`)
    
    // 过滤出当前年份的交易记录
    const yearTransactions = transactions.filter(t => {
      const transactionYear = new Date(t.date).getFullYear()
      return transactionYear === year
    })
    
    // 计算当前年份的汇总数据
    const summary = calculateSummaryFromTransactions(yearTransactions, 'year', { year })
    yearlyData.push(summary)
  }
  
  return {
    labels: yearLabels,
    data: yearlyData
  }
}

/**
 * 生成图表数据
 * @param {Array} transactions - 交易记录数组
 * @param {string} period - 时间维度
 * @param {Object} params - 查询参数
 * @returns {Object} 图表数据
 */
// 创建图表数据集的通用函数
const createChartDataset = (data, labels) => {
  return {
    labels,
    datasets: [{
      label: '净资产',
      data: data.map(d => d.netAssets),
      borderColor: '#10B981',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      tension: 0.4,
      fill: true
    }],
    incomeExpense: {
      labels,
      datasets: [
        {
          label: '收入',
          data: data.map(d => d.totalIncome),
          backgroundColor: '#10B981'
        },
        {
          label: '支出',
          data: data.map(d => d.totalExpense),
          backgroundColor: '#EF4444'
        }
      ]
    }
  }
}

// 生成总计数据（按年份）
const generateTotalChartData = (transactions) => {
  const yearlyDataWithGaps = generateYearlyDataWithGaps(transactions)
  
  logger.debug('=== total 模式调试信息 ===');
  logger.debug('年份范围:', getYearRange(transactions));
  logger.debug('年份标签:', yearlyDataWithGaps.labels);
  logger.debug('年度数据:', yearlyDataWithGaps.data);
  
  return createChartDataset(yearlyDataWithGaps.data, yearlyDataWithGaps.labels)
}

// 生成年度数据（按月份）
const generateYearChartData = (transactions, year, currentInfo) => {
  const yearLabels = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
  const yearData = []
  
  for (let month = 1; month <= 12; month++) {
    const monthTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date)
      return transactionDate.getFullYear() === year && transactionDate.getMonth() + 1 === month
    })
    
    const summary = calculateSummaryFromTransactions(monthTransactions, 'month', { year, month })
    yearData.push(summary)
  }
  
  // 只显示到当前月份的数据
  const filteredLabels = yearLabels.slice(0, currentInfo.month)
  const filteredData = yearData.slice(0, currentInfo.month)
  
  return createChartDataset(filteredData, filteredLabels)
}

// 生成月度数据（按日期）
const generateMonthChartData = (transactions, year, month, currentInfo) => {
  const daysInMonth = new Date(year, month, 0).getDate()
  const monthLabels = Array.from({length: daysInMonth}, (_, i) => `${i + 1}日`)
  const monthData = []
  
  for (let day = 1; day <= daysInMonth; day++) {
    const summary = calculateSummaryFromTransactions(transactions, 'day', { year, month, day })
    monthData.push(summary)
  }
  
  // 如果查询当前月份，只显示到当前日期；否则显示整个月
  const isCurrentMonth = (year === currentInfo.year && month === currentInfo.month)
  const displayDays = isCurrentMonth ? currentInfo.day : daysInMonth
  const filteredMonthLabels = monthLabels.slice(0, displayDays)
  const filteredMonthData = monthData.slice(0, displayDays)
  
  return createChartDataset(filteredMonthData, filteredMonthLabels)
}

// 生成周度数据（按星期）
const generateWeekChartData = (transactions, year, currentInfo) => {
  console.log('📅 生成周度图表数据开始', {
    transactionsCount: transactions.length,
    year,
    currentInfo,
    currentDate: new Date().toISOString().split('T')[0]
  })
  
  const weekLabels = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  const weekData = []
  const currentWeek = getWeekNumber(new Date())
  
  console.log('📅 周度数据生成参数', {
    weekLabels,
    currentWeek,
    currentDayOfWeek: currentInfo.dayOfWeek
  })
  
  for (let dayOfWeek = 1; dayOfWeek <= 7; dayOfWeek++) {
    const dayTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date)
      const transactionDayOfWeek = transactionDate.getDay()
      const adjustedDayOfWeek = transactionDayOfWeek === 0 ? 7 : transactionDayOfWeek
      const transactionWeek = getWeekNumber(transactionDate)
      
      const matches = transactionDate.getFullYear() === year && 
             transactionWeek === currentWeek && 
             adjustedDayOfWeek === dayOfWeek
      
      return matches
    })
    
    console.log(`📅 ${weekLabels[dayOfWeek - 1]} (${dayOfWeek}) 的交易数据`, {
      dayOfWeek,
      transactionsCount: dayTransactions.length,
      transactions: dayTransactions.map(t => ({
        date: t.date,
        type: t.type,
        amount: t.amount,
        productName: t.productName
      }))
    })
    
    // 计算当前日期
    const currentDate = new Date(currentInfo.year, currentInfo.month - 1, currentInfo.day)
    const weekStart = new Date(currentDate)
    weekStart.setDate(currentDate.getDate() - currentDate.getDay() + (dayOfWeek === 7 ? 0 : dayOfWeek))
    
    const dayParams = {
      year: weekStart.getFullYear(),
      month: weekStart.getMonth() + 1,
      day: weekStart.getDate()
    }
    
    console.log(`📅 ${weekLabels[dayOfWeek - 1]} (${dayOfWeek}) 日期参数`, {
      dayOfWeek,
      weekStart: weekStart.toISOString().split('T')[0],
      dayParams
    })
    
    const summary = calculateSummaryFromTransactions(dayTransactions, 'day', dayParams)
    console.log(`📅 ${weekLabels[dayOfWeek - 1]} 汇总数据`, summary)
    weekData.push(summary)
  }
  
  // 只显示到当前日期的数据
  const currentDayIndex = currentInfo.dayOfWeek === 0 ? 6 : currentInfo.dayOfWeek - 1
  const filteredWeekLabels = weekLabels.slice(0, currentDayIndex + 1)
  const filteredWeekData = weekData.slice(0, currentDayIndex + 1)
  
  console.log('📅 周度数据过滤结果', {
    currentDayIndex,
    originalLabels: weekLabels,
    filteredLabels: filteredWeekLabels,
    originalDataLength: weekData.length,
    filteredDataLength: filteredWeekData.length,
    filteredData: filteredWeekData
  })
  
  const chartDataset = createChartDataset(filteredWeekData, filteredWeekLabels)
  console.log('📅 最终周度图表数据集', chartDataset)
  
  return chartDataset
}

// 重构后的主函数
const generateChartData = (transactions, period, params = {}) => {
  console.log('🔄 generateChartData 开始', {
    period,
    params,
    transactionsCount: transactions.length
  })
  
  const currentInfo = getCurrentDateInfo()
  const { year = currentInfo.year, month = currentInfo.month, currentDayOfWeek } = params
  
  console.log('🔄 当前时间信息', {
    originalCurrentInfo: { ...currentInfo },
    extractedParams: { year, month, currentDayOfWeek }
  })
  
  // 如果前端传递了 currentDayOfWeek，使用它覆盖 currentInfo.dayOfWeek
  if (currentDayOfWeek !== undefined) {
    console.log('🔄 覆盖 currentDayOfWeek', {
      original: currentInfo.dayOfWeek,
      new: currentDayOfWeek
    })
    currentInfo.dayOfWeek = currentDayOfWeek
  }
  
  console.log('🔄 最终使用的参数', {
    period,
    year,
    month,
    finalCurrentInfo: currentInfo
  })
  
  let result
  switch (period) {
    case 'total':
      console.log('🔄 生成总统计数据')
      result = generateTotalChartData(transactions)
      break
      
    case 'year':
      console.log('🔄 生成年度数据')
      result = generateYearChartData(transactions, year, currentInfo)
      break
      
    case 'month':
      console.log('🔄 生成月度数据')
      result = generateMonthChartData(transactions, year, month, currentInfo)
      break
      
    case 'week':
      console.log('🔄 生成周度数据')
      result = generateWeekChartData(transactions, year, currentInfo)
      break
      
    default:
      throw new Error(`不支持的时间维度: ${period}`)
  }
  
  console.log('🔄 generateChartData 完成', {
    period,
    resultLabelsCount: result?.labels?.length || 0,
    resultDatasetsCount: result?.datasets?.length || 0
  })
  
  return result
}

/**
 * 获取资产数据（基于交易记录动态计算）
 * @param {string} period - 时间维度 ('year', 'month', 'week', 'total')
 * @param {Object} params - 查询参数
 * @returns {Object} 资产数据
 */
export const getAssetDataByPeriod = (period, params = {}) => {
  console.log('📊 getAssetDataByPeriod 开始', {
    period,
    params,
    timestamp: new Date().toISOString()
  })
  
  // 检查缓存
  const cacheKey = `assets_${period}_${JSON.stringify(params)}`
  const cachedData = getCache(cacheKey)
  if (cachedData) {
    console.log('📊 使用缓存数据', {
      cacheKey,
      cachedLabelsCount: cachedData?.labels?.length || 0,
      cachedDatasetsCount: cachedData?.datasets?.length || 0
    })
    return cachedData
  }
  
  console.log('📊 缓存未命中，生成新数据', { cacheKey })
  
  // 获取所有交易记录
  const transactions = getAllTransactions()
  console.log('📊 获取交易记录', {
    transactionsCount: transactions.length,
    sampleTransactions: transactions.slice(0, 3).map(t => ({
      date: t.date,
      type: t.type,
      amount: t.amount,
      productName: t.productName
    }))
  })
  
  // 生成图表数据
  const chartData = generateChartData(transactions, period, params)
  
  console.log('📊 生成的图表数据', {
    period,
    labelsCount: chartData?.labels?.length || 0,
    labels: chartData?.labels || [],
    datasetsCount: chartData?.datasets?.length || 0,
    datasets: chartData?.datasets?.map(ds => ({
      label: ds.label,
      dataLength: ds.data?.length || 0,
      sampleData: ds.data?.slice(0, 3) || []
    })) || []
  })
  
  // 缓存结果
  setCache(cacheKey, chartData, 5 * 60 * 1000) // 5分钟缓存
  console.log('📊 数据已缓存', { cacheKey })
  
  return chartData
}

/**
 * 获取资产总览数据
 * @param {Object} params - 查询参数
 * @returns {Object} 资产总览数据
 */
export const getAssetOverview = (params = {}) => {
  const { period = 'year' } = params
  const data = getAssetDataByPeriod(period, params)
  
  // 计算总览数据
  const totalIncome = data.incomeExpense.datasets[0].data.reduce((sum, val) => sum + val, 0)
  const totalExpense = data.incomeExpense.datasets[1].data.reduce((sum, val) => sum + val, 0)
  const netAssets = totalIncome - totalExpense
  
  return {
    totalIncome,
    totalExpense,
    netAssets,
    chartData: data
  }
}

/**
 * 获取资产趋势数据
 * @param {Object} params - 查询参数
 * @returns {Object} 资产趋势数据
 */
export const getAssetTrend = (params = {}) => {
  const { period = 'year' } = params
  const data = getAssetDataByPeriod(period, params)
  
  return data.datasets[0].data.map((value, index) => ({
    month: data.labels[index],
    value
  }))
}

/**
 * 获取收支趋势数据
 * @param {Object} params - 查询参数
 * @returns {Object} 收支趋势数据
 */
export const getIncomeExpenseTrend = (params = {}) => {
  console.log('💾 Mock DB: 开始生成收支趋势数据', params)
  
  const { period = 'year' } = params
  const data = getAssetDataByPeriod(period, params)
  
  console.log('💾 Mock DB: 获取到的原始数据', {
    period,
    hasIncomeExpenseData: !!data.incomeExpense,
    labels: data.incomeExpense?.labels,
    labelsLength: data.incomeExpense?.labels?.length,
    datasets: data.incomeExpense?.datasets?.map(ds => ({
      label: ds.label,
      dataLength: ds.data?.length,
      sampleData: ds.data?.slice(0, 3)
    }))
  })
  
  // 根据period确定时间标签的属性名
  const timeKey = period === 'week' ? 'day' : 'month'
  console.log('💾 Mock DB: 时间标签键名', { period, timeKey })
  
  const result = {
    income: data.incomeExpense.datasets[0].data.map((value, index) => ({
      [timeKey]: data.incomeExpense.labels[index],
      month: data.incomeExpense.labels[index], // 保持向后兼容
      value
    })),
    expense: data.incomeExpense.datasets[1].data.map((value, index) => ({
      [timeKey]: data.incomeExpense.labels[index],
      month: data.incomeExpense.labels[index], // 保持向后兼容
      value
    }))
  }
  
  console.log('💾 Mock DB: 生成的收支趋势数据', {
    incomeLength: result.income?.length,
    expenseLength: result.expense?.length,
    sampleIncomeItems: result.income?.slice(0, 3),
    sampleExpenseItems: result.expense?.slice(0, 3)
  })
  
  return result
}

/**
 * 获取收入结构数据（基于交易记录计算）
 * @param {Object} params - 查询参数
 * @returns {Array} 收入结构数据
 */
export const getIncomeStructure = (params = {}) => {
  const transactions = getAllTransactions()
  const outboundTransactions = transactions.filter(t => t.type === 'OUTBOUND')
  
  // 按产品分类统计
  const productStats = {}
  outboundTransactions.forEach(t => {
    if (!productStats[t.productName]) {
      productStats[t.productName] = 0
    }
    productStats[t.productName] += t.amount
  })
  
  // 转换为数组格式
  const totalIncome = Object.values(productStats).reduce((sum, val) => sum + val, 0)
  const incomeStructure = Object.entries(productStats).map(([name, value], index) => {
    const colors = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444']
    return {
      name: `${name}销售`,
      value,
      percentage: totalIncome > 0 ? Math.round((value / totalIncome) * 100 * 10) / 10 : 0,
      color: colors[index % colors.length]
    }
  })
  
  return incomeStructure
}

/**
 * 获取成本结构数据（基于交易记录计算）
 * @param {Object} params - 查询参数
 * @returns {Array} 成本结构数据
 */
export const getCostStructure = (params = {}) => {
  const transactions = getAllTransactions()
  const inboundTransactions = transactions.filter(t => t.type === 'INBOUND')
  
  // 按产品分类统计
  const productStats = {}
  inboundTransactions.forEach(t => {
    if (!productStats[t.productName]) {
      productStats[t.productName] = 0
    }
    productStats[t.productName] += t.amount
  })
  
  // 转换为数组格式
  const totalExpense = Object.values(productStats).reduce((sum, val) => sum + val, 0)
  const costStructure = Object.entries(productStats).map(([name, value], index) => {
    const colors = ['#EF4444', '#EAB308', '#6366F1', '#6B7280', '#10B981']
    return {
      name: `${name}采购`,
      value,
      percentage: totalExpense > 0 ? Math.round((value / totalExpense) * 100 * 10) / 10 : 0,
      color: colors[index % colors.length]
    }
  })
  
  return costStructure
}

/**
 * 获取资产统计数据
 * @param {Object} params - 查询参数
 * @returns {Object} 资产统计数据
 */
export const getAssetStatistics = (params = {}) => {
  const { period = 'year' } = params
  const data = getAssetDataByPeriod(period, params)
  
  // 计算统计数据
  const totalIncome = data.incomeExpense.datasets[0].data.reduce((sum, val) => sum + val, 0)
  const totalExpense = data.incomeExpense.datasets[1].data.reduce((sum, val) => sum + val, 0)
  const netAssets = totalIncome - totalExpense
  const profitRate = totalIncome > 0 ? ((netAssets / totalIncome) * 100).toFixed(2) : 0
  
  return {
    totalIncome,
    totalExpense,
    netAssets,
    profitRate: parseFloat(profitRate),
    period,
    dataPoints: data.labels.length,
    averageIncome: totalIncome / data.labels.length,
    averageExpense: totalExpense / data.labels.length
  }
}

/**
 * 添加交易记录并触发事件
 * @param {Object} transaction - 交易记录
 * @returns {Object} 添加的交易记录
 */
export const addTransactionWithEvent = (transaction) => {
  const newTransaction = addTransaction(transaction)
  emitTransactionAdded(newTransaction)
  return newTransaction
}

/**
 * 更新交易记录并触发事件
 * @param {string} id - 交易记录ID
 * @param {Object} updates - 更新内容
 * @returns {Object|null} 更新后的交易记录
 */
export const updateTransactionWithEvent = (id, updates) => {
  const oldTransaction = getAllTransactions().find(t => t.id === id)
  const updatedTransaction = updateTransaction(id, updates)
  
  if (updatedTransaction) {
    emitTransactionUpdated(updatedTransaction, oldTransaction)
  }
  
  return updatedTransaction
}

/**
 * 删除交易记录并触发事件
 * @param {string} id - 交易记录ID
 * @returns {boolean} 是否删除成功
 */
export const deleteTransactionWithEvent = (id) => {
  const success = deleteTransaction(id)
  
  if (success) {
    emitTransactionDeleted(id)
  }
  
  return success
}

/**
 * 按年份汇总交易数据
 * @param {Array} transactions - 交易记录数组
 * @param {number} year - 年份
 * @returns {Object} 年度汇总数据
 */
export const calculateYearlySummary = (transactions, year) => {
  const yearTransactions = filterTransactionsByPeriod(transactions, 'year', { year })
  return calculateSummaryFromTransactions(yearTransactions, 'year', { year })
}

/**
 * 按月份汇总交易数据
 * @param {Array} transactions - 交易记录数组
 * @param {number} year - 年份
 * @param {number} month - 月份
 * @returns {Object} 月度汇总数据
 */
export const calculateMonthlySummary = (transactions, year, month) => {
  const monthTransactions = filterTransactionsByPeriod(transactions, 'month', { year, month })
  return calculateSummaryFromTransactions(monthTransactions, 'month', { year, month })
}

/**
 * 按周度汇总交易数据
 * @param {Array} transactions - 交易记录数组
 * @param {number} year - 年份
 * @param {number} week - 周数
 * @returns {Object} 周度汇总数据
 */
export const calculateWeeklySummary = (transactions, year, week) => {
  const weekTransactions = filterTransactionsByPeriod(transactions, 'week', { year, week })
  return calculateSummaryFromTransactions(weekTransactions, 'week', { year, week })
}

/**
 * 按日度汇总交易数据
 * @param {Array} transactions - 交易记录数组
 * @param {string} date - 日期 (YYYY-MM-DD)
 * @returns {Object} 日度汇总数据
 */
export const calculateDailySummary = (transactions, date) => {
  const dayTransactions = filterTransactionsByPeriod(transactions, 'day', { date })
  return calculateSummaryFromTransactions(dayTransactions, 'day', { date })
}

/**
 * 获取历史汇总数据
 * @param {Array} transactions - 交易记录数组
 * @param {string} period - 时间维度
 * @param {Object} params - 查询参数
 * @returns {Object} 汇总数据
 */
export const getHistoricalSummary = (transactions, period, params = {}) => {
  const { year, month, date, week } = params
  
  switch (period) {
    case 'year':
      return calculateYearlySummary(transactions, year)
    case 'month':
      return calculateMonthlySummary(transactions, year, month)
    case 'week':
      return calculateWeeklySummary(transactions, year, week)
    case 'day':
      return calculateDailySummary(transactions, date)
    case 'total':
      // 总统计：包含所有年份的数据
      return calculateSummaryFromTransactions(transactions, 'total', {})
    default:
      throw new Error(`不支持的时间维度: ${period}`)
  }
}

// filterTransactionsByPeriod 函数已移至 utils/dataFilters.js，此处移除重复定义

/**
 * 生成月度数据
 * @param {Array} transactions - 交易记录数组
 * @param {number} year - 年份
 * @returns {Array} 月度数据数组
 */
export const generateMonthlyData = (transactions, year) => {
  const monthlyData = []
  
  for (let month = 1; month <= 12; month++) {
    const monthSummary = calculateMonthlySummary(transactions, year, month)
    monthlyData.push({
      month,
      income: monthSummary.totalIncome,
      expense: monthSummary.totalExpense,
      netAssets: monthSummary.netAssets,
      transactionCount: monthSummary.transactionCount
    })
  }
  
  return monthlyData
}

/**
 * 生成日度数据（用于月度查询）
 * @param {Array} transactions - 交易记录数组
 * @param {number} year - 年份
 * @param {number} month - 月份
 * @returns {Array} 日度数据数组
 */
export const generateDailyDataForMonth = (transactions, year, month) => {
  const daysInMonth = new Date(year, month, 0).getDate()
  const dailyData = []
  
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = formatDate(new Date(year, month - 1, day))
    const daySummary = calculateDailySummary(transactions, dateStr)
    dailyData.push({
      day,
      date: dateStr,
      income: daySummary.totalIncome,
      expense: daySummary.totalExpense,
      netAssets: daySummary.netAssets,
      transactionCount: daySummary.transactionCount
    })
  }
  
  return dailyData
}

/**
 * 生成周度数据（用于周度查询）
 * @param {Array} transactions - 交易记录数组
 * @param {number} year - 年份
 * @param {number} week - 周数
 * @param {number} currentDayOfWeek - 当前星期几（可选）
 * @returns {Array} 周度数据数组
 */
export const generateWeeklyDataForWeek = (transactions, year, week, currentDayOfWeek = 7) => {
  const weeklyData = []
  const weekDays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  
  for (let dayOfWeek = 1; dayOfWeek <= 7; dayOfWeek++) {
    const dayTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date)
      const transactionDayOfWeek = transactionDate.getDay()
      const adjustedDayOfWeek = transactionDayOfWeek === 0 ? 7 : transactionDayOfWeek
      const transactionWeek = getWeekNumber(transactionDate)
      
      return transactionDate.getFullYear() === year && 
             transactionWeek === week && 
             adjustedDayOfWeek === dayOfWeek
    })
    
    const daySummary = calculateSummaryFromTransactions(dayTransactions, 'day')
    weeklyData.push({
      dayOfWeek,
      dayName: weekDays[dayOfWeek - 1],
      income: daySummary.totalIncome,
      expense: daySummary.totalExpense,
      netAssets: daySummary.netAssets,
      transactionCount: daySummary.transactionCount
    })
  }
  
  return weeklyData
}

/**
 * 生成年度数据（用于总计查询）
 * @param {Array} transactions - 交易记录数组
 * @returns {Array} 年度数据数组
 */
export const generateYearlyDataForApi = (transactions) => {
  const { minYear, maxYear } = getYearRange(transactions)
  const yearlyData = []
  
  for (let year = minYear; year <= maxYear; year++) {
    const yearSummary = calculateYearlySummary(transactions, year)
    yearlyData.push({
      year,
      income: yearSummary.totalIncome,
      expense: yearSummary.totalExpense,
      netAssets: yearSummary.netAssets,
      transactionCount: yearSummary.transactionCount
    })
  }
  
  return yearlyData
}

/**
 * 调试函数：打印当前数据状态
 */
export const debugAssetsData = () => {
  const transactions = getAllTransactions()
  const currentInfo = getCurrentDateInfo()
  
  // 显示当前时间范围内的交易记录
  const currentYearTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.date)
    return transactionDate.getFullYear() === currentInfo.year
  })
  
  const currentMonthTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.date)
    return transactionDate.getFullYear() === currentInfo.year && 
           transactionDate.getMonth() + 1 === currentInfo.month
  })
  
  // 使用工具函数计算统计数据
  const totalStats = calculateTransactionStats(transactions)
  const currentYearStats = calculateTransactionStats(currentYearTransactions)
  
  // 测试数据计算
  getAssetDataByPeriod('year')
  getAssetDataByPeriod('month')
  getAssetDataByPeriod('total')
  
  // 构建调试信息对象
  const debugInfo = {
    totalTransactions: transactions.length,
    currentInfo,
    currentYearTransactions: currentYearTransactions.length,
    currentMonthTransactions: currentMonthTransactions.length,
    inboundCount: totalStats.incomeCount,
    outboundCount: totalStats.expenseCount,
    totalInbound: totalStats.income,
    totalOutbound: totalStats.expense,
    currentYearInbound: currentYearStats.income,
    currentYearOutbound: currentYearStats.expense,
    recentTransactions: transactions.slice(-5)
  }
  
  // 使用日志系统输出调试信息
  logger.info('=== 资产数据调试信息 ===');
  logger.debug('调试信息详情:', debugInfo);
  
  return debugInfo
}