import { defineStore } from 'pinia'
import { assetsApi } from '@/api/assets.js'

/**
 * 资产总览Store
 */
export const useAssetsStore = defineStore('assets', {
  state: () => ({
    // 资产总览数据
    assetOverview: {
      totalIncome: 0,
      totalExpense: 0,
      netAssets: 0
    },

    // 资产趋势数据
    assetTrend: [],

    // 收支趋势数据
    incomeExpenseTrend: {
      income: [],
      expense: []
    },

    // 收入结构数据
    incomeStructure: [],

    // 成本结构数据
    costStructure: [],

    // 资产统计数据
    assetStatistics: {},

    // 当前时间筛选维度
    currentPeriod: 'year',

    // 图表数据（已由计算属性替代，保留向后兼容）
    chartData: null,

    // 加载状态
    loading: false,

    // 错误信息
    error: null
  }),

  getters: {
    /**
     * 获取格式化后的资产数据
     */
    formattedAssetData: state => {
      return {
        totalIncome: state.assetOverview.totalIncome.toLocaleString('zh-CN'),
        totalExpense: state.assetOverview.totalExpense.toLocaleString('zh-CN'),
        netAssets: state.assetOverview.netAssets.toLocaleString('zh-CN')
      }
    },

    /**
     * 获取资产趋势图表数据
     */
    assetTrendChartData: state => {
      if (!Array.isArray(state.assetTrend)) {
        return {
          labels: [],
          data: []
        }
      }
      return {
        labels: state.assetTrend.map(item => item.month),
        data: state.assetTrend.map(item => item.value)
      }
    },

    /**
     * 获取收支趋势图表数据
     */
    incomeExpenseChartData: state => {
      const income = Array.isArray(state.incomeExpenseTrend?.income) ? state.incomeExpenseTrend.income : []
      const expense = Array.isArray(state.incomeExpenseTrend?.expense) ? state.incomeExpenseTrend.expense : []
      
      return {
        labels: income.map(item => item.month),
        datasets: [
          {
            label: '收入',
            data: income.map(item => item.value),
            backgroundColor: '#10B981'
          },
          {
            label: '支出',
            data: expense.map(item => item.value),
            backgroundColor: '#EF4444'
          }
        ]
      }
    }
  },

  actions: {
    /**
     * 获取资产总览数据
     */
    async fetchAssetOverview(params = {}) {
      try {
        this.loading = true
        this.error = null

        const response = await assetsApi.getAssetOverview(params)
        if (response.error === 0) {
          this.assetOverview = response.body
        } else {
          throw new Error(response.message || '获取资产总览数据失败')
        }
        this.currentPeriod = params.period || 'year'
      } catch (error) {
        console.error('获取资产总览数据失败:', error)
        this.error = error.message
      } finally {
        this.loading = false
      }
    },

    /**
     * 获取资产趋势数据
     */
    async fetchAssetTrend(params = {}) {
      try {
        this.loading = true
        this.error = null

        const response = await assetsApi.getAssetTrend(params)
        if (response.error === 0) {
          this.assetTrend = response.body
        } else {
          throw new Error(response.message || '获取资产趋势数据失败')
        }
        this.currentPeriod = params.period || 'year'
      } catch (error) {
        console.error('获取资产趋势数据失败:', error)
        this.error = error.message
      } finally {
        this.loading = false
      }
    },

    /**
     * 获取收支趋势数据
     */
    async fetchIncomeExpenseTrend(params = {}) {
      try {
        console.log('📊 Store: 开始获取收支趋势数据', params)
        this.loading = true
        this.error = null

        const response = await assetsApi.getIncomeExpenseTrend(params)
        console.log('📊 Store: API响应数据', response)
        
        if (response.error === 0) {
          this.incomeExpenseTrend = response.body
          console.log('📊 Store: 收支趋势数据已更新', {
            period: params.period,
            dataStructure: {
              hasIncome: !!response.body?.income,
              hasExpense: !!response.body?.expense,
              incomeLength: response.body?.income?.length,
              expenseLength: response.body?.expense?.length
            },
            sampleData: {
              firstIncomeItem: response.body?.income?.[0],
              firstExpenseItem: response.body?.expense?.[0]
            }
          })
        } else {
          throw new Error(response.message || '获取收支趋势数据失败')
        }
        this.currentPeriod = params.period || 'year'
      } catch (error) {
        console.error('📊 Store: 获取收支趋势数据失败:', error)
        this.error = error.message
      } finally {
        this.loading = false
      }
    },

    /**
     * 获取收入结构数据
     */
    async fetchIncomeStructure(params = {}) {
      try {
        this.loading = true
        this.error = null

        const response = await assetsApi.getIncomeStructure(params)
        if (response.error === 0) {
          this.incomeStructure = response.body
        } else {
          throw new Error(response.message || '获取收入结构数据失败')
        }
      } catch (error) {
        console.error('获取收入结构数据失败:', error)
        this.error = error.message
      } finally {
        this.loading = false
      }
    },

    /**
     * 获取成本结构数据
     */
    async fetchCostStructure(params = {}) {
      try {
        this.loading = true
        this.error = null

        const response = await assetsApi.getCostStructure(params)
        if (response.error === 0) {
          this.costStructure = response.body
        } else {
          throw new Error(response.message || '获取成本结构数据失败')
        }
      } catch (error) {
        console.error('获取成本结构数据失败:', error)
        this.error = error.message
      } finally {
        this.loading = false
      }
    },

    /**
     * 获取资产统计数据（用于高级分析，非基础视图使用）
     */
    async fetchAssetStatistics(params = {}) {
      try {
        this.loading = true
        this.error = null

        const data = await assetsApi.getAssetStatistics(params)
        this.assetStatistics = data
      } catch (error) {
        console.error('获取资产统计数据失败:', error)
        this.error = error.message
      } finally {
        this.loading = false
      }
    },

    /**
     * 获取所有资产数据
     */
    async fetchAssetData(params = {}) {
      try {
        this.loading = true
        this.error = null

        // 并行获取所有数据
        const [
          overviewData,
          trendData,
          incomeExpenseData,
          incomeStructureData,
          costStructureData,
          assetStatisticsData
        ] = await Promise.all([
          assetsApi.getAssetOverview(params),
          assetsApi.getAssetTrend(params),
          assetsApi.getIncomeExpenseTrend(params),
          assetsApi.getIncomeStructure(params),
          assetsApi.getCostStructure(params),
          assetsApi.getAssetStatistics(params)
        ])

        // 更新状态
        this.assetOverview = overviewData
        this.assetTrend = trendData
        this.incomeExpenseTrend = incomeExpenseData
        this.incomeStructure = incomeStructureData
        this.costStructure = costStructureData
        this.assetStatistics = assetStatisticsData
        this.currentPeriod = params.period || 'year'
      } catch (error) {
        console.error('获取资产数据失败:', error)
        this.error = error.message
      } finally {
        this.loading = false
      }
    },

    /**
     * 根据时间维度更新数据
     */
    async updateDataByPeriod(period, params = {}) {
      const requestParams = {
        period,
        ...params
      }
      
      await this.fetchAssetData(requestParams)
    },

    /**
     * 重置状态
     */
    reset() {
      this.assetOverview = {
        totalIncome: 0,
        totalExpense: 0,
        netAssets: 0
      }
      this.assetTrend = []
      this.incomeExpenseTrend = {
        income: [],
        expense: []
      }
      this.incomeStructure = []
      this.costStructure = []
      this.assetStatistics = {}
      this.currentPeriod = 'year'
      this.chartData = {
        assetTrend: null,
        incomeExpense: null
      }
      this.loading = false
      this.error = null
    }
  }
})
