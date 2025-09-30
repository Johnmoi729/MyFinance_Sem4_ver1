-- Migration script for Admin System (Flow 5)
-- Add new tables and modify existing ones

-- Add login_count to users table if it doesn't exist
ALTER TABLE users ADD COLUMN IF NOT EXISTS login_count BIGINT DEFAULT 0;

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
    details JSON,
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

-- Create system_configs table with corrected column name
CREATE TABLE IF NOT EXISTS system_configs (
    config_key VARCHAR(100) PRIMARY KEY,
    config_value TEXT,
    description VARCHAR(500),
    config_type ENUM('BOOLEAN', 'STRING', 'NUMBER', 'JSON') NOT NULL DEFAULT 'STRING',
    is_public BOOLEAN NOT NULL DEFAULT FALSE,
    updated_by_user_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (updated_by_user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_config_type (config_type),
    INDEX idx_is_public (is_public)
);

-- Insert default roles if they don't exist
INSERT IGNORE INTO roles (role_name, description) VALUES
('USER', 'Người dùng thông thường'),
('ADMIN', 'Quản trị viên'),
('SUPER_ADMIN', 'Quản trị viên cấp cao');

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

-- Insert default system configurations
INSERT IGNORE INTO system_configs (config_key, config_value, description, config_type, is_public) VALUES
('MAINTENANCE_MODE', 'false', 'Chế độ bảo trì hệ thống', 'BOOLEAN', false),
('MAX_LOGIN_ATTEMPTS', '5', 'Số lần đăng nhập tối đa', 'NUMBER', false),
('SESSION_TIMEOUT_HOURS', '24', 'Thời gian hết hạn phiên (giờ)', 'NUMBER', false),
('FEATURE_BUDGET_ANALYTICS', 'true', 'Tính năng phân tích ngân sách', 'BOOLEAN', false),
('FEATURE_EXPORT_DATA', 'true', 'Tính năng xuất dữ liệu', 'BOOLEAN', false),
('APP_NAME', 'MyFinance', 'Tên ứng dụng', 'STRING', true),
('DEFAULT_CURRENCY', 'VND', 'Tiền tệ mặc định', 'STRING', true);