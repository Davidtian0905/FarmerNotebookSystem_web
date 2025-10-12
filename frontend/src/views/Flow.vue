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
      <div class="flex flex-wrap items-center">
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
        <h3 class="card-title font-semibold text-gray-900">
          流水明细
        </h3>
        <div class="legend flex items-center space-x-6">
          <div class="legend-item flex items-center space-x-2">
            <div class="legend-dot income-dot w-3 h-3 bg-green-600 rounded-full shadow-sm"></div>
            <span class="legend-text text-sm text-gray-700 font-medium">收入</span>
          </div>
          <div class="legend-item flex items-center space-x-2">
            <div class="legend-dot expense-dot w-3 h-3 bg-red-600 rounded-full shadow-sm"></div>
            <span class="legend-text text-sm text-gray-700 font-medium">支出</span>
          </div>
        </div>
      </div>

      <div class="bg-white overflow-hidden">
        <template v-if="paginatedRecords.length > 0">
          <div v-for="(group, index) in paginatedRecords" :key="index" class="mb-2">
            <div class="date-divider px-4 py-3 bg-gray-50 border-l-4 border-green-500 flex items-center">
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
                    <div 
                      :class="[
                        'w-4 h-4 rounded-full',
                        record.type === 'INBOUND' ? 'bg-green-600' : 'bg-red-600'
                      ]"
                    ></div>
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
      
      <!-- 分页控件 -->
      <div v-if="groupedRecords.length > 0" class="pagination bg-white border-t border-gray-200 p-4 flex justify-between items-center">
        <div class="pagination-info text-sm text-gray-600">
          每页显示1-{{ pageSize }}条，共{{ filteredRecords.length }}条记录
        </div>
        <div class="pagination-controls flex items-center space-x-2">
          <button 
            @click="prevPage" 
            :disabled="currentPage === 1"
            :class="[
              'pagination-btn',
              currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'
            ]"
          >
            <i class="fas fa-chevron-left"></i>
          </button>
          
          <template v-if="totalPages <= 7">
            <button 
              v-for="page in pageNumbers" 
              :key="page" 
              @click="changePage(page)"
              :class="[
                'pagination-btn',
                currentPage === page ? 'bg-green-600 text-white border-green-600' : 'hover:bg-gray-100'
              ]"
            >
              {{ page }}
            </button>
          </template>
          
          <template v-else>
            <!-- 显示前3页、当前页和最后3页 -->
            <template v-for="page in pageNumbers" :key="page">
              <button 
                v-if="page <= 3 || page > totalPages - 3 || Math.abs(page - currentPage) <= 1"
                @click="changePage(page)"
                :class="[
                  'pagination-btn',
                  currentPage === page ? 'bg-green-600 text-white border-green-600' : 'hover:bg-gray-100'
                ]"
              >
                {{ page }}
              </button>
              <span 
                v-else-if="page === 4 && currentPage > 4" 
                class="px-2 text-gray-400"
              >...</span>
              <span 
                v-else-if="page === totalPages - 3 && currentPage < totalPages - 3" 
                class="px-2 text-gray-400"
              >...</span>
            </template>
          </template>
          
          <button 
            @click="nextPage" 
            :disabled="currentPage === totalPages"
            :class="[
              'pagination-btn',
              currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'
            ]"
          >
            <i class="fas fa-chevron-right"></i>
          </button>
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

// 分页相关
const currentPage = ref(1);
const pageSize = ref(10);

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

// 分页后的记录
const paginatedRecords = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize.value;
  const endIndex = startIndex + pageSize.value;
  return groupedRecords.value.slice(startIndex, endIndex);
});

// 总页数
const totalPages = computed(() => {
  return Math.ceil(groupedRecords.value.length / pageSize.value);
});

// 页码数组
const pageNumbers = computed(() => {
  const pages = [];
  for (let i = 1; i <= totalPages.value; i++) {
    pages.push(i);
  }
  return pages;
});

// 切换页码
const changePage = (page) => {
  currentPage.value = page;
};

// 前一页
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

// 后一页
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

// 格式化日期显示
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  const weekday = weekdays[date.getDay()];
  
  return `${year}-${month}-${day} ${weekday}`;
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
    timeRange: 'all',
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
/* 整体页面样式 */
:deep(.app-content) {
  background-color: #f5f7fa;
  padding: 1.5rem;
}

/* 标题样式 */
h2.text-2xl {
  color: #333;
  font-weight: 600;
}

/* 筛选器样式 */
.filter-card {
  background-color: white;
  border-radius: 0.75rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  margin-bottom: 1.5rem;
  padding: 1.25rem;
  border: 1px solid #eaedf2;
}

.filter-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.filter-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  width: 100%;
}

.filter-item {
  width: 100%;
  margin-bottom: 0;
}

.filter-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 0.5rem;
}

.form-select {
  width: 100%;
  border-radius: 0.5rem;
  border: 1px solid #e0e3e9;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  background-color: #fff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: all 0.2s;
}

.form-select:focus {
  border-color: #10b981;
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
}

.filter-btn {
  border-radius: 0.5rem;
  padding: 0.5rem 1.25rem;
  font-size: 0.875rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.reset-btn {
  border-color: #e0e3e9;
  color: #64748b;
}

/* 流水明细列表样式 */
.card {
  background-color: white;
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  border: 1px solid #eaedf2;
}

.card-header {
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #eaedf2;
  background-color: #f9fafb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  font-size: 1rem;
  font-weight: 600;
  color: #333;
}

.legend {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.legend-dot {
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 50%;
}

.income-dot {
  background-color: #10b981;
}

.expense-dot {
  background-color: #ef4444;
}

.legend-text {
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 500;
}

/* 日期分组样式 */
.date-divider {
  background: #f9fafb;
  border-left: 4px solid #10b981;
  padding: 0.75rem 1rem;
  font-weight: 500;
  color: #4b5563;
}

/* 记录项样式 */
.record-item {
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #f0f2f5;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.record-item:hover {
  background-color: #f9fafb;
  transform: translateX(4px);
}

/* 收入支出图标样式 */
.record-icon {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
}

.income-icon {
  background-color: rgba(16, 185, 129, 0.1);
  position: relative;
}

.income-icon:before {
  content: "";
  position: absolute;
  width: 1rem;
  height: 1rem;
  background-color: #10b981;
  border-radius: 50%;
}

.expense-icon {
  background-color: rgba(239, 68, 68, 0.1);
  position: relative;
}

.expense-icon:before {
  content: "";
  position: absolute;
  width: 1rem;
  height: 1rem;
  background-color: #ef4444;
  border-radius: 50%;
}

.record-title {
  font-weight: 500;
  color: #333;
  margin-bottom: 0.25rem;
}

.record-meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.record-tag {
  font-size: 0.75rem;
  padding: 0.125rem 0.5rem;
  border-radius: 1rem;
}

.income-tag {
  background-color: #d1fae5;
  color: #059669;
}

.expense-tag {
  background-color: #fee2e2;
  color: #dc2626;
}

.record-quantity {
  font-size: 0.75rem;
  color: #64748b;
}

.record-amount {
  font-weight: 700;
  font-size: 1.125rem;
  margin-bottom: 0.25rem;
}

.income-amount {
  color: #059669;
}

.expense-amount {
  color: #dc2626;
}

.record-time {
  font-size: 0.75rem;
  color: #94a3b8;
  text-align: right;
}

/* 空记录样式 */
.empty-records {
  padding: 4rem 1rem;
  text-align: center;
}

.empty-content {
  background-color: #f8fafc;
  padding: 2rem;
  border-radius: 0.75rem;
  max-width: 24rem;
  margin: 0 auto;
}

.empty-title {
  font-size: 1.125rem;
  font-weight: 500;
  color: #4b5563;
  margin-bottom: 0.5rem;
}

.empty-subtitle {
  font-size: 0.875rem;
  color: #64748b;
  margin-bottom: 1.5rem;
}

.empty-btn {
  border-color: #e0e3e9;
  color: #64748b;
}

/* 分页样式 */
.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem;
  border-top: 1px solid #eaedf2;
  background-color: #f9fafb;
}

.pagination-info {
  font-size: 0.875rem;
  color: #64748b;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.pagination-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 0.375rem;
  border: 1px solid #e0e3e9;
  background-color: #fff;
  color: #64748b;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}

.pagination-btn:hover:not(:disabled):not(.active) {
  background-color: #f1f5f9;
  border-color: #cbd5e1;
}

.pagination-btn.active {
  background-color: #10b981;
  border-color: #10b981;
  color: #fff;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-ellipsis {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  color: #64748b;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .filter-grid {
    grid-template-columns: 1fr;
  }
  
  .filter-item {
    width: 100%;
    margin-bottom: 0.75rem;
  }
  
  .filter-actions {
    margin-top: 1rem;
    justify-content: flex-end;
  }
  
  .legend {
    gap: 1rem;
  }
  
  .pagination {
    flex-direction: column;
    gap: 1rem;
  }
  
  .pagination-controls {
    width: 100%;
    justify-content: center;
  }
}
</style>
