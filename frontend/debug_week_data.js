// 调试本周数据问题
const fs = require('fs');
const path = require('path');

// 模拟getWeekNumber函数
const getWeekNumber = (date) => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
};

// 模拟交易数据
const transactions = [
  { date: '2025-08-19', type: 'OUTBOUND', amount: 1000, category: '乌龙茶' },
  { date: '2025-08-19', type: 'INBOUND', amount: 400, category: '铁观音' },
  { date: '2025-08-18', type: 'OUTBOUND', amount: 5000, category: '铁观音' },
  { date: '2025-08-18', type: 'INBOUND', amount: 1000, category: '铁观音' }
];

// 获取当前日期信息
const now = new Date();
const currentInfo = {
  year: now.getFullYear(),
  month: now.getMonth() + 1,
  day: now.getDate(),
  dayOfWeek: now.getDay(),
  currentDate: now.toISOString().split('T')[0]
};

console.log('=== 调试本周数据问题 ===');
console.log('当前日期信息:', currentInfo);

// 计算当前周数
const currentWeek = getWeekNumber(now);
console.log('当前周数:', currentWeek);

// 检查交易数据的周数
console.log('\n=== 交易数据周数分析 ===');
transactions.forEach(t => {
  const transactionDate = new Date(t.date);
  const transactionWeek = getWeekNumber(transactionDate);
  const transactionDayOfWeek = transactionDate.getDay();
  const adjustedDayOfWeek = transactionDayOfWeek === 0 ? 7 : transactionDayOfWeek;
  
  console.log(`${t.date}: 周数=${transactionWeek}, 星期=${adjustedDayOfWeek}, 年份=${transactionDate.getFullYear()}`);
});

// 模拟generateWeekChartData的过滤逻辑
console.log('\n=== 本周数据过滤测试 ===');
const year = currentInfo.year;
const weekLabels = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

for (let dayOfWeek = 1; dayOfWeek <= 7; dayOfWeek++) {
  const dayTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.date);
    const transactionDayOfWeek = transactionDate.getDay();
    const adjustedDayOfWeek = transactionDayOfWeek === 0 ? 7 : transactionDayOfWeek;
    const transactionWeek = getWeekNumber(transactionDate);
    
    const matches = transactionDate.getFullYear() === year && 
           transactionWeek === currentWeek && 
           adjustedDayOfWeek === dayOfWeek;
           
    return matches;
  });
  
  console.log(`${weekLabels[dayOfWeek - 1]}: 找到 ${dayTransactions.length} 笔交易`);
  if (dayTransactions.length > 0) {
    dayTransactions.forEach(t => {
      console.log(`  - ${t.date} ${t.type} ${t.amount}`);
    });
  }
}

console.log('\n=== 问题分析 ===');
console.log('如果所有天都显示0笔交易，说明过滤条件有问题');
console.log('检查点:');
console.log('1. 当前年份:', year);
console.log('2. 当前周数:', currentWeek);
console.log('3. 交易数据年份和周数是否匹配');