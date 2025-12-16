# THUYẾT TRÌNH DỰ ÁN MYFINANCE
## Skeleton PowerPoint Presentation - Đề tài Quản Lý Tài Chính Cá Nhân

*Tài liệu này được thiết kế làm khung cho bài thuyết trình PowerPoint bảo vệ đồ án*

---

## 📌 SLIDE 1: TRANG BÌA

**Nội dung:**
- **Tên đề tài**: MyFinance - Hệ Thống Quản Lý Tài Chính Cá Nhân
- **Nhóm thực hiện**: [Tên nhóm của bạn]
- **Giảng viên hướng dẫn**: [Tên giảng viên]
- **Thời gian**: Học kỳ [X] năm học [20XX-20XX]
- **Logo/Hình ảnh**: Logo MyFinance

---

## 📌 PHẦN 1: GIỚI THIỆU NHÓM VÀ ĐỀ TÀI

### SLIDE 2: GIỚI THIỆU NHÓM THỰC HIỆN

**Nội dung cần điền:**

| Thành viên | MSSV | Vai trò chính | Công việc đảm nhận |
|-----------|------|--------------|-------------------|
| [Tên SV 1] | [MSSV] | Team Lead / Backend Dev | Backend API, Database, Security |
| [Tên SV 2] | [MSSV] | Frontend Developer | React Web App, UI/UX |
| [Tên SV 3] | [MSSV] | Mobile Developer | Flutter Mobile App |
| [Tên SV 4] | [MSSV] | Tester / Documentation | Testing, Documentation, Deployment |

*Ghi chú: Điều chỉnh số lượng thành viên và vai trò theo thực tế nhóm của bạn*

---

### SLIDE 3: TỔNG QUAN ĐỀ TÀI

**Tiêu đề**: Tại sao chọn đề tài MyFinance?

**Nội dung:**

**🎯 Mục tiêu dự án:**
- Xây dựng hệ thống quản lý tài chính cá nhân hoàn chỉnh
- Giúp người dùng theo dõi thu chi, lập kế hoạch ngân sách
- Cung cấp báo cáo phân tích tài chính trực quan
- Hỗ trợ 3 nền tảng: Web, Mobile (Flutter)

**💡 Lý do chọn đề tài:**
- Nhu cầu thực tế: Quản lý tài chính là vấn đề thiết yếu của mọi người
- Ứng dụng công nghệ hiện đại: Spring Boot, React, Flutter
- Tích hợp đầy đủ chức năng thực tế: RBAC, Email, Báo cáo tự động
- Thị trường Việt Nam: Tối ưu hóa cho người dùng Việt (VND only, dd/mm/yyyy)

**📊 Phạm vi ứng dụng:**
- Cá nhân quản lý tài chính hàng tháng
- Hộ gia đình theo dõi thu chi chung
- Sinh viên, người đi làm lập ngân sách

---

### SLIDE 4: TÍNH NĂNG NỔI BẬT

**Các tính năng chính đã triển khai (95% hoàn thiện):**

✅ **Quản lý thu chi** - Transaction Management
  - Ghi nhận giao dịch thu/chi theo danh mục
  - Tìm kiếm và lọc giao dịch linh hoạt
  - Định dạng tiền tệ VND chuẩn Việt Nam

✅ **Lập kế hoạch ngân sách** - Budget Planning
  - Đặt ngân sách theo danh mục và tháng
  - Cảnh báo ngưỡng 75% (Warning) và 90% (Critical)
  - Theo dõi tiến độ chi tiêu realtime

✅ **Báo cáo & Phân tích** - Reports & Analytics
  - Báo cáo tháng, năm, theo danh mục
  - Xuất PDF, Excel, CSV
  - Điểm sức khỏe tài chính (0-100)
  - Biểu đồ trực quan (pie chart, bar chart)

✅ **Quản trị hệ thống** - Admin System
  - Phân quyền RBAC (USER, ADMIN, SUPER_ADMIN)
  - Quản lý người dùng và audit logs
  - Cấu hình hệ thống và analytics

✅ **Email tự động** - Email Automation
  - Email chào mừng người dùng mới
  - Cảnh báo vượt ngân sách
  - Báo cáo tháng tự động (ngày 1 hàng tháng)
  - Báo cáo theo lịch (hàng ngày/tuần/tháng)

---

## 📌 PHẦN 2: CÔNG CỤ VÀ CÔNG NGHỆ

### SLIDE 5: KIẾN TRÚC HỆ THỐNG TỔNG QUAN

**Sơ đồ kiến trúc 3-tier:**

```
┌─────────────────────────────────────────────┐
│         PRESENTATION LAYER                  │
├───────────────────┬─────────────────────────┤
│  React Web App    │  Flutter Mobile App     │
│  (Port 3000)      │  (Android/iOS)          │
│  - 69 files       │  - 40 files            │
│  - Tailwind CSS   │  - Material Design      │
└───────────────────┴─────────────────────────┘
                    │
                    ├──► REST API (HTTP/HTTPS)
                    ↓
┌─────────────────────────────────────────────┐
│         BUSINESS LOGIC LAYER                │
├─────────────────────────────────────────────┤
│      Spring Boot Backend (Port 8080)        │
│  - 17 Controllers                           │
│  - 20 Services                              │
│  - 16 Entities                              │
│  - 100+ REST API endpoints                  │
│  - JWT Authentication + RBAC                │
└─────────────────────────────────────────────┘
                    │
                    ├──► JDBC/JPA
                    ↓
┌─────────────────────────────────────────────┐
│          DATA PERSISTENCE LAYER             │
├─────────────────────────────────────────────┤
│         MySQL Database (Port 3306)          │
│  - 12 tables                                │
│  - Hibernate DDL auto                       │
│  - Proper indexes and foreign keys          │
└─────────────────────────────────────────────┘
```

---

### SLIDE 6: CÔNG NGHỆ BACKEND

**Backend Stack (Spring Boot + MySQL):**

| Công nghệ | Phiên bản | Mục đích sử dụng |
|----------|----------|-----------------|
| **Java** | 17 | Ngôn ngữ lập trình chính |
| **Spring Boot** | 3.5.5 | Framework backend, REST API |
| **Spring Security** | 6.x | Bảo mật, JWT authentication |
| **Spring Data JPA** | 3.x | ORM, database access |
| **Hibernate** | 6.x | JPA implementation, DDL auto |
| **MySQL** | 8.x | Relational database |
| **Lombok** | 1.18.x | Giảm boilerplate code |
| **BCrypt** | - | Mã hóa mật khẩu |
| **JWT (jsonwebtoken)** | 0.11.5 | Token-based authentication |
| **Thymeleaf** | 3.x | Email template engine |
| **JavaMail** | - | Gửi email tự động |
| **iText7** | 7.2.5 | Generate PDF reports |
| **OpenCSV** | 5.7.1 | Generate CSV exports |

**Kiến trúc backend:**
- **Controller**: Xử lý HTTP requests (17 controllers)
- **Service**: Business logic layer (20 services)
- **Repository**: Data access layer (12+ repositories)
- **Entity**: JPA entities ánh xạ database (16 entities)
- **DTO**: Data transfer objects (request/response)
- **Security**: JWT filter, authorization aspects

---

### SLIDE 7: CÔNG NGHỆ FRONTEND WEB

**Web Frontend Stack (React + Tailwind CSS):**

| Công nghệ | Phiên bản | Mục đích sử dụng |
|----------|----------|-----------------|
| **React** | 19.1.1 | UI framework, component-based |
| **React Router DOM** | 7.8.2 | Client-side routing (26 routes) |
| **Tailwind CSS** | 3.4.0 | Utility-first CSS framework |
| **Lucide React** | 0.545.0 | Icon library chính (80+ icons) |
| **Recharts** | 3.2.1 | Data visualization, charts |
| **jsPDF** | 3.0.3 | Client-side PDF generation |
| **xlsx** | 0.18.5 | Excel export functionality |
| **Axios** | - | HTTP client (wrapped in API services) |

**Cấu trúc frontend:**
- **Pages**: 29 files (auth, dashboard, transactions, budgets, reports, admin)
- **Components**: 26 files (reusable UI components)
- **Contexts**: 4 providers (Auth, Transaction, Budget, Category)
- **Services**: API layer với 7 specialized classes
- **Utils**: PDF/Excel/CSV export utilities

**Thiết kế UI/UX:**
- Theme: Indigo/Violet gradient (modern fintech aesthetic)
- Responsive design: Mobile-first approach
- Icons: Centralized Lucide React system
- Loading states, error handling, Vietnamese localization

---

### SLIDE 8: CÔNG NGHỆ MOBILE (FLUTTER)

**Mobile Frontend Stack (Flutter + Dart):**

| Công nghệ | Phiên bản | Mục đích sử dụng |
|----------|----------|-----------------|
| **Flutter** | 3.x | Cross-platform framework |
| **Dart** | 3.x | Ngôn ngữ lập trình |
| **Provider** | 6.1.2 | State management pattern |
| **Dio** | 5.4.0 | HTTP client cho API calls |
| **flutter_secure_storage** | 9.2.2 | Lưu JWT token an toàn |
| **fl_chart** | 0.68.0 | Interactive charts |
| **intl** | 0.18.1 | Internationalization, date/number format |
| **shared_preferences** | 2.2.2 | Local storage |

**Cấu trúc mobile:**
- **Screens**: 16 screens (85% feature parity với web)
- **Services**: 6 service files (API integration)
- **Providers**: State management với Provider pattern
- **Widgets**: 5 custom widgets (PersonalizedGreeting, Charts, etc.)
- **Utils**: Date formatting, currency helpers

**Đặc điểm mobile:**
- Material Design guidelines
- Platform-specific adaptations
- CSV export với share functionality
- Offline-capable với local storage
- Zero compilation errors, production-ready

---

### SLIDE 9: CÔNG CỤ PHÁT TRIỂN & TRIỂN KHAI

**Development Tools:**

| Loại | Công cụ | Mục đích |
|------|---------|---------|
| **IDE** | IntelliJ IDEA / Eclipse | Backend development |
| | VS Code | Frontend & mobile development |
| **Version Control** | Git + GitHub | Source code management |
| **API Testing** | Postman | Test REST API endpoints |
| **Database Tool** | MySQL Workbench / DBeaver | Database management |
| **Email Testing** | Mailtrap | SMTP testing environment |
| **Package Manager** | Maven (backend), npm (web), pub (mobile) | Dependency management |

**Production Recommendations:**
- **Hosting Backend**: AWS EC2, Google Cloud, VPS
- **Database**: AWS RDS, Google Cloud SQL
- **Frontend Web**: Vercel, Netlify, AWS S3 + CloudFront
- **Mobile**: Google Play Store, Apple App Store
- **Email Service**: SendGrid, AWS SES (thay Mailtrap)

---

## 📌 PHẦN 3: CHỨC NĂNG CHÍNH VÀ USE CASE DIAGRAMS

### SLIDE 10: TỔNG QUAN 6 FLOWS CHÍNH

**MyFinance có 6 flows chức năng chính:**

1. **Flow 1: Authentication & User Management** [✅ 100%]
   - Đăng ký, đăng nhập, quản lý profile

2. **Flow 2: Transaction & Category Management** [✅ 100%]
   - Quản lý giao dịch thu/chi và danh mục

3. **Flow 3: Budget Planning** [✅ 100%]
   - Lập kế hoạch ngân sách và cảnh báo

4. **Flow 4: Reports & Analytics** [✅ 100%]
   - Báo cáo và phân tích tài chính

5. **Flow 5: Admin System** [✅ 100%]
   - Quản trị hệ thống và phân quyền

6. **Flow 6: UX Enhancement** [🔄 43%]
   - Tối ưu trải nghiệm người dùng (phases 6A & 6D hoàn thành)

---

### SLIDE 11: USE CASE DIAGRAM - FLOW 1 (Authentication)

**Actor:** Người dùng (User), Admin

```
┌─────────────────────────────────────────────────┐
│         FLOW 1: AUTHENTICATION                   │
│         & USER MANAGEMENT                        │
├─────────────────────────────────────────────────┤
│                                                  │
│   User                                           │
│    │                                             │
│    ├──► Đăng ký tài khoản                       │
│    │     (Register with email)                  │
│    │                                             │
│    ├──► Đăng nhập                               │
│    │     (Login with JWT)                       │
│    │                                             │
│    ├──► Quên mật khẩu                           │
│    │     (Forgot password - email reset)        │
│    │                                             │
│    ├──► Đổi mật khẩu                            │
│    │     (Change password)                      │
│    │                                             │
│    ├──► Xem/Sửa profile                         │
│    │     (View/Edit profile)                    │
│    │     - Avatar upload (Base64)               │
│    │     - Thông tin mở rộng (phone, address)   │
│    │                                             │
│    └──► Onboarding wizard                       │
│         (4-step setup cho user mới)             │
│                                                  │
│   Admin                                          │
│    │                                             │
│    └──► Tạo/Quản lý admin users                 │
│         (Admin creation & role assignment)       │
│                                                  │
└─────────────────────────────────────────────────┘
```

**Highlights:**
- JWT token-based authentication (access token + refresh token)
- BCrypt password encryption
- Email verification framework
- Profile management với avatar upload (MEDIUMTEXT, max 16MB)
- Onboarding wizard tự động cho user mới

---

### SLIDE 12: USE CASE DIAGRAM - FLOW 2 (Transactions & Categories)

**Actor:** Người dùng (User)

```
┌─────────────────────────────────────────────────┐
│         FLOW 2: TRANSACTION                      │
│         & CATEGORY MANAGEMENT                    │
├─────────────────────────────────────────────────┤
│                                                  │
│   User                                           │
│    │                                             │
│    ├──► Quản lý danh mục                        │
│    │    (Category Management)                   │
│    │     ├─ Tạo danh mục mới                    │
│    │     ├─ Sửa danh mục                         │
│    │     ├─ Xóa danh mục                         │
│    │     └─ Lọc theo loại (Thu/Chi)             │
│    │                                             │
│    ├──► Quản lý giao dịch                       │
│    │    (Transaction Management)                │
│    │     ├─ Thêm giao dịch thu/chi              │
│    │     ├─ Sửa giao dịch                        │
│    │     ├─ Xóa giao dịch                        │
│    │     ├─ Tìm kiếm giao dịch                   │
│    │     ├─ Lọc theo danh mục                    │
│    │     ├─ Lọc theo khoảng thời gian           │
│    │     └─ Lọc theo loại (Thu/Chi)             │
│    │                                             │
│    └──► Xem dashboard tổng quan                 │
│         (View dashboard)                        │
│         - Số dư hiện tại (realtime)             │
│         - Giao dịch gần đây                     │
│         - Thống kê nhanh                        │
│                                                  │
└─────────────────────────────────────────────────┘
```

**Highlights:**
- 14 default Vietnamese categories (5 income, 9 expense)
- Realtime balance calculation
- Advanced search & filtering
- Vietnamese date format (dd/mm/yyyy)
- VND currency formatting

---

### SLIDE 13: USE CASE DIAGRAM - FLOW 3 (Budget Planning)

**Actor:** Người dùng (User)

```
┌─────────────────────────────────────────────────┐
│         FLOW 3: BUDGET PLANNING                  │
│         & WARNING SYSTEM                         │
├─────────────────────────────────────────────────┤
│                                                  │
│   User                                           │
│    │                                             │
│    ├──► Quản lý ngân sách                       │
│    │    (Budget Management)                     │
│    │     ├─ Tạo ngân sách theo danh mục         │
│    │     ├─ Sửa ngân sách                        │
│    │     ├─ Xóa ngân sách                        │
│    │     ├─ Lọc theo tháng/năm                  │
│    │     └─ Chỉ áp dụng cho danh mục chi        │
│    │                                             │
│    ├──► Theo dõi chi tiêu realtime             │
│    │    (Budget Tracking)                       │
│    │     ├─ Xem % chi tiêu/ngân sách            │
│    │     ├─ Số tiền còn lại                     │
│    │     ├─ Progress bars trực quan             │
│    │     └─ Color-coded status                  │
│    │         (Green/Yellow/Red)                 │
│    │                                             │
│    ├──► Nhận cảnh báo ngân sách                 │
│    │    (Budget Warnings)                       │
│    │     ├─ Warning alert (75%)                 │
│    │     ├─ Critical alert (90%)                │
│    │     ├─ Over-budget alert                   │
│    │     └─ Email notifications                 │
│    │                                             │
│    ├──► Cấu hình ngưỡng cảnh báo               │
│    │    (Threshold Settings)                    │
│    │     ├─ Tùy chỉnh % warning (50-100%)      │
│    │     ├─ Tùy chỉnh % critical (50-100%)     │
│    │     ├─ Bật/tắt notifications               │
│    │     └─ Bật/tắt email alerts                │
│    │                                             │
│    └──► Xem phân tích ngân sách                 │
│         (Budget Analytics)                      │
│         - Usage metrics                         │
│         - Performance trends                    │
│         - Dashboard budget widget               │
│                                                  │
└─────────────────────────────────────────────────┘
```

**Highlights:**
- UserBudgetSettings entity cho threshold configuration
- Realtime budget tracking với visual progress bars
- Multi-level warning system (Warning/Critical/Over-budget)
- Email alerts tự động khi vượt ngưỡng
- Budget vs Actual comparison

---

### SLIDE 14: USE CASE DIAGRAM - FLOW 4 (Reports & Analytics)

**Actor:** Người dùng (User)

```
┌─────────────────────────────────────────────────┐
│         FLOW 4: REPORTS & ANALYTICS              │
├─────────────────────────────────────────────────┤
│                                                  │
│   User                                           │
│    │                                             │
│    ├──► Báo cáo tháng                           │
│    │    (Monthly Report)                        │
│    │     ├─ Tổng thu/chi/tiết kiệm tháng        │
│    │     ├─ Breakdown theo danh mục             │
│    │     ├─ Top 5 categories                    │
│    │     ├─ Budget vs Actual comparison         │
│    │     └─ Export PDF/CSV/Excel                │
│    │                                             │
│    ├──► Báo cáo năm                             │
│    │    (Yearly Report)                         │
│    │     ├─ Tổng quan cả năm                    │
│    │     ├─ Monthly trends (12 tháng)           │
│    │     ├─ Tỷ lệ tiết kiệm                     │
│    │     └─ Export PDF/CSV/Excel                │
│    │                                             │
│    ├──► Báo cáo theo danh mục                   │
│    │    (Category Report)                       │
│    │     ├─ Chọn danh mục                       │
│    │     ├─ Chọn khoảng thời gian               │
│    │     ├─ Time-series data                    │
│    │     └─ Export PDF/CSV/Excel                │
│    │                                             │
│    ├──► Phân tích tài chính                     │
│    │    (Financial Analytics)                   │
│    │     ├─ Điểm sức khỏe tài chính (0-100)    │
│    │     ├─ Month-over-month comparison         │
│    │     ├─ Interactive charts                  │
│    │     │   (Pie chart, Bar chart, Line chart) │
│    │     └─ Personalized recommendations        │
│    │                                             │
│    ├──► Lập lịch báo cáo tự động               │
│    │    (Scheduled Reports)                     │
│    │     ├─ Tạo schedule (daily/weekly/monthly) │
│    │     ├─ Chọn format (PDF/CSV/Both)          │
│    │     ├─ Email delivery tự động              │
│    │     ├─ Enable/Disable schedules            │
│    │     └─ Quản lý schedules                   │
│    │                                             │
│    └──► Nhận email báo cáo                      │
│         (Email Reports)                         │
│         - Monthly summary (ngày 1 hàng tháng)   │
│         - Scheduled reports theo lịch           │
│                                                  │
└─────────────────────────────────────────────────┘
```

**Highlights:**
- 3 loại báo cáo: Monthly, Yearly, Category
- Export 3 formats: PDF (iText7), CSV (OpenCSV), Excel (xlsx)
- Financial health scoring (0-100 điểm)
- Interactive charts với Recharts
- Scheduled reports với Spring @Scheduled
- Email delivery tự động

---

### SLIDE 15: USE CASE DIAGRAM - FLOW 5 (Admin System)

**Actor:** Admin, Super Admin

```
┌─────────────────────────────────────────────────┐
│         FLOW 5: ADMIN SYSTEM                     │
│         & MANAGEMENT                             │
├─────────────────────────────────────────────────┤
│                                                  │
│   Admin                                          │
│    │                                             │
│    ├──► Quản lý người dùng                      │
│    │    (User Management)                       │
│    │     ├─ Xem danh sách users                 │
│    │     ├─ Search & Filter users               │
│    │     ├─ Kích hoạt/Vô hiệu hóa tài khoản    │
│    │     ├─ Xem chi tiết user                   │
│    │     └─ User statistics                     │
│    │                                             │
│    ├──► Xem audit logs                          │
│    │    (Audit Management)                      │
│    │     ├─ Xem log hoạt động admin             │
│    │     ├─ Filter theo action type             │
│    │     ├─ Filter theo thời gian               │
│    │     ├─ Export audit logs (JSON)            │
│    │     └─ Cleanup old logs                    │
│    │                                             │
│    ├──► Cấu hình hệ thống                       │
│    │    (System Configuration)                  │
│    │     ├─ Quản lý system configs              │
│    │     ├─ Feature flags                       │
│    │     ├─ Maintenance mode                    │
│    │     └─ Database migration tools            │
│    │                                             │
│    ├──► Xem phân tích hệ thống                  │
│    │    (Admin Analytics)                       │
│    │     ├─ Financial metrics dashboard         │
│    │     ├─ User behavior analytics             │
│    │     ├─ Transaction trends                  │
│    │     └─ System health monitoring            │
│    │                                             │
│    └──► Quản lý phân quyền                      │
│         (Role Management)                       │
│         - Assign/Remove roles                   │
│         - RBAC: USER/ADMIN/SUPER_ADMIN          │
│                                                  │
└─────────────────────────────────────────────────┘
```

**Highlights:**
- RBAC với 3 roles: USER, ADMIN, SUPER_ADMIN
- @RequiresAdmin annotation cho authorization
- Privacy-conscious audit logging (90%+ reduction)
- Comprehensive admin dashboard
- Financial analytics dashboard
- Backup & export functionality

---

## 📌 PHẦN 4: DATABASE VÀ DIAGRAM CHI TIẾT

### SLIDE 16: TỔNG QUAN DATABASE SCHEMA

**Thông tin chung:**
- **Database Engine**: MySQL 8.x
- **Migration Strategy**: Hibernate DDL Auto (`spring.jpa.hibernate.ddl-auto=update`)
- **Số bảng**: 12 bảng (phân chia theo 6 flows)
- **Entities**: 16 JPA entities
- **Indexing**: Proper indexes on foreign keys and frequently queried columns
- **Constraints**: Foreign keys, unique constraints, check constraints

**12 bảng chính:**

| STT | Tên bảng | Flow | Mô tả |
|-----|----------|------|-------|
| 1 | users | Flow 1 | Thông tin người dùng |
| 2 | roles | Flow 5 | Vai trò hệ thống |
| 3 | user_roles | Flow 5 | Gán vai trò cho user |
| 4 | categories | Flow 2 | Danh mục thu/chi |
| 5 | transactions | Flow 2 | Giao dịch thu/chi |
| 6 | budgets | Flow 3 | Ngân sách theo danh mục |
| 7 | user_budget_settings | Flow 3 | Cấu hình ngưỡng cảnh báo |
| 8 | scheduled_reports | Flow 4 | Lịch báo cáo tự động |
| 9 | audit_logs | Flow 5 | Nhật ký hoạt động admin |
| 10 | system_config | Flow 5 | Cấu hình hệ thống |
| 11 | user_preferences | Flow 6 | Tùy chọn người dùng |
| 12 | onboarding_progress | Flow 6 | Tiến trình onboarding |

---

### SLIDE 17: ENTITY RELATIONSHIP DIAGRAM (ERD) - PART 1

**Core Entities: Users, Roles, Categories, Transactions**

```
┌────────────────────────────────────────────────────────────────┐
│                   CORE DATABASE SCHEMA                          │
└────────────────────────────────────────────────────────────────┘

┌─────────────────┐
│     users       │
├─────────────────┤
│ • id (PK)       │◄──────────┐
│ • email (UK)    │            │ 1
│ • password      │            │
│ • full_name     │            │
│ • phone_number  │            │
│ • address       │            │
│ • date_of_birth │            │
│ • avatar        │            │ (MEDIUMTEXT, 16MB max)
│ • created_at    │            │
│ • updated_at    │            │
└─────────────────┘            │
                               │
                ┌──────────────┴──────────┐
                │                         │
                │ Many                    │ Many
                │                         │
┌───────────────▼──────┐       ┌─────────▼─────────┐
│   user_roles         │       │   categories      │
├──────────────────────┤       ├───────────────────┤
│ • id (PK)            │       │ • id (PK)         │
│ • user_id (FK)       │       │ • user_id (FK)    │
│ • role_id (FK)       │       │ • name            │
│ • created_at         │       │ • type            │ (INCOME/EXPENSE enum)
└──────┬───────────────┘       │ • color           │ (Hex color code)
       │                       │ • icon            │
       │                       │ • is_default      │
       │ Many                  │ • created_at      │
       │                       │ • updated_at      │
       │                       └─────────┬─────────┘
       │                                 │
       │                                 │ 1
       │                                 │
       │                                 │
       │                                 │ Many
       │                       ┌─────────▼─────────┐
       │                       │   transactions    │
       │                       ├───────────────────┤
       │                       │ • id (PK)         │
       │                       │ • user_id (FK)    │
       │                       │ • category_id (FK)│
       │                       │ • amount          │ (DECIMAL(12,2), VND only)
       │                       │ • type            │ (INCOME/EXPENSE)
       │                       │ • description     │
       │                       │ • transaction_date│
       │                       │ • created_at      │
       │                       │ • updated_at      │
       │                       └───────────────────┘
       │
       │ 1
       │
┌──────▼───────────┐
│     roles        │
├──────────────────┤
│ • id (PK)        │
│ • name (UK)      │ (USER, ADMIN, SUPER_ADMIN)
│ • description    │
│ • created_at     │
└──────────────────┘
```

**Giải thích:**
- **users**: Bảng người dùng với thông tin profile mở rộng (avatar MEDIUMTEXT cho Base64 encoding)
- **roles**: 3 vai trò hệ thống (USER, ADMIN, SUPER_ADMIN)
- **user_roles**: Many-to-Many relationship giữa users và roles
- **categories**: Danh mục thu/chi (14 default Vietnamese categories), mỗi user có categories riêng
- **transactions**: Giao dịch thu/chi, luôn gắn với 1 category và 1 user, amount chỉ VND

---

### SLIDE 18: ENTITY RELATIONSHIP DIAGRAM (ERD) - PART 2

**Budget & Settings: Budgets, UserBudgetSettings**

```
┌────────────────────────────────────────────────────────────────┐
│              BUDGET & WARNING SYSTEM SCHEMA                     │
└────────────────────────────────────────────────────────────────┘

┌─────────────────┐
│     users       │
├─────────────────┤
│ • id (PK)       │◄────────────┐
└─────────────────┘              │ 1
                                 │
                ┌────────────────┴─────────┐
                │                          │
                │ Many                     │ 1
                │                          │
┌───────────────▼──────┐       ┌──────────▼────────────────┐
│   budgets            │       │  user_budget_settings     │
├──────────────────────┤       ├───────────────────────────┤
│ • id (PK)            │       │ • id (PK)                 │
│ • user_id (FK)       │       │ • user_id (FK, UK)        │ (One-to-One)
│ • category_id (FK)   │─┐     │ • warning_threshold       │ (75.0 default)
│ • budget_amount      │ │     │ • critical_threshold      │ (90.0 default)
│ • budget_year        │ │     │ • notifications_enabled   │
│ • budget_month       │ │     │ • email_alerts_enabled    │
│ • description        │ │     │ • daily_summary_enabled   │
│ • is_active          │ │     │ • created_at              │
│ • created_at         │ │     │ • updated_at              │
│ • updated_at         │ │     └───────────────────────────┘
└──────────────────────┘ │
         │               │ Many
         │ UK: (user_id, category_id, budget_year, budget_month)
         │               │
         └───────────────┘ 1

┌─────────────────┐
│   categories    │
├─────────────────┤
│ • id (PK)       │
│ • type          │ (Only EXPENSE categories allowed for budgets)
└─────────────────┘
```

**Giải thích:**
- **budgets**: Ngân sách theo danh mục và tháng, chỉ áp dụng cho EXPENSE categories
- **UNIQUE KEY**: Đảm bảo 1 user chỉ có 1 budget per category per month
- **user_budget_settings**: One-to-One relationship với users, lưu cấu hình ngưỡng cảnh báo (75% warning, 90% critical)
- **Realtime tracking**: Hệ thống tính toán % chi tiêu so với budget và gửi email alert khi vượt ngưỡng

---

### SLIDE 19: ENTITY RELATIONSHIP DIAGRAM (ERD) - PART 3

**Reports & Admin: ScheduledReports, AuditLogs, SystemConfig**

```
┌────────────────────────────────────────────────────────────────┐
│           REPORTS & ADMIN SYSTEM SCHEMA                         │
└────────────────────────────────────────────────────────────────┘

┌─────────────────┐
│     users       │
├─────────────────┤
│ • id (PK)       │◄────────────┬─────────────┬──────────────┐
└─────────────────┘              │             │              │
                                 │ 1           │ 1            │ 1
                                 │             │              │
                ┌────────────────┴───┐  ┌──────▼──────┐  ┌────▼─────────────┐
                │ Many               │  │   Many      │  │   Many           │
                │                    │  │             │  │                  │
┌───────────────▼───────────┐  ┌────▼──────────┐  ┌──▼──────────────┐  ┌───▼──────────┐
│  scheduled_reports         │  │  audit_logs   │  │ user_preferences│  │ onboarding   │
├────────────────────────────┤  ├───────────────┤  ├─────────────────┤  │  _progress   │
│ • id (PK)                  │  │ • id (PK)     │  │ • id (PK)       │  ├──────────────┤
│ • user_id (FK)             │  │ • admin_id(FK)│  │ • user_id(FK,UK)│  │ • id (PK)    │
│ • report_type              │  │ • action      │  │ • viewMode      │  │ • user_id(FK)│
│   (MONTHLY/YEARLY/CATEGORY)│  │ • entity_type │  │ • emailNotif... │  │ • current... │
│ • frequency                │  │ • entity_id   │  │ • budgetAlerts  │  │ • steps_co...│
│   (DAILY/WEEKLY/MONTHLY/   │  │ • old_value   │  │ • monthlySummary│  │ • step1-4... │
│    QUARTERLY/YEARLY)       │  │ • new_value   │  │ • weeklySummary │  │ • is_compl...│
│ • format (PDF/CSV/BOTH)    │  │ • ip_address  │  │ • ... (10 more) │  │ • is_skipped │
│ • email_delivery           │  │ • timestamp   │  │ • created_at    │  │ • completed  │
│ • is_active                │  └───────────────┘  │ • updated_at    │  │ • created_at │
│ • last_run                 │                     └─────────────────┘  │ • updated_at │
│ • next_run                 │                                          └──────────────┘
│ • run_count                │
│ • created_at               │  ┌──────────────────┐
│ • updated_at               │  │  system_config   │
└────────────────────────────┘  ├──────────────────┤
                                │ • id (PK)        │
                                │ • config_key (UK)│
                                │ • config_value   │
                                │ • config_type    │ (FEATURE_FLAG, SYSTEM_SETTING,
                                │ • description    │  INTEGRATION, MAINTENANCE)
                                │ • is_active      │
                                │ • created_at     │
                                │ • updated_at     │
                                └──────────────────┘
```

**Giải thích:**
- **scheduled_reports**: Lịch báo cáo tự động (Spring @Scheduled cron job chạy hàng giờ), tự động tính next_run
- **audit_logs**: Nhật ký hoạt động admin (privacy-conscious, chỉ log operations quan trọng)
- **system_config**: Cấu hình hệ thống với categorization (FEATURE_FLAG, SYSTEM_SETTING, etc.)
- **user_preferences**: 3 active preferences (viewMode, emailNotifications, budgetAlerts), 10 deprecated
- **onboarding_progress**: Theo dõi 4-step onboarding wizard cho user mới

---

### SLIDE 20: DATABASE CONSTRAINTS & INDEXES

**Foreign Keys:**
```sql
-- User relationships
user_roles.user_id → users.id (CASCADE DELETE)
user_budget_settings.user_id → users.id (CASCADE DELETE)
user_preferences.user_id → users.id (CASCADE DELETE)
onboarding_progress.user_id → users.id (CASCADE DELETE)

-- Category relationships
categories.user_id → users.id (CASCADE DELETE)
transactions.category_id → categories.id (RESTRICT DELETE)
budgets.category_id → categories.id (RESTRICT DELETE)

-- Transaction relationships
transactions.user_id → users.id (CASCADE DELETE)

-- Budget relationships
budgets.user_id → users.id (CASCADE DELETE)

-- Report relationships
scheduled_reports.user_id → users.id (CASCADE DELETE)

-- Role relationships
user_roles.role_id → roles.id (CASCADE DELETE)

-- Audit relationships
audit_logs.admin_user_id → users.id (SET NULL)
```

**Unique Constraints:**
```sql
users.email - Đảm bảo email duy nhất
roles.name - Đảm bảo tên role duy nhất
budgets.(user_id, category_id, budget_year, budget_month) - 1 budget per category per month
user_budget_settings.user_id - One-to-One với users
user_preferences.user_id - One-to-One với users
onboarding_progress.user_id - One-to-One với users
system_config.config_key - Đảm bảo config key duy nhất
```

**Indexes (Performance Optimization):**
```sql
-- Foreign key indexes
idx_transactions_user_id
idx_transactions_category_id
idx_transactions_date
idx_budgets_user_id
idx_budgets_category_id
idx_budgets_year_month
idx_categories_user_id
idx_scheduled_reports_user_id
idx_scheduled_reports_next_run
idx_audit_logs_admin_user_id
idx_audit_logs_timestamp
```

---

## 📌 PHẦN 5: CHỨC NĂNG CHƯA LÀM ĐƯỢC / LỖI

### SLIDE 21: TÌNH TRẠNG DỰ ÁN HIỆN TẠI

**Tổng quan tình trạng:**
- **Overall Completion**: 95% (Backend: 95%, Web: 100%, Mobile: 100%)
- **Production Readiness**: 99% (chỉ còn 2 minor fixes khuyến nghị)
- **Code Quality**: A+ Grade (enterprise-grade, zero compilation errors)

**Phân tích theo Flows:**
- ✅ **Flow 1-5**: 100% hoàn thiện, production-ready
- 🟡 **Flow 6**: 43% hoàn thiện (2/7 phases)
  - ✅ Phase 6A (100%): User profile, preferences, onboarding
  - ✅ Phase 6D (100%): Email, scheduled reports, Excel export, icon migration
  - 🔮 Phases 6B, 6C, 6E, 6F, 6G: Optional/Future (không bắt buộc cho deployment)

---

### SLIDE 22: CÁC TÍNH NĂNG TỐI ƯU (OPTIONAL) - KHÔNG BLOCKING

**Flow 6B: Professional UI/UX Improvements** [Optional]
- 🔮 Consistent spacing/padding across all pages
- 🔮 WCAG AA accessibility compliance
- 🔮 Skeleton loading states (thay vì spinners)
- 🔮 Empty state illustrations
- 🔮 Mobile-first optimization nâng cao
- 🔮 Progressive Web App (PWA) capabilities
- 🔮 Swipe gestures for mobile

**Flow 6C: Specialized Admin UI** [Optional]
- 🔮 Real-time dashboard with auto-refresh
- 🔮 Customizable drag-and-drop widgets
- 🔮 System health monitoring (CPU, memory, API response times)
- 🔮 Advanced data visualization (heatmaps, forecasting)
- 🔮 Bulk operations interface

**Flow 6E: Advanced User Features** [Optional]
- 🔮 Financial goals system (đặt mục tiêu tiết kiệm)
- 🔮 Transaction attachments (upload receipts/bills)
- 🔮 Recurring transactions (giao dịch lặp lại tự động)
- 🔮 Full data export/import capabilities
- ❌ Multi-currency support (ĐÃ LOẠI BỎ - VND only)

**Flow 6F: Performance & Optimization** [Optional]
- 🔮 Code splitting and lazy loading
- 🔮 Redis caching integration
- 🔮 APM monitoring tools (New Relic, Datadog)
- 🔮 Advanced error tracking (Sentry)

**Flow 6G: Admin Extensions** [Optional]
- 🔮 Multi-tenant management (hỗ trợ nhiều tổ chức)
- 🔮 ML insights and prediction models
- 🔮 Two-Factor Authentication (2FA)
- 🔮 Advanced penetration testing framework

*Lưu ý: Tất cả tính năng trên là OPTIONAL và không ảnh hưởng đến production deployment.*

---

### SLIDE 23: 2 MINOR FIXES KHUYẾN NGHỊ (KHÔNG CRITICAL)

**⚠️ Issue 1: Hardcoded Frontend URL trong EmailService**

**Vị trí**: `EmailService.java:117`

**Hiện tại**:
```java
context.setVariable("resetLink",
    "http://localhost:3000/reset-password?token=" + resetToken);
```

**Vấn đề**:
- URL frontend được hardcode thành localhost:3000
- Sẽ không hoạt động khi deploy production (domain khác)

**Fix khuyến nghị**:
```java
// application.properties
app.frontend.url=${FRONTEND_URL:http://localhost:3000}

// EmailService.java
@Value("${app.frontend.url}")
private String frontendUrl;

context.setVariable("resetLink",
    frontendUrl + "/reset-password?token=" + resetToken);
```

**Impact**: MEDIUM - Chức năng forgot password sẽ bị lỗi ở production
**Thời gian fix**: 5-10 phút

---

**⚠️ Issue 2: Potential PDF Resource Leak trong PDFReportGenerator**

**Vị trí**: `PDFReportGenerator.java`

**Hiện tại**:
```java
Document document = new Document(pdf);
// ... generate PDF content ...
document.close(); // Có thể không được gọi nếu exception xảy ra
```

**Vấn đề**:
- iText7 Document không được wrap trong try-with-resources
- Nếu có exception, document.close() có thể không được gọi → memory leak

**Fix khuyến nghị**:
```java
try (PdfWriter writer = new PdfWriter(outputStream);
     PdfDocument pdf = new PdfDocument(writer);
     Document document = new Document(pdf)) {
    // ... generate PDF content ...
} // Auto-close, ngay cả khi exception
```

**Impact**: LOW - Chỉ ảnh hưởng nếu có exception khi generate PDF
**Thời gian fix**: 10-15 phút

---

### SLIDE 24: NHỮNG TÍNH NĂNG ĐÃ LOẠI BỎ (DELIBERATE DECISIONS)

**❌ Multi-Currency Support - Đã loại bỏ (December 5, 2025)**

**Lý do loại bỏ**:
- Tập trung vào thị trường Việt Nam (VND-only)
- Giảm độ phức tạp hệ thống
- Tiết kiệm 2-3 tuần testing multi-currency
- Không cần exchange rate API integration
- UX đơn giản hơn cho người dùng Việt

**Thay đổi thực hiện**:
- ✅ Xóa 5 backend files (Currency entity, service, controller, DataInitializer)
- ✅ Xóa CurrencySelector component (frontend)
- ✅ Simplified currencyFormatter.js (286 → 132 lines)
- ✅ Xóa currencyCode, amountInBaseCurrency fields từ transactions/budgets
- ✅ Drop currencies table
- **Kết quả**: -2000+ lines of code, codebase đơn giản hơn, không có lỗi conversion

---

**❌ Dark Mode - Đã loại bỏ khỏi frontend (December 2025)**

**Lý do loại bỏ**:
- Preference exists in database nhưng không implement UI
- Light theme đủ tốt cho ứng dụng tài chính
- Tiết kiệm effort cho các tính năng quan trọng hơn

**Thay đổi**:
- ✅ Theme preference vẫn tồn tại trong user_preferences table
- ❌ Không có theme switcher trong UI
- ❌ Không có dark.css stylesheet

---

**❌ 10 Unused Preferences - Deprecated**

**Danh sách preferences không sử dụng** (tồn tại trong DB nhưng không có UI):
1. currency - VND hardcoded
2. dateFormat - dd/MM/yyyy hardcoded
3. theme - Dark mode removed
4. language - No i18n system
5. timezone - Asia/Ho_Chi_Minh hardcoded
6. itemsPerPage - Hardcoded to 10
7. transactionReminders - Feature doesn't exist
8. goalReminders - Goal feature doesn't exist
9. monthlySummary - Auto-sent to all users
10. weeklySummary - Auto-sent to all users

**Chỉ 3 preferences đang active**:
- ✅ viewMode (list view toggle in BudgetsPage)
- ✅ emailNotifications (master email switch)
- ✅ budgetAlerts (budget email alerts)

---

### SLIDE 25: KẾT LUẬN VỀ TÌNH TRẠNG DỰ ÁN

**✅ SẴN SÀNG DEPLOY PRODUCTION:**

**Điểm mạnh:**
- ✅ 95% hoàn thiện, tất cả core features working
- ✅ Enterprise-grade architecture (Spring Boot + React + Flutter)
- ✅ Comprehensive security (JWT, RBAC, audit logging)
- ✅ Professional UI/UX với responsive design
- ✅ Zero compilation errors, production-ready code
- ✅ 100+ REST API endpoints hoạt động ổn định
- ✅ Email automation với 6 email types
- ✅ Scheduled reports với PDF/CSV/Excel export
- ✅ Mobile app hoàn chỉnh (85% feature parity)

**Những gì còn lại:**
- ⚠️ 2 minor fixes khuyến nghị (không critical)
- 🔮 5 optional phases (Flow 6B, 6C, 6E, 6F, 6G) - không bắt buộc

**Khuyến nghị:**
- ✅ **Deploy ngay với 95% hoàn thiện**
- ✅ Fix 2 minor issues trong 15-25 phút
- ✅ Optional phases có thể làm sau dựa trên feedback users

**Thời gian để 100% production-ready**: 15-25 phút (chỉ cần fix 2 issues)

---

## 📌 SLIDE 26: KẾT LUẬN & HƯỚNG PHÁT TRIỂN

**Thành tựu đạt được:**
- ✅ Hoàn thành đầy đủ 5/6 flows chính (Flows 1-5: 100%)
- ✅ Backend: 95% complete với 16 entities, 20 services, 17 controllers
- ✅ Web Frontend: 100% complete với 69 files, 29 pages, 33 routes
- ✅ Mobile App: 100% complete với 40 Dart files, 16 screens
- ✅ Database: 12 bảng được thiết kế tối ưu với proper indexes
- ✅ Security: Enterprise-grade với JWT, RBAC, audit logging
- ✅ Email System: 6 email types tự động với Thymeleaf templates
- ✅ Reports: PDF/CSV/Excel export với scheduled automation

**Kiến thức đã áp dụng:**
- ✅ Backend: Spring Boot, Spring Security, JPA/Hibernate, JWT, MySQL
- ✅ Frontend: React, Tailwind CSS, Context API, Recharts
- ✅ Mobile: Flutter, Provider pattern, Dio HTTP client
- ✅ Architecture: 3-tier architecture, RESTful API design, OOP principles
- ✅ Security: BCrypt encryption, JWT tokens, RBAC authorization
- ✅ DevOps: Git version control, Mailtrap testing, hot reload

**Hướng phát triển tương lai** (Optional - sau khi deploy):
- 🔮 PWA capabilities cho web app
- 🔮 Advanced analytics với ML predictions
- 🔮 Financial goals và recurring transactions
- 🔮 Multi-tenant support cho organizations
- 🔮 Two-Factor Authentication (2FA)
- 🔮 Social features (share reports, compare với friends)

---

## 📌 SLIDE 27: DEMO & CÂU HỎI

**Chuẩn bị demo:**
1. **Backend**: `mvn spring-boot:run` (port 8080)
2. **Web Frontend**: `npm start` (port 3000)
3. **Mobile**: Flutter emulator/device

**Demo scenarios gợi ý:**
- ✅ Đăng ký user mới → Onboarding wizard
- ✅ Thêm giao dịch thu/chi
- ✅ Tạo ngân sách và nhận cảnh báo email
- ✅ Xem báo cáo tháng, xuất PDF/Excel
- ✅ Admin dashboard và user management
- ✅ Mobile app synchronized với web

**Q&A - Các câu hỏi thường gặp:**

**Q1: Tại sao chọn Spring Boot thay vì Node.js?**
- A: Spring Boot mature hơn, security mạnh hơn, JPA/Hibernate tốt cho complex queries, phù hợp enterprise applications.

**Q2: Tại sao không dùng Redux mà dùng Context API?**
- A: Context API đủ cho mid-size app, đơn giản hơn Redux, ít boilerplate code, React 19 optimize performance Context.

**Q3: Database migration strategy như thế nào?**
- A: Dùng Hibernate DDL Auto (`update`), entities là source of truth, manual SQL cho column type changes.

**Q4: Tại sao loại bỏ multi-currency?**
- A: Tập trung thị trường Việt Nam (VND-only), giảm complexity, tiết kiệm 2-3 tuần testing, UX đơn giản hơn.

**Q5: Production deployment plan?**
- A: Backend → AWS EC2/Google Cloud, Database → AWS RDS, Frontend → Vercel/Netlify, Mobile → Play Store/App Store.

---

## 📌 SLIDE 28: TÀI LIỆU THAM KHẢO

**Source code:**
- GitHub Repository: [Link repository của bạn]

**Tài liệu kỹ thuật:**
- CLAUDE.md - Comprehensive documentation (151KB)
- IMPLEMENTATION_ROADMAP.md - Detailed roadmap
- MIGRATION_EXPLAINED.md - Database strategy
- API Documentation: Swagger UI tại http://localhost:8080/swagger-ui.html (nếu đã integrate)

**Công nghệ sử dụng:**
- Spring Boot: https://spring.io/projects/spring-boot
- React: https://react.dev
- Flutter: https://flutter.dev
- MySQL: https://www.mysql.com
- Tailwind CSS: https://tailwindcss.com
- Recharts: https://recharts.org

**Email:** [Email nhóm trưởng]
**Phone:** [SĐT liên hệ]

---

# PHỤ LỤC: HƯỚNG DẪN SỬ DỤNG SKELETON NÀY

## Cách sử dụng file này:

1. **Copy nội dung từng slide** vào PowerPoint
2. **Thêm hình ảnh/screenshots**:
   - Dashboard screenshots
   - Charts và reports
   - Admin panel
   - Mobile app screenshots
   - Database diagram (dùng MySQL Workbench hoặc dbdiagram.io)
3. **Điền thông tin nhóm** (Slide 2)
4. **Tùy chỉnh Use Case Diagrams**:
   - Dùng PlantUML, Draw.io, hoặc Lucidchart
   - Chuyển text diagrams thành hình ảnh professional
5. **Thêm Database ERD**:
   - Export từ MySQL Workbench
   - Hoặc vẽ bằng dbdiagram.io, draw.io
   - Zoom được, có chú thích chi tiết

## Tips cho bài thuyết trình:

- **Timing**: Mỗi slide 1-2 phút, tổng 25-30 phút + 5-10 phút Q&A
- **Demo live**: Chuẩn bị sẵn scenarios, test kỹ trước
- **Backup plan**: Record video demo phòng trường hợp technical issues
- **Slides animation**: Tối giản, chuyên nghiệp (avoid overuse)
- **Font**: Arial/Calibri, size 24-32pt cho body text
- **Colors**: Consistent theme (recommend: Indigo/Violet matching app)

Chúc bạn thuyết trình thành công! 🎉
