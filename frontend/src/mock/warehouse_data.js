/**
 * 仓库管理模拟数据 - 包含完整的物料信息、供应商等数据
 */

import { getAllTransactions } from './database_flow.js'
import { SUPPLIERS } from './data/suppliers_data.js'

// 物料类型配置 - 简化为字符串数组
export const MATERIAL_TYPES = [
  '茶叶',
  '茶制品', 
  '包装材料',
  '设备用品',
  '其他',
  '茶叶罐',
]

// 物料等级配置 - 简化为字符串数组
export const MATERIAL_GRADES = [
  '特级',
  '一级',
  '二级', 
  '三级',
  'A级',
  'D级'
]

// 质量检测状态
export const QUALITY_STATUS = [
  '待检测',
  '合格', 
  '不合格',
  '免检'
]

// 仓库位置配置
export const WAREHOUSE_LOCATIONS = [
  'A区仓库',
  '冰箱冷藏区',
  '前台存储区',
  'B区仓库',
  'C区仓库',
  'D区仓库'
]

// 供应商信息已从 suppliers_data.js 导入



// 根据类型获取交易记录
export const getTransactionsByType = (type) => {
  const allTransactions = getAllTransactions()
  return allTransactions.filter(transaction => transaction.type === type)
}

// 获取入库记录
export const getInboundRecords = () => {
  return getTransactionsByType('INBOUND')
}

// 获取出库记录
export const getOutboundRecords = () => {
  return getTransactionsByType('OUTBOUND')
}

// 根据日期范围获取记录
export const getTransactionsByDateRange = (startDate, endDate) => {
  return WAREHOUSE_TRANSACTIONS.filter(transaction => {
    return transaction.date >= startDate && transaction.date <= endDate
  })
}

// 根据物料获取记录
export const getTransactionsByMaterial = (materialId) => {
  return WAREHOUSE_TRANSACTIONS.filter(transaction => transaction.materialId === materialId)
}

// 根据供应商获取记录
export const getTransactionsBySupplier = (supplierId) => {
  return WAREHOUSE_TRANSACTIONS.filter(transaction => transaction.supplierId === supplierId)
}


// 获取库存统计
export const getInventoryStatistics = () => {
  const inboundRecords = getInboundRecords()
  const outboundRecords = getOutboundRecords()
  
  const inventory = {}
  
  // 计算入库
  inboundRecords.forEach(record => {
    if (record.status === '合格') {
      const key = `${record.materialId}_${record.batchNumber}`
      if (!inventory[key]) {
        inventory[key] = {
          materialId: record.materialId,
          materialName: record.materialName,
          materialCode: record.materialCode,
          batchNumber: record.batchNumber,
          quantity: 0,
          unit: record.unit,
          warehouseLocation: record.warehouseLocation,
          expiryDate: record.expiryDate
        }
      }
      inventory[key].quantity += record.quantity
    }
  })
  
  // 减去出库
  outboundRecords.forEach(record => {
    if (record.status === 'COMPLETED') {
      const key = `${record.materialId}_${record.batchNumber}`
      if (inventory[key]) {
        inventory[key].quantity -= record.quantity
      }
    }
  })
  
  return Object.values(inventory).filter(item => item.quantity > 0)
}

// 获取物料选项
export const getMaterialOptions = () => {
  return Object.values(MATERIALS)
}

// 获取供应商选项
export const getSupplierOptions = () => {
  return Object.values(SUPPLIERS).map(supplier => {
    // 返回正确的属性名称
    return {
      value: supplier.supplierId,
      label: supplier.suppliername,
      contact: supplier.supplierContact,
      phone: supplier.supplierPhone,
      address: supplier.address,
      category: supplier.supplierCategory,
      grade: supplier.supplierGrade,
      status: supplier.supplierStatus
    }
  })
}



// 获取仓库位置选项
export const getWarehouseLocationOptions = () => {
  return WAREHOUSE_LOCATIONS.map(location => ({
    value: location,
    label: location
  }))
}

// 获取物料类型选项
export const getMaterialTypeOptions = () => {
  return MATERIAL_TYPES.map(type => ({
    value: type,
    label: type
  }))
}

// 获取物料等级选项
export const getMaterialGradeOptions = () => {
  return MATERIAL_GRADES.map(grade => ({
    value: grade,
    label: grade
  }))
}

// 获取质量状态选项
export const getQualityStatusOptions = () => {
  return QUALITY_STATUS
}


// 入库模板数据
export const INBOUND_TEMPLATES = {
  'TPL001': {
    inboundTempname: '铁观音模板',
    materialName: '铁观音',
    materialType: '茶叶',
    materialGrade: '特级',
    unit: '斤',
    quantity: 50,
    batchNumber: '第一批春茶',
    materialCode: 'M_TGY20250820093000',
    unitPrice: 280.00,
    supplier: '福建安溪茶园',
    warehouseLocation: 'A区仓库',
    shelfLifeDays: 90,
    expiryDate: '2025-01-15',
    qualityStatus: '合格',
    inspector: '张师傅',
    qualityRemarks: '品质优良，符合标准',
    createdAt: '2024-01-15 10:30:00',
    updatedAt: '2024-01-15 10:30:00',
  },
  'TPL002': {
    inboundTempname: '乌龙茶模板',
    materialName: '乌龙茶',
    materialType: '茶叶',
    materialGrade: '特级',
    unit: '斤',
    quantity: 50,
    batchNumber: '第一批春茶',
    materialCode: 'M_WLC20250820093000',
    unitPrice: 280.00,
    supplier: '福建安溪茶园',
    warehouseLocation: 'A区仓库',
    shelfLifeDays: 90,
    expiryDate: '2025-01-15',
    qualityStatus: '合格',
    inspector: '张师傅',
    qualityRemarks: '品质优良，符合标准',
    createdAt: '2024-01-15 10:30:00',
    updatedAt: '2024-01-15 10:30:00',
  },
}

// 获取入库模板选项
export const getInboundTemplateOptions = () => {
  return Object.values(INBOUND_TEMPLATES).map(template => ({
    value: template.id,
    label: template.inboundTempname,
    description: template.description
  }))
}

// 获取入库模板数据
export const getInboundTemplates = () => {
  return Object.values(INBOUND_TEMPLATES)
}

// 根据ID获取入库模板
export const getInboundTemplateById = (id) => {
  return INBOUND_TEMPLATES[id] || null
}

// 保存入库模板
export const saveInboundTemplate = (templateData) => {
  // 生成新的模板ID
  const existingIds = Object.keys(INBOUND_TEMPLATES)
  const maxId = existingIds.length > 0 
    ? Math.max(...existingIds.map(id => parseInt(id.replace('TPL', '')))) 
    : 0
  const newId = `TPL${String(maxId + 1).padStart(3, '0')}`
  
  // 创建模板对象
  const template = {
    id: newId,
    name: `${templateData.materialName}入库模板`,
    description: `${templateData.materialName}标准入库模板`,
    ...templateData,
    createdAt: new Date().toLocaleString('zh-CN'),
    updatedAt: new Date().toLocaleString('zh-CN'),
    usageCount: 0
  }
  
  // 保存到INBOUND_TEMPLATES
  INBOUND_TEMPLATES[newId] = template
  
  return {
    success: true,
    templateId: newId,
    template: template
  }
}

// 获取所有模板ID
export const getAllTemplateIds = () => {
  return Object.keys(INBOUND_TEMPLATES)
}

// 删除入库模板
export const deleteInboundTemplate = (templateId) => {
  if (INBOUND_TEMPLATES[templateId]) {
    delete INBOUND_TEMPLATES[templateId]
    return {
      success: true,
      message: '模板删除成功'
    }
  } else {
    return {
      success: false,
      message: '模板不存在'
    }
  }
}

// 获取仓库数据
export const getWarehouseData = () => {
  return {
    materials: MATERIALS,
    suppliers: SUPPLIERS,
    customers: CUSTOMERS,
    locations: WAREHOUSE_LOCATIONS,
    materialTypes: MATERIAL_TYPES,
    materialGrades: MATERIAL_GRADES,
    qualityStatus: QUALITY_STATUS,
    records: getAllTransactions(),
    inboundTemplates: INBOUND_TEMPLATES
  }
}