/**
 * 仪表板相关Mock数据
 * 从数据库配置获取最近7天的财务汇总数据
 */

import {
  getDashboardData,
  getTodayDashboardData,
  calculateSummary,
  generateChartData,
  calculateGrowthAnalysis,
  calculateNetProfit
} from './database.js'

// 获取系统当前日期
const getCurrentDate = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

/**
 * 模拟获取最近7天财务数据
 */
export const mockGetRecentWeekData = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const data = getDashboardData();
      const summary = calculateSummary(data);
      const chartData = generateChartData(data);
      const growthAnalysis = calculateGrowthAnalysis(data);
      
      resolve({
        error: 0,
        body: {
          current_date: getCurrentDate(),
          data: data,
          summary: summary,
          charts: {
            incomeExpense: chartData
          },
          growth_analysis: growthAnalysis
        },
        message: '获取成功'
      });
    }, 800);
  });
};

/**
 * 模拟获取今日财务数据
 */
export const mockGetTodayData = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const todayData = getTodayDashboardData();
      const currentDate = getCurrentDate();
      
      if (todayData) {
        // 计算利润
        const calculatedProfit = calculateNetProfit(todayData.total_income, todayData.total_expense);
        
        resolve({
          error: 0,
          body: {
            date: todayData.date,
            total_income: todayData.total_income,
            total_expense: todayData.total_expense,
            net_profit: calculatedProfit
          },
          message: '获取成功'
        });
      } else {
        // 如果没有今日数据，返回0值
        resolve({
          error: 0,
          body: {
            date: currentDate,
            total_income: 0,
            total_expense: 0,
            net_profit: 0
          },
          message: '获取成功'
        });
      }
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