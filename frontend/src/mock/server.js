/**
 * Mock服务器 - 处理API请求
 * 用于开发和测试阶段，模拟后端API响应
 */

import { createSuccessResponse, createErrorResponse, mockDelay } from './utils.js'
import { handleMockApiRequest } from './api/index.js'

// Mock服务器路由处理
export const mockServer = {
  
  // 处理其他API请求
  async handleRequest(url, method, data) {
    console.log('Mock服务器收到请求:', { url, method, data })
    
    // 添加模拟延迟
    await mockDelay(100, 300)
    
    // 标准化URL
    let normalizedUrl = url
    if (url.startsWith('http')) {
      const urlObj = new URL(url)
      normalizedUrl = urlObj.pathname
    }
    
    console.log('标准化后的URL:', normalizedUrl)
    
    // 使用新的Mock API处理机制
    try {
      const response = handleMockApiRequest(normalizedUrl, data)
      console.log('Mock API返回:', response)
      
      // 确保返回标准格式
      if (response && typeof response === 'object') {
        return response
      } else {
        console.warn('Mock API返回格式异常:', response)
        return createErrorResponse(500, 'Mock API返回格式异常')
      }
    } catch (error) {
      console.error('Mock API处理错误:', error)
      return createErrorResponse(500, 'Mock API处理失败')
    }
  }
}

// 导出默认的mock服务器实例
export default mockServer 