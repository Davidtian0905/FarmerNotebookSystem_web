/**
 * 客户数据模块
 * 包含系统中所有客户的基本信息
 */

// 客户信息
export const CUSTOMERS = {
  CUS001: {
    customerId: 'CUS001',
    customername: '李茶庄',
    customcategory: '零售商',
    grade: 'VIP',
    customerphone: '13800138001',
    customeraddress: '福建省厦门市思明区茶叶街230号',
    discountRate: 0.9, // 9折
    contactPerson: '李老板',
    email: 'licha@example.com',
    createTime: '2023-01-01 12:00:00',
    updateTime: '2023-01-10 15:30:00',
    customerStatus: 'active',
    remark: '重要客户'
  },
  CUS002: {
    customerId: 'CUS002',
    customername: '茶香阁',
    customcategory: '批发商',
    grade: '普通',
    customerphone: '13900139002',
    customeraddress: '福建省泉州市鲤城区茶叶批发市场B区12号',
    discountRate: 0.95, // 9.5折
    contactPerson: '王经理',
    email: 'chaxiang@example.com',
    createTime: '2023-02-15 10:20:00',
    updateTime: '2023-03-10 14:30:00',
    customerStatus: 'active',
    remark: '批发客户'
  },
  CUS003: {
    customerId: 'CUS003',
    customername: '品茗轩',
    customcategory: '高级茶馆',
    grade: '高级',
    customerphone: '13800138003',
    customeraddress: '浙江省杭州市西湖区茶艺街45号',
    discountRate: 0.97, // 97折
    contactPerson: '张总',
    email: 'pinming@example.com',
    createTime: '2023-03-01 09:15:00',
    updateTime: '2023-03-20 16:45:00',
    customerStatus: 'disabled',
    remark: '高级客户'
  }
}

/**
 * 获取所有客户列表
 * @returns {Array} 客户列表
 */
export const getAllCustomers = () => {
  return Object.values(CUSTOMERS)
}

/**
 * 根据ID获取客户信息
 * @param {string} customerId - 客户ID
 * @returns {Object|null} 客户信息或null
 */
export const getCustomerById = (customerId) => {
  return CUSTOMERS[customerId] || null
}

/**
 * 获取客户选项列表（用于下拉选择等场景）
 * @returns {Array} 客户选项列表
 */
export const getCustomerOptions = () => {
  return Object.values(CUSTOMERS).map(customer => ({
    value: customer.customerId,
    label: customer.customername,
    phone: customer.customerphone,
    address: customer.customeraddress,
    category: customer.customcategory,
    grade: customer.grade,
    discountRate: customer.discountRate || 1
  }))
}