# CI/CD 环境变量配置指南

## 前置条件

在使用本项目的CI/CD工作流之前，需要在GitHub仓库的Settings > Secrets and variables > Actions中配置以下密钥和环境变量。

## 通用服务器配置

| 密钥名称 | 说明 | 示例值 |
|---------|------|-------|
| `SERVER_HOST` | 服务器IP地址或域名 | `192.168.1.100` |
| `SERVER_USERNAME` | 服务器登录用户名 | `deploy` |
| `SERVER_SSH_KEY` | 服务器SSH私钥 | (完整的私钥内容) |

## 前端配置

| 密钥名称 | 说明 | 示例值 |
|---------|------|-------|
| `VITE_API_URL` | 后端API接口地址 | `http://your-domain.com/api` |
| `VITE_ENVIRONMENT` | 环境标识 | `production` |

## 后端配置

| 密钥名称 | 说明 | 示例值 |
|---------|------|-------|
| `DATABASE_URL` | 数据库连接字符串 | `mysql://user:password@localhost:3306/family_finance` |
| `JWT_SECRET` | JWT签名密钥 | `your-secure-jwt-secret-key` |
| `NODE_ENV` | Node.js环境 | `production` |

## 部署路径说明

- **前端部署路径**: `/var/www/html/family-finance-tracker`
- **后端部署路径**: `/home/deploy/family-finance-tracker/backend`

## 服务器准备工作

1. 确保服务器已安装Node.js 18.x
2. 确保服务器已安装npm和pnpm
3. 确保服务器已安装nginx
4. 确保服务器已安装pm2 (`npm install -g pm2`)
5. 创建必要的目录结构和设置正确的权限

```bash
# 前端目录
sudo mkdir -p /var/www/html/family-finance-tracker
sudo chown -R $USER:$USER /var/www/html/family-finance-tracker

# 后端目录
mkdir -p /home/deploy/family-finance-tracker/backend
```

## Nginx配置示例

在服务器上创建Nginx配置文件：

```bash
sudo nano /etc/nginx/sites-available/family-finance-tracker
```

配置内容：

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        root /var/www/html/family-finance-tracker;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

启用配置：

```bash
sudo ln -s /etc/nginx/sites-available/family-finance-tracker /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```