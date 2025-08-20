// 在浏览器控制台中运行此脚本来测试本周数据流程
// 复制粘贴到开发者工具控制台中执行

console.log('=== 测试本周数据流程 ===');

// 1. 模拟前端点击"本周"时的参数构建
const currentDateInfo = {
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1,
  day: new Date().getDate(),
  dayOfWeek: new Date().getDay(), // 0=周日, 1=周一, ..., 6=周六
  timestamp: Date.now()
};

const weekParams = {
  period: 'week',
  year: currentDateInfo.year,
  currentDayOfWeek: currentDateInfo.dayOfWeek,
  currentDate: new Date().toISOString().split('T')[0]
};

console.log('1. 前端构建的参数:', weekParams);

// 2. 验证API文档要求
console.log('\n2. API文档验证:');
console.log('- period 值:', weekParams.period, '(应为 "week")');
console.log('- year 参数:', weekParams.year, '(必需)');
console.log('- 额外参数:', {
  currentDayOfWeek: weekParams.currentDayOfWeek,
  currentDate: weekParams.currentDate
});

// 3. 检查前端组件状态
if (typeof window !== 'undefined' && window.Vue) {
  console.log('\n3. 检查Vue组件状态:');
  
  // 尝试获取Vue应用实例
  const app = document.querySelector('#app').__vue_app__;
  if (app) {
    console.log('- Vue应用已找到');
    
    // 检查store状态
    const stores = app.config.globalProperties.$pinia._s;
    if (stores) {
      console.log('- Pinia stores:', Object.keys(stores));
      
      // 查找assets store
      const assetsStore = Object.values(stores).find(store => 
        store.$id === 'assets' || store.assetOverview
      );
      
      if (assetsStore) {
        console.log('- Assets Store 找到');
        console.log('- 当前 assetOverview:', assetsStore.assetOverview);
      } else {
        console.log('- Assets Store 未找到');
      }
    }
  }
} else {
  console.log('\n3. Vue环境未检测到，跳过组件状态检查');
}

// 4. 模拟点击本周按钮
console.log('\n4. 模拟点击本周按钮:');
const weekButton = document.querySelector('[data-testid="week-tab"], .tab-item:contains("本周")');
if (weekButton) {
  console.log('- 找到本周按钮:', weekButton);
  console.log('- 点击事件监听器:', getEventListeners(weekButton));
} else {
  console.log('- 本周按钮未找到，尝试其他选择器');
  const allButtons = document.querySelectorAll('button, .tab-item, [class*="tab"]');
  const weekButtons = Array.from(allButtons).filter(btn => 
    btn.textContent && btn.textContent.includes('本周')
  );
  console.log('- 包含"本周"的元素:', weekButtons);
}

// 5. 检查网络请求
console.log('\n5. 监听网络请求:');
const originalFetch = window.fetch;
window.fetch = function(...args) {
  console.log('- Fetch 请求:', args[0], args[1]);
  return originalFetch.apply(this, args).then(response => {
    console.log('- Fetch 响应:', response.status, response.url);
    return response;
  });
};

console.log('\n=== 测试完成，请手动点击"本周"按钮观察数据变化 ===');
console.log('提示: 打开Network面板查看API请求详情');