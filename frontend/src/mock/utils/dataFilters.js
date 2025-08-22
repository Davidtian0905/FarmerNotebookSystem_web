/**
 * 数据过滤工具函数
 */
import { parseTimeDimensions } from './dateUtils.js'

/**
 * 按年份过滤交易记录
 * @param {Array} transactions - 交易记录数组
 * @param {number} year - 年份
 * @returns {Array} 过滤后的交易记录
 */
export const filterTransactionsByYear = (transactions, year) => {
  return transactions.filter(t => {
    const transactionDate = new Date(t.date)
    return transactionDate.getFullYear() === year
  })
}

/**
 * 按月份过滤交易记录
 * @param {Array} transactions - 交易记录数组
 * @param {number} year - 年份
 * @param {number} month - 月份
 * @returns {Array} 过滤后的交易记录
 */
export const filterTransactionsByMonth = (transactions, year, month) => {
  return transactions.filter(t => {
    const transactionDate = new Date(t.date)
    return transactionDate.getFullYear() === year && 
           transactionDate.getMonth() + 1 === month
  })
}

/**
 * 按日期过滤交易记录
 * @param {Array} transactions - 交易记录数组
 * @param {number} year - 年份
 * @param {number} month - 月份
 * @param {number} day - 日期
 * @returns {Array} 过滤后的交易记录
 */
export const filterTransactionsByDay = (transactions, year, month, day) => {
  return transactions.filter(t => {
    const transactionDate = new Date(t.date)
    return transactionDate.getFullYear() === year && 
           transactionDate.getMonth() + 1 === month &&
           transactionDate.getDate() === day
  })
}

/**
 * 按交易类型过滤
 * @param {Array} transactions - 交易记录数组
 * @param {string} type - 交易类型 ('INBOUND' | 'OUTBOUND')
 * @returns {Array} 过滤后的交易记录
 */
export const filterTransactionsByType = (transactions, type) => {
  return transactions.filter(t => t.type === type)
}

/**
 * 按时间范围过滤交易记录
 * @param {Array} transactions - 交易记录数组
 * @param {Date} startDate - 开始日期
 * @param {Date} endDate - 结束日期
 * @returns {Array} 过滤后的交易记录
 */
export const filterTransactionsByDateRange = (transactions, startDate, endDate) => {
  return transactions.filter(t => {
    const transactionDate = new Date(t.date)
    return transactionDate >= startDate && transactionDate <= endDate
  })
}

/**
 * 按周过滤交易记录
 * @param {Array} transactions - 交易记录数组
 * @param {number} year - 年份
 * @param {number} week - 周数
 * @param {number} dayOfWeek - 星期几 (1-7, 1为周一)
 * @returns {Array} 过滤后的交易记录
 */
export const filterTransactionsByWeek = (transactions, year, week, dayOfWeek = null) => {
  console.log('[DEBUG] filterTransactionsByWeek - 开始过滤:', {
    totalTransactions: transactions.length,
    targetYear: year,
    targetWeek: week,
    targetDayOfWeek: dayOfWeek
  })
  
  const filtered = transactions.filter(t => {
    const transactionDate = new Date(t.date)
    const dimensions = parseTimeDimensions(t.date)
    
    console.log('[DEBUG] filterTransactionsByWeek - 检查交易:', {
      transactionId: t.id,
      transactionDate: t.date,
      parsedDimensions: dimensions,
      yearMatch: dimensions.year === year,
      weekMatch: dimensions.week === week
    })
    
    if (dimensions.year !== year || dimensions.week !== week) {
      console.log('[DEBUG] filterTransactionsByWeek - 年份或周数不匹配，过滤掉')
      return false
    }
    
    if (dayOfWeek !== null) {
      const adjustedDayOfWeek = dimensions.dayOfWeek === 0 ? 7 : dimensions.dayOfWeek
      const dayMatch = adjustedDayOfWeek === dayOfWeek
      console.log('[DEBUG] filterTransactionsByWeek - 检查星期:', {
        originalDayOfWeek: dimensions.dayOfWeek,
        adjustedDayOfWeek,
        targetDayOfWeek: dayOfWeek,
        dayMatch
      })
      return dayMatch
    }
    
    console.log('[DEBUG] filterTransactionsByWeek - 交易通过过滤')
    return true
  })
  
  console.log('[DEBUG] filterTransactionsByWeek - 过滤结果:', {
    originalCount: transactions.length,
    filteredCount: filtered.length,
    filteredTransactions: filtered.map(t => ({ id: t.id, date: t.date, amount: t.amount, type: t.type }))
  })
  
  return filtered
}

/**
 * 按时间维度过滤交易记录的通用函数
 * @param {Array} transactions - 交易记录数组
 * @param {string} period - 时间维度 ('year' | 'month' | 'day' | 'week')
 * @param {Object} params - 参数对象
 * @returns {Array} 过滤后的交易记录
 */
export const filterTransactionsByPeriod = (transactions, period, params = {}) => {
  const { year, month, day, week, dayOfWeek } = params
  
  switch (period) {
    case 'year':
      return filterTransactionsByYear(transactions, year)
      
    case 'month':
      return filterTransactionsByMonth(transactions, year, month)
      
    case 'day':
      return filterTransactionsByDay(transactions, year, month, day)
      
    case 'week':
      return filterTransactionsByWeek(transactions, year, week, dayOfWeek)
      
    default:
      return transactions
  }
}

/**
 * 获取收入交易记录
 * @param {Array} transactions - 交易记录数组
 * @returns {Array} 收入交易记录
 */
export const getIncomeTransactions = (transactions) => {
  return filterTransactionsByType(transactions, 'OUTBOUND')  // OUTBOUND = 出库/销售 = 收入
}

/**
 * 获取支出交易记录
 * @param {Array} transactions - 交易记录数组
 * @returns {Array} 支出交易记录
 */
export const getExpenseTransactions = (transactions) => {
  return filterTransactionsByType(transactions, 'INBOUND')   // INBOUND = 入库/采购 = 支出
}