# V5 Migration Instructions - User Preferences Cleanup

**File**: `V5__Remove_Unused_Preference_Fields_UNIFIED.sql`
**Date**: December 13, 2025
**Status**: Ready to run

---

## 🔧 **What Was Fixed**

### **Issue 1: information_schema Error** ✅ FIXED
**Original Error**: `Unknown table 'user_preferences' in information_schema`

**Root Cause**: The `DATABASE()` function wasn't working properly in some MySQL configurations.

**Fix Applied**: Changed all queries from:
```sql
WHERE table_schema = DATABASE()
```
To:
```sql
WHERE table_schema = 'myfinance'
```

### **Issue 2: DROP COLUMN Failures** ✅ FIXED
**Original Problem**: If a column doesn't exist, `DROP COLUMN` throws an error and stops execution.

**Fix Applied**: Used `DROP COLUMN IF EXISTS` syntax:
```sql
ALTER TABLE user_preferences DROP COLUMN IF EXISTS language;
```

This safely skips columns that don't exist instead of throwing errors.

---

## 📋 **How to Use the UNIFIED Migration**

### **Step 1: Open phpMyAdmin**
1. Open your browser and go to phpMyAdmin
2. Select the `myfinance` database from the left sidebar
3. Click the "SQL" tab at the top

### **Step 2: Check Your Database Name**
⚠️ **IMPORTANT**: The migration assumes your database is named `myfinance`.

If your database has a **different name**, you need to change it in the SQL file:

**Find and replace** in the migration file:
- Find: `'myfinance'`
- Replace with: `'your_database_name'`

Or just edit lines that say `WHERE table_schema = 'myfinance'`

### **Step 3: Run the Migration**

**Option A: Run Entire File (Easiest)**
1. Copy the **entire contents** of `V5__Remove_Unused_Preference_Fields_UNIFIED.sql`
2. Paste into phpMyAdmin SQL tab
3. Click "Go" button
4. Check results - should show "10 columns" at the end

**Option B: Run Step-by-Step (Safest)**
1. Run **STEP 1** first (backup verification)
2. Run **STEP 2** (check current schema)
3. Run **STEP 3** (see which columns exist)
4. Run **STEP 5 - OPTION A** (individual DROP statements)
5. Run **STEP 6** (verification)
6. Run **STEP 7** (final validation)

---

## 🎯 **Expected Results**

### **Before Migration**
```sql
DESCRIBE user_preferences;
```
**Shows**: 18-21 columns including language, currency, date_format, etc.

### **After Migration**
```sql
DESCRIBE user_preferences;
```
**Shows**: Exactly **10 columns**:
1. id
2. user_id
3. view_mode
4. email_notifications
5. budget_alerts
6. weekly_summary
7. monthly_summary
8. created_at
9. updated_at
10. (Foreign key index)

---

## ✅ **Verification Checklist**

After running the migration, verify these:

```sql
-- Quick verification query (copy-paste this)
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
```

**Expected Result**:
```
total_columns: 10
functional_fields: 5
old_fields: 0
total_records: X (your user count)
```

**If you see this** ✅ **Migration is SUCCESSFUL!**

---

## ⚠️ **Troubleshooting**

### **Problem 1: "Table 'information_schema.columns' doesn't exist"**
**Cause**: Incorrect MySQL version or permissions

**Solution**: Skip information_schema queries, just run the DROP COLUMN statements and use DESCRIBE:
```sql
-- Instead of information_schema queries, just use:
DESCRIBE user_preferences;
```

### **Problem 2: "Can't DROP 'column_name'; check that column/key exists"**
**Cause**: Column already removed or never existed

**Solution**: This is OK! Just skip that statement and continue to the next one.

The `DROP COLUMN IF EXISTS` syntax should prevent this, but if you still see it, just ignore and continue.

### **Problem 3: Different database name**
**Cause**: Your database is not named `myfinance`

**Solution**:
1. Find your database name in phpMyAdmin sidebar
2. In the migration file, replace all `'myfinance'` with your actual database name
3. Or just skip information_schema queries and use `DESCRIBE user_preferences;`

### **Problem 4: "No data loss" verification fails**
**Cause**: Record count changed after migration

**Solution**: This is **CRITICAL**. Do NOT proceed. Run rollback:
```sql
-- Check what happened
SELECT COUNT(*) FROM user_preferences;

-- If records are missing, restore from backup immediately
```

---

## 🔄 **Rollback Instructions**

If something goes wrong:

```sql
-- Restore columns with default values
ALTER TABLE user_preferences
    ADD COLUMN language VARCHAR(10) DEFAULT 'vi' AFTER user_id,
    ADD COLUMN currency VARCHAR(10) DEFAULT 'VND' AFTER language,
    ADD COLUMN date_format VARCHAR(20) DEFAULT 'dd/MM/yyyy' AFTER currency,
    ADD COLUMN timezone VARCHAR(50) DEFAULT 'Asia/Ho_Chi_Minh' AFTER date_format,
    ADD COLUMN theme VARCHAR(20) DEFAULT 'light' AFTER timezone,
    ADD COLUMN items_per_page INT DEFAULT 10 AFTER theme,
    ADD COLUMN transaction_reminders BOOLEAN DEFAULT FALSE AFTER monthly_summary,
    ADD COLUMN goal_reminders BOOLEAN DEFAULT FALSE AFTER transaction_reminders;
```

**Note**: This restores the structure but original data is lost.

---

## 📊 **What Gets Removed**

| Column Name | Default Value | Why Removed |
|-------------|---------------|-------------|
| language | 'vi' | No i18n system implemented |
| currency | 'VND' | Project simplified to VND-only |
| date_format | 'dd/MM/yyyy' | Hardcoded Vietnamese standard |
| timezone | 'Asia/Ho_Chi_Minh' | Vietnam single timezone |
| theme | 'light' | Dark mode removed from frontend |
| items_per_page | 10 | Pagination hardcoded to 10 |
| transaction_reminders | FALSE | Feature doesn't exist |
| goal_reminders | FALSE | Goal feature doesn't exist |
| profile_visibility* | 'private' | Privacy feature not implemented |
| data_sharing* | FALSE | Privacy feature not implemented |
| analytics_tracking* | TRUE | Privacy feature not implemented |

\* Only if these columns exist in your database

---

## ✨ **Success Message**

When migration completes successfully, you should see:

```
✅ Total Columns: 10
✅ Functional Fields: 5
✅ Old Fields: 0
✅ Total Records: X (unchanged)
✅ Foreign Key: EXISTS
```

**Next steps after successful migration**:
1. Test backend: `mvn spring-boot:run`
2. Test frontend: `npm run build`
3. Verify preferences page shows only 5 settings
4. Commit changes to git

---

**End of Instructions**
