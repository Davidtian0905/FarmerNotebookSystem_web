# AssetsTestMock页面API文档

## 概述

AssetsTestMock.vue是资产总览功能的测试页面，提供API调试、Mock数据测试和字段验证功能。该页面支持在Mock模式和真实API模式之间切换，便于开发和测试。

## 页面功能

### 1. 数据展示功能
- 资产总览数据展示（总收入、总支出、净资产）
- 时间维度切换（年度、月度、周度、总计）
- 图表数据预览（标签、净资产数据、收入数据、支出数据）
- 收入结构和成本结构数据展示

### 2. 调试功能
- 当前日期和时间维度显示
- Mock模式状态显示
- 最后更新时间记录
- API调用结果展示
- 数据初始化状态跟踪

### 3. 操作功能
- 刷新数据
- 重置数据
- 测试API调用
- 调试数据查看
- Mock模式切换

## 字段结构

### 响应式数据字段

```javascript
// 基础状态数据
const currentDate = ref('')           // 当前日期
const currentPeriod = ref('year')     // 当前时间维度
const apiMode = ref('mock')           // API模式 (mock/api)

// 调试信息
const debugInfo = ref({
  lastUpdate: '',                     // 最后更新时间
  dataCount: 0,                      // 数据条数
  isInitialized: false,              // 初始化状态
  apiCallCount: 0,                   // API调用次数
  errorCount: 0                      // 错误次数
})

// 资产总览数据
const assetOverview = ref({
  totalIncome: 0,                    // 总收入
  totalExpense: 0,                   // 总支出
  netAssets: 0,                      // 净资产
  transactionCount: 0,               // 交易总数
  inboundCount: 0,                   // 入库笔数
  outboundCount: 0                   // 出库笔数
})

// 图表数据
const chartData = ref({
  labels: [],                        // 图表标签
  datasets: [{
    label: '净资产',
    data: [],                        // 净资产数据
    borderColor: 'rgb(75, 192, 192)',
    tension: 0.1
  }]
})

// 收支数据
const incomeExpenseData = ref({
  income: [],                        // 收入数据数组
  expense: []                        // 支出数据数组
})

// 结构分析数据
const incomeStructure = ref([])      // 收入结构数据
const costStructure = ref([])        // 成本结构数据

// API测试结果
const apiTestResult = ref(null)      // API测试调用结果
```

### 时间维度选项

```javascript
const periods = [
  { label: '年度', value: 'year' },
  { label: '月度', value: 'month' },
  { label: '周度', value: 'week' },
  { label: '总计', value: 'total' }
]
```

## API调用方式

### 1. Mock模式调用

```javascript
// 使用Mock API
import { mockAssetsApi } from '@/mock/api/index.js'

// 获取汇总数据
const response = await mockAssetsApi.getSummary({
  period: currentPeriod.value,
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1
})
```

### 2. 真实API模式调用

```javascript
// 使用真实API
import { assetsApi } from '@/api/assets'

// 获取汇总数据
const response = await assetsApi.getSummary({
  period: currentPeriod.value,
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1
})
```

## 数据处理逻辑

### 1. API响应处理

```javascript
// 标准API响应格式检查
if (responseData.error === 0 && responseData.body) {
  summaryData = responseData.body
} 
// 直接Mock数据格式检查
else if (responseData.period && responseData.summary) {
  summaryData = responseData
} 
// 其他格式处理
else {
  summaryData = responseData
}
```

### 2. 图表数据构建

```javascript
// 根据时间维度构建图表数据
if (currentPeriod.value === 'total' && summaryData.yearlyData) {
  // 年度数据处理
  chartData.value = {
    labels: summaryData.yearlyData.map(item => item.year + '年'),
    datasets: [{
      label: '净资产',
      data: summaryData.yearlyData.map(item => item.netAssets)
    }]
  }
} else if (summaryData.monthlyData) {
  // 月度数据处理
  chartData.value = {
    labels: summaryData.monthlyData.map(item => item.month + '月'),
    datasets: [{
      label: '净资产', 
      data: summaryData.monthlyData.map(item => item.netAssets)
    }]
  }
}
```

### 3. 收支数据处理

```javascript
// 构建收支趋势数据
if (summaryData.monthlyData) {
  incomeExpenseData.value = {
    income: summaryData.monthlyData.map(item => item.totalIncome || 0),
    expense: summaryData.monthlyData.map(item => item.totalExpense || 0)
  }
}
```

## 调试功能

### 1. 调试信息更新

```javascript
// 更新调试信息
debugInfo.value = {
  lastUpdate: new Date().toLocaleString(),
  dataCount: summaryData.monthlyData?.length || 0,
  isInitialized: true,
  apiCallCount: debugInfo.value.apiCallCount + 1,
  errorCount: debugInfo.value.errorCount
}
```

### 2. 错误处理

```javascript
try {
  // API调用逻辑
} catch (error) {
  console.error('API调用失败:', error)
  showToast('数据加载失败')
  debugInfo.value.errorCount++
}
```

## 与AssetsOverview.vue的差异

### 主要差异点

1. **数据获取方式**
   - AssetsOverview: 使用Pinia Store统一管理
   - AssetsTestMock: 直接调用API，支持Mock切换

2. **字段命名**
   - AssetsOverview: `assetData`
   - AssetsTestMock: `assetOverview`

3. **调试功能**
   - AssetsOverview: 无调试功能
   - AssetsTestMock: 完整的调试信息和测试功能

4. **图表数据结构**
   - AssetsOverview: 通过函数动态获取
   - AssetsTestMock: 独立的响应式数据结构

5. **API模式切换**
   - AssetsOverview: 固定使用Store模式
   - AssetsTestMock: 支持Mock/API模式动态切换

## 使用建议

1. **开发阶段**: 使用Mock模式进行前端开发和调试
2. **测试阶段**: 切换到API模式验证真实接口
3. **调试问题**: 利用调试信息和API测试结果定位问题
4. **字段验证**: 对比两种模式的数据结构确保一致性

## 注意事项

1. Mock模式和API模式的数据格式可能不完全一致，需要在数据处理时做兼容
2. 调试信息仅在开发环境使用，生产环境应移除
3. API模式切换状态会保存在localStorage中
4. 图表数据的构建逻辑需要处理数据为空的情况