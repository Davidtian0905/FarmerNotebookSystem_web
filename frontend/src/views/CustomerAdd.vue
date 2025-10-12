<template>
  <Layout>
    <div class="customer-add-page">
      <!-- 页面头部 -->
      <div class="page-header">
    <div class="header-left">
      <h1 class="page-title">客户管理</h1>
      <p class="page-subtitle">{{ isEditMode ? '编辑客户' : '添加新客户' }}</p>
    </div>
    <div class="header-right">
      <button class="btn btn-secondary" @click="$router.push('/customers')">
        <i class="icon-arrow-left"></i>
        返回列表
      </button>
      <button class="btn btn-primary" @click="handleSave">
        <i class="icon-save"></i>
        {{ isEditMode ? '保存修改' : '保存客户' }}
      </button>
    </div>
  </div>

      <!-- 表单内容 -->
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- 基本信息 -->
        <div class="form-section">
          <div class="section-header">
            <h3 class="section-title">基本信息</h3>
          </div>
          <div class="section-content">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div class="form-group">
                <label class="form-label required">客户名称</label>
                <input 
                  v-model="formData.customername" 
                  type="text" 
                  placeholder="请输入客户名称" 
                  class="form-input"
                  required
                >
              </div>


              
              <div class="form-group">
                <label class="form-label">客户编码</label>
                <input 
                  v-model="formData.customerId" 
                  type="text" 
                  placeholder="系统自动生成" 
                  class="form-input"
                  disabled
                  :style="isEditMode ? 'background-color: #f3f4f6;' : ''"
                >
                <small v-if="isEditMode" class="text-gray-500">客户编码不可修改</small>
              </div>

              <div class="form-group">
                <label class="form-label required">联系人</label>
                <input 
                  v-model="formData.customercontact" 
                  type="text" 
                  placeholder="请输入联系人姓名" 
                  class="form-input"
                  required
                >
              </div>

              <div class="form-group">
                <label class="form-label required">联系电话</label>
                <input 
                  v-model="formData.customerphone" 
                  type="tel" 
                  placeholder="请输入联系电话" 
                  class="form-input"
                  required
                >
              </div>
            </div>
          </div>
        </div>

        <!-- 客户分类 -->
        <div class="form-section">
          <div class="section-header">
            <h3 class="section-title">客户分类</h3>
          </div>
          <div class="section-content">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div class="form-group">
                <label class="form-label">客户类型</label>
                <select v-model="formData.customcategory" class="form-select" style="background-color: white; color: #374151;">
                  <option value="" style="color: #9ca3af; background-color: white;">请选择客户类型</option>
                  <option 
                    v-for="type in customerTypes" 
                    :key="type"
                    :value="type"
                    style="color: #374151; background-color: white;"
                  >
                    {{ type }}
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">客户等级</label>
                <select v-model="formData.customgrade" class="form-select" style="background-color: white; color: #374151;">
                  <option value="" style="color: #9ca3af; background-color: white;">请选择客户等级</option>
                  <option 
                    v-for="grade in customerGrades" 
                    :key="grade"
                    :value="grade"
                    style="color: #374151; background-color: white;"
                  >
                    {{ grade }}
                  </option>
                </select>
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
                  v-model="formData.customeraddress" 
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
                <label class="form-label">客户来源</label>
                <select v-model="formData.customsource" class="form-select" style="background-color: white; color: #374151;">
                  <option value="" style="color: #9ca3af; background-color: white;">请选择客户来源</option>
                  <option 
                    v-for="customsource in customerSources" 
                    :key="customsource"
                    :value="customsource"
                    style="color: #374151; background-color: white;"
                  >
                    {{ customsource }}
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">折扣率</label>
                <div class="flex items-center">
                  <input 
                    v-model.number="displayDiscountRate" 
                    type="number" 
                    placeholder="请输入折扣数字" 
                    class="form-input"
                    min="1"
                    max="10"
                    step="0.1"
                    @input="updateDiscountRate"
                  >
                  <span class="ml-2 text-gray-500">折</span>
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
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div class="form-group">
                <label class="form-label">备注</label>
                <textarea 
                  v-model="formData.notes" 
                  placeholder="请输入备注信息" 
                  class="form-textarea"
                  rows="3"
                ></textarea>
              </div>

              <div class="form-group">
                <label class="form-label">状态</label>
                <div class="flex space-x-6">
                  <label class="flex items-center">
                    <input type="radio" v-model="formData.customerStatus" value="active" class="mr-2">
                    <span>启用</span>
                  </label>
                  <label class="flex items-center">
                    <input type="radio" v-model="formData.customerStatus" value="inactive" class="mr-2">
                    <span>停用</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 表单底部按钮 -->
        <div class="form-actions">
          <button type="button" class="btn btn-secondary" @click="$router.push('/customers')">取消</button>
          <button type="submit" class="btn btn-primary">保存客户</button>
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
import { mockCustomersApi } from '@/mock/api/customersApi'

const router = useRouter()
const route = useRoute()

// 判断是否为编辑模式
const isEditMode = computed(() => {
  return route.path.includes('/customer/edit')
})

// 获取客户ID（如果是编辑模式）
const customerId = computed(() => {
  return route.params.id
})

// 客户类型和等级
const customerTypes = ['零售商', '批发商', '连锁店', '个人', '企业', '其他']
const customerGrades = ['VIP', 'A级', 'B级', 'C级', '普通']
const customerSources = ['网络推广', '朋友推荐', '老客户介绍', '展会', '广告', '其他']

// 表单数据
const formData = reactive({
  customername: '',
  customerId: '系统自动生成',
  customercontact: '',
  customerphone: '',
  customeraddress: '',
  customcategory: '',
  customgrade: '',
  customsource: '',
  discountRate: 0.1,
  notes: '',
  customerStatus: 'active' // 默认启用状态
})

// 显示用的折扣率（几折）
const displayDiscountRate = ref(10)

// 更新实际折扣率
const updateDiscountRate = () => {
  // 将显示的折扣数转换为实际折扣率（例：9折 -> 0.9）
  formData.discountRate = displayDiscountRate.value / 10
}

// 生成客户编码
const generateCustomerCode = () => {
  if (!formData.customername) return
  
  // 提取客户名称拼音首字母（这里简化处理，实际应该使用拼音库）
  const nameInitials = formData.customername.substring(0, 2).toUpperCase()
  
  // 生成时间戳
  const timestamp = new Date().getTime().toString().substring(6)
  
  // 组合编码
  formData.customerId = `${nameInitials}${timestamp}`
}

// 获取客户详情
const fetchCustomerDetail = async (id) => {
  try {
    const response = await mockCustomersApi.getDetail({ id })
    if (response.error === 0 && response.body) {
      // 将客户数据填充到表单
      const customer = response.body
      formData.customername = customer.customername || ''
      formData.customerId = customer.customerId || ''
      formData.customercontact = customer.customercontact || ''
      formData.customerphone = customer.customerphone || ''
      formData.customeraddress = customer.customeraddress || ''
      formData.customcategory = customer.customcategory || ''
      formData.customgrade = customer.customgrade || ''
      formData.customsource = customer.customsource || ''
      formData.discountRate = customer.discountRate || 0.1
      formData.notes = customer.notes || ''
      formData.customerStatus = customer.customerStatus || 'active'
      
      // 更新显示的折扣率
      displayDiscountRate.value = formData.discountRate * 10
    } else {
      showToast(response.message || '获取客户信息失败')
      router.push('/customers')
    }
  } catch (error) {
    console.error('获取客户详情失败:', error)
    showToast('获取客户信息失败，请重试')
    router.push('/customers')
  }
}

// 保存客户信息
const handleSave = async () => {
  try {
    // 表单验证
    if (!formData.customername || !formData.customercontact || !formData.customerphone) {
      showToast('请填写必填项')
      return
    }
    
    // 如果是新增模式，生成客户编码
    if (!isEditMode.value && formData.customerId === '系统自动生成') {
      generateCustomerCode()
    }
    
    // 准备提交的数据
    const submitData = {
      customername: formData.customername,
      customerphone: formData.customerphone,
      customeraddress: formData.customeraddress,
      discountRate: formData.discountRate,
      customercontact: formData.customercontact,
      notes: formData.notes,
      customerStatus: formData.customerStatus,
      customcategory: formData.customcategory,
      customgrade: formData.customgrade,
      customsource: formData.customsource
    }
    
    let response
    
    // 根据模式选择添加或更新API
    if (isEditMode.value) {
      // 编辑模式，调用更新API
      response = await mockCustomersApi.update({
        id: customerId.value,
        ...submitData
      })
      
      if (response.error === 0) {
        showSuccessToast('客户信息更新成功')
      } else {
        showToast(response.message || '更新失败')
        return
      }
    } else {
      // 新增模式，调用添加API
      response = await mockCustomersApi.add(submitData)
      
      if (response.error === 0) {
        showSuccessToast('客户添加成功')
      } else {
        showToast(response.message || '添加失败')
        return
      }
    }
    
    // 跳转到客户列表页
    router.push('/customers')
  } catch (error) {
    console.error('保存客户信息失败:', error)
    showToast('保存失败，请重试')
  }
}

// 表单提交
const handleSubmit = () => {
  handleSave()
}

// 页面加载时执行
onMounted(() => {
  // 如果是编辑模式，获取客户详情
  if (isEditMode.value && customerId.value) {
    fetchCustomerDetail(customerId.value)
  } else {
    // 初始化显示的折扣率
    displayDiscountRate.value = formData.discountRate * 10
  }
})
</script>

<style scoped>
.customer-add-page {
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