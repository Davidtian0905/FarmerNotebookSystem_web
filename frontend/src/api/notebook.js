import request from '@/utils/request'

// 获取笔记本列表
export const getNotebookListApi = params => {
  return request({
    url: '/notebook/list',
    method: 'get',
    params
  })
}

// 获取笔记本详情
export const getNotebookDetailApi = id => {
  return request({
    url: `/notebook/${id}`,
    method: 'get'
  })
}

// 创建笔记本
export const createNotebookApi = data => {
  return request({
    url: '/notebook',
    method: 'post',
    data
  })
}

// 更新笔记本
export const updateNotebookApi = (id, data) => {
  return request({
    url: `/notebook/${id}`,
    method: 'put',
    data
  })
}

// 删除笔记本
export const deleteNotebookApi = id => {
  return request({
    url: `/notebook/${id}`,
    method: 'delete'
  })
}

// 获取笔记列表
export const getNoteListApi = (notebookId, params) => {
  return request({
    url: `/notebook/${notebookId}/notes`,
    method: 'get',
    params
  })
}

// 获取笔记详情
export const getNoteDetailApi = id => {
  return request({
    url: `/note/${id}`,
    method: 'get'
  })
}

// 创建笔记
export const createNoteApi = data => {
  return request({
    url: '/note',
    method: 'post',
    data
  })
}

// 更新笔记
export const updateNoteApi = (id, data) => {
  return request({
    url: `/note/${id}`,
    method: 'put',
    data
  })
}

// 删除笔记
export const deleteNoteApi = id => {
  return request({
    url: `/note/${id}`,
    method: 'delete'
  })
}
