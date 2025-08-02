import request from '@/utils/request'
import { createApiPromise } from '@/utils/apiResponse'
import {
  mockLogin,
  mockRegister,
  mockSendVerificationCode,
  mockVerifyCode,
  mockResetPassword,
  mockGetUserInfo,
  mockRefreshToken,
  mockLogout,
  isMockMode
} from '../mock'

/**
 * 用户登录
 * @param {Object} data - 登录数据
 * @param {string} data.username - 用户名
 * @param {string} data.password - 密码
 * @param {boolean} data.rememberMe - 记住我
 * @returns {Promise} 登录结果
 */
export const login = data => {
  if (isMockMode()) {
    return createApiPromise(() =>
      mockLogin(data.username, data.password, data.rememberMe)
    )
  }
  return createApiPromise(() => request.post('/auth/login', data))
}

/**
 * 用户注册
 * @param {Object} data - 注册数据
 * @returns {Promise} 注册结果
 */
export const register = data => {
  if (isMockMode()) {
    return createApiPromise(() => mockRegister(data))
  }
  return createApiPromise(() => request.post('/auth/register', data))
}

/**
 * 发送验证码（忘记密码）
 * @param {Object} data - 邮箱数据
 * @param {string} data.email - 邮箱地址
 * @returns {Promise} 发送结果
 */
export const sendVerificationCode = data => {
  if (isMockMode()) {
    return createApiPromise(() => mockSendVerificationCode(data.email))
  }
  return createApiPromise(() =>
    request.post('/auth/forgot-password/send-code', data)
  )
}

/**
 * 忘记密码（发送验证码）
 * @param {Object} data - 邮箱数据
 * @param {string} data.email - 邮箱地址
 * @returns {Promise} 发送结果
 */
export const forgotPassword = data => {
  if (isMockMode()) {
    return createApiPromise(() => mockSendVerificationCode(data.email))
  }
  return createApiPromise(() =>
    request.post('/auth/forgot-password/send-code', data)
  )
}

/**
 * 验证验证码
 * @param {Object} data - 验证码数据
 * @param {string} data.email - 邮箱地址
 * @param {string} data.code - 验证码
 * @returns {Promise} 验证结果
 */
export const verifyCode = data => {
  if (isMockMode()) {
    return createApiPromise(() => mockVerifyCode(data.email, data.code))
  }
  return createApiPromise(() =>
    request.post('/auth/forgot-password/verify-code', data)
  )
}

/**
 * 重置密码
 * @param {Object} data - 重置密码数据
 * @returns {Promise} 重置结果
 */
export const resetPassword = data => {
  if (isMockMode()) {
    return createApiPromise(() =>
      mockResetPassword(
        data.email,
        data.resetToken,
        data.newPassword,
        data.confirmPassword
      )
    )
  }
  return createApiPromise(() =>
    request.post('/auth/forgot-password/reset', data)
  )
}

/**
 * 获取用户信息
 * @returns {Promise} 用户信息
 */
export const getUserInfo = () => {
  if (isMockMode()) {
    const token = localStorage.getItem('token')
    return createApiPromise(() => mockGetUserInfo(token))
  }
  return createApiPromise(() => request.get('/auth/user-info'))
}

/**
 * 刷新令牌
 * @returns {Promise} 刷新结果
 */
export const refreshToken = () => {
  if (isMockMode()) {
    const token = localStorage.getItem('token')
    return createApiPromise(() => mockRefreshToken(token))
  }
  return createApiPromise(() => request.post('/auth/refresh-token'))
}

/**
 * 用户登出
 * @returns {Promise} 登出结果
 */
export const logout = () => {
  if (isMockMode()) {
    return createApiPromise(() => mockLogout())
  }
  return createApiPromise(() => request.post('/auth/logout'))
}
