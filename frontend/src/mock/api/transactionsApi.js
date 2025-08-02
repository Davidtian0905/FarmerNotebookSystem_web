/**
 * Mock交易记录API接口
 * 模拟后端API，提供交易记录数据
 */

import { getAllTransactions, filterTransactionsByPeriod } from '../database_flow.js'
import { calculateSummaryFromTransactions } from '../database_assets.js'

/**
 * Mock交易记录API
 */
export const mockTransactionsApi = {
  /**
   * 获取交易记录列表
   * @param {Object} params - 查询参数
   * @param {string} params.period - 时间维度 ('year', 'month', 'week', 'day', 'total')
   * @param {number} params.year - 指定年份
   * @param {number} params.month - 指定月份（可选）
   * @param {string} params.type - 交易类型 ('all', 'INBOUND', 'OUTBOUND')
   * @param {string} params.startDate - 开始日期（可选）
   * @param {string} params.endDate - 结束日期（可选）
   * @returns {Object} 标准API响应格式
   */
  getList(params = {}) {
    try {
      const { period = 'year', year, month, type = 'all', startDate, endDate } = params
      
      // 参数验证
      if (!year && period !== 'total') {
        return {
          error: 400,
          body: null,
          message: '缺少必要参数：year'
        }
      }
      
      // 获取交易数据
      let transactions = getAllTransactions()
      
      // 按类型过滤
      if (type !== 'all') {
        transactions = transactions.filter(t => t.type === type)
      }
      
      // 按时间维度过滤
      const filteredTransactions = filterTransactionsByPeriod(transactions, period, params)
      
      // 计算汇总
      const summary = calculateSummaryFromTransactions(filteredTransactions, period, params)
      
      return {
        error: 0,
        body: {
          transactions: filteredTransactions,
          summary,
          totalCount: filteredTransactions.length,
          period,
          year,
          month,
          type
        },
        message: ''
      }
    } catch (error) {
      console.error('获取交易记录失败:', error)
      return {
        error: 500,
        body: null,
        message: '系统异常：获取交易记录失败'
      }
    }
  },

  /**
   * 添加交易记录
   * @param {Object} transaction - 交易记录
   * @returns {Object} 标准API响应格式
   */
  add(transaction) {
    try {
      // 参数验证
      if (!transaction.type || !transaction.amount) {
        return {
          error: 400,
          body: null,
          message: '缺少必要参数：type, amount'
        }
      }
      
      // 导入添加函数
      const { addTransaction } = require('../database_flow.js')
      
      // 添加交易记录
      const newTransaction = addTransaction(transaction)
      
      return {
        error: 0,
        body: {
          transaction: newTransaction,
          message: '交易记录添加成功'
        },
        message: ''
      }
    } catch (error) {
      console.error('添加交易记录失败:', error)
      return {
        error: 500,
        body: null,
        message: '系统异常：添加交易记录失败'
      }
    }
  },

  /**
   * 更新交易记录
   * @param {string} id - 交易记录ID
   * @param {Object} updates - 更新内容
   * @returns {Object} 标准API响应格式
   */
  update(id, updates) {
    try {
      // 参数验证
      if (!id) {
        return {
          error: 400,
          body: null,
          message: '缺少必要参数：id'
        }
      }
      
      // 导入更新函数
      const { updateTransaction } = require('../database_flow.js')
      
      // 更新交易记录
      const updatedTransaction = updateTransaction(id, updates)
      
      if (!updatedTransaction) {
        return {
          error: 404,
          body: null,
          message: '交易记录不存在'
        }
      }
      
      return {
        error: 0,
        body: {
          transaction: updatedTransaction,
          message: '交易记录更新成功'
        },
        message: ''
      }
    } catch (error) {
      console.error('更新交易记录失败:', error)
      return {
        error: 500,
        body: null,
        message: '系统异常：更新交易记录失败'
      }
    }
  },

  /**
   * 删除交易记录
   * @param {string} id - 交易记录ID
   * @returns {Object} 标准API响应格式
   */
  delete(id) {
    try {
      // 参数验证
      if (!id) {
        return {
          error: 400,
          body: null,
          message: '缺少必要参数：id'
        }
      }
      
      // 导入删除函数
      const { deleteTransaction } = require('../database_flow.js')
      
      // 删除交易记录
      const success = deleteTransaction(id)
      
      if (!success) {
        return {
          error: 404,
          body: null,
          message: '交易记录不存在'
        }
      }
      
      return {
        error: 0,
        body: {
          message: '交易记录删除成功'
        },
        message: ''
      }
    } catch (error) {
      console.error('删除交易记录失败:', error)
      return {
        error: 500,
        body: null,
        message: '系统异常：删除交易记录失败'
      }
    }
  },

  /**
   * 获取交易统计信息
   * @param {Object} params - 查询参数
   * @returns {Object} 标准API响应格式
   */
  getStatistics(params = {}) {
    try {
      const { period = 'year', year, month } = params
      
      // 获取交易数据
      const transactions = getAllTransactions()
      
      // 按时间维度过滤
      const filteredTransactions = filterTransactionsByPeriod(transactions, period, params)
      
      // 计算统计信息
      const inboundTransactions = filteredTransactions.filter(t => t.type === 'INBOUND')
      const outboundTransactions = filteredTransactions.filter(t => t.type === 'OUTBOUND')
      
      const totalInboundAmount = inboundTransactions.reduce((sum, t) => sum + t.amount, 0)
      const totalOutboundAmount = outboundTransactions.reduce((sum, t) => sum + t.amount, 0)
      
      const statistics = {
        totalTransactions: filteredTransactions.length,
        inboundCount: inboundTransactions.length,
        outboundCount: outboundTransactions.length,
        totalInboundAmount,
        totalOutboundAmount,
        netAmount: totalOutboundAmount - totalInboundAmount,
        period,
        year,
        month
      }
      
      return {
        error: 0,
        body: statistics,
        message: ''
      }
    } catch (error) {
      console.error('获取交易统计失败:', error)
      return {
        error: 500,
        body: null,
        message: '系统异常：获取交易统计失败'
      }
    }
  }
} 