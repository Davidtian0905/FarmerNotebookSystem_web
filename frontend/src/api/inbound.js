/**
 * 入库记录API接口
 * 处理入库相关的数据操作
 */

import { mockTransactionsApi } from '../mock/api/transactionsApi.js'
import { getAllTransactions, addTransaction, updateTransaction, deleteTransaction } from '../mock/database_flow.js'
import { createSuccessResponse, createErrorResponse } from '../mock/utils/index.js'

/**
 * 获取入库记录列表
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.pageSize - 每页数量
 * @param {string} params.startDate - 开始日期
 * @param {string} params.endDate - 结束日期
 * @param {string} params.materialType - 物料类型
 * @param {string} params.status - 状态
 * @returns {Promise} API响应
 */
export const getInboundRecords = async (params = {}) => {
  try {
    // 获取所有交易记录并过滤入库记录
    const allTransactions = getAllTransactions()
    let inboundRecords = allTransactions.filter(record => record.type === 'INBOUND')
    
    // 应用过滤条件
    if (params.startDate) {
      inboundRecords = inboundRecords.filter(record => record.date >= params.startDate)
    }
    if (params.endDate) {
      inboundRecords = inboundRecords.filter(record => record.date <= params.endDate)
    }
    if (params.materialType && params.materialType !== 'all') {
      inboundRecords = inboundRecords.filter(record => record.materialType === params.materialType)
    }
    if (params.status && params.status !== 'all') {
      inboundRecords = inboundRecords.filter(record => record.status === params.status)
    }
    
    // 分页处理
    const page = parseInt(params.page) || 1
    const pageSize = parseInt(params.pageSize) || 10
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize
    const paginatedRecords = inboundRecords.slice(startIndex, endIndex)
    
    return createSuccessResponse({
      list: paginatedRecords,
      total: inboundRecords.length,
      page,
      pageSize
    }, '获取入库记录成功')
  } catch (error) {
    console.error('获取入库记录失败:', error)
    return createErrorResponse(500, '获取入库记录失败')
  }
}

/**
 * 新增入库记录
 * @param {Object} data - 入库记录数据
 * @returns {Promise} API响应
 */
export const createInboundRecord = async (data) => {
  try {
    // 生成入库记录ID
    const date = new Date().toISOString().split('T')[0]
    const sequence = Date.now() % 10000
    const id = `IN${date.replace(/-/g, '')}${String(sequence).padStart(4, '0')}`
    
    // 构建完整的入库记录
    const inboundRecord = {
      id,
      type: 'INBOUND',
      date: data.date || date,
      time: data.time || new Date().toTimeString().split(' ')[0],
      amount: parseFloat(data.amount) || 0,
      quantity: parseFloat(data.quantity) || 0,
      unitPrice: parseFloat(data.unitPrice) || 0,
      materialName: data.materialName || '',
      materialType: data.materialType || '',
      supplier: data.supplier || '',
      status: data.status || 'PENDING',
      description: data.remark || '',
      
      // 扩展字段
      materialId: data.materialId || '',
      materialCode: data.materialCode || '',
      materialType: data.materialType || '',
      materialGrade: data.materialGrade || '',
      batchNumber: data.batchNumber || '',
      unit: data.unit || '',
      supplierId: data.supplierId || '',
      warehouseLocation: data.warehouseLocation || '',
      expiryDate: data.expiryDate || null,
      qualityStatus: data.qualityStatus || 'pending',
      inspector: data.inspector || null,
      inspectionDate: data.inspectionDate || null,
      remark: data.remark || ''
    }
    
    // 添加到数据库
    const result = addTransaction(inboundRecord)
    
    if (result.success) {
      return createSuccessResponse(inboundRecord, '入库记录创建成功')
    } else {
      return createErrorResponse(400, result.message || '创建入库记录失败')
    }
  } catch (error) {
    console.error('创建入库记录失败:', error)
    return createErrorResponse(500, '创建入库记录失败')
  }
}

/**
 * 更新入库记录
 * @param {string} id - 记录ID
 * @param {Object} data - 更新数据
 * @returns {Promise} API响应
 */
export const updateInboundRecord = async (id, data) => {
  try {
    const result = updateTransaction(id, data)
    
    if (result.success) {
      return createSuccessResponse(result.data, '入库记录更新成功')
    } else {
      return createErrorResponse(400, result.message || '更新入库记录失败')
    }
  } catch (error) {
    console.error('更新入库记录失败:', error)
    return createErrorResponse(500, '更新入库记录失败')
  }
}

/**
 * 删除入库记录
 * @param {string} id - 记录ID
 * @returns {Promise} API响应
 */
export const deleteInboundRecord = async (id) => {
  try {
    const result = deleteTransaction(id)
    
    if (result.success) {
      return createSuccessResponse(null, '入库记录删除成功')
    } else {
      return createErrorResponse(400, result.message || '删除入库记录失败')
    }
  } catch (error) {
    console.error('删除入库记录失败:', error)
    return createErrorResponse(500, '删除入库记录失败')
  }
}

/**
 * 获取基础数据（物料类型、等级、仓库位置、供应商等）
 * @returns {Promise} API响应
 */
export const getInboundBaseData = async () => {
  try {
    // 从现有交易记录中提取基础数据
    const allTransactions = getAllTransactions()
    const inboundRecords = allTransactions.filter(record => record.type === 'INBOUND')
    
    // 提取物料类型
    const materialTypes = [...new Set(inboundRecords.map(record => record.materialType).filter(Boolean))]
    
    // 提取物料等级
    const materialGrades = [...new Set(inboundRecords.map(record => record.materialGrade).filter(Boolean))]
    
    // 提取仓库位置
    const warehouseLocations = [...new Set(inboundRecords.map(record => record.warehouseLocation).filter(Boolean))]
    
    // 提取供应商
    const suppliers = [...new Set(inboundRecords.map(record => ({
      id: record.supplierId,
      name: record.supplier
    })).filter(supplier => supplier.id && supplier.name))]
    
    // 提取物料信息
    const materials = [...new Set(inboundRecords.map(record => ({
      id: record.materialId,
      name: record.materialName,
      code: record.materialCode,
      type: record.materialType,
      unit: record.unit
    })).filter(material => material.id && material.name))]
    
    const baseData = {
      materialTypes: materialTypes.map(type => ({ value: type, label: type })),
      materialGrades: materialGrades.map(grade => ({ value: grade, label: grade })),
      warehouseLocations: warehouseLocations.map(location => ({ value: location, label: location })),
      suppliers,
      materials,
      qualityStatuses: [
        { value: 'pending', label: '待质检' },
        { value: 'passed', label: '质检通过' },
        { value: 'failed', label: '质检不合格' },
        { value: 'exempted', label: '免检' }
      ],
      recordStatuses: [
        { value: 'PENDING', label: '待处理' },
        { value: 'COMPLETED', label: '已完成' },
        { value: 'CANCELLED', label: '已取消' }
      ]
    }
    
    return createSuccessResponse(baseData, '获取基础数据成功')
  } catch (error) {
    console.error('获取基础数据失败:', error)
    return createErrorResponse(500, '获取基础数据失败')
  }
}

/**
 * 获取入库记录详情
 * @param {string} id - 记录ID
 * @returns {Promise} API响应
 */
export const getInboundRecordDetail = async (id) => {
  try {
    const allTransactions = getAllTransactions()
    const record = allTransactions.find(t => t.id === id && t.type === 'INBOUND')
    
    if (record) {
      return createSuccessResponse(record, '获取入库记录详情成功')
    } else {
      return createErrorResponse(404, '入库记录不存在')
    }
  } catch (error) {
    console.error('获取入库记录详情失败:', error)
    return createErrorResponse(500, '获取入库记录详情失败')
  }
}

export default {
  getInboundRecords,
  createInboundRecord,
  updateInboundRecord,
  deleteInboundRecord,
  getInboundBaseData,
  getInboundRecordDetail
}