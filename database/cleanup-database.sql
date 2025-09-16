-- Cleanup script to remove failed category insertions
-- Run this in phpMyAdmin to clean up the foreign key constraint violations

USE myfinance;

-- Remove any categories that were inserted with user_id = 0
DELETE FROM categories WHERE user_id = 0;

-- Verify cleanup
SELECT COUNT(*) as category_count FROM categories;
SELECT COUNT(*) as user_count FROM users;

-- Show table structure to verify everything is correct
DESCRIBE users;
DESCRIBE categories;
DESCRIBE transactions;