import request from '@/utils/request.js'
import { createApiPromise } from '@/utils/apiResponse.js'

/**
 * 资产总览API
 */
export const assetsApi = {
  /**
   * 获取资产汇总数据
   * @param {Object} params - 查询参数
   * @param {string} params.period - 时间维度 ('year', 'month', 'week', 'day', 'total')
   * @param {number} params.year - 指定年份，默认为当前年份
   * @param {number} params.month - 指定月份，默认为当前月份
   * @returns {Promise} 资产汇总数据
   */
  getSummary(params = {}) {
    // 设置默认参数
    const defaultParams = {
      period: 'year',
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      ...params
    }
    
    return createApiPromise(() =>
      request({
        url: '/assets/summary',
        method: 'post',
        data: defaultParams
      })
    )
  },

  /**
   * 获取资产总览数据
   * @param {Object} params - 查询参数
   * @param {string} params.period - 时间维度 ('year', 'month', 'week', 'total')
   * @param {number} params.year - 指定年份，默认为当前年份
   * @param {number} params.month - 指定月份，默认为当前月份
   * @returns {Promise} 资产数据
   */
  getAssetOverview(params = {}) {
    // 设置默认参数
    const defaultParams = {
      period: 'year',
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      ...params
    }
    
    return createApiPromise(() =>
      request({
        url: '/assets/summary',
        method: 'post',
        data: defaultParams
      })
    )
  },

  /**
   * 获取资产趋势数据
   * @param {Object} params - 查询参数
   * @param {string} params.period - 时间维度 ('year', 'month', 'week', 'total')
   * @param {number} params.year - 指定年份，默认为当前年份
   * @param {number} params.month - 指定月份，默认为当前月份
   * @returns {Promise} 趋势数据
   */
  getAssetTrend(params = {}) {
    // 设置默认参数
    const defaultParams = {
      period: 'year',
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      ...params
    }
    
    return createApiPromise(() =>
      request({
        url: '/assets/trend',
        method: 'post',
        data: defaultParams
      })
    )
  },

  /**
   * 获取收支趋势数据
   * @param {Object} params - 查询参数
   * @param {string} params.period - 时间维度 ('year', 'month', 'week', 'total')
   * @param {number} params.year - 指定年份，默认为当前年份
   * @param {number} params.month - 指定月份，默认为当前月份
   * @returns {Promise} 收支数据
   */
  getIncomeExpenseTrend(params = {}) {
    // 设置默认参数
    const defaultParams = {
      period: 'year',
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      ...params
    }
    
    return createApiPromise(() =>
      request({
        url: '/assets/income-expense',
        method: 'post',
        data: defaultParams
      })
    )
  },

  /**
   * 获取收入结构分析
   * @param {Object} params - 查询参数
   * @param {string} params.period - 时间维度 ('year', 'month', 'week', 'total')
   * @param {number} params.year - 指定年份，默认为当前年份
   * @param {number} params.month - 指定月份，默认为当前月份
   * @returns {Promise} 收入结构数据
   */
  getIncomeStructure(params = {}) {
    // 设置默认参数
    const defaultParams = {
      period: 'year',
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      ...params
    }
    
    return createApiPromise(() =>
      request({
        url: '/assets/income-structure',
        method: 'post',
        data: defaultParams
      })
    )
  },

  /**
   * 获取成本结构分析
   * @param {Object} params - 查询参数
   * @param {string} params.period - 时间维度 ('year', 'month', 'week', 'total')
   * @param {number} params.year - 指定年份，默认为当前年份
   * @param {number} params.month - 指定月份，默认为当前月份
   * @returns {Promise} 成本结构数据
   */
  getCostStructure(params = {}) {
    // 设置默认参数
    const defaultParams = {
      period: 'year',
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      ...params
    }
    
    return createApiPromise(() =>
      request({
        url: '/assets/cost-structure',
        method: 'post',
        data: defaultParams
      })
    )
  },

  /**
   * 获取资产统计数据
   * @param {Object} params - 查询参数
   * @param {string} params.period - 时间维度 ('year', 'month', 'week', 'total')
   * @param {number} params.year - 指定年份，默认为当前年份
   * @param {number} params.month - 指定月份，默认为当前月份
   * @returns {Promise} 统计数据
   */
  getAssetStatistics(params = {}) {
    // 设置默认参数
    const defaultParams = {
      period: 'year',
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      ...params
    }
    
    return createApiPromise(() =>
      request({
        url: '/assets/statistics',
        method: 'post',
        data: defaultParams
      })
    )
  }
}
