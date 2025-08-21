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
            保存记录
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
                    class="form-input pr-10"
                    required
                    @input="updateMaterialCode"
                  >
                  <i class="fas fa-search absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 pointer-events-none"></i>
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
                  <option value="kg">kg</option>
                  <option value="g">g</option>
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
                <label class="form-label">编号</label>
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
  </Layout>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import Layout from '@/components/layout/Layout.vue'
import { createInboundRecord, getInboundBaseData } from '@/api/inbound'
import { 
  getMaterialTypeOptions, 
  getMaterialGradeOptions, 
  getWarehouseLocationOptions, 
  getSupplierOptions,
  getQualityStatusOptions 
} from '@/mock/warehouse_data'

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
  operator: '系统用户',
  type: 'inbound'
})

// 基础数据
const baseData = reactive({
  materialTypes: [],
  materialGrades: [],
  warehouseLocations: [],
  suppliers: [],
  materials: [],
  qualityStatuses: [],
  recordStatuses: []
})

// 加载状态
const loading = ref(false)

// 供应商评价
const showSupplierRating = ref(false)
const ratings = reactive({
  quality: 0,
  delivery: 0,
  price: 0,
  service: 0
})

// 计算总金额
const amount = computed(() => {
  return (formData.quantity * formData.unitPrice).toFixed(2)
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
        '黄': 'H', '黑': 'H', '青': 'Q', '花': 'H', '铁': 'T', '观': 'G',
        '音': 'Y', '大': 'D', '红': 'H', '袍': 'P', '碧': 'B', '螺': 'L',
        '春': 'C', '毛': 'M', '尖': 'J', '银': 'Y', '针': 'Z', '寿': 'S',
        '眉': 'M', '贡': 'G', '眉': 'M', '安': 'A', '吉': 'J', '白': 'B',
        '片': 'P', '六': 'L', '安': 'A', '瓜': 'G', '片': 'P', '太': 'T',
        '平': 'P', '猴': 'H', '魁': 'K', '信': 'X', '阳': 'Y', '毛': 'M',
        '尖': 'J', '庐': 'L', '山': 'S', '云': 'Y', '雾': 'W', '竹': 'Z',
        '叶': 'Y', '青': 'Q', '都': 'D', '匀': 'Y', '毛': 'M', '尖': 'J'
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
  
  return `${prefix}${year}${month}${day}${hour}${minute}${second}`
}

// 监听物料名称变化，自动生成编号
const updateMaterialCode = () => {
  formData.materialCode = generateMaterialCode()
}

// 计算总金额
const calculateTotal = () => {
  // 总金额通过computed自动计算
}

// 计算保质期日期
const calculateExpiryDate = () => {
  if (!formData.shelfLifeDays || formData.shelfLifeDays === '9999') {
    formData.expiryDate = ''
    return
  }
  
  const today = new Date()
  const expiryDate = new Date(today)
  expiryDate.setDate(today.getDate() + parseInt(formData.shelfLifeDays))
  
  formData.expiryDate = expiryDate.toISOString().split('T')[0]
}

// 设置评分
const setRating = (type, value) => {
  ratings[type] = value
}

// 选择模板
const selectTemplate = () => {
  console.log('选择物料模板')
  // 这里可以打开模板选择弹窗
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
        // 生成唯一文件名
        const timestamp = Date.now()
        const randomStr = Math.random().toString(36).substring(2, 8)
        const fileExtension = file.name.split('.').pop()
        const newFileName = `material_${timestamp}_${randomStr}.${fileExtension}`
        const imagePath = `/src/assets/images/${newFileName}`
        
        formData.images.push({
          name: file.name,
          url: e.target.result,
          file: file,
          path: imagePath,
          fileName: newFileName
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
  console.log('保存为模板', formData)
  // 这里可以保存当前表单数据为模板
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
    
    // 其他数据仍从API获取
    const response = await getInboundBaseData()
    if (response.error === 0) {
      baseData.materials = response.body.materials || []
      baseData.recordStatuses = response.body.recordStatuses || []
    } else {
      console.error('加载基础数据失败:', response.message)
    }
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
      // 这里模拟保存图片到本地路径的过程
      // 在实际应用中，可能需要调用文件系统API或上传到服务器
      const savedImage = {
        name: image.name,
        path: image.path,
        fileName: image.fileName,
        url: image.url // 保留预览URL
      }
      savedImages.push(savedImage)
      
      console.log(`图片已保存到: ${image.path}`)
    } catch (error) {
      console.error('保存图片失败:', error)
    }
  }
  
  return savedImages
}

// 处理保存操作
const handleSave = async () => {
  await handleSubmit()
}

// 处理取消操作
const handleCancel = () => {
  if (confirm('确定要取消吗？未保存的数据将丢失。')) {
    router.push('/warehouse/inbound-records')
  }
}

// 刷新基础数据的方法
const refreshBaseData = () => {
  loadBaseData()
  console.log('基础数据已刷新')
}

// 生命周期
onMounted(() => {
  // 加载基础数据
  loadBaseData()
  
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

.lg\:grid-cols-2 {
  grid-template-columns: repeat(1, minmax(0, 1fr));
}

.lg\:grid-cols-3 {
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

.transform {
  transform: var(--tw-transform);
}

.-translate-y-1\/2 {
  --tw-translate-y: -50%;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.text-gray-400 {
  color: #9ca3af;
}

.text-gray-500 {
  color: #6b7280;
}

.text-gray-600 {
  color: #4b5563;
}

.text-gray-700 {
  color: #374151;
}

.text-gray-800 {
  color: #1f2937;
}

.hover\:text-gray-600:hover {
  color: #4b5563;
}

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

.flex {
  display: flex;
}

.items-center {
  align-items: center;
}

.space-x-4 > * + * {
  margin-left: 1rem;
}

.space-y-4 > * + * {
  margin-top: 1rem;
}

.space-y-6 > * + * {
  margin-top: 1.5rem;
}

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

.rating-text {
  font-size: 14px;
  color: #6b7280;
  margin-left: 8px;
  font-weight: 500;
}

.text-yellow-400 {
  color: #fbbf24;
}

.text-gray-300 {
  color: #d1d5db;
}

.cursor-pointer {
  cursor: pointer;
}

.overall-rating {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-top: 12px;
  border-top: 1px solid #e2e8f0;
  margin-top: 12px;
}

.text-sm {
  font-size: 0.875rem;
}

.text-md {
  font-size: 1rem;
}

.text-lg {
  font-size: 1.125rem;
}

.font-medium {
  font-weight: 500;
}

.font-bold {
  font-weight: 700;
}

.text-green-600 {
  color: #059669;
}

.mb-2 {
  margin-bottom: 0.5rem;
}

.mb-4 {
  margin-bottom: 1rem;
}

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

.text-4xl {
  font-size: 2.25rem;
}

.hidden {
  display: none;
}

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

.btn-outline {
  background: white;
  color: #374151;
  border: 1px solid #d1d5db;
}

.btn-outline:hover {
  background: #f9fafb;
  border-color: #10b981;
}

/* 快捷数量按钮样式 */
.quick-amount {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: white;
  color: #374151;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 80px;
}

.quick-amount:hover {
  border-color: #3b82f6;
  background: #eff6ff;
  color: #1d4ed8;
  transform: translateY(-1px);
}

.quick-amount.active {
  border-color: #3b82f6;
  background: #3b82f6;
  color: white;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
}

/* 图标样式 */
.icon-arrow-left::before { content: '←'; }
.icon-save::before { content: '💾'; }
.icon-mic::before { content: '🎤'; }
.icon-camera::before { content: '📷'; }
.icon-zap::before { content: '⚡'; }
</style>