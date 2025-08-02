import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { loginApi, registerApi, getUserInfoApi } from '@/api/user'

export const useUserStore = defineStore('user', () => {
  // 状态
  const token = ref(localStorage.getItem('token') || '')
  const userInfo = ref({})
  const isLoggedIn = computed(() => !!token.value)

  // 登录
  const login = async loginData => {
    try {
      const response = await loginApi(loginData)
      const { token: userToken, userInfo: user } = response

      token.value = userToken
      userInfo.value = user
      localStorage.setItem('token', userToken)

      return { success: true }
    } catch (error) {
      console.error('登录失败:', error)
      return {
        success: false,
        message: error.message || '登录失败'
      }
    }
  }

  // 注册
  const register = async registerData => {
    try {
      const response = await registerApi(registerData)
      return { success: true, data: response }
    } catch (error) {
      console.error('注册失败:', error)
      return {
        success: false,
        message: error.message || '注册失败'
      }
    }
  }

  // 获取用户信息
  const getUserInfo = async () => {
    try {
      const response = await getUserInfoApi()
      userInfo.value = response
      return { success: true, data: response }
    } catch (error) {
      console.error('获取用户信息失败:', error)
      return {
        success: false,
        message: error.message || '获取用户信息失败'
      }
    }
  }

  // 登出
  const logout = () => {
    token.value = ''
    userInfo.value = {}
    localStorage.removeItem('token')
  }

  // 检查登录状态
  const checkAuth = async () => {
    if (!token.value) {
      return false
    }

    try {
      await getUserInfo()
      return true
    } catch (error) {
      logout()
      return false
    }
  }

  return {
    token,
    userInfo,
    isLoggedIn,
    login,
    register,
    getUserInfo,
    logout,
    checkAuth
  }
})
