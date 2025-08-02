/**
 * Mock资产汇总API接口
 * 模拟后端API，提供资产汇总数据
 */

import { getAllTransactions } from '../database_flow.js'
import { getHistoricalSummary, generateMonthlyData } from '../database_assets.js'

/**
 * Mock资产汇总API
 */
export const mockAssetsApi = {
  /**
   * 获取资产汇总数据
   * @param {Object} params - 查询参数
   * @param {string} params.period - 时间维度 ('year', 'month', 'week', 'day', 'total')
   * @param {number} params.year - 指定年份
   * @param {number} params.month - 指定月份（可选）
   * @param {string} params.startDate - 开始日期（可选）
   * @param {string} params.endDate - 结束日期（可选）
   * @returns {Object} 标准API响应格式
   */
  getSummary(params = {}) {
    try {
      console.log('=== mockAssetsApi.getSummary 调试信息 ===')
      console.log('接收到的参数:', params)
      
      const { period = 'year', year, month, startDate, endDate } = params
      
      // 参数验证和默认值设置
      const currentYear = new Date().getFullYear()
      const validatedParams = {
        period,
        year: year || currentYear,
        month: month || new Date().getMonth() + 1,
        startDate,
        endDate
      }
      
      console.log('验证后的参数:', validatedParams)
      
      // 参数验证
      if (!validatedParams.year && period !== 'total') {
        console.warn('缺少必要参数：year')
        return {
          error: 400,
          body: null,
          message: '缺少必要参数：year'
        }
      }
      
      // 获取交易数据
      const transactions = getAllTransactions()
      console.log('获取到的交易数据数量:', transactions.length)
      
      // 计算汇总数据
      const summary = getHistoricalSummary(transactions, period, validatedParams)
      console.log('计算得到的汇总数据:', summary)
      
      // 根据不同时间维度生成相应的数据
      let monthlyData = []
      let yearlyData = []
      let dailyData = []
      let weeklyData = []
      
      if (period === 'year') {
        // 年度查询：生成月度数据
        monthlyData = generateMonthlyData(transactions, validatedParams.year)
        console.log('生成的月度数据数量:', monthlyData.length)
      } else if (period === 'month') {
        // 月度查询：生成日度数据
        dailyData = generateDailyDataForMonth(transactions, validatedParams.year, validatedParams.month)
        console.log('生成的日度数据数量:', dailyData.length)
      } else if (period === 'week') {
        // 周度查询：生成周内各天的数据
        weeklyData = generateWeeklyDataForWeek(transactions, validatedParams.year, validatedParams.week)
        console.log('生成的周度数据数量:', weeklyData.length)
      } else if (period === 'total') {
        // 总计查询：生成年度数据
        yearlyData = generateYearlyDataForApi(transactions)
        console.log('生成的年度数据数量:', yearlyData.length)
      }
      
      const response = {
        error: 0,
        body: {
          period,
          year: validatedParams.year,
          month: validatedParams.month,
          week: validatedParams.week,
          summary,
          monthlyData,
          yearlyData,
          dailyData,
          weeklyData
        },
        message: '获取成功'
      }
      
      console.log('返回的响应数据:', response)
      return response
    } catch (error) {
      console.error('获取资产汇总数据失败:', error)
      return {
        error: 500,
        body: null,
        message: '系统异常：获取资产汇总数据失败'
      }
    }
  },

  /**
   * 获取资产趋势数据
   * @param {Object} params - 查询参数
   * @returns {Object} 标准API响应格式
   */
  getTrend(params = {}) {
    try {
      const { period = 'year', year } = params
      
      // 获取交易数据
      const transactions = getAllTransactions()
      
      // 生成趋势数据
      const trendData = generateTrendData(transactions, period, params)
      
      return {
        error: 0,
        body: trendData,
        message: ''
      }
    } catch (error) {
      console.error('获取资产趋势数据失败:', error)
      return {
        error: 500,
        body: null,
        message: '系统异常：获取资产趋势数据失败'
      }
    }
  },

  /**
   * 获取收支趋势数据
   * @param {Object} params - 查询参数
   * @returns {Object} 标准API响应格式
   */
  getIncomeExpenseTrend(params = {}) {
    try {
      const { period = 'year', year } = params
      
      // 获取交易数据
      const transactions = getAllTransactions()
      
      // 生成收支趋势数据
      const trendData = generateIncomeExpenseTrend(transactions, period, params)
      
      return {
        error: 0,
        body: trendData,
        message: ''
      }
    } catch (error) {
      console.error('获取收支趋势数据失败:', error)
      return {
        error: 500,
        body: null,
        message: '系统异常：获取收支趋势数据失败'
      }
    }
  }
}

/**
 * 生成趋势数据
 * @param {Array} transactions - 交易记录
 * @param {string} period - 时间维度
 * @param {Object} params - 查询参数
 * @returns {Object} 趋势数据
 */
const generateTrendData = (transactions, period, params) => {
  const { year } = params
  
  switch (period) {
    case 'year':
      return generateYearlyTrend(transactions, year)
    case 'month':
      return generateMonthlyTrend(transactions, params)
    case 'week':
      return generateWeeklyTrend(transactions, params)
    default:
      return { labels: [], datasets: [] }
  }
}

/**
 * 生成年度趋势数据
 * @param {Array} transactions - 交易记录
 * @param {number} year - 年份
 * @returns {Object} 年度趋势数据
 */
const generateYearlyTrend = (transactions, year) => {
  const labels = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
  const data = []
  
  for (let month = 1; month <= 12; month++) {
    const monthTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date)
      return transactionDate.getFullYear() === year && 
             transactionDate.getMonth() + 1 === month
    })
    
    const income = monthTransactions.filter(t => t.type === 'OUTBOUND')
      .reduce((sum, t) => sum + t.amount, 0)
    const expense = monthTransactions.filter(t => t.type === 'INBOUND')
      .reduce((sum, t) => sum + t.amount, 0)
    
    data.push(income - expense) // 净资产
  }
  
  return {
    labels,
    datasets: [{
      label: '净资产',
      data,
      borderColor: '#10B981',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      tension: 0.4,
      fill: true
    }]
  }
}

/**
 * 生成月度趋势数据
 * @param {Array} transactions - 交易记录
 * @param {Object} params - 查询参数
 * @returns {Object} 月度趋势数据
 */
const generateMonthlyTrend = (transactions, params) => {
  const { year, month } = params
  const daysInMonth = new Date(year, month, 0).getDate()
  const labels = Array.from({length: daysInMonth}, (_, i) => `${i + 1}日`)
  const data = []
  
  for (let day = 1; day <= daysInMonth; day++) {
    const dayTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date)
      return transactionDate.getFullYear() === year && 
             transactionDate.getMonth() + 1 === month &&
             transactionDate.getDate() === day
    })
    
    const income = dayTransactions.filter(t => t.type === 'OUTBOUND')
      .reduce((sum, t) => sum + t.amount, 0)
    const expense = dayTransactions.filter(t => t.type === 'INBOUND')
      .reduce((sum, t) => sum + t.amount, 0)
    
    data.push(income - expense) // 净资产
  }
  
  return {
    labels,
    datasets: [{
      label: '净资产',
      data,
      borderColor: '#10B981',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      tension: 0.4,
      fill: true
    }]
  }
}

/**
 * 生成周度趋势数据
 * @param {Array} transactions - 交易记录
 * @param {Object} params - 查询参数
 * @returns {Object} 周度趋势数据
 */
const generateWeeklyTrend = (transactions, params) => {
  const weekLabels = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  const data = []
  
  for (let dayOfWeek = 1; dayOfWeek <= 7; dayOfWeek++) {
    const dayTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date)
      const transactionDayOfWeek = transactionDate.getDay()
      const adjustedDayOfWeek = transactionDayOfWeek === 0 ? 7 : transactionDayOfWeek
      return adjustedDayOfWeek === dayOfWeek
    })
    
    const income = dayTransactions.filter(t => t.type === 'OUTBOUND')
      .reduce((sum, t) => sum + t.amount, 0)
    const expense = dayTransactions.filter(t => t.type === 'INBOUND')
      .reduce((sum, t) => sum + t.amount, 0)
    
    data.push(income - expense) // 净资产
  }
  
  return {
    labels: weekLabels,
    datasets: [{
      label: '净资产',
      data,
      borderColor: '#10B981',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      tension: 0.4,
      fill: true
    }]
  }
}

/**
 * 生成收支趋势数据
 * @param {Array} transactions - 交易记录
 * @param {string} period - 时间维度
 * @param {Object} params - 查询参数
 * @returns {Object} 收支趋势数据
 */
const generateIncomeExpenseTrend = (transactions, period, params) => {
  const { year } = params
  
  switch (period) {
    case 'year':
      return generateYearlyIncomeExpenseTrend(transactions, year)
    case 'month':
      return generateMonthlyIncomeExpenseTrend(transactions, params)
    case 'week':
      return generateWeeklyIncomeExpenseTrend(transactions, params)
    default:
      return { labels: [], datasets: [] }
  }
}

/**
 * 生成年度收支趋势数据
 * @param {Array} transactions - 交易记录
 * @param {number} year - 年份
 * @returns {Object} 年度收支趋势数据
 */
const generateYearlyIncomeExpenseTrend = (transactions, year) => {
  const labels = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
  const incomeData = []
  const expenseData = []
  
  for (let month = 1; month <= 12; month++) {
    const monthTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date)
      return transactionDate.getFullYear() === year && 
             transactionDate.getMonth() + 1 === month
    })
    
    const income = monthTransactions.filter(t => t.type === 'OUTBOUND')
      .reduce((sum, t) => sum + t.amount, 0)
    const expense = monthTransactions.filter(t => t.type === 'INBOUND')
      .reduce((sum, t) => sum + t.amount, 0)
    
    incomeData.push(income)
    expenseData.push(expense)
  }
  
  return {
    labels,
    datasets: [
      {
        label: '收入',
        data: incomeData,
        backgroundColor: '#10B981'
      },
      {
        label: '支出',
        data: expenseData,
        backgroundColor: '#EF4444'
      }
    ]
  }
}

/**
 * 生成月度收支趋势数据
 * @param {Array} transactions - 交易记录
 * @param {Object} params - 查询参数
 * @returns {Object} 月度收支趋势数据
 */
const generateMonthlyIncomeExpenseTrend = (transactions, params) => {
  const { year, month } = params
  const daysInMonth = new Date(year, month, 0).getDate()
  const labels = Array.from({length: daysInMonth}, (_, i) => `${i + 1}日`)
  const incomeData = []
  const expenseData = []
  
  for (let day = 1; day <= daysInMonth; day++) {
    const dayTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date)
      return transactionDate.getFullYear() === year && 
             transactionDate.getMonth() + 1 === month &&
             transactionDate.getDate() === day
    })
    
    const income = dayTransactions.filter(t => t.type === 'OUTBOUND')
      .reduce((sum, t) => sum + t.amount, 0)
    const expense = dayTransactions.filter(t => t.type === 'INBOUND')
      .reduce((sum, t) => sum + t.amount, 0)
    
    incomeData.push(income)
    expenseData.push(expense)
  }
  
  return {
    labels,
    datasets: [
      {
        label: '收入',
        data: incomeData,
        backgroundColor: '#10B981'
      },
      {
        label: '支出',
        data: expenseData,
        backgroundColor: '#EF4444'
      }
    ]
  }
}

/**
 * 生成周度收支趋势数据
 * @param {Array} transactions - 交易记录
 * @param {Object} params - 查询参数
 * @returns {Object} 周度收支趋势数据
 */
const generateWeeklyIncomeExpenseTrend = (transactions, params) => {
  const weekLabels = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  const incomeData = []
  const expenseData = []
  
  for (let dayOfWeek = 1; dayOfWeek <= 7; dayOfWeek++) {
    const dayTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date)
      const transactionDayOfWeek = transactionDate.getDay()
      const adjustedDayOfWeek = transactionDayOfWeek === 0 ? 7 : transactionDayOfWeek
      return adjustedDayOfWeek === dayOfWeek
    })
    
    const income = dayTransactions.filter(t => t.type === 'OUTBOUND')
      .reduce((sum, t) => sum + t.amount, 0)
    const expense = dayTransactions.filter(t => t.type === 'INBOUND')
      .reduce((sum, t) => sum + t.amount, 0)
    
    incomeData.push(income)
    expenseData.push(expense)
  }
  
  return {
    labels: weekLabels,
    datasets: [
      {
        label: '收入',
        data: incomeData,
        backgroundColor: '#10B981'
      },
      {
        label: '支出',
        data: expenseData,
        backgroundColor: '#EF4444'
      }
    ]
  }
}

/**
 * 生成年度数据（用于API返回）
 * @param {Array} transactions - 交易记录
 * @returns {Array} 年度数据数组
 */
const generateYearlyDataForApi = (transactions) => {
  // 获取年份范围
  const getYearRange = (transactions) => {
    if (transactions.length === 0) {
      const currentYear = new Date().getFullYear()
      return { minYear: currentYear, maxYear: currentYear }
    }
    
    const years = transactions.map(t => new Date(t.date).getFullYear())
    return {
      minYear: Math.min(...years),
      maxYear: Math.max(...years)
    }
  }
  
  const { minYear, maxYear } = getYearRange(transactions)
  const yearlyData = []
  
  // 遍历所有年份，包括缺失的年份
  for (let year = minYear; year <= maxYear; year++) {
    const yearTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date)
      return transactionDate.getFullYear() === year
    })
    
    // 计算该年的收入和支出
    const income = yearTransactions.filter(t => t.type === 'OUTBOUND')
      .reduce((sum, t) => sum + t.amount, 0)
    const expense = yearTransactions.filter(t => t.type === 'INBOUND')
      .reduce((sum, t) => sum + t.amount, 0)
    const netAssets = income - expense
    
    yearlyData.push({
      year,
      income,
      expense,
      netAssets
    })
  }
  
  return yearlyData
}

/**
 * 生成月度的日度数据（用于API返回）
 * @param {Array} transactions - 交易记录
 * @param {number} year - 年份
 * @param {number} month - 月份
 * @returns {Array} 日度数据数组
 */
const generateDailyDataForMonth = (transactions, year, month) => {
  const daysInMonth = new Date(year, month, 0).getDate()
  const dailyData = []
  
  for (let day = 1; day <= daysInMonth; day++) {
    const dayTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date)
      return transactionDate.getFullYear() === year && 
             transactionDate.getMonth() + 1 === month &&
             transactionDate.getDate() === day
    })
    
    // 计算该日的收入和支出
    const income = dayTransactions.filter(t => t.type === 'OUTBOUND')
      .reduce((sum, t) => sum + t.amount, 0)
    const expense = dayTransactions.filter(t => t.type === 'INBOUND')
      .reduce((sum, t) => sum + t.amount, 0)
    const netAssets = income - expense
    
    dailyData.push({
      day,
      date: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
      income,
      expense,
      netAssets,
      transactionCount: dayTransactions.length
    })
  }
  
  return dailyData
}

/**
 * 生成周度数据（用于API返回）
 * @param {Array} transactions - 交易记录
 * @param {number} year - 年份
 * @param {number} week - 周数
 * @returns {Array} 周度数据数组
 */
const generateWeeklyDataForWeek = (transactions, year, week) => {
  const weekLabels = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  const weeklyData = []
  
  for (let dayOfWeek = 1; dayOfWeek <= 7; dayOfWeek++) {
    const dayTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date)
      const transactionDayOfWeek = transactionDate.getDay()
      const adjustedDayOfWeek = transactionDayOfWeek === 0 ? 7 : transactionDayOfWeek
      
      // 如果指定了年份和周数，还需要检查是否在指定的周内
      if (year && week) {
        const transactionWeek = getWeekNumber(transactionDate)
        return transactionDate.getFullYear() === year && 
               transactionWeek === week && 
               adjustedDayOfWeek === dayOfWeek
      }
      
      return adjustedDayOfWeek === dayOfWeek
    })
    
    // 计算该天的收入和支出
    const income = dayTransactions.filter(t => t.type === 'OUTBOUND')
      .reduce((sum, t) => sum + t.amount, 0)
    const expense = dayTransactions.filter(t => t.type === 'INBOUND')
      .reduce((sum, t) => sum + t.amount, 0)
    const netAssets = income - expense
    
    weeklyData.push({
      dayOfWeek,
      dayLabel: weekLabels[dayOfWeek - 1],
      income,
      expense,
      netAssets,
      transactionCount: dayTransactions.length
    })
  }
  
  return weeklyData
}

/**
 * 获取日期的周数
 * @param {Date} date - 日期对象
 * @returns {number} 周数
 */
const getWeekNumber = (date) => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
}