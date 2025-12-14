-- Cleanup Zombie Configs Migration
-- Date: December 14, 2025
-- Purpose: Remove configs deleted from SystemConfigService.java but still in database
-- Safe to run: Only deletes configs not referenced in code

-- Backup existing configs before deletion
CREATE TABLE IF NOT EXISTS system_config_backup_20251214 AS
SELECT * FROM system_config
WHERE config_key IN (
    'FEATURE_BUDGET_ANALYTICS',
    'FEATURE_EXPORT_DATA',
    'DEFAULT_CURRENCY',
    'UI_THEME',
    'MAX_TRANSACTION_AMOUNT',
    'AUDIT_LOG_RETENTION_DAYS'
);

-- Delete zombie configs
DELETE FROM system_config
WHERE config_key IN (
    'FEATURE_BUDGET_ANALYTICS',   -- Core feature, not optional
    'FEATURE_EXPORT_DATA',         -- Core feature, not optional
    'DEFAULT_CURRENCY',            -- Conflicts with VND-only architecture
    'UI_THEME',                    -- Not implemented in code
    'MAX_TRANSACTION_AMOUNT',      -- Not used
    'AUDIT_LOG_RETENTION_DAYS'     -- Not implemented
);

-- Verify deletion
SELECT
    CASE
        WHEN COUNT(*) = 0 THEN 'SUCCESS: All zombie configs removed'
        ELSE CONCAT('WARNING: ', COUNT(*), ' configs still exist')
    END AS cleanup_status
FROM system_config
WHERE config_key IN (
    'FEATURE_BUDGET_ANALYTICS',
    'FEATURE_EXPORT_DATA',
    'DEFAULT_CURRENCY',
    'UI_THEME',
    'MAX_TRANSACTION_AMOUNT',
    'AUDIT_LOG_RETENTION_DAYS'
);

-- Show remaining configs
SELECT config_key, config_value, description, config_type
FROM system_config
ORDER BY config_type, config_key;
