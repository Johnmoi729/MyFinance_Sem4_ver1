-- ============================================================================
-- Migration V4: Remove Unused Notification Fields from user_budget_settings
-- ============================================================================
-- Date: December 13, 2025
-- Purpose: Remove 3 non-functional notification fields that are never checked
--          in business logic. EmailService uses UserPreferences instead.
-- Risk Level: LOW (fields are not used in any business logic)
-- Estimated Time: < 5 seconds
-- ============================================================================

-- IMPORTANT: Run this in phpMyAdmin manually
-- Database: myfinance

USE myfinance;

-- ============================================================================
-- PRE-MIGRATION VERIFICATION
-- ============================================================================

-- Step 1: Check current table structure
-- Run this to see current columns (should show 9 columns)
DESCRIBE user_budget_settings;

-- Step 2: Check current record count (for verification after migration)
SELECT COUNT(*) as total_records FROM user_budget_settings;

-- Step 3: View current data (optional - to see what will be removed)
-- SELECT id, user_id, notifications_enabled, email_alerts_enabled, daily_summary_enabled
-- FROM user_budget_settings
-- LIMIT 5;

-- ============================================================================
-- MIGRATION: DROP UNUSED COLUMNS
-- ============================================================================

-- Drop the 3 unused notification fields
-- These are safe to drop because:
-- 1. No business logic reads them (verified via comprehensive code analysis)
-- 2. EmailService uses UserPreferences.budgetAlerts instead
-- 3. No foreign key constraints reference these columns
-- 4. No indexes use these columns
-- 5. No stored procedures/triggers/views reference them

ALTER TABLE user_budget_settings
    DROP COLUMN notifications_enabled,
    DROP COLUMN email_alerts_enabled,
    DROP COLUMN daily_summary_enabled;

-- ============================================================================
-- POST-MIGRATION VERIFICATION
-- ============================================================================

-- Step 4: Verify new table structure (should show 6 columns now)
DESCRIBE user_budget_settings;

-- Expected columns after migration:
-- 1. id
-- 2. user_id
-- 3. warning_threshold
-- 4. critical_threshold
-- 5. created_at
-- 6. updated_at

-- Step 5: Verify record count unchanged
SELECT COUNT(*) as total_records_after FROM user_budget_settings;

-- Step 6: View sample data to ensure thresholds preserved
SELECT id, user_id, warning_threshold, critical_threshold, created_at
FROM user_budget_settings
LIMIT 5;

-- ============================================================================
-- ROLLBACK INSTRUCTIONS (if needed)
-- ============================================================================

-- If you need to rollback this migration, run:
--
-- ALTER TABLE user_budget_settings
--     ADD COLUMN notifications_enabled BOOLEAN NOT NULL DEFAULT TRUE AFTER critical_threshold,
--     ADD COLUMN email_alerts_enabled BOOLEAN NOT NULL DEFAULT FALSE AFTER notifications_enabled,
--     ADD COLUMN daily_summary_enabled BOOLEAN NOT NULL DEFAULT TRUE AFTER email_alerts_enabled;
--
-- NOTE: Rollback will restore columns with default values, not original user data
-- (unless you created a backup table before migration)

-- ============================================================================
-- END OF MIGRATION
-- ============================================================================
