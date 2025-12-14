# Weekly & Monthly Summary Preferences Removal Plan

**Date**: December 13, 2025
**Reason**: Redundant with ScheduledReports system (which provides more features)
**Risk Level**: MEDIUM (affects multiple layers, requires careful execution)

---

## 📋 **EXECUTIVE SUMMARY**

**What**: Remove `weeklySummary` and `monthlySummary` preferences from UserPreferences system

**Why**: These features overlap with ScheduledReports, which provides:
- ✅ Superior functionality (PDF/CSV, flexible timing, multiple schedules)
- ✅ User control (custom frequency, format selection)
- ✅ Execution tracking (lastRun, nextRun, runCount)

**Impact**:
- Remove 2 database columns (user_preferences: 9 → 7 columns)
- Delete 2 scheduler classes (~300+ lines)
- Delete 2 email templates
- Update 8 backend files
- Update 2 frontend files

**Risk**: MEDIUM
- Breaking change for users with active weekly/monthly summaries
- Requires database migration
- Multiple file changes across backend/frontend

---

## 🔍 **COMPLETE FILE INVENTORY**

### **Files to DELETE** (4 files):
1. ✅ `MyFinance Backend/src/main/java/com/myfinance/service/WeeklySummaryScheduler.java` (132 lines)
2. ✅ `MyFinance Backend/src/main/java/com/myfinance/service/MonthlySummaryScheduler.java` (~150 lines)
3. ✅ `MyFinance Backend/src/main/resources/templates/email/weekly-summary.html` (175 lines)
4. ✅ `MyFinance Backend/src/main/resources/templates/email/monthly-summary.html` (~175 lines)

**Total deletion**: ~630+ lines of code

### **Files to MODIFY - Backend** (7 files):
1. ✅ `database/complete-database-init.sql` - Remove 2 columns from user_preferences table
2. ✅ `MyFinance Backend/src/main/java/com/myfinance/entity/UserPreferences.java` - Remove 2 fields
3. ✅ `MyFinance Backend/src/main/java/com/myfinance/dto/request/UserPreferencesRequest.java` - Remove 2 fields
4. ✅ `MyFinance Backend/src/main/java/com/myfinance/dto/response/UserPreferencesResponse.java` - Remove 2 fields
5. ✅ `MyFinance Backend/src/main/java/com/myfinance/service/UserPreferencesService.java` - Remove logic
6. ✅ `MyFinance Backend/src/main/java/com/myfinance/service/EmailService.java` - Remove preference checks
7. ✅ `MyFinance Backend/src/main/java/com/myfinance/controller/EmailTestController.java` - Remove test endpoints

### **Files to MODIFY - Frontend** (2 files):
1. ✅ `myfinance-frontend/src/context/PreferencesContext.js` - Remove getters and defaults
2. ✅ `myfinance-frontend/src/pages/preferences/UserPreferencesPage.js` - Remove UI sections

### **Files to CREATE** (1 file):
1. ✅ `database/migrations/V6__Remove_Weekly_Monthly_Summary_Preferences.sql` - Migration script

### **Documentation files** (will update but not critical):
- CLAUDE.md
- USER_PREFERENCES_DEEP_ANALYSIS.md
- Various other .md files

**Total files affected**: 14 functional files (4 deletions + 9 modifications + 1 creation)

---

## 🎯 **DETAILED REMOVAL STEPS**

### **PHASE 1: PREPARATION & ANALYSIS** ✅ COMPLETE

- ✅ Analyzed all file references (28 files for weekly, 32 for monthly)
- ✅ Identified 4 files to delete
- ✅ Identified 9 files to modify
- ✅ Created comprehensive removal plan
- ✅ Created todo list for tracking

### **PHASE 2: DATABASE MIGRATION**

**Step 2.1**: Create V6 migration SQL
```sql
-- V6__Remove_Weekly_Monthly_Summary_Preferences.sql

-- Verification BEFORE
SELECT COUNT(*) FROM information_schema.columns
WHERE table_schema = 'myfinance' AND table_name = 'user_preferences';
-- Expected: 9 columns

-- Drop columns
ALTER TABLE user_preferences DROP COLUMN IF EXISTS weekly_summary;
ALTER TABLE user_preferences DROP COLUMN IF EXISTS monthly_summary;

-- Verification AFTER
SELECT COUNT(*) FROM information_schema.columns
WHERE table_schema = 'myfinance' AND table_name = 'user_preferences';
-- Expected: 7 columns

DESCRIBE user_preferences;
-- Expected: id, user_id, view_mode, email_notifications, budget_alerts, created_at, updated_at
```

**Step 2.2**: Update complete-database-init.sql
- Remove `weekly_summary BOOLEAN DEFAULT FALSE` line
- Remove `monthly_summary BOOLEAN DEFAULT TRUE` line
- Update from 9 columns to 7 columns

### **PHASE 3: BACKEND ENTITY & DTOs**

**Step 3.1**: Update UserPreferences.java
```java
// REMOVE these fields (lines ~35-40):
// @Column(name = "weekly_summary")
// private Boolean weeklySummary = false;
//
// @Column(name = "monthly_summary")
// private Boolean monthlySummary = true;

// KEEP these 3 fields:
private String viewMode = "detailed";
private Boolean emailNotifications = true;
private Boolean budgetAlerts = true;
```

**Step 3.2**: Update UserPreferencesRequest.java
- Remove `private Boolean weeklySummary;`
- Remove `private Boolean monthlySummary;`

**Step 3.3**: Update UserPreferencesResponse.java
- Remove `.weeklySummary()` from builder
- Remove `.monthlySummary()` from builder

### **PHASE 4: BACKEND SERVICE LAYER**

**Step 4.1**: Update UserPreferencesService.java

Remove from `createDefaultPreferences()`:
```java
// preferences.setWeeklySummary(false);
// preferences.setMonthlySummary(true);
```

Remove from `updatePreferences()`:
```java
// if (request.getWeeklySummary() != null) {
//     existing.setWeeklySummary(request.getWeeklySummary());
// }
// if (request.getMonthlySummary() != null) {
//     existing.setMonthlySummary(request.getMonthlySummary());
// }
```

Remove from `resetToDefaults()`:
```java
// preferences.setWeeklySummary(false);
// preferences.setMonthlySummary(true);
```

**Step 4.2**: Update EmailService.java

Remove from switch statement (lines 61-66):
```java
// case "weeklySummary" -> prefs.getWeeklySummary();
// case "monthlySummary" -> prefs.getMonthlySummary();
```

Only keep:
```java
case "budgetAlerts" -> prefs.getBudgetAlerts();
default -> true;
```

**Step 4.3**: Update EmailTestController.java

Remove these endpoints and dependencies:
```java
// REMOVE weeklySummaryScheduler field injection
// REMOVE monthlySummaryScheduler field injection
// REMOVE @GetMapping("/weekly-summary") endpoint
// REMOVE @GetMapping("/monthly-summary") endpoint
```

### **PHASE 5: DELETE SCHEDULER FILES**

**Step 5.1**: Delete WeeklySummaryScheduler.java
- File: `MyFinance Backend/src/main/java/com/myfinance/service/WeeklySummaryScheduler.java`
- Lines: 132
- Functionality: Sends weekly summaries every Monday 8 AM

**Step 5.2**: Delete MonthlySummaryScheduler.java
- File: `MyFinance Backend/src/main/java/com/myfinance/service/MonthlySummaryScheduler.java`
- Lines: ~150
- Functionality: Sends monthly summaries on 1st of month at 8 AM

**Step 5.3**: Delete email templates
- `MyFinance Backend/src/main/resources/templates/email/weekly-summary.html`
- `MyFinance Backend/src/main/resources/templates/email/monthly-summary.html`

### **PHASE 6: FRONTEND UPDATES**

**Step 6.1**: Update PreferencesContext.js

Remove from `getDefaultPreferences()`:
```javascript
// weeklySummary: false,
// monthlySummary: true
```

Remove helper functions:
```javascript
// const getWeeklySummary = () => preferences?.weeklySummary ?? false;
// const getMonthlySummary = () => preferences?.monthlySummary ?? true;
```

Remove from value exports:
```javascript
// getWeeklySummary,
// getMonthlySummary,
```

Remove from `isNotificationEnabled()` switch:
```javascript
// case 'weeklySummary':
//     return getWeeklySummary();
// case 'monthlySummary':
//     return getMonthlySummary();
```

**Step 6.2**: Update UserPreferencesPage.js

Remove weekly_summary UI section:
```javascript
// <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
//   <div>
//     <div className="font-medium text-gray-900">Tóm tắt hàng tuần</div>
//     <div className="text-sm text-gray-600">Nhận email tóm tắt tài chính hàng tuần</div>
//   </div>
//   <label className="relative inline-flex items-center cursor-pointer">
//     <input
//       type="checkbox"
//       checked={formData.weeklySummary}
//       onChange={(e) => handleInputChange('weeklySummary', e.target.checked)}
//       className="sr-only peer"
//     />
//     <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
//   </label>
// </div>
```

Remove monthly_summary UI section (similar structure)

Remove from `formData` state initialization:
```javascript
// weeklySummary: preferences?.weeklySummary ?? false,
// monthlySummary: preferences?.monthlySummary ?? true,
```

### **PHASE 7: VERIFICATION**

**Step 7.1**: Search for remaining references
```bash
grep -r "weeklySummary" --include="*.java" --include="*.js" "MyFinance Backend" myfinance-frontend
grep -r "monthlySummary" --include="*.java" --include="*.js" "MyFinance Backend" myfinance-frontend
grep -r "weekly_summary" --include="*.sql" database
grep -r "monthly_summary" --include="*.sql" database
```

Expected: No results (except documentation files)

**Step 7.2**: Verify database schema
```sql
DESCRIBE user_preferences;
-- Expected: 7 columns total
-- id, user_id, view_mode, email_notifications, budget_alerts, created_at, updated_at
```

**Step 7.3**: Backend compilation check
```bash
cd "MyFinance Backend"
mvn clean compile
# Expected: BUILD SUCCESS
```

**Step 7.4**: Frontend build check
```bash
cd myfinance-frontend
npm run build
# Expected: Build successful
```

---

## 🔄 **ROLLBACK STRATEGY**

### **If Migration Fails**:

**Database Rollback**:
```sql
-- Restore columns with defaults
ALTER TABLE user_preferences
    ADD COLUMN weekly_summary BOOLEAN DEFAULT FALSE AFTER budget_alerts,
    ADD COLUMN monthly_summary BOOLEAN DEFAULT TRUE AFTER weekly_summary;
```

**Code Rollback**:
```bash
# Revert all changes
git checkout HEAD -- "MyFinance Backend" myfinance-frontend database

# Or restore specific files from backup
# (User should have backup from previous steps)
```

**Git Safety**:
```bash
# Before starting, create backup branch
git checkout -b backup-before-weekly-monthly-removal
git add .
git commit -m "Backup before removing weekly/monthly summary preferences"

# Then switch back to working branch
git checkout master
```

---

## ⚠️ **RISKS & MITIGATION**

### **Risk 1: Breaking Change for Active Users**

**Problem**: Users with `weeklySummary: true` or `monthlySummary: true` will stop receiving emails

**Mitigation**:
- Document in release notes
- Add banner in UI: "Automatic weekly/monthly summaries removed. Create custom schedules in Reports → Scheduled Reports"
- ScheduledReports provides superior functionality

**Likelihood**: HIGH (default monthlySummary is true)
**Impact**: MEDIUM (users can recreate via ScheduledReports)

### **Risk 2: Database Migration Failure**

**Problem**: Migration fails mid-execution, database in inconsistent state

**Mitigation**:
- User has database backup (confirmed in previous sessions)
- Use `DROP COLUMN IF EXISTS` syntax
- Test on development database first

**Likelihood**: LOW (simple DROP COLUMN operation)
**Impact**: MEDIUM (requires restore from backup)

### **Risk 3: Compilation Errors**

**Problem**: Missed references cause backend to fail compilation

**Mitigation**:
- Comprehensive grep search for all references
- Phase 7 verification step includes compilation
- Todo list tracks all file changes

**Likelihood**: LOW (thorough analysis completed)
**Impact**: LOW (easy to fix missed references)

### **Risk 4: Frontend Runtime Errors**

**Problem**: Removed getters called from components

**Mitigation**:
- Search all component files for getter usage
- PreferencesContext exports are well-documented
- Build step will catch most errors

**Likelihood**: LOW (centralized in PreferencesContext)
**Impact**: LOW (browser console errors, easy to debug)

---

## ✅ **SUCCESS CRITERIA**

After completion, all of the following must be true:

### **Database**:
- ✅ user_preferences table has exactly 7 columns
- ✅ No weekly_summary or monthly_summary columns exist
- ✅ All existing data preserved (id, user_id, view_mode, email_notifications, budget_alerts)

### **Backend**:
- ✅ mvn clean compile succeeds with no errors
- ✅ No references to weeklySummary or monthlySummary in .java files
- ✅ EmailService only checks: budgetAlerts
- ✅ WeeklySummaryScheduler.java deleted
- ✅ MonthlySummaryScheduler.java deleted
- ✅ Email templates deleted

### **Frontend**:
- ✅ npm run build succeeds with no errors
- ✅ No references to weeklySummary or monthlySummary in .js files
- ✅ UserPreferencesPage shows only 3 notification settings (emailNotifications, budgetAlerts)
- ✅ PreferencesContext exports only: getViewMode, getEmailNotifications, getBudgetAlerts

### **Functionality**:
- ✅ Users can still disable all emails via emailNotifications toggle
- ✅ Users can still control budget alerts via budgetAlerts toggle
- ✅ Users can create weekly/monthly schedules via ScheduledReports UI
- ✅ ScheduledReports system continues to work independently

---

## 📊 **IMPACT SUMMARY**

### **Before Removal**:
- user_preferences table: 9 columns
- Notification preferences: 4 (emailNotifications, budgetAlerts, weeklySummary, monthlySummary)
- Schedulers: 2 automatic batch schedulers + 1 user-defined ScheduledReports
- Email preference checks: 3 specific preferences (budgetAlerts, weeklySummary, monthlySummary)

### **After Removal**:
- user_preferences table: 7 columns (22% reduction)
- Notification preferences: 2 (emailNotifications, budgetAlerts)
- Schedulers: 1 user-defined ScheduledReports only
- Email preference checks: 1 specific preference (budgetAlerts)
- Code reduction: ~630+ lines deleted

### **User Impact**:
- ❌ No more automatic weekly summaries (users must create ScheduledReport with WEEKLY frequency)
- ❌ No more automatic monthly summaries (users must create ScheduledReport with MONTHLY frequency)
- ✅ Superior control via ScheduledReports (PDF/CSV, flexible timing, multiple schedules)
- ✅ Eliminates duplicate email risk
- ✅ Cleaner, more maintainable codebase

---

## 📝 **EXECUTION CHECKLIST**

Copy this checklist to track progress:

```
PHASE 1: PREPARATION
[✅] Analyze all file references
[✅] Create removal plan
[✅] Create todo list
[ ] Create git backup branch

PHASE 2: DATABASE
[ ] Create V6 migration SQL
[ ] Update complete-database-init.sql
[ ] Verify SQL syntax

PHASE 3: BACKEND ENTITY & DTOs
[ ] Update UserPreferences.java (remove 2 fields)
[ ] Update UserPreferencesRequest.java (remove 2 fields)
[ ] Update UserPreferencesResponse.java (remove 2 builder fields)

PHASE 4: BACKEND SERVICES
[ ] Update UserPreferencesService.java (remove logic from 3 methods)
[ ] Update EmailService.java (remove 2 switch cases)
[ ] Update EmailTestController.java (remove 2 endpoints)

PHASE 5: DELETE FILES
[ ] Delete WeeklySummaryScheduler.java
[ ] Delete MonthlySummaryScheduler.java
[ ] Delete weekly-summary.html template
[ ] Delete monthly-summary.html template

PHASE 6: FRONTEND
[ ] Update PreferencesContext.js (remove getters, defaults, exports)
[ ] Update UserPreferencesPage.js (remove 2 UI sections)

PHASE 7: VERIFICATION
[ ] Grep search for remaining references
[ ] Run backend compilation (mvn clean compile)
[ ] Run frontend build (npm run build)
[ ] Verify database schema (DESCRIBE user_preferences)
[ ] Test preferences API endpoints
[ ] Test ScheduledReports still works

PHASE 8: DOCUMENTATION
[ ] Create completion summary document
[ ] Update CLAUDE.md
[ ] Update USER_PREFERENCES_DEEP_ANALYSIS.md
```

---

**Status**: Ready to execute
**Next Step**: Phase 2 - Create database migration SQL
