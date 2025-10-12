/**
 * 仪表板财务计算工具
 * 集中提供所有财务计算相关的函数，避免在多个文件中重复定义
 */

/**
 * 计算净利润
 * @param {number} income - 总收入
 * @param {number} expense - 总支出
 * @returns {number} 净利润
 */
export const calculateNetProfit = (income, expense) => {
  return income - expense;
};

/**
 * 计算增长率
 * @param {number} currentValue - 当前值
 * @param {number} previousValue - 前一个值
 * @returns {number} 增长率（百分比）
 */
export const calculateGrowthRate = (currentValue, previousValue) => {
  if (previousValue === 0) return 0;
  return parseFloat(((currentValue - previousValue) / Math.abs(previousValue) * 100).toFixed(1));
};

/**
 * 从交易记录中计算总收入
 * @param {Array} transactions - 交易记录数组
 * @returns {number} 总收入
 */
export const calculateTotalIncome = (transactions) => {
  return transactions
    .filter(t => t.type === 'OUTBOUND')
    .reduce((sum, t) => sum + (t.totalPrice || 0), 0);
};

/**
 * 从交易记录中计算总支出
 * @param {Array} transactions - 交易记录数组
 * @returns {number} 总支出
 */
export const calculateTotalExpense = (transactions) => {
  return transactions
    .filter(t => t.type === 'INBOUND')
    .reduce((sum, t) => sum + (t.totalPrice || 0), 0);
};

/**
 * 计算财务汇总数据
 * @param {Array} data - 按日期分组的财务数据
 * @returns {Object} 汇总数据
 */
export const calculateSummary = (data) => {
  const totalIncome = data.reduce((sum, item) => sum + item.total_income, 0);
  const totalExpense = data.reduce((sum, item) => sum + item.total_expense, 0);
  const netProfit = calculateNetProfit(totalIncome, totalExpense);
  
  return {
    total_income: totalIncome,
    total_expense: totalExpense,
    net_profit: netProfit,
    week_total_income: totalIncome,  // 兼容性字段
    week_total_expense: totalExpense, // 兼容性字段
    week_net_profit: netProfit, // 兼容性字段
    avg_daily_income: data.length > 0 ? Math.round(totalIncome / data.length) : 0,
    avg_daily_expense: data.length > 0 ? Math.round(totalExpense / data.length) : 0,
    avg_daily_profit: data.length > 0 ? Math.round(netProfit / data.length) : 0,
    transaction_count: data.reduce((sum, item) => sum + (item.transaction_count || 0), 0)
  };
};

/**
 * 计算财务增长率分析
 * @param {Array} data - 财务数据数组
 * @returns {Object} 增长率分析结果
 */
export const calculateGrowthAnalysis = (data) => {
  if (!data || data.length < 2) {
    return {
      income_growth_rate: 0,
      expense_growth_rate: 0,
      profit_growth_rate: 0
    };
  }

  // 获取最近两天的数据进行比较
  const sortedData = [...data].sort((a, b) => new Date(b.date) - new Date(a.date));
  const todayData = sortedData[0];
  const yesterdayData = sortedData[1];

  if (!yesterdayData) {
    return {
      income_growth_rate: 0,
      expense_growth_rate: 0,
      profit_growth_rate: 0
    };
  }

  const incomeGrowthRate = calculateGrowthRate(todayData.total_income, yesterdayData.total_income);
  const expenseGrowthRate = calculateGrowthRate(todayData.total_expense, yesterdayData.total_expense);
  
  const todayProfit = calculateNetProfit(todayData.total_income, todayData.total_expense);
  const yesterdayProfit = calculateNetProfit(yesterdayData.total_income, yesterdayData.total_expense);
  const profitGrowthRate = calculateGrowthRate(todayProfit, yesterdayProfit);

  return {
    income_growth_rate: incomeGrowthRate,
    expense_growth_rate: expenseGrowthRate,
    profit_growth_rate: profitGrowthRate
  };
};