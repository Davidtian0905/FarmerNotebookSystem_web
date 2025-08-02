import request from '@/utils/request.js'
import { createApiPromise } from '@/utils/apiResponse.js'
import { 
  isMockMode, 
  mockGetRecentWeekData, 
  mockGetTodayData, 
  mockGetTrendData 
} from '../mock'

/**
 * 仪表板相关API
 */
export const dashboardApi = {
  /**
   * 获取最近7天财务数据
   * @param {Object} params - 请求参数
   * @returns {Promise} 最近7天财务数据
   */
  getRecentWeekData(params = {}) {
    if (isMockMode()) {
      return createApiPromise(() => mockGetRecentWeekData(params))
    }
    return createApiPromise(() => request.post('/dashboard/recent_week_data', params))
  },

  /**
   * 获取今日财务数据
   * @param {Object} params - 请求参数
   * @returns {Promise} 今日财务数据
   */
  getTodayData(params = {}) {
    if (isMockMode()) {
      return createApiPromise(() => mockGetTodayData(params))
    }
    return createApiPromise(() => request.post('/dashboard/today_data', params))
  },

  /**
   * 获取财务趋势数据
   * @param {Object} params - 查询参数
   * @returns {Promise} 财务趋势数据
   */
  getTrendData(params = {}) {
    if (isMockMode()) {
      return createApiPromise(() => mockGetTrendData(params))
    }
    return createApiPromise(() => request.post('/dashboard/trend_data', params))
  }
}

export default dashboardApi
