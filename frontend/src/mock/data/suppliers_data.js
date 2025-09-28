// 供应商信息
export const SUPPLIERS = {
  SUP001: {
    supplierId: 'SUP001',
    suppliername: '福建安溪茶厂',
    supplierContact: '张师傅',
    supplierPhone: '13800138001',
    supplieraddress: '福建省泉州市安溪县八村33号',
    supplierCategory: '茶叶供应商',
    supplierGrade: '特级',
    supplierStatus: 'active',
    mainProducts: '铁观音、安溪乌龙',
    cooperationYears: 5,
    createTime: '2020-05-15 08:30:00',
    updateTime: '2023-10-20 14:25:00',
    notes: '5年，主要提供铁观音、安溪乌龙'
  },
  SUP002: {
    supplierId: 'SUP002',
    suppliername: '武夷山茶业厂',
    supplierContact: '李经理',
    supplierPhone: '13800138002',
    supplieraddress: '福建省南平市武夷山市',
    supplierCategory: '茶叶供应商',
    supplierGrade: 'A级',
    supplierStatus: 'active',
    mainProducts: '大红袍、金骏眉',
    cooperationYears: 3,
    createTime: '2022-03-10 09:15:00',
    updateTime: '2023-11-05 16:40:00',
    notes: '3年，主要提供大红袍、金骏眉'
  },
  SUP003: {
    supplierId: 'SUP003',
    suppliername: '包装材料有限公司',
    supplierContact: '王总',
    supplierPhone: '13800138003',
    supplieraddress: '广东省东莞市帽峰山',
    supplierCategory: '包装供应商',
    supplierGrade: 'B级',
    supplierStatus: 'active',
    mainProducts: '茶叶包装盒、礼品盒',
    cooperationYears: 2,
    createTime: '2022-08-20 10:45:00',
    updateTime: '2023-09-15 11:20:00',
    notes: '2年，主要提供茶叶包装盒、礼品盒'
  },
  SUP004: {
    supplierId: 'SUP004',
    suppliername: '杭州茶具厂',
    supplierContact: '赵厂长',
    supplierPhone: '13800138004',
    supplieraddress: '浙江省杭州市余杭区',
    supplierCategory: '茶具供应商',
    supplierGrade: 'B级',
    supplierStatus: 'pending',
    mainProducts: '紫砂茶具、陶瓷茶杯',
    cooperationYears: 1,
    createTime: '2023-04-05 14:30:00',
    updateTime: '2023-12-01 09:50:00',
    notes: '主要提供紫砂茶具、陶瓷茶杯'
  },
  SUP005: {
    supplierId: 'SUP005',
    suppliername: '云南普洱茶厂',
    supplierContact: '陈经理',
    supplierPhone: '13800138005',
    supplieraddress: '云南省普洱市思茅区',
    supplierCategory: '茶叶供应商',
    supplierGrade: 'A级',
    supplierStatus: 'disabled',
    mainProducts: '普洱生茶、普洱熟茶',
    cooperationYears: 4,
    createTime: '2021-02-18 11:25:00',
    updateTime: '2023-08-10 15:35:00',
    notes: '主要提供普洱生茶、普洱熟茶'
  }
}


// 获取供应商选项
export const getSupplierOptions = () => {
  return Object.values(SUPPLIERS).map(supplier => ({
    value: supplier.supplierId,
    label: supplier.suppliername,
    contact: supplier.supplierContact,
    phone: supplier.supplierPhone,
    address: supplier.supplieraddress,
    category: supplier.supplierCategory,
    grade: supplier.supplierGrade,
    supplierStatus: supplier.supplierStatus,
    mainProducts: supplier.mainProducts,
    cooperationYears: supplier.cooperationYears,
    createTime: supplier.createTime,
    updateTime: supplier.updateTime,
    notes: supplier.notes
  }))
}