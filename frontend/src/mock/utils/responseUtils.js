/**
 * API响应格式标准化工具
 * 提供统一的响应格式和错误处理机制
 */

import { createLogger } from './logger.js';

const logger = createLogger('RESPONSE_UTILS');

/**
 * 标准API响应格式
 * @typedef {Object} ApiResponse
 * @property {number} error - 错误码 (0表示成功，非0表示失败)
 * @property {any} body - 响应数据 (成功时包含数据，失败时为null)
 * @property {string} message - 响应消息
 * @property {number} [timestamp] - 响应时间戳
 * @property {string} [requestId] - 请求ID (用于追踪)
 */

/**
 * 错误码定义
 */
export const ERROR_CODES = {
  SUCCESS: 0,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  VALIDATION_ERROR: 422,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
  NETWORK_ERROR: 1001,
  TIMEOUT_ERROR: 1002,
  BUSINESS_ERROR: 2000
};

/**
 * 错误消息模板
 */
export const ERROR_MESSAGES = {
  [ERROR_CODES.BAD_REQUEST]: '请求参数错误',
  [ERROR_CODES.UNAUTHORIZED]: '未授权访问',
  [ERROR_CODES.FORBIDDEN]: '禁止访问',
  [ERROR_CODES.NOT_FOUND]: '资源不存在',
  [ERROR_CODES.METHOD_NOT_ALLOWED]: '请求方法不允许',
  [ERROR_CODES.CONFLICT]: '资源冲突',
  [ERROR_CODES.VALIDATION_ERROR]: '数据验证失败',
  [ERROR_CODES.INTERNAL_SERVER_ERROR]: '服务器内部错误',
  [ERROR_CODES.SERVICE_UNAVAILABLE]: '服务不可用',
  [ERROR_CODES.NETWORK_ERROR]: '网络连接失败',
  [ERROR_CODES.TIMEOUT_ERROR]: '请求超时',
  [ERROR_CODES.BUSINESS_ERROR]: '业务逻辑错误'
};

/**
 * 生成请求ID
 * @returns {string} 唯一请求ID
 */
export const generateRequestId = () => {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * 创建标准化的API响应
 * @param {number} error - 错误码
 * @param {any} body - 响应数据
 * @param {string} message - 响应消息
 * @param {Object} options - 额外选项
 * @param {boolean} options.includeTimestamp - 是否包含时间戳
 * @param {boolean} options.includeRequestId - 是否包含请求ID
 * @returns {ApiResponse} 标准化响应对象
 */
export const createStandardResponse = (
  error = ERROR_CODES.SUCCESS,
  body = null,
  message = '',
  options = {}
) => {
  const { includeTimestamp = true, includeRequestId = false } = options;
  
  const response = {
    error,
    body,
    message: message || (error === ERROR_CODES.SUCCESS ? '操作成功' : ERROR_MESSAGES[error] || '未知错误')
  };

  if (includeTimestamp) {
    response.timestamp = Date.now();
  }

  if (includeRequestId) {
    response.requestId = generateRequestId();
  }

  logger.debug('创建标准响应:', { error, bodyType: typeof body, message });
  return response;
};

/**
 * 创建成功响应
 * @param {any} data - 响应数据
 * @param {string} message - 成功消息
 * @param {Object} options - 额外选项
 * @returns {ApiResponse} 成功响应
 */
export const createSuccessResponse = (data = null, message = '操作成功', options = {}) => {
  return createStandardResponse(ERROR_CODES.SUCCESS, data, message, options);
};

/**
 * 创建错误响应
 * @param {number} errorCode - 错误码
 * @param {string} message - 错误消息
 * @param {Object} options - 额外选项
 * @returns {ApiResponse} 错误响应
 */
export const createErrorResponse = (errorCode, message = '', options = {}) => {
  return createStandardResponse(errorCode, null, message, options);
};

/**
 * 创建分页响应
 * @param {Array} list - 数据列表
 * @param {Object} pagination - 分页信息
 * @param {number} pagination.page - 当前页码
 * @param {number} pagination.pageSize - 每页大小
 * @param {number} pagination.total - 总记录数
 * @param {string} message - 响应消息
 * @param {Object} options - 额外选项
 * @returns {ApiResponse} 分页响应
 */
export const createPaginationResponse = (
  list = [],
  pagination = {},
  message = '获取成功',
  options = {}
) => {
  const { page = 1, pageSize = 10, total = 0 } = pagination;
  
  const paginationData = {
    list,
    pagination: {
      page: Number(page),
      pageSize: Number(pageSize),
      total: Number(total),
      totalPages: Math.ceil(total / pageSize),
      hasNext: page * pageSize < total,
      hasPrev: page > 1
    }
  };

  return createSuccessResponse(paginationData, message, options);
};

/**
 * 创建带延迟的Mock响应
 * @param {number} error - 错误码
 * @param {any} body - 响应数据
 * @param {string} message - 响应消息
 * @param {number} delay - 延迟时间（毫秒）
 * @param {Object} options - 额外选项
 * @returns {Promise<ApiResponse>} Mock响应Promise
 */
export const createMockResponse = (
  error = ERROR_CODES.SUCCESS,
  body = null,
  message = '',
  delay = 500,
  options = {}
) => {
  logger.debug('创建Mock响应:', { error, bodyType: typeof body, message, delay });
  
  return new Promise((resolve) => {
    setTimeout(() => {
      const response = createStandardResponse(error, body, message, options);
      logger.trace('Mock响应已生成:', response);
      resolve(response);
    }, delay);
  });
};

/**
 * 创建成功的Mock响应
 * @param {any} data - 响应数据
 * @param {string} message - 成功消息
 * @param {number} delay - 延迟时间
 * @param {Object} options - 额外选项
 * @returns {Promise<ApiResponse>} 成功Mock响应
 */
export const createMockSuccessResponse = (data = null, message = '操作成功', delay = 500, options = {}) => {
  return createMockResponse(ERROR_CODES.SUCCESS, data, message, delay, options);
};

/**
 * 创建错误的Mock响应
 * @param {number} errorCode - 错误码
 * @param {string} message - 错误消息
 * @param {number} delay - 延迟时间
 * @param {Object} options - 额外选项
 * @returns {Promise<ApiResponse>} 错误Mock响应
 */
export const createMockErrorResponse = (errorCode, message = '', delay = 500, options = {}) => {
  return createMockResponse(errorCode, null, message, delay, options);
};

/**
 * 验证响应格式是否符合标准
 * @param {any} response - 待验证的响应对象
 * @returns {boolean} 是否符合标准格式
 */
export const validateResponseFormat = (response) => {
  if (!response || typeof response !== 'object') {
    return false;
  }

  const hasRequiredFields = 
    typeof response.error === 'number' &&
    response.hasOwnProperty('body') &&
    typeof response.message === 'string';

  return hasRequiredFields;
};

/**
 * 格式化响应用于日志输出
 * @param {ApiResponse} response - 响应对象
 * @returns {string} 格式化的响应字符串
 */
export const formatResponseForLog = (response) => {
  if (!validateResponseFormat(response)) {
    return 'Invalid response format';
  }

  const { error, body, message } = response;
  const bodyInfo = body ? `[${typeof body}]` : 'null';
  
  return `Error: ${error}, Body: ${bodyInfo}, Message: "${message}"`;
};