/**
 * Mock系统统一日志管理器
 * 提供可配置的日志级别和输出控制
 */

// 日志级别定义
const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3,
  TRACE: 4
}

// 日志级别名称映射
const LEVEL_NAMES = {
  [LOG_LEVELS.ERROR]: 'ERROR',
  [LOG_LEVELS.WARN]: 'WARN',
  [LOG_LEVELS.INFO]: 'INFO',
  [LOG_LEVELS.DEBUG]: 'DEBUG',
  [LOG_LEVELS.TRACE]: 'TRACE'
}

// 日志配置
const LOG_CONFIG = {
  // 当前日志级别（只输出此级别及以上的日志）
  level: LOG_LEVELS.DEBUG,
  
  // 是否启用日志输出
  enabled: true,
  
  // 是否显示时间戳
  showTimestamp: true,
  
  // 是否显示模块名称
  showModule: true,
  
  // 日志输出格式
  format: 'console', // 'console' | 'json' | 'simple'
  
  // 模块过滤器（只输出指定模块的日志，空数组表示输出所有）
  moduleFilter: []
}

/**
 * 日志管理器类
 */
class Logger {
  constructor(moduleName = 'MOCK') {
    this.moduleName = moduleName
  }

  /**
   * 检查是否应该输出日志
   * @param {number} level - 日志级别
   * @returns {boolean}
   */
  shouldLog(level) {
    if (!LOG_CONFIG.enabled) return false
    if (level > LOG_CONFIG.level) return false
    if (LOG_CONFIG.moduleFilter.length > 0 && !LOG_CONFIG.moduleFilter.includes(this.moduleName)) {
      return false
    }
    return true
  }

  /**
   * 格式化日志消息
   * @param {number} level - 日志级别
   * @param {string} message - 日志消息
   * @param {any[]} args - 额外参数
   * @returns {string}
   */
  formatMessage(level, message, args) {
    const parts = []
    
    // 添加时间戳
    if (LOG_CONFIG.showTimestamp) {
      const timestamp = new Date().toISOString()
      parts.push(`[${timestamp}]`)
    }
    
    // 添加日志级别
    parts.push(`[${LEVEL_NAMES[level]}]`)
    
    // 添加模块名称
    if (LOG_CONFIG.showModule) {
      parts.push(`[${this.moduleName}]`)
    }
    
    // 添加消息
    parts.push(message)
    
    return parts.join(' ')
  }

  /**
   * 输出日志
   * @param {number} level - 日志级别
   * @param {string} message - 日志消息
   * @param {...any} args - 额外参数
   */
  log(level, message, ...args) {
    if (!this.shouldLog(level)) return

    const formattedMessage = this.formatMessage(level, message, args)
    
    switch (LOG_CONFIG.format) {
      case 'json':
        console.log(JSON.stringify({
          timestamp: new Date().toISOString(),
          level: LEVEL_NAMES[level],
          module: this.moduleName,
          message,
          args: args.length > 0 ? args : undefined
        }))
        break
        
      case 'simple':
        console.log(message, ...args)
        break
        
      case 'console':
      default:
        // 根据日志级别选择合适的console方法
        switch (level) {
          case LOG_LEVELS.ERROR:
            console.error(formattedMessage, ...args)
            break
          case LOG_LEVELS.WARN:
            console.warn(formattedMessage, ...args)
            break
          case LOG_LEVELS.INFO:
            console.info(formattedMessage, ...args)
            break
          case LOG_LEVELS.DEBUG:
          case LOG_LEVELS.TRACE:
          default:
            console.log(formattedMessage, ...args)
            break
        }
        break
    }
  }

  /**
   * 错误日志
   * @param {string} message - 日志消息
   * @param {...any} args - 额外参数
   */
  error(message, ...args) {
    this.log(LOG_LEVELS.ERROR, message, ...args)
  }

  /**
   * 警告日志
   * @param {string} message - 日志消息
   * @param {...any} args - 额外参数
   */
  warn(message, ...args) {
    this.log(LOG_LEVELS.WARN, message, ...args)
  }

  /**
   * 信息日志
   * @param {string} message - 日志消息
   * @param {...any} args - 额外参数
   */
  info(message, ...args) {
    this.log(LOG_LEVELS.INFO, message, ...args)
  }

  /**
   * 调试日志
   * @param {string} message - 日志消息
   * @param {...any} args - 额外参数
   */
  debug(message, ...args) {
    this.log(LOG_LEVELS.DEBUG, message, ...args)
  }

  /**
   * 跟踪日志
   * @param {string} message - 日志消息
   * @param {...any} args - 额外参数
   */
  trace(message, ...args) {
    this.log(LOG_LEVELS.TRACE, message, ...args)
  }

  /**
   * 分组日志开始
   * @param {string} label - 分组标签
   */
  group(label) {
    if (this.shouldLog(LOG_LEVELS.DEBUG)) {
      console.group(this.formatMessage(LOG_LEVELS.DEBUG, label))
    }
  }

  /**
   * 分组日志结束
   */
  groupEnd() {
    if (this.shouldLog(LOG_LEVELS.DEBUG)) {
      console.groupEnd()
    }
  }

  /**
   * 表格日志
   * @param {any} data - 表格数据
   */
  table(data) {
    if (this.shouldLog(LOG_LEVELS.DEBUG)) {
      console.table(data)
    }
  }
}

/**
 * 创建日志实例
 * @param {string} moduleName - 模块名称
 * @returns {Logger}
 */
export const createLogger = (moduleName) => {
  return new Logger(moduleName)
}

/**
 * 配置日志系统
 * @param {Object} config - 配置选项
 */
export const configureLogger = (config) => {
  Object.assign(LOG_CONFIG, config)
}

/**
 * 获取当前日志配置
 * @returns {Object}
 */
export const getLoggerConfig = () => {
  return { ...LOG_CONFIG }
}

/**
 * 设置日志级别
 * @param {number|string} level - 日志级别
 */
export const setLogLevel = (level) => {
  if (typeof level === 'string') {
    const levelValue = Object.entries(LEVEL_NAMES).find(([, name]) => name === level.toUpperCase())?.[0]
    if (levelValue !== undefined) {
      LOG_CONFIG.level = parseInt(levelValue)
    }
  } else if (typeof level === 'number') {
    LOG_CONFIG.level = level
  }
}

/**
 * 启用/禁用日志输出
 * @param {boolean} enabled - 是否启用
 */
export const setLogEnabled = (enabled) => {
  LOG_CONFIG.enabled = enabled
}

/**
 * 设置模块过滤器
 * @param {string[]} modules - 模块名称数组
 */
export const setModuleFilter = (modules) => {
  LOG_CONFIG.moduleFilter = modules
}

// 导出日志级别常量
export { LOG_LEVELS }

// 默认日志实例
export const logger = createLogger('MOCK')