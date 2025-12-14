-- =====================================================
-- USER PREFERENCES CLEANUP MIGRATION (UNIFIED VERSION)
-- Purpose: Remove 8-11 non-functional preference fields
-- Date: December 13, 2025
-- Risk: LOW (only removing unused columns)
-- =====================================================
--
-- IMPORTANT: Run this SQL manually in phpMyAdmin
--
-- This migration removes all non-functional preference fields:
--   Display Preferences (6): language, currency, date_format, timezone, theme, items_per_page
--   Notification Preferences (2): transaction_reminders, goal_reminders
--   Privacy Settings (3): profile_visibility, data_sharing, analytics_tracking (if exist)
--
-- Keeps 5 functional fields:
--   Display (1): view_mode - Controls budget view display
--   Notification (4): email_notifications, budget_alerts, weekly_summary, monthly_summary
-- =====================================================

-- =====================================================
-- STEP 1: BACKUP VERIFICATION
-- =====================================================

SELECT COUNT(*) AS total_users,
       COUNT(DISTINCT user_id) AS users_with_prefs
FROM user_preferences;
-- Expected: Should show user count

-- =====================================================
-- STEP 2: CHECK CURRENT SCHEMA (BEFORE MIGRATION)
-- =====================================================

-- Count total columns BEFORE migration
SELECT COUNT(*) AS column_count_before
FROM information_schema.columns
WHERE table_schema = 'myfinance'
  AND table_name = 'user_preferences';
-- Expected: 18-21 columns (depending on whether privacy fields exist)

-- List all columns BEFORE migration
DESCRIBE user_preferences;
-- Review all current columns and their types

-- =====================================================
-- STEP 3: CHECK WHICH OLD COLUMNS EXIST
-- =====================================================

-- Check which old columns need to be dropped
SELECT column_name
FROM information_schema.columns
WHERE table_schema = 'myfinance'
  AND table_name = 'user_preferences'
  AND column_name IN (
      'language', 'currency', 'date_format', 'timezone',
      'theme', 'items_per_page', 'transaction_reminders', 'goal_reminders',
      'profile_visibility', 'data_sharing', 'analytics_tracking'
  )
ORDER BY column_name;
-- This shows which old columns exist in YOUR database

-- =====================================================
-- STEP 4: VIEW SAMPLE DATA (Optional)
-- =====================================================

SELECT id, user_id, created_at, updated_at
FROM user_preferences
LIMIT 3;
-- Safe query - shows basic data before migration

-- =====================================================
-- STEP 5: DROP NON-FUNCTIONAL COLUMNS
-- =====================================================
--
-- CHOOSE ONE OF TWO OPTIONS BELOW:
--
-- OPTION A: Individual DROP statements (SAFER - use if unsure)
-- OPTION B: Single ALTER TABLE (FASTER - use if all 8 columns confirmed exist)
--
-- =====================================================

-- =====================================================
-- OPTION A: INDIVIDUAL DROP STATEMENTS (RECOMMENDED)
-- =====================================================
--
-- Run each statement one by one.
-- If you get error "Can't DROP 'column_name'; check that column/key exists",
-- it means that column doesn't exist - just skip to the next statement.
--
-- This is SAFER because it won't fail if some columns are already removed.
-- =====================================================

-- Display Preferences (6 columns)
ALTER TABLE user_preferences DROP COLUMN IF EXISTS language;

ALTER TABLE user_preferences DROP COLUMN IF EXISTS currency;

ALTER TABLE user_preferences DROP COLUMN IF EXISTS date_format;

ALTER TABLE user_preferences DROP COLUMN IF EXISTS timezone;

ALTER TABLE user_preferences DROP COLUMN IF EXISTS theme;

ALTER TABLE user_preferences DROP COLUMN IF EXISTS items_per_page;

-- Notification Preferences (2 columns)
ALTER TABLE user_preferences DROP COLUMN IF EXISTS transaction_reminders;

ALTER TABLE user_preferences DROP COLUMN IF EXISTS goal_reminders;

-- Privacy Settings (3 columns - only if they exist)
ALTER TABLE user_preferences DROP COLUMN IF EXISTS profile_visibility;

ALTER TABLE user_preferences DROP COLUMN IF EXISTS data_sharing;

ALTER TABLE user_preferences DROP COLUMN IF EXISTS analytics_tracking;

-- =====================================================
-- OPTION B: SINGLE ALTER TABLE (FASTER)
-- =====================================================
--
-- ONLY use this if you confirmed in STEP 3 that all these columns exist.
-- This is faster but will fail if ANY column doesn't exist.
--
-- Uncomment the block below if you want to use this option:
-- =====================================================

/*
ALTER TABLE user_preferences
    DROP COLUMN language,
    DROP COLUMN currency,
    DROP COLUMN date_format,
    DROP COLUMN timezone,
    DROP COLUMN theme,
    DROP COLUMN items_per_page,
    DROP COLUMN transaction_reminders,
    DROP COLUMN goal_reminders;
    -- Add these lines only if privacy columns exist:
    -- DROP COLUMN profile_visibility,
    -- DROP COLUMN data_sharing,
    -- DROP COLUMN analytics_tracking;
*/

-- =====================================================
-- STEP 6: VERIFICATION QUERIES
-- =====================================================

-- Count columns AFTER migration
SELECT COUNT(*) AS column_count_after
FROM information_schema.columns
WHERE table_schema = 'myfinance'
  AND table_name = 'user_preferences';
-- Expected: 10 columns (was 18-21)

-- Show structure AFTER migration
DESCRIBE user_preferences;
-- Expected: 10 rows (id, user_id, 5 preferences, created_at, updated_at)

-- Verify data integrity - no records lost
SELECT COUNT(*) AS total_records FROM user_preferences;
-- Expected: Same count as STEP 1

-- Verify remaining columns have data
SELECT id, user_id, view_mode, email_notifications, budget_alerts,
       weekly_summary, monthly_summary, created_at, updated_at
FROM user_preferences
LIMIT 5;
-- Expected: All rows should have data

-- Verify foreign key still exists
SHOW CREATE TABLE user_preferences;
-- Expected: Should show FOREIGN KEY (user_id) REFERENCES users(id)

-- =====================================================
-- STEP 7: FINAL VALIDATION
-- =====================================================

-- Check old columns are gone
SELECT COUNT(*) AS old_columns_remaining
FROM information_schema.columns
WHERE table_schema = 'myfinance'
  AND table_name = 'user_preferences'
  AND column_name IN (
      'language', 'currency', 'date_format', 'timezone',
      'theme', 'items_per_page', 'transaction_reminders', 'goal_reminders',
      'profile_visibility', 'data_sharing', 'analytics_tracking'
  );
-- Expected: 0 (all old columns removed)

-- Check functional columns exist
SELECT COUNT(*) AS functional_columns_count
FROM information_schema.columns
WHERE table_schema = 'myfinance'
  AND table_name = 'user_preferences'
  AND column_name IN (
      'view_mode', 'email_notifications', 'budget_alerts',
      'weekly_summary', 'monthly_summary'
  );
-- Expected: 5 (all functional columns exist)

-- Comprehensive validation check
SELECT
    (SELECT COUNT(*) FROM information_schema.columns
     WHERE table_schema = 'myfinance' AND table_name = 'user_preferences') AS total_columns,
    (SELECT COUNT(*) FROM information_schema.columns
     WHERE table_schema = 'myfinance' AND table_name = 'user_preferences'
     AND column_name IN ('view_mode','email_notifications','budget_alerts','weekly_summary','monthly_summary')) AS functional_fields,
    (SELECT COUNT(*) FROM information_schema.columns
     WHERE table_schema = 'myfinance' AND table_name = 'user_preferences'
     AND column_name IN ('language','currency','date_format','timezone','theme','items_per_page','transaction_reminders','goal_reminders')) AS old_fields,
    (SELECT COUNT(*) FROM user_preferences) AS total_records;
-- Expected: total_columns=10, functional_fields=5, old_fields=0, total_records=X

-- =====================================================
-- SUCCESS CRITERIA CHECKLIST
-- =====================================================
--
-- All these should be TRUE after migration:
--
-- ✓ Total columns = 10 (from 18-21)
-- ✓ Functional fields = 5 (view_mode, email_notifications, budget_alerts, weekly_summary, monthly_summary)
-- ✓ Old fields = 0 (no language, currency, etc.)
-- ✓ Total records unchanged (same as STEP 1)
-- ✓ Foreign key constraint still exists
-- ✓ DESCRIBE shows exactly 10 rows
--
-- If all checks pass, migration is SUCCESSFUL ✅
--
-- =====================================================

-- =====================================================
-- ROLLBACK INSTRUCTIONS (if needed)
-- =====================================================
--
-- If you need to rollback this migration, run:
--
-- ALTER TABLE user_preferences
--     ADD COLUMN language VARCHAR(10) DEFAULT 'vi' AFTER user_id,
--     ADD COLUMN currency VARCHAR(10) DEFAULT 'VND' AFTER language,
--     ADD COLUMN date_format VARCHAR(20) DEFAULT 'dd/MM/yyyy' AFTER currency,
--     ADD COLUMN timezone VARCHAR(50) DEFAULT 'Asia/Ho_Chi_Minh' AFTER date_format,
--     ADD COLUMN theme VARCHAR(20) DEFAULT 'light' AFTER timezone,
--     ADD COLUMN items_per_page INT DEFAULT 10 AFTER theme,
--     ADD COLUMN transaction_reminders BOOLEAN DEFAULT FALSE AFTER monthly_summary,
--     ADD COLUMN goal_reminders BOOLEAN DEFAULT FALSE AFTER transaction_reminders;
--
-- Note: Rollback restores column structure with default values,
-- but original user data is permanently lost.
--
-- =====================================================

-- =====================================================
-- MIGRATION SUMMARY
-- =====================================================
--
-- Before: 18-21 columns
-- After:  10 columns
--
-- Removed Columns (8-11):
--   Display: language, currency, date_format, timezone, theme, items_per_page
--   Notification: transaction_reminders, goal_reminders
--   Privacy (if existed): profile_visibility, data_sharing, analytics_tracking
--
-- Kept Columns (5 functional):
--   1. view_mode - Controls budget view display
--   2. email_notifications - Master email switch
--   3. budget_alerts - Budget alert emails
--   4. weekly_summary - Weekly email summaries
--   5. monthly_summary - Monthly email summaries
--
-- Impact:
--   - Database: 44-52% column reduction
--   - Code: ~130 lines removed
--   - UX: Preferences page simplified (16-19 → 5 settings)
--
-- =====================================================
-- END OF MIGRATION
-- =====================================================
