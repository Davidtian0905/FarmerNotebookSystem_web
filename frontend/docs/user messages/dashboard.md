client:495 [vite] connecting...
client:618 [vite] connected.
index.js:35 === 初始化Mock系统 ===
index.js:156 路由跳转: {from: '/', to: '/dashboard', toName: 'Dashboard'}
index.js:161 检查需要认证的页面: /dashboard token存在: true
index.js:182 正常跳转到: /dashboard
database_flow.js:552 交易数据已存在，跳过初始化
database_flow.js:1730 === 交易数据调试信息 ===
database_flow.js:1731 交易记录总数: 6
database_flow.js:1732 当前时间信息: {year: 2025, month: 8, day: 19, dayOfWeek: 2}
database_flow.js:1759 本年交易记录数: 4
database_flow.js:1760 本月交易记录数: 4
database_flow.js:1761 本周交易记录数: 0
database_flow.js:1767 入库记录数: 3
database_flow.js:1768 出库记录数: 3
database_flow.js:1769 总入库金额: 3500
database_flow.js:1770 总出库金额: 9000
database_flow.js:1776 本年入库金额: 3000
database_flow.js:1777 本年出库金额: 6000
database_flow.js:1780 最近的交易记录:
database_flow.js:1782   2025-08-18 14:30:00 OUTBOUND 铁观音 ¥5000
database_flow.js:1782   2025-08-18 09:30:00 INBOUND 铁观音 ¥1000
database_flow.js:1782   2025-08-12 09:30:00 INBOUND 铁观音 ¥2000
database_flow.js:1782   2024-08-11 09:30:00 INBOUND 铁观音 ¥500
database_flow.js:1782   2023-08-10 14:30:00 OUTBOUND 八仙茶 ¥3000
database_flow.js:1730 === 交易数据调试信息 ===
database_flow.js:1731 交易记录总数: 6
database_flow.js:1732 当前时间信息: {year: 2025, month: 8, day: 19, dayOfWeek: 2}
database_flow.js:1759 本年交易记录数: 4
database_flow.js:1760 本月交易记录数: 4
database_flow.js:1761 本周交易记录数: 0
database_flow.js:1767 入库记录数: 3
database_flow.js:1768 出库记录数: 3
database_flow.js:1769 总入库金额: 3500
database_flow.js:1770 总出库金额: 9000
database_flow.js:1776 本年入库金额: 3000
database_flow.js:1777 本年出库金额: 6000
database_flow.js:1780 最近的交易记录:
database_flow.js:1782   2025-08-18 14:30:00 OUTBOUND 铁观音 ¥5000
database_flow.js:1782   2025-08-18 09:30:00 INBOUND 铁观音 ¥1000
database_flow.js:1782   2025-08-12 09:30:00 INBOUND 铁观音 ¥2000
database_flow.js:1782   2024-08-11 09:30:00 INBOUND 铁观音 ¥500
database_flow.js:1782   2023-08-10 14:30:00 OUTBOUND 八仙茶 ¥3000
logger.js:139 [2025-08-19T08:56:21.057Z] [DEBUG] [DB_ASSETS] === total 模式调试信息 ===
logger.js:139 [2025-08-19T08:56:21.057Z] [DEBUG] [DB_ASSETS] 年份范围: {minYear: 2023, maxYear: 2025}
logger.js:139 [2025-08-19T08:56:21.057Z] [DEBUG] [DB_ASSETS] 年份标签: (3) ['2023年', '2024年', '2025年']
logger.js:139 [2025-08-19T08:56:21.057Z] [DEBUG] [DB_ASSETS] 年度数据: (3) [{…}, {…}, {…}]
logger.js:134 [2025-08-19T08:56:21.057Z] [INFO] [DB_ASSETS] === 资产数据调试信息 ===
logger.js:139 [2025-08-19T08:56:21.057Z] [DEBUG] [DB_ASSETS] 调试信息详情: {totalTransactions: 6, currentInfo: {…}, currentYearTransactions: 4, currentMonthTransactions: 4, inboundCount: 3, …}
event_system.js:407 === 事件系统调试信息 ===
event_system.js:408 事件系统统计: {cache: {…}, eventTypes: {…}}
event_system.js:409 缓存内容: (3) [Array(2), Array(2), Array(2)]
event_system.js:410 监听器: (5) [Array(2), Array(2), Array(2), Array(2), Array(2)]
index.js:46 Mock系统初始化完成
index.js:196 页面访问: /dashboard
logger.js:139 [2025-08-19T08:56:21.158Z] [DEBUG] [UTILS] Mock模式检查: {environment: 'development', mockSetting: 'true', result: true}
logger.js:139 [2025-08-19T08:56:21.158Z] [DEBUG] [UTILS] Mock模式检查: {environment: 'development', mockSetting: 'true', result: true}
apiResponse.js:170 API响应处理: {error: 0, body: {…}, message: '获取成功'}
apiResponse.js:172 createApiPromise 处理响应: {error: 0, body: {…}, message: '获取成功'}
apiResponse.js:175 createApiPromise 处理响应: {error: 0, body: {…}, message: '获取成功'}
apiResponse.js:201 处理直接Mock响应格式
apiResponse.js:14 ApiResponseHandler.handle 输入: {data: {…}}
apiResponse.js:135 [API Response] 2025-08-19T08:56:21.559Z {url: undefined, method: undefined, error: 0, message: '获取成功', hasData: true}
apiResponse.js:25 API响应成功: {body: {…}, message: '获取成功'}
apiResponse.js:170 API响应处理: {error: 0, body: {…}, message: '获取成功'}
apiResponse.js:172 createApiPromise 处理响应: {error: 0, body: {…}, message: '获取成功'}
apiResponse.js:175 createApiPromise 处理响应: {error: 0, body: {…}, message: '获取成功'}
apiResponse.js:201 处理直接Mock响应格式
apiResponse.js:14 ApiResponseHandler.handle 输入: {data: {…}}
apiResponse.js:135 [API Response] 2025-08-19T08:56:21.759Z {url: undefined, method: undefined, error: 0, message: '获取成功', hasData: true}
apiResponse.js:25 API响应成功: {body: {…}, message: '获取成功'}
dashboard.js:184 [Vue warn]: Invalid prop: type check failed for prop "trend". Expected Number with value -80, got String with value "-80.0". 
  at <StatCard title="今日收入" subtitle="收入较昨日增长" value=1000  ... > 
  at <Layout> 
  at <Dashboard onVnodeUnmounted=fn<onVnodeUnmounted> ref=Ref< Proxy(Object) {__v_skip: true} > > 
  at <RouterView> 
  at <App>
warn$1 @ chunk-4WYJJD3S.js?v=40ec3d68:2142
validateProp @ chunk-4WYJJD3S.js?v=40ec3d68:6522
validateProps @ chunk-4WYJJD3S.js?v=40ec3d68:6494
initProps @ chunk-4WYJJD3S.js?v=40ec3d68:6183
setupComponent @ chunk-4WYJJD3S.js?v=40ec3d68:10033
mountComponent @ chunk-4WYJJD3S.js?v=40ec3d68:7358
processComponent @ chunk-4WYJJD3S.js?v=40ec3d68:7324
patch @ chunk-4WYJJD3S.js?v=40ec3d68:6838
mountChildren @ chunk-4WYJJD3S.js?v=40ec3d68:7072
mountElement @ chunk-4WYJJD3S.js?v=40ec3d68:6995
processElement @ chunk-4WYJJD3S.js?v=40ec3d68:6960
patch @ chunk-4WYJJD3S.js?v=40ec3d68:6826
mountChildren @ chunk-4WYJJD3S.js?v=40ec3d68:7072
mountElement @ chunk-4WYJJD3S.js?v=40ec3d68:6995
processElement @ chunk-4WYJJD3S.js?v=40ec3d68:6960
patch @ chunk-4WYJJD3S.js?v=40ec3d68:6826
mountChildren @ chunk-4WYJJD3S.js?v=40ec3d68:7072
processFragment @ chunk-4WYJJD3S.js?v=40ec3d68:7254
patch @ chunk-4WYJJD3S.js?v=40ec3d68:6812
patchBlockChildren @ chunk-4WYJJD3S.js?v=40ec3d68:7194
processFragment @ chunk-4WYJJD3S.js?v=40ec3d68:7272
patch @ chunk-4WYJJD3S.js?v=40ec3d68:6812
patchBlockChildren @ chunk-4WYJJD3S.js?v=40ec3d68:7194
patchElement @ chunk-4WYJJD3S.js?v=40ec3d68:7112
processElement @ chunk-4WYJJD3S.js?v=40ec3d68:6971
patch @ chunk-4WYJJD3S.js?v=40ec3d68:6826
componentUpdateFn @ chunk-4WYJJD3S.js?v=40ec3d68:7550
run @ chunk-4WYJJD3S.js?v=40ec3d68:505
runIfDirty @ chunk-4WYJJD3S.js?v=40ec3d68:543
callWithErrorHandling @ chunk-4WYJJD3S.js?v=40ec3d68:2289
flushJobs @ chunk-4WYJJD3S.js?v=40ec3d68:2497
Promise.then
queueFlush @ chunk-4WYJJD3S.js?v=40ec3d68:2411
queueJob @ chunk-4WYJJD3S.js?v=40ec3d68:2406
effect2.scheduler @ chunk-4WYJJD3S.js?v=40ec3d68:7592
trigger @ chunk-4WYJJD3S.js?v=40ec3d68:533
endBatch @ chunk-4WYJJD3S.js?v=40ec3d68:591
notify @ chunk-4WYJJD3S.js?v=40ec3d68:853
trigger @ chunk-4WYJJD3S.js?v=40ec3d68:827
set value @ chunk-4WYJJD3S.js?v=40ec3d68:1699
fetchAllData @ dashboard.js:184
await in fetchAllData
wrappedAction @ pinia.js?v=40ec3d68:1107
store.<computed> @ pinia.js?v=40ec3d68:785
refreshData @ Dashboard.vue:201
(anonymous) @ Dashboard.vue:233
(anonymous) @ chunk-4WYJJD3S.js?v=40ec3d68:4948
callWithErrorHandling @ chunk-4WYJJD3S.js?v=40ec3d68:2289
callWithAsyncErrorHandling @ chunk-4WYJJD3S.js?v=40ec3d68:2296
hook.__weh.hook.__weh @ chunk-4WYJJD3S.js?v=40ec3d68:4928
flushPostFlushCbs @ chunk-4WYJJD3S.js?v=40ec3d68:2474
flushJobs @ chunk-4WYJJD3S.js?v=40ec3d68:2516
Promise.then
queueFlush @ chunk-4WYJJD3S.js?v=40ec3d68:2411
queuePostFlushCb @ chunk-4WYJJD3S.js?v=40ec3d68:2425
queueEffectWithSuspense @ chunk-4WYJJD3S.js?v=40ec3d68:9489
baseWatchOptions.scheduler @ chunk-4WYJJD3S.js?v=40ec3d68:8369
effect2.scheduler @ chunk-4WYJJD3S.js?v=40ec3d68:2035
trigger @ chunk-4WYJJD3S.js?v=40ec3d68:533
endBatch @ chunk-4WYJJD3S.js?v=40ec3d68:591
notify @ chunk-4WYJJD3S.js?v=40ec3d68:853
trigger @ chunk-4WYJJD3S.js?v=40ec3d68:827
set value @ chunk-4WYJJD3S.js?v=40ec3d68:1699
finalizeNavigation @ vue-router.js?v=40ec3d68:2522
(anonymous) @ vue-router.js?v=40ec3d68:2432
Promise.then
pushWithRedirect @ vue-router.js?v=40ec3d68:2400
push @ vue-router.js?v=40ec3d68:2326
install @ vue-router.js?v=40ec3d68:2681
use @ chunk-4WYJJD3S.js?v=40ec3d68:5990
(anonymous) @ main.js:17
dashboard.js:184 [Vue warn]: Invalid prop: type check failed for prop "trend". Expected Number with value -100, got String with value "-100.0". 
  at <StatCard title="今日支出" value=0 icon="fas fa-credit-card"  ... > 
  at <Layout> 
  at <Dashboard onVnodeUnmounted=fn<onVnodeUnmounted> ref=Ref< Proxy(Object) {__v_skip: true} > > 
  at <RouterView> 
  at <App>
warn$1 @ chunk-4WYJJD3S.js?v=40ec3d68:2142
validateProp @ chunk-4WYJJD3S.js?v=40ec3d68:6522
validateProps @ chunk-4WYJJD3S.js?v=40ec3d68:6494
initProps @ chunk-4WYJJD3S.js?v=40ec3d68:6183
setupComponent @ chunk-4WYJJD3S.js?v=40ec3d68:10033
mountComponent @ chunk-4WYJJD3S.js?v=40ec3d68:7358
processComponent @ chunk-4WYJJD3S.js?v=40ec3d68:7324
patch @ chunk-4WYJJD3S.js?v=40ec3d68:6838
mountChildren @ chunk-4WYJJD3S.js?v=40ec3d68:7072
mountElement @ chunk-4WYJJD3S.js?v=40ec3d68:6995
processElement @ chunk-4WYJJD3S.js?v=40ec3d68:6960
patch @ chunk-4WYJJD3S.js?v=40ec3d68:6826
mountChildren @ chunk-4WYJJD3S.js?v=40ec3d68:7072
mountElement @ chunk-4WYJJD3S.js?v=40ec3d68:6995
processElement @ chunk-4WYJJD3S.js?v=40ec3d68:6960
patch @ chunk-4WYJJD3S.js?v=40ec3d68:6826
mountChildren @ chunk-4WYJJD3S.js?v=40ec3d68:7072
processFragment @ chunk-4WYJJD3S.js?v=40ec3d68:7254
patch @ chunk-4WYJJD3S.js?v=40ec3d68:6812
patchBlockChildren @ chunk-4WYJJD3S.js?v=40ec3d68:7194
processFragment @ chunk-4WYJJD3S.js?v=40ec3d68:7272
patch @ chunk-4WYJJD3S.js?v=40ec3d68:6812
patchBlockChildren @ chunk-4WYJJD3S.js?v=40ec3d68:7194
patchElement @ chunk-4WYJJD3S.js?v=40ec3d68:7112
processElement @ chunk-4WYJJD3S.js?v=40ec3d68:6971
patch @ chunk-4WYJJD3S.js?v=40ec3d68:6826
componentUpdateFn @ chunk-4WYJJD3S.js?v=40ec3d68:7550
run @ chunk-4WYJJD3S.js?v=40ec3d68:505
runIfDirty @ chunk-4WYJJD3S.js?v=40ec3d68:543
callWithErrorHandling @ chunk-4WYJJD3S.js?v=40ec3d68:2289
flushJobs @ chunk-4WYJJD3S.js?v=40ec3d68:2497
Promise.then
queueFlush @ chunk-4WYJJD3S.js?v=40ec3d68:2411
queueJob @ chunk-4WYJJD3S.js?v=40ec3d68:2406
effect2.scheduler @ chunk-4WYJJD3S.js?v=40ec3d68:7592
trigger @ chunk-4WYJJD3S.js?v=40ec3d68:533
endBatch @ chunk-4WYJJD3S.js?v=40ec3d68:591
notify @ chunk-4WYJJD3S.js?v=40ec3d68:853
trigger @ chunk-4WYJJD3S.js?v=40ec3d68:827
set value @ chunk-4WYJJD3S.js?v=40ec3d68:1699
fetchAllData @ dashboard.js:184
await in fetchAllData
wrappedAction @ pinia.js?v=40ec3d68:1107
store.<computed> @ pinia.js?v=40ec3d68:785
refreshData @ Dashboard.vue:201
(anonymous) @ Dashboard.vue:233
(anonymous) @ chunk-4WYJJD3S.js?v=40ec3d68:4948
callWithErrorHandling @ chunk-4WYJJD3S.js?v=40ec3d68:2289
callWithAsyncErrorHandling @ chunk-4WYJJD3S.js?v=40ec3d68:2296
hook.__weh.hook.__weh @ chunk-4WYJJD3S.js?v=40ec3d68:4928
flushPostFlushCbs @ chunk-4WYJJD3S.js?v=40ec3d68:2474
flushJobs @ chunk-4WYJJD3S.js?v=40ec3d68:2516
Promise.then
queueFlush @ chunk-4WYJJD3S.js?v=40ec3d68:2411
queuePostFlushCb @ chunk-4WYJJD3S.js?v=40ec3d68:2425
queueEffectWithSuspense @ chunk-4WYJJD3S.js?v=40ec3d68:9489
baseWatchOptions.scheduler @ chunk-4WYJJD3S.js?v=40ec3d68:8369
effect2.scheduler @ chunk-4WYJJD3S.js?v=40ec3d68:2035
trigger @ chunk-4WYJJD3S.js?v=40ec3d68:533
endBatch @ chunk-4WYJJD3S.js?v=40ec3d68:591
notify @ chunk-4WYJJD3S.js?v=40ec3d68:853
trigger @ chunk-4WYJJD3S.js?v=40ec3d68:827
set value @ chunk-4WYJJD3S.js?v=40ec3d68:1699
finalizeNavigation @ vue-router.js?v=40ec3d68:2522
(anonymous) @ vue-router.js?v=40ec3d68:2432
Promise.then
pushWithRedirect @ vue-router.js?v=40ec3d68:2400
push @ vue-router.js?v=40ec3d68:2326
install @ vue-router.js?v=40ec3d68:2681
use @ chunk-4WYJJD3S.js?v=40ec3d68:5990
(anonymous) @ main.js:17
dashboard.js:184 [Vue warn]: Invalid prop: type check failed for prop "trend". Expected Number with value -75, got String with value "-75.0". 
  at <StatCard title="今日利润" subtitle="较昨日" value=1000  ... > 
  at <Layout> 
  at <Dashboard onVnodeUnmounted=fn<onVnodeUnmounted> ref=Ref< Proxy(Object) {__v_skip: true} > > 
  at <RouterView> 
  at <App>
warn$1 @ chunk-4WYJJD3S.js?v=40ec3d68:2142
validateProp @ chunk-4WYJJD3S.js?v=40ec3d68:6522
validateProps @ chunk-4WYJJD3S.js?v=40ec3d68:6494
initProps @ chunk-4WYJJD3S.js?v=40ec3d68:6183
setupComponent @ chunk-4WYJJD3S.js?v=40ec3d68:10033
mountComponent @ chunk-4WYJJD3S.js?v=40ec3d68:7358
processComponent @ chunk-4WYJJD3S.js?v=40ec3d68:7324
patch @ chunk-4WYJJD3S.js?v=40ec3d68:6838
mountChildren @ chunk-4WYJJD3S.js?v=40ec3d68:7072
mountElement @ chunk-4WYJJD3S.js?v=40ec3d68:6995
processElement @ chunk-4WYJJD3S.js?v=40ec3d68:6960
patch @ chunk-4WYJJD3S.js?v=40ec3d68:6826
mountChildren @ chunk-4WYJJD3S.js?v=40ec3d68:7072
mountElement @ chunk-4WYJJD3S.js?v=40ec3d68:6995
processElement @ chunk-4WYJJD3S.js?v=40ec3d68:6960
patch @ chunk-4WYJJD3S.js?v=40ec3d68:6826
mountChildren @ chunk-4WYJJD3S.js?v=40ec3d68:7072
processFragment @ chunk-4WYJJD3S.js?v=40ec3d68:7254
patch @ chunk-4WYJJD3S.js?v=40ec3d68:6812
patchBlockChildren @ chunk-4WYJJD3S.js?v=40ec3d68:7194
processFragment @ chunk-4WYJJD3S.js?v=40ec3d68:7272
patch @ chunk-4WYJJD3S.js?v=40ec3d68:6812
patchBlockChildren @ chunk-4WYJJD3S.js?v=40ec3d68:7194
patchElement @ chunk-4WYJJD3S.js?v=40ec3d68:7112
processElement @ chunk-4WYJJD3S.js?v=40ec3d68:6971
patch @ chunk-4WYJJD3S.js?v=40ec3d68:6826
componentUpdateFn @ chunk-4WYJJD3S.js?v=40ec3d68:7550
run @ chunk-4WYJJD3S.js?v=40ec3d68:505
runIfDirty @ chunk-4WYJJD3S.js?v=40ec3d68:543
callWithErrorHandling @ chunk-4WYJJD3S.js?v=40ec3d68:2289
flushJobs @ chunk-4WYJJD3S.js?v=40ec3d68:2497
Promise.then
queueFlush @ chunk-4WYJJD3S.js?v=40ec3d68:2411
queueJob @ chunk-4WYJJD3S.js?v=40ec3d68:2406
effect2.scheduler @ chunk-4WYJJD3S.js?v=40ec3d68:7592
trigger @ chunk-4WYJJD3S.js?v=40ec3d68:533
endBatch @ chunk-4WYJJD3S.js?v=40ec3d68:591
notify @ chunk-4WYJJD3S.js?v=40ec3d68:853
trigger @ chunk-4WYJJD3S.js?v=40ec3d68:827
set value @ chunk-4WYJJD3S.js?v=40ec3d68:1699
fetchAllData @ dashboard.js:184
await in fetchAllData
wrappedAction @ pinia.js?v=40ec3d68:1107
store.<computed> @ pinia.js?v=40ec3d68:785
refreshData @ Dashboard.vue:201
(anonymous) @ Dashboard.vue:233
(anonymous) @ chunk-4WYJJD3S.js?v=40ec3d68:4948
callWithErrorHandling @ chunk-4WYJJD3S.js?v=40ec3d68:2289
callWithAsyncErrorHandling @ chunk-4WYJJD3S.js?v=40ec3d68:2296
hook.__weh.hook.__weh @ chunk-4WYJJD3S.js?v=40ec3d68:4928
flushPostFlushCbs @ chunk-4WYJJD3S.js?v=40ec3d68:2474
flushJobs @ chunk-4WYJJD3S.js?v=40ec3d68:2516
Promise.then
queueFlush @ chunk-4WYJJD3S.js?v=40ec3d68:2411
queuePostFlushCb @ chunk-4WYJJD3S.js?v=40ec3d68:2425
queueEffectWithSuspense @ chunk-4WYJJD3S.js?v=40ec3d68:9489
baseWatchOptions.scheduler @ chunk-4WYJJD3S.js?v=40ec3d68:8369
effect2.scheduler @ chunk-4WYJJD3S.js?v=40ec3d68:2035
trigger @ chunk-4WYJJD3S.js?v=40ec3d68:533
endBatch @ chunk-4WYJJD3S.js?v=40ec3d68:591
notify @ chunk-4WYJJD3S.js?v=40ec3d68:853
trigger @ chunk-4WYJJD3S.js?v=40ec3d68:827
set value @ chunk-4WYJJD3S.js?v=40ec3d68:1699
finalizeNavigation @ vue-router.js?v=40ec3d68:2522
(anonymous) @ vue-router.js?v=40ec3d68:2432
Promise.then
pushWithRedirect @ vue-router.js?v=40ec3d68:2400
push @ vue-router.js?v=40ec3d68:2326
install @ vue-router.js?v=40ec3d68:2681
use @ chunk-4WYJJD3S.js?v=40ec3d68:5990
(anonymous) @ main.js:17
