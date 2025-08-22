import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import dashboardApi from '@/api/dashboard.js'
import { calculateNetProfit, calculateGrowthRate } from '@/mock/database.js'

export const useDashboardStore = defineStore('dashboard', () => {
  // 状态
  const todayData = ref(null)
  const weekData = ref(null)
  const chartData = ref({})
  const loading = ref(false)
  const error = ref(null)

  // 计算属性
  const hasData = computed(() => {
    return todayData.value !== null || weekData.value !== null
  })

  // 今日数据计算属性
  const totalIncome = computed(() => {
    return todayData.value?.total_income || 0
  })

  const totalExpense = computed(() => {
    return todayData.value?.total_expense || 0
  })

  const netProfit = computed(() => {
    return calculateNetProfit(totalIncome.value, totalExpense.value)
  })

  // 周数据计算属性
  const weekTotalIncome = computed(() => {
    return weekData.value?.summary?.week_total_income || 0
  })

  const weekTotalExpense = computed(() => {
    return weekData.value?.summary?.week_total_expense || 0
  })

  const weekNetProfit = computed(() => {
    return calculateNetProfit(weekTotalIncome.value, weekTotalExpense.value)
  })

  // 7天数据计算属性（更清晰的命名）
  const total7dayIncome = computed(() => {
    return weekTotalIncome.value
  })

  const total7dayExpense = computed(() => {
    return weekTotalExpense.value
  })

  const total7dayProfit = computed(() => {
    return weekNetProfit.value
  })

  const avgDailyIncome = computed(() => {
    return weekData.value?.summary?.avg_daily_income || 0
  })

  const avgDailyExpense = computed(() => {
    return weekData.value?.summary?.avg_daily_expense || 0
  })

  const avgDailyProfit = computed(() => {
    return weekData.value?.summary?.avg_daily_profit || 0
  })

  // 增长率计算公共函数
  const calculateTrendRate = (dataKey) => {
    if (!weekData.value?.data || weekData.value.data.length < 2) return 0
    
    const today = new Date().toISOString().split('T')[0]
    const todayData = weekData.value.data.find(item => item.date === today)
    
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toISOString().split('T')[0]
    const yesterdayData = weekData.value.data.find(item => item.date === yesterdayStr)
    
    if (!yesterdayData) return 0
    
    if (!todayData) {
      return calculateGrowthRate(0, yesterdayData[dataKey])
    }
    
    return calculateGrowthRate(todayData[dataKey], yesterdayData[dataKey])
  }

  // 增长率计算属性
  const incomeTrend = computed(() => {
    return calculateTrendRate('total_income')  // 收入趋势
  })

  const expenseTrend = computed(() => {
    return calculateTrendRate('total_expense')  // 支出趋势
  })

  const profitTrend = computed(() => {
    if (!weekData.value?.data || weekData.value.data.length < 2) return 0
    
    const today = new Date().toISOString().split('T')[0]
    const todayData = weekData.value.data.find(item => item.date === today)
    
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toISOString().split('T')[0]
    const yesterdayData = weekData.value.data.find(item => item.date === yesterdayStr)
    
    if (!yesterdayData) return 0
    
    const yesterdayProfit = calculateNetProfit(yesterdayData.total_income, yesterdayData.total_expense)
    
    if (!todayData) {
      return calculateGrowthRate(0, yesterdayProfit)
    }
    
    const todayProfit = calculateNetProfit(todayData.total_income, todayData.total_expense)
    return calculateGrowthRate(todayProfit, yesterdayProfit)
  })

  // 动作
  const fetchRecentWeekData = async (params = {}) => {
    try {
      loading.value = true
      error.value = null
      const data = await dashboardApi.getRecentWeekData(params)
      weekData.value = data
      return data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchTodayData = async (params = {}) => {
    try {
      loading.value = true
      error.value = null
      const data = await dashboardApi.getTodayData(params)
      todayData.value = data
      return data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchTrendData = async (params = {}) => {
    try {
      loading.value = true
      error.value = null
      const data = await dashboardApi.getTrendData(params)
      chartData.value[params.period || 'week'] = data
      return data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // 兼容性方法
  const fetchChartData = async (chartType, params = {}) => {
    return fetchTrendData({ ...params, chartType })
  }

  const fetchAllData = async () => {
    try {
      loading.value = true
      error.value = null

      const [weekDataResult, todayDataResult] = await Promise.all([
        dashboardApi.getRecentWeekData(),
        dashboardApi.getTodayData()
      ])

      weekData.value = weekDataResult
      todayData.value = todayDataResult

      return {
        weekData: weekDataResult,
        todayData: todayDataResult
      }
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const clearData = () => {
    todayData.value = null
    weekData.value = null
    chartData.value = {}
    error.value = null
  }

  const resetError = () => {
    error.value = null
  }

  return {
    // 状态
    todayData,
    weekData,
    chartData,
    loading,
    error,

    // 计算属性
    hasData,
    totalIncome,
    totalExpense,
    netProfit,
    weekTotalIncome,
    weekTotalExpense,
    weekNetProfit,
    // 7天数据计算属性（更清晰的命名）
    total7dayIncome,
    total7dayExpense,
    total7dayProfit,
    avgDailyIncome,
    avgDailyExpense,
    avgDailyProfit,
    incomeTrend,
    expenseTrend,
    profitTrend,

    // 动作
    fetchRecentWeekData,
    fetchTodayData,
    fetchTrendData,
    fetchChartData,
    fetchAllData,
    clearData,
    resetError
  }
})
