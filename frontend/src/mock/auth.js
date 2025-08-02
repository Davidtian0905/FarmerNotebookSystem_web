/**
 * 认证相关Mock数据
 * 包含用户登录、注册、验证码等功能
 */

// 模拟用户数据
export const mockUsers = [
  {
    id: 1,
    username: 'farmer001',
    email: 'farmer001@example.com',
    password: '123456',
    nickname: '茶农小王',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    role: 'farmer',
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    lastLoginAt: '2024-01-15T10:30:00Z'
  },
  {
    id: 2,
    username: 'farmer002',
    email: 'farmer002@example.com',
    password: '123456',
    nickname: '茶农小李',
    avatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    role: 'farmer',
    status: 'active',
    createdAt: '2024-01-02T00:00:00Z',
    lastLoginAt: '2024-01-14T15:20:00Z'
  },
  {
    id: 3,
    username: 'admin',
    email: 'admin@example.com',
    password: 'admin123',
    nickname: '系统管理员',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    role: 'admin',
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    lastLoginAt: '2024-01-15T09:15:00Z'
  }
]

// 模拟验证码数据
const mockVerificationCodes = new Map()

// 模拟JWT令牌
export const generateMockToken = userId => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const payload = btoa(
    JSON.stringify({
      userId,
      username: mockUsers.find(u => u.id === userId)?.username,
      role: mockUsers.find(u => u.id === userId)?.role,
      exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60 // 24小时后过期
    })
  )
  const signature = btoa('mock-signature')
  return `${header}.${payload}.${signature}`
}

/**
 * 模拟登录API
 */
export const mockLogin = (username, password) => {
  return new Promise((resolve, reject) => {
    // 模拟网络延迟
    setTimeout(() => {
      const user = mockUsers.find(
        u =>
          (u.username === username || u.email === username) &&
          u.password === password
      )

      if (user) {
        // 更新最后登录时间
        user.lastLoginAt = new Date().toISOString()

        const token = generateMockToken(user.id)

        resolve({
          error: 0,
          body: {
            token,
            userInfo: {
              id: user.id,
              username: user.username,
              email: user.email,
              nickname: user.nickname,
              avatar: user.avatar,
              role: user.role,
              status: user.status,
              createdAt: user.createdAt,
              lastLoginAt: user.lastLoginAt
            }
          },
          message: '登录成功'
        })
      } else {
        resolve({
          error: 401,
          body: null,
          message: '用户名或密码错误'
        })
      }
    }, 1000) // 模拟1秒延迟
  })
}

/**
 * 模拟注册API
 */
export const mockRegister = userData => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 检查用户名是否已存在
      const existingUser = mockUsers.find(u => u.username === userData.username)
      if (existingUser) {
        resolve({
          error: 400,
          body: null,
          message: '用户名已存在'
        })
        return
      }

      // 检查邮箱是否已存在
      const existingEmail = mockUsers.find(u => u.email === userData.email)
      if (existingEmail) {
        resolve({
          error: 400,
          body: null,
          message: '邮箱已被注册'
        })
        return
      }

      // 创建新用户
      const newUser = {
        id: mockUsers.length + 1,
        username: userData.username,
        email: userData.email,
        password: userData.password,
        nickname: userData.nickname || userData.username,
        avatar:
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        role: 'farmer',
        status: 'active',
        createdAt: new Date().toISOString(),
        lastLoginAt: null
      }

      mockUsers.push(newUser)

      resolve({
        error: 0,
        body: {
          userId: newUser.id,
          username: newUser.username,
          email: newUser.email,
          nickname: newUser.nickname,
          createdAt: newUser.createdAt
        },
        message: '注册成功'
      })
    }, 1500) // 模拟1.5秒延迟
  })
}

/**
 * 模拟发送验证码API
 */
export const mockSendVerificationCode = email => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 检查邮箱是否存在
      const user = mockUsers.find(u => u.email === email)
      if (!user) {
        resolve({
          error: 404,
          body: null,
          message: '邮箱不存在'
        })
        return
      }

      // 生成6位验证码
      const code = Math.floor(100000 + Math.random() * 900000).toString()

      // 存储验证码（5分钟有效期）
      mockVerificationCodes.set(email, {
        code,
        expireTime: Date.now() + 5 * 60 * 1000
      })

      console.log(`[Mock] 验证码已发送到 ${email}: ${code}`)

      resolve({
        error: 0,
        body: {
          email,
          expireTime: 300
        },
        message: '验证码已发送到邮箱'
      })
    }, 1000)
  })
}

/**
 * 模拟验证验证码API
 */
export const mockVerifyCode = (email, code) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const verificationData = mockVerificationCodes.get(email)

      if (!verificationData) {
        resolve({
          error: 400,
          body: null,
          message: '验证码不存在'
        })
        return
      }

      if (Date.now() > verificationData.expireTime) {
        mockVerificationCodes.delete(email)
        resolve({
          error: 400,
          body: null,
          message: '验证码已过期'
        })
        return
      }

      if (verificationData.code !== code) {
        resolve({
          error: 400,
          body: null,
          message: '验证码错误'
        })
        return
      }

      // 生成重置令牌
      const resetToken = `reset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      // 存储重置令牌
      mockVerificationCodes.set(`${email}_reset`, {
        token: resetToken,
        expireTime: Date.now() + 10 * 60 * 1000 // 10分钟有效期
      })

      resolve({
        error: 0,
        body: {
          email,
          verified: true,
          resetToken
        },
        message: '验证码验证成功'
      })
    }, 800)
  })
}

/**
 * 模拟重置密码API
 */
export const mockResetPassword = (
  email,
  resetToken,
  newPassword,
  confirmPassword
) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (newPassword !== confirmPassword) {
        resolve({
          error: 400,
          body: null,
          message: '两次输入的密码不一致'
        })
        return
      }

      const resetData = mockVerificationCodes.get(`${email}_reset`)

      if (!resetData) {
        resolve({
          error: 400,
          body: null,
          message: '重置令牌不存在'
        })
        return
      }

      if (Date.now() > resetData.expireTime) {
        mockVerificationCodes.delete(`${email}_reset`)
        resolve({
          error: 400,
          body: null,
          message: '重置令牌已过期'
        })
        return
      }

      if (resetData.token !== resetToken) {
        resolve({
          error: 400,
          body: null,
          message: '重置令牌无效'
        })
        return
      }

      // 更新用户密码
      const user = mockUsers.find(u => u.email === email)
      if (user) {
        user.password = newPassword
        user.lastLoginAt = new Date().toISOString()
      }

      // 清除验证码和重置令牌
      mockVerificationCodes.delete(email)
      mockVerificationCodes.delete(`${email}_reset`)

      resolve({
        error: 0,
        body: {
          email,
          updatedAt: new Date().toISOString()
        },
        message: '密码重置成功'
      })
    }, 1200)
  })
} 