# 认证字段表列表

## frontend\src\views\auth\Login.vue
- 用户名 = 字段 `form.username`
- 密码 = 字段 `form.password`
- 记住密码 = 字段 `form.remember`
- 加载状态 = 字段 `loading`
- 令牌存储 = 字段 `authStore.token`
- 用户信息存储 = 字段 `authStore.user`
- 记住的用户名 = 字段 `localStorage.remembered_username`
- Mock模式 = 字段 `localStorage.useMock`

————————————————————————————————————————————————
## frontend\src\views\auth\Register.vue
- 用户名 = 字段 `form.username`
- 邮箱 = 字段 `form.email`
- 密码 = 字段 `form.password`
- 确认密码 = 字段 `form.confirmPassword`
- 同意协议 = 字段 `form.agreeTerms`
- 加载状态 = 字段 `loading`
- 用户协议弹窗 = 字段 `showTermsPopup`
- 隐私政策弹窗 = 字段 `showPrivacyPopup`
- 令牌存储 = 字段 `authStore.token`
- 用户信息存储 = 字段 `authStore.user`

————————————————————————————————————————————————
## frontend\src\views\auth\ForgotPassword.vue
- 邮箱 = 字段 `form.email`
- 验证码 = 字段 `form.verifyCode`
- 新密码 = 字段 `form.newPassword`
- 确认密码 = 字段 `form.confirmPassword`
- 当前步骤 = 字段 `currentStep`
- 加载状态 = 字段 `loading`
- 验证码倒计时 = 字段 `countdown`

————————————————————————————————————————————————
## frontend\src\stores\auth.js
- 令牌 = 字段 `token`
- 用户信息 = 字段 `user`
- 加载状态 = 字段 `loading`
- 是否已登录 = 字段 `isLoggedIn`
- 用户信息计算属性 = 字段 `userInfo`

————————————————————————————————————————————————
## frontend\src\api\auth.js（接口字段）
- 登录请求-用户名 = 字段 `username`
- 登录请求-密码 = 字段 `password`
- 登录请求-记住我 = 字段 `rememberMe`
- 登录响应-令牌 = 字段 `token`
- 登录响应-用户ID = 字段 `userInfo.id`
- 登录响应-用户名 = 字段 `userInfo.username`
- 登录响应-邮箱 = 字段 `userInfo.email`
- 登录响应-昵称 = 字段 `userInfo.nickname`
- 登录响应-角色 = 字段 `userInfo.role`
- 注册请求-用户名 = 字段 `username`
- 注册请求-邮箱 = 字段 `email`
- 注册请求-密码 = 字段 `password`
- 注册请求-确认密码 = 字段 `confirmPassword`
- 注册请求-昵称 = 字段 `nickname`
- 注册请求-同意条款 = 字段 `agreeTerms`
- 注册响应-用户ID = 字段 `userId`
- 注册响应-用户名 = 字段 `username`
- 注册响应-邮箱 = 字段 `email`
- 注册响应-昵称 = 字段 `nickname`
- 发送验证码请求-邮箱 = 字段 `email`
- 发送验证码响应-邮箱 = 字段 `email`
- 发送验证码响应-有效期秒数 = 字段 `expireTime`
- 验证验证码请求-邮箱 = 字段 `email`
- 验证验证码请求-验证码 = 字段 `code`
- 验证验证码响应-邮箱 = 字段 `email`
- 验证验证码响应-验证状态 = 字段 `verified`
- 验证验证码响应-重置令牌 = 字段 `resetToken`
- 重置密码请求-邮箱 = 字段 `email`
- 重置密码请求-重置令牌 = 字段 `resetToken`
- 重置密码请求-新密码 = 字段 `newPassword`
- 重置密码请求-确认密码 = 字段 `confirmPassword`
- 重置密码响应-邮箱 = 字段 `email`
- 重置密码响应-更新时间 = 字段 `updatedAt`
- 获取用户信息响应-用户ID = 字段 `id`
- 获取用户信息响应-用户名 = 字段 `username`
- 获取用户信息响应-邮箱 = 字段 `email`
- 获取用户信息响应-昵称 = 字段 `nickname`
- 获取用户信息响应-角色 = 字段 `role`
- 刷新令牌响应-令牌 = 字段 `token`
- 刷新令牌响应-有效期秒数 = 字段 `expiresIn`
- 登出响应-消息 = 字段 `message`

————————————————————————————————————————————————
## frontend\src\mock\auth.js（Mock字段）
- 模拟用户ID = 字段 `mockUsers[].id`
- 模拟用户名 = 字段 `mockUsers[].username`
- 模拟邮箱 = 字段 `mockUsers[].email`
- 模拟昵称 = 字段 `mockUsers[].nickname`
- 模拟头像 = 字段 `mockUsers[].avatar`
- 模拟角色 = 字段 `mockUsers[].role`
- 模拟状态 = 字段 `mockUsers[].status`
- 模拟创建时间 = 字段 `mockUsers[].createdAt`
- 模拟最后登录时间 = 字段 `mockUsers[].lastLoginAt`
- 模拟验证码 = 字段 `mockVerificationCodes[email].code`
- 模拟验证码有效期 = 字段 `mockVerificationCodes[email].expireTime`

————————————————————————————————————————————————
## 本地存储（前端）
- 本地存储令牌 = 字段 `localStorage.token`
- 本地存储用户信息 = 字段 `localStorage.user`
- 本地存储记住的用户名 = 字段 `localStorage.remembered_username`
- 本地存储Mock模式 = 字段 `localStorage.useMock`

————————————————————————————————————————————————
## 字段改进建议
- ✅ 建议统一注册API与前端表单字段，增加传递`confirmPassword`、`nickname`、`agreeTerms`。
- ✅ 建议统一用户信息命名，前端使用`user`而API返回`userInfo`，建议统一。
- ✅ 建议忘记密码流程在重置时携带并校验`resetToken`，前端完善接入。
- ✅ 建议在认证Store中增加`error`字段，统一错误状态管理与展示。
- 建议用户信息接口补充`avatar`与`status`字段，满足UI展示需求。
- 建议刷新令牌接口增加`issuedAt`或`refreshAt`，便于提示过期时间。
- 建议在请求层统一注入`auth`头并校验，确保接口安全性。
- 建议表单字段增加去空格与格式校验（如用户名规则、邮箱长度）。
- ✅ 建议API层兼容`remember`与`rememberMe`字段命名差异，减少前端适配。