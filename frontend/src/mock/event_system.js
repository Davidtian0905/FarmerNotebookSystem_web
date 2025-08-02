/**
 * 事件驱动系统 - 处理交易事件和汇总数据更新
 * 实现事件发布订阅模式，确保交易数据变化时自动更新汇总数据
 */

// 事件类型定义
const EVENT_TYPES = {
  TRANSACTION_ADDED: 'transactionAdded',
  TRANSACTION_UPDATED: 'transactionUpdated',
  TRANSACTION_DELETED: 'transactionDeleted',
  SUMMARY_UPDATED: 'summaryUpdated',
  CACHE_INVALIDATED: 'cacheInvalidated'
}

// 事件监听器存储
const eventListeners = new Map()

/**
 * 事件系统类
 */
class EventSystem {
  constructor() {
    this.listeners = new Map()
    this.cache = new Map()
    this.cacheTimeout = 5 * 60 * 1000 // 5分钟缓存过期时间
  }

  /**
   * 添加事件监听器
   * @param {string} eventType - 事件类型
   * @param {Function} callback - 回调函数
   * @param {string} id - 监听器ID（可选）
   */
  on(eventType, callback, id = null) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Map())
    }
    
    const listenerId = id || `listener_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    this.listeners.get(eventType).set(listenerId, callback)
    
    return listenerId
  }

  /**
   * 移除事件监听器
   * @param {string} eventType - 事件类型
   * @param {string} listenerId - 监听器ID
   */
  off(eventType, listenerId) {
    if (this.listeners.has(eventType)) {
      this.listeners.get(eventType).delete(listenerId)
    }
  }

  /**
   * 触发事件
   * @param {string} eventType - 事件类型
   * @param {Object} data - 事件数据
   */
  emit(eventType, data = {}) {
    if (this.listeners.has(eventType)) {
      const callbacks = this.listeners.get(eventType)
      callbacks.forEach((callback, id) => {
        try {
          callback(data, eventType, id)
        } catch (error) {
          console.error(`事件监听器执行错误 [${eventType}]:`, error)
        }
      })
    }
    
    // 清除相关缓存
    this.invalidateCache(eventType, data)
  }

  /**
   * 清除缓存
   * @param {string} eventType - 事件类型
   * @param {Object} data - 事件数据
   */
  invalidateCache(eventType, data = {}) {
    // 根据事件类型清除相关缓存
    const cacheKeysToRemove = []
    
    this.cache.forEach((value, key) => {
      if (this.shouldInvalidateCache(key, eventType, data)) {
        cacheKeysToRemove.push(key)
      }
    })
    
    cacheKeysToRemove.forEach(key => {
      this.cache.delete(key)
    })
    
    // 触发缓存失效事件
    if (cacheKeysToRemove.length > 0) {
      this.emit(EVENT_TYPES.CACHE_INVALIDATED, {
        invalidatedKeys: cacheKeysToRemove,
        eventType,
        data
      })
    }
  }

  /**
   * 判断是否应该清除缓存
   * @param {string} cacheKey - 缓存键
   * @param {string} eventType - 事件类型
   * @param {Object} data - 事件数据
   * @returns {boolean} 是否应该清除缓存
   */
  shouldInvalidateCache(cacheKey, eventType, data) {
    // 交易相关事件清除所有汇总缓存
    if (eventType === EVENT_TYPES.TRANSACTION_ADDED ||
        eventType === EVENT_TYPES.TRANSACTION_UPDATED ||
        eventType === EVENT_TYPES.TRANSACTION_DELETED) {
      return cacheKey.startsWith('summary_') || cacheKey.startsWith('assets_')
    }
    
    return false
  }

  /**
   * 设置缓存
   * @param {string} key - 缓存键
   * @param {*} value - 缓存值
   * @param {number} timeout - 过期时间（毫秒）
   */
  setCache(key, value, timeout = this.cacheTimeout) {
    this.cache.set(key, {
      value,
      timestamp: Date.now(),
      timeout
    })
  }

  /**
   * 获取缓存
   * @param {string} key - 缓存键
   * @returns {*} 缓存值或null
   */
  getCache(key) {
    const cached = this.cache.get(key)
    
    if (!cached) {
      return null
    }
    
    // 检查是否过期
    if (Date.now() - cached.timestamp > cached.timeout) {
      this.cache.delete(key)
      return null
    }
    
    return cached.value
  }

  /**
   * 清除所有缓存
   */
  clearCache() {
    this.cache.clear()
  }

  /**
   * 获取缓存统计信息
   * @returns {Object} 缓存统计信息
   */
  getCacheStats() {
    return {
      totalEntries: this.cache.size,
      totalListeners: Array.from(this.listeners.values()).reduce((sum, listeners) => sum + listeners.size, 0),
      eventTypes: Array.from(this.listeners.keys())
    }
  }
}

// 创建全局事件系统实例
const eventSystem = new EventSystem()

/**
 * 交易事件处理器
 */
class TransactionEventHandler {
  constructor() {
    this.setupEventListeners()
  }

  /**
   * 设置事件监听器
   */
  setupEventListeners() {
    // 监听交易添加事件
    eventSystem.on(EVENT_TYPES.TRANSACTION_ADDED, (data) => {
      this.handleTransactionAdded(data)
    })

    // 监听交易更新事件
    eventSystem.on(EVENT_TYPES.TRANSACTION_UPDATED, (data) => {
      this.handleTransactionUpdated(data)
    })

    // 监听交易删除事件
    eventSystem.on(EVENT_TYPES.TRANSACTION_DELETED, (data) => {
      this.handleTransactionDeleted(data)
    })
  }

  /**
   * 处理交易添加事件
   * @param {Object} data - 事件数据
   */
  handleTransactionAdded(data) {
    console.log('交易添加事件:', data)
    
    // 触发汇总更新事件
    eventSystem.emit(EVENT_TYPES.SUMMARY_UPDATED, {
      type: 'transactionAdded',
      transaction: data.transaction,
      timestamp: new Date().toISOString()
    })
  }

  /**
   * 处理交易更新事件
   * @param {Object} data - 事件数据
   */
  handleTransactionUpdated(data) {
    console.log('交易更新事件:', data)
    
    // 触发汇总更新事件
    eventSystem.emit(EVENT_TYPES.SUMMARY_UPDATED, {
      type: 'transactionUpdated',
      transaction: data.transaction,
      oldTransaction: data.oldTransaction,
      timestamp: new Date().toISOString()
    })
  }

  /**
   * 处理交易删除事件
   * @param {Object} data - 事件数据
   */
  handleTransactionDeleted(data) {
    console.log('交易删除事件:', data)
    
    // 触发汇总更新事件
    eventSystem.emit(EVENT_TYPES.SUMMARY_UPDATED, {
      type: 'transactionDeleted',
      transactionId: data.transactionId,
      timestamp: new Date().toISOString()
    })
  }
}

/**
 * 汇总数据事件处理器
 */
class SummaryEventHandler {
  constructor() {
    this.setupEventListeners()
  }

  /**
   * 设置事件监听器
   */
  setupEventListeners() {
    // 监听汇总更新事件
    eventSystem.on(EVENT_TYPES.SUMMARY_UPDATED, (data) => {
      this.handleSummaryUpdated(data)
    })

    // 监听缓存失效事件
    eventSystem.on(EVENT_TYPES.CACHE_INVALIDATED, (data) => {
      this.handleCacheInvalidated(data)
    })
  }

  /**
   * 处理汇总更新事件
   * @param {Object} data - 事件数据
   */
  handleSummaryUpdated(data) {
    console.log('汇总更新事件:', data)
    
    // 这里可以添加UI更新逻辑
    // 例如：更新仪表板、刷新图表等
  }

  /**
   * 处理缓存失效事件
   * @param {Object} data - 事件数据
   */
  handleCacheInvalidated(data) {
    console.log('缓存失效事件:', data)
    
    // 这里可以添加缓存重建逻辑
  }
}

// 创建事件处理器实例
const transactionEventHandler = new TransactionEventHandler()
const summaryEventHandler = new SummaryEventHandler()

/**
 * 触发交易添加事件
 * @param {Object} transaction - 交易记录
 */
export const emitTransactionAdded = (transaction) => {
  eventSystem.emit(EVENT_TYPES.TRANSACTION_ADDED, {
    transaction,
    timestamp: new Date().toISOString()
  })
}

/**
 * 触发交易更新事件
 * @param {Object} transaction - 更新后的交易记录
 * @param {Object} oldTransaction - 更新前的交易记录
 */
export const emitTransactionUpdated = (transaction, oldTransaction) => {
  eventSystem.emit(EVENT_TYPES.TRANSACTION_UPDATED, {
    transaction,
    oldTransaction,
    timestamp: new Date().toISOString()
  })
}

/**
 * 触发交易删除事件
 * @param {string} transactionId - 交易记录ID
 */
export const emitTransactionDeleted = (transactionId) => {
  eventSystem.emit(EVENT_TYPES.TRANSACTION_DELETED, {
    transactionId,
    timestamp: new Date().toISOString()
  })
}

/**
 * 添加事件监听器
 * @param {string} eventType - 事件类型
 * @param {Function} callback - 回调函数
 * @param {string} id - 监听器ID（可选）
 * @returns {string} 监听器ID
 */
export const addEventListener = (eventType, callback, id = null) => {
  return eventSystem.on(eventType, callback, id)
}

/**
 * 移除事件监听器
 * @param {string} eventType - 事件类型
 * @param {string} listenerId - 监听器ID
 */
export const removeEventListener = (eventType, listenerId) => {
  eventSystem.off(eventType, listenerId)
}

/**
 * 设置缓存
 * @param {string} key - 缓存键
 * @param {*} value - 缓存值
 * @param {number} timeout - 过期时间（毫秒）
 */
export const setCache = (key, value, timeout = null) => {
  eventSystem.setCache(key, value, timeout)
}

/**
 * 获取缓存
 * @param {string} key - 缓存键
 * @returns {*} 缓存值或null
 */
export const getCache = (key) => {
  return eventSystem.getCache(key)
}

/**
 * 清除缓存
 * @param {string} key - 缓存键（可选，不传则清除所有缓存）
 */
export const clearCache = (key = null) => {
  if (key) {
    eventSystem.cache.delete(key)
  } else {
    eventSystem.clearCache()
  }
}

/**
 * 获取事件系统统计信息
 * @returns {Object} 统计信息
 */
export const getEventSystemStats = () => {
  return {
    cache: eventSystem.getCacheStats(),
    eventTypes: EVENT_TYPES
  }
}

/**
 * 调试函数：打印事件系统状态
 */
export const debugEventSystem = () => {
  console.log('=== 事件系统调试信息 ===')
  console.log('事件系统统计:', getEventSystemStats())
  console.log('缓存内容:', Array.from(eventSystem.cache.entries()))
  console.log('监听器:', Array.from(eventSystem.listeners.entries()))
  
  return getEventSystemStats()
} 