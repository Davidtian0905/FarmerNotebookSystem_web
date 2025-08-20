/**
 * 日期处理工具函数
 */

/**
 * 获取当前日期信息
 * @returns {Object} 包含年、月、日、星期等信息的对象
 */
export const getCurrentDateInfo = () => {
  const now = new Date()
  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    day: now.getDate(),
    dayOfWeek: now.getDay(),
    timestamp: now.getTime()
  }
}

/**
 * 获取周数
 * @param {Date} date - 日期对象
 * @returns {number} 周数
 */
export const getWeekNumber = (date) => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  const weekNum = Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
  
  console.log('[DEBUG] getWeekNumber - 计算周数:', {
    inputDate: date.toISOString(),
    utcDate: d.toISOString(),
    dayNum,
    yearStart: yearStart.toISOString(),
    daysDiff: (d - yearStart) / 86400000,
    calculatedWeek: weekNum
  })
  
  return weekNum
}

/**
 * 解析时间维度
 * @param {string} dateStr - 日期字符串
 * @returns {Object} 解析后的时间信息
 */
export const parseTimeDimensions = (dateStr) => {
  const date = new Date(dateStr)
  const weekNum = getWeekNumber(date)
  
  const result = {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
    dayOfWeek: date.getDay(),
    week: weekNum
  }
  
  console.log('[DEBUG] parseTimeDimensions - 解析日期:', {
    inputDate: dateStr,
    parsedDate: date.toISOString(),
    result
  })
  
  return result
}

/**
 * 获取年份范围
 * @param {Array} transactions - 交易记录数组
 * @returns {Object} 包含最小和最大年份的对象
 */
export const getYearRange = (transactions) => {
  if (!transactions || transactions.length === 0) {
    const currentYear = new Date().getFullYear()
    return { minYear: currentYear, maxYear: currentYear }
  }
  
  const years = transactions.map(t => new Date(t.date).getFullYear())
  return {
    minYear: Math.min(...years),
    maxYear: Math.max(...years)
  }
}

/**
 * 检查是否为当前月份
 * @param {number} year - 年份
 * @param {number} month - 月份
 * @returns {boolean} 是否为当前月份
 */
export const isCurrentMonth = (year, month) => {
  const now = new Date()
  return year === now.getFullYear() && month === (now.getMonth() + 1)
}

/**
 * 获取月份天数
 * @param {number} year - 年份
 * @param {number} month - 月份
 * @returns {number} 天数
 */
export const getDaysInMonth = (year, month) => {
  return new Date(year, month, 0).getDate()
}

/**
 * 格式化日期为 YYYY-MM-DD 格式
 * @param {Date} date - 日期对象
 * @returns {string} 格式化后的日期字符串
 */
export const formatDate = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}