# 农户笔记本系统 - 后端

## 项目简介

农户笔记本系统后端，基于Spring Boot + MyBatis-Plus构建，提供RESTful API服务。

## 技术栈

- **框架**: Spring Boot 3.2.0
- **ORM**: MyBatis-Plus 3.5.4
- **数据库**: MySQL 8.0
- **连接池**: Druid 1.2.20
- **安全**: Spring Security + JWT
- **工具**: Hutool 5.8.22
- **构建工具**: Maven

## 项目结构

```
src/main/java/com/farmer/notebook/
├── FarmerNotebookApplication.java    # 启动类
├── config/                          # 配置类
│   ├── MybatisPlusConfig.java       # MyBatis-Plus配置
│   └── SecurityConfig.java          # Spring Security配置
├── common/                          # 公共类
│   ├── Result.java                  # 统一响应结果
│   └── exception/                   # 异常处理
│       ├── BusinessException.java   # 业务异常
│       └── GlobalExceptionHandler.java # 全局异常处理器
├── model/                           # 模型类
│   ├── entity/                      # 实体类
│   │   ├── BaseEntity.java          # 基础实体
│   │   ├── User.java               # 用户实体
│   │   └── Notebook.java           # 笔记本实体
│   └── dto/                        # 数据传输对象
│       └── LoginDTO.java           # 登录DTO
├── mapper/                         # 数据访问层
│   ├── UserMapper.java             # 用户Mapper
│   └── NotebookMapper.java         # 笔记本Mapper
├── service/                        # 业务逻辑层
│   ├── UserService.java            # 用户服务接口
│   ├── NotebookService.java        # 笔记本服务接口
│   └── impl/                       # 服务实现
│       ├── UserServiceImpl.java    # 用户服务实现
│       └── NotebookServiceImpl.java # 笔记本服务实现
├── controller/                     # 控制器层
│   ├── AuthController.java         # 认证控制器
│   └── NotebookController.java     # 笔记本控制器
└── util/                          # 工具类
    └── JwtUtil.java               # JWT工具类
```

## 快速开始

### 环境要求

- JDK 17+
- Maven 3.6+
- MySQL 8.0+

### 安装步骤

1. **克隆项目**
   ```bash
   git clone <repository-url>
   cd Backend
   ```

2. **配置数据库**
   - 创建MySQL数据库
   - 执行 `src/main/resources/sql/init.sql` 初始化数据库

3. **修改配置**
   - 编辑 `src/main/resources/application.yml`
   - 修改数据库连接信息

4. **启动项目**
   ```bash
   mvn spring-boot:run
   ```

5. **访问接口**
   - 项目启动后访问: http://localhost:8080/api
   - Druid监控: http://localhost:8080/api/druid

## API接口

### 认证接口

- `POST /api/auth/login` - 用户登录
- `POST /api/auth/logout` - 用户登出

### 笔记本接口

- `GET /api/notebook/list` - 分页查询笔记本
- `GET /api/notebook/{id}` - 根据ID查询笔记本
- `POST /api/notebook` - 创建笔记本
- `PUT /api/notebook` - 更新笔记本
- `DELETE /api/notebook/{id}` - 删除笔记本

## 默认用户

- **管理员**: admin / admin123
- **测试用户**: farmer / 123456

## 配置说明

### 数据库配置

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/farmer_notebook
    username: root
    password: 123456
```

### JWT配置

```yaml
jwt:
  secret: farmer-notebook-secret-key-2024
  expiration: 86400000  # 24小时
```

## 开发规范

### 代码规范

- 遵循阿里巴巴Java开发手册
- 使用Lombok简化代码
- 统一异常处理
- 统一响应格式

### 数据库规范

- 使用逻辑删除
- 统一字段命名（下划线命名）
- 添加必要的索引
- 使用UTF8MB4字符集

### API规范

- 使用RESTful风格
- 统一响应格式
- 参数校验
- 错误码规范

## 部署说明

### 打包

```bash
mvn clean package
```

### 运行

```bash
java -jar target/farmer-notebook-system-1.0.0.jar
```

### Docker部署

```dockerfile
FROM openjdk:17-jre-slim
COPY target/farmer-notebook-system-1.0.0.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

## 监控

- **Druid监控**: http://localhost:8080/api/druid
- **用户名**: admin
- **密码**: 123456

## 许可证

MIT License 