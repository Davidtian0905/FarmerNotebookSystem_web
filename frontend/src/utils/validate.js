/**
 * 验证工具类
 * 提供常用的数据验证函数
 */

/**
 * 验证邮箱格式
 * @param {string} email - 邮箱地址
 * @returns {boolean} 是否有效
 */
export const validateEmail = email => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * 验证手机号格式（中国大陆）
 * @param {string} phone - 手机号
 * @returns {boolean} 是否有效
 */
export const validatePhone = phone => {
  const phoneRegex = /^1[3-9]\d{9}$/
  return phoneRegex.test(phone)
}

/**
 * 验证密码强度
 * @param {string} password - 密码
 * @returns {Object} 验证结果
 */
export const validatePassword = password => {
  const result = {
    isValid: false,
    score: 0,
    suggestions: []
  }

  if (!password) {
    result.suggestions.push('密码不能为空')
    return result
  }

  let score = 0

  // 长度检查
  if (password.length >= 8) {
    score += 1
  } else {
    result.suggestions.push('密码长度至少8位')
  }

  // 包含数字
  if (/\d/.test(password)) {
    score += 1
  } else {
    result.suggestions.push('密码应包含数字')
  }

  // 包含小写字母
  if (/[a-z]/.test(password)) {
    score += 1
  } else {
    result.suggestions.push('密码应包含小写字母')
  }

  // 包含大写字母
  if (/[A-Z]/.test(password)) {
    score += 1
  } else {
    result.suggestions.push('密码应包含大写字母')
  }

  // 包含特殊字符
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    score += 1
  } else {
    result.suggestions.push('密码应包含特殊字符')
  }

  result.score = score
  result.isValid = score >= 3

  return result
}

/**
 * 验证用户名格式
 * @param {string} username - 用户名
 * @returns {boolean} 是否有效
 */
export const validateUsername = username => {
  // 用户名：3-20位，只能包含字母、数字、下划线
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/
  return usernameRegex.test(username)
}

/**
 * 验证身份证号格式（中国大陆）
 * @param {string} idCard - 身份证号
 * @returns {boolean} 是否有效
 */
export const validateIdCard = idCard => {
  const idCardRegex =
    /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
  return idCardRegex.test(idCard)
}

/**
 * 验证URL格式
 * @param {string} url - URL地址
 * @returns {boolean} 是否有效
 */
export const validateUrl = url => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * 验证是否为数字
 * @param {any} value - 要验证的值
 * @returns {boolean} 是否为数字
 */
export const validateNumber = value => {
  return !isNaN(value) && !isNaN(parseFloat(value))
}

/**
 * 验证是否为正整数
 * @param {any} value - 要验证的值
 * @returns {boolean} 是否为正整数
 */
export const validatePositiveInteger = value => {
  return Number.isInteger(Number(value)) && Number(value) > 0
}

/**
 * 验证字符串长度
 * @param {string} str - 字符串
 * @param {number} min - 最小长度
 * @param {number} max - 最大长度
 * @returns {boolean} 是否在长度范围内
 */
export const validateLength = (str, min, max) => {
  const length = str ? str.length : 0
  return length >= min && length <= max
}

/**
 * 验证是否为空
 * @param {any} value - 要验证的值
 * @returns {boolean} 是否为空
 */
export const validateEmpty = value => {
  if (value === null || value === undefined) return true
  if (typeof value === 'string') return value.trim() === ''
  if (Array.isArray(value)) return value.length === 0
  if (typeof value === 'object') return Object.keys(value).length === 0
  return false
}

/**
 * 验证是否为有效日期
 * @param {string} date - 日期字符串
 * @returns {boolean} 是否为有效日期
 */
export const validateDate = date => {
  const dateObj = new Date(date)
  return dateObj instanceof Date && !isNaN(dateObj)
}

// 导出默认对象
export default {
  email: validateEmail,
  phone: validatePhone,
  password: validatePassword,
  username: validateUsername,
  idCard: validateIdCard,
  url: validateUrl,
  number: validateNumber,
  positiveInteger: validatePositiveInteger,
  length: validateLength,
  empty: validateEmpty,
  date: validateDate
}
