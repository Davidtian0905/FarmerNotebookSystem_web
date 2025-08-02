/**
 * Mock数据服务 - 兼容层
 * 用于开发和测试阶段，模拟后端API响应
 * 此文件作为兼容层，重新导出所有mock函数以保持向后兼容
 */

// 重新导出所有mock函数
export {
  // 认证相关
  mockLogin,
  mockRegister,
  mockSendVerificationCode,
  mockVerifyCode,
  mockResetPassword,
  
  // 仪表板相关 - 新API
  mockGetRecentWeekData,
  mockGetTodayData,
  mockGetTrendData,
  // 兼容性导出
  mockGetDashboardOverview,
  mockGetDashboardStats,
  mockGetChartData,
  
  // 用户管理相关
  mockGetUserInfo,
  mockRefreshToken,
  mockLogout,
  mockUpdateUserInfo,
  mockChangePassword,
  
  // 通用工具
  isMockMode,
  toggleMockMode,
  getMockModeStatus,
  setMockMode,
  clearMockMode,
  getMockConfig,
  mockDelay,
  createMockResponse,
  createSuccessResponse,
  createErrorResponse,
  mockNetworkError,
  mockServerError,
  mockAuthError,
  mockBusinessError,
  generateMockId,
  generateMockTimestamp,
  createMockPagination,
  mockSearch,
  mockSort
} from '../mock'

// 兼容性导出 - 保持原有API名称
export {
  mockGetDashboardOverview as mockDashboardOverview,
  mockGetDashboardStats as mockDashboardStats,
  mockGetChartData as mockDashboardChartData
} from '../mock'

// 默认导出
export default {
  // 认证相关
  mockLogin,
  mockRegister,
  mockSendVerificationCode,
  mockVerifyCode,
  mockResetPassword,
  
  // 仪表板相关 - 新API
  mockGetRecentWeekData,
  mockGetTodayData,
  mockGetTrendData,
  // 兼容性导出
  mockGetDashboardOverview,
  mockGetDashboardStats,
  mockGetChartData,
  
  // 用户管理相关
  mockGetUserInfo,
  mockRefreshToken,
  mockLogout,
  mockUpdateUserInfo,
  mockChangePassword,
  
  // 通用工具
  isMockMode,
  toggleMockMode,
  getMockModeStatus,
  setMockMode,
  clearMockMode,
  getMockConfig,
  mockDelay,
  createMockResponse,
  createSuccessResponse,
  createErrorResponse,
  mockNetworkError,
  mockServerError,
  mockAuthError,
  mockBusinessError,
  generateMockId,
  generateMockTimestamp,
  createMockPagination,
  mockSearch,
  mockSort
}
