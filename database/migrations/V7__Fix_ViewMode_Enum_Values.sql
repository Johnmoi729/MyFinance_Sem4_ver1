-- Migration V7: Fix ViewMode Enum Values
-- Date: December 13, 2025
-- Purpose: Align viewMode values to match BudgetsPage implementation
-- Changes: 'detailed' → 'usage', 'compact' → 'basic'

-- VERIFICATION BEFORE
-- Check current view_mode values distribution
SELECT view_mode, COUNT(*) as count
FROM user_preferences
WHERE view_mode IS NOT NULL
GROUP BY view_mode;

-- Expected output might show: 'detailed', 'compact', or NULL

-- ============================================
-- UPDATE OPERATIONS
-- ============================================

-- Update 'detailed' to 'usage' (matches BudgetsPage statistics/analytics view)
UPDATE user_preferences
SET view_mode = 'usage'
WHERE view_mode = 'detailed';

-- Update 'compact' to 'basic' (matches BudgetsPage simple list view)
UPDATE user_preferences
SET view_mode = 'basic'
WHERE view_mode = 'compact';

-- Set NULL values to default 'usage'
UPDATE user_preferences
SET view_mode = 'usage'
WHERE view_mode IS NULL OR view_mode = '';

-- ============================================
-- VERIFICATION AFTER
-- ============================================

-- Verify all values are now either 'usage' or 'basic'
SELECT view_mode, COUNT(*) as count
FROM user_preferences
GROUP BY view_mode;

-- Expected output: Only 'usage' and 'basic' values
-- If you see any other values, DO NOT PROCEED - report issue

-- Verify total count unchanged
SELECT COUNT(*) as total_rows FROM user_preferences;

-- ============================================
-- NOTES
-- ============================================
-- Valid viewMode values after this migration:
--   - 'usage' = Detailed analytics view with BudgetUsageCard (default)
--   - 'basic' = Simple budget list view
--
-- Frontend changes required (already applied):
--   - UserPreferencesPage.js: Dropdown uses 'usage'/'basic'
--   - PreferencesContext.js: Default changed to 'usage'
--
-- This migration is SAFE to run multiple times (idempotent)
