<template>
  <Layout>
    <div class="p-6">
      <h2 class="text-2xl font-semibold text-gray-900 mb-6">资产总览Mock数据测试</h2>
      
      <!-- 调试信息 -->
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 class="text-lg font-semibold text-blue-900 mb-2">调试信息</h3>
        <div class="space-y-2 text-sm">
          <div><strong>当前日期:</strong> {{ currentDate }}</div>
          <div><strong>当前时间维度:</strong> {{ currentPeriod }}</div>
          <div><strong>Mock模式:</strong> {{ mockModeStatus ? '启用' : '禁用' }}</div>
          <div><strong>最后更新:</strong> {{ debugInfo.lastUpdate }}</div>
        </div>
      </div>

      <!-- 资产总览数据 -->
      <div class="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <h3 class="text-lg font-semibold text-green-900 mb-2">资产总览数据</h3>
        <div class="space-y-2 text-sm">
          <div><strong>总收入:</strong> {{ assetOverview.totalIncome || 0 }}</div>
          <div><strong>总支出:</strong> {{ assetOverview.totalExpense || 0 }}</div>
          <div><strong>净资产:</strong> {{ assetOverview.netAssets || 0 }}</div>
        </div>
      </div>

      <!-- 时间维度选择 -->
      <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <h3 class="text-lg font-semibold text-yellow-900 mb-2">时间维度选择</h3>
        <div class="flex space-x-2 mb-4">
          <van-button 
            v-for="period in periods" 
            :key="period.value"
            :type="currentPeriod === period.value ? 'primary' : 'default'"
            size="small"
            @click="changePeriod(period.value)"
          >
            {{ period.label }}
          </van-button>
        </div>
        <div class="text-sm">
          <div><strong>当前选择:</strong> {{ currentPeriod }}</div>
          <div><strong>数据点数:</strong> {{ chartData.labels?.length || 0 }}</div>
        </div>
      </div>

      <!-- 图表数据预览 -->
      <div class="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-2">图表数据预览</h3>
        <div class="space-y-2 text-sm max-h-60 overflow-y-auto">
          <div><strong>标签:</strong> {{ chartData.labels?.join(', ') || '无数据' }}</div>
          <div><strong>净资产数据:</strong> {{ chartData.datasets?.[0]?.data?.join(', ') || '无数据' }}</div>
          <div><strong>收入数据:</strong> {{ incomeExpenseData.income?.map(item => item.value)?.join(', ') || '无数据' }}</div>
          <div><strong>支出数据:</strong> {{ incomeExpenseData.expense?.map(item => item.value)?.join(', ') || '无数据' }}</div>
        </div>
      </div>

      <!-- 收入结构数据 -->
      <div class="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
        <h3 class="text-lg font-semibold text-purple-900 mb-2">收入结构数据</h3>
        <div class="space-y-2 text-sm">
          <div v-for="item in incomeStructure" :key="item.name" class="flex justify-between">
            <span>{{ item.name }}:</span>
            <span>{{ item.value }} ({{ item.percentage }}%)</span>
          </div>
        </div>
      </div>

      <!-- 成本结构数据 -->
      <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <h3 class="text-lg font-semibold text-red-900 mb-2">成本结构数据</h3>
        <div class="space-y-2 text-sm">
          <div v-for="item in costStructure" :key="item.name" class="flex justify-between">
            <span>{{ item.name }}:</span>
            <span>{{ item.value }} ({{ item.percentage }}%)</span>
          </div>
        </div>
      </div>

      <!-- API模式切换 -->
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 class="text-lg font-semibold text-blue-900 mb-2">API模式控制</h3>
        <div class="flex space-x-2 mb-4">
          <van-button 
            :type="apiMode === 'mock' ? 'primary' : 'default'"
            size="small"
            @click="switchApiMode('mock')"
          >
            Mock模式
          </van-button>
          <van-button 
            :type="apiMode === 'backend' ? 'primary' : 'default'"
            size="small"
            @click="switchApiMode('backend')"
          >
            后端API模式
          </van-button>
        </div>
        <div class="text-sm">
          <div><strong>当前模式:</strong> {{ apiMode === 'mock' ? 'Mock模式' : '后端API模式' }}</div>
          <div><strong>Mock状态:</strong> {{ mockModeStatus ? '启用' : '禁用' }}</div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="space-x-4">
        <van-button type="primary" @click="refreshData">刷新数据</van-button>
        <van-button type="warning" @click="resetData">重置数据</van-button>
        <van-button type="success" @click="testApiCall">测试API调用</van-button>
        <van-button @click="debugData">调试数据</van-button>
        <van-button @click="toggleMockModeHandler">切换Mock模式</van-button>
      </div>

      <!-- API测试结果 -->
      <div v-if="apiTestResult" class="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h3 class="text-lg font-semibold text-gray-900 mb-2">API测试结果</h3>
        <pre class="text-sm overflow-auto">{{ JSON.stringify(apiTestResult, null, 2) }}</pre>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { showToast } from 'vant'
import { assetsApi } from '@/api/assets'
import { isMockMode, toggleMockMode } from '@/mock'
import { mockAssetsApi } from '@/mock/api/index.js'

// 响应式数据
const currentDate = ref('')
const currentPeriod = ref('year')
const debugInfo = ref({})
const assetOverview = ref({})
const chartData = ref({})
const incomeExpenseData = ref({})
const incomeStructure = ref([])
const costStructure = ref([])
const apiTestResult = ref(null)
const apiMode = ref(localStorage.getItem('apiMode') || 'mock')

// 时间维度选项
const periods = [
  { label: '年度', value: 'year' },
  { label: '月度', value: 'month' },
  { label: '周度', value: 'week' },
  { label: '总计', value: 'total' }
]

// 计算属性
const mockModeStatus = computed(() => isMockMode())

// 初始化数据
const initData = () => {
  console.log('=== initData 调试信息 ===')
  currentDate.value = new Date().toISOString().split('T')[0]
  debugInfo.value = {
    lastUpdate: new Date().toLocaleString(),
    dataCount: 0,
    isInitialized: true
  }
  
  console.log('初始化完成，开始加载资产数据')
  loadAssetData()
}

// 加载资产数据
const loadAssetData = async () => {
  try {
    console.log('=== loadAssetData 调试信息 ===')
    
    // 确保交易数据已初始化
    const { initializeTransactionData } = await import('@/mock/database_flow.js')
    initializeTransactionData()
    
    // 准备API调用参数
    const params = { 
      period: currentPeriod.value
    }
    
    // 只有在非总计模式下才添加年份参数
    if (currentPeriod.value !== 'total') {
      params.year = new Date().getFullYear()
    }
    
    console.log('准备调用Mock API，参数:', params)
    
    // 使用assetsApi进行调用，让请求拦截器处理Mock路由
    const summaryResponse = await assetsApi.getSummary(params)
    
    console.log('API调用返回:', summaryResponse)
    
    // 检查响应格式，支持多种返回格式
    let responseData = summaryResponse
    if (summaryResponse && summaryResponse.data) {
      responseData = summaryResponse.data
    }
    
    console.log('处理后的响应数据:', responseData)
    console.log('响应数据类型:', typeof responseData)
    console.log('响应数据结构:', JSON.stringify(responseData, null, 2))
    
    // 检查是否是标准API响应格式或直接的Mock数据
    let summaryData = null
    if (responseData && responseData.error === 0 && responseData.body) {
      // 标准API响应格式
      summaryData = responseData.body
      console.log('使用标准API响应格式')
    } else if (responseData && responseData.period && responseData.summary) {
      // 直接的Mock数据格式
      summaryData = responseData
      console.log('使用直接Mock数据格式')
    }
    
    if (summaryData) {
       console.log('解析的汇总数据:', summaryData)
      
      assetOverview.value = {
        totalIncome: summaryData.summary?.totalIncome || 0,
        totalExpense: summaryData.summary?.totalExpense || 0,
        netAssets: summaryData.summary?.netAssets || 0
      }
      
      console.log('设置的资产总览数据:', assetOverview.value)
      
      // 处理图表数据，根据不同的时间维度
      if (currentPeriod.value === 'total') {
        // 总计模式：显示按年份分组的数据
        if (summaryData.yearlyData && summaryData.yearlyData.length > 0) {
          // 处理按年份分组的数据
          const labels = summaryData.yearlyData.map(item => `${item.year}年`)
          const netAssetsData = summaryData.yearlyData.map(item => item.netAssets || 0)
          const incomeData = summaryData.yearlyData.map(item => item.income || 0)
          const expenseData = summaryData.yearlyData.map(item => item.expense || 0)
          
          chartData.value = {
            labels,
            datasets: [{
              label: '净资产',
              data: netAssetsData,
              borderColor: '#10B981',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              tension: 0.4,
              fill: true
            }],
            incomeExpense: {
              labels,
              datasets: [
                {
                  label: '收入',
                  data: incomeData,
                  backgroundColor: '#10B981'
                },
                {
                  label: '支出',
                  data: expenseData,
                  backgroundColor: '#EF4444'
                }
              ]
            }
          }
          
          incomeExpenseData.value = {
            income: labels.map((label, index) => ({
              month: label,
              value: incomeData[index]
            })),
            expense: labels.map((label, index) => ({
              month: label,
              value: expenseData[index]
            }))
          }
          
          console.log('构建的总计图表数据（按年份）:', {
            labels: chartData.value.labels,
            netAssetsData,
            incomeData,
            expenseData,
            yearlyDataCount: summaryData.yearlyData.length
          })
        } else {
          // 如果没有年度数据，显示汇总数据（兼容旧格式）
          const labels = ['总计']
          const netAssetsData = [summaryData.summary.netAssets || 0]
          const incomeData = [summaryData.summary.totalIncome || 0]
          const expenseData = [summaryData.summary.totalExpense || 0]
          
          chartData.value = {
            labels,
            datasets: [{
              label: '净资产',
              data: netAssetsData,
              borderColor: '#10B981',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              tension: 0.4,
              fill: true
            }],
            incomeExpense: {
              labels,
              datasets: [
                {
                  label: '收入',
                  data: incomeData,
                  backgroundColor: '#10B981'
                },
                {
                  label: '支出',
                  data: expenseData,
                  backgroundColor: '#EF4444'
                }
              ]
            }
          }
          
          incomeExpenseData.value = {
            income: labels.map((label, index) => ({
              month: label,
              value: incomeData[index]
            })),
            expense: labels.map((label, index) => ({
              month: label,
              value: expenseData[index]
            }))
          }
          
          console.log('构建的总计图表数据（汇总模式）:', {
            labels: chartData.value.labels,
            netAssetsData,
            incomeData,
            expenseData
          })
        }
      } else if (summaryData.monthlyData && summaryData.monthlyData.length > 0) {
        // 年度模式：处理月度数据
        const labels = summaryData.monthlyData.map(item => `${item.month}月`)
        const netAssetsData = summaryData.monthlyData.map(item => item.netAssets || 0)
        const incomeData = summaryData.monthlyData.map(item => item.income || 0)
        const expenseData = summaryData.monthlyData.map(item => item.expense || 0)
        
        chartData.value = {
          labels,
          datasets: [{
            label: '净资产',
            data: netAssetsData,
            borderColor: '#10B981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            tension: 0.4,
            fill: true
          }],
          incomeExpense: {
            labels,
            datasets: [
              {
                label: '收入',
                data: incomeData,
                backgroundColor: '#10B981'
              },
              {
                label: '支出',
                data: expenseData,
                backgroundColor: '#EF4444'
              }
            ]
          }
        }
        
        incomeExpenseData.value = {
          income: labels.map((label, index) => ({
            month: label,
            value: incomeData[index]
          })),
          expense: labels.map((label, index) => ({
            month: label,
            value: expenseData[index]
          }))
        }
        
        console.log('构建的年度图表数据（月度）:', {
          labels: chartData.value.labels,
          netAssetsData,
          incomeData,
          expenseData,
          monthlyDataCount: summaryData.monthlyData.length
        })
      } else if (summaryData.dailyData && summaryData.dailyData.length > 0) {
        // 月度模式：处理日度数据
        const labels = summaryData.dailyData.map(item => `${item.day}日`)
        const netAssetsData = summaryData.dailyData.map(item => item.netAssets || 0)
        const incomeData = summaryData.dailyData.map(item => item.income || 0)
        const expenseData = summaryData.dailyData.map(item => item.expense || 0)
        
        chartData.value = {
          labels,
          datasets: [{
            label: '净资产',
            data: netAssetsData,
            borderColor: '#10B981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            tension: 0.4,
            fill: true
          }],
          incomeExpense: {
            labels,
            datasets: [
              {
                label: '收入',
                data: incomeData,
                backgroundColor: '#10B981'
              },
              {
                label: '支出',
                data: expenseData,
                backgroundColor: '#EF4444'
              }
            ]
          }
        }
        
        incomeExpenseData.value = {
          income: labels.map((label, index) => ({
            month: label,
            value: incomeData[index]
          })),
          expense: labels.map((label, index) => ({
            month: label,
            value: expenseData[index]
          }))
        }
        
        console.log('构建的月度图表数据（日度）:', {
          labels: chartData.value.labels,
          netAssetsData,
          incomeData,
          expenseData,
          dailyDataCount: summaryData.dailyData.length
        })
      } else if (summaryData.weeklyData && summaryData.weeklyData.length > 0) {
        // 周度模式：处理周度数据
        const labels = summaryData.weeklyData.map(item => item.dayLabel)
        const netAssetsData = summaryData.weeklyData.map(item => item.netAssets || 0)
        const incomeData = summaryData.weeklyData.map(item => item.income || 0)
        const expenseData = summaryData.weeklyData.map(item => item.expense || 0)
        
        chartData.value = {
          labels,
          datasets: [{
            label: '净资产',
            data: netAssetsData,
            borderColor: '#10B981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            tension: 0.4,
            fill: true
          }],
          incomeExpense: {
            labels,
            datasets: [
              {
                label: '收入',
                data: incomeData,
                backgroundColor: '#10B981'
              },
              {
                label: '支出',
                data: expenseData,
                backgroundColor: '#EF4444'
              }
            ]
          }
        }
        
        incomeExpenseData.value = {
          income: labels.map((label, index) => ({
            month: label,
            value: incomeData[index]
          })),
          expense: labels.map((label, index) => ({
            month: label,
            value: expenseData[index]
          }))
        }
        
        console.log('构建的周度图表数据:', {
          labels: chartData.value.labels,
          netAssetsData,
          incomeData,
          expenseData,
          weeklyDataCount: summaryData.weeklyData.length
        })
      } else {
        console.warn('没有月度数据或数据为空')
        // 设置默认的空数据
        chartData.value = {
          labels: [],
          datasets: []
        }
        incomeExpenseData.value = {
          income: [],
          expense: []
        }
      }
      
      // 更新调试信息
      debugInfo.value.dataCount = chartData.value.labels?.length || 0
      debugInfo.value.lastUpdate = new Date().toLocaleString()
      
      console.log('Mock资产数据加载成功:', {
        overview: assetOverview.value,
        chartData: chartData.value,
        incomeExpense: incomeExpenseData.value
      })
    } else {
      console.error('API返回错误:', responseData)
      showToast('Mock数据加载失败')
    }
  } catch (error) {
    console.error('加载Mock资产数据失败:', error)
    showToast('Mock数据加载失败')
  }
}

// 切换时间维度
const changePeriod = async (period) => {
  currentPeriod.value = period
  await loadAssetData()
  showToast(`已切换到${periods.find(p => p.value === period)?.label}`)
}

// 刷新数据
const refreshData = () => {
  loadAssetData()
  showToast('数据已刷新')
}

// 重置数据
const resetData = async () => {
  try {
    // 清除localStorage中的旧交易数据
    const { resetTransactionData } = await import('@/mock/database_flow.js')
    resetTransactionData()
    
    // 重置时间维度
    currentPeriod.value = 'year'
    
    // 重新加载数据
    await loadAssetData()
    
    showToast('数据已重置，已加载完整的2021-2025年测试数据')
  } catch (error) {
    console.error('重置数据失败:', error)
    showToast('重置数据失败')
  }
}

// 测试API调用
const testApiCall = async () => {
  try {
    showToast('正在测试API调用...')
    
    // 测试API调用
    const testParams = { 
      period: currentPeriod.value
    }
    
    // 只有在非总计模式下才添加年份参数
    if (currentPeriod.value !== 'total') {
      testParams.year = new Date().getFullYear()
    }
    
    const summaryResponse = await assetsApi.getSummary(testParams)
    const trendResponse = await assetsApi.getAssetTrend(testParams)
    const incomeExpenseResponse = await assetsApi.getIncomeExpenseTrend(testParams)
    
    const result = {
      summary: summaryResponse,
      trend: trendResponse,
      incomeExpense: incomeExpenseResponse
    }
    
    apiTestResult.value = {
      timestamp: new Date().toISOString(),
      params: testParams,
      results: result
    }
    
    showToast('API测试完成')
  } catch (error) {
    console.error('API测试失败:', error)
    showToast('API测试失败')
  }
}

// 调试数据
const debugData = async () => {
  try {
    // 测试API调用并输出调试信息
    const testParams = { 
      period: currentPeriod.value
    }
    
    // 只有在非总计模式下才添加年份参数
    if (currentPeriod.value !== 'total') {
      testParams.year = new Date().getFullYear()
    }
    
    const summaryResponse = await assetsApi.getSummary(testParams)
    console.log('API调试信息:', {
      params: testParams,
      response: summaryResponse,
      currentTime: new Date().toISOString()
    })
    
    showToast('调试信息已输出到控制台')
  } catch (error) {
    console.error('调试失败:', error)
    showToast('调试失败')
  }
}

// 切换API模式
const switchApiMode = (mode) => {
  apiMode.value = mode
  localStorage.setItem('apiMode', mode)
  showToast(`已切换到${mode === 'mock' ? 'Mock模式' : '后端API模式'}`)
  
  // 重新加载数据
  loadAssetData()
}

// 切换Mock模式
const toggleMockModeHandler = () => {
  const newMode = toggleMockMode()
  showToast(`Mock模式已${newMode ? '启用' : '禁用'}`)
}

// 生命周期
onMounted(() => {
  initData()
})
</script>

<style scoped lang="scss">
.assets-test-container {
  padding: 20px;
  max-width: 1000px;
  margin: 0 auto;
}

.result {
  margin-top: 20px;
  padding: 15px;
  background: #f3f4f6;
  border-radius: 6px;
  
  pre {
    white-space: pre-wrap;
    word-wrap: break-word;
    font-size: 12px;
    color: #374151;
  }
}
</style>