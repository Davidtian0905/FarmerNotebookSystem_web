<template>
  <Layout>
    <div class="supplier-add">
      <div class="page-header">
        <div class="header-left">
          <h1 class="page-title">供应商管理</h1>
          <p class="page-subtitle">{{ isEdit ? '编辑供应商' : '添加新供应商' }}</p>
        </div>
        <div class="header-right">
          <button class="btn btn-secondary" @click="goBack">
            <i class="icon-arrow-left"></i>
            返回列表
          </button>
          <button class="btn btn-primary" @click="saveSupplier">
            <i class="icon-save"></i>
            {{ isEdit ? '保存修改' : '保存供应商' }}
          </button>
        </div>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- 基本信息 -->
      <div class="form-section">
        <div class="section-header">
          <h3 class="section-title">基本信息</h3>
        </div>
        <div class="section-content">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="form-group">
              <label class="form-label required">供应商名称</label>
              <input 
                v-model="supplierForm.suppliername" 
                type="text" 
                placeholder="请输入供应商名称" 
                class="form-input"
                required
              >
            </div>
            
            <div class="form-group">
              <label class="form-label">供应商编码</label>
              <input 
                v-model="supplierForm.supplierId" 
                type="text" 
                placeholder="系统自动生成" 
                class="form-input"
                disabled
                :style="isEdit ? 'background-color: #f3f4f6;' : ''"
              >
              <small v-if="isEdit" class="text-gray-500">供应商编码不可修改</small>
            </div>

            <div class="form-group">
              <label class="form-label required">联系人</label>
              <input 
                v-model="supplierForm.supplierContact" 
                type="text" 
                placeholder="请输入联系人姓名" 
                class="form-input"
                required
              >
            </div>

            <div class="form-group">
              <label class="form-label required">联系电话</label>
              <input 
                v-model="supplierForm.supplierPhone" 
                type="tel" 
                placeholder="请输入联系电话" 
                class="form-input"
                required
              >
            </div>
          </div>
        </div>
      </div>

      <!-- 地址信息 -->
      <div class="form-section">
        <div class="section-header">
          <h3 class="section-title">地址信息</h3>
        </div>
        <div class="section-content">
          <div class="form-group">
            <label class="form-label">详细地址</label>
            <textarea 
              v-model="supplierForm.supplieraddress" 
              placeholder="请输入详细地址" 
              class="form-textarea"
              rows="3"
            ></textarea>
          </div>
        </div>
      </div>

      <!-- 业务信息 -->
      <div class="form-section">
        <div class="section-header">
          <h3 class="section-title">业务信息</h3>
        </div>
        <div class="section-content">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="form-group">
              <label class="form-label">主营产品</label>
              <input 
                v-model="supplierForm.mainProducts" 
                type="text" 
                placeholder="请输入主营产品" 
                class="form-input"
              >
            </div>
            
            <div class="form-group">
              <label class="form-label">供应商类别</label>
              <select v-model="supplierForm.supplierCategory" class="form-select" style="background-color: white; color: #374151;">
                <option value="" style="color: #9ca3af; background-color: white;">请选择供应商类别</option>
                <option 
                  v-for="item in categoryOptions" 
                  :key="item.value"
                  :value="item.value"
                  style="color: #374151; background-color: white;"
                >
                  {{ item.label }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">供应商等级</label>
              <select v-model="supplierForm.supplierGrade" class="form-select" style="background-color: white; color: #374151;">
                <option value="" style="color: #9ca3af; background-color: white;">请选择供应商等级</option>
                <option 
                  v-for="item in gradeOptions" 
                  :key="item.value"
                  :value="item.value"
                  style="color: #374151; background-color: white;"
                >
                  {{ item.label }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">合作年限</label>
              <input 
                v-model.number="supplierForm.cooperationYears" 
                type="number" 
                placeholder="请输入合作年限" 
                class="form-input"
                min="0"
                max="100"
              >
            </div>
          </div>
        </div>
      </div>

      <!-- 状态信息 -->
      <div class="form-section">
        <div class="section-header">
          <h3 class="section-title">状态信息</h3>
        </div>
        <div class="section-content">
          <div class="form-group">
            <label class="form-label">状态</label>
            <div class="flex space-x-6">
              <label class="flex items-center">
                <input type="radio" v-model="supplierForm.supplierStatus" value="active" class="mr-2">
                <span>启用</span>
              </label>
              <label class="flex items-center">
                <input type="radio" v-model="supplierForm.supplierStatus" value="inactive" class="mr-2">
                <span>停用</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- 备注信息 -->
      <div class="form-section">
        <div class="section-header">
          <h3 class="section-title">备注信息</h3>
        </div>
        <div class="section-content">
          <div class="form-group">
            <label class="form-label">备注</label>
            <textarea 
              v-model="supplierForm.notes" 
              placeholder="请输入备注信息" 
              class="form-textarea"
              rows="4"
            ></textarea>
          </div>
        </div>
      </div>

      <!-- 表单底部按钮 -->
      <div class="form-actions">
        <button type="button" class="btn btn-secondary" @click="goBack">取消</button>
        <button type="submit" class="btn btn-primary">保存供应商</button>
      </div>
    </form>
  </div>
</Layout>
</template>

<script setup>
import Layout from '@/components/layout/Layout.vue'
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { showToast, showSuccessToast } from '@/utils/toast'
import { mockSuppliersApi } from '@/mock/api/suppliersApi'

const router = useRouter()
const route = useRoute()

// 判断是否为编辑模式
const isEdit = computed(() => {
  return route.path.includes('/suppliers/edit')
})

// 获取供应商ID（如果是编辑模式）
const supplierId = computed(() => {
  return route.params.id
})

// 供应商类别和等级选项
const categoryOptions = [
  { value: '茶叶供应商', label: '茶叶供应商' },
  { value: '包装供应商', label: '包装供应商' },
  { value: '茶具供应商', label: '茶具供应商' },
  { value: '生产厂家', label: '生产厂家' },
  { value: '批发商', label: '批发商' },
  { value: '经销商', label: '经销商' },
  { value: '代理商', label: '代理商' },
  { value: '其他', label: '其他' }
]

const gradeOptions = [
  { value: '特级', label: '特级' },
  { value: 'A级', label: 'A级' },
  { value: 'B级', label: 'B级' },
  { value: 'C级', label: 'C级' },
  { value: 'D级', label: 'D级' }
]

// 表单数据
const supplierForm = reactive({
  suppliername: '',
  supplierId: '系统自动生成',
  supplierContact: '',
  supplierPhone: '',
  supplieraddress: '',
  mainProducts: '',
  supplierCategory: '',
  supplierGrade: '',
  cooperationYears: 0,
  supplierStatus: 'active',
  notes: ''
})

// 生成供应商编码
const generateSupplierId = () => {
  // 生成一个随机的3位数字
  const randomNum = Math.floor(Math.random() * 900) + 100
  supplierForm.supplierId = `SUP${randomNum}`
}

// 获取供应商详情
const getSupplierDetail = async (id) => {
  try {
    const response = await mockSuppliersApi.getDetail({ id })
    if (response.error === 0 && response.body) {
      // 将供应商数据填充到表单
      const supplier = response.body
      supplierForm.suppliername = supplier.suppliername || ''
      supplierForm.supplierId = supplier.supplierId || ''
      supplierForm.supplierContact = supplier.supplierContact || ''
      supplierForm.supplierPhone = supplier.supplierPhone || ''
      supplierForm.supplieraddress = supplier.supplieraddress || ''
      supplierForm.mainProducts = supplier.mainProducts || ''
      supplierForm.supplierCategory = supplier.supplierCategory || ''
      supplierForm.supplierGrade = supplier.supplierGrade || ''
      supplierForm.cooperationYears = supplier.cooperationYears || 0
      supplierForm.supplierStatus = supplier.supplierStatus || 'active'
      supplierForm.notes = supplier.notes || ''
    } else {
      showToast(response.message || '获取供应商信息失败')
      router.push('/suppliers')
    }
  } catch (error) {
    console.error('获取供应商详情失败:', error)
    showToast('获取供应商信息失败，请重试')
    router.push('/suppliers')
  }
}

// 保存供应商信息
const saveSupplier = async () => {
  try {
    // 表单验证
    if (!supplierForm.suppliername || !supplierForm.supplierContact || !supplierForm.supplierPhone) {
      showToast('请填写必填项')
      return
    }
    
    // 如果是新增模式，生成供应商编码
    if (!isEdit.value && supplierForm.supplierId === '系统自动生成') {
      generateSupplierId()
    }
    
    // 准备提交的数据
    const submitData = {
      suppliername: supplierForm.suppliername,
      supplierId: supplierForm.supplierId,
      supplierContact: supplierForm.supplierContact,
      supplierPhone: supplierForm.supplierPhone,
      supplieraddress: supplierForm.supplieraddress,
      mainProducts: supplierForm.mainProducts,
      supplierCategory: supplierForm.supplierCategory,
      supplierGrade: supplierForm.supplierGrade,
      cooperationYears: supplierForm.cooperationYears,
      supplierStatus: supplierForm.supplierStatus,
      notes: supplierForm.notes
    }
    
    let response
    
    // 根据模式选择添加或更新API
    if (isEdit.value) {
      // 编辑模式，调用更新API
      response = await mockSuppliersApi.update({
        id: supplierId.value,
        ...submitData
      })
      
      if (response.error === 0) {
        showSuccessToast('供应商信息更新成功')
      } else {
        showToast(response.message || '更新失败')
        return
      }
    } else {
      // 新增模式，调用添加API
      response = await mockSuppliersApi.add(submitData)
      
      if (response.error === 0) {
        showSuccessToast('供应商添加成功')
      } else {
        showToast(response.message || '添加失败')
        return
      }
    }
    
    // 跳转到供应商列表页
    goBack()
  } catch (error) {
    console.error('保存供应商信息失败:', error)
    showToast('保存失败，请重试')
  }
}

// 表单提交
const handleSubmit = () => {
  saveSupplier()
}

// 返回列表
const goBack = () => {
  router.push('/suppliers')
}

// 页面加载时执行
onMounted(() => {
  // 如果是编辑模式，获取供应商详情
  if (isEdit.value && supplierId.value) {
    getSupplierDetail(supplierId.value)
  } else {
    // 新增模式，生成供应商编码
    generateSupplierId()
  }
})
</script>

<style scoped>
.supplier-add {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.page-subtitle {
  font-size: 14px;
  color: #6b7280;
  margin: 4px 0 0;
}

.header-right {
  display: flex;
  gap: 12px;
}

.form-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 2px solid #e5e7eb;
}

.form-group {
  margin-bottom: 16px;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 8px;
}

.form-label.required::after {
  content: "*";
  color: #ef4444;
  margin-left: 4px;
}

.form-input,
.form-select,
.form-textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  color: #1f2937;
  background-color: white;
  transition: border-color 0.2s ease;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.form-input:disabled {
  background-color: #f3f4f6;
  cursor: not-allowed;
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 500;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary {
  background-color: #10b981;
  color: white;
  border: none;
}

.btn-primary:hover {
  background-color: #059669;
}

.btn-secondary {
  background-color: white;
  color: #4b5563;
  border: 1px solid #d1d5db;
}

.btn-secondary:hover {
  background-color: #f9fafb;
  border-color: #9ca3af;
}

.space-y-6 > * + * {
  margin-top: 1.5rem;
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
}

.gap-6 {
  gap: 1.5rem;
}
</style>