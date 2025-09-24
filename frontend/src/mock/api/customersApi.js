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

const logger = createLogger('CUSTOMERS_API')

/**
 * 计算客户状态
 * @param {Object} customer - 客户基本信息
 * @param {Array} transactions - 该客户的交易记录
 * @returns {string} 客户状态
 */
const calculateCustomerStatus = (customer, transactions, lastTransactionTime) => {
  // 获取当前日期
  const now = new Date()
  const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
  const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate())
  
  // 如果客户已手动设置为停用状态，则保持该状态
  if (customer.customerStatus === 'disabled') {
    return 'disabled'
  }
  
  // 创建时间在一个月内的为新增客户
  const createTime = new Date(customer.createTime)
  if (createTime > oneMonthAgo) {
    return 'new'
  }
  
  // 没有交易记录或最后交易时间超过三个月的为待激活
  if (!lastTransactionTime || new Date(lastTransactionTime) < threeMonthsAgo) {
    return 'inactive'
  }
  
  // 最近三个月的交易次数超过10次的为活跃客户
  const recentTransactions = transactions.filter(t => 
    new Date(t.date) >= threeMonthsAgo && 
    String(t.customerId) === String(customer.customerId)
  )
  
  if (recentTransactions.length >= 10) {
    return 'active'
  }
  
  // 其他情况为一般客户
  return 'normal'
}

/**
 * 计算客户交易统计数据
 * @param {string} customerId - 客户ID
 * @param {Array} allTransactions - 所有交易记录
 * @returns {Object} 交易统计数据
 */
const calculateCustomerTransactionStats = (customerId, allTransactions) => {
  // 筛选该客户的所有出库交易记录
  // 注意：transaction.customerId可能是字符串格式，需要确保比较的一致性
  console.log(`正在筛选客户ID ${customerId} 的交易记录，总交易记录数:`, allTransactions.length);
  console.log(`客户ID类型:`, typeof customerId);
  
  // 输出前5条交易记录的customerId字段，查看数据格式
  console.log('前5条交易记录的customerId字段:');
  allTransactions.slice(0, 5).forEach((t, i) => {
    console.log(`交易${i+1}: type=${t.type}, customerId=${t.customerId}, 类型=${typeof t.customerId}`);
  });
  
  // 修改筛选逻辑，只筛选OUTBOUND类型且customerId不为undefined的交易记录
  const customerTransactions = allTransactions.filter(transaction => {
    const isOutbound = transaction.type === 'OUTBOUND' || transaction.type === 'outbound';
    const hasCustomerId = transaction.customerId !== undefined;
    const isMatchingCustomer = hasCustomerId && String(transaction.customerId) === String(customerId);
    
    return isOutbound && isMatchingCustomer;
  });
  
  // 调试日志，查看筛选结果
  console.log(`找到客户ID ${customerId} 的交易记录:`, customerTransactions.length);
  if (customerTransactions.length > 0) {
    console.log('第一条匹配的交易记录:', customerTransactions[0]);
  }
  
  // 计算交易次数
  const transactionCount = customerTransactions.length
  
  // 计算交易总金额
  const transactionAmount = customerTransactions.reduce((sum, transaction) => 
    sum + (transaction.totalPrice || 0), 0
  )
  
  // 获取最后交易时间
  let lastTransactionTime = null
  if (transactionCount > 0) {
    // 按日期排序，获取最新的交易记录
    const sortedTransactions = [...customerTransactions].sort((a, b) => {
      const dateA = new Date(`${a.date} ${a.time || '00:00:00'}`)
      const dateB = new Date(`${b.date} ${b.time || '00:00:00'}`)
      return dateB - dateA
    })
    
    const lastTransaction = sortedTransactions[0]
    lastTransactionTime = `${lastTransaction.date} ${lastTransaction.time || '00:00:00'}`
  }
  
  return {
    transactionCount,
    transactionAmount,
    lastTransactionTime
  }
}

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
        status = 'all', 
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
      
      // 状态筛选
      if (status !== 'all') {
        customerList = customerList.filter(customer => {
          // 计算客户的实际交易统计
          const stats = calculateCustomerTransactionStats(customer.customerId, allTransactions)
          // 计算客户状态
          const calculatedStatus = calculateCustomerStatus(customer, allTransactions, stats.lastTransactionTime)
          return calculatedStatus === status
        })
      }
      
      // 计算总数
      const total = customerList.length
      
      // 排序
      customerList.sort((a, b) => {
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
      const pagedCustomers = customerList.slice(startIndex, endIndex)
      
      // 为每个客户计算实际交易统计数据
      const result = pagedCustomers.map(customer => {
        // 计算客户的实际交易统计
        const stats = calculateCustomerTransactionStats(customer.customerId, allTransactions)
        
        // 计算客户状态
        const calculatedStatus = calculateCustomerStatus(customer, allTransactions, stats.lastTransactionTime)
        
        // 返回完整的客户信息，包括动态计算的交易统计
        return {
          ...customer,
          transactionCount: stats.transactionCount,
          transactionAmount: stats.transactionAmount,
          lastTransactionTime: stats.lastTransactionTime,
          customerStatus: calculatedStatus
        }
      })
      
      return createSuccessResponse({
        total,
        page: parseInt(page),
        pageSize: parseInt(pageSize),
        list: result
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
      const customersWithStats = customerList.map(customer => {
        // 计算客户的实际交易统计
        const stats = calculateCustomerTransactionStats(customer.customerId, allTransactions)
        
        // 计算客户状态
        const calculatedStatus = calculateCustomerStatus(customer, allTransactions, stats.lastTransactionTime)
        
        return {
          ...customer,
          transactionCount: stats.transactionCount,
          transactionAmount: stats.transactionAmount,
          lastTransactionTime: stats.lastTransactionTime,
          status: calculatedStatus
        }
      })
      
      // 计算总客户数
      const totalCustomers = customersWithStats.length
      
      // 计算活跃客户数
      const activeCustomers = customersWithStats.filter(c => c.status === 'active').length
      
      // 计算总交易次数
      const totalTransactions = customersWithStats.reduce((sum, c) => sum + c.transactionCount, 0)
      
      // 计算总交易金额
      const totalAmount = customersWithStats.reduce((sum, c) => sum + c.transactionAmount, 0)
      
      // 计算客户状态分布
      const statusDistribution = {
        new: customersWithStats.filter(c => c.status === 'new').length,
        active: activeCustomers,
        normal: customersWithStats.filter(c => c.status === 'normal').length,
        inactive: customersWithStats.filter(c => c.status === 'inactive').length,
        disabled: customersWithStats.filter(c => c.status === 'disabled').length
      }
      
      // 按交易金额排序的前10名客户
      const topCustomersByAmount = [...customersWithStats]
        .sort((a, b) => b.transactionAmount - a.transactionAmount)
        .slice(0, 10)
        .map(c => ({
          id: c.customerId,
          name: c.customername,
          transactionCount: c.transactionCount,
          transactionAmount: c.transactionAmount
        }))
      
      // 按交易次数排序的前10名客户
      const topCustomersByCount = [...customersWithStats]
        .sort((a, b) => b.transactionCount - a.transactionCount)
        .slice(0, 10)
        .map(c => ({
          id: c.customerId,
          name: c.customername,
          transactionCount: c.transactionCount,
          transactionAmount: c.transactionAmount
        }))
      
      return createSuccessResponse({
        totalCustomers,
        activeCustomers,
        totalTransactions,
        totalAmount,
        statusDistribution,
        topCustomersByAmount,
        topCustomersByCount
      }, '获取客户统计数据成功')
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
        name, 
        phone, 
        address, 
        discountRate = 1.0, 
        contactPerson, 
        email, 
        remark, 
        status = 'active' 
      } = params
      
      // 参数验证
      if (!name || !phone || !address) {
        return createErrorResponse(
          ERROR_CODES.PARAM_ERROR,
          '客户名称、电话和地址不能为空'
        )
      }
      
      // 生成客户ID
      const id = `CUS${Date.now().toString().slice(-6)}`
      
      // 创建客户对象
      const now = new Date().toISOString().replace('T', ' ').slice(0, 19)
      const newCustomer = {
        id,
        name,
        phone,
        address,
        discountRate,
        contactPerson,
        email,
        createTime: now,
        updateTime: now,
        status,
        transactionCount: 0,
        transactionAmount: 0,
        lastTransactionTime: null,
        remark
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
        name, 
        phone, 
        address, 
        discountRate, 
        contactPerson, 
        email, 
        remark, 
        status 
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
        name: name || customer.name,
        phone: phone || customer.phone,
        address: address || customer.address,
        discountRate: discountRate !== undefined ? discountRate : customer.discountRate,
        contactPerson: contactPerson !== undefined ? contactPerson : customer.contactPerson,
        email: email !== undefined ? email : customer.email,
        remark: remark !== undefined ? remark : customer.remark,
        status: status || customer.status,
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
      const { id, status } = params
      
      // 参数验证
      if (!id || !status) {
        return createErrorResponse(
          ERROR_CODES.PARAM_ERROR,
          '客户ID和状态不能为空'
        )
      }
      
      // 状态验证
      if (!['active', 'disabled'].includes(status)) {
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
        status,
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