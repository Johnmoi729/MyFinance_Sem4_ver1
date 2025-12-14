-- =====================================================
-- DATABASE VERIFICATION QUERIES
-- User Preferences Cleanup - December 13, 2025
-- =====================================================
--
-- Run these queries in phpMyAdmin to verify your database
-- is in the correct state after cleanup
--
-- =====================================================

-- =====================================================
-- SECTION 1: BEFORE MIGRATION - Current State Check
-- =====================================================

-- Query 1: Check current column count
SELECT COUNT(*) AS current_column_count
FROM information_schema.columns
WHERE table_schema = DATABASE()
  AND table_name = 'user_preferences';
-- EXPECTED BEFORE MIGRATION: 18-21 columns (depending on your current state)
-- EXPECTED AFTER MIGRATION: 10 columns

-- Query 2: List all current columns with their types
SELECT
    ordinal_position AS position,
    column_name AS column_name,
    data_type AS type,
    column_default AS default_value,
    is_nullable AS nullable
FROM information_schema.columns
WHERE table_schema = DATABASE()
  AND table_name = 'user_preferences'
ORDER BY ordinal_position;
-- EXPECTED BEFORE MIGRATION: Should see language, currency, date_format, timezone, theme, items_per_page, etc.
-- EXPECTED AFTER MIGRATION: Should only see id, user_id, view_mode, email_notifications, budget_alerts, weekly_summary, monthly_summary, created_at, updated_at

-- Query 3: Count total user preferences records
SELECT
    COUNT(*) AS total_preferences,
    COUNT(DISTINCT user_id) AS unique_users
FROM user_preferences;
-- EXPECTED: This number should NOT change after migration (same before and after)

-- Query 4: Sample data BEFORE migration
SELECT * FROM user_preferences LIMIT 3;
-- EXPECTED BEFORE: Will show all columns including language, currency, etc.
-- EXPECTED AFTER: Will show only 10 columns (id, user_id, 5 preferences, timestamps)

-- =====================================================
-- SECTION 2: CHECK IF MIGRATION IS NEEDED
-- =====================================================

-- Query 5: Check if old columns still exist
SELECT
    CASE
        WHEN COUNT(*) > 0 THEN 'MIGRATION NEEDED - Old columns still exist'
        ELSE 'MIGRATION ALREADY DONE - Old columns removed'
    END AS migration_status,
    GROUP_CONCAT(column_name) AS old_columns_found
FROM information_schema.columns
WHERE table_schema = DATABASE()
  AND table_name = 'user_preferences'
  AND column_name IN (
      'language', 'currency', 'date_format', 'timezone',
      'theme', 'items_per_page', 'transaction_reminders', 'goal_reminders',
      'profile_visibility', 'data_sharing', 'analytics_tracking'
  );
-- EXPECTED BEFORE MIGRATION: Shows "MIGRATION NEEDED" with list of old columns
-- EXPECTED AFTER MIGRATION: Shows "MIGRATION ALREADY DONE" with NULL old_columns_found

-- Query 6: Check if new structure exists (5 functional fields)
SELECT
    CASE
        WHEN COUNT(*) = 5 THEN 'CORRECT - All 5 functional fields exist'
        WHEN COUNT(*) < 5 THEN CONCAT('ERROR - Missing ', 5 - COUNT(*), ' fields')
        ELSE CONCAT('ERROR - ', COUNT(*) - 5, ' extra fields')
    END AS structure_check,
    GROUP_CONCAT(column_name) AS functional_fields
FROM information_schema.columns
WHERE table_schema = DATABASE()
  AND table_name = 'user_preferences'
  AND column_name IN (
      'view_mode', 'email_notifications', 'budget_alerts',
      'weekly_summary', 'monthly_summary'
  );
-- EXPECTED AFTER MIGRATION: Shows "CORRECT - All 5 functional fields exist"

-- =====================================================
-- SECTION 3: AFTER MIGRATION - Verification Queries
-- =====================================================

-- Query 7: Verify exact column count and names
SELECT
    COUNT(*) AS total_columns,
    GROUP_CONCAT(column_name ORDER BY ordinal_position) AS all_columns
FROM information_schema.columns
WHERE table_schema = DATABASE()
  AND table_name = 'user_preferences';
-- EXPECTED AFTER MIGRATION:
-- total_columns = 10
-- all_columns = id,user_id,view_mode,email_notifications,budget_alerts,weekly_summary,monthly_summary,created_at,updated_at,<index column if exists>

-- Query 8: Verify no data loss (record count unchanged)
SELECT
    COUNT(*) AS total_records,
    COUNT(CASE WHEN view_mode IS NOT NULL THEN 1 END) AS with_view_mode,
    COUNT(CASE WHEN email_notifications IS NOT NULL THEN 1 END) AS with_email_notif,
    COUNT(CASE WHEN created_at IS NOT NULL THEN 1 END) AS with_created_at
FROM user_preferences;
-- EXPECTED: total_records should match Query 3 result (no records lost)
-- EXPECTED: All counts should equal total_records (all fields have data)

-- Query 9: Verify default values are working
SELECT
    view_mode,
    email_notifications,
    budget_alerts,
    weekly_summary,
    monthly_summary,
    COUNT(*) AS count
FROM user_preferences
GROUP BY view_mode, email_notifications, budget_alerts, weekly_summary, monthly_summary
ORDER BY count DESC;
-- EXPECTED: Most common combination should be defaults:
-- view_mode = 'detailed', email_notifications = TRUE, budget_alerts = TRUE,
-- weekly_summary = FALSE, monthly_summary = TRUE

-- Query 10: Check foreign key constraint still exists
SELECT
    constraint_name,
    referenced_table_name,
    referenced_column_name
FROM information_schema.key_column_usage
WHERE table_schema = DATABASE()
  AND table_name = 'user_preferences'
  AND referenced_table_name IS NOT NULL;
-- EXPECTED: Should show foreign key to users(id) with ON DELETE CASCADE

-- Query 11: Verify table structure matches expected
DESCRIBE user_preferences;
-- EXPECTED OUTPUT (10 rows):
-- +---------------------+------------+------+-----+---------------------+-------+
-- | Field               | Type       | Null | Key | Default             | Extra |
-- +---------------------+------------+------+-----+---------------------+-------+
-- | id                  | bigint     | NO   | PRI | NULL                | auto_increment |
-- | user_id             | bigint     | NO   | UNI | NULL                |       |
-- | view_mode           | varchar(20)| YES  |     | detailed            |       |
-- | email_notifications | tinyint(1) | YES  |     | 1                   |       |
-- | budget_alerts       | tinyint(1) | YES  |     | 1                   |       |
-- | weekly_summary      | tinyint(1) | YES  |     | 0                   |       |
-- | monthly_summary     | tinyint(1) | YES  |     | 1                   |       |
-- | created_at          | timestamp  | NO   |     | CURRENT_TIMESTAMP   |       |
-- | updated_at          | timestamp  | NO   |     | CURRENT_TIMESTAMP   | on update CURRENT_TIMESTAMP |
-- +---------------------+------------+------+-----+---------------------+-------+

-- =====================================================
-- SECTION 4: DATA INTEGRITY CHECKS
-- =====================================================

-- Query 12: Check for orphaned preferences (user_id not in users table)
SELECT
    COUNT(*) AS orphaned_preferences
FROM user_preferences up
LEFT JOIN users u ON up.user_id = u.id
WHERE u.id IS NULL;
-- EXPECTED: 0 (no orphaned records)

-- Query 13: Check for users without preferences
SELECT
    COUNT(*) AS users_without_preferences
FROM users u
LEFT JOIN user_preferences up ON u.id = up.user_id
WHERE up.id IS NULL;
-- EXPECTED: Could be > 0 if new users haven't logged in yet (acceptable)

-- Query 14: Validate preference values are within expected ranges
SELECT
    'view_mode' AS field_name,
    view_mode AS value,
    COUNT(*) AS count
FROM user_preferences
GROUP BY view_mode
UNION ALL
SELECT
    'email_notifications',
    CASE email_notifications WHEN TRUE THEN 'TRUE' ELSE 'FALSE' END,
    COUNT(*)
FROM user_preferences
GROUP BY email_notifications
UNION ALL
SELECT
    'budget_alerts',
    CASE budget_alerts WHEN TRUE THEN 'TRUE' ELSE 'FALSE' END,
    COUNT(*)
FROM user_preferences
GROUP BY budget_alerts
UNION ALL
SELECT
    'weekly_summary',
    CASE weekly_summary WHEN TRUE THEN 'TRUE' ELSE 'FALSE' END,
    COUNT(*)
FROM user_preferences
GROUP BY weekly_summary
UNION ALL
SELECT
    'monthly_summary',
    CASE monthly_summary WHEN TRUE THEN 'TRUE' ELSE 'FALSE' END,
    COUNT(*)
FROM user_preferences
GROUP BY monthly_summary
ORDER BY field_name, value;
-- EXPECTED:
-- view_mode should be 'detailed' or 'compact'
-- Boolean fields should be TRUE or FALSE only

-- =====================================================
-- SECTION 5: COMPREHENSIVE VALIDATION REPORT
-- =====================================================

-- Query 15: Single comprehensive validation query
SELECT
    'Database Validation Report' AS report_name,
    (SELECT COUNT(*) FROM information_schema.columns
     WHERE table_schema = DATABASE() AND table_name = 'user_preferences') AS total_columns,
    (SELECT COUNT(*) FROM user_preferences) AS total_records,
    (SELECT COUNT(DISTINCT user_id) FROM user_preferences) AS unique_users,
    (SELECT COUNT(*) FROM information_schema.columns
     WHERE table_schema = DATABASE() AND table_name = 'user_preferences'
     AND column_name IN ('view_mode','email_notifications','budget_alerts','weekly_summary','monthly_summary')) AS functional_fields_count,
    (SELECT COUNT(*) FROM information_schema.columns
     WHERE table_schema = DATABASE() AND table_name = 'user_preferences'
     AND column_name IN ('language','currency','date_format','timezone','theme','items_per_page','transaction_reminders','goal_reminders')) AS old_fields_count,
    CASE
        WHEN (SELECT COUNT(*) FROM information_schema.columns
              WHERE table_schema = DATABASE() AND table_name = 'user_preferences') = 10
        AND (SELECT COUNT(*) FROM information_schema.columns
             WHERE table_schema = DATABASE() AND table_name = 'user_preferences'
             AND column_name IN ('view_mode','email_notifications','budget_alerts','weekly_summary','monthly_summary')) = 5
        AND (SELECT COUNT(*) FROM information_schema.columns
             WHERE table_schema = DATABASE() AND table_name = 'user_preferences'
             AND column_name IN ('language','currency','date_format','timezone','theme','items_per_page','transaction_reminders','goal_reminders')) = 0
        THEN '✅ MIGRATION SUCCESSFUL'
        ELSE '❌ MIGRATION NEEDED OR INCOMPLETE'
    END AS migration_status;

-- EXPECTED AFTER SUCCESSFUL MIGRATION:
-- total_columns = 10
-- functional_fields_count = 5
-- old_fields_count = 0
-- migration_status = '✅ MIGRATION SUCCESSFUL'

-- =====================================================
-- QUICK COPY-PASTE VALIDATION (Run this single query)
-- =====================================================

-- Query 16: Quick validation (copy-paste friendly)
SELECT
    CONCAT('Total Columns: ',
        (SELECT COUNT(*) FROM information_schema.columns
         WHERE table_schema = DATABASE() AND table_name = 'user_preferences'),
        ' (Expected: 10)') AS check_1,
    CONCAT('Functional Fields: ',
        (SELECT COUNT(*) FROM information_schema.columns
         WHERE table_schema = DATABASE() AND table_name = 'user_preferences'
         AND column_name IN ('view_mode','email_notifications','budget_alerts','weekly_summary','monthly_summary')),
        ' (Expected: 5)') AS check_2,
    CONCAT('Old Fields: ',
        (SELECT COUNT(*) FROM information_schema.columns
         WHERE table_schema = DATABASE() AND table_name = 'user_preferences'
         AND column_name IN ('language','currency','date_format','timezone','theme','items_per_page','transaction_reminders','goal_reminders')),
        ' (Expected: 0)') AS check_3,
    CONCAT('Total Records: ',
        (SELECT COUNT(*) FROM user_preferences)) AS check_4;

-- =====================================================
-- END OF VERIFICATION QUERIES
-- =====================================================
