<template>
  <div class="register-container">
    <!-- 背景装饰 -->
    <div class="register-bg">
      <div class="tea-pattern"></div>
    </div>
    
    <!-- 注册卡片 -->
    <div class="register-card">
      <!-- Logo和标题 -->
      <div class="register-header">
        <div class="logo-container">
          <van-icon name="leaf-o" class="logo-icon" />
        </div>
        <h1 class="register-title">茶农手账系统</h1>
        <p class="register-subtitle">创建您的账户</p>
      </div>

      <!-- 注册表单 -->
      <van-form @submit="handleRegister" class="register-form">
        <van-field
          v-model="form.username"
          name="username"
          label="用户名"
          placeholder="请输入用户名"
          :rules="[{ required: true, message: '请输入用户名' }]"
          left-icon="user-o"
        />
        
        <van-field
          v-model="form.email"
          name="email"
          label="邮箱"
          placeholder="请输入邮箱"
          :rules="[
            { required: true, message: '请输入邮箱' },
            { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: '请输入正确的邮箱格式' }
          ]"
          left-icon="envelop-o"
        />
        
        <van-field
          v-model="form.password"
          type="password"
          name="password"
          label="密码"
          placeholder="请输入密码"
          :rules="[
            { required: true, message: '请输入密码' },
            { min: 6, message: '密码长度至少6位' }
          ]"
          left-icon="lock"
        />
        
        <van-field
          v-model="form.confirmPassword"
          type="password"
          name="confirmPassword"
          label="确认密码"
          placeholder="请再次输入密码"
          :rules="[
            { required: true, message: '请确认密码' },
            { validator: validateConfirmPassword, message: '两次输入的密码不一致' }
          ]"
          left-icon="lock"
        />

        <!-- 用户协议 -->
        <div class="agreement-section">
          <van-checkbox v-model="form.agreeTerms">
            我已阅读并同意
            <van-button type="primary" size="small" @click="showTerms">
              《用户协议》
            </van-button>
            和
            <van-button type="primary" size="small" @click="showPrivacy">
              《隐私政策》
            </van-button>
          </van-checkbox>
        </div>

        <!-- 注册按钮 -->
        <div class="register-actions">
          <van-button 
            type="primary" 
            size="large" 
            block 
            :loading="loading"
            :disabled="!form.agreeTerms"
            @click="handleRegister"
          >
            注册
          </van-button>
        </div>

        <!-- 登录链接 -->
        <div class="login-link">
          <span>已有账户？</span>
          <van-button type="primary" size="small" @click="goToLogin">
            立即登录
          </van-button>
        </div>
      </van-form>
    </div>

    <!-- 用户协议弹窗 -->
    <van-popup v-model:show="showTermsPopup" position="center" round>
      <div class="terms-popup">
        <h3>用户协议</h3>
        <div class="terms-content">
          <p>欢迎使用茶农手账系统！</p>
          <p>1. 本系统仅供茶农个人记账使用</p>
          <p>2. 用户应妥善保管账户信息</p>
          <p>3. 不得将系统用于非法用途</p>
          <p>4. 我们承诺保护用户隐私</p>
        </div>
        <van-button type="primary" block @click="showTermsPopup = false">
          我知道了
        </van-button>
      </div>
    </van-popup>

    <!-- 隐私政策弹窗 -->
    <van-popup v-model:show="showPrivacyPopup" position="center" round>
      <div class="terms-popup">
        <h3>隐私政策</h3>
        <div class="terms-content">
          <p>我们重视您的隐私保护：</p>
          <p>1. 我们只收集必要的用户信息</p>
          <p>2. 您的数据将被安全存储</p>
          <p>3. 我们不会向第三方分享您的信息</p>
          <p>4. 您可以随时删除您的账户</p>
        </div>
        <van-button type="primary" block @click="showPrivacyPopup = false">
          我知道了
        </van-button>
      </div>
    </van-popup>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { useAuthStore } from '@/stores/auth'
import { register } from '@/api/auth'

const router = useRouter()
const authStore = useAuthStore()

// 表单数据
const form = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreeTerms: false
})

// 加载状态
const loading = ref(false)

// 弹窗状态
const showTermsPopup = ref(false)
const showPrivacyPopup = ref(false)

// 验证确认密码
const validateConfirmPassword = (value) => {
  return value === form.password
}

// 处理注册
const handleRegister = async () => {
  if (!form.agreeTerms) {
    showToast('请先同意用户协议和隐私政策')
    return
  }

  if (form.password !== form.confirmPassword) {
    showToast('两次输入的密码不一致')
    return
  }

  loading.value = true
  
  try {
    const response = await register({
      username: form.username,
      email: form.email,
      password: form.password,
      confirmPassword: form.confirmPassword,
      nickname: form.username,
      agreeTerms: form.agreeTerms
    })
    
    // 保存登录状态
    authStore.setToken(response.token)
    authStore.setUser(response.userInfo)
    
    showToast('注册成功')
    router.push('/dashboard')
  } catch (error) {
    console.error('注册失败:', error)
    showToast(error.message || '注册失败')
  } finally {
    loading.value = false
  }
}

// 跳转到登录页面
const goToLogin = () => {
  router.push('/login')
}

// 显示用户协议
const showTerms = () => {
  showTermsPopup.value = true
}

// 显示隐私政策
const showPrivacy = () => {
  showPrivacyPopup.value = true
}
</script>

<style scoped lang="scss">
.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.register-bg {
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

.register-card {
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

.register-header {
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

.register-title {
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 8px;
}

.register-subtitle {
  color: #6b7280;
  font-size: 14px;
}

.register-form {
  .van-field {
    margin-bottom: 16px;
  }
}

.agreement-section {
  margin-bottom: 24px;
  
  .van-checkbox {
    font-size: 14px;
    color: #6b7280;
  }
  
  .van-button {
    margin: 0 4px;
  }
}

.register-actions {
  margin-bottom: 24px;
  
  .van-button {
    height: 48px;
    font-size: 16px;
    font-weight: 600;
    background: linear-gradient(135deg, #10B981 0%, #059669 100%);
    border: none;
    border-radius: 8px;
    transition: all 0.3s ease;
    
    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 10px 20px rgba(16, 185, 129, 0.3);
    }
    
    &:disabled {
      opacity: 0.6;
    }
  }
}

.login-link {
  text-align: center;
  color: #6b7280;
  font-size: 14px;
  
  .van-button {
    margin-left: 8px;
  }
}

.terms-popup {
  width: 300px;
  padding: 24px;
  
  h3 {
    text-align: center;
    margin-bottom: 16px;
    color: #1f2937;
  }
  
  .terms-content {
    margin-bottom: 20px;
    color: #6b7280;
    font-size: 14px;
    line-height: 1.6;
    
    p {
      margin-bottom: 8px;
    }
  }
}

// 响应式设计
@media (max-width: 480px) {
  .register-card {
    padding: 24px;
  }
  
  .register-title {
    font-size: 20px;
  }
}
</style>