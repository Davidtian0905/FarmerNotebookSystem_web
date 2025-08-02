/**
 * 资产总览Mock数据库配置 - 基于交易记录的动态计算引擎
 * 所有汇总数据都基于真实的交易记录计算得出，支持事件驱动实时更新
 */

import { getAllTransactions, addTransaction, updateTransaction, deleteTransaction } from './database_flow.js'
import { emitTransactionAdded, emitTransactionUpdated, emitTransactionDeleted, getCache, setCache } from './event_system.js'

// Mock数据库存储键名
const DB_KEYS = {
  ASSETS_DATA: 'mock_assets_data',
  ASSETS_CONFIG: 'mock_assets_config',
  LAST_UPDATE: 'mock_assets_last_update'
}

/**
 * 获取当前时间信息
 * @returns {Object} 当前时间信息
 */
const getCurrentDateInfo = () => {
  const now = new Date()
  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    day: now.getDate(),
    dayOfWeek: now.getDay(), // 0=周日, 1=周一, ..., 6=周六
    currentDate: now.toISOString().split('T')[0]
  }
}

/**
 * 计算净资产
 * @param {number} income - 收入
 * @param {number} expense - 支出
 * @returns {number} 净资产
 */
const calculateNetAssets = (income, expense) => {
  return income - expense
}

/**
 * 获取周数
 * @param {Date} date - 日期对象
 * @returns {number} 周数 (1-53)
 */
const getWeekNumber = (date) => {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1)
  const pastDaysOfYear = (date - firstDayOfYear) / 86400000
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)
}

/**
 * 解析时间维度
 * @param {string} dateStr - 日期字符串 (YYYY-MM-DD)
 * @returns {Object} 时间维度信息
 */
const parseTimeDimensions = (dateStr) => {
  const date = new Date(dateStr)
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    week: getWeekNumber(date),
    day: date.getDate(),
    dayOfWeek: date.getDay() // 0=周日, 1=周一, ..., 6=周六
  }
}

/**
 * 根据交易记录计算汇总数据
 * @param {Array} transactions - 交易记录数组
 * @param {string} period - 时间维度 ('year', 'month', 'week', 'day')
 * @param {Object} params - 查询参数
 * @returns {Object} 汇总数据
 */
export const calculateSummaryFromTransactions = (transactions, period, params = {}) => {
  const currentInfo = getCurrentDateInfo()
  const { year = currentInfo.year, month = currentInfo.month } = params
  
  // 过滤交易记录
  let filteredTransactions = transactions
  
  switch (period) {
    case 'year':
      // 本年数据
      filteredTransactions = transactions.filter(t => {
        const transactionYear = new Date(t.date).getFullYear()
        return transactionYear === year
      })
      break
      
    case 'month':
      // 本月数据
      filteredTransactions = transactions.filter(t => {
        const transactionDate = new Date(t.date)
        return transactionDate.getFullYear() === year && 
               transactionDate.getMonth() + 1 === month
      })
      break
      
    case 'week':
      // 本周数据
      const currentWeek = getWeekNumber(new Date())
      filteredTransactions = transactions.filter(t => {
        const transactionWeek = getWeekNumber(new Date(t.date))
        return transactionWeek === currentWeek
      })
      break
      
    case 'day':
      // 今日数据
      const today = new Date().toISOString().split('T')[0]
      filteredTransactions = transactions.filter(t => t.date === today)
      break
      
    case 'total':
      // 总统计：包含所有年份的数据，不过滤
      filteredTransactions = transactions
      break
      
    default:
      filteredTransactions = transactions
  }
  
  // 计算汇总数据
  const inboundTransactions = filteredTransactions.filter(t => t.type === 'INBOUND')
  const outboundTransactions = filteredTransactions.filter(t => t.type === 'OUTBOUND')
  
  const totalIncome = outboundTransactions.reduce((sum, t) => sum + t.amount, 0)
  const totalExpense = inboundTransactions.reduce((sum, t) => sum + t.amount, 0)
  const netAssets = calculateNetAssets(totalIncome, totalExpense)
  
  // 调试日志
  console.log('=== calculateSummaryFromTransactions 调试信息 ===')
  console.log('时间维度:', period)
  console.log('参数:', params)
  console.log('过滤前交易记录数:', transactions.length)
  console.log('过滤后交易记录数:', filteredTransactions.length)
  console.log('入库记录数:', inboundTransactions.length)
  console.log('出库记录数:', outboundTransactions.length)
  console.log('总收入:', totalIncome)
  console.log('总支出:', totalExpense)
  console.log('净资产:', netAssets)
  
  // 显示交易记录详情
  if (filteredTransactions.length > 0) {
    console.log('交易记录详情:')
    filteredTransactions.forEach(t => {
      console.log(`  ${t.date} ${t.type} ${t.productName} ¥${t.amount}`)
    })
  }
  
  return {
    totalIncome,
    totalExpense,
    netAssets,
    transactionCount: filteredTransactions.length,
    inboundCount: inboundTransactions.length,
    outboundCount: outboundTransactions.length
  }
}

/**
 * 获取交易数据的年份范围
 * @param {Array} transactions - 交易记录数组
 * @returns {Object} 包含最小年份和最大年份的对象
 */
const getYearRange = (transactions) => {
  if (transactions.length === 0) {
    const currentYear = new Date().getFullYear()
    return { minYear: currentYear, maxYear: currentYear }
  }
  
  const years = transactions.map(t => new Date(t.date).getFullYear())
  const minYear = Math.min(...years)
  const maxYear = Math.max(...years)
  
  return { minYear, maxYear }
}

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
const generateChartData = (transactions, period, params = {}) => {
  const currentInfo = getCurrentDateInfo()
  const { year = currentInfo.year } = params
  
  switch (period) {
    case 'total':
      // 总计数据 - 按年份显示所有历史数据，包括缺失年份填充0值
      const yearlyDataWithGaps = generateYearlyDataWithGaps(transactions)
      
      // 调试日志
      console.log('=== total 模式调试信息 ===')
      console.log('年份范围:', getYearRange(transactions))
      console.log('年份标签:', yearlyDataWithGaps.labels)
      console.log('年度数据:', yearlyDataWithGaps.data)
      
      return {
        labels: yearlyDataWithGaps.labels,
        datasets: [{
          label: '净资产',
          data: yearlyDataWithGaps.data.map(d => d.netAssets),
          borderColor: '#10B981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.4,
          fill: true
        }],
        incomeExpense: {
          labels: yearlyDataWithGaps.labels,
          datasets: [
            {
              label: '收入',
              data: yearlyDataWithGaps.data.map(d => d.totalIncome),
              backgroundColor: '#10B981'
            },
            {
              label: '支出',
              data: yearlyDataWithGaps.data.map(d => d.totalExpense),
              backgroundColor: '#EF4444'
            }
          ]
        }
      }
      
    case 'year':
      // 年度数据 - 按月份分组
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
      
      return {
        labels: filteredLabels,
        datasets: [{
          label: '净资产',
          data: filteredData.map(d => d.netAssets),
          borderColor: '#10B981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.4,
          fill: true
        }],
        incomeExpense: {
          labels: filteredLabels,
          datasets: [
            {
              label: '收入',
              data: filteredData.map(d => d.totalIncome),
              backgroundColor: '#10B981'
            },
            {
              label: '支出',
              data: filteredData.map(d => d.totalExpense),
              backgroundColor: '#EF4444'
            }
          ]
        }
      }
      
    case 'month':
      // 月度数据 - 按日期分组
      const daysInMonth = new Date(year, currentInfo.month, 0).getDate()
      const monthLabels = Array.from({length: daysInMonth}, (_, i) => `${i + 1}日`)
      const monthData = []
      
      for (let day = 1; day <= daysInMonth; day++) {
        const dayTransactions = transactions.filter(t => {
          const transactionDate = new Date(t.date)
          return transactionDate.getFullYear() === year && 
                 transactionDate.getMonth() + 1 === currentInfo.month &&
                 transactionDate.getDate() === day
        })
        
        const summary = calculateSummaryFromTransactions(dayTransactions, 'day', { year, month: currentInfo.month, day })
        monthData.push(summary)
      }
      
      // 只显示到当前日期的数据
      const filteredMonthLabels = monthLabels.slice(0, currentInfo.day)
      const filteredMonthData = monthData.slice(0, currentInfo.day)
      
      return {
        labels: filteredMonthLabels,
        datasets: [{
          label: '净资产',
          data: filteredMonthData.map((day, index) => {
            const cumulativeIncome = filteredMonthData.slice(0, index + 1).reduce((sum, d) => sum + d.totalIncome, 0)
            const cumulativeExpense = filteredMonthData.slice(0, index + 1).reduce((sum, d) => sum + d.totalExpense, 0)
            return calculateNetAssets(cumulativeIncome, cumulativeExpense)
          }),
          borderColor: '#10B981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.4,
          fill: true
        }],
        incomeExpense: {
          labels: filteredMonthLabels,
          datasets: [
            {
              label: '收入',
              data: filteredMonthData.map(day => day.totalIncome),
              backgroundColor: '#10B981'
            },
            {
              label: '支出',
              data: filteredMonthData.map(day => day.totalExpense),
              backgroundColor: '#EF4444'
            }
          ]
        }
      }
      
    case 'week':
      // 周度数据 - 按星期分组
      const weekLabels = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
      const weekData = []
      
      for (let dayOfWeek = 1; dayOfWeek <= 7; dayOfWeek++) {
        const dayTransactions = transactions.filter(t => {
          const transactionDate = new Date(t.date)
          const transactionDayOfWeek = transactionDate.getDay()
          const adjustedDayOfWeek = transactionDayOfWeek === 0 ? 7 : transactionDayOfWeek
          return adjustedDayOfWeek === dayOfWeek
        })
        
        const summary = calculateSummaryFromTransactions(dayTransactions, 'day')
        weekData.push(summary)
      }
      
      // 只显示到当前日期的数据
      const currentDayIndex = currentInfo.dayOfWeek === 0 ? 6 : currentInfo.dayOfWeek - 1
      const filteredWeekLabels = weekLabels.slice(0, currentDayIndex + 1)
      const filteredWeekData = weekData.slice(0, currentDayIndex + 1)
      
      return {
        labels: filteredWeekLabels,
        datasets: [{
          label: '净资产',
          data: filteredWeekData.map((day, index) => {
            const cumulativeIncome = filteredWeekData.slice(0, index + 1).reduce((sum, d) => sum + d.totalIncome, 0)
            const cumulativeExpense = filteredWeekData.slice(0, index + 1).reduce((sum, d) => sum + d.totalExpense, 0)
            return calculateNetAssets(cumulativeIncome, cumulativeExpense)
          }),
          borderColor: '#10B981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.4,
          fill: true
        }],
        incomeExpense: {
          labels: filteredWeekLabels,
          datasets: [
            {
              label: '收入',
              data: filteredWeekData.map(day => day.totalIncome),
              backgroundColor: '#10B981'
            },
            {
              label: '支出',
              data: filteredWeekData.map(day => day.totalExpense),
              backgroundColor: '#EF4444'
            }
          ]
        }
      }
      
    default:
      throw new Error(`不支持的时间维度: ${period}`)
  }
}

/**
 * 获取资产数据（基于交易记录动态计算）
 * @param {string} period - 时间维度 ('year', 'month', 'week', 'total')
 * @param {Object} params - 查询参数
 * @returns {Object} 资产数据
 */
export const getAssetDataByPeriod = (period, params = {}) => {
  // 检查缓存
  const cacheKey = `assets_${period}_${JSON.stringify(params)}`
  const cachedData = getCache(cacheKey)
  if (cachedData) {
    return cachedData
  }
  
  // 获取所有交易记录
  const transactions = getAllTransactions()
  
  // 生成图表数据
  const chartData = generateChartData(transactions, period, params)
  
  // 缓存结果
  setCache(cacheKey, chartData, 5 * 60 * 1000) // 5分钟缓存
  
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
  const { period = 'year' } = params
  const data = getAssetDataByPeriod(period, params)
  
  return {
    income: data.incomeExpense.datasets[0].data.map((value, index) => ({
      month: data.incomeExpense.labels[index],
      value
    })),
    expense: data.incomeExpense.datasets[1].data.map((value, index) => ({
      month: data.incomeExpense.labels[index],
      value
    }))
  }
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
  const yearTransactions = transactions.filter(t => {
    const transactionYear = new Date(t.date).getFullYear()
    return transactionYear === year
  })
  
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
  const monthTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.date)
    return transactionDate.getFullYear() === year && 
           transactionDate.getMonth() + 1 === month
  })
  
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
  const weekTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.date)
    const transactionWeek = getWeekNumber(transactionDate)
    return transactionDate.getFullYear() === year && transactionWeek === week
  })
  
  return calculateSummaryFromTransactions(weekTransactions, 'week', { year, week })
}

/**
 * 按日度汇总交易数据
 * @param {Array} transactions - 交易记录数组
 * @param {string} date - 日期 (YYYY-MM-DD)
 * @returns {Object} 日度汇总数据
 */
export const calculateDailySummary = (transactions, date) => {
  const dayTransactions = transactions.filter(t => t.date === date)
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

/**
 * 按时间维度过滤交易记录
 * @param {Array} transactions - 交易记录数组
 * @param {string} period - 时间维度
 * @param {Object} params - 查询参数
 * @returns {Array} 过滤后的交易记录
 */
export const filterTransactionsByPeriod = (transactions, period, params = {}) => {
  const { year, month, startDate, endDate } = params
  
  switch (period) {
    case 'year':
      return transactions.filter(t => {
        const transactionYear = new Date(t.date).getFullYear()
        return transactionYear === year
      })
    case 'month':
      return transactions.filter(t => {
        const transactionDate = new Date(t.date)
        return transactionDate.getFullYear() === year && 
               transactionDate.getMonth() + 1 === month
      })
    case 'week':
      return transactions.filter(t => {
        const transactionDate = new Date(t.date)
        const transactionWeek = getWeekNumber(transactionDate)
        return transactionDate.getFullYear() === year && transactionWeek === params.week
      })
    case 'day':
      return transactions.filter(t => t.date === params.date)
    case 'total':
      return transactions
    default:
      return transactions
  }
}

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
 * 调试函数：打印当前数据状态
 */
export const debugAssetsData = () => {
  const transactions = getAllTransactions()
  const currentInfo = getCurrentDateInfo()
  
  console.log('=== 资产数据调试信息 ===')
  console.log('交易记录总数:', transactions.length)
  console.log('当前时间信息:', currentInfo)
  
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
  
  console.log('本年交易记录数:', currentYearTransactions.length)
  console.log('本月交易记录数:', currentMonthTransactions.length)
  
  // 显示交易记录统计
  const inboundTransactions = transactions.filter(t => t.type === 'INBOUND')
  const outboundTransactions = transactions.filter(t => t.type === 'OUTBOUND')
  
  console.log('入库记录数:', inboundTransactions.length)
  console.log('出库记录数:', outboundTransactions.length)
  console.log('总入库金额:', inboundTransactions.reduce((sum, t) => sum + t.amount, 0))
  console.log('总出库金额:', outboundTransactions.reduce((sum, t) => sum + t.amount, 0))
  
  // 显示当前时间范围内的金额统计
  const currentYearInbound = currentYearTransactions.filter(t => t.type === 'INBOUND')
  const currentYearOutbound = currentYearTransactions.filter(t => t.type === 'OUTBOUND')
  
  console.log('本年入库金额:', currentYearInbound.reduce((sum, t) => sum + t.amount, 0))
  console.log('本年出库金额:', currentYearOutbound.reduce((sum, t) => sum + t.amount, 0))
  
  // 测试数据计算
  console.log('=== 数据计算测试 ===')
  console.log('年度数据:', getAssetDataByPeriod('year'))
  console.log('月度数据:', getAssetDataByPeriod('month'))
  console.log('总计数据:', getAssetDataByPeriod('total'))
  
  // 显示最近的几条交易记录
  console.log('最近的交易记录:')
  transactions.slice(-5).forEach(t => {
    console.log(`  ${t.date} ${t.time} ${t.type} ${t.productName} ¥${t.amount}`)
  })
}