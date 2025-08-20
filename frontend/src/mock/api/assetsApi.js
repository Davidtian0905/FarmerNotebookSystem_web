/**
 * Mock资产汇总API接口
 * 模拟后端API，提供资产汇总数据
 */

// 导入数据库操作函数
import { getAllTransactions } from '../database_flow.js'
import { 
  getHistoricalSummary, 
  generateMonthlyData,
  generateDailyDataForMonth,
  generateWeeklyDataForWeek,
  generateYearlyDataForApi,
  getIncomeStructure, 
  getCostStructure, 
  getAssetStatistics 
} from '../database_assets.js'
// 导入工具函数
import { 
  getWeekNumber,
  createLogger,
  createSuccessResponse, 
  createErrorResponse, 
  createMockSuccessResponse,
  createMockErrorResponse,
  ERROR_CODES 
} from '../utils/index.js'

const logger = createLogger('ASSETS_API')

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
      const { period = 'year', year, month, startDate, endDate, currentDayOfWeek, currentDate } = params
      
      // 参数验证和默认值设置
      const currentYear = new Date().getFullYear()
      const validatedParams = {
        period,
        year: year || currentYear,
        month: month || new Date().getMonth() + 1,
        startDate,
        endDate,
        currentDayOfWeek,
        currentDate
      }
      
      // 参数验证
      if (!validatedParams.year && period !== 'total') {
        return createErrorResponse(
          ERROR_CODES.BAD_REQUEST,
          '缺少必要参数：year'
        )
      }
      
      // 获取交易数据
      const transactions = getAllTransactions()
      
      // 检查localStorage状态
      const storedData = localStorage.getItem('mock_transactions_data')
      if (storedData) {
        try {
          JSON.parse(storedData)
        } catch (e) {
          logger.error('localStorage数据解析失败:', e)
        }
      }
      
      // 计算汇总数据
      const summary = getHistoricalSummary(transactions, period, validatedParams)
      
      // 根据不同时间维度生成相应的数据
      let monthlyData = []
      let yearlyData = []
      let dailyData = []
      let weeklyData = []
      
      if (period === 'year') {
        // 年度查询：生成月度数据
        monthlyData = generateMonthlyData(transactions, validatedParams.year)
      } else if (period === 'month') {
        // 月度查询：生成日度数据
        dailyData = generateDailyDataForMonth(transactions, validatedParams.year, validatedParams.month)
      } else if (period === 'week') {
        // 周度查询：生成周内各天的数据
        // 如果没有指定周数，使用当前周
        const currentWeek = validatedParams.week || getWeekNumber(new Date())
        weeklyData = generateWeeklyDataForWeek(transactions, validatedParams.year, currentWeek, validatedParams.currentDayOfWeek)
      } else if (period === 'total') {
        // 总览查询：生成年度数据
        yearlyData = generateYearlyDataForApi(transactions)
      }
      
      return createSuccessResponse({
        summary,
        monthlyData,
        yearlyData,
        dailyData,
        weeklyData,
        period,
        year: validatedParams.year,
        month: validatedParams.month
      }, '获取成功')
      
    } catch (error) {
      logger.error('获取资产汇总数据失败:', error)
      return createErrorResponse(
        ERROR_CODES.INTERNAL_SERVER_ERROR,
        '系统异常：获取资产汇总数据失败'
      )
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
      
      return createSuccessResponse(trendData, '获取趋势数据成功')
    } catch (error) {
      logger.error('获取资产趋势数据失败:', error)
      return createErrorResponse(
        ERROR_CODES.INTERNAL_SERVER_ERROR,
        '系统异常：获取资产趋势数据失败'
      )
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
      
      return createSuccessResponse(trendData, '获取收支趋势数据成功')
    } catch (error) {
      logger.error('获取收支趋势数据失败:', error)
      return createErrorResponse(
        ERROR_CODES.INTERNAL_SERVER_ERROR,
        '系统异常：获取收支趋势数据失败'
      )
    }
  },

  /**
   * 获取收入结构分析
   * @param {Object} params - 查询参数
   * @returns {Object} 标准API响应格式
   */
  getIncomeStructure(params = {}) {
    try {
      const { period = 'year', year } = params
      
      // 获取交易数据
      const transactions = getAllTransactions()
      
      // 生成收入结构数据
      const structureData = getIncomeStructure(params)
      
      return createSuccessResponse(structureData, '获取收入结构数据成功')
    } catch (error) {
      logger.error('获取收入结构数据失败:', error)
      return createErrorResponse(
        ERROR_CODES.INTERNAL_SERVER_ERROR,
        '系统异常：获取收入结构数据失败'
      )
    }
  },

  /**
   * 获取成本结构分析
   * @param {Object} params - 查询参数
   * @returns {Object} 标准API响应格式
   */
  getCostStructure(params = {}) {
    try {
      const { period = 'year', year } = params
      
      // 获取交易数据
      const transactions = getAllTransactions()
      
      // 生成成本结构数据
      const structureData = getCostStructure(params)
      
      return createSuccessResponse(structureData, '获取成本结构数据成功')
    } catch (error) {
      logger.error('获取成本结构数据失败:', error)
      return createErrorResponse(
        ERROR_CODES.INTERNAL_SERVER_ERROR,
        '系统异常：获取成本结构数据失败'
      )
    }
  },

  /**
   * 获取资产统计数据
   * @param {Object} params - 查询参数
   * @returns {Object} 标准API响应格式
   */
  getAssetStatistics(params = {}) {
    try {
      const { period = 'year', year } = params
      
      // 获取交易数据
      const transactions = getAllTransactions()
      
      // 生成资产统计数据
      const statisticsData = getAssetStatistics(params)
      
      return createSuccessResponse(statisticsData, '获取资产统计数据成功')
    } catch (error) {
      logger.error('获取资产统计数据失败:', error)
      return createErrorResponse(
        ERROR_CODES.INTERNAL_SERVER_ERROR,
        '系统异常：获取资产统计数据失败'
      )
    }
  },

}

// 以下是辅助函数，用于生成各种数据

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

// 以上函数已从 database_flow.js 导入，无需重复定义