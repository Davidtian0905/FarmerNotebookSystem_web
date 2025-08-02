<template>
  <div class="forgot-password-container">
    <!-- 背景装饰 -->
    <div class="forgot-password-bg">
      <div class="tea-pattern"></div>
    </div>
    
    <!-- 忘记密码卡片 -->
    <div class="forgot-password-card">
      <!-- Logo和标题 -->
      <div class="forgot-password-header">
        <div class="logo-container">
          <van-icon name="leaf-o" class="logo-icon" />
        </div>
        <h1 class="forgot-password-title">茶农手账系统</h1>
        <p class="forgot-password-subtitle">重置您的密码</p>
      </div>

      <!-- 步骤指示器 -->
      <van-steps 
        :active="currentStep" 
        class="steps-container"
        active-color="#10B981"
      >
        <van-step>验证邮箱</van-step>
        <van-step>重置密码</van-step>
        <van-step>完成</van-step>
      </van-steps>

      <!-- 步骤1：验证邮箱 -->
      <div v-if="currentStep === 0" class="step-content">
        <van-form @submit="handleVerifyEmail" class="verify-form">
          <van-field
            v-model="form.email"
            name="email"
            label="邮箱"
            placeholder="请输入您的注册邮箱"
            :rules="[
              { required: true, message: '请输入邮箱' },
              { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: '请输入正确的邮箱格式' }
            ]"
            left-icon="envelop-o"
          />
          
          <van-field
            v-model="form.verifyCode"
            name="verifyCode"
            label="验证码"
            placeholder="请输入验证码"
            :rules="[{ required: true, message: '请输入验证码' }]"
            left-icon="shield-o"
          >
            <template #button>
              <van-button 
                type="primary" 
                size="small" 
                :disabled="countdown > 0"
                @click="sendVerifyCode"
              >
                {{ countdown > 0 ? `${countdown}s` : '发送验证码' }}
              </van-button>
            </template>
          </van-field>

          <div class="form-actions">
            <van-button 
              type="primary" 
              size="large" 
              block 
              :loading="loading"
              @click="handleVerifyEmail"
            >
              验证邮箱
            </van-button>
          </div>
        </van-form>
      </div>

      <!-- 步骤2：重置密码 -->
      <div v-if="currentStep === 1" class="step-content">
        <van-form @submit="handleResetPassword" class="reset-form">
          <van-field
            v-model="form.newPassword"
            type="password"
            name="newPassword"
            label="新密码"
            placeholder="请输入新密码"
            :rules="[
              { required: true, message: '请输入新密码' },
              { min: 6, message: '密码长度至少6位' }
            ]"
            left-icon="lock"
          />
          
          <van-field
            v-model="form.confirmPassword"
            type="password"
            name="confirmPassword"
            label="确认密码"
            placeholder="请再次输入新密码"
            :rules="[
              { required: true, message: '请确认密码' },
              { validator: validateConfirmPassword, message: '两次输入的密码不一致' }
            ]"
            left-icon="lock"
          />

          <div class="form-actions">
            <van-button 
              type="primary" 
              size="large" 
              block 
              :loading="loading"
              @click="handleResetPassword"
            >
              重置密码
            </van-button>
          </div>
        </van-form>
      </div>

      <!-- 步骤3：完成 -->
      <div v-if="currentStep === 2" class="step-content">
        <div class="success-content">
          <div class="success-icon">
            <van-icon name="success" />
          </div>
          <h3 class="success-title">密码重置成功</h3>
          <p class="success-message">您的密码已经成功重置，请使用新密码登录</p>
          
          <div class="success-actions">
            <van-button 
              type="primary" 
              size="large" 
              block 
              @click="goToLogin"
            >
              立即登录
            </van-button>
          </div>
        </div>
      </div>

      <!-- 返回登录链接 -->
      <div class="back-to-login">
        <van-button type="primary" size="small" @click="goToLogin">
          返回登录
        </van-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { forgotPassword, verifyCode, resetPassword } from '@/api/auth'

const router = useRouter()

// 表单数据
const form = reactive({
  email: '',
  verifyCode: '',
  newPassword: '',
  confirmPassword: ''
})

// 当前步骤
const currentStep = ref(0)

// 加载状态
const loading = ref(false)

// 倒计时
const countdown = ref(0)

// 验证确认密码
const validateConfirmPassword = (value) => {
  return value === form.newPassword
}

// 发送验证码
const sendVerifyCode = async () => {
  if (!form.email) {
    showToast('请先输入邮箱')
    return
  }

  try {
    await forgotPassword({ email: form.email })
    showToast('验证码已发送到您的邮箱')
    
    // 开始倒计时
    countdown.value = 60
    const timer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        clearInterval(timer)
      }
    }, 1000)
  } catch (error) {
    console.error('发送验证码失败:', error)
    showToast(error.message || '发送验证码失败')
  }
}

// 验证邮箱
const handleVerifyEmail = async () => {
  if (!form.email || !form.verifyCode) {
    showToast('请填写完整信息')
    return
  }

  loading.value = true
  
  try {
    await verifyCode({
      email: form.email,
      code: form.verifyCode
    })
    
    showToast('邮箱验证成功')
    currentStep.value = 1
  } catch (error) {
    console.error('邮箱验证失败:', error)
    showToast(error.message || '邮箱验证失败')
  } finally {
    loading.value = false
  }
}

// 重置密码
const handleResetPassword = async () => {
  if (form.newPassword !== form.confirmPassword) {
    showToast('两次输入的密码不一致')
    return
  }

  loading.value = true
  
  try {
    await resetPassword({
      email: form.email,
      code: form.verifyCode,
      newPassword: form.newPassword
    })
    
    showToast('密码重置成功')
    currentStep.value = 2
  } catch (error) {
    console.error('密码重置失败:', error)
    showToast(error.message || '密码重置失败')
  } finally {
    loading.value = false
  }
}

// 跳转到登录页面
const goToLogin = () => {
  router.push('/login')
}
</script>

<style scoped lang="scss">
.forgot-password-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.forgot-password-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80') center/cover;
  opacity: 0.1;
}

.tea-pattern {
  position: absolute;
  width: 100%;
  height: 100%;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="2" fill="rgba(255,255,255,0.1)"/></svg>') repeat;
  animation: float 20s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

.forgot-password-card {
  width: 100%;
  max-width: 400px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  z-index: 10;
}

.forgot-password-header {
  text-align: center;
  margin-bottom: 32px;
}

.logo-container {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #10B981 0%, #059669 100%);
  border-radius: 50%;
  margin-bottom: 16px;
}

.logo-icon {
  font-size: 32px;
  color: white;
  animation: rotate 3s ease-in-out infinite;
}

@keyframes rotate {
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(10deg); }
}

.forgot-password-title {
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 8px;
}

.forgot-password-subtitle {
  color: #6b7280;
  font-size: 14px;
}

.steps-container {
  margin-bottom: 32px;
}

.step-content {
  .van-field {
    margin-bottom: 16px;
  }
}

.form-actions {
  margin-top: 24px;
  
  .van-button {
    height: 48px;
    font-size: 16px;
    font-weight: 600;
    background: linear-gradient(135deg, #10B981 0%, #059669 100%);
    border: none;
    border-radius: 8px;
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 20px rgba(16, 185, 129, 0.3);
    }
  }
}

.success-content {
  text-align: center;
  padding: 32px 0;
}

.success-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #10B981 0%, #059669 100%);
  border-radius: 50%;
  margin-bottom: 24px;
  
  .van-icon {
    font-size: 40px;
    color: white;
  }
}

.success-title {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 12px;
}

.success-message {
  color: #6b7280;
  font-size: 14px;
  margin-bottom: 32px;
}

.success-actions {
  .van-button {
    height: 48px;
    font-size: 16px;
    font-weight: 600;
    background: linear-gradient(135deg, #10B981 0%, #059669 100%);
    border: none;
    border-radius: 8px;
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 20px rgba(16, 185, 129, 0.3);
    }
  }
}

.back-to-login {
  text-align: center;
  margin-top: 24px;
}

// 响应式设计
@media (max-width: 480px) {
  .forgot-password-card {
    padding: 24px;
  }
  
  .forgot-password-title {
    font-size: 20px;
  }
}
</style> 