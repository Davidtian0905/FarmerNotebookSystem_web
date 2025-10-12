/**
 * Mock客户管理API接口
 * 模拟后端API，提供客户数据和交易统计
 */

// 导入数据库操作函数
import { getAllTransactions } from '../database_flow.js'
import { CUSTOMERS, getAllCustomers, getCustomerById } from '../data/customers_data.js'
// 导入工具函数
import { 
  createLogger,
  createSuccessResponse, 
  createErrorResponse, 
  ERROR_CODES 
} from '../utils/index.js'

// 导入前端计算模块
import { 
  calculateCustomerStatus, 
  calculateCustomerTransactionStats, 
  calculateCustomersWithStats, 
  getCustomerStatistics 
} from '@/stores/Customer_Calculations.js'

const logger = createLogger('CUSTOMERS_API')

/**
 * Mock客户管理API
 */
export const mockCustomersApi = {
  /**
   * 获取客户列表
   * @param {Object} params - 查询参数
   * @returns {Object} 标准API响应格式
   */
  getList(params = {}) {
    try {
      const { 
        page = 1, 
        pageSize = 10, 
        keyword = '', 
        customerStatus = 'all', 
        sortField = 'createTime', 
        sortOrder = 'desc' 
      } = params
      
      // 获取所有交易记录
      const allTransactions = getAllTransactions()
      
      // 获取所有客户基本信息
      let customerList = Object.values(CUSTOMERS)
      
      // 关键词搜索
      if (keyword) {
        const lowerKeyword = keyword.toLowerCase()
        customerList = customerList.filter(customer => 
          customer.customername.toLowerCase().includes(lowerKeyword) || 
          customer.customerphone.includes(lowerKeyword) || 
          (customer.customeraddress && customer.customeraddress.toLowerCase().includes(lowerKeyword))
        )
      }
      
      // 计算所有客户的交易统计和状态
      const customersWithStats = calculateCustomersWithStats(customerList, allTransactions)
      
      // 状态筛选
      let filteredCustomers = customersWithStats
      if (customerStatus !== 'all') {
        filteredCustomers = customersWithStats.filter(customer => 
          customer.customerStatus === customerStatus
        )
      }
      
      // 计算总数
      const total = filteredCustomers.length
      
      // 排序
      filteredCustomers.sort((a, b) => {
        let valueA = a[sortField]
        let valueB = b[sortField]
        
        // 日期类型特殊处理
        if (sortField.includes('Time')) {
          valueA = new Date(valueA || '1970-01-01')
          valueB = new Date(valueB || '1970-01-01')
        }
        
        // 数字类型特殊处理
        if (typeof valueA === 'number' && typeof valueB === 'number') {
          return sortOrder === 'asc' ? valueA - valueB : valueB - valueA
        }
        
        // 字符串类型
        if (sortOrder === 'asc') {
          return valueA > valueB ? 1 : -1
        } else {
          return valueA < valueB ? 1 : -1
        }
      })
      
      // 分页
      const startIndex = (page - 1) * pageSize
      const endIndex = startIndex + pageSize
      const pagedCustomers = filteredCustomers.slice(startIndex, endIndex)
      
      return createSuccessResponse({
        total,
        page: parseInt(page),
        pageSize: parseInt(pageSize),
        list: pagedCustomers
      }, '获取客户列表成功')
    } catch (error) {
      logger.error('获取客户列表失败:', error)
      return createErrorResponse(
        ERROR_CODES.INTERNAL_SERVER_ERROR,
        '系统异常：获取客户列表失败'
      )
    }
  },
  
  /**
   * 获取客户详情
   * @param {Object} params - 查询参数
   * @returns {Object} 标准API响应格式
   */
  getDetail(params = {}) {
    try {
      const { id } = params
      
      if (!id) {
        return createErrorResponse(
          ERROR_CODES.PARAM_ERROR,
          '客户ID不能为空'
        )
      }
      
      // 获取客户详情
      const customer = getCustomerById(id)
      
      if (!customer) {
        return createErrorResponse(
          ERROR_CODES.NOT_FOUND,
          '客户不存在'
        )
      }
      
      // 获取所有交易记录
      const allTransactions = getAllTransactions()
      
      // 计算客户的实际交易统计
      const stats = calculateCustomerTransactionStats(customer.customerId, allTransactions)
      
      // 计算客户状态
      const calculatedStatus = calculateCustomerStatus(customer, allTransactions, stats.lastTransactionTime)
      
      // 获取该客户的交易记录
      const customerTransactions = allTransactions.filter(transaction => 
        (transaction.type === 'OUTBOUND' || transaction.type === 'outbound') && 
        String(transaction.customerId) === String(id)
      ).sort((a, b) => {
        const dateA = new Date(`${a.date} ${a.time || '00:00:00'}`)
        const dateB = new Date(`${b.date} ${b.time || '00:00:00'}`)
        return dateB - dateA
      })
      
      // 返回完整的客户详情，包括动态计算的交易统计和交易记录
      return createSuccessResponse({
        ...customer,
        transactionCount: stats.transactionCount,
        transactionAmount: stats.transactionAmount,
        lastTransactionTime: stats.lastTransactionTime,
        customerStatus: calculatedStatus,
        transactions: customerTransactions
      }, '获取客户详情成功')
    } catch (error) {
      logger.error('获取客户详情失败:', error)
      return createErrorResponse(
        ERROR_CODES.INTERNAL_SERVER_ERROR,
        '系统异常：获取客户详情失败'
      )
    }
  },
  
  /**
   * 获取客户统计数据
   * @param {Object} params - 查询参数
   * @returns {Object} 标准API响应格式
   */
  getStatistics(params = {}) {
    try {
      const { dateRange = 90 } = params
      
      // 获取所有交易记录
      const allTransactions = getAllTransactions()
      
      // 获取所有客户基本信息
      const customerList = Object.values(CUSTOMERS)
      
      // 计算日期范围
      const now = new Date()
      const rangeDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dateRange)
      
      // 计算每个客户的交易统计和状态
      const customersWithStats = calculateCustomersWithStats(customerList, allTransactions)
      
      // 使用前端计算模块获取客户统计数据
      const statistics = getCustomerStatistics(customersWithStats)
      
      return createSuccessResponse(statistics, '获取客户统计数据成功')
    } catch (error) {
      logger.error('获取客户统计数据失败:', error)
      return createErrorResponse(
        ERROR_CODES.INTERNAL_SERVER_ERROR,
        '系统异常：获取客户统计数据失败'
      )
    }
  },
  
  /**
   * 添加客户
   * @param {Object} params - 客户信息
   * @returns {Object} 标准API响应格式
   */
  add(params = {}) {
    try {
      const { 
        customername, 
        customerphone, 
        customeraddress, 
        discountRate = 1.0, 
        customercontact, 
        customsource,
        notes, 
        customerStatus = 'active',
        customcategory,
        customergrade
      } = params
      
      // 参数验证
      if (!customername || !customerphone || !customeraddress) {
        return createErrorResponse(
          ERROR_CODES.PARAM_ERROR,
          '客户名称、电话和地址不能为空'
        )
      }
      
      // 生成客户ID
      const customerId = `CUS${Date.now().toString().slice(-6)}`
      
      // 创建客户对象
      const now = new Date().toISOString().replace('T', ' ').slice(0, 19)
      const newCustomer = {
        customerId,
        customername,
        customerphone,
        customeraddress,
        discountRate,
        customercontact,
        customsource,
        customcategory,
        customergrade,
        createTime: now,
        updateTime: now,
        customerStatus,
        transactionCount: 0,
        transactionAmount: 0,
        lastTransactionTime: null,
        notes
      }
      
      // 在实际应用中，这里会将客户信息保存到数据库
      // 在Mock环境中，我们只返回成功响应
      
      return createSuccessResponse(newCustomer, '添加客户成功')
    } catch (error) {
      logger.error('添加客户失败:', error)
      return createErrorResponse(
        ERROR_CODES.INTERNAL_SERVER_ERROR,
        '系统异常：添加客户失败'
      )
    }
  },
  
  /**
   * 编辑客户
   * @param {Object} params - 客户信息
   * @returns {Object} 标准API响应格式
   */
  update(params = {}) {
    try {
      const { 
        id,
        customername, 
        customerphone, 
        customeraddress, 
        discountRate, 
        customercontact, 
        customsource,
        notes, 
        customerStatus,
        customcategory,
        customergrade
      } = params
      
      // 参数验证
      if (!id) {
        return createErrorResponse(
          ERROR_CODES.PARAM_ERROR,
          '客户ID不能为空'
        )
      }
      
      // 获取客户基本信息
      const customer = CUSTOMERS[id]
      
      if (!customer) {
        return createErrorResponse(
          ERROR_CODES.NOT_FOUND,
          '客户不存在'
        )
      }
      
      // 获取所有交易记录
      const allTransactions = getAllTransactions()
      
      // 计算客户的实际交易统计
      const stats = calculateCustomerTransactionStats(id, allTransactions)
      
      // 更新客户信息
      const updatedCustomer = {
        ...customer,
        customername: customername || customer.customername,
        customerphone: customerphone || customer.customerphone,
        customeraddress: customeraddress || customer.customeraddress,
        discountRate: discountRate !== undefined ? discountRate : customer.discountRate,
        customercontact: customercontact !== undefined ? customercontact : customer.customercontact,
        customsource: customsource !== undefined ? customsource : customer.customsource,
        customcategory: customcategory !== undefined ? customcategory : customer.customcategory,
        customergrade: customergrade !== undefined ? customergrade : customer.customergrade,
        notes: notes !== undefined ? notes : customer.notes,
        customerStatus: customerStatus || customer.customerStatus,
        updateTime: new Date().toISOString().replace('T', ' ').slice(0, 19),
        // 使用动态计算的交易统计
        transactionCount: stats.transactionCount,
        transactionAmount: stats.transactionAmount,
        lastTransactionTime: stats.lastTransactionTime
      }
      
      // 在实际应用中，这里会将更新后的客户信息保存到数据库
      // 在Mock环境中，我们只返回成功响应
      
      return createSuccessResponse(updatedCustomer, '更新客户成功')
    } catch (error) {
      logger.error('更新客户失败:', error)
      return createErrorResponse(
        ERROR_CODES.INTERNAL_SERVER_ERROR,
        '系统异常：更新客户失败'
      )
    }
  },
  
  /**
   * 删除客户
   * @param {Object} params - 查询参数
   * @returns {Object} 标准API响应格式
   */
  delete(params = {}) {
    try {
      const { id } = params
      
      // 参数验证
      if (!id) {
        return createErrorResponse(
          ERROR_CODES.PARAM_ERROR,
          '客户ID不能为空'
        )
      }
      
      // 获取客户基本信息
      const customer = CUSTOMERS[id]
      
      if (!customer) {
        return createErrorResponse(
          ERROR_CODES.NOT_FOUND,
          '客户不存在'
        )
      }
      
      // 在实际应用中，这里会从数据库中删除客户信息
      // 在Mock环境中，我们只返回成功响应
      
      return createSuccessResponse(null, '删除客户成功')
    } catch (error) {
      logger.error('删除客户失败:', error)
      return createErrorResponse(
        ERROR_CODES.INTERNAL_SERVER_ERROR,
        '系统异常：删除客户失败'
      )
    }
  },
  
  /**
   * 更新客户状态
   * @param {Object} params - 查询参数
   * @returns {Object} 标准API响应格式
   */
  updateStatus(params = {}) {
    try {
      const { id, customerStatus } = params
      
      // 参数验证
      if (!id || !customerStatus) {
        return createErrorResponse(
          ERROR_CODES.PARAM_ERROR,
          '客户ID和状态不能为空'
        )
      }
      
      // 状态验证
      if (!['active', 'disabled'].includes(customerStatus)) {
        return createErrorResponse(
          ERROR_CODES.PARAM_ERROR,
          '状态值无效，只能为active或disabled'
        )
      }
      
      // 获取客户基本信息
      const customer = CUSTOMERS[id]
      
      if (!customer) {
        return createErrorResponse(
          ERROR_CODES.NOT_FOUND,
          '客户不存在'
        )
      }
      
      // 更新状态
      const now = new Date().toISOString().replace('T', ' ').slice(0, 19)
      
      // 在实际应用中，这里会更新数据库中的客户状态
      // 在Mock环境中，我们只返回成功响应
      
      return createSuccessResponse({
        id,
        customerStatus,
        updateTime: now
      }, '更新客户状态成功')
    } catch (error) {
      logger.error('更新客户状态失败:', error)
      return createErrorResponse(
        ERROR_CODES.INTERNAL_SERVER_ERROR,
        '系统异常：更新客户状态失败'
      )
    }
  }
}