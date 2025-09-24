/**
 * 出库记录模拟数据 - 包含完整的商品信息、客户数据
 */

import { getAllTransactions } from './database_flow.js'


// 定义销售渠道
export const SALES_CHANNELS = {
  OFFLINE_STORE: '线下门店',
  WECHAT_MINI: '微信小程序',
  TAOBAO: '淘宝店铺',
  JINGDONG: '京东店铺',
  DOUYIN_LIVE: '抖音直播',
  XIAOHONGSHU: '小红书',
  AMAZON: '亚马逊',
  ONLINE: '线上',
  PHONE_ORDER: '电话订购',
  WHOLESALE_MARKET: '批发市场',
  EXHIBITION: '展会销售',
  DIRECT_SALES: '直销',
  AGENT_SALES: '代理销售',
  GROUP_BUYING: '团购',
  OTHER: '其他'
}



// 客户信息
export const CUSTOMERS = {
  CUS001: {
    id: 'CUS001',
    name: '李茶庄',
    phone: '13800138001',
    address: '福建省厦门市思明区茶叶街123号',
    discountRate: 0.1,
    contactPerson: '李老板',
    email: 'licha@example.com',
    createTime: '2023-01-01 12:00:00',
    updateTime: '2023-01-10 15:30:00',
    status: 'active',
    transactionCount: 25,
    transactionAmount: 12500.00,
    lastTransactionTime: '2023-05-20 14:30:00',
    remark: '重要客户'
  },
  CUS002: {
    id: 'CUS002',
    name: '茶香阁',
    phone: '13900139002',
    address: '福建省泉州市鲤城区茶叶批发市场B区12号',
    discountRate: 0.95,
    contactPerson: '王经理',
    email: 'chaxiang@example.com',
    createTime: '2023-02-15 10:20:00',
    updateTime: '2023-03-10 14:30:00',
    status: 'normal',
    transactionCount: 12,
    transactionAmount: 8500.00,
    lastTransactionTime: '2023-04-15 11:30:00',
    remark: '批发客户'
  },
  CUS003: {
    id: 'CUS003',
    name: '品茗轩',
    phone: '13800138003',
    address: '浙江省杭州市西湖区茶艺街45号',
    discountRate: 0.9,
    contactPerson: '张总',
    email: 'pinming@example.com',
    createTime: '2023-03-01 09:15:00',
    updateTime: '2023-03-20 16:45:00',
    status: 'active',
    transactionCount: 18,
    transactionAmount: 15000.00,
    lastTransactionTime: '2023-05-10 10:20:00',
    remark: '高级客户'
  }
}



// 获取出库记录
export const getOutboundRecords = () => {
  console.log('getOutboundRecords: 开始获取出库记录')
  const allTransactions = getAllTransactions()
  console.log('getOutboundRecords: 所有交易记录数量:', allTransactions.length)
  console.log('getOutboundRecords: 所有交易记录:', allTransactions)
  
  const outboundTransactions = allTransactions.filter(transaction => {
    const isOutbound = transaction.type === 'outbound' || transaction.type === 'OUTBOUND'
    console.log(`交易记录 ${transaction.id || 'unknown'}: type=${transaction.type}, isOutbound=${isOutbound}`)
    return isOutbound
  })
  
  console.log('getOutboundRecords: 过滤后的出库记录数量:', outboundTransactions.length)
  console.log('getOutboundRecords: 过滤后的出库记录:', outboundTransactions)
  
  const mappedRecords = outboundTransactions.map(transaction => ({
      id: transaction.id,
      productName: transaction.productName,
      productCode: transaction.productCode,
      quantity: transaction.quantity,
      unit: transaction.unit,
      unitPrice: transaction.unitPrice,
      totalQuantity: transaction.quantity,
      totalAmount: transaction.totalAmount,
      customer: transaction.customer,
      channel: transaction.channel || 'OFFLINE',
      tags: transaction.tags || [],
      notes: transaction.notes || '',
      date: transaction.date,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt
    }))
  
  console.log('getOutboundRecords: 最终映射的记录:', mappedRecords)
  return mappedRecords
}

// 根据类型获取交易记录
export const getTransactionsByType = (type) => {
  const allTransactions = getAllTransactions()
  return allTransactions.filter(transaction => transaction.type === type)
}

// 根据日期范围获取出库记录
export const getOutboundRecordsByDateRange = (startDate, endDate) => {
  const outboundRecords = getOutboundRecords()
  return outboundRecords.filter(record => {
    return record.date >= startDate && record.date <= endDate
  })
}

// 根据客户获取出库记录
export const getOutboundRecordsByCustomer = (customerId) => {
  const outboundRecords = getOutboundRecords()
  return outboundRecords.filter(record => record.customerId === customerId)
}

// 根据ID获取单个出库记录
export const getOutboundRecordById = async (recordId) => {
  try {
    console.log('getOutboundRecordById: 查找记录ID:', recordId)
    
    // 首先在商品组合中查找
    const productCombos = getProductCombos()
    const productCombo = productCombos.find(combo => combo.id === recordId)
    
    if (productCombo) {
      console.log('getOutboundRecordById: 在商品组合中找到记录:', productCombo)
      return productCombo
    }
    
    // 如果在商品组合中没找到，再在交易记录中查找
    const allTransactions = getAllTransactions()
    const transaction = allTransactions.find(t => t.id === recordId && (t.type === 'outbound' || t.type === 'OUTBOUND'))
    
    if (!transaction) {
      console.warn('getOutboundRecordById: 未找到记录:', recordId)
      return null
    }
    
    console.log('getOutboundRecordById: 在交易记录中找到记录:', transaction)
    
    // 映射为完整的出库记录格式
    return {
      id: transaction.id,
      productName: transaction.productName,
      productCode: transaction.productCode,
      description: transaction.description || '',
      materials: transaction.materials || [],
      totalMaterialCost: transaction.totalMaterialCost || 0,
      productPrice: transaction.productPrice || 0,
      profitRate: transaction.profitRate || 0,
      productQuantity: transaction.productQuantity || transaction.quantity || 0,
      unit: transaction.unit || '件',
      customer: transaction.customer,
      channel: transaction.channel || 'OFFLINE',
      tags: transaction.tags || [],
      notes: transaction.notes || '',
      date: transaction.date,
      time: transaction.time,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt
    }
  } catch (error) {
    console.error('getOutboundRecordById: 获取记录时发生错误:', error)
    throw error
  }
}



// 获取客户选项
export const getCustomerOptions = () => {
  return Object.values(CUSTOMERS).map(customer => ({
    value: customer.id,
    label: customer.name,
    phone: customer.phone,
    address: customer.address,
    discountRate: customer.discountRate,
    contactPerson: customer.contactPerson
  }))
}

// 获取销售渠道选项
export const getSalesChannelOptions = () => {
  return Object.entries(SALES_CHANNELS).map(([key, value]) => ({
    value: key,
    label: value
  }))
}

// 获取商品组合
export const getProductCombos = () => {
  return [
    {
      id: 'PC001',
      productName: '铁观音礼盒套装',
      productCode: 'P_TGY20250822093000',
      unit: '套',
      description: '高档铁观音礼盒套装，精选优质铁观音茶叶，配备精美茶叶罐',
      materials: [
        { 
          materialName: '铁观音',
          materialCode: 'M_TGY20250820093000',
          currentStock: 100,
          quantity: 0.5,
          unit: '斤',
          unitPrice: 280.00,
          subtotal: 140.00,
          deductMaterial: true
        },
        { 
          materialName: '茶叶罐',
          materialCode: 'M_CYG20250820093000',
          currentStock: 50,
          quantity: 1,
          unit: '个',
          unitPrice: 10.00,
          subtotal: 10.00,
          deductMaterial: true
        }
      ],
      totalMaterialCost: 150.00,
      profitRate: 25.0,
      suggestedPrice: 187.50,
      productPrice: 200.00,
      expectedProfit: 50.00,
      actualProfitRate: 25.0,
      productQuantity: 10,
      stockDeductionPreview: [
        {
          materialName: '铁观音',
          quantityUnit: '0.5斤',
          deductStock: 5,
          totalDeduction: 5,
          currentTotalStock: 100,
          afterDeductionStock: 95,
          status: '充足'
        },
        {
          materialName: '茶叶罐',
          quantityUnit: '1个',
          deductStock: 10,
          totalDeduction: 10,
          currentTotalStock: 50,
          afterDeductionStock: 40,
          status: '充足'
        }
      ],
      createdAt: '2025-01-15T10:30:00Z',
      updatedAt: '2025-01-15T10:30:00Z'
    },
    {
      id: 'PC002',
      productName: '乌龙茶精品套装',
      productCode: 'P_WLC20250822093000',
      unit: '盒',
      description: '精选乌龙茶叶，口感醇厚，回甘悠长',
      images: ['wulong-tea-1.jpg'],
      materials: [
        { 
          materialId: 'M003',
          materialName: '乌龙茶',
          materialCode: 'M_WLC20250820093000',
          currentStock: 80,
          quantity: 0.3,
          unit: '斤',
          unitPrice: 320.00,
          subtotal: 96.00,
          deductMaterial: true
        },
        { 
          materialId: 'M004',
          materialName: '包装盒',
          materialCode: 'M_BZH20250820093000',
          currentStock: 100,
          quantity: 1,
          unit: '个',
          unitPrice: 8.00,
          subtotal: 8.00,
          deductMaterial: true
        }
      ],
      totalMaterialCost: 104.00,
      profitRate: 30.0,
      suggestedPrice: 135.20,
      productPrice: 150.00,
      expectedProfit: 46.00,
      actualProfitRate: 30.67,
      productQuantity: 20,
      stockDeductionPreview: [
        {
          materialName: '乌龙茶',
          quantityUnit: '0.3斤',
          deductStock: 6,
          totalDeduction: 6,
          currentTotalStock: 80,
          afterDeductionStock: 74,
          status: '充足'
        },
        {
          materialName: '包装盒',
          quantityUnit: '1个',
          deductStock: 20,
          totalDeduction: 20,
          currentTotalStock: 100,
          afterDeductionStock: 80,
          status: '充足'
        }
      ],
      createdAt: '2025-01-15T11:00:00Z',
      updatedAt: '2025-01-15T11:00:00Z'
    }
  ]
}

// 出库模板数据
export const OUTBOUND_TEMPLATES = {
  'TEMPLATE_001': {
    templateName: '铁观音出库模板',
    productName: '铁观音套装',
    productCode: 'P_TGY20250822093000',
    unit: '套',
    quantity: 10,
    unitPrice: 200.00,
    totalPrice: 2000.00,
    customerId: 'CUS001',
    customerName: '李茶庄',
    customerPhone: '13900139001',
    customerAddress: '北京市朝阳区',
    customerDiscountRate: 0.9,
    channel: 'ONLINE',
    tags: ['VIP客户', '礼品'],
    notes: '客户要求包装精美',
    createdAt: '2025-01-15T10:30:00Z',
    updatedAt: '2025-01-15T10:30:00Z'
  },
  'TEMPLATE_002': {
    templateName: '乌龙茶出库模板',
    productName: '乌龙茶套装',
    productCode: 'P_WLC20250820093000',
    unit: '套',
    quantity: 1,
    unitPrice: 200.00,
    totalPrice: 2000.00,
    customerId: 'CUS001',
    customerName: '李茶庄',
    customerPhone: '13900139001',
    customerAddress: '北京市朝阳区',
    customerDiscountRate: 0.9,
    channel: 'AMAZON',
    tags: ['VIP客户', '礼品'],
    notes: '客户要求包装精美',
    createdAt: '2025-01-15T10:30:00Z',
    updatedAt: '2025-01-15T10:30:00Z'
  }
}

// 获取出库模板选项
export const getOutboundTemplateOptions = () => {
  return Object.values(OUTBOUND_TEMPLATES).map(template => ({
    value: template.id,
    label: template.templateName,
    description: template.notes
  }))
}

// 获取出库模板数据
export const getOutboundTemplates = () => {
  return Object.values(OUTBOUND_TEMPLATES).map(template => ({
    ...template,
    id: Object.keys(OUTBOUND_TEMPLATES).find(key => OUTBOUND_TEMPLATES[key] === template),
    outboundTempname: template.templateName // 将templateName映射为outboundTempname
  }))
}

// 根据ID获取出库模板
export const getOutboundTemplateById = (id) => {
  return OUTBOUND_TEMPLATES[id] || null
}

// 保存出库模板
export const saveOutboundTemplate = (template) => {
  // 模拟保存操作
  console.log('保存出库模板:', template)
  return Promise.resolve({ success: true, message: '保存成功' })
}

// 物料数据库（模拟）
const MATERIALS_DATABASE = [
  {
    materialId: 'M001',
    materialName: '铁观音',
    materialCode: 'M_TGY20250820093000',
    currentStock: 100,
    unit: '斤',
    unitPrice: 280.00
  },
  {
    materialId: 'M002',
    materialName: '茶叶罐',
    materialCode: 'M_CYG20250820093000',
    currentStock: 50,
    unit: '个',
    unitPrice: 10.00
  },
  {
    materialId: 'M003',
    materialName: '乌龙茶',
    materialCode: 'M_WLC20250820093000',
    currentStock: 80,
    unit: '斤',
    unitPrice: 320.00
  },
  {
    materialId: 'M004',
    materialName: '包装盒',
    materialCode: 'M_BZH20250820093000',
    currentStock: 100,
    unit: '个',
    unitPrice: 8.00
  },
  {
    materialId: 'M005',
    materialName: '大红袍',
    materialCode: 'M_DHP20250820093000',
    currentStock: 60,
    unit: '斤',
    unitPrice: 350.00
  },
  {
    materialId: 'M006',
    materialName: '茶叶袋',
    materialCode: 'M_CYD20250820093000',
    currentStock: 200,
    unit: '个',
    unitPrice: 2.00
  }
]

// 搜索物料
export const searchMaterials = (keyword, limit = 10) => {
  if (!keyword) {
    return Promise.resolve(MATERIALS_DATABASE.slice(0, limit))
  }
  
  const filteredMaterials = MATERIALS_DATABASE.filter(material => 
    material.materialName.toLowerCase().includes(keyword.toLowerCase()) ||
    material.materialCode.toLowerCase().includes(keyword.toLowerCase())
  ).slice(0, limit)
  
  return Promise.resolve(filteredMaterials)
}

// 根据ID获取物料信息
export const getMaterialById = (materialId) => {
  return MATERIALS_DATABASE.find(material => material.materialId === materialId) || null
}

// 保存商品组合为模板
export const saveProductComboAsTemplate = (templateData) => {
  const templateId = 'TPL_' + String(Object.keys(OUTBOUND_TEMPLATES).length + 1).padStart(3, '0')
  const newTemplate = {
    id: templateId,
    templateName: templateData.templateName,
    productName: templateData.productName,
    productCode: templateData.productCode,
    unit: templateData.unit,
    description: templateData.description,
    materials: templateData.materials,
    profitRate: templateData.profitRate,
    productPrice: templateData.productPrice,
    productQuantity: templateData.productQuantity,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  
  console.log('保存商品组合为模板:', newTemplate)
  return Promise.resolve({ 
    success: true, 
    message: '模板保存成功',
    data: {
      templateId: templateId,
      templateName: templateData.templateName
    }
  })
}

export const saveProductCombo = (combo) => {
  // 模拟保存操作
  console.log('保存商品组合:', combo)
  return Promise.resolve({ 
    success: true, 
    message: '商品组合创建成功',
    data: {
      id: 'PC' + String(Date.now()).slice(-3),
      productName: combo.productName,
      productCode: combo.productCode
    }
  })
}

// 创建出库记录
export const createOutboundRecord = (record) => {
  // 模拟创建操作
  console.log('创建出库记录:', record)
  return Promise.resolve({ 
    success: true, 
    message: '出库记录创建成功',
    data: {
      id: 'OUT' + Date.now(),
      ...record,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  })
}

// 创建出库模板
export const createOutboundTemplate = (templateData) => {
  const templateId = 'TEMPLATE_' + String(Object.keys(OUTBOUND_TEMPLATES).length + 1).padStart(3, '0')
  const newTemplate = {
    id: templateId,
    ...templateData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  OUTBOUND_TEMPLATES[templateId] = newTemplate
  console.log('创建出库模板:', newTemplate)
  return Promise.resolve({ 
    success: true, 
    message: '模板创建成功',
    data: newTemplate
  })
}

// 更新出库模板
export const updateOutboundTemplate = (templateId, templateData) => {
  if (OUTBOUND_TEMPLATES[templateId]) {
    OUTBOUND_TEMPLATES[templateId] = {
      ...OUTBOUND_TEMPLATES[templateId],
      ...templateData,
      updatedAt: new Date().toISOString()
    }
    console.log('更新出库模板:', OUTBOUND_TEMPLATES[templateId])
    return Promise.resolve({ 
      success: true, 
      message: '模板更新成功',
      data: OUTBOUND_TEMPLATES[templateId]
    })
  }
  return Promise.reject({ success: false, message: '模板不存在' })
}

// 删除出库模板
export const deleteOutboundTemplate = (templateId) => {
  if (OUTBOUND_TEMPLATES[templateId]) {
    delete OUTBOUND_TEMPLATES[templateId]
    console.log('删除出库模板:', templateId)
    return Promise.resolve({ 
      success: true, 
      message: '模板删除成功'
    })
  }
  return Promise.reject({ success: false, message: '模板不存在' })
}

// 获取仓库数据
export const getWarehouseData = () => {
  return {
    customers: CUSTOMERS,
    records: getAllTransactions(),
    outboundTemplates: OUTBOUND_TEMPLATES
  }
}