-- CREATE FRESH SystemConfig Table
-- This script will recreate the system_config table with the correct schema

USE myfinance;

-- STEP 1: Backup existing data (optional - skip if you want completely fresh start)
-- CREATE TABLE system_config_old_backup AS SELECT * FROM system_config;

-- STEP 2: Drop the existing table
DROP TABLE IF EXISTS system_config;

-- STEP 3: Create the new table with proper schema
CREATE TABLE system_config (
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

    INDEX idx_config_type (config_type),
    INDEX idx_is_public (is_public),
    INDEX idx_created_at (created_at)
);

-- STEP 4: Insert some essential default configurations
INSERT INTO system_config (config_key, config_value, description, config_type, is_public) VALUES
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

-- STEP 5: Verify the new table
SELECT 'Table created successfully' as status;
SELECT COUNT(*) as total_configs FROM system_config;
SELECT config_type, COUNT(*) as count FROM system_config GROUP BY config_type ORDER BY config_type;
SELECT config_key, config_type, config_value, is_public FROM system_config ORDER BY config_key;