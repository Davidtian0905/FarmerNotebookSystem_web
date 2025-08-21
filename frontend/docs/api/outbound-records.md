# 出库记录页面 API 文档

## 页面概述

**页面名称**: 出库记录页面  
**路由路径**: `/outbound-records`  
**组件文件**: `src/views/OutboundRecords.vue`  
**表单组件**: `src/components/OutboundForm.vue`  

## 功能描述

出库记录页面用于管理和查看所有出库记录，提供出库记录的查询、筛选、新增等功能，支持商品组合管理。

## 主要功能

### 1. 出库记录列表
- 展示所有出库记录
- 支持分页显示
- 实时搜索和筛选
- 数据导出功能

### 2. 快捷操作
- AI语音记账
- 自定义商品组合
- 商品组合模板

### 3. 商品组合管理
- 商品组合列表展示
- 组合成本和利润率计算
- 组合模板管理

### 4. 新增出库
- 模态框形式的出库表单
- 支持多种出库类型
- 商品组合选择功能

## API 接口规范

### 获取出库记录列表

```http
GET /api/outbound-records
```

**请求参数**:
```json
{
  "page": 1,
  "pageSize": 20,
  "search": "搜索关键词",
  "materialType": "物料类型ID",
  "customerId": "客户ID",
  "warehouseLocation": "仓库位置ID",
  "outboundType": "出库类型",
  "startDate": "2024-01-01",
  "endDate": "2024-12-31"
}
```

**响应数据**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "records": [
      {
        "id": "OUT001",
        "materialId": "MAT001",
        "materialName": "龙井茶叶",
        "materialCode": "LJ001",
        "materialType": "tea",
        "materialGrade": "premium",
        "batchNumber": "B20240101001",
        "quantity": 50,
        "unit": "kg",
        "unitPrice": 320.00,
        "totalPrice": 16000.00,
        "customerId": "CUS001",
        "customerName": "张三茶叶店",
        "warehouseLocation": "WH001",
        "warehouseLocationName": "A区-1号仓库",
        "outboundTime": "2024-01-20T14:30:00",
        "outboundType": "sale",
        "status": "completed",
        "comboId": "COMBO001",
        "comboName": "精品茶叶套装",
        "description": "优质龙井茶叶销售",
        "createdAt": "2024-01-20T14:30:00",
        "updatedAt": "2024-01-20T14:30:00"
      }
    ],
    "total": 120,
    "page": 1,
    "pageSize": 20,
    "totalPages": 6
  }
}
```

### 新增出库记录

```http
POST /api/outbound-records
```

**请求数据**:
```json
{
  "materialId": "MAT001",
  "batchNumber": "B20240101001",
  "quantity": 50,
  "unitPrice": 320.00,
  "customerId": "CUS001",
  "warehouseLocation": "WH001",
  "outboundTime": "2024-01-20T14:30:00",
  "outboundType": "sale",
  "comboId": "COMBO001",
  "description": "优质龙井茶叶销售"
}
```

**响应数据**:
```json
{
  "code": 200,
  "message": "出库记录创建成功",
  "data": {
    "id": "OUT001",
    "materialId": "MAT001",
    "batchNumber": "B20240101001",
    "quantity": 50,
    "unitPrice": 320.00,
    "totalPrice": 16000.00,
    "customerId": "CUS001",
    "warehouseLocation": "WH001",
    "outboundTime": "2024-01-20T14:30:00",
    "outboundType": "sale",
    "status": "completed",
    "comboId": "COMBO001",
    "description": "优质龙井茶叶销售",
    "createdAt": "2024-01-20T14:30:00"
  }
}
```

### 获取商品组合列表

```http
GET /api/product-combos
```

**响应数据**:
```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": "COMBO001",
      "name": "精品茶叶套装",
      "code": "TC001",
      "materials": [
        {
          "materialId": "MAT001",
          "materialName": "龙井茶叶",
          "quantity": 2,
          "unit": "kg",
          "unitCost": 280.00
        },
        {
          "materialId": "MAT002",
          "materialName": "包装盒",
          "quantity": 1,
          "unit": "个",
          "unitCost": 15.00
        }
      ],
      "totalCost": 575.00,
      "sellingPrice": 750.00,
      "profitMargin": 30.43,
      "productCount": 1,
      "status": "active",
      "createdAt": "2024-01-10T09:00:00"
    }
  ]
}
```

### 创建商品组合

```http
POST /api/product-combos
```

**请求数据**:
```json
{
  "name": "精品茶叶套装",
  "code": "TC001",
  "materials": [
    {
      "materialId": "MAT001",
      "quantity": 2,
      "unitCost": 280.00
    },
    {
      "materialId": "MAT002",
      "quantity": 1,
      "unitCost": 15.00
    }
  ],
  "sellingPrice": 750.00,
  "description": "高端茶叶组合套装"
}
```

### 获取基础数据

#### 获取客户列表
```http
GET /api/customers
```

#### 获取物料批次信息
```http
GET /api/materials/{materialId}/batches
```

**响应数据**:
```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "batchNumber": "B20240101001",
      "availableQuantity": 80,
      "unitPrice": 280.00,
      "expiryDate": "2025-01-15",
      "warehouseLocation": "WH001"
    }
  ]
}
```

## 数据模型

### 出库记录模型 (OutboundRecord)

| 字段名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| id | String | 是 | 出库记录ID |
| materialId | String | 是 | 物料ID |
| materialName | String | 是 | 物料名称 |
| materialCode | String | 是 | 物料编码 |
| materialType | String | 是 | 物料类型 |
| materialGrade | String | 是 | 物料等级 |
| batchNumber | String | 是 | 批次号 |
| quantity | Number | 是 | 出库数量 |
| unit | String | 是 | 计量单位 |
| unitPrice | Number | 是 | 单价 |
| totalPrice | Number | 是 | 总价 |
| customerId | String | 是 | 客户ID |
| customerName | String | 是 | 客户名称 |
| warehouseLocation | String | 是 | 仓库位置ID |
| warehouseLocationName | String | 是 | 仓库位置名称 |
| outboundTime | DateTime | 是 | 出库时间 |
| outboundType | String | 是 | 出库类型 |
| status | String | 是 | 出库状态 |
| comboId | String | 否 | 商品组合ID |
| comboName | String | 否 | 商品组合名称 |
| description | String | 否 | 备注说明 |
| createdAt | DateTime | 是 | 创建时间 |
| updatedAt | DateTime | 是 | 更新时间 |

### 商品组合模型 (ProductCombo)

| 字段名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| id | String | 是 | 组合ID |
| name | String | 是 | 组合名称 |
| code | String | 是 | 组合编码 |
| materials | Array | 是 | 物料列表 |
| totalCost | Number | 是 | 总成本 |
| sellingPrice | Number | 是 | 销售价格 |
| profitMargin | Number | 是 | 利润率(%) |
| productCount | Number | 是 | 产品数量 |
| status | String | 是 | 状态 |
| description | String | 否 | 描述 |
| createdAt | DateTime | 是 | 创建时间 |

### 出库类型枚举

| 值 | 描述 |
|----|------|
| sale | 销售出库 |
| transfer | 调拨出库 |
| return | 退货出库 |
| loss | 损耗出库 |
| sample | 样品出库 |

### 出库状态枚举

| 值 | 描述 |
|----|------|
| pending | 待出库 |
| processing | 处理中 |
| completed | 已完成 |
| cancelled | 已取消 |

## 业务规则

### 出库验证规则
1. 出库数量不能超过库存可用数量
2. 出库时间不能早于入库时间
3. 出库时间不能晚于当前时间
4. 已过期的批次不能出库
5. 销售出库必须指定客户
6. 调拨出库必须指定目标仓库

### 商品组合规则
1. 组合中的物料必须有足够库存
2. 组合编码必须唯一
3. 利润率自动计算：(销售价格 - 总成本) / 销售价格 * 100%
4. 组合状态为inactive时不能用于出库

## 错误码说明

| 错误码 | 描述 |
|--------|------|
| 200 | 成功 |
| 400 | 请求参数错误 |
| 401 | 未授权访问 |
| 403 | 权限不足 |
| 404 | 资源不存在 |
| 409 | 库存不足 |
| 422 | 业务规则验证失败 |
| 500 | 服务器内部错误 |

## 前端实现说明

### 组件结构
- `OutboundRecords.vue`: 主页面组件，包含列表展示、筛选和商品组合管理
- `OutboundForm.vue`: 出库表单组件，支持多种出库类型和组合选择

### 状态管理
- 使用 Vue 3 Composition API
- 响应式数据管理
- 计算属性用于数据筛选、分页和组合计算

### 特殊功能
- 商品组合列表的展开/收起
- 批次库存实时查询
- 快速数量选择
- 利润率实时计算

## 注意事项

1. 出库操作会实时更新库存数量
2. 商品组合的成本和利润率需要实时计算
3. 批次先进先出(FIFO)原则
4. 出库单号自动生成，格式：OUT + YYYYMMDD + 序号
5. 支持批量出库操作
6. 出库记录一旦确认不可修改，只能取消

## 更新日志

- **v1.0.0** (2024-01-15): 初始版本，包含基本的出库记录管理和商品组合功能