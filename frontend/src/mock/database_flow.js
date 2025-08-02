/**
 * 交易数据源 - 模拟真实的入库和出库交易记录
 * 作为动态数据库的基础数据源，所有汇总数据都基于这些交易记录计算得出
 */

// Mock数据库存储键名
const DB_KEYS = {
  TRANSACTIONS: 'mock_transactions_data',
  TRANSACTIONS_CONFIG: 'mock_transactions_config',
  LAST_UPDATE: 'mock_transactions_last_update'
}

/**
 * 生成交易记录ID
 * @param {string} type - 交易类型 (INBOUND|OUTBOUND)
 * @param {string} date - 日期 (YYYY-MM-DD)
 * @param {number} sequence - 序号
 * @returns {string} 交易记录ID
 */
const generateTransactionId = (type, date, sequence) => {
  const prefix = type === 'INBOUND' ? 'IN' : 'OUT'
  const dateStr = date.replace(/-/g, '')
  return `${prefix}${dateStr}${String(sequence).padStart(4, '0')}`
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

// 默认交易数据 - 模拟真实的入库和出库记录
const DEFAULT_TRANSACTIONS = [
  // 2025年1月的交易记录
  {
    id: "IN202501160001",
    type: "INBOUND",
    date: "2025-07-31",
    time: "09:30:00",
    amount: 4000,
    quantity: 50,
    unitPrice: 80,
    productName: "铁观音",
    category: "乌龙茶",
    counterparty: "福建安溪茶园",
    status: "COMPLETED",
    description: "特级铁观音采购"
  },
  {
    id: "OUT202501160001",
    type: "OUTBOUND",
    date: "2025-08-01",
    time: "10:30:00",
    amount: 4800,
    quantity: 20,
    unitPrice: 240,
    productName: "铁观音",
    category: "乌龙茶",
    counterparty: "李茶庄",
    status: "COMPLETED",
    description: "铁观音销售"
  },
  {
    id: "IN202501160002",
    type: "INBOUND",
    date: "2025-01-15",
    time: "14:20:00",
    amount: 3600,
    quantity: 30,
    unitPrice: 120,
    productName: "龙井茶",
    category: "绿茶",
    counterparty: "浙江西湖茶园",
    status: "COMPLETED",
    description: "一级龙井茶采购"
  },
  {
    id: "OUT202501160002",
    type: "OUTBOUND",
    date: "2025-01-15",
    time: "15:20:00",
    amount: 2700,
    quantity: 15,
    unitPrice: 180,
    productName: "龙井茶",
    category: "绿茶",
    counterparty: "王茶叶店",
    status: "PENDING",
    description: "龙井茶销售"
  },
  
  // 2025年2月的交易记录
  {
    id: "IN202502150001",
    type: "INBOUND",
    date: "2025-02-15",
    time: "08:15:00",
    amount: 5000,
    quantity: 40,
    unitPrice: 125,
    productName: "普洱茶",
    category: "黑茶",
    counterparty: "云南普洱茶园",
    status: "COMPLETED",
    description: "陈年普洱茶采购"
  },
  {
    id: "OUT202502150001",
    type: "OUTBOUND",
    date: "2025-02-15",
    time: "11:45:00",
    amount: 6000,
    quantity: 25,
    unitPrice: 240,
    productName: "普洱茶",
    category: "黑茶",
    counterparty: "陈茶庄",
    status: "COMPLETED",
    description: "普洱茶销售"
  },
  
  // 2025年3月的交易记录
  {
    id: "IN202503140001",
    type: "INBOUND",
    date: "2025-03-14",
    time: "09:00:00",
    amount: 3000,
    quantity: 60,
    unitPrice: 50,
    productName: "碧螺春",
    category: "绿茶",
    counterparty: "江苏太湖茶园",
    status: "COMPLETED",
    description: "明前碧螺春采购"
  },
  {
    id: "OUT202503140001",
    type: "OUTBOUND",
    date: "2025-03-14",
    time: "13:30:00",
    amount: 3600,
    quantity: 30,
    unitPrice: 120,
    productName: "碧螺春",
    category: "绿茶",
    counterparty: "张茶叶店",
    status: "COMPLETED",
    description: "碧螺春销售"
  },
  
  // 2025年4月的交易记录
  {
    id: "IN202504130001",
    type: "INBOUND",
    date: "2025-04-13",
    time: "10:00:00",
    amount: 2400,
    quantity: 40,
    unitPrice: 60,
    productName: "毛峰",
    category: "绿茶",
    counterparty: "安徽黄山茶园",
    status: "COMPLETED",
    description: "黄山毛峰采购"
  },
  {
    id: "OUT202504130001",
    type: "OUTBOUND",
    date: "2025-04-13",
    time: "16:00:00",
    amount: 3000,
    quantity: 25,
    unitPrice: 120,
    productName: "毛峰",
    category: "绿茶",
    counterparty: "刘茶庄",
    status: "COMPLETED",
    description: "毛峰销售"
  },
  
  // 2024年的交易记录
  {
    id: "IN202403120001",
    type: "INBOUND",
    date: "2024-03-12",
    time: "08:30:00",
    amount: 1800,
    quantity: 45,
    unitPrice: 40,
    productName: "花茶",
    category: "花茶",
    counterparty: "福建茉莉花茶园",
    status: "COMPLETED",
    description: "茉莉花茶采购"
  },
  {
    id: "OUT202403120001",
    type: "OUTBOUND",
    date: "2024-03-12",
    time: "14:15:00",
    amount: 2200,
    quantity: 25,
    unitPrice: 88,
    productName: "花茶",
    category: "花茶",
    counterparty: "花茶专卖店",
    status: "COMPLETED",
    description: "花茶销售"
  },
  {
    id: "IN202408150001",
    type: "INBOUND",
    date: "2024-08-15",
    time: "09:00:00",
    amount: 3500,
    quantity: 35,
    unitPrice: 100,
    productName: "白茶",
    category: "白茶",
    counterparty: "福建白茶园",
    status: "COMPLETED",
    description: "白毫银针采购"
  },
  {
    id: "OUT202408150001",
    type: "OUTBOUND",
    date: "2024-08-15",
    time: "15:30:00",
    amount: 4200,
    quantity: 20,
    unitPrice: 210,
    productName: "白茶",
    category: "白茶",
    counterparty: "白茶专卖店",
    status: "COMPLETED",
    description: "白毫银针销售"
  },

  // 2023年的交易记录
  {
    id: "IN202306100001",
    type: "INBOUND",
    date: "2023-06-10",
    time: "10:30:00",
    amount: 2800,
    quantity: 40,
    unitPrice: 70,
    productName: "红茶",
    category: "红茶",
    counterparty: "福建正山小种茶园",
    status: "COMPLETED",
    description: "正山小种采购"
  },
  {
    id: "OUT202306100001",
    type: "OUTBOUND",
    date: "2023-06-10",
    time: "16:00:00",
    amount: 3600,
    quantity: 24,
    unitPrice: 150,
    productName: "红茶",
    category: "红茶",
    counterparty: "红茶专卖店",
    status: "COMPLETED",
    description: "正山小种销售"
  },
  {
    id: "IN202311200001",
    type: "INBOUND",
    date: "2023-11-20",
    time: "08:45:00",
    amount: 4200,
    quantity: 30,
    unitPrice: 140,
    productName: "岩茶",
    category: "乌龙茶",
    counterparty: "武夷山岩茶园",
    status: "COMPLETED",
    description: "水仙岩茶采购"
  },
  {
    id: "OUT202311200001",
    type: "OUTBOUND",
    date: "2023-11-20",
    time: "14:20:00",
    amount: 5000,
    quantity: 20,
    unitPrice: 250,
    productName: "岩茶",
    category: "乌龙茶",
    counterparty: "岩茶专卖店",
    status: "COMPLETED",
    description: "水仙岩茶销售"
  },

  // 2022年的交易记录
  {
    id: "IN202204080001",
    type: "INBOUND",
    date: "2022-04-08",
    time: "09:15:00",
    amount: 3200,
    quantity: 50,
    unitPrice: 64,
    productName: "绿茶",
    category: "绿茶",
    counterparty: "浙江龙井茶园",
    status: "COMPLETED",
    description: "明前龙井采购"
  },
  {
    id: "OUT202204080001",
    type: "OUTBOUND",
    date: "2022-04-08",
    time: "15:45:00",
    amount: 4000,
    quantity: 25,
    unitPrice: 160,
    productName: "绿茶",
    category: "绿茶",
    counterparty: "龙井专卖店",
    status: "COMPLETED",
    description: "明前龙井销售"
  },
  {
    id: "IN202209120001",
    type: "INBOUND",
    date: "2022-09-12",
    time: "11:00:00",
    amount: 2600,
    quantity: 40,
    unitPrice: 65,
    productName: "乌龙茶",
    category: "乌龙茶",
    counterparty: "台湾高山茶园",
    status: "COMPLETED",
    description: "高山乌龙采购"
  },
  {
    id: "OUT202209120001",
    type: "OUTBOUND",
    date: "2021-09-12",
    time: "17:30:00",
    amount: 3250,
    quantity: 25,
    unitPrice: 130,
    productName: "乌龙茶",
    category: "乌龙茶",
    counterparty: "乌龙茶专卖店",
    status: "COMPLETED",
    description: "高山乌龙销售"
  },

  // 2021年的交易记录
  {
    id: "OUT202105120001",
    type: "OUTBOUND",
    date: "2021-05-12",
    time: "14:15:00",
    amount: 2250,
    quantity: 30,
    unitPrice: 75,
    productName: "花茶",
    category: "花茶",
    counterparty: "花茶专卖店",
    status: "COMPLETED",
    description: "花茶销售"
  },
  {
    id: "IN202105120001",
    type: "INBOUND",
    date: "2021-05-12",
    time: "09:30:00",
    amount: 1800,
    quantity: 36,
    unitPrice: 50,
    productName: "花茶",
    category: "花茶",
    counterparty: "福建茉莉花茶园",
    status: "COMPLETED",
    description: "茉莉花茶采购"
  },
  {
    id: "IN202110150001",
    type: "INBOUND",
    date: "2021-10-15",
    time: "10:45:00",
    amount: 3800,
    quantity: 38,
    unitPrice: 100,
    productName: "黑茶",
    category: "黑茶",
    counterparty: "湖南安化茶园",
    status: "COMPLETED",
    description: "安化黑茶采购"
  },
  {
    id: "OUT202110150001",
    type: "OUTBOUND",
    date: "2021-10-15",
    time: "16:20:00",
    amount: 4500,
    quantity: 25,
    unitPrice: 180,
    productName: "黑茶",
    category: "黑茶",
    counterparty: "黑茶专卖店",
    status: "COMPLETED",
    description: "安化黑茶销售"
  },
  
  // 2025年1月11日的交易记录
  {
    id: "IN202501110001",
    type: "INBOUND",
    date: "2025-01-11",
    time: "09:45:00",
    amount: 3200,
    quantity: 32,
    unitPrice: 100,
    productName: "大红袍",
    category: "乌龙茶",
    counterparty: "福建武夷山茶园",
    status: "COMPLETED",
    description: "岩茶大红袍采购"
  },
  {
    id: "OUT202501110001",
    type: "OUTBOUND",
    date: "2025-01-11",
    time: "15:30:00",
    amount: 4000,
    quantity: 20,
    unitPrice: 200,
    productName: "大红袍",
    category: "乌龙茶",
    counterparty: "岩茶专卖店",
    status: "COMPLETED",
    description: "大红袍销售"
  }
]

/**
 * 获取所有交易记录
 * @returns {Array} 交易记录数组
 */
export const getAllTransactions = () => {
  const storedData = localStorage.getItem(DB_KEYS.TRANSACTIONS)
  
  if (!storedData) {
    // 如果没有存储的数据，使用默认数据
    localStorage.setItem(DB_KEYS.TRANSACTIONS, JSON.stringify(DEFAULT_TRANSACTIONS))
    localStorage.setItem(DB_KEYS.LAST_UPDATE, new Date().toISOString().split('T')[0])
    return DEFAULT_TRANSACTIONS
  }
  
  try {
    return JSON.parse(storedData)
  } catch (error) {
    console.warn('解析存储的交易数据失败，使用默认数据:', error)
    localStorage.setItem(DB_KEYS.TRANSACTIONS, JSON.stringify(DEFAULT_TRANSACTIONS))
    localStorage.setItem(DB_KEYS.LAST_UPDATE, new Date().toISOString().split('T')[0])
    return DEFAULT_TRANSACTIONS
  }
}

/**
 * 添加新的交易记录
 * @param {Object} transaction - 交易记录对象
 * @returns {Object} 添加的交易记录
 */
export const addTransaction = (transaction) => {
  const transactions = getAllTransactions()
  
  // 生成交易ID
  const date = transaction.date || new Date().toISOString().split('T')[0]
  const sequence = transactions.filter(t => t.date === date && t.type === transaction.type).length + 1
  const id = generateTransactionId(transaction.type, date, sequence)
  
  // 创建完整的交易记录
  const newTransaction = {
    id,
    type: transaction.type,
    date: transaction.date || new Date().toISOString().split('T')[0],
    time: transaction.time || new Date().toTimeString().split(' ')[0],
    amount: transaction.amount || 0,
    quantity: transaction.quantity || 0,
    unitPrice: transaction.unitPrice || 0,
    productName: transaction.productName || '',
    category: transaction.category || '',
    counterparty: transaction.counterparty || '',
    status: transaction.status || 'COMPLETED',
    description: transaction.description || '',
    createTime: new Date().toISOString()
  }
  
  // 添加到交易列表
  transactions.push(newTransaction)
  
  // 按日期和时间排序
  transactions.sort((a, b) => {
    const dateCompare = new Date(a.date) - new Date(b.date)
    if (dateCompare !== 0) return dateCompare
    return a.time.localeCompare(b.time)
  })
  
  // 保存到本地存储
  localStorage.setItem(DB_KEYS.TRANSACTIONS, JSON.stringify(transactions))
  localStorage.setItem(DB_KEYS.LAST_UPDATE, new Date().toISOString().split('T')[0])
  
  return newTransaction
}

/**
 * 更新交易记录
 * @param {string} id - 交易记录ID
 * @param {Object} updates - 更新内容
 * @returns {Object|null} 更新后的交易记录
 */
export const updateTransaction = (id, updates) => {
  const transactions = getAllTransactions()
  const index = transactions.findIndex(t => t.id === id)
  
  if (index === -1) {
    console.warn(`未找到交易记录: ${id}`)
    return null
  }
  
  // 更新交易记录
  transactions[index] = {
    ...transactions[index],
    ...updates,
    updateTime: new Date().toISOString()
  }
  
  // 保存到本地存储
  localStorage.setItem(DB_KEYS.TRANSACTIONS, JSON.stringify(transactions))
  localStorage.setItem(DB_KEYS.LAST_UPDATE, new Date().toISOString().split('T')[0])
  
  return transactions[index]
}

/**
 * 删除交易记录
 * @param {string} id - 交易记录ID
 * @returns {boolean} 是否删除成功
 */
export const deleteTransaction = (id) => {
  const transactions = getAllTransactions()
  const index = transactions.findIndex(t => t.id === id)
  
  if (index === -1) {
    console.warn(`未找到交易记录: ${id}`)
    return false
  }
  
  // 删除交易记录
  transactions.splice(index, 1)
  
  // 保存到本地存储
  localStorage.setItem(DB_KEYS.TRANSACTIONS, JSON.stringify(transactions))
  localStorage.setItem(DB_KEYS.LAST_UPDATE, new Date().toISOString().split('T')[0])
  
  return true
}

/**
 * 根据时间范围获取交易记录
 * @param {string} startDate - 开始日期 (YYYY-MM-DD)
 * @param {string} endDate - 结束日期 (YYYY-MM-DD)
 * @returns {Array} 过滤后的交易记录
 */
export const getTransactionsByDateRange = (startDate, endDate) => {
  const transactions = getAllTransactions()
  return transactions.filter(t => {
    const transactionDate = new Date(t.date)
    const start = new Date(startDate)
    const end = new Date(endDate)
    return transactionDate >= start && transactionDate <= end
  })
}

/**
 * 根据交易类型获取交易记录
 * @param {string} type - 交易类型 (INBOUND|OUTBOUND)
 * @returns {Array} 过滤后的交易记录
 */
export const getTransactionsByType = (type) => {
  const transactions = getAllTransactions()
  return transactions.filter(t => t.type === type)
}

/**
 * 获取指定日期的交易记录
 * @param {string} date - 日期 (YYYY-MM-DD)
 * @returns {Array} 指定日期的交易记录
 */
export const getTransactionsByDate = (date) => {
  const transactions = getAllTransactions()
  return transactions.filter(t => t.date === date)
}

/**
 * 获取交易统计信息
 * @returns {Object} 交易统计信息
 */
export const getTransactionStatistics = () => {
  const transactions = getAllTransactions()
  
  const totalTransactions = transactions.length
  const inboundTransactions = transactions.filter(t => t.type === 'INBOUND')
  const outboundTransactions = transactions.filter(t => t.type === 'OUTBOUND')
  
  const totalInboundAmount = inboundTransactions.reduce((sum, t) => sum + t.amount, 0)
  const totalOutboundAmount = outboundTransactions.reduce((sum, t) => sum + t.amount, 0)
  
  return {
    totalTransactions,
    inboundCount: inboundTransactions.length,
    outboundCount: outboundTransactions.length,
    totalInboundAmount,
    totalOutboundAmount,
    netAmount: totalOutboundAmount - totalInboundAmount
  }
}

/**
 * 重置交易数据
 * 清除所有存储的交易数据，恢复到默认状态
 */
export const resetTransactionData = () => {
  localStorage.removeItem(DB_KEYS.TRANSACTIONS)
  localStorage.removeItem(DB_KEYS.LAST_UPDATE)
  console.log('交易数据已重置')
}

/**
 * 初始化交易数据
 * 确保默认数据正确加载
 */
export const initializeTransactionData = () => {
  const existingData = localStorage.getItem(DB_KEYS.TRANSACTIONS)
  
  if (!existingData) {
    // 如果没有数据，加载默认数据
    localStorage.setItem(DB_KEYS.TRANSACTIONS, JSON.stringify(DEFAULT_TRANSACTIONS))
    localStorage.setItem(DB_KEYS.LAST_UPDATE, new Date().toISOString().split('T')[0])
    console.log('已初始化默认交易数据')
  } else {
    console.log('交易数据已存在，跳过初始化')
  }
  
  // 调试显示当前数据状态
  debugTransactionData()
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
 * 调试函数：打印当前数据状态
 */
export const debugTransactionData = () => {
  const transactions = getAllTransactions()
  const currentInfo = {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate(),
    dayOfWeek: new Date().getDay()
  }
  
  console.log('=== 交易数据调试信息 ===')
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
  
  const currentWeekTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.date)
    const transactionDayOfWeek = transactionDate.getDay()
    const adjustedDayOfWeek = transactionDayOfWeek === 0 ? 7 : transactionDayOfWeek
    return adjustedDayOfWeek <= currentInfo.dayOfWeek
  })
  
  console.log('本年交易记录数:', currentYearTransactions.length)
  console.log('本月交易记录数:', currentMonthTransactions.length)
  console.log('本周交易记录数:', currentWeekTransactions.length)
  
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
  
  // 显示最近的几条交易记录
  console.log('最近的交易记录:')
  transactions.slice(-5).forEach(t => {
    console.log(`  ${t.date} ${t.time} ${t.type} ${t.productName} ¥${t.amount}`)
  })
}