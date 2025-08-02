/**
 * Mock数据库配置
 * 用于存储和管理mock数据，模拟真实的数据库操作
 */

// Mock数据库存储键名
const DB_KEYS = {
  DASHBOARD_DATA: 'mock_dashboard_data',
  DASHBOARD_CONFIG: 'mock_dashboard_config',
  LAST_UPDATE: 'mock_last_update'
}

// 默认财务数据（来自API文档）
const DEFAULT_DASHBOARD_DATA = [
  {
    "date": "2025-07-24",
    "total_income": 2400,
    "total_expense": 1800
  },

  {
    "date": "2025-07-25",
    "total_income": 2500,
    "total_expense": 1400
  },
  {
    "date": "2025-07-26",
    "total_income": 2200,
    "total_expense": 1500
  },
  {
    "date": "2025-07-27",
    "total_income": 1900,
    "total_expense": 1100
  },
  {
    "date": "2025-07-28",
    "total_income": 2400,
    "total_expense": 1300
  },
  {
    "date": "2025-07-29",
    "total_income": 2100,
    "total_expense": 1400
  },
  {
    "date": "2025-07-30",
    "total_income": 2200,
    "total_expense": 1600
  },
  {
    "date": "2025-07-31",
    "total_income": 2300,
    "total_expense": 1800
  },
  {
    "date": "2025-08-01",
    "total_income": 1000,
    "total_expense": 100
  }
]

/**
 * 计算利润
 * @param {number} totalIncome - 总收入
 * @param {number} totalExpense - 总支出
 * @returns {number} 净利润
 */
export const calculateNetProfit = (totalIncome, totalExpense) => {
  return totalIncome - totalExpense
}

/**
 * 计算增长率
 * @param {number} currentValue - 当前值
 * @param {number} previousValue - 前一个值
 * @returns {number} 增长率百分比
 */
export const calculateGrowthRate = (currentValue, previousValue) => {
  if (previousValue === 0) return 0
  return ((currentValue - previousValue) / Math.abs(previousValue) * 100).toFixed(1)
}

/**
 * 计算财务增长率分析
 * @param {Array} data - 财务数据数组
 * @returns {Object} 增长率分析结果
 */
export const calculateGrowthAnalysis = (data) => {
  if (!data || data.length < 2) {
    return {
      income_growth_rate: 0,
      expense_growth_rate: 0,
      profit_growth_rate: 0
    }
  }

  const today = new Date().toISOString().split('T')[0]
  const todayData = data.find(item => item.date === today)
  
  // 获取昨天的数据
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toISOString().split('T')[0]
  const yesterdayData = data.find(item => item.date === yesterdayStr)

  // 如果昨天没有数据，增长率显示为0
  if (!yesterdayData) {
    return {
      income_growth_rate: 0,
      expense_growth_rate: 0,
      profit_growth_rate: 0
    }
  }

  // 如果今天没有数据，与昨天比较显示负增长
  if (!todayData) {
    const incomeGrowthRate = calculateGrowthRate(0, yesterdayData.total_income)
    const expenseGrowthRate = calculateGrowthRate(0, yesterdayData.total_expense)
    const yesterdayProfit = calculateNetProfit(yesterdayData.total_income, yesterdayData.total_expense)
    const profitGrowthRate = calculateGrowthRate(0, yesterdayProfit)

    return {
      income_growth_rate: parseFloat(incomeGrowthRate),
      expense_growth_rate: parseFloat(expenseGrowthRate),
      profit_growth_rate: parseFloat(profitGrowthRate)
    }
  }

  // 今天有数据，正常计算增长率
  const incomeGrowthRate = calculateGrowthRate(todayData.total_income, yesterdayData.total_income)
  const expenseGrowthRate = calculateGrowthRate(todayData.total_expense, yesterdayData.total_expense)
  
  // 计算利润值
  const todayProfit = calculateNetProfit(todayData.total_income, todayData.total_expense)
  const yesterdayProfit = calculateNetProfit(yesterdayData.total_income, yesterdayData.total_expense)
  const profitGrowthRate = calculateGrowthRate(todayProfit, yesterdayProfit)

  return {
    income_growth_rate: parseFloat(incomeGrowthRate),
    expense_growth_rate: parseFloat(expenseGrowthRate),
    profit_growth_rate: parseFloat(profitGrowthRate)
  }
}

/**
 * 重新计算所有数据的利润
 * @param {Array} data - 财务数据数组
 * @returns {Array} 重新计算后的数据
 */
export const recalculateAllProfits = (data) => {
  return data.map(item => ({
    ...item,
    net_profit: calculateNetProfit(item.total_income, item.total_expense)
  }))
}

/**
 * 获取dashboard数据
 * 如果数据不存在，则使用默认数据
 */
export const getDashboardData = () => {
  const storedData = localStorage.getItem(DB_KEYS.DASHBOARD_DATA)
  
  if (!storedData) {
    // 如果没有存储的数据，使用默认数据
    localStorage.setItem(DB_KEYS.DASHBOARD_DATA, JSON.stringify(DEFAULT_DASHBOARD_DATA))
    localStorage.setItem(DB_KEYS.LAST_UPDATE, new Date().toISOString().split('T')[0])
    return DEFAULT_DASHBOARD_DATA
  }
  
  try {
    const data = JSON.parse(storedData)
    // 确保所有数据的利润都是正确计算的
    return recalculateAllProfits(data)
  } catch (error) {
    console.warn('解析存储的dashboard数据失败，使用默认数据:', error)
    localStorage.setItem(DB_KEYS.DASHBOARD_DATA, JSON.stringify(DEFAULT_DASHBOARD_DATA))
    localStorage.setItem(DB_KEYS.LAST_UPDATE, new Date().toISOString().split('T')[0])
    return DEFAULT_DASHBOARD_DATA
  }
}

/**
 * 更新特定日期的财务数据
 * @param {string} date - 日期字符串 (YYYY-MM-DD)
 * @param {Object} data - 财务数据
 */
export const updateDashboardData = (date, data) => {
  const currentData = getDashboardData()
  const index = currentData.findIndex(item => item.date === date)
  
  if (index !== -1) {
    // 更新现有数据
    const updatedItem = {
      ...currentData[index],
      ...data
    }
    // 确保net_profit是计算得出的
    updatedItem.net_profit = calculateNetProfit(
      updatedItem.total_income,
      updatedItem.total_expense
    )
    currentData[index] = updatedItem
  } else {
    // 添加新数据
    const newItem = {
      date,
      total_income: data.total_income || 0,
      total_expense: data.total_expense || 0,
      net_profit: calculateNetProfit(data.total_income || 0, data.total_expense || 0)
    }
    currentData.push(newItem)
  }
  
  // 按日期排序
  currentData.sort((a, b) => new Date(a.date) - new Date(b.date))
  
  localStorage.setItem(DB_KEYS.DASHBOARD_DATA, JSON.stringify(currentData))
  localStorage.setItem(DB_KEYS.LAST_UPDATE, new Date().toISOString().split('T')[0])
  return currentData
}

/**
 * 获取特定日期的财务数据
 * @param {string} date - 日期字符串 (YYYY-MM-DD)
 */
export const getDashboardDataByDate = (date) => {
  const data = getDashboardData()
  return data.find(item => item.date === date) || null
}

/**
 * 获取今日财务数据
 */
export const getTodayDashboardData = () => {
  const today = new Date().toISOString().split('T')[0]
  const todayData = getDashboardDataByDate(today)
  
  // 只返回当前日期的数据，如果没有则返回null
  return todayData
}

/**
 * 获取最近7天的财务数据
 */
export const getRecentWeekData = () => {
  return getDashboardData()
}

/**
 * 计算汇总数据
 * @param {Array} data - 财务数据数组
 */
export const calculateSummary = (data) => {
  const weekTotalIncome = data.reduce((sum, item) => sum + item.total_income, 0)
  const weekTotalExpense = data.reduce((sum, item) => sum + item.total_expense, 0)
  const weekNetProfit = calculateNetProfit(weekTotalIncome, weekTotalExpense)
  
  return {
    week_total_income: weekTotalIncome,
    week_total_expense: weekTotalExpense,
    week_net_profit: weekNetProfit,
    avg_daily_income: Math.round(weekTotalIncome / data.length),
    avg_daily_expense: Math.round(weekTotalExpense / data.length),
    avg_daily_profit: Math.round(weekNetProfit / data.length)
  }
}

/**
 * 生成图表数据
 * @param {Array} data - 财务数据数组
 */
export const generateChartData = (data) => {
  const today = new Date().toISOString().split('T')[0]
  
  // 创建包含今天在内的7天数据
  const chartData = []
  const endDate = new Date(today)
  const startDate = new Date(endDate)
  startDate.setDate(endDate.getDate() - 6) // 获取最近7天
  
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0]
    const existingData = data.find(item => item.date === dateStr)
    
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    
    chartData.push({
      day: `${month}.${day}`,
      income: existingData ? existingData.total_income : 0,
      expense: existingData ? existingData.total_expense : 0
    })
  }
  
  return chartData
}

/**
 * 刷新数据
 * 重新计算所有数据的利润并更新存储
 */
export const refreshDashboardData = () => {
  const currentData = getDashboardData()
  const recalculatedData = recalculateAllProfits(currentData)
  
  localStorage.setItem(DB_KEYS.DASHBOARD_DATA, JSON.stringify(recalculatedData))
  localStorage.setItem(DB_KEYS.LAST_UPDATE, new Date().toISOString().split('T')[0])
  
  return recalculatedData
}

/**
 * 重置dashboard数据
 * 清除所有存储的数据，下次获取时会使用默认数据
 */
export const resetDashboardData = () => {
  localStorage.removeItem(DB_KEYS.DASHBOARD_DATA)
  localStorage.removeItem(DB_KEYS.LAST_UPDATE)
}

/**
 * 获取数据库配置信息
 */
export const getDatabaseConfig = () => {
  return {
    lastUpdate: localStorage.getItem(DB_KEYS.LAST_UPDATE),
    dataCount: getDashboardData().length,
    isInitialized: !!localStorage.getItem(DB_KEYS.DASHBOARD_DATA)
  }
}

/**
 * 调试函数：打印当前数据状态
 */
export const debugDashboardData = () => {
  const data = getDashboardData()
  const todayData = getTodayDashboardData()
  const config = getDatabaseConfig()
  const growthAnalysis = calculateGrowthAnalysis(data)
  
  console.log('=== Dashboard数据调试信息 ===')
  console.log('数据库配置:', config)
  console.log('所有数据:', data)
  console.log('今日数据:', todayData)
  console.log('增长率分析:', growthAnalysis)
  console.log('数据条数:', data.length)
  console.log('当前日期:', new Date().toISOString().split('T')[0])
  
  // 添加详细的增长率分析
  const today = new Date().toISOString().split('T')[0]
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toISOString().split('T')[0]
  
  const todayDataDebug = data.find(item => item.date === today)
  const yesterdayDataDebug = data.find(item => item.date === yesterdayStr)
  
  console.log('=== 增长率分析详情 ===')
  console.log('今天日期:', today)
  console.log('昨天日期:', yesterdayStr)
  console.log('今天数据:', todayDataDebug)
  console.log('昨天数据:', yesterdayDataDebug)
  
  if (todayDataDebug && yesterdayDataDebug) {
    console.log('收入增长率计算:', `(${todayDataDebug.total_income}-${yesterdayDataDebug.total_income})/${yesterdayDataDebug.total_income}*100`)
    console.log('支出增长率计算:', `(${todayDataDebug.total_expense}-${yesterdayDataDebug.total_expense})/${yesterdayDataDebug.total_expense}*100`)
    
    const todayProfit = calculateNetProfit(todayDataDebug.total_income, todayDataDebug.total_expense)
    const yesterdayProfit = calculateNetProfit(yesterdayDataDebug.total_income, yesterdayDataDebug.total_expense)
    console.log('利润增长率计算:', `(${todayProfit}-${yesterdayProfit})/${yesterdayProfit}*100`)
  } else if (yesterdayDataDebug && !todayDataDebug) {
    console.log('今天没有数据，与昨天比较显示负增长:')
    console.log('收入增长率计算:', `(0-${yesterdayDataDebug.total_income})/${yesterdayDataDebug.total_income}*100`)
    console.log('支出增长率计算:', `(0-${yesterdayDataDebug.total_expense})/${yesterdayDataDebug.total_expense}*100`)
    
    const yesterdayProfit = calculateNetProfit(yesterdayDataDebug.total_income, yesterdayDataDebug.total_expense)
    console.log('利润增长率计算:', `(0-${yesterdayProfit})/${yesterdayProfit}*100`)
  }
  
  return {
    config,
    data,
    todayData,
    growthAnalysis
  }
}

