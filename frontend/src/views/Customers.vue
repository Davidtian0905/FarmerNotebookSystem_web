

<template>
  <Layout>
    <div class="customers-page">
      <div class="customers-content">
        <!-- 页面标题 -->
        <div class="flex items-center justify-between mb-6">
          <div>
            <h2 class="text-2xl font-semibold text-gray-900">客户管理</h2>
            <p class="text-gray-600 mt-1">管理您的客户信息和关系</p>
          </div>
          <div class="action-buttons">
            <van-button type="primary" size="small" icon="chart-trending-o" @click="goToAnalysis">
              客户分析
            </van-button>
            <van-button type="primary" size="small" icon="plus" @click="goToAddCustomer">
              添加客户
            </van-button>
          </div>
        </div>

        <!-- 客户列表 -->
        <div class="records-table">
          <div class="table-header">
            <h4 class="text-lg font-semibold text-gray-900">客户列表</h4>
            <div class="table-actions">
              <div class="search-box">
                <i class="icon-search"></i>
                <input 
                  type="text" 
                  placeholder="搜索客户名称或手机号"
                  v-model="searchText"
                  @input="handleSearch"
                />
              </div>
              <div class="status-filter">
                <label class="filter-label">状态</label>
                <select v-model="statusFilter" class="form-select" style="background-color: white; color: #374151;" @change="handleStatusChange">
                  <option v-for="option in statusOptions" :key="option.value" :value="option.value">{{ option.text }}</option>
                </select>
              </div>
            </div>
          </div>
          
          <van-loading v-if="loading" />
          <van-empty v-else-if="!hasCustomers" description="暂无客户数据" />
          <div class="table-container">
            <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
              <table class="data-table">
                <thead>
                  <tr class="table-header-row">
                    <th class="th-cell">客户信息</th>
                    <th class="th-cell">联系方式</th>
                    <th class="th-cell">交易次数</th>
                    <th class="th-cell">交易金额</th>
                    <th class="th-cell">最后交易</th>
                    <th class="th-cell">状态</th>
                    <th class="th-cell">操作</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="customer in customerList" :key="customer.customerId" class="table-row">
                    <td class="customer-info">
                      <div class="customer-name">{{ customer.customername }}</div>
                      <div class="customer-category">类型: {{ customer.customcategory || '未设置' }}</div>
                      <div class="customer-grade">等级: {{ customer.customergrade || '未设置' }}</div>
                    </td>
                    <td class="customer-contact">
                      <div>{{ customer.customerphone }}</div>
                      <div class="customer-address">{{ customer.customeraddress }}</div>
                    </td>
                    <td class="transaction-count">
                      {{ customer.transactionCount || 0 }}
                    </td>
                    <td class="transaction-amount">
                      ¥{{ formatPrice(customer.transactionAmount) }}
                    </td>
                    <td class="last-transaction">
                      {{ formatDate(customer.lastTransactionTime) }}
                    </td>
                    <td class="customer-status">
                      <van-tag :type="customerStatusTagType[customer.customerStatus]">{{ customerStatusText[customer.customerStatus] }}</van-tag>
                    </td>
                    <td class="customer-actions">
                      <div class="action-buttons">
                        <van-button type="primary" size="small" icon="edit" @click="editCustomer(customer.customerId)">编辑</van-button>
                        <van-button type="info" size="small" icon="description" @click="copyAddress(customer)">复制地址</van-button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div class="pagination-container" v-if="customerList.length > 0">
                <van-list
                  v-model:loading="loadingMore"
                  :finished="finished"
                  finished-text="没有更多了"
                  @load="onLoad"
                >
                </van-list>
              </div>
            </van-pull-refresh>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import Layout from '@/components/layout/Layout.vue'
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { mockCustomersApi } from '@/mock/api/customersApi'
import {  
  calculateCustomerStatus, 
  customerStatusText, 
  customerStatusTagType 
} from '@/stores/Customer_Calculations.js'


const router = useRouter()
const searchText = ref('')
const statusFilter = ref('all')
const loading = ref(false)
const refreshing = ref(false)
const loadingMore = ref(false)
const finished = ref(false)
const page = ref(1)
const pageSize = ref(10)
const customerList = ref([])

// 客户状态选项
const statusOptions = [
  { text: '全部', value: 'all' },
  { text: '新增', value: 'new' },
  { text: '活跃', value: 'active' },
  { text: '一般', value: 'normal' },
  { text: '待激活', value: 'inactive' },
  { text: '已禁用', value: 'disabled' }
]

// 计算属性：是否有客户数据
const hasCustomers = computed(() => customerList.value.length > 0)

// 页面加载时获取数据
onMounted(() => {
  fetchCustomerData()
})

// 获取客户数据
const fetchCustomerData = async () => {
  loading.value = true
  try {
    // 构建查询参数
    const params = {
      page: page.value,
      pageSize: pageSize.value,
      keyword: searchText.value,
      status: statusFilter.value
    }
    
    // 调用客户API获取数据
    const response = await mockCustomersApi.getList(params)
    
    if (response.error === 0) {
      // 更新客户列表
      customerList.value = response.body.list
      
      // 判断是否加载完成
      finished.value = response.body.list.length < pageSize.value
    } else {
      console.error('获取客户数据失败:', response.message)
      showToast('获取客户数据失败')
    }
  } catch (error) {
    console.error('获取客户数据失败:', error)
    showToast('获取客户数据失败')
  } finally {
    loading.value = false
    refreshing.value = false
    loadingMore.value = false
  }
}

// 应用搜索和状态筛选
const applyFilters = () => {
  // 重置分页
  page.value = 1
  fetchCustomerData()
}

// 搜索处理
const handleSearch = () => {
  applyFilters()
}

// 状态筛选变化
const handleStatusChange = () => {
  applyFilters()
}

// 下拉刷新
const onRefresh = () => {
  refreshing.value = true
  page.value = 1
  fetchCustomerData()
}

// 加载更多
const onLoad = () => {
  if (!finished.value) {
    loadingMore.value = true
    page.value += 1
    fetchCustomerData()
  }
}

// 格式化价格
const formatPrice = (price) => {
  return (price || 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

// 格式化日期
const formatDate = (dateStr) => {
  if (!dateStr) return '无记录'
  const date = new Date(dateStr)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

// 编辑客户
const editCustomer = (id) => {
  router.push(`/customer/edit/${id}`)
}

// 复制地址到剪贴板
const copyAddress = (customer) => {
  const text = `${customer.customername}, ${customer.customerphone}, ${customer.customeraddress}`
  navigator.clipboard.writeText(text).then(() => {
    showToast('地址已复制到剪贴板')
  }).catch(err => {
    console.error('复制失败:', err)
    showToast('复制失败，请手动复制')
  })
}

// 导航函数
const goBack = () => {
  router.back()
}

const goToAddCustomer = () => {
  router.push('/customers/add')
}

const goToAnalysis = () => {
  router.push('/customer/analysis')
}
</script>

<style scoped lang="scss">
.customers-page {
  min-height: 100vh;
  background: #f7f8fa;
}

.customers-content {
  padding: 16px;
}

.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  
  .page-title {
    font-size: 20px;
    font-weight: 600;
    color: #323233;
    margin: 0;
  }
  
  .action-buttons {
    display: flex;
    gap: 8px;
  }
}

.search-filter {
  display: flex;
  margin-bottom: 16px;
  
  .van-search {
    flex: 1;
  }
  
  .status-filter {
    display: flex;
    align-items: center;
    margin-left: 16px;
    
    .filter-label {
      font-size: 14px;
      margin-right: 8px;
      color: #323233;
    }
    
    .form-select {
      height: 34px;
      padding: 0 8px;
      border: 1px solid #dcdee0;
      border-radius: 4px;
      font-size: 14px;
      width: 120px;
      background-color: white;
    }
  }
}

.records-table {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  overflow: hidden;
}

.table-header {
  padding: 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.table-actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.search-box {
  position: relative;
  width: 300px;
}

.search-box i {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
}

.search-box input {
  width: 100%;
  padding: 10px 12px 10px 36px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
}

.table-container {
  overflow-x: auto;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.table-header-row {
  background: #f8f9fa;
}

.th-cell {
  background: #f8f9fa;
  padding: 16px 12px;
  text-align: left;
  font-weight: 600;
  color: #333;
  border-bottom: 1px solid #eee;
  white-space: nowrap;
}

.data-table {
  width: 100%;
  min-width: 900px;
  border-collapse: collapse;
  table-layout: fixed;
}

.data-table td {
  padding: 16px 12px;
  border-bottom: 1px solid #f0f0f0;
  vertical-align: top;
}

.table-row:hover {
  background-color: #f8f9fa;
}

.customer-info {
  width: 200px;
  
  .customer-name {
    font-weight: 600;
    color: #1a1a1a;
    font-size: 16px;
    line-height: 1.2;
    margin-bottom: 4px;
  }
  
  .customer-category {
    background: #e3f2fd;
    color: #1976d2;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 12px;
    display: inline-block;
    margin-right: 4px;
  }
  
  .customer-grade {
    background: #f3e5f5;
    color: #7b1fa2;
    padding: 2px 6px;
    border-radius: 3px;
    font-size: 12px;
    display: inline-block;
  }
}

.customer-contact {
  width: 200px;
  font-size: 14px;
  color: #666;
  
  .customer-address {
    font-size: 12px;
    color: #666;
  }
}

.transaction-count,
.transaction-amount,
.last-transaction {
  width: 80px;
  text-align: center;
}

.customer-status {
  width: 80px;
  text-align: center;
}

.customer-actions {
  width: 200px;
}

.action-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  
  .van-button {
    min-width: 80px;
    margin-bottom: 4px;
  }
}

.pagination-container {
  padding: 16px;
  text-align: center;
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .data-table {
    min-width: 800px; /* 确保在小屏幕上可以横向滚动 */
  }
  
  .customer-info {
    width: 150px;
  }
  
  .customer-contact {
    width: 100px;
  }
}
</style>
