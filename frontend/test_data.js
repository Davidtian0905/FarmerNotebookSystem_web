// 测试交易数据是否正确设置
import { getAllTransactions } from './src/mock/database_flow.js'

// 清除本地存储，强制重新加载默认数据
localStorage.removeItem('mock_transactions_data')
localStorage.removeItem('mock_transactions_config')
localStorage.removeItem('mock_transactions_last_update')

// 获取交易数据
const transactions = getAllTransactions()

// 检查2025年1月的数据
const jan2025Transactions = transactions.filter(t => {
  const date = new Date(t.date)
  return date.getFullYear() === 2025 && date.getMonth() === 0 // 0 = 1月
})

// 计算2025年1月的汇总
const jan2025Inbound = jan2025Transactions.filter(t => t.type === 'INBOUND')
const jan2025Outbound = jan2025Transactions.filter(t => t.type === 'OUTBOUND')

const totalInbound = jan2025Inbound.reduce((sum, t) => sum + t.amount, 0)
const totalOutbound = jan2025Outbound.reduce((sum, t) => sum + t.amount, 0)

// 返回测试结果而不是打印到控制台
export const testResults = {
  totalTransactions: transactions.length,
  jan2025Count: jan2025Transactions.length,
  jan2025Inbound: totalInbound,
  jan2025Outbound: totalOutbound,
  jan2025NetIncome: totalOutbound - totalInbound
}