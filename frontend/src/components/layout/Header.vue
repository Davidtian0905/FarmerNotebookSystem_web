<template>
  <header class="layout-header">
    <div class="flex items-center justify-between w-full">
      <div class="flex items-center">
        <div class="flex items-center mr-8">
          <div class="logo">
            <i class="fas fa-leaf"></i>
          </div>
          <h1 class="app-title">茶农手账</h1>
        </div>
        
        <button class="btn-icon mr-4" @click="toggleSidebar">
          <i class="fas fa-bars"></i>
        </button>
        
        <nav class="flex items-center text-sm text-gray-600" v-if="breadcrumb">
          <span 
            v-for="(item, index) in breadcrumb" 
            :key="index"
            class="breadcrumb-item"
          >
            <span 
              v-if="index > 0" 
              class="breadcrumb-separator"
            >
              <i class="fas fa-chevron-right mx-2 text-xs"></i>
            </span>
            <span 
              :class="{ 'breadcrumb-link': item.path, 'breadcrumb-text': !item.path }"
              @click="item.path && navigateTo(item.path)"
            >
              {{ item.title }}
            </span>
          </span>
        </nav>
      </div>
      
      <div class="flex items-center space-x-4">
        <div class="relative">
          <input 
            v-model="searchKeyword"
            type="text" 
            placeholder="搜索..." 
            class="search-input"
            @keyup.enter="handleSearch"
          >
          <i class="fas fa-search search-icon"></i>
        </div>
        
        <div class="relative">
          <button class="btn-icon notification-btn" @click="showNotifications">
            <i class="fas fa-bell"></i>
            <span v-if="notificationCount > 0" class="notification-badge">
              {{ notificationCount }}
            </span>
          </button>
        </div>
        
        <div class="relative">
          <button class="user-menu-btn" @click="toggleUserMenu">
            <img 
              :src="userAvatar" 
              alt="用户头像" 
              class="user-avatar"
            >
            <span class="user-name">{{ userName }}</span>
            <i class="fas fa-chevron-down user-arrow"></i>
          </button>

          <!-- 用户下拉菜单 -->
          <div v-if="showUserMenu" class="user-dropdown">
            <div class="user-dropdown-content">
              <div class="user-info">
                <img
                  :src="userAvatar"
                  class="user-avatar-large"
                  alt="用户头像"
                />
                <div class="user-details">
                  <h3 class="user-name-large">{{ userName }}</h3>
                  <p class="user-email">{{ userEmail }}</p>
                </div>
              </div>
              
              <div class="dropdown-divider"></div>
              
              <div class="dropdown-menu-items">
                <div class="dropdown-item" @click="navigateToSettings">
                  <i class="fas fa-cog"></i>
                  <span>设置</span>
                </div>
                <div class="dropdown-item logout" @click="handleLogout">
                  <i class="fas fa-sign-out-alt"></i>
                  <span>退出登录</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { showToast, showConfirmDialog } from 'vant'

const router = useRouter()
const authStore = useAuthStore()

// 响应式数据
const searchKeyword = ref('')
const showUserMenu = ref(false)
const notificationCount = ref(3) // 模拟通知数量

// 计算属性
const userInfo = computed(() => authStore.userInfo)
const userName = computed(() => userInfo.value?.username || '张茶农')
const userEmail = computed(() => userInfo.value?.email || '')
const userAvatar = computed(() => userInfo.value?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=32&h=32&q=80')

// 面包屑导航（可以根据路由动态生成）
const breadcrumb = computed(() => {
  const currentRoute = router.currentRoute.value
  const path = currentRoute.path
  
  if (path === '/dashboard') {
    return [{ title: '首页' }, { title: '仪表板' }]
  } else if (path.startsWith('/assets')) {
    return [{ title: '首页', path: '/dashboard' }, { title: '资产总览' }]
  } else if (path.startsWith('/records')) {
    return [{ title: '首页', path: '/dashboard' }, { title: '流水记录' }]
  }
  
  return []
})

// 方法
const emit = defineEmits(['toggle-sidebar'])

const toggleSidebar = () => {
  // 向父组件发送事件
  emit('toggle-sidebar')
}

const handleSearch = (value) => {
  console.log('搜索:', value)
  showToast(`搜索: ${value}`)
}

const showNotifications = () => {
  showToast('通知功能开发中...')
}

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

// 点击外部关闭用户菜单
const closeUserMenu = (event) => {
  const userMenuBtn = document.querySelector('.user-menu-btn')
  const userDropdown = document.querySelector('.user-dropdown')
  
  if (showUserMenu.value && 
      userMenuBtn && 
      userDropdown && 
      !userMenuBtn.contains(event.target) && 
      !userDropdown.contains(event.target)) {
    showUserMenu.value = false
  }
}

// 添加点击外部关闭菜单的事件监听
onMounted(() => {
  document.addEventListener('click', closeUserMenu)
})

onUnmounted(() => {
  document.removeEventListener('click', closeUserMenu)
})

const navigateTo = (path) => {
  router.push(path)
}

const navigateToProfile = () => {
  router.push('/profile')
  showUserMenu.value = false
}

const navigateToSettings = () => {
  router.push('/settings')
  showUserMenu.value = false
}

const showHelp = () => {
  showToast('帮助功能开发中...')
  showUserMenu.value = false
}

const handleLogout = async () => {
  try {
    await showConfirmDialog({
      title: '确认退出',
      message: '您确定要退出登录吗？'
    })
    
    await authStore.logoutUser()
    showToast('已退出登录')
    router.push('/login')
  } catch (error) {
    // 用户取消退出
  }
}
</script>

<style scoped lang="scss">
.layout-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--header-height);
  background: var(--card-bg);
  border-bottom: 1px solid var(--border-color);
  z-index: 1000;
  display: flex;
  align-items: center;
  padding: 0 24px;
  box-shadow: var(--shadow-sm);
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #10B981 0%, #059669 100%);
  border-radius: var(--border-radius-lg);
  color: white;
  font-size: 14px;
}

.app-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.breadcrumb-link {
  color: var(--primary-color);
  cursor: pointer;
  
  &:hover {
    text-decoration: underline;
  }
}

.breadcrumb-text {
  color: var(--text-primary);
}

.search-input {
  width: 256px;
  padding: 8px 16px 8px 40px;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-lg);
  font-size: 14px;
  background: var(--card-bg);
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  }
  
  &::placeholder {
    color: var(--text-muted);
  }
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
  font-size: 14px;
}

.notification-btn {
  position: relative;
}
.notification-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: var(--error-color);
  color: white;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 16px;
  text-align: center;
}

.user-menu-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
  border-radius: var(--border-radius);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: var(--border-light);
  }
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.user-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
  
  @media (max-width: 768px) {
    display: none;
  }
}

.user-arrow {
  font-size: 12px;
  color: var(--text-muted);
}

.user-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 280px;
  background: var(--card-bg);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
  z-index: 1000;
  overflow: hidden;
  border: 1px solid var(--border-color);
}

.user-dropdown-content {
  padding: 0;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background-color: var(--bg-color);
}

.user-avatar-large {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.user-details {
  flex: 1;
}

.user-name-large {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 4px 0;
}

.user-email {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0;
}

.dropdown-divider {
  height: 1px;
  background-color: var(--border-color);
  margin: 0;
}

.dropdown-menu-items {
  padding: 8px 0;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  color: var(--text-secondary);
  
  i {
    width: 16px;
    text-align: center;
    font-size: 14px;
  }
  
  span {
    font-size: 14px;
  }
  
  &:hover {
    background-color: var(--border-light);
    color: var(--text-primary);
  }
  
  &.logout {
    color: var(--error-color);
    
    &:hover {
      background-color: rgba(239, 68, 68, 0.1);
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .layout-header {
    padding: 0 16px;
  }
  
  .app-title {
    font-size: 18px;
  }
  
  .search-input {
    width: 200px;
  }
}
</style>
