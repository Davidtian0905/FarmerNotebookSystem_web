/**
 * 仓库管理模拟数据 - 包含完整的物料信息、供应商、客户等数据
 */

import { getAllTransactions } from './database_flow.js'

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
  'C级',
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

// 供应商信息
export const SUPPLIERS = {
  SUP001: {
    id: 'SUP001',
    name: '福建安溪茶园',
    code: 'FJAX001',
    contact: '张师傅',
    phone: '13800138001',
    address: '福建省泉州市安溪县',
    category: '茶叶供应商',
    grade: 'A级',
    cooperationYears: 5
  },
  SUP002: {
    id: 'SUP002',
    name: '武夷山茶业公司',
    code: 'WYSC002',
    contact: '李经理',
    phone: '13800138002',
    address: '福建省南平市武夷山市',
    category: '茶叶供应商',
    grade: 'A级',
    cooperationYears: 3
  },
  SUP003: {
    id: 'SUP003',
    name: '包装材料有限公司',
    code: 'BZCL003',
    contact: '王总',
    phone: '13800138003',
    address: '广东省东莞市',
    category: '包装供应商',
    grade: 'B级',
    cooperationYears: 2
  }
}

// 客户信息
export const CUSTOMERS = {
  CUS001: {
    id: 'CUS001',
    name: '李茶庄',
    code: 'LCZ001',
    contact: '李老板',
    phone: '13900139001',
    address: '广州市天河区',
    category: '零售商',
    grade: 'VIP',
    cooperationYears: 4
  },
  CUS002: {
    id: 'CUS002',
    name: '茶香阁',
    code: 'CXG002',
    contact: '陈经理',
    phone: '13900139002',
    address: '深圳市南山区',
    category: '批发商',
    grade: 'A级',
    cooperationYears: 2
  },
  CUS003: {
    id: 'CUS003',
    name: '品茗轩',
    code: 'PMX003',
    contact: '刘总',
    phone: '13900139003',
    address: '上海市浦东新区',
    category: '连锁店',
    grade: 'A级',
    cooperationYears: 3
  }
}

// 物料信息
export const MATERIALS = {
  MAT001: {
    id: 'MAT001',
    name: '铁观音',
    code: 'TGY001',
    type: '茶叶',
    grade: '特级',
    unit: '斤',
    specification: '500g/包',
    origin: '福建安溪',
    shelfLife: 24, // 月
    storageConditions: '阴凉干燥，避光保存'
  },
  MAT002: {
    id: 'MAT002',
    name: '大红袍',
    code: 'DHP002',
    type: '茶叶',
    grade: '一级',
    unit: '斤',
    specification: '500g/包',
    origin: '福建武夷山',
    shelfLife: 36,
  },
  MAT003: {
    id: 'MAT003',
    name: '茶叶包装盒',
    code: 'CYBZH003',
    type: '包装材料',
    grade: '标准',
    unit: '个',
    specification: '20cm×15cm×8cm',
    origin: '广东东莞',
    shelfLife: null,
  }
}



// 根据类型获取交易记录
export const getTransactionsByType = (type) => {
  return WAREHOUSE_TRANSACTIONS.filter(transaction => transaction.type === type)
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

// 根据客户获取记录
export const getTransactionsByCustomer = (customerId) => {
  return WAREHOUSE_TRANSACTIONS.filter(transaction => transaction.customerId === customerId)
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
  return Object.values(SUPPLIERS).map(supplier => ({
    value: supplier.id,
    label: supplier.name,
    code: supplier.code,
    contact: supplier.contact,
    phone: supplier.phone,
    address: supplier.address,
    category: supplier.category,
    grade: supplier.grade,
    cooperationYears: supplier.cooperationYears
  }))
}

// 获取客户选项
export const getCustomerOptions = () => {
  return Object.values(CUSTOMERS)
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

// 获取商品组合数据
export const getProductCombos = () => {
  return [
    {
      id: 'COMBO001',
      name: '铁观音礼盒装',
      code: 'TC001',
      materials: [
        { 
          id: 'MAT001', 
          materialId: 'MAT001', 
          name: '铁观音茶叶',
          quantity: 2, 
          unit: '斤',
          unitCost: 280.00
        },
        { 
          id: 'MAT003', 
          materialId: 'MAT003', 
          name: '精装礼盒',
          quantity: 1, 
          unit: '个',
          unitCost: 120.00
        }
      ],
      totalCost: 680.00,
      price: 880.00,
      profitRate: 22.73,
      productCount: 1,
      description: '精装铁观音茶叶礼盒'
    },
    {
      id: 'COMBO002', 
      name: '大红袍套装',
      code: 'TC002',
      materials: [
        { 
          id: 'MAT002', 
          materialId: 'MAT002', 
          name: '大红袍茶叶',
          quantity: 1, 
          unit: '斤',
          unitCost: 320.00
        },
        { 
          id: 'MAT003', 
          materialId: 'MAT003', 
          name: '精装礼盒',
          quantity: 1, 
          unit: '个',
          unitCost: 120.00
        }
      ],
      totalCost: 440.00,
      price: 580.00,
      profitRate: 24.14,
      productCount: 1,
      description: '武夷山大红袍茶叶套装'
    }
  ]
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