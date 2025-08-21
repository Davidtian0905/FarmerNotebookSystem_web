<template>
  <div class="outbound-form">
    <form @submit.prevent="handleSubmit">
      <!-- 基本信息 -->
      <div class="form-section">
        <h3 class="section-title">基本信息</h3>
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label required">物料名称</label>
            <select v-model="formData.materialId" class="form-control" required>
              <option value="">请选择物料</option>
              <option v-for="material in materials" :key="material.id" :value="material.id">
                {{ material.name }} ({{ material.code }})
              </option>
            </select>
          </div>
          
          <div class="form-group">
            <label class="form-label">物料类型</label>
            <input 
              type="text" 
              class="form-control" 
              :value="selectedMaterialType"
              readonly
            >
          </div>
          
          <div class="form-group">
            <label class="form-label">物料等级</label>
            <input 
              type="text" 
              class="form-control" 
              :value="selectedMaterialGrade"
              readonly
            >
          </div>
          
          <div class="form-group">
            <label class="form-label">单位</label>
            <input 
              type="text" 
              class="form-control" 
              :value="selectedMaterialUnit"
              readonly
            >
          </div>
          
          <div class="form-group">
            <label class="form-label">物料编码</label>
            <input 
              type="text" 
              class="form-control" 
              :value="selectedMaterialCode"
              readonly
            >
          </div>
          
          <div class="form-group">
            <label class="form-label required">批次号</label>
            <select v-model="formData.batchNumber" class="form-control" required>
              <option value="">请选择批次</option>
              <option v-for="batch in availableBatches" :key="batch.batchNumber" :value="batch.batchNumber">
                {{ batch.batchNumber }} (库存: {{ batch.availableQuantity }}{{ selectedMaterialUnit }})
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- 数量和价格 -->
      <div class="form-section">
        <h3 class="section-title">数量和价格</h3>
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label required">出库数量</label>
            <div class="quantity-input">
              <input 
                type="number" 
                v-model.number="formData.quantity" 
                class="form-control"
                :max="maxAvailableQuantity"
                min="0.01"
                step="0.01"
                required
                @input="calculateTotalPrice"
              >
              <span class="unit-label">{{ selectedMaterialUnit }}</span>
            </div>
            <div class="quantity-info">
              <span class="available-stock">可用库存: {{ maxAvailableQuantity }}{{ selectedMaterialUnit }}</span>
            </div>
          </div>
          
          <div class="form-group">
            <label class="form-label required">单价</label>
            <div class="price-input">
              <span class="currency">¥</span>
              <input 
                type="number" 
                v-model.number="formData.unitPrice" 
                class="form-control"
                min="0.01"
                step="0.01"
                required
                @input="calculateTotalPrice"
              >
            </div>
          </div>
          
          <div class="form-group">
            <label class="form-label">总价</label>
            <div class="total-price">
              <span class="currency">¥</span>
              <input 
                type="text" 
                class="form-control total-input"
                :value="totalPrice.toFixed(2)"
                readonly
              >
            </div>
          </div>
        </div>
        
        <!-- 快速数量选择 -->
        <div class="quick-quantity" v-if="maxAvailableQuantity > 0">
          <label class="form-label">快速选择数量:</label>
          <div class="quantity-buttons">
            <button 
              type="button" 
              class="quantity-btn"
              @click="setQuantity(maxAvailableQuantity * 0.25)"
            >
              25%
            </button>
            <button 
              type="button" 
              class="quantity-btn"
              @click="setQuantity(maxAvailableQuantity * 0.5)"
            >
              50%
            </button>
            <button 
              type="button" 
              class="quantity-btn"
              @click="setQuantity(maxAvailableQuantity * 0.75)"
            >
              75%
            </button>
            <button 
              type="button" 
              class="quantity-btn"
              @click="setQuantity(maxAvailableQuantity)"
            >
              全部
            </button>
          </div>
        </div>
      </div>

      <!-- 客户信息 -->
      <div class="form-section">
        <h3 class="section-title">客户信息</h3>
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label required">客户</label>
            <select v-model="formData.customerId" class="form-control" required>
              <option value="">请选择客户</option>
              <option v-for="customer in customers" :key="customer.id" :value="customer.id">
                {{ customer.name }} - {{ customer.contactPerson }}
              </option>
            </select>
          </div>
          
          <div class="form-group" v-if="selectedCustomer">
            <label class="form-label">联系电话</label>
            <input 
              type="text" 
              class="form-control" 
              :value="selectedCustomer.phone"
              readonly
            >
          </div>
          
          <div class="form-group" v-if="selectedCustomer">
            <label class="form-label">客户地址</label>
            <input 
              type="text" 
              class="form-control" 
              :value="selectedCustomer.address"
              readonly
            >
          </div>
        </div>
      </div>

      <!-- 出库信息 -->
      <div class="form-section">
        <h3 class="section-title">出库信息</h3>
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label required">出库类型</label>
            <select v-model="formData.outboundType" class="form-control" required>
              <option value="">请选择出库类型</option>
              <option value="sale">销售出库</option>
              <option value="transfer">调拨出库</option>
              <option value="return">退货出库</option>
              <option value="loss">损耗出库</option>
              <option value="sample">样品出库</option>
            </select>
          </div>
          
          <div class="form-group">
            <label class="form-label required">仓库位置</label>
            <select v-model="formData.warehouseLocation" class="form-control" required>
              <option value="">请选择仓库位置</option>
              <option v-for="location in warehouseLocations" :key="location" :value="location">
                {{ location }}
              </option>
            </select>
          </div>
          
          <div class="form-group">
            <label class="form-label required">出库时间</label>
            <input 
              type="datetime-local" 
              v-model="formData.outboundTime" 
              class="form-control"
              required
            >
          </div>
        </div>
      </div>

      <!-- 商品组合选择 -->
      <div class="form-section" v-if="formData.outboundType === 'sale'">
        <h3 class="section-title">商品组合 <span class="optional">(可选)</span></h3>
        <div class="combo-selection">
          <div class="combo-toggle">
            <label class="checkbox-label">
              <input type="checkbox" v-model="useCombo" @change="toggleCombo">
              使用商品组合
            </label>
          </div>
          
          <div v-if="useCombo" class="combo-options">
            <div class="form-group">
              <label class="form-label">选择商品组合</label>
              <select v-model="formData.comboId" class="form-control">
                <option value="">请选择商品组合</option>
                <option v-for="combo in productCombos" :key="combo.id" :value="combo.id">
                  {{ combo.name }} - ¥{{ combo.price.toFixed(2) }}
                </option>
              </select>
            </div>
            
            <div v-if="selectedCombo" class="combo-details">
              <h4>组合详情</h4>
              <div class="combo-materials">
                <div v-for="material in selectedCombo.materials" :key="material.id" class="combo-material">
                  <span class="material-name">{{ material.name }}</span>
                  <span class="material-quantity">{{ material.quantity }}{{ material.unit }}</span>
                </div>
              </div>
              <div class="combo-pricing">
                <div class="pricing-item">
                  <span>总成本: ¥{{ selectedCombo.totalCost.toFixed(2) }}</span>
                </div>
                <div class="pricing-item">
                  <span>利润率: {{ selectedCombo.profitRate }}%</span>
                </div>
                <div class="pricing-item total">
                  <span>组合价格: ¥{{ selectedCombo.price.toFixed(2) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 附加信息 -->
      <div class="form-section">
        <h3 class="section-title">附加信息</h3>
        <div class="form-group">
          <label class="form-label">备注说明</label>
          <textarea 
            v-model="formData.remarks" 
            class="form-control textarea"
            rows="4"
            placeholder="请输入出库备注信息..."
          ></textarea>
        </div>
      </div>

      <!-- 表单操作 -->
      <div class="form-actions">
        <button type="button" class="btn btn-outline" @click="handleCancel">
          取消
        </button>
        <button type="submit" class="btn btn-primary" :disabled="!isFormValid">
          <i class="icon-check"></i>
          确认出库
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { 
  getMaterialOptions, 
  getMaterialTypeOptions, 
  getMaterialGradeOptions, 
  getWarehouseLocationOptions, 
  getCustomerOptions,
  getProductCombos,
  getWarehouseData
} from '@/mock/warehouse_data.js'

export default {
  name: 'OutboundForm',
  emits: ['submit', 'cancel'],
  setup(props, { emit }) {
    // 响应式数据
    const materials = ref([])
    const materialTypes = ref([])
    const materialGrades = ref([])
    const warehouseLocations = ref([])
    const customers = ref([])
    const productCombos = ref([])
    const availableBatches = ref([])
    const useCombo = ref(false)
    
    // 表单数据
    const formData = reactive({
      materialId: '',
      batchNumber: '',
      quantity: 0,
      unitPrice: 0,
      customerId: '',
      outboundType: '',
      warehouseLocation: '',
      outboundTime: '',
      comboId: '',
      remarks: ''
    })

    // 计算属性
    const selectedMaterial = computed(() => {
      return materials.value.find(m => m.id === formData.materialId)
    })

    const selectedMaterialType = computed(() => {
      if (!selectedMaterial.value) return ''
      // 现在直接返回中文名称，因为数据已经是中文
      return selectedMaterial.value.materialType || ''
    })

    const selectedMaterialGrade = computed(() => {
      if (!selectedMaterial.value) return ''
      // 现在直接返回中文名称，因为数据已经是中文
      return selectedMaterial.value.materialGrade || ''
    })

    const selectedMaterialUnit = computed(() => {
      return selectedMaterial.value ? selectedMaterial.value.unit : ''
    })

    const selectedMaterialCode = computed(() => {
      return selectedMaterial.value ? selectedMaterial.value.code : ''
    })

    const selectedCustomer = computed(() => {
      return customers.value.find(c => c.id === formData.customerId)
    })

    const selectedCombo = computed(() => {
      return productCombos.value.find(c => c.id === formData.comboId)
    })

    const selectedBatch = computed(() => {
      return availableBatches.value.find(b => b.batchNumber === formData.batchNumber)
    })

    const maxAvailableQuantity = computed(() => {
      return selectedBatch.value ? selectedBatch.value.availableQuantity : 0
    })

    const totalPrice = computed(() => {
      return formData.quantity * formData.unitPrice
    })

    const isFormValid = computed(() => {
      return formData.materialId && 
             formData.batchNumber && 
             formData.quantity > 0 && 
             formData.quantity <= maxAvailableQuantity.value &&
             formData.unitPrice > 0 && 
             formData.customerId && 
             formData.outboundType && 
             formData.warehouseLocation && 
             formData.outboundTime
    })

    // 方法
    const loadData = async () => {
      try {
        materials.value = await getMaterialOptions()
        materialTypes.value = await getMaterialTypeOptions()
        materialGrades.value = await getMaterialGradeOptions()
        warehouseLocations.value = await getWarehouseLocationOptions()
        customers.value = await getCustomerOptions()
        productCombos.value = await getProductCombos()
      } catch (error) {
        console.error('加载数据失败:', error)
      }
    }

    const loadAvailableBatches = async () => {
      if (!formData.materialId) {
        availableBatches.value = []
        return
      }
      
      try {
        // 从仓库数据中获取该物料的可用批次
        const warehouseData = await getWarehouseData()
        const inboundRecords = warehouseData.records.filter(r => 
          r.type === 'inbound' && 
          r.materialId === formData.materialId &&
          r.status === 'completed'
        )
        
        // 计算每个批次的可用库存
        const batchMap = new Map()
        
        // 统计入库数量
        inboundRecords.forEach(record => {
          const key = record.batchNumber
          if (!batchMap.has(key)) {
            batchMap.set(key, {
              batchNumber: record.batchNumber,
              inboundQuantity: 0,
              outboundQuantity: 0,
              availableQuantity: 0
            })
          }
          batchMap.get(key).inboundQuantity += record.quantity
        })
        
        // 统计出库数量
        const outboundRecords = warehouseData.records.filter(r => 
          r.type === 'outbound' && 
          r.materialId === formData.materialId &&
          r.status === 'completed'
        )
        
        outboundRecords.forEach(record => {
          const key = record.batchNumber
          if (batchMap.has(key)) {
            batchMap.get(key).outboundQuantity += record.quantity
          }
        })
        
        // 计算可用库存
        batchMap.forEach(batch => {
          batch.availableQuantity = batch.inboundQuantity - batch.outboundQuantity
        })
        
        // 只显示有库存的批次
        availableBatches.value = Array.from(batchMap.values())
          .filter(batch => batch.availableQuantity > 0)
          .sort((a, b) => b.availableQuantity - a.availableQuantity)
        
      } catch (error) {
        console.error('加载批次数据失败:', error)
        availableBatches.value = []
      }
    }

    const calculateTotalPrice = () => {
      // 总价会通过计算属性自动更新
    }

    const setQuantity = (quantity) => {
      formData.quantity = Math.round(quantity * 100) / 100 // 保留两位小数
      calculateTotalPrice()
    }

    const toggleCombo = () => {
      if (!useCombo.value) {
        formData.comboId = ''
      }
    }

    const initializeDateTime = () => {
      const now = new Date()
      const year = now.getFullYear()
      const month = String(now.getMonth() + 1).padStart(2, '0')
      const day = String(now.getDate()).padStart(2, '0')
      const hours = String(now.getHours()).padStart(2, '0')
      const minutes = String(now.getMinutes()).padStart(2, '0')
      
      formData.outboundTime = `${year}-${month}-${day}T${hours}:${minutes}`
    }

    const handleSubmit = () => {
      if (!isFormValid.value) {
        alert('请填写完整的表单信息')
        return
      }
      
      if (formData.quantity > maxAvailableQuantity.value) {
        alert('出库数量不能超过可用库存')
        return
      }
      
      const submitData = {
        ...formData,
        materialName: selectedMaterial.value?.name,
        materialCode: selectedMaterial.value?.code,
        materialType: selectedMaterial.value?.materialType,
        materialGrade: selectedMaterial.value?.materialGrade,
        unit: selectedMaterial.value?.unit,
        totalPrice: totalPrice.value,
        customerName: selectedCustomer.value?.name,
        comboName: selectedCombo.value?.name,
        status: 'pending',
        type: 'outbound',
        createdAt: new Date().toISOString()
      }
      
      emit('submit', submitData)
    }

    const handleCancel = () => {
      emit('cancel')
    }

    // 监听器
    watch(() => formData.materialId, () => {
      formData.batchNumber = ''
      formData.quantity = 0
      loadAvailableBatches()
    })

    watch(() => formData.batchNumber, () => {
      formData.quantity = 0
    })

    // 生命周期
    onMounted(() => {
      loadData()
      initializeDateTime()
    })

    return {
      // 数据
      materials,
      materialTypes,
      materialGrades,
      warehouseLocations,
      customers,
      productCombos,
      availableBatches,
      useCombo,
      formData,
      
      // 计算属性
      selectedMaterial,
      selectedMaterialType,
      selectedMaterialGrade,
      selectedMaterialUnit,
      selectedMaterialCode,
      selectedCustomer,
      selectedCombo,
      selectedBatch,
      maxAvailableQuantity,
      totalPrice,
      isFormValid,
      
      // 方法
      calculateTotalPrice,
      setQuantity,
      toggleCombo,
      handleSubmit,
      handleCancel
    }
  }
}
</script>

<style scoped>
.outbound-form {
  max-width: 800px;
  margin: 0 auto;
}

/* 表单区域 */
.form-section {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.optional {
  font-size: 14px;
  font-weight: 400;
  color: #666;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-label {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 6px;
}

.form-label.required::after {
  content: ' *';
  color: #e53e3e;
}

.form-control {
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.form-control:focus {
  outline: none;
  border-color: #1976d2;
  box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.1);
}

.form-control:read-only {
  background-color: #f5f5f5;
  color: #666;
}

.textarea {
  resize: vertical;
  min-height: 80px;
}

/* 数量输入 */
.quantity-input {
  position: relative;
  display: flex;
  align-items: center;
}

.quantity-input input {
  flex: 1;
  padding-right: 50px;
}

.unit-label {
  position: absolute;
  right: 12px;
  color: #666;
  font-size: 14px;
  pointer-events: none;
}

.quantity-info {
  margin-top: 4px;
}

.available-stock {
  font-size: 12px;
  color: #666;
}

/* 价格输入 */
.price-input {
  position: relative;
  display: flex;
  align-items: center;
}

.price-input .currency {
  position: absolute;
  left: 12px;
  color: #666;
  font-size: 14px;
  pointer-events: none;
}

.price-input input {
  padding-left: 28px;
}

.total-price {
  position: relative;
  display: flex;
  align-items: center;
}

.total-price .currency {
  position: absolute;
  left: 12px;
  color: #1976d2;
  font-weight: 600;
  font-size: 14px;
  pointer-events: none;
}

.total-input {
  padding-left: 28px;
  font-weight: 600;
  color: #1976d2;
}

/* 快速数量选择 */
.quick-quantity {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e0e0e0;
}

.quantity-buttons {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.quantity-btn {
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  color: #333;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;
}

.quantity-btn:hover {
  background: #f0f0f0;
  border-color: #1976d2;
}

/* 商品组合 */
.combo-selection {
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  padding: 16px;
  background: white;
}

.combo-toggle {
  margin-bottom: 16px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
}

.checkbox-label input[type="checkbox"] {
  width: 16px;
  height: 16px;
}

.combo-options {
  border-top: 1px solid #f0f0f0;
  padding-top: 16px;
}

.combo-details {
  margin-top: 16px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 6px;
}

.combo-details h4 {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 12px 0;
}

.combo-materials {
  margin-bottom: 12px;
}

.combo-material {
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
  border-top: 1px solid #e0e0e0;
  padding-top: 12px;
}

.pricing-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
  font-size: 14px;
  color: #666;
}

.pricing-item.total {
  font-weight: 600;
  color: #1976d2;
  font-size: 16px;
}

/* 表单操作 */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 20px;
  border-top: 1px solid #e0e0e0;
}

.btn {
  padding: 10px 20px;
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

.btn:disabled:hover {
  background: white;
}

.btn.btn-primary:disabled:hover {
  background: #1976d2;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .outbound-form {
    padding: 0;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .quantity-buttons {
    flex-wrap: wrap;
  }
  
  .form-actions {
    flex-direction: column;
  }
}
</style>