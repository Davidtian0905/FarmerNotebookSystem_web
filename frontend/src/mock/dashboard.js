/**
 * 仪表板相关Mock数据
 * 从database_flow.js获取最近7天的财务汇总数据
 */

import {
  getTransactionsByDateRange,
  getTransactionsByDate,
  getTransactionStatistics,
  getRecentWeekTransactions
} from './database_flow.js'

import {
  getDashboardData,
  getTodayDashboardData
} from './database.js'

import {
  calculateNetProfit,
  calculateGrowthRate,
  calculateSummary,
  calculateGrowthAnalysis
} from '@/stores/dashboard_Calculations.js'

// 获取系统当前日期
const getCurrentDate = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

/**
 * 模拟获取最近7天财务数据（优化版本）
 * 使用优化的getRecentWeekTransactions函数直接获取7天数据
 */
export const mockGet7dayData = () => {
  return mockGetRecentWeekData()
}

/**
 * 模拟获取最近7天财务数据（优化版本）
 * 使用优化的getRecentWeekTransactions函数直接获取7天数据
 */
export const mockGetRecentWeekData = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const currentDate = new Date(getCurrentDate());
      
      // 使用优化的函数直接获取最近7天的交易数据
      const transactions = getRecentWeekTransactions(currentDate);
      
      // 预初始化7天数据结构，提高处理效率
      const dailyData = {};
      const weekData = [];
      
      // 预构建7天日期数组
      for (let i = 6; i >= 0; i--) {
        const date = new Date(currentDate);
        date.setDate(currentDate.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        dailyData[dateStr] = { income: 0, expense: 0, net_profit: 0 };
        weekData.push({
          date: dateStr,
          total_income: 0,
          total_expense: 0,
          net_profit: 0
        });
      }
      
      // 单次遍历处理所有交易数据
      let totalIncome = 0;
      let totalExpense = 0;
      
      transactions.forEach(transaction => {
        const date = transaction.date;
        
        if (transaction.type === 'INBOUND') {
          // INBOUND = 入库/采购 = 支出
          // 使用amount字段或totalPrice字段作为金额
          const amount = transaction.amount || transaction.totalPrice || 0;
          totalExpense += amount;
          
          // 如果日期在预构建的7天范围内，更新dailyData
          if (dailyData[date]) {
            dailyData[date].expense += amount;
          }
        } else if (transaction.type === 'OUTBOUND') {
          // OUTBOUND = 出库/销售 = 收入
          // 使用amount字段或totalPrice字段作为金额
          const amount = transaction.amount || transaction.totalPrice || 0;
          totalIncome += amount;
          
          // 如果日期在预构建的7天范围内，更新dailyData
          if (dailyData[date]) {
            dailyData[date].income += amount;
          }
        }
        
        // 更新净利润
        if (dailyData[date]) {
          dailyData[date].net_profit = dailyData[date].income - dailyData[date].expense;
        }
      });
      
      // 更新weekData数组
      weekData.forEach(dayData => {
        const dailyInfo = dailyData[dayData.date];
        dayData.total_income = dailyInfo.income;
        dayData.total_expense = dailyInfo.expense;
        dayData.net_profit = dailyInfo.net_profit;
      });
      
      const netProfit = totalIncome - totalExpense;
      
      // 生成图表数据
      const chartData = {
        labels: weekData.map(item => {
          const date = new Date(item.date);
          return `${date.getMonth() + 1}/${date.getDate()}`;
        }),
        datasets: [
          {
            label: '收入',
            data: weekData.map(item => item.total_income),
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)'
          },
          {
            label: '支出',
            data: weekData.map(item => item.total_expense),
            borderColor: '#ef4444',
            backgroundColor: 'rgba(239, 68, 68, 0.1)'
          }
        ]
      };
      
      resolve({
        error: 0,
        body: {
          current_date: getCurrentDate(),
          data: weekData,
          summary: {
            // 7天汇总数据（与store中的命名保持一致）
            week_total_income: totalIncome,
            week_total_expense: totalExpense,
            week_net_profit: netProfit,
            // 兼容性字段
            total_income: totalIncome,
            total_expense: totalExpense,
            net_profit: netProfit,
            transaction_count: transactions.length
          },
          charts: {
            incomeExpense: chartData
          }
        },
        message: '获取成功'
      });
    }, 400); // 优化后响应时间从800ms减少到400ms
  });
};

/**
 * 模拟获取今日财务数据
 * 从database_flow.js获取当前日期的收支数据
 */
export const mockGetTodayData = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const currentDate = getCurrentDate();
      
      // 从database_flow.js获取今日交易数据
      const todayTransactions = getTransactionsByDate(currentDate);
      
      let totalIncome = 0;
      let totalExpense = 0;
      
      todayTransactions.forEach(transaction => {
        if (transaction.type === 'INBOUND') {
          // INBOUND = 入库/采购 = 支出
          // 使用amount字段或totalPrice字段作为金额
          totalExpense += transaction.amount || transaction.totalPrice || 0;
        } else if (transaction.type === 'OUTBOUND') {
          // OUTBOUND = 出库/销售 = 收入
          // 使用amount字段或totalPrice字段作为金额
          totalIncome += transaction.amount || transaction.totalPrice || 0;
        }
      });
      
      const netProfit = totalIncome - totalExpense;
      
      resolve({
        error: 0,
        body: {
          date: currentDate,
          total_income: totalIncome,
          total_expense: totalExpense,
          net_profit: netProfit
        },
        message: '获取成功'
      });
    }, 600);
  });
};

/**
 * 模拟获取财务趋势数据
 */
export const mockGetTrendData = (params = {}) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const data = getDashboardData();
      const { period = 'week' } = params;
      
      // 使用统一的增长率计算函数
      const growthAnalysis = calculateGrowthAnalysis(data);
      
      resolve({
        error: 0,
        body: {
          period: period,
          data: data,
          growth_analysis: growthAnalysis
        },
        message: '获取成功'
      });
    }, 700);
  });
};

// 兼容性函数 - 保持与原有API的兼容性
export const mockGetDashboardOverview = mockGetRecentWeekData;
export const mockGetDashboardStats = mockGetTodayData;
export const mockGetChartData = mockGetTrendData;