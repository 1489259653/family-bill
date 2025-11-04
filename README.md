# 家庭记账本 - 前后端分离项目

这是一个基于 React + NestJS 的家庭记账本应用，支持用户注册登录、交易记录管理等功能。

## 技术栈

### 前端
- React 19 + TypeScript
- Ant Design 5
- React Router DOM
- Axios
- Day.js

### 后端
- NestJS
- TypeORM
- SQLite (可扩展为MySQL)
- JWT认证
- Class Validator

## 项目结构

```
├── backend/                 # NestJS后端
│   ├── src/
│   │   ├── auth/           # 认证模块
│   │   ├── users/          # 用户模块
│   │   ├── transactions/   # 交易模块
│   │   └── app.module.ts   # 主模块
│   ├── package.json
│   └── tsconfig.json
├── src/                    # React前端
│   ├── components/         # 组件
│   ├── contexts/           # React Context
│   ├── hooks/              # 自定义Hooks
│   ├── services/           # API服务
│   └── App.tsx
├── package.json
└── vite.config.ts
```

## 快速开始

### 1. 安装依赖

```bash
# 安装前端依赖
npm install

# 安装后端依赖
cd backend
npm install
cd ..
```

### 2. 配置环境变量

```bash
# 复制后端环境变量文件
cp backend/.env.example backend/.env

# 编辑环境变量（可选）
# JWT_SECRET=your-super-secret-jwt-key
# PORT=3001
```

### 3. 启动服务

#### 方式一：分别启动前后端

```bash
# 终端1：启动后端
cd backend
npm run start:dev

# 终端2：启动前端
npm run dev
```

#### 方式二：使用启动脚本

```bash
# 启动前后端（Windows）
npm run start:all

# 或分别启动
npm run start:backend
npm run start:frontend
```

### 4. 访问应用

- 前端应用：http://localhost:5173
- 后端API：http://localhost:3001

## 功能特性

### 用户认证
- 用户注册和登录
- JWT Token认证
- 自动Token刷新
- 路由保护

### 交易管理
- 添加收入/支出记录
- 交易分类管理
- 日期筛选和搜索
- 交易统计和图表

### 数据管理
- 数据导入导出
- 本地存储同步
- 数据备份恢复

## API接口

### 认证接口
- `POST /auth/register` - 用户注册
- `POST /auth/login` - 用户登录

### 交易接口（需要认证）
- `GET /transactions` - 获取交易列表
- `POST /transactions` - 创建交易
- `GET /transactions/:id` - 获取交易详情
- `PATCH /transactions/:id` - 更新交易
- `DELETE /transactions/:id` - 删除交易
- `GET /transactions/summary` - 获取统计信息

## 数据库

项目使用SQLite数据库，数据库文件位于 `backend/database.sqlite`。

### 数据库迁移

如需切换到MySQL或其他数据库，修改 `backend/src/app.module.ts` 中的数据库配置：

```typescript
TypeOrmModule.forRoot({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'password',
  database: 'family_finance',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: true,
}),
```

## 开发说明

### 前端开发

- 使用Vite作为构建工具
- 支持热重载开发
- TypeScript类型检查
- ESLint代码规范

### 后端开发

- NestJS框架提供完整的企业级开发体验
- TypeORM数据库ORM
- 自动API文档生成（可扩展）
- 完整的错误处理机制

### 部署

#### 开发环境部署
```bash
npm run build
npm run serve
```

#### 生产环境部署
- 前端：构建静态文件部署到Nginx/CDN
- 后端：使用PM2部署Node.js服务
- 数据库：使用MySQL/PostgreSQL生产数据库

## 常见问题

### 1. 端口冲突
如果3001端口被占用，修改 `backend/.env` 中的 `PORT` 配置。

### 2. CORS错误
确保前端访问地址在后端CORS白名单中。

### 3. 数据库连接失败
检查SQLite数据库文件权限或MySQL连接配置。

## 贡献指南

1. Fork项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建Pull Request

## 许可证

MIT License