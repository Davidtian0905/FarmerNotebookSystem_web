/**
 * Mock供应商管理API接口
 * 模拟后端API，提供供应商数据和交易统计
 */

// 导入数据库操作函数
import { getAllTransactions } from '../database_flow.js'
import { SUPPLIERS, getSupplierOptions } from '../data/suppliers_data.js'
// 导入工具函数
import { 
  createLogger,
  createSuccessResponse, 
  createErrorResponse, 
  ERROR_CODES 
} from '../utils/index.js'

const logger = createLogger('SUPPLIERS_API')

/**
 * 计算供应商状态
 * @param {Object} supplier - 供应商基本信息
 * @param {Array} transactions - 该供应商的交易记录
 * @returns {string} 供应商状态
 */
const calculateSupplierStatus = (supplier, transactions, lastTransactionTime) => {
  // 获取当前日期
  const now = new Date()
  const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
  const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate())
  
  // 如果供应商已手动设置为停用状态，则保持该状态
  if (supplier.supplierStatus === 'disabled') {
    return 'disabled'
  }
  
  // 如果供应商状态是待审核，直接返回
  if (supplier.supplierStatus === 'pending') {
    return 'pending'
  }
  
  // 创建时间在一个月内的为新增供应商
  const createTime = new Date(supplier.createTime)
  if (createTime > oneMonthAgo) {
    return 'new'
  }
  
  // 没有交易记录或最后交易时间超过三个月的为待激活
  if (!lastTransactionTime || new Date(lastTransactionTime) < threeMonthsAgo) {
    return 'inactive'
  }
  
  // 最近三个月的交易次数超过10次的为活跃供应商
  const recentTransactions = transactions.filter(t => 
    new Date(t.date) >= threeMonthsAgo && 
    String(t.supplierId) === String(supplier.supplierId)
  )
  
  if (recentTransactions.length >= 10) {
    return 'active'
  }
  
  // 其他情况为一般供应商
  return 'normal'
}

/**
 * 计算供应商交易统计数据
 * @param {string} supplierId - 供应商ID
 * @param {Array} allTransactions - 所有交易记录
 * @returns {Object} 交易统计数据
 */
const calculateSupplierTransactionStats = (supplierId, allTransactions) => {
  // 筛选该供应商的所有入库交易记录
  const supplierTransactions = allTransactions.filter(transaction => {
    const isInbound = transaction.type === 'INBOUND' || transaction.type === 'inbound';
    const hasSupplierId = transaction.supplierId !== undefined;
    const isMatchingSupplier = hasSupplierId && String(transaction.supplierId) === String(supplierId);
    
    return isInbound && isMatchingSupplier;
  });
  
  // 计算交易次数
  const transactionCount = supplierTransactions.length
  
  // 计算交易总金额
  const transactionAmount = supplierTransactions.reduce((sum, transaction) => 
    sum + (transaction.amount || 0), 0
  )
  
  // 获取最后交易时间
  let lastTransactionTime = null
  if (transactionCount > 0) {
    // 按日期排序，获取最新的交易记录
    const sortedTransactions = [...supplierTransactions].sort((a, b) => {
      const dateA = new Date(`${a.date} ${a.time || '00:00:00'}`)
      const dateB = new Date(`${b.date} ${b.time || '00:00:00'}`)
      return dateB - dateA
    })
    
    const lastTransaction = sortedTransactions[0]
    lastTransactionTime = `${lastTransaction.date} ${lastTransaction.time || '00:00:00'}`
  }
  
  // 计算评分（质量、交付、价格、服务的平均值）
  const ratedTransactions = supplierTransactions.filter(t => 
    t.quality && t.delivery && t.price && t.service
  )
  
  let rating = 0
  if (ratedTransactions.length > 0) {
    const totalQuality = ratedTransactions.reduce((sum, t) => sum + t.quality, 0)
    const totalDelivery = ratedTransactions.reduce((sum, t) => sum + t.delivery, 0)
    const totalPrice = ratedTransactions.reduce((sum, t) => sum + t.price, 0)
    const totalService = ratedTransactions.reduce((sum, t) => sum + t.service, 0)
    
    const avgQuality = totalQuality / ratedTransactions.length
    const avgDelivery = totalDelivery / ratedTransactions.length
    const avgPrice = totalPrice / ratedTransactions.length
    const avgService = totalService / ratedTransactions.length
    
    rating = Number(((avgQuality + avgDelivery + avgPrice + avgService) / 4).toFixed(1))
  }
  
  return {
    transactionCount,
    transactionAmount,
    lastTransactionTime,
    rating
  }
}

/**
 * Mock供应商管理API
 */
export const mockSuppliersApi = {
  /**
   * 获取供应商列表
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
      
      // 获取所有供应商基本信息
      let supplierList = Object.values(SUPPLIERS)
      
      // 关键词搜索
      if (keyword) {
        const lowerKeyword = keyword.toLowerCase()
        supplierList = supplierList.filter(supplier => 
          supplier.suppliername.toLowerCase().includes(lowerKeyword) || 
          supplier.supplierPhone.includes(lowerKeyword) || 
          (supplier.address && supplier.address.toLowerCase().includes(lowerKeyword))
        )
      }
      
      // 状态筛选
      if (status !== 'all') {
        supplierList = supplierList.filter(supplier => {
          // 计算供应商的实际交易统计
          const stats = calculateSupplierTransactionStats(supplier.supplierId, allTransactions)
          // 计算供应商状态
          const calculatedStatus = calculateSupplierStatus(supplier, allTransactions, stats.lastTransactionTime)
          return calculatedStatus === status
        })
      }
      
      // 计算总数
      const total = supplierList.length
      
      // 排序
      supplierList.sort((a, b) => {
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
      const pagedSuppliers = supplierList.slice(startIndex, endIndex)
      
      // 为每个供应商计算实际交易统计数据
      const result = pagedSuppliers.map(supplier => {
        // 计算供应商的实际交易统计
        const stats = calculateSupplierTransactionStats(supplier.supplierId, allTransactions)
        
        // 计算供应商状态
        const calculatedStatus = calculateSupplierStatus(supplier, allTransactions, stats.lastTransactionTime)
        
        // 返回完整的供应商信息，包括动态计算的交易统计
        return {
          id: supplier.supplierId,
          name: supplier.suppliername,
          phone: supplier.supplierPhone,
          address: supplier.address || '',
          category: supplier.supplierCategory || '',
          grade: supplier.supplierGrade || '',
          mainProducts: supplier.mainProducts || '',
          cooperationYears: supplier.cooperationYears || 0,
          transactionCount: stats.transactionCount,
          transactionAmount: stats.transactionAmount,
          lastTransactionTime: stats.lastTransactionTime,
          rating: stats.rating,
          status: calculatedStatus
        }
      })
      
      return createSuccessResponse({
        total,
        page: parseInt(page),
        pageSize: parseInt(pageSize),
        list: result
      }, '获取供应商列表成功')
    } catch (error) {
      logger.error('获取供应商列表失败:', error)
      return createErrorResponse(
        ERROR_CODES.INTERNAL_SERVER_ERROR,
        '系统异常：获取供应商列表失败'
      )
    }
  },
  
  /**
   * 获取供应商详情
   * @param {Object} params - 查询参数
   * @returns {Object} 标准API响应格式
   */
  getDetail(params = {}) {
    try {
      const { id } = params
      
      if (!id) {
        return createErrorResponse(
          ERROR_CODES.PARAM_ERROR,
          '供应商ID不能为空'
        )
      }
      
      // 获取供应商详情
      const supplier = SUPPLIERS[id]
      
      if (!supplier) {
        return createErrorResponse(
          ERROR_CODES.NOT_FOUND,
          '供应商不存在'
        )
      }
      
      // 获取所有交易记录
      const allTransactions = getAllTransactions()
      
      // 计算供应商的实际交易统计
      const stats = calculateSupplierTransactionStats(supplier.supplierId, allTransactions)
      
      // 计算供应商状态
      const calculatedStatus = calculateSupplierStatus(supplier, allTransactions, stats.lastTransactionTime)
      
      // 获取该供应商的交易记录
      const supplierTransactions = allTransactions.filter(transaction => 
        (transaction.type === 'INBOUND' || transaction.type === 'inbound') && 
        String(transaction.supplierId) === String(id)
      ).sort((a, b) => {
        const dateA = new Date(`${a.date} ${a.time || '00:00:00'}`)
        const dateB = new Date(`${b.date} ${b.time || '00:00:00'}`)
        return dateB - dateA
      })
      
      // 返回完整的供应商详情，包括动态计算的交易统计和交易记录
      return createSuccessResponse({
        id: supplier.supplierId,
        name: supplier.suppliername,
        phone: supplier.supplierPhone,
        address: supplier.address || '',
        category: supplier.supplierCategory || '',
        grade: supplier.supplierGrade || '',
        mainProducts: supplier.mainProducts || '',
        cooperationYears: supplier.cooperationYears || 0,
        transactionCount: stats.transactionCount,
        transactionAmount: stats.transactionAmount,
        lastTransactionTime: stats.lastTransactionTime,
        rating: stats.rating,
        status: calculatedStatus,
        transactions: supplierTransactions
      }, '获取供应商详情成功')
    } catch (error) {
      logger.error('获取供应商详情失败:', error)
      return createErrorResponse(
        ERROR_CODES.INTERNAL_SERVER_ERROR,
        '系统异常：获取供应商详情失败'
      )
    }
  },
  
  /**
   * 获取供应商统计数据
   * @param {Object} params - 查询参数
   * @returns {Object} 标准API响应格式
   */
  getStatistics(params = {}) {
    try {
      const { dateRange = 90 } = params
      
      // 获取所有交易记录
      const allTransactions = getAllTransactions()
      
      // 获取所有供应商基本信息
      const supplierList = Object.values(SUPPLIERS)
      
      // 计算日期范围
      const now = new Date()
      const rangeDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dateRange)
      
      // 计算每个供应商的交易统计和状态
      const suppliersWithStats = supplierList.map(supplier => {
        // 计算供应商的实际交易统计
        const stats = calculateSupplierTransactionStats(supplier.supplierId, allTransactions)
        
        // 计算供应商状态
        const calculatedStatus = calculateSupplierStatus(supplier, allTransactions, stats.lastTransactionTime)
        
        return {
          id: supplier.supplierId,
          name: supplier.suppliername,
          transactionCount: stats.transactionCount,
          transactionAmount: stats.transactionAmount,
          lastTransactionTime: stats.lastTransactionTime,
          rating: stats.rating,
          status: calculatedStatus
        }
      })
      
      // 计算总供应商数
      const totalSuppliers = suppliersWithStats.length
      
      // 计算活跃供应商数
      const activeSuppliers = suppliersWithStats.filter(s => s.status === 'active').length
      
      // 计算总交易次数
      const totalTransactions = suppliersWithStats.reduce((sum, s) => sum + s.transactionCount, 0)
      
      // 计算总交易金额
      const totalAmount = suppliersWithStats.reduce((sum, s) => sum + s.transactionAmount, 0)
      
      // 计算供应商状态分布
      const statusDistribution = {
        new: suppliersWithStats.filter(s => s.status === 'new').length,
        active: activeSuppliers,
        normal: suppliersWithStats.filter(s => s.status === 'normal').length,
        inactive: suppliersWithStats.filter(s => s.status === 'inactive').length,
        pending: suppliersWithStats.filter(s => s.status === 'pending').length,
        disabled: suppliersWithStats.filter(s => s.status === 'disabled').length
      }
      
      // 按交易金额排序的前10名供应商
      const topSuppliersByAmount = [...suppliersWithStats]
        .sort((a, b) => b.transactionAmount - a.transactionAmount)
        .slice(0, 10)
        .map(s => ({
          id: s.id,
          name: s.name,
          transactionCount: s.transactionCount,
          transactionAmount: s.transactionAmount,
          rating: s.rating
        }))
      
      // 按交易次数排序的前10名供应商
      const topSuppliersByCount = [...suppliersWithStats]
        .sort((a, b) => b.transactionCount - a.transactionCount)
        .slice(0, 10)
        .map(s => ({
          id: s.id,
          name: s.name,
          transactionCount: s.transactionCount,
          transactionAmount: s.transactionAmount,
          rating: s.rating
        }))
      
      return createSuccessResponse({
        totalSuppliers,
        activeSuppliers,
        totalTransactions,
        totalAmount,
        statusDistribution,
        topSuppliersByAmount,
        topSuppliersByCount
      }, '获取供应商统计数据成功')
    } catch (error) {
      logger.error('获取供应商统计数据失败:', error)
      return createErrorResponse(
        ERROR_CODES.INTERNAL_SERVER_ERROR,
        '系统异常：获取供应商统计数据失败'
      )
    }
  },
  
  /**
   * 添加供应商
   * @param {Object} params - 供应商信息
   * @returns {Object} 标准API响应格式
   */
  add(params = {}) {
    try {
      const { 
        suppliername, 
        supplierId, 
        supplierContact, 
        supplierPhone, 
        address, 
        mainProducts, 
        supplierCategory, 
        supplierGrade, 
        cooperationYears = 0, 
        supplierStatus = 'active',
        remark 
      } = params
      
      // 参数验证
      if (!suppliername || !supplierContact || !supplierPhone) {
        return createErrorResponse(
          ERROR_CODES.PARAM_ERROR,
          '供应商名称、联系人和联系电话不能为空'
        )
      }
      
      // 检查供应商ID是否已存在
      if (SUPPLIERS[supplierId]) {
        return createErrorResponse(
          ERROR_CODES.DUPLICATE_ERROR,
          '供应商编码已存在'
        )
      }
      
      // 创建新供应商对象
      const newSupplier = {
        supplierId,
        suppliername,
        supplierContact,
        supplierPhone,
        address: address || '',
        mainProducts: mainProducts || '',
        supplierCategory: supplierCategory || '',
        supplierGrade: supplierGrade || '',
        cooperationYears: cooperationYears || 0,
        supplierStatus: supplierStatus || 'active',
        remark: remark || '',
        createTime: new Date().toISOString().replace('T', ' ').slice(0, 19),
        updateTime: new Date().toISOString().replace('T', ' ').slice(0, 19)
      }
      
      // 在实际应用中，这里会将新供应商信息保存到数据库
      // 在Mock环境中，我们只返回成功响应
      
      // 添加到供应商列表（仅用于模拟）
      SUPPLIERS[supplierId] = newSupplier
      
      return createSuccessResponse({
        supplierId
      }, '供应商添加成功')
    } catch (error) {
      logger.error('添加供应商失败:', error)
      return createErrorResponse(
        ERROR_CODES.INTERNAL_SERVER_ERROR,
        '系统异常：添加供应商失败'
      )
    }
  },
  
  /**
   * 更新供应商
   * @param {Object} params - 供应商信息
   * @returns {Object} 标准API响应格式
   */
  update(params = {}) {
    try {
      const { 
        id,
        suppliername, 
        supplierContact, 
        supplierPhone, 
        address, 
        mainProducts, 
        supplierCategory, 
        supplierGrade, 
        cooperationYears, 
        supplierStatus,
        remark 
      } = params
      
      // 参数验证
      if (!id) {
        return createErrorResponse(
          ERROR_CODES.PARAM_ERROR,
          '供应商ID不能为空'
        )
      }
      
      if (!suppliername || !supplierContact || !supplierPhone) {
        return createErrorResponse(
          ERROR_CODES.PARAM_ERROR,
          '供应商名称、联系人和联系电话不能为空'
        )
      }
      
      // 检查供应商是否存在
      const supplier = SUPPLIERS[id]
      if (!supplier) {
        return createErrorResponse(
          ERROR_CODES.NOT_FOUND,
          '供应商不存在'
        )
      }
      
      // 更新供应商信息
      SUPPLIERS[id] = {
        ...supplier,
        suppliername: suppliername || supplier.suppliername,
        supplierContact: supplierContact || supplier.supplierContact,
        supplierPhone: supplierPhone || supplier.supplierPhone,
        address: address || supplier.address,
        mainProducts: mainProducts || supplier.mainProducts,
        supplierCategory: supplierCategory || supplier.supplierCategory,
        supplierGrade: supplierGrade || supplier.supplierGrade,
        cooperationYears: cooperationYears || supplier.cooperationYears,
        supplierStatus: supplierStatus || supplier.supplierStatus,
        remark: remark || supplier.remark,
        updateTime: new Date().toISOString().replace('T', ' ').slice(0, 19)
      }
      
      return createSuccessResponse(null, '供应商信息更新成功')
    } catch (error) {
      logger.error('更新供应商信息失败:', error)
      return createErrorResponse(
        ERROR_CODES.INTERNAL_SERVER_ERROR,
        '系统异常：更新供应商信息失败'
      )
    }
  }
}