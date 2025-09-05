<template>
  <Layout>
    <div class="product-mix-page">
      <!-- 页面头部 -->
      <div class="page-header">
        <div class="header-left">
          <h1 class="page-title">{{ isEditMode ? '编辑商品组合' : '商品组合' }}</h1>
          <p class="page-subtitle">{{ isEditMode ? '编辑现有商品的物料组合配置' : '创建和管理商品的物料组合配置' }}</p>
        </div>
        <div class="header-right">
          <button class="btn btn-secondary" @click="$router.push('/outbound-records')">
            <i class="fas fa-arrow-left"></i>
            返回列表
          </button>
        </div>
      </div>

      <!-- 表单内容 -->
      <form @submit.prevent="handleSubmit" class="product-mix-form">
        <!-- 商品信息 -->
        <div class="form-section">
          <div class="section-header">
            <h3 class="section-title">商品信息</h3>
          </div>
          <div class="section-content">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div class="form-group">
                <label class="form-label required">商品名称</label>
                <input 
                  v-model="formData.productName" 
                  type="text" 
                  class="form-input" 
                  placeholder="请输入商品名称"
                  required
                  @input="generateProductCode"
                >
              </div>
              <div class="form-group">
                <label class="form-label">商品编码</label>
                <div class="input-group">
                  <input 
                    v-model="formData.productCode" 
                    type="text" 
                    class="form-input" 
                    placeholder="自动生成或手动输入"
                    readonly
                  >
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 物料组合 -->
      <div class="form-section">
          <div class="section-header">
            <h3 class="section-title">物料组合</h3>
            <p class="section-subtitle">选择组成商品的物料及其数量</p>
          </div>
          <div class="section-content">
            <!-- 物料列表 -->
            <div class="material-list">
              <div class="material-table">
                <div class="table-header">
                  <div class="table-cell">物料名称</div>
                  <div class="table-cell">当前库存</div>
                  <div class="table-cell">数量</div>
                  <div class="table-cell">单位</div>
                  <div class="table-cell">单价</div>
                  <div class="table-cell">小计</div>
                  <div class="table-cell">操作</div>
                </div>
                <div 
                  v-for="(material, index) in formData.materials" 
                  :key="index" 
                  class="table-row"
                >
                  <div class="table-cell">
                    <div class="material-select-wrapper">
                      <input 
                        v-model="material.materialName" 
                        type="text" 
                        class="form-input" 
                        placeholder="搜索物料名称"
                        @input="searchMaterials(index, $event.target.value)"
                        @focus="showMaterialDropdown[index] = true"
                      >
                      <!-- 物料搜索下拉列表 -->
                      <div 
                        v-if="showMaterialDropdown[index] && materialSearchResults[index]?.length > 0" 
                        class="search-results-dropdown"
                      >
                        <div 
                          v-for="result in materialSearchResults[index]" 
                          :key="result.materialCode" 
                          class="search-result-item"
                          @click="selectMaterial(index, result)"
                        >
                          <div class="material-info">
                            <div class="material-name">{{ result.materialName }}</div>
                            <div class="material-details">
                              <span class="material-code">编号: {{ result.materialCode }}</span>
                              <span v-if="result.materialType" class="material-type">类型: {{ result.materialType }}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="table-cell">
                    <span class="stock-text">{{ material.currentStock || 0 }} {{ material.unit }}</span>
                  </div>
                  <div class="table-cell">
                    <input 
                      v-model.number="material.quantity" 
                      type="number" 
                      class="form-input" 
                      min="0" 
                      step="0.01"
                      @input="updateMaterialCost(index)"
                    >
                  </div>
                  <div class="table-cell">
                    <span class="unit-text">{{ material.unit }}</span>
                  </div>
                  <div class="table-cell">
                    <span class="price-text">¥{{ material.unitPrice.toFixed(2) }}</span>
                  </div>
                  <div class="table-cell">
                    <span class="subtotal-text">¥{{ (material.quantity * material.unitPrice).toFixed(2) }}</span>
                  </div>
                  <div class="table-cell">
                    <button 
                      type="button" 
                      @click="removeMaterial(index)" 
                      class="btn btn-danger btn-sm"
                      :disabled="formData.materials.length <= 1"
                    >
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
              
              <!-- 添加物料按钮 -->
              <div class="add-material-section">
                <button 
                  type="button" 
                  @click="addMaterial" 
                  class="btn btn-outline"
                >
                  <i class="fas fa-plus"></i>
                  添加物料
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 成本汇总 -->
        <div class="form-section">
          <div class="section-header">
            <h3 class="section-title">成本汇总</h3>
          </div>
          <div class="section-content">
            <div class="cost-summary">
              <div class="cost-item">
                <span class="cost-label">物料成本:</span>
                <span class="cost-value">¥{{ totalMaterialCost.toFixed(2) }}</span>
              </div>
              <div class="cost-item">
                <span class="cost-label">利润率:</span>
                <div class="profit-input">
                  <input 
                    v-model.number="formData.profitRate" 
                    type="number" 
                    class="form-input profit-rate-input" 
                    min="0" 
                    max="100" 
                    step="0.1"
                    @input="updateSuggestedPrice"
                  >
                  <span class="profit-unit">%</span>
                </div>
              </div>
              <div class="cost-item">
                <span class="cost-label">建议售价:</span>
                <span class="cost-value suggested-price">¥{{ suggestedPrice.toFixed(2) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 商品定价 -->
        <div class="form-section">
          <div class="section-header">
            <h3 class="section-title">商品定价</h3>
          </div>
          <div class="section-content">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div class="form-group">
                <label class="form-label required">商品定价</label>
                <div class="price-input-wrapper">
                  <span class="price-symbol">¥</span>
                  <input 
                    v-model.number="formData.sellingPrice" 
                    type="number" 
                    class="form-input price-input" 
                    min="0" 
                    step="0.01"
                    placeholder="0.00"
                    @input="updateActualProfit"
                    required
                  >
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">预期利润</label>
                <div class="profit-display">
                  <span class="profit-amount">¥{{ actualProfit.toFixed(2) }}</span>
                  <span class="profit-percentage">({{ actualProfitRate.toFixed(1) }}%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 商品数量设置 -->
        <div class="form-section">
          <div class="section-header">
            <h3 class="section-title">商品数量设置</h3>
          </div>
          <div class="section-content">
            <div class="quantity-section">
              <div class="form-group quantity-unit-group">
                <div class="quantity-input-group">
                  <div class="quantity-field">
                    <label class="form-label required">商品数量</label>
                    <input 
                      v-model.number="formData.productQuantity" 
                      type="number" 
                      class="form-input quantity-input" 
                      min="1" 
                      step="1"
                      placeholder="1"
                      @input="updateMaterialInventory"
                      required
                    >
                  </div>
                  <div class="unit-field">
                    <label class="form-label required">商品单位</label>
                    <select v-model="formData.unit" class="form-input" required>
                      <option value="">请选择单位</option>
                      <option value="套">套</option>
                      <option value="盒">盒</option>
                      <option value="包">包</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 物料库存扣除预览 -->
        <div class="form-section">
          <div class="section-header">
            <h3 class="section-title">物料库存扣除预览</h3>
          </div>
          <div class="section-content">
            <div class="materials-preview">
              <table class="preview-table">
                  <thead>
                  <tr>
                    <th>物料名称</th>
                    <th>物料数量单位</th>
                    <th>扣减库存</th>
                    <th>总扣除量</th>
                    <th>当前库存总量</th>
                    <th>扣除后库存总量</th>
                    <th>状态</th>
                  </tr>
                </thead>
                <tbody>
                  <tr 
                    v-for="(material, index) in formData.materials" 
                    :key="index" 
                    :class="{ 'insufficient-stock': isInsufficientStock(material) }"
                  >
                    <td>
                      <span class="material-name">{{ material.materialName }}</span>
                    </td>
                    <td>
                      <span class="usage-amount">{{ material.quantity }} {{ material.unit }}</span>
                    </td>
                    <td>
                      <label class="checkbox-wrapper">
                        <input 
                          v-model="material.deductMaterial" 
                          type="checkbox" 
                          class="checkbox-input"
                          @change="updateMaterialInventory"
                        >
                        <span class="checkbox-label">扣减</span>
                      </label>
                    </td>
                    <td>
                      <span class="total-deduction">{{ material.deductMaterial ? (material.quantity * formData.productQuantity).toFixed(2) : '0.00' }} {{ material.unit }}</span>
                    </td>
                    <td>
                      <span class="current-stock">{{ material.currentStock || 0 }} {{ material.unit }}</span>
                    </td>
                    <td>
                      <span class="remaining-stock">{{ getRemainingStock(material) }} {{ material.unit }}</span>
                    </td>
                    <td>
                      <span 
                        class="stock-status"
                        :class="{
                          'status-sufficient': !isInsufficientStock(material),
                          'status-insufficient': isInsufficientStock(material)
                        }"
                      >
                        {{ isInsufficientStock(material) ? '库存不足' : '库存充足' }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>


        <!-- 商品描述 -->
        <div class="form-section">
          <div class="section-header">
            <h3 class="section-title">商品描述</h3>
          </div>
          <div class="section-content">
            <div class="form-group">
              <label class="form-label">商品描述</label>
              <textarea 
                v-model="formData.description" 
                class="form-input" 
                rows="3" 
                placeholder="请输入商品描述"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- 商品图片 -->
        <div class="form-section">
          <div class="section-header">
            <h3 class="section-title">商品图片</h3>
          </div>
          <div class="section-content">
            <div class="image-upload-section">
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
        </div>

        <!-- 提交按钮 -->
        <div class="form-actions">
          <button type="button" @click="saveAsTemplate" class="btn btn-outline">
            保存为模板
          </button>
          <button type="submit" class="btn btn-primary" :disabled="loading || hasInsufficientStock">
            <span v-if="loading">{{ isEditMode ? '更新中...' : '保存中...' }}</span>
            <span v-else>{{ isEditMode ? '确认更新' : '确认保存' }}</span>
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
              class="form-input"
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

<script>
import { getAllTransactions } from '../mock/database_flow'
import { getOutboundRecordById } from '../mock/outbound_data'

export default {
  name: 'OutboundProductMix',
  data() {
    return {
      // 表单数据
      formData: {
        // 基本信息
        productName: '',
        productCode: '',
        unit: '盒',
        description: '',
        
        // 物料组合
        materials: [
          {
            materialName: '',
            materialCode: '',
            unit: '',
            quantity: 0,
            unitPrice: 0,
            deductMaterial: true,
            currentStock: 0
          }
        ],
        
        // 定价信息
        profitRate: 20, // 默认利润率20%
        sellingPrice: 0,
        
        // 数量设置
        productQuantity: 1,
        
        // 图片
        images: []
      },
      
      // 状态管理
      loading: false,
      
      // 物料搜索相关
      showMaterialDropdown: {},
      materialSearchResults: {},
      
      // 模板保存相关
      showTemplateNameModal: false,
      templateName: '',
      
      // 编辑模式相关
      isEditMode: false,
      editRecordId: null,
      originalRecord: null
    }
  },
  
  computed: {
    // 计算总物料成本
    totalMaterialCost() {
      return this.formData.materials.reduce((total, material) => {
        return total + (material.quantity * material.unitPrice)
      }, 0)
    },
    
    // 计算建议售价
    suggestedPrice() {
      return this.totalMaterialCost * (1 + this.formData.profitRate / 100)
    },
    
    // 计算实际利润
    actualProfit() {
      return this.formData.sellingPrice - this.totalMaterialCost
    },
    
    // 计算实际利润率
    actualProfitRate() {
      if (this.totalMaterialCost === 0) return 0
      return (this.actualProfit / this.totalMaterialCost) * 100
    },
    
    // 检查是否有库存不足的物料
    hasInsufficientStock() {
      return this.formData.materials.some(material => 
        material.deductMaterial && this.isInsufficientStock(material)
      )
    }
  },
  
  methods: {
    // 生成商品编码
    generateProductCode() {
      if (!this.formData.productName) return ''
      
      // 获取产品名称的前三个字符的首字母
      const nameChars = this.formData.productName.replace(/\s+/g, '').substring(0, 3)
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
            '叶': 'Y', '都': 'D', '匀': 'Y', '组': 'Z', '合': 'H',
            '产': 'C', '品': 'P', '混': 'H', '装': 'Z', '套': 'T',
            '礼': 'L', '盒': 'H', '包': 'B', '袋': 'D', '罐': 'G'
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
      
      this.formData.productCode = `P_${prefix}${year}${month}${day}${hour}${minute}${second}`
    },
    
    // 添加物料
    addMaterial() {
      this.formData.materials.push({
        materialName: '',
        materialCode: '',
        unit: '',
        quantity: 0,
        unitPrice: 0,
        deductMaterial: true,
        currentStock: 0
      })
    },
    
    // 移除物料
    removeMaterial(index) {
      if (this.formData.materials.length > 1) {
        this.formData.materials.splice(index, 1)
        // 清理相关的搜索状态
        delete this.showMaterialDropdown[index]
        delete this.materialSearchResults[index]
      }
    },
    
    // 搜索物料
    async searchMaterials(index, query) {
      if (!query || query.length < 2) {
        this.materialSearchResults[index] = []
        return
      }
      
      try {
        // 从数据库获取所有入库记录
        const allTransactions = getAllTransactions()
        const inboundRecords = allTransactions.filter(record => record.type === 'INBOUND')
        
        // 按物料编码分组，计算库存
        const materialMap = new Map()
        
        inboundRecords.forEach(record => {
          const key = `${record.materialName}_${record.materialCode}`
          if (materialMap.has(key)) {
            const existing = materialMap.get(key)
            existing.quantity += record.quantity
            existing.amount += record.amount
          } else {
            materialMap.set(key, {
              materialCode: record.materialCode,
              materialName: record.materialName,
              materialType: record.materialType || '',
              materialGrade: record.materialGrade || '',
              unit: record.unit,
              unitPrice: record.unitPrice,
              supplier: record.supplier || record.supplierName || '',
              currentStock: record.quantity
            })
          }
        })
        
        // 转换为数组并过滤搜索结果
        const materials = Array.from(materialMap.values())
        const results = materials.filter(material => 
          material.materialName.toLowerCase().includes(query.toLowerCase()) || 
          material.materialCode.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 10) // 限制结果数量为10个
        
        this.materialSearchResults[index] = results
        this.showMaterialDropdown[index] = results.length > 0
      } catch (error) {
        console.error('搜索物料失败:', error)
        this.materialSearchResults[index] = []
      }
    },
    
    // 选择物料
    selectMaterial(index, material) {
      this.formData.materials[index] = {
        ...this.formData.materials[index],
        materialName: material.materialName,
        materialCode: material.materialCode,
        materialType: material.materialType,
        materialGrade: material.materialGrade,
        unit: material.unit,
        unitPrice: material.unitPrice,
        supplier: material.supplier,
        currentStock: material.currentStock
      }
      
      // 隐藏下拉列表
      this.showMaterialDropdown[index] = false
      this.materialSearchResults[index] = []
      
      // 更新成本计算
      this.updateMaterialCost(index)
    },
    
    // 更新物料成本
    updateMaterialCost(index) {
      // 计算属性会自动响应数据变化，无需强制更新
    },
    
    // 更新建议售价
    updateSuggestedPrice() {
      // 建议售价会通过计算属性自动更新
    },
    
    // 更新实际利润
    updateActualProfit() {
      // 实际利润会通过计算属性自动更新
    },
    

    
    // 检查库存是否不足
    isInsufficientStock(material) {
      if (!material.deductMaterial) return false;
      const totalDeduction = material.quantity * this.formData.productQuantity;
      return totalDeduction > (material.currentStock || 0);
    },
    
    // 获取剩余库存
    getRemainingStock(material) {
      if (!material.deductMaterial) {
        return (material.currentStock || 0).toFixed(2)
      }
      const totalDeduction = material.quantity * this.formData.productQuantity
      const remaining = (material.currentStock || 0) - totalDeduction
      return Math.max(0, remaining).toFixed(2)
    },
    
    // 更新物料库存状态
    updateMaterialInventory() {
      // 当复选框状态改变时，重新计算库存状态
      this.$forceUpdate()
    },
    
    // 图片上传相关方法
    triggerFileInput() {
      this.$refs.fileInput.click()
    },
    
    handleFileSelect(event) {
      const files = Array.from(event.target.files)
      this.processFiles(files)
    },
    
    handleFileDrop(event) {
      const files = Array.from(event.dataTransfer.files)
      this.processFiles(files)
    },
    
    processFiles(files) {
      files.forEach((file, index) => {
        // 检查文件类型
        if (!file.type.startsWith('image/')) {
          this.$message.warning(`文件 ${file.name} 不是有效的图片格式`)
          return
        }
        
        // 检查文件大小 (5MB)
        if (file.size > 5 * 1024 * 1024) {
          this.$message.warning(`文件 ${file.name} 大小超过5MB限制`)
          return
        }
        
        // 生成预览URL
        const reader = new FileReader()
        reader.onload = (e) => {
          const imageData = {
            file: file,
            name: file.name,
            url: e.target.result,
            path: this.generateImagePath(index)
          }
          
          this.formData.images.push(imageData)
        }
        reader.readAsDataURL(file)
      })
      
      // 清空文件输入
      this.$refs.fileInput.value = ''
    },
    
    generateImagePath(index) {
      const timestamp = Date.now()
      const productCode = this.formData.productCode || 'TEMP'
      return `/uploads/products/${productCode}_${timestamp}_${index}.jpg`
    },
    
    removeImage(index) {
      this.formData.images.splice(index, 1)
    },
    
    // 保存为模板
    saveAsTemplate() {
      this.showTemplateNameModal = true
    },
    
    closeTemplateNameModal() {
      this.showTemplateNameModal = false
      this.templateName = ''
    },
    
    confirmSaveTemplate() {
      if (!this.templateName.trim()) return
      
      // 这里可以实现保存模板的逻辑
      console.log('保存模板:', this.templateName, this.formData)
      this.$message.success('模板保存成功')
      this.closeTemplateNameModal()
    },
    
    // 加载编辑记录数据
    async loadRecordForEdit(recordId) {
      try {
        console.log('开始加载记录，ID:', recordId)
        this.loading = true
        const record = await getOutboundRecordById(recordId)
        console.log('获取到的记录:', record)
        
        if (record) {
          // 保存原始记录
          this.originalRecord = record
          
          // 填充表单数据
          this.formData = {
            productName: record.productName || '',
            productCode: record.productCode || '',
            unit: record.unit || '盒',
            description: record.description || '',
            materials: record.materials ? record.materials.map(material => ({
              materialName: material.materialName || '',
              materialCode: material.materialCode || '',
              unit: material.unit || '',
              quantity: material.quantity || 0,
              unitPrice: material.unitPrice || 0,
              deductMaterial: material.deductMaterial !== false, // 默认为true
              currentStock: material.currentStock || 0
            })) : [{
              materialName: '',
              materialCode: '',
              unit: '',
              quantity: 0,
              unitPrice: 0,
              deductMaterial: true,
              currentStock: 0
            }],
            profitRate: record.profitRate || 20,
            sellingPrice: record.productPrice || 0,
            productQuantity: record.productQuantity || 1,
            images: record.images || []
          }
          console.log('表单数据填充完成:', this.formData)
        } else {
          console.warn('未找到记录，recordId:', recordId)
          this.$message.error('未找到指定的记录')
          this.$router.push('/outbound-records')
        }
      } catch (error) {
        console.error('加载记录失败，错误详情:', {
          message: error?.message || '未知错误',
          stack: error?.stack || '无堆栈信息',
          errorObject: error
        })
        this.$message.error(`加载记录失败: ${error?.message || '未知错误'}`)
        this.$router.push('/outbound-records')
      } finally {
        this.loading = false
      }
    },
    
    // 加载模板数据
    loadTemplateData(templateDataStr) {
      try {
        console.log('开始加载模板数据:', templateDataStr)
        const templateData = JSON.parse(templateDataStr)
        console.log('解析后的模板数据:', templateData)
        
        // 填充表单数据
        this.formData = {
          productName: templateData.productName || '',
          productCode: templateData.productCode || this.generateProductCode(),
          unit: templateData.unit || '盒',
          description: templateData.notes || '',
          materials: templateData.materials || [{
            materialName: '',
            materialCode: '',
            unit: '',
            quantity: 0,
            unitPrice: 0,
            deductMaterial: true,
            currentStock: 0
          }],
          profitRate: 20, // 默认利润率
          sellingPrice: templateData.unitPrice || 0,
          productQuantity: templateData.quantity || 1,
          images: []
        }
        
        console.log('模板数据填充完成:', this.formData)
        this.$message.success('模板数据加载成功')
      } catch (error) {
        console.error('加载模板数据失败:', error)
        this.$message.error('模板数据格式错误，请重试')
        // 如果模板数据加载失败，生成新的产品代码
        this.generateProductCode()
      }
    },
    
    // 提交表单
    async handleSubmit() {
      if (this.hasInsufficientStock) {
        this.$message.error('存在库存不足的物料，请检查后重试')
        return
      }
      
      this.loading = true
      
      try {
        // 处理物料扣减
        const deductedMaterials = []
        for (const material of this.formData.materials) {
          if (material.deductMaterial) {
            const deductionAmount = material.quantity * this.formData.productQuantity
            deductedMaterials.push({
              materialCode: material.materialCode,
              materialName: material.materialName,
              deductionAmount: deductionAmount,
              unit: material.unit,
              unitPrice: material.unitPrice
            })
            
            // 这里可以调用API扣减库存
            // await deductMaterialStock(material.materialCode, deductionAmount)
          }
        }
        
        // 准备提交数据
        const submitData = {
          ...this.formData,
          totalCost: this.totalMaterialCost,
          profitRate: this.actualProfitRate,
          deductedMaterials: deductedMaterials,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        
        // 调用保存API
        const { saveProductCombo } = await import('@/mock/outbound_data.js')
        await saveProductCombo(submitData)
        
        // 显示扣减信息
        if (deductedMaterials.length > 0) {
          const deductionInfo = deductedMaterials.map(m => 
            `${m.materialName}: ${m.deductionAmount} ${m.unit}`
          ).join('\n')
          this.$message.success(`商品组合保存成功！\n已扣减物料：\n${deductionInfo}`)
        } else {
          this.$message.success('商品组合保存成功')
        }
        
        this.$router.push('/outbound-records')
      } catch (error) {
        console.error('保存失败:', error)
        this.$message.error('保存失败，请重试')
      } finally {
        this.loading = false
      }
    }
  },
  
  async mounted() {
    try {
      // 检查路由参数，判断是否为编辑模式或模板模式
      const recordId = this.$route.query.id
      const mode = this.$route.query.mode
      const templateId = this.$route.query.templateId
      const templateData = this.$route.query.templateData
      
      if (recordId && mode === 'edit') {
        // 编辑模式
        this.isEditMode = true
        this.editRecordId = recordId
        await this.loadRecordForEdit(recordId)
      } else if (templateId && templateData) {
        // 模板模式
        this.isEditMode = false
        this.loadTemplateData(templateData)
      } else {
        // 新建模式
        this.isEditMode = false
        this.generateProductCode()
      }
    } catch (error) {
      console.error('页面初始化失败:', {
        message: error?.message || '未知错误',
        stack: error?.stack || '无堆栈信息',
        errorObject: error
      })
      this.$message.error('页面初始化失败，请刷新重试')
    }
    
    // 点击外部关闭下拉列表
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.material-select-wrapper')) {
        Object.keys(this.showMaterialDropdown).forEach(key => {
          this.showMaterialDropdown[key] = false
        })
      }
    })
  }
}
</script>

<style scoped>
/* 页面布局 */
.product-mix-page {
  padding: 24px;
  width: 100%;
  background: #f8fafc;
  min-height: 100vh;
}

/* 页面头部 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
  padding: 24px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.header-left .page-title {
  font-size: 28px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 8px 0;
}

.header-left .page-subtitle {
  color: #6b7280;
  margin: 0;
  font-size: 16px;
}

/* 表单样式 */
.product-mix-form {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.form-section {
  background: white;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  margin-bottom: 24px;
  overflow: hidden;
}

.form-section:last-child {
  border-bottom: none;
}

.section-header {
  background: #f9fafb;
  padding: 16px 20px;
  border-bottom: 1px solid #e5e7eb;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 8px 0;
}

.section-subtitle {
  color: #6b7280;
  margin: 0;
  font-size: 14px;
}

.section-content {
  padding: 20px;
}

/* 表单元素 */
.form-group {
  margin-bottom: 20px;
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
  color: #ef4444;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s ease;
  background: white;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-input:disabled {
  background: #f9fafb;
  color: #6b7280;
  cursor: not-allowed;
}

.form-input::placeholder {
  color: #9ca3af;
}

/* 按钮样式 */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;
  white-space: nowrap;
}

.btn-primary {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.btn-primary:hover:not(:disabled) {
  background: #2563eb;
  border-color: #2563eb;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.btn-primary:disabled {
  background: #9ca3af;
  border-color: #9ca3af;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.btn-secondary {
  background: #f3f4f6;
  color: #374151;
  border-color: #d1d5db;
}

.btn-secondary:hover {
  background: #e5e7eb;
  border-color: #9ca3af;
  transform: translateY(-1px);
}

.btn-outline {
  background: white;
  color: #3b82f6;
  border-color: #3b82f6;
}

.btn-outline:hover {
  background: #eff6ff;
  border-color: #2563eb;
  color: #2563eb;
  transform: translateY(-1px);
}

.btn-danger {
  background: #ef4444;
  color: white;
  border-color: #ef4444;
}

.btn-danger:hover:not(:disabled) {
  background: #dc2626;
  border-color: #dc2626;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

.btn-danger:disabled {
  background: #9ca3af;
  border-color: #9ca3af;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.btn-sm {
  padding: 8px 12px;
  font-size: 12px;
}

.btn i {
  margin-right: 6px;
  font-size: 12px;
}

/* 网格布局 */
.grid {
  display: grid;
}

.grid-cols-1 {
  grid-template-columns: repeat(1, minmax(0, 1fr));
}

.grid-cols-2 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.gap-6 {
  gap: 24px;
}

@media (min-width: 1024px) {
  .lg\:grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

/* 物料表格 */
.material-list {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
  overflow: visible;
}

.material-table {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: visible;
  background: white;
  margin-bottom: 16px;
}

.table-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr 1fr;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
  font-weight: 600;
  color: #374151;
}

.table-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr 1fr;
  border-bottom: 1px solid #f3f4f6;
  transition: background-color 0.2s ease;
}

.table-row:hover {
  background: #f8fafc;
}

.table-row:last-child {
  border-bottom: none;
}

.table-cell {
  padding: 12px 16px;
  display: flex;
  align-items: center;
  font-size: 14px;
  min-height: 60px;
}

.table-header .table-cell {
  font-weight: 600;
  color: #374151;
  background: #f9fafb;
  min-height: 48px;
}

/* 物料选择器 */
.material-select-wrapper {
  position: relative;
  width: 100%;
}

/* 搜索下拉列表 */
.search-results-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  z-index: 50;
  max-height: 240px;
  overflow-y: auto;
  margin-top: 4px;
}

.search-result-item {
  padding: 12px 16px;
  cursor: pointer;
  border-bottom: 1px solid #f3f4f6;
  transition: all 0.2s ease;
}

.search-result-item:last-child {
  border-bottom: none;
}

.search-result-item:hover {
  background-color: #f8fafc;
  transform: translateX(2px);
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
.material-price {
  background: #f3f4f6;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
}

.material-code {
  background: #dbeafe;
  color: #1d4ed8;
}

.material-type {
  background: #d1fae5;
  color: #065f46;
}

.material-price {
  background: #fef3c7;
  color: #92400e;
}

/* 添加物料按钮 */
.add-material-section {
  padding: 16px;
  text-align: center;
  border-top: 1px solid #f3f4f6;
  background: #fafbfc;
}

/* 成本汇总 */
.cost-summary {
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border: 1px solid #0ea5e9;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(14, 165, 233, 0.1);
}

.cost-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding: 8px 0;
}

.cost-item:last-child {
  margin-bottom: 0;
  border-top: 1px solid rgba(14, 165, 233, 0.2);
  padding-top: 16px;
  margin-top: 8px;
}

.cost-label {
  font-weight: 500;
  color: #374151;
  font-size: 16px;
}

.cost-value {
  font-weight: 600;
  color: #1f2937;
  font-size: 18px;
}

.suggested-price {
  color: #059669;
  font-size: 20px;
}

.profit-input {
  display: flex;
  align-items: center;
  gap: 8px;
}

.profit-rate-input {
  width: 80px;
  text-align: center;
  border-color: #0ea5e9;
}

.profit-rate-input:focus {
  border-color: #0284c7;
  box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
}

.profit-unit {
  font-weight: 500;
  color: #0ea5e9;
}

/* 定价显示 */
.price-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.price-symbol {
  position: absolute;
  left: 12px;
  color: #6b7280;
  font-weight: 500;
  z-index: 1;
}

.price-input {
  padding-left: 32px;
  font-weight: 600;
  color: #059669;
}

.profit-display {
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  border: 1px solid #22c55e;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 2px 8px rgba(34, 197, 94, 0.1);
}

.profit-amount {
  font-size: 18px;
  font-weight: 600;
  color: #059669;
}

.profit-percentage {
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
}

/* 数量设置 */
.quantity-section {
  margin-bottom: 24px;
}

.quantity-unit-group {
  margin-bottom: 0;
}

.quantity-input-group {
  display: flex;
  gap: 16px;
  align-items: flex-end;
}

.quantity-field {
  flex: 1;
  min-width: 0;
}

.unit-field {
  flex: 1;
  min-width: 0;
}

.quantity-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.quantity-input {
  padding-right: 60px;
  font-weight: 600;
  text-align: center;
}

.quantity-unit {
  position: absolute;
  right: 12px;
  color: #6b7280;
  font-weight: 500;
}

/* 物料预览表格 */
.materials-preview {
  width: 100%;
}

.preview-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.preview-table thead {
  background: #f8fafc;
}

.preview-table th {
  padding: 12px 16px;
  text-align: left;
  font-weight: 600;
  color: #374151;
  border-bottom: 2px solid #e5e7eb;
  font-size: 14px;
}

.preview-table td {
  padding: 12px 16px;
  border-bottom: 1px solid #f3f4f6;
  color: #4b5563;
  font-size: 14px;
}

.preview-table tbody tr:hover {
  background: #f9fafb;
}

.preview-table tbody tr.insufficient-stock {
  background: #fef2f2;
}

.preview-table tbody tr.insufficient-stock:hover {
  background: #fee2e2;
}

/* 库存预览 */
.inventory-preview {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.inventory-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.inventory-title::before {
  content: '📦';
  font-size: 18px;
}

.inventory-table {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
  background: white;
}

.inventory-table .table-header {
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr;
}

.inventory-table .table-row {
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr;
}

.insufficient-stock {
  background: #fef2f2;
  border-left: 4px solid #ef4444;
}

.insufficient-stock .table-cell {
  color: #991b1b;
}

.usage-amount,
.total-deduction,
.current-stock,
.remaining-stock {
  font-weight: 500;
}

.stock-status {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  text-align: center;
}

.status-sufficient {
  background: #d1fae5;
  color: #065f46;
}

.status-insufficient {
  background: #fee2e2;
  color: #991b1b;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

/* 复选框样式 */
.checkbox-wrapper {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.checkbox-wrapper:hover {
  background: #f3f4f6;
}

.checkbox-input {
  width: 16px;
  height: 16px;
  accent-color: #3b82f6;
  cursor: pointer;
}

.checkbox-label {
  font-size: 14px;
  color: #374151;
  cursor: pointer;
  font-weight: 500;
}

/* 图片上传 */
.image-upload-section {
  margin-bottom: 20px;
}

.upload-area {
  border: 2px dashed #d1d5db;
  border-radius: 12px;
  padding: 48px;
  text-align: center;
  background: #fafbfc;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.upload-area:hover {
  border-color: #3b82f6;
  background: #eff6ff;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.15);
}

.upload-area.dragover {
  border-color: #3b82f6;
  background: #dbeafe;
  border-style: solid;
  transform: scale(1.02);
}

.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.upload-content i {
  margin-bottom: 16px;
  color: #9ca3af;
  transition: color 0.2s ease;
}

.upload-area:hover .upload-content i {
  color: #3b82f6;
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
  transition: all 0.2s ease;
}

.image-preview-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.preview-image {
  width: 100%;
  height: 120px;
  object-fit: cover;
  display: block;
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
  transition: all 0.2s ease;
}

.remove-image-btn:hover {
  background: rgba(239, 68, 68, 0.8);
  transform: scale(1.1);
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
  backdrop-filter: blur(4px);
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
  transform: scale(0.9);
  animation: modalShow 0.2s ease forwards;
}

@keyframes modalShow {
  to {
    transform: scale(1);
  }
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
  transition: all 0.2s ease;
}

.modal-close-btn:hover {
  background: #f3f4f6;
  color: #374151;
  transform: rotate(90deg);
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

/* 工具类 */
.text-4xl {
  font-size: 2.25rem;
}

.text-gray-400 {
  color: #9ca3af;
}

.text-gray-600 {
  color: #4b5563;
}

.text-gray-500 {
  color: #6b7280;
}

.text-sm {
  font-size: 0.875rem;
}

.mb-4 {
  margin-bottom: 1rem;
}

.mb-2 {
  margin-bottom: 0.5rem;
}

/* 输入组合 */
.input-group {
  display: flex;
  gap: 8px;
  align-items: center;
}

.input-group .form-input {
  flex: 1;
}

/* 单位和价格文本 */
.unit-text,
.price-text,
.subtotal-text {
  font-weight: 500;
  color: #374151;
}

.price-text,
.subtotal-text {
  color: #059669;
  font-weight: 600;
}

.stock-text {
  font-weight: 500;
  color: #2c3e50;
  background-color: #ecf0f1;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 13px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .product-mix-page {
    padding: 16px;
  }
  
  .page-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
  
  .table-header,
  .table-row {
    grid-template-columns: 1fr;
    gap: 8px;
  }
  
  .table-cell {
    padding: 8px 12px;
    border-bottom: 1px solid #f3f4f6;
  }
  
  .table-cell:before {
    content: attr(data-label) ': ';
    font-weight: 600;
    color: #374151;
    display: inline-block;
    width: 100px;
  }
  
  .inventory-table .table-header,
  .inventory-table .table-row {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
    justify-content: center;
  }
}

/* 加载状态 */
.loading {
  opacity: 0.6;
  pointer-events: none;
}

/* 工具提示 */
.tooltip {
  position: relative;
}

.tooltip:hover::after {
  content: attr(data-tooltip);
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: #1f2937;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  z-index: 100;
}
</style>