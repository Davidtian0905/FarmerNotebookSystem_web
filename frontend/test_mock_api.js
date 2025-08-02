// 测试新的Mock API功能
import { mockAssetsApi, mockTransactionsApi } from './src/mock/api/index.js'

console.log('=== 测试Mock API功能 ===')

// 清除本地存储，强制重新加载默认数据
localStorage.removeItem('mock_transactions_data')
localStorage.removeItem('mock_transactions_config')
localStorage.removeItem('mock_transactions_last_update')

// 测试1：获取2025年资产汇总数据
console.log('\n=== 测试1：2025年资产汇总数据 ===')
const summary2025 = mockAssetsApi.getSummary({
  period: 'year',
  year: 2025
})
console.log('2025年汇总数据:', summary2025)

// 测试2：获取2024年资产汇总数据
console.log('\n=== 测试2：2024年资产汇总数据 ===')
const summary2024 = mockAssetsApi.getSummary({
  period: 'year',
  year: 2024
})
console.log('2024年汇总数据:', summary2024)

// 测试3：获取2021年资产汇总数据
console.log('\n=== 测试3：2021年资产汇总数据 ===')
const summary2021 = mockAssetsApi.getSummary({
  period: 'year',
  year: 2021
})
console.log('2021年汇总数据:', summary2021)

// 测试4：获取2025年1月资产汇总数据
console.log('\n=== 测试4：2025年1月资产汇总数据 ===')
const summary2025Jan = mockAssetsApi.getSummary({
  period: 'month',
  year: 2025,
  month: 1
})
console.log('2025年1月汇总数据:', summary2025Jan)

// 测试5：获取总计资产汇总数据
console.log('\n=== 测试5：总计资产汇总数据 ===')
const summaryTotal = mockAssetsApi.getSummary({
  period: 'total'
})
console.log('总计汇总数据:', summaryTotal)

// 测试6：获取交易记录列表
console.log('\n=== 测试6：2025年交易记录列表 ===')
const transactions2025 = mockTransactionsApi.getList({
  period: 'year',
  year: 2025
})
console.log('2025年交易记录:', transactions2025)

// 测试7：获取交易统计信息
console.log('\n=== 测试7：交易统计信息 ===')
const statistics = mockTransactionsApi.getStatistics({
  period: 'year',
  year: 2025
})
console.log('交易统计信息:', statistics)

// 测试8：获取资产趋势数据
console.log('\n=== 测试8：2025年资产趋势数据 ===')
const trend2025 = mockAssetsApi.getTrend({
  period: 'year',
  year: 2025
})
console.log('2025年趋势数据:', trend2025)

// 测试9：获取收支趋势数据
console.log('\n=== 测试9：2025年收支趋势数据 ===')
const incomeExpense2025 = mockAssetsApi.getIncomeExpenseTrend({
  period: 'year',
  year: 2025
})
console.log('2025年收支趋势数据:', incomeExpense2025)

console.log('\n=== 测试完成 ===') 