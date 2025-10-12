# 出库记录管理 API 文档

## 概述

出库记录管理系统提供以下核心功能：
- 商品组合管理：创建和管理商品组合，包含多种物料的组合配置
- 出库销售记录：记录商品销售出库信息，包含客户信息和销售渠道
- 商品模板管理：保存常用的商品配置作为模板，便于快速创建出库记录
- AI语音记账：支持语音输入创建出库记录

## API 接口

### 1. 获取商品组合列表

**接口地址：** `GET /api/product-compositions`

**请求参数：**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| page | number | 否 | 页码，默认1 |
| pageSize | number | 否 | 每页数量，默认10 |
| search | string | 否 | 搜索关键词（商品名称或编码） |

**响应数据：**

```json
{
  "code": 200,
  "message": "商品组合创建成功",
  "data": {
    "list": [
      {
        "id": "PC001",
        "productName": "铁观音礼盒套装",
        "productCode": "P_TGY20250822093000",
        "unit": "套",
        "description": "高档铁观音礼盒套装",
        "images": ["image1.jpg", "image2.jpg"],
        "materials": [
          {
            "materialId": "M001",
            "materialName": "铁观音",
            "materialCode": "M_TGY20250820093000",
            "currentStock": 100,
            "quantity": 0.5,
            "unit": "斤",
            "unitPrice": 280.00,
            "subtotal": 140.00,
            "deductMaterial": true
          },
          {
            "materialId": "M002",
            "materialName": "茶叶罐",
            "materialCode": "M_CYG20250820093000",
            "currentStock": 50,
            "quantity": 1,
            "unit": "个",
            "unitPrice": 10.00,
            "subtotal": 10.00,
            "deductMaterial": true
          }
        ],
        "totalMaterialCost": 150.00,
        "profitRate": 25.0,
        "suggestedPrice": 187.50,
        "productPrice": 200.00,
        "expectedProfit": 50.00,
        "actualProfitRate": 25.0,
        "productQuantity": 10,
        "stockDeductionPreview": [
          {
            "materialName": "铁观音",
            "quantityUnit": "0.5斤",
            "deductStock": 5,
            "totalDeduction": 5,
            "currentTotalStock": 100,
            "afterDeductionStock": 95,
            "status": "充足"
          }
        ],
        "createdAt": "2025-01-15T10:30:00Z",
        "updatedAt": "2025-01-15T10:30:00Z"
      }
    ],
    "total": 1,
    "page": 1,
    "pageSize": 10
  }
}
```

### 2. 创建商品组合

**接口地址：** `POST /api/product-compositions`

**请求参数：**

```json
{
  "productName": "铁观音礼盒套装",
  "productCode": "P_TGY20250822093000",
  "unit": "套",
  "description": "高档铁观音礼盒套装",
  "images": ["image1.jpg", "image2.jpg"],
  "materials": [
    {
      "materialName": "铁观音",
      "materialCode": "M_TGY20250820093000",
      "quantity": 0.5,
      "unit": "斤",
      "unitPrice": 280.00,
      "deductMaterial": true
    },
    {
      "materialName": "茶叶罐",
      "materialCode": "M_CYG20250820093000",
      "quantity": 1,
      "unit": "个",
      "unitPrice": 10.00,
      "deductMaterial": true
    }
  ],
  "profitRate": 25.0,
  "productPrice": 200.00,
  "productQuantity": 10
}
```

**响应数据：**

```json
{
  "code": 200,
  "message": "商品组合创建成功",
  "data": {
    "id": "PC001",
    "productName": "铁观音礼盒套装",
    "productCode": "P_TGY20250822093000"
  }
}
```

### 3. 保存为模板

**接口地址：** `POST /api/product-compositions/save-template`

**请求参数：**

```json
{
  "templateName": "铁观音礼盒模板",
  "productName": "铁观音礼盒套装",
  "productCode": "P_TGY20250822093000",
  "unit": "套",
  "description": "高档铁观音礼盒套装",
  "materials": [
    {
      "materialName": "铁观音",
      "materialCode": "M_TGY20250820093000",
      "quantity": 0.5,
      "unit": "斤",
      "unitPrice": 280.00,
      "deductMaterial": true
    }
  ],
  "profitRate": 25.0,
  "productPrice": 200.00,
  "productQuantity": 10
}
```

**响应数据：**

```json
{
  "code": 200,
  "message": "模板保存成功",
  "data": {
    "templateId": "TPL001",
    "templateName": "铁观音礼盒模板"
  }
}
```

### 4. 获取出库模板列表

**接口地址：** `GET /api/outbound-templates`

**请求参数：**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| page | number | 否 | 页码，默认1 |
| pageSize | number | 否 | 每页数量，默认10 |
| search | string | 否 | 搜索关键词 |
| channel | string | 否 | 销售渠道筛选 |

**响应数据：**

```json
{
  "code": 200,
  "message": "查询成功",
  "data": {
    "list": [
      {
        "id": "TEMPLATE_001",
        "templateName": "铁观音出库模板",
        "productName": "铁观音套装",
        "productCode": "P_DHP2025082710301123",
        "unit": "套",
        "quantity": 10,
        "unitPrice": 200.00,
        "totalPrice": 2000.00,
        "customerId": "CUS001",
        "customerName": "李茶庄",
        "customerPhone": "13900139001",
        "customerAddress": "北京市朝阳区",
        "customerDiscountRate": 0.9,
        "channel": "ONLINE",
        "tags": ["VIP客户", "礼品"],
        "notes": "客户要求包装精美",
        "createdAt": "2025-01-15T10:30:00Z",
        "updatedAt": "2025-01-15T10:30:00Z"
      }
    ],
    "total": 1,
    "page": 1,
    "pageSize": 10
  }
}
```

### 5. 创建出库模板

**接口地址：** `POST /api/outbound-templates`

**请求参数：**

```json
{
  "templateName": "铁观音出库模板",
  "productName": "铁观音套装",
  "productCode": "P_DHP2025082710301123",
  "unit": "套",
  "quantity": 10,
  "unitPrice": 200.00,
  "customerId": "CUS001",
  "customerName": "李茶庄",
  "customerPhone": "13900139001",
  "customerAddress": "北京市朝阳区",
  "customerDiscountRate": 0.9,
  "channel": "ONLINE",
  "tags": ["VIP客户", "礼品"],
  "notes": "客户要求包装精美"
}
```

**响应数据：**

```json
{
  "code": 200,
  "message": "模板创建成功",
  "data": {
    "id": "TEMPLATE_002",
    "templateName": "铁观音出库模板"
  }
}
```

### 6. 更新出库模板

**接口地址：** `PUT /api/outbound-templates/{id}`

**请求参数：**

```json
{
  "templateName": "铁观音出库模板（更新）",
  "unitPrice": 220.00,
  "quantity": 15,
  "customerName": "李茶庄",
  "channel": "OFFLINE",
  "notes": "更新后的备注"
}
```

**响应数据：**

```json
{
  "code": 200,
  "message": "模板更新成功",
  "data": {
    "id": "TEMPLATE_001",
    "templateName": "铁观音出库模板（更新）"
  }
}
```

### 7. 删除出库模板

**接口地址：** `DELETE /api/outbound-templates/{id}`

**响应数据：**

```json
{
  "code": 200,
  "message": "模板删除成功"
}
```

### 8. 获取出库记录列表

**接口地址：** `GET /api/outbound-records`

**请求参数：**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| page | number | 否 | 页码，默认1 |
| pageSize | number | 否 | 每页数量，默认10 |
| search | string | 否 | 搜索关键词 |
| startDate | string | 否 | 开始日期 |
| endDate | string | 否 | 结束日期 |
| customerId | string | 否 | 客户ID |
| channel | string | 否 | 销售渠道 |

**响应数据：**

```json
{
  "code": 200,
  "message": "查询成功",
  "data": {
    "list": [
      {
        "id": "OUT20250115001",
        "productName": "铁观音套装",
        "productCode": "P_TGY20250820093000",
        "productImages": ["image1.jpg"],
        "quantity": 50,
        "unit": "盒",
        "unitPrice": 280.00,
        "totalPrice": 14000.00,
        "customerId": "C001",
        "customerName": "李茶庄",
        "customerPhone": "13800138001",
        "customerAddress": "福建省厦门市思明区茶叶街123号",
        "customerDiscountRate": 0.1,
        "discountAmount": 1400.00,
        "finalAmount": 12600.00,
        "channel": "线上",
        "tags": ["VIP客户", "礼品"],
        "notes": "客户要求包装精美",
        "createdAt": "2025-08-22T09:30:00Z",
        "updatedAt": "2025-08-22T09:30:00Z"
      }
    ],
    "total": 1,
    "page": 1,
    "pageSize": 10
  }
}
```

### 9. 创建出库记录

**接口地址：** `POST /api/outbound-records`

**请求参数：**

```json
{
  "productName": "铁观音套装",
  "productCode": "P_TGY20250820093000",
  "productImages": ["image1.jpg"],
  "quantity": 50,
  "unit": "盒",
  "unitPrice": 280.00,
  "customerId": "C001",
  "customerName": "李茶庄",
  "customerPhone": "13800138001",
  "customerAddress": "福建省厦门市思明区茶叶街123号",
  "customerDiscountRate": 0.1,
  "channel": "线上",
  "tags": ["VIP客户", "礼品"],
  "notes": "客户要求包装精美"
}
```

**响应数据：**

```json
{
  "code": 200,
  "message": "出库记录创建成功",
  "data": {
    "id": "OUT20250115001",
    "productCode": "P_TGY20250820093000",
    "quantity": 50,
    "totalPrice": 14000.00,
    "finalAmount": 12600.00
  }
}
```



### 10. 获取销售渠道选项

**接口地址：** `GET /api/sales-channels`

**响应数据：**

```json
{
  "code": 200,
  "message": "查询成功",
  "data": [
    {
      "value": "ONLINE",
      "label": "线上销售"
    },
    {
      "value": "OFFLINE",
      "label": "线下销售"
    },
    {
      "value": "WHOLESALE",
      "label": "批发"
    },
    {
      "value": "RETAIL",
      "label": "零售"
    }
  ]
}
```

### 11. 搜索物料

**接口地址：** `GET /api/materials/search`

**请求参数：**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| keyword | string | 是 | 搜索关键词 |
| limit | number | 否 | 返回数量限制，默认10 |

**响应数据：**

```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "materialId": "M001",
      "materialName": "铁观音",
      "materialCode": "M_TGY20250820093000",
      "currentStock": 100,
      "unit": "斤",
      "unitPrice": 280.00
    }
  ]
}
```

## 数据库字段说明

### 商品组合表 (product_compositions)

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | string | 商品组合ID |
| product_name | string | 商品名称 |
| product_code | string | 商品编码 |
| unit | string | 商品单位（套、盒、包） |
| description | text | 商品描述 |
| images | json | 商品图片数组 |
| materials | json | 物料组合信息 |
| total_material_cost | decimal | 物料总成本 |
| profit_rate | decimal | 利润率(%) |
| suggested_price | decimal | 建议售价 |
| product_price | decimal | 商品定价 |
| expected_profit | decimal | 预期利润 |
| actual_profit_rate | decimal | 实际利润率(%) |
| product_quantity | integer | 商品数量 |
| created_at | datetime | 创建时间 |
| updated_at | datetime | 更新时间 |

### 出库记录表 (outbound_records)

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | string | 出库记录ID |
| product_name | string | 产品名称 |
| product_code | string | 产品编码 |
| product_images | json | 产品图片数组 |
| quantity | integer | 销售数量 |
| unit | string | 销售单位 |
| unit_price | decimal | 销售单价 |
| total_price | decimal | 销售总价 |
| customer_id | string | 客户ID |
| customer_name | string | 客户姓名 |
| customer_phone | string | 联系电话 |
| customer_address | string | 客户地址 |
| customer_discount_rate | decimal | 客户折扣率 |
| discount_amount | decimal | 折扣金额 |
| final_amount | decimal | 最终金额 |
| channel | string | 销售渠道 |
| tags | json | 订单标签 |
| notes | text | 备注说明 |
| created_at | datetime | 创建时间 |
| updated_at | datetime | 更新时间 |

### 出库模板表 (outbound_templates)

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | string | 模板ID |
| template_name | string | 模板名称 |
| product_name | string | 产品名称 |
| product_code | string | 产品编码 |
| unit | string | 单位 |
| quantity | integer | 数量 |
| unit_price | decimal | 单价 |
| total_price | decimal | 总价 |
| customer_id | string | 客户ID |
| customer_name | string | 客户名称 |
| customer_phone | string | 客户电话 |
| customer_address | string | 客户地址 |
| customer_discount_rate | decimal | 客户折扣率 |
| channel | string | 销售渠道 |
| tags | json | 标签 |
| notes | text | 备注 |
| created_at | datetime | 创建时间 |
| updated_at | datetime | 更新时间 |



## 前端字段映射

### OutboundProductMix.vue 页面字段

| 前端字段 | 后端字段 | 说明 |
|----------|----------|------|
| productName | product_name | 商品名称 |
| productCode | product_code | 商品编码 |
| unit | unit | 商品单位 |
| description | description | 商品描述 |
| images | images | 商品图片 |
| materials | materials | 物料组合 |
| totalMaterialCost | total_material_cost | 物料总成本 |
| profitRate | profit_rate | 利润率 |
| suggestedPrice | suggested_price | 建议售价 |
| productPrice | product_price | 商品定价 |
| expectedProfit | expected_profit | 预期利润 |
| actualProfitRate | actual_profit_rate | 实际利润率 |
| productQuantity | product_quantity | 商品数量 |
| stockDeductionPreview | - | 库存扣除预览（前端计算） |

### OutboundTemplates.vue 页面字段

| 前端字段 | 后端字段 | 说明 |
|----------|----------|------|
| templateName | template_name | 模板名称 |
| productName | product_name | 产品名称 |
| productCode | product_code | 产品编码 |
| unitPrice | unit_price | 单价 |
| quantity | quantity | 数量 |
| unit | unit | 单位 |
| totalPrice | total_price | 总价 |
| customerName | customer_name | 客户 |
| channel | channel | 销售渠道 |
| notes | notes | 备注 |
| createdAt | created_at | 创建时间 |
| updatedAt | updated_at | 更新时间 |

### OutboundForm.vue 页面字段

| 前端字段 | 后端字段 | 说明 |
|----------|----------|------|
| productName | product_name | 产品名称 |
| productCode | product_code | 产品编码 |
| productImages | product_images | 产品图片 |
| quantity | quantity | 销售数量 |
| unitPrice | unit_price | 销售单价 |
| totalPrice | total_price | 销售总价 |
| customerId | customer_id | 客户ID |
| customerName | customer_name | 客户姓名 |
| customerPhone | customer_phone | 联系电话 |
| customerAddress | customer_address | 客户地址 |
| customerDiscountRate | customer_discount_rate | 客户折扣率 |
| channel | channel | 销售渠道 |

## 业务逻辑说明

### 成本计算

1. **物料总成本** = Σ(物料数量 × 物料单价)
2. **建议售价** = 物料总成本 × (1 + 利润率/100)
3. **预期利润** = 商品定价 - 物料总成本
4. **实际利润率** = (预期利润 / 商品定价) × 100%

### 库存扣除逻辑

当创建出库记录时，系统会自动扣除对应物料的库存：
- 扣除数量 = 商品销售数量 × 单个商品所需物料数量
- 需要检查库存是否充足
- 库存不足时应提示用户并阻止操作
- 提供库存扣除预览功能

### 折扣计算

1. **折扣金额** = 销售总价 × 客户折扣率
2. **最终金额** = 销售总价 - 折扣金额

### 商品编码生成规则

- 格式：P_{商品类型缩写}{YYYYMMDDHHMMSS}
- 示例：P_TGY20250822093000（铁观音商品，2025年8月22日09:30:00创建）

## 错误码说明

| 错误码 | 说明 |
|--------|------|
| 200 | 成功 |
| 400 | 请求参数错误 |
| 401 | 未授权 |
| 403 | 禁止访问 |
| 404 | 资源不存在 |
| 409 | 库存不足 |
| 422 | 数据验证失败 |
| 500 | 服务器内部错误 |

## 注意事项

1. 所有金额字段保留2位小数
2. 商品编码需要保证唯一性
3. 创建出库记录时需要验证库存充足性
4. 客户折扣率范围：0-1（0表示无折扣，1表示全免）
5. 销售渠道和订单标签支持自定义添加
6. 商品图片上传限制：JPG、PNG格式，单个文件不超过5MB
7. 模板名称需要保证唯一性
8. 物料搜索支持模糊匹配物料名称和编码
9. 商品单位支持：套、盒、包等自定义单位
10. 库存扣除预览状态：充足、不足、临界