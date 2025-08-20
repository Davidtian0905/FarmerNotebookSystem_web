import request from '@/utils/request.js'
import { createApiPromise } from '@/utils/apiResponse.js'
import { 
  isMockMode,
  mockAssetsApi
} from '../mock'

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
    
    if (isMockMode()) {
      return createApiPromise(() => Promise.resolve(mockAssetsApi.getSummary(defaultParams)))
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
  async getAssetOverview(params = {}) {
    // 设置默认参数
    const defaultParams = {
      period: 'year',
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      ...params
    }
    
    if (isMockMode()) {
      // 直接导入并调用database_assets中的getAssetOverview函数
      const { getAssetOverview } = await import('../mock/database_assets.js')
      return Promise.resolve({
        error: 0,
        body: getAssetOverview(defaultParams),
        message: '获取资产总览数据成功'
      })
    }
    
    return createApiPromise(() =>
      request({
        url: '/assets/overview',
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
  async getAssetTrend(params = {}) {
    // 设置默认参数
    const defaultParams = {
      period: 'year',
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      ...params
    }
    
    if (isMockMode()) {
      // 直接导入并调用database_assets中的getAssetTrend函数
      const { getAssetTrend } = await import('../mock/database_assets.js')
      return Promise.resolve({
        error: 0,
        body: getAssetTrend(defaultParams),
        message: '获取资产趋势数据成功'
      })
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
  async getIncomeExpenseTrend(params = {}) {
    console.log('🌐 API: 开始获取收支趋势数据', params)
    
    // 设置默认参数
    const defaultParams = {
      period: 'year',
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      ...params
    }
    
    console.log('🌐 API: 处理后的参数', defaultParams)
    
    if (isMockMode()) {
      console.log('🌐 API: 使用Mock模式获取数据')
      // 直接导入并调用database_assets中的getIncomeExpenseTrend函数
      const { getIncomeExpenseTrend } = await import('../mock/database_assets.js')
      const mockResult = getIncomeExpenseTrend(defaultParams)
      
      console.log('🌐 API: Mock数据结果', {
        hasIncome: !!mockResult?.income,
        hasExpense: !!mockResult?.expense,
        incomeLength: mockResult?.income?.length,
        expenseLength: mockResult?.expense?.length,
        sampleIncomeItem: mockResult?.income?.[0],
        sampleExpenseItem: mockResult?.expense?.[0]
      })
      
      return Promise.resolve({
        error: 0,
        body: mockResult,
        message: '获取收支趋势数据成功'
      })
    }
    
    console.log('🌐 API: 使用真实API获取数据')
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
  async getIncomeStructure(params = {}) {
    // 设置默认参数
    const defaultParams = {
      period: 'year',
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      ...params
    }
    
    if (isMockMode()) {
      // 直接导入并调用database_assets中的getIncomeStructure函数
      const { getIncomeStructure } = await import('../mock/database_assets.js')
      return Promise.resolve({
        error: 0,
        body: getIncomeStructure(defaultParams),
        message: '获取收入结构数据成功'
      })
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
  async getCostStructure(params = {}) {
    // 设置默认参数
    const defaultParams = {
      period: 'year',
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      ...params
    }
    
    if (isMockMode()) {
      // 直接导入并调用database_assets中的getCostStructure函数
      const { getCostStructure } = await import('../mock/database_assets.js')
      return Promise.resolve({
        error: 0,
        body: getCostStructure(defaultParams),
        message: '获取成本结构数据成功'
      })
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
    
    if (isMockMode()) {
      return createApiPromise(() => Promise.resolve(mockAssetsApi.getAssetStatistics(defaultParams)))
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
