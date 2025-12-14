# 🇻🇳 Vietnamese Translation Reference Guide
**Project:** MyFinance Admin UI Translation


## 📋 REMAINING TRANSLATIONS

### **FILE 1: UserManagement.js** (18 strings remaining)

**Header Section (COMPLETED):**
- ✅ Line 90: `"User Management"` → `"Quản lý người dùng"`
- ✅ Line 91: `"Manage user accounts and permissions"` → `"Quản lý tài khoản và quyền hạn người dùng"`

**Filter Labels (Lines 101-103):**
```javascript
// FIND:
{ value: '', label: 'All Users', icon: Users },
{ value: 'true', label: 'Active', icon: UserCheck, activeClass: 'bg-green-600 text-white shadow-md' },
{ value: 'false', label: 'Inactive', icon: UserX, activeClass: 'bg-red-600 text-white shadow-md' }

// REPLACE WITH:
{ value: '', label: 'Tất cả người dùng', icon: Users },
{ value: 'true', label: 'Hoạt động', icon: UserCheck, activeClass: 'bg-green-600 text-white shadow-md' },
{ value: 'false', label: 'Không hoạt động', icon: UserX, activeClass: 'bg-red-600 text-white shadow-md' }
```

**Error Message (Line 111):**
```javascript
// FIND:
<strong className="font-bold">Error: </strong>

// REPLACE WITH:
<strong className="font-bold">Lỗi: </strong>
```

**Table Headers (Lines 122-135):**
```javascript
// FIND:
<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
  User
</th>
<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
  Email
</th>
<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
  Status
</th>
<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
  Created Date
</th>
<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
  Actions
</th>

// REPLACE WITH:
<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
  Người dùng
</th>
<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
  Email
</th>
<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
  Trạng thái
</th>
<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
  Ngày tạo
</th>
<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
  Hành động
</th>
```

**User Data Strings (Lines 148-171):**
```javascript
// FIND (Line 148):
"No Name"
// REPLACE WITH:
"Không có tên"

// FIND (Line 160):
Verified
// REPLACE WITH:
Đã xác minh

// FIND (Lines 170-171):
{user.isActive ? 'Active' : 'Inactive'}
// REPLACE WITH:
{user.isActive ? 'Hoạt động' : 'Không hoạt động'}
```

**Action Buttons (Lines 185-186):**
```javascript
// FIND:
{user.isActive ? 'Deactivate' : 'Activate'}

// REPLACE WITH:
{user.isActive ? 'Vô hiệu hóa' : 'Kích hoạt'}
```

**Empty State (Line 196):**
```javascript
// FIND:
<p className="text-gray-500">No users found</p>

// REPLACE WITH:
<p className="text-gray-500">Không tìm thấy người dùng</p>
```

**Pagination (Lines 209-240):**
```javascript
// FIND ALL:
"Previous"    → "Trước"
"Next"        → "Tiếp"
"Showing page" → "Hiển thị trang"
"of"          → "trên"
```

---

### **FILE 2: SystemConfig.js** (25 strings)

**Header Section (Lines 228-229):**
```javascript
// FIND:
<h1 className="text-2xl font-bold text-gray-900">System Configuration</h1>
<p className="text-gray-600">Manage system settings, feature flags, and configuration</p>

// REPLACE WITH:
<h1 className="text-2xl font-bold text-gray-900">Cấu hình hệ thống</h1>
<p className="text-gray-600">Quản lý cài đặt hệ thống, cờ tính năng và cấu hình</p>
```

**Buttons (Lines 238-249):**
```javascript
// FIND:
"Running..."          → "Đang chạy..."
"Run Migration"       → "Chạy di chuyển"
"Disable Maintenance" → "Tắt bảo trì"
"Enable Maintenance"  → "Bật bảo trì"
```

**Status Cards (Lines 264-291):**
```javascript
// FIND:
"Operational"      → "Hoạt động"
"Total Configs"    → "Tổng cấu hình"
"Active Features"  → "Tính năng hoạt động"
```

**Table Headers (Lines 343-358):**
```javascript
// FIND:
"Key"          → "Khóa"
"Value"        → "Giá trị"
"Type"         → "Loại"
"Description"  → "Mô tả"
"Visibility"   → "Hiển thị"
"Actions"      → "Hành động"
```

**Table Data (Lines 380-406):**
```javascript
// FIND:
"No description"           → "Không có mô tả"
'Public'                   → 'Công khai'
'Private'                  → 'Riêng tư'
"Edit"                     → "Chỉnh sửa"
"No configurations found"  → "Không tìm thấy cấu hình"
```

**Modal (Lines 447-524):**
```javascript
// FIND:
"Edit Configuration"  → "Chỉnh sửa cấu hình"
"Cancel"              → "Hủy"
"Update"              → "Cập nhật"
```

---

### **FILE 3: FinancialAnalytics.js** (30 strings)

**Header (Lines 88-91):**
```javascript
// FIND:
<h1 className="text-2xl font-bold text-gray-900">Financial Analytics</h1>
<p className="text-gray-600">Comprehensive financial insights and trends analysis</p>

// REPLACE WITH:
<h1 className="text-2xl font-bold text-gray-900">Phân tích tài chính</h1>
<p className="text-gray-600">Phân tích chi tiết về thông tin tài chính và xu hướng</p>
```

**Time Period Selection (Lines 96-159):**
```javascript
// FIND:
"Time Period Selection"  → "Chọn khoảng thời gian"
"Time Frame"             → "Khung thời gian"
"Monthly"                → "Theo tháng"
"Quarterly"              → "Theo quý"
"Yearly"                 → "Theo năm"
"Year"                   → "Năm"
"Month"                  → "Tháng"
"Quarter"                → "Quý"
"Q1 (Jan-Mar)"          → "Q1 (Thg 1-3)"
"Q2 (Apr-Jun)"          → "Q2 (Thg 4-6)"
"Q3 (Jul-Sep)"          → "Q3 (Thg 7-9)"
"Q4 (Oct-Dec)"          → "Q4 (Thg 10-12)"
```

**Error Message (Line 165):**
```javascript
// FIND:
<strong className="font-bold">Error: </strong>

// REPLACE WITH:
<strong className="font-bold">Lỗi: </strong>
```

**Metric Cards (Lines 175-237):**
```javascript
// FIND:
"Total Revenue"         → "Tổng doanh thu"
"vs previous period"    → "so với kỳ trước"
"Total Expenses"        → "Tổng chi phí"
"Net Profit"            → "Lợi nhuận ròng"
"Active Users"          → "Người dùng hoạt động"
```

**Category Sections (Lines 244-289):**
```javascript
// FIND:
"Top Expense Categories"      → "Danh mục chi phí hàng đầu"
"No expense data available"   → "Không có dữ liệu chi phí"
"Top Income Categories"       → "Danh mục thu nhập hàng đầu"
"No income data available"    → "Không có dữ liệu thu nhập"
```

**User Engagement (Lines 294-300):**
```javascript
// FIND:
"User Engagement Metrics"     → "Chỉ số tương tác người dùng"
"Avg Transactions per User"   → "Trung bình giao dịch/người dùng"
```

---

### **FILE 4: Header.js** (1 string - Admin Section)

**Line 296:**
```javascript
// FIND:
"Admin Panel"

// REPLACE WITH:
"Bảng quản trị"
```

---

## 🎯 QUICK REFERENCE - COMMON TRANSLATIONS

| English | Vietnamese |
|---------|-----------|
| User | Người dùng |
| Active | Hoạt động |
| Inactive | Không hoạt động |
| Total | Tổng |
| Error | Lỗi |
| Edit | Chỉnh sửa |
| Delete | Xóa |
| Cancel | Hủy |
| Update | Cập nhật |
| Save | Lưu |
| Previous | Trước |
| Next | Tiếp |
| Search | Tìm kiếm |
| Filter | Lọc |
| All | Tất cả |
| Status | Trạng thái |
| Actions | Hành động |
| Created | Đã tạo |
| Updated | Đã cập nhật |
| Deleted | Đã xóa |
| No data | Không có dữ liệu |
| Loading | Đang tải |
| Success | Thành công |
| Failed | Thất bại |


## 🚀 RECOMMENDED APPLICATION ORDER

1. **Header.js** (1 string) - Quick win
2. **UserManagement.js** (18 strings) - Already started
3. **SystemConfig.js** (25 strings) - Moderate complexity
4. **FinancialAnalytics.js** (30 strings) - Most complex

---


