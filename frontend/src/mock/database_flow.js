/**
 * 交易数据源 - 模拟真实的入库和出库交易记录
 * 作为动态数据库的基础数据源，所有汇总数据都基于这些交易记录计算得出
 */

// 导入工具函数
import { getWeekNumber, parseTimeDimensions, filterTransactionsByPeriod } from './utils/index.js'

// Mock数据库存储键名
const DB_KEYS = {
  TRANSACTIONS: 'mock_transactions_data',
  TRANSACTIONS_CONFIG: 'mock_transactions_config',
  LAST_UPDATE: 'mock_transactions_last_update',
  INDEXES: 'mock_transactions_indexes'
}

// 索引配置
const INDEX_CONFIG = {
  // 主要索引字段
  PRIMARY_INDEXES: ['date', 'type', 'productName', 'category', 'supplier'],

  // 复合索引
  COMPOSITE_INDEXES: [
    ['date', 'type'],
    ['productName', 'type'],
    ['category', 'date']
  ],
  // 索引更新策略
  UPDATE_STRATEGY: 'INCREMENTAL' // FULL | INCREMENTAL
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

// getWeekNumber 函数已从 utils/dateUtils.js 导入

// parseTimeDimensions 函数已从 utils/dateUtils.js 导入

// ==================== 索引管理系统 ====================

/**
 * 内存索引缓存
 */
let indexCache = {
  indexes: {},
  lastUpdate: null,
  isValid: false
}

/**
 * 构建单字段索引
 * @param {Array} transactions - 交易记录数组
 * @param {string} field - 索引字段
 * @returns {Object} 字段索引映射
 */
const buildSingleIndex = (transactions, field) => {
  const index = {}
  transactions.forEach((transaction, idx) => {
    const value = transaction[field]
    if (value !== undefined && value !== null) {
      if (!index[value]) {
        index[value] = []
      }
      index[value].push(idx)
    }
  })
  return index
}

/**
 * 构建复合索引
 * @param {Array} transactions - 交易记录数组
 * @param {Array} fields - 索引字段数组
 * @returns {Object} 复合索引映射
 */
const buildCompositeIndex = (transactions, fields) => {
  const index = {}
  transactions.forEach((transaction, idx) => {
    const key = fields.map(field => transaction[field]).join('|')
    if (!index[key]) {
      index[key] = []
    }
    index[key].push(idx)
  })
  return index
}

/**
 * 构建所有索引
 * @param {Array} transactions - 交易记录数组
 * @returns {Object} 完整索引结构
 */
const buildAllIndexes = (transactions) => {
  const indexes = {
    single: {},
    composite: {},
    metadata: {
      totalRecords: transactions.length,
      buildTime: Date.now(),
      version: '1.0'
    }
  }

  // 构建单字段索引
  INDEX_CONFIG.PRIMARY_INDEXES.forEach(field => {
    indexes.single[field] = buildSingleIndex(transactions, field)
  })

  // 构建复合索引
  INDEX_CONFIG.COMPOSITE_INDEXES.forEach(fields => {
    const key = fields.join('_')
    indexes.composite[key] = buildCompositeIndex(transactions, fields)
  })

  return indexes
}

/**
 * 获取或构建索引
 * @param {boolean} forceRebuild - 是否强制重建索引
 * @returns {Object} 索引结构
 */
const getIndexes = (forceRebuild = false) => {
  const transactions = getAllTransactions()
  const currentDataHash = JSON.stringify(transactions).length // 简单的数据变化检测

  // 检查索引是否需要更新
  if (forceRebuild || !indexCache.isValid || indexCache.lastUpdate !== currentDataHash) {
    console.log('重建索引中...')
    indexCache.indexes = buildAllIndexes(transactions)
    indexCache.lastUpdate = currentDataHash
    indexCache.isValid = true
    
    // 可选：持久化索引到localStorage
    if (INDEX_CONFIG.UPDATE_STRATEGY === 'INCREMENTAL') {
      localStorage.setItem(DB_KEYS.INDEXES, JSON.stringify(indexCache.indexes))
    }
  }

  return indexCache.indexes
}

/**
 * 使用索引进行快速查询
 * @param {string} field - 查询字段
 * @param {*} value - 查询值
 * @returns {Array} 匹配的交易记录索引数组
 */
const queryByIndex = (field, value) => {
  const indexes = getIndexes()
  const singleIndex = indexes.single[field]
  
  if (singleIndex && singleIndex[value]) {
    return singleIndex[value]
  }
  
  return []
}

/**
 * 使用复合索引进行查询
 * @param {Array} fields - 查询字段数组
 * @param {Array} values - 查询值数组
 * @returns {Array} 匹配的交易记录索引数组
 */
const queryByCompositeIndex = (fields, values) => {
  const indexes = getIndexes()
  const key = fields.join('_')
  const compositeIndex = indexes.composite[key]
  
  if (compositeIndex) {
    const queryKey = values.join('|')
    return compositeIndex[queryKey] || []
  }
  
  return []
}

// 默认交易数据 - 模拟真实的入库和出库记录
const DEFAULT_TRANSACTIONS = [
  // 来自warehouse_data.js的详细仓库交易记录

 {
    type: "OUTBOUND",
    date: "2025-08-22",
    time: "09:30:00",
    productName: '铁观音套装',
    productCode: 'P_TGY20250820093000',
    unit: '盒',
    quantity: 50,
    unitPrice: 280.00,
    totalPrice: 14000.00,
    customerId: 'CUS001',
      customerName: '李茶庄',
      customerPhone: '13800138001',
      customerAddress: '福建省厦门市思明区茶叶街123号',
      customerDiscountRate: 0.1,
      customerContactPerson: '李经理',
      customerEmail: 'lichazhuang@example.com',
      customerStatus: 'active',
    channel: '线上',
    tags: ['VIP客户', '礼品'],
    notes: '客户要求包装精美'
  },
   {
    type: "INBOUND",
    date: "2025-08-23",
    time: "09:30:00",
    materialName: "大红袍01",
    materialCode: "M_DHP20250820093001",
    batchNumber: "第二批春茶",
    materialType: "茶叶",
    materialGrade: "A级",
    amount: 5000,
    quantity: 50,
    unit: "斤",
    unitPrice: 100,
    supplier: "福建安溪茶园",
    expiryDate: "2027-01-15",
    shelfLifeDays: 730,
    warehouseLocation: "仓库A区",
    description: "特级铁观音，需保存在阴凉处，避免阳光直射",
    qualityStatus: "合格",
    inspector: "质检员A",
    inspectionDate: "2025-01-15",
    qualityRemarks: "质检通过，无异常",
  },
  {
    type: "INBOUND",
    date: "2025-08-20",
    time: "09:30:00",
    materialName: "大红袍",
    materialCode: "M_DHP20250820093000",
    batchNumber: "第一批春茶",
    materialType: "茶叶",
    materialGrade: "特级",
    amount: 5000,
    quantity: 50,
    unit: "斤",
    unitPrice: 100,
    supplier: "福建安溪茶园",
    expiryDate: "2027-01-15",
    shelfLifeDays: 730,
    warehouseLocation: "仓库A区",
    description: "特级铁观音，需保存在阴凉处，避免阳光直射",
    qualityStatus: "合格",
    inspector: "质检员A",
    inspectionDate: "2025-01-15",
    qualityRemarks: "质检通过，无异常",
  },
    {
    type: "INBOUND",
    date: "2025-08-21",
    time: "09:30:00",
    materialName: "大红袍",
    materialCode: "M_DHP20250820093000",
    batchNumber: "第一批春茶",
    materialType: "茶叶",
    materialGrade: "特级",
    amount: 6000,
    quantity: 60,
    unit: "斤",
    unitPrice: 100,
    supplier: "福建安溪茶园",
    expiryDate: "2027-01-15",
    shelfLifeDays: 730,
    warehouseLocation: "仓库A区",
    description: "特级铁观音，需保存在阴凉处，避免阳光直射",
    qualityStatus: "合格",
    inspector: "质检员A",
    inspectionDate: "2025-01-15",
    qualityRemarks: "质检通过，无异常",
  },
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
    createTime: new Date().toISOString(),
    ...transaction // 保留所有原始字段
  }
  
  // 移除不需要的字段
  delete newTransaction.id
  delete newTransaction.createTime
  
  // 重新设置必要字段
  newTransaction.id = id
  newTransaction.createTime = new Date().toISOString()
  
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
  
  // 记录变更日志
  incrementalUpdateManager.logChange('INSERT', newTransaction.id, newTransaction)
  
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
  
  const oldTransaction = { ...transactions[index] }
  
  // 更新交易记录
  transactions[index] = {
    ...transactions[index],
    ...updates,
    updateTime: new Date().toISOString()
  }
  
  // 保存到本地存储
  localStorage.setItem(DB_KEYS.TRANSACTIONS, JSON.stringify(transactions))
  localStorage.setItem(DB_KEYS.LAST_UPDATE, new Date().toISOString().split('T')[0])
  
  // 记录变更日志
  incrementalUpdateManager.logChange('UPDATE', id, {
    old: oldTransaction,
    new: transactions[index]
  })
  
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
  
  const deletedTransaction = transactions[index]
  
  // 删除交易记录
  transactions.splice(index, 1)
  
  // 保存到本地存储
  localStorage.setItem(DB_KEYS.TRANSACTIONS, JSON.stringify(transactions))
  localStorage.setItem(DB_KEYS.LAST_UPDATE, new Date().toISOString().split('T')[0])
  
  // 记录变更日志
  incrementalUpdateManager.logChange('DELETE', id, deletedTransaction)
  
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
 * 获取最近7天的交易记录（更清晰的命名）
 * @param {Date} endDate - 结束日期（默认为今天）
 * @returns {Array} 最近7天的交易记录
 */
export const get7dayTransactions = (endDate = new Date()) => {
  return getRecentWeekTransactions(endDate)
}

/**
 * 获取最近7天的交易记录（优化版本）
 * 直接从localStorage进行日期范围过滤，避免全量数据加载
 * @param {Date} endDate - 结束日期（默认为今天）
 * @returns {Array} 最近7天的交易记录
 */
export const getRecentWeekTransactions = (endDate = new Date()) => {
  // 计算7天前的日期
  const startDate = new Date(endDate)
  startDate.setDate(startDate.getDate() - 6) // 包含今天共7天
  
  // 格式化日期为YYYY-MM-DD格式
  const formatDate = (date) => {
    return date.getFullYear() + '-' + 
           String(date.getMonth() + 1).padStart(2, '0') + '-' + 
           String(date.getDate()).padStart(2, '0')
  }
  
  const startDateStr = formatDate(startDate)
  const endDateStr = formatDate(endDate)
  
  // 直接从localStorage获取数据并进行日期过滤
  const storedData = localStorage.getItem(DB_KEYS.TRANSACTIONS)
  if (!storedData) {
    // 如果localStorage中没有数据，初始化默认数据
    initializeTransactionData()
    return getRecentWeekTransactions(endDate)
  }
  
  try {
    const transactions = JSON.parse(storedData)
    
    // 优化的日期过滤：直接字符串比较（YYYY-MM-DD格式支持字典序比较）
    return transactions.filter(t => {
      return t.date >= startDateStr && t.date <= endDateStr
    })
  } catch (error) {
    console.error('解析交易数据失败:', error)
    // 数据损坏时重新初始化
    initializeTransactionData()
    return getRecentWeekTransactions(endDate)
  }
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
}

/**
 * 按时间维度过滤交易记录
 * @param {Array} transactions - 交易记录数组
 * @param {string} period - 时间维度
 * @param {Object} params - 查询参数
 * @returns {Array} 过滤后的交易记录
 */
// filterTransactionsByPeriod 函数已从 utils/dataFilters.js 导入

// ==================== SQL风格查询接口 ====================

/**
 * SQL风格的查询构建器
 */
class QueryBuilder {
  constructor() {
    this.whereConditions = []
    this.orderByFields = []
    this.limitCount = null
    this.offsetCount = 0
    this.selectFields = null
  }

  /**
   * 添加WHERE条件
   * @param {string} field - 字段名
   * @param {string} operator - 操作符 (=, !=, >, <, >=, <=, LIKE, IN)
   * @param {*} value - 比较值
   * @returns {QueryBuilder} 链式调用
   */
  where(field, operator, value) {
    this.whereConditions.push({ field, operator, value })
    return this
  }

  /**
   * 添加ORDER BY排序
   * @param {string} field - 排序字段
   * @param {string} direction - 排序方向 (ASC|DESC)
   * @returns {QueryBuilder} 链式调用
   */
  orderBy(field, direction = 'ASC') {
    this.orderByFields.push({ field, direction: direction.toUpperCase() })
    return this
  }

  /**
   * 设置LIMIT限制
   * @param {number} count - 限制数量
   * @returns {QueryBuilder} 链式调用
   */
  limit(count) {
    this.limitCount = count
    return this
  }

  /**
   * 设置OFFSET偏移
   * @param {number} count - 偏移数量
   * @returns {QueryBuilder} 链式调用
   */
  offset(count) {
    this.offsetCount = count
    return this
  }

  /**
   * 选择特定字段
   * @param {Array} fields - 字段数组
   * @returns {QueryBuilder} 链式调用
   */
  select(fields) {
    this.selectFields = fields
    return this
  }

  /**
   * 执行查询
   * @returns {Array} 查询结果
   */
  execute() {
    const startTime = performanceMonitor.startQuery()
    let indexUsed = false
    
    try {
      let transactions = getAllTransactions()
      let resultIndexes = null

      // 尝试使用索引优化查询
      if (this.whereConditions.length > 0) {
        resultIndexes = this.executeWithIndexOptimization(transactions)
        indexUsed = resultIndexes !== null
      }

      // 如果没有使用索引，则进行全表扫描
      if (resultIndexes === null) {
        resultIndexes = transactions.map((_, idx) => idx)
        resultIndexes = this.applyWhereConditions(transactions, resultIndexes)
      }

      // 获取实际的交易记录
      let results = resultIndexes.map(idx => transactions[idx])

      // 应用排序
      if (this.orderByFields.length > 0) {
        results = this.applySorting(results)
      }

      // 应用分页
      if (this.limitCount !== null || this.offsetCount > 0) {
        const start = this.offsetCount
        const end = this.limitCount ? start + this.limitCount : undefined
        results = results.slice(start, end)
      }

      // 应用字段选择
      if (this.selectFields) {
        results = results.map(record => {
          const selected = {}
          this.selectFields.forEach(field => {
            if (record.hasOwnProperty(field)) {
              selected[field] = record[field]
            }
          })
          return selected
        })
      }

      return results
    } finally {
      performanceMonitor.endQuery(startTime, indexUsed)
    }
  }

  /**
   * 使用索引优化执行查询
   * @param {Array} transactions - 交易记录数组
   * @returns {Array|null} 结果索引数组或null（如果无法使用索引）
   */
  executeWithIndexOptimization(transactions) {
    // 查找可以使用索引的条件
    for (const condition of this.whereConditions) {
      if (condition.operator === '=' && INDEX_CONFIG.PRIMARY_INDEXES.includes(condition.field)) {
        const indexes = queryByIndex(condition.field, condition.value)
        if (indexes.length > 0) {
          // 应用其他WHERE条件
          return this.applyWhereConditions(transactions, indexes)
        }
      }
    }

    // 检查复合索引
    for (const compositeFields of INDEX_CONFIG.COMPOSITE_INDEXES) {
      const matchingConditions = this.whereConditions.filter(c => 
        c.operator === '=' && compositeFields.includes(c.field)
      )
      
      if (matchingConditions.length === compositeFields.length) {
        const values = compositeFields.map(field => {
          const condition = matchingConditions.find(c => c.field === field)
          return condition ? condition.value : null
        })
        
        if (values.every(v => v !== null)) {
          const indexes = queryByCompositeIndex(compositeFields, values)
          if (indexes.length > 0) {
            return this.applyWhereConditions(transactions, indexes)
          }
        }
      }
    }

    return null // 无法使用索引优化
  }

  /**
   * 应用WHERE条件过滤
   * @param {Array} transactions - 交易记录数组
   * @param {Array} candidateIndexes - 候选索引数组
   * @returns {Array} 过滤后的索引数组
   */
  applyWhereConditions(transactions, candidateIndexes) {
    return candidateIndexes.filter(idx => {
      const record = transactions[idx]
      return this.whereConditions.every(condition => {
        return this.evaluateCondition(record, condition)
      })
    })
  }

  /**
   * 评估单个WHERE条件
   * @param {Object} record - 交易记录
   * @param {Object} condition - 条件对象
   * @returns {boolean} 条件是否满足
   */
  evaluateCondition(record, condition) {
    const { field, operator, value } = condition
    const fieldValue = record[field]

    switch (operator) {
      case '=':
        return fieldValue === value
      case '!=':
        return fieldValue !== value
      case '>':
        return fieldValue > value
      case '<':
        return fieldValue < value
      case '>=':
        return fieldValue >= value
      case '<=':
        return fieldValue <= value
      case 'LIKE':
        return String(fieldValue).includes(String(value))
      case 'IN':
        return Array.isArray(value) && value.includes(fieldValue)
      default:
        return false
    }
  }

  /**
   * 应用排序
   * @param {Array} results - 结果数组
   * @returns {Array} 排序后的结果
   */
  applySorting(results) {
    return results.sort((a, b) => {
      for (const { field, direction } of this.orderByFields) {
        const aVal = a[field]
        const bVal = b[field]
        
        let comparison = 0
        if (aVal < bVal) comparison = -1
        else if (aVal > bVal) comparison = 1
        
        if (comparison !== 0) {
          return direction === 'DESC' ? -comparison : comparison
        }
      }
      return 0
    })
  }
}

/**
 * 创建查询构建器
 * @returns {QueryBuilder} 新的查询构建器实例
 */
export const createQuery = () => {
  return new QueryBuilder()
}

/**
 * 快速查询接口 - 模拟SQL SELECT语句
 * @param {Object} options - 查询选项
 * @returns {Array} 查询结果
 */
export const selectTransactions = (options = {}) => {
  const {
    where = {},
    orderBy = null,
    limit = null,
    offset = 0,
    select = null
  } = options

  const query = createQuery()

  // 添加WHERE条件
  Object.entries(where).forEach(([field, condition]) => {
    if (typeof condition === 'object' && condition !== null) {
      Object.entries(condition).forEach(([operator, value]) => {
        query.where(field, operator, value)
      })
    } else {
      query.where(field, '=', condition)
    }
  })

  // 添加排序
  if (orderBy) {
    if (Array.isArray(orderBy)) {
      orderBy.forEach(({ field, direction }) => {
        query.orderBy(field, direction)
      })
    } else {
      query.orderBy(orderBy.field, orderBy.direction)
    }
  }

  // 添加分页
  if (limit) query.limit(limit)
  if (offset) query.offset(offset)

  // 添加字段选择
  if (select) query.select(select)

  return query.execute()
}

/**
 * 聚合查询函数
 * @param {Object} options - 聚合选项
 * @returns {Object} 聚合结果
 */
export const aggregateTransactions = (options = {}) => {
  const {
    groupBy = null,
    having = {},
    functions = {}
  } = options

  const transactions = getAllTransactions()
  
  if (!groupBy) {
    // 全局聚合
    return calculateAggregates(transactions, functions)
  }

  // 分组聚合
  const groups = {}
  transactions.forEach(transaction => {
    const key = Array.isArray(groupBy) 
      ? groupBy.map(field => transaction[field]).join('|')
      : transaction[groupBy]
    
    if (!groups[key]) {
      groups[key] = []
    }
    groups[key].push(transaction)
  })

  const results = {}
  Object.entries(groups).forEach(([key, groupTransactions]) => {
    results[key] = calculateAggregates(groupTransactions, functions)
  })

  return results
}

/**
 * 计算聚合函数
 * @param {Array} transactions - 交易记录数组
 * @param {Object} functions - 聚合函数配置
 * @returns {Object} 聚合结果
 */
const calculateAggregates = (transactions, functions) => {
  const result = {
    count: transactions.length
  }

  Object.entries(functions).forEach(([alias, config]) => {
    const { func, field } = config
    const values = transactions.map(t => t[field]).filter(v => v !== null && v !== undefined)

    switch (func.toUpperCase()) {
      case 'SUM':
        result[alias] = values.reduce((sum, val) => sum + (Number(val) || 0), 0)
        break
      case 'AVG':
        result[alias] = values.length > 0 
          ? values.reduce((sum, val) => sum + (Number(val) || 0), 0) / values.length 
          : 0
        break
      case 'MAX':
        result[alias] = values.length > 0 ? Math.max(...values.map(Number)) : null
        break
      case 'MIN':
        result[alias] = values.length > 0 ? Math.min(...values.map(Number)) : null
        break
      case 'COUNT':
        result[alias] = values.length
        break
    }
  })

  return result
}

// ==================== 事务管理和数据一致性 ====================

/**
 * 事务管理器
 */
class TransactionManager {
  constructor() {
    this.isInTransaction = false
    this.transactionData = null
    this.transactionIndexes = null
  }

  /**
   * 开始事务
   */
  begin() {
    if (this.isInTransaction) {
      throw new Error('Transaction already in progress')
    }
    
    this.isInTransaction = true
    this.transactionData = [...getAllTransactions()]
    this.transactionIndexes = { ...getIndexes() }
  }

  /**
   * 提交事务
   */
  commit() {
    if (!this.isInTransaction) {
      throw new Error('No transaction in progress')
    }
    
    // 事务已经应用到实际数据，只需清理
    this.cleanup()
  }

  /**
   * 回滚事务
   */
  rollback() {
    if (!this.isInTransaction) {
      throw new Error('No transaction in progress')
    }
    
    // 恢复原始数据
    localStorage.setItem(DB_KEYS.TRANSACTIONS, JSON.stringify(this.transactionData))
    localStorage.setItem(DB_KEYS.INDEXES, JSON.stringify(this.transactionIndexes))
    
    this.cleanup()
  }

  /**
   * 清理事务状态
   */
  cleanup() {
    this.isInTransaction = false
    this.transactionData = null
    this.transactionIndexes = null
  }

  /**
   * 检查是否在事务中
   */
  inTransaction() {
    return this.isInTransaction
  }
}

// 全局事务管理器实例
const transactionManager = new TransactionManager()

/**
 * 执行事务
 * @param {Function} callback - 事务回调函数
 * @returns {*} 回调函数的返回值
 */
export const executeTransaction = async (callback) => {
  transactionManager.begin()
  
  try {
    const result = await callback()
    transactionManager.commit()
    return result
  } catch (error) {
    transactionManager.rollback()
    throw error
  }
}

// ==================== 批量操作接口 ====================

/**
 * 批量插入交易记录
 * @param {Array} transactions - 交易记录数组
 * @returns {Array} 插入的交易记录（包含生成的ID）
 */
export const batchInsertTransactions = (transactions) => {
  return executeTransaction(() => {
    const results = []
    const existingTransactions = getAllTransactions()
    
    transactions.forEach(transaction => {
      // 生成交易ID
      const date = transaction.date || new Date().toISOString().split('T')[0]
      const sequence = existingTransactions.filter(t => t.date === date && t.type === transaction.type).length + results.filter(t => t.date === date && t.type === transaction.type).length + 1
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
        supplier: transaction.supplier || '',
        status: transaction.status || 'COMPLETED',
        description: transaction.description || '',
        createTime: new Date().toISOString()
      }
      
      results.push(newTransaction)
      existingTransactions.push(newTransaction)
      
      // 记录变更日志
      incrementalUpdateManager.logChange('INSERT', newTransaction.id, newTransaction)
    })
    
    // 按日期和时间排序
    existingTransactions.sort((a, b) => {
      const dateCompare = new Date(a.date) - new Date(b.date)
      if (dateCompare !== 0) return dateCompare
      return a.time.localeCompare(b.time)
    })
    
    // 保存到本地存储
    localStorage.setItem(DB_KEYS.TRANSACTIONS, JSON.stringify(existingTransactions))
    localStorage.setItem(DB_KEYS.LAST_UPDATE, new Date().toISOString().split('T')[0])
    
    return results
  })
}

/**
 * 批量更新交易记录
 * @param {Array} updates - 更新数组，每个元素包含 {id, data}
 * @returns {Array} 更新后的交易记录
 */
export const batchUpdateTransactions = (updates) => {
  return executeTransaction(() => {
    const transactions = getAllTransactions()
    const results = []
    
    updates.forEach(({ id, data }) => {
      const index = transactions.findIndex(t => t.id === id)
      
      if (index !== -1) {
        const oldTransaction = { ...transactions[index] }
        
        // 更新交易记录
        transactions[index] = {
          ...transactions[index],
          ...data,
          updateTime: new Date().toISOString()
        }
        
        results.push(transactions[index])
        
        // 记录变更日志
        incrementalUpdateManager.logChange('UPDATE', id, {
          old: oldTransaction,
          new: transactions[index]
        })
      }
    })
    
    // 保存到本地存储
    localStorage.setItem(DB_KEYS.TRANSACTIONS, JSON.stringify(transactions))
    localStorage.setItem(DB_KEYS.LAST_UPDATE, new Date().toISOString().split('T')[0])
    
    return results
  })
}

/**
 * 批量删除交易记录
 * @param {Array} ids - 要删除的交易ID数组
 * @returns {number} 删除的记录数量
 */
export const batchDeleteTransactions = (ids) => {
  return executeTransaction(() => {
    const transactions = getAllTransactions()
    let deletedCount = 0
    
    // 按ID倒序删除，避免索引变化问题
    const indicesToDelete = []
    ids.forEach(id => {
      const index = transactions.findIndex(t => t.id === id)
      if (index !== -1) {
        indicesToDelete.push({ index, transaction: transactions[index] })
      }
    })
    
    // 按索引降序排序
    indicesToDelete.sort((a, b) => b.index - a.index)
    
    // 执行删除
    indicesToDelete.forEach(({ index, transaction }) => {
      transactions.splice(index, 1)
      deletedCount++
      
      // 记录变更日志
      incrementalUpdateManager.logChange('DELETE', transaction.id, transaction)
    })
    
    // 保存到本地存储
    localStorage.setItem(DB_KEYS.TRANSACTIONS, JSON.stringify(transactions))
    localStorage.setItem(DB_KEYS.LAST_UPDATE, new Date().toISOString().split('T')[0])
    
    return deletedCount
  })
}

// ==================== 数据验证和约束 ====================

/**
 * 数据验证规则
 */
const VALIDATION_RULES = {
  id: {
    required: true,
    type: 'string',
    pattern: /^TXN\d{13}$/
  },
  date: {
    required: true,
    type: 'string',
    validator: (value) => {
      const date = new Date(value)
      return !isNaN(date.getTime())
    }
  },
  type: {
    required: true,
    type: 'string',
    enum: ['收入', '支出']
  },
  amount: {
    required: true,
    type: 'number',
    min: 0
  },
  productName: {
    required: true,
    type: 'string',
    minLength: 1
  },
  category: {
    required: true,
    type: 'string',
    minLength: 1
  },
  supplier: {
    required: false,
    type: 'string'
  },
  notes: {
    required: false,
    type: 'string'
  }
}

/**
 * 验证交易记录
 * @param {Object} transaction - 交易记录
 * @returns {Object} 验证结果 {valid: boolean, errors: Array}
 */
export const validateTransaction = (transaction) => {
  const errors = []
  
  Object.entries(VALIDATION_RULES).forEach(([field, rules]) => {
    const value = transaction[field]
    
    // 检查必填字段
    if (rules.required && (value === undefined || value === null || value === '')) {
      errors.push(`字段 '${field}' 是必填的`)
      return
    }
    
    // 如果字段为空且非必填，跳过其他验证
    if (!rules.required && (value === undefined || value === null || value === '')) {
      return
    }
    
    // 类型检查
    if (rules.type && typeof value !== rules.type) {
      errors.push(`字段 '${field}' 类型应为 ${rules.type}，实际为 ${typeof value}`)
      return
    }
    
    // 枚举值检查
    if (rules.enum && !rules.enum.includes(value)) {
      errors.push(`字段 '${field}' 值应为 [${rules.enum.join(', ')}] 中的一个`)
    }
    
    // 最小值检查
    if (rules.min !== undefined && value < rules.min) {
      errors.push(`字段 '${field}' 值不能小于 ${rules.min}`)
    }
    
    // 最小长度检查
    if (rules.minLength !== undefined && value.length < rules.minLength) {
      errors.push(`字段 '${field}' 长度不能小于 ${rules.minLength}`)
    }
    
    // 正则表达式检查
    if (rules.pattern && !rules.pattern.test(value)) {
      errors.push(`字段 '${field}' 格式不正确`)
    }
    
    // 自定义验证器
    if (rules.validator && !rules.validator(value)) {
      errors.push(`字段 '${field}' 验证失败`)
    }
  })
  
  return {
    valid: errors.length === 0,
    errors
  }
}

// ==================== 性能监控 ====================

/**
 * 性能监控器
 */
class PerformanceMonitor {
  constructor() {
    this.metrics = {
      queryCount: 0,
      indexHits: 0,
      indexMisses: 0,
      avgQueryTime: 0,
      totalQueryTime: 0
    }
  }

  /**
   * 记录查询开始
   */
  startQuery() {
    return performance.now()
  }

  /**
   * 记录查询结束
   * @param {number} startTime - 查询开始时间
   * @param {boolean} indexUsed - 是否使用了索引
   */
  endQuery(startTime, indexUsed = false) {
    const duration = performance.now() - startTime
    
    this.metrics.queryCount++
    this.metrics.totalQueryTime += duration
    this.metrics.avgQueryTime = this.metrics.totalQueryTime / this.metrics.queryCount
    
    if (indexUsed) {
      this.metrics.indexHits++
    } else {
      this.metrics.indexMisses++
    }
  }

  /**
   * 获取性能指标
   */
  getMetrics() {
    return {
      ...this.metrics,
      indexHitRate: this.metrics.queryCount > 0 
        ? (this.metrics.indexHits / this.metrics.queryCount * 100).toFixed(2) + '%'
        : '0%'
    }
  }

  /**
   * 重置性能指标
   */
  reset() {
    this.metrics = {
      queryCount: 0,
      indexHits: 0,
      indexMisses: 0,
      avgQueryTime: 0,
      totalQueryTime: 0
    }
  }
}

// 全局性能监控器实例
const performanceMonitor = new PerformanceMonitor()

/**
 * 获取性能指标
 * @returns {Object} 性能指标
 */
export const getPerformanceMetrics = () => {
  return performanceMonitor.getMetrics()
}

/**
 * 重置性能指标
 */
export const resetPerformanceMetrics = () => {
  performanceMonitor.reset()
}

// ==================== 缓存策略和增量更新 ====================

/**
 * 缓存管理器
 */
class CacheManager {
  constructor() {
    this.cache = new Map()
    this.cacheConfig = {
      maxSize: 100, // 最大缓存条目数
      ttl: 5 * 60 * 1000, // 5分钟TTL
      enableLRU: true // 启用LRU淘汰策略
    }
    this.accessOrder = new Map() // LRU访问顺序
  }

  /**
   * 生成缓存键
   * @param {string} type - 缓存类型
   * @param {Object} params - 查询参数
   * @returns {string} 缓存键
   */
  generateKey(type, params) {
    return `${type}:${JSON.stringify(params)}`
  }

  /**
   * 获取缓存
   * @param {string} key - 缓存键
   * @returns {*} 缓存值或null
   */
  get(key) {
    const entry = this.cache.get(key)
    
    if (!entry) {
      return null
    }
    
    // 检查TTL
    if (Date.now() > entry.expiry) {
      this.cache.delete(key)
      this.accessOrder.delete(key)
      return null
    }
    
    // 更新LRU访问顺序
    if (this.cacheConfig.enableLRU) {
      this.accessOrder.delete(key)
      this.accessOrder.set(key, Date.now())
    }
    
    return entry.value
  }

  /**
   * 设置缓存
   * @param {string} key - 缓存键
   * @param {*} value - 缓存值
   */
  set(key, value) {
    // 检查缓存大小限制
    if (this.cache.size >= this.cacheConfig.maxSize) {
      this.evictLRU()
    }
    
    const entry = {
      value,
      expiry: Date.now() + this.cacheConfig.ttl,
      createdAt: Date.now()
    }
    
    this.cache.set(key, entry)
    
    if (this.cacheConfig.enableLRU) {
      this.accessOrder.set(key, Date.now())
    }
  }

  /**
   * 淘汰最近最少使用的缓存项
   */
  evictLRU() {
    if (this.accessOrder.size === 0) {
      // 如果没有访问记录，删除第一个缓存项
      const firstKey = this.cache.keys().next().value
      if (firstKey) {
        this.cache.delete(firstKey)
      }
      return
    }
    
    // 找到最少使用的键
    let oldestKey = null
    let oldestTime = Infinity
    
    for (const [key, time] of this.accessOrder) {
      if (time < oldestTime) {
        oldestTime = time
        oldestKey = key
      }
    }
    
    if (oldestKey) {
      this.cache.delete(oldestKey)
      this.accessOrder.delete(oldestKey)
    }
  }

  /**
   * 清除缓存
   * @param {string} pattern - 清除模式（可选）
   */
  clear(pattern = null) {
    if (!pattern) {
      this.cache.clear()
      this.accessOrder.clear()
      return
    }
    
    // 按模式清除
    const keysToDelete = []
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        keysToDelete.push(key)
      }
    }
    
    keysToDelete.forEach(key => {
      this.cache.delete(key)
      this.accessOrder.delete(key)
    })
  }

  /**
   * 获取缓存统计信息
   */
  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.cacheConfig.maxSize,
      hitRate: this.hitCount / (this.hitCount + this.missCount) || 0,
      entries: Array.from(this.cache.keys())
    }
  }
}

// 全局缓存管理器实例
const cacheManager = new CacheManager()

/**
 * 增量更新管理器
 */
class IncrementalUpdateManager {
  constructor() {
    this.lastUpdateTime = this.getLastUpdateTime()
    this.changeLog = this.loadChangeLog()
  }

  /**
   * 获取最后更新时间
   */
  getLastUpdateTime() {
    const stored = localStorage.getItem(EXTENDED_DB_KEYS.LAST_UPDATE)
    return stored ? parseInt(stored) : 0
  }

  /**
   * 设置最后更新时间
   */
  setLastUpdateTime(timestamp = Date.now()) {
    this.lastUpdateTime = timestamp
    localStorage.setItem(EXTENDED_DB_KEYS.LAST_UPDATE, timestamp.toString())
  }

  /**
   * 加载变更日志
   */
  loadChangeLog() {
    const stored = localStorage.getItem(EXTENDED_DB_KEYS.CHANGE_LOG)
    return stored ? JSON.parse(stored) : []
  }

  /**
   * 保存变更日志
   */
  saveChangeLog() {
    localStorage.setItem(EXTENDED_DB_KEYS.CHANGE_LOG, JSON.stringify(this.changeLog))
  }

  /**
   * 记录变更
   * @param {string} operation - 操作类型 (INSERT, UPDATE, DELETE)
   * @param {string} id - 记录ID
   * @param {Object} data - 变更数据
   */
  logChange(operation, id, data = null) {
    const change = {
      id: `CHG${Date.now()}${Math.random().toString(36).substr(2, 5)}`,
      operation,
      recordId: id,
      data,
      timestamp: Date.now()
    }
    
    this.changeLog.push(change)
    
    // 限制变更日志大小
    if (this.changeLog.length > 1000) {
      this.changeLog = this.changeLog.slice(-500) // 保留最近500条
    }
    
    this.saveChangeLog()
    this.setLastUpdateTime()
    
    // 清除相关缓存
    cacheManager.clear('query')
    cacheManager.clear('aggregate')
  }

  /**
   * 获取增量变更
   * @param {number} since - 起始时间戳
   * @returns {Array} 变更列表
   */
  getIncrementalChanges(since) {
    return this.changeLog.filter(change => change.timestamp > since)
  }

  /**
   * 应用增量变更
   * @param {Array} changes - 变更列表
   */
  applyIncrementalChanges(changes) {
    changes.forEach(change => {
      switch (change.operation) {
        case 'INSERT':
          // 插入操作已经在addTransaction中处理
          break
        case 'UPDATE':
          // 更新操作已经在updateTransaction中处理
          break
        case 'DELETE':
          // 删除操作已经在deleteTransaction中处理
          break
      }
    })
  }

  /**
   * 清理过期的变更日志
   * @param {number} maxAge - 最大保留时间（毫秒）
   */
  cleanupChangeLog(maxAge = 7 * 24 * 60 * 60 * 1000) { // 默认7天
    const cutoff = Date.now() - maxAge
    this.changeLog = this.changeLog.filter(change => change.timestamp > cutoff)
    this.saveChangeLog()
  }
}

// 更新DB_KEYS以包含新的键
const EXTENDED_DB_KEYS = {
  ...DB_KEYS,
  LAST_UPDATE: 'farmer_notebook_last_update',
  CHANGE_LOG: 'farmer_notebook_change_log',
  CACHE_CONFIG: 'farmer_notebook_cache_config'
}

// 全局增量更新管理器实例
const incrementalUpdateManager = new IncrementalUpdateManager()

/**
 * 带缓存的查询函数
 * @param {Object} options - 查询选项
 * @returns {Array} 查询结果
 */
export const cachedSelectTransactions = (options = {}) => {
  const cacheKey = cacheManager.generateKey('query', options)
  
  // 尝试从缓存获取
  let result = cacheManager.get(cacheKey)
  if (result !== null) {
    return result
  }
  
  // 执行查询
  result = selectTransactions(options)
  
  // 缓存结果
  cacheManager.set(cacheKey, result)
  
  return result
}

/**
 * 带缓存的聚合查询函数
 * @param {Object} options - 聚合选项
 * @returns {Object} 聚合结果
 */
export const cachedAggregateTransactions = (options = {}) => {
  const cacheKey = cacheManager.generateKey('aggregate', options)
  
  // 尝试从缓存获取
  let result = cacheManager.get(cacheKey)
  if (result !== null) {
    return result
  }
  
  // 执行聚合查询
  result = aggregateTransactions(options)
  
  // 缓存结果
  cacheManager.set(cacheKey, result)
  
  return result
}

/**
 * 获取缓存统计信息
 * @returns {Object} 缓存统计
 */
export const getCacheStats = () => {
  return cacheManager.getStats()
}

/**
 * 清除缓存
 * @param {string} pattern - 清除模式（可选）
 */
export const clearCache = (pattern = null) => {
  cacheManager.clear(pattern)
}

/**
 * 获取增量变更
 * @param {number} since - 起始时间戳
 * @returns {Array} 变更列表
 */
export const getIncrementalChanges = (since) => {
  return incrementalUpdateManager.getIncrementalChanges(since)
}

/**
 * 获取最后更新时间
 * @returns {number} 时间戳
 */
export const getLastUpdateTime = () => {
  return incrementalUpdateManager.getLastUpdateTime()
}

/**
 * 清理变更日志
 */
export const cleanupChangeLog = () => {
  incrementalUpdateManager.cleanupChangeLog()
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
    const transactionYear = transactionDate.getFullYear()
    const transactionWeek = getWeekNumber(transactionDate)
    const transactionDayOfWeek = transactionDate.getDay()
    const adjustedDayOfWeek = transactionDayOfWeek === 0 ? 7 : transactionDayOfWeek
    
    // 只包含当前年份、当前周、且不晚于当前日期的交易
    return transactionYear === currentInfo.year && 
           transactionWeek === currentInfo.week && 
           transactionDate <= currentDate
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
  
  // 显示最近的几条交易记录（按时间倒序排列）
  console.log('最近的交易记录:')
  const sortedTransactions = transactions
    .sort((a, b) => {
      const dateTimeA = new Date(`${a.date}T${a.time}`)
      const dateTimeB = new Date(`${b.date}T${b.time}`)
      return dateTimeB - dateTimeA // 倒序排列，最新的在前
    })
    .slice(0, 5) // 取前6条最新记录
  
  sortedTransactions.forEach(t => {
    console.log(`  ${t.date} ${t.time} ${t.type} ${t.productName} ¥${t.amount}`)
  })
}
// 导出 getWeekNumber 函数
// 兼容性函数 - 为了保持与warehouse_data.js的兼容性
export const getWarehouseData = () => {
  return {
    records: getAllTransactions()
  }
}

export { getWeekNumber }
