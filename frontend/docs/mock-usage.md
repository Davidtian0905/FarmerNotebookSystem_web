# Mock数据使用说明

## 概述

本项目在开发阶段提供了完整的Mock数据支持，可以在没有后端服务的情况下进行前端功能测试。

## 启用Mock模式

### 方法一：通过UI切换
1. 在登录页面找到"Mock模式"开关
2. 点击开关启用Mock模式
3. 页面会自动刷新以应用新的模式

### 方法二：手动设置
在浏览器控制台中执行：
```javascript
localStorage.setItem('useMock', 'true')
```
然后刷新页面。

## 测试账号

启用Mock模式后，可以使用以下测试账号进行登录：

### 茶农账号
| 用户名 | 邮箱 | 密码 | 角色 |
|--------|------|------|------|
| farmer001 | farmer001@example.com | 123456 | 茶农 |
| farmer002 | farmer002@example.com | 123456 | 茶农 |

### 管理员账号
| 用户名 | 邮箱 | 密码 | 角色 |
|--------|------|------|------|
| admin | admin@example.com | admin123 | 管理员 |

## Mock功能特性

### 1. 用户认证
- ✅ 用户登录
- ✅ 用户注册
- ✅ 忘记密码（发送验证码）
- ✅ 验证验证码
- ✅ 重置密码
- ✅ 获取用户信息
- ✅ 刷新令牌
- ✅ 用户登出

### 2. 数据持久化
- Mock数据在页面刷新后会重置
- 用户注册的新账号会在当前会话中保持
- 验证码和重置令牌有有效期限制

### 3. 网络延迟模拟
- 登录：1秒延迟
- 注册：1.5秒延迟
- 发送验证码：1秒延迟
- 验证验证码：0.8秒延迟
- 重置密码：1.2秒延迟
- 获取用户信息：0.5秒延迟
- 刷新令牌：0.6秒延迟
- 登出：0.3秒延迟

## 验证码功能

### 发送验证码
1. 在忘记密码页面输入已注册的邮箱
2. 点击发送验证码
3. 在浏览器控制台查看验证码：
   ```
   [Mock] 验证码已发送到 farmer001@example.com: 123456
   ```

### 验证码规则
- 6位数字验证码
- 5分钟有效期
- 验证成功后生成重置令牌
- 重置令牌10分钟有效期

## 错误处理测试

### 登录错误
- 用户名不存在
- 密码错误
- 空用户名或密码

### 注册错误
- 用户名已存在
- 邮箱已被注册
- 密码不一致

### 验证码错误
- 验证码错误
- 验证码已过期
- 邮箱不存在

## 开发调试

### 查看Mock状态
```javascript
// 检查是否启用Mock模式
localStorage.getItem('useMock') === 'true'

// 查看Mock用户数据
console.log('Mock用户数据:', mockUsers)
```

### 切换Mock模式
```javascript
// 启用Mock模式
localStorage.setItem('useMock', 'true')

// 关闭Mock模式
localStorage.setItem('useMock', 'false')

// 刷新页面
window.location.reload()
```

## 注意事项

1. **仅开发环境有效**：Mock模式只在开发环境（NODE_ENV=development）下可用
2. **数据不持久**：Mock数据不会保存到数据库，页面刷新后会重置
3. **网络模拟**：所有API调用都有模拟的网络延迟
4. **错误处理**：Mock数据包含完整的错误处理逻辑
5. **安全考虑**：生产环境不会包含Mock功能

## 故障排除

### Mock模式无法启用
- 检查是否在开发环境
- 检查浏览器控制台是否有错误
- 尝试手动设置localStorage

### 登录失败
- 确认使用了正确的测试账号
- 检查Mock模式是否已启用
- 查看浏览器控制台的错误信息

### 验证码问题
- 确认邮箱地址正确
- 检查控制台输出的验证码
- 确认验证码在有效期内

## 扩展Mock数据

如需添加更多Mock数据，可以修改 `src/api/mock.js` 文件：

```javascript
// 添加新用户
const newUser = {
  id: mockUsers.length + 1,
  username: 'newuser',
  email: 'newuser@example.com',
  password: '123456',
  nickname: '新用户',
  avatar: 'https://example.com/avatar.jpg',
  role: 'farmer',
  status: 'active',
  createdAt: new Date().toISOString(),
  lastLoginAt: null
}
mockUsers.push(newUser)
```

## 更新日志

| 版本 | 日期 | 更新内容 |
|------|------|----------|
| 1.0.0 | 2024-01-15 | 初始版本，包含基础认证Mock功能 | 