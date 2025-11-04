# 家庭记账本 - 后端API

这是一个基于NestJS的家庭记账本后端API，提供用户认证和交易管理功能。

## 功能特性

- 用户注册和登录（JWT认证）
- 交易记录管理（收入/支出）
- 交易分类和统计
- MariaDB/MySQL数据库支持

## 技术栈

- NestJS
- TypeORM
- MariaDB/MySQL
- JWT认证
- Class Validator

## 安装和运行

1. 安装依赖：
```bash
npm install
```

2. 复制环境变量文件：
```bash
cp .env.example .env
```

3. 修改环境变量（可选）：
```env
JWT_SECRET=your-super-secret-jwt-key
PORT=3001
```

4. 启动开发服务器：
```bash
npm run start:dev
```

## API端点

### 认证相关
- `POST /auth/register` - 用户注册
- `POST /auth/login` - 用户登录

### 交易相关（需要认证）
- `GET /transactions` - 获取所有交易
- `POST /transactions` - 创建交易
- `GET /transactions/:id` - 获取单个交易
- `PATCH /transactions/:id` - 更新交易
- `DELETE /transactions/:id` - 删除交易
- `GET /transactions/summary` - 获取交易统计

## 数据库

项目使用MariaDB/MySQL数据库，数据库配置请参考`.env`文件。

## 扩展性

项目设计支持数据库迁移，可以轻松切换到MySQL或其他数据库。