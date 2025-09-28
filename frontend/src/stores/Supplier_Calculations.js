/**
 * 供应商计算逻辑
 * 将供应商状态和交易统计的计算逻辑从后端移到前端
 */

/**
 * 计算供应商状态
 * @param {Object} supplier - 供应商基本信息
 * @param {Array} transactions - 该供应商的交易记录
 * @param {string} lastTransactionTime - 最后交易时间
 * @returns {string} 供应商状态
 */
export const calculateSupplierStatus = (supplier, transactions, lastTransactionTime) => {
  // 获取当前日期
  const now = new Date()
  const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
  const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate())
  
  // 如果供应商已手动设置为停用状态，则保持该状态
  if (supplier.supplierStatus === 'disabled') {
    return 'disabled'
  }
  
  // 如果供应商状态是待审核，直接返回
  if (supplier.supplierStatus === 'pending') {
    return 'pending'
  }
  
  // 创建时间在一个月内的为新增供应商
  const createTime = new Date(supplier.createTime)
  if (createTime > oneMonthAgo) {
    return 'new'
  }
  
  // 没有交易记录或最后交易时间超过三个月的为待激活
  if (!lastTransactionTime || new Date(lastTransactionTime) < threeMonthsAgo) {
    return 'inactive'
  }
  
  // 最近三个月的交易次数超过10次的为活跃供应商
  const recentTransactions = transactions.filter(t => 
    new Date(t.date) >= threeMonthsAgo && 
    String(t.supplierId) === String(supplier.supplierId)
  )
  
  if (recentTransactions.length >= 10) {
    return 'active'
  }
  
  // 其他情况为一般供应商
  return 'normal'
}

/**
 * 计算供应商交易统计数据
 * @param {string} supplierId - 供应商ID
 * @param {Array} allTransactions - 所有交易记录
 * @returns {Object} 交易统计数据
 */
export const calculateSupplierTransactionStats = (supplierId, allTransactions) => {
  // 筛选该供应商的所有入库交易记录
  const supplierTransactions = allTransactions.filter(transaction => {
    const isInbound = transaction.type === 'INBOUND' || transaction.type === 'inbound';
    const hasSupplierId = transaction.supplierId !== undefined;
    const isMatchingSupplier = hasSupplierId && String(transaction.supplierId) === String(supplierId);
    
    return isInbound && isMatchingSupplier;
  });
  
  // 计算交易次数
  const transactionCount = supplierTransactions.length
  
  // 计算交易总金额
  const transactionAmount = supplierTransactions.reduce((sum, transaction) => 
    sum + (transaction.amount || 0), 0
  )
  
  // 获取最后交易时间
  let lastTransactionTime = null
  if (transactionCount > 0) {
    // 按日期排序，获取最新的交易记录
    const sortedTransactions = [...supplierTransactions].sort((a, b) => {
      const dateA = new Date(`${a.date} ${a.time || '00:00:00'}`)
      const dateB = new Date(`${b.date} ${b.time || '00:00:00'}`)
      return dateB - dateA
    })
    
    const lastTransaction = sortedTransactions[0]
    lastTransactionTime = `${lastTransaction.date} ${lastTransaction.time || '00:00:00'}`
  }
  
  // 计算评分（质量、交付、价格、服务的平均值）
  const ratedTransactions = supplierTransactions.filter(t => 
    t.quality !== undefined && t.delivery !== undefined && 
    t.price !== undefined && t.service !== undefined
  )
  
  let rating = 0
  if (ratedTransactions.length > 0) {
    const totalQuality = ratedTransactions.reduce((sum, t) => sum + t.quality, 0)
    const totalDelivery = ratedTransactions.reduce((sum, t) => sum + t.delivery, 0)
    const totalPrice = ratedTransactions.reduce((sum, t) => sum + t.price, 0)
    const totalService = ratedTransactions.reduce((sum, t) => sum + t.service, 0)
    
    const avgQuality = totalQuality / ratedTransactions.length
    const avgDelivery = totalDelivery / ratedTransactions.length
    const avgPrice = totalPrice / ratedTransactions.length
    const avgService = totalService / ratedTransactions.length
    
    rating = Number(((avgQuality + avgDelivery + avgPrice + avgService) / 4).toFixed(1))
  }
  
  return {
    transactionCount,
    transactionAmount,
    lastTransactionTime,
    rating
  }
}

/**
 * 批量计算供应商状态和交易统计
 * @param {Array} suppliers - 供应商列表
 * @param {Array} allTransactions - 所有交易记录
 * @returns {Array} 带有计算结果的供应商列表
 */
export const calculateSuppliersWithStats = (suppliers, allTransactions) => {
  return suppliers.map(supplier => {
    // 计算供应商的实际交易统计
    const stats = calculateSupplierTransactionStats(supplier.supplierId, allTransactions)
    
    // 计算供应商状态
    const calculatedStatus = calculateSupplierStatus(supplier, allTransactions, stats.lastTransactionTime)
    
    // 返回完整的供应商信息，包括动态计算的交易统计
    return {
      ...supplier,
      transactionCount: stats.transactionCount,
      transactionAmount: stats.transactionAmount,
      lastTransactionTime: stats.lastTransactionTime,
      rating: stats.rating,
      supplierstatus: calculatedStatus
    }
  })
}

/**
 * 获取供应商状态分布统计
 * @param {Array} suppliers - 带有状态的供应商列表
 * @returns {Object} 状态分布统计
 */
export const getSupplierStatusDistribution = (suppliers) => {
  return {
    new: suppliers.filter(s => s.supplierstatus === 'new').length,
    active: suppliers.filter(s => s.supplierstatus === 'active').length,
    normal: suppliers.filter(s => s.supplierstatus === 'normal').length,
    inactive: suppliers.filter(s => s.supplierstatus === 'inactive').length,
    pending: suppliers.filter(s => s.supplierstatus === 'pending').length,
    disabled: suppliers.filter(s => s.supplierstatus === 'disabled').length
  }
}

/**
 * 获取按交易金额排序的前N名供应商
 * @param {Array} suppliers - 带有交易统计的供应商列表
 * @param {Number} limit - 限制数量，默认为10
 * @returns {Array} 排序后的供应商列表
 */
export const getTopSuppliersByAmount = (suppliers, limit = 10) => {
  return [...suppliers]
    .sort((a, b) => b.transactionAmount - a.transactionAmount)
    .slice(0, limit)
    .map(s => ({
      id: s.supplierId,
      name: s.suppliername,
      transactionCount: s.transactionCount,
      transactionAmount: s.transactionAmount,
      rating: s.rating
    }))
}

/**
 * 获取按交易次数排序的前N名供应商
 * @param {Array} suppliers - 带有交易统计的供应商列表
 * @param {Number} limit - 限制数量，默认为10
 * @returns {Array} 排序后的供应商列表
 */
export const getTopSuppliersByCount = (suppliers, limit = 10) => {
  return [...suppliers]
    .sort((a, b) => b.transactionCount - a.transactionCount)
    .slice(0, limit)
    .map(s => ({
      id: s.supplierId,
      name: s.suppliername,
      transactionCount: s.transactionCount,
      transactionAmount: s.transactionAmount,
      rating: s.rating
    }))
}

/**
 * 获取供应商统计数据
 * @param {Array} suppliers - 带有交易统计的供应商列表
 * @returns {Object} 供应商统计数据
 */
export const getSupplierStatistics = (suppliers) => {
  // 计算总供应商数
  const totalSuppliers = suppliers.length
  
  // 计算活跃供应商数
  const activeSuppliers = suppliers.filter(s => s.supplierstatus === 'active').length
  
  // 计算总交易次数
  const totalTransactions = suppliers.reduce((sum, s) => sum + (s.transactionCount || 0), 0)
  
  // 计算总交易金额
  const totalAmount = suppliers.reduce((sum, s) => sum + (s.transactionAmount || 0), 0)
  
  // 计算供应商状态分布
  const statusDistribution = getSupplierStatusDistribution(suppliers)
  
  // 按交易金额排序的前10名供应商
  const topSuppliersByAmount = getTopSuppliersByAmount(suppliers)
  
  // 按交易次数排序的前10名供应商
  const topSuppliersByCount = getTopSuppliersByCount(suppliers)
  
  return {
    totalSuppliers,
    activeSuppliers,
    totalTransactions,
    totalAmount,
    statusDistribution,
    topSuppliersByAmount,
    topSuppliersByCount
  }
}

/**
 * 供应商状态文本映射
 */
export const supplierStatusText = {
  new: '新增',
  active: '活跃',
  normal: '一般',
  inactive: '待激活',
  pending: '待审核',
  disabled: '已停用'
}

/**
 * 供应商状态标签类型映射
 */
export const supplierStatusTagType = {
  new: 'primary',
  active: 'success',
  normal: 'warning',
  inactive: 'danger',
  pending: 'danger',
  disabled: 'default'
}