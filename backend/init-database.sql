-- 家庭记账本数据库初始化脚本
-- 创建数据库
CREATE DATABASE IF NOT EXISTS family_finance CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 使用数据库
USE family_finance;

-- 创建用户表
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 创建交易记录表
CREATE TABLE IF NOT EXISTS transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    amount DECIMAL(10,2) NOT NULL,
    type ENUM('income', 'expense') NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 创建索引以提高查询性能
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_date ON transactions(date);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_category ON transactions(category);

-- 插入示例数据（可选）
INSERT IGNORE INTO users (username, email, password) VALUES 
('admin', 'admin@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'), -- password
('testuser', 'test@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'); -- password

INSERT IGNORE INTO transactions (amount, type, category, description, date, user_id) VALUES 
(5000.00, 'income', '工资', '月薪', '2024-01-15', 1),
(3000.00, 'income', '奖金', '年终奖', '2024-01-20', 1),
(1500.00, 'expense', '房租', '1月房租', '2024-01-05', 1),
(800.00, 'expense', '餐饮', '日常餐饮', '2024-01-10', 1),
(200.00, 'expense', '交通', '地铁公交', '2024-01-12', 1),
(1000.00, 'expense', '购物', '生活用品', '2024-01-18', 1);

-- 显示表结构
DESCRIBE users;
DESCRIBE transactions;

-- 显示示例数据
SELECT '用户表数据:' AS '信息';
SELECT * FROM users;

SELECT '交易记录表数据:' AS '信息';
SELECT * FROM transactions;