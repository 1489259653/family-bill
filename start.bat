@echo off
echo ========================================
echo   家庭记账本 - 前后端分离项目启动脚本
echo ========================================
echo.

echo 1. 检查依赖安装...
if not exist "node_modules" (
    echo 安装前端依赖...
    npm install
) else (
    echo 前端依赖已安装
)

if not exist "backend\node_modules" (
    echo 安装后端依赖...
    cd backend
    npm install
    cd ..
) else (
    echo 后端依赖已安装
)

echo.
echo 2. 检查环境配置...
if not exist "backend\.env" (
    echo 创建后端环境配置文件...
    copy backend\.env.example backend\.env
    echo 请编辑 backend\.env 文件配置JWT密钥等参数
) else (
    echo 环境配置文件已存在
)

echo.
echo 3. 启动服务...
echo 启动后端服务 (端口: 3001)...
start "后端服务" cmd /k "cd backend && npm run start:dev"

timeout /t 3 /nobreak > nul

echo 启动前端服务 (端口: 5173)...
start "前端服务" cmd /k "npm run dev"

echo.
echo ========================================
echo 服务启动完成！
echo 前端地址: http://localhost:5173
echo 后端地址: http://localhost:3001
echo ========================================
echo.
echo 按任意键退出...
pause > nul