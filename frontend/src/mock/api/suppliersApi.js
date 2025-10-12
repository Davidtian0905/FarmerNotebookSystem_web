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
// 导入前端计算逻辑
import { 
  calculateSupplierStatus, 
  calculateSupplierTransactionStats, 
  calculateSuppliersWithStats,
  getSupplierStatistics,
  getSupplierStatusDistribution,
  getTopSuppliersByAmount,
  getTopSuppliersByCount
} from '@/stores/Supplier_Calculations.js'

const logger = createLogger('SUPPLIERS_API')

// 删除后端计算逻辑，改为使用前端计算

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
          (supplier.supplieraddress && supplier.supplieraddress.toLowerCase().includes(lowerKeyword))
        )
      }
      
      // 使用前端计算逻辑计算供应商状态和交易统计
      const suppliersWithStats = calculateSuppliersWithStats(supplierList, allTransactions)
      
      // 状态筛选
      let filteredSuppliers = suppliersWithStats
      if (status !== 'all') {
        filteredSuppliers = suppliersWithStats.filter(supplier => supplier.supplierstatus === status)
      }
      
      // 计算总数
      const total = filteredSuppliers.length
      
      // 排序
      filteredSuppliers.sort((a, b) => {
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
      const result = filteredSuppliers.slice(startIndex, endIndex)
      
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
      
      // 使用前端计算逻辑计算供应商状态和交易统计
      const stats = calculateSupplierTransactionStats(supplier.supplierId, allTransactions)
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
        supplierId: supplier.supplierId,
        suppliername: supplier.suppliername,
        supplierContact: supplier.supplierContact,
        supplierPhone: supplier.supplierPhone,
        supplieraddress: supplier.supplieraddress || '',
        supplierCategory: supplier.supplierCategory || '',
        supplierGrade: supplier.supplierGrade || '',
        mainProducts: supplier.mainProducts || '',
        cooperationYears: supplier.cooperationYears || 0,
        transactionCount: stats.transactionCount,
        transactionAmount: stats.transactionAmount,
        lastTransactionTime: stats.lastTransactionTime,
        rating: stats.rating,
        supplierStatus: calculatedStatus,
        notes: supplier.notes || '',
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
      
      // 使用前端计算逻辑计算供应商状态和交易统计
      const suppliersWithStats = calculateSuppliersWithStats(supplierList, allTransactions)
      
      // 使用前端计算逻辑获取供应商统计数据
      const statistics = getSupplierStatistics(suppliersWithStats)
      
      return createSuccessResponse(statistics, '获取供应商统计数据成功')
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
        notes 
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
        notes: notes || '',
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
        notes 
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
        supplieraddress: address || supplier.supplieraddress,
        mainProducts: mainProducts || supplier.mainProducts,
        supplierCategory: supplierCategory || supplier.supplierCategory,
        supplierGrade: supplierGrade || supplier.supplierGrade,
        cooperationYears: cooperationYears || supplier.cooperationYears,
        supplierStatus: supplierStatus || supplier.supplierStatus,
        notes: notes || supplier.notes,
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