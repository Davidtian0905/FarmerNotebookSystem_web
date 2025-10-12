<template>
  <Layout>
    <div class="inbound-templates-page">
      <!-- 页面头部 -->
      <div class="page-header">
        <div class="header-left">
          <button @click="goBack" class="back-btn">
            <i class="fas fa-arrow-left"></i>
          </button>
          <div class="header-info">
            <h1 class="page-title">入库模板管理</h1>
            <p class="page-subtitle">管理和使用入库模板，提高入库效率</p>
          </div>
        </div>
        <div class="header-actions">
          <button @click="$router.push('/inbound-form')" class="btn btn-primary">
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
          <select v-model="filterType" class="filter-select">
            <option value="">全部类型</option>
            <option v-for="type in materialTypes" :key="type.value || type" :value="type.value || type">
              {{ type.label || type }}
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
                  v-model="editForm.inboundTempname" 
                  class="edit-input template-name-input"
                  placeholder="模板名称"
                  @click.stop
                />
              </div>
              <!-- 查看模式下的模板名称 -->
              <h3 v-else class="template-name">{{ template.inboundTempname || template.materialName }}</h3>
              
              <!-- 编辑模式下的物料信息 -->
              <div v-if="editingTemplateId === template.id" class="template-description edit-mode">
                <div class="edit-field-row">
                  <input 
                    v-model="editForm.materialName" 
                    class="edit-input material-name-input"
                    placeholder="物料名称"
                    disabled
                    @click.stop
                  />
                  <select v-model="editForm.materialType" class="edit-select material-type-select" disabled @click.stop>
                    <option value="">请选择类型</option>
                    <option v-for="type in baseData.materialTypes" :key="type.value || type" :value="type.value || type">
                      {{ type.label || type }}
                    </option>
                  </select>
                </div>
                <div class="edit-field-row">
                  <select v-model="editForm.materialGrade" class="edit-select material-grade-select" disabled @click.stop>
                    <option value="">请选择等级</option>
                    <option v-for="grade in materialGrades" :key="grade.value || grade" :value="grade.value || grade">
                      {{ grade.label || grade }}
                    </option>
                  </select>
                  <input 
                    v-model="editForm.batchNumber" 
                    class="edit-input batch-number-input"
                    placeholder="批号"
                    disabled
                    @click.stop
                  />
                </div>
                <div class="edit-field-row">
                  <input 
                    v-model="editForm.materialCode" 
                    class="edit-input material-code-input"
                    placeholder="物料编码"
                    disabled
                    @click.stop
                  />
                </div>
              </div>
              <!-- 查看模式下的物料信息 -->
              <div v-else class="template-description">
                <span v-if="template.materialName">{{ template.materialName }}</span>
                <span v-if="template.materialType" class="separator">{{ template.materialName ? ' | ' : '' }}{{ getMaterialTypeLabel(template.materialType) }}</span>
                <span v-if="template.materialGrade" class="separator">{{ (template.materialName || template.materialType) ? ' | ' : '' }}{{ getMaterialGradeLabel(template.materialGrade) }}</span>
                <span v-if="template.batchNumber" class="separator">{{ (template.materialName || template.materialType || template.materialGrade) ? ' | ' : '' }}批号: {{ template.batchNumber }}</span>
                <span v-if="template.materialCode" class="separator material-code-line"><br>编码: {{ template.materialCode }}</span>
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
                <span class="preview-label">供应商:</span>
                <div v-if="editingTemplateId === template.id" class="edit-field">
                  <select v-model="editForm.supplierId" class="edit-select" @click.stop>
                    <option v-for="supplier in supplierOptions" :key="supplier.value" :value="supplier.value">
                      {{ supplier.label }}
                    </option>
                  </select>
                </div>
                <span v-else class="preview-value">{{ getSupplierName(template.supplierId) }}</span>
              </div>

              <div class="preview-item">
                <span class="preview-label">存放位置:</span>
                <div v-if="editingTemplateId === template.id" class="edit-field">
                  <select v-model="editForm.warehouseLocation" class="edit-select" @click.stop>
                    <option v-for="location in warehouseLocations" :key="location.value" :value="location.value">
                      {{ location.label }}
                    </option>
                  </select>
                </div>
                <span v-else class="preview-value">{{ template.warehouseLocation }}</span>
              </div>
              <div class="preview-item">
                <span class="preview-label">保质期:</span>
                <div v-if="editingTemplateId === template.id" class="edit-field">
                  <select v-model="editForm.shelfLifeDays" class="edit-select shelf-life-select" @click.stop>
                    <option value="">请选择保质期时长</option>
                    <option value="90">3个月</option>
                    <option value="180">6个月</option>
                    <option value="270">9个月</option>
                    <option value="365">12个月</option>
                    <option value="540">18个月</option>
                    <option value="730">24个月</option>
                    <option value="1095">36个月</option>
                    <option value="9999">长期</option>
                  </select>
                </div>
                <span v-else class="preview-value">{{ getShelfLifeText(template.shelfLifeDays) }}</span>
              </div>
              <div class="preview-item">
                <span class="preview-label">质量状态:</span>
                <div v-if="editingTemplateId === template.id" class="edit-field">
                  <select v-model="editForm.qualityStatus" class="edit-select" @click.stop>
                    <option value="待检测">待检测</option>
                    <option value="合格">合格</option>
                    <option value="不合格">不合格</option>
                    <option value="免检">免检</option>
                  </select>
                </div>
                <span v-else class="preview-value">{{ template.qualityStatus }}</span>
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
          {{ searchKeyword || filterType ? '没有找到符合条件的模板' : '还没有创建任何入库模板' }}
        </p>
        <button v-if="!searchKeyword && !filterType" @click="showCreateModal = true" class="btn btn-primary">
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
                  <input v-model="templateForm.inboundTempname" type="text" class="form-input" required>
                </div>
                <div class="form-group">
                  <label class="form-label">模板描述</label>
                  <textarea v-model="templateForm.description" class="form-textarea" rows="3"></textarea>
                </div>
                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label required">物料名称</label>
                    <input v-model="templateForm.materialName" type="text" class="form-input" required>
                  </div>
                  <div class="form-group">
                    <label class="form-label required">物料类型</label>
                    <select v-model="templateForm.materialType" class="form-select" required>
                      <option value="">请选择类型</option>
                      <option v-for="type in materialTypes" :key="type.value || type" :value="type.value || type">
                        {{ type.label || type }}
                      </option>
                    </select>
                  </div>
                </div>
                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label required">数量</label>
                    <input v-model.number="templateForm.quantity" type="number" step="0.01" class="form-input" required>
                  </div>
                  <div class="form-group">
                    <label class="form-label required">单位</label>
                    <select v-model="templateForm.unit" class="form-select" required>
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
                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label">物料等级</label>
                    <select v-model="templateForm.materialGrade" class="form-select">
                      <option value="">请选择等级</option>
                      <option v-for="grade in materialGrades" :key="grade.value || grade" :value="grade.value || grade">
                        {{ grade.label || grade }}
                      </option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label class="form-label">批次号</label>
                    <input v-model="templateForm.batchNumber" type="text" class="form-input">
                  </div>
                </div>
              </div>

              <!-- 价格信息 -->
              <div class="form-section">
                <h4 class="section-title">价格信息</h4>
                <div class="form-group">
                  <label class="form-label">单价</label>
                  <input v-model.number="templateForm.unitPrice" type="number" step="0.01" class="form-input">
                </div>
              </div>

              <!-- 供应商信息 -->
              <div class="form-section">
                <h4 class="section-title">供应商信息</h4>
                <div class="form-group">
                  <label class="form-label">供应商</label>
                  <select v-model="templateForm.supplierId" class="form-select">
                    <option value="">请选择供应商</option>
                    <option v-for="supplier in supplierOptions" :key="supplier.value" :value="supplier.value">
                      {{ supplier.label }}
                    </option>
                  </select>
                </div>
              </div>

              <!-- 仓储信息 -->
              <div class="form-section">
                <h4 class="section-title">仓储信息</h4>
                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label">保质期时长</label>
                    <select v-model="templateForm.shelfLifeDays" class="form-select">
                      <option value="">请选择保质期时长</option>
                      <option value="90">3个月</option>
                      <option value="180">6个月</option>
                      <option value="270">9个月</option>
                      <option value="365">12个月</option>
                      <option value="540">18个月</option>
                      <option value="730">24个月</option>
                      <option value="1095">36个月</option>
                      <option value="9999">长期</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label class="form-label">仓库位置</label>
                    <select v-model="templateForm.warehouseLocation" class="form-select">
                      <option value="">请选择位置</option>
                      <option v-for="location in warehouseLocations" :key="location.value" :value="location.value">
                        {{ location.label }}
                      </option>
                    </select>
                  </div>
                </div>

              </div>

              <!-- 质量检验 -->
              <div class="form-section">
                <h4 class="section-title">质量检验</h4>
                <div class="form-group">
                  <label class="form-label">质量状态</label>
                  <select v-model="templateForm.qualityStatus" class="form-select">
                    <option value="">请选择状态</option>
                    <option v-for="status in qualityStatusOptions" :key="status" :value="status">
                      {{ status }}
                    </option>
                  </select>
                </div>
              </div>

              <div class="modal-actions">
                <button type="button" @click="closeModal" class="btn btn-secondary">取消</button>
                <button type="submit" class="btn btn-primary">保存</button>
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
  getInboundTemplates, 
  getSupplierOptions, 
  getMaterialTypeOptions,
  getMaterialGradeOptions,
  getQualityStatusOptions,
  getWarehouseLocationOptions,
  deleteInboundTemplate
} from '@/mock/warehouse_data.js'
import { SUPPLIERS } from '@/mock/data/suppliers_data.js'

const router = useRouter()

// 响应式数据
const templates = ref([])
const searchKeyword = ref('')
const filterType = ref('')
const showCreateModal = ref(false)
const showEditModal = ref(false)
const editingTemplate = ref(null)
const selectedTemplate = ref(null)
const editingTemplateId = ref(null)
const editForm = ref({
  inboundTempname: '',
  materialName: '',
  materialType: '',
  materialGrade: '',
  batchNumber: '',
  unitPrice: 0,
  quantity: 0,
  unit: 'kg',
  totalPrice: 0,
  supplierId: '',
  warehouseLocation: '',
  shelfLifeDays: 365,
  qualityStatus: '待检测'
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
const supplierOptions = ref([])
const warehouseLocations = ref([])
const qualityStatusOptions = ref([])

// 模板表单数据
const templateForm = ref({
  inboundTempname: '',
  materialName: '',
  materialType: '',
  quantity: 0,
  unit: 'kg',
  materialGrade: '',
  batchNumber: '',
  materialCode: '',
  unitPrice: 0,
  supplierId: '',
  date: new Date().toISOString().split('T')[0],
  time: new Date().toTimeString().split(' ')[0],
  expiryDate: '',
  shelfLifeDays: '',
  warehouseLocation: '',
  description: '',
  qualityStatus: '',
  inspector: '',
  inspectionDate: '',
  qualityRemarks: '',
  images: [],
  type: 'inbound'
})

// 计算属性
const filteredTemplates = computed(() => {
  let result = templates.value
  
  // 搜索过滤
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(template => 
      template.materialName.toLowerCase().includes(keyword) ||
      template.materialType.toLowerCase().includes(keyword)
    )
  }
  
  // 类型过滤
  if (filterType.value) {
    result = result.filter(template => template.materialType === filterType.value)
  }
  
  return result
})

// 方法
const loadData = async () => {
  try {
    templates.value = getInboundTemplates()
    baseData.value.materialTypes = getMaterialTypeOptions()
    baseData.value.materialGrades = getMaterialGradeOptions()
    supplierOptions.value = getSupplierOptions()
    warehouseLocations.value = getWarehouseLocationOptions()
    qualityStatusOptions.value = getQualityStatusOptions()
  } catch (error) {
    console.error('加载数据失败:', error)
  }
}

const goBack = () => {
  router.push('/inbound-records')
}

const getSupplierName = (supplierId) => {
  if (!supplierId) return '未设置'
  const supplier = supplierOptions.value.find(s => s.value === supplierId)
  return supplier ? supplier.label : supplierId
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

const useTemplate = (template) => {
  // 跳转到入库表单页面并传递模板数据
  router.push({
    path: '/inbound-form',
    query: {
      templateId: template.id,
      templateData: JSON.stringify({
        materialName: template.materialName,
        materialType: template.materialType,
        quantity: template.quantity,
        unit: template.unit,
        materialGrade: template.materialGrade,
        batchNumber: template.batchNumber,
        materialCode: template.materialCode,
        unitPrice: template.unitPrice,
        supplier: template.supplier,
        shelfLifeDays: template.shelfLifeDays,
        warehouseLocation: template.warehouseLocation,
        description: template.remarks,
        qualityStatus: template.qualityStatus,
        inspector: template.inspector,
        qualityRemarks: template.qualityRemarks
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
    inboundTempname: template.inboundTempname || '',
    materialName: template.materialName || '',
    materialType: template.materialType || '',
    materialGrade: template.materialGrade || '',
    batchNumber: template.batchNumber || '',
    materialCode: template.materialCode || '',
    unitPrice: template.unitPrice || 0,
    quantity: template.quantity || 0,
    unit: template.unit || 'kg',
    totalPrice: template.totalPrice || 0,
    supplier: template.supplier || '',
    warehouseLocation: template.warehouseLocation || '',
    shelfLifeDays: template.shelfLifeDays || 365,
    qualityStatus: template.qualityStatus || '待检测'
  }
}

const saveTemplateEdit = (template) => {
  event.stopPropagation()
  const index = templates.value.findIndex(t => t.id === template.id)
  if (index > -1) {
    templates.value[index] = {
      ...editForm.value,
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
  templateForm.value = { ...template }
  showEditModal.value = true
}

const deleteTemplate = (template) => {
  if (confirm(`确定要删除模板"${template.inboundTempname || template.materialName}"吗？`)) {
    const result = deleteInboundTemplate(template.id)
    if (result.success) {
      const index = templates.value.findIndex(t => t.id === template.id)
      if (index > -1) {
        templates.value.splice(index, 1)
      }
      alert('模板删除成功')
    } else {
      alert(result.message || '删除失败')
    }
  }
}



const closeModal = () => {
  showCreateModal.value = false
  showEditModal.value = false
  editingTemplate.value = null
  resetForm()
}

const resetForm = () => {
  templateForm.value = {
    inboundTempname: '',
    materialName: '',
    materialType: '',
    quantity: 0,
    unit: 'kg',
    materialGrade: '',
    batchNumber: '',
    materialCode: '',
    unitPrice: 0,
    supplier: '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().split(' ')[0],
    expiryDate: '',
    shelfLifeDays: '',
    warehouseLocation: '',
    description: '',
    qualityStatus: '',
    inspector: '',
    inspectionDate: '',
    qualityRemarks: '',
    images: [],
    type: 'inbound'
  }
}

const saveTemplate = () => {
  if (showCreateModal.value) {
    // 创建新模板
    const newTemplate = {
      ...templateForm.value,
      id: `TPL${String(templates.value.length + 1).padStart(3, '0')}`,
      createdAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
      updatedAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
      usageCount: 0,
      status: 'active'
    }
    templates.value.push(newTemplate)
  } else if (showEditModal.value && editingTemplate.value) {
    // 更新现有模板
    const index = templates.value.findIndex(t => t.id === editingTemplate.value.id)
    if (index > -1) {
      templates.value[index] = {
        ...templateForm.value,
        id: editingTemplate.value.id,
        createdAt: editingTemplate.value.createdAt,
        updatedAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
        usageCount: editingTemplate.value.usageCount,
        status: editingTemplate.value.status
      }
    }
  }
  
  closeModal()
}

// 生命周期
onMounted(() => {
  loadData()
})
</script>

<style scoped>
.inbound-templates-page {
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