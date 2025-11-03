# 家庭记账本 - React 19 + TypeScript + Ant Design 5

一个现代化的家庭收支管理Web应用，使用最新的React 19、TypeScript和Ant Design 5构建。

## 功能特性

- ✅ 添加收入和支出记录
- ✅ 多种分类管理（工资、餐饮、购物等）
- ✅ 实时统计和图表展示
- ✅ 数据筛选和搜索
- ✅ CSV数据导入导出
- ✅ 响应式设计，支持移动端
- ✅ 本地存储，数据持久化

## 技术栈

- **前端框架**: React 19
- **类型系统**: TypeScript
- **UI组件库**: Ant Design 5
- **构建工具**: Vite
- **包管理器**: npm
- **部署**: Docker

## 开发环境

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

应用将在 http://localhost:5173 启动

### 构建生产版本

```bash
npm run build
```

## 部署

### 使用Docker部署

1. 构建Docker镜像
```bash
docker build -t family-finance-app .
```

2. 运行容器
```bash
docker run -d -p 3000:3000 --name finance-app family-finance-app
```

### 使用Docker Compose部署

```bash
docker-compose up -d
```

## 项目结构

```
src/
├── components/          # React组件
│   ├── Header.tsx       # 页面头部
│   ├── SummaryCards.tsx # 统计卡片
│   ├── TransactionForm.tsx # 交易表单
│   ├── TransactionList.tsx # 交易列表
│   └── ExportImport.tsx # 数据导入导出
├── hooks/               # 自定义Hooks
│   └── useTransactions.ts # 交易数据管理
├── types/               # TypeScript类型定义
│   └── index.ts
├── utils/               # 工具函数
│   └── storage.ts      # 本地存储工具
├── App.tsx             # 主应用组件
├── main.tsx            # 应用入口
└── index.css           # 全局样式
```

## 使用说明

1. **添加交易**: 在表单中选择类型、分类、金额、描述和日期，点击"添加交易"
2. **查看统计**: 顶部卡片实时显示总收入、总支出和结余
3. **筛选数据**: 使用交易记录上方的筛选器按类型、分类或日期筛选
4. **导入导出**: 点击页面顶部的"导出数据"或"导入数据"按钮

## 浏览器支持

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 许可证

MIT License