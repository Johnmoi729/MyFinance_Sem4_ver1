# User Preferences Functional Analysis

**Date**: December 13, 2025
**Analyst**: Comprehensive Codebase Search
**Status**: 📊 **ANALYSIS COMPLETE**

---

## 🎯 **Executive Summary**

**Critical Finding**: Only **5 out of 13** (38.5%) UserPreferences fields are **actually functional**.

**8 fields are non-functional:**
- 6 display preferences (language, currency, dateFormat, timezone, theme, itemsPerPage)
- 2 notification placeholders (transactionReminders, goalReminders)

These fields are **stored in the database but NEVER checked** in business logic.

---

## 📊 **Complete Analysis: Field-by-Field**

### **DISPLAY PREFERENCES** (7 fields)

#### 1. ❌ **language** (default: "vi") - NOT FUNCTIONAL
**Status**: Database storage only
**Backend**: Only in entity, DTOs, UserPreferencesService
**Frontend**: `getLanguage()` exists but **NEVER CALLED**
**Actual Usage**: No i18n system exists, all text hardcoded Vietnamese
**Impact**: Can be deleted with zero functional loss
**Recommendation**: **DELETE** (unless planning i18n system)

---

#### 2. ❌ **currency** (default: "VND") - NOT FUNCTIONAL
**Status**: Database storage only
**Backend**: Only in entity, DTOs
**Frontend**:
- `currencyFormatter.js` hardcodes VND (line 132)
- Never reads preference
- Multi-currency system removed December 5, 2025

**Code Evidence**:
```javascript
// currencyFormatter.js - Always uses VND
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'  // ← Hardcoded, never reads preference
  }).format(amount);
};
```

**Actual Usage**: All amounts formatted as VND (₫) regardless of preference
**Impact**: Can be deleted - already removed from multi-currency simplification
**Recommendation**: **DELETE** (redundant with VND-only system)

---

#### 3. ❌ **dateFormat** (default: "dd/MM/yyyy") - NOT FUNCTIONAL
**Status**: Database storage only
**Backend**: Only in entity, DTOs
**Frontend**:
- `dateFormatter.js` hardcodes Vietnamese format
- Never reads preference
- All components use hardcoded format

**Code Evidence**:
```javascript
// dateFormatter.js - Always uses dd/MM/yyyy
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('vi-VN'); // ← Hardcoded format
};
```

**Actual Usage**: All dates displayed as dd/MM/yyyy regardless of preference
**Impact**: Can be deleted - no date format switching logic exists
**Recommendation**: **DELETE** (no multi-format system)

---

#### 4. ❌ **timezone** (default: "Asia/Ho_Chi_Minh") - NOT FUNCTIONAL
**Status**: Database storage only
**Backend**: Never used for time calculations
**Frontend**: Never accessed
**Actual Usage**: System assumes UTC/local time, no timezone conversion
**Impact**: Can be deleted - no timezone logic exists
**Recommendation**: **DELETE** (Vietnam single timezone)

---

#### 5. ❌ **theme** (default: "light") - NOT FUNCTIONAL - DEPRECATED
**Status**: **DEPRECATED** - Dark mode removed from frontend
**Backend**: Still in entity, DTOs
**Frontend**:
- `getTheme()` exists but **commented as deprecated**
- No dark/light mode CSS in App.js
- UI always renders light mode

**Code Evidence**:
```javascript
// PreferencesContext.js line 135-136
// Only exports light/detailed, theme field deprecated
const preferences = {
  theme: 'light',      // ← Deprecated, not used
  viewMode: 'detailed'
};
```

**Actual Usage**: UI always light mode, preference stored but ignored
**Impact**: Can be deleted - dark mode removed December 2025
**Recommendation**: **DELETE** (feature removed from codebase)

---

#### 6. ❌ **itemsPerPage** (default: 10) - NOT FUNCTIONAL
**Status**: Database storage only
**Backend**: Only in entity, DTOs
**Frontend**: Never accessed, pagination hardcoded
**Actual Usage**: All list pages show exactly 10 items

**Code Evidence**:
```javascript
// All transaction/budget/category pages hardcode pagination
const [limit] = useState(10); // ← Hardcoded, never reads preference
```

**Impact**: Can be deleted - no pagination control system
**Recommendation**: **DELETE** (pagination hardcoded everywhere)

---

#### 7. ✅ **viewMode** (default: "detailed") - ACTUALLY FUNCTIONAL ✨
**Status**: **FULLY FUNCTIONAL** - Actually checked and used!
**Backend**: Stored in UserPreferences, returned via API
**Frontend**:
- PreferencesContext: `getViewMode()` properly exported
- **BudgetsPage.js (Lines 15, 28, 33-35)**:
  - Gets current mode: `const [viewMode, setViewModeLocal] = useState(getViewMode() || 'usage')`
  - Updates preference: `await updatePreference('viewMode', mode)`
  - Controls UI rendering

**Code Evidence**:
```javascript
// BudgetsPage.js - Actually uses viewMode
const [viewMode, setViewModeLocal] = useState(getViewMode() || 'usage');

const handleViewChange = async (mode) => {
  setViewModeLocal(mode);
  await updatePreference('viewMode', mode); // ← Saves to preferences
};

// Conditional rendering based on preference
{viewMode === 'usage' ? (
  <BudgetAnalyticsView />  // Progress bars, warnings
) : (
  <BasicListView />        // Simple list
)}
```

**Actual Usage**: Switches between Budget Analytics View and Basic View
**Impact**: **CRITICAL** - User preference that controls UI behavior
**Recommendation**: **KEEP** ✅

---

### **NOTIFICATION PREFERENCES** (6 fields)

#### 8. ✅ **emailNotifications** (default: true) - MASTER SWITCH ✨
**Status**: **FULLY FUNCTIONAL** - Master gatekeeper for ALL emails
**Backend**: EmailService.java (lines 44-81)
- `shouldSendEmail()` checks this **FIRST** before any email
- All 7 email types check this switch:
  - Welcome emails
  - Password reset emails
  - Budget alert emails
  - Monthly summary emails
  - Weekly summary emails
  - Scheduled report emails
  - Password change emails

**Code Evidence**:
```java
// EmailService.java - Master switch checked first
private boolean shouldSendEmail(Long userId, String specificPreference) {
    UserPreferences prefs = userPreferencesService.getUserPreferences(userId);

    // MASTER SWITCH - if false, NO emails sent
    if (prefs.getEmailNotifications() == null || !prefs.getEmailNotifications()) {
        log.info("Email notifications disabled for user: {}", userId);
        return false; // ← Blocks ALL emails
    }

    // Then check specific preference...
}
```

**Actual Usage**: When false, **disables ALL email notifications** system-wide
**Impact**: **CRITICAL** - Master control for entire email system
**Recommendation**: **KEEP** ✅

---

#### 9. ✅ **budgetAlerts** (default: true) - ACTUALLY FUNCTIONAL ✨
**Status**: **FULLY FUNCTIONAL** - Checked before budget alert emails
**Backend**:
- EmailService.java: `sendBudgetAlertEmail()` checks this (line 140)
- BudgetService.java: `checkAndSendBudgetAlert()` called when threshold exceeded (line 337)

**Workflow**:
1. User adds/updates transaction
2. TransactionService calls `BudgetService.checkAndSendBudgetAlert()`
3. BudgetService calculates budget usage percentage
4. If ≥ warningThreshold (75%+), calls `emailService.sendBudgetAlertEmail()`
5. EmailService checks `budgetAlerts` preference before sending

**Code Evidence**:
```java
// EmailService.java line 140
public void sendBudgetAlertEmail(...) {
    if (!shouldSendEmail(userId, "budgetAlerts")) {
        log.info("Budget alert email not sent - budgetAlerts disabled");
        return; // ← Respects preference
    }
    // Send email...
}
```

**Actual Usage**: When false, budget threshold exceeded emails **NOT sent**
**Impact**: **IMPORTANT** - Controls budget warning emails
**Recommendation**: **KEEP** ✅

---

#### 10. ❌ **transactionReminders** (default: false) - NO FEATURE
**Status**: **PLACEHOLDER** - Feature doesn't exist
**Backend**: Only in entity, DTOs, UserPreferencesService
**Frontend**: Only in PreferencesContext getter, never used
**Actual Usage**: No reminder system implemented, no business logic reads this
**Impact**: Can be deleted or kept as placeholder
**Recommendation**: **REMOVE** (unless planning to implement feature)

---

#### 11. ✅ **weeklySummary** (default: false) - ACTUALLY FUNCTIONAL ✨
**Status**: **FULLY FUNCTIONAL** - Checked before weekly emails
**Backend**:
- WeeklySummaryScheduler.java: Runs every Monday at 8:00 AM
- EmailService.sendWeeklySummaryEmail() checks this (line 212)

**Workflow**:
1. `@Scheduled(cron = "0 0 8 * * MON")` runs every Monday 8:00 AM
2. Gets all active users: `userRepository.findByIsActive(true)`
3. For each user, calculates last 7 days transactions
4. Calls `emailService.sendWeeklySummaryEmail()` with preference check

**Code Evidence**:
```java
// EmailService.java line 212
public void sendWeeklySummaryEmail(...) {
    if (!shouldSendEmail(userId, "weeklySummary")) {
        log.info("Weekly summary not sent - weeklySummary disabled");
        return; // ← Respects preference
    }
    // Send weekly email...
}
```

**Actual Usage**: When enabled (true), sends weekly email every Monday
**Impact**: **IMPORTANT** - Controls weekly financial summaries
**Recommendation**: **KEEP** ✅

---

#### 12. ✅ **monthlySummary** (default: true) - ACTUALLY FUNCTIONAL ✨
**Status**: **FULLY FUNCTIONAL** - Checked before monthly emails
**Backend**:
- MonthlySummaryScheduler.java: Runs on 1st of month at 8:00 AM
- EmailService.sendMonthlySummaryEmail() checks this (line 174)

**Workflow**:
1. `@Scheduled(cron = "0 0 8 1 * *")` runs 1st of month at 8:00 AM
2. Gets all active users: `userRepository.findByIsActive(true)`
3. Generates monthly report for previous month
4. Calls `emailService.sendMonthlySummaryEmail()` with preference check

**Code Evidence**:
```java
// EmailService.java line 174
public void sendMonthlySummaryEmail(...) {
    if (!shouldSendEmail(userId, "monthlySummary")) {
        log.info("Monthly summary not sent - monthlySummary disabled");
        return; // ← Respects preference
    }
    // Send monthly email...
}
```

**Actual Usage**: When enabled (true), sends monthly summary on 1st of month
**Impact**: **IMPORTANT** - Controls monthly financial reports
**Recommendation**: **KEEP** ✅

---

#### 13. ❌ **goalReminders** (default: true) - NO FEATURE
**Status**: **PLACEHOLDER** - Goal feature doesn't exist
**Backend**: Only in entity, DTOs
**Frontend**: Only in PreferencesContext getter, never used
**Actual Usage**: No goal system implemented, no business logic reads this
**Impact**: Can be deleted or kept as placeholder
**Recommendation**: **REMOVE** (unless planning to implement feature)

---

## 📋 **SUMMARY TABLE**

| # | Field | Type | Functional? | Backend Logic | Frontend Use | Recommendation |
|---|-------|------|-------------|---------------|--------------|----------------|
| 1 | language | Display | ❌ NO | Stored only | Never checked | **DELETE** |
| 2 | currency | Display | ❌ NO | Stored only | Hardcoded VND | **DELETE** |
| 3 | dateFormat | Display | ❌ NO | Stored only | Hardcoded format | **DELETE** |
| 4 | timezone | Display | ❌ NO | Stored only | Never used | **DELETE** |
| 5 | theme | Display | ❌ NO | Stored only | Deprecated | **DELETE** |
| 6 | itemsPerPage | Display | ❌ NO | Stored only | Hardcoded to 10 | **DELETE** |
| 7 | **viewMode** | Display | ✅ **YES** | Returned via API | BudgetsPage uses it | **KEEP** ✅ |
| 8 | **emailNotifications** | Notification | ✅ **YES** | Master switch for ALL emails | Frontend logic | **KEEP** ✅ |
| 9 | **budgetAlerts** | Notification | ✅ **YES** | Checked before budget emails | Frontend getter | **KEEP** ✅ |
| 10 | transactionReminders | Notification | ❌ NO | Stored only | Never checked | **REMOVE** |
| 11 | **weeklySummary** | Notification | ✅ **YES** | Checked before weekly emails | Frontend getter | **KEEP** ✅ |
| 12 | **monthlySummary** | Notification | ✅ **YES** | Checked before monthly emails | Frontend getter | **KEEP** ✅ |
| 13 | goalReminders | Notification | ❌ NO | Stored only | Never checked | **REMOVE** |

---

## 🎯 **FUNCTIONAL vs NON-FUNCTIONAL BREAKDOWN**

### ✅ **Fully Functional & Integrated: 5/13 (38.5%)**

1. ✅ **viewMode** - Controls budget view display (usage/basic)
2. ✅ **emailNotifications** - Master switch for ALL email notifications
3. ✅ **budgetAlerts** - Controls budget threshold exceeded emails
4. ✅ **weeklySummary** - Controls weekly financial summary emails (scheduled)
5. ✅ **monthlySummary** - Controls monthly financial summary emails (scheduled)

### ❌ **Non-Functional / Stored Only: 8/13 (61.5%)**

**Display Preferences** (6 fields):
- ❌ language (no i18n system)
- ❌ currency (VND-only system)
- ❌ dateFormat (hardcoded dd/MM/yyyy)
- ❌ timezone (Vietnam single timezone)
- ❌ theme (dark mode removed)
- ❌ itemsPerPage (hardcoded to 10)

**Notification Placeholders** (2 fields):
- ❌ transactionReminders (feature doesn't exist)
- ❌ goalReminders (feature doesn't exist)

---

## 💡 **CLEANUP RECOMMENDATIONS**

### **Option A: Aggressive Cleanup (Recommended)** ⭐
**Keep only 5 functional fields**

**Changes**:
- ✅ Keep: viewMode, emailNotifications, budgetAlerts, weeklySummary, monthlySummary
- ❌ Remove: 8 non-functional fields

**Impact**:
- Database: 8 fewer columns in `user_preferences` table
- Backend: Simplified entity (13 fields → 5 fields)
- Frontend: Simplified DTOs and UI (remove 6 display preference controls)
- Code reduction: ~200+ lines removed

**Time**: 1-2 hours

**Benefits**:
- ✅ Cleaner codebase
- ✅ Simpler database schema
- ✅ Less testing overhead
- ✅ Faster API responses (less data transferred)
- ✅ No functional loss (removing unused fields)

---

### **Option B: Conservative Cleanup**
**Keep functional + placeholders (7 fields)**

**Changes**:
- ✅ Keep: 5 functional + transactionReminders + goalReminders (future features)
- ❌ Remove: 6 display preference fields only

**Impact**:
- Database: 6 fewer columns
- Backend: Simplified entity (13 fields → 7 fields)
- Frontend: Remove display preference UI only
- Code reduction: ~150 lines

**Time**: 1 hour

**Benefits**:
- ✅ Still significant cleanup
- ✅ Keeps placeholders for future features
- ✅ Easier to add transaction/goal reminders later

---

### **Option C: Display Preferences Only**
**Remove only 6 display preference fields**

**Changes**:
- ✅ Keep: viewMode (the only functional display preference)
- ✅ Keep: All 6 notification preferences (4 functional + 2 placeholders)
- ❌ Remove: language, currency, dateFormat, timezone, theme, itemsPerPage

**Impact**:
- Database: 5 fewer columns
- Backend: Entity (13 fields → 7 fields)
- Frontend: Simplified preferences page
- Code reduction: ~100 lines

**Time**: 45 minutes

**Benefits**:
- ✅ Removes clearly useless fields
- ✅ Minimal risk (removing obviously unused fields)
- ✅ Quick to implement

---

## 📊 **DETAILED IMPACT ANALYSIS**

### **Files Affected (Estimated)**

**Backend Java** (~8 files):
- UserPreferences.java (entity)
- UserPreferencesRequest.java (DTO)
- UserPreferencesResponse.java (DTO)
- UserPreferencesService.java (service)
- UserPreferencesController.java (minimal changes)
- Database migration SQL (DROP COLUMN statements)
- complete-database-init.sql (schema update)

**Frontend React** (~3 files):
- PreferencesContext.js (remove unused getters)
- UserPreferencesPage.js (remove UI sections for deleted fields)
- currencyFormatter.js (remove unused imports)
- dateFormatter.js (remove unused imports)

**Mobile Flutter** (~2 files):
- user_preferences.dart (model)
- user_preferences_screen.dart (UI)

**Database** (1 migration):
- V5__Remove_Unused_Preference_Fields.sql

**Total**: ~14 files modified

---

## ⚠️ **RISKS & CONSIDERATIONS**

### **Low Risk**
- ✅ Removing non-functional fields has **zero functional impact**
- ✅ No business logic reads these fields
- ✅ Users won't notice any behavior changes

### **Database Migration**
- ⚠️ Requires ALTER TABLE to drop columns
- ⚠️ Data loss acceptable (fields were never used)
- ✅ Easy rollback (just re-add columns with defaults)

### **User Experience**
- ✅ **Positive impact**: Simpler preferences page
- ✅ Users won't see confusing non-working settings
- ✅ Clearer UI focused on what actually works

---

## 🎯 **RECOMMENDATION**

**I recommend Option A: Aggressive Cleanup**

**Reasoning**:
1. **61.5% of preferences are non-functional** - significant waste
2. **VND-only system** makes currency preference redundant
3. **No i18n system** makes language/dateFormat/timezone redundant
4. **Dark mode removed** makes theme preference redundant
5. **Hardcoded pagination** makes itemsPerPage redundant
6. **No reminder features** makes 2 notification preferences redundant

**Keep only what works:**
- viewMode (the ONLY functional display preference)
- 4 email notification preferences (emailNotifications, budgetAlerts, weeklySummary, monthlySummary)

**Result**: 13 fields → 5 fields (61.5% reduction)

---

## 📝 **NEXT STEPS**

If you approve Option A:

1. ✅ Create detailed migration plan (similar to BudgetSettings cleanup)
2. ✅ Create database migration SQL
3. ✅ Update backend entity and DTOs
4. ✅ Update backend service layer
5. ✅ Update frontend PreferencesPage
6. ✅ Update mobile app
7. ✅ Update documentation (CLAUDE.md)
8. ✅ Test all changes

**Estimated Time**: 1-2 hours (similar to BudgetSettings cleanup)

---

**Question**: Which option do you prefer? A, B, or C?

Or would you like to keep all 13 fields as-is?

---

**End of Analysis Document**
