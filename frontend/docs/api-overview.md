# API概览文档

## 概述

茶农手账系统提供完整的RESTful API接口，支持用户认证、仪表板数据展示等功能。

## 基础信息

- **基础URL**: `/api`
- **请求方式**: POST（默认）
- **请求格式**: JSON
- **响应格式**: JSON
- **认证方式**: 需要在请求头中设置 `auth` 字段，值为用户登录后的token

## 通用响应格式

```json
{
  "error": 0,
  "body": {},
  "message": ""
}
```

### 错误码说明
| 错误码 | 说明 |
|--------|------|
| 0 | 成功 |
| 401 | 未授权，需要登录 |
| 500 | 系统异常 |

## API模块

### 1. 认证模块 (`/api/auth`)

提供用户认证相关功能：

#### 核心接口
- **用户登录**: `POST /api/auth/login`
- **用户注册**: `POST /api/auth/register`
- **发送验证码**: `POST /api/auth/forgot-password/send-code`
- **验证验证码**: `POST /api/auth/forgot-password/verify-code`
- **重置密码**: `POST /api/auth/forgot-password/reset`
- **获取用户信息**: `GET /api/auth/user-info`
- **刷新令牌**: `POST /api/auth/refresh-token`
- **用户登出**: `POST /api/auth/logout`

#### 数据验证规则
- **用户名**: 3-20个字符，字母数字下划线
- **邮箱**: 符合邮箱格式，5-50个字符
- **密码**: 6-20个字符，建议字母数字组合
- **验证码**: 6位数字，5分钟有效期

### 2. 仪表板模块 (`/api/dashboard`)

提供仪表板数据展示功能：

#### 核心接口
- **获取概览数据**: `POST /api/dashboard/overview`
- **获取统计数据**: `POST /api/dashboard/stats`
- **获取最近记录**: `POST /api/dashboard/recent-records`
- **获取图表数据**: `POST /api/dashboard/chart/{chartType}`

#### 图表类型
- **收支趋势图**: `incomeExpense` - 显示收入支出双线图
- **入库销售对比**: `inboundSales` - 显示入库销售对比
- **分类分布**: `categoryDistribution` - 显示分类分布

#### 统计数据
- **今日入库**: 入库金额统计
- **今日销售**: 销售金额统计
- **净收益**: 收入减去支出
- **增长率**: 较昨日的增长百分比

## Mock数据支持

### 启用方式
1. **UI控制**: 登录页面Mock模式开关
2. **手动设置**: `localStorage.setItem('useMock', 'true')`
3. **自动启用**: 开发环境自动启用

### 测试账号
| 用户名 | 邮箱 | 密码 | 角色 |
|--------|------|------|------|
| farmer001 | farmer001@example.com | 123456 | 茶农 |
| farmer002 | farmer002@example.com | 123456 | 茶农 |
| admin | admin@example.com | admin123 | 管理员 |

### Mock特性
- **网络延迟模拟**: 0.3-1.5秒不等
- **完整错误处理**: 模拟真实错误情况
- **数据持久化**: 当前会话中保持数据
- **验证码功能**: 控制台输出验证码

## 使用示例

### 认证流程
```javascript
import authApi from '@/api/auth.js'

// 用户登录
const login = async () => {
  try {
    const response = await authApi.login({
      username: 'farmer001',
      password: '123456',
      rememberMe: true
    })
    console.log('登录成功:', response.body)
  } catch (error) {
    console.error('登录失败:', error)
  }
}

// 忘记密码流程
const forgotPassword = async () => {
  try {
    // 1. 发送验证码
    await authApi.sendVerificationCode({
      email: 'farmer001@example.com'
    })
    
    // 2. 验证验证码
    const verifyResponse = await authApi.verifyCode({
      email: 'farmer001@example.com',
      code: '123456' // 从控制台获取
    })
    
    // 3. 重置密码
    await authApi.resetPassword({
      email: 'farmer001@example.com',
      resetToken: verifyResponse.body.resetToken,
      newPassword: 'newpassword',
      confirmPassword: 'newpassword'
    })
  } catch (error) {
    console.error('重置密码失败:', error)
  }
}
```

### 仪表板数据
```javascript
import dashboardApi from '@/api/dashboard.js'

// 获取仪表板数据
const getDashboardData = async () => {
  try {
    const weekData = await dashboardApi.getRecentWeekData()
    const todayData = await dashboardApi.getTodayData()
    const trendData = await dashboardApi.getTrendData({ period: 'week' })
    
    console.log('周数据:', weekData.body)
    console.log('今日数据:', todayData.body)
    console.log('趋势数据:', trendData.body)
  } catch (error) {
    console.error('获取数据失败:', error)
  }
}
```