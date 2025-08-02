# 认证API文档

## 概述

茶农手账系统的认证相关API接口，包括用户登录、注册、忘记密码等功能。

## 基础信息

- **基础URL**: `/api/auth`
- **请求方式**: POST
- **请求格式**: JSON
- **响应格式**: JSON

## Mock数据支持

### 启用Mock模式
- **自动启用**：开发环境首次访问时自动启用Mock模式
- **UI控制**：在登录页面可以切换Mock模式开关
- **手动设置**：`localStorage.setItem('useMock', 'true')`

### 测试账号
| 用户名 | 邮箱 | 密码 | 角色 | 说明 |
|--------|------|------|------|------|
| farmer001 | farmer001@example.com | 123456 | 茶农 | 茶农小王 |
| farmer002 | farmer002@example.com | 123456 | 茶农 | 茶农小李 |
| admin | admin@example.com | admin123 | 管理员 | 系统管理员 |

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

## 请求头要求

所有API请求必须在header中设置：
```
auth: {token值}
```

## API接口列表

### 1. 用户登录

**接口地址**: `/api/auth/login`

**请求参数**:
```json
{
  "username": "string",
  "password": "string",
  "rememberMe": "boolean"
}
```

**响应示例**:
```json
{
  "error": 0,
  "body": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "userInfo": {
      "id": 1,
      "username": "farmer001",
      "email": "farmer@example.com",
      "nickname": "茶农小王",
      "role": "farmer"
    }
  },
  "message": "登录成功"
}
```

### 2. 用户注册

**接口地址**: `/api/auth/register`

**请求参数**:
```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "confirmPassword": "string",
  "nickname": "string",
  "agreeTerms": "boolean"
}
```

**响应示例**:
```json
{
  "error": 0,
  "body": {
    "userId": 1,
    "username": "farmer001",
    "email": "farmer@example.com",
    "nickname": "茶农小王"
  },
  "message": "注册成功"
}
```

### 3. 发送验证码

**接口地址**: `/api/auth/forgot-password/send-code`

**请求参数**:
```json
{
  "email": "string"
}
```

**响应示例**:
```json
{
  "error": 0,
  "body": {
    "email": "farmer@example.com",
    "expireTime": 300
  },
  "message": "验证码已发送到邮箱"
}
```

### 4. 验证验证码

**接口地址**: `/api/auth/forgot-password/verify-code`

**请求参数**:
```json
{
  "email": "string",
  "code": "string"
}
```

**响应示例**:
```json
{
  "error": 0,
  "body": {
    "email": "farmer@example.com",
    "verified": true,
    "resetToken": "reset_token_123456"
  },
  "message": "验证码验证成功"
}
```

### 5. 重置密码

**接口地址**: `/api/auth/forgot-password/reset`

**请求参数**:
```json
{
  "email": "string",
  "resetToken": "string",
  "newPassword": "string",
  "confirmPassword": "string"
}
```

**响应示例**:
```json
{
  "error": 0,
  "body": {
    "email": "farmer@example.com",
    "updatedAt": "2024-01-15T10:30:00Z"
  },
  "message": "密码重置成功"
}
```

### 6. 获取用户信息

**接口地址**: `/api/auth/user-info`

**请求方式**: GET

**响应示例**:
```json
{
  "error": 0,
  "body": {
    "id": 1,
    "username": "farmer001",
    "email": "farmer@example.com",
    "nickname": "茶农小王",
    "role": "farmer"
  },
  "message": "获取成功"
}
```

### 7. 刷新令牌

**接口地址**: `/api/auth/refresh-token`

**请求方式**: POST

**响应示例**:
```json
{
  "error": 0,
  "body": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600
  },
  "message": "令牌刷新成功"
}
```

### 8. 用户登出

**接口地址**: `/api/auth/logout`

**请求方式**: POST

**响应示例**:
```json
{
  "error": 0,
  "body": null,
  "message": "登出成功"
}
```

## 数据验证规则

### 用户名验证
- 长度：3-20个字符
- 只能包含字母、数字、下划线
- 不能以数字开头

### 邮箱验证
- 必须符合邮箱格式
- 长度：5-50个字符

### 密码验证
- 长度：6-20个字符
- 建议包含字母和数字的组合

### 验证码验证
- 长度：6位数字
- 有效期：5分钟

## Mock错误处理

### 常见错误响应
```json
{
  "error": 401,
  "body": null,
  "message": "用户名或密码错误"
}
```

### Mock网络延迟
| 操作 | 延迟时间 |
|------|----------|
| 登录 | 1秒 |
| 注册 | 1.5秒 |
| 验证码操作 | 0.8-1秒 |
| 其他操作 | 0.3-0.6秒 |

## 更新日志

| 版本 | 日期 | 更新内容 |
|------|------|----------|
| 1.1.0 | 2024-07-30 | 精简文档结构，移除冗余内容 |
| 1.0.0 | 2024-01-15 | 初始版本，包含基础认证功能 | 