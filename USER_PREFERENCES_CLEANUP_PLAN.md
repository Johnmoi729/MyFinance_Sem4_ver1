# User Preferences Cleanup Plan - Option A (Aggressive Cleanup)

**Date**: December 13, 2025
**Status**: 📋 PLANNING PHASE
**Target**: Remove 8/13 non-functional preference fields
**Estimated Time**: 2-3 hours
**Risk Level**: 🟢 LOW (removing unused fields only)

---

## 📊 Executive Summary

After comprehensive codebase analysis, **8 out of 13 UserPreferences fields are completely non-functional**:

**Fields to Remove (8 total)**:
1. `language` - No i18n system implemented
2. `currency` - Multi-currency removed in VND_ONLY_MIGRATION
3. `dateFormat` - Hardcoded to dd/MM/yyyy Vietnamese standard
4. `timezone` - Vietnam single timezone, never checked
5. `theme` - Dark mode removed from frontend (December 2025)
6. `itemsPerPage` - Pagination hardcoded to 10, never checked
7. `transactionReminders` - Feature doesn't exist
8. `goalReminders` - Goal feature doesn't exist

**Fields to Keep (5 total)**:
1. `emailNotifications` - ✅ Master email switch (checked by EmailService)
2. `budgetAlerts` - ✅ Budget alert emails (checked by EmailService)
3. `monthlySummary` - ✅ Monthly email summaries (checked by MonthlySummaryScheduler)
4. `weeklySummary` - ✅ Weekly email summaries (checked by WeeklySummaryScheduler)
5. `viewMode` - ✅ Controls budget view display (BudgetsPage.js)

---

## 🎯 Benefits of Option A Cleanup

1. **Reduced Complexity**: 13 → 5 fields (61.5% reduction)
2. **Smaller Database**: 8 fewer columns in user_preferences table
3. **Cleaner UI**: Remove 8 non-functional settings from UserPreferencesPage
4. **Better UX**: Users won't see settings that don't work
5. **Easier Testing**: Fewer fields to test and maintain
6. **Accurate Documentation**: Code matches actual functionality

---

## 📋 Files to Modify

### Backend (5 files)
1. **Entity**: `MyFinance Backend/src/main/java/com/myfinance/entity/UserPreferences.java`
2. **Request DTO**: `MyFinance Backend/src/main/java/com/myfinance/dto/request/UserPreferencesRequest.java`
3. **Response DTO**: `MyFinance Backend/src/main/java/com/myfinance/dto/response/UserPreferencesResponse.java`
4. **Service**: `MyFinance Backend/src/main/java/com/myfinance/service/UserPreferencesService.java`
5. **Database**: Migration SQL + complete-database-init.sql

### Frontend (1 file)
6. **UI Page**: `myfinance-frontend/src/pages/preferences/UserPreferencesPage.js`

### Context (Optional - if needed)
7. **PreferencesContext**: `myfinance-frontend/src/context/PreferencesContext.js` (may need updates)

**Total Files**: 6-7 files to modify

---

## 🗄️ Step 1: Database Migration

### Migration SQL - Manual Execution in phpMyAdmin

```sql
-- =====================================================
-- USER PREFERENCES CLEANUP MIGRATION
-- Purpose: Remove 8 non-functional preference fields
-- Date: December 13, 2025
-- Risk: LOW (only removing unused columns)
-- =====================================================

-- STEP 1: BACKUP VERIFICATION
-- Before running, verify backup exists:
SELECT COUNT(*) AS total_users,
       COUNT(DISTINCT user_id) AS users_with_prefs
FROM user_preferences;
-- Expected: Should show user count matches users table

-- STEP 2: CHECK CURRENT SCHEMA
DESCRIBE user_preferences;
-- Expected: 18 columns total (id, user_id, 13 preference fields, created_at, updated_at, foreign key)

-- STEP 3: DROP NON-FUNCTIONAL COLUMNS
ALTER TABLE user_preferences
    DROP COLUMN language,
    DROP COLUMN currency,
    DROP COLUMN date_format,
    DROP COLUMN timezone,
    DROP COLUMN theme,
    DROP COLUMN items_per_page,
    DROP COLUMN transaction_reminders,
    DROP COLUMN goal_reminders;

-- STEP 4: VERIFICATION QUERIES
-- Verify columns were dropped successfully
DESCRIBE user_preferences;
-- Expected: 10 columns (id, user_id, 5 preference fields, created_at, updated_at, foreign key)

-- Verify data integrity
SELECT COUNT(*) FROM user_preferences;
-- Expected: Same count as before (no data loss, only column removal)

-- Verify remaining columns
SELECT id, user_id, email_notifications, budget_alerts, monthly_summary,
       weekly_summary, view_mode, created_at, updated_at
FROM user_preferences
LIMIT 5;
-- Expected: All rows should have data in remaining columns

-- =====================================================
-- ROLLBACK INSTRUCTIONS (if needed)
-- =====================================================
/*
ALTER TABLE user_preferences
    ADD COLUMN language VARCHAR(10) DEFAULT 'vi' AFTER user_id,
    ADD COLUMN currency VARCHAR(10) DEFAULT 'VND' AFTER language,
    ADD COLUMN date_format VARCHAR(20) DEFAULT 'dd/MM/yyyy' AFTER currency,
    ADD COLUMN timezone VARCHAR(50) DEFAULT 'Asia/Ho_Chi_Minh' AFTER date_format,
    ADD COLUMN theme VARCHAR(20) DEFAULT 'light' AFTER timezone,
    ADD COLUMN items_per_page INT DEFAULT 10 AFTER theme,
    ADD COLUMN transaction_reminders BOOLEAN DEFAULT TRUE AFTER monthly_summary,
    ADD COLUMN goal_reminders BOOLEAN DEFAULT FALSE AFTER transaction_reminders;
*/

-- =====================================================
-- MIGRATION COMPLETE
-- Table now has 10 columns (was 18)
-- 8 non-functional columns removed
-- =====================================================
```

### Update Fresh Installation Schema

**File**: `database/complete-database-init.sql`

**Change**:
```sql
-- BEFORE (18 columns total):
CREATE TABLE IF NOT EXISTS user_preferences (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNIQUE NOT NULL,
    -- Display Preferences (7 fields)
    language VARCHAR(10) DEFAULT 'vi',
    currency VARCHAR(10) DEFAULT 'VND',
    date_format VARCHAR(20) DEFAULT 'dd/MM/yyyy',
    timezone VARCHAR(50) DEFAULT 'Asia/Ho_Chi_Minh',
    theme VARCHAR(20) DEFAULT 'light',
    items_per_page INT DEFAULT 10,
    view_mode VARCHAR(20) DEFAULT 'detailed',
    -- Notification Preferences (6 fields)
    email_notifications BOOLEAN DEFAULT TRUE,
    budget_alerts BOOLEAN DEFAULT TRUE,
    transaction_reminders BOOLEAN DEFAULT TRUE,
    weekly_summary BOOLEAN DEFAULT FALSE,
    monthly_summary BOOLEAN DEFAULT TRUE,
    goal_reminders BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_preferences_user_id (user_id)
);

-- AFTER (10 columns total):
CREATE TABLE IF NOT EXISTS user_preferences (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNIQUE NOT NULL,
    -- Display Preferences (1 field)
    view_mode VARCHAR(20) DEFAULT 'detailed', -- Controls budget view (usage/basic)
    -- Notification Preferences (4 fields)
    email_notifications BOOLEAN DEFAULT TRUE, -- Master email switch
    budget_alerts BOOLEAN DEFAULT TRUE, -- Budget alert emails
    weekly_summary BOOLEAN DEFAULT FALSE, -- Weekly email summaries
    monthly_summary BOOLEAN DEFAULT TRUE, -- Monthly email summaries
    -- NOTE: All other preferences managed by UserPreferences entity have been removed
    -- Removed: language, currency, dateFormat, timezone, theme, itemsPerPage (no functionality)
    -- Removed: transactionReminders, goalReminders (features don't exist)
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_preferences_user_id (user_id)
);
```

---

## ☕ Step 2: Backend - Entity Update

**File**: `MyFinance Backend/src/main/java/com/myfinance/entity/UserPreferences.java`

**Lines to Remove**: 8 field definitions (~40 lines total)

**Before**:
```java
@Entity
@Table(name = "user_preferences")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserPreferences {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", unique = true, nullable = false)
    private Long userId;

    // Display Preferences (7 fields - REMOVE 6)
    @Column(name = "language", length = 10)
    private String language = "vi"; // REMOVE

    @Column(name = "currency", length = 10)
    private String currency = "VND"; // REMOVE

    @Column(name = "date_format", length = 20)
    private String dateFormat = "dd/MM/yyyy"; // REMOVE

    @Column(name = "timezone", length = 50)
    private String timezone = "Asia/Ho_Chi_Minh"; // REMOVE

    @Column(name = "theme", length = 20)
    private String theme = "light"; // REMOVE

    @Column(name = "items_per_page")
    private Integer itemsPerPage = 10; // REMOVE

    @Column(name = "view_mode", length = 20)
    private String viewMode = "detailed"; // KEEP

    // Notification Preferences (6 fields - REMOVE 2)
    @Column(name = "email_notifications")
    private Boolean emailNotifications = true; // KEEP

    @Column(name = "budget_alerts")
    private Boolean budgetAlerts = true; // KEEP

    @Column(name = "transaction_reminders")
    private Boolean transactionReminders = true; // REMOVE

    @Column(name = "weekly_summary")
    private Boolean weeklySummary = false; // KEEP

    @Column(name = "monthly_summary")
    private Boolean monthlySummary = true; // KEEP

    @Column(name = "goal_reminders")
    private Boolean goalReminders = false; // REMOVE

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
```

**After** (Only 5 preference fields remain):
```java
@Entity
@Table(name = "user_preferences")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserPreferences {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", unique = true, nullable = false)
    private Long userId;

    // Display Preferences (1 field)
    @Column(name = "view_mode", length = 20)
    private String viewMode = "detailed"; // Controls budget view (usage/basic)

    // Notification Preferences (4 fields)
    @Column(name = "email_notifications")
    private Boolean emailNotifications = true; // Master email switch

    @Column(name = "budget_alerts")
    private Boolean budgetAlerts = true; // Budget alert emails

    @Column(name = "weekly_summary")
    private Boolean weeklySummary = false; // Weekly email summaries

    @Column(name = "monthly_summary")
    private Boolean monthlySummary = true; // Monthly email summaries

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
```

**Change Summary**:
- Removed 8 `@Column` field definitions
- Lombok `@Data` will automatically remove getters/setters for deleted fields
- Total: ~40 lines removed

---

## ☕ Step 3: Backend - Request DTO Update

**File**: `MyFinance Backend/src/main/java/com/myfinance/dto/request/UserPreferencesRequest.java`

**Before**:
```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserPreferencesRequest {
    // Display Preferences (7 fields - REMOVE 6)
    private String language; // REMOVE
    private String currency; // REMOVE
    private String dateFormat; // REMOVE
    private String timezone; // REMOVE
    private String theme; // REMOVE
    private Integer itemsPerPage; // REMOVE
    private String viewMode; // KEEP

    // Notification Preferences (6 fields - REMOVE 2)
    private Boolean emailNotifications; // KEEP
    private Boolean budgetAlerts; // KEEP
    private Boolean transactionReminders; // REMOVE
    private Boolean weeklySummary; // KEEP
    private Boolean monthlySummary; // KEEP
    private Boolean goalReminders; // REMOVE
}
```

**After**:
```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserPreferencesRequest {
    // Display Preferences (1 field)
    private String viewMode; // Controls budget view (usage/basic)

    // Notification Preferences (4 fields)
    private Boolean emailNotifications; // Master email switch
    private Boolean budgetAlerts; // Budget alert emails
    private Boolean weeklySummary; // Weekly email summaries
    private Boolean monthlySummary; // Monthly email summaries
}
```

**Change Summary**:
- Removed 8 field definitions
- Total: ~8 lines removed

---

## ☕ Step 4: Backend - Response DTO Update

**File**: `MyFinance Backend/src/main/java/com/myfinance/dto/response/UserPreferencesResponse.java`

**Before**:
```java
@Data
@Builder
public class UserPreferencesResponse {
    private Long id;
    private Long userId;

    // Display Preferences (7 fields - REMOVE 6)
    private String language; // REMOVE
    private String currency; // REMOVE
    private String dateFormat; // REMOVE
    private String timezone; // REMOVE
    private String theme; // REMOVE
    private Integer itemsPerPage; // REMOVE
    private String viewMode; // KEEP

    // Notification Preferences (6 fields - REMOVE 2)
    private Boolean emailNotifications; // KEEP
    private Boolean budgetAlerts; // KEEP
    private Boolean transactionReminders; // REMOVE
    private Boolean weeklySummary; // KEEP
    private Boolean monthlySummary; // KEEP
    private Boolean goalReminders; // REMOVE

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
```

**After**:
```java
@Data
@Builder
public class UserPreferencesResponse {
    private Long id;
    private Long userId;

    // Display Preferences (1 field)
    private String viewMode; // Controls budget view (usage/basic)

    // Notification Preferences (4 fields)
    private Boolean emailNotifications; // Master email switch
    private Boolean budgetAlerts; // Budget alert emails
    private Boolean weeklySummary; // Weekly email summaries
    private Boolean monthlySummary; // Monthly email summaries

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
```

**Change Summary**:
- Removed 8 field definitions
- Total: ~8 lines removed

---

## ☕ Step 5: Backend - Service Layer Update

**File**: `MyFinance Backend/src/main/java/com/myfinance/service/UserPreferencesService.java`

**Methods to Update**:
1. `updateUserPreferences()` - Remove 8 setter calls
2. `createDefaultPreferences()` - Remove 8 default value setters
3. `mapToResponse()` - Remove 8 builder fields

**Before - updateUserPreferences()**:
```java
public UserPreferencesResponse updateUserPreferences(Long userId, UserPreferencesRequest request) {
    UserPreferences prefs = userPreferencesRepository.findByUserId(userId)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy cài đặt"));

    // Update display preferences
    if (request.getLanguage() != null) prefs.setLanguage(request.getLanguage()); // REMOVE
    if (request.getCurrency() != null) prefs.setCurrency(request.getCurrency()); // REMOVE
    if (request.getDateFormat() != null) prefs.setDateFormat(request.getDateFormat()); // REMOVE
    if (request.getTimezone() != null) prefs.setTimezone(request.getTimezone()); // REMOVE
    if (request.getTheme() != null) prefs.setTheme(request.getTheme()); // REMOVE
    if (request.getItemsPerPage() != null) prefs.setItemsPerPage(request.getItemsPerPage()); // REMOVE
    if (request.getViewMode() != null) prefs.setViewMode(request.getViewMode()); // KEEP

    // Update notification preferences
    if (request.getEmailNotifications() != null) prefs.setEmailNotifications(request.getEmailNotifications()); // KEEP
    if (request.getBudgetAlerts() != null) prefs.setBudgetAlerts(request.getBudgetAlerts()); // KEEP
    if (request.getTransactionReminders() != null) prefs.setTransactionReminders(request.getTransactionReminders()); // REMOVE
    if (request.getWeeklySummary() != null) prefs.setWeeklySummary(request.getWeeklySummary()); // KEEP
    if (request.getMonthlySummary() != null) prefs.setMonthlySummary(request.getMonthlySummary()); // KEEP
    if (request.getGoalReminders() != null) prefs.setGoalReminders(request.getGoalReminders()); // REMOVE

    UserPreferences saved = userPreferencesRepository.save(prefs);
    return mapToResponse(saved);
}
```

**After - updateUserPreferences()**:
```java
public UserPreferencesResponse updateUserPreferences(Long userId, UserPreferencesRequest request) {
    UserPreferences prefs = userPreferencesRepository.findByUserId(userId)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy cài đặt"));

    // Update display preferences (1 field)
    if (request.getViewMode() != null) prefs.setViewMode(request.getViewMode());

    // Update notification preferences (4 fields)
    if (request.getEmailNotifications() != null) prefs.setEmailNotifications(request.getEmailNotifications());
    if (request.getBudgetAlerts() != null) prefs.setBudgetAlerts(request.getBudgetAlerts());
    if (request.getWeeklySummary() != null) prefs.setWeeklySummary(request.getWeeklySummary());
    if (request.getMonthlySummary() != null) prefs.setMonthlySummary(request.getMonthlySummary());

    UserPreferences saved = userPreferencesRepository.save(prefs);
    return mapToResponse(saved);
}
```

**Before - createDefaultPreferences()**:
```java
public UserPreferences createDefaultPreferences(Long userId) {
    UserPreferences prefs = new UserPreferences();
    prefs.setUserId(userId);

    // Set display defaults
    prefs.setLanguage("vi"); // REMOVE
    prefs.setCurrency("VND"); // REMOVE
    prefs.setDateFormat("dd/MM/yyyy"); // REMOVE
    prefs.setTimezone("Asia/Ho_Chi_Minh"); // REMOVE
    prefs.setTheme("light"); // REMOVE
    prefs.setItemsPerPage(10); // REMOVE
    prefs.setViewMode("detailed"); // KEEP

    // Set notification defaults
    prefs.setEmailNotifications(true); // KEEP
    prefs.setBudgetAlerts(true); // KEEP
    prefs.setTransactionReminders(true); // REMOVE
    prefs.setWeeklySummary(false); // KEEP
    prefs.setMonthlySummary(true); // KEEP
    prefs.setGoalReminders(false); // REMOVE

    return userPreferencesRepository.save(prefs);
}
```

**After - createDefaultPreferences()**:
```java
public UserPreferences createDefaultPreferences(Long userId) {
    UserPreferences prefs = new UserPreferences();
    prefs.setUserId(userId);

    // Set display defaults (1 field)
    prefs.setViewMode("detailed");

    // Set notification defaults (4 fields)
    prefs.setEmailNotifications(true);
    prefs.setBudgetAlerts(true);
    prefs.setWeeklySummary(false);
    prefs.setMonthlySummary(true);

    return userPreferencesRepository.save(prefs);
}
```

**Before - mapToResponse()**:
```java
private UserPreferencesResponse mapToResponse(UserPreferences prefs) {
    return UserPreferencesResponse.builder()
            .id(prefs.getId())
            .userId(prefs.getUserId())
            // Display preferences
            .language(prefs.getLanguage()) // REMOVE
            .currency(prefs.getCurrency()) // REMOVE
            .dateFormat(prefs.getDateFormat()) // REMOVE
            .timezone(prefs.getTimezone()) // REMOVE
            .theme(prefs.getTheme()) // REMOVE
            .itemsPerPage(prefs.getItemsPerPage()) // REMOVE
            .viewMode(prefs.getViewMode()) // KEEP
            // Notification preferences
            .emailNotifications(prefs.getEmailNotifications()) // KEEP
            .budgetAlerts(prefs.getBudgetAlerts()) // KEEP
            .transactionReminders(prefs.getTransactionReminders()) // REMOVE
            .weeklySummary(prefs.getWeeklySummary()) // KEEP
            .monthlySummary(prefs.getMonthlySummary()) // KEEP
            .goalReminders(prefs.getGoalReminders()) // REMOVE
            .createdAt(prefs.getCreatedAt())
            .updatedAt(prefs.getUpdatedAt())
            .build();
}
```

**After - mapToResponse()**:
```java
private UserPreferencesResponse mapToResponse(UserPreferences prefs) {
    return UserPreferencesResponse.builder()
            .id(prefs.getId())
            .userId(prefs.getUserId())
            // Display preferences (1 field)
            .viewMode(prefs.getViewMode())
            // Notification preferences (4 fields)
            .emailNotifications(prefs.getEmailNotifications())
            .budgetAlerts(prefs.getBudgetAlerts())
            .weeklySummary(prefs.getWeeklySummary())
            .monthlySummary(prefs.getMonthlySummary())
            .createdAt(prefs.getCreatedAt())
            .updatedAt(prefs.getUpdatedAt())
            .build();
}
```

**Change Summary**:
- Removed 8 setter calls in `updateUserPreferences()`
- Removed 8 default value setters in `createDefaultPreferences()`
- Removed 8 builder fields in `mapToResponse()`
- **Total**: ~24 lines removed across 3 methods

---

## ⚛️ Step 6: Frontend - UserPreferencesPage Update

**File**: `myfinance-frontend/src/pages/preferences/UserPreferencesPage.js`

**Current Structure**: Page has 3 sections with 19 total settings

**Changes Required**:
1. Remove "Hiển thị" section (6 non-functional fields) - **EXCEPT viewMode**
2. Keep "Hiển thị" section but only with viewMode (1 field)
3. Remove 2 notification checkboxes (transactionReminders, goalReminders)

**Before - State Initialization**:
```javascript
const [preferences, setPreferences] = useState({
    // Display Preferences (7 fields - REMOVE 6)
    language: 'vi', // REMOVE
    currency: 'VND', // REMOVE
    dateFormat: 'dd/MM/yyyy', // REMOVE
    timezone: 'Asia/Ho_Chi_Minh', // REMOVE
    theme: 'light', // REMOVE
    itemsPerPage: 10, // REMOVE
    viewMode: 'detailed', // KEEP

    // Notification Preferences (6 fields - REMOVE 2)
    emailNotifications: true, // KEEP
    budgetAlerts: true, // KEEP
    transactionReminders: true, // REMOVE
    weeklySummary: false, // KEEP
    monthlySummary: true, // KEEP
    goalReminders: false // REMOVE
});
```

**After - State Initialization**:
```javascript
const [preferences, setPreferences] = useState({
    // Display Preferences (1 field)
    viewMode: 'detailed', // Controls budget view (usage/basic)

    // Notification Preferences (4 fields)
    emailNotifications: true, // Master email switch
    budgetAlerts: true, // Budget alert emails
    weeklySummary: false, // Weekly email summaries
    monthlySummary: true // Monthly email summaries
});
```

**UI Section Changes**:

**Remove Entire Display Section (language, currency, dateFormat, timezone, theme, itemsPerPage)**:
```javascript
// REMOVE THIS ENTIRE SECTION (~120 lines):
<div>
    <h2 className="text-lg font-semibold text-gray-900 mb-4">Hiển thị</h2>
    <div className="space-y-4">
        {/* Language dropdown */}
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Ngôn ngữ
            </label>
            <select
                name="language"
                value={preferences.language}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
                <option value="vi">Tiếng Việt</option>
                <option value="en">English</option>
            </select>
        </div>

        {/* Currency dropdown - REMOVE */}
        {/* DateFormat dropdown - REMOVE */}
        {/* Timezone dropdown - REMOVE */}
        {/* Theme toggle - REMOVE */}
        {/* Items per page number input - REMOVE */}
    </div>
</div>
```

**Keep Only viewMode in Display Section**:
```javascript
// KEEP THIS (simplified Display section):
<div>
    <h2 className="text-lg font-semibold text-gray-900 mb-4">Hiển thị</h2>
    <div className="space-y-4">
        {/* View Mode */}
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Chế độ xem mặc định
            </label>
            <select
                name="viewMode"
                value={preferences.viewMode}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
                <option value="detailed">Chi tiết</option>
                <option value="compact">Gọn</option>
            </select>
            <p className="text-sm text-gray-500 mt-1">
                Chế độ hiển thị danh sách ngân sách
            </p>
        </div>
    </div>
</div>
```

**Remove Notification Checkboxes (transactionReminders, goalReminders)**:
```javascript
// IN NOTIFICATION SECTION, REMOVE THESE TWO CHECKBOXES:

// REMOVE:
<label className="flex items-center space-x-3 cursor-pointer">
    <input
        type="checkbox"
        name="transactionReminders"
        checked={preferences.transactionReminders}
        onChange={handleCheckboxChange}
        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
    />
    <span className="text-sm text-gray-700">Nhắc nhở giao dịch</span>
</label>

// REMOVE:
<label className="flex items-center space-x-3 cursor-pointer">
    <input
        type="checkbox"
        name="goalReminders"
        checked={preferences.goalReminders}
        onChange={handleCheckboxChange}
        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
    />
    <span className="text-sm text-gray-700">Nhắc nhở mục tiêu</span>
</label>
```

**Keep Only 4 Notification Checkboxes**:
```javascript
// KEEP THESE IN NOTIFICATION SECTION:
<div>
    <h2 className="text-lg font-semibold text-gray-900 mb-4">Thông báo</h2>
    <div className="space-y-3">
        {/* Master Email Switch */}
        <label className="flex items-center space-x-3 cursor-pointer">
            <input
                type="checkbox"
                name="emailNotifications"
                checked={preferences.emailNotifications}
                onChange={handleCheckboxChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Thông báo qua email</span>
        </label>

        {/* Budget Alerts */}
        <label className="flex items-center space-x-3 cursor-pointer">
            <input
                type="checkbox"
                name="budgetAlerts"
                checked={preferences.budgetAlerts}
                onChange={handleCheckboxChange}
                disabled={!preferences.emailNotifications}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50"
            />
            <span className="text-sm text-gray-700">Cảnh báo ngân sách</span>
        </label>

        {/* Weekly Summary */}
        <label className="flex items-center space-x-3 cursor-pointer">
            <input
                type="checkbox"
                name="weeklySummary"
                checked={preferences.weeklySummary}
                onChange={handleCheckboxChange}
                disabled={!preferences.emailNotifications}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50"
            />
            <span className="text-sm text-gray-700">Tóm tắt tuần</span>
        </label>

        {/* Monthly Summary */}
        <label className="flex items-center space-x-3 cursor-pointer">
            <input
                type="checkbox"
                name="monthlySummary"
                checked={preferences.monthlySummary}
                onChange={handleCheckboxChange}
                disabled={!preferences.emailNotifications}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50"
            />
            <span className="text-sm text-gray-700">Tóm tắt tháng</span>
        </label>
    </div>
</div>
```

**Change Summary**:
- Removed entire Display section (~120 lines)
- Added simplified Display section with only viewMode (~20 lines)
- Removed 2 notification checkboxes (~20 lines)
- **Total**: ~120 lines removed, ~20 lines added = **100 lines net reduction**

---

## 🧪 Step 7: Testing Checklist

### Backend Testing

1. **Database Migration Test**:
   ```bash
   # Run migration SQL in phpMyAdmin
   # Verify: DESCRIBE user_preferences shows 10 columns (was 18)
   # Verify: SELECT COUNT(*) returns same number of rows
   ```

2. **Backend Compilation Test**:
   ```bash
   cd "MyFinance Backend"
   mvn clean compile
   # Expected: No compilation errors
   ```

3. **Backend Runtime Test**:
   ```bash
   mvn spring-boot:run
   # Expected: Application starts successfully
   # Watch console for any JPA/Hibernate warnings
   ```

4. **API Endpoint Test**:
   ```bash
   # Login first to get JWT token
   POST http://localhost:8080/api/auth/login

   # Get preferences
   GET http://localhost:8080/api/preferences
   Authorization: Bearer <your_jwt_token>
   # Expected: Response has only 5 preference fields

   # Update preferences
   PUT http://localhost:8080/api/preferences
   Authorization: Bearer <your_jwt_token>
   Content-Type: application/json
   {
     "viewMode": "compact",
     "emailNotifications": true,
     "budgetAlerts": true,
     "weeklySummary": false,
     "monthlySummary": true
   }
   # Expected: Success response
   ```

### Frontend Testing

1. **Build Test**:
   ```bash
   cd myfinance-frontend
   npm run build
   # Expected: Build succeeds without errors
   ```

2. **Manual UI Test**:
   - Navigate to `/preferences`
   - ✅ See only 2 sections: "Hiển thị" and "Thông báo"
   - ✅ Display section has only 1 field: "Chế độ xem mặc định"
   - ✅ Notification section has only 4 checkboxes
   - ✅ Change viewMode to "Gọn", click "Lưu cài đặt"
   - ✅ Success message appears
   - ✅ Reload page, verify viewMode is "Gọn"
   - ✅ Check if budget page respects viewMode setting

3. **Email Functionality Test**:
   - Go to `/preferences`
   - Enable "Cảnh báo ngân sách"
   - Create expense transaction > 75% of budget
   - ✅ Verify budget alert email sent (check email/Mailtrap)
   - Disable "Cảnh báo ngân sách"
   - Create another expense > 75%
   - ✅ Verify NO email sent (preference respected)

---

## 📊 Impact Summary

### Code Reduction
- **Database**: 8 columns dropped (18 → 10 columns)
- **Backend Entity**: ~40 lines removed
- **Backend DTOs**: ~16 lines removed (2 files)
- **Backend Service**: ~24 lines removed
- **Frontend UI**: ~100 lines net reduction
- **Total**: ~180 lines of non-functional code removed

### What Still Works
✅ **Functional Preferences (5 fields)**:
- viewMode - Controls budget view display
- emailNotifications - Master email switch
- budgetAlerts - Budget alert emails
- weeklySummary - Weekly email summaries
- monthlySummary - Monthly email summaries

### What Changed for Users
🔹 **User Preferences Page** (`/preferences`):
- Now shows only 2 sections (was 3)
- Display section has only 1 setting (was 7)
- Notification section has only 4 checkboxes (was 6)
- Removed non-functional settings that never worked

---

## 🎯 Success Criteria

- [ ] Database has 10 columns in `user_preferences` (not 18)
- [ ] Backend compiles without errors
- [ ] Frontend builds without errors
- [ ] Preferences page shows only 5 total settings
- [ ] Save/reset functionality works
- [ ] Email notifications still work via functional preferences
- [ ] viewMode setting controls budget page display
- [ ] No console errors in browser

---

## 🔄 Rollback Instructions

If something goes wrong, you can rollback:

### Database Rollback
```sql
ALTER TABLE user_preferences
    ADD COLUMN language VARCHAR(10) DEFAULT 'vi' AFTER user_id,
    ADD COLUMN currency VARCHAR(10) DEFAULT 'VND' AFTER language,
    ADD COLUMN date_format VARCHAR(20) DEFAULT 'dd/MM/yyyy' AFTER currency,
    ADD COLUMN timezone VARCHAR(50) DEFAULT 'Asia/Ho_Chi_Minh' AFTER date_format,
    ADD COLUMN theme VARCHAR(20) DEFAULT 'light' AFTER timezone,
    ADD COLUMN items_per_page INT DEFAULT 10 AFTER theme,
    ADD COLUMN transaction_reminders BOOLEAN DEFAULT TRUE AFTER monthly_summary,
    ADD COLUMN goal_reminders BOOLEAN DEFAULT FALSE AFTER transaction_reminders;
```

### Code Rollback
```bash
# If you haven't committed yet
git status
git diff
git checkout -- .  # Revert all uncommitted changes

# If you've committed
git log --oneline  # Find commit before cleanup
git revert <commit-hash>
```

---

## ✨ Benefits Achieved

1. **Cleaner Codebase**: -180 lines of non-functional code
2. **Less Confusion**: Users no longer see settings that don't work
3. **Simpler Database**: 8 fewer columns to maintain (44% reduction)
4. **Better UX**: Preferences page is cleaner and focused
5. **Reduced Testing**: Fewer fields = fewer test cases needed
6. **Accurate Documentation**: Code now matches actual behavior

---

## 📝 Next Steps After Cleanup

1. **Test all email functionality** (budget alerts, weekly/monthly summaries)
2. **Test viewMode preference** on budgets page
3. **Update CLAUDE.md** to reflect only 5 functional preferences
4. **Git commit** with message: "Remove 8 non-functional fields from UserPreferences"
5. **Consider**: Should we also update PreferencesContext.js if it references removed fields?

---

**End of Cleanup Plan - Option A (Aggressive Cleanup)**
