/**
 * Mock服务器 - 处理API请求
 * 用于开发和测试阶段，模拟后端API响应
 */

import { createSuccessResponse, createErrorResponse, mockDelay } from './utils.js'
import { handleMockApiRequest } from './api/index.js'

// Mock服务器
import { createLogger } from './utils/logger.js';

const logger = createLogger('SERVER');

export const mockServer = {
  // 模拟服务器请求处理
  handleRequest: (url, method, data) => {
    logger.info('Mock服务器处理请求:', { url, method, data });
    
    // 模拟不同的响应
    if (url.includes('/api/login')) {
      return {
        error: 0,
        body: { token: 'mock-token-123', user: { id: 1, name: '测试用户' } },
        message: '登录成功'
      };
    }
    
    if (url.includes('/api/assets')) {
      return {
        error: 0,
        body: { assets: [], total: 0 },
        message: '获取资产数据成功'
      };
    }
    
    // 默认响应
    return {
      error: 0,
      body: {},
      message: '请求处理成功'
    };
  }
}

// 导出默认的mock服务器实例
export default mockServer