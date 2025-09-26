/**
 * 客户计算逻辑
 * 将客户状态和交易统计的计算逻辑从后端移到前端
 */



/**
 * 计算客户状态
 * @param {Object} customer - 客户基本信息
 * @param {Array} transactions - 该客户的交易记录
 * @param {string} lastTransactionTime - 最后交易时间
 * @returns {string} 客户状态
 */
export const calculateCustomerStatus = (customer, transactions, lastTransactionTime) => {
  // 获取当前日期
  const now = new Date()
  const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
  const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate())
  
  // 如果客户已手动设置为停用状态，则保持该状态
  if (customer.customerStatus === 'disabled') {
    return 'disabled'
  }
  
  // 创建时间在一个月内的为新增客户
  const createTime = new Date(customer.createTime)
  if (createTime > oneMonthAgo) {
    return 'new'
  }
  
  // 没有交易记录或最后交易时间超过三个月的为待激活
  if (!lastTransactionTime || new Date(lastTransactionTime) < threeMonthsAgo) {
    return 'inactive'
  }
  
  // 最近三个月的交易次数超过10次的为活跃客户
  const recentTransactions = transactions.filter(t => 
    new Date(t.date) >= threeMonthsAgo && 
    String(t.customerId) === String(customer.customerId)
  )
  
  if (recentTransactions.length >= 10) {
    return 'active'
  }
  
  // 其他情况为一般客户
  return 'normal'
}

/**
 * 计算客户交易统计数据
 * @param {string} customerId - 客户ID
 * @param {Array} allTransactions - 所有交易记录
 * @returns {Object} 交易统计数据
 */
export const calculateCustomerTransactionStats = (customerId, allTransactions) => {
  // 筛选该客户的所有出库交易记录
  // 注意：transaction.customerId可能是字符串格式，需要确保比较的一致性
  const customerTransactions = allTransactions.filter(transaction => {
    const isOutbound = transaction.type === 'OUTBOUND' || transaction.type === 'outbound';
    const hasCustomerId = transaction.customerId !== undefined;
    const isMatchingCustomer = hasCustomerId && String(transaction.customerId) === String(customerId);
    
    return isOutbound && isMatchingCustomer;
  });
  
  // 计算交易次数
  const transactionCount = customerTransactions.length
  
  // 计算交易总金额
  const transactionAmount = customerTransactions.reduce((sum, transaction) => 
    sum + (transaction.totalPrice || 0), 0
  )
  
  // 获取最后交易时间
  let lastTransactionTime = null
  if (transactionCount > 0) {
    // 按日期排序，获取最新的交易记录
    const sortedTransactions = [...customerTransactions].sort((a, b) => {
      const dateA = new Date(`${a.date} ${a.time || '00:00:00'}`)
      const dateB = new Date(`${b.date} ${b.time || '00:00:00'}`)
      return dateB - dateA
    })
    
    const lastTransaction = sortedTransactions[0]
    lastTransactionTime = `${lastTransaction.date} ${lastTransaction.time || '00:00:00'}`
  }
  
  return {
    transactionCount,
    transactionAmount,
    lastTransactionTime
  }
}

/**
 * 批量计算客户状态和交易统计
 * @param {Array} customers - 客户列表
 * @param {Array} allTransactions - 所有交易记录
 * @returns {Array} 带有计算结果的客户列表
 */
export const calculateCustomersWithStats = (customers, allTransactions) => {
  return customers.map(customer => {
    // 计算客户的实际交易统计
    const stats = calculateCustomerTransactionStats(customer.customerId, allTransactions)
    
    // 计算客户状态
    const calculatedStatus = calculateCustomerStatus(customer, allTransactions, stats.lastTransactionTime)
    
    // 返回完整的客户信息，包括动态计算的交易统计
    return {
      ...customer,
      transactionCount: stats.transactionCount,
      transactionAmount: stats.transactionAmount,
      lastTransactionTime: stats.lastTransactionTime,
      customerStatus: calculatedStatus
    }
  })
}

/**
 * 获取客户状态分布统计
 * @param {Array} customers - 带有状态的客户列表
 * @returns {Object} 状态分布统计
 */
export const getCustomerStatusDistribution = (customers) => {
  return {
    new: customers.filter(c => c.customerStatus === 'new').length,
    active: customers.filter(c => c.customerStatus === 'active').length,
    normal: customers.filter(c => c.customerStatus === 'normal').length,
    inactive: customers.filter(c => c.customerStatus === 'inactive').length,
    disabled: customers.filter(c => c.customerStatus === 'disabled').length
  }
}

/**
 * 获取按交易金额排序的前N名客户
 * @param {Array} customers - 带有交易统计的客户列表
 * @param {Number} limit - 限制数量，默认为10
 * @returns {Array} 排序后的客户列表
 */
export const getTopCustomersByAmount = (customers, limit = 10) => {
  return [...customers]
    .sort((a, b) => b.transactionAmount - a.transactionAmount)
    .slice(0, limit)
    .map(c => ({
      id: c.customerId,
      customername: c.customername,
      transactionCount: c.transactionCount,
      transactionAmount: c.transactionAmount
    }))
}

/**
 * 获取按交易次数排序的前N名客户
 * @param {Array} customers - 带有交易统计的客户列表
 * @param {Number} limit - 限制数量，默认为10
 * @returns {Array} 排序后的客户列表
 */
export const getTopCustomersByCount = (customers, limit = 10) => {
  return [...customers]
    .sort((a, b) => b.transactionCount - a.transactionCount)
    .slice(0, limit)
    .map(c => ({
      id: c.customerId,
      customername: c.customername,
      transactionCount: c.transactionCount,
      transactionAmount: c.transactionAmount
    }))
}

/**
 * 获取客户统计数据
 * @param {Array} customers - 带有交易统计的客户列表
 * @returns {Object} 客户统计数据
 */
export const getCustomerStatistics = (customers) => {
  // 计算总客户数
  const totalCustomers = customers.length
  
  // 计算活跃客户数
  const activeCustomers = customers.filter(c => c.customerStatus === 'active').length
  
  // 计算总交易次数
  const totalTransactions = customers.reduce((sum, c) => sum + (c.transactionCount || 0), 0)
  
  // 计算总交易金额
  const totalAmount = customers.reduce((sum, c) => sum + (c.transactionAmount || 0), 0)
  
  // 计算客户状态分布
  const statusDistribution = getCustomerStatusDistribution(customers)
  
  // 按交易金额排序的前10名客户
  const topCustomersByAmount = getTopCustomersByAmount(customers)
  
  // 按交易次数排序的前10名客户
  const topCustomersByCount = getTopCustomersByCount(customers)
  
  return {
    totalCustomers,
    activeCustomers,
    totalTransactions,
    totalAmount,
    statusDistribution,
    topCustomersByAmount,
    topCustomersByCount
  }
}

/**
 * 客户状态文本映射
 */
export const customerStatusText = {
  new: '新增',
  active: '活跃',
  normal: '一般',
  inactive: '待激活',
  disabled: '已停用'
}

/**
 * 客户状态标签类型映射
 */
export const customerStatusTagType = {
  new: 'success',
  active: 'primary',
  normal: 'warning',
  inactive: 'danger',
  disabled: 'default'
}