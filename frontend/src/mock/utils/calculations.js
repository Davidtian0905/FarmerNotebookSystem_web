/**
 * 计算工具函数
 */

/**
 * 计算交易记录的总金额
 * @param {Array} transactions - 交易记录数组
 * @returns {number} 总金额
 */
export const calculateTotalAmount = (transactions) => {
  return transactions.reduce((sum, transaction) => sum + transaction.amount, 0)
}

/**
 * 计算净资产
 * @param {Array} transactions - 交易记录数组
 * @returns {number} 净资产
 */
export const calculateNetAssets = (transactions) => {
  let netAssets = 0
  
  transactions.forEach(transaction => {
    if (transaction.type === 'INBOUND') {
      netAssets += transaction.amount
    } else if (transaction.type === 'OUTBOUND') {
      netAssets -= transaction.amount
    }
  })
  
  return netAssets
}

/**
 * 计算净利润
 * @param {Array} transactions - 交易记录数组
 * @returns {number} 净利润
 */
export const calculateNetProfit = (transactions) => {
  const income = calculateTotalIncome(transactions)
  const expense = calculateTotalExpense(transactions)
    
  return income - expense
}

/**
 * 计算收入总额
 * @param {Array} transactions - 交易记录数组
 * @returns {number} 收入总额
 */
export const calculateTotalIncome = (transactions) => {
  return transactions
    .filter(t => t.type === 'OUTBOUND')  // OUTBOUND = 出库/销售 = 收入
    .reduce((sum, t) => sum + t.amount, 0)
}

/**
 * 计算支出总额
 * @param {Array} transactions - 交易记录数组
 * @returns {number} 支出总额
 */
export const calculateTotalExpense = (transactions) => {
  return transactions
    .filter(t => t.type === 'INBOUND')   // INBOUND = 入库/采购 = 支出
    .reduce((sum, t) => sum + t.amount, 0)
}

/**
 * 计算交易统计信息
 * @param {Array} transactions - 交易记录数组
 * @returns {Object} 统计信息对象
 */
export const calculateTransactionStats = (transactions) => {
  console.log('[DEBUG] calculateTransactionStats - 开始计算:', {
    transactionsCount: transactions.length,
    sampleTransactions: transactions.slice(0, 3).map(t => ({
      id: t.id,
      date: t.date,
      type: t.type,
      amount: t.amount,
      description: t.description
    }))
  })
  
  const income = calculateTotalIncome(transactions)
  const expense = calculateTotalExpense(transactions)
  const netProfit = income - expense
  
  const incomeTransactions = transactions.filter(t => t.type === 'OUTBOUND')  // OUTBOUND = 出库/销售 = 收入
  const expenseTransactions = transactions.filter(t => t.type === 'INBOUND')   // INBOUND = 入库/采购 = 支出
  const incomeCount = incomeTransactions.length
  const expenseCount = expenseTransactions.length
  
  console.log('[DEBUG] calculateTransactionStats - 分类统计:', {
    incomeTransactions: incomeTransactions.map(t => ({ id: t.id, amount: t.amount, type: t.type })),
    expenseTransactions: expenseTransactions.map(t => ({ id: t.id, amount: t.amount, type: t.type })),
    incomeCount,
    expenseCount,
    totalIncome: income,
    totalExpense: expense,
    netProfit
  })
  
  const result = {
    totalTransactions: transactions.length,
    income,
    expense,
    netProfit,
    incomeCount,
    expenseCount,
    averageIncome: incomeCount > 0 ? income / incomeCount : 0,
    averageExpense: expenseCount > 0 ? expense / expenseCount : 0
  }
  
  console.log('[DEBUG] calculateTransactionStats - 计算结果:', result)
  
  return result
}

/**
 * 计算增长率
 * @param {number} currentValue - 当前值
 * @param {number} previousValue - 之前的值
 * @returns {number} 增长率（百分比）
 */
export const calculateGrowthRate = (currentValue, previousValue) => {
  if (previousValue === 0) {
    return currentValue > 0 ? 100 : 0
  }
  return ((currentValue - previousValue) / previousValue) * 100
}

/**
 * 计算平均值
 * @param {Array} values - 数值数组
 * @returns {number} 平均值
 */
export const calculateAverage = (values) => {
  if (!values || values.length === 0) return 0
  return values.reduce((sum, value) => sum + value, 0) / values.length
}

/**
 * 计算中位数
 * @param {Array} values - 数值数组
 * @returns {number} 中位数
 */
export const calculateMedian = (values) => {
  if (!values || values.length === 0) return 0
  
  const sorted = [...values].sort((a, b) => a - b)
  const middle = Math.floor(sorted.length / 2)
  
  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle]) / 2
  } else {
    return sorted[middle]
  }
}

/**
 * 计算百分比
 * @param {number} value - 值
 * @param {number} total - 总数
 * @returns {number} 百分比
 */
export const calculatePercentage = (value, total) => {
  if (total === 0) return 0
  return (value / total) * 100
}

/**
 * 格式化金额
 * @param {number} amount - 金额
 * @param {number} decimals - 小数位数
 * @returns {string} 格式化后的金额字符串
 */
export const formatAmount = (amount, decimals = 2) => {
  return amount.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}