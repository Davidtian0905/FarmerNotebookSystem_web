# 入库记录 API 文档

## 概述

入库记录页面用于管理茶叶和相关物料的入库操作，包括查看入库记录列表、新增入库记录等功能。本文档基于最新的代码结构，确保与后端数据库字段保持一致。

**页面名称**: 入库记录页面  
**路由路径**: `/inbound-records`  
**组件文件**: `src/views/InboundRecords.vue`  
**表单组件**: `src/components/InboundForm.vue`  

## 功能描述

- 查看入库记录列表
- 筛选和搜索入库记录
- 新增入库记录
- 查看入库记录详情
- 物料模板选择
- 供应商评价系统
- 质量检验管理
- 图片上传管理

## 主要功能

### 1. 入库记录列表
- 支持按日期、物料类型、物料等级、供应商、质量状态等条件筛选
- 支持关键词搜索（物料名称、批次号、供应商）
- 分页显示
- 实时更新
- 按日期排序
- 数据导出功能

### 2. 快捷操作
- AI语音记账
- OCR识别录入
- 自定义入库模板

### 3. 新增入库记录
- 物料信息录入（名称、类型、等级、批次号等）
- 价格信息（单价、总金额自动计算）
- 供应商选择和评价系统
- 仓库位置管理
- 质量检验信息
- 保质期管理
- 图片上传（支持多图片）

## API 接口规范

### 获取入库记录列表

```http
GET /api/inbound-records
```

**请求参数：**

| 参数名 | 类型 | 必填 | 描述 | 数据库字段 |
|--------|------|------|------|----------|
| page | number | 否 | 页码，默认为 1 | - |
| pageSize | number | 否 | 每页数量，默认为 10 | - |
| materialType | string | 否 | 物料类型筛选 | material_type |
| materialGrade | string | 否 | 物料等级筛选 | material_grade |
| supplier | string | 否 | 供应商筛选 | supplier_id |
| qualityStatus | string | 否 | 质量状态筛选 | quality_status |
| warehouseLocation | string | 否 | 仓库位置筛选 | warehouse_location |
| dateRange | array | 否 | 日期范围筛选 [startDate, endDate] | inbound_time |
| keyword | string | 否 | 关键词搜索（物料名称、批次号、供应商） | material_name, batch_number, supplier_name |

**响应数据：**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "records": [
      {
        "id": "IN202501150001",
        "type": "INBOUND",
        "materialId": "MAT001",
        "materialName": "铁观音",
        "materialCode": "TGY001",
        "materialType": "茶叶",
        "materialGrade": "特级",
        "quantity": 50,
        "unit": "斤",
        "unitPrice": 200,
        "amount": 10000,
        "supplierId": "SUP001",
        "supplier": "福建安溪茶园",
        "batchNumber": "TGY2025011春茶5001",
        "warehouseLocation": "A001",
        "inboundTime": "2025-01-15T09:30:00",
        "date": "2025-01-15",
        "time": "09:30:00",
        "expiryDate": "2027-01-15",
        "qualityStatus": "passed",
        "qualityInspector": "质检员A",
        "qualityDate": "2025-01-15",
        "operator": "仓管员张三",
        "status": "COMPLETED",
        "description": "特级铁观音，品质优良",
        "remark": "特级铁观音，品质优良",
        "counterparty": "福建安溪茶园"
      }
    ],
    "total": 100,
    "page": 1,
    "pageSize": 10
  }
}
```

### 新增入库记录

```http
POST /api/inbound-records
```

**请求参数：**

| 字段名 | 类型 | 必填 | 描述 | 数据库字段 | 前端字段名 |
|--------|------|------|------|----------|----------|
| materialName | string | 是 | 物料名称 | material_name | materialName |
| materialCode | string | 否 | 物料编码（自动生成） | material_code | materialCode |
| materialType | string | 否 | 物料类型 | material_type | materialType |
| materialGrade | string | 否 | 物料等级 | material_grade | materialGrade |
| quantity | number | 是 | 入库数量 | quantity | quantity |
| unit | string | 否 | 计量单位 | unit | unit |
| unitPrice | number | 是 | 单价 | unit_price | unitPrice |
| batchNumber | string | 否 | 批次号 | batch_number | batchNumber |
| supplier | string | 是 | 供应商ID | supplier_id | supplier |
| warehouseLocation | string | 否 | 仓库位置 | warehouse_location | warehouseLocation |
| date | string | 否 | 入库日期（YYYY-MM-DD） | date | date |
| time | string | 否 | 入库时间（HH:mm:ss） | time | time |
| expiryDate | string | 否 | 保质期 | expiry_date | expiryDate |
| shelfLifeDays | number | 否 | 保质期天数 | shelf_life_days | shelfLifeDays |
| qualityStatus | string | 否 | 质检状态 | quality_status | qualityStatus |
| inspector | string | 否 | 检验员 | quality_inspector | inspector |
| inspectionDate | string | 否 | 检验日期 | quality_date | inspectionDate |
| qualityRemarks | string | 否 | 质检备注 | quality_remarks | qualityRemarks |
| description | string | 否 | 备注说明 | description/remark | description |
| operator | string | 否 | 操作员 | operator | operator |
| type | string | 否 | 交易类型（固定值：'inbound'） | type | type |
| images | array | 否 | 物料图片数组 | images | images |
| ratings | object | 否 | 供应商评价 | supplier_ratings | ratings |

**请求数据**:
```json
{
  "materialName": "铁观音",
  "materialCode": "TGY20250115001",
  "materialType": "茶叶",
  "materialGrade": "特级",
  "quantity": 50,
  "unit": "kg",
  "unitPrice": 200,
  "batchNumber": "第一批春茶",
  "supplier": "SUP001",
  "warehouseLocation": "A001",
  "date": "2025-01-15",
  "time": "09:30:00",
  "expiryDate": "2027-01-15",
  "shelfLifeDays": 730,
  "qualityStatus": "PENDING",
  "inspector": "质检员A",
  "inspectionDate": "2025-01-15",
  "qualityRemarks": "质检合格",
  "description": "特级铁观音，品质优良",
  "operator": "系统用户",
  "type": "inbound",
  "images": [
    {
      "name": "铁观音_20250115_001.jpg",
      "fileName": "铁观音_20250115_001.jpg",
      "path": "frontend/src/assets/images/铁观音_20250115_001.jpg",
      "url": "data:image/jpeg;base64,..."
    },
    {
      "name": "铁观音_20250115_002.jpg",
      "fileName": "铁观音_20250115_002.jpg",
      "path": "frontend/src/assets/images/铁观音_20250115_002.jpg",
      "url": "data:image/jpeg;base64,..."
    }
  ],
  "ratings": {
    "quality": 5,
    "delivery": 4,
    "price": 4,
    "service": 5
  }
}
```

**响应数据**:
```json
{
  "code": 200,
  "message": "入库记录创建成功",
  "data": {
    "id": "IN202501150001",
    "type": "INBOUND",
    "materialId": "MAT001",
    "materialName": "铁观音",
    "materialCode": "TGY001",
    "materialType": "茶叶",
    "materialGrade": "特级",
    "quantity": 50,
    "unit": "斤",
    "unitPrice": 200,
    "amount": 10000,
    "batchNumber": "TGY20250115001",
    "supplierId": "SUP001",
    "supplier": "福建安溪茶园",
    "warehouseLocation": "A001",
    "inboundTime": "2025-01-15T09:30:00",
    "date": "2025-01-15",
    "time": "09:30:00",
    "expiryDate": "2027-01-15",
    "qualityStatus": "passed",
    "qualityInspector": "质检员A",
    "qualityDate": "2025-01-15",
    "operator": "仓管员张三",
    "status": "COMPLETED",
    "description": "特级铁观音，品质优良",
    "remark": "特级铁观音，品质优良",
    "createdAt": "2025-01-15T09:30:00",
    "updatedAt": "2025-01-15T09:30:00"
  }
}
```

### 获取基础数据

#### 获取物料类型列表
```http
GET /api/material-types
```

**响应数据：**
```json
{
  "code": 200,
  "message": "获取成功",
  "data": [
    "茶叶",
    "肥料",
    "农药",
    "种子",
    "设备",
    "包装材料",
    "工具",
    "其他"
  ]
}
```

#### 获取物料等级列表
```http
GET /api/material-grades
```

**响应数据：**
```json
{
  "code": 200,
  "message": "获取成功",
  "data": [
    "特级",
    "一级",
    "二级",
    "三级",
    "标准"
  ]
}
```

#### 获取仓库位置列表
```http
GET /api/warehouse-locations
```

**响应数据：**
```json
{
  "code": 200,
  "message": "获取成功",
  "data": [
    { "value": "A区-001", "label": "A区-001号位" },
    { "value": "A区-002", "label": "A区-002号位" },
    { "value": "B区-001", "label": "B区-001号位" },
    { "value": "B区-002", "label": "B区-002号位" },
    { "value": "C区-001", "label": "C区-001号位" },
    { "value": "C区-002", "label": "C区-002号位" }
  ]
}
```

#### 获取供应商列表
```http
GET /api/suppliers
```

**响应数据：**
```json
{
  "code": 200,
  "message": "获取成功",
  "data": [
    {
      "id": "SUP001",
      "name": "福建安溪茶园",
      "contact": "李经理",
      "phone": "13800138001",
      "address": "福建省泉州市安溪县",
      "email": "li@anxitea.com",
      "rating": 4.8
    },
    {
      "id": "SUP002",
      "name": "杭州龙井茶业",
      "contact": "张经理",
      "phone": "13800138002",
      "address": "浙江省杭州市西湖区",
      "email": "zhang@longjing.com",
      "rating": 4.5
    },
    {
      "id": "SUP003",
      "name": "云南普洱茶厂",
      "contact": "王经理",
      "phone": "13800138003",
      "address": "云南省普洱市",
      "email": "wang@puer.com",
      "rating": 4.2
    }
  ]
}
```

#### 获取物料列表
```http
GET /api/materials
```

**响应数据：**
```json
{
  "code": 200,
  "message": "获取成功",
  "data": [
    {
      "id": "MAT001",
      "name": "铁观音",
      "code": "TGY001",
      "type": "茶叶",
      "grade": "特级",
      "unit": "斤",
      "unitPrice": 200,
      "description": "福建安溪铁观音，香气浓郁",
      "category": "茶叶"
    },
    {
      "id": "MAT002",
      "name": "龙井茶",
      "code": "LJ001",
      "type": "茶叶",
      "grade": "一级",
      "unit": "斤",
      "unitPrice": 150,
      "description": "杭州西湖龙井，清香淡雅",
      "category": "茶叶"
    },
    {
      "id": "MAT003",
      "name": "普洱茶",
      "code": "PE001",
      "type": "茶叶",
      "grade": "二级",
      "unit": "饼",
      "unitPrice": 80,
      "description": "云南普洱茶，陈香醇厚",
      "category": "茶叶"
    }
  ]
}
```

## 数据模型

### 入库记录模型 (InboundRecord)

| 字段名 | 类型 | 必填 | 描述 | 数据库字段 | 前端字段名 |
|--------|------|------|------|----------|----------|
| id | String | 是 | 入库记录ID | id | id |
| type | String | 是 | 记录类型（INBOUND） | type | type |
| materialId | String | 是 | 物料ID | material_id | materialId |
| materialName | String | 是 | 物料名称 | material_name | materialName |
| materialCode | String | 是 | 物料编码 | material_code | materialCode |
| materialType | String | 是 | 物料类型 | material_type | materialType |
| materialGrade | String | 是 | 物料等级 | material_grade | materialGrade |
| batchNumber | String | 是 | 批次号 | batch_number | batchNumber |
| quantity | Number | 是 | 入库数量 | quantity | quantity |
| unit | String | 是 | 计量单位 | unit | unit |
| unitPrice | Number | 是 | 单价 | unit_price | unitPrice |
| amount | Number | 是 | 总金额 | amount | amount |
| supplierId | String | 是 | 供应商ID | supplier_id | supplierId |
| supplier | String | 是 | 供应商名称 | supplier_name | supplier |
| warehouseLocation | String | 是 | 仓库位置ID | warehouse_location | warehouseLocation |
| inboundTime | DateTime | 是 | 入库时间（ISO格式） | inbound_time | inboundTime |
| date | String | 是 | 入库日期 | inbound_date | date |
| time | String | 是 | 入库时间 | inbound_time_only | time |
| expiryDate | Date | 否 | 保质期 | expiry_date | expiryDate |
| shelfLifeDays | Number | 否 | 保质期天数 | shelf_life_days | shelfLifeDays |
| qualityStatus | String | 是 | 质检状态 | quality_status | qualityStatus |
| inspector | String | 否 | 检验员 | quality_inspector | inspector |
| inspectionDate | String | 否 | 检验日期 | quality_date | inspectionDate |
| qualityRemarks | String | 否 | 质检备注 | quality_remarks | qualityRemarks |
| description | String | 否 | 备注说明 | description | description |
| operator | String | 否 | 操作员 | operator | operator |
| status | String | 是 | 记录状态 | status | status |

| images | Array | 否 | 物料图片 | images | images |
| ratings | Object | 否 | 供应商评价 | supplier_ratings | ratings |
| createdAt | DateTime | 是 | 创建时间 | created_at | createdAt |
| updatedAt | DateTime | 是 | 更新时间 | updated_at | updatedAt |

### 质检状态枚举

| 值 | 描述 | 数据库值 | 前端显示 |
|----|------|----------|----------|
| 待检测 | 待检测 | 待检测 | 待检测 |
| 已完成 | 已完成 | 已完成 | 已完成 |
| 不合格 | 不合格 | 不合格 | 不合格 |
| 免检 | 免检 | 免检 | 免检 |
| PENDING | 待检测（兼容） | PENDING | 待检测 |
| PASSED | 已完成（兼容） | PASSED | 已完成 |
| FAILED | 不合格（兼容） | FAILED | 不合格 |
| EXEMPTED | 免检（兼容） | EXEMPTED | 免检 |
| passed | 合格（兼容） | passed | 合格 |
| failed | 不合格（兼容） | failed | 不合格 |
| pending | 待检测（兼容） | pending | 待检测 |
| qualified | 合格（兼容） | qualified | 合格 |
| unqualified | 不合格（兼容） | unqualified | 不合格 |

### 记录状态枚举

| 值 | 描述 | 数据库值 | 前端显示 |
|----|------|----------|----------|
| COMPLETED | 已完成 | COMPLETED | 已完成 |
| PENDING | 待处理 | PENDING | 待处理 |
| CANCELLED | 已取消 | CANCELLED | 已取消 |

### 物料类型枚举

| 值 | 描述 | 数据库值 | 前端显示 |
|----|------|----------|----------|
| 茶叶 | 茶叶 | 茶叶 | 茶叶 |
| 肥料 | 肥料 | 肥料 | 肥料 |
| 农药 | 农药 | 农药 | 农药 |
| 种子 | 种子 | 种子 | 种子 |
| 设备 | 设备 | 设备 | 设备 |
| 包装材料 | 包装材料 | 包装材料 | 包装材料 |
| 工具 | 工具 | 工具 | 工具 |
| 其他 | 其他 | 其他 | 其他 |

### 物料等级枚举

| 值 | 描述 | 数据库值 | 前端显示 |
|----|------|----------|----------|
| 特级 | 特级 | 特级 | 特级 |
| 一级 | 一级 | 一级 | 一级 |
| 二级 | 二级 | 二级 | 二级 |
| 三级 | 三级 | 三级 | 三级 |
| 标准 | 标准 | 标准 | 标准 |

### 保质期预设枚举

| 值 | 描述 | 数据库值 | 前端显示 |
|----|------|----------|----------|
| 3 | 3个月 | 3 | 3个月 |
| 6 | 6个月 | 6 | 6个月 |
| 9 | 9个月 | 9 | 9个月 |
| 12 | 12个月 | 12 | 12个月 |
| 18 | 18个月 | 18 | 18个月 |
| 24 | 24个月 | 24 | 24个月 |
| 36 | 36个月 | 36 | 36个月 |
| long-term | 长期保存 | long-term | 长期保存 |

### 供应商评价类别枚举

| 值 | 描述 | 数据库值 | 前端显示 |
|----|------|----------|----------|
| quality | 质量评价 | quality | 质量评价 (1-5星) |
| delivery | 交付评价 | delivery | 交付评价 (1-5星) |
| price | 价格评价 | price | 价格评价 (1-5星) |
| service | 服务评价 | service | 服务评价 (1-5星) |

## 错误码说明

| 错误码 | 描述 |
|--------|------|
| 200 | 成功 |
| 400 | 请求参数错误 |
| 401 | 未授权访问 |
| 403 | 权限不足 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

## 前端实现说明

### 前端实现说明

### 组件结构
- `InboundRecords.vue`: 主页面组件，包含列表展示和筛选功能
  - 数据来源：`database_flow.js` 中的 `INBOUND` 类型记录
  - 支持按物料名称、物料编码、供应商搜索
  - 支持分页显示和排序功能
- `InboundForm.vue`: 入库表单组件，用于新增入库记录
  - 包含完整的入库信息录入
  - 支持物料图片上传
  - 自动计算总金额
  - 供应商评价功能

### 数据源文件
- `database_flow.js`: 主要数据源，包含所有入库记录
- `warehouse_data.js`: 基础数据，包含物料类型、等级、供应商等

### 状态管理
- 使用 Vue 3 Composition API
- 响应式数据管理
- 计算属性用于数据筛选和分页
- 使用 `ref` 和 `reactive` 管理组件状态

### 样式规范
- 使用 SCSS 预处理器
- 遵循 BEM 命名规范
- 响应式设计支持
- 统一的颜色主题和字体规范

### 新增功能实现

#### 1. 图片上传与保存
- **文件命名规则**: `{物料名称}_{时间戳}_{随机数}.{扩展名}`
- **保存路径**: `frontend/src/assets/images/`
- **支持格式**: JPG, PNG, GIF, WebP
- **文件大小限制**: 5MB
- **图片预览**: 支持多图片预览和删除

#### 2. 保质期自动计算
- **预设选项**: 3、6、9、12、18、24、36个月，长期保存
- **计算规则**: 基于入库日期 + 保质期天数（月份×30天）
- **自动更新**: 选择预设后自动计算并更新到期日期

#### 3. 供应商评价系统
- **评价维度**: 质量、交付、价格、服务
- **评分范围**: 1-5星
- **总体评分**: 四个维度的平均值
- **显示方式**: 星级评分组件

#### 4. 物料编码自动生成
- **生成规则**: 物料名称拼音首字母 + 日期 + 序号
- **中文转拼音**: 内置拼音映射表
- **示例**: 铁观音 → TGY20250115001

#### 5. 响应式布局优化
- **批次号和物料编码**: 大屏幕并排显示，小屏幕堆叠
- **搜索图标**: 去除边框，右对齐显示
- **表单验证**: 实时验证和错误提示

### 字段映射关系

#### 数据库字段 → 前端字段映射

| 数据库字段 | 前端字段名 | 类型 | 说明 |
|------------|------------|------|------|
| material_name | materialName | string | 物料名称 |
| material_code | materialCode | string | 物料编码（唯一标识，替代ID） |
| material_type | materialType | string | 物料类型 |
| quantity | quantity | number | 入库数量 |
| unit | unit | string | 计量单位 |
| unit_price | unitPrice | number | 单价 |
| amount | amount | number | 总金额 |
| batch_number | batchNumber | string | 批次号 |
| supplier | supplier | string | 供应商 |
| warehouse_location | warehouseLocation | string | 仓库位置 |
| date | date | string | 入库日期（YYYY-MM-DD） |
| time | time | string | 入库时间（HH:mm:ss） |
| expiry_date | expiryDate | string | 到期日期 |
| shelf_life_days | shelfLifeDays | number | 保质期天数 |
| quality_status | qualityStatus | string | 质检状态 |
| inspector | inspector | string | 质检员 |
| inspection_date | inspectionDate | string | 质检日期 |
| quality_remarks | qualityRemarks | string | 质检备注 |
| description | description | string | 备注说明 |
| operator | operator | string | 操作员 |
| images | images | array | 图片附件 |
| type | type | string | 交易类型（固定值：'inbound'） |

#### 显示字段映射
- 入库记录直接使用 `materialName` 作为物料名称显示
- 物料类型通过 `materialType` 字段获取对应的中文名称
- 供应商信息通过 `supplier` 字段显示

#### 时间字段处理
- `inboundTime`: ISO 8601 格式 (YYYY-MM-DDTHH:mm:ss)
- `date`: 日期部分 (YYYY-MM-DD)
- `time`: 时间部分 (HH:mm:ss)

## 注意事项

1. **字段统一规范**：
   - 使用 `materialCode` 作为唯一标识，不再使用单独的 `id` 字段
   - 统一使用 `date` 和 `time` 字段，替代 `inboundTime`
   - 入库记录必须包含 `type: 'INBOUND'` 标识交易类型（大写）
   - 入库记录使用 `materialName`，不使用 `productName`（出库专用）
   - 统一使用 `amount` 字段表示总金额，移除 `totalAmount` 重复字段
   - 统一使用 `inspector` 和 `inspectionDate` 字段，移除 `qualityInspector` 和 `qualityDate` 重复字段

2. **时间格式**：所有时间字段使用 ISO 8601 格式 (YYYY-MM-DDTHH:mm:ss)
3. **金额字段**：保留两位小数，支持自动计算总金额
4. **批次号**：建议保持唯一性，格式为物料编码+日期+序号
5. **物料编码**：支持自动生成，格式为物料类型缩写+日期+序号
6. **数据一致性**：确保前端字段与数据库字段的映射关系正确
7. **图片上传**：支持多张图片上传，存储为 base64 格式
8. **供应商评价**：包含产品质量、交付及时性、价格合理性、服务态度四个维度
9. **质检状态**：支持 passed/failed/pending 三种状态，兼容 qualified/unqualified
10. **搜索功能**：支持模糊搜索物料名称、物料编码、供应商名称
11. **分页显示**：默认每页显示 10 条记录，支持页码跳转
12. **兼容性**：与 `assets-api.md` 和 `dashboard-api.md` 保持字段兼容

## 更新日志

### v2.3.0 (2025-01-15)
- **字段本地化更新**：
  - 更新 `QUALITY_STATUS` 字段值为中文：待检测、已完成、不合格、免检
  - 更新 `WAREHOUSE_LOCATIONS` 字段格式：A区-001、A区-002、B区-001、B区-002、C区-001、C区-002
  - 保持向后兼容，支持英文状态值的兼容性映射
- **API 文档更新**：
  - 更新质检状态枚举定义，反映最新的中文字段值
  - 更新仓库位置列表响应数据格式
  - 完善字段映射关系说明

### v2.2.0 (2025-01-15)
- **新增功能**：
  - 图片上传与本地保存功能
  - 保质期预设选项和自动计算
  - 供应商评价系统（质量、交付、价格、服务四维度评分）
  - 物料编码自动生成（支持中文转拼音）
  - 响应式布局优化
- **API 更新**：
  - 新增 `ratings` 字段用于供应商评价
  - 更新 `images` 字段结构，包含文件路径信息
  - 新增保质期预设枚举定义
- **UI 优化**：
  - 搜索图标样式优化，去除边框
  - 检验状态下拉列表数据绑定修复
  - 批次号和物料编码字段布局优化

### v2.1.0 (2025-01-15)
- **字段统一规范**：清理重复字段，统一字段命名
  - 移除 `totalAmount` 重复字段，统一使用 `amount` 表示总金额
  - 移除 `supplierName` 重复字段，统一使用 `supplier` 表示供应商名称
  - 移除 `qualityInspector` 和 `qualityDate` 重复字段，统一使用 `inspector` 和 `inspectionDate`
  - 移除 `productName`、`category`、`counterparty` 显示字段，直接使用原始字段
  - 统一交易类型为大写 `INBOUND`
- **API接口优化**：简化请求和响应数据结构
- **文档完善**：更新字段映射关系和注意事项

### v2.0.0 (2025-01-15)
- 更新了完整的字段定义和数据库字段对应关系
- 增加了物料类型、等级、质检状态等枚举值
- 完善了API接口的请求参数和响应数据格式
- 更新了基础数据接口的响应格式
- 增加了前端实现的详细说明
- 添加了字段映射关系和注意事项

### v1.0.0 (2024-01-15)
- 初始版本，包含基本的入库记录管理功能