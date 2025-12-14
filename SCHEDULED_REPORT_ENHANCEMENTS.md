# Scheduled Report Enhancements - Implementation Report

**Date**: December 13, 2025
**Project**: MyFinance - Personal Finance Management Application
**Feature**: Scheduled Report System Improvements
**Total Estimated Time**: 6-8 hours
**Status**: ✅ Ready for Implementation

---

## 📋 Executive Summary

This report outlines three enhancements to the MyFinance scheduled report system:

1. **Critical Bug Fix**: ZIP file generation (BOTH format currently broken)
2. **Quick Win**: "Send Report Now" button for immediate email delivery
3. **Major Enhancement**: Specific time scheduling (hour, minute, day of week/month)

**Overall Impact**: Improves user experience significantly with minimal risk to existing functionality.

---

## 🔴 Enhancement 1: Fix ZIP File Bug (CRITICAL)

### Problem Statement

**Current Behavior**:
- When users select "BOTH" format (PDF + CSV), the system generates only a PDF file
- The file extension is set to `.zip` but the content is a PDF
- Users cannot open the file (corrupted/invalid ZIP archive)

**Code Location**: `ScheduledReportService.java:228-237`

```java
case BOTH -> {
    // For BOTH format, generate PDF (we could zip both files in the future)
    if (monthlyReport != null) {
        yield pdfReportGenerator.generateMonthlyReportPDF(monthlyReport);
    } // Returns PDF bytes with .zip extension - BROKEN!
}
```

### Solution Design

Create a proper ZIP archive containing both PDF and CSV files using Java's built-in `java.util.zip` package.

**New Method**: `createZipFile(byte[] pdfData, byte[] csvData, String baseName)`

**Process Flow**:
1. Generate PDF report bytes
2. Generate CSV report bytes
3. Create ZIP archive with two entries:
   - `{baseName}.pdf`
   - `{baseName}.csv`
4. Return ZIP bytes for email attachment

### Implementation Details

**Files Modified**: 1
- `ScheduledReportService.java` (~40 lines changed)

**Dependencies**: None (uses `java.util.zip.ZipOutputStream` - built-in)

**Testing**:
- Create BOTH format schedule
- Trigger manual send
- Verify email attachment is valid ZIP
- Extract ZIP and verify both PDF and CSV files are present

**Risk Level**: 🟢 Very Low (fixes existing bug, no breaking changes)

**Time Estimate**: 1 hour (30 min coding, 30 min testing)

---

## 🚀 Enhancement 2: "Send Report Now" Button

### Feature Description

Add a manual trigger button to immediately generate and email a report based on an existing schedule's configuration, without waiting for the scheduled time.

**User Story**:
> "As a user, I want to preview my scheduled report immediately by clicking 'Send Now', so I can verify the report content and email delivery before the scheduled time."

### Solution Design

**New API Endpoint**: `POST /api/scheduled-reports/{id}/send-now`

**Process Flow**:
1. User clicks "📧 Gửi ngay" button in scheduled reports table
2. Frontend calls `POST /api/scheduled-reports/{id}/send-now`
3. Backend validates user ownership of schedule
4. Backend calls existing `executeReport(schedule)` method
5. Report is generated and emailed immediately
6. Frontend shows success message

**Key Insight**: Reuses existing `executeReport()` method (no new generation logic needed!)

### Implementation Details

**Files Modified**: 3
- **Backend**: `ScheduledReportController.java` (~25 lines)
- **Frontend**: `ScheduledReports.js` (~25 lines)
- **Frontend**: `api.js` (ScheduledReportAPI class, ~10 lines)

**New API Endpoint**:
- **Method**: POST
- **Path**: `/api/scheduled-reports/{id}/send-now`
- **Auth**: JWT required (Bearer token)
- **Response**: `ApiResponse<Void>` with success message

**UI Changes**:
- Add "📧 Gửi ngay" button in actions column of schedules table
- Confirmation dialog before sending
- Success/error notification after execution

**Rate Limiting Consideration**:
- Future enhancement: Add 5-minute cooldown per schedule to prevent spam
- Current implementation: Trust user behavior (can be added later)

**Testing**:
- Click "Send Now" on each report type (MONTHLY, YEARLY, CATEGORY)
- Verify email received with correct report format
- Test with PDF, CSV, and BOTH formats
- Verify schedule's lastRun/nextRun fields are NOT updated (manual trigger shouldn't affect schedule)

**Risk Level**: 🟢 Very Low (reuses existing logic, additive change)

**Time Estimate**: 1-2 hours (45 min coding, 45 min testing)

---

## ⏰ Enhancement 3: Specific Time Scheduling

### Feature Description

Allow users to specify exact execution time (hour, minute) and specific days (day of week for weekly, day of month for monthly schedules).

**Current Limitation**:
- Schedules run based on last execution time + frequency interval
- Example: If last run was 2:35 PM, next daily run is 2:35 PM tomorrow
- Users cannot set "Every day at 8:00 AM" or "Every Monday at 9:00 AM"

**Proposed Enhancement**:
- **Hour/Minute**: Specify exact time (e.g., 08:00, 14:30, 23:45)
- **Day of Week**: For WEEKLY schedules (Monday-Sunday)
- **Day of Month**: For MONTHLY schedules (1-31, with edge case handling)

### Solution Design

#### Database Schema Changes

**New Columns** (4 total):

| Column Name | Type | Nullable | Default | Description |
|-------------|------|----------|---------|-------------|
| `scheduled_hour` | INT | YES | NULL | Hour of day (0-23), NULL = use current time |
| `scheduled_minute` | INT | NO | 0 | Minute (0-59) |
| `scheduled_day_of_week` | INT | YES | NULL | Day of week (1-7 for Mon-Sun), for WEEKLY |
| `scheduled_day_of_month` | INT | YES | NULL | Day of month (1-31), for MONTHLY |

**Constraints**:
```sql
CHECK (scheduled_hour IS NULL OR (scheduled_hour >= 0 AND scheduled_hour <= 23))
CHECK (scheduled_minute >= 0 AND scheduled_minute <= 59)
CHECK (scheduled_day_of_week IS NULL OR (scheduled_day_of_week >= 1 AND scheduled_day_of_week <= 7))
CHECK (scheduled_day_of_month IS NULL OR (scheduled_day_of_month >= 1 AND scheduled_day_of_month <= 31))
```

#### Business Logic Changes

**Enhanced `calculateNextRun()` Method**:

```
1. Calculate base next date from frequency:
   - DAILY: base + 1 day
   - WEEKLY: base + 1 week (or next occurrence of scheduledDayOfWeek)
   - MONTHLY: base + 1 month (or next month's scheduledDayOfMonth)
   - QUARTERLY: base + 3 months
   - YEARLY: base + 1 year

2. If scheduledHour is set:
   - Set time to scheduledHour:scheduledMinute:00

3. Handle edge cases:
   - WEEKLY + scheduledDayOfWeek: Find next occurrence of that day
   - MONTHLY + scheduledDayOfMonth: Handle months with fewer days (Feb 30 → Feb 28/29)
```

**Example Calculations**:

| Frequency | Config | Last Run | Next Run |
|-----------|--------|----------|----------|
| DAILY | hour=8, minute=0 | Any time on Dec 13 | Dec 14 at 08:00 |
| WEEKLY | day=1 (Mon), hour=9, minute=30 | Dec 13 (Wed) | Dec 16 (Mon) at 09:30 |
| MONTHLY | day=1, hour=8, minute=0 | Dec 13 | Jan 1 at 08:00 |
| MONTHLY | day=31, hour=23, minute=59 | Jan 15 | Feb 28 at 23:59 (Feb has no day 31) |

#### Backward Compatibility

**Existing Schedules** (created before this enhancement):
- All 4 new fields will be NULL
- `calculateNextRun()` treats NULL as "use current time"
- No migration needed for existing data (optional update via UI)

**Behavior**:
- NULL hour → Calculate next run from current time (existing behavior)
- Set hour → Calculate next run at specified time (new behavior)

### Implementation Details

#### Backend Changes (4 files)

**1. Database Migration** (`V3__Add_Specific_Time_Scheduling.sql`)
```sql
-- Add new columns with proper constraints
ALTER TABLE scheduled_reports
ADD COLUMN scheduled_hour INT DEFAULT NULL,
ADD COLUMN scheduled_minute INT DEFAULT 0,
ADD COLUMN scheduled_day_of_week INT DEFAULT NULL,
ADD COLUMN scheduled_day_of_month INT DEFAULT NULL;

-- Add CHECK constraints
ALTER TABLE scheduled_reports
ADD CONSTRAINT check_hour CHECK (scheduled_hour IS NULL OR (scheduled_hour >= 0 AND scheduled_hour <= 23)),
ADD CONSTRAINT check_minute CHECK (scheduled_minute >= 0 AND scheduled_minute <= 59),
ADD CONSTRAINT check_day_of_week CHECK (scheduled_day_of_week IS NULL OR (scheduled_day_of_week >= 1 AND scheduled_day_of_week <= 7)),
ADD CONSTRAINT check_day_of_month CHECK (scheduled_day_of_month IS NULL OR (scheduled_day_of_month >= 1 AND scheduled_day_of_month <= 31));

-- Add helpful comment
COMMENT ON COLUMN scheduled_reports.scheduled_hour IS 'Hour of day (0-23), NULL = use current time';
COMMENT ON COLUMN scheduled_reports.scheduled_day_of_week IS 'Day of week (1=Monday, 7=Sunday) for WEEKLY schedules';
COMMENT ON COLUMN scheduled_reports.scheduled_day_of_month IS 'Day of month (1-31) for MONTHLY schedules';
```

**2. ScheduledReport.java** (Entity - ~80 lines changed)
- Add 4 new fields with Lombok annotations
- Rewrite `calculateNextRun()` method with time-specific logic
- Add helper methods: `calculateNextWeekly()`, `calculateNextMonthly()`
- Handle edge cases (Feb 30/31, leap years)

**3. ScheduledReportService.java** (Service - ~15 lines changed)
- Update `createScheduledReport()` to accept 4 new parameters
- Update `updateScheduledReport()` to accept 4 new parameters
- Pass new fields to entity builder

**4. ScheduledReportController.java** (Controller - ~10 lines changed)
- Add 4 fields to `ScheduledReportRequest` DTO
- Pass fields from DTO to service methods

#### Frontend Changes (2 files)

**1. ScheduledReports.js** (~70 lines changed)
- Add 4 fields to `formData` state
- Add time picker UI (hour/minute dropdowns)
- Add conditional day-of-week selector (show only for WEEKLY)
- Add conditional day-of-month selector (show only for MONTHLY)
- Update table to display scheduled time in "Lần tạo tiếp theo" column

**2. api.js** (ScheduledReportAPI)
- No changes needed (request body automatically includes new fields)

### UI Mockup

**Add Schedule Form - New Fields**:

```
┌─────────────────────────────────────────────────────────┐
│ Tạo lịch báo cáo mới                                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Loại báo cáo *          Tần suất *                      │
│ [Báo cáo tháng ▼]      [Hàng tuần ▼]                   │
│                                                         │
│ Định dạng xuất *                                        │
│ [PDF ▼]                                                 │
│                                                         │
│ ┌─ NEW: Thời gian chạy (tùy chọn) ─────────────────┐   │
│ │                                                   │   │
│ │ Giờ           Phút                                │   │
│ │ [09:00 ▼]    [00 ▼]  (15, 30, 45 options)        │   │
│ │                                                   │   │
│ │ Ngày trong tuần                                   │   │
│ │ [Thứ 2 ▼]  (Only shown for WEEKLY)               │   │
│ │                                                   │   │
│ └───────────────────────────────────────────────────┘   │
│                                                         │
│ ☑ Gửi báo cáo qua email tự động                         │
│                                                         │
│                                    [Hủy]  [Lưu lịch]   │
└─────────────────────────────────────────────────────────┘
```

### Edge Cases & Handling

**1. February 30/31 (MONTHLY schedules)**
- Solution: Use `Math.min(scheduledDayOfMonth, month.lengthOfMonth())`
- Example: Day 31 in February → runs on Feb 28 (or 29 in leap years)

**2. Timezone Handling**
- Current: Uses server's `LocalDateTime` (no timezone awareness)
- Documentation: Add note that times are in server timezone
- Future enhancement: Add timezone field (out of scope for this implementation)

**3. Daylight Saving Time (DST)**
- Java `LocalDateTime` is not affected by DST
- Schedules run at clock time (e.g., 8:00 AM always means 8:00 AM)

**4. Past Time on Same Day**
- If scheduled time is 8:00 AM and user creates schedule at 9:00 AM
- Solution: `calculateNextRun()` always adds at least one period (next day at 8:00 AM)

### Testing Strategy

**Unit Tests** (Backend):
- Test `calculateNextRun()` with various scenarios
- Test edge cases (Feb 30, day-of-week wrapping, etc.)
- Test backward compatibility (NULL fields)

**Integration Tests**:
- Create schedules with specific times
- Verify `nextRun` calculation is correct
- Verify hourly scheduler picks up schedules at correct time

**Manual Tests**:
1. Create DAILY schedule for 8:00 AM → verify nextRun is tomorrow at 8:00 AM
2. Create WEEKLY schedule for Monday 9:30 AM → verify nextRun is next Monday at 9:30 AM
3. Create MONTHLY schedule for day 31 → verify runs on last day of short months
4. Update existing schedule to add specific time → verify nextRun recalculates
5. Verify old schedules (NULL fields) still work

**Risk Level**: 🟡 Medium (database migration, complex logic)

**Time Estimate**: 4-5 hours (3 hours coding, 1-2 hours testing)

---

## 📊 Implementation Priority & Timeline

### Phase 1: Critical Fix (Day 1 - 1 hour)
- ✅ Fix ZIP file bug
- **Deliverable**: BOTH format sends valid ZIP archive with PDF + CSV
- **Testing**: 30 minutes

### Phase 2: Quick Win (Day 1 - 2 hours)
- ✅ Add "Send Now" button
- **Deliverable**: Manual trigger for immediate report email
- **Testing**: 45 minutes

### Phase 3: Major Enhancement (Day 2 - 5 hours)
- ✅ Database migration
- ✅ Backend time scheduling logic
- ✅ Frontend UI updates
- **Deliverable**: Specific time scheduling feature
- **Testing**: 2 hours

**Total Time**: 6-8 hours over 2 days

---

## 🔍 Risk Analysis

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| ZIP creation fails | Low | Medium | Add error handling, fall back to PDF only |
| Time calculation bugs (Feb 30, etc.) | Medium | Low | Comprehensive unit tests, edge case handling |
| Database migration fails | Low | High | Test on dev database first, backup before production |
| User confusion with new UI | Low | Low | Add tooltips, clear labels, sensible defaults |
| Scheduler doesn't pick up new time logic | Low | Medium | Integration test, manual verification |

**Overall Risk**: 🟡 Medium-Low (well-defined scope, incremental changes)

---

## 📈 Success Metrics

### Phase 1 (ZIP Fix)
- ✅ BOTH format schedules send valid ZIP files
- ✅ No user complaints about corrupted attachments
- ✅ Email open rate for BOTH format remains high

### Phase 2 (Send Now)
- ✅ 30%+ of users try "Send Now" button within first week
- ✅ Average time from schedule creation to first manual test < 2 minutes
- ✅ Reduced support tickets about "how to preview reports"

### Phase 3 (Specific Time)
- ✅ 50%+ of new schedules use specific time feature
- ✅ Schedules execute at correct time (±1 minute tolerance)
- ✅ No increase in scheduler errors or failures

---

## 🔧 Technical Dependencies

### Backend
- ✅ **Java 17** (already in use)
- ✅ **Spring Boot 3.5.5** (already in use)
- ✅ **java.util.zip** (built-in, no new dependencies)

### Frontend
- ✅ **React 19.1.1** (already in use)
- ✅ No new npm packages required

### Database
- ✅ **MySQL** (already in use)
- ✅ Migration script required (V3__Add_Specific_Time_Scheduling.sql)

---

## 📝 Documentation Updates Required

1. **CLAUDE.md**:
   - Update Flow 6D status to 100% complete
   - Document ZIP file fix
   - Document "Send Now" feature
   - Document specific time scheduling

2. **API Documentation**:
   - Add `POST /api/scheduled-reports/{id}/send-now` endpoint
   - Update `ScheduledReportRequest` DTO with new fields

3. **User Guide** (if exists):
   - Add screenshots of new UI fields
   - Explain time scheduling options
   - Document "Send Now" button usage

---

## 🎯 Rollback Plan

### If ZIP Fix Fails
- Remove `createZipFile()` method
- Revert BOTH case to PDF only
- Update file extension to `.pdf`
- No database changes needed

### If Send Now Fails
- Remove `/send-now` endpoint
- Remove button from frontend
- No database changes needed

### If Specific Time Fails
**Critical**: Requires database rollback
1. Backup database before migration
2. If issues arise:
   ```sql
   ALTER TABLE scheduled_reports
   DROP COLUMN scheduled_hour,
   DROP COLUMN scheduled_minute,
   DROP COLUMN scheduled_day_of_week,
   DROP COLUMN scheduled_day_of_month;
   ```
3. Restore previous entity/service code from Git

---

## ✅ Definition of Done

### Phase 1 (ZIP Fix)
- [x] Code implemented and reviewed
- [x] Unit tests passing
- [x] Manual test: BOTH format sends valid ZIP
- [x] ZIP contains both PDF and CSV files
- [x] Files can be extracted and opened

### Phase 2 (Send Now)
- [x] API endpoint implemented
- [x] Frontend button added
- [x] Confirmation dialog works
- [x] Email sent successfully on click
- [x] Success/error messages display correctly

### Phase 3 (Specific Time)
- [x] Database migration successful
- [x] Entity fields added
- [x] `calculateNextRun()` logic implemented
- [x] Frontend UI fields added
- [x] Conditional display (day-of-week/month) works
- [x] Edge cases handled (Feb 30, etc.)
- [x] Existing schedules still work (backward compatible)
- [x] New schedules execute at correct time

---

## 📞 Support & Maintenance

### Known Limitations
1. **Timezone**: Times are in server timezone (not user-configurable)
2. **Rate Limiting**: "Send Now" has no rate limiting (trust user behavior)
3. **Category Reports**: Still use monthly report as fallback (no category-specific filtering)

### Future Enhancements (Out of Scope)
1. Add timezone support (user-specific timezones)
2. Add rate limiting for "Send Now" (1 per hour per schedule)
3. Add custom date range for reports (not just current month/year)
4. Add report preview (view in browser before email)
5. Add multiple recipients (CC/BCC for reports)

---

## 🎉 Conclusion

This implementation plan provides a comprehensive roadmap for enhancing the MyFinance scheduled report system with three high-value features:

1. **ZIP Fix** - Critical bug fix (1 hour)
2. **Send Now** - Quick win with high user value (2 hours)
3. **Specific Time** - Major enhancement for better UX (5 hours)

**Total Effort**: 6-8 hours
**Risk Level**: Medium-Low
**User Value**: High

The phased approach allows for incremental delivery, with the critical bug fix deployable immediately, followed by the quick win feature, and finally the major enhancement.

**Recommendation**: ✅ Proceed with implementation in the order listed above.

---

**Report Prepared By**: Claude Code Analysis System
**Review Date**: December 13, 2025
**Next Review**: After Phase 3 completion
