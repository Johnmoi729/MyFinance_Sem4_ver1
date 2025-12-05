-- Migration: Remove Multi-Currency Support
-- Purpose: Simplify to VND-only by removing currency-related columns
-- Date: 2025-12-05
-- WARNING: This migration will permanently remove multi-currency data. Ensure backup exists before running.

-- Drop currency-related columns from transactions table
ALTER TABLE transactions
    DROP COLUMN IF EXISTS currency_code,
    DROP COLUMN IF EXISTS amount_in_base_currency;

-- Drop currency-related columns from budgets table
ALTER TABLE budgets
    DROP COLUMN IF EXISTS currency_code,
    DROP COLUMN IF EXISTS budget_amount_in_base_currency;

-- Drop currencies table
DROP TABLE IF EXISTS currencies;

-- Add comments for clarity
ALTER TABLE transactions
    MODIFY COLUMN amount DECIMAL(12,2) NOT NULL COMMENT 'Transaction amount in VND';

ALTER TABLE budgets
    MODIFY COLUMN budget_amount DECIMAL(12,2) NOT NULL COMMENT 'Budget amount in VND';
