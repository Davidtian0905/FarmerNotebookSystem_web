# 供应商管理 API

本文档描述了供应商管理模块的API接口，包括供应商列表获取、供应商详情、添加供应商、编辑供应商，删除供应商等功能。

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

## 供应商列表

### 获取供应商列表

获取系统中的供应商列表，支持分页、排序和筛选。

**请求**

```
GET /api/suppliers
```

**查询参数**

| 参数名 | 类型 | 必填 | 描述 |
|-------|------|------|------|
| page | Integer | 否 | 页码，默认为1 |
| pageSize | Integer | 否 | 每页记录数，默认为10 |
| keyword | String | 否 | 搜索关键词，匹配供应商名称、电话、地址 |
| status | String | 否 | 供应商状态筛选，可选值：new(新增)、active(活跃)、normal(一般)、pending(待审核)、disabled(已停用) |
| sortField | String | 否 | 排序字段，默认为createTime |
| sortOrder | String | 否 | 排序方式，可选值：asc(升序)、desc(降序)，默认为desc |
| search | string | 否 | 搜索关键词（供应商名称或手机号） |

**响应**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "total": 100,
    "page": 1,
    "pageSize": 10,
    "list": [
      {
        "supplierId": "SUP001",
        "suppliername": "福建安溪茶园",
        "supplierPhone": "13800138001",
        "address": "福建省泉州市安溪县",
        "supplierCategory": "茶叶供应商",
        "supplierGrade": "A级",
        "mainProducts": "铁观音、安溪乌龙",
        "cooperationYears": 5,
        "transactionCount": 25,
        "transactionAmount": 12500.00,
        "rating": 4.8,
        "lastTransactionTime": "2023-05-20 14:30:00",
        "supplierStatus": "active",
        "createTime": "2020-05-15 08:30:00",
        "updateTime": "2023-10-20 14:25:00"
      },
      // ...更多供应商
    ]
  }
}
```

**简化响应**

```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": "SUP001",
      "name": "福建安溪茶园",
      "phone": "13800138001",
      "address": "福建省泉州市安溪县",
      "category": "茶叶供应商",
      "grade": "A级",
      "mainProducts": "铁观音、安溪乌龙",
      "status": "active"
    }
  ]
}
```

## 供应商详情

### 获取供应商详情

获取指定供应商的详细信息。

**请求**

```
GET /api/suppliers/{supplierId}
```

**路径参数**

| 参数名 | 类型 | 必填 | 描述 |
|-------|------|------|------|
| supplierId | String | 是 | 供应商ID |

**响应**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "supplierId": "SUP001",
    "suppliername": "福建安溪茶园",
    "supplierContact": "张师傅",
    "supplierPhone": "13800138001",
    "address": "福建省泉州市安溪县",
    "supplierCategory": "茶叶供应商",
    "supplierGrade": "A级",
    "mainProducts": "铁观音、安溪乌龙",
    "cooperationYears": 5,
    "transactionCount": 25,
    "transactionAmount": 12500.00,
    "rating": {
      "overall": 4.8,
      "quality": 4.9,
      "delivery": 4.7,
      "price": 4.6,
      "service": 5.0
    },
    "lastTransactionTime": "2023-05-20 14:30:00",
    "supplierStatus": "active",
    "createTime": "2020-05-15 08:30:00",
    "updateTime": "2023-10-20 14:25:00",
    "transactions": [
      {
        "id": "IN20230520001",
        "date": "2023-05-20",
        "amount": 2500.00,
        "products": ["铁观音", "安溪乌龙"],
        "rating": 4.8
      }
      // ...更多交易记录
    ]
  }
}
```

## 供应商管理

### 添加供应商

添加新的供应商信息。

**请求**

```
POST /api/suppliers
```

**请求体**

```json
{
  "suppliername": "杭州茶具厂",
  "supplierContact": "赵厂长",
  "supplierPhone": "13800138004",
  "address": "浙江省杭州市余杭区",
  "supplierCategory": "茶具供应商",
  "supplierGrade": "B级",
  "mainProducts": "紫砂茶具、陶瓷茶杯",
  "cooperationYears": 1,
  "supplierStatus": "pending"
}
```

**响应**

```json
{
  "code": 200,
  "message": "供应商添加成功",
  "data": {
    "supplierId": "SUP006"
  }
}
```

### 更新供应商

更新指定供应商的信息。

**请求**

```
PUT /api/suppliers/{supplierId}
```

**路径参数**

| 参数名 | 类型 | 必填 | 描述 |
|-------|------|------|------|
| supplierId | String | 是 | 供应商ID |

**请求体**

```json
{
  "suppliername": "杭州茶具制造厂",
  "supplierContact": "赵厂长",
  "supplierPhone": "13800138004",
  "address": "浙江省杭州市余杭区茶具产业园A12",
  "supplierCategory": "茶具供应商",
  "supplierGrade": "A级",
  "mainProducts": "紫砂茶具、陶瓷茶杯、玻璃茶具",
  "cooperationYears": 2,
  "supplierStatus": "active"
}
```

**响应**

```json
{
  "code": 200,
  "message": "供应商更新成功",
  "data": null
}
```

### 删除供应商

删除指定的供应商。

**请求**

```
DELETE /api/suppliers/{supplierId}
```

**路径参数**

| 参数名 | 类型 | 必填 | 描述 |
|-------|------|------|------|
| supplierId | String | 是 | 供应商ID |

**响应**

```json
{
  "code": 200,
  "message": "供应商删除成功",
  "data": null
}
```

### 更新供应商状态

更新指定供应商的状态。

**请求**

```
PATCH /api/suppliers/{supplierId}/status
```

**路径参数**

| 参数名 | 类型 | 必填 | 描述 |
|-------|------|------|------|
| supplierId | String | 是 | 供应商ID |

**请求体**

```json
{
  "status": "active"  // 可选值：active, disabled, pending
}
```

**响应**

```json
{
  "code": 200,
  "message": "供应商状态更新成功",
  "data": null
}
```

## 供应商评分

### 获取供应商评分详情

获取指定供应商的评分详情。

**请求**

```
GET /api/suppliers/{supplierId}/ratings
```

**路径参数**

| 参数名 | 类型 | 必填 | 描述 |
|-------|------|------|------|
| supplierId | String | 是 | 供应商ID |

**响应**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "overall": 4.8,
    "quality": 4.9,
    "delivery": 4.7,
    "price": 4.6,
    "service": 5.0,
    "ratingHistory": [
      {
        "date": "2023-05-20",
        "transactionId": "IN20230520001",
        "quality": 5.0,
        "delivery": 4.5,
        "price": 4.5,
        "service": 5.0,
        "overall": 4.8
      },
      // ...更多评分历史
    ]
  }
}
```

### 添加供应商评分

为指定的交易添加供应商评分。

**请求**

```
POST /api/transactions/{transactionId}/supplier-rating
```

**路径参数**

| 参数名 | 类型 | 必填 | 描述 |
|-------|------|------|------|
| transactionId | String | 是 | 交易ID |

**请求体**

```json
{
  "quality": 5.0,
  "delivery": 4.5,
  "price": 4.0,
  "service": 5.0,
  "comment": "产品质量很好，交付及时，价格略高"
}
```

**响应**

```json
{
  "code": 200,
  "message": "供应商评分添加成功",
  "data": {
    "overall": 4.6
  }
}
```

## 供应商交易记录

### 获取供应商交易记录

获取指定供应商的交易记录。

**请求**

```
GET /api/suppliers/{supplierId}/transactions
```

**路径参数**

| 参数名 | 类型 | 必填 | 描述 |
|-------|------|------|------|
| supplierId | String | 是 | 供应商ID |

**查询参数**

| 参数名 | 类型 | 必填 | 描述 |
|-------|------|------|------|
| page | Integer | 否 | 页码，默认为1 |
| pageSize | Integer | 否 | 每页记录数，默认为10 |
| startDate | String | 否 | 开始日期，格式：YYYY-MM-DD |
| endDate | String | 否 | 结束日期，格式：YYYY-MM-DD |
| sortField | String | 否 | 排序字段，默认为date |
| sortOrder | String | 否 | 排序方式，可选值：asc(升序)、desc(降序)，默认为desc |

**响应**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "total": 25,
    "page": 1,
    "pageSize": 10,
    "list": [
      {
        "id": "IN20230520001",
        "date": "2023-05-20",
        "type": "INBOUND",
        "totalPrice": 2500.00,
        "products": [
          {
            "name": "铁观音",
            "quantity": 10,
            "unit": "斤",
            "unitPrice": 200.00,
            "totalPrice": 2000.00
          },
          {
            "name": "安溪乌龙",
            "quantity": 5,
            "unit": "斤",
            "unitPrice": 100.00,
            "totalPrice": 500.00
          }
        ],
        "rating": {
          "quality": 5.0,
          "delivery": 4.5,
          "price": 4.5,
          "service": 5.0,
          "overall": 4.8
        }
      },
      // ...更多交易记录
    ]
  }
}
```