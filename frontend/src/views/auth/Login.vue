<template>
  <div class="login-container">
    <!-- 背景装饰 -->
    <div class="login-bg">
      <div class="tea-pattern"></div>
    </div>
    
    <!-- 登录卡片 -->
    <div class="login-card">
      <!-- Mock模式切换 -->
      <MockModeToggle />
      
      <!-- 测试账号信息 -->
      <TestAccounts />
      
      <!-- Logo和标题 -->
      <div class="login-header">
        <div class="logo-container">
          <van-icon name="leaf-o" class="logo-icon" />
        </div>
        <h1 class="login-title">茶农手账系统</h1>
        <p class="login-subtitle">欢迎回来，请登录您的账户</p>
      </div>

      <!-- 登录表单 -->
      <van-form @submit="handleLogin" class="login-form">
        <van-field
          v-model="form.username"
          name="username"
          label="用户名"
          placeholder="请输入用户名"
          :rules="[{ required: true, message: '请输入用户名' }]"
          left-icon="user-o"
        />
        
        <van-field
          v-model="form.password"
          type="password"
          name="password"
          label="密码"
          placeholder="请输入密码"
          :rules="[{ required: true, message: '请输入密码' }]"
          left-icon="lock"
        />

        <!-- 记住密码和忘记密码 -->
        <div class="form-options">
          <van-checkbox v-model="form.remember">记住密码</van-checkbox>
          <van-button type="primary" size="small" @click="goToForgotPassword">
            忘记密码？
          </van-button>
        </div>

        <!-- 登录按钮 -->
        <div class="login-actions">
          <van-button 
            type="primary" 
            size="large" 
            block 
            :loading="loading"
            @click="handleLogin"
          >
            登录
          </van-button>
        </div>

        <!-- 注册链接 -->
        <div class="register-link">
          <span>还没有账户？</span>
          <van-button type="primary" size="small" @click="goToRegister">
            立即注册
          </van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { useAuthStore } from '@/stores/auth'
import { login } from '@/api/auth'
import MockModeToggle from '@/components/common/MockModeToggle.vue'
import TestAccounts from '@/components/common/TestAccounts.vue'

const router = useRouter()
const authStore = useAuthStore()

console.log('Login组件开始加载')

// 表单数据
const form = reactive({
  username: '',
  password: '',
  remember: false
})

// 加载状态
const loading = ref(false)

// 处理登录
const handleLogin = async () => {
  console.log('开始登录流程')
  if (!form.username || !form.password) {
    showToast('请填写完整的登录信息')
    return
  }

  loading.value = true
  
  try {
    console.log('登录信息:', form)
    console.log('Mock模式状态:', localStorage.getItem('useMock'))
    
    // 使用完整的登录API
    const response = await login({
      username: form.username,
      password: form.password,
      rememberMe: form.remember
    })
    
    console.log('登录响应:', response)
    console.log('响应类型:', typeof response)
    console.log('响应结构:', Object.keys(response))
    
    // 保存登录状态
    authStore.setToken(response.token)
    authStore.setUser(response.userInfo)
    
    console.log('登录状态已保存，token:', response.token)
    console.log('用户信息已保存:', response.userInfo)
    
    // 记住密码
    if (form.remember) {
      localStorage.setItem('remembered_username', form.username)
    } else {
      localStorage.removeItem('remembered_username')
    }
    
    showToast('登录成功')
    console.log('准备跳转到dashboard')
    router.push('/dashboard')
  } catch (error) {
    console.error('登录失败:', error)
    showToast(error.message || '登录失败')
  } finally {
    loading.value = false
  }
}

// 跳转到注册页面
const goToRegister = () => {
  router.push('/register')
}

// 跳转到忘记密码页面
const goToForgotPassword = () => {
  router.push('/forgot-password')
}

// 页面加载时检查是否有记住的用户名
const initRememberedUser = () => {
  const rememberedUsername = localStorage.getItem('remembered_username')
  if (rememberedUsername) {
    form.username = rememberedUsername
    form.remember = true
  }
}

onMounted(() => {
  console.log('Login组件已挂载')
  initRememberedUser()
})
</script>

<style scoped lang="scss">
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-bg {
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

.login-card {
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

.login-header {
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

.login-title {
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 8px;
}

.login-subtitle {
  color: #6b7280;
  font-size: 14px;
}

.login-form {
  .van-field {
    margin-bottom: 16px;
  }
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.login-actions {
  margin-bottom: 24px;
  
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

.register-link {
  text-align: center;
  color: #6b7280;
  font-size: 14px;
  
  .van-button {
    margin-left: 8px;
  }
}

// 响应式设计
@media (max-width: 480px) {
  .login-card {
    padding: 24px;
  }
  
  .login-title {
    font-size: 20px;
  }
}
</style> 