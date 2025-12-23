# SLIDE 12: DATABASE DIAGRAM - THIẾT KẾ TỔNG QUAN

## Loại Diagram: **SIMPLIFIED ERD** (Entity Relationship Diagram đơn giản hóa)

---

## 📊 DATABASE OVERVIEW DIAGRAM (Text Version)

### **CÁCH TIẾP CẬN: Nhóm 12 bảng thành 3 NHÓM CHỨC NĂNG**

```
┌─────────────────────────────────────────────────────────────┐
│                  MYFINANCE DATABASE                         │
│                   MySQL 8.x - 12 Tables                     │
└─────────────────────────────────────────────────────────────┘

┌──────────────────────────┐
│  NHÓM 1: CORE DATA       │  ◄── Dữ liệu nghiệp vụ chính
│  (4 bảng)                │
├──────────────────────────┤
│  📋 users                │  Thông tin người dùng
│  📁 categories           │  Danh mục thu/chi (14 default)
│  💰 transactions         │  Giao dịch tài chính (VND only)
│  💵 budgets              │  Ngân sách theo danh mục & tháng
└──────────────────────────┘
         ▲
         │ Foreign Keys
         │
┌────────┴─────────────────┐
│                          │
│  NHÓM 2: SECURITY        │  ◄── Bảo mật & Quản trị
│  & ADMIN (4 bảng)        │
├──────────────────────────┤
│  🔐 roles                │  Vai trò: USER, ADMIN
│  🔗 user_roles           │  Gán vai trò cho users
│  📝 audit_logs           │  Nhật ký hoạt động admin
│  ⚙️ system_config        │  Cấu hình hệ thống
└──────────────────────────┘
         ▲
         │
         │
┌────────┴─────────────────┐
│                          │
│  NHÓM 3: FEATURES        │  ◄── Tính năng nâng cao
│  (4 bảng)                │
├──────────────────────────┤
│  ⚡ user_budget_settings │  Cấu hình ngưỡng cảnh báo (75%, 90%)
│  📅 scheduled_reports    │  Báo cáo tự động theo lịch
│  🎯 user_preferences     │  Tùy chọn cá nhân (3 active)
│  📚 onboarding_progress  │  Tiến trình wizard 4 bước
└──────────────────────────┘

═══════════════════════════════════════════════════════════
✅ Foreign keys, indexes, unique constraints đầy đủ
✅ CASCADE DELETE cho dữ liệu phụ thuộc
✅ RESTRICT DELETE cho dữ liệu quan trọng (categories)
═══════════════════════════════════════════════════════════
```

---

## 🎨 PHIÊN BẢN VISUAL DIAGRAM (Detailed ERD - Simplified)

### **LAYOUT KHUYẾN NGHỊ: 3 CỤMJ THEO CHIỀU DỌC**

```
╔═══════════════════════════════════════════════════════════════╗
║                   MYFINANCE DATABASE SCHEMA                   ║
║                        12 Tables - MySQL 8.x                  ║
╚═══════════════════════════════════════════════════════════════╝


┌─────────────────────────────────────────────────────────────┐
│                    NHÓM CORE DATA (4 bảng)                   │
└─────────────────────────────────────────────────────────────┘

    ┌─────────────────────┐
    │      users          │ ◄───┐
    ├─────────────────────┤     │
    │ 🔑 id (PK)          │     │ 1
    │ 🔒 email (UK)       │     │
    │    password         │     │
    │    full_name        │     │
    │    phone_number     │     │
    │    address          │     │
    │    date_of_birth    │     │
    │    avatar (TEXT)    │     │ (Base64, 16MB max)
    │    created_at       │     │
    │    updated_at       │     │
    └─────────────────────┘     │
              │                 │
              │ 1               │
              │                 │
              ├────────────┐    │
              │            │    │
              ▼ Many       ▼ Many
    ┌─────────────────────┐   ┌─────────────────────┐
    │    categories       │   │   transactions      │
    ├─────────────────────┤   ├─────────────────────┤
    │ 🔑 id (PK)          │   │ 🔑 id (PK)          │
    │ 🔗 user_id (FK)     │   │ 🔗 user_id (FK)     │
    │    name             │◄──┤ 🔗 category_id (FK) │
    │    type (ENUM)      │ 1 │    amount (VND)     │
    │      • INCOME       │   │    type (ENUM)      │
    │      • EXPENSE      │   │    description      │
    │    color (#HEX)     │   │    transaction_date │
    │    icon             │   │    created_at       │
    │    is_default       │   │    updated_at       │
    │    created_at       │   └─────────────────────┘
    │    updated_at       │            Many
    └─────────────────────┘
              │ 1
              │ (Only EXPENSE categories)
              │
              ▼ Many
    ┌─────────────────────┐
    │      budgets        │
    ├─────────────────────┤
    │ 🔑 id (PK)          │
    │ 🔗 user_id (FK)     │
    │ 🔗 category_id (FK) │
    │    budget_amount    │ (VND only)
    │    budget_year      │
    │    budget_month     │ (1-12)
    │    description      │
    │    is_active        │
    │    created_at       │
    │    updated_at       │
    └─────────────────────┘
    🔒 UK: (user_id, category_id, budget_year, budget_month)


┌─────────────────────────────────────────────────────────────┐
│              NHÓM SECURITY & ADMIN (4 bảng)                  │
└─────────────────────────────────────────────────────────────┘

    ┌─────────────────────┐
    │       roles         │
    ├─────────────────────┤
    │ 🔑 id (PK)          │
    │ 🔒 name (UK)        │
    │      • USER         │
    │      • ADMIN        │
    │      • SUPER_ADMIN  │ (unused)
    │    description      │
    │    created_at       │
    └─────────────────────┘
              │ 1
              │
              ▼ Many
    ┌─────────────────────┐         ┌─────────────────────┐
    │    user_roles       │         │    audit_logs       │
    ├─────────────────────┤         ├─────────────────────┤
    │ 🔑 id (PK)          │         │ 🔑 id (PK)          │
    │ 🔗 user_id (FK)     │         │ 🔗 admin_user_id(FK)│
    │ 🔗 role_id (FK)     │         │    action           │
    │    created_at       │         │    entity_type      │
    └─────────────────────┘         │    entity_id        │
              ▲                     │    old_value        │
              │ Many                │    new_value        │
              │                     │    ip_address       │
              │ 1                   │    timestamp        │
              └─── users            └─────────────────────┘
                                              ▲
                                              │ Privacy-conscious
                                              │ (90%+ log reduction)

    ┌─────────────────────┐
    │   system_config     │
    ├─────────────────────┤
    │ 🔑 id (PK)          │
    │ 🔒 config_key (UK)  │
    │    config_value     │
    │    config_type      │
    │      • FEATURE_FLAG │
    │      • SYSTEM_SETTING│
    │      • INTEGRATION  │
    │      • MAINTENANCE  │
    │    description      │
    │    is_active        │
    │    created_at       │
    │    updated_at       │
    └─────────────────────┘


┌─────────────────────────────────────────────────────────────┐
│                  NHÓM FEATURES (4 bảng)                      │
└─────────────────────────────────────────────────────────────┘

    ┌──────────────────────────┐    ┌─────────────────────────┐
    │  user_budget_settings    │    │   scheduled_reports     │
    ├──────────────────────────┤    ├─────────────────────────┤
    │ 🔑 id (PK)               │    │ 🔑 id (PK)              │
    │ 🔒 user_id (FK, UK)      │    │ 🔗 user_id (FK)         │
    │    warning_threshold     │    │    report_type (ENUM)   │
    │      (default: 75.0)     │    │      • MONTHLY          │
    │    critical_threshold    │    │      • YEARLY           │
    │      (default: 90.0)     │    │      • CATEGORY         │
    │    notifications_enabled │    │    frequency (ENUM)     │
    │    email_alerts_enabled  │    │      • DAILY/WEEKLY/... │
    │    daily_summary_enabled │    │    format (ENUM)        │
    │    created_at            │    │      • PDF/CSV/BOTH     │
    │    updated_at            │    │    email_delivery       │
    └──────────────────────────┘    │    is_active            │
              ▲                     │    last_run             │
              │ One-to-One          │    next_run             │
              └─── users            │    run_count            │
                                    │    created_at           │
                                    │    updated_at           │
                                    └─────────────────────────┘
                                              ▲
                                              │ @Scheduled cron
                                              │ (runs hourly)

    ┌──────────────────────────┐    ┌─────────────────────────┐
    │   user_preferences       │    │   onboarding_progress   │
    ├──────────────────────────┤    ├─────────────────────────┤
    │ 🔑 id (PK)               │    │ 🔑 id (PK)              │
    │ 🔒 user_id (FK, UK)      │    │ 🔒 user_id (FK, UK)     │
    │    viewMode              │    │    current_step         │
    │    emailNotifications    │    │    steps_completed      │
    │    budgetAlerts          │    │    step1_completed      │
    │    monthlySummary        │    │    step2_completed      │
    │    weeklySummary         │    │    step3_completed      │
    │    ... (10 more fields)  │    │    step4_completed      │
    │    created_at            │    │    is_completed         │
    │    updated_at            │    │    is_skipped           │
    └──────────────────────────┘    │    completed_at         │
              ▲                     │    created_at           │
              │ One-to-One          │    updated_at           │
              └─── users            └─────────────────────────┘
                                              ▲
                                              │ 4-step wizard
                                              │ (new users only)


═══════════════════════════════════════════════════════════════
                    KEY RELATIONSHIPS
═══════════════════════════════════════════════════════════════

users (1) ────< (Many) categories
users (1) ────< (Many) transactions
users (1) ────< (Many) budgets
users (1) ────< (Many) user_roles
users (1) ───── (1) user_budget_settings
users (1) ───── (1) user_preferences
users (1) ───── (1) onboarding_progress
users (1) ────< (Many) scheduled_reports

categories (1) ────< (Many) transactions
categories (1) ────< (Many) budgets (EXPENSE only)

roles (1) ────< (Many) user_roles
```

---

## 🛠️ CÔNG CỤ VẼ ERD KHUYẾN NGHỊ

### **TOP 3 CÔNG CỤ:**

### 1. **MySQL Workbench** ⭐⭐⭐⭐⭐ (RECOMMENDED)
   - **Lý do**: Tự động generate ERD từ database thật!
   - **Ưu điểm**:
     - Reverse engineer từ MySQL database
     - Hiển thị chính xác FK, PK, indexes
     - Export PNG/PDF/SVG chất lượng cao
     - MIỄN PHÍ
   - **Cách làm**:
     ```
     1. Mở MySQL Workbench
     2. Database → Reverse Engineer...
     3. Chọn connection đến database myfinance
     4. Next → Next → Execute
     5. Model → EER Diagram (tự động tạo)
     6. Chỉnh layout, colors
     7. File → Export → Export as PNG/PDF
     ```

### 2. **dbdiagram.io** ⭐⭐⭐⭐⭐ (EASIEST)
   - **Lý do**: Code-to-diagram, web-based, cực nhanh!
   - **Ưu điểm**:
     - Viết code → tự động vẽ diagram
     - Syntax đơn giản
     - Share online dễ dàng
     - Export PNG/PDF (free plan: 10 diagrams)
   - **Link**: https://dbdiagram.io/

### 3. **Draw.io (diagrams.net)** ⭐⭐⭐⭐
   - **Lý do**: Vẽ thủ công nhưng linh hoạt nhất
   - **Ưu điểm**:
     - 100% custom layout
     - Entity shape có sẵn
     - MIỄN PHÍ hoàn toàn
   - **Link**: https://app.diagrams.net/

---

## 📝 CODE CHO DBDIAGRAM.IO (Copy & Paste)

```dbdiagram
// MYFINANCE DATABASE SCHEMA
// 12 Tables - MySQL 8.x

// ============ CORE DATA GROUP ============
Table users {
  id bigint [pk, increment]
  email varchar(255) [unique, not null]
  password varchar(255) [not null]
  full_name varchar(255)
  phone_number varchar(20)
  address varchar(255)
  date_of_birth date
  avatar mediumtext
  created_at timestamp [default: `CURRENT_TIMESTAMP`]
  updated_at timestamp [default: `CURRENT_TIMESTAMP`]

  Note: 'Thông tin người dùng'
}

Table categories {
  id bigint [pk, increment]
  user_id bigint [not null, ref: > users.id]
  name varchar(255) [not null]
  type enum('INCOME', 'EXPENSE') [not null]
  color varchar(7)
  icon varchar(50)
  is_default boolean [default: false]
  created_at timestamp
  updated_at timestamp

  Note: '14 default categories, fully customizable'
}

Table transactions {
  id bigint [pk, increment]
  user_id bigint [not null, ref: > users.id]
  category_id bigint [not null, ref: > categories.id]
  amount decimal(12,2) [not null]
  type enum('INCOME', 'EXPENSE') [not null]
  description text
  transaction_date date [not null]
  created_at timestamp
  updated_at timestamp

  Note: 'VND only, realtime balance'
}

Table budgets {
  id bigint [pk, increment]
  user_id bigint [not null, ref: > users.id]
  category_id bigint [not null, ref: > categories.id]
  budget_amount decimal(12,2) [not null]
  budget_year int [not null]
  budget_month int [not null]
  description text
  is_active boolean [default: true]
  created_at timestamp
  updated_at timestamp

  Indexes {
    (user_id, category_id, budget_year, budget_month) [unique]
  }

  Note: 'EXPENSE categories only'
}

// ============ SECURITY & ADMIN GROUP ============
Table roles {
  id bigint [pk, increment]
  name varchar(50) [unique, not null]
  description varchar(255)
  created_at timestamp

  Note: 'USER, ADMIN, SUPER_ADMIN'
}

Table user_roles {
  id bigint [pk, increment]
  user_id bigint [not null, ref: > users.id]
  role_id bigint [not null, ref: > roles.id]
  created_at timestamp
}

Table audit_logs {
  id bigint [pk, increment]
  admin_user_id bigint [ref: > users.id]
  action varchar(100)
  entity_type varchar(100)
  entity_id bigint
  old_value text
  new_value text
  ip_address varchar(50)
  timestamp timestamp

  Note: 'Privacy-conscious, 90%+ log reduction'
}

Table system_config {
  id bigint [pk, increment]
  config_key varchar(255) [unique, not null]
  config_value text
  config_type enum('FEATURE_FLAG', 'SYSTEM_SETTING', 'INTEGRATION', 'MAINTENANCE')
  description text
  is_active boolean [default: true]
  created_at timestamp
  updated_at timestamp
}

// ============ FEATURES GROUP ============
Table user_budget_settings {
  id bigint [pk, increment]
  user_id bigint [unique, not null, ref: > users.id]
  warning_threshold double [not null, default: 75.0]
  critical_threshold double [not null, default: 90.0]
  notifications_enabled boolean [default: true]
  email_alerts_enabled boolean [default: false]
  daily_summary_enabled boolean [default: true]
  created_at timestamp
  updated_at timestamp

  Note: 'One-to-One with users'
}

Table scheduled_reports {
  id bigint [pk, increment]
  user_id bigint [not null, ref: > users.id]
  report_type enum('MONTHLY', 'YEARLY', 'CATEGORY') [not null]
  frequency enum('DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY') [not null]
  format enum('PDF', 'CSV', 'BOTH') [not null]
  email_delivery boolean [default: true]
  is_active boolean [default: true]
  last_run timestamp
  next_run timestamp
  run_count int [default: 0]
  created_at timestamp
  updated_at timestamp

  Note: '@Scheduled cron runs hourly'
}

Table user_preferences {
  id bigint [pk, increment]
  user_id bigint [unique, not null, ref: > users.id]
  viewMode varchar(20) [default: 'detailed']
  emailNotifications boolean [default: true]
  budgetAlerts boolean [default: true]
  monthlySummary boolean [default: true]
  weeklySummary boolean [default: false]
  created_at timestamp
  updated_at timestamp

  Note: '3 active preferences (viewMode, emailNotifications, budgetAlerts)'
}

Table onboarding_progress {
  id bigint [pk, increment]
  user_id bigint [unique, not null, ref: > users.id]
  current_step int [default: 1]
  steps_completed int [default: 0]
  step1_completed boolean [default: false]
  step2_completed boolean [default: false]
  step3_completed boolean [default: false]
  step4_completed boolean [default: false]
  is_completed boolean [default: false]
  is_skipped boolean [default: false]
  completed_at timestamp
  created_at timestamp
  updated_at timestamp

  Note: '4-step onboarding wizard'
}
```

**Cách dùng**:
1. Vào https://dbdiagram.io/
2. Paste code trên vào editor
3. Diagram tự động hiện ra!
4. Chỉnh layout (drag & drop)
5. Export PNG/PDF

---

## 🎨 PHIÊN BẢN ĐƠN GIẢN CHO SLIDE (RECOMMENDED)

Nếu ERD đầy đủ quá phức tạp, dùng **phiên bản nhóm 3 cụm**:

```
┌───────────────────────────────────────────────┐
│         MYFINANCE DATABASE                    │
│         12 Tables - 3 Nhóm chức năng          │
└───────────────────────────────────────────────┘


┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   NHÓM 1: CORE DATA       ┃
┃   (Dữ liệu nghiệp vụ)     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

📋 users                   Thông tin người dùng
   ↓
📁 categories              Danh mục thu/chi (14 default)
   ↓
💰 transactions            Giao dịch VND realtime
   ↓
💵 budgets                 Ngân sách theo tháng/danh mục


┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   NHÓM 2: SECURITY        ┃
┃   (Bảo mật & Quản trị)    ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

🔐 roles                   USER, ADMIN roles
   ↓
🔗 user_roles              Gán vai trò
   ↓
📝 audit_logs              Nhật ký admin (90%+ reduction)
   ↓
⚙️ system_config           Cấu hình hệ thống


┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   NHÓM 3: FEATURES        ┃
┃   (Tính năng nâng cao)    ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

⚡ user_budget_settings    Ngưỡng cảnh báo (75%, 90%)
   ↓
📅 scheduled_reports       Báo cáo tự động (@Scheduled)
   ↓
🎯 user_preferences        3 active preferences
   ↓
📚 onboarding_progress     Wizard 4 bước


═══════════════════════════════════════════════
✅ Foreign keys, indexes, UK constraints đầy đủ
✅ CASCADE/RESTRICT DELETE policies
✅ Hibernate DDL Auto (update mode)
═══════════════════════════════════════════════
```

---

## 📐 LAYOUT VÀ DESIGN TIPS

### **1. Màu sắc cho từng nhóm:**

| Nhóm | Màu nền | Màu chữ | Ý nghĩa |
|------|---------|---------|---------|
| **CORE DATA** | `#EEF2FF` (Indigo-50) | `#4F46E5` (Indigo-600) | Dữ liệu chính |
| **SECURITY & ADMIN** | `#FEF3C7` (Amber-100) | `#D97706` (Amber-600) | Bảo mật |
| **FEATURES** | `#D1FAE5` (Green-100) | `#059669` (Green-600) | Tính năng |

### **2. Biểu tượng quan hệ:**

```
1 ────< Many    (One-to-Many: users → transactions)
1 ───── 1       (One-to-One: users ─── user_budget_settings)
Many >────< Many (Many-to-Many: users >──< roles via user_roles)
```

### **3. Ký hiệu trong tables:**

- 🔑 = Primary Key (PK)
- 🔗 = Foreign Key (FK)
- 🔒 = Unique Key (UK)
- ⚡ = Indexed field

### **4. Kích thước khuyến nghị:**

**Cho PowerPoint 16:9:**
- Canvas: 1920 x 1080 px
- Mỗi table box: 300 x 250 px
- Font: 14-16pt (table names: 18pt bold)
- Spacing giữa tables: 50-80px
- Arrow width: 2-3pt

---

## 💡 3 PHƯƠNG ÁN VẼ DIAGRAM

### **PHƯƠNG ÁN 1: MySQL Workbench (Tự động)** ⏱️ 5 phút
**Ưu**: Chính xác 100%, tự động từ database
**Nhược**: Layout có thể lộn xộn, cần adjust

**Steps**:
1. MySQL Workbench → Database → Reverse Engineer
2. Chọn myfinance database
3. EER Diagram tự động tạo
4. Chỉnh layout (drag boxes vào 3 nhóm)
5. Thêm màu sắc và annotations
6. Export PNG (1920x1080, 300 DPI)

---

### **PHƯƠNG ÁN 2: dbdiagram.io (Code-to-Diagram)** ⏱️ 10 phút
**Ưu**: Nhanh, đẹp, online sharing
**Nhược**: Free plan giới hạn 10 diagrams

**Steps**:
1. Vào https://dbdiagram.io/
2. Copy code từ phần "CODE CHO DBDIAGRAM.IO" ở trên
3. Paste vào editor
4. Diagram tự động render
5. Adjust layout (drag & drop tables)
6. Thêm colors (Settings → Theme)
7. Export → PNG/PDF

---

### **PHƯƠNG ÁN 3: PowerPoint Simplified (Thủ công đơn giản)** ⏱️ 15 phút
**Ưu**: Đơn giản, không cần tools phức tạp
**Nhược**: Không chi tiết như ERD thật

**Steps**:
1. Dùng "PHIÊN BẢN ĐƠN GIẢN" ở trên
2. Tạo 3 boxes lớn cho 3 nhóm
3. List 4 tables trong mỗi nhóm với icons
4. Thêm mũi tên chỉ mối quan hệ chính (users → ...)
5. Thêm notes dưới mỗi nhóm
6. Apply màu sắc theo bảng khuyến nghị

---

## 📊 COMPARISON: 3 Phương án

| Tiêu chí | MySQL Workbench | dbdiagram.io | PowerPoint |
|----------|----------------|--------------|------------|
| **Thời gian** | 5 phút | 10 phút | 15 phút |
| **Độ chính xác** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Độ đẹp** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Dễ dùng** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Chi tiết** | Full ERD | Full ERD | Simplified |
| **Giá** | FREE | FREE (10 diagrams) | FREE |

**KHUYẾN NGHỊ**:
- ✅ **Trình bày slide**: Dùng **Phương án 3** (PowerPoint Simplified) - dễ hiểu, không quá kỹ thuật
- ✅ **Báo cáo kỹ thuật**: Dùng **Phương án 1 hoặc 2** (MySQL Workbench/dbdiagram.io) - chi tiết đầy đủ

---

## 🎯 ĐIỂM MẠNH KHI TRÌNH BÀY

Khi thuyết trình Slide 12, nhấn mạnh:

✅ **Tổ chức logic**: 3 nhóm rõ ràng (Core, Security, Features)
✅ **Tính toàn vẹn**: Foreign keys, unique constraints đầy đủ
✅ **Tối ưu hóa**: Proper indexes trên các FK và queried fields
✅ **Bảo mật**: Cascade delete cho dữ liệu phụ thuộc, restrict cho dữ liệu quan trọng
✅ **Mở rộng**: Dễ dàng thêm tables mới vào từng nhóm

**Script mẫu (tham khảo)**:
> "Database của chúng em gồm 12 bảng được tổ chức thành 3 nhóm logic. Nhóm Core Data chứa 4 bảng nghiệp vụ chính: users, categories, transactions và budgets. Nhóm Security & Admin có 4 bảng: roles, user_roles, audit_logs và system_config để đảm bảo bảo mật và quản trị. Nhóm Features có 4 bảng hỗ trợ tính năng nâng cao như cảnh báo ngân sách, báo cáo tự động, tùy chọn cá nhân và onboarding wizard. Tất cả các bảng đều có foreign keys, indexes và constraints đầy đủ để đảm bảo tính toàn vẹn và hiệu suất."

---

## ✅ TÓM TẮT

**Diagram này là**: **Simplified ERD** (Entity Relationship Diagram đơn giản hóa)

**3 Phương án vẽ**:
1. **MySQL Workbench** - Tự động từ database (5 phút) ⭐⭐⭐⭐⭐
2. **dbdiagram.io** - Code-to-diagram (10 phút) ⭐⭐⭐⭐⭐
3. **PowerPoint** - Vẽ thủ công đơn giản (15 phút) ⭐⭐⭐⭐

**Khuyến nghị cho slide**: Dùng **phiên bản nhóm 3 cụm** (PowerPoint) - đơn giản, dễ hiểu, không quá kỹ thuật!

Chúc bạn vẽ diagram thành công! 🎨
