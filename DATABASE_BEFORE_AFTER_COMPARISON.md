# Database Before/After Comparison - User Preferences Cleanup

**Date**: December 13, 2025
**Table**: `user_preferences`

---

## 📊 **Quick Summary**

| Metric | Before Migration | After Migration | Change |
|--------|------------------|-----------------|--------|
| **Total Columns** | 18-21 columns | 10 columns | **-52.4%** |
| **Functional Fields** | 5 fields | 5 fields | No change |
| **Non-Functional Fields** | 11 fields | 0 fields | **-100%** |
| **Data Records** | X records | X records | **No loss** |

---

## 🗄️ **Complete Column Comparison**

### ✅ **BEFORE Migration** (18-21 columns)

```
user_preferences
├── id                      BIGINT PRIMARY KEY AUTO_INCREMENT
├── user_id                 BIGINT UNIQUE NOT NULL
│
├── ❌ language              VARCHAR(10) DEFAULT 'vi'              [REMOVED - No i18n system]
├── ❌ currency              VARCHAR(10) DEFAULT 'VND'             [REMOVED - VND-only]
├── ❌ date_format           VARCHAR(20) DEFAULT 'dd/MM/yyyy'      [REMOVED - Hardcoded]
├── ❌ timezone              VARCHAR(50) DEFAULT 'Asia/Ho_Chi_Minh' [REMOVED - Never checked]
├── ❌ theme                 VARCHAR(20) DEFAULT 'light'           [REMOVED - Dark mode removed]
├── ❌ items_per_page        INT DEFAULT 10                        [REMOVED - Hardcoded to 10]
├── ✅ view_mode             VARCHAR(20) DEFAULT 'detailed'        [KEPT - Functional]
│
├── ✅ email_notifications   BOOLEAN DEFAULT TRUE                  [KEPT - Master switch]
├── ✅ budget_alerts         BOOLEAN DEFAULT TRUE                  [KEPT - Functional]
├── ❌ transaction_reminders BOOLEAN DEFAULT FALSE                 [REMOVED - Feature doesn't exist]
├── ✅ weekly_summary        BOOLEAN DEFAULT FALSE                 [KEPT - Functional]
├── ✅ monthly_summary       BOOLEAN DEFAULT TRUE                  [KEPT - Functional]
├── ❌ goal_reminders        BOOLEAN DEFAULT TRUE                  [REMOVED - Goal feature doesn't exist]
│
├── ❌ profile_visibility    VARCHAR(20) DEFAULT 'private'         [REMOVED - Privacy feature]
├── ❌ data_sharing          BOOLEAN DEFAULT FALSE                 [REMOVED - Privacy feature]
├── ❌ analytics_tracking    BOOLEAN DEFAULT TRUE                  [REMOVED - Privacy feature]
│
├── created_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP
├── updated_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
└── FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
```

**Total**: 21 columns (if privacy fields exist) or 18 columns (if privacy already removed)

---

### ✅ **AFTER Migration** (10 columns)

```
user_preferences
├── id                      BIGINT PRIMARY KEY AUTO_INCREMENT
├── user_id                 BIGINT UNIQUE NOT NULL
│
├── ✅ view_mode             VARCHAR(20) DEFAULT 'detailed'        [Controls budget view]
│
├── ✅ email_notifications   BOOLEAN DEFAULT TRUE                  [Master email switch]
├── ✅ budget_alerts         BOOLEAN DEFAULT TRUE                  [Budget alert emails]
├── ✅ weekly_summary        BOOLEAN DEFAULT FALSE                 [Weekly email summaries]
├── ✅ monthly_summary       BOOLEAN DEFAULT TRUE                  [Monthly email summaries]
│
├── created_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP
├── updated_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
└── FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
```

**Total**: 10 columns (52.4% reduction)

---

## 📋 **Field-by-Field Comparison**

| Column Name | Before | After | Status | Reason |
|-------------|--------|-------|--------|--------|
| `id` | ✅ | ✅ | **KEPT** | Primary key |
| `user_id` | ✅ | ✅ | **KEPT** | Foreign key |
| `language` | ✅ | ❌ | **REMOVED** | No i18n system implemented |
| `currency` | ✅ | ❌ | **REMOVED** | Project simplified to VND-only |
| `date_format` | ✅ | ❌ | **REMOVED** | Hardcoded to dd/MM/yyyy Vietnamese standard |
| `timezone` | ✅ | ❌ | **REMOVED** | Vietnam single timezone, never checked |
| `theme` | ✅ | ❌ | **REMOVED** | Dark mode removed from frontend (Dec 2025) |
| `items_per_page` | ✅ | ❌ | **REMOVED** | Pagination hardcoded to 10 items |
| `view_mode` | ✅ | ✅ | **KEPT** | ✅ Used in BudgetsPage.js |
| `email_notifications` | ✅ | ✅ | **KEPT** | ✅ Checked by EmailService.shouldSendEmail() |
| `budget_alerts` | ✅ | ✅ | **KEPT** | ✅ Checked by EmailService |
| `transaction_reminders` | ✅ | ❌ | **REMOVED** | Transaction reminder feature doesn't exist |
| `weekly_summary` | ✅ | ✅ | **KEPT** | ✅ Checked by WeeklySummaryScheduler |
| `monthly_summary` | ✅ | ✅ | **KEPT** | ✅ Checked by MonthlySummaryScheduler |
| `goal_reminders` | ✅ | ❌ | **REMOVED** | Goal tracking feature doesn't exist |
| `profile_visibility` | ✅ (maybe) | ❌ | **REMOVED** | Privacy feature not implemented |
| `data_sharing` | ✅ (maybe) | ❌ | **REMOVED** | Privacy feature not implemented |
| `analytics_tracking` | ✅ (maybe) | ❌ | **REMOVED** | Privacy feature not implemented |
| `created_at` | ✅ | ✅ | **KEPT** | Audit timestamp |
| `updated_at` | ✅ | ✅ | **KEPT** | Audit timestamp |
| Foreign Key | ✅ | ✅ | **KEPT** | ON DELETE CASCADE constraint |

**Summary**:
- **Removed**: 8-11 columns (depending on privacy fields)
- **Kept**: 10 columns total (5 functional preferences + 5 infrastructure)

---

## 🔍 **How to Verify Your Database**

### **Method 1: Quick Visual Check (phpMyAdmin)**

1. Open phpMyAdmin
2. Select your `myfinance` database
3. Click on `user_preferences` table
4. Click "Structure" tab
5. **Count the fields** - should be **10 total**
6. **Verify these fields exist**:
   - ✅ id
   - ✅ user_id
   - ✅ view_mode
   - ✅ email_notifications
   - ✅ budget_alerts
   - ✅ weekly_summary
   - ✅ monthly_summary
   - ✅ created_at
   - ✅ updated_at
7. **Verify these fields DON'T exist**:
   - ❌ language
   - ❌ currency
   - ❌ date_format
   - ❌ timezone
   - ❌ theme
   - ❌ items_per_page
   - ❌ transaction_reminders
   - ❌ goal_reminders

### **Method 2: SQL Query (Copy-Paste)**

Run this single query in phpMyAdmin SQL tab:

```sql
-- Quick validation query
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
```

**Expected Result**:
```
check_1: Total Columns: 10 (Expected: 10)
check_2: Functional Fields: 5 (Expected: 5)
check_3: Old Fields: 0 (Expected: 0)
check_4: Total Records: X (your user count)
```

### **Method 3: DESCRIBE Command**

Run this in phpMyAdmin SQL tab:

```sql
DESCRIBE user_preferences;
```

**Expected Result** (10 rows):
```
+---------------------+------------+------+-----+---------------------+-------+
| Field               | Type       | Null | Key | Default             | Extra |
+---------------------+------------+------+-----+---------------------+-------+
| id                  | bigint     | NO   | PRI | NULL                | auto_increment |
| user_id             | bigint     | NO   | UNI | NULL                |       |
| view_mode           | varchar(20)| YES  |     | detailed            |       |
| email_notifications | tinyint(1) | YES  |     | 1                   |       |
| budget_alerts       | tinyint(1) | YES  |     | 1                   |       |
| weekly_summary      | tinyint(1) | YES  |     | 0                   |       |
| monthly_summary     | tinyint(1) | YES  |     | 1                   |       |
| created_at          | timestamp  | NO   |     | CURRENT_TIMESTAMP   |       |
| updated_at          | timestamp  | NO   |     | CURRENT_TIMESTAMP   | on update CURRENT_TIMESTAMP |
+---------------------+------------+------+-----+---------------------+-------+
```

---

## ⚠️ **What If Your Database Doesn't Match?**

### **Scenario 1: Still see old columns (language, currency, etc.)**
**Status**: ❌ **Migration NOT run yet**

**Action**: Run the migration SQL from `database/migrations/V5__Remove_Unused_Preference_Fields.sql`

```sql
ALTER TABLE user_preferences
    DROP COLUMN language,
    DROP COLUMN currency,
    DROP COLUMN date_format,
    DROP COLUMN timezone,
    DROP COLUMN theme,
    DROP COLUMN items_per_page,
    DROP COLUMN transaction_reminders,
    DROP COLUMN goal_reminders;
```

### **Scenario 2: More than 10 columns**
**Status**: ⚠️ **Extra columns exist**

**Possible causes**:
- Privacy fields still exist (profile_visibility, data_sharing, analytics_tracking)
- Custom fields added

**Action**:
1. Run `DESCRIBE user_preferences;` to see what extra columns exist
2. If privacy fields: Add them to migration SQL and drop them too
3. If custom fields: Determine if they should be kept or removed

### **Scenario 3: Less than 10 columns**
**Status**: ❌ **Missing required fields**

**Possible causes**:
- Migration script dropped wrong columns
- Database corruption

**Action**:
1. Run rollback SQL to restore columns
2. Check your backup
3. Re-run migration carefully

### **Scenario 4: Exactly 10 columns, all correct**
**Status**: ✅ **PERFECT - Migration successful!**

**Next Steps**:
1. Test backend: `mvn spring-boot:run`
2. Test frontend: `npm run build`
3. Commit changes

---

## 📊 **Sample Data Comparison**

### **BEFORE Migration** (Sample Row)

```sql
SELECT * FROM user_preferences WHERE id = 1;
```

**Result** (18-21 columns):
```
id: 1
user_id: 1
language: 'vi'                      ← REMOVED
currency: 'VND'                     ← REMOVED
date_format: 'dd/MM/yyyy'           ← REMOVED
timezone: 'Asia/Ho_Chi_Minh'        ← REMOVED
theme: 'light'                      ← REMOVED
items_per_page: 10                  ← REMOVED
view_mode: 'detailed'               ✓ KEPT
email_notifications: TRUE           ✓ KEPT
budget_alerts: TRUE                 ✓ KEPT
transaction_reminders: FALSE        ← REMOVED
weekly_summary: FALSE               ✓ KEPT
monthly_summary: TRUE               ✓ KEPT
goal_reminders: TRUE                ← REMOVED
profile_visibility: 'private'       ← REMOVED (maybe)
data_sharing: FALSE                 ← REMOVED (maybe)
analytics_tracking: TRUE            ← REMOVED (maybe)
created_at: 2025-11-04 12:00:00
updated_at: 2025-12-13 10:00:00
```

### **AFTER Migration** (Sample Row)

```sql
SELECT * FROM user_preferences WHERE id = 1;
```

**Result** (10 columns):
```
id: 1
user_id: 1
view_mode: 'detailed'               ✓ Data preserved
email_notifications: TRUE           ✓ Data preserved
budget_alerts: TRUE                 ✓ Data preserved
weekly_summary: FALSE               ✓ Data preserved
monthly_summary: TRUE               ✓ Data preserved
created_at: 2025-11-04 12:00:00    ✓ Timestamp preserved
updated_at: 2025-12-13 10:00:00    ✓ Timestamp preserved
```

**Note**: Only columns were removed. **No data was lost** from the 5 functional fields.

---

## 🎯 **Validation Checklist**

Run through this checklist to ensure your database is correct:

### **Structure Checks**
- [ ] Total columns = 10 (run `DESCRIBE user_preferences;`)
- [ ] `view_mode` exists with DEFAULT 'detailed'
- [ ] `email_notifications` exists with DEFAULT TRUE (or 1)
- [ ] `budget_alerts` exists with DEFAULT TRUE (or 1)
- [ ] `weekly_summary` exists with DEFAULT FALSE (or 0)
- [ ] `monthly_summary` exists with DEFAULT TRUE (or 1)
- [ ] `created_at` and `updated_at` timestamps exist
- [ ] Foreign key to `users(id)` exists with ON DELETE CASCADE

### **Data Integrity Checks**
- [ ] Total record count unchanged (compare before/after)
- [ ] All `user_id` values still valid (no orphaned records)
- [ ] All functional fields have data (no NULLs where unexpected)
- [ ] Default values correct (detailed, TRUE/FALSE as expected)

### **Old Column Removal Checks**
- [ ] `language` column removed
- [ ] `currency` column removed
- [ ] `date_format` column removed
- [ ] `timezone` column removed
- [ ] `theme` column removed
- [ ] `items_per_page` column removed
- [ ] `transaction_reminders` column removed
- [ ] `goal_reminders` column removed
- [ ] Privacy columns removed (if they existed)

**All checks passed?** ✅ **Your database is ready!**

---

## 📝 **SQL Commands Summary**

```sql
-- 1. Check if migration needed
SELECT COUNT(*) FROM information_schema.columns
WHERE table_schema = DATABASE() AND table_name = 'user_preferences';
-- Expected BEFORE: 18-21 | Expected AFTER: 10

-- 2. Run migration (if needed)
ALTER TABLE user_preferences
    DROP COLUMN language,
    DROP COLUMN currency,
    DROP COLUMN date_format,
    DROP COLUMN timezone,
    DROP COLUMN theme,
    DROP COLUMN items_per_page,
    DROP COLUMN transaction_reminders,
    DROP COLUMN goal_reminders;

-- 3. Verify migration
DESCRIBE user_preferences;
-- Expected: 10 rows

-- 4. Verify data integrity
SELECT COUNT(*) FROM user_preferences;
-- Expected: Same count as before migration
```

---

**End of Comparison Document**
