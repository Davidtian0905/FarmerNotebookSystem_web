/**
 * Mock通用工具函数
 * 包含Mock模式控制、状态管理等工具函数
 */

/**
 * 检查是否使用Mock模式
 */
import { createLogger } from './utils/logger.js';

const logger = createLogger('UTILS');

export const isMockMode = () => {
  // 在开发环境下，如果没有明确设置，默认启用Mock模式
  const isDev = import.meta.env.DEV || process.env.NODE_ENV === 'development'
  if (isDev) {
    const mockSetting = localStorage.getItem('useMock')
    const result = mockSetting === null ? true : mockSetting === 'true'
    logger.debug('Mock模式检查:', {
      environment: isDev ? 'development' : 'production',
      mockSetting,
      result
    })
    if (mockSetting === null) {
      // 首次访问，默认启用Mock模式
      localStorage.setItem('useMock', 'true')
      return true
    }
    return result
  }
  // 在生产环境下，默认不启用Mock模式
  return false
}

/**
 * 切换Mock模式
 */
export const toggleMockMode = () => {
  const currentMode = localStorage.getItem('useMock') === 'true'
  logger.debug('切换Mock模式:', { from: currentMode, to: !currentMode });
  localStorage.setItem('useMock', (!currentMode).toString())
  logger.info('Mock模式已切换为:', !currentMode);
  return !currentMode
}

/**
 * 获取Mock模式状态
 */
export const getMockModeStatus = () => {
  return localStorage.getItem('useMock') === 'true'
}

/**
 * 设置Mock模式状态
 * @param {boolean} enabled - 是否启用Mock模式
 */
export const setMockMode = (enabled) => {
  localStorage.setItem('useMock', enabled.toString())
  return enabled
}

/**
 * 清除Mock模式设置
 */
export const clearMockMode = () => {
  localStorage.removeItem('useMock')
}

/**
 * 获取Mock模式配置信息
 */
export const getMockConfig = () => {
  return {
    enabled: isMockMode(),
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  }
}

/**
 * 模拟网络延迟
 * @param {number} ms - 延迟时间（毫秒）
 * @returns {Promise} 延迟Promise
 */
export const mockDelay = (ms = 500) => {
  logger.debug('Mock延迟:', ms + 'ms');
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 创建标准化的API响应对象
 * @param {number} error - 错误码 (0表示成功)
 * @param {any} body - 响应数据
 * @param {string} message - 响应消息
 * @returns {Object} 标准化响应对象
 */
export const createApiResponse = (error = 0, body = null, message = '') => {
  const response = {
    error,
    body,
    message
  };
  logger.debug('创建API响应:', response);
  return response;
};

/**
 * 创建Mock响应Promise
 * @param {number} error - 错误码
 * @param {any} body - 响应数据
 * @param {string} message - 响应消息
 * @param {number} delay - 延迟时间（毫秒）
 * @returns {Promise} Mock响应Promise
 */
export const createMockResponse = (error = 0, body = null, message = '', delay = 500) => {
  logger.debug('创建Mock响应:', { error, bodyType: typeof body, message, delay });
  return new Promise((resolve) => {
    setTimeout(() => {
      const response = createApiResponse(error, body, message);
      logger.trace('Mock响应已生成:', response);
      resolve(response);
    }, delay);
  });
};

/**
 * 模拟成功响应
 * @param {any} data - 响应数据
 * @param {string} message - 成功消息
 * @returns {Object} 成功响应
 */
export const createSuccessResponse = (data, message = '操作成功') => {
  return createApiResponse(0, data, message);
}

/**
 * 模拟错误响应
 * @param {number} errorCode - 错误码
 * @param {string} message - 错误消息
 * @returns {Object} 错误响应
 */
export const createErrorResponse = (errorCode, message) => {
  return createApiResponse(errorCode, null, message);
}

/**
 * 模拟网络错误
 * @param {string} message - 错误消息
 * @returns {Promise} 网络错误Promise
 */
export const mockNetworkError = (message = '网络连接失败') => {
  return Promise.reject(new Error(message))
}

/**
 * 模拟服务器错误
 * @param {string} message - 错误消息
 * @returns {Promise} 服务器错误Promise
 */
export const mockServerError = (message = '服务器内部错误') => {
  return Promise.resolve(createErrorResponse(500, message))
}

/**
 * 模拟认证错误
 * @param {string} message - 错误消息
 * @returns {Promise} 认证错误Promise
 */
export const mockAuthError = (message = '认证失败') => {
  return Promise.resolve(createErrorResponse(401, message))
}

/**
 * 模拟业务错误
 * @param {number} errorCode - 错误码
 * @param {string} message - 错误消息
 * @returns {Promise} 业务错误Promise
 */
export const mockBusinessError = (errorCode, message) => {
  return Promise.resolve(createErrorResponse(errorCode, message))
}

/**
 * 生成模拟ID
 * @param {string} prefix - ID前缀
 * @returns {string} 模拟ID
 */
export const generateMockId = (prefix = 'mock') => {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * 生成模拟时间戳
 * @param {number} daysAgo - 几天前
 * @returns {string} ISO时间戳
 */
export const generateMockTimestamp = (daysAgo = 0) => {
  const date = new Date()
  date.setDate(date.getDate() - daysAgo)
  return date.toISOString()
}

/**
 * 模拟分页数据
 * @param {Array} data - 原始数据
 * @param {number} page - 页码
 * @param {number} pageSize - 每页大小
 * @returns {Object} 分页数据
 */
export const createMockPagination = (data, page = 1, pageSize = 10) => {
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const list = data.slice(start, end)
  
  return {
    list,
    pagination: {
      page,
      pageSize,
      total: data.length,
      totalPages: Math.ceil(data.length / pageSize)
    }
  }
}

/**
 * 模拟搜索过滤
 * @param {Array} data - 原始数据
 * @param {string} keyword - 搜索关键词
 * @param {Array} fields - 搜索字段
 * @returns {Array} 过滤后的数据
 */
export const mockSearch = (data, keyword, fields = []) => {
  if (!keyword) return data
  
  return data.filter(item => {
    return fields.some(field => {
      const value = item[field]
      return value && value.toString().toLowerCase().includes(keyword.toLowerCase())
    })
  })
}

/**
 * 模拟数据排序
 * @param {Array} data - 原始数据
 * @param {string} field - 排序字段
 * @param {string} order - 排序方向 ('asc' | 'desc')
 * @returns {Array} 排序后的数据
 */
export const mockSort = (data, field, order = 'asc') => {
  return [...data].sort((a, b) => {
    const aValue = a[field]
    const bValue = b[field]
    
    if (order === 'desc') {
      return bValue > aValue ? 1 : -1
    }
    return aValue > bValue ? 1 : -1
  })
}