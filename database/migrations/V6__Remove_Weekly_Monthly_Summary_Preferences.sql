-- =====================================================
-- USER PREFERENCES CLEANUP V6 - Remove Weekly/Monthly Summary
-- Purpose: Remove redundant weeklySummary and monthlySummary preferences
-- Date: December 13, 2025
-- Reason: Features overlap with ScheduledReports system
-- Risk: LOW (simple column removal, no data dependencies)
-- =====================================================
--
-- IMPORTANT: Run this SQL manually in phpMyAdmin
--
-- This migration removes 2 notification preference fields:
--   - weekly_summary (default: FALSE) - Overlaps with WEEKLY ScheduledReports
--   - monthly_summary (default: TRUE) - Overlaps with MONTHLY ScheduledReports
--
-- Keeps 3 functional preference fields:
--   Display (1): view_mode
--   Notification (2): email_notifications, budget_alerts
--
-- =====================================================

-- =====================================================
-- STEP 1: BACKUP VERIFICATION
-- =====================================================

SELECT COUNT(*) AS total_users_with_prefs,
       SUM(CASE WHEN weekly_summary = TRUE THEN 1 ELSE 0 END) AS users_with_weekly_enabled,
       SUM(CASE WHEN monthly_summary = TRUE THEN 1 ELSE 0 END) AS users_with_monthly_enabled
FROM user_preferences;
-- Expected: Shows user count and how many have these preferences enabled
-- NOTE: These users will need to create ScheduledReports manually if they want to continue receiving summaries

-- =====================================================
-- STEP 2: CHECK CURRENT SCHEMA (BEFORE MIGRATION)
-- =====================================================

-- Count total columns BEFORE migration
SELECT COUNT(*) AS column_count_before
FROM information_schema.columns
WHERE table_schema = 'myfinance'
  AND table_name = 'user_preferences';
-- Expected: 9 columns

-- List all columns BEFORE migration
DESCRIBE user_preferences;
-- Expected columns: id, user_id, view_mode, email_notifications, budget_alerts,
--                   weekly_summary, monthly_summary, created_at, updated_at

-- =====================================================
-- STEP 3: CHECK WHICH COLUMNS EXIST
-- =====================================================

-- Verify the two columns we're about to drop exist
SELECT column_name
FROM information_schema.columns
WHERE table_schema = 'myfinance'
  AND table_name = 'user_preferences'
  AND column_name IN ('weekly_summary', 'monthly_summary')
ORDER BY column_name;
-- Expected: 2 rows (weekly_summary, monthly_summary)

-- =====================================================
-- STEP 4: DROP REDUNDANT COLUMNS
-- =====================================================

-- Remove weekly_summary column
ALTER TABLE user_preferences DROP COLUMN IF EXISTS weekly_summary;

-- Remove monthly_summary column
ALTER TABLE user_preferences DROP COLUMN IF EXISTS monthly_summary;

-- =====================================================
-- STEP 5: VERIFICATION QUERIES
-- =====================================================

-- Count columns AFTER migration
SELECT COUNT(*) AS column_count_after
FROM information_schema.columns
WHERE table_schema = 'myfinance'
  AND table_name = 'user_preferences';
-- Expected: 7 columns (was 9)

-- Show structure AFTER migration
DESCRIBE user_preferences;
-- Expected: 7 rows (id, user_id, view_mode, email_notifications, budget_alerts, created_at, updated_at)

-- Verify data integrity - no records lost
SELECT COUNT(*) AS total_records FROM user_preferences;
-- Expected: Same count as STEP 1

-- Verify remaining columns have data
SELECT id, user_id, view_mode, email_notifications, budget_alerts, created_at, updated_at
FROM user_preferences
LIMIT 5;
-- Expected: All rows should have data

-- Verify foreign key still exists
SHOW CREATE TABLE user_preferences;
-- Expected: Should show FOREIGN KEY (user_id) REFERENCES users(id)

-- =====================================================
-- STEP 6: FINAL VALIDATION
-- =====================================================

-- Check dropped columns are gone
SELECT COUNT(*) AS dropped_columns_remaining
FROM information_schema.columns
WHERE table_schema = 'myfinance'
  AND table_name = 'user_preferences'
  AND column_name IN ('weekly_summary', 'monthly_summary');
-- Expected: 0 (all dropped columns removed)

-- Check functional columns exist
SELECT COUNT(*) AS functional_columns_count
FROM information_schema.columns
WHERE table_schema = 'myfinance'
  AND table_name = 'user_preferences'
  AND column_name IN ('view_mode', 'email_notifications', 'budget_alerts');
-- Expected: 3 (all functional columns exist)

-- Comprehensive validation check
SELECT
    (SELECT COUNT(*) FROM information_schema.columns
     WHERE table_schema = 'myfinance' AND table_name = 'user_preferences') AS total_columns,
    (SELECT COUNT(*) FROM information_schema.columns
     WHERE table_schema = 'myfinance' AND table_name = 'user_preferences'
     AND column_name IN ('view_mode','email_notifications','budget_alerts')) AS functional_fields,
    (SELECT COUNT(*) FROM information_schema.columns
     WHERE table_schema = 'myfinance' AND table_name = 'user_preferences'
     AND column_name IN ('weekly_summary','monthly_summary')) AS dropped_fields,
    (SELECT COUNT(*) FROM user_preferences) AS total_records;
-- Expected: total_columns=7, functional_fields=3, dropped_fields=0, total_records=X

-- =====================================================
-- SUCCESS CRITERIA CHECKLIST
-- =====================================================
--
-- All these should be TRUE after migration:
--
-- ✓ Total columns = 7 (from 9)
-- ✓ Functional fields = 3 (view_mode, email_notifications, budget_alerts)
-- ✓ Dropped fields = 0 (no weekly_summary, no monthly_summary)
-- ✓ Total records unchanged (same as STEP 1)
-- ✓ Foreign key constraint still exists
-- ✓ DESCRIBE shows exactly 7 rows
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
--     ADD COLUMN weekly_summary BOOLEAN DEFAULT FALSE AFTER budget_alerts,
--     ADD COLUMN monthly_summary BOOLEAN DEFAULT TRUE AFTER weekly_summary;
--
-- Note: Rollback restores column structure with default values,
-- but original user preference data is permanently lost.
--
-- =====================================================

-- =====================================================
-- MIGRATION SUMMARY
-- =====================================================
--
-- Before: 9 columns
-- After:  7 columns
--
-- Removed Columns (2):
--   Notification: weekly_summary, monthly_summary
--
-- Kept Columns (3 functional):
--   1. view_mode - Controls budget view display (usage vs basic)
--   2. email_notifications - Master email switch
--   3. budget_alerts - Budget threshold alert emails
--
-- Impact:
--   - Database: 22% column reduction (9 → 7)
--   - Code: ~630+ lines removed (2 schedulers + 2 email templates + logic)
--   - UX: Users must use ScheduledReports for periodic summaries
--
-- Replacement Feature:
--   Users can create custom schedules via Reports → Scheduled Reports:
--   - WEEKLY frequency (replaces weeklySummary)
--   - MONTHLY frequency (replaces monthlySummary)
--   - With superior features: PDF/CSV, flexible timing, execution tracking
--
-- =====================================================
-- END OF MIGRATION
-- =====================================================
