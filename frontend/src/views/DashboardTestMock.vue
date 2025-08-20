<template>
  <Layout>
    <div class="p-6">
      <h2 class="text-2xl font-semibold text-gray-900 mb-6">Mock数据测试</h2>
      
      <!-- 调试信息 -->
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 class="text-lg font-semibold text-blue-900 mb-2">调试信息</h3>
        <div class="space-y-2 text-sm">
          <div><strong>当前日期:</strong> {{ currentDate }}</div>
          <div><strong>数据条数:</strong> {{ debugInfo.dataCount }}</div>
          <div><strong>是否初始化:</strong> {{ debugInfo.isInitialized ? '是' : '否' }}</div>
          <div><strong>最后更新:</strong> {{ debugInfo.lastUpdate }}</div>
        </div>
      </div>

      <!-- 今日数据 -->
      <div class="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <h3 class="text-lg font-semibold text-green-900 mb-2">今日数据</h3>
        <div class="space-y-2 text-sm">
          <div><strong>日期:</strong> {{ todayData?.date || '无数据' }}</div>
          <div><strong>收入:</strong> {{ todayData?.total_income || 0 }}</div>
          <div><strong>支出:</strong> {{ todayData?.total_expense || 0 }}</div>
          <div><strong>利润:</strong> {{ calculatedTodayProfit }}</div>
        </div>
      </div>

      <!-- 增长率分析 -->
      <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <h3 class="text-lg font-semibold text-yellow-900 mb-2">增长率分析</h3>
        <div class="space-y-2 text-sm">
          <div><strong>收入增长率:</strong> {{ growthAnalysis.income_growth_rate }}%</div>
          <div><strong>支出增长率:</strong> {{ growthAnalysis.expense_growth_rate }}%</div>
          <div><strong>利润增长率:</strong> {{ growthAnalysis.profit_growth_rate }}%</div>
        </div>
      </div>

      <!-- 所有数据 -->
      <div class="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-2">所有数据 ({{ allData.length }}条)</h3>
        <div class="space-y-2 text-sm max-h-60 overflow-y-auto">
          <div v-for="item in allData" :key="item.date" class="border-b border-gray-200 pb-2">
            <div><strong>{{ item.date }}:</strong> 收入{{ item.total_income }}, 支出{{ item.total_expense }}, 利润{{ item.net_profit || calculateNetProfit(item.total_income, item.total_expense) }}</div>
          </div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="space-x-4">
        <van-button type="primary" @click="refreshData">刷新数据</van-button>
        <van-button type="warning" @click="resetData">重置数据</van-button>
        <van-button type="success" @click="updateTestData">更新测试数据</van-button>
        <van-button @click="debugData">调试数据</van-button>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { showToast } from 'vant'
import { 
  getDashboardData, 
  getTodayDashboardData, 
  getDatabaseConfig,
  resetDashboardData,
  updateDashboardData,
  debugDashboardData,
  calculateNetProfit,
  calculateGrowthAnalysis
} from '@/mock'

// 响应式数据
const currentDate = ref('')
const debugInfo = ref({})
const todayData = ref(null)
const allData = ref([])
const growthAnalysis = ref({
  income_growth_rate: 0,
  expense_growth_rate: 0,
  profit_growth_rate: 0
})

// 计算属性
const calculatedTodayProfit = computed(() => {
  if (!todayData.value) return 0
  return calculateNetProfit(todayData.value.total_income || 0, todayData.value.total_expense || 0)
})

// 初始化数据
const initData = () => {
  currentDate.value = new Date().toISOString().split('T')[0]
  debugInfo.value = getDatabaseConfig()
  todayData.value = getTodayDashboardData()
  allData.value = getDashboardData()
  growthAnalysis.value = calculateGrowthAnalysis(allData.value)
}

// 刷新数据
const refreshData = () => {
  initData()
  showToast('数据已刷新')
}

// 重置数据
const resetData = () => {
  resetDashboardData()
  initData()
  showToast('数据已重置')
}

// 更新测试数据
const updateTestData = () => {
  const testDate = '2024-07-31'
  updateDashboardData(testDate, {
    total_income: 3500,
    total_expense: 2200
  })
  initData()
  showToast('测试数据已更新')
}

// 调试数据
const debugData = () => {
  const debugResult = debugDashboardData()
  growthAnalysis.value = debugResult.growthAnalysis
  showToast('调试信息已输出到控制台')
}

// 生命周期
onMounted(() => {
  initData()
})
</script>

<style scoped lang="scss">
.test-mock-container {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.mock-controls,
.login-test,
.test-accounts {
  margin-bottom: 30px;
  padding: 20px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: white;
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

.test-accounts ul {
  list-style: none;
  padding: 0;
  
  li {
    padding: 8px 0;
    border-bottom: 1px solid #e5e7eb;
    
    &:last-child {
      border-bottom: none;
    }
  }
}
</style> 