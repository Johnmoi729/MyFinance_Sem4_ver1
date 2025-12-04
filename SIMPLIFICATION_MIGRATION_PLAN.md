# MyFinance Simplification Migration Plan - Option A

**Date**: November 11, 2025
**Migration Type**: MAJOR REFACTORING - Remove Multi-Currency + Simplify Preferences
**Risk Level**: 🔴 HIGH (requires careful execution)
**Estimated Time**: 2-3 days
**Rollback Complexity**: MEDIUM (database backup + code revert)

---

## ⚠️ CRITICAL SAFETY MEASURES

### **BEFORE STARTING - MANDATORY BACKUPS**

1. **Database Backup** (CRITICAL):
```bash
# From MySQL command line or phpMyAdmin
mysqldump -u root myfinance > backup_before_simplification_$(date +%Y%m%d_%H%M%S).sql

# Alternative: Export from phpMyAdmin
# Database: myfinance > Export > Custom > SQL format > GO
```

2. **Code Backup** (CRITICAL):
```bash
# Create a Git branch for this migration
git checkout -b backup-before-simplification
git add .
git commit -m "BACKUP: Complete state before Option A simplification"
git tag backup-v1.0-with-multicurrency

# Create new working branch
git checkout -b feature/simplification-option-a
```

3. **Full Project Backup** (RECOMMENDED):
```bash
# Copy entire project folder
cp -r "D:\P1\Java_Project_Collections\MyFinance-Project" "D:\P1\Java_Project_Collections\MyFinance-Project-BACKUP-$(date +%Y%m%d)"
```

---

## 📊 COMPREHENSIVE DEPENDENCY ANALYSIS

### **Part 1: Multi-Currency System Dependencies**

#### **Backend Files (12 files affected)**

| # | File | Type | Lines Affected | Risk | Action |
|---|------|------|----------------|------|--------|
| 1 | `Currency.java` | Entity | 74 lines | LOW | DELETE entire file |
| 2 | `CurrencyRepository.java` | Repository | ~20 lines | LOW | DELETE entire file |
| 3 | `CurrencyService.java` | Service | 163 lines | LOW | DELETE entire file |
| 4 | `CurrencyController.java` | Controller | ~50 lines | LOW | DELETE entire file |
| 5 | `DataInitializer.java` | Config | 27 lines | LOW | DELETE entire file |
| 6 | `Transaction.java` | Entity | Lines 38-42 | MEDIUM | MODIFY - remove 2 fields |
| 7 | `Budget.java` | Entity | Lines 39-43 | MEDIUM | MODIFY - remove 2 fields |
| 8 | `TransactionRequest.java` | DTO | ~2 lines | LOW | MODIFY - remove currencyCode field |
| 9 | `TransactionResponse.java` | DTO | ~2 lines | LOW | MODIFY - remove currencyCode/amountInBaseCurrency |
| 10 | `BudgetRequest.java` | DTO | ~2 lines | LOW | MODIFY - remove currencyCode field |
| 11 | `BudgetResponse.java` | DTO | ~2 lines | LOW | MODIFY - remove currencyCode/budgetAmountInBaseCurrency |
| 12 | `TransactionService.java` | Service | Lines 55-59, 115-119 | MEDIUM | MODIFY - remove conversion logic |
| 13 | `BudgetService.java` | Service | Lines 130-134, 174-178 | MEDIUM | MODIFY - remove conversion logic |
| 14 | `BudgetRepository.java` | Repository | No changes needed | NONE | ✅ Already using correct fields after today's fixes |

**Total Backend Impact**: 5 deletions, 9 modifications

#### **Frontend Files (25 files affected)**

| # | File | Type | Lines Affected | Risk | Action |
|---|------|------|----------------|------|--------|
| 1 | `CurrencySelector.js` | Component | 102 lines | LOW | DELETE entire file |
| 2 | `currencyFormatter.js` | Utility | 259 lines | MEDIUM | SIMPLIFY to VND-only (keep formatCurrency function) |
| 3 | `AddTransactionPage.js` | Page | Lines 5, 18, 77, 163-167 | LOW | REMOVE CurrencySelector import & usage |
| 4 | `EditTransactionPage.js` | Page | Lines 5, 19, 41, 197-201 | LOW | REMOVE CurrencySelector import & usage |
| 5 | `TransactionsPage.js` | Page | Lines 420, 422-426 | LOW | REMOVE multi-currency display logic |
| 6 | `AddBudgetPage.js` | Page | ~5 lines | LOW | REMOVE CurrencySelector import & usage |
| 7 | `EditBudgetPage.js` | Page | ~5 lines | LOW | REMOVE CurrencySelector import & usage |
| 8 | `BudgetsPage.js` | Page | ~3 lines | LOW | REMOVE multi-currency display logic |
| 9 | `PreferencesContext.js` | Context | Lines using getCurrency() | MEDIUM | REMOVE getCurrency(), keep hardcoded VND |
| 10 | `UserPreferencesPage.js` | Page | Currency section | LOW | REMOVE currency dropdown from UI |
| 11-25 | Other report/chart files | Various | useCurrencyFormatter() calls | LOW | CHANGE to hardcoded VND formatting |

**Total Frontend Impact**: 2 deletions, 23 modifications

#### **Database Impact**

| Table | Column | Action | Risk | Data Loss? |
|-------|--------|--------|------|------------|
| `currencies` | ALL | DROP TABLE | LOW | YES - but can be recreated from init data |
| `transactions` | `currency_code` | DROP COLUMN | MEDIUM | YES - but all existing data is VND |
| `transactions` | `amount_in_base_currency` | DROP COLUMN | MEDIUM | YES - but redundant with amount |
| `budgets` | `currency_code` | DROP COLUMN | MEDIUM | YES - but all existing data is VND |
| `budgets` | `budget_amount_in_base_currency` | DROP COLUMN | MEDIUM | YES - but redundant with budget_amount |

**Total Database Impact**: 1 table dropped, 4 columns dropped

---

### **Part 2: User Preferences Simplification Dependencies**

#### **Preferences to Remove (7 fields)**

| Field | Type | Currently Used? | Impact of Removal |
|-------|------|----------------|-------------------|
| `currency` | Display | ✅ YES (formatters) | MEDIUM - need to hardcode VND |
| `dateFormat` | Display | ✅ YES (formatters) | LOW - hardcode dd/MM/yyyy |
| `language` | Display | ❌ NO | NONE |
| `timezone` | Display | ❌ NO | NONE |
| `itemsPerPage` | Display | ❌ NO | NONE |
| `transactionReminders` | Notification | ❌ NO | NONE |
| `goalReminders` | Notification | ❌ NO | NONE |

#### **Preferences to Keep (6 fields)**

| Field | Type | Usage | Critical? |
|-------|------|-------|-----------|
| `theme` | Display | ThemeToggle component | ✅ YES - dark mode |
| `viewMode` | Display | BudgetsPage list toggle | ✅ YES - UX feature |
| `emailNotifications` | Notification | EmailService master switch | ✅ YES - email system |
| `budgetAlerts` | Notification | EmailService budget emails | ✅ YES - budget feature |
| `monthlySummary` | Notification | EmailService monthly emails | ✅ YES - reporting |
| `weeklySummary` | Notification | EmailService weekly emails | ✅ YES - reporting |

#### **Backend Files (5 files affected)**

| File | Lines to Remove | Risk | Action |
|------|----------------|------|--------|
| `UserPreferences.java` | Lines 24-34, 40-44, 52-54, 61-62 | LOW | REMOVE 7 field declarations |
| `UserPreferencesRequest.java` | ~7 fields | LOW | REMOVE 7 field declarations |
| `UserPreferencesResponse.java` | ~7 fields | LOW | REMOVE 7 field declarations |
| `UserPreferencesService.java` | Field setters in 3 methods | LOW | REMOVE null checks for 7 fields |
| `EmailService.java` | Lines 65-66 (transactionReminders, goalReminders) | LOW | REMOVE from switch statement |

#### **Frontend Files (4 files affected)**

| File | Changes | Risk | Action |
|------|---------|------|--------|
| `PreferencesContext.js` | Remove 7 helper methods | MEDIUM | REMOVE getLanguage, getDateFormat, etc. |
| `UserPreferencesPage.js` | Remove 1 section + 7 form fields | LOW | SIMPLIFY UI to 2 sections |
| `dateFormatter.js` | Entire file (347 lines) | LOW | DELETE - hardcode dd/MM/yyyy everywhere |
| `currencyFormatter.js` | Already handled above | - | - |

#### **Database Impact**

| Table | Columns to Drop | Risk |
|-------|----------------|------|
| `user_preferences` | 7 columns | LOW |

---

## 🗂️ DETAILED MIGRATION STEPS

### **Phase 1: Preparation & Verification** (30 minutes)

**Step 1.1: Create Backups**
```bash
# 1. Database backup
mysqldump -u root myfinance > backup_myfinance_$(date +%Y%m%d_%H%M%S).sql

# 2. Git backup
git checkout -b backup-before-simplification
git add .
git commit -m "BACKUP: Complete state before simplification"
git tag backup-multicurrency-v1.0

# 3. Create working branch
git checkout -b feature/simplification-option-a
```

**Step 1.2: Verify Current State**
- ✅ Backend compiles successfully
- ✅ Frontend runs without errors
- ✅ Database connection works
- ✅ No uncommitted changes

**Step 1.3: Document Current Data State**
```sql
-- Check existing data
SELECT COUNT(*) FROM transactions WHERE currency_code != 'VND';
SELECT COUNT(*) FROM budgets WHERE currency_code != 'VND';
SELECT COUNT(*) FROM user_preferences WHERE currency != 'VND';

-- Save results - if any non-VND data exists, we need special handling
```

---

### **Phase 2: Backend - Remove Currency System** (2-3 hours)

**EXECUTION ORDER (CRITICAL - must follow this order)**:

#### **Step 2.1: Remove Currency-Related Files** (LOW RISK)
Delete these 5 files in order:

1. ✅ **DELETE**: `MyFinance Backend/src/main/java/com/myfinance/controller/CurrencyController.java`
2. ✅ **DELETE**: `MyFinance Backend/src/main/java/com/myfinance/config/DataInitializer.java`
3. ✅ **DELETE**: `MyFinance Backend/src/main/java/com/myfinance/service/CurrencyService.java`
4. ✅ **DELETE**: `MyFinance Backend/src/main/java/com/myfinance/repository/CurrencyRepository.java`
5. ✅ **DELETE**: `MyFinance Backend/src/main/java/com/myfinance/entity/Currency.java`

**Verification after deletions**:
```bash
cd "MyFinance Backend"
# Should show compilation errors (expected)
mvn clean compile
```

#### **Step 2.2: Update Entity Classes** (MEDIUM RISK)

**File 1: `Transaction.java`**
```java
// BEFORE (Lines 38-42):
@Column(name = "currency_code", length = 3)
private String currencyCode = "VND"; // Default currency

@Column(name = "amount_in_base_currency", precision = 12, scale = 2)
private BigDecimal amountInBaseCurrency;

// AFTER: DELETE these 4 lines completely
// Just have the amount field (already exists)
```

**File 2: `Budget.java`**
```java
// BEFORE (Lines 39-43):
@Column(name = "currency_code", length = 3)
private String currencyCode = "VND"; // Default currency

@Column(name = "budget_amount_in_base_currency", precision = 12, scale = 2)
private BigDecimal budgetAmountInBaseCurrency;

// AFTER: DELETE these 4 lines completely
// Just have the budgetAmount field (already exists)
```

**Verification**:
- Transaction.java: Should have ~68 lines (down from 72)
- Budget.java: Should have ~82 lines (down from 86)

#### **Step 2.3: Update DTO Classes** (LOW RISK)

**File 3: `TransactionRequest.java`**
```java
// REMOVE:
private String currencyCode;
```

**File 4: `TransactionResponse.java`**
```java
// REMOVE:
private String currencyCode;
private BigDecimal amountInBaseCurrency;
```

**File 5: `BudgetRequest.java`**
```java
// REMOVE:
private String currencyCode;
```

**File 6: `BudgetResponse.java`**
```java
// REMOVE:
private String currencyCode;
private BigDecimal budgetAmountInBaseCurrency;
```

#### **Step 2.4: Update Service Classes** (MEDIUM RISK)

**File 7: `TransactionService.java`**

**Location 1** (Lines 55-59 - createTransaction):
```java
// BEFORE:
String currencyCode = request.getCurrencyCode() != null ? request.getCurrencyCode() : "VND";
transaction.setCurrencyCode(currencyCode);
transaction.setAmountInBaseCurrency(
    currencyService.convertToBaseCurrency(request.getAmount(), currencyCode)
);

// AFTER: DELETE these 4 lines
// Amount is already set from request, no conversion needed
```

**Location 2** (Lines 115-119 - updateTransaction):
```java
// BEFORE:
String currencyCode = request.getCurrencyCode() != null ? request.getCurrencyCode() : "VND";
transaction.setCurrencyCode(currencyCode);
transaction.setAmountInBaseCurrency(
    currencyService.convertToBaseCurrency(request.getAmount(), currencyCode)
);

// AFTER: DELETE these 4 lines
```

**Also REMOVE**:
```java
// Line 8 or similar - Remove this import:
import com.myfinance.service.CurrencyService;

// Remove this field injection:
private final CurrencyService currencyService;
```

**File 8: `BudgetService.java`**

**Location 1** (Lines 130-134 - createBudget):
```java
// BEFORE:
String currencyCode = request.getCurrencyCode() != null ? request.getCurrencyCode() : "VND";
budget.setCurrencyCode(currencyCode);
budget.setBudgetAmountInBaseCurrency(
    currencyService.convertToBaseCurrency(request.getBudgetAmount(), currencyCode)
);

// AFTER: DELETE these 4 lines
```

**Location 2** (Lines 174-178 - updateBudget):
```java
// BEFORE:
String currencyCode = request.getCurrencyCode() != null ? request.getCurrencyCode() : "VND";
budget.setCurrencyCode(currencyCode);
budget.setBudgetAmountInBaseCurrency(
    currencyService.convertToBaseCurrency(request.getBudgetAmount(), currencyCode)
);

// AFTER: DELETE these 4 lines
```

**Also REMOVE**:
```java
// Remove this import:
import com.myfinance.service.CurrencyService;

// Remove this field injection:
private final CurrencyService currencyService;
```

#### **Step 2.5: Verify Backend Compilation** (CRITICAL)
```bash
cd "MyFinance Backend"
mvn clean compile

# Expected result: COMPILATION SUCCESS
# If errors, check for missed CurrencyService references
```

---

### **Phase 3: Frontend - Remove Currency System** (2-3 hours)

**EXECUTION ORDER**:

#### **Step 3.1: Delete CurrencySelector Component** (LOW RISK)
```bash
# Delete the file
rm myfinance-frontend/src/components/common/CurrencySelector.js
```

#### **Step 3.2: Simplify currencyFormatter.js** (MEDIUM RISK)

**File: `myfinance-frontend/src/utils/currencyFormatter.js`**

**BEFORE**: 259 lines with 10 currencies
**AFTER**: ~50 lines with VND only

```javascript
/**
 * Currency formatter - VND only (Simplified)
 * Hardcoded to Vietnamese Dong for MyFinance Vietnamese market
 */

/**
 * Format an amount in VND
 * @param {number|string} amount - The amount to format
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount) => {
    const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

    if (isNaN(numericAmount)) {
        return '0 ₫';
    }

    try {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(numericAmount);
    } catch (error) {
        console.error('Currency formatting error:', error);
        return `₫ ${numericAmount.toLocaleString('vi-VN')}`;
    }
};

/**
 * Get VND currency symbol
 * @returns {string} Currency symbol
 */
export const getCurrencySymbol = () => {
    return '₫';
};

/**
 * Format a number without currency symbol
 * @param {number|string} amount - The amount to format
 * @returns {string} Formatted number string
 */
export const formatNumber = (amount) => {
    const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

    if (isNaN(numericAmount)) {
        return '0';
    }

    return numericAmount.toLocaleString('vi-VN');
};

/**
 * Parse a formatted currency string to a number
 * @param {string} formattedAmount - Formatted currency string
 * @returns {number} Numeric amount
 */
export const parseCurrency = (formattedAmount) => {
    if (typeof formattedAmount === 'number') {
        return formattedAmount;
    }

    if (!formattedAmount || typeof formattedAmount !== 'string') {
        return 0;
    }

    const cleaned = formattedAmount.replace(/[^\d.-]/g, '');
    const parsed = parseFloat(cleaned);

    return isNaN(parsed) ? 0 : parsed;
};

// Export all functions
export default {
    formatCurrency,
    getCurrencySymbol,
    formatNumber,
    parseCurrency
};
```

#### **Step 3.3: Update Transaction Pages** (LOW RISK)

**File: `AddTransactionPage.js`**
```javascript
// REMOVE Line 5:
import CurrencySelector from '../../components/common/CurrencySelector';

// REMOVE Line 18:
currencyCode: getCurrency() || 'VND'

// Just use:
// No currencyCode field needed

// REMOVE Lines 163-167 (CurrencySelector component):
<CurrencySelector
    value={formData.currencyCode}
    onChange={(currency) => setFormData(prev => ({ ...prev, currencyCode: currency }))}
    required={true}
/>
```

**File: `EditTransactionPage.js`**
```javascript
// Same removals as AddTransactionPage.js
// REMOVE: CurrencySelector import
// REMOVE: currencyCode from formData
// REMOVE: CurrencySelector component from JSX
```

**File: `TransactionsPage.js`**
```javascript
// REMOVE Lines 420-426 (multi-currency display):
{/* BEFORE: */}
<span className={`text-sm font-semibold ${getTransactionTypeColor(transaction.type)}`}>
    {transaction.type === 'EXPENSE' ? '-' : '+'}
    {formatCurrency(transaction.amount, transaction.currencyCode || getCurrency())}
</span>
{transaction.currencyCode && transaction.currencyCode !== getCurrency() && transaction.amountInBaseCurrency && (
    <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
        ≈ {formatCurrency(transaction.amountInBaseCurrency, 'VND')}
    </span>
)}

{/* AFTER - Simple VND-only: */}
<span className={`text-sm font-semibold ${getTransactionTypeColor(transaction.type)}`}>
    {transaction.type === 'EXPENSE' ? '-' : '+'}
    {formatCurrency(transaction.amount)}
</span>
```

#### **Step 3.4: Update Budget Pages** (LOW RISK)

**File: `AddBudgetPage.js`**
- Same changes as AddTransactionPage.js
- Remove CurrencySelector import and component

**File: `EditBudgetPage.js`**
- Same changes as EditTransactionPage.js
- Remove CurrencySelector import and component

**File: `BudgetsPage.js`**
- Remove multi-currency display logic
- Use simple formatCurrency() calls

#### **Step 3.5: Update All Chart/Report Components** (LOW RISK)

Replace all occurrences:
```javascript
// BEFORE:
const { formatCurrency } = useCurrencyFormatter();
{formatCurrency(amount, currencyCode)}

// AFTER:
import { formatCurrency } from '../../utils/currencyFormatter';
{formatCurrency(amount)}
```

**Files to update** (search and replace):
- MonthlyReport.js
- YearlyReport.js
- CategoryReport.js
- All chart components (CategoryPieChart, EnhancedBarChart, etc.)
- BudgetProgressBar.js
- BudgetUsageCard.js
- BudgetWarningAlert.js
- BudgetOverviewWidget.js
- FinancialAnalytics.js (both user and admin)
- AdminDashboard.js

#### **Step 3.6: Update PreferencesContext** (MEDIUM RISK)

**File: `PreferencesContext.js`**
```javascript
// REMOVE these helper functions:
const getCurrency = () => { ... };
const getDateFormat = () => { ... };
const getLanguage = () => { ... };
const getTimezone = () => { ... };
const getItemsPerPage = () => { ... };
const getTransactionReminders = () => { ... };
const getGoalReminders = () => { ... };

// KEEP these:
const getTheme = () => { ... };
const getViewMode = () => { ... };
const isEmailNotificationsEnabled = () => { ... };
const isBudgetAlertsEnabled = () => { ... };
const isMonthlySummaryEnabled = () => { ... };
const isWeeklySummaryEnabled = () => { ... };
```

#### **Step 3.7: Simplify UserPreferencesPage** (LOW RISK)

**File: `UserPreferencesPage.js`**
- Remove "Display Preferences" section (7 fields)
- Keep only "Notification Preferences" section (6 fields)
- Update save handler to only send 6 fields

#### **Step 3.8: Delete dateFormatter.js** (LOW RISK)
```bash
rm myfinance-frontend/src/utils/dateFormatter.js
```

Hardcode Vietnamese date format everywhere:
```javascript
// Use this pattern:
new Date(dateString).toLocaleDateString('vi-VN');
// Or for input fields:
new Date(dateString).toISOString().split('T')[0];
```

#### **Step 3.9: Verify Frontend Compilation** (CRITICAL)
```bash
cd myfinance-frontend
npm run build

# Expected: BUILD SUCCESS
# Check for import errors or missing modules
```

---

### **Phase 4: Database Migration** (30 minutes)

**⚠️ CRITICAL: BACKUP AGAIN BEFORE DATABASE CHANGES**
```bash
mysqldump -u root myfinance > backup_before_db_migration_$(date +%Y%m%d_%H%M%S).sql
```

#### **Step 4.1: Check for Non-VND Data** (CRITICAL)
```sql
-- Check if any existing data uses non-VND currencies
SELECT
    (SELECT COUNT(*) FROM transactions WHERE currency_code IS NOT NULL AND currency_code != 'VND') as non_vnd_transactions,
    (SELECT COUNT(*) FROM budgets WHERE currency_code IS NOT NULL AND currency_code != 'VND') as non_vnd_budgets,
    (SELECT COUNT(*) FROM user_preferences WHERE currency IS NOT NULL AND currency != 'VND') as non_vnd_preferences;

-- If ANY of these are > 0, STOP and investigate
-- You may need to convert data first
```

#### **Step 4.2: Drop Currency Columns** (HIGH RISK - IRREVERSIBLE)
```sql
-- Connect to database
USE myfinance;

-- Start transaction for safety
START TRANSACTION;

-- Drop currency-related columns from transactions
ALTER TABLE transactions DROP COLUMN IF EXISTS currency_code;
ALTER TABLE transactions DROP COLUMN IF EXISTS amount_in_base_currency;

-- Drop currency-related columns from budgets
ALTER TABLE budgets DROP COLUMN IF EXISTS currency_code;
ALTER TABLE budgets DROP COLUMN IF EXISTS budget_amount_in_base_currency;

-- Drop currencies table
DROP TABLE IF EXISTS currencies;

-- Commit if everything looks good
COMMIT;

-- If something went wrong, you can:
-- ROLLBACK;
```

#### **Step 4.3: Drop Unused Preference Columns** (MEDIUM RISK)
```sql
-- Continue in same session
START TRANSACTION;

-- Drop unused preference columns
ALTER TABLE user_preferences DROP COLUMN IF EXISTS currency;
ALTER TABLE user_preferences DROP COLUMN IF EXISTS date_format;
ALTER TABLE user_preferences DROP COLUMN IF EXISTS language;
ALTER TABLE user_preferences DROP COLUMN IF EXISTS timezone;
ALTER TABLE user_preferences DROP COLUMN IF EXISTS items_per_page;
ALTER TABLE user_preferences DROP COLUMN IF EXISTS transaction_reminders;
ALTER TABLE user_preferences DROP COLUMN IF EXISTS goal_reminders;

-- Commit
COMMIT;
```

#### **Step 4.4: Verify Database Schema** (CRITICAL)
```sql
-- Check transactions table
DESCRIBE transactions;
-- Should NOT have: currency_code, amount_in_base_currency

-- Check budgets table
DESCRIBE budgets;
-- Should NOT have: currency_code, budget_amount_in_base_currency

-- Check user_preferences table
DESCRIBE user_preferences;
-- Should ONLY have: id, user_id, theme, view_mode, email_notifications,
--                   budget_alerts, monthly_summary, weekly_summary, created_at, updated_at

-- Check currencies table doesn't exist
SHOW TABLES LIKE 'currencies';
-- Should return empty result
```

---

### **Phase 5: Testing & Verification** (4-6 hours)

#### **Step 5.1: Backend Testing**
```bash
cd "MyFinance Backend"

# 1. Compile
mvn clean compile
# Expected: SUCCESS

# 2. Run application
mvn spring-boot:run
# Expected: Starts without errors

# 3. Check logs for errors
# Look for: No CurrencyService errors, no missing bean errors
```

**API Testing Checklist**:
```bash
# Test transaction creation (should work with amount only)
POST http://localhost:8080/api/transactions
{
    "categoryId": 1,
    "amount": 100000,
    "type": "EXPENSE",
    "description": "Test",
    "transactionDate": "2025-11-11"
}
# No currencyCode field needed

# Test budget creation
POST http://localhost:8080/api/budgets
{
    "categoryId": 1,
    "budgetAmount": 1000000,
    "budgetYear": 2025,
    "budgetMonth": 11,
    "description": "Test"
}
# No currencyCode field needed

# Test preferences update
PUT http://localhost:8080/api/preferences
{
    "theme": "dark",
    "viewMode": "detailed",
    "emailNotifications": true,
    "budgetAlerts": true,
    "monthlySummary": true,
    "weeklySummary": false
}
# Only 6 fields needed
```

#### **Step 5.2: Frontend Testing**
```bash
cd myfinance-frontend

# 1. Start development server
npm start
# Expected: Runs on localhost:3000 without errors

# 2. Manual testing checklist:
```

**Frontend Testing Checklist**:
- [ ] ✅ Login works
- [ ] ✅ Dashboard loads
- [ ] ✅ Add Transaction page - no currency selector shown
- [ ] ✅ Transaction list shows amounts in VND
- [ ] ✅ Edit Transaction page - no currency selector shown
- [ ] ✅ Add Budget page - no currency selector shown
- [ ] ✅ Budget list shows amounts in VND
- [ ] ✅ Edit Budget page - no currency selector shown
- [ ] ✅ Monthly Report shows VND amounts
- [ ] ✅ Yearly Report shows VND amounts
- [ ] ✅ Category Report shows VND amounts
- [ ] ✅ All charts display VND amounts
- [ ] ✅ Budget progress bars show VND
- [ ] ✅ Preferences page shows only 6 settings (2 sections)
- [ ] ✅ Theme toggle works (dark mode)
- [ ] ✅ View mode toggle works (BudgetsPage)
- [ ] ✅ Email notification settings work

#### **Step 5.3: Integration Testing**
- [ ] ✅ Create transaction → Budget usage updates correctly
- [ ] ✅ Budget alert email triggers at 75% (check with VND amounts)
- [ ] ✅ Monthly summary email generates correctly
- [ ] ✅ Reports generate correct VND amounts
- [ ] ✅ Excel export shows VND formatting
- [ ] ✅ PDF export shows VND formatting

---

### **Phase 6: Update Documentation** (1-2 hours)

#### **Step 6.1: Update CLAUDE.md**

**Changes needed**:
1. Remove Flow 6E Multi-Currency section (mark as "Removed in Simplification")
2. Update Phase 6A preferences (13 fields → 6 fields)
3. Update database schema section (remove currency columns)
4. Update API endpoints (remove currency-related endpoints)
5. Update technology stack (remove currency formatter complexity)
6. Add "Simplification History" section documenting this change

#### **Step 6.2: Update FEATURE_SIMPLIFICATION_ANALYSIS.md**

Add "Completion Status" section:
```markdown
## ✅ SIMPLIFICATION COMPLETED - [Date]

**Option Selected**: Option A - Full Simplification
**Status**: COMPLETE
**Time Taken**: [X] days
**Issues Encountered**: [None / List any]
**Rollback Required**: NO
```

#### **Step 6.3: Create SIMPLIFICATION_CHANGELOG.md**

Document all changes made in detail for future reference.

#### **Step 6.4: Update README.md**

Update any references to multi-currency support.

---

## 🔄 ROLLBACK PROCEDURE (If Something Goes Wrong)

### **If Issues Found During Testing**

**Level 1 - Code Only Rollback** (issues found before database migration):
```bash
# Discard all code changes
git checkout backup-before-simplification
git branch -D feature/simplification-option-a

# Restart migration from beginning
```

**Level 2 - Full Rollback** (issues found after database migration):
```bash
# 1. Stop backend
# Kill Spring Boot process

# 2. Restore database
mysql -u root myfinance < backup_before_simplification_[timestamp].sql

# 3. Restore code
git checkout backup-before-simplification
git branch -D feature/simplification-option-a

# 4. Verify restoration
cd "MyFinance Backend"
mvn spring-boot:run

cd myfinance-frontend
npm start
```

**Level 3 - Complete Project Restore** (catastrophic failure):
```bash
# 1. Stop all services
# 2. Delete current project folder
# 3. Restore from full project backup
# 4. Restore database from SQL backup
```

---

## 📋 POST-MIGRATION CHECKLIST

### **Immediate Actions** (within 24 hours)
- [ ] ✅ All tests passing
- [ ] ✅ No console errors in browser
- [ ] ✅ No exceptions in backend logs
- [ ] ✅ Database integrity verified
- [ ] ✅ All documentation updated
- [ ] ✅ Git commit with descriptive message
- [ ] ✅ Tag release: `git tag v2.0-simplified`

### **Follow-up Actions** (within 1 week)
- [ ] ✅ Monitor for any user-reported issues
- [ ] ✅ Performance testing (should be faster)
- [ ] ✅ Security review (less complexity = fewer vulnerabilities)
- [ ] ✅ Update deployment scripts if needed
- [ ] ✅ Create release notes for users

---

## 📊 SUCCESS CRITERIA

Migration is successful when ALL of these are true:

1. ✅ Backend compiles without errors
2. ✅ Frontend builds without errors
3. ✅ Application starts without exceptions
4. ✅ All existing VND transactions/budgets display correctly
5. ✅ New transactions/budgets can be created (VND only)
6. ✅ Budget tracking calculations are correct
7. ✅ Reports generate with correct VND amounts
8. ✅ Email notifications still work
9. ✅ Preferences page shows 6 settings only
10. ✅ Theme toggle works (dark mode)
11. ✅ No references to Currency.java or CurrencyService in codebase
12. ✅ Database has no currency columns
13. ✅ All documentation updated

---

## ⚠️ KNOWN RISKS & MITIGATION

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| Data loss from DROP COLUMN | MEDIUM | HIGH | Backup before migration, verify no non-VND data |
| Compilation errors from missed references | LOW | MEDIUM | Comprehensive grep search before starting |
| Frontend import errors | LOW | MEDIUM | Systematic file-by-file updates |
| Budget calculations broken | LOW | HIGH | Already fixed today, use budgetAmount not budgetAmountInBaseCurrency |
| Email system broken | VERY LOW | MEDIUM | EmailService doesn't use currency preferences heavily |
| User experience degraded | LOW | LOW | VND-only is actually simpler UX for Vietnamese users |

---

## 📝 NOTES FOR EXECUTION

1. **Do NOT rush** - This migration requires careful attention
2. **Follow the exact order** - Steps are sequenced to minimize breakage
3. **Test after each phase** - Don't wait until the end to test
4. **Keep backups** - Multiple backup points ensure recovery
5. **Document issues** - Note any problems encountered for future reference
6. **Ask before proceeding** - If uncertain about any step, stop and ask

---

## 🎯 ESTIMATED TIMELINE

| Phase | Time | Can Pause? | Critical? |
|-------|------|------------|-----------|
| Phase 1: Preparation | 30 min | ✅ YES | ✅ YES |
| Phase 2: Backend Currency | 2-3 hours | ✅ YES (after compilation) | ✅ YES |
| Phase 3: Frontend Currency | 2-3 hours | ✅ YES (after file updates) | ✅ YES |
| Phase 4: Database Migration | 30 min | ❌ NO (complete in one session) | 🔴 CRITICAL |
| Phase 5: Testing | 4-6 hours | ✅ YES | ✅ YES |
| Phase 6: Documentation | 1-2 hours | ✅ YES | ⚠️ MEDIUM |

**Total: 10-15 hours over 2-3 days**

---

**READY TO PROCEED?**

Before starting Phase 1, confirm:
- [ ] ✅ I have read and understood this entire plan
- [ ] ✅ I have MySQL access to create backups
- [ ] ✅ I have Git configured for branching
- [ ] ✅ I have 2-3 days available for this migration
- [ ] ✅ I am prepared to rollback if needed
- [ ] ✅ I understand this is a HIGH RISK operation

**If all checkboxes are ✅, proceed to Phase 1.**
**If any checkbox is ❌, DO NOT START until ready.**
