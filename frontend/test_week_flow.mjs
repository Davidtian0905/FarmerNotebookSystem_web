// 测试本周数据流程的完整性
// 验证前端与后端字段匹配以及API文档一致性

import pkg from './src/mock/database_assets.js'
const { getAssetOverview, generateChartData } = pkg
import dateUtilsPkg from './src/mock/utils/dateUtils.js'
const { getCurrentDateInfo } = dateUtilsPkg

console.log('=== 测试本周数据流程 ===')

// 1. 模拟前端点击"本周"时的参数构建
const simulateFrontendWeekParams = () => {
  console.log('\n1. 模拟前端构建参数:')
  
  const now = new Date()
  const currentDateInfo = {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    day: now.getDate(),
    dayOfWeek: now.getDay(),
    currentDate: now.toISOString().split('T')[0]
  }
  
  const params = {
    period: 'week',
    year: currentDateInfo.year,
    currentDayOfWeek: currentDateInfo.dayOfWeek,
    currentDate: currentDateInfo.currentDate
  }
  
  console.log('前端构建的参数:', JSON.stringify(params, null, 2))
  return params
}

// 2. 验证API文档要求
const validateApiDocRequirements = (params) => {
  console.log('\n2. 验证API文档要求:')
  
  // API文档要求的基本参数
  const requiredFields = ['period']
  const optionalFields = ['year', 'month']
  
  console.log('API文档要求的必填字段:', requiredFields)
  console.log('API文档要求的可选字段:', optionalFields)
  
  // 检查前端传递的额外字段
  const frontendExtraFields = Object.keys(params).filter(
    key => !requiredFields.includes(key) && !optionalFields.includes(key)
  )
  
  console.log('前端传递的额外字段:', frontendExtraFields)
  
  // API文档中本周的说明
  console.log('\nAPI文档中本周(week)的说明:')
  console.log('- 数据范围: 当前周的7天数据')
  console.log('- 标签格式: ["周一", "周二", ..., "周日"]')
  console.log('- 数据特点: 显示每日累计数据')
  
  return {
    hasRequiredFields: requiredFields.every(field => params.hasOwnProperty(field)),
    extraFields: frontendExtraFields
  }
}

// 3. 测试后端处理
const testBackendProcessing = async (params) => {
  console.log('\n3. 测试后端处理:')
  
  try {
    // 调用getAssetOverview
    const result = await getAssetOverview(params)
    console.log('getAssetOverview返回结果:')
    console.log('- error:', result.error)
    console.log('- body.summary:', result.body?.summary)
    console.log('- body.period:', result.body?.period)
    
    return result
  } catch (error) {
    console.error('后端处理出错:', error)
    return null
  }
}

// 4. 验证字段匹配
const validateFieldMatching = (frontendParams, backendResult) => {
  console.log('\n4. 验证字段匹配:')
  
  if (!backendResult || backendResult.error !== 0) {
    console.log('❌ 后端返回错误，无法验证字段匹配')
    return false
  }
  
  const body = backendResult.body
  
  // 检查期望的字段
  const expectedFields = {
    period: frontendParams.period,
    year: frontendParams.year
  }
  
  console.log('期望的字段匹配:')
  let allMatched = true
  
  Object.entries(expectedFields).forEach(([key, expectedValue]) => {
    const actualValue = body[key]
    const matched = actualValue === expectedValue
    console.log(`- ${key}: 期望=${expectedValue}, 实际=${actualValue}, 匹配=${matched ? '✅' : '❌'}`)
    if (!matched) allMatched = false
  })
  
  // 检查汇总数据字段
  const summaryFields = ['totalIncome', 'totalExpense', 'netAssets', 'transactionCount']
  console.log('\n汇总数据字段检查:')
  
  summaryFields.forEach(field => {
    const hasField = body.summary && body.summary.hasOwnProperty(field)
    const value = body.summary?.[field]
    console.log(`- ${field}: 存在=${hasField ? '✅' : '❌'}, 值=${value}`)
    if (!hasField) allMatched = false
  })
  
  return allMatched
}

// 5. 检查数据计算逻辑
const checkCalculationLogic = (backendResult) => {
  console.log('\n5. 检查数据计算逻辑:')
  
  if (!backendResult || backendResult.error !== 0) {
    console.log('❌ 无法检查计算逻辑')
    return false
  }
  
  const summary = backendResult.body?.summary
  if (!summary) {
    console.log('❌ 缺少汇总数据')
    return false
  }
  
  // 检查净资产计算
  const calculatedNetAssets = summary.totalIncome - summary.totalExpense
  const actualNetAssets = summary.netAssets
  const netAssetsCorrect = Math.abs(calculatedNetAssets - actualNetAssets) < 0.01
  
  console.log('净资产计算验证:')
  console.log(`- 总收入: ${summary.totalIncome}`)
  console.log(`- 总支出: ${summary.totalExpense}`)
  console.log(`- 计算的净资产: ${calculatedNetAssets}`)
  console.log(`- 实际净资产: ${actualNetAssets}`)
  console.log(`- 计算正确: ${netAssetsCorrect ? '✅' : '❌'}`)
  
  return netAssetsCorrect
}

// 6. 检查图表数据
const checkChartData = (backendResult) => {
  console.log('\n6. 检查图表数据:')
  
  if (!backendResult || backendResult.error !== 0) {
    console.log('❌ 无法检查图表数据')
    return false
  }
  
  const chartData = backendResult.body?.chartData
  if (!chartData) {
    console.log('❌ 缺少图表数据')
    return false
  }
  
  console.log('图表数据结构:')
  console.log(`- labels数量: ${chartData.labels?.length || 0}`)
  console.log(`- datasets数量: ${chartData.datasets?.length || 0}`)
  
  if (chartData.labels) {
    console.log(`- 标签内容: ${JSON.stringify(chartData.labels)}`)
    
    // 验证是否符合API文档中的周度标签格式
    const expectedWeekLabels = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    const labelsMatch = chartData.labels.every(label => expectedWeekLabels.includes(label))
    console.log(`- 标签格式符合API文档: ${labelsMatch ? '✅' : '❌'}`)
    
    return labelsMatch
  }
  
  return false
}

// 主测试函数
const runWeekFlowTest = async () => {
  console.log('开始测试本周数据流程...')
  
  // 1. 模拟前端参数
  const frontendParams = simulateFrontendWeekParams()
  
  // 2. 验证API文档要求
  const apiValidation = validateApiDocRequirements(frontendParams)
  
  // 3. 测试后端处理
  const backendResult = await testBackendProcessing(frontendParams)
  
  // 4. 验证字段匹配
  const fieldsMatched = validateFieldMatching(frontendParams, backendResult)
  
  // 5. 检查计算逻辑
  const calculationCorrect = checkCalculationLogic(backendResult)
  
  // 6. 检查图表数据
  const chartDataCorrect = checkChartData(backendResult)
  
  // 总结
  console.log('\n=== 测试总结 ===')
  console.log(`API文档要求验证: ${apiValidation.hasRequiredFields ? '✅' : '❌'}`)
  console.log(`字段匹配验证: ${fieldsMatched ? '✅' : '❌'}`)
  console.log(`计算逻辑验证: ${calculationCorrect ? '✅' : '❌'}`)
  console.log(`图表数据验证: ${chartDataCorrect ? '✅' : '❌'}`)
  
  const allPassed = apiValidation.hasRequiredFields && fieldsMatched && calculationCorrect && chartDataCorrect
  console.log(`\n整体测试结果: ${allPassed ? '✅ 通过' : '❌ 失败'}`)
  
  if (!allPassed) {
    console.log('\n问题分析:')
    if (!apiValidation.hasRequiredFields) {
      console.log('- 前端参数不符合API文档要求')
    }
    if (!fieldsMatched) {
      console.log('- 前后端字段不匹配')
    }
    if (!calculationCorrect) {
      console.log('- 数据计算逻辑有误')
    }
    if (!chartDataCorrect) {
      console.log('- 图表数据格式不符合API文档')
    }
  }
}

// 运行测试
runWeekFlowTest().catch(console.error)