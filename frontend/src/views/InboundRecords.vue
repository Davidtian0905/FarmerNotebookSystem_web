<template>
  <Layout>
    <div class="inbound-records">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <h1 class="page-title">入库记录</h1>
        <p class="page-subtitle">管理和查看所有入库记录</p>
      </div>
      <div class="header-right">
        <button class="btn btn-primary" @click="handleAddInbound">
          <i class="icon-plus"></i>
          新增入库
        </button>
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
            <p>语音快速录入入库信息</p>
          </div>
        </div>
        
        <div class="action-card" @click="handleOCRScan">
          <div class="card-icon ocr">
            <i class="icon-camera"></i>
          </div>
          <div class="card-content">
            <h3>OCR识别</h3>
            <p>拍照识别入库单据</p>
          </div>
        </div>
        
        <div class="action-card" @click="handleCustomTemplate">
          <div class="card-icon template">
            <i class="icon-template"></i>
          </div>
          <div class="card-content">
            <h3>自定义入库模板</h3>
            <p>创建常用入库模板</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 自定义设置区域 -->
    <div class="card mb-6">
      <div class="card-header">
        <h3 class="card-title">自定义设置</h3>
        <p class="text-sm text-gray-600">管理物料类型、等级和仓库位置</p>
      </div>
      <div class="p-6">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- 自定义物料类型 -->
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <h4 class="text-lg font-semibold text-gray-900">自定义物料类型</h4>
              <button class="btn btn-primary btn-sm" @click="addMaterialType">
                <i class="fas fa-plus mr-1"></i>
                添加
              </button>
            </div>
            <div class="space-y-2">
              <div 
                v-for="(type, index) in customMaterialTypes" 
                :key="index"
                class="flex items-center justify-between p-3 bg-gray-50 rounded-lg custom-item"
              >
                <input 
                  v-if="type.isEditing"
                  v-model="type.name"
                  type="text" 
                  class="form-input-sm w-full mr-2" 
                  placeholder="请输入物料类型"
                  @blur="saveMaterialType(index)"
                  @keyup.enter="saveMaterialType(index)"
                  ref="materialTypeInput"
                >
                <span v-else class="text-sm font-medium text-gray-900">
                  {{ type.name }}
                </span>
                <button 
                  class="text-red-500 hover:text-red-700" 
                  @click="deleteMaterialType(index)"
                >
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- 自定义物料等级 -->
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <h4 class="text-lg font-semibold text-gray-900">自定义物料等级</h4>
              <button class="btn btn-primary btn-sm" @click="addMaterialGrade">
                <i class="fas fa-plus mr-1"></i>
                添加
              </button>
            </div>
            <div class="space-y-2">
              <div 
                v-for="(grade, index) in customMaterialGrades" 
                :key="index"
                class="flex items-center justify-between p-3 bg-gray-50 rounded-lg custom-item"
              >
                <input 
                  v-if="grade.isEditing"
                  v-model="grade.name"
                  type="text" 
                  class="form-input-sm w-full mr-2" 
                  placeholder="请输入物料等级"
                  @blur="saveMaterialGrade(index)"
                  @keyup.enter="saveMaterialGrade(index)"
                  ref="materialGradeInput"
                >
                <span v-else class="text-sm font-medium text-gray-900">
                  {{ grade.name }}
                </span>
                <button 
                  class="text-red-500 hover:text-red-700" 
                  @click="deleteMaterialGrade(index)"
                >
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- 自定义仓库位置 -->
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <h4 class="text-lg font-semibold text-gray-900">自定义仓库位置</h4>
              <button class="btn btn-primary btn-sm" @click="addWarehouseLocation">
                <i class="fas fa-plus mr-1"></i>
                添加
              </button>
            </div>
            <div class="space-y-2">
              <div 
                v-for="(location, index) in customWarehouseLocations" 
                :key="index"
                class="flex items-center justify-between p-3 bg-gray-50 rounded-lg custom-item"
              >
                <input 
                  v-if="location.isEditing"
                  v-model="location.name"
                  type="text" 
                  class="form-input-sm w-full mr-2" 
                  placeholder="请输入仓库位置"
                  @blur="saveWarehouseLocation(index)"
                  @keyup.enter="saveWarehouseLocation(index)"
                  ref="warehouseLocationInput"
                >
                <span v-else class="text-sm font-medium text-gray-900">
                  {{ location.name }}
                </span>
                <button 
                  class="text-red-500 hover:text-red-700" 
                  @click="deleteWarehouseLocation(index)"
                >
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>



    <!-- 物料列表 -->
    <div class="records-table">
      <div class="table-header">
        <h4 class="text-lg font-semibold text-gray-900">物料列表</h4>
        <div class="table-actions">         
          <div class="search-box">
            <i class="icon-search"></i>
            <input 
              type="text" 
              placeholder="搜索物料名称或编码"
              v-model="searchQuery"
              @input="handleSearch"
            >
          </div>
        </div>
      </div>

      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>物料信息</th>
              <th>物料编码</th>
              <th>入库时间</th>
              <th>物料总量</th>
              <th>单价</th>
              <th>物料总价值</th>
              <th>供应商</th>
              <th>仓库位置</th>
              <th>保质期</th>
              <th>质检状态</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="summary in materialSummary" :key="summary.materialCode" class="table-row">
              <td class="material-info">
                <div class="material-layout">
                  <div class="material-thumbnail-container">
                    <div class="material-thumbnail" v-if="getMaterialImages(summary.materialCode).length > 0" @click="openImagePreview(summary.materialCode, summary.materialName)">
                      <img :src="getMaterialImages(summary.materialCode)[0]" :alt="summary.materialName" class="thumbnail-image">
                    </div>
                    <div class="material-placeholder" v-else>
                      <i class="fas fa-image"></i>
                    </div>
                  </div>
                  <div class="material-info-right">
                    <div class="material-name">{{ summary.materialName }}</div>
                    <div class="material-tags">
                      <span class="material-type">{{ getMaterialTypeName(summary.materialType) }}</span>
                      <span class="material-grade">{{ getMaterialGradeName(summary.materialGrade) }}</span>
                    </div>
                  </div>
                </div>
              </td>
              <td class="material-code">
                <div class="code-main">{{ summary.materialCode }}</div>
                <div class="batch-number">批次: {{ summary.batchNumber }}</div>
              </td>
              <td class="inbound-time">{{ formatDateTime(summary.latestDate, summary.latestTime) }}</td>
              <td class="quantity">
                <span class="quantity-value">{{ summary.totalQuantity }}</span>
                <span class="material-unit">{{ summary.unit }}</span>
              </td>
              <td class="unit-price">¥{{ (summary.totalAmount / summary.totalQuantity).toFixed(2) }}</td>
              <td class="total-price">¥{{ summary.totalAmount.toFixed(2) }}</td>
              <td class="supplier">{{ getSupplierName(summary.supplierId) }}</td>
              <td class="warehouse-location">{{ getWarehouseLocationName(summary.warehouseLocation) }}</td>
              <td class="expiry-date">{{ formatDate(summary.expiryDate) }}</td>
              <td class="quality-status">
                <span :class="['status-badge', getQualityStatusClass(summary.qualityStatus)]">
                  {{ getQualityStatusName(summary.qualityStatus) }}
                </span>
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

    <!-- 新增入库模态框 -->
    <div v-if="showAddInboundModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>新增入库记录</h2>
          <button class="btn-close" @click="closeModal">
            <i class="icon-close"></i>
          </button>
        </div>
        <div class="modal-body">
          <InboundForm @submit="handleAddInbound" @cancel="closeModal" />
        </div>
      </div>
    </div>

    </div>
  </Layout>
  
  <!-- 图片预览模态框 - 移到Layout外部确保显示在最上层 -->
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
          :alt="currentMaterialName" 
          class="preview-image"
        >
      </div>
      
      <!-- 图片信息 -->
      <div class="image-info">
        <div class="image-title">{{ currentMaterialName }}</div>
        <div class="image-counter" v-if="previewImages.length > 1">
          {{ currentImageIndex + 1 }} / {{ previewImages.length }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { getWarehouseData } from '@/mock/database_flow.js'
import { getMaterialTypeOptions, getMaterialGradeOptions, getWarehouseLocationOptions, getSupplierOptions } from '@/mock/warehouse_data.js'
import { SUPPLIERS } from '@/mock/data/suppliers_data.js'
import InboundForm from '@/views/InboundForm.vue'
import Layout from '@/components/layout/Layout.vue'

export default {
  name: 'InboundRecords',
  components: {
    InboundForm,
    Layout
  },
  setup() {
    // 路由
    const router = useRouter()
    
    // 响应式数据
    const records = ref([])
    
    // 自定义设置数据 - 从warehouse_data.js初始化
    const customMaterialTypes = ref([])
    const customMaterialGrades = ref([])
    const customWarehouseLocations = ref([])
    
    // 初始化自定义设置数据
    const initializeCustomSettings = () => {
      // 从warehouse_data.js加载数据，转换为模板需要的格式
      customMaterialTypes.value = getMaterialTypeOptions().map(type => ({
        name: type.label,
        isEditing: false
      }))
      customMaterialGrades.value = getMaterialGradeOptions().map(grade => ({
        name: grade.label,
        isEditing: false
      }))
      customWarehouseLocations.value = getWarehouseLocationOptions().map(location => ({
        name: location.label || location,
        isEditing: false
      }))
      
      // 仓库位置数据已经从warehouse_data.js加载，无需额外添加
    }
    const materialTypes = ref([])
    const materialGrades = ref([])
    const warehouseLocations = ref([])
    const suppliers = ref([])
    const showAddInboundModal = ref(false)
    const searchQuery = ref('')
    const currentPage = ref(1)
    const pageSize = ref(20)
    
    // 图片预览相关数据
    const showImagePreview = ref(false)
const previewImages = ref([])
const currentImageIndex = ref(0)
const currentMaterialName = ref('')

// 物料图片缓存
const materialImagesCache = ref({})
    


    // 计算属性
    const filteredRecords = computed(() => {
      let result = [...records.value]
      
      // 搜索过滤
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        result = result.filter(record => 
          (record.materialName && record.materialName.toLowerCase().includes(query)) ||
          (record.materialCode && record.materialCode.toLowerCase().includes(query)) ||
          (record.batchNumber && record.batchNumber.toLowerCase().includes(query))
        )
      }

      // 按入库时间排序（最新的在前）
      return result.sort((a, b) => {
        const dateA = a.date
        const dateB = b.date
        return new Date(dateB) - new Date(dateA)
      })
    })
    
    // 按物料编码分组汇总数据
    const materialSummary = computed(() => {
      const summary = {}
      
      filteredRecords.value.forEach(record => {
        const materialCode = record.materialCode
        if (!summary[materialCode]) {
          summary[materialCode] = {
            materialCode,
            materialName: record.materialName,
            materialType: record.materialType,
            materialGrade: record.materialGrade,
            unit: record.unit,
            totalQuantity: 0,
            totalAmount: 0,
            supplier: record.supplier,
            supplierId: record.supplierId,
            warehouseLocation: record.warehouseLocation,
            latestDate: record.date,
            latestTime: record.time,
            expiryDate: record.expiryDate,
            qualityStatus: record.qualityStatus,
            batchNumber: record.batchNumber
          }
        }
        
        // 累加数量和金额
        summary[materialCode].totalQuantity += record.quantity || 0
        summary[materialCode].totalAmount += record.amount || 0
        
        // 更新最新日期
        if (new Date(record.date) > new Date(summary[materialCode].latestDate)) {
          summary[materialCode].latestDate = record.date
          summary[materialCode].latestTime = record.time
          summary[materialCode].expiryDate = record.expiryDate
          summary[materialCode].qualityStatus = record.qualityStatus
          summary[materialCode].supplier = record.supplier
          summary[materialCode].supplierId = record.supplierId
          summary[materialCode].warehouseLocation = record.warehouseLocation
        }
      })
      
      return Object.values(summary)
    })
    
    const totalRecords = computed(() => materialSummary.value.length)
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
        console.log('🔍 [DEBUG] 开始加载入库记录数据...')
        
        const warehouseData = await getWarehouseData()
        console.log('📦 [DEBUG] getWarehouseData() 返回的原始数据:', warehouseData)
        console.log('📊 [DEBUG] warehouseData.records 字段:', warehouseData.records)
        console.log('📈 [DEBUG] warehouseData.records 长度:', warehouseData.records ? warehouseData.records.length : 'undefined')
        
        // 筛选入库记录并按日期排序
        const allRecords = warehouseData.records || []
        console.log('📋 [DEBUG] 所有记录数量:', allRecords.length)
        console.log('📝 [DEBUG] 前3条记录示例:', allRecords.slice(0, 3))
        
        const inboundRecords = allRecords.filter(record => record.type === 'INBOUND')
        console.log('📥 [DEBUG] 筛选后的入库记录数量:', inboundRecords.length)
        console.log('📥 [DEBUG] 入库记录详情:', inboundRecords)
        
        // 按日期降序排序（最新的在前）
        records.value = inboundRecords.sort((a, b) => new Date(b.date) - new Date(a.date))
        console.log('✅ [DEBUG] 最终设置的records.value:', records.value)
        console.log('✅ [DEBUG] records.value 长度:', records.value.length)
        
        materialTypes.value = getMaterialTypeOptions()
        materialGrades.value = getMaterialGradeOptions()
        warehouseLocations.value = getWarehouseLocationOptions()
        suppliers.value = getSupplierOptions()
        
        console.log('🔧 [DEBUG] 辅助数据加载完成')
        console.log('🔧 [DEBUG] materialTypes:', materialTypes.value.length)
        console.log('🔧 [DEBUG] suppliers:', suppliers.value.length)
        
        // 初始化自定义设置数据
        initializeCustomSettings()
        
        // 预加载所有物料的图片信息
        const uniqueMaterialCodes = [...new Set(records.value.map(record => record.materialCode))]
        console.log('🖼️ [DEBUG] 开始预加载图片，物料编码数量:', uniqueMaterialCodes.length)
        
        for (const materialCode of uniqueMaterialCodes) {
          await loadMaterialImages(materialCode)
        }
        
        console.log('🖼️ [DEBUG] 图片预加载完成，缓存内容:', materialImagesCache.value)
        console.log('🎉 [DEBUG] 数据加载完成！')
      } catch (error) {
        console.error('❌ [ERROR] 加载数据失败:', error)
        console.error('❌ [ERROR] 错误堆栈:', error.stack)
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

    const getSupplierName = (supplierId) => {
      // 根据supplierId从SUPPLIERS对象中获取供应商名称
      if (!supplierId) return '未知供应商'
      const supplier = SUPPLIERS[supplierId]
      return supplier ? supplier.suppliername : '未知供应商'
    }

    const getWarehouseLocationName = (locationId) => {
      // 根据API文档，从warehouseLocations中查找对应的label
      const location = warehouseLocations.value.find(loc => 
        (loc.value && loc.value === locationId) || loc === locationId
      )
      return location ? (location.label || location) : (locationId || '未知位置')
    }

    const getQualityStatusName = (statusId) => {
      // 直接返回状态名称，因为现在使用简化的字符串数组
      return statusId || '未知状态'
    }

    const getQualityStatusClass = (status) => {
      const classMap = {
        'pending': 'warning',
        'passed': 'success',
        'failed': 'danger',
        'completed': 'success'
      }
      return classMap[status] || 'default'
    }

    const formatDate = (dateString) => {
      if (!dateString) return '-'
      return new Date(dateString).toLocaleDateString('zh-CN')
    }

    const formatDateTime = (dateString, timeString) => {
      if (!dateString) return '-'
      if (timeString) {
        return new Date(`${dateString}T${timeString}`).toLocaleString('zh-CN')
      }
      return new Date(dateString).toLocaleString('zh-CN')
    }



    const handleSearch = () => {
      currentPage.value = 1
    }

    const goToPage = (page) => {
      if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page
      }
    }

    const refreshRecords = () => {
      loadData()
    }

    const exportRecords = () => {
      // TODO: 实现导出功能
      console.log('导出入库记录')
    }

    const handleVoiceRecord = () => {
      // TODO: 实现语音记账功能
      console.log('启动语音记账')
    }

    const handleOCRScan = () => {
      // TODO: 实现OCR识别功能
      console.log('启动OCR识别')
    }

    const handleCustomTemplate = () => {
      router.push('/inbound-templates')
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
      if (confirm('确定要删除这条入库记录吗？')) {
        console.log('删除记录:', record)
      }
    }

    const handleAddInbound = () => {
      // 跳转到新增入库页面
      router.push('/inbound-form')
    }

    const closeModal = () => {
      showAddInboundModal.value = false
    }

    // 图片预览方法
const openImagePreview = async (materialCode, materialName) => {
  // 根据物料编码获取该文件夹内所有预览图片路径（image1-N，不包含image0）
  const imagePaths = await getAllMaterialImages(materialCode)
  
  // 只有当存在预览图片时才显示预览框
  if (imagePaths.length > 0) {
    previewImages.value = imagePaths
    currentImageIndex.value = 0
    currentMaterialName.value = materialName
    showImagePreview.value = true
    
    // 强制重渲染机制：使用nextTick确保DOM更新
    await nextTick()
    console.log('图片预览模态框已显示，共', imagePaths.length, '张预览图片')
  } else {
    console.log('该物料没有预览图片（image1-N），不显示预览框')
  }
}

    const closeImagePreview = () => {
      showImagePreview.value = false
      previewImages.value = []
      currentImageIndex.value = 0
      currentMaterialName.value = ''
    }

    const prevImage = () => {
      if (currentImageIndex.value > 0) {
        currentImageIndex.value--
      }
    }

    const nextImage = () => {
      if (currentImageIndex.value < previewImages.value.length - 1) {
        currentImageIndex.value++
      }
    }

// 预加载物料缩略图信息（只加载image0）
const loadMaterialImages = async (materialCode) => {
  if (!materialCode || materialImagesCache.value[materialCode]) return
  
  try {
    // 只检查image0的各种格式作为缩略图
    const thumbnailFormats = [
      `/Inbound/${materialCode}/image0.jpg`,
      `/Inbound/${materialCode}/image0.png`,
      `/Inbound/${materialCode}/image0.jpeg`
    ]
    
    let found = false
    for (const thumbnailPath of thumbnailFormats) {
      try {
        await new Promise((resolve, reject) => {
          const img = new Image()
          img.onload = () => resolve()
          img.onerror = () => reject()
          img.src = thumbnailPath
        })
        materialImagesCache.value[materialCode] = [thumbnailPath]
        found = true
        break
      } catch {
        continue
      }
    }
    
    // 如果image0不存在，设置为空数组
    if (!found) {
      materialImagesCache.value[materialCode] = []
    }
  } catch (error) {
    console.error('加载物料缩略图失败:', error)
    materialImagesCache.value[materialCode] = []
  }
}

// 获取物料图片的方法（同步）
const getMaterialImages = (materialCode) => {
  if (!materialCode) return []
  return materialImagesCache.value[materialCode] || []
}

// 获取物料文件夹内预览图片的方法（image1-N，不包含image0）
const getAllMaterialImages = async (materialCode) => {
  if (!materialCode) {
    return []
  }
  
  try {
    const images = []
    const baseUrl = `/Inbound/${materialCode}/`
    
    // 预览图片文件名模式（从image1开始，不包含image0）
    const imagePatterns = [
      'image1.jpg', 'image2.jpg', 'image3.jpg', 'image4.jpg', 'image5.jpg', 'image6.jpg', 'image7.jpg', 'image8.jpg', 'image9.jpg',
      'image1.png', 'image2.png', 'image3.png', 'image4.png', 'image5.png', 'image6.png', 'image7.png', 'image8.png', 'image9.png',
      'image1.jpeg', 'image2.jpeg', 'image3.jpeg', 'image4.jpeg', 'image5.jpeg', 'image6.jpeg', 'image7.jpeg', 'image8.jpeg', 'image9.jpeg'
    ]
    
    // 检查每个可能的图片文件是否存在
    for (const pattern of imagePatterns) {
      const imagePath = baseUrl + pattern
      try {
        // 创建一个Image对象来测试图片是否存在
        await new Promise((resolve, reject) => {
          const img = new Image()
          img.onload = () => resolve()
          img.onerror = () => reject()
          img.src = imagePath
        })
        images.push(imagePath)
      } catch {
        // 图片不存在，跳过
        continue
      }
    }
    
    // 如果没有找到任何预览图片，返回空数组（不再返回image0作为默认）
    return images
  } catch (error) {
    console.error('获取物料图片失败:', error)
    return []
  }
}

    // 自定义设置方法
    const addMaterialType = () => {
      const newName = '新物料类型_' + Date.now()
      customMaterialTypes.value.push({ 
        id: newName, // 使用名称作为ID
        name: newName, 
        isEditing: true
      })
    }

    const saveMaterialType = (index) => {
      const type = customMaterialTypes.value[index]
      if (type.name.trim()) {
        type.isEditing = false
        type.id = type.name // 更新ID为名称
        // 同步到materialTypes用于筛选
        materialTypes.value.push({
          value: type.name, // 使用名称作为值
          label: type.name
        })
        console.log('保存物料类型:', type.name)
        // 发送数据更新事件
        window.dispatchEvent(new CustomEvent('warehouse-data-updated', { detail: { type: 'materialType', data: type } }))
      } else {
        customMaterialTypes.value.splice(index, 1)
      }
    }

    const deleteMaterialType = (index) => {
      const type = customMaterialTypes.value[index]
      if (confirm('确定要删除此物料类型吗？')) {
        // 从materialTypes中移除
        const typeIndex = materialTypes.value.findIndex(t => t.value === type.name || t.label === type.name)
        if (typeIndex > -1) {
          materialTypes.value.splice(typeIndex, 1)
        }
        customMaterialTypes.value.splice(index, 1)
        // 发送数据更新事件
        window.dispatchEvent(new CustomEvent('warehouse-data-updated', { detail: { type: 'materialType', action: 'delete', data: type } }))
      }
    }

    const addMaterialGrade = () => {
      const newId = 'custom_' + Date.now()
      customMaterialGrades.value.push({ 
        id: newId,
        name: '', 
        isEditing: true
      })
    }

    const saveMaterialGrade = (index) => {
      const grade = customMaterialGrades.value[index]
      if (grade.name.trim()) {
        grade.isEditing = false
        // 同步到materialGrades用于筛选
        materialGrades.value.push({
          id: grade.id,
          name: grade.name,
          color: '#8c8c8c'
        })
        console.log('保存物料等级:', grade.name)
        // 发送数据更新事件
        window.dispatchEvent(new CustomEvent('warehouse-data-updated', { detail: { type: 'materialGrade', data: grade } }))
      } else {
        customMaterialGrades.value.splice(index, 1)
      }
    }

    const deleteMaterialGrade = (index) => {
      const grade = customMaterialGrades.value[index]
      if (confirm('确定要删除此物料等级吗？')) {
        // 从materialGrades中移除
        const gradeIndex = materialGrades.value.findIndex(g => g.value === grade.name || g.label === grade.name)
        if (gradeIndex > -1) {
          materialGrades.value.splice(gradeIndex, 1)
        }
        customMaterialGrades.value.splice(index, 1)
        // 发送数据更新事件
        window.dispatchEvent(new CustomEvent('warehouse-data-updated', { detail: { type: 'materialGrade', action: 'delete', data: grade } }))
      }
    }

    const addWarehouseLocation = () => {
      const newId = 'custom_' + Date.now()
      customWarehouseLocations.value.push({ 
        id: newId,
        name: '', 
        isEditing: true
      })
    }

    const saveWarehouseLocation = (index) => {
      const location = customWarehouseLocations.value[index]
      if (location.name.trim()) {
        location.isEditing = false
        // 同步到warehouseLocations用于筛选
        warehouseLocations.value.push({
          id: location.id,
          name: location.name,
          zone: '自定义区域',
          type: '自定义位置'
        })
        console.log('保存仓库位置:', location.name)
        // 发送数据更新事件
        window.dispatchEvent(new CustomEvent('warehouse-data-updated', { detail: { type: 'warehouseLocation', data: location } }))
      } else {
        customWarehouseLocations.value.splice(index, 1)
      }
    }

    const deleteWarehouseLocation = (index) => {
      const location = customWarehouseLocations.value[index]
      if (confirm('确定要删除此仓库位置吗？')) {
        // 从warehouseLocations中移除
        const locationIndex = warehouseLocations.value.findIndex(l => l.id === location.id)
        if (locationIndex > -1) {
          warehouseLocations.value.splice(locationIndex, 1)
        }
        customWarehouseLocations.value.splice(index, 1)
        // 发送数据更新事件
        window.dispatchEvent(new CustomEvent('warehouse-data-updated', { detail: { type: 'warehouseLocation', action: 'delete', data: location } }))
      }
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
      suppliers,
      showAddInboundModal,
      searchQuery,
      currentPage,
      pageSize,
      
      // 图片预览数据
      showImagePreview,
      previewImages,
      currentImageIndex,
      currentMaterialName,
      
      // 自定义设置数据
      customMaterialTypes,
      customMaterialGrades,
      customWarehouseLocations,
      
      // 计算属性
      filteredRecords,
      materialSummary,
      totalRecords,
      totalPages,
      visiblePages,
      
      // 方法
      getMaterialTypeName,
      getMaterialGradeName,
      getSupplierName,
      getWarehouseLocationName,
      getQualityStatusName,
      getQualityStatusClass,
      formatDate,
      formatDateTime,
      handleSearch,
      goToPage,
      refreshRecords,
      exportRecords,
      handleVoiceRecord,
      handleOCRScan,
      handleCustomTemplate,
      viewRecord,
      editRecord,
      deleteRecord,
      handleAddInbound,
      closeModal,
      
      // 图片预览方法
    getMaterialImages,
    getAllMaterialImages,
    openImagePreview,
    closeImagePreview,
    prevImage,
    nextImage,
      
      // 自定义设置方法
      initializeCustomSettings,
      addMaterialType,
      saveMaterialType,
      deleteMaterialType,
      addMaterialGrade,
      saveMaterialGrade,
      deleteMaterialGrade,
      addWarehouseLocation,
      saveWarehouseLocation,
      deleteWarehouseLocation
    }
  }
}
</script>

<style scoped>
.inbound-records {
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

.card-icon.ocr {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.card-icon.template {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
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

.material-layout {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.material-thumbnail-container {
  flex-shrink: 0;
}

.material-info-right {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 50px; /* 与缩略图高度一致 */
}

.material-tags {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 4px;
}

.material-name {
  font-weight: 600;
  color: #1a1a1a;
  font-size: 16px;
  line-height: 1.2;
  margin-bottom: 4px;
}

.material-type {
  background: #e3f2fd;
  color: #1976d2;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.material-grade {
  background: #f3e5f5;
  color: #7b1fa2;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 12px;
}

.material-code {
  line-height: 1.4;
}

.code-main {
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
}

.batch-number {
  background: #e8f5e8;
  color: #2e7d32;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 11px;
}

.quantity {
  display: flex;
  align-items: center;
  gap: 4px;
}

.quantity-value {
  font-weight: 600;
  color: #333;
}

.material-unit {
  font-size: 12px;
  color: #666;
  background: #f5f5f5;
  padding: 1px 4px;
  border-radius: 2px;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.status-badge.success {
  background: #e8f5e8;
  color: #2e7d32;
}

.status-badge.warning {
  background: #fff3e0;
  color: #f57c00;
}

.status-badge.danger {
  background: #ffebee;
  color: #d32f2f;
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

/* 自定义设置样式 */
.card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.card-header {
  padding: 20px 24px;
  border-bottom: 1px solid #eee;
  background: #f8f9fa;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 4px 0;
}

.mb-6 {
  margin-bottom: 24px;
}

.p-6 {
  padding: 24px;
}

.grid {
  display: grid;
}

.grid-cols-1 {
  grid-template-columns: repeat(1, minmax(0, 1fr));
}

.lg\:grid-cols-3 {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.gap-6 {
  gap: 24px;
}

.space-y-4 > * + * {
  margin-top: 16px;
}

.space-y-2 > * + * {
  margin-top: 8px;
}

.flex {
  display: flex;
}

.items-center {
  align-items: center;
}

.justify-between {
  justify-content: space-between;
}

.text-lg {
  font-size: 18px;
}

.font-semibold {
  font-weight: 600;
}

.text-gray-900 {
  color: #1a1a1a;
}

.btn-sm {
  padding: 6px 12px;
  font-size: 13px;
}

.mr-1 {
  margin-right: 4px;
}

.custom-item {
  transition: all 0.2s ease;
  border: 1px solid #e5e7eb;
}

.custom-item:hover {
  border-color: #d1d5db;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.bg-gray-50 {
  background-color: #f9fafb;
}

.rounded-lg {
  border-radius: 8px;
}

.text-sm {
  font-size: 14px;
}

.font-medium {
  font-weight: 500;
}

.text-gray-600 {
  color: #6b7280;
}

.form-input-sm {
  padding: 6px 10px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}

.form-input-sm:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.w-full {
  width: 100%;
}

.mr-2 {
  margin-right: 8px;
}

.text-red-500 {
  color: #ef4444;
}

.hover\:text-red-700:hover {
  color: #b91c1c;
}

.fas {
  font-family: "Font Awesome 5 Free";
  font-weight: 900;
}

.fa-plus::before {
  content: "+";
}

.fa-trash::before {
  content: "🗑";
}

/* 图片预览模态框样式 */
.image-preview-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  z-index: 1000000;
  margin: 0;
  padding: 0;
  padding-top: 80px;
}

.image-preview-content {
  position: relative;
  width: 1080px;
  height: 720px;
  margin-left: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 12px;
}

.image-nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(255, 255, 255, 0.8);
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 20px;
  color: #333;
  transition: all 0.3s ease;
  z-index: 1000001;
}

.image-nav-btn:hover {
  background-color: rgba(255, 255, 255, 0.9);
  transform: translateY(-50%) scale(1.1);
}

.image-nav-btn.prev {
  left: 15px;
}

.image-nav-btn.next {
  right: 15px;
}

.image-close-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  background-color: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 16px;
  color: #333;
  transition: all 0.3s ease;
  z-index: 1000001;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.image-display {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.image-close-btn:hover {
  background-color: rgba(255, 255, 255, 0.9);
  transform: scale(1.1);
}

.image-info {
  position: absolute;
  bottom: 15px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 8px 16px;
  border-radius: 16px;
  font-size: 13px;
  z-index: 1000001;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.material-thumbnail {
  margin-right: 12px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.material-thumbnail:hover {
  transform: scale(1.05);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.thumbnail-image {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 6px;
  display: block;
  border: 1px solid #e0e0e0;
}

.material-placeholder {
  width: 40px;
  height: 40px;
  background-color: #f0f0f0;
  border: 1px dashed #ccc;
  border-radius: 6px;
  margin-right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 12px;
}

</style>