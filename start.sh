#!/bin/bash

echo "========================================"
echo "  家庭记账本 - 前后端分离项目启动脚本"
echo "========================================"
echo

echo "1. 检查依赖安装..."
if [ ! -d "node_modules" ]; then
    echo "安装前端依赖..."
    npm install
else
    echo "前端依赖已安装"
fi

if [ ! -d "backend/node_modules" ]; then
    echo "安装后端依赖..."
    cd backend
    npm install
    cd ..
else
    echo "后端依赖已安装"
fi

echo

echo "2. 检查环境配置..."
if [ ! -f "backend/.env" ]; then
    echo "创建后端环境配置文件..."
    cp backend/.env.example backend/.env
    echo "请编辑 backend/.env 文件配置JWT密钥等参数"
else
    echo "环境配置文件已存在"
fi

echo

echo "3. 启动服务..."
echo "启动后端服务 (端口: 3001)..."
cd backend && npm run start:dev &
BACKEND_PID=$!

sleep 3

echo "启动前端服务 (端口: 5173)..."
npm run dev &
FRONTEND_PID=$!

echo

echo "========================================"
echo "服务启动完成！"
echo "前端地址: http://localhost:5173"
echo "后端地址: http://localhost:3001"
echo "========================================"
echo

echo "按 Ctrl+C 停止服务..."

# 捕获退出信号，清理进程
cleanup() {
    echo "正在停止服务..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "服务已停止"
    exit 0
}

trap cleanup SIGINT SIGTERM

# 等待进程
wait