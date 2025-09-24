<template>
  <Layout>
    <div class="suppliers-page">
      <div class="suppliers-content">
        <!-- 页面标题 -->
        <div class="flex items-center justify-between mb-6">
          <div>
            <h2 class="text-2xl font-semibold text-gray-900">供应商管理</h2>
            <p class="text-gray-600 mt-1">管理您的供应商信息和关系</p>
          </div>
          <div class="action-buttons">
            <van-button type="primary" size="small" icon="chart-trending-o" @click="goToAnalysis">
              供应商分析
            </van-button>
            <van-button type="primary" size="small" icon="plus" @click="goToAddSupplier">
              添加供应商
            </van-button>
          </div>
        </div>

        <!-- 供应商列表 -->
        <div class="records-table">
          <div class="table-header">
            <h4 class="text-lg font-semibold text-gray-900">供应商列表</h4>
            <div class="table-actions">
              <div class="search-box">
                <i class="icon-search"></i>
                <input 
                  type="text" 
                  placeholder="搜索供应商名称或手机号"
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
          <van-empty v-else-if="!hasSuppliers" description="暂无供应商数据" />
          <div class="table-container">
            <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
              <table class="data-table">
                <thead>
                  <tr class="table-header-row">
                    <th class="th-cell">供应商信息</th>
                    <th class="th-cell">联系方式</th>
                    <th class="th-cell">主营产品</th>
                    <th class="th-cell">合作次数</th>
                    <th class="th-cell">采购金额</th>
                    <th class="th-cell">最后交易时间</th>
                    <th class="th-cell">评分</th>
                    <th class="th-cell">状态</th>
                    <th class="th-cell">操作</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="supplier in supplierList" :key="supplier.id" class="table-row">
                    <td class="supplier-info">
                      <div class="supplier-name">{{ supplier.name }}</div>
                      <div class="supplier-category">类型: {{ supplier.category || '未设置' }}</div>
                      <div class="supplier-grade">等级: {{ supplier.grade || '未设置' }}</div>
                    </td>
                    <td class="supplier-contact">
                      <div>{{ supplier.phone }}</div>
                      <div class="supplier-address">{{ supplier.address }}</div>
                    </td>
                    <td class="main-products">
                      {{ supplier.mainProducts || '未设置' }}
                    </td>
                    <td class="transaction-count">
                      {{ supplier.transactionCount || 0 }}次
                    </td>
                    <td class="transaction-amount">
                      ¥{{ formatPrice(supplier.transactionAmount) }}
                    </td>
                    <td class="last-transaction-time">
                      {{ supplier.lastTransactionTime ? formatDate(supplier.lastTransactionTime) : '无记录' }}
                    </td>
                    <td class="supplier-rating">
                      {{ supplier.rating || 0 }}
                    </td>
                    <td class="supplier-status">
                      <van-tag :type="getStatusTagType(supplier.status)">{{ getStatusText(supplier.status) }}</van-tag>
                    </td>
                    <td class="supplier-actions">
                      <div class="action-buttons">
                        <van-button type="primary" size="small" icon="edit" @click="editSupplier(supplier.id)">编辑</van-button>
                        <van-button type="info" size="small" icon="cart-o" @click="purchaseFromSupplier(supplier.id)">采购</van-button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div class="pagination-container" v-if="supplierList.length > 0">
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
import { mockSuppliersApi } from '@/mock/api/suppliersApi.js'
import { getAllTransactions } from '@/mock/database_flow.js'

const router = useRouter()
const searchText = ref('')
const statusFilter = ref('all')
const loading = ref(false)
const refreshing = ref(false)
const loadingMore = ref(false)
const finished = ref(false)
const page = ref(1)
const pageSize = ref(10)
const supplierList = ref([])
const searchQuery = ref('')

// 供应商状态选项
const statusOptions = [
  { text: '全部', value: 'all' },
  { text: '新增', value: 'new' },
  { text: '活跃', value: 'active' },
  { text: '一般', value: 'normal' },
  { text: '待审核', value: 'pending' },
  { text: '已停用', value: 'disabled' }
]

// 计算属性：是否有供应商数据
const hasSuppliers = computed(() => supplierList.value.length > 0)

// 页面加载时获取数据
onMounted(() => {
  fetchSupplierData()
})

// 获取供应商数据
const fetchSupplierData = async () => {
  loading.value = true
  try {
    // 构建API请求参数
    const params = {
      page: page.value,
      pageSize: pageSize.value,
      keyword: searchText.value,
      status: statusFilter.value,
      sortField: 'createTime',
      sortOrder: 'desc'
    }
    
    // 调用API获取供应商列表
    const response = await mockSuppliersApi.getList(params)
    
    // API返回的是标准格式，需要检查error字段而不是code字段
    if (response.error === 0) {
      // 获取所有交易记录
      const allTransactions = getAllTransactions()
      
      // 更新供应商列表
      supplierList.value = response.body.list.map(supplier => {
        // 获取该供应商的所有交易记录
        const supplierTransactions = allTransactions.filter(t => t.supplierId === supplier.id)
        
        // 筛选出有评分的交易记录
        const ratedTransactions = supplierTransactions.filter(t => 
          t.quality !== undefined && t.delivery !== undefined && 
          t.price !== undefined && t.service !== undefined
        )
        
        // 计算评分
        let rating = 0
        if (ratedTransactions.length > 0) {
          const totalQuality = ratedTransactions.reduce((sum, t) => sum + t.quality, 0)
          const totalDelivery = ratedTransactions.reduce((sum, t) => sum + t.delivery, 0)
          const totalPrice = ratedTransactions.reduce((sum, t) => sum + t.price, 0)
          const totalService = ratedTransactions.reduce((sum, t) => sum + t.service, 0)
          
          const avgQuality = totalQuality / ratedTransactions.length
          const avgDelivery = totalDelivery / ratedTransactions.length
          const avgPrice = totalPrice / ratedTransactions.length
          const avgService = totalService / ratedTransactions.length
          
          // 四个维度的平均值作为最终评分
          rating = Number(((avgQuality + avgDelivery + avgPrice + avgService) / 4).toFixed(1))
        }
        
        // 更新供应商评分
        return {
          ...supplier,
          rating
        }
      })
      
      // 更新分页信息
      const total = response.body.total
      finished.value = page.value * pageSize.value >= total
    } else {
      console.error('获取供应商列表失败:', response.message)
      showToast(response.message || '获取供应商列表失败')
    }
  } catch (error) {
    console.error('获取供应商数据失败:', error)
    showToast('获取供应商数据失败')
  } finally {
    loading.value = false
    refreshing.value = false
    loadingMore.value = false
  }
}

// 供应商状态由API计算，不再需要前端计算

// 应用搜索和状态筛选
const applyFilters = () => {
  // 重置分页
  page.value = 1
  fetchSupplierData()
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
  fetchSupplierData()
}

// 加载更多
const onLoad = () => {
  if (!finished.value) {
    loadingMore.value = true
    page.value += 1
    fetchSupplierData()
  }
}

// 获取状态标签类型
const getStatusTagType = (status) => {
  const types = {
    new: 'primary',
    active: 'success',
    normal: 'warning',
    pending: 'danger',
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
    pending: '待审核',
    disabled: '已停用'
  }
  return texts[status] || '未知'
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

// 编辑供应商
const editSupplier = (id) => {
  router.push(`/suppliers/edit/${id}`)
}

// 从供应商采购
const purchaseFromSupplier = (id) => {
  // 获取供应商详情
  const supplier = supplierList.value.find(s => s.id === id)
  
  // 跳转到入库表单页面，并传递供应商信息
  router.push({
    path: '/inbound-form',
    query: { 
      supplierId: id,
      supplierName: supplier?.name || ''
    }
  })
}

// 导航函数
const goToAddSupplier = () => {
  router.push('/suppliers/add')
}

const goToAnalysis = () => {
  router.push('/suppliers/analysis')
}
</script>

<style scoped lang="scss">
.suppliers-page {
  min-height: 100vh;
  background: #f7f8fa;
}

.suppliers-content {
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

.supplier-info {
  width: 200px;
  
  .supplier-name {
    font-weight: 600;
    color: #1a1a1a;
    font-size: 16px;
    line-height: 1.2;
    margin-bottom: 4px;
  }
  
  .supplier-category {
    background: #e3f2fd;
    color: #1976d2;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 12px;
    display: inline-block;
    margin-right: 4px;
  }
  
  .supplier-grade {
    background: #f3e5f5;
    color: #7b1fa2;
    padding: 2px 6px;
    border-radius: 3px;
    font-size: 12px;
    display: inline-block;
  }
}

.supplier-contact {
  width: 200px;
  font-size: 14px;
  color: #666;
  
  .supplier-address {
    font-size: 12px;
    color: #666;
  }
}

.main-products {
  width: 120px;
  font-size: 14px;
  color: #666;
}

.transaction-count,
.transaction-amount {
  width: 80px;
  text-align: center;
}

.supplier-rating {
  width: 120px;
  text-align: center;
  
  .rating-details {
    margin-top: 5px;
  }
}

.supplier-status {
  width: 80px;
  text-align: center;
}

.supplier-actions {
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
  
  .supplier-info {
    width: 150px;
  }
  
  .supplier-contact {
    width: 100px;
  }
}
</style>
