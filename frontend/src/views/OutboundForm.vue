<template>
  <Layout>
    <div class="Outbound-form-page">
      <!-- 页面头部 -->
      <div class="page-header">
        <div class="header-left">
          <h1 class="page-title">出库记录</h1>
          <p class="page-subtitle">添加新的茶叶出库记录</p>
        </div>
        <div class="header-right">
          <button class="btn btn-secondary" @click="$router.push('/outbound-records')">
            <i class="icon-arrow-left"></i>
            返回列表
          </button>
          <button class="btn btn-primary" @click="handleSave">
            <i class="icon-save"></i>
            确定出库
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
                <span>选择产品模板</span>
              </button>
            </div>
          </div>
        </div>

        <!-- 产品信息 -->
        <div class="form-section">
          <div class="section-header">
            <h3 class="section-title">产品信息</h3>
          </div>
          <div class="section-content">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div class="form-group">
                <label class="form-label required">产品名称</label>
                <div class="relative">
                  <input 
                    v-model="formData.productName" 
                    type="text" 
                    placeholder="请输入编码或名称" 
                    class="form-input"
                    required
                    @input="updateproductCode"
                    @focus="formData.productName && searchproducts(formData.productName)"
                    @blur="handleInputBlur"
                  >
                  
                  
                  <!-- 搜索结果下拉列表 -->
                  <div v-if="showSearchResults && searchResults.length > 0" class="search-results-dropdown">
                    <div 
                      v-for="(product, index) in searchResults" 
                      :key="index"
                      class="search-result-item"
                      @click="selectproduct(product)"
                    >
                      <div class="product-info">
                        <div class="product-name">{{ product.productName }}</div>
                        <div class="product-details">
                          <span class="product-code">编号: {{ product.productCode }}</span>
                          <span v-if="product.productType" class="product-type">类型: {{ product.productType }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="form-group">
                <label class="form-label">产品编码</label>
                <input 
                  v-model="formData.productCode" 
                  type="text" 
                  placeholder="产品编码" 
                  class="form-input bg-gray-50" 
                  readonly
                >
              </div>
              
              <!-- 产品图片预览 -->
              <div class="form-group col-span-full" v-if="formData.productCode">
                <label class="form-label">产品图片预览</label>
                <div class="image-preview-section">
                  <div v-if="productImages.length > 0" class="image-thumbnails">
                    <div 
                      v-for="(image, index) in productImages" 
                      :key="index"
                      class="product-thumbnail"
                      @click="openImagePreview(productImages, index, formData.productName || '产品图片')"
                    >
                      <img :src="image" :alt="formData.productName" class="thumbnail-image">
                    </div>
                  </div>
                  <div v-else class="no-images-placeholder">
                    <i class="fas fa-image"></i>
                    <span>暂无产品图片</span>
                  </div>
                </div>
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
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div class="form-group">
                <label class="form-label required">销售数量</label>
                <input 
                  v-model.number="formData.quantity" 
                  type="number" 
                  placeholder="请输入数量" 
                  min="1"
                  class="form-input"
                  required
                  @input="calculateTotal"
                >
              </div>
              <div class="form-group">
                <label class="form-label required">销售单价</label>
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
                <label class="form-label">销售总价</label>
                <div class="relative">
                  <span class="absolute left-3 top-3 text-gray-500">¥</span>
                  <input 
                    :value="formData.totalPrice" 
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

        <!-- 客户信息 -->
        <div class="form-section">
          <div class="section-header">
            <h3 class="section-title">客户信息</h3>
          </div>
          <div class="section-content">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div class="form-group">
                <label class="form-label required">客户</label>
                <select v-model="formData.customerId" class="form-select" @change="updateCustomerInfo">
                  <option value="">请选择客户</option>
                  <option 
                    v-for="customer in baseData.customers" 
                    :key="customer.value" 
                    :value="customer.value"
                  >
                    {{ customer.label }}
                  </option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">客户折扣率</label>
                <div class="relative">
                  <input 
                    v-model.number="formData.customerDiscountRate" 
                    type="number" 
                    placeholder="0.00" 
                    step="0.01"
                    min="0"
                    max="1"
                    class="form-input pr-8"
                    @input="calculateTotal"
                  >
                  <span class="absolute right-3 top-3 text-gray-500">%</span>
                </div>
              </div>
            </div>
            <div v-if="formData.customerId" class="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
              <div class="form-group">
                <label class="form-label">客户姓名</label>
                <input 
                  v-model="formData.customerName" 
                  type="text" 
                  class="form-input bg-gray-50" 
                  readonly
                >
              </div>
              <div class="form-group">
                <label class="form-label">联系电话</label>
                <input 
                  v-model="formData.customerPhone" 
                  type="text" 
                  class="form-input bg-gray-50" 
                  readonly
                >
              </div>
              <div class="form-group">
                <label class="form-label">客户地址</label>
                <input 
                  v-model="formData.customerAddress" 
                  type="text" 
                  class="form-input bg-gray-50" 
                  readonly
                >
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
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div class="form-group">
                <label class="form-label">销售渠道</label>
                <select v-model="formData.channel" class="form-select">
                  <option value="">请选择销售渠道</option>
                  <option v-for="channel in baseData.channels" :key="channel.value" :value="channel.label">
                    {{ channel.label }}
                  </option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">订单标签</label>
                <div class="tags-input-container">
                  <div class="tags-display">
                    <span 
                      v-for="(tag, index) in formData.tags" 
                      :key="index" 
                      class="tag-item"
                    >
                      {{ tag }}
                      <button 
                        type="button" 
                        @click="removeTag(index)" 
                        class="tag-remove"
                      >
                        ×
                      </button>
                    </span>
                  </div>
                  <input 
                    v-model="newTag" 
                    type="text" 
                    placeholder="输入标签后按回车添加" 
                    class="tag-input"
                    @keyup.enter="addTag"
                  >
                </div>
                <div class="tag-suggestions">
                  <button 
                    v-for="suggestion in tagSuggestions" 
                    :key="suggestion" 
                    type="button" 
                    @click="addSuggestedTag(suggestion)" 
                    class="tag-suggestion"
                  >
                    {{ suggestion }}
                  </button>
                </div>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">备注说明</label>
              <textarea 
                v-model="formData.notes" 
                placeholder="请输入备注信息" 
                rows="3"
                class="form-textarea"
              ></textarea>
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
            <span v-else>确认出库</span>
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

    <!-- 图片预览模态框 -->
    <div v-if="showImagePreview" class="image-preview-modal" @click="closeImagePreview">
      <div class="image-preview-content" @click.stop>
        <button class="image-close-btn" @click="closeImagePreview">
          <i class="fas fa-times"></i>
        </button>
        
        <!-- 左右切换按钮 -->
        <button 
          v-if="previewImages.length > 1" 
          class="image-nav-btn prev" 
          @click="prevImage"
          :disabled="currentImageIndex === 0"
        >
          <i class="fas fa-chevron-left"></i>
        </button>
        
        <button 
          v-if="previewImages.length > 1" 
          class="image-nav-btn next" 
          @click="nextImage"
          :disabled="currentImageIndex === previewImages.length - 1"
        >
          <i class="fas fa-chevron-right"></i>
        </button>
        
        <!-- 图片显示区域 -->
        <div class="image-display">
          <img 
            v-if="previewImages[currentImageIndex]" 
            :src="previewImages[currentImageIndex]" 
            :alt="currentProductName" 
            class="preview-image"
          >
        </div>
        
        <!-- 图片信息 -->
        <div class="image-info">
          <div class="image-title">{{ currentProductName }}</div>
          <div class="image-counter" v-if="previewImages.length > 1">
            {{ currentImageIndex + 1 }} / {{ previewImages.length }}
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import Layout from '@/components/layout/Layout.vue'
import { 
  getMaterialTypeOptions, 
  getMaterialGradeOptions, 
  getWarehouseLocationOptions, 
  getQualityStatusOptions,
  getAllTemplateIds 
} from '@/mock/warehouse_data.js'
import { getCustomerOptions } from '@/mock/data/customers_data.js'
import { getSalesChannelOptions, saveOutboundTemplate, createOutboundRecord } from '@/mock/outbound_data.js'
import { getAllTransactions } from '@/mock/database_flow.js'

const router = useRouter()

// 表单数据
const formData = reactive({
  // 产品信息
  productName: '',
  productCode: '',
  quantity: 0,
  unit: 'kg',
  unitPrice: 0,
  totalPrice: 0,
  
  // 客户信息
  customerId: '',
  customerName: '',
  customerPhone: '',
  customerAddress: '',
  customerDiscountRate: 0,
  
  // 销售渠道和标签
  channel: '',
  tags: [],
  
  // 其他信息
  notes: '',
  date: new Date().toISOString().split('T')[0],
  time: new Date().toTimeString().split(' ')[0],
  images: [],
  type: 'Outbound'
})

// 基础数据
const baseData = reactive({
  productTypes: [],
  productGrades: [],
  warehouseLocations: [],
  customers: [],
  qualityStatuses: [],
  channels: []
})

// 加载状态
const loading = ref(false)

// 模板名称弹窗相关
const showTemplateNameModal = ref(false)
const templateName = ref('')

// 客户评价
const showcustomerRating = ref(false)
const ratings = reactive({
  quality: 0,
  delivery: 0,
  price: 0,
  service: 0
})

// 产品搜索相关
const showSearchResults = ref(false)
const searchResults = ref([])
const searchKeyword = ref('')

// 标签管理
const newTag = ref('')
const tagSuggestions = ref(['急单', '优质客户', '批发', '零售', '促销', '新客户', '老客户', '重要订单'])

// 图片预览相关数据
const showImagePreview = ref(false)
const previewImages = ref([])
const currentImageIndex = ref(0)
const currentProductName = ref('')
const productImages = ref([])

// 产品图片缓存
const productImagesCache = ref({})

// 计算属性
const amount = computed(() => {
  const qty = Number(formData.quantity) || 0
  const price = Number(formData.unitPrice) || 0
  return (qty * price).toFixed(2)
})


// 搜索产品
const searchproducts = (keyword) => {
  if (!keyword || keyword.trim().length < 1) {
    searchResults.value = []
    showSearchResults.value = false
    return
  }
  
  const transactions = getAllTransactions()
  const products = new Map()
  
  console.log('所有交易记录数量:', transactions.length)
  console.log('OUTBOUND交易记录:', transactions.filter(t => t.type === 'OUTBOUND'))
  
  // 从交易记录中提取产品信息
  transactions.forEach(transaction => {
    if (transaction.type === 'OUTBOUND' && transaction.productName && transaction.productCode) {
      const key = `${transaction.productName}_${transaction.productCode}`
      if (!products.has(key)) {
        products.set(key, {
          productName: transaction.productName,
          productCode: transaction.productCode,
          productType: transaction.productType || '',
          productGrade: transaction.productGrade || '',
          unit: transaction.unit || 'kg',
          customer: transaction.customer || transaction.customerName || ''
        })
        console.log('添加产品到搜索列表:', transaction.productName, transaction.productCode)
      }
    }
  })
  
  console.log('搜索关键词:', keyword, '找到产品数量:', Array.from(products.values()).length)
  console.log('所有可搜索产品:', Array.from(products.values()))
  
  // 搜索匹配
  const keyword_lower = keyword.toLowerCase()
  const results = Array.from(products.values()).filter(product => {
    const nameMatch = product.productName.toLowerCase().includes(keyword_lower)
    const codeMatch = product.productCode.toLowerCase().includes(keyword_lower)
    console.log(`检查产品 ${product.productName} (${product.productCode}): 名称匹配=${nameMatch}, 编码匹配=${codeMatch}`)
    return nameMatch || codeMatch
  })
  
  console.log('搜索结果:', results)
  searchResults.value = results.slice(0, 10) // 限制显示10条结果
  showSearchResults.value = results.length > 0
}

// 选择搜索结果
const selectproduct = async (product) => {
  formData.productName = product.productName
  formData.productCode = product.productCode
  formData.productType = product.productType
  formData.productGrade = product.productGrade
  formData.unit = product.unit
  formData.customer = product.customer
  
  // 自动导入对应产品编码的图片
  await loadproductImages(product.productCode)
  
  // 加载产品图片用于预览
  const images = await getProductImages(product.productCode)
  productImages.value = images
  console.log('选择产品后加载图片:', product.productCode, '共', images.length, '张')
  
  searchResults.value = []
  showSearchResults.value = false
  searchKeyword.value = product.productName
}

// 加载产品图片
const loadproductImages = async (productCode) => {
  if (!productCode) return
  
  try {
    // 清空现有图片
    formData.images = []
    
    // 检查产品编码对应的文件夹是否存在
    const basePath = `/Outbound/${productCode}`
    
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
              productCode: productCode,
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
      console.log(`成功加载 ${formData.images.length} 张图片，产品编码: ${productCode}`)
    } else {
      console.log(`产品编码 ${productCode} 没有找到任何图片文件`)
    }
  } catch (error) {
    console.log(`产品编码 ${productCode} 对应的图片文件夹不存在或无法访问:`, error)
  }
}

// 处理输入框失焦事件
const handleInputBlur = () => {
  setTimeout(() => {
    showSearchResults.value = false
  }, 200)
}

// 监听产品名称变化
const updateproductCode = () => {
  searchKeyword.value = formData.productName
  
  // 如果是手动输入，进行搜索
  if (formData.productName) {
    searchproducts(formData.productName)
  } else {
    searchResults.value = []
    showSearchResults.value = false
  }
}

// 计算总价
const calculateTotal = () => {
  const quantity = Number(formData.quantity) || 0
  const unitPrice = Number(formData.unitPrice) || 0
  const discountRate = Number(formData.customerDiscountRate) || 0
  
  const subtotal = quantity * unitPrice
  const discount = subtotal * discountRate
  formData.totalPrice = (subtotal - discount).toFixed(2)
}

// 更新客户信息
const updateCustomerInfo = () => {
  if (formData.customerId) {
    const customer = baseData.customers.find(c => c.value === formData.customerId)
    if (customer) {
      formData.customerName = customer.label || ''
      formData.customerPhone = customer.phone || ''
      formData.customerAddress = customer.address || ''
      formData.customerDiscountRate = customer.discountRate || 0
      calculateTotal()
    }
  } else {
    formData.customerName = ''
    formData.customerPhone = ''
    formData.customerAddress = ''
    formData.customerDiscountRate = 0
    calculateTotal()
  }
}

// 添加标签
const addTag = () => {
  const tag = newTag.value.trim()
  if (tag && !formData.tags.includes(tag)) {
    formData.tags.push(tag)
    newTag.value = ''
  }
}

// 添加建议标签
const addSuggestedTag = (tag) => {
  if (!formData.tags.includes(tag)) {
    formData.tags.push(tag)
  }
}

// 移除标签
const removeTag = (index) => {
  formData.tags.splice(index, 1)
}

// 保存图片到本地路径
const saveImagesToLocal = async () => {
  const savedImages = []
  
  for (const image of formData.images) {
    if (image.isAutoLoaded) {
      // 自动加载的图片保持原有路径信息
      savedImages.push({
        name: image.name,
        path: image.path,
        fileName: image.fileName,
        productCode: image.productCode,
        isThumbnail: image.isThumbnail,
        isAutoLoaded: true
      })
    } else {
      // 用户上传的图片需要保存到对应产品编码文件夹
      const productCode = formData.productCode || 'unknown'
      const fileName = `image${savedImages.length}.${image.name.split('.').pop()}`
      const localPath = `/Outbound/${productCode}/${fileName}`
      
      savedImages.push({
        name: image.name,
        path: localPath,
        fileName: fileName,
        productCode: productCode,
        isThumbnail: savedImages.length === 0,
        isAutoLoaded: false
      })
    }
  }
  
  return savedImages
}

// 选择模板
const selectTemplate = () => {
  try {
    // 获取所有模板ID
    const templateIds = getAllTemplateIds()
    console.log('所有模板ID:', templateIds)
    
    // 导航到模板选择页面
    router.push('/outbound-templates')
  } catch (error) {
    console.error('获取模板ID时出错:', error)
    alert('获取模板列表失败，请重试')
  }
}



// 保存为模板
const saveAsTemplate = () => {
  // 验证必填字段
  if (!formData.productName || !formData.productType) {
    alert('请填写产品名称和类型')
    return
  }
  
  // 设置默认模板名称
  templateName.value = `${formData.productName}出库模板`
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
      OutboundTempname: templateName.value.trim(),
      productName: formData.productName,
      productCode: formData.productCode,
      unit: formData.unit,
      quantity: formData.quantity,
      unitPrice: formData.unitPrice,
      totalPrice: formData.totalPrice,
      customerId: formData.customerId,
      customerName: formData.customerName,
      customerPhone: formData.customerPhone,
      customerAddress: formData.customerAddress,
      customerDiscountRate: formData.customerDiscountRate,
      channel: formData.channel,
      tags: [...formData.tags],
      notes: formData.notes,
      date: formData.date,
      time: formData.time,
      images: formData.images,
      type: formData.type
    }
    
    // 保存模板
    const result = saveOutboundTemplate(templateData)
    
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
    baseData.productTypes = getMaterialTypeOptions()
    baseData.productGrades = getMaterialGradeOptions()
    baseData.warehouseLocations = getWarehouseLocationOptions()
    baseData.customers = getCustomerOptions()
    baseData.qualityStatuses = getQualityStatusOptions()
    baseData.channels = getSalesChannelOptions()
    
    console.log('基础数据加载完成')
  } catch (error) {
    console.error('加载基础数据失败:', error)
    // 即使API失败，也要确保基础选项可用
    baseData.productTypes = getMaterialTypeOptions()
    baseData.productGrades = getMaterialGradeOptions()
    baseData.warehouseLocations = getWarehouseLocationOptions()
    baseData.customers = getCustomerOptions()
    baseData.qualityStatuses = getQualityStatusOptions()
    baseData.channels = getSalesChannelOptions()
  }
}

// 处理表单提交
const handleSubmit = async () => {
  // 表单验证
  if (!formData.productName) {
    alert('请输入产品名称')
    return
  }
  if (!formData.quantity || formData.quantity <= 0) {
    alert('请输入有效的出库数量')
    return
  }
  if (!formData.unitPrice || formData.unitPrice <= 0) {
    alert('请输入有效的单价')
    return
  }
  if (!formData.customerId) {
    alert('请选择客户')
    return
  }
  
  loading.value = true
  
  try {
    // 保存图片到本地路径
    const savedImages = await saveImagesToLocal()
    
    // 准备提交数据，包含图片路径信息
    const submitData = {
      productName: formData.productName,
      productCode: formData.productCode,
      unit: formData.unit,
      quantity: formData.quantity,
      unitPrice: formData.unitPrice,
      totalPrice: formData.totalPrice,
      customerId: formData.customerId,
      customerName: formData.customerName,
      customerPhone: formData.customerPhone,
      customerAddress: formData.customerAddress,
      customerDiscountRate: formData.customerDiscountRate,
      channel: formData.channel,
      tags: [...formData.tags],
      notes: formData.notes,
      date: formData.date,
      time: formData.time,
      type: 'Outbound',
      images: savedImages
    }
    
    const response = await createOutboundRecord(submitData)
    
    if (response.success) {
      alert('出库记录创建成功')
      router.push('/outbound-records')
    } else {
      alert(response.message || '创建出库记录失败')
    }
  } catch (error) {
    console.error('创建出库记录失败:', error)
    alert('创建出库记录失败')
  } finally {
    loading.value = false
  }
}

// loadproductImages函数已在上方定义，用于根据产品编码自动加载图片

// 加载产品图片缩略图
const loadProductThumbnails = async (productCode) => {
  if (!productCode) {
    productImages.value = []
    return
  }
  
  try {
    const images = await getProductImages(productCode)
    productImages.value = images.slice(0, 4) // 只显示前4张作为缩略图
  } catch (error) {
    console.error('加载产品缩略图失败:', error)
    productImages.value = []
  }
}

// 验证图片是否有效
const isValidImage = async (imagePath) => {
  try {
    const response = await fetch(imagePath, { method: 'HEAD' })
    
    if (!response.ok) {
      return false
    }
    
    // 检查Content-Type是否为图片类型
    const contentType = response.headers.get('content-type')
    if (!contentType || !contentType.startsWith('image/')) {
      return false
    }
    
    // 检查Content-Length，确保文件不为空
    const contentLength = response.headers.get('content-length')
    if (contentLength && parseInt(contentLength) === 0) {
      return false
    }
    
    return true
  } catch (error) {
    return false
  }
}

// 获取产品图片
const getProductImages = async (productCode) => {
  if (!productCode) return []
  
  // 检查缓存
  if (productImagesCache.value[productCode]) {
    return productImagesCache.value[productCode]
  }
  
  const images = []
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp']
  let imageIndex = 0
  let consecutiveNotFound = 0
  const maxConsecutiveNotFound = 3
  
  try {
    while (consecutiveNotFound < maxConsecutiveNotFound && imageIndex < 20) {
      let imageFound = false
      
      for (const ext of imageExtensions) {
        const imagePath = `/Outbound/${productCode}/image${imageIndex}.${ext}`
        
        // 验证图片是否有效
        if (await isValidImage(imagePath)) {
          images.push(imagePath)
          imageFound = true
          consecutiveNotFound = 0
          console.log(`找到有效图片: ${imagePath}`)
          break
        }
      }
      
      if (!imageFound) {
        consecutiveNotFound++
      }
      
      imageIndex++
    }
    
    // 缓存结果
    productImagesCache.value[productCode] = images
    console.log(`产品 ${productCode} 加载了 ${images.length} 张有效图片`)
    return images
  } catch (error) {
    console.error('获取产品图片失败:', error)
    return []
  }
}

// 打开图片预览
const openImagePreview = (images, index, productName) => {
  if (!images || images.length === 0) {
    alert('该产品暂无图片')
    return
  }
  
  previewImages.value = images
  currentImageIndex.value = index || 0
  currentProductName.value = productName || '产品图片'
  showImagePreview.value = true
}

// 关闭图片预览
const closeImagePreview = () => {
  showImagePreview.value = false
  previewImages.value = []
  currentImageIndex.value = 0
  currentProductName.value = ''
}

// 上一张图片
const prevImage = () => {
  if (currentImageIndex.value > 0) {
    currentImageIndex.value--
  }
}

// 下一张图片
const nextImage = () => {
  if (currentImageIndex.value < previewImages.value.length - 1) {
    currentImageIndex.value++
  }
}

// 处理保存操作
const handleSave = async () => {
  await handleSubmit()
}

// 处理取消操作
const handleCancel = () => {
  if (confirm('确定要取消吗？未保存的数据将丢失。')) {
    router.push('/outbound-records')
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
          if (key === 'customerId' && templateData[key]) {
            // 查找对应的客户ID
            const customerOption = baseData.customers.find(customer => 
              customer.value === templateData[key] || customer.id === templateData[key]
            )
            formData[key] = customerOption ? customerOption.value : templateData[key]
          } else if (key === 'channel' && templateData[key]) {
            // 查找对应的渠道标签
            const channelOption = baseData.channels.find(channel => 
              channel.value === templateData[key]
            )
            formData[key] = channelOption ? channelOption.label : templateData[key]
          } else {
            formData[key] = templateData[key]
          }
        }
      })
      
      // 如果有客户数据，显示客户评价
      if (templateData.customerId || templateData.customerName) {
        showcustomerRating.value = true
      }
      
      // 计算总价
      calculateTotal()
      
      console.log('模板数据已加载:', templateData)
    } catch (error) {
      console.error('解析模板数据失败:', error)
    }
  }
  
  // 监听数据更新事件
  window.addEventListener('warehouse-data-updated', refreshBaseData)
  
  console.log('出库表单页面已加载')
})

// 监听产品编码变化，自动加载图片
watch(() => formData.productCode, async (newProductCode, oldProductCode) => {
  if (newProductCode && newProductCode !== oldProductCode) {
    console.log('产品编码变化，自动加载图片:', newProductCode)
    const images = await getProductImages(newProductCode)
    productImages.value = images
    console.log('图片加载完成，共', images.length, '张图片')
  }
}, { immediate: false })

// 组件卸载时移除事件监听器
onUnmounted(() => {
  window.removeEventListener('warehouse-data-updated', refreshBaseData)
})
</script>

<style scoped>
.Outbound-form-page {
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

.product-info {
  width: 100%;
}

.product-name {
  font-weight: 500;
  color: #1f2937;
  margin-bottom: 4px;
  font-size: 14px;
}

.product-details {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  font-size: 12px;
  color: #6b7280;
}

.product-code,
.product-type,
.product-customer {
  background: #f3f4f6;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 11px;
}

.product-code {
  background: #dbeafe;
  color: #1d4ed8;
}

.product-type {
  background: #d1fae5;
  color: #065f46;
}

.product-customer {
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

/* 其他工具类 */
.text-4xl { font-size: 2.25rem; }
.hidden { display: none; }
.cursor-pointer { cursor: pointer; }

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

/* 标签输入样式 */
.tags-input-container {
  border: 1px solid #d1d5db;
  border-radius: 6px;
  padding: 8px;
  min-height: 42px;
  background: white;
}

.tags-display {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 6px;
}

.tag-item {
  display: inline-flex;
  align-items: center;
  background: #3b82f6;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  gap: 4px;
}

.tag-remove {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 14px;
  line-height: 1;
  padding: 0;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.tag-remove:hover {
  background: rgba(255, 255, 255, 0.2);
}

.tag-input {
  border: none;
  outline: none;
  flex: 1;
  min-width: 120px;
  padding: 4px 0;
  font-size: 14px;
}

.tag-suggestions {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 8px;
}

.tag-suggestion {
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  color: #374151;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.tag-suggestion:hover {
  background: #e5e7eb;
  border-color: #9ca3af;
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

/* 图片预览模态框样式 */
.image-preview-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  cursor: pointer;
}

.image-preview-content {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  cursor: default;
}

.image-close-btn {
  position: absolute;
  top: -40px;
  right: 0;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  font-size: 24px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.image-close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.image-nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  font-size: 24px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.image-nav-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.3);
}

.image-nav-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.image-nav-btn.prev {
  left: -60px;
}

.image-nav-btn.next {
  right: -60px;
}

.image-display {
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-display .preview-image {
  max-width: 100%;
  max-height: 80vh;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.image-info {
  position: absolute;
  bottom: -50px;
  left: 0;
  right: 0;
  text-align: center;
  color: white;
}

.image-title {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 4px;
}

.image-counter {
  font-size: 14px;
  opacity: 0.8;
}

/* 产品图片预览区域样式 */
.image-preview-section {
  margin-top: 12px;
}

.image-thumbnails {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.product-thumbnail {
  width: 50px;
  height: 50px;
  border-radius: 6px;
  cursor: pointer;
  border: 2px solid #e5e7eb;
  transition: all 0.2s;
  overflow: hidden;
}

.product-thumbnail:hover {
  border-color: #3b82f6;
  transform: scale(1.05);
}

.thumbnail-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.no-images-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 60px;
  border: 2px dashed #d1d5db;
  border-radius: 6px;
  color: #9ca3af;
  font-size: 12px;
  text-align: center;
  line-height: 1.2;
}

.no-images-placeholder i {
  font-size: 16px;
  margin-bottom: 4px;
}
</style>