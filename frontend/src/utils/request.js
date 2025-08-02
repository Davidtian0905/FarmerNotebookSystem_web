import axios from 'axios'
import { showToast } from 'vant'
import { isMockMode } from '@/mock/utils.js'
import mockServer from '@/mock/server.js'

// 获取API模式
const getApiMode = () => {
  return localStorage.getItem('apiMode') || 'mock'
}

// 获取动态baseURL
const getBaseURL = () => {
  const mode = getApiMode()
  if (mode === 'mock') {
    return '' // 使用相对路径，避免代理
  } else {
    return import.meta.env.VITE_API_BASE_URL || '/api'
  }
}

// 创建axios实例
const request = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  },
  // 自定义适配器，拦截Mock请求
  adapter: (config) => {
    // 如果是Mock请求，直接返回Mock数据
    if (config._isMockRequest && config._mockResponse) {
      console.log('适配器拦截Mock请求:', config.url)
      return Promise.resolve({
        data: config._mockResponse,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: config,
        request: {}
      })
    }
    
    // 否则使用默认的HTTP适配器
    return axios.defaults.adapter(config)
  }
})

// 动态更新baseURL
request.interceptors.request.use(
  config => {
    config.baseURL = getBaseURL()
    return config
  }
)

// 请求拦截器
request.interceptors.request.use(
  async config => {
    // 检查是否强制使用Mock模式
    const apiMode = getApiMode()
    const mockModeEnabled = isMockMode()
    
    if (apiMode === 'mock' || mockModeEnabled) {
      console.log('强制使用Mock模式，拦截请求:', config.url)
      
      try {
        // 直接使用Mock服务器处理请求
        const mockResponse = await mockServer.handleRequest(
          config.url,
          config.method,
          config.data
        )
        
        console.log('Mock服务器返回:', mockResponse)
        
        // 标记这是一个Mock请求，避免发送真实请求
        config._isMockRequest = true
        config._mockResponse = mockResponse
        
      } catch (mockError) {
        console.error('Mock服务器错误:', mockError)
      }
    }

    // 从localStorage获取token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.auth = token
    }

    console.log(
      '发送请求:',
      config.method?.toUpperCase(),
      config.url,
      config.data
    )
    return config
  },
  error => {
    console.error('请求拦截器错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  response => {
    console.log('收到响应:', response.config.url, response.data)

    // 检查响应状态
    if (response.status >= 200 && response.status < 300) {
      return response
    } else {
      throw new Error(`HTTP错误: ${response.status}`)
    }
  },
  async error => {
    console.error('响应拦截器错误:', error)

    // 检查是否启用mock模式或后端不可用
    const mockModeEnabled = isMockMode()
    const apiMode = getApiMode()
    const isDev = import.meta.env.DEV || process.env.NODE_ENV === 'development'
    
    // 根据API模式决定是否使用Mock - 优先检查apiMode
    const shouldUseMock = apiMode === 'mock' || 
                         mockModeEnabled ||
                         error.code === 'ECONNREFUSED' || 
                         (error.response && (error.response.status >= 500 || error.response.status === 404)) ||
                         (isDev && apiMode !== 'backend')

    console.log('Mock模式检查:', {
      isMockMode: mockModeEnabled,
      errorCode: error.code,
      responseStatus: error.response?.status,
      environment: isDev ? 'development' : 'production',
      shouldUseMock,
      url: error.config?.url
    })

    if (shouldUseMock) {
      console.log('使用Mock数据:', error.config.url)
      
      try {
        // 使用mock服务器处理请求
        const mockResponse = await mockServer.handleRequest(
          error.config.url,
          error.config.method,
          error.config.data
        )
        
        console.log('Mock服务器返回:', mockResponse)
        
        // 返回模拟的axios响应格式
        console.log('包装Mock响应为axios格式:', mockResponse)
        return {
          data: mockResponse,
          status: 200,
          statusText: 'OK',
          headers: {},
          config: error.config,
          request: {}
        }
      } catch (mockError) {
        console.error('Mock服务器错误:', mockError)
        showToast('Mock数据加载失败')
        return Promise.reject(mockError)
      }
    }

    // 处理网络错误
    if (error.code === 'ECONNABORTED') {
      showToast('请求超时，请检查网络连接')
    } else if (error.response) {
      // 服务器返回错误状态码
      const { status, data } = error.response

      switch (status) {
        case 401:
          // 未授权，清除token并跳转到登录页
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          showToast('登录已过期，请重新登录')
          window.location.href = '/login'
          break
        case 403:
          showToast('没有权限访问该资源')
          break
        case 404:
          showToast('请求的资源不存在')
          break
        case 500:
          showToast('服务器内部错误，请稍后重试')
          break
        default:
          showToast(data?.message || '请求失败')
      }
    } else if (error.request) {
      // 请求已发出但没有收到响应
      showToast('网络连接失败，请检查网络设置')
    } else {
      // 其他错误
      showToast('请求失败，请稍后重试')
    }

    return Promise.reject(error)
  }
)

// 导出request实例
export default request
