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
          <h3 class="card-title">净资产趋势</h3>
          <div class="flex items-center space-x-2">
            <div class="w-3 h-3 bg-green-500 rounded-full"></div>
            <span class="text-sm text-gray-600">近12个月</span>
          </div>
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
              <canvas ref="costChart"></canvas>
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
import { 
  getAssetDataByPeriod,
  getAssetOverview,
  getAssetTrend,
  getIncomeExpenseTrend,
  getIncomeStructure,
  getCostStructure,
  getAssetStatistics
} from '@/mock'

// 响应式数据
const activeTab = ref('year')
const assetTrendChart = ref(null)
const incomeExpenseChart = ref(null)
const incomeStructureChart = ref(null)
const costChart = ref(null)

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
let costChartInstance = null

// 格式化数字
const formatNumber = (num) => {
  return num.toLocaleString('zh-CN')
}

// 加载资产数据
const loadAssetData = async (period = 'year') => {
  try {
    // 获取资产总览
    const overviewData = getAssetOverview({ period })
    assetData.value = {
      totalIncome: overviewData.totalIncome || 0,
      totalExpense: overviewData.totalExpense || 0,
      netAssets: overviewData.netAssets || 0
    }
    
    // 获取收入结构
    incomeStructure.value = getIncomeStructure({ period })
    
    // 获取成本结构
    costStructure.value = getCostStructure({ period })
    
    console.log('资产数据加载成功:', {
      overview: assetData.value,
      incomeStructure: incomeStructure.value,
      costStructure: costStructure.value
    })
  } catch (error) {
    console.error('加载资产数据失败:', error)
    showToast('数据加载失败')
  }
}

// 切换时间维度
const handleTabChange = async (name) => {
  try {
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
    
    // 加载数据
    await loadAssetData(period)
    
    // 更新图表
    await updateCharts(period)
    
    showToast(`已切换到${periodName}`)
    
  } catch (error) {
    console.error('切换时间维度失败:', error)
    showToast('数据加载失败')
  }
}

// 更新图表数据
const updateCharts = async (period = 'year') => {
  try {
    // 从mock数据库获取数据
    const chartData = getAssetDataByPeriod(period)
    
    // 更新净资产趋势图表
    if (assetTrendChartInstance) {
      assetTrendChartInstance.data.labels = chartData.labels
      assetTrendChartInstance.data.datasets[0].data = chartData.datasets[0].data
      assetTrendChartInstance.update()
    }
    
    // 更新收支趋势图表
    if (incomeExpenseChartInstance) {
      incomeExpenseChartInstance.data.labels = chartData.incomeExpense.labels
      incomeExpenseChartInstance.data.datasets[0].data = chartData.incomeExpense.datasets[0].data
      incomeExpenseChartInstance.data.datasets[1].data = chartData.incomeExpense.datasets[1].data
      incomeExpenseChartInstance.update()
    }
    
    // 更新饼图
    updatePieCharts()
    
    // 更新图表标题
    updateChartTitles(period)
    
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
  
  // 更新成本结构饼图
  if (costChartInstance) {
    costChartInstance.data.labels = costStructure.value.map(item => item.name)
    costChartInstance.data.datasets[0].data = costStructure.value.map(item => item.percentage)
    costChartInstance.data.datasets[0].backgroundColor = costStructure.value.map(item => item.color)
    costChartInstance.update()
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
  
  // 更新净资产趋势图表标题
  const assetTrendTitle = document.querySelector('.card-title')
  if (assetTrendTitle) {
    assetTrendTitle.textContent = `净资产趋势 (${periodText})`
  }
  
  // 更新收支趋势图表标题
  const incomeExpenseTitle = document.querySelectorAll('.card-title')[1]
  if (incomeExpenseTitle) {
    incomeExpenseTitle.textContent = `收支趋势 (${periodText})`
  }
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

// 初始化收入结构饼图
const initIncomeStructureChart = () => {
  const ctx = incomeStructureChart.value.getContext('2d')
  incomeStructureChartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: incomeStructure.value.map(item => item.name),
      datasets: [{
        data: incomeStructure.value.map(item => item.percentage),
        backgroundColor: incomeStructure.value.map(item => item.color),
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const item = incomeStructure.value[context.dataIndex]
              return `${item.name}: ¥${formatNumber(item.value)} (${item.percentage}%)`
            }
          }
        }
      },
      cutout: '50%',
      layout: {
        padding: 30
      }
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
              if (element) {
                const item = incomeStructure.value[index]
                const percentage = item.percentage
                
                // 计算标签位置
                const angle = element.startAngle + (element.endAngle - element.startAngle) / 2
                const radius = element.outerRadius * 0.8
                const x = centerX + Math.cos(angle) * radius
                const y = centerY + Math.sin(angle) * radius
                
                // 绘制文字
                ctx.fillStyle = '#FFFFFF'
                ctx.font = '12px Arial'
                ctx.textAlign = 'center'
                ctx.textBaseline = 'middle'
                ctx.fillText(item.name, x, y - 8)
                ctx.fillText(`${percentage}%`, x, y + 8)
              }
            })
          }
        })
        
        ctx.restore()
      }
    }]
  })
}

// 初始化成本结构分析饼图
const initCostChart = () => {
  const ctx = costChart.value.getContext('2d')
  costChartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: costStructure.value.map(item => item.name),
      datasets: [{
        data: costStructure.value.map(item => item.percentage),
        backgroundColor: costStructure.value.map(item => item.color),
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const item = costStructure.value[context.dataIndex]
              return `${item.name}: ¥${formatNumber(item.value)} (${item.percentage}%)`
            }
          }
        }
      },
      cutout: '50%',
      layout: {
        padding: 30
      }
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
              if (element) {
                const item = costStructure.value[index]
                const percentage = item.percentage
                
                // 计算标签位置
                const angle = element.startAngle + (element.endAngle - element.startAngle) / 2
                const radius = element.outerRadius * 0.8
                const x = centerX + Math.cos(angle) * radius
                const y = centerY + Math.sin(angle) * radius
                
                // 绘制文字
                ctx.fillStyle = '#FFFFFF'
                ctx.font = '12px Arial'
                ctx.textAlign = 'center'
                ctx.textBaseline = 'middle'
                ctx.fillText(item.name, x, y - 8)
                ctx.fillText(`${percentage}%`, x, y + 8)
              }
            })
          }
        })
        
        ctx.restore()
      }
    }]
  })
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
    initCostChart()
    
    // 加载初始数据
    await loadAssetData('year')
    
    // 初始化图表数据
    await updateCharts('year')
    
    // 添加调试信息
    console.log('资产总览页面初始化完成')
    console.log('当前时间维度:', activeTab.value)
    console.log('资产数据:', assetData.value)
    
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
  @apply bg-white rounded-lg shadow-sm border border-gray-200;
}

.card-header {
  @apply flex items-center justify-between p-6 border-b border-gray-200;
}

.card-title {
  @apply text-lg font-semibold text-gray-900;
}

.card-body {
  @apply p-6;
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