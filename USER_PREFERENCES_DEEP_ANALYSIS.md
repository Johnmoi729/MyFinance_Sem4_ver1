# User Preferences Deep Analysis - Functionality & Overlaps

**Date**: December 13, 2025
**Purpose**: Analyze what each of the 5 remaining user preferences actually does and identify redundancies

---

## 📊 **OVERVIEW: 5 USER PREFERENCES**

| # | Preference | Type | Default | What It Does | Overlap? |
|---|---|---|---|---|---|
| 1 | `viewMode` | Display | 'detailed' | Controls budget display format (usage vs basic) | ❌ No overlap |
| 2 | `emailNotifications` | Master Switch | true | Master switch for ALL emails | ❌ No overlap |
| 3 | `budgetAlerts` | Notification | true | Sends immediate email when budget threshold exceeded | ❌ No overlap |
| 4 | `weeklySummary` | Notification | false | Auto-sends weekly summary every Monday 8 AM | ⚠️ **OVERLAPS** with ScheduledReports |
| 5 | `monthlySummary` | Notification | true | Auto-sends monthly summary 1st of month 8 AM | ⚠️ **OVERLAPS** with ScheduledReports |

---

## 🔍 **DETAILED ANALYSIS**

### ✅ **1. viewMode** - UNIQUE & FUNCTIONAL

**What it does**: Controls visual presentation of budgets on BudgetsPage

**Frontend Implementation** (`BudgetsPage.js`):
- **Two display modes**:
  1. `'usage'` (analytics view) - Shows budget progress bars, usage percentage, warning alerts, remaining budget
  2. `'basic'` (simple list) - Shows basic budget list with minimal info

**How it works**:
```javascript
// User clicks toggle button
setViewMode('usage' or 'basic')
  ↓
PreferencesContext.updatePreference('viewMode', mode)
  ↓
API PUT /api/preferences { viewMode: 'usage' }
  ↓
Database updated
  ↓
Persists across page reloads and sessions
```

**Scope**: Frontend-only, UI preference, no backend logic affected

**Verdict**: ✅ **KEEP** - Provides unique functionality, no overlap

---

### ✅ **2. emailNotifications** - UNIQUE & FUNCTIONAL (Confirmed by User)

**What it does**: Master switch that gates ALL email sending system-wide

**How it works** (`EmailService.shouldSendEmail()`, lines 44-79):
```java
// Every email type checks this FIRST
if (prefs.getEmailNotifications() == null || !prefs.getEmailNotifications()) {
    return false; // Block ALL emails
}
```

**Controls these 6+ email types**:
1. Welcome emails (registration)
2. Password reset emails
3. Password change notifications
4. Budget alert emails
5. Weekly summary emails
6. Monthly summary emails
7. Scheduled report emails

**Hierarchical System**:
```
emailNotifications: false → ALL emails blocked
emailNotifications: true → Check specific preferences (budgetAlerts, weeklySummary, monthlySummary)
```

**Verdict**: ✅ **KEEP** - Critical master switch, confirmed functional by user

---

### ✅ **3. budgetAlerts** - UNIQUE & FUNCTIONAL

**What it does**: Sends immediate email when user's spending exceeds budget threshold

**Trigger Flow**:
```
User creates/updates transaction
  ↓
TransactionService.createTransaction() / updateTransaction()
  ↓
BudgetService.checkAndSendBudgetAlert(userId, categoryId)
  ↓
Checks if budget exists for category in current month
  ↓
Retrieves user's threshold settings (default: warning=75%, critical=90%)
  ↓
If actual spending >= threshold percentage:
  EmailService.sendBudgetAlertEmail(userId, category, budget, actual, percentage)
  ↓
EmailService checks:
  1. emailNotifications preference (master switch)
  2. budgetAlerts preference (specific switch)
  ↓
If both true → Send alert email immediately
```

**What gets emailed**:
- Category name
- Budget amount
- Actual spending
- Usage percentage (e.g., "85%")
- Alert level (YELLOW for 75%+, RED for 90%+)

**Key Difference from Scheduled Reports**:
- ⚡ **Immediate alert** - Triggers on transaction creation/update
- 📊 **Threshold-based** - Only sends when threshold exceeded
- 🎯 **Single-category focused** - Alert specific to one budget category

**Verdict**: ✅ **KEEP** - Provides unique immediate alerting, no overlap with scheduled reports

---

### ⚠️ **4. weeklySummary** - OVERLAPS WITH SCHEDULED REPORTS

**What it does**: Automatically sends weekly financial summary to ALL active users every Monday at 8:00 AM

**Backend Implementation** (`WeeklySummaryScheduler.java`):
```java
@Scheduled(cron = "0 0 8 * * MON") // Every Monday at 8:00 AM
public void sendWeeklySummaryToAllUsers() {
    LocalDate endDate = LocalDate.now();
    LocalDate startDate = endDate.minusDays(7); // Last 7 days

    List<User> activeUsers = userRepository.findByIsActive(true);

    for (User user : activeUsers) {
        // Calculate totals from last 7 days
        // Send email if weeklySummary preference enabled
    }
}
```

**How it works**:
1. **Fixed schedule**: Every Monday 8:00 AM UTC
2. **Target**: All active users (batch operation)
3. **Data**: Last 7 days of transactions
4. **Email content**:
   - Total income
   - Total expense
   - Net savings
   - Savings rate %
   - Transaction count
5. **Preference check**: Only sends if `weeklySummary: true` AND `emailNotifications: true`

**User Control**:
- ❌ Cannot change timing (hardcoded Monday 8 AM)
- ❌ Cannot choose format (always email only, no PDF/CSV)
- ❌ Cannot customize frequency (always weekly)
- ✅ Can only disable via preference toggle

---

### ⚠️ **5. monthlySummary** - OVERLAPS WITH SCHEDULED REPORTS

**What it does**: Automatically sends monthly financial summary to ALL active users on 1st of each month at 8:00 AM

**Backend Implementation** (`MonthlySummaryScheduler.java`):
```java
@Scheduled(cron = "0 0 8 1 * ?") // 8:00 AM on 1st of every month
public void sendMonthlySummaryToAllUsers() {
    // Calculate previous month (handles Jan → Dec properly)
    int lastMonth = today.getMonthValue() == 1 ? 12 : today.getMonthValue() - 1;
    int yearForReport = today.getMonthValue() == 1 ? currentYear - 1 : currentYear;

    List<User> activeUsers = userRepository.findByIsActive(true);

    for (User user : activeUsers) {
        // Generate full monthly report using ReportService
        MonthlyReportResponse report = reportService.generateMonthlySummary(userId, year, month);

        // Send email if monthlySummary preference enabled
        emailService.sendMonthlySummaryEmail(userId, ...);
    }
}
```

**How it works**:
1. **Fixed schedule**: 1st day of month at 8:00 AM UTC
2. **Target**: All active users (batch operation)
3. **Data**: Full previous month's transactions (uses ReportService)
4. **Email content**:
   - Total income
   - Total expense
   - Net savings
   - Savings rate %
   - Vietnamese month name
5. **Preference check**: Only sends if `monthlySummary: true` AND `emailNotifications: true`

**User Control**:
- ❌ Cannot change timing (hardcoded 1st of month 8 AM)
- ❌ Cannot choose format (always email only, no PDF/CSV)
- ❌ Cannot customize frequency (always monthly)
- ✅ Can only disable via preference toggle

---

## ⚠️ **OVERLAP ANALYSIS: Weekly/Monthly Schedulers vs ScheduledReports**

### **ScheduledReports System** (Implemented in Flow 6D)

**What ScheduledReports offers**:
- ✅ **User-defined schedules** - Users create their own custom schedules
- ✅ **Flexible frequency** - DAILY, WEEKLY, MONTHLY, QUARTERLY, YEARLY
- ✅ **Format selection** - PDF, CSV, or BOTH (ZIP file with both formats)
- ✅ **Report type selection** - MONTHLY, YEARLY, or CATEGORY reports
- ✅ **Email delivery toggle** - Can disable email and download manually
- ✅ **Multiple schedules** - User can create unlimited schedules
- ✅ **Execution tracking** - Tracks lastRun, nextRun, runCount in database
- ✅ **Enable/disable toggle** - Can disable without deleting
- ✅ **Manual execution** - "Send Now" button via API
- ✅ **Full CRUD control** - Create, read, update, delete via UI

**ScheduledReports Implementation**:
```java
@Scheduled(cron = "0 0 * * * *") // Runs every hour
public void executeScheduledReports() {
    List<ScheduledReport> dueReports = scheduledReportRepository.findDueReports();

    for (ScheduledReport schedule : dueReports) {
        if (!schedule.isActive()) continue;

        // Generate report based on schedule.reportType (MONTHLY/YEARLY/CATEGORY)
        // Format based on schedule.format (PDF/CSV/BOTH)
        // Send email if schedule.emailDelivery is true
        // Update nextRun, lastRun, runCount
    }
}
```

---

### **SIDE-BY-SIDE COMPARISON**

| Feature | Weekly/Monthly Schedulers | ScheduledReports |
|---------|---------------------------|------------------|
| **Schedule Control** | ❌ Fixed (hardcoded) | ✅ User-customizable |
| **Timing** | ❌ Mon 8 AM / 1st 8 AM | ✅ Any frequency |
| **Format Options** | ❌ Email only | ✅ Email + PDF + CSV |
| **Report Types** | ❌ Summary only | ✅ Monthly/Yearly/Category |
| **Multiple Schedules** | ❌ One per type | ✅ Unlimited |
| **Execution History** | ❌ Not tracked | ✅ Full tracking |
| **Enable/Disable** | ✅ Via preference | ✅ Via isActive flag |
| **Manual Testing** | ⚠️ Manual methods only | ✅ API + UI button |
| **Target** | ❌ All users (batch) | ✅ Per-user schedules |
| **Preference Gating** | ✅ Checked | ❌ **NOT CHECKED** |

---

## 🔥 **CRITICAL OVERLAP ISSUE: DUPLICATE EMAILS**

### **Scenario: User Gets Two Monthly Reports**

1. **Automatic Monthly Summary** (preference-based):
   - `monthlySummary: true` → User receives email on 1st of month at 8 AM
   - Content: Simple email with totals (no PDF/CSV)

2. **User Creates ScheduledReport** (via UI):
   - Frequency: MONTHLY
   - Report Type: MONTHLY
   - Format: PDF
   - Email Delivery: true
   - Schedule: 1st of month

**Result**: User receives **TWO emails** on 1st of month:
1. Email from MonthlySummaryScheduler (simple text email)
2. Email from ScheduledReports (with PDF attachment)

**Root Cause**: ScheduledReports **DOES NOT** check `monthlySummary` preference

---

## 📋 **COMPARISON MATRIX**

### **What Weekly/Monthly Schedulers Provide**:
✅ Automatic summaries for ALL users (no setup required)
✅ Simple on/off control via preferences
✅ Guaranteed delivery for all active users

❌ No customization (format, timing, report type)
❌ No PDF/CSV attachments
❌ Cannot create multiple schedules
❌ Cannot track execution history

### **What ScheduledReports Provide**:
✅ Full user customization (timing, format, type)
✅ PDF and CSV exports with email attachments
✅ Multiple schedules per user
✅ Execution tracking (lastRun, nextRun, runCount)
✅ Manual execution ("Send Now" button)
✅ Enable/disable without deletion

❌ Requires user setup (not automatic)
❌ No preference check (potential for unwanted emails if emailNotifications disabled)

---

## 🎯 **ARCHITECTURAL ISSUES IDENTIFIED**

### **Issue 1: Feature Redundancy**

**Problem**: Weekly/Monthly Schedulers are **legacy automatic systems**, while ScheduledReports is a **modern user-controlled system**. They solve the same problem but with different approaches.

**Evidence**:
- Both send periodic financial summaries via email
- ScheduledReports offers superset functionality (PDF/CSV, custom timing, multiple schedules)
- Users who want weekly summaries can create a ScheduledReport with WEEKLY frequency

### **Issue 2: Duplicate Email Risk**

**Problem**: User can receive duplicate monthly reports if they:
1. Leave `monthlySummary: true` (default)
2. Create a MONTHLY ScheduledReport

**Impact**: Confusing UX, wasted email sends, duplicate content

### **Issue 3: Inconsistent Preference Checking**

**Problem**:
- Weekly/Monthly Schedulers check preferences (`weeklySummary`, `monthlySummary`)
- ScheduledReports **DO NOT** check specific preferences (only `emailNotifications` via EmailService)

**Impact**: No unified preference system across similar features

### **Issue 4: Limited Functionality**

**Problem**: Weekly/Monthly Schedulers send email-only summaries (no PDF/CSV)

**User Request**: "scheduled report function (which is much more detail and dedicated compared to the one in user preference)"

**Evidence**: ScheduledReports provide:
- PDF reports with professional formatting
- CSV exports for Excel analysis
- Attachments in emails (not just text)

---

## 💡 **RECOMMENDATIONS**

### **Option A: Remove weeklySummary & monthlySummary Preferences** ⭐ RECOMMENDED

**Rationale**:
- ScheduledReports system is **more powerful and flexible**
- Eliminates duplicate email risk
- Reduces user confusion (one system for scheduled reports)
- Simplifies codebase (remove 2 schedulers + preferences)

**Migration Plan**:
1. Remove `weeklySummary` and `monthlySummary` fields from UserPreferences
2. Delete WeeklySummaryScheduler.java
3. Delete MonthlySummaryScheduler.java
4. Update EmailService to remove these preference checks
5. Update PreferencesContext.js to remove getters
6. Recommend users to create ScheduledReports instead

**Remaining Preferences** (3 functional):
1. ✅ `viewMode` - UI display preference (no overlap)
2. ✅ `emailNotifications` - Master email switch (critical)
3. ✅ `budgetAlerts` - Immediate threshold alerts (unique functionality)

**Benefits**:
- ✅ No more duplicate emails
- ✅ Users have full control via ScheduledReports UI
- ✅ Cleaner architecture (one system for periodic reports)
- ✅ Reduces database columns (9 → 7 columns)
- ✅ Removes ~300 lines of scheduler code

**Drawbacks**:
- ⚠️ Users who rely on automatic summaries need to create ScheduledReports manually
- ⚠️ Breaking change for existing users with `weeklySummary: true` or `monthlySummary: true`

---

### **Option B: Add Preference Checks to ScheduledReports**

**Rationale**: Keep both systems but prevent duplicates

**Implementation**:
```java
// In ScheduledReportService.executeScheduledReports()
for (ScheduledReport schedule : dueReports) {
    if (!schedule.isActive()) continue;

    // NEW: Check specific preference based on frequency
    if (schedule.getFrequency() == ReportFrequency.WEEKLY) {
        if (!shouldSendEmail(schedule.getUserId(), "weeklySummary")) continue;
    } else if (schedule.getFrequency() == ReportFrequency.MONTHLY) {
        if (!shouldSendEmail(schedule.getUserId(), "monthlySummary")) continue;
    }

    // Continue with report generation...
}
```

**Benefits**:
- ✅ Prevents duplicate emails
- ✅ Keeps both automatic and manual systems
- ✅ No breaking changes for existing users

**Drawbacks**:
- ❌ Maintains redundant systems (two ways to do same thing)
- ❌ User confusion (which system to use?)
- ❌ More complex codebase

---

### **Option C: Deprecate Schedulers, Auto-Create ScheduledReports**

**Rationale**: Migrate users from old system to new system automatically

**Migration Strategy**:
1. For each user with `weeklySummary: true` → Auto-create WEEKLY ScheduledReport
2. For each user with `monthlySummary: true` → Auto-create MONTHLY ScheduledReport
3. Delete WeeklySummaryScheduler and MonthlySummaryScheduler
4. Remove preferences from database

**Benefits**:
- ✅ Smooth migration for existing users
- ✅ Unifies to single ScheduledReports system
- ✅ No duplicate emails

**Drawbacks**:
- ⚠️ Requires migration script
- ⚠️ Users might not understand why schedules appeared

---

## 📊 **FINAL VERDICT**

### **Current State**:
- **5 preferences total**
- **3 truly unique** (viewMode, emailNotifications, budgetAlerts)
- **2 redundant** (weeklySummary, monthlySummary - overlaps with ScheduledReports)

### **Recommendation**: **Option A - Remove weeklySummary & monthlySummary**

**Why**:
1. ScheduledReports is objectively more powerful (PDF/CSV, flexible timing, multiple schedules)
2. Eliminates duplicate email risk entirely
3. Simplifies architecture (one system for periodic reports)
4. Aligns with your goal: "only have a few days left for testing" - less code to test
5. User already confirmed ScheduledReports is "much more detail and dedicated"

**Impact**:
- **UserPreferences**: 9 columns → 7 columns (22% reduction)
- **Code deletion**: ~300+ lines (2 schedulers + email templates + tests)
- **Functionality**: No loss (users can recreate via ScheduledReports with MORE features)

**Migration**:
- Low risk (preferences default to false/true but users rarely use them)
- ScheduledReports UI provides better control
- Can add banner: "Want periodic reports? Create schedules in Reports → Scheduled Reports"

---

**Would you like me to proceed with Option A and remove the redundant weekly/monthly summary preferences?**
