/**
 * Mock数据模块入口文件
 * 统一导出所有mock相关的功能模块
 */

// 导入基础数据库模块
export * from './database.js'
export * from './database_flow.js'
export * from './database_assets.js'
export * from './event_system.js'

// 导入Mock API模块
export * from './api/index.js'

// 导入认证相关mock
export * from './auth.js'

// 导入用户相关mock
export * from './user.js'

// 导入仪表板相关mock
export * from './dashboard.js'

// 导入服务器模拟
export * from './server.js'

// 导入工具函数
export * from './utils.js'

/**
 * 初始化Mock系统
 * 设置默认数据并启动事件监听
 */
export const initializeMockSystem = async () => {
  console.log('=== 初始化Mock系统 ===')
  const { debugTransactionData, initializeTransactionData } = await import('./database_flow.js')
  const { debugAssetsData } = await import('./database_assets.js')
  const { debugEventSystem } = await import('./event_system.js')
  
  // 初始化交易数据
  initializeTransactionData()
  
  debugTransactionData()
  debugAssetsData()
  debugEventSystem()
  console.log('Mock系统初始化完成')
}

/**
 * 重置Mock系统
 * 清除所有数据并恢复到默认状态
 */
export const resetMockSystem = async () => {
  console.log('=== 重置Mock系统 ===')
  
  // 导入重置函数
  const { resetTransactionData } = await import('./database_flow.js')
  const { clearCache } = await import('./event_system.js')
  
  // 清除所有数据
  resetTransactionData()
  clearCache()
  
  console.log('Mock系统已重置')
}

/**
 * 获取Mock系统状态
 * @returns {Object} 系统状态信息
 */
export const getMockSystemStatus = async () => {
  const { getTransactionStatistics } = await import('./database_flow.js')
  const { getEventSystemStats } = await import('./event_system.js')
  
  return {
    transactions: getTransactionStatistics(),
    events: getEventSystemStats(),
    timestamp: new Date().toISOString()
  }
} 