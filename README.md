# 农户笔记本系统

## 项目简介

农户笔记本系统是一个基于Vue3 + Spring Boot的现代化Web应用，为农户提供便捷的笔记本管理功能。

## 技术栈

### 前端
- **框架**: Vue 3 + Vant UI
- **状态管理**: Pinia
- **构建工具**: Vite
- **语言**: JavaScript

### 后端
- **框架**: Spring Boot 3.2.0
- **ORM**: MyBatis-Plus 3.5.4
- **数据库**: MySQL 8.0
- **安全**: Spring Security + JWT
- **连接池**: Druid 1.2.20

## 项目结构

```
FarmerNotebookSystem/
├── frontend/                        # 前端项目
│   ├── index.html                   # HTML入口文件
│   ├── package.json                 # 前端依赖配置
│   ├── vite.config.js               # Vite配置
│   ├── README.md                    # 前端说明文档
│   └── src/                         # 前端源码
│       ├── main.js                  # 应用入口
│       ├── App.vue                  # 根组件
│       ├── api/                     # API接口
│       │   ├── request.js           # 请求工具
│       │   ├── user.js              # 用户相关API
│       │   ├── notebook.js          # 笔记本相关API
│       │   └── assets.js            # 资产相关API
│       ├── assets/                  # 静态资源
│       │   ├── fonts/               # 字体文件
│       │   ├── icons/               # 图标文件
│       │   └── images/              # 图片资源
│       ├── components/              # 组件
│       │   ├── business/            # 业务组件
│       │   ├── common/              # 通用组件
│       │   └── layout/              # 布局组件
│       │       ├── Header.vue        # 顶部导航栏
│       │       ├── Sidebar.vue       # 侧边栏导航
│       │       └── Layout.vue        # 主布局组件
│       ├── hooks/                   # 组合式函数
│       │   ├── useAuth.js           # 认证相关Hook
│       │   ├── useUser.js           # 用户相关Hook
│       │   └── useNotebook.js       # 笔记本相关Hook
│       ├── router/                  # 路由配置
│       │   └── index.js             # 路由定义
│       ├── stores/                  # 状态管理
│       │   ├── user.js              # 用户状态
│       │   └── assets.js            # 资产状态
│       ├── styles/                  # 样式文件
│       │   ├── index.scss           # 主样式文件
│       │   ├── variables.scss       # 变量定义
│       │   ├── mixins.scss          # 混入定义
│       │   └── components.scss      # 组件样式
│       ├── utils/                   # 工具函数
│       │   ├── request.js           # 请求工具
│       │   ├── storage.js           # 存储工具
│       │   ├── format.js            # 格式化工具
│       │   └── validate.js          # 验证工具
│       └── views/                   # 页面组件
│           ├── Home.vue              # 首页
│           ├── Login.vue             # 登录页
│           ├── Register.vue          # 注册页
│           ├── Profile.vue           # 个人中心
│           ├── Notebook.vue          # 笔记本
│           ├── Dashboard.vue         # 仪表板
│           ├── AssetsOverview.vue    # 资产总览
│           ├── Flow.vue           # 流水记录
│           ├── Warehouse.vue         # 入库出库
│           ├── Inventory.vue         # 库存管理
│           ├── Customers.vue         # 客户管理
│           ├── Suppliers.vue         # 供应商管理
│           ├── Data.vue              # 数据管理
│           ├── Vip.vue               # VIP功能
│           └── NotFound.vue          # 404页面
├── Backend/                         # 后端项目
│   ├── pom.xml                      # Maven配置
│   ├── README.md                    # 后端说明文档
│   └── src/                         # 后端源码
│       └── main/
│           ├── java/com/farmer/notebook/
│           │   ├── FarmerNotebookApplication.java    # 启动类
│           │   ├── config/                          # 配置类
│           │   │   ├── MybatisPlusConfig.java       # MyBatis-Plus配置
│           │   │   └── SecurityConfig.java          # Spring Security配置
│           │   ├── common/                          # 公共类
│           │   │   ├── Result.java                  # 统一响应结果
│           │   │   └── exception/                   # 异常处理
│           │   │       ├── BusinessException.java   # 业务异常
│           │   │       └── GlobalExceptionHandler.java # 全局异常处理器
│           │   ├── model/                           # 模型类
│           │   │   ├── entity/                      # 实体类
│           │   │   │   ├── BaseEntity.java          # 基础实体
│           │   │   │   ├── User.java               # 用户实体
│           │   │   │   └── Notebook.java           # 笔记本实体
│           │   │   └── dto/                        # 数据传输对象
│           │   │       └── LoginDTO.java           # 登录DTO
│           │   ├── mapper/                         # 数据访问层
│           │   │   ├── UserMapper.java             # 用户Mapper
│           │   │   └── NotebookMapper.java         # 笔记本Mapper
│           │   ├── service/                        # 业务逻辑层
│           │   │   ├── UserService.java            # 用户服务接口
│           │   │   ├── NotebookService.java        # 笔记本服务接口
│           │   │   └── impl/                       # 服务实现
│           │   │       ├── UserServiceImpl.java    # 用户服务实现
│           │   │       └── NotebookServiceImpl.java # 笔记本服务实现
│           │   ├── controller/                     # 控制器层
│           │   │   ├── AuthController.java         # 认证控制器
│           │   │   └── NotebookController.java     # 笔记本控制器
│           │   └── util/                          # 工具类
│           │       └── JwtUtil.java               # JWT工具类
│           └── resources/
│               ├── application.yml                 # 应用配置
│               └── sql/
│                   └── init.sql                   # 数据库初始化脚本
└── Usermanagement/                  # 用户管理模块
```

## 快速开始

### 环境要求

- **Node.js**: 16+
- **Java**: 17+
- **MySQL**: 8.0+
- **Maven**: 3.6+

### 启动步骤

1. **启动后端服务**
   ```bash
   cd Backend
   # 配置数据库连接
   # 执行数据库初始化脚本
   mvn spring-boot:run
   ```

2. **启动前端服务**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **访问应用**
   - 前端: http://localhost:3000
   - 后端API: http://localhost:8080/api
   - Druid监控: http://localhost:8080/api/druid

## 功能特性

### 前端规范
- 使用Vue3 Composition API
- 组件化开发
- 统一代码风格
- 响应式设计

### 后端规范
- 分层架构设计
- RESTful API设计
- 统一异常处理
- 数据库规范

## 部署说明

### 开发环境
- 前端: `npm run dev`
- 后端: `mvn spring-boot:run`

### 生产环境
- 前端: `npm run build`
- 后端: `mvn clean package`

## 许可证

MIT License 