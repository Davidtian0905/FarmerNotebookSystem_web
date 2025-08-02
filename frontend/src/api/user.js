import request from '@/utils/request'
import { createApiPromise } from '@/utils/apiResponse'
import { 
  isMockMode, 
  mockLogin, 
  mockRegister, 
  mockGetUserInfo 
} from '../mock'

// 用户登录
export const loginApi = data => {
  if (isMockMode()) {
    return createApiPromise(() => mockLogin(data.username, data.password, data.rememberMe))
  }
  return createApiPromise(() => request.post('/auth/login', data))
}

// 用户注册
export const registerApi = data => {
  if (isMockMode()) {
    return createApiPromise(() => mockRegister(data))
  }
  return createApiPromise(() => request.post('/auth/register', data))
}

// 获取用户信息
export const getUserInfoApi = () => {
  if (isMockMode()) {
    const token = localStorage.getItem('token')
    return createApiPromise(() => mockGetUserInfo(token))
  }
  return createApiPromise(() => request.get('/user/info'))
}

// 更新用户信息
export const updateUserInfoApi = data => {
  return request({
    url: '/user/info',
    method: 'put',
    data
  })
}

// 修改密码
export const changePasswordApi = data => {
  return request({
    url: '/user/password',
    method: 'put',
    data
  })
}
