import request from '@/utils/request'

// 获取出库记录列表
export function getOutboundRecords(params) {
  return request({
    url: '/api/outbound/records',
    method: 'get',
    params
  })
}

// 创建出库记录
export function createOutboundRecord(data) {
  return request({
    url: '/api/outbound/records',
    method: 'post',
    data
  })
}

// 更新出库记录
export function updateOutboundRecord(id, data) {
  return request({
    url: `/api/outbound/records/${id}`,
    method: 'put',
    data
  })
}

// 删除出库记录
export function deleteOutboundRecord(id) {
  return request({
    url: `/api/outbound/records/${id}`,
    method: 'delete'
  })
}

// 获取出库基础数据（客户、商品等）
export function getOutboundBaseData() {
  return request({
    url: '/api/outbound/base-data',
    method: 'get'
  })
}

// 获取客户列表
export function getCustomers() {
  return request({
    url: '/api/customers',
    method: 'get'
  })
}

// 获取商品列表
export function getProducts() {
  return request({
    url: '/api/products',
    method: 'get'
  })
}

// 获取出库模板
export function getOutboundTemplates() {
  return request({
    url: '/api/outbound/templates',
    method: 'get'
  })
}

// 根据模板ID获取模板详情
export function getOutboundTemplateById(id) {
  return request({
    url: `/api/outbound/templates/${id}`,
    method: 'get'
  })
}

// 导出出库记录
export function exportOutboundRecords(params) {
  return request({
    url: '/api/outbound/export',
    method: 'get',
    params,
    responseType: 'blob'
  })
}