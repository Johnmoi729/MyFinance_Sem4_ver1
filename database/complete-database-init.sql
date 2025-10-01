-- MyFinance Complete Database Initialization Script
-- This script creates the complete database schema for MyFinance application
-- Includes all tables from Flows 1-5: Auth, Transactions, Categories, Budgets, Admin

-- Create database
CREATE DATABASE IF NOT EXISTS myfinance CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE myfinance;

-- ============================================================================
-- FLOW 1: AUTHENTICATION & USER MANAGEMENT
-- ============================================================================

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    is_email_verified BOOLEAN DEFAULT FALSE,
    last_login DATETIME,
    login_count BIGINT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_users_email (email),
    INDEX idx_users_active (is_active)
);

-- ============================================================================
-- FLOW 2: CATEGORIES & TRANSACTIONS
-- ============================================================================

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    type ENUM('INCOME', 'EXPENSE') NOT NULL,
    color VARCHAR(7) DEFAULT '#007bff',
    icon VARCHAR(50) DEFAULT 'default',
    is_default BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_categories_user_id (user_id),
    INDEX idx_categories_type (type),
    INDEX idx_categories_user_type (user_id, type)
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    category_id BIGINT NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    type ENUM('INCOME', 'EXPENSE') NOT NULL,
    description TEXT,
    transaction_date DATE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
    INDEX idx_transactions_user_id (user_id),
    INDEX idx_transactions_category_id (category_id),
    INDEX idx_transactions_type (type),
    INDEX idx_transactions_date (transaction_date),
    INDEX idx_transactions_user_date (user_id, transaction_date),
    INDEX idx_transactions_user_type (user_id, type),
    INDEX idx_transactions_created_at (created_at)
);

-- ============================================================================
-- FLOW 3: BUDGET PLANNING
-- ============================================================================

-- Create budgets table
CREATE TABLE IF NOT EXISTS budgets (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    category_id BIGINT NOT NULL,
    budget_amount DECIMAL(12, 2) NOT NULL,
    budget_year INT NOT NULL,
    budget_month INT NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
    UNIQUE KEY unique_user_category_period (user_id, category_id, budget_year, budget_month),
    INDEX idx_budgets_user_id (user_id),
    INDEX idx_budgets_category_id (category_id),
    INDEX idx_budgets_period (budget_year, budget_month),
    INDEX idx_budgets_active (is_active)
);

-- Create user_budget_settings table
CREATE TABLE IF NOT EXISTS user_budget_settings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNIQUE NOT NULL,
    warning_threshold DOUBLE NOT NULL DEFAULT 75.0,
    critical_threshold DOUBLE NOT NULL DEFAULT 90.0,
    notifications_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    email_alerts_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    daily_summary_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_budget_settings_user_id (user_id)
);

-- ============================================================================
-- FLOW 5: ADMIN SYSTEM & MANAGEMENT
-- ============================================================================

-- Create roles table
CREATE TABLE IF NOT EXISTS roles (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    role_name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_role_name (role_name),
    INDEX idx_is_active (is_active)
);

-- Create user_roles junction table
CREATE TABLE IF NOT EXISTS user_roles (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    assigned_by_user_id BIGINT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_by_user_id) REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE KEY unique_user_role (user_id, role_id),
    INDEX idx_user_id (user_id),
    INDEX idx_role_id (role_id),
    INDEX idx_is_active (is_active)
);

-- Create audit_logs table
CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id VARCHAR(100),
    user_id BIGINT,
    admin_user_id BIGINT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    details TEXT,
    old_value TEXT,
    new_value TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (admin_user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_action (action),
    INDEX idx_entity_type (entity_type),
    INDEX idx_timestamp (timestamp),
    INDEX idx_user_id (user_id),
    INDEX idx_admin_user_id (admin_user_id)
);

-- Create system_config table (with updated enum values)
CREATE TABLE IF NOT EXISTS system_config (
    config_key VARCHAR(255) NOT NULL PRIMARY KEY,
    config_value TEXT,
    description VARCHAR(500),
    config_type ENUM(
        'APPLICATION',
        'SECURITY',
        'FEATURE',
        'UI',
        'DATABASE',
        'INTEGRATION',
        'NOTIFICATION',
        'PERFORMANCE',
        'LOGGING',
        'MAINTENANCE'
    ) NOT NULL DEFAULT 'APPLICATION',
    is_public BOOLEAN NOT NULL DEFAULT FALSE,
    updated_by_user_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (updated_by_user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_config_type (config_type),
    INDEX idx_is_public (is_public),
    INDEX idx_created_at (created_at)
);

-- ============================================================================
-- DEFAULT DATA INSERTION
-- ============================================================================

-- Insert default roles
INSERT IGNORE INTO roles (role_name, description) VALUES
('USER', 'Người dùng thông thường'),
('ADMIN', 'Quản trị viên'),
('SUPER_ADMIN', 'Quản trị viên cấp cao');

-- Insert default system configurations
INSERT IGNORE INTO system_config (config_key, config_value, description, config_type, is_public) VALUES
('MAINTENANCE_MODE', 'false', 'Chế độ bảo trì hệ thống', 'MAINTENANCE', false),
('MAX_LOGIN_ATTEMPTS', '5', 'Số lần đăng nhập tối đa', 'SECURITY', false),
('SESSION_TIMEOUT_HOURS', '24', 'Thời gian hết hạn phiên (giờ)', 'SECURITY', false),
('FEATURE_BUDGET_ANALYTICS', 'true', 'Tính năng phân tích ngân sách', 'FEATURE', false),
('FEATURE_EXPORT_DATA', 'true', 'Tính năng xuất dữ liệu', 'FEATURE', false),
('APP_NAME', 'MyFinance', 'Tên ứng dụng', 'APPLICATION', true),
('DEFAULT_CURRENCY', 'VND', 'Tiền tệ mặc định', 'APPLICATION', true),
('UI_THEME', 'light', 'Giao diện mặc định', 'UI', true),
('MAX_TRANSACTION_AMOUNT', '999999999', 'Số tiền giao dịch tối đa', 'PERFORMANCE', false),
('AUDIT_LOG_RETENTION_DAYS', '365', 'Số ngày lưu trữ audit log', 'LOGGING', false);

-- Assign USER role to all existing users who don't have it
INSERT IGNORE INTO user_roles (user_id, role_id, is_active)
SELECT u.id, r.id, TRUE
FROM users u
CROSS JOIN roles r
WHERE r.role_name = 'USER'
AND NOT EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = u.id AND ur.role_id = r.id
);

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Show table creation status
SELECT 'Database initialization completed successfully' as status;

-- Show table counts
SELECT
    (SELECT COUNT(*) FROM users) as users_count,
    (SELECT COUNT(*) FROM categories) as categories_count,
    (SELECT COUNT(*) FROM transactions) as transactions_count,
    (SELECT COUNT(*) FROM budgets) as budgets_count,
    (SELECT COUNT(*) FROM roles) as roles_count,
    (SELECT COUNT(*) FROM user_roles) as user_roles_count,
    (SELECT COUNT(*) FROM system_config) as system_config_count,
    (SELECT COUNT(*) FROM audit_logs) as audit_logs_count;

COMMIT;