import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login, register, logout, getUserInfo } from '@/api/auth'

export const useAuthStore = defineStore('auth', () => {
  // 状态
  const token = ref(localStorage.getItem('token') || '')
  const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))
  const loading = ref(false)

  // 计算属性
  const isLoggedIn = computed(() => !!token.value)
  const userInfo = computed(() => user.value)

  // 设置token
  const setToken = newToken => {
    token.value = newToken
    localStorage.setItem('token', newToken)
  }

  // 设置用户信息
  const setUser = userInfo => {
    user.value = userInfo
    localStorage.setItem('user', JSON.stringify(userInfo))
  }

  // 清除认证信息
  const clearAuth = () => {
    token.value = ''
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  // 登录
  const loginUser = async credentials => {
    loading.value = true
    try {
      const response = await login(credentials)
      setToken(response.token)
      setUser(response.user)
      return response
    } finally {
      loading.value = false
    }
  }

  // 注册
  const registerUser = async userData => {
    loading.value = true
    try {
      const response = await register(userData)
      setToken(response.token)
      setUser(response.user)
      return response
    } finally {
      loading.value = false
    }
  }

  // 退出登录
  const logoutUser = async () => {
    loading.value = true
    try {
      await logout()
    } catch (error) {
      console.error('退出登录失败:', error)
    } finally {
      clearAuth()
      loading.value = false
    }
  }

  // 获取用户信息
  const fetchUserInfo = async () => {
    if (!token.value) return null

    loading.value = true
    try {
      const userInfo = await getUserInfo()
      setUser(userInfo)
      return userInfo
    } catch (error) {
      console.error('获取用户信息失败:', error)
      // 如果获取用户信息失败，可能是token过期，清除认证信息
      clearAuth()
      throw error
    } finally {
      loading.value = false
    }
  }

  // 初始化认证状态
  const initAuth = async () => {
    if (token.value && !user.value) {
      try {
        await fetchUserInfo()
      } catch (error) {
        console.error('初始化认证状态失败:', error)
      }
    }
  }

  return {
    // 状态
    token,
    user,
    loading,

    // 计算属性
    isLoggedIn,
    userInfo,

    // 方法
    setToken,
    setUser,
    clearAuth,
    loginUser,
    registerUser,
    logoutUser,
    fetchUserInfo,
    initAuth
  }
})
