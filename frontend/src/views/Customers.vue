<template>
  <Layout>
    <div class="customers-page">
      <div class="customers-content">
        <!-- 页面标题和操作 -->
        <div class="header-actions">
          <h2 class="page-title">客户管理</h2>
          <div class="action-buttons">
            <van-button type="primary" size="small" icon="chart-trending-o" @click="goToAnalysis">
              客户分析
            </van-button>
            <van-button type="primary" size="small" icon="plus" @click="goToAddCustomer">
              添加客户
            </van-button>
          </div>
        </div>

        <!-- 搜索和筛选 -->
        <div class="search-filter">
          <van-search
            v-model="searchText"
            placeholder="搜索客户名称或手机号"
            @search="handleSearch"
          />
          <div class="status-filter">
            <label class="filter-label">状态</label>
            <select v-model="statusFilter" class="form-select" style="background-color: white; color: #374151;">
              <option v-for="option in statusOptions" :key="option.value" :value="option.value">{{ option.text }}</option>
            </select>
          </div>
        </div>

        <!-- 客户列表 -->
        <div class="customer-list-container">
          <van-loading v-if="loading" />
          <van-empty v-else-if="!hasCustomers" description="暂无客户数据" />
          <div v-else class="table-container">
            <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>客户信息</th>
                    <th>联系方式</th>
                    <th>交易次数</th>
                    <th>交易金额</th>
                    <th>最后交易</th>
                    <th>状态</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="customer in customerList" :key="customer.id" class="table-row">
                    <td class="customer-info">
                      <div class="customer-name">{{ customer.name }}</div>
                    </td>
                    <td class="customer-contact">
                      <div>{{ customer.phone }}</div>
                      <div class="customer-address">{{ customer.address }}</div>
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
                      <van-tag :type="getStatusTagType(customer.status)">{{ getStatusText(customer.status) }}</van-tag>
                    </td>
                    <td class="customer-actions">
                      <div class="action-buttons">
                        <van-button type="primary" size="small" icon="edit" @click="editCustomer(customer.id)">编辑</van-button>
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
import { getAllTransactions } from '@/mock/database_flow'
import { CUSTOMERS } from '@/mock/outbound_data'

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
const allTransactions = ref([])

// 状态选项
const statusOptions = [
  { text: '全部状态', value: 'all' },
  { text: '活跃', value: 'active' },
  { text: '一般', value: 'normal' },
  { text: '待激活', value: 'inactive' },
  { text: '已停用', value: 'disabled' },
  { text: '新增', value: 'new' }
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
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 获取所有交易记录
    allTransactions.value = getAllTransactions()
    
    // 从CUSTOMERS对象中获取客户信息
    const customersMap = {}
    
    // 先初始化客户基本信息
    Object.values(CUSTOMERS).forEach(customer => {
      customersMap[customer.id] = {
        id: customer.id,
        name: customer.name,
        phone: customer.phone,
        address: customer.address,
        contactPerson: customer.contactPerson,
        email: customer.email,
        discountRate: customer.discountRate,
        status: customer.status || 'normal',
        transactionCount: customer.transactionCount || 0,
        transactionAmount: customer.transactionAmount || 0,
        lastTransactionTime: customer.lastTransactionTime || null,
        remark: customer.remark
      }
    })
    
    // 匹配交易数据
    allTransactions.value.forEach(transaction => {
      if (transaction.customerId && transaction.type === 'OUTBOUND') {
        // 确保客户ID存在于客户列表中
        if (customersMap[transaction.customerId]) {
          // 添加交易记录
          customersMap[transaction.customerId].transactions.push({
            date: transaction.date,
            amount: transaction.totalPrice
          })
        }
      }
    })
    
    // 计算客户统计数据
    const now = new Date()
    const threeMonthsAgo = new Date(now)
    threeMonthsAgo.setMonth(now.getMonth() - 3)
    
    const oneMonthAgo = new Date(now)
    oneMonthAgo.setMonth(now.getMonth() - 1)
    
    Object.values(customersMap).forEach(customer => {
      // 如果已有交易数据，则不需要重新计算
      if (!customer.transactionCount || !customer.transactionAmount || !customer.lastTransactionTime) {
        // 匹配交易数据
        const customerTransactions = allTransactions.value.filter(t => 
          t.customerId === customer.id && t.type === 'OUTBOUND'
        );
        
        if (customerTransactions.length > 0) {
          // 排序交易记录（按日期降序）
          customerTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));
          
          // 更新交易次数（如果没有预设值）
          if (!customer.transactionCount) {
            customer.transactionCount = customerTransactions.length;
          }
          
          // 更新交易总金额（如果没有预设值）
          if (!customer.transactionAmount) {
            customer.transactionAmount = customerTransactions.reduce((sum, t) => sum + t.totalPrice, 0);
          }
          
          // 更新最后交易日期（如果没有预设值）
          if (!customer.lastTransactionTime) {
            customer.lastTransactionTime = customerTransactions[0]?.date || null;
          }
        }
      }
      
      // 计算最近三个月的交易次数
      const recentTransactions = allTransactions.value.filter(t => 
        t.customerId === customer.id && 
        t.type === 'OUTBOUND' && 
        new Date(t.date) >= threeMonthsAgo
      )
      
      // 如果没有预设状态，则计算客户状态
      if (!customer.status) {
        const hasRecentTransaction = allTransactions.value.some(t => 
          t.customerId === customer.id && 
          t.type === 'OUTBOUND' && 
          new Date(t.date) >= oneMonthAgo
        )
        
        if (hasRecentTransaction) {
          customer.status = 'new' // 最近一个月新增
        } else if (recentTransactions.length >= 10) {
          customer.status = 'active' // 活跃：最近三个月交易次数超过10次
        } else if (recentTransactions.length > 0) {
          customer.status = 'normal' // 一般：最近三个月交易次数不足10次
        } else {
          customer.status = 'inactive' // 待激活：最近三个月没有交易
        }
      }
    })
    
    // 转换为数组并应用筛选
    customerList.value = Object.values(customersMap)
    applyFilters()
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
  let filteredList = Object.values(customerList.value)
  
  // 应用搜索过滤
  if (searchText.value) {
    const searchLower = searchText.value.toLowerCase()
    filteredList = filteredList.filter(customer => 
      customer.name.toLowerCase().includes(searchLower) || 
      customer.phone.includes(searchText.value)
    )
  }
  
  // 应用状态过滤
  if (statusFilter.value !== 'all') {
    filteredList = filteredList.filter(customer => customer.status === statusFilter.value)
  }
  
  // 更新列表
  customerList.value = filteredList
  
  // 重置分页
  page.value = 1
  finished.value = filteredList.length <= pageSize.value
}

// 搜索处理
const handleSearch = () => {
  applyFilters()
}

// 下拉刷新
const onRefresh = () => {
  page.value = 1
  fetchCustomerData()
}

// 加载更多
const onLoad = () => {
  const start = page.value * pageSize.value
  if (start >= customerList.value.length) {
    finished.value = true
  } else {
    page.value++
    loadingMore.value = false
  }
}

// 获取状态标签类型
const getStatusTagType = (status) => {
  const types = {
    new: 'primary',
    active: 'success',
    normal: 'warning',
    inactive: 'danger',
    disabled: 'default'
  }
  return types[status] || 'default'
}

// 获取状态文本
const getStatusText = (status) => {
  const texts = {
    new: '新增',
    active: '活跃',
    normal: '一般',
    inactive: '待激活',
    disabled: '已停用'
  }
  return texts[status] || '未知'
}

// 计算客户状态
const calculateCustomerStatus = (customer) => {
  const now = new Date()
  const threeMonthsAgo = new Date(now)
  threeMonthsAgo.setMonth(now.getMonth() - 3)
  
  const oneMonthAgo = new Date(now)
  oneMonthAgo.setMonth(now.getMonth() - 1)
  
  // 检查是否为新增客户（一个月内有交易）
  if (customer.lastTransaction && new Date(customer.lastTransaction) >= oneMonthAgo) {
    return 'new'
  }
  
  // 检查是否已停用
  if (customer.disabled) {
    return 'disabled'
  }
  
  // 如果没有交易记录或最后交易时间在三个月前
  if (!customer.lastTransaction || new Date(customer.lastTransaction) < threeMonthsAgo) {
    return 'inactive'
  }
  
  // 检查三个月内交易次数
  const recentTransactions = customer.transactions?.filter(t => 
    new Date(t.date) >= threeMonthsAgo
  ) || []
  
  if (recentTransactions.length >= 10) {
    return 'active'
  } else {
    return 'normal'
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
  const text = `${customer.name}, ${customer.phone}, ${customer.address}`
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

.customer-list-container {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(100, 101, 102, 0.08);
  overflow: hidden;
}

.table-container {
  overflow-x: auto;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.data-table {
  width: 100%;
  min-width: 900px;
  border-collapse: collapse;
  table-layout: fixed;
}

.data-table th,
.data-table td {
  padding: 12px 4px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.data-table th {
  background-color: #f7f8fa;
  font-weight: bold;
  color: #323233;
  font-size: 14px;
}

.data-table tbody tr:hover {
  background-color: #f7f8fa;
}

.customer-info {
  width: 200px;
  
  .customer-name {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 4px;
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
