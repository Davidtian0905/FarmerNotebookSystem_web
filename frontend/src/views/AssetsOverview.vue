<template>
  <Layout>
    <!-- 页面标题 -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-2xl font-semibold text-gray-900">资产总览</h2>
        <p class="text-gray-600 mt-1">查看您的财务状况和资产分布</p>
      </div>
    </div>

    <!-- 资产总览卡片 -->
    <div class="asset-card rounded-2xl p-8 mb-8">
      <div class="flex items-center justify-between mb-6">
        <div>
          <p class="opacity-90">截至今日的资产统计</p>
        </div>
      </div>
      
      <div class="grid grid-cols-1 md-grid-cols-3 gap-8">
        <div class="text-center">
          <div class="text-3xl font-bold mb-2">¥{{ formatNumber(assetData.totalIncome) }}</div>
          <div class="opacity-90 mb-2">总收入</div>
        </div>
        <div class="text-center">
          <div class="text-3xl font-bold mb-2">¥{{ formatNumber(assetData.totalExpense) }}</div>
          <div class="opacity-90 mb-2">总支出</div>
        </div>
        <div class="text-center">
          <div class="text-3xl font-bold mb-2">¥{{ formatNumber(assetData.netAssets) }}</div>
          <div class="opacity-90 mb-2">净资产</div>
        </div>
      </div>
    </div>

    <!-- 数据筛选标签 -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center space-x-3">
        <div class="flex bg-gray-100 rounded-lg p-1">
          <button 
            class="px-3 py-1 text-sm font-medium bg-white text-gray-900 rounded-md shadow-sm"
            :class="{ 'bg-white text-gray-900': activeTab === 'year', 'text-gray-600 hover:text-gray-900': activeTab !== 'year' }"
            @click="handleTabChange('year')"
          >
            本年
          </button>
          <button 
            class="px-3 py-1 text-sm font-medium text-gray-600 hover:text-gray-900"
            :class="{ 'bg-white text-gray-900': activeTab === 'month', 'text-gray-600 hover:text-gray-900': activeTab !== 'month' }"
            @click="handleTabChange('month')"
          >
            本月
          </button>
          <button 
            class="px-3 py-1 text-sm font-medium text-gray-600 hover:text-gray-900"
            :class="{ 'bg-white text-gray-900': activeTab === 'week', 'text-gray-600 hover:text-gray-900': activeTab !== 'week' }"
            @click="handleTabChange('week')"
          >
            本周
          </button>
          <button 
            class="px-3 py-1 text-sm font-medium text-gray-600 hover:text-gray-900"
            :class="{ 'bg-white text-gray-900': activeTab === 'total', 'text-gray-600 hover:text-gray-900': activeTab !== 'total' }"
            @click="handleTabChange('total')"
          >
            总统计
          </button>
        </div>
      </div>
    </div>

    <!-- 图表区域 -->
    <div class="grid grid-cols-1 lg-grid-cols-2 gap-6 mb-8">
      <!-- 净资产趋势 -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">资产趋势</h3>
        </div>
        <div class="chart-container">
          <canvas ref="assetTrendChart"></canvas>
        </div>
      </div>

      <!-- 收支趋势 -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">收支趋势</h3>
          <div class="flex items-center space-x-4">
            <div class="flex items-center space-x-2">
              <div class="w-3 h-3 bg-green-500 rounded-full"></div>
              <span class="text-sm text-gray-600">收入</span>
            </div>
            <div class="flex items-center space-x-2">
              <div class="w-3 h-3 bg-red-500 rounded-full"></div>
              <span class="text-sm text-gray-600">支出</span>
            </div>
          </div>
        </div>
        <div class="chart-container">
          <canvas ref="incomeExpenseChart"></canvas>
        </div>
      </div>
    </div>

    <!-- 收入结构和资产分布 -->
    <div class="grid grid-cols-1 lg-grid-cols-2 gap-6 mb-8">
      <!-- 收入结构 -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">收入结构分析</h3>
        </div>
        <div class="flex items-center">
          <div class="w-2/5 pr-6">
            <div class="space-y-4">
              <div v-for="item in incomeStructure" :key="item.name" class="flex items-center">
                <div class="w-3 h-3 rounded-full mr-2" :style="{ backgroundColor: item.color }"></div>
                <span class="text-sm text-gray-600">{{ item.name }}</span>
                <span class="text-sm font-medium ml-auto">¥{{ formatNumber(item.value) }}</span>
              </div>
            </div>
          </div>
          <div class="w-3/5">
            <div class="pie-chart-container">
              <canvas ref="incomeStructureChart"></canvas>
            </div>
          </div>
        </div>
      </div>

      <!-- 成本结构分析 -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">成本结构分析</h3>
        </div>
        <div class="flex items-center">
          <div class="w-2/5 pr-6">
            <div class="space-y-4">
              <div v-for="item in costStructure" :key="item.name" class="flex items-center">
                <div class="w-3 h-3 rounded-full mr-2" :style="{ backgroundColor: item.color }"></div>
                <span class="text-sm text-gray-600">{{ item.name }}</span>
                <span class="text-sm font-medium ml-auto">¥{{ formatNumber(item.value) }}</span>
              </div>
            </div>
          </div>
          <div class="w-3/5">
            <div class="pie-chart-container">
              <canvas ref="costStructureChart"></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { showToast } from 'vant'
import Layout from '@/components/layout/Layout.vue'
import Chart from 'chart.js/auto'
import { useAssetsStore } from '@/stores/assets'
// 初始化Pinia Store
const assetsStore = useAssetsStore()

// 响应式数据
const activeTab = ref('year')
const assetTrendChart = ref(null)
const incomeExpenseChart = ref(null)
const incomeStructureChart = ref(null)
const costStructureChart = ref(null)

// 资产数据
const assetData = ref({
  totalIncome: 0,
  totalExpense: 0,
  netAssets: 0
})

// 收入结构数据
const incomeStructure = ref([])

// 成本结构数据
const costStructure = ref([])

// 图表实例
let assetTrendChartInstance = null
let incomeExpenseChartInstance = null
let incomeStructureChartInstance = null
let costStructureChartInstance = null

// 格式化数字
const formatNumber = (num) => {
  if (num === undefined || num === null || isNaN(num)) {
    return '0'
  }
  return Number(num).toLocaleString('zh-CN')
}

// 统一加载所有数据（避免重复API调用）
const loadAllData = async (params = { period: 'year' }) => {
  try {
    console.log('=== 开始加载数据 ===', params)
    
    // 如果传入的是字符串，转换为对象格式（向后兼容）
    if (typeof params === 'string') {
      params = { period: params }
    }
    
    console.log('处理后的参数:', params)
    
    // 特别处理本周数据的调试信息
    if (params.period === 'week') {
      console.log('🗓️ 本周数据处理:', {
        currentDate: params.currentDate,
        currentDayOfWeek: params.currentDayOfWeek,
        year: params.year
      })
    }
    
    // 记录开始时间
    const startTime = Date.now()
    
    // 并行获取所有需要的数据
    console.log('开始并行获取数据...')
    await Promise.all([
      // 资产总览数据
      assetsStore.fetchAssetOverview(params).then(() => {
        console.log('✓ 资产总览数据获取完成')
      }),
      // 资产趋势数据
      assetsStore.fetchAssetTrend(params).then(() => {
        console.log('✓ 资产趋势数据获取完成')
      }),
      // 收支趋势数据
      assetsStore.fetchIncomeExpenseTrend(params).then(() => {
        console.log('✓ 收支趋势数据获取完成')
      }),
      // 收入结构数据
      assetsStore.fetchIncomeStructure(params).then(() => {
        console.log('✓ 收入结构数据获取完成')
      }),
      // 成本结构数据
      assetsStore.fetchCostStructure(params).then(() => {
        console.log('✓ 成本结构数据获取完成')
      })
    ])
    
    const endTime = Date.now()
    console.log(`所有数据获取完成，耗时: ${endTime - startTime}ms`)
    
    // 检查Store中是否有错误
    if (assetsStore.error) {
      console.error('Store获取数据失败:', assetsStore.error)
      showToast('数据加载失败')
      return
    }
    
    // 更新资产总览数据
    const overviewData = assetsStore.assetOverview
    console.log('资产总览原始数据:', overviewData)
    
    assetData.value = {
      totalIncome: overviewData.totalIncome || 0,
      totalExpense: overviewData.totalExpense || 0,
      netAssets: overviewData.netAssets || 0
    }
    
    console.log('更新后的资产数据:', assetData.value)
    
    // 更新结构数据
    incomeStructure.value = assetsStore.incomeStructure
    costStructure.value = assetsStore.costStructure
    
    console.log('收入结构数据:', incomeStructure.value)
    console.log('成本结构数据:', costStructure.value)
    
    // 更新图表数据
    console.log('开始更新图表数据...')
    updateChartsFromStore()
    
    console.log('=== 数据加载完成 ===')

  } catch (error) {
    console.error('加载数据失败:', error)
    console.error('错误堆栈:', error.stack)
    showToast('数据加载失败')
  }
}



// 切换时间维度
const handleTabChange = async (name) => {
  try {
    console.log('=== 开始切换时间维度 ===', name)
    activeTab.value = name
    
    let period = 'year'
    let periodName = '本年'
    
    // 按钮名称到时间维度的映射
    const periodMapping = {
      'year': { period: 'year', name: '本年' },
      'month': { period: 'month', name: '本月' },
      'week': { period: 'week', name: '本周' },
      'total': { period: 'total', name: '总统计' }
    }
    
    const mapping = periodMapping[name]
    if (mapping) {
      period = mapping.period
      periodName = mapping.name
    }
    
    console.log('映射结果:', { period, periodName })
    
    // 准备API参数
    const params = { period }
    
    // 获取当前系统时间信息
    const now = new Date()
    const currentDateInfo = {
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      day: now.getDate(),
      dayOfWeek: now.getDay(),
      currentDate: now.toISOString().split('T')[0]
    }
    
    console.log('当前时间信息:', currentDateInfo)
    
    // 添加时间参数
    if (period !== 'total') {
      params.year = currentDateInfo.year
    }
    
    if (period === 'week') {
      params.currentDayOfWeek = currentDateInfo.dayOfWeek
      params.currentDate = currentDateInfo.currentDate
      console.log('本周特殊参数:', {
        currentDayOfWeek: params.currentDayOfWeek,
        currentDate: params.currentDate
      })
    }
    
    console.log('最终API参数:', params)
    
    // 统一加载所有数据
    await loadAllData(params)
    
    console.log('=== 时间维度切换完成 ===', periodName)
    
    showToast(`已切换到${periodName}`)
    
  } catch (error) {
    console.error('切换时间维度失败:', error)
    showToast('数据加载失败')
  }
}

// 从Store中获取数据更新图表（不重新调用API）
const updateChartsFromStore = () => {
  try {
    console.log('=== 开始更新图表数据 ===', activeTab.value)
    
    // 获取Store中已加载的图表数据
    const assetTrendData = assetsStore.assetTrendChartData
    const incomeExpenseData = assetsStore.incomeExpenseTrend
    
    console.log('Store中的原始数据:')
    console.log('- 资产趋势数据:', assetTrendData)
    console.log('- 收支趋势数据:', incomeExpenseData)
    
    // 更新净资产趋势图表
    if (assetTrendChartInstance && assetTrendData) {
      console.log('更新净资产趋势图表:', {
        labels: assetTrendData.labels,
        data: assetTrendData.data,
        labelsLength: assetTrendData.labels?.length,
        dataLength: assetTrendData.data?.length
      })
      
      assetTrendChartInstance.data.labels = assetTrendData.labels || []
      assetTrendChartInstance.data.datasets[0].data = assetTrendData.data || []
      assetTrendChartInstance.update()
      
      console.log('✓ 净资产趋势图表更新完成')
    } else {
      console.warn('净资产趋势图表更新失败:', {
        hasChartInstance: !!assetTrendChartInstance,
        hasData: !!assetTrendData
      })
    }
    
    // 更新收支趋势图表
    if (incomeExpenseChartInstance && incomeExpenseData) {
      // 处理收支趋势数据，支持不同时间维度
      const timeKey = activeTab.value === 'week' ? 'day' : 'month'
      const labels = incomeExpenseData.income?.map(item => item[timeKey]) || []
      const incomeData = incomeExpenseData.income?.map(item => item.value) || []
      const expenseData = incomeExpenseData.expense?.map(item => item.value) || []
      
      console.log('收支趋势图表数据处理:', {
        period: activeTab.value,
        originalData: incomeExpenseData,
        processedLabels: labels,
        processedIncomeData: incomeData,
        processedExpenseData: expenseData,
        labelsLength: labels.length,
        incomeDataLength: incomeData.length,
        expenseDataLength: expenseData.length
      })
      
      // 特别处理本周数据的标签问题
      if (activeTab.value === 'week') {
        console.log('🗓️ 本周数据标签检查:', {
          incomeItems: incomeExpenseData.income,
          expenseItems: incomeExpenseData.expense,
          extractedLabels: labels
        })
      }
      
      incomeExpenseChartInstance.data.labels = labels
      incomeExpenseChartInstance.data.datasets[0].data = incomeData
      incomeExpenseChartInstance.data.datasets[1].data = expenseData
      incomeExpenseChartInstance.update()
      
      console.log('✓ 收支趋势图表更新完成')
    } else {
      console.warn('收支趋势图表更新失败:', {
        hasChartInstance: !!incomeExpenseChartInstance,
        hasData: !!incomeExpenseData
      })
    }
    
    // 更新饼图
    console.log('开始更新饼图...')
    updatePieCharts()
    
    // 更新图表标题
    console.log('开始更新图表标题...')
    updateChartTitles(activeTab.value)
    
    console.log('=== 图表数据更新完成 ===')
    
  } catch (error) {
    console.error('更新图表失败:', error)
    showToast('图表更新失败')
  }
}





// 更新饼图
const updatePieCharts = () => {
  // 更新收入结构饼图
  if (incomeStructureChartInstance) {
    incomeStructureChartInstance.data.labels = incomeStructure.value.map(item => item.name)
    incomeStructureChartInstance.data.datasets[0].data = incomeStructure.value.map(item => item.percentage)
    incomeStructureChartInstance.data.datasets[0].backgroundColor = incomeStructure.value.map(item => item.color)
    incomeStructureChartInstance.update()
  }
  
  // 更新饼图
  if (costStructureChartInstance) {
    costStructureChartInstance.data.labels = costStructure.value.map(item => item.name)
    costStructureChartInstance.data.datasets[0].data = costStructure.value.map(item => item.percentage)
    costStructureChartInstance.data.datasets[0].backgroundColor = costStructure.value.map(item => item.color)
    costStructureChartInstance.update()
  }
}

// 更新图表标题
const updateChartTitles = (period) => {
  let periodText = '近12个月'
  
  switch (period) {
    case 'year':
      periodText = '近12个月'
      break
    case 'month':
      periodText = '本月数据'
      break
    case 'week':
      periodText = '本周数据'
      break
    case 'total':
      periodText = '历年数据'
      break
  }
  
  const titles = document.querySelectorAll('.card-title')
  if (titles[0]) titles[0].textContent = `净资产趋势 (${periodText})`
  if (titles[1]) titles[1].textContent = `收支趋势 (${periodText})`
}

// 初始化净资产趋势图表
const initAssetTrendChart = () => {
  const ctx = assetTrendChart.value.getContext('2d')
  assetTrendChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
      datasets: [{
        label: '净资产',
        data: [25000, 27500, 29800, 32100, 34500, 36200, 37800, 38900, 39100, 39000, 39200, 39320],
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: false,
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      }
    }
  })
}

// 初始化收支对比图表
const initIncomeExpenseChart = () => {
  const ctx = incomeExpenseChart.value.getContext('2d')
  incomeExpenseChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
      datasets: [{
        label: '收入',
        data: [12000, 15000, 13500, 16800, 14200, 18500],
        backgroundColor: '#10B981'
      }, {
        label: '支出',
        data: [8000, 9500, 8800, 11200, 9800, 12300],
        backgroundColor: '#EF4444'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      }
    }
  })
}

// 创建饼图的通用配置
const createPieChartConfig = (dataSource, tooltipCallback) => ({
  type: 'doughnut',
  data: {
    labels: dataSource.value.map(item => item.name),
    datasets: [{
      data: dataSource.value.map(item => item.percentage),
      backgroundColor: dataSource.value.map(item => item.color),
      borderWidth: 0
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: tooltipCallback } }
    },
    cutout: '50%',
    layout: { padding: 30 }
  },
  plugins: [{
    id: 'datalabels',
    afterDraw: function(chart) {
      const ctx = chart.ctx
      ctx.save()
      
      const centerX = chart.chartArea.left + (chart.chartArea.right - chart.chartArea.left) / 2
      const centerY = chart.chartArea.top + (chart.chartArea.bottom - chart.chartArea.top) / 2
      
      chart.data.datasets.forEach((dataset, datasetIndex) => {
        const meta = chart.getDatasetMeta(datasetIndex)
        if (!meta.hidden) {
          dataset.data.forEach((value, index) => {
            const element = meta.data[index]
            if (element && dataSource.value[index]) {
              const item = dataSource.value[index]
              const angle = element.startAngle + (element.endAngle - element.startAngle) / 2
              const radius = element.outerRadius * 0.8
              const x = centerX + Math.cos(angle) * radius
              const y = centerY + Math.sin(angle) * radius
              
              ctx.fillStyle = '#FFFFFF'
              ctx.font = '12px Arial'
              ctx.textAlign = 'center'
              ctx.textBaseline = 'middle'
              ctx.fillText(item.name, x, y - 8)
              ctx.fillText(`${item.percentage}%`, x, y + 8)
            }
          })
        }
      })
      
      ctx.restore()
    }
  }]
})

// 初始化收入结构饼图
const initIncomeStructureChart = () => {
  const ctx = incomeStructureChart.value.getContext('2d')
  const config = createPieChartConfig(incomeStructure, function(context) {
    const item = incomeStructure.value[context.dataIndex]
    return `${item.name}: ¥${formatNumber(item.value)} (${item.percentage}%)`
  })
  incomeStructureChartInstance = new Chart(ctx, config)
}

// 初始化成本结构分析饼图
const initCostStructureChart = () => {
  const ctx = costStructureChart.value.getContext('2d')
  const config = createPieChartConfig(costStructure, function(context) {
    const item = costStructure.value[context.dataIndex]
    return `${item.name}: ¥${formatNumber(item.value)} (${item.percentage}%)`
  })
  costStructureChartInstance = new Chart(ctx, config)
}

// 组件挂载后初始化图表
onMounted(async () => {
  try {
    // 等待DOM更新
    await nextTick()
    
    // 初始化所有图表
    initAssetTrendChart()
    initIncomeExpenseChart()
    initIncomeStructureChart()
    initCostStructureChart()
    
    // 初始化数据
    const now = new Date()
    const initialParams = {
      period: 'year',
      year: now.getFullYear()
    }
    
    await loadAllData(initialParams)
    
  } catch (error) {
    console.error('初始化图表失败:', error)
    showToast('图表加载失败')
  }
})
</script>

<style scoped>
.asset-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .grid {
    grid-template-columns: 1fr;
  }
}

.chart-container {
  position: relative;
  height: 300px;
}

.pie-chart-container {
  position: relative;
  height: 250px;
}

.card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  border: 1px solid #e5e7eb;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.card-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
}

.card-body {
  padding: 1.5rem;
}

/* 标签切换按钮样式 */
.tab-button {
  transition: all 0.2s ease;
}

.tab-button.active {
  background-color: white;
  color: #111827;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

/* 图表容器样式优化 */
.pie-chart-container {
  position: relative;
  height: 350px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>