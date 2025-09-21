/**
 * Toast 消息提示工具函数
 * 对 vant 的 showToast 进行封装，统一管理消息提示
 */
import { showToast as vantShowToast } from 'vant'

/**
 * 显示普通提示
 * @param {string|object} message 提示信息或配置对象
 * @param {object} options 可选配置
 */
export const showToast = (message, options = {}) => {
  if (typeof message === 'string') {
    vantShowToast({
      message,
      position: 'middle',
      duration: 2000,
      ...options
    })
  } else {
    vantShowToast(message)
  }
}

/**
 * 显示成功提示
 * @param {string} message 提示信息
 * @param {object} options 可选配置
 */
export const showSuccessToast = (message, options = {}) => {
  vantShowToast({
    message,
    type: 'success',
    position: 'middle',
    duration: 2000,
    ...options
  })
}

/**
 * 显示失败提示
 * @param {string} message 提示信息
 * @param {object} options 可选配置
 */
export const showErrorToast = (message, options = {}) => {
  vantShowToast({
    message,
    type: 'fail',
    position: 'middle',
    duration: 2000,
    ...options
  })
}

/**
 * 显示加载提示
 * @param {string} message 提示信息
 * @param {object} options 可选配置
 * @returns {Function} 关闭加载提示的函数
 */
export const showLoadingToast = (message = '加载中...', options = {}) => {
  vantShowToast({
    message,
    type: 'loading',
    position: 'middle',
    duration: 0, // 持续显示
    forbidClick: true, // 禁止背景点击
    ...options
  })
  
  // 返回关闭函数
  return () => vantShowToast.clear()
}

export default {
  showToast,
  showSuccessToast,
  showErrorToast,
  showLoadingToast
}