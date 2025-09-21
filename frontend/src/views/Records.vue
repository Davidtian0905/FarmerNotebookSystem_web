<template>
  <Layout>
    <div class="flex items-center justify-between mb-6">
   <!-- 页面标题 -->
      <div>
        <h2 class="text-2xl font-semibold text-gray-900">流水记录</h2>
        <p class="text-gray-600 mt-1">查看和管理所有收支记录</p>
        </div>
      <van-button
        type="primary"
        size="small"
        @click="refreshData"
        :loading="recordsStore.loading"
        class="shadow-md hover:shadow-lg transition-all duration-300 rounded-lg"
      >
        <i class="fas fa-sync-alt mr-2"></i>
        刷新
      </van-button>
    </div>

    <!-- 筛选器 -->
    <div class="header bg-white border border-gray-200 rounded-2xl p-4 mb-4 shadow-sm"></div>
    <div class="filter-card rounded-2xl p-6 mb-6 bg-white border border-gray-200 shadow-md">
      <div class="flex flex-wrap justify-between items-center">
        <!-- 左侧筛选选项 -->
        <div class="filter-left flex-1 flex items-center space-x-4">
          <div class="filter-item">
            <select v-model="filters.timeRange" class="form-select bg-white border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-base">
              <option v-for="option in timeRangeOptions" :key="option.value" :value="option.value">{{ option.text }}</option>
            </select>
          </div>
          
          <div class="filter-item">
            <select v-model="filters.type" class="form-select bg-white border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-base">
              <option v-for="option in typeOptions" :key="option.value" :value="option.value">{{ option.text }}</option>
            </select>
          </div>
          
          <div class="filter-item">
            <select v-model="filters.productType" class="form-select bg-white border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-base">
              <option v-for="option in productTypeOptions" :key="option.value" :value="option.value">{{ option.text }}</option>
            </select>
          </div>
          
          <div class="filter-item">
            <select v-model="filters.amountRange" class="form-select bg-white border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-base">
              <option v-for="option in amountRangeOptions" :key="option.value" :value="option.value">{{ option.text }}</option>
            </select>
          </div>
        </div>
        
        <!-- 右侧按钮 -->
        <div class="filter-right flex items-center space-x-3 ml-4">
          <van-button type="primary" size="normal" color="#10b981" class="shadow hover:shadow-lg transition-all duration-300 rounded-lg px-6 py-2.5 text-base" @click="applyFilters">
            <i class="fas fa-search mr-2"></i>
            筛选
          </van-button>
          <van-button plain size="normal" class="border-gray-300 text-gray-600 shadow hover:shadow-lg transition-all duration-300 rounded-lg px-6 py-2.5 text-base" @click="resetFilters">
            <i class="fas fa-undo mr-1"></i>
            重置
          </van-button>
        </div>
      </div>
    </div>

    <div v-if="recordsStore.loading" class="flex justify-center items-center py-12">
      <van-loading type="spinner" size="24px">加载中...</van-loading>
    </div>

    <div v-else-if="recordsStore.error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <div class="flex items-center">
        <i class="fas fa-exclamation-triangle text-red-500 mr-2"></i>
        <span class="text-red-700">{{ recordsStore.error }}</span>
        <van-button
          type="danger"
          size="small"
          class="ml-auto"
          @click="refreshData"
        >
          重试
        </van-button>
      </div>
    </div>
    
    <!-- 消息提示 -->
    <div v-if="recordsStore.message" class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 transition-all duration-300">
      <div class="flex items-center">
        <i class="fas fa-info-circle text-blue-500 mr-2"></i>
        <span class="text-blue-700">{{ recordsStore.message }}</span>
      </div>
    </div>

    <!-- 流水明细列表 -->
    <div v-else class="card rounded-2xl shadow overflow-hidden">
      <div class="card-header flex justify-between items-center p-5 bg-white border-b">
        <h3 class="card-title font-semibold text-gray-900 flex items-center">
          <i class="fas fa-list-ul text-green-600 mr-2"></i>
          流水明细
        </h3>
        <div class="flex items-center space-x-6">
          <div class="flex items-center space-x-2">
            <div class="w-3 h-3 bg-green-500 rounded-full"></div>
            <span class="text-sm text-gray-700 font-medium">收入</span>
          </div>
          <div class="flex items-center space-x-2">
            <div class="w-3 h-3 bg-red-500 rounded-full"></div>
            <span class="text-sm text-gray-700 font-medium">支出</span>
          </div>
        </div>
      </div>

      <div class="bg-white overflow-hidden">
        <template v-if="groupedRecords.length > 0">
          <div v-for="(group, index) in groupedRecords" :key="index" class="mb-2">
            <div class="date-divider px-4 py-3 bg-gray-50 border-l-4 border-green-500 flex items-center">
              <i class="fas fa-calendar-day text-green-600 mr-2"></i>
              <span class="text-sm font-medium text-gray-800">{{ formatDate(group.date) }}</span>
            </div>
            <div class="space-y-0">
              <div 
                v-for="record in group.records" 
                :key="record.productCode || record.materialCode" 
                class="record-item flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50 transition-all duration-200 hover:translate-x-1"
              >
                <div class="flex items-center space-x-4">
                  <div 
                    :class="[
                      'w-10 h-10 rounded-full flex items-center justify-center shadow',
                      record.type === 'INBOUND' ? 'bg-green-100' : 'bg-red-100'
                    ]"
                  >
                    <i 
                      :class="[
                        record.type === 'INBOUND' ? 'fas fa-leaf text-green-600' : 'fas fa-box text-red-600'
                      ]"
                    ></i>
                  </div>
                  <div>
                    <div class="font-medium text-gray-900">{{ record.productName || record.materialName }}</div>
                    <div class="text-sm text-gray-500 flex items-center mt-1">
                      <span 
                        :class="[
                          'text-xs px-2 py-0.5 rounded-full',
                          record.type === 'INBOUND' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        ]"
                      >
                        {{ record.type === 'INBOUND' ? '收入' : '支出' }}
                      </span>
                      <span class="ml-2 flex items-center">
                        <i class="fas fa-cubes text-gray-500 mr-1 text-xs"></i>
                        {{ record.quantity }} {{ record.unit }}
                      </span>
                    </div>
                  </div>
                </div>
                <div class="text-right">
                  <div 
                    :class="[
                      'font-bold text-lg',
                      record.type === 'INBOUND' ? 'text-green-600' : 'text-red-600'
                    ]"
                  >
                    {{ record.type === 'INBOUND' ? '+' : '-' }} {{ formatCurrency(record.totalPrice || record.amount) }}
                  </div>
                  <div class="text-xs text-gray-500 flex items-center justify-end mt-1">
                    <i class="fas fa-clock text-gray-500 mr-1"></i>
                    {{ record.time.substring(0, 5) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
        <div v-else class="p-16 text-center">
          <div class="bg-gray-50 rounded-xl p-8 max-w-md mx-auto">
            <i class="fas fa-search mb-4 text-4xl text-gray-300"></i>
            <p class="text-lg font-medium text-gray-700">没有找到符合条件的记录</p>
            <p class="text-sm text-gray-500 mt-2">请尝试调整筛选条件或选择其他时间范围</p>
            <van-button plain size="small" class="mt-4 border-gray-300 text-gray-600" @click="resetFilters">
              <i class="fas fa-undo mr-1"></i>
              重置筛选条件
            </van-button>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import Layout from '@/components/layout/Layout.vue';
import { useRecordsStore } from '@/stores/records.js';

const recordsStore = useRecordsStore();

// 筛选条件
const filters = ref({
  timeRange: 'all',
  type: 'all',
  productType: 'all',
  amountRange: 'all',
  keyword: '',
});

// 筛选选项
const timeRangeOptions = [
  { text: '全部时间', value: 'all' },
  { text: '今天', value: 'today' },
  { text: '本周', value: 'week' },
  { text: '本月', value: 'month' },
  { text: '本季度', value: 'quarter' },
  { text: '本年', value: 'year' },
];

const typeOptions = [
  { text: '全部类型', value: 'all' },
  { text: '收入', value: 'INBOUND' },
  { text: '支出', value: 'OUTBOUND' },
];

const productTypeOptions = [
  { text: '全部商品', value: 'all' },
  { text: '铁观音', value: 'tieguanyin' },
  { text: '龙井茶', value: 'longjing' },
  { text: '普洱茶', value: 'puer' },
  { text: '大红袍', value: 'dahongpao' },
];

const amountRangeOptions = [
  { text: '全部金额', value: 'all' },
  { text: '¥0 - ¥100', value: '0-100' },
  { text: '¥100 - ¥500', value: '100-500' },
  { text: '¥500 - ¥1000', value: '500-1000' },
  { text: '¥1000以上', value: '1000+' },
];

// 筛选记录
const filteredRecords = computed(() => {
  return recordsStore.records.filter(record => {
    const amount = record.totalPrice || record.amount;
    const name = record.productName || record.materialName || '';
    
    // 类型筛选
    const typeMatch = filters.value.type === 'all' ? true : record.type === filters.value.type;
    
    // 金额筛选
    let amountMatch = true;
    if (filters.value.amountRange === '0-100') {
      amountMatch = amount >= 0 && amount <= 100;
    } else if (filters.value.amountRange === '100-500') {
      amountMatch = amount > 100 && amount <= 500;
    } else if (filters.value.amountRange === '500-1000') {
      amountMatch = amount > 500 && amount <= 1000;
    } else if (filters.value.amountRange === '1000+') {
      amountMatch = amount > 1000;
    }
    
    // 商品类型筛选
    const productTypeMatch = filters.value.productType === 'all' ? true : 
      (name.toLowerCase().includes(filters.value.productType.toLowerCase()));
    
    // 时间筛选
    let timeMatch = true;
    const recordDate = new Date(record.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (filters.value.timeRange === 'today') {
      const todayStr = today.toISOString().split('T')[0];
      timeMatch = record.date === todayStr;
    } else if (filters.value.timeRange === 'week') {
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay());
      timeMatch = recordDate >= weekStart;
    } else if (filters.value.timeRange === 'month') {
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
      timeMatch = recordDate >= monthStart;
    } else if (filters.value.timeRange === 'quarter') {
      const quarterMonth = Math.floor(today.getMonth() / 3) * 3;
      const quarterStart = new Date(today.getFullYear(), quarterMonth, 1);
      timeMatch = recordDate >= quarterStart;
    } else if (filters.value.timeRange === 'year') {
      const yearStart = new Date(today.getFullYear(), 0, 1);
      timeMatch = recordDate >= yearStart;
    }
    
    return typeMatch && amountMatch && productTypeMatch && timeMatch;
  });
});

// 按日期分组记录
const groupedRecords = computed(() => {
  const groups = {};
  
  filteredRecords.value.forEach(record => {
    if (!groups[record.date]) {
      groups[record.date] = {
        date: record.date,
        records: []
      };
    }
    groups[record.date].records.push(record);
  });
  
  // 转换为数组并按日期排序（最新的在前面）
  return Object.values(groups).sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });
});

// 格式化日期显示
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  const weekday = weekdays[date.getDay()];
  
  return `${month}-${day} ${weekday}`;
};

// 格式化货币显示
const formatCurrency = (value) => {
  if (typeof value !== 'number') {
    return value;
  }
  return new Intl.NumberFormat('zh-CN', { style: 'currency', currency: 'CNY' }).format(value);
};

// 应用筛选
const applyFilters = () => {
  // 已经通过计算属性自动应用了筛选
  // 添加筛选应用的反馈
  if (filteredRecords.value.length === 0) {
    recordsStore.setMessage('没有找到符合条件的记录');
  } else {
    recordsStore.setMessage(`找到 ${filteredRecords.value.length} 条符合条件的记录`);
    setTimeout(() => {
      recordsStore.resetMessage();
    }, 3000);
  }
};

// 重置筛选
const resetFilters = () => {
  filters.value = {
    timeRange: 'week',
    type: 'all',
    productType: 'all',
    amountRange: 'all',
    keyword: '',
  };
};

// 刷新数据
const refreshData = async () => {
  // 清除记录store的缓存
  recordsStore.clearData();
  
  // 重新加载所有数据
  await recordsStore.fetchRecords();
};

// 设置自动刷新（每60秒刷新一次）
let refreshInterval;

onMounted(() => {
  // 初始加载数据
  recordsStore.fetchRecords();
  
  // 设置自动刷新
  refreshInterval = setInterval(() => {
    refreshData();
  }, 60000);
});

// 组件卸载时清除定时器
onUnmounted(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval);
  }
});
</script>

<style scoped>
.filter-item {
  width: 100%;
}

.record-item {
  transition: all 0.2s ease;
}

.record-item:hover {
  background-color: #f8fafc;
  transform: translateX(4px);
}

.date-divider {
  background: #f1f5f9;
  border-left: 4px solid #10b981;
}
</style>
