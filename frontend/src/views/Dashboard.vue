<template>
  <Layout>
    <!-- 页面标题 -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-2xl font-semibold text-gray-900">仪表板</h2>
        <p class="text-gray-600 mt-1">欢迎回来，{{ userStore.userInfo?.nickname || userStore.userInfo?.username || '用户' }}！今天是{{ getCurrentWeekday() }}</p>
      </div>
      <div class="flex items-center space-x-3">
        <van-button 
          type="primary" 
          size="small"
          @click="refreshData"
          :loading="dashboardStore.loading"
        >
          <i class="fas fa-sync-alt mr-1"></i>
          刷新
        </van-button>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="dashboardStore.loading && !dashboardStore.hasData" class="flex justify-center items-center py-12">
      <van-loading type="spinner" size="24px">加载中...</van-loading>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="dashboardStore.error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <div class="flex items-center">
        <i class="fas fa-exclamation-triangle text-red-500 mr-2"></i>
        <span class="text-red-700">{{ dashboardStore.error }}</span>
        <van-button 
          type="danger" 
          size="small" 
          class="ml-auto"
          @click="retryLoad"
        >
          重试
        </van-button>
      </div>
    </div>

    <!-- 主要内容 -->
    <div v-else>
      <!-- 统计卡片 -->
      <div class="stats-container mb-8">
        <StatCard
          title="今日收入"
          subtitle="收入较昨日增长"
          :value="dashboardStore.totalIncome"
          icon="fas fa-wallet"
          icon-bg-color="#10B981"
          :trend="dashboardStore.inboundTrend"
          type="success"
        />
        
        <StatCard
          title="今日支出"
          :value="dashboardStore.totalExpense"
          icon="fas fa-credit-card"
          icon-bg-color="#EF4444"
          subtitle="支出较昨日增长"
          :trend="dashboardStore.salesTrend"
          type="danger"
        />
        
        <StatCard
          title="今日利润"
          subtitle="较昨日"
          :value="dashboardStore.netProfit"
          icon="fas fa-chart-line"
          icon-bg-color="#3B82F6"
          :trend="dashboardStore.profitTrend"
          type="default"
        />
        
      </div>

      <!-- 快速操作 -->
      <div class="mb-8">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">快速操作</h3>
        <div class="quick-actions-container">
          <QuickAction
            v-for="action in quickActions"
            :key="action.id"
            :title="action.title"
            :description="action.description"
            :icon="action.icon"
            :icon-bg-color="action.iconBgColor"
            :route="action.route"
            @click="handleQuickAction"
          />
        </div>
      </div>

      <!-- 图表区域 -->
      <div class="charts-container mb-8">
        <!-- 收支趋势图 -->
        <ChartWidget
          title="收支趋势"
          subtitle="近7天收支变化"
          type="line"
          :data="incomeExpenseData"
          height="300px"
        >
          <template #actions>
            <van-button size="small" @click="refreshChartData('incomeExpense')">
              <i class="fas fa-sync-alt"></i>
            </van-button>
          </template>
        </ChartWidget>
      </div>

    </div>
  </Layout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import Layout from '@/components/layout/Layout.vue'
import StatCard from '@/components/dashboard/StatCard.vue'
import QuickAction from '@/components/dashboard/QuickAction.vue'
import ChartWidget from '@/components/dashboard/ChartWidget.vue'
import { useDashboardStore } from '@/stores/dashboard.js'
import { useUserStore } from '@/stores/user.js'

const router = useRouter()
const dashboardStore = useDashboardStore()
const userStore = useUserStore()

// 获取当前是星期几
const getCurrentWeekday = () => {
  const days = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  const date = new Date();
  return days[date.getDay()];
};

// 静态快速操作配置
const quickActions = [
  {
    id: 1,
    title: '入库记录',
    description: '添加新的物料记录',
    icon: 'fas fa-plus',
    iconBgColor: '#10B981',
    route: '/records/income'
  },
  {
    id: 2,
    title: '销售记录',
    description: '添加新的交易记录',
    icon: 'fas fa-minus',
    iconBgColor: '#EF4444',
    route: '/records/sale'
  },
  {
    id: 3,
    title: '语音记账',
    description: 'AI智能语音记录',
    icon: 'fas fa-microphone',
    iconBgColor: '#8B5CF6',
    route: '/records/voice'
  },
  {
    id: 4,
    title: 'OCR记账',
    description: '拍照识别票据记账',
    icon: 'fas fa-camera',
    iconBgColor: '#F59E0B',
    route: '/records/ocr'
  },
  {
    id: 5,
    title: '库存盘点',
    description: '检查库存状态',
    icon: 'fas fa-clipboard-check',
    iconBgColor: '#EC4899',
    route: '/inventory/check'
  }
]

// 图表数据
const incomeExpenseData = computed(() => {
  if (!dashboardStore.weekData?.charts?.incomeExpense) {
    return {
      labels: [],
      datasets: []
    }
  }
  
  const chartData = dashboardStore.weekData.charts.incomeExpense
  return {
    labels: chartData.map(item => item.day),
    datasets: [
      {
        label: '收入',
        data: chartData.map(item => item.income),
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4
      },
      {
        label: '支出',
        data: chartData.map(item => item.expense),
        borderColor: '#EF4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4
      }
    ]
  }
})

// 方法
const refreshData = async () => {
  try {
    await dashboardStore.fetchAllData()
    showToast('数据已刷新')
  } catch (error) {
    console.error('刷新数据失败:', error)
    showToast('刷新失败，请重试')
  }
}

const retryLoad = () => {
  dashboardStore.resetError()
  refreshData()
}

const handleQuickAction = (action) => {
  if (action.route) {
    router.push(action.route)
  }
}

const refreshChartData = async (chartType) => {
  try {
    await dashboardStore.fetchChartData(chartType)
    showToast('图表数据已更新')
  } catch (error) {
    console.error('更新图表数据失败:', error)
    showToast('更新失败，请重试')
  }
}

// 生命周期
onMounted(async () => {
  try {
    await refreshData()
  } catch (error) {
    console.error('加载仪表板数据失败:', error)
  }
})
</script>

<style scoped>
.stats-container {
  display: flex;
  gap: 24px;
  overflow-x: auto;
  padding-bottom: 8px;
}

.stats-container > * {
  flex: 1;
  min-width: 280px;
}

.quick-actions-container {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  padding-bottom: 8px;
}

.quick-actions-container > * {
  flex: 1;
  min-width: 200px;
}

.charts-container {
  display: flex;
  gap: 24px;
  overflow-x: auto;
  padding-bottom: 8px;
}

.charts-container > * {
  flex: 1;
  min-width: 400px;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .stats-container {
    flex-wrap: wrap;
  }
  
  .stats-container > * {
    flex: 1 1 calc(50% - 12px);
    min-width: 240px;
  }
  
  .charts-container {
    flex-direction: column;
  }
  
  .charts-container > * {
    flex: none;
    min-width: auto;
  }
}

@media (max-width: 768px) {
  .stats-container {
    flex-direction: column;
    gap: 16px;
  }
  
  .stats-container > * {
    flex: none;
    min-width: auto;
  }
  
  .quick-actions-container {
    flex-direction: column;
    gap: 12px;
  }
  
  .quick-actions-container > * {
    flex: none;
    min-width: auto;
  }
}
</style> 