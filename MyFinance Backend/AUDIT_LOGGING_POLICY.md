# Audit Logging Policy

## Purpose
This document defines what actions should be logged for administrative oversight while respecting user privacy and avoiding log clutter.

## Principles
1. **Admin Accountability**: Log actions that affect system state or other users
2. **Privacy Respect**: Do NOT log user's personal financial data (amounts, transactions, budgets)
3. **Actionable Information**: Only log what admins need for oversight, security, and compliance
4. **No View Spam**: Do NOT log simple read/view operations

## What SHOULD Be Logged

### 1. User Account Management (HIGH PRIORITY)
- ✅ User account creation/registration
- ✅ User account activation/deactivation by admin
- ✅ User role changes (USER → ADMIN, etc.)
- ✅ User account deletion
- ✅ Password reset requests (NOT the actual passwords)
- ❌ User login success (too frequent, use separate security log)
- ✅ Failed login attempts (security monitoring)
- ✅ User profile updates BY ADMIN only

### 2. System Configuration (HIGH PRIORITY)
- ✅ System config changes (feature flags, maintenance mode)
- ✅ Configuration creation/update/deletion
- ✅ Maintenance mode activation/deactivation
- ✅ Critical system settings changes

### 3. Admin Actions on User Data (MEDIUM PRIORITY)
- ✅ Admin viewing specific user's detailed information
- ✅ Admin modifying user's data
- ✅ Admin accessing sensitive user reports
- ❌ Admin viewing dashboard summaries (no specific user data)
- ❌ Admin viewing aggregate analytics (no personal data)

### 4. Security Events (HIGH PRIORITY)
- ✅ Multiple failed login attempts from same IP
- ✅ Suspicious activity patterns
- ✅ Admin permission violations
- ✅ Data export requests (GDPR compliance)

### 5. Database Migrations (HIGH PRIORITY)
- ✅ Schema migrations executed
- ✅ Data migration operations
- ✅ Database backup/restore operations

## What SHOULD NOT Be Logged

### 1. Regular Read Operations (Avoid Log Spam)
- ❌ Admin dashboard views
- ❌ Analytics summary views
- ❌ Report list views
- ❌ Configuration list views
- ❌ User list views (unless searching for specific user)

### 2. User's Private Financial Data (Privacy)
- ❌ Transaction amounts and descriptions
- ❌ Budget amounts and details
- ❌ Financial health scores
- ❌ Category names and spending patterns

### 3. System-Generated Events (Not Admin Actions)
- ❌ Automatic report generation
- ❌ Scheduled tasks execution
- ❌ Cache updates
- ❌ Background jobs

### 4. Development/Debug Information
- ❌ API endpoint hits
- ❌ Query execution times
- ❌ Method entry/exit logs

## Audit Log Data Structure

### What to Include:
- **Action**: Clear action name (e.g., "USER_DEACTIVATED", "CONFIG_UPDATED")
- **Entity Type**: What was affected (USER, SYSTEM_CONFIG, ROLE)
- **Entity ID**: ID of affected resource
- **Admin User ID**: Who performed the action
- **Timestamp**: When it occurred
- **IP Address**: Where it came from
- **Summary**: Brief description of change

### What to EXCLUDE:
- User's financial amounts
- Transaction descriptions
- Budget details
- Personal notes or comments
- Full user profiles (only changed fields)

## Example Good Audit Logs

```
Action: USER_DEACTIVATED
Entity: USER #12345
Admin: admin@myfinance.com
Time: 2025-01-15 10:30:00
IP: 192.168.1.100
Summary: User account deactivated due to policy violation
```

```
Action: CONFIG_UPDATED
Entity: SYSTEM_CONFIG (maintenance_mode)
Admin: admin@myfinance.com
Time: 2025-01-15 11:00:00
IP: 192.168.1.100
Changes: false → true
Summary: Maintenance mode enabled for system upgrade
```

## Example Bad Audit Logs (To Avoid)

```
❌ Action: DASHBOARD_VIEW
   Reason: Non-actionable, creates log spam

❌ Action: TRANSACTION_VIEW
   Details: {amount: 50000, description: "Grocery shopping"}
   Reason: Violates user privacy, logs personal financial data

❌ Action: USER_LIST_VIEW
   Reason: Routine operation, not a state change
```

## Implementation Notes

- Use `@AuditLog` annotation only on state-changing operations
- Remove audit logging from GET/VIEW endpoints
- Sanitize any logged data to remove personal financial information
- Use log levels: INFO for normal operations, WARN for security events
- Keep audit logs for compliance (minimum 1 year retention)
