import { showToast } from 'vant'

/**
 * 通用API响应处理工具
 */
export class ApiResponseHandler {
  /**
   * 处理API响应
   * @param {Object} response - API响应对象
   * @param {boolean} showMessage - 是否显示消息提示
   * @returns {Object} 处理后的数据
   */
  static handle(response, showMessage = true) {
    console.log('ApiResponseHandler.handle 输入:', response)
    
    const { error, body, message } = response.data

    // 记录响应日志
    this.logResponse(response)

    // 处理不同的错误码
    switch (error) {
      case 0:
        // 成功，返回数据
        console.log('API响应成功:', { body, message })
        return {
          success: true,
          data: body,
          message: message || '操作成功'
        }

      case 401:
        // 需要登录
        if (showMessage) {
          showToast('请先登录')
        }
        // 清除本地存储的token
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        // 跳转到登录页
        window.location.href = '/login'
        return {
          success: false,
          data: null,
          message: '请先登录'
        }

      case 500:
        // 系统异常
        if (showMessage) {
          showToast('系统异常，请稍后重试')
        }
        return {
          success: false,
          data: null,
          message: '系统异常，请稍后重试'
        }

      default:
        // 其他业务异常
        console.log('API响应失败:', { error, message })
        if (showMessage) {
          showToast(message || '操作失败')
        }
        return {
          success: false,
          data: null,
          message: message || '操作失败'
        }
    }
  }

  /**
   * 处理成功响应
   * @param {Object} response - API响应对象
   * @returns {Object} 处理后的数据
   */
  static handleSuccess(response) {
    return this.handle(response, false)
  }

  /**
   * 处理错误响应
   * @param {Object} response - API响应对象
   * @returns {Object} 处理后的数据
   */
  static handleError(response) {
    return this.handle(response, true)
  }

  /**
   * 检查响应是否成功
   * @param {Object} response - API响应对象
   * @returns {boolean} 是否成功
   */
  static isSuccess(response) {
    return response.data.error === 0
  }

  /**
   * 获取响应数据
   * @param {Object} response - API响应对象
   * @returns {Object} 响应数据
   */
  static getData(response) {
    return response.data.body
  }

  /**
   * 获取响应消息
   * @param {Object} response - API响应对象
   * @returns {string} 响应消息
   */
  static getMessage(response) {
    return response.data.message
  }

  /**
   * 获取错误码
   * @param {Object} response - API响应对象
   * @returns {number} 错误码
   */
  static getErrorCode(response) {
    return response.data.error
  }

  /**
   * 记录响应日志
   * @param {Object} response - API响应对象
   */
  static logResponse(response) {
    const { error, body, message } = response.data
    const timestamp = new Date().toISOString()

    console.log(`[API Response] ${timestamp}`, {
      url: response.config?.url,
      method: response.config?.method,
      error,
      message,
      hasData: !!body
    })
  }

  /**
   * 记录错误日志
   * @param {Error} error - 错误对象
   * @param {Object} config - 请求配置
   */
  static logError(error, config = {}) {
    const timestamp = new Date().toISOString()

    console.error(`[API Error] ${timestamp}`, {
      url: config.url,
      method: config.method,
      error: error.message,
      stack: error.stack
    })
  }
}

/**
 * 创建API Promise包装器
 * @param {Function} apiCall - API调用函数
 * @param {boolean} showMessage - 是否显示消息提示
 * @returns {Promise} 包装后的Promise
 */
export function createApiPromise(apiCall, showMessage = true) {
  return apiCall()
    .then(response => {
      console.log('API响应处理:', response)
      
      console.log('createApiPromise 处理响应:', response)
      
      // 检查响应格式并处理
      console.log('createApiPromise 处理响应:', response)
      
      // 情况1：标准API响应格式 {error: 0, body: {...}, message: ''}
      if (
        response &&
        response.data &&
        response.data.error !== undefined &&
        response.data.body !== undefined
      ) {
        console.log('处理标准API响应格式')
        const result = ApiResponseHandler.handle(
          { data: response.data },
          showMessage
        )
        if (result.success) {
          return result.data
        } else {
          throw new Error(result.message)
        }
      }
      // 情况2：Mock响应直接返回 {error: 0, body: {...}, message: ''}
      else if (
        response &&
        response.error !== undefined &&
        response.body !== undefined
      ) {
        console.log('处理直接Mock响应格式')
        const result = ApiResponseHandler.handle(
          { data: response },
          showMessage
        )
        if (result.success) {
          return result.data
        } else {
          throw new Error(result.message)
        }
      }
      // 情况3：Mock响应包装在response.data中
      else if (
        response &&
        response.data &&
        typeof response.data === 'object' &&
        response.data.error !== undefined &&
        response.data.body !== undefined
      ) {
        console.log('处理Mock响应包装格式')
        const result = ApiResponseHandler.handle(
          { data: response.data },
          showMessage
        )
        if (result.success) {
          return result.data
        } else {
          throw new Error(result.message)
        }
      }
      // 情况4：直接返回数据格式（Mock数据）
      else if (
        response &&
        response.data &&
        typeof response.data === 'object' &&
        !response.data.error &&
        !response.data.body
      ) {
        console.log('处理直接数据格式')
        return response.data
      }
      // 情况5：其他格式，尝试直接返回
      else {
        console.log('处理其他响应格式')
        return response.data || response
      }
    })
    .catch(error => {
      // 记录错误日志
      ApiResponseHandler.logError(error)

      console.error('API请求失败:', error)
      if (showMessage) {
        showToast(error.message || '请求失败')
      }
      throw error
    })
}

/**
 * 批量处理API请求
 * @param {Array} apiCalls - API调用函数数组
 * @param {boolean} showMessage - 是否显示消息提示
 * @returns {Promise} 包装后的Promise
 */
export function createBatchApiPromise(apiCalls, showMessage = true) {
  return Promise.all(
    apiCalls.map(apiCall => createApiPromise(apiCall, showMessage))
  )
}

/**
 * 创建带重试的API请求
 * @param {Function} apiCall - API调用函数
 * @param {number} maxRetries - 最大重试次数
 * @param {number} delay - 重试延迟（毫秒）
 * @param {boolean} showMessage - 是否显示消息提示
 * @returns {Promise} 包装后的Promise
 */
export function createRetryApiPromise(
  apiCall,
  maxRetries = 3,
  delay = 1000,
  showMessage = true
) {
  return new Promise((resolve, reject) => {
    let retryCount = 0

    const attempt = () => {
      createApiPromise(apiCall, showMessage)
        .then(resolve)
        .catch(error => {
          retryCount++
          if (retryCount <= maxRetries) {
            console.log(`API请求失败，${delay}ms后进行第${retryCount}次重试`)
            setTimeout(attempt, delay)
          } else {
            reject(error)
          }
        })
    }

    attempt()
  })
}

/**
 * 创建带缓存的API请求
 * @param {Function} apiCall - API调用函数
 * @param {string} cacheKey - 缓存键
 * @param {number} cacheTime - 缓存时间（毫秒）
 * @param {boolean} showMessage - 是否显示消息提示
 * @returns {Promise} 包装后的Promise
 */
export function createCachedApiPromise(
  apiCall,
  cacheKey,
  cacheTime = 5 * 60 * 1000,
  showMessage = true
) {
  return new Promise((resolve, reject) => {
    // 检查缓存
    const cached = localStorage.getItem(cacheKey)
    if (cached) {
      try {
        const { data, timestamp } = JSON.parse(cached)
        if (Date.now() - timestamp < cacheTime) {
          console.log(`使用缓存数据: ${cacheKey}`)
          resolve(data)
          return
        }
      } catch (error) {
        console.warn('缓存数据解析失败:', error)
      }
    }

    // 发起请求
    createApiPromise(apiCall, showMessage)
      .then(data => {
        // 缓存数据
        localStorage.setItem(
          cacheKey,
          JSON.stringify({
            data,
            timestamp: Date.now()
          })
        )
        resolve(data)
      })
      .catch(reject)
  })
}

/**
 * 清除API缓存
 * @param {string} cacheKey - 缓存键（可选，不传则清除所有API缓存）
 */
export function clearApiCache(cacheKey = null) {
  if (cacheKey) {
    localStorage.removeItem(cacheKey)
  } else {
    // 清除所有以 'api_cache_' 开头的缓存
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('api_cache_')) {
        localStorage.removeItem(key)
      }
    })
  }
}
