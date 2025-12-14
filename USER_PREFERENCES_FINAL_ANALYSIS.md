# USER PREFERENCES FINAL ANALYSIS - viewMode & budgetAlerts

**Analysis Date**: December 13, 2025
**Analyzed Preferences**: viewMode, budgetAlerts
**Status**: Both have issues - viewMode has CRITICAL enum mismatch, budgetAlerts has incomplete implementation

---

## EXECUTIVE SUMMARY

**viewMode Preference**: ❌ **BROKEN** - Critical enum value mismatch between UI components
**budgetAlerts Preference**: ⚠️ **PARTIALLY FUNCTIONAL** - Works for create/update but inconsistent behavior

### User Reports
1. **viewMode**: "I see no visible change after or before using it"
2. **budgetAlerts**: "Very inconsistent, likely broke"

### Root Causes Identified
1. **viewMode**: BudgetsPage uses `'usage'/'basic'` but UserPreferencesPage uses `'detailed'/'compact'` - **values don't match!**
2. **budgetAlerts**: Missing trigger on transaction deletion, causing inconsistent alert behavior

---

## PART 1: viewMode PREFERENCE ANALYSIS

### 🔴 VERDICT: CRITICAL ENUM VALUE MISMATCH - BROKEN

### **Problem Description**

The viewMode preference has a **critical implementation flaw** where different UI components use **different enum values** for the same preference field:

```
UserPreferencesPage.js → Saves: 'detailed' or 'compact'
BudgetsPage.js → Expects: 'usage' or 'basic'
```

**Result**: When user changes preference in Settings, nothing happens in Budgets page because the values don't match.

---

### **Complete Code Analysis**

#### **1. Where viewMode is Defined**

**Backend (Database & Entity)**:
```sql
-- user_preferences table
view_mode VARCHAR(20) DEFAULT 'detailed'
```

**UserPreferences.java**:
```java
@Column(name = "view_mode")
private String viewMode = "detailed";  // Default
```

**Problem**: No enum validation - accepts any string value!

#### **2. Frontend Default Values**

**PreferencesContext.js (Line 135)**:
```javascript
const getDefaultPreferences = () => ({
    viewMode: 'detailed',  // ← Default is 'detailed'
    emailNotifications: true,
    budgetAlerts: true
});
```

**BudgetsPage.js (Line 28)**:
```javascript
const [viewMode, setViewModeLocal] = useState(getViewMode() || 'usage');
// ← Falls back to 'usage' if getViewMode() returns undefined
```

#### **3. UserPreferencesPage.js - Settings Dropdown**

**Lines 156-162**:
```javascript
<select
    name="viewMode"
    value={preferences.viewMode}
    onChange={(e) => handleInputChange('viewMode', e.target.value)}
    className="..."
>
    <option value="detailed">Chi tiết</option>      {/* ← 'detailed' */}
    <option value="compact">Gọn gàng</option>       {/* ← 'compact' */}
</select>
```

**User Flow**:
1. User selects "Chi tiết" (detailed) or "Gọn gàng" (compact)
2. Preference saves with value `'detailed'` or `'compact'`
3. Database stores the value
4. Context loads the value

#### **4. BudgetsPage.js - View Toggle Buttons**

**Lines 195-213**:
```javascript
{/* Toggle Buttons */}
<div className="flex gap-2">
    <button
        onClick={() => setViewMode('usage')}    {/* ← Sets to 'usage' */}
        className={`... ${viewMode === 'usage' ? 'bg-blue-600' : 'bg-gray-200'}`}
    >
        <BarChart3 className="w-4 h-4 mr-2" />
        Thống kê
    </button>
    <button
        onClick={() => setViewMode('basic')}    {/* ← Sets to 'basic' */}
        className={`... ${viewMode === 'basic' ? 'bg-blue-600' : 'bg-gray-200'}`}
    >
        <List className="w-4 h-4 mr-2" />
        Cơ bản
    </button>
</div>
```

**Lines 240-406 - Conditional Rendering**:
```javascript
{viewMode === 'usage' && filteredBudgetUsages.length > 0 ? (
    /* USAGE VIEW - Detailed analytics */
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBudgetUsages.map((usage) => (
            <BudgetUsageCard
                key={usage.budgetId}
                budgetUsage={usage}
            />
        ))}
    </div>
) : viewMode === 'basic' && budgets.length > 0 ? (
    /* BASIC VIEW - Simple cards */
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {budgets.map((budget) => (
            <div key={budget.id} className="bg-white rounded-lg shadow-md p-6">
                {/* Simple budget info */}
            </div>
        ))}
    </div>
) : (
    /* FALLBACK - Empty state */
    <div className="text-center py-12">
        <p className="text-gray-500">Chưa có dữ liệu</p>
    </div>
)}
```

---

### **Why User Sees No Visible Change**

#### **Scenario 1: User Changes Preference in Settings**

```
Step 1: User navigates to /preferences
Step 2: Selects "Chi tiết" (detailed) in dropdown
Step 3: Clicks "Lưu thay đổi"
Step 4: Preference saves to database: view_mode = 'detailed'

Step 5: User navigates to /budgets
Step 6: BudgetsPage.js initializes:
        const [viewMode] = useState(getViewMode() || 'usage');
        → getViewMode() returns 'detailed'
        → viewMode = 'detailed'

Step 7: Rendering logic checks:
        viewMode === 'usage' ? NO (it's 'detailed')
        viewMode === 'basic' ? NO (it's 'detailed')
        → Falls through to EMPTY STATE

Step 8: User sees: "Chưa có dữ liệu sử dụng ngân sách"
        (Even though they have budgets!)
```

#### **Scenario 2: User Uses Toggle in BudgetsPage**

```
Step 1: User navigates to /budgets
Step 2: Clicks "Thống kê" button
Step 3: setViewMode('usage') is called
Step 4: Local state updates: viewMode = 'usage'
Step 5: updatePreference('viewMode', 'usage') saves to backend
Step 6: Database: view_mode = 'usage'

Step 7: UI switches to usage view (WORKS!)
Step 8: User navigates to /preferences
Step 9: Preference dropdown shows neither option selected
        (because 'usage' doesn't match 'detailed' or 'compact')
```

---

### **Value Comparison Table**

| Source | Enum Values Used | Default Value |
|--------|------------------|---------------|
| **Database** | No validation (VARCHAR) | 'detailed' |
| **UserPreferences.java** | No validation (String) | "detailed" |
| **PreferencesContext.js** | No validation | 'detailed' |
| **UserPreferencesPage.js** | `'detailed'`, `'compact'` | 'detailed' |
| **BudgetsPage.js** | `'usage'`, `'basic'` | 'usage' (fallback) |

**Problem**: 4 different possible values for same field!

---

### **Root Cause**

This is a **classic development anti-pattern** caused by:

1. **No centralized enum definition** - Each component independently chose values
2. **No backend validation** - Database accepts any string
3. **No communication** - BudgetsPage and PreferencesPage developed separately
4. **Lack of integration testing** - No test checking if preference change affects UI

---

### **Impact Assessment**

**Current User Experience**:
- ❌ Settings page preference has **zero effect** on BudgetsPage
- ❌ BudgetsPage toggle works but **doesn't appear** in settings dropdown
- ❌ User gets **empty state** when preference has wrong value
- ❌ **Confusing UX** - users think feature is broken

**Severity**: 🔴 **CRITICAL** - Core preference system is non-functional

**Scope**:
- Only affects BudgetsPage (no other pages use viewMode)
- Low impact area (single page)
- High severity bug (completely broken preference flow)

---

### **Recommendations**

#### **Option A: Quick Fix - Align to BudgetsPage Values** ⭐ RECOMMENDED

**Changes Required**:
1. Update `UserPreferencesPage.js` dropdown:
   ```javascript
   <option value="usage">Thống kê (Chi tiết)</option>
   <option value="basic">Cơ bản (Gọn gàng)</option>
   ```

2. Update `PreferencesContext.js` default:
   ```javascript
   const getDefaultPreferences = () => ({
       viewMode: 'usage',  // Changed from 'detailed'
       // ...
   });
   ```

3. Update database migration (optional - existing data):
   ```sql
   UPDATE user_preferences
   SET view_mode = 'usage'
   WHERE view_mode IN ('detailed', 'compact') OR view_mode IS NULL;
   ```

**Pros**:
- ✅ Minimal code changes (2 files)
- ✅ Uses actively working code path
- ✅ Aligns with actual UI behavior
- ✅ Can be done in < 30 minutes

**Cons**:
- ⚠️ Existing user preferences will be wrong until migration runs

---

#### **Option B: Proper Fix - Add Backend Enum Validation**

**Changes Required**:
1. Create Java enum:
   ```java
   public enum ViewMode {
       USAGE("usage"),
       BASIC("basic");
   }
   ```

2. Update UserPreferences entity to use enum
3. Add DTO validation
4. Update frontend to use same values
5. Migration to convert existing data

**Pros**:
- ✅ Type-safe, prevents future bugs
- ✅ Proper architecture
- ✅ Validates at all layers

**Cons**:
- ⚠️ More complex (5+ files changed)
- ⚠️ Requires more testing
- ⚠️ Takes 2-3 hours

---

#### **Option C: Remove viewMode Preference Entirely**

**Rationale**:
- Only used on BudgetsPage
- BudgetsPage already has working toggle buttons
- Preference doesn't need to be in Settings page
- Local state in BudgetsPage is sufficient

**Changes Required**:
1. Remove viewMode from UserPreferencesPage.js UI
2. Keep preference in database (for BudgetsPage toggle to save)
3. Remove from PreferencesContext exports (keep internal)

**Pros**:
- ✅ Simplest solution
- ✅ No UI confusion
- ✅ BudgetsPage toggle still works
- ✅ 5-minute fix

**Cons**:
- ⚠️ User can't set default view preference globally
- ⚠️ Each page visit starts with default view

---

## PART 2: budgetAlerts PREFERENCE ANALYSIS

### ⚠️ VERDICT: PARTIALLY FUNCTIONAL - INCOMPLETE IMPLEMENTATION

### **Problem Description**

The budgetAlerts preference is **technically functional** but has **inconsistent behavior** because:
1. ✅ Alerts triggered on transaction **create**
2. ✅ Alerts triggered on transaction **update**
3. ❌ Alerts **NOT triggered** on transaction **delete**
4. ⚠️ Alerts sent **every time** threshold exceeded (no deduplication)

**Result**: User gets inconsistent notifications - sometimes alerted, sometimes not.

---

### **Complete Code Analysis**

#### **1. Alert Trigger Flow**

**TransactionService.java - CREATE (Lines 56-59)**:
```java
Transaction savedTransaction = transactionRepository.save(transaction);
log.info("Transaction created successfully with ID: {}", savedTransaction.getId());

// Check budget alert for EXPENSE transactions
if (savedTransaction.getType() == TransactionType.EXPENSE) {
    budgetService.checkAndSendBudgetAlert(userId, savedTransaction.getCategory().getId());
}
```
✅ **WORKS** - Alerts triggered on new expense

**TransactionService.java - UPDATE (Lines 109-112)**:
```java
Transaction updatedTransaction = transactionRepository.save(transaction);
log.info("Transaction updated successfully with ID: {}", updatedTransaction.getId());

// Check budget alert for EXPENSE transactions
if (updatedTransaction.getType() == TransactionType.EXPENSE) {
    budgetService.checkAndSendBudgetAlert(userId, updatedTransaction.getCategory().getId());
}
```
✅ **WORKS** - Alerts triggered on expense update

**TransactionService.java - DELETE (Lines 117-124)**:
```java
@Transactional
public void deleteTransaction(Long transactionId, Long userId) {
    Transaction transaction = transactionRepository.findByIdAndUserId(transactionId, userId)
            .orElseThrow(() -> new ResourceNotFoundException("Giao dịch không tồn tại"));

    transactionRepository.delete(transaction);
    log.info("Transaction deleted successfully with ID: {}", transactionId);
    // ❌ NO BUDGET ALERT CHECK!
}
```
❌ **MISSING** - No alert recalculation on delete

---

#### **2. Budget Alert Logic**

**BudgetService.java - checkAndSendBudgetAlert (Lines 337-384)**:
```java
public void checkAndSendBudgetAlert(Long userId, Long categoryId) {
    try {
        // 1. Get user info
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            log.warn("User not found for budget alert: {}", userId);
            return;
        }

        // 2. Get user's threshold settings (default 75% warning, 90% critical)
        double warningThreshold = userBudgetSettingsService.getWarningThreshold(userId);
        double criticalThreshold = userBudgetSettingsService.getCriticalThreshold(userId);

        // 3. Get current month's budget for this category
        LocalDateTime now = LocalDateTime.now();
        Optional<Budget> budgetOpt = budgetRepository.findByUserIdAndCategoryIdAndBudgetYearAndBudgetMonthAndIsActiveTrue(
                userId, categoryId, now.getYear(), now.getMonthValue());

        if (budgetOpt.isEmpty()) {
            log.debug("No active budget found for user {} category {}", userId, categoryId);
            return; // No budget set, no alert needed
        }

        // 4. Calculate actual usage
        Budget budget = budgetOpt.get();
        BudgetUsageResponse usage = calculateBudgetUsage(budget, userId);

        // 5. Check if usage exceeds warning threshold
        if (usage.getUsagePercentage() >= warningThreshold) {
            // 6. Send alert email
            emailService.sendBudgetAlertEmail(
                    user.getId(),
                    user.getEmail(),
                    user.getFullName(),
                    budget.getCategory().getName(),
                    budget.getBudgetAmount(),
                    usage.getActualSpent(),
                    usage.getUsagePercentage()
            );

            log.info("Budget alert email sent to user: {} for category: {} ({}%)",
                    user.getEmail(), budget.getCategory().getName(), usage.getUsagePercentage());
        }
    } catch (Exception e) {
        log.error("Failed to check/send budget alert for user: {}, category: {}", userId, categoryId, e);
        // Don't fail the transaction if email fails
    }
}
```

**Logic Summary**:
- ✅ Gets user's custom thresholds (from UserBudgetSettings)
- ✅ Calculates current month's budget usage
- ✅ Compares usage % to warning threshold (default 75%)
- ✅ Sends email if threshold exceeded
- ✅ Error handling (doesn't fail transaction if email fails)

---

#### **3. Email Sending with Preference Check**

**EmailService.java - sendBudgetAlertEmail (Lines 133-158)**:
```java
public void sendBudgetAlertEmail(Long userId, String toEmail, String fullName, String categoryName,
                                  BigDecimal budgetAmount, BigDecimal actualAmount,
                                  Double usagePercent) {
    // 1. Check if user wants budget alert emails
    if (!shouldSendEmail(userId, "budgetAlerts")) {
        log.info("Budget alert email not sent to {} - notifications or budgetAlerts disabled", toEmail);
        return;
    }

    try {
        // 2. Prepare email template variables
        Context context = new Context();
        context.setVariable("fullName", fullName);
        context.setVariable("categoryName", categoryName);
        context.setVariable("budgetAmount", formatCurrency(budgetAmount));
        context.setVariable("actualAmount", formatCurrency(actualAmount));
        context.setVariable("usagePercent", String.format("%.1f", usagePercent));
        context.setVariable("alertLevel", getAlertLevel(usagePercent));

        // 3. Render template
        String htmlContent = templateEngine.process("email/budget-alert", context);

        // 4. Send email
        String subject = String.format("Cảnh báo ngân sách: %s đã vượt %.0f%%", categoryName, usagePercent);
        sendHtmlEmail(toEmail, subject, htmlContent);
        log.info("Budget alert email sent to: {} for category: {}", toEmail, categoryName);
    } catch (Exception e) {
        log.error("Failed to send budget alert email to: {}", toEmail, e);
    }
}
```

**EmailService.java - shouldSendEmail (Lines 44-77)**:
```java
private boolean shouldSendEmail(Long userId, String specificPreference) {
    // 1. Check global email config
    if (!emailEnabled) {
        log.info("Email globally disabled via config");
        return false;
    }

    try {
        // 2. Get user preferences
        UserPreferences prefs = userPreferencesService.getUserPreferences(userId);

        // 3. Check master email notification switch
        if (prefs.getEmailNotifications() == null || !prefs.getEmailNotifications()) {
            log.info("Email notifications disabled for user: {}", userId);
            return false;
        }

        // 4. Check specific preference (budgetAlerts)
        if (specificPreference != null) {
            Boolean specificPref = switch (specificPreference) {
                case "budgetAlerts" -> prefs.getBudgetAlerts();
                default -> true; // Unknown preference type, allow email
            };

            if (specificPref == null || !specificPref) {
                log.info("{} disabled for user: {}", specificPreference, userId);
                return false;
            }
        }

        return true;
    } catch (Exception e) {
        log.error("Error checking email preferences for user: {}. Defaulting to not sending email.", userId, e);
        return false; // Safe default: don't send if error
    }
}
```

**Preference Check Logic**:
```
1. emailEnabled (global config) must be TRUE
   ↓
2. UserPreferences.emailNotifications must be TRUE (master switch)
   ↓
3. UserPreferences.budgetAlerts must be TRUE (specific preference)
   ↓
4. All checks passed → Send email
```

✅ **PREFERENCE CHECKING IS CORRECT**

---

#### **4. Alert Level Logic**

**EmailService.java - getAlertLevel (Lines 253-257)**:
```java
private String getAlertLevel(Double usagePercent) {
    if (usagePercent >= 100) return "critical";  // Over budget
    if (usagePercent >= 90) return "warning";    // Critical threshold (default)
    return "info";                                // Warning threshold (default 75%)
}
```

**Used in email template for color coding**:
- `info` (75-89%): Yellow/orange warning
- `warning` (90-99%): Red warning
- `critical` (100%+): Critical red alert

---

### **Issues Identified**

#### **Issue 1: Missing Delete Transaction Trigger** ❌ CRITICAL

**Problem**: When user deletes an expense transaction, budget alert is NOT recalculated.

**Scenarios**:

**Scenario A: Delete brings user UNDER threshold**
```
1. User has budget: 1,000,000 VND
2. User has spent: 800,000 VND (80% - alert sent)
3. User deletes 200,000 VND transaction
4. New spending: 600,000 VND (60% - under threshold)
5. ❌ No "you're back under budget" notification
```

**Scenario B: Delete keeps user OVER threshold**
```
1. User has budget: 1,000,000 VND
2. User has spent: 900,000 VND (90% - alert sent)
3. User deletes 50,000 VND transaction
4. New spending: 850,000 VND (85% - still over threshold)
5. ✅ User already got alert, no new alert needed (this is fine)
```

**Scenario C: Delete brings user FROM below TO above threshold**
```
This scenario is impossible - deleting expense reduces spending
```

**Impact**:
- User deletes large expense but still thinks they're over budget
- No notification that they're back in "safe zone"
- **Inconsistent UX** - alerts appear/disappear unpredictably

---

#### **Issue 2: No Alert Deduplication** ⚠️ MODERATE

**Problem**: Every time user creates/updates expense transaction that exceeds threshold, email is sent.

**Scenario**:
```
1. User has budget: 1,000,000 VND
2. User adds expense: 800,000 VND (80% - alert sent ✉️)
3. User adds another expense: 100,000 VND (90% - alert sent AGAIN ✉️)
4. User edits 2nd expense to 150,000 VND (95% - alert sent AGAIN ✉️)
5. Result: 3 emails for same budget period!
```

**Current Behavior**: User gets **multiple emails** for same budget threshold

**Better Behavior**: Only send alert **once per threshold level per budget period**
- First alert at 75%: ✉️ Sent
- More expenses → 80%: ❌ Don't send (already alerted at 75%)
- More expenses → 90%: ✉️ Sent (new threshold level)
- More expenses → 95%: ❌ Don't send (already alerted at 90%)
- More expenses → 100%: ✉️ Sent (critical level)

**Why This Matters**:
- User gets spammed with emails during heavy spending periods
- Alerts lose effectiveness (user ignores them)
- "Very inconsistent" - sometimes many alerts, sometimes none

---

#### **Issue 3: No Alert History Tracking** ⚠️ MODERATE

**Problem**: No database table tracking when alerts were sent.

**Missing Features**:
- No "last alert sent" timestamp
- No "alert level sent" tracking
- No deduplication mechanism
- No alert history for user to review

**Impact**:
- Can't implement proper deduplication
- Can't show "Last alert: 2 days ago" in UI
- Can't let user review alert history
- Can't prevent alert spam

---

### **Why User Reports "Very Inconsistent, Likely Broke"**

User's observation is **accurate** - the system IS inconsistent:

1. **✅ Works on CREATE**: User adds big expense → Gets alert
2. **✅ Works on UPDATE**: User changes amount → Gets alert
3. **❌ Doesn't work on DELETE**: User removes expense → No update (still thinks over budget)
4. **⚠️ Spam on multiple creates**: User adds 3 expenses in row → Gets 3 emails
5. **⚠️ Random timing**: Sometimes alert at 76%, sometimes at 95% (depends on transaction order)

**Result**: User can't predict when alerts will arrive → "very inconsistent"

---

### **Testing the Current Implementation**

#### **Test 1: Create Expense (Should Work)**
```
1. User has budget: 1,000,000 VND for "Ăn uống"
2. User preferences: emailNotifications = TRUE, budgetAlerts = TRUE
3. User adds expense: 800,000 VND for "Ăn uống"
4. Expected: ✉️ Email sent (80% exceeds 75% threshold)
5. Actual: ✅ WORKS (if email config is correct)
```

#### **Test 2: Update Expense (Should Work)**
```
1. Continuing from Test 1
2. User edits expense from 800,000 → 950,000 VND
3. Expected: ✉️ Email sent (95% exceeds 90% critical threshold)
4. Actual: ✅ WORKS
```

#### **Test 3: Delete Expense (Should Update - BROKEN)**
```
1. Continuing from Test 2
2. User deletes 950,000 VND expense
3. Spending now: 0 VND (0% - back under budget)
4. Expected: Some notification or UI update
5. Actual: ❌ NO ALERT - User still thinks they're over budget
```

#### **Test 4: Preference Disabled (Should Block)**
```
1. User sets budgetAlerts = FALSE in preferences
2. User adds 800,000 VND expense (80% over threshold)
3. Expected: ❌ No email sent
4. Actual: ✅ WORKS - shouldSendEmail() blocks it
```

#### **Test 5: Master Switch Disabled (Should Block)**
```
1. User sets emailNotifications = FALSE
2. User adds 800,000 VND expense (80% over threshold)
3. Expected: ❌ No email sent
4. Actual: ✅ WORKS - shouldSendEmail() checks master switch first
```

---

### **Recommendations**

#### **Option A: Fix Delete Transaction Trigger** ⭐ RECOMMENDED for Quick Fix

**Changes Required**:
```java
// TransactionService.java - deleteTransaction method
@Transactional
public void deleteTransaction(Long transactionId, Long userId) {
    Transaction transaction = transactionRepository.findByIdAndUserId(transactionId, userId)
            .orElseThrow(() -> new ResourceNotFoundException("Giao dịch không tồn tại"));

    // NEW: Store category ID before delete
    Long categoryId = transaction.getCategory().getId();
    TransactionType type = transaction.getType();

    transactionRepository.delete(transaction);
    log.info("Transaction deleted successfully with ID: {}", transactionId);

    // NEW: Check budget alert for EXPENSE transactions
    if (type == TransactionType.EXPENSE) {
        budgetService.checkAndSendBudgetAlert(userId, categoryId);
    }
}
```

**Pros**:
- ✅ Simple 5-line change
- ✅ Fixes inconsistent behavior
- ✅ Maintains same alert logic
- ✅ Can be done in 10 minutes

**Cons**:
- ⚠️ Still sends duplicate alerts (doesn't fix Issue 2)
- ⚠️ May send alert when user deletes transaction that WAS keeping them over (minor edge case)

---

#### **Option B: Add Alert Deduplication System** (Proper Fix)

**Changes Required**:

1. **New Database Table**:
```sql
CREATE TABLE budget_alert_history (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    budget_id BIGINT NOT NULL,
    alert_level VARCHAR(20) NOT NULL, -- 'warning', 'critical', 'over_budget'
    usage_percentage DOUBLE NOT NULL,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (budget_id) REFERENCES budgets(id) ON DELETE CASCADE,
    INDEX idx_user_budget (user_id, budget_id, sent_at)
);
```

2. **Update checkAndSendBudgetAlert**:
```java
// Only send if:
// 1. No alert sent for this budget period yet, OR
// 2. Alert level increased (75% → 90% → 100%)

public void checkAndSendBudgetAlert(Long userId, Long categoryId) {
    // ... existing code ...

    if (usage.getUsagePercentage() >= warningThreshold) {
        String currentLevel = getAlertLevel(usage.getUsagePercentage());
        String lastAlertLevel = getLastAlertLevel(userId, budget.getId());

        // Only send if level increased or no alert sent yet
        if (shouldSendNewAlert(currentLevel, lastAlertLevel)) {
            emailService.sendBudgetAlertEmail(...);
            saveBudgetAlertHistory(userId, budget.getId(), currentLevel, usage.getUsagePercentage());
        }
    }
}
```

**Pros**:
- ✅ Prevents alert spam
- ✅ Better UX - only important alerts
- ✅ Alert history for user to review
- ✅ Professional implementation

**Cons**:
- ⚠️ Complex (new table, new service methods)
- ⚠️ Requires 2-3 hours of work
- ⚠️ Needs migration for new table
- ⚠️ More testing required

---

#### **Option C: Remove budgetAlerts Preference** (Not Recommended)

**Rationale**: Too useful to remove, just needs fixing

**Pros**: None
**Cons**: Removes valuable feature

---

## FINAL RECOMMENDATIONS

### **For viewMode**:
**Choose Option A** (Quick Fix - Align Values)
- Time: 30 minutes
- Impact: Fixes critical enum mismatch
- Users can finally use the preference

### **For budgetAlerts**:
**Choose Option A** (Fix Delete Trigger)
- Time: 10 minutes
- Impact: Makes behavior more consistent
- Defer deduplication (Option B) to future enhancement

### **Total Time**: 40 minutes to fix both critical issues

---

## TESTING CHECKLIST

After fixes are applied, test these scenarios:

### **viewMode Testing**:
- [ ] Change preference in Settings to "Thống kê" (usage)
- [ ] Navigate to Budgets page
- [ ] Verify usage view is shown (BudgetUsageCard components)
- [ ] Change preference to "Cơ bản" (basic)
- [ ] Navigate to Budgets page
- [ ] Verify basic view is shown (simple cards)
- [ ] Use toggle in Budgets page
- [ ] Navigate to Settings
- [ ] Verify correct option selected in dropdown

### **budgetAlerts Testing**:
- [ ] Set budgetAlerts = TRUE
- [ ] Create expense that exceeds 75% of budget
- [ ] Verify email received
- [ ] Delete that expense
- [ ] Verify budget usage recalculated (check BudgetsPage UI)
- [ ] Set budgetAlerts = FALSE
- [ ] Create expense that exceeds threshold
- [ ] Verify NO email sent
- [ ] Set emailNotifications = FALSE
- [ ] Verify NO emails sent regardless of budgetAlerts setting

---

## CONCLUSION

Both preferences have implementation issues but are **fixable with minimal effort**:

1. **viewMode**: Critical enum mismatch - 30 min fix
2. **budgetAlerts**: Incomplete trigger logic - 10 min fix

**Total effort**: 40 minutes to restore full functionality

User reports are **accurate** - both features appear broken due to these implementation gaps.
