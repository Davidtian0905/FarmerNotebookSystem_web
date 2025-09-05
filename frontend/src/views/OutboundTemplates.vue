<template>
  <Layout>
    <div class="outbound-templates-page">
      <!-- 页面头部 -->
      <div class="page-header">
        <div class="header-left">
          <button @click="goBack" class="back-btn">
            <i class="fas fa-arrow-left"></i>
          </button>
          <div class="header-info">
            <h1 class="page-title">产品模板管理</h1>
            <p class="page-subtitle">管理和使用产品模板，提高产品效率</p>
          </div>
        </div>
        <div class="header-actions">
          <button @click="$router.push('/outbound-form')" class="btn btn-primary">
            <i class="fas fa-plus"></i>
            新建模板
          </button>
        </div>
      </div>

      <!-- 搜索和筛选区域 -->
      <div class="search-filter-section">
        <div class="search-box">
          <i class="fas fa-search search-icon"></i>
          <input 
            v-model="searchKeyword" 
            type="text" 
            placeholder="搜索模板名称或描述..."
            class="search-input"
          >
        </div>
        <div class="filter-controls">
          <select v-model="filterChannel" class="filter-select">
            <option value="">全部渠道</option>
            <option v-for="channel in channelOptions" :key="channel.value" :value="channel.label">
                      {{ channel.label }}
                    </option>
          </select>
        </div>
      </div>

      <!-- 模板列表 -->
      <div class="templates-grid">
        <div 
          v-for="template in filteredTemplates" 
          :key="template.id"
          class="template-card"
          :class="{ 
            'template-selected': selectedTemplate?.id === template.id,
            'template-editing': editingTemplateId === template.id
          }"
          @click="selectTemplate(template)"
        >
          <!-- 模板内容 -->
          <div class="template-content">
            <div class="template-header">
              <!-- 编辑模式下的模板名称 -->
              <div v-if="editingTemplateId === template.id" class="edit-field">
                <input 
                  v-model="editForm.outboundTempname" 
                  class="edit-input template-name-input"
                  placeholder="模板名称"
                  @click.stop
                />
              </div>
              <!-- 非编辑模式下的模板名称 -->
              <h3 v-else class="template-name">{{ template.outboundTempname || template.productName }}</h3>
              
              <!-- 编辑模式下的产品信息 -->
              <div v-if="editingTemplateId === template.id" class="template-description edit-mode">
                <div class="edit-field-row">
                  <input 
                    v-model="editForm.productName" 
                    class="edit-input product-name-input"
                    placeholder="产品名称"
                    disabled
                    @click.stop
                  />
                  <input 
                    v-model="editForm.productCode" 
                    class="edit-input product-code-input"
                    placeholder="产品编码"
                    disabled
                    @click.stop
                  />
                </div>
              </div>
              <!-- 查看模式下的产品信息 -->
              <div v-else class="template-description">
                <span v-if="template.productName">{{ template.productName }}</span>
                <span v-if="template.productCode" class="separator product-code-line"><br>编码: {{ template.productCode }}</span>
              </div>
            </div>

            <!-- 模板预览信息 -->
            <div class="template-preview">
              <div class="preview-item">
                <span class="preview-label">单价:</span>
                <div v-if="editingTemplateId === template.id" class="edit-field">
                  <input 
                    v-model.number="editForm.unitPrice" 
                    type="number" 
                    step="0.01"
                    class="edit-input price-input"
                    @click.stop
                  />
                </div>
                <span v-else class="preview-value price">¥{{ template.unitPrice.toFixed(2) }}</span>
              </div>
              <div class="preview-item">
                <span class="preview-label">数量:</span>
                <div v-if="editingTemplateId === template.id" class="edit-field quantity-field">
                  <input 
                    v-model.number="editForm.quantity" 
                    type="number"
                    class="edit-input quantity-input"
                    @click.stop
                  />
                  <select v-model="editForm.unit" class="edit-select unit-select" @click.stop>
                     <option value="">请选择单位</option>
                     <option value="kg">公斤</option>
                     <option value="斤">斤</option>
                     <option value="g">克</option>
                     <option value="袋">袋</option>
                     <option value="盒">盒</option>
                     <option value="箱">箱</option>
                     <option value="个">个</option>
                    </select>
                </div>
                <span v-else class="preview-value">{{ template.quantity }}{{ template.unit }}</span>
              </div>
              <div class="preview-item">
                <span class="preview-label">总价:</span>
                <span class="preview-value price">
                  ¥{{ editingTemplateId === template.id ? 
                    (editForm.unitPrice * editForm.quantity).toFixed(2) : 
                    (template.unitPrice * template.quantity).toFixed(2) 
                  }}
                </span>
              </div>
              <div class="preview-item">
                <span class="preview-label">客户:</span>
                <div v-if="editingTemplateId === template.id" class="edit-field">
                  <select v-model="editForm.customerId" class="edit-select" @click.stop>
                    <option value="">请选择客户</option>
                    <option v-for="customer in customerOptions" :key="customer.value" :value="customer.value">
                      {{ customer.label }}
                    </option>
                  </select>
                </div>
                <span v-else class="preview-value">{{ template.customerName }}</span>
              </div>
              <div class="preview-item">
                <span class="preview-label">销售渠道:</span>
                <div v-if="editingTemplateId === template.id" class="edit-field">
                  <select v-model="editForm.channel" class="edit-select" @click.stop>
                    <option value="">请选择渠道</option>
                    <option v-for="channel in channelOptions" :key="channel.value" :value="channel.label">
                      {{ channel.label }}
                    </option>
                  </select>
                </div>
                <span v-else class="preview-value">{{ getChannelLabel(template.channel) }}</span>
              </div>
              <div class="preview-item" v-if="template.notes">
                <span class="preview-label">备注:</span>
                <div v-if="editingTemplateId === template.id" class="edit-field">
                  <textarea 
                    v-model="editForm.notes" 
                    class="edit-textarea"
                    @click.stop
                  ></textarea>
                </div>
                <span v-else class="preview-value">{{ template.notes }}</span>
              </div>
            </div>

            <!-- 模板创建日期信息 -->
            <div class="template-stats">
              <div class="stat-item">
                <i class="fas fa-calendar-alt"></i>
                <span>创建时间：{{ formatDate(template.createdAt) }}</span>
              </div>
              <div class="stat-item" v-if="template.updatedAt && template.updatedAt !== template.createdAt">
                <i class="fas fa-clock"></i>
                <span>更新时间：{{ formatDate(template.updatedAt) }}</span>
              </div>
            </div>
          </div>
  

          <!-- 操作按钮 -->
          <div class="template-actions">
            <button @click="useTemplate(template)" class="action-btn use-btn" v-if="editingTemplateId !== template.id">
              <i class="fas fa-play"></i>
              使用模板
            </button>
            
            <!-- 编辑模式下的按钮 -->
            <template v-if="editingTemplateId === template.id">
              <button @click="saveTemplateEdit(template)" class="action-btn save-btn">
                <i class="fas fa-save"></i>
                保存
              </button>
              <button @click="cancelTemplateEdit()" class="action-btn cancel-btn">
                <i class="fas fa-times"></i>
                取消
              </button>
            </template>
            
            <!-- 非编辑模式下的按钮 -->
            <template v-else>
              <button @click="startEditTemplate(template)" class="action-btn edit-btn">
                <i class="fas fa-edit"></i>
                编辑
              </button>
              <button @click="deleteTemplate(template)" class="action-btn delete-btn">
                <i class="fas fa-trash"></i>
                删除
              </button>
            </template>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="filteredTemplates.length === 0" class="empty-state">
        <div class="empty-icon">
          <i class="fas fa-file-alt"></i>
        </div>
        <h3 class="empty-title">暂无模板</h3>
        <p class="empty-description">
          {{ searchKeyword || filterChannel ? '没有找到符合条件的模板' : '还没有创建任何出库模板' }}
        </p>
        <button v-if="!searchKeyword && !filterChannel" @click="showCreateModal = true" class="btn btn-primary">
          <i class="fas fa-plus"></i>
          创建第一个模板
        </button>
      </div>

      <!-- 创建/编辑模板弹窗 -->
      <div v-if="showCreateModal || showEditModal" class="modal-overlay" @click="closeModal">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h3>{{ showCreateModal ? '新建模板' : '编辑模板' }}</h3>
            <button @click="closeModal" class="modal-close">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveTemplate">
              <!-- 基本信息 -->
              <div class="form-section">
                <h4 class="section-title">基本信息</h4>
                <div class="form-group">
                  <label class="form-label required">模板名称</label>
                  <input v-model="templateForm.outboundTempname" type="text" class="form-input" required>
                </div>
                <div class="form-group">
                  <label class="form-label">模板描述</label>
                  <textarea v-model="templateForm.description" class="form-textarea" rows="3"></textarea>
                </div>
                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label required">产品名称</label>
                    <input v-model="templateForm.productName" type="text" class="form-input" required>
                  </div>
                  <div class="form-group">
                    <label class="form-label">产品编码</label>
                    <input v-model="templateForm.productCode" type="text" class="form-input">
                  </div>
                </div>
                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label">数量</label>
                    <input v-model.number="templateForm.quantity" type="number" class="form-input">
                  </div>
                  <div class="form-group">
                    <label class="form-label">单位</label>
                    <select v-model="templateForm.unit" class="form-select">
                      <option value="">请选择单位</option>
                      <option value="kg">公斤</option>
                      <option value="斤">斤</option>
                      <option value="g">克</option>
                      <option value="袋">袋</option>
                      <option value="盒">盒</option>
                      <option value="箱">箱</option>
                      <option value="个">个</option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- 价格信息 -->
              <div class="form-section">
                <h4 class="section-title">价格信息</h4>
                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label">单价</label>
                    <input v-model.number="templateForm.unitPrice" type="number" step="0.01" class="form-input">
                  </div>
                  <div class="form-group">
                    <label class="form-label">总价</label>
                    <input v-model.number="templateForm.totalPrice" type="number" step="0.01" class="form-input">
                  </div>
                </div>
              </div>

              <!-- 客户信息 -->
              <div class="form-section">
                <h4 class="section-title">客户信息</h4>
                <div class="form-group">
                  <label class="form-label">客户</label>
                  <select v-model="templateForm.customerId" class="form-select">
                    <option value="">请选择客户</option>
                    <option v-for="customer in customerOptions" :key="customer.value" :value="customer.value">
                      {{ customer.label }}
                    </option>
                  </select>
                </div>
                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label">客户姓名</label>
                    <input v-model="templateForm.customerName" type="text" class="form-input">
                  </div>
                  <div class="form-group">
                    <label class="form-label">客户电话</label>
                    <input v-model="templateForm.customerPhone" type="text" class="form-input">
                  </div>
                </div>
                <div class="form-group">
                  <label class="form-label">客户地址</label>
                  <input v-model="templateForm.customerAddress" type="text" class="form-input">
                </div>
              </div>

              <!-- 销售信息 -->
              <div class="form-section">
                <h4 class="section-title">销售信息</h4>
                <div class="form-group">
                  <label class="form-label">销售渠道</label>
                  <select v-model="templateForm.channel" class="form-select">
                    <option value="">请选择渠道</option>
                    <option v-for="channel in channelOptions" :key="channel.value" :value="channel.label">
                      {{ channel.label }}
                    </option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">备注说明</label>
                  <textarea v-model="templateForm.notes" class="form-textarea" rows="3"></textarea>
                </div>
              </div>

              <!-- 表单按钮 -->
              <div class="modal-footer">
                <button type="button" @click="closeModal" class="btn btn-secondary">
                  <i class="fas fa-times"></i>
                  取消
                </button>
                <button type="submit" class="btn btn-primary">
                  <i class="fas fa-save"></i>
                  {{ showCreateModal ? '创建模板' : '保存修改' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Layout from '@/components/layout/Layout.vue'
import { 
  getOutboundTemplates,
  createOutboundTemplate,
  updateOutboundTemplate,
  deleteOutboundTemplate,
  getCustomerOptions,
  getSalesChannelOptions
} from '@/mock/outbound_data.js'

const router = useRouter()

// 响应式数据
const templates = ref([])
const searchKeyword = ref('')
const filterChannel = ref('')
const showCreateModal = ref(false)
const showEditModal = ref(false)
const editingTemplate = ref(null)
const selectedTemplate = ref(null)
const editingTemplateId = ref(null)
const editForm = ref({
  outboundTempname: '',
  productName: '',
  productCode: '',
  quantity: 0,
  unit: 'kg',
  unitPrice: 0,
  totalPrice: 0,
  customerId: '',
  customerName: '',
  customerPhone: '',
  customerAddress: '',
  customerDiscountRate: 0,
  channel: '',
  tags: [],
  notes: ''
})

// 基础数据
const baseData = ref({
  materialTypes: []
})
const materialTypes = computed(() => {
  return baseData.value.materialTypes || []
})
const materialGrades = computed(() => {
  return baseData.value.materialGrades || []
})
const customsOptions = ref([])
const customerOptions = ref([])
const channelOptions = ref([])

// 模板表单数据
const templateForm = ref({
  outboundTempname: '',
  productName: '',
  productCode: '',
  quantity: 0,
  unit: 'kg',
  unitPrice: 0,
  totalPrice: 0,
  customerId: '',
  customerName: '',
  customerPhone: '',
  customerAddress: '',
  customerDiscountRate: 0,
  channel: '',
  tags: [],
  notes: '',
  date: new Date().toISOString().split('T')[0],
  time: new Date().toTimeString().split(' ')[0],
  description: '',
  type: 'outbound'
})

// 计算属性
const filteredTemplates = computed(() => {
  let result = templates.value
  
  // 搜索过滤
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(template => 
      template.outboundTempname.toLowerCase().includes(keyword) ||
      template.productName.toLowerCase().includes(keyword)
    )
  }
  
  // 渠道过滤
  if (filterChannel.value) {
    // filterChannel.value 是中文标签，需要找到对应的英文键进行比较
    const channelOption = channelOptions.value.find(option => option.label === filterChannel.value)
    if (channelOption) {
      result = result.filter(template => template.channel === channelOption.value)
    }
  }
  
  return result
})

// 方法
const loadData = async () => {
  try {
    // 加载模板数据
    templates.value = await getOutboundTemplates()
    
    // 加载基础数据
    customerOptions.value = await getCustomerOptions()
    channelOptions.value = await getSalesChannelOptions()
  } catch (error) {
    console.error('加载数据失败:', error)
  }
}

const goBack = () => {
  router.push('/outbound-records')
}

const getcustomsName = (customs) => {
  // 直接返回客户名称，因为模板数据中customs字段存储的是客户名称
  return customs || '未知客户'
}

const getShelfLifeText = (days) => {
  if (!days) return '未设置'
  switch (parseInt(days)) {
    case 90: return '3个月'
    case 180: return '6个月'
    case 270: return '9个月'
    case 365: return '12个月'
    case 540: return '18个月'
    case 730: return '24个月'
    case 1095: return '36个月'
    case 9999: return '长期'
    default: return days + '天'
  }
}

const getMaterialTypeLabel = (materialType) => {
  if (!materialType) return ''
  const typeOption = baseData.value.materialTypes?.find(type => type.value === materialType)
  return typeOption ? typeOption.label : materialType
}

const getMaterialGradeLabel = (materialGrade) => {
  if (!materialGrade) return ''
  const gradeOption = baseData.value.materialGrades?.find(grade => grade.value === materialGrade)
  return gradeOption ? gradeOption.label : materialGrade
}

const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN')
}

const getChannelLabel = (channelValue) => {
  if (!channelValue) return ''
  const channel = channelOptions.value.find(option => option.value === channelValue)
  return channel ? channel.label : channelValue
}

const useTemplate = (template) => {
  // 跳转到出库表单页面并传递模板数据
  router.push({
    path: '/outbound-form',
    query: {
      templateId: template.id,
      templateData: JSON.stringify({
        productName: template.productName,
        productCode: template.productCode,
        quantity: template.quantity,
        unit: template.unit,
        unitPrice: template.unitPrice,
        totalPrice: template.totalPrice,
        customerId: template.customerId,
        customerName: template.customerName,
        customerPhone: template.customerPhone,
        customerAddress: template.customerAddress,
        customerDiscountRate: template.customerDiscountRate,
        channel: template.channel,
        tags: template.tags || [],
        notes: template.notes
      })
    }
  })
}

const selectTemplate = (template) => {
  if (editingTemplateId.value) return // 如果正在编辑，不允许选择
  selectedTemplate.value = template
}

const startEditTemplate = (template) => {
  event.stopPropagation()
  editingTemplateId.value = template.id
  editForm.value = {
    outboundTempname: template.outboundTempname || '',
    productName: template.productName || '',
    productCode: template.productCode || '',
    quantity: template.quantity || 0,
    unit: template.unit || 'kg',
    unitPrice: template.unitPrice || 0,
    totalPrice: template.totalPrice || 0,
    customerId: template.customerId || '',
    customerName: template.customerName || '',
    customerPhone: template.customerPhone || '',
    customerAddress: template.customerAddress || '',
    customerDiscountRate: template.customerDiscountRate || 0,
    channel: getChannelLabel(template.channel) || '',
    tags: template.tags || [],
    notes: template.notes || ''
  }
}

const saveTemplateEdit = (template) => {
  event.stopPropagation()
  const index = templates.value.findIndex(t => t.id === template.id)
  if (index > -1) {
    // 将中文渠道标签转换回英文键
    const channelOption = channelOptions.value.find(option => option.label === editForm.value.channel)
    const channelValue = channelOption ? channelOption.value : editForm.value.channel
    
    templates.value[index] = {
      ...editForm.value,
      channel: channelValue,
      id: template.id,
      createdAt: template.createdAt,
      updatedAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
      usageCount: template.usageCount,
      status: template.status
    }
  }
  editingTemplateId.value = null
  editForm.value = {}
}

const cancelTemplateEdit = () => {
  event.stopPropagation()
  editingTemplateId.value = null
  editForm.value = {}
}

const editTemplate = (template) => {
  editingTemplate.value = template
  templateForm.value = { 
    ...template,
    channel: getChannelLabel(template.channel) || template.channel
  }
  showEditModal.value = true
}

const deleteTemplate = async (template) => {
  if (confirm(`确定要删除模板"${template.outboundTempname || template.materialName}"吗？`)) {
    try {
      await deleteOutboundTemplate(template.id)
      const index = templates.value.findIndex(t => t.id === template.id)
      if (index > -1) {
        templates.value.splice(index, 1)
      }
      alert('模板删除成功')
    } catch (error) {
      console.error('删除模板失败:', error)
      alert('删除失败')
    }
  }
}



const closeModal = () => {
  showCreateModal.value = false
  showEditModal.value = false
  editingTemplate.value = null
  resetTemplateForm()
}

const resetTemplateForm = () => {
  templateForm.value = {
    outboundTempname: '',
    description: '',
    productName: '',
    productCode: '',
    quantity: null,
    unit: '',
    unitPrice: null,
    totalPrice: null,
    customerId: '',
    customerName: '',
    customerPhone: '',
    customerAddress: '',
    customerDiscountRate: null,
    channel: '',
    tags: [],
    notes: ''
  }
}

const saveTemplate = async () => {
  try {
    // 将中文渠道标签转换回英文键
    const channelOption = channelOptions.value.find(option => option.label === templateForm.value.channel)
    const formData = {
      ...templateForm.value,
      channel: channelOption ? channelOption.value : templateForm.value.channel
    }
    
    if (editingTemplate.value) {
      // 编辑模式
      const result = await updateOutboundTemplate(editingTemplate.value.id, formData)
      if (result.success) {
        console.log('模板更新成功')
      }
    } else {
      // 创建模式
      const result = await createOutboundTemplate(formData)
      if (result.success) {
        console.log('模板创建成功')
      }
    }
    
    showCreateModal.value = false
    showEditModal.value = false
    editingTemplate.value = null
    resetTemplateForm()
    await loadData()
  } catch (error) {
    console.error('保存模板失败:', error)
  }
}

// 生命周期
onMounted(() => {
  loadData()
})
</script>

<style scoped>
.outbound-templates-page {
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
  padding: 24px 0;
  border-bottom: 1px solid #e5e7eb;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.back-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: white;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
}

.back-btn:hover {
  background: #f9fafb;
  border-color: #9ca3af;
}

.header-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.page-subtitle {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 12px;
}

/* 搜索和筛选区域 */
.search-filter-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  gap: 16px;
}

.search-box {
  position: relative;
  flex: 1;
  max-width: 400px;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  font-size: 14px;
}

.search-input {
  width: 100%;
  padding: 10px 12px 10px 36px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.filter-controls {
  display: flex;
  gap: 12px;
}

.filter-select {
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  background: white;
  min-width: 120px;
}

/* 模板网格 */
.templates-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.template-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
  transition: all 0.2s;
  position: relative;
}

.template-card:hover {
  border-color: #3b82f6;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.template-card.template-selected {
  border-color: #3b82f6;
  background: #f8faff;
}

.template-card.template-editing {
  border-color: #f59e0b;
  background: #fffbeb;
}

/* 编辑字段样式 */
.edit-field {
  display: flex;
  align-items: center;
  gap: 8px;
}

.edit-field-row {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.edit-field-row:last-child {
  margin-bottom: 0;
}

.edit-input {
  flex: 1;
  padding: 4px 8px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 12px;
  min-width: 0;
}

.edit-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

.edit-input:disabled,
.edit-select:disabled {
  background-color: #f3f4f6;
  color: #6b7280;
  cursor: not-allowed;
  border-color: #d1d5db;
}

.edit-input:disabled:hover,
.edit-select:disabled:hover {
  border-color: #d1d5db;
}

.template-name-input {
  font-size: 14px;
  font-weight: 600;
  padding: 6px 10px;
}

.price-input {
  width: 80px;
}

.quantity-field {
  display: flex;
  gap: 4px;
}

.quantity-input {
  width: 60px;
}

.edit-select {
  padding: 4px 6px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 12px;
  background: white;
}

.unit-select {
  width: 50px;
}

.days-input {
  width: 60px;
}

.unit-text {
  font-size: 12px;
  color: #6b7280;
}

.material-name-input,
.batch-number-input {
  flex: 1;
}

.material-type-select,
.material-grade-select {
  flex: 1;
  min-width: 100px;
}

.template-description.edit-mode {
  margin-top: 8px;
}



.template-content {
  margin-bottom: 16px;
}

.template-header {
  margin-bottom: 16px;
}

.template-name {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 8px 0;
}

.template-description {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
  line-height: 1.5;
}

.template-preview {
  margin-bottom: 16px;
}

.preview-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f3f4f6;
}

.preview-item:last-child {
  border-bottom: none;
}

.preview-label {
  font-size: 13px;
  color: #6b7280;
  font-weight: 500;
}

.preview-value {
  font-size: 13px;
  color: #111827;
  font-weight: 500;
}

.preview-value.price {
  color: #dc2626;
  font-weight: 600;
}

.template-stats {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #6b7280;
}

.template-actions {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 8px;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 12px;
  border: 1px solid;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.use-btn {
  background: #3b82f6;
  border-color: #3b82f6;
  color: white;
}

.use-btn:hover {
  background: #2563eb;
}

.edit-btn {
  background: white;
  border-color: #d1d5db;
  color: #6b7280;
}

.edit-btn:hover {
  background: #f9fafb;
  border-color: #9ca3af;
}

.delete-btn {
  background: white;
  border-color: #fca5a5;
  color: #dc2626;
}

.delete-btn:hover {
  background: #fef2f2;
}

.save-btn {
  background: #10b981;
  border-color: #10b981;
  color: white;
}

.save-btn:hover {
  background: #059669;
}

.cancel-btn {
  background: white;
  border-color: #f59e0b;
  color: #f59e0b;
}

.cancel-btn:hover {
  background: #fffbeb;
}



/* 空状态 */
.empty-state {
  text-align: center;
  padding: 60px 20px;
}

.empty-icon {
  font-size: 48px;
  color: #d1d5db;
  margin-bottom: 16px;
}

.empty-title {
  font-size: 18px;
  font-weight: 600;
  color: #374151;
  margin: 0 0 8px 0;
}

.empty-description {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 24px 0;
}

/* 按钮样式 */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border: 1px solid;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
}

.btn-primary {
  background: #3b82f6;
  border-color: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background: #2563eb;
}

.btn-secondary {
  background: white;
  border-color: #d1d5db;
  color: #374151;
}

.btn-secondary:hover {
  background: #f9fafb;
}

/* 弹窗样式 */
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
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.modal-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
}

.modal-close:hover {
  background: #f3f4f6;
}

.modal-body {
  padding: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 6px;
}

.form-label.required::after {
  content: ' *';
  color: #dc2626;
}

.form-input,
.form-select,
.form-textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
}

/* 表单分组样式 */
.form-section {
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid #f3f4f6;
}

.form-section:last-of-type {
  border-bottom: none;
  margin-bottom: 0;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #374151;
  margin: 0 0 16px 0;
  padding-bottom: 8px;
  border-bottom: 1px solid #e5e7eb;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .search-filter-section {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-controls {
    justify-content: stretch;
  }
  
  .filter-select {
    flex: 1;
  }
  
  .templates-grid {
    grid-template-columns: 1fr;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .modal-content {
    width: 95%;
    margin: 20px;
  }
}
</style>