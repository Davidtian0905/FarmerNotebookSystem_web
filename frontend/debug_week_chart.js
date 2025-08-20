// 完整调试前端数据流程
const fs = require('fs')
const path = require('path')

// 模拟交易数据
const transactions = [
  { date: '2025-08-19 14:30:00', type: 'OUTBOUND', amount: 1000 },
  { date: '2025-08-19 09:30:00', type: 'INBOUND', amount: 400 },
  { date: '2025-08-18 14:30:00', type: 'OUTBOUND', amount: 5000 },
  { date: '2025-08-18 09:30:00', type: 'INBOUND', amount: 1000 }
]

// 模拟工具函数
const getWeekNumber = (date) => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
}

const getCurrentDateInfo = () => {
  const now = new Date()
  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    day: now.getDate(),
    dayOfWeek: now.getDay(),
    currentDate: now.toISOString().split('T')[0]
  }
}

const calculateSummaryFromTransactions = (transactions) => {
  const income = transactions.filter(t => t.type === 'INBOUND').reduce((sum, t) => sum + t.amount, 0)
  const expense = transactions.filter(t => t.type === 'OUTBOUND').reduce((sum, t) => sum + t.amount, 0)
  return { income, expense, netAssets: income - expense }
}

const createChartDataset = (data, labels) => {
  return {
    labels,
    datasets: [{ label: '净资产', data: data.map(d => d.netAssets) }],
    incomeExpense: {
      datasets: [
        { label: '收入', data: data.map(d => d.income) },
        { label: '支出', data: data.map(d => d.expense) }
      ]
    }
  }
}

// 模拟缓存系统
let cache = {}
const getCache = (key) => cache[key]
const setCache = (key, value) => { cache[key] = value }
const getAllTransactions = () => transactions

// 复制后端逻辑
const generateWeekChartData = (transactions, year, currentInfo) => {
  const weekLabels = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  const weekData = []
  const currentWeek = getWeekNumber(new Date())
  
  for (let dayOfWeek = 1; dayOfWeek <= 7; dayOfWeek++) {
    const dayTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date)
      const transactionDayOfWeek = transactionDate.getDay()
      const adjustedDayOfWeek = transactionDayOfWeek === 0 ? 7 : transactionDayOfWeek
      const transactionWeek = getWeekNumber(transactionDate)
      
      return transactionDate.getFullYear() === year && 
             transactionWeek === currentWeek && 
             adjustedDayOfWeek === dayOfWeek
    })
    
    const summary = calculateSummaryFromTransactions(dayTransactions)
    weekData.push(summary)
  }
  
  const currentDayIndex = currentInfo.dayOfWeek === 0 ? 6 : currentInfo.dayOfWeek - 1
  const filteredWeekLabels = weekLabels.slice(0, currentDayIndex + 1)
  const filteredWeekData = weekData.slice(0, currentDayIndex + 1)
  
  return createChartDataset(filteredWeekData, filteredWeekLabels)
}

const generateChartData = (transactions, period, params = {}) => {
  const currentInfo = getCurrentDateInfo()
  const { year = currentInfo.year } = params
  
  switch (period) {
    case 'week':
      return generateWeekChartData(transactions, year, currentInfo)
    default:
      return { labels: [], datasets: [], incomeExpense: { datasets: [{ data: [] }, { data: [] }] } }
  }
}

const getAssetDataByPeriod = (period, params = {}) => {
  const cacheKey = `assets_${period}_${JSON.stringify(params)}`
  let cachedData = getCache(cacheKey)
  if (cachedData) return cachedData
  
  const transactions = getAllTransactions()
  const data = generateChartData(transactions, period, params)
  setCache(cacheKey, data)
  return data
}

const getAssetOverview = (params = {}) => {
  const { period = 'year' } = params
  const data = getAssetDataByPeriod(period, params)
  
  const totalIncome = data.incomeExpense.datasets[0].data.reduce((sum, val) => sum + val, 0)
  const totalExpense = data.incomeExpense.datasets[1].data.reduce((sum, val) => sum + val, 0)
  const netAssets = totalIncome - totalExpense
  
  return {
    totalIncome,
    totalExpense,
    netAssets,
    chartData: data
  }
}

// 模拟 API 层
const mockAssetsApi = {
  getAssetOverview: (params = {}) => {
    console.log('\n=== API 层调用 ===')
    console.log('API 接收参数:', params)
    
    // 模拟 isMockMode() 返回 true
    const result = getAssetOverview(params)
    
    console.log('API 返回数据:', result)
    
    // 模拟 API 响应格式
    return {
      error: 0,
      message: 'success',
      body: result
    }
  }
}

// 模拟 Store 层
class MockAssetsStore {
  constructor() {
    this.assetOverview = {
      totalIncome: 0,
      totalExpense: 0,
      netAssets: 0
    }
    this.loading = false
    this.error = null
    this.currentPeriod = 'year'
  }
  
  async fetchAssetOverview(params = {}) {
    console.log('\n=== Store 层调用 ===')
    console.log('Store 接收参数:', params)
    
    try {
      this.loading = true
      this.error = null
      
      const response = await mockAssetsApi.getAssetOverview(params)
      console.log('Store 收到 API 响应:', response)
      
      if (response.error === 0) {
        this.assetOverview = response.body
        console.log('Store 更新后的 assetOverview:', this.assetOverview)
      } else {
        throw new Error(response.message || '获取资产总览数据失败')
      }
      this.currentPeriod = params.period || 'year'
    } catch (error) {
      console.error('Store 获取资产总览数据失败:', error)
      this.error = error.message
    } finally {
      this.loading = false
    }
  }
}

// 模拟组件层
class MockComponent {
  constructor() {
    this.assetData = {
      totalIncome: 0,
      totalExpense: 0,
      netAssets: 0
    }
    this.assetsStore = new MockAssetsStore()
  }
  
  async loadAllData(params = { period: 'year' }) {
    console.log('\n=== 组件层调用 ===')
    console.log('组件接收参数:', params)
    
    try {
      // 如果传入的是字符串，转换为对象格式
      if (typeof params === 'string') {
        params = { period: params }
      }
      
      console.log('组件调用 Store.fetchAssetOverview')
      await this.assetsStore.fetchAssetOverview(params)
      
      // 检查Store中是否有错误
      if (this.assetsStore.error) {
        console.error('Store获取数据失败:', this.assetsStore.error)
        return
      }
      
      console.log('\n=== 组件更新数据 ===')
      console.log('Store 中的 assetOverview:', this.assetsStore.assetOverview)
      
      // 更新资产总览数据
      const overviewData = this.assetsStore.assetOverview
      this.assetData = {
        totalIncome: overviewData.totalIncome || 0,
        totalExpense: overviewData.totalExpense || 0,
        netAssets: overviewData.netAssets || 0
      }
      
      console.log('组件更新后的 assetData:', this.assetData)
      
    } catch (error) {
      console.error('组件加载数据失败:', error)
    }
  }
  
  handleTabChange(period) {
    console.log('\n=== 切换标签页 ===')
    console.log('切换到:', period)
    
    const currentInfo = getCurrentDateInfo()
    const params = {
      period,
      year: currentInfo.year,
      month: currentInfo.month,
      day: currentInfo.day,
      dayOfWeek: currentInfo.dayOfWeek
    }
    
    console.log('构建的参数:', params)
    return this.loadAllData(params)
  }
}

// 测试完整流程
console.log('=== 开始测试完整前端数据流程 ===')
console.log('当前日期:', new Date().toLocaleString())

const component = new MockComponent()

// 测试切换到本周
component.handleTabChange('week').then(() => {
  console.log('\n=== 最终测试结果 ===')
  console.log('组件显示的数据:')
  console.log('- 总收入:', component.assetData.totalIncome)
  console.log('- 总支出:', component.assetData.totalExpense)
  console.log('- 净资产:', component.assetData.netAssets)
  
  if (component.assetData.totalIncome === 0 && component.assetData.totalExpense === 0 && component.assetData.netAssets === 0) {
    console.log('\n❌ 问题确认：组件显示的数据全为0！')
  } else {
    console.log('\n✅ 数据正常：组件显示的数据不全为0')
  }
})