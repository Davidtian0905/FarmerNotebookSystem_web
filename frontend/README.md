# Farmer Notebook System

农民笔记本系统 - Vue3前端项目

## 项目结构

```
FarmerNotebookSystem/
├── public/                 # 静态资源
├── src/                    # 源代码
│   ├── api/               # API接口
│   │   ├── request.js     # 请求封装
│   │   ├── auth.js        # 认证相关API
│   │   ├── mock.js        # Mock数据服务
│   │   ├── user.js        # 用户相关API
│   │   ├── notebook.js    # 笔记本相关API
│   │   ├── dashboard.js   # 仪表板相关API
│   │   ├── assets.js      # 资产相关API
│   │   └── records.js     # 记录相关API
│   ├── assets/            # 静态资源
│   │   ├── images/        # 图片资源
│   │   ├── icons/         # 图标资源
│   │   └── fonts/         # 字体文件
│   ├── components/        # 组件
│   │   ├── common/        # 通用组件
│   │   │   ├── MockModeToggle.vue # Mock模式切换
│   │   │   └── TestAccounts.vue # 测试账号信息
│   │   ├── business/      # 业务组件
│   │   ├── layout/        # 布局组件
│   │   │   ├── Header.vue # 头部组件
│   │   │   ├── Layout.vue # 布局组件
│   │   │   └── Sidebar.vue # 侧边栏组件
│   │   └── dashboard/     # 仪表板组件
│   │       ├── StatCard.vue # 统计卡片组件
│   │       ├── QuickAction.vue # 快速操作组件
│   │       └── ChartWidget.vue # 图表组件
│   ├── hooks/             # 组合式函数
│   │   ├── useAuth.js     # 认证相关
│   │   ├── useNotebook.js # 笔记本相关
│   │   └── useUser.js     # 用户相关
│   ├── router/            # 路由配置
│   │   └── index.js       # 路由定义
│   ├── stores/            # 状态管理
│   │   ├── auth.js        # 认证状态
│   │   ├── user.js        # 用户状态
│   │   ├── dashboard.js   # 仪表板状态
│   │   ├── assets.js      # 资产状态
│   │   └── records.js     # 记录状态
│   ├── styles/            # 样式文件
│   │   ├── index.scss     # 全局样式
│   │   ├── variables.scss # 样式变量
│   │   ├── mixins.scss    # 样式混入
│   │   └── components.scss # 组件样式
│   ├── utils/             # 工具函数
│   │   ├── request.js     # HTTP请求封装（集成Mock服务器）
│   │   ├── apiResponse.js # API响应处理
│   │   ├── storage.js     # 本地存储工具
│   │   ├── validate.js    # 验证工具
│   │   └── format.js      # 格式化工具
│   ├── views/             # 页面组件
│   │   ├── auth/          # 认证页面
│   │   │   ├── Login.vue  # 登录页
│   │   │   ├── Register.vue # 注册页
│   │   │   └── ForgotPassword.vue # 忘记密码页
│   │   ├── Home.vue       # 首页
│   │   ├── Dashboard.vue  # 仪表板
│   │   ├── AssetsOverview.vue # 资产总览（支持时间筛选：本年/本月/本周/总统计）
│   │   ├── Records.vue    # 记录管理
│   │   ├── Inventory.vue  # 库存管理
│   │   ├── Customers.vue  # 客户管理
│   │   ├── Suppliers.vue  # 供应商管理
│   │   ├── Data.vue       # 数据管理
│   │   ├── Vip.vue        # VIP功能
│   │   ├── TestMock.vue   # Mock功能测试
│   │   ├── AssetsTestMock.vue # 资产总览Mock测试
│   │   └── NotFound.vue   # 404页面
│   ├── mock/              # Mock数据
│   │   ├── index.js       # Mock数据统一导出
│   │   ├── server.js      # Mock服务器（处理API请求）
│   │   ├── auth.js        # 认证Mock数据
│   │   ├── dashboard.js   # 仪表板Mock数据
│   │   ├── database.js    # 数据库Mock数据
│   │   ├── database_assets.js # 资产Mock数据
│   │   ├── user.js        # 用户Mock数据
│   │   └── utils.js       # Mock工具函数
│   ├── App.vue            # 根组件
│   └── main.js            # 入口文件
├── docs/                  # 文档
│   ├── api/               # API文档
│   │   ├── README.md      # API文档索引
│   │   ├── auth-api.md    # 认证API文档
│   │   ├── dashboard-api.md # 仪表板API文档
│   │   └── assets-api.md  # 资产总览API文档
│   ├── mock-api.md        # Mock API使用说明
│   └── mock-usage.md      # Mock数据使用说明
├── index.html              # HTML模板
├── package.json            # 项目配置
├── vite.config.js          # Vite配置
├── .eslintrc.js           # ESLint配置
├── .prettierrc            # Prettier配置
├── .gitignore             # Git忽略文件
└── README.md              # 项目说明
```

## 技术栈

- Vue 3 - 渐进式JavaScript框架
- Vue Router 4 - 官方路由管理器
- Pinia - 状态管理库
- Vant 4 - 移动端UI组件库
- Vite - 构建工具
- Axios - HTTP客户端
- Sass - CSS预处理器

## 开发环境

- Node.js >= 16.0.0
- Yarn >= 1.22.0

## 安装和运行

```bash
# 安装依赖
yarn install

# 启动开发服务器
yarn dev

# 构建生产版本
yarn build

# 预览生产版本
yarn preview

# 代码检查
yarn lint

# 代码格式化
yarn format
```

## 项目特性

- 🚀 基于Vue3 Composition API
- 📱 移动端优先设计
- 🎨 使用Vant UI组件库
- 🔐 完整的用户认证系统
- 📝 笔记本管理功能
- 📊 资产总览支持多维度时间筛选（本年/本月/本周/总统计）
- 🎯 响应式设计
- 🔧 支持本地API测试环境联调
- 🛠️ 集成Mock服务器，自动处理API请求失败
- 📈 动态图表更新，支持实时数据切换

## API配置

项目配置了代理，支持本地API测试环境联调：

- 开发环境API地址：`http://localhost:8080`
- 代理配置：`/api` -> `http://localhost:8080`

## API文档

- [API文档索引](./docs/api/README.md) - 所有API文档的索引
- [认证API文档](./docs/api/auth-api.md) - 用户登录、注册、忘记密码等认证相关接口

## Mock数据测试

项目提供了完整的Mock数据支持，可以在没有后端服务的情况下进行前端功能测试：

### 快速开始
1. 启动项目：`yarn dev`
2. 访问登录页面：`http://localhost:3000/login`
3. 启用Mock模式（默认已启用）
4. 使用测试账号登录：
   - 茶农账号：`farmer001` / `123456`
   - 管理员账号：`admin` / `admin123`

### 功能特性
- ✅ 完整的用户认证系统（登录/注册/忘记密码）
- ✅ 仪表板数据（统计/图表/记录）
- ✅ 网络延迟模拟（1-1.5秒）
- ✅ 完整错误处理
- ✅ 数据持久化（当前会话）

### 相关文档
- [Mock API使用说明](./docs/mock-api.md) - 详细的Mock功能使用指南
- [认证API文档](./docs/api/auth-api.md) - 包含Mock测试用例
- [仪表板API文档](./docs/api/dashboard-api.md) - 包含Mock数据说明

## 开发规范

- 使用Vue3 Composition API
- 组件命名使用PascalCase
- 文件命名使用kebab-case
- 使用ESLint和Prettier进行代码规范
- 遵循Vue3最佳实践