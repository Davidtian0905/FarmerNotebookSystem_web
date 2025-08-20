<template>
  <div class="home-container">
    <div class="home-content">
      <div class="welcome-section">
        <div class="logo-container">
          <van-icon name="leaf-o" class="logo-icon" />
        </div>
        <h1 class="welcome-title">茶农手账系统</h1>
        <p class="welcome-subtitle">专业的茶农财务管理平台</p>
      </div>

      <div class="action-buttons">
        <van-button 
          type="primary" 
          size="large" 
          block 
          @click="goToLogin"
          class="login-btn"
        >
          立即登录
        </van-button>
        
        <van-button 
          type="default" 
          size="large" 
          block 
          @click="goToRegister"
          class="register-btn"
        >
          注册账户
        </van-button>
      </div>

      <div class="features-section">
        <h2 class="features-title">主要功能</h2>
        <div class="features-grid">
          <div class="feature-item">
            <van-icon name="chart-trending-o" class="feature-icon" />
            <h3>资产总览</h3>
            <p>实时掌握财务状况</p>
          </div>
          <div class="feature-item">
            <van-icon name="records" class="feature-icon" />
            <h3>流水记录</h3>
            <p>详细记录收支情况</p>
          </div>
          <div class="feature-item">
            <van-icon name="shop-o" class="feature-icon" />
            <h3>库存管理</h3>
            <p>智能管理茶叶库存</p>
          </div>
          <div class="feature-item">
            <van-icon name="friends-o" class="feature-icon" />
            <h3>客户管理</h3>
            <p>维护客户关系</p>
          </div>
        </div>

        <!-- 开发环境测试链接 -->
        <div v-if="isDevelopment" class="dev-links">
          <van-button 
            type="primary" 
            size="small" 
            @click="goToDashboardTestMock"
            icon="setting-o"
          >
            Mock功能测试
          </van-button>
          <van-button 
            type="warning" 
            size="small" 
            @click="clearToken"
            icon="delete-o"
          >
            清除Token
          </van-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const isDevelopment = computed(() => process.env.NODE_ENV === 'development')

// 检查token状态
const checkTokenStatus = () => {
  const token = localStorage.getItem('token')
  console.log('当前token状态:', !!token, 'token值:', token)
  return !!token
}

const goToLogin = () => {
  console.log('点击登录按钮，准备跳转到 /login')
  checkTokenStatus()
  router.push('/login')
}

const goToRegister = () => {
  console.log('点击注册按钮，准备跳转到 /register')
  router.push('/register')
}

const goToDashboardTestMock = () => {
  console.log('点击Mock测试按钮，准备跳转到 /test-mock')
  router.push('/test-mock')
}

const clearToken = () => {
  console.log('点击清除Token按钮，准备清除token')
  localStorage.removeItem('token')
  console.log('Token已清除')
}
</script>

<style scoped lang="scss">
.home-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.home-content {
  max-width: 600px;
  width: 100%;
  text-align: center;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 48px 32px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.welcome-section {
  margin-bottom: 48px;
}

.logo-container {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #10B981 0%, #059669 100%);
  border-radius: 50%;
  margin-bottom: 24px;
}

.logo-icon {
  font-size: 40px;
  color: white;
  animation: rotate 3s ease-in-out infinite;
}

@keyframes rotate {
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(10deg); }
}

.welcome-title {
  font-size: 32px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 12px;
}

.welcome-subtitle {
  font-size: 18px;
  color: #6b7280;
  margin-bottom: 0;
}

.action-buttons {
  margin-bottom: 48px;
  
  .login-btn {
    margin-bottom: 16px;
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
  
  .register-btn {
    height: 48px;
    font-size: 16px;
    font-weight: 600;
    border-radius: 8px;
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    }
  }
}

.features-section {
  .features-title {
    font-size: 24px;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 32px;
  }
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
}

.feature-item {
  padding: 24px;
  background: #f8fafc;
  border-radius: 12px;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  }
  
  .feature-icon {
    font-size: 32px;
    color: #10B981;
    margin-bottom: 16px;
  }
  
  h3 {
    font-size: 18px;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 8px;
  }
  
  p {
    font-size: 14px;
    color: #6b7280;
    margin: 0;
  }
}

.dev-links {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #e5e7eb;
  text-align: center;
  
  .van-button {
    margin: 0 8px;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .home-content {
    padding: 32px 24px;
  }
  
  .welcome-title {
    font-size: 28px;
  }
  
  .welcome-subtitle {
    font-size: 16px;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}
</style> 