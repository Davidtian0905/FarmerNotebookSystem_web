/**
 * Mock API统一入口
 * 导出所有Mock API接口
 */

import { mockAssetsApi } from './assetsApi.js'
import { mockTransactionsApi } from './transactionsApi.js'
// 导入工具函数
import { createErrorResponse, ERROR_CODES, logger } from '../utils/index.js'

export { mockAssetsApi } from './assetsApi.js'
export { mockTransactionsApi } from './transactionsApi.js'

/**
 * Mock API路由映射
 * 将前端API调用映射到Mock API
 */
export const mockApiRouter = {
  // 资产相关API - 支持多种路径格式
  '/assets/summary': (params) => mockAssetsApi.getSummary(params),
  '/api/assets/summary': (params) => mockAssetsApi.getSummary(params),
  '/mock/assets/summary': (params) => mockAssetsApi.getSummary(params),
  '/assets/trend': (params) => mockAssetsApi.getTrend(params),
  '/api/assets/trend': (params) => mockAssetsApi.getTrend(params),
  '/mock/assets/trend': (params) => mockAssetsApi.getTrend(params),
  '/assets/income-expense': (params) => mockAssetsApi.getIncomeExpenseTrend(params),
  '/api/assets/income-expense': (params) => mockAssetsApi.getIncomeExpenseTrend(params),
  '/mock/assets/income-expense': (params) => mockAssetsApi.getIncomeExpenseTrend(params),
  
  // 交易记录相关API
  '/api/transactions/list': (params) => mockTransactionsApi.getList(params),
  '/api/transactions/add': (params) => mockTransactionsApi.add(params),
  '/api/transactions/update': (params) => mockTransactionsApi.update(params.id, params.updates),
  '/api/transactions/delete': (params) => mockTransactionsApi.delete(params.id),
  '/api/transactions/statistics': (params) => mockTransactionsApi.getStatistics(params)
}

/**
 * 处理Mock API请求
 * @param {string} url - API路径
 * @param {Object} params - 请求参数
 * @returns {Object} API响应
 */
export const handleMockApiRequest = (url, params = {}) => {
  // 标准化URL，移除查询参数
  let normalizedUrl = url
  if (url.includes('?')) {
    normalizedUrl = url.split('?')[0]
  }
  
  const handler = mockApiRouter[normalizedUrl]
  
  if (!handler) {
    return createErrorResponse(
      ERROR_CODES.NOT_FOUND,
      `未找到API接口: ${normalizedUrl}`
    )
  }
  
  try {
    const response = handler(params)
    return response
  } catch (error) {
    logger.error(`Mock API请求失败 [${normalizedUrl}]:`, error)
    return createErrorResponse(
      ERROR_CODES.INTERNAL_SERVER_ERROR,
      '系统异常：Mock API请求失败'
    )
  }
}

/**
 * 获取所有可用的Mock API接口
 * @returns {Array} API接口列表
 */
export const getAvailableMockApis = () => {
  return Object.keys(mockApiRouter).map(url => ({
    url,
    method: 'POST',
    description: getApiDescription(url)
  }))
}

/**
 * 获取API接口描述
 * @param {string} url - API路径
 * @returns {string} API描述
 */
const getApiDescription = (url) => {
  const descriptions = {
    '/assets/summary': '获取资产汇总数据',
    '/assets/trend': '获取资产趋势数据',
    '/assets/income-expense': '获取收支趋势数据',
    '/api/transactions/list': '获取交易记录列表',
    '/api/transactions/add': '添加交易记录',
    '/api/transactions/update': '更新交易记录',
    '/api/transactions/delete': '删除交易记录',
    '/api/transactions/statistics': '获取交易统计信息'
  }
  
  return descriptions[url] || '未知API接口'
}