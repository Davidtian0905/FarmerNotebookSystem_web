/**
 * 用户管理相关Mock数据
 * 包含用户信息获取、令牌刷新、登出等功能
 */

// 从auth模块导入共享数据
import { mockUsers, generateMockToken } from './auth.js'

/**
 * 模拟获取用户信息API
 */
export const mockGetUserInfo = token => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        // 解析token获取用户ID
        const tokenParts = token.split('.')
        if (tokenParts.length !== 3) {
          throw new Error('Invalid token format')
        }

        const payload = JSON.parse(atob(tokenParts[1]))
        const userId = payload.userId

        const user = mockUsers.find(u => u.id === userId)
        if (!user) {
          resolve({
            error: 401,
            body: null,
            message: '用户不存在'
          })
          return
        }

        resolve({
          error: 0,
          body: {
            id: user.id,
            username: user.username,
            email: user.email,
            nickname: user.nickname,
            avatar: user.avatar,
            role: user.role,
            status: user.status,
            createdAt: user.createdAt,
            lastLoginAt: user.lastLoginAt
          },
          message: '获取成功'
        })
      } catch (error) {
        resolve({
          error: 401,
          body: null,
          message: '令牌无效'
        })
      }
    }, 500)
  })
}

/**
 * 模拟刷新令牌API
 */
export const mockRefreshToken = token => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const tokenParts = token.split('.')
        if (tokenParts.length !== 3) {
          throw new Error('Invalid token format')
        }

        const payload = JSON.parse(atob(tokenParts[1]))
        const userId = payload.userId

        const user = mockUsers.find(u => u.id === userId)
        if (!user) {
          resolve({
            error: 401,
            body: null,
            message: '用户不存在'
          })
          return
        }

        const newToken = generateMockToken(userId)

        resolve({
          error: 0,
          body: {
            token: newToken,
            expiresIn: 3600
          },
          message: '令牌刷新成功'
        })
      } catch (error) {
        resolve({
          error: 401,
          body: null,
          message: '令牌无效'
        })
      }
    }, 600)
  })
}

/**
 * 模拟登出API
 */
export const mockLogout = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        error: 0,
        body: null,
        message: '登出成功'
      })
    }, 300)
  })
}

/**
 * 模拟更新用户信息API
 */
export const mockUpdateUserInfo = (token, userData) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        // 解析token获取用户ID
        const tokenParts = token.split('.')
        if (tokenParts.length !== 3) {
          throw new Error('Invalid token format')
        }

        const payload = JSON.parse(atob(tokenParts[1]))
        const userId = payload.userId

        const user = mockUsers.find(u => u.id === userId)
        if (!user) {
          resolve({
            error: 401,
            body: null,
            message: '用户不存在'
          })
          return
        }

        // 更新用户信息
        Object.assign(user, {
          nickname: userData.nickname || user.nickname,
          avatar: userData.avatar || user.avatar,
          email: userData.email || user.email
        })

        resolve({
          error: 0,
          body: {
            id: user.id,
            username: user.username,
            email: user.email,
            nickname: user.nickname,
            avatar: user.avatar,
            role: user.role,
            status: user.status,
            createdAt: user.createdAt,
            lastLoginAt: user.lastLoginAt
          },
          message: '更新成功'
        })
      } catch (error) {
        resolve({
          error: 401,
          body: null,
          message: '令牌无效'
        })
      }
    }, 800)
  })
}

/**
 * 模拟修改密码API
 */
export const mockChangePassword = (token, oldPassword, newPassword) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        // 解析token获取用户ID
        const tokenParts = token.split('.')
        if (tokenParts.length !== 3) {
          throw new Error('Invalid token format')
        }

        const payload = JSON.parse(atob(tokenParts[1]))
        const userId = payload.userId

        const user = mockUsers.find(u => u.id === userId)
        if (!user) {
          resolve({
            error: 401,
            body: null,
            message: '用户不存在'
          })
          return
        }

        // 验证旧密码
        if (user.password !== oldPassword) {
          resolve({
            error: 400,
            body: null,
            message: '原密码错误'
          })
          return
        }

        // 更新密码
        user.password = newPassword
        user.lastLoginAt = new Date().toISOString()

        resolve({
          error: 0,
          body: {
            updatedAt: new Date().toISOString()
          },
          message: '密码修改成功'
        })
      } catch (error) {
        resolve({
          error: 401,
          body: null,
          message: '令牌无效'
        })
      }
    }, 1000)
  })
} 