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
        <button class="btn btn-primary" @click="handleAddoutbound">
          <i class="icon-plus"></i>
          新增出库
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
            <p>语音快速录入出库信息</p>
          </div>
        </div>
        
        <div class="action-card" @click="handleProductMix">
          <div class="card-icon ocr">
            <i class="icon-camera"></i>
          </div>
          <div class="card-content">
            <h3>商品组合</h3>
            <p>从物料中组合一个新商品，并用于出库销售</p>
          </div>
        </div>
        
        <div class="action-card" @click="handleTemplates">
          <div class="card-icon template">
            <i class="icon-template"></i>
          </div>
          <div class="card-content">
            <h3>商品出库模板管理</h3>
            <p>管理商品出库模板</p>
          </div>
        </div>
      </div>
    </div>


    <!-- 商品组合列表 -->
    <div class="records-table">
      <div class="table-header">
        <h4 class="text-lg font-semibold text-gray-900">商品组合列表</h4>
        <div class="table-actions">         
          <div class="search-box">
            <i class="icon-search"></i>
            <input 
              type="text" 
              placeholder="搜索商品组合名称或编码"
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
              <th>商品名称</th>
              <th>商品编号</th>
              <th>物料组合信息</th>
              <th>物料总成本</th>
              <th>产品定价</th>
              <th>利润率</th>
              <th>产品数量</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredRecords.length === 0">
              <td colspan="8" class="text-center text-gray-500 py-8">
                暂无出库记录
              </td>
            </tr>
            <tr v-for="record in paginatedRecords" :key="record.id" class="table-row">
              <!-- 商品名称 -->
              <td class="product-info">
                <div class="material-thumbnail" @click="openImagePreview(record.productCode, record.productName)">
                  <img 
                    v-if="getMaterialImages(record.productCode).length > 0" 
                    :src="getMaterialImages(record.productCode)[0]" 
                    :alt="record.productName" 
                    class="thumbnail-image"
                  >
                  <div v-else class="no-image">
                    <i class="fas fa-image"></i>
                  </div>
                </div>
                <div class="product-details">
                  <div class="product-name">{{ record.productName || '未知商品' }}</div>
                  <div class="product-description" v-if="record.description">
                    {{ record.description.length > 10 ? record.description.substring(0, 10) + '...' : record.description }}
                  </div>
                </div>
              </td>
              <!-- 商品编号 -->
              <td class="product-code">{{ record.productCode || '-' }}</td>
              <!-- 物料组合信息 -->
              <td class="materials-info">
                <div v-if="record.materials && record.materials.length > 0" class="materials-list">
                  <div v-for="material in record.materials" :key="material.materialCode" class="material-item">
                    {{ material.materialName }} {{ material.quantity }}{{ material.unit }}
                  </div>
                </div>
                <div v-else class="no-materials">-</div>
              </td>
              <!-- 总成本 -->
              <td class="total-cost">¥{{ (record.totalMaterialCost || 0).toFixed(2) }}</td>
              <!-- 定价 -->
              <td class="product-price">¥{{ (record.productPrice || 0).toFixed(2) }}</td>
              <!-- 利润率 -->
              <td class="profit-rate">{{ calculateProfitRate(record).toFixed(1) }}%</td>
              <!-- 产品数量 -->
              <td class="product-quantity">
                <div class="quantity-info">
                  <div class="quantity-value">{{ record.productQuantity || 0 }} {{ record.unit || '件' }}</div>
                  <div class="status-info" v-if="record.stockDeductionPreview && record.stockDeductionPreview.length > 0">
                    <span class="status-badge" :class="getStatusClass(getOverallStatus(record.stockDeductionPreview))">{{ getOverallStatus(record.stockDeductionPreview) }}</span>
                  </div>
                </div>
              </td>
              <!-- 操作 -->
              <td class="actions">
                <button class="btn btn-sm btn-outline" @click="editRecord(record)" title="编辑">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-outline btn-danger" @click="deleteRecord(record)" title="删除">
                  <i class="fas fa-trash-alt"></i>
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
    <div v-if="showAddoutboundModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>新增出库记录</h2>
          <button class="btn-close" @click="closeModal">
            <i class="icon-close"></i>
          </button>
        </div>
        <div class="modal-body">
          <OutboundForm @submit="handleAddoutbound" @cancel="closeModal" />
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
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
// 动态导入商品组合数据
import Layout from '@/components/layout/Layout.vue'
import OutboundForm from '@/views/OutboundForm.vue'

export default {
  name: 'outboundRecords',
  components: {
    OutboundForm,
    Layout
  },
  setup() {
    // 路由
    const router = useRouter()
    
    // 响应式数据
    const records = ref([])
    
    const showAddoutboundModal = ref(false)
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
          (record.productName && record.productName.toLowerCase().includes(query)) ||
          (record.productCode && record.productCode.toLowerCase().includes(query)) ||
          (record.customer && record.customer.toString().toLowerCase().includes(query))
        )
      }

      // 按出库时间排序（最新的在前）
      return result.sort((a, b) => {
        const dateA = a.date
        const dateB = b.date
        return new Date(dateB) - new Date(dateA)
      })
    })

    // 分页数据
    const paginatedRecords = computed(() => {
      const start = (currentPage.value - 1) * pageSize.value
      const end = start + pageSize.value
      return filteredRecords.value.slice(start, end)
    })
    
    // 总记录数和分页计算
    const totalRecords = computed(() => filteredRecords.value.length)
    const totalPages = computed(() => {
      const total = totalRecords.value
      return total > 0 ? Math.ceil(total / pageSize.value) : 1
    })
    const visiblePages = computed(() => {
      const pages = []
      const totalPagesValue = totalPages.value || 1
      const currentPageValue = currentPage.value || 1
      const start = Math.max(1, currentPageValue - 2)
      const end = Math.min(totalPagesValue, currentPageValue + 2)
      
      // 确保start和end都是有效数字
      if (start <= end && !isNaN(start) && !isNaN(end)) {
        for (let i = start; i <= end; i++) {
          pages.push(i)
        }
      }
      return pages.length > 0 ? pages : [1]
    })

    // 计算利润率的方法
    const calculateProfitRate = (record) => {
      if (!record.totalMaterialCost || !record.productPrice) {
        return 0
      }
      const profit = record.productPrice - record.totalMaterialCost
      return (profit / record.totalMaterialCost) * 100
    }

    // 方法
    const loadData = async () => {
      try {
        // 从outbound_data.js获取商品组合数据
        const { getProductCombos } = await import('@/mock/outbound_data.js')
        const productCombos = getProductCombos()
        records.value = productCombos
        
        // 预加载所有商品的缩略图
        for (const record of productCombos) {
          if (record.productCode) {
            await loadMaterialImages(record.productCode)
          }
        }

      } catch (error) {
        console.error('加载数据失败:', error)
      }
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
      console.log('导出出库记录')
    }

    const handleVoiceRecord = () => {
      // TODO: 实现语音记账功能
      console.log('启动语音记账')
    }

    const deleteRecord = (record) => {
      // 构建确认消息
      let confirmMessage = `确定要删除出库记录「${record.productName || '未知商品'}」吗？\n\n`
      
      // 如果有物料组合信息，显示将要撤销的物料扣除
      if (record.materials && record.materials.length > 0) {
        confirmMessage += '删除后将撤销以下物料的扣除数量：\n'
        record.materials.forEach(material => {
          confirmMessage += `• ${material.materialName}: ${material.quantity}${material.unit}\n`
        })
        confirmMessage += '\n是否确认删除？'
      } else {
        confirmMessage += '是否确认删除？'
      }
      
      if (confirm(confirmMessage)) {
        try {
          // TODO: 调用API删除记录并恢复物料库存
          console.log('删除记录:', record)
          
          // 从本地数据中移除该记录
          const index = records.value.findIndex(r => r.id === record.id)
          if (index > -1) {
            records.value.splice(index, 1)
          }
          
          // 显示成功消息
          alert('出库记录已删除，物料库存已恢复')
        } catch (error) {
          console.error('删除记录失败:', error)
          alert('删除失败，请重试')
        }
      }
    }

    // 销售渠道相关方法
    const getChannelName = (channel) => {
      const channelMap = {
        'online': '线上销售',
        'offline': '线下门店',
        'wholesale': '批发',
        'retail': '零售',
        'export': '出口',
        'other': '其他'
      }
      return channelMap[channel] || channel || '未知渠道'
    }

    const getChannelClass = (channel) => {
       const classMap = {
         'online': 'online',
         'offline': 'offline',
         'wholesale': 'wholesale',
         'retail': 'retail',
         'export': 'export',
         'other': 'other'
       }
       return classMap[channel] || 'default'
     }

     // 记录操作方法
     const viewRecord = (record) => {
       console.log('查看记录:', record)
       // TODO: 实现查看记录详情的逻辑
     }

     const editRecord = (record) => {
       console.log('编辑记录:', record)
       // 跳转到商品组合编辑页面，传递记录ID作为参数
       router.push({
         path: '/outbound-product-mix',
         query: {
           id: record.id,
           mode: 'edit'
         }
       })
     }

    const handleAddoutbound = () => {
      // 跳转到新增出库页面
      router.push('/outbound-form')
    }

    const handleProductMix = () => {
      // 跳转到商品组合页面
      router.push('/outbound-product-mix')
    }

    const handleTemplates = () => {
      // 跳转到出库模板管理页面
      router.push('/outbound-templates')
    }

    const closeModal = () => {
      showAddoutboundModal.value = false
    }

    // 图片预览方法
    const openImagePreview = async (productCode, productName) => {
      // 根据商品编码获取该文件夹内所有预览图片路径（image1-N，不包含image0）
      const imagePaths = await getAllMaterialImages(productCode)
      
      // 只有当存在预览图片时才显示预览框
      if (imagePaths.length > 0) {
        previewImages.value = imagePaths
        currentImageIndex.value = 0
        currentMaterialName.value = productName
        showImagePreview.value = true
        
        // 强制重渲染机制：使用nextTick确保DOM更新
        await nextTick()
        console.log('图片预览模态框已显示，共', imagePaths.length, '张预览图片')
      } else {
        console.log('该商品没有预览图片（image1-N），不显示预览框')
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

    // 预加载商品缩略图信息（只加载image0）
    const loadMaterialImages = async (productCode) => {
      if (!productCode || materialImagesCache.value[productCode]) return
      
      try {
        // 只检查image0的各种格式作为缩略图
        const thumbnailFormats = [
          `/Outbound/${productCode}/image0.jpg`,
          `/Outbound/${productCode}/image0.png`,
          `/Outbound/${productCode}/image0.jpeg`
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
            materialImagesCache.value[productCode] = [thumbnailPath]
            found = true
            break
          } catch {
            continue
          }
        }
        
        // 如果image0不存在，设置为空数组
        if (!found) {
          materialImagesCache.value[productCode] = []
        }
      } catch (error) {
        console.error('加载商品缩略图失败:', error)
        materialImagesCache.value[productCode] = []
      }
    }

    // 获取商品图片的方法（同步）
    const getMaterialImages = (productCode) => {
      if (!productCode) return []
      return materialImagesCache.value[productCode] || []
    }

    // 获取商品文件夹内预览图片的方法（image1-N，不包含image0）
    const getAllMaterialImages = async (productCode) => {
      if (!productCode) {
        return []
      }
      
      try {
        const images = []
        const baseUrl = `/Outbound/${productCode}/`
        
        // 预览图片文件名模式（从image1开始，不包含image0）
        const imagePatterns = [
          'image1.jpg', 'image2.jpg', 'image3.jpg', 'image4.jpg', 'image5.jpg', 'image6.jpg', 'image7.jpg', 'image8.jpg', 'image9.jpg',
          'image1.png', 'image2.png', 'image3.png', 'image4.png', 'image5.png', 'image6.png', 'image7.png', 'image8.png', 'image9.png',
          'image1.jpeg', 'image2.jpeg', 'image3.jpeg', 'image4.jpeg', 'image5.jpeg', 'image6.jpeg', 'image7.jpeg', 'image8.jpeg', 'image9.jpeg'
        ]
        
        // 确保 images 数组已正确初始化
        if (!Array.isArray(images)) {
          console.error('images 数组初始化失败')
          return []
        }
        
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
            // 确保 images 数组仍然存在且为数组类型
            if (Array.isArray(images)) {
              images.push(imagePath)
            } else {
              console.error('images 数组在循环中变为非数组类型')
              return []
            }
          } catch {
            // 图片不存在，跳过
            continue
          }
        }
        
        // 如果没有找到任何预览图片，返回空数组（不再返回image0作为默认）
        return Array.isArray(images) ? images : []
      } catch (error) {
        console.error('获取商品图片失败:', error)
        return []
      }
    }

    // 获取整体状态
    const getOverallStatus = (stockDeductionPreview) => {
      if (!stockDeductionPreview || stockDeductionPreview.length === 0) {
        return '未知'
      }
      
      // 检查是否有缺货
      if (stockDeductionPreview.some(material => material.status === '缺货')) {
        return '缺货'
      }
      
      // 检查是否有不足
      if (stockDeductionPreview.some(material => material.status === '不足')) {
        return '不足'
      }
      
      // 所有物料都充足
      return '充足'
    }

    // 获取状态样式类
    const getStatusClass = (status) => {
      switch (status) {
        case '充足':
          return 'status-sufficient'
        case '不足':
          return 'status-insufficient'
        case '缺货':
          return 'status-out-of-stock'
        default:
          return 'status-unknown'
      }
    }

    // 生命周期
    onMounted(() => {
      loadData()
    })

    return {
      // 数据
      records,
      showAddoutboundModal,
      searchQuery,
      currentPage,
      pageSize,
      
      // 图片预览相关
      showImagePreview,
      previewImages,
      currentImageIndex,
      currentMaterialName,
      
      // 计算属性
      filteredRecords,
      paginatedRecords,
      totalRecords,
      totalPages,
      visiblePages,
      
      // 方法
      formatDate,
      formatDateTime,
      handleSearch,
      goToPage,
      refreshRecords,
      exportRecords,
      handleVoiceRecord,
      deleteRecord,
      getChannelName,
      getChannelClass,
      viewRecord,
      editRecord,
      handleAddoutbound,
      handleProductMix,
      handleTemplates,
      closeModal,
      calculateProfitRate,
      
      // 图片预览方法
      openImagePreview,
      closeImagePreview,
      prevImage,
      nextImage,
      loadMaterialImages,
      getMaterialImages,
      getAllMaterialImages,
      
      // 状态相关方法
      getOverallStatus,
      getStatusClass
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

/* 物料组合信息样式 */
.materials-info {
  min-width: 200px;
  max-width: 300px;
}

.materials-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.material-item {
  padding: 4px 8px;
  background: #f8f9fa;
  border-radius: 4px;
  font-size: 13px;
  color: #333;
  border-left: 3px solid #4CAF50;
  line-height: 1.3;
}

.no-materials {
  color: #999;
  font-style: italic;
  text-align: center;
  padding: 8px;
}

/* 商品信息样式 */
.product-info {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 200px;
}

.material-thumbnail {
  width: 50px;
  height: 50px;
  border-radius: 6px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s;
  flex-shrink: 0;
}

.material-thumbnail:hover {
  transform: scale(1.05);
}

.thumbnail-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.no-image {
  width: 100%;
  height: 100%;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 18px;
}

.product-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.product-name {
  font-weight: 600;
  color: #1a1a1a;
  font-size: 14px;
  line-height: 1.3;
}

.product-description {
  font-size: 12px;
  color: #666;
  line-height: 1.2;
  font-style: italic;
}

.product-code {
  font-family: 'Courier New', monospace;
  color: #666;
  font-size: 13px;
}

.total-cost, .product-price {
  font-weight: 600;
  color: #2e7d32;
  font-size: 14px;
}

.profit-rate {
  font-weight: 600;
  color: #1976d2;
  font-size: 14px;
}

.product-quantity {
  font-weight: 500;
  color: #333;
}

.quantity-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.quantity-value {
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
}

.status-info {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.status-item {
  display: inline-block;
}

.status-badge {
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 500;
  color: white;
  display: inline-block;
}

.status-badge.status-sufficient {
  background-color: #52c41a;
}

.status-badge.status-insufficient {
  background-color: #faad14;
}

.status-badge.status-out-of-stock {
  background-color: #ff4d4f;
}

.status-badge.status-unknown {
  background-color: #d9d9d9;
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

/* 销售渠道标签样式 */
.channel-tag {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  color: white;
}

.channel-tag.online {
  background-color: #3b82f6;
}

.channel-tag.offline {
  background-color: #10b981;
}

.channel-tag.wholesale {
  background-color: #f59e0b;
}

.channel-tag.retail {
  background-color: #8b5cf6;
}

.channel-tag.export {
  background-color: #ef4444;
}

.channel-tag.other,
.channel-tag.default {
  background-color: #6b7280;
}

/* 操作按钮样式 */
.actions {
  white-space: nowrap;
}

.actions .btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  padding: 6px;
  width: 32px;
  height: 32px;
  font-size: 14px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.actions .btn:last-child {
  margin-right: 0;
}

.actions .btn i {
  font-size: 14px;
}

.actions .btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.actions .btn-danger:hover {
  background-color: #dc3545;
  border-color: #dc3545;
  color: white;
}

</style>