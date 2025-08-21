<template>
  <Layout>
    <div class="outbound-records">
      <!-- 页面头部 -->
      <div class="page-header">
        <div class="header-left">
          <h1 class="page-title">出库记录</h1>
          <p class="page-subtitle">管理和查看所有出库记录</p>
        </div>
        <div class="header-right">
           <button class="btn btn-primary" @click="showAddOutboundModal = true">
             <i class="icon-plus"></i>
             新增出库
           </button>
         </div>
       </div>
    </div>

    <!-- 快捷操作区 -->
    <div class="quick-actions">
      <div class="action-cards">
        <div class="action-card" @click="handleVoiceRecord">
          <div class="card-icon voice">
            <i class="icon-mic"></i>
          </div>
          <div class="card-content">
            <h3>AI语音记账</h3>
            <p>语音快速录入出库信息</p>
          </div>
        </div>
        
        <div class="action-card" @click="handleCustomCombo">
          <div class="card-icon combo">
            <i class="icon-package"></i>
          </div>
          <div class="card-content">
            <h3>自定义商品组合</h3>
            <p>创建商品组合套餐</p>
          </div>
        </div>
        
        <div class="action-card" @click="handleComboTemplate">
          <div class="card-icon template">
            <i class="icon-template"></i>
          </div>
          <div class="card-content">
            <h3>商品组合模板</h3>
            <p>使用预设组合模板</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 商品组合列表 -->
    <div class="combo-section" v-if="showComboList">
      <div class="section-header">
        <h2>商品组合列表</h2>
        <button class="btn btn-outline" @click="toggleComboList">
          <i class="icon-eye-off"></i>
          隐藏组合
        </button>
      </div>
      
      <div class="combo-grid">
        <div 
          v-for="combo in productCombos" 
          :key="combo.id" 
          class="combo-card"
          @click="selectCombo(combo)"
        >
          <div class="combo-header">
            <h3>{{ combo.name }}</h3>
            <span class="combo-code">{{ combo.code }}</span>
          </div>
          <div class="combo-materials">
            <div v-for="material in combo.materials" :key="material.id" class="material-item">
              <span class="material-name">{{ material.name }}</span>
              <span class="material-quantity">{{ material.quantity }}{{ material.unit }}</span>
            </div>
          </div>
          <div class="combo-pricing">
            <div class="pricing-row">
              <span class="label">总成本:</span>
              <span class="cost">¥{{ combo.totalCost.toFixed(2) }}</span>
            </div>
            <div class="pricing-row">
              <span class="label">利润率:</span>
              <span class="profit-rate">{{ combo.profitRate }}%</span>
            </div>
            <div class="pricing-row">
              <span class="label">定价:</span>
              <span class="price">¥{{ combo.price.toFixed(2) }}</span>
            </div>
          </div>
          <div class="combo-footer">
            <span class="product-count">{{ combo.productCount }}个产品</span>
            <div class="combo-actions">
              <button class="btn-icon" @click.stop="editCombo(combo)">
                <i class="icon-edit"></i>
              </button>
              <button class="btn-icon" @click.stop="deleteCombo(combo)">
                <i class="icon-trash"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 筛选和设置区 -->
    <div class="filter-section">
      <div class="filter-row">
        <div class="filter-group">
          <label>物料类型:</label>
          <select v-model="filters.materialType" @change="applyFilters">
            <option value="">全部类型</option>
            <option v-for="type in materialTypes" :key="type.value || type" :value="type.value || type">
              {{ type.label || type }}
            </option>
          </select>
        </div>
        
        <div class="filter-group">
          <label>客户:</label>
          <select v-model="filters.customerId" @change="applyFilters">
            <option value="">全部客户</option>
            <option v-for="customer in customers" :key="customer.id" :value="customer.id">
              {{ customer.name }}
            </option>
          </select>
        </div>
        
        <div class="filter-group">
          <label>仓库位置:</label>
          <select v-model="filters.warehouseLocation" @change="applyFilters">
            <option value="">全部位置</option>
            <option v-for="location in warehouseLocations" :key="location" :value="location">
              {{ location }}
            </option>
          </select>
        </div>
        
        <div class="filter-group">
          <label>时间范围:</label>
          <input type="date" v-model="filters.startDate" @change="applyFilters">
          <span>至</span>
          <input type="date" v-model="filters.endDate" @change="applyFilters">
        </div>
        
        <div class="filter-group">
          <button class="btn btn-outline" @click="toggleComboList">
            <i :class="showComboList ? 'icon-eye-off' : 'icon-eye'"></i>
            {{ showComboList ? '隐藏' : '显示' }}组合
          </button>
        </div>
      </div>
    </div>

    <!-- 出库记录表格 -->
    <div class="records-table">
      <div class="table-header">
        <div class="table-actions">
          <div class="search-box">
            <i class="icon-search"></i>
            <input 
              type="text" 
              placeholder="搜索物料名称、编码、客户..."
              v-model="searchQuery"
              @input="handleSearch"
            >
          </div>
          <div class="table-controls">
            <button class="btn btn-outline" @click="exportRecords">
              <i class="icon-download"></i>
              导出
            </button>
            <button class="btn btn-outline" @click="refreshRecords">
              <i class="icon-refresh"></i>
              刷新
            </button>
          </div>
        </div>
      </div>

      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>物料信息</th>
              <th>物料编码</th>
              <th>批次号</th>
              <th>出库时间</th>
              <th>数量</th>
              <th>单价</th>
              <th>总价</th>
              <th>客户</th>
              <th>仓库位置</th>
              <th>出库类型</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="record in filteredRecords" :key="record.id" class="table-row">
              <td class="material-info">
                <div class="material-main">
                  <span class="material-name">{{ record.materialName }}</span>
                  <span class="material-type">{{ getMaterialTypeName(record.materialType) }}</span>
                </div>
                <div class="material-meta">
                  <span class="material-grade">{{ getMaterialGradeName(record.materialGrade) }}</span>
                  <span class="material-unit">{{ record.unit }}</span>
                </div>
              </td>
              <td class="material-code">{{ record.materialCode }}</td>
              <td class="batch-number">{{ record.batchNumber }}</td>
              <td class="outbound-time">{{ formatDateTime(record.outboundTime) }}</td>
              <td class="quantity">{{ record.quantity }}</td>
              <td class="unit-price">¥{{ record.unitPrice.toFixed(2) }}</td>
              <td class="total-price">¥{{ record.totalPrice.toFixed(2) }}</td>
              <td class="customer">{{ getCustomerName(record.customerId) }}</td>
              <td class="warehouse-location">{{ getWarehouseLocationName(record.warehouseLocation) }}</td>
              <td class="outbound-type">
                <span :class="['type-badge', getOutboundTypeClass(record.outboundType)]">
                  {{ getOutboundTypeName(record.outboundType) }}
                </span>
              </td>
              <td class="status">
                <span :class="['status-badge', getStatusClass(record.status)]">
                  {{ getStatusName(record.status) }}
                </span>
              </td>
              <td class="actions">
                <button class="btn-icon" @click="viewRecord(record)" title="查看详情">
                  <i class="icon-eye"></i>
                </button>
                <button class="btn-icon" @click="editRecord(record)" title="编辑">
                  <i class="icon-edit"></i>
                </button>
                <button class="btn-icon danger" @click="deleteRecord(record)" title="删除">
                  <i class="icon-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 分页 -->
      <div class="pagination">
        <div class="pagination-info">
          共 {{ totalRecords }} 条记录，第 {{ currentPage }} / {{ totalPages }} 页
        </div>
        <div class="pagination-controls">
          <button 
            class="btn btn-outline" 
            @click="goToPage(currentPage - 1)"
            :disabled="currentPage <= 1"
          >
            上一页
          </button>
          <span class="page-numbers">
            <button 
              v-for="page in visiblePages" 
              :key="page"
              class="btn"
              :class="{ 'btn-primary': page === currentPage, 'btn-outline': page !== currentPage }"
              @click="goToPage(page)"
            >
              {{ page }}
            </button>
          </span>
          <button 
            class="btn btn-outline" 
            @click="goToPage(currentPage + 1)"
            :disabled="currentPage >= totalPages"
          >
            下一页
          </button>
        </div>
      </div>
    </div>

    <!-- 新增出库模态框 -->
    <div v-if="showAddOutboundModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>新增出库记录</h2>
          <button class="btn-close" @click="closeModal">
            <i class="icon-close"></i>
          </button>
        </div>
        <div class="modal-body">
          <OutboundForm @submit="handleAddOutbound" @cancel="closeModal" />
        </div>
      </div>
    </div>
  </Layout>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue'
import { getWarehouseData } from '@/mock/database_flow.js'
import { getMaterialTypeOptions, getMaterialGradeOptions, getWarehouseLocationOptions, getCustomerOptions, getProductCombos } from '@/mock/warehouse_data.js'
import OutboundForm from '@/components/OutboundForm.vue'
import Layout from '@/components/layout/Layout.vue'

export default {
  name: 'OutboundRecords',
  components: {
    OutboundForm,
    Layout
  },
  setup() {
    // 响应式数据
    const records = ref([])
    const materialTypes = ref([])
    const materialGrades = ref([])
    const warehouseLocations = ref([])
    const customers = ref([])
    const productCombos = ref([])
    const showAddOutboundModal = ref(false)
    const showComboList = ref(true)
    const searchQuery = ref('')
    const currentPage = ref(1)
    const pageSize = ref(20)
    
    // 筛选条件
    const filters = reactive({
      materialType: '',
      customerId: '',
      warehouseLocation: '',
      startDate: '',
      endDate: ''
    })

    // 计算属性
    const filteredRecords = computed(() => {
      let result = records.value.filter(record => record.type === 'outbound')
      
      // 搜索过滤
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        result = result.filter(record => 
          record.materialName.toLowerCase().includes(query) ||
          record.materialCode.toLowerCase().includes(query) ||
          getCustomerName(record.customerId).toLowerCase().includes(query)
        )
      }
      
      // 类型过滤
      if (filters.materialType) {
        result = result.filter(record => record.materialType === filters.materialType)
      }
      
      // 客户过滤
      if (filters.customerId) {
        result = result.filter(record => record.customerId === filters.customerId)
      }
      
      // 仓库位置过滤
      if (filters.warehouseLocation) {
        result = result.filter(record => record.warehouseLocation === filters.warehouseLocation)
      }
      
      // 时间范围过滤
      if (filters.startDate) {
        result = result.filter(record => new Date(record.outboundTime) >= new Date(filters.startDate))
      }
      if (filters.endDate) {
        result = result.filter(record => new Date(record.outboundTime) <= new Date(filters.endDate))
      }
      
      return result
    })
    
    const totalRecords = computed(() => filteredRecords.value.length)
    const totalPages = computed(() => Math.ceil(totalRecords.value / pageSize.value))
    const visiblePages = computed(() => {
      const pages = []
      const start = Math.max(1, currentPage.value - 2)
      const end = Math.min(totalPages.value, currentPage.value + 2)
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      return pages
    })

    // 方法
    const loadData = async () => {
      try {
        const warehouseData = await getWarehouseData()
        records.value = warehouseData.records
        materialTypes.value = await getMaterialTypeOptions()
        materialGrades.value = await getMaterialGradeOptions()
        warehouseLocations.value = await getWarehouseLocationOptions()
        customers.value = await getCustomerOptions()
        productCombos.value = await getProductCombos()
      } catch (error) {
        console.error('加载数据失败:', error)
      }
    }

    const getMaterialTypeName = (typeName) => {
      // 现在直接返回中文名称，因为数据已经是中文
      return typeName || '未知类型'
    }

    const getMaterialGradeName = (gradeName) => {
      // 现在直接返回中文名称，因为数据已经是中文
      return gradeName || '未知等级'
    }

    const getCustomerName = (customerId) => {
      const customer = customers.value.find(c => c.id === customerId)
      return customer ? customer.name : '未知客户'
    }

    const getWarehouseLocationName = (locationId) => {
      // 直接返回位置名称，因为现在使用简化的字符串数组
      return locationId || '未知位置'
    }

    const getOutboundTypeName = (type) => {
      const typeMap = {
        'sale': '销售出库',
        'transfer': '调拨出库',
        'return': '退货出库',
        'loss': '损耗出库',
        'sample': '样品出库'
      }
      return typeMap[type] || '未知类型'
    }

    const getOutboundTypeClass = (type) => {
      const classMap = {
        'sale': 'success',
        'transfer': 'info',
        'return': 'warning',
        'loss': 'danger',
        'sample': 'default'
      }
      return classMap[type] || 'default'
    }

    const getStatusName = (status) => {
      const statusMap = {
        'pending': '待出库',
        'processing': '处理中',
        'completed': '已完成',
        'cancelled': '已取消'
      }
      return statusMap[status] || '未知状态'
    }

    const getStatusClass = (status) => {
      const classMap = {
        'pending': 'warning',
        'processing': 'info',
        'completed': 'success',
        'cancelled': 'danger'
      }
      return classMap[status] || 'default'
    }

    const formatDate = (dateString) => {
      if (!dateString) return '-'
      return new Date(dateString).toLocaleDateString('zh-CN')
    }

    const formatDateTime = (dateString) => {
      if (!dateString) return '-'
      return new Date(dateString).toLocaleString('zh-CN')
    }

    const applyFilters = () => {
      currentPage.value = 1
    }

    const handleSearch = () => {
      currentPage.value = 1
    }

    const goToPage = (page) => {
      if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page
      }
    }

    const toggleComboList = () => {
      showComboList.value = !showComboList.value
    }

    const selectCombo = (combo) => {
      // TODO: 实现选择商品组合功能
      console.log('选择商品组合:', combo)
    }

    const editCombo = (combo) => {
      // TODO: 实现编辑商品组合功能
      console.log('编辑商品组合:', combo)
    }

    const deleteCombo = (combo) => {
      // TODO: 实现删除商品组合功能
      if (confirm('确定要删除这个商品组合吗？')) {
        console.log('删除商品组合:', combo)
      }
    }

    const refreshRecords = () => {
      loadData()
    }

    const exportRecords = () => {
      // TODO: 实现导出功能
      console.log('导出出库记录')
    }

    const handleVoiceRecord = () => {
      // TODO: 实现语音记账功能
      console.log('启动语音记账')
    }

    const handleCustomCombo = () => {
      // TODO: 实现自定义商品组合功能
      console.log('打开自定义商品组合')
    }

    const handleComboTemplate = () => {
      // TODO: 实现商品组合模板功能
      console.log('打开商品组合模板')
    }

    const viewRecord = (record) => {
      // TODO: 实现查看详情功能
      console.log('查看记录:', record)
    }

    const editRecord = (record) => {
      // TODO: 实现编辑功能
      console.log('编辑记录:', record)
    }

    const deleteRecord = (record) => {
      // TODO: 实现删除功能
      if (confirm('确定要删除这条出库记录吗？')) {
        console.log('删除记录:', record)
      }
    }

    const handleAddOutbound = (formData) => {
      // TODO: 实现新增出库功能
      console.log('新增出库:', formData)
      closeModal()
    }

    const closeModal = () => {
      showAddOutboundModal.value = false
    }

    // 生命周期
    onMounted(() => {
      loadData()
    })

    return {
      // 数据
      records,
      materialTypes,
      materialGrades,
      warehouseLocations,
      customers,
      productCombos,
      showAddOutboundModal,
      showComboList,
      searchQuery,
      currentPage,
      pageSize,
      filters,
      
      // 计算属性
      filteredRecords,
      totalRecords,
      totalPages,
      visiblePages,
      
      // 方法
      getMaterialTypeName,
      getMaterialGradeName,
      getCustomerName,
      getWarehouseLocationName,
      getOutboundTypeName,
      getOutboundTypeClass,
      getStatusName,
      getStatusClass,
      formatDate,
      formatDateTime,
      applyFilters,
      handleSearch,
      goToPage,
      toggleComboList,
      selectCombo,
      editCombo,
      deleteCombo,
      refreshRecords,
      exportRecords,
      handleVoiceRecord,
      handleCustomCombo,
      handleComboTemplate,
      viewRecord,
      editRecord,
      deleteRecord,
      handleAddOutbound,
      closeModal
    }
  }
}
</script>

<style scoped>
.outbound-records {
  padding: 24px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

/* 页面头部 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.page-title {
  font-size: 28px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

.page-subtitle {
  color: #666;
  margin: 4px 0 0 0;
  font-size: 14px;
}

/* 快捷操作区 */
.quick-actions {
  margin-bottom: 24px;
}

.action-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}

.action-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.action-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.card-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  font-size: 20px;
  color: white;
}

.card-icon.voice {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.card-icon.combo {
  background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
}

.card-icon.template {
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
}

.card-content h3 {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 4px 0;
}

.card-content p {
  font-size: 14px;
  color: #666;
  margin: 0;
}

/* 商品组合区域 */
.combo-section {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-header h2 {
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

.combo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
}

.combo-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s;
}

.combo-card:hover {
  border-color: #1976d2;
  box-shadow: 0 2px 8px rgba(25, 118, 210, 0.1);
}

.combo-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.combo-header h3 {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

.combo-code {
  font-size: 12px;
  color: #666;
  background: #f5f5f5;
  padding: 2px 6px;
  border-radius: 3px;
}

.combo-materials {
  margin-bottom: 12px;
}

.material-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 0;
  font-size: 14px;
}

.material-name {
  color: #333;
}

.material-quantity {
  color: #666;
  font-size: 12px;
}

.combo-pricing {
  border-top: 1px solid #f0f0f0;
  padding-top: 12px;
  margin-bottom: 12px;
}

.pricing-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
  font-size: 14px;
}

.pricing-row .label {
  color: #666;
}

.cost {
  color: #f57c00;
  font-weight: 500;
}

.profit-rate {
  color: #4caf50;
  font-weight: 500;
}

.price {
  color: #1976d2;
  font-weight: 600;
}

.combo-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.product-count {
  font-size: 12px;
  color: #666;
}

.combo-actions {
  display: flex;
  gap: 4px;
}

/* 筛选区域 */
.filter-section {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.filter-row {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  align-items: center;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-group label {
  font-size: 14px;
  color: #333;
  white-space: nowrap;
}

.filter-group select,
.filter-group input {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
}

/* 表格区域 */
.records-table {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.table-header {
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.table-actions {
  display: flex;
  justify-content: space-between;
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

.table-controls {
  display: flex;
  gap: 12px;
}

.table-container {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th {
  background: #f8f9fa;
  padding: 16px 12px;
  text-align: left;
  font-weight: 600;
  color: #333;
  border-bottom: 1px solid #eee;
  white-space: nowrap;
}

.data-table td {
  padding: 16px 12px;
  border-bottom: 1px solid #f0f0f0;
  vertical-align: top;
}

.table-row:hover {
  background-color: #f8f9fa;
}

.material-info {
  min-width: 200px;
}

.material-main {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.material-name {
  font-weight: 600;
  color: #1a1a1a;
}

.material-type {
  background: #e3f2fd;
  color: #1976d2;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.material-meta {
  display: flex;
  gap: 8px;
  font-size: 12px;
  color: #666;
}

.material-grade {
  background: #f3e5f5;
  color: #7b1fa2;
  padding: 2px 6px;
  border-radius: 3px;
}

.type-badge,
.status-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.type-badge.success,
.status-badge.success {
  background: #e8f5e8;
  color: #2e7d32;
}

.type-badge.info,
.status-badge.info {
  background: #e3f2fd;
  color: #1976d2;
}

.type-badge.warning,
.status-badge.warning {
  background: #fff3e0;
  color: #f57c00;
}

.type-badge.danger,
.status-badge.danger {
  background: #ffebee;
  color: #d32f2f;
}

.type-badge.default,
.status-badge.default {
  background: #f5f5f5;
  color: #666;
}

.actions {
  display: flex;
  gap: 8px;
}

.btn-icon {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 6px;
  background: #f5f5f5;
  color: #666;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.btn-icon:hover {
  background: #e0e0e0;
  color: #333;
}

.btn-icon.danger:hover {
  background: #ffebee;
  color: #d32f2f;
}

/* 分页 */
.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-top: 1px solid #eee;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.page-numbers {
  display: flex;
  gap: 4px;
}

/* 按钮样式 */
.btn {
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
  color: #333;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.btn:hover {
  background: #f5f5f5;
}

.btn.btn-primary {
  background: #1976d2;
  color: white;
  border-color: #1976d2;
}

.btn.btn-primary:hover {
  background: #1565c0;
}

.btn.btn-outline {
  background: transparent;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 模态框 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.modal-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

.btn-close {
  width: 32px;
  height: 32px;
  border: none;
  background: none;
  cursor: pointer;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-close:hover {
  background: #f5f5f5;
}

.modal-body {
  padding: 20px;
  overflow-y: auto;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .outbound-records {
    padding: 16px;
  }
  
  .page-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
  
  .action-cards {
    grid-template-columns: 1fr;
  }
  
  .combo-grid {
    grid-template-columns: 1fr;
  }
  
  .filter-row {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .table-actions {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
  
  .search-box {
    width: 100%;
  }
}
</style>