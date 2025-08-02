/**
 * 本地存储工具类
 * 提供统一的localStorage操作接口
 */

/**
 * 设置存储项
 * @param {string} key - 键名
 * @param {any} value - 值
 * @param {number} expire - 过期时间（毫秒），可选
 */
export const setStorage = (key, value, expire = null) => {
  try {
    const data = {
      value,
      timestamp: Date.now()
    }

    if (expire) {
      data.expire = expire
    }

    localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.error('设置存储失败:', error)
  }
}

/**
 * 获取存储项
 * @param {string} key - 键名
 * @param {any} defaultValue - 默认值
 * @returns {any} 存储的值或默认值
 */
export const getStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key)
    if (!item) return defaultValue

    const data = JSON.parse(item)

    // 检查是否过期
    if (data.expire && Date.now() - data.timestamp > data.expire) {
      removeStorage(key)
      return defaultValue
    }

    return data.value
  } catch (error) {
    console.error('获取存储失败:', error)
    return defaultValue
  }
}

/**
 * 删除存储项
 * @param {string} key - 键名
 */
export const removeStorage = key => {
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error('删除存储失败:', error)
  }
}

/**
 * 清空所有存储
 */
export const clearStorage = () => {
  try {
    localStorage.clear()
  } catch (error) {
    console.error('清空存储失败:', error)
  }
}

/**
 * 检查存储项是否存在
 * @param {string} key - 键名
 * @returns {boolean} 是否存在
 */
export const hasStorage = key => {
  try {
    return localStorage.getItem(key) !== null
  } catch (error) {
    console.error('检查存储失败:', error)
    return false
  }
}

/**
 * 获取存储项数量
 * @returns {number} 存储项数量
 */
export const getStorageSize = () => {
  try {
    return localStorage.length
  } catch (error) {
    console.error('获取存储大小失败:', error)
    return 0
  }
}

/**
 * 获取所有存储键名
 * @returns {string[]} 键名数组
 */
export const getStorageKeys = () => {
  try {
    return Object.keys(localStorage)
  } catch (error) {
    console.error('获取存储键名失败:', error)
    return []
  }
}

// 导出默认对象
export default {
  set: setStorage,
  get: getStorage,
  remove: removeStorage,
  clear: clearStorage,
  has: hasStorage,
  size: getStorageSize,
  keys: getStorageKeys
}
