// 测试交易数据是否正确设置
import { getAllTransactions, debugTransactionData } from './src/mock/database_flow.js'
import { debugAssetsData } from './src/mock/database_assets.js'

console.log('=== 测试交易数据 ===')

// 清除本地存储，强制重新加载默认数据
localStorage.removeItem('mock_transactions_data')
localStorage.removeItem('mock_transactions_config')
localStorage.removeItem('mock_transactions_last_update')

// 获取交易数据
const transactions = getAllTransactions()
console.log('交易记录总数:', transactions.length)

// 显示所有交易记录
console.log('所有交易记录:')
transactions.forEach(t => {
  console.log(`  ${t.date} ${t.time} ${t.type} ${t.productName} ¥${t.amount}`)
})

// 检查2025年1月的数据
const jan2025Transactions = transactions.filter(t => {
  const date = new Date(t.date)
  return date.getFullYear() === 2025 && date.getMonth() === 0 // 0 = 1月
})

console.log('2025年1月交易记录数:', jan2025Transactions.length)
console.log('2025年1月交易记录:')
jan2025Transactions.forEach(t => {
  console.log(`  ${t.date} ${t.time} ${t.type} ${t.productName} ¥${t.amount}`)
})

// 计算2025年1月的汇总
const jan2025Inbound = jan2025Transactions.filter(t => t.type === 'INBOUND')
const jan2025Outbound = jan2025Transactions.filter(t => t.type === 'OUTBOUND')

const totalInbound = jan2025Inbound.reduce((sum, t) => sum + t.amount, 0)
const totalOutbound = jan2025Outbound.reduce((sum, t) => sum + t.amount, 0)

console.log('2025年1月入库金额:', totalInbound)
console.log('2025年1月出库金额:', totalOutbound)
console.log('2025年1月净收入:', totalOutbound - totalInbound)

// 运行调试函数
console.log('\n=== 调试信息 ===')
debugTransactionData()
console.log('\n=== 资产数据调试 ===')
debugAssetsData() 