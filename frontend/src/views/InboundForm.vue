<template>
  <Layout>
    <div class="inbound-form-page">
      <!-- 页面头部 -->
      <div class="page-header">
        <div class="header-left">
          <h1 class="page-title">入库记录</h1>
          <p class="page-subtitle">添加新的茶叶入库记录</p>
        </div>
        <div class="header-right">
          <button class="btn btn-secondary" @click="$router.push('/inbound-records')">
            <i class="icon-arrow-left"></i>
            返回列表
          </button>
          <button class="btn btn-primary" @click="handleSave">
            <i class="icon-save"></i>
            确定入库
          </button>
        </div>
      </div>

      <!-- 表单内容 -->
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- 快捷选择 -->
        <div class="form-section">
          <div class="section-header">
            <h3 class="section-title">快捷选择</h3>
          </div>
          <div class="section-content">
            <div class="flex items-center space-x-4">
              <button type="button" @click="selectTemplate" class="template-btn">
                <i class="fas fa-search"></i>
                <span>选择物料模板</span>
              </button>
            </div>
          </div>
        </div>

        <!-- 物料信息 -->
        <div class="form-section">
          <div class="section-header">
            <h3 class="section-title">物料信息</h3>
          </div>
          <div class="section-content">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div class="form-group">
                <label class="form-label required">物料名称</label>
                <div class="relative">
                  <input 
                    v-model="formData.materialName" 
                    type="text" 
                    placeholder="请输入或搜索物料名称" 
                    class="form-input"
                    required
                    @input="updateMaterialCode"
                    @focus="formData.materialName && searchMaterials(formData.materialName)"
                    @blur="handleInputBlur"
                  >
                  
                  <!-- 搜索结果下拉列表 -->
                  <div v-if="showSearchResults && searchResults.length > 0" class="search-results-dropdown">
                    <div 
                      v-for="(material, index) in searchResults" 
                      :key="index"
                      class="search-result-item"
                      @click="selectMaterial(material)"
                    >
                      <div class="material-info">
                        <div class="material-name">{{ material.materialName }}</div>
                        <div class="material-details">
                          <span class="material-code">编号: {{ material.materialCode }}</span>
                          <span v-if="material.materialType" class="material-type">类型: {{ material.materialType }}</span>
                          <span v-if="material.materialGrade || material.batchNumber" class="material-grade-batch">
                            <span v-if="material.materialGrade">等级: {{ material.materialGrade }}</span>
                            <span v-if="material.materialGrade && material.batchNumber"> | </span>
                            <span v-if="material.batchNumber">批次号: {{ material.batchNumber }}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="form-group">
                <label class="form-label">物料类型</label>
                <select v-model="formData.materialType" class="form-select" style="background-color: white; color: #374151;">
                  <option value="" style="color: #9ca3af; background-color: white;">请选择物料类型</option>
                  <option 
                    v-for="type in baseData.materialTypes" 
                    :key="type.value || type" 
                    :value="type.value || type"
                    style="color: #374151; background-color: white;"
                  >
                    {{ type.label || type }}
                  </option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div class="form-group">
                <label class="form-label required">入库数量</label>
                <input 
                  v-model.number="formData.quantity" 
                  type="number" 
                  placeholder="0" 
                  class="form-input"
                  required
                  @input="calculateTotal"
                >
              </div>
              <div class="form-group">
                <label class="form-label">计量单位</label>
                <select v-model="formData.unit" class="form-select">
                  <option value="kg">公斤</option>
                  <option value="斤">斤</option>
                  <option value="g">克</option>
                  <option value="袋">袋</option>
                  <option value="盒">盒</option>
                  <option value="箱">箱</option>
                  <option value="个">个</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">物料等级</label>
                <select v-model="formData.materialGrade" class="form-select">
                  <option value="">请选择等级</option>
                  <option 
                    v-for="grade in baseData.materialGrades" 
                    :key="grade.value || grade" 
                    :value="grade.value || grade"
                  >
                    {{ grade.label || grade }}
                  </option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div class="form-group">
                <label class="form-label">批次号</label>
                <input 
                  v-model="formData.batchNumber" 
                  type="text" 
                  placeholder="请输入批次号，如第一批，第二批，第三批等" 
                  class="form-input"
                >
              </div>
              <div class="form-group">
                <label class="form-label">物料编号</label>
                <input 
                  v-model="formData.materialCode" 
                  type="text" 
                  placeholder="自动生成" 
                  class="form-input bg-gray-50" 
                  readonly
                >
              </div>
            </div>
          </div>
        </div>

        <!-- 价格信息 -->
        <div class="form-section">
          <div class="section-header">
            <h3 class="section-title">价格信息</h3>
          </div>
          <div class="section-content">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div class="form-group">
                <label class="form-label required">单价</label>
                <div class="relative">
                  <span class="absolute left-3 top-3 text-gray-500">¥</span>
                  <input 
                    v-model.number="formData.unitPrice" 
                    type="number" 
                    placeholder="0.00" 
                    step="0.01"
                    class="form-input pl-8"
                    required
                    @input="calculateTotal"
                  >
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">总金额</label>
                <div class="relative">
                  <span class="absolute left-3 top-3 text-gray-500">¥</span>
                  <input 
                    :value="amount" 
                    type="number" 
                    placeholder="0.00" 
                    step="0.01" 
                    readonly
                    class="form-input pl-8 bg-gray-50 text-gray-500"
                  >
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 供应商信息 -->
        <div class="form-section">
          <div class="section-header">
            <h3 class="section-title">供应商信息</h3>
          </div>
          <div class="section-content space-y-6">
            <div class="form-group">
              <label class="form-label required">供应商</label>
              <select v-model="formData.supplier" class="form-select" @change="showSupplierRating = !!formData.supplier">
                <option value="">请选择供应商</option>
                <option 
                  v-for="supplier in baseData.suppliers" 
                  :key="supplier.value" 
                  :value="supplier.value"
                >
                  {{ supplier.label }}
                </option>
              </select>
            </div>

            <!-- 供应商评价系统 -->
            <div v-if="showSupplierRating" class="supplier-rating">
              <h4 class="text-md font-medium text-gray-800 mb-4">供应商评价</h4>
              <div class="space-y-4">
                <div class="rating-item">
                  <span class="rating-label">产品质量</span>
                  <div class="rating-stars">
                    <i 
                      v-for="star in 5" 
                      :key="'quality-' + star"
                      :class="['fas fa-star cursor-pointer', star <= ratings.quality ? 'text-yellow-400' : 'text-gray-300']"
                      @click="setRating('quality', star)"
                    ></i>
                    <span class="rating-text">{{ ratings.quality }}分</span>
                  </div>
                </div>
                <div class="rating-item">
                  <span class="rating-label">交付及时性</span>
                  <div class="rating-stars">
                    <i 
                      v-for="star in 5" 
                      :key="'delivery-' + star"
                      :class="['fas fa-star cursor-pointer', star <= ratings.delivery ? 'text-yellow-400' : 'text-gray-300']"
                      @click="setRating('delivery', star)"
                    ></i>
                    <span class="rating-text">{{ ratings.delivery }}分</span>
                  </div>
                </div>
                <div class="rating-item">
                  <span class="rating-label">价格合理性</span>
                  <div class="rating-stars">
                    <i 
                      v-for="star in 5" 
                      :key="'price-' + star"
                      :class="['fas fa-star cursor-pointer', star <= ratings.price ? 'text-yellow-400' : 'text-gray-300']"
                      @click="setRating('price', star)"
                    ></i>
                    <span class="rating-text">{{ ratings.price }}分</span>
                  </div>
                </div>
                <div class="rating-item">
                  <span class="rating-label">服务态度</span>
                  <div class="rating-stars">
                    <i 
                      v-for="star in 5" 
                      :key="'service-' + star"
                      :class="['fas fa-star cursor-pointer', star <= ratings.service ? 'text-yellow-400' : 'text-gray-300']"
                      @click="setRating('service', star)"
                    ></i>
                    <span class="rating-text">{{ ratings.service }}分</span>
                  </div>
                </div>
                <div class="overall-rating">
                  <span class="text-sm font-medium text-gray-700">综合评分：</span>
                  <span class="text-lg font-bold text-green-600">{{ overallRating.toFixed(1) }}分</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 其他信息 -->
        <div class="form-section">
          <div class="section-header">
            <h3 class="section-title">其他信息</h3>
          </div>
          <div class="section-content">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div class="form-group">
                <label class="form-label">入库日期</label>
                <input 
                  v-model="formData.date" 
                  type="date" 
                  class="form-input"
                >
              </div>
              <div class="form-group">
                <label class="form-label">入库时间</label>
                <input 
                  v-model="formData.time" 
                  type="time" 
                  class="form-input"
                >
              </div>
              <div class="form-group">
                <label class="form-label">保质期</label>
                <input 
                  v-model="formData.expiryDate" 
                  type="date" 
                  class="form-input"
                >
              </div>
            </div>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div class="form-group">
                <label class="form-label">保质期时长</label>
                <select v-model="formData.shelfLifeDays" class="form-select" @change="calculateExpiryDate" style="background-color: white; color: #374151;">
                  <option value="" style="color: #9ca3af; background-color: white;">请选择保质期时长</option>
                  <option value="90" style="color: #374151; background-color: white;">3个月</option>
                  <option value="180" style="color: #374151; background-color: white;">6个月</option>
                  <option value="270" style="color: #374151; background-color: white;">9个月</option>
                  <option value="365" style="color: #374151; background-color: white;">12个月</option>
                  <option value="540" style="color: #374151; background-color: white;">18个月</option>
                  <option value="730" style="color: #374151; background-color: white;">24个月</option>
                  <option value="1095" style="color: #374151; background-color: white;">36个月</option>
                  <option value="9999" style="color: #374151; background-color: white;">长期</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">存放位置</label>
                <select v-model="formData.warehouseLocation" class="form-select">
                  <option value="">请选择存放位置</option>
                  <option 
                    v-for="location in baseData.warehouseLocations" 
                    :key="location.value || location" 
                    :value="location.value || location"
                  >
                    {{ location.label || location }}
                  </option>
                </select>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">备注说明</label>
              <textarea 
                v-model="formData.description" 
                placeholder="请输入备注说明" 
                rows="3"
                class="form-textarea"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- 质量检验 -->
        <div class="form-section">
          <div class="section-header">
            <h3 class="section-title">质量检验</h3>
          </div>
          <div class="section-content">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div class="form-group">
                <label class="form-label">检验状态</label>
                <select v-model="formData.qualityStatus" class="form-select" style="background-color: white; color: #374151;">
                  <option value="" style="color: #9ca3af; background-color: white;">请选择检验状态</option>
                  <option 
                    v-for="status in baseData.qualityStatuses" 
                    :key="status" 
                    :value="status"
                    style="color: #374151; background-color: white;"
                  >
                    {{ status }}
                  </option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">检验员</label>
                <input 
                  v-model="formData.inspector" 
                  type="text" 
                  placeholder="请输入检验员姓名" 
                  class="form-input"
                >
              </div>
              <div class="form-group">
                <label class="form-label">检验日期</label>
                <input 
                  v-model="formData.inspectionDate" 
                  type="date" 
                  class="form-input"
                >
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">检验备注</label>
              <textarea 
                v-model="formData.qualityRemarks" 
                placeholder="请输入检验相关备注" 
                rows="3"
                class="form-textarea"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- 物料图片 -->
        <div class="form-section">
          <div class="section-header">
            <h3 class="section-title">物料图片</h3>
          </div>
          <div class="section-content">
            <div class="upload-area" @click="triggerFileInput" @dragover.prevent @drop.prevent="handleFileDrop">
              <input 
                ref="fileInput" 
                type="file" 
                multiple 
                accept="image/*" 
                class="hidden" 
                @change="handleFileSelect"
              >
              <div class="upload-content">
                <i class="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-4"></i>
                <p class="text-gray-600 mb-2">点击上传或拖拽图片到此处</p>
                <p class="text-sm text-gray-500">支持 JPG、PNG 格式，单个文件不超过 5MB</p>
              </div>
            </div>
            
            <!-- 图片预览 -->
            <div v-if="formData.images.length > 0" class="image-preview-grid">
              <div 
                v-for="(image, index) in formData.images" 
                :key="index" 
                class="image-preview-item"
              >
                <img :src="image.url" :alt="image.name" class="preview-image">
                <button 
                  type="button" 
                  @click="removeImage(index)" 
                  class="remove-image-btn"
                >
                  <i class="fas fa-times"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 提交按钮 -->
        <div class="form-actions">
          <button type="button" @click="saveAsTemplate" class="btn btn-outline">
            保存为模板
          </button>
          <button type="button" @click="handleSubmit" class="btn btn-primary" :disabled="loading">
            <span v-if="loading">保存中...</span>
            <span v-else>确认入库</span>
          </button>
        </div>
      </form>
    </div>

    <!-- 模板名称输入弹窗 -->
    <div v-if="showTemplateNameModal" class="modal-overlay" @click="closeTemplateNameModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>保存为模板</h3>
          <button @click="closeTemplateNameModal" class="modal-close-btn">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label for="templateName">模板名称</label>
            <input 
              id="templateName"
              v-model="templateName" 
              type="text" 
              placeholder="请输入模板名称"
              class="form-control"
              @keyup.enter="confirmSaveTemplate"
            >
          </div>
        </div>
        <div class="modal-footer">
          <button @click="closeTemplateNameModal" class="btn btn-secondary">取消</button>
          <button @click="confirmSaveTemplate" class="btn btn-primary" :disabled="!templateName.trim()">保存</button>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import Layout from '@/components/layout/Layout.vue'
import { createInboundRecord } from '@/api/inbound'
import { 
  getMaterialTypeOptions, 
  getMaterialGradeOptions, 
  getWarehouseLocationOptions, 
  getSupplierOptions, 
  getQualityStatusOptions,
  saveInboundTemplate,
  getAllTemplateIds 
} from '@/mock/warehouse_data.js'
import { getAllTransactions } from '@/mock/database_flow.js'

const router = useRouter()
const fileInput = ref(null)

// 表单数据
const formData = reactive({
  materialName: '',
  materialType: '',
  quantity: 0,
  unit: 'kg',
  materialGrade: '',
  batchNumber: '',
  materialCode: '',
  unitPrice: 0,
  supplier: '',
  // 其他信息字段
  date: new Date().toISOString().split('T')[0],
  time: new Date().toTimeString().split(' ')[0],
  expiryDate: '',
  shelfLifeDays: '',
  warehouseLocation: '',
  description: '',
  // 质量检验字段
  qualityStatus: '',
  inspector: '',
  inspectionDate: '',
  qualityRemarks: '',
  images: [],
  type: 'inbound'
})

// 基础数据
const baseData = reactive({
  materialTypes: [],
  materialGrades: [],
  warehouseLocations: [],
  suppliers: [],
  qualityStatuses: []
})

// 加载状态
const loading = ref(false)

// 模板名称弹窗相关
const showTemplateNameModal = ref(false)
const templateName = ref('')

// 供应商评价
const showSupplierRating = ref(false)
const ratings = reactive({
  quality: 0,
  delivery: 0,
  price: 0,
  service: 0
})

// 物料搜索相关
const showSearchResults = ref(false)
const searchResults = ref([])
const searchKeyword = ref('')

// 计算属性
const amount = computed(() => {
  const qty = Number(formData.quantity) || 0
  const price = Number(formData.unitPrice) || 0
  return (qty * price).toFixed(2)
})

// 计算综合评分
const overallRating = computed(() => {
  const total = ratings.quality + ratings.delivery + ratings.price + ratings.service
  return total > 0 ? total / 4 : 0
})

// 生成编号
function generateMaterialCode() {
  if (!formData.materialName) return ''
  
  // 获取名称的前三个字符的首字母
  const nameChars = formData.materialName.replace(/\s+/g, '').substring(0, 3)
  let prefix = ''
  for (let char of nameChars) {
    // 如果是中文字符，取拼音首字母（简化处理，这里用固定映射）
    if (/[\u4e00-\u9fa5]/.test(char)) {
      const pinyinMap = {
        '乌': 'W', '龙': 'L', '茶': 'C', '绿': 'L', '红': 'H', '白': 'B', 
        '黄': 'H', '黑': 'HE', '青': 'Q', '花': 'H', '铁': 'T', '观': 'G',
        '音': 'Y', '大': 'D', '袍': 'P', '碧': 'B', '螺': 'L',
        '春': 'C', '毛': 'M', '尖': 'J', '银': 'Y', '针': 'Z', '寿': 'S',
        '眉': 'M', '贡': 'G', '安': 'A', '吉': 'J',
        '片': 'P', '六': 'L', '瓜': 'G', '太': 'T',
        '平': 'P', '猴': 'H', '魁': 'K', '信': 'X', '阳': 'Y',
        '庐': 'LU', '山': 'S', '云': 'Y', '雾': 'W', '竹': 'Z',
        '叶': 'Y', '都': 'D', '匀': 'Y'
      }
      prefix += pinyinMap[char] || char.toUpperCase()
    } else {
      prefix += char.toUpperCase()
    }
  }
  
  // 补足三位
  prefix = prefix.padEnd(3, 'X')
  
  // 生成日期时间部分
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hour = String(now.getHours()).padStart(2, '0')
  const minute = String(now.getMinutes()).padStart(2, '0')
  const second = String(now.getSeconds()).padStart(2, '0')
  
  return `M_${prefix}${year}${month}${day}${hour}${minute}${second}`
}

// 搜索物料
const searchMaterials = (keyword) => {
  if (!keyword || keyword.trim().length < 1) {
    searchResults.value = []
    showSearchResults.value = false
    return
  }
  
  const transactions = getAllTransactions()
  const materials = new Map()
  
  // 从交易记录中提取物料信息
  transactions.forEach(transaction => {
    if (transaction.type === 'INBOUND' && transaction.materialName && transaction.materialCode) {
      const key = `${transaction.materialName}_${transaction.materialCode}`
      if (!materials.has(key)) {
        materials.set(key, {
          materialName: transaction.materialName,
          materialCode: transaction.materialCode,
          materialType: transaction.materialType || '',
          materialGrade: transaction.materialGrade || '',
          batchNumber: transaction.batchNumber || '',
          unit: transaction.unit || 'kg',
          supplier: transaction.supplier || transaction.supplierName || ''
        })
      }
    }
  })
  
  // 搜索匹配
  const keyword_lower = keyword.toLowerCase()
  const results = Array.from(materials.values()).filter(material => {
    return material.materialName.toLowerCase().includes(keyword_lower) ||
           material.materialCode.toLowerCase().includes(keyword_lower)
  })
  
  searchResults.value = results.slice(0, 10) // 限制显示10条结果
  showSearchResults.value = results.length > 0
}

// 选择搜索结果
const selectMaterial = async (material) => {
  formData.materialName = material.materialName
  formData.materialCode = material.materialCode
  formData.materialType = material.materialType
  formData.materialGrade = material.materialGrade
  formData.batchNumber = material.batchNumber
  formData.unit = material.unit
  formData.supplier = material.supplier
  
  // 自动导入对应物料编码的图片
  await loadMaterialImages(material.materialCode)
  
  searchResults.value = []
  showSearchResults.value = false
  searchKeyword.value = material.materialName
}

// 加载物料图片
const loadMaterialImages = async (materialCode) => {
  if (!materialCode) return
  
  try {
    // 清空现有图片
    formData.images = []
    
    // 检查物料编码对应的文件夹是否存在
    const basePath = `/Inbound/${materialCode}`
    
    // 尝试加载图片文件（image0.png, image1.png, etc.）
    const imageExtensions = ['png', 'jpg', 'jpeg', 'gif', 'webp']
    let imageIndex = 0
    let consecutiveNotFound = 0 // 连续未找到图片的计数
    
    while (imageIndex < 20 && consecutiveNotFound < 3) { // 最多尝试20张图片，连续3次未找到则停止
      let imageFound = false
      
      // 尝试所有扩展名
      for (const ext of imageExtensions) {
        const imageName = `image${imageIndex}.${ext}`
        const imagePath = `${basePath}/${imageName}`
        
        try {
          // 直接尝试获取图片，不使用HEAD请求
          const response = await fetch(imagePath)
          if (response.ok && response.headers.get('content-type')?.startsWith('image/')) {
            const blob = await response.blob()
            const imageUrl = URL.createObjectURL(blob)
            
            formData.images.push({
              name: imageName,
              url: imageUrl,
              path: imagePath,
              fileName: imageName,
              materialCode: materialCode,
              isThumbnail: imageIndex === 0,
              isAutoLoaded: true // 标记为自动加载的图片
            })
            
            imageFound = true
            consecutiveNotFound = 0 // 重置连续未找到计数
            console.log(`自动加载图片: ${imagePath}`)
            break // 找到图片后跳出扩展名循环
          }
        } catch (error) {
          // 图片不存在或无法访问，继续尝试下一个扩展名
          continue
        }
      }
      
      if (!imageFound) {
        consecutiveNotFound++
        console.log(`未找到图片: image${imageIndex}.*，连续未找到次数: ${consecutiveNotFound}`)
      }
      
      imageIndex++
    }
    
    if (formData.images.length > 0) {
      console.log(`成功加载 ${formData.images.length} 张图片，物料编码: ${materialCode}`)
    } else {
      console.log(`物料编码 ${materialCode} 没有找到任何图片文件`)
    }
  } catch (error) {
    console.log(`物料编码 ${materialCode} 对应的图片文件夹不存在或无法访问:`, error)
  }
}

// 处理输入框失焦事件
const handleInputBlur = () => {
  setTimeout(() => {
    showSearchResults.value = false
  }, 200)
}

// 监听物料名称变化
const updateMaterialCode = () => {
  searchKeyword.value = formData.materialName
  
  // 如果是手动输入，进行搜索
  if (formData.materialName) {
    searchMaterials(formData.materialName)
  } else {
    searchResults.value = []
    showSearchResults.value = false
  }
  
  // 自动生成编号（仅在没有选择已有物料时）
  if (!searchResults.value.some(item => item.materialName === formData.materialName)) {
    formData.materialCode = generateMaterialCode()
  }
}

// 删除了重复的计算总金额函数，因为已经有computed属性处理

// 计算保质期日期
const calculateExpiryDate = () => {
  if (!formData.shelfLifeDays || formData.shelfLifeDays === '9999' || formData.shelfLifeDays === '') {
    formData.expiryDate = ''
    return
  }
  
  const shelfLifeDaysNum = parseInt(formData.shelfLifeDays)
  if (isNaN(shelfLifeDaysNum) || shelfLifeDaysNum <= 0) {
    formData.expiryDate = ''
    return
  }
  
  const today = new Date()
  const expiryDate = new Date(today)
  expiryDate.setDate(today.getDate() + shelfLifeDaysNum)
  
  formData.expiryDate = expiryDate.toISOString().split('T')[0]
}

// 设置评分
const setRating = (type, value) => {
  ratings[type] = value
}

// 选择模板
const selectTemplate = () => {
  try {
    // 获取所有模板ID
    const templateIds = getAllTemplateIds()
    console.log('所有模板ID:', templateIds)
    
    // 导航到模板选择页面
    router.push('/inbound-templates')
  } catch (error) {
    console.error('获取模板ID时出错:', error)
    alert('获取模板列表失败，请重试')
  }
}

// 触发文件选择
const triggerFileInput = () => {
  fileInput.value?.click()
}

// 处理文件选择
const handleFileSelect = (event) => {
  const files = Array.from(event.target.files)
  processFiles(files)
}

// 处理文件拖拽
const handleFileDrop = (event) => {
  const files = Array.from(event.dataTransfer.files)
  processFiles(files)
}

// 处理文件
const processFiles = (files) => {
  files.forEach(file => {
    if (file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024) {
      const reader = new FileReader()
      reader.onload = (e) => {
        // 使用物料编码作为文件夹名称，如果没有物料编码则使用默认值
        const materialCode = formData.materialCode || 'default'
        
        // 计算当前图片索引
        const currentIndex = formData.images.length
        
        // 第一张图片作为缩略图，命名为image0，其他图片从image1开始
        let fileName
        if (currentIndex === 0) {
          fileName = 'image0.png' // 缩略图统一为PNG格式
        } else {
          fileName = `image${currentIndex}.png` // 其他图片也转换为PNG格式
        }
        
        const imagePath = `/public/Inbound/${materialCode}/${fileName}`
        
        formData.images.push({
          name: file.name,
          url: e.target.result,
          file: file,
          path: imagePath,
          fileName: fileName,
          materialCode: materialCode,
          isThumbnail: currentIndex === 0 // 标记是否为缩略图
        })
      }
      reader.readAsDataURL(file)
    }
  })
}

// 移除图片
const removeImage = (index) => {
  formData.images.splice(index, 1)
}

// 保存为模板
const saveAsTemplate = () => {
  // 验证必填字段
  if (!formData.materialName || !formData.materialType) {
    alert('请填写物料名称和类型')
    return
  }
  
  // 设置默认模板名称
  templateName.value = `${formData.materialName}入库模板`
  showTemplateNameModal.value = true
}

// 关闭模板名称弹窗
const closeTemplateNameModal = () => {
  showTemplateNameModal.value = false
  templateName.value = ''
}

// 确认保存模板
const confirmSaveTemplate = async () => {
  try {
    if (!templateName.value.trim()) {
      alert('请输入模板名称')
      return
    }
    
    // 准备模板数据
    const templateData = {
      inboundTempname: templateName.value.trim(),
      materialName: formData.materialName,
      materialType: formData.materialType,
      materialGrade: formData.materialGrade,
      unit: formData.unit,
      quantity: formData.quantity,
      batchNumber: formData.batchNumber,
      materialCode: formData.materialCode,
      unitPrice: formData.unitPrice,
      supplier: formData.supplier,
      date: formData.date,
      time: formData.time,
      expiryDate: formData.expiryDate,
      shelfLifeDays: formData.shelfLifeDays,
      warehouseLocation: formData.warehouseLocation,
      description: formData.description,
      qualityStatus: formData.qualityStatus,
      inspector: formData.inspector,
      inspectionDate: formData.inspectionDate,
      qualityRemarks: formData.qualityRemarks,
      images: formData.images,
      type: formData.type
    }
    
    // 保存模板
    const result = saveInboundTemplate(templateData)
    
    if (result.success) {
      alert(`模板保存成功！模板ID: ${result.templateId}`)
      console.log('保存的模板:', result.template)
      closeTemplateNameModal()
    } else {
      alert('模板保存失败')
    }
  } catch (error) {
    console.error('保存模板时出错:', error)
    alert('保存模板时出错，请重试')
  }
}

// 加载基础数据
const loadBaseData = async () => {
  try {
    // 使用warehouse_data.js中的统一数据源
    baseData.materialTypes = getMaterialTypeOptions()
    baseData.materialGrades = getMaterialGradeOptions()
    baseData.warehouseLocations = getWarehouseLocationOptions()
    baseData.suppliers = getSupplierOptions()
    baseData.qualityStatuses = getQualityStatusOptions()
    
    console.log('基础数据加载完成')
  } catch (error) {
    console.error('加载基础数据失败:', error)
    // 即使API失败，也要确保基础选项可用
    baseData.materialTypes = getMaterialTypeOptions()
    baseData.materialGrades = getMaterialGradeOptions()
    baseData.warehouseLocations = getWarehouseLocationOptions()
    baseData.suppliers = getSupplierOptions()
    baseData.qualityStatuses = getQualityStatusOptions()
  }
}

// 处理表单提交
const handleSubmit = async () => {
  // 表单验证
  if (!formData.materialName) {
    alert('请输入物料名称')
    return
  }
  if (!formData.materialType) {
    alert('请选择物料类型')
    return
  }
  if (!formData.quantity || formData.quantity <= 0) {
    alert('请输入有效的入库数量')
    return
  }
  if (!formData.unitPrice || formData.unitPrice <= 0) {
    alert('请输入有效的单价')
    return
  }
  
  loading.value = true
  
  try {
    // 保存图片到本地路径
    const savedImages = await saveImagesToLocal()
    
    // 准备提交数据，包含图片路径信息
    const submitData = {
      ...formData,
      images: savedImages
    }
    
    const response = await createInboundRecord(submitData)
    
    if (response.error === 0) {
      alert('入库记录创建成功')
      router.push('/inbound-records')
    } else {
      alert(response.message || '创建入库记录失败')
    }
  } catch (error) {
    console.error('创建入库记录失败:', error)
    alert('创建入库记录失败')
  } finally {
    loading.value = false
  }
}

// 保存图片到本地路径
const saveImagesToLocal = async () => {
  const savedImages = []
  
  for (const image of formData.images) {
    try {
      const materialCode = image.materialCode || formData.materialCode || 'default'
      const savedImage = {
        name: image.name,
        path: image.path,
        fileName: image.fileName,
        materialCode: materialCode,
        url: image.url, // 保留预览URL
        isThumbnail: image.isThumbnail || false // 保留缩略图标记
      }
      savedImages.push(savedImage)
      
      console.log(`图片已保存到: ${image.path} (物料编码: ${materialCode}) ${image.isThumbnail ? '[缩略图]' : ''}`)
    } catch (error) {
      console.error('保存图片失败:', error)
    }
  }
  
  return savedImages
}

// 删除了loadMaterialImages函数，因为它包含无效的模拟数据且不符合实际需求

// 处理保存操作
const handleSave = async () => {
  await handleSubmit()
}

// 处理取消操作
const handleCancel = () => {
  if (confirm('确定要取消吗？未保存的数据将丢失。')) {
    router.push('/inbound-records')
  }
}

// 刷新基础数据的方法
const refreshBaseData = () => {
  loadBaseData()
}

// 生命周期
onMounted(() => {
  // 加载基础数据
  loadBaseData()
  
  // 处理模板数据
  const route = router.currentRoute.value
  if (route.query.templateData) {
    try {
      const templateData = JSON.parse(route.query.templateData)
      
      // 填充表单数据
      Object.keys(templateData).forEach(key => {
        if (formData.hasOwnProperty(key)) {
    if (key === 'supplier' && templateData[key]) {
            // 查找对应的供应商ID
            const supplierOption = baseData.suppliers.find(supplier => 
              supplier.label === templateData[key] || supplier.value === templateData[key]
            )
            formData[key] = supplierOption ? supplierOption.value : templateData[key]
          } else {
            formData[key] = templateData[key]
          }
        }
      })
      
      // 如果有供应商数据，显示供应商评价
      if (templateData.supplier) {
        showSupplierRating.value = true
      }
      
      // 如果有保质期时长数据，自动计算保质期日期
      if (templateData.shelfLifeDays) {
        calculateExpiryDate()
      }
      
console.log('模板数据已加载')
    } catch (error) {
      console.error('解析模板数据失败:', error)
    }
  }
  
  // 监听数据更新事件
  window.addEventListener('warehouse-data-updated', refreshBaseData)
  
  console.log('入库表单页面已加载')
})

// 组件卸载时移除事件监听器
onUnmounted(() => {
  window.removeEventListener('warehouse-data-updated', refreshBaseData)
})
</script>

<style scoped>
.inbound-form-page {
  padding: 24px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e5e7eb;
}

.header-left h1 {
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 4px 0;
}

.header-left p {
  color: #6b7280;
  margin: 0;
}

.header-right {
  display: flex;
  gap: 12px;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.2);
}

.btn-primary:hover {
  background-color: #2563eb;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3);
}

.btn-secondary {
  background-color: white;
  color: #374151;
  border: 1px solid #d1d5db;
}

.btn-secondary:hover {
  background-color: #f9fafb;
  border-color: #9ca3af;
  transform: translateY(-1px);
}

.quick-actions {
  margin-bottom: 24px;
}

.action-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}

.action-card {
  display: flex;
  align-items: center;
  padding: 16px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-card:hover {
  border-color: #10b981;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.15);
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
}

.card-icon.voice {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
}

.card-icon.ocr {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  color: white;
}

.card-icon.template {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
}

.card-content h3 {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 4px 0;
}

.card-content p {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

.form-container {
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  padding: 24px;
}

/* 表单样式 */
.space-y-6 > * + * {
  margin-top: 1.5rem;
}

.form-section {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;
  overflow: hidden;
}

.section-header {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding: 16px 24px;
  border-bottom: 1px solid #e5e7eb;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.section-content {
  padding: 24px;
}

.grid {
  display: grid;
}

.grid-cols-1 {
  grid-template-columns: repeat(1, minmax(0, 1fr));
}

@media (min-width: 1024px) {
  .lg\:grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .lg\:grid-cols-3 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

.gap-6 {
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 8px;
}

.form-label.required::after {
  content: ' *';
  color: #ef4444;
}

.form-input, .form-select, .form-textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s ease;
}

.form-input:focus, .form-select:focus, .form-textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

.form-input.bg-gray-50 {
  background-color: #f9fafb;
}

.form-input.text-gray-500 {
  color: #6b7280;
}

.relative {
  position: relative;
}

/* 位置和变换工具类 */
.absolute {
  position: absolute;
}

.right-3 {
  right: 0.75rem;
}

.left-3 {
  left: 0.75rem;
}

.top-1\/2 {
  top: 50%;
}

.top-3 {
  top: 0.75rem;
}

.transform.-translate-y-1\/2 {
  transform: translateY(-50%);
}

/* 文本颜色工具类 */
.text-gray-400 { color: #9ca3af; }
.text-gray-500 { color: #6b7280; }
.text-gray-600 { color: #4b5563; }
.text-gray-700 { color: #374151; }
.text-gray-800 { color: #1f2937; }
.hover\:text-gray-600:hover { color: #4b5563; }

.pl-8 {
  padding-left: 2rem;
}

.pr-10 {
  padding-right: 2.5rem;
}

.template-btn {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 12px 24px;
  background: #dbeafe;
  border: 1px solid #bfdbfe;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #1d4ed8;
  cursor: pointer;
  transition: all 0.2s ease;
}

.template-btn:hover {
  background: #bfdbfe;
  border-color: #3b82f6;
}

.tea-type-card {
  padding: 20px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.tea-type-card:hover {
  border-color: #3b82f6;
  background: #eff6ff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
}

.tea-type-card.active {
  border-color: #3b82f6;
  background: #dbeafe;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
}

/* 布局工具类 */
.flex { display: flex; }
.items-center { align-items: center; }
.space-x-4 > * + * { margin-left: 1rem; }
.space-y-4 > * + * { margin-top: 1rem; }
.space-y-6 > * + * { margin-top: 1.5rem; }

/* 供应商评价样式 */
.supplier-rating {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 20px;
}

.rating-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.rating-label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  min-width: 100px;
}

.rating-stars {
  display: flex;
  align-items: center;
  gap: 6px;
}

.star {
  font-size: 20px;
  color: #d1d5db;
  cursor: pointer;
  transition: all 0.2s ease;
}

.star.active {
  color: #fbbf24;
}

.star:hover {
  color: #f59e0b;
  transform: scale(1.1);
}

/* 搜索结果下拉列表样式 */
.search-results-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 50;
  max-height: 240px;
  overflow-y: auto;
  margin-top: 2px;
}

.search-result-item {
  padding: 12px 16px;
  cursor: pointer;
  border-bottom: 1px solid #f3f4f6;
  transition: background-color 0.2s ease;
}

.search-result-item:last-child {
  border-bottom: none;
}

.search-result-item:hover {
  background-color: #f8fafc;
}

.material-info {
  width: 100%;
}

.material-name {
  font-weight: 500;
  color: #1f2937;
  margin-bottom: 4px;
  font-size: 14px;
}

.material-details {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  font-size: 12px;
  color: #6b7280;
}

.material-code,
.material-type,
.material-supplier {
  background: #f3f4f6;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 11px;
}

.material-code {
  background: #dbeafe;
  color: #1d4ed8;
}

.material-type {
  background: #d1fae5;
  color: #065f46;
}

.material-supplier {
  background: #e9d5ff;
  color: #7c2d12;
}

.rating-text {
  font-size: 14px;
  color: #6b7280;
  margin-left: 8px;
  font-weight: 500;
}

/* 颜色工具类 */
.text-yellow-400 { color: #fbbf24; }
.text-gray-300 { color: #d1d5db; }

.overall-rating {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-top: 12px;
  border-top: 1px solid #e2e8f0;
  margin-top: 12px;
}

/* 文本和间距工具类 */
.text-sm { font-size: 0.875rem; }
.text-md { font-size: 1rem; }
.text-lg { font-size: 1.125rem; }
.font-medium { font-weight: 500; }
.font-bold { font-weight: 700; }
.text-green-600 { color: #059669; }
.mb-2 { margin-bottom: 0.5rem; }
.mb-4 { margin-bottom: 1rem; }

/* 文件上传样式 */
.upload-area {
  border: 2px dashed #d1d5db;
  border-radius: 12px;
  padding: 48px;
  text-align: center;
  background: #fafbfc;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.upload-area:hover {
  border-color: #3b82f6;
  background: #eff6ff;
  transform: translateY(-2px);
}

.upload-area.dragover {
  border-color: #3b82f6;
  background: #dbeafe;
  border-style: solid;
}

.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 其他工具类 */
.text-4xl { font-size: 2.25rem; }
.hidden { display: none; }
.cursor-pointer { cursor: pointer; }

.image-preview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 16px;
  margin-top: 20px;
}

.image-preview-item {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
}

.preview-image {
  width: 100%;
  height: 120px;
  object-fit: cover;
}

.remove-image-btn {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 24px;
  height: 24px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}

.remove-image-btn:hover {
  background: rgba(0, 0, 0, 0.8);
}

/* 表单操作按钮 */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 24px;
  background: #f9fafb;
  border-top: 1px solid #e5e7eb;
  margin: 0 -24px -24px -24px;
  border-radius: 0 0 12px 12px;
}

/* 模态框样式 */
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
  border-radius: 8px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.modal-close-btn {
  background: none;
  border: none;
  font-size: 18px;
  color: #6b7280;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
}

.modal-close-btn:hover {
  background: #f3f4f6;
  color: #374151;
}

.modal-body {
  padding: 20px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px;
  border-top: 1px solid #e5e7eb;
}
</style>