# 客户管理 API

本文档描述了客户管理模块的API接口，包括客户列表获取、客户详情、添加客户、编辑客户，删除客户等功能。

## 基础信息

- 基础路径: `/api`
- 响应格式: JSON
- 认证方式: Token 认证（请在请求头中包含 `Authorization: Bearer {token}`）

## 错误响应

所有API在发生错误时将返回以下格式的响应：

```json
{
  "code": 400,
  "message": "错误信息描述",
  "data": null
}
```

常见错误码：
- 400: 请求参数错误
- 401: 未授权
- 403: 权限不足
- 404: 资源不存在
- 500: 服务器内部错误

## 客户列表

### 获取客户列表

获取系统中的客户列表，支持分页、排序和筛选。

**请求**

```
GET /api/customers
```

**查询参数**

| 参数名 | 类型 | 必填 | 描述 |
|-------|------|------|------|
| page | Integer | 否 | 页码，默认为1 |
| pageSize | Integer | 否 | 每页记录数，默认为10 |
| keyword | String | 否 | 搜索关键词，匹配客户名称、电话、地址 |
| customerStatus | String | 否 | 客户状态筛选，可选值：new(新增)、active(活跃)、normal(一般)、inactive(待激活)、disabled(已停用)、all(全部) |
| sortField | String | 否 | 排序字段，默认为createTime |
| sortOrder | String | 否 | 排序方式，可选值：asc(升序)、desc(降序)，默认为desc |

**响应**

```json
{
  "code": 200,
  "message": "获取客户列表成功",
  "data": {
    "total": 100,
    "page": 1,
    "pageSize": 10,
    "list": [
      {
        "customerId": "c12345",
        "customername": "张三",
        "customerphone": "13800138000",
        "customeraddress": "北京市朝阳区xxx街道",
        "discountRate": 0.95,
        "customercontact": "李四",
        "customsource": "推荐",
        "customcategory": "批发商",
        "customergrade": "VIP",
        "createTime": "2023-01-01 12:00:00",
        "updateTime": "2023-01-10 15:30:00",
        "customerStatus": "active",
        "transactionCount": 25,
        "transactionAmount": 12500.00,
        "lastTransactionTime": "2023-05-20 14:30:00",
        "notes": "重要客户"
      },
      // ...更多客户
    ]
  }
}
```

### 获取客户详情

获取指定客户的详细信息。

**请求**

```
GET /api/customers/{id}
```

**路径参数**

| 参数名 | 类型 | 必填 | 描述 |
|-------|------|------|------|
| id | String | 是 | 客户ID |

**响应**

```json
{
  "code": 200,
  "message": "获取客户详情成功",
  "data": {
    "customerId": "c12345",
    "customername": "张三",
    "customerphone": "13800138000",
    "customeraddress": "北京市朝阳区xxx街道",
    "discountRate": 0.95,
    "customercontact": "李四",
    "customsource": "推荐",
    "customcategory": "批发商",
    "customergrade": "VIP",
    "createTime": "2023-01-01 12:00:00",
    "updateTime": "2023-01-10 15:30:00",
    "customerStatus": "active",
    "transactionCount": 25,
    "transactionAmount": 12500.00,
    "lastTransactionTime": "2023-05-20 14:30:00",
    "notes": "重要客户",
    "transactions": [
      {
        "id": "t12345",
        "type": "OUTBOUND",
        "date": "2023-05-20",
        "time": "14:30:00",
        "totalPrice": 500.00,
        // ...其他交易信息
      },
      // ...更多交易记录
    ]
  }
}
```

## 客户管理

### 添加客户

添加新的客户信息。

**请求**

```
POST /api/customers
```

**请求体**

```json
{
  "customername": "张三",
  "customerphone": "13800138000",
  "customeraddress": "北京市朝阳区xxx街道",
  "discountRate": 0.95,
  "customercontact": "李四",
  "customsource": "推荐",
  "customcategory": "批发商",
  "customergrade": "VIP",
  "notes": "重要客户",
  "customerStatus": "active"
}
```

**请求参数**

| 参数名 | 类型 | 必填 | 描述 |
|-------|------|------|------|
| customername | String | 是 | 客户名称，最大长度50个字符 |
| customerphone | String | 是 | 客户电话，格式为有效的电话号码 |
| customeraddress | String | 是 | 客户地址，最大长度200个字符 |
| discountRate | Number | 否 | 客户折扣率，范围0.1-1.0，默认为1.0 |
| customercontact | String | 否 | 联系人姓名，最大长度50个字符 |
| customsource | String | 否 | 客户来源 |
| customcategory | String | 否 | 客户类型 |
| customergrade | String | 否 | 客户等级 |
| notes | String | 否 | 备注信息，最大长度500个字符 |
| customerStatus | String | 否 | 客户状态，可选值：active(活跃)、disabled(已停用)，默认为active |

**响应**

```json
{
  "code": 200,
  "message": "添加客户成功",
  "data": {
    "customerId": "c12345",
    "customername": "张三",
    "customerphone": "13800138000",
    "customeraddress": "北京市朝阳区xxx街道",
    "discountRate": 0.95,
    "customercontact": "李四",
    "customsource": "推荐",
    "customcategory": "批发商",
    "customergrade": "VIP",
    "createTime": "2023-06-01 12:00:00",
    "updateTime": "2023-06-01 12:00:00",
    "customerStatus": "active",
    "transactionCount": 0,
    "transactionAmount": 0.00,
    "lastTransactionTime": null,
    "notes": "重要客户"
  }
}
```

### 编辑客户

更新指定客户的信息。

**请求**

```
PUT /api/customers/{id}
```

**路径参数**

| 参数名 | 类型 | 必填 | 描述 |
|-------|------|------|------|
| id | String | 是 | 客户ID |

**请求体**

```json
{
  "customername": "张三",
  "customerphone": "13800138000",
  "customeraddress": "北京市海淀区xxx街道",
  "discountRate": 0.9,
  "customercontact": "李四",
  "customsource": "推荐",
  "customcategory": "批发商",
  "customergrade": "VIP",
  "notes": "重要客户，已升级折扣",
  "customerStatus": "active"
}
```

**请求参数**

与添加客户接口相同。

**响应**

```json
{
  "code": 200,
  "message": "更新客户成功",
  "data": {
    "customerId": "c12345",
    "customername": "张三",
    "customerphone": "13800138000",
    "customeraddress": "北京市海淀区xxx街道",
    "discountRate": 0.9,
    "customercontact": "李四",
    "customsource": "推荐",
    "customcategory": "批发商",
    "customergrade": "VIP",
    "createTime": "2023-01-01 12:00:00",
    "updateTime": "2023-06-01 15:30:00",
    "customerStatus": "active",
    "transactionCount": 25,
    "transactionAmount": 12500.00,
    "lastTransactionTime": "2023-05-20 14:30:00",
    "notes": "重要客户，已升级折扣"
  }
}
```

### 删除客户

删除指定的客户信息。

**请求**

```
DELETE /api/customers/{id}
```

**路径参数**

| 参数名 | 类型 | 必填 | 描述 |
|-------|------|------|------|
| id | String | 是 | 客户ID |

**响应**

```json
{
  "code": 200,
  "message": "删除客户成功",
  "data": null
}
```

### 更新客户状态

更新指定客户的状态（启用/停用）。

**请求**

```
PATCH /api/customers/{id}/status
```

**路径参数**

| 参数名 | 类型 | 必填 | 描述 |
|-------|------|------|------|
| id | String | 是 | 客户ID |

**请求体**

```json
{
  "customerStatus": "disabled"
}
```

**请求参数**

| 参数名 | 类型 | 必填 | 描述 |
|-------|------|------|------|
| customerStatus | String | 是 | 客户状态，可选值：active(启用)、disabled(停用) |

**响应**

```json
{
  "code": 200,
  "message": "更新客户状态成功",
  "data": {
    "id": "c12345",
    "customerStatus": "disabled",
    "updateTime": "2023-06-01 16:00:00"
  }
}
```

## 客户分析

### 获取客户统计数据

获取客户相关的统计数据，用于客户分析页面。

**请求**

```
GET /api/customers/statistics
```

**查询参数**

| 参数名 | 类型 | 必填 | 描述 |
|-------|------|------|------|
| dateRange | Integer | 否 | 日期范围（天数），默认为90 |

**响应**

```json
{
  "code": 200,
  "message": "获取客户统计数据成功",
  "data": {
    "totalCustomers": 100,
    "activeCustomers": 45,
    "totalTransactions": 560,
    "totalAmount": 280000.00,
    "statusDistribution": {
      "new": 10,
      "active": 45,
      "normal": 30,
      "inactive": 10,
      "disabled": 5
    },
    "topCustomersByAmount": [
      {
        "id": "c12345",
        "customername": "张三",
        "transactionCount": 25,
        "transactionAmount": 12500.00
      },
      // ...更多客户
    ],
    "topCustomersByCount": [
      {
        "id": "c67890",
        "customername": "李四",
        "transactionCount": 30,
        "transactionAmount": 9000.00
      },
      // ...更多客户
    ]
  }
}
```

## 客户状态说明

客户状态是根据交易记录自动计算的，具体规则如下：

- **新增**：最近一个月内新增的客户
- **活跃**：最近三个月的交易次数超过10次
- **一般**：最近三个月的交易次数不足10次
- **待激活**：最近三个月没有交易
- **已停用**：在客户管理中手动设置为停用状态

## 交易数据筛选逻辑

系统在计算客户交易统计数据时，使用以下筛选逻辑：

1. 只筛选类型为 `OUTBOUND`（出库）的交易记录
2. 确保交易记录中的 `customerId` 字段存在且不为 `undefined`
3. 将交易记录的 `customerId` 与客户ID进行字符串比较，确保匹配的一致性
4. 计算匹配交易记录的数量、总金额和最后交易时间

## Mock 数据支持

在开发环境中，系统提供了完整的Mock数据支持，可以通过以下方式获取Mock数据：

1. 确保在开发环境中启用了Mock服务
2. 所有API请求将自动路由到Mock服务器处理
3. Mock数据保持与真实数据结构一致，便于前端开发和测试

## 版本信息

- 当前版本：v1.1.0
- 最后更新：2023-10-01

## 数据库结构

### 客户表 (customers)

| 字段名 | 类型 | 说明 |
|--------|------|------|
| customerId | string | 客户ID |
| customername | string | 客户姓名 |
| customerphone | string | 手机号码 |
| customeraddress | string | 地址 |
| customcategory | string | 客户类别 |
| customergrade | string | 客户等级 |
| customercontact | string | 联系人 |
| customsource | string | 客户来源 |
| discountRate | decimal | 默认折扣率（如0.9表示9折，0.7表示7折） |
| createTime | datetime | 创建时间 |
| updateTime | datetime | 更新时间 |
| customerStatus | string | 客户状态 |
| notes | string | 备注信息 |