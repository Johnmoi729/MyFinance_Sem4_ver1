# SLIDE 11: ADMIN FLOWCHART - LUỒNG HOẠT ĐỘNG QUẢN TRỊ VIÊN

## Loại Flowchart: **ADMIN JOURNEY FLOWCHART** (Sơ đồ hành trình quản trị viên)

---

## 📊 ADMIN FLOWCHART (Text Version - Detailed)

```
                    [START]
                       │
                       ▼
        ┌──────────────────────────────┐
        │  1. ĐĂNG NHẬP VỚI ROLE ADMIN │
        │  • Email: admin@myfinance.com│
        │  • Có role ADMIN             │
        │  • JWT với admin permissions │
        └──────────────┬───────────────┘
                       │
                       ▼
        ┌──────────────────────────────┐
        │  2. TRUY CẬP ADMIN DASHBOARD │
        │  • Tổng quan hệ thống        │
        │  • Key metrics realtime      │
        │  • Quick stats               │
        │     - Tổng users             │
        │     - Tổng transactions      │
        │     - System health          │
        └──────────────┬───────────────┘
                       │
                       ▼
        ┌──────────────────────────────┐
        │  📊 XEM ANALYTICS TỔNG QUAN  │
        │  • Financial metrics         │
        │  • User behavior analytics   │
        │  • Transaction trends        │
        │  • Growth indicators         │
        └──────────────┬───────────────┘
                       │
                       ▼
            ┌──────────┴──────────┐
            │ Tác vụ admin nào?   │
            └──┬────────────────┬──┘
               │                │
    ┌──────────┴───┐    ┌──────▼────────┐
    │              │    │               │
    ▼              ▼    ▼               ▼
┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐
│ USER    │  │ AUDIT   │  │ CONFIG  │  │ ANALYTICS│
│ MGMT    │  │ LOGS    │  │ SYSTEM  │  │ DETAIL   │
└────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘
     │            │            │            │
     └────────────┴────────────┴────────────┘
                  │
                  ▼
        ┌──────────────────────────────┐
        │  3A. QUẢN LÝ NGƯỜI DÙNG      │
        │  • Xem danh sách users       │
        │  • Search & Filter           │
        │  • View user details         │
        └──────────────┬───────────────┘
                       │
                       ▼
            ┌──────────┴──────────┐
            │ Cần thao tác user?  │
            └──┬─────────────┬────┘
           YES │             │ NO
               ▼             │
    ┌──────────────────────┐│
    │ • Activate user      ││
    │ • Deactivate user    ││
    │ • View statistics    ││
    └──────────┬───────────┘│
               │             │
               └─────────────┘
                       │
                       ▼
        ┌──────────────────────────────┐
        │  📝 Thao tác được GHI LOG    │
        │  (Audit trail tự động)       │
        └──────────────┬───────────────┘
                       │
                       ▼
        ┌──────────────────────────────┐
        │  3B. XEM AUDIT LOGS          │
        │  • Xem log hoạt động admin   │
        │  • Filter theo action type   │
        │  • Filter theo thời gian     │
        │  • Search by admin           │
        └──────────────┬───────────────┘
                       │
                       ▼
            ┌──────────┴──────────┐
            │ Cần backup logs?    │
            └──┬─────────────┬────┘
           YES │             │ NO
               ▼             │
    ┌──────────────────────┐│
    │ • Export JSON        ││
    │ • Download logs      ││
    └──────────────────────┘│
               │             │
               └─────────────┘
                       │
                       ▼
        ┌──────────────────────────────┐
        │  3C. CẤU HÌNH HỆ THỐNG       │
        │  • Xem system configs        │
        │  • Feature flags             │
        │  • Maintenance mode          │
        │  • System settings           │
        └──────────────┬───────────────┘
                       │
                       ▼
            ┌──────────┴──────────┐
            │ Cần thay đổi config?│
            └──┬─────────────┬────┘
           YES │             │ NO
               ▼             │
    ┌──────────────────────┐│
    │ • Update config      ││
    │ • Toggle feature     ││
    │ • Enable maintenance ││
    └──────────┬───────────┘│
               │             │
               │ (Logged)    │
               └─────────────┘
                       │
                       ▼
        ┌──────────────────────────────┐
        │  3D. PHÂN TÍCH CHI TIẾT      │
        │  • Financial analytics       │
        │  • User engagement metrics   │
        │  • Category-wise breakdown   │
        │  • System performance        │
        └──────────────┬───────────────┘
                       │
                       ▼
        ┌──────────────────────────────┐
        │  4. GIÁM SÁT SYSTEM HEALTH   │
        │  • Check database status     │
        │  • Monitor API performance   │
        │  • View error rates          │
        │  • Check email service       │
        └──────────────┬───────────────┘
                       │
                       ▼
            ┌──────────┴──────────┐
            │ Có vấn đề cần xử lý?│
            └──┬─────────────┬────┘
           YES │             │ NO
               ▼             │
    ┌──────────────────────┐│
    │ • Investigate issue  ││
    │ • Take action        ││
    │ • Document solution  ││
    └──────────┬───────────┘│
               │             │
               └─────────────┘
                       │
                       ▼
        ┌──────────────────────────────┐
        │  5. DỌN DẸP & BẢO TRÌ        │
        │  • Cleanup old audit logs    │
        │  • Check database size       │
        │  • Review user activity      │
        └──────────────┬───────────────┘
                       │
                       ▼
            ┌──────────┴──────────┐
            │ Tiếp tục giám sát?  │
            └──┬─────────────┬────┘
           YES │             │ NO
               │             ▼
               │         [LOGOUT]
               │
               └──────► Quay lại bước 2
                        (Admin Dashboard)


═══════════════════════════════════════
     VÒNG LẶP GIÁM SÁT HÀNG NGÀY
═══════════════════════════════════════
```

---

## 📝 PHIÊN BẢN ĐƠN GIẢN (Cho slide PowerPoint - RECOMMENDED)

```
        [ADMIN LOGIN]
           │
           ▼
    ┌─────────────┐
    │ 1. Admin    │───► 📊 Dashboard Overview
    │   Dashboard │     (System Metrics)
    └──────┬──────┘
           │
           ├──────────┬──────────┬──────────┐
           │          │          │          │
           ▼          ▼          ▼          ▼
    ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
    │ 2. User  │ │ 3. Audit │ │ 4. System│ │ 5. Detail│
    │   Mgmt   │ │   Logs   │ │  Config  │ │ Analytics│
    └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘
         │            │            │            │
         │            │            │            │
         ▼            ▼            ▼            ▼
    Activate/    View & Filter  Configure    Financial
    Deactivate   Export JSON    Settings     Metrics
         │            │            │            │
         └────────────┴────────────┴────────────┘
                      │
                      ▼
              ┌───────────────┐
              │ Auto Audit    │───► 📝 Logged
              │ Logging       │
              └───────┬───────┘
                      │
                      ▼
              ┌───────────────┐
              │ 6. System     │───► ⚠️ Handle Issues
              │    Health     │
              │    Monitor    │
              └───────┬───────┘
                      │
                      ▼
              ┌───────────────┐
              │ 7. Cleanup &  │───► 💾 Backup
              │    Maintenance│
              └───────┬───────┘
                      │
                      │ (Vòng lặp giám sát)
                      └───────► Quay lại Dashboard
```

---

## 🎨 LAYOUT GỢI Ý CHO SLIDE 11

### **OPTION 1: 2 Flowcharts Side-by-Side (1 Slide)**

```
┌─────────────────────────────────────────────────────────────┐
│                   SLIDE 11: LUỒNG HOẠT ĐỘNG                 │
├──────────────────────────┬──────────────────────────────────┤
│                          │                                  │
│   USER JOURNEY           │   ADMIN JOURNEY                  │
│   (Người dùng)           │   (Quản trị viên)                │
│                          │                                  │
│   [START]                │   [ADMIN LOGIN]                  │
│      ↓                   │      ↓                           │
│   Đăng ký                │   Dashboard                      │
│      ↓                   │      ↓                           │
│   Onboarding             │   ┌───┬───┬───┐                 │
│      ↓                   │   │   │   │   │                 │
│   Ghi nhận giao dịch     │   User Audit Config Analytics   │
│      ↓                   │      ↓                           │
│   Lập ngân sách          │   System Health                  │
│      ↓                   │      ↓                           │
│   Xem báo cáo            │   Cleanup & Maintain             │
│      ↓                   │      ↓                           │
│   Email định kỳ          │   (Vòng lặp)                     │
│      ↓                   │                                  │
│   (Vòng lặp)             │                                  │
│                          │                                  │
└──────────────────────────┴──────────────────────────────────┘
```

### **OPTION 2: 2 Slides Riêng (RECOMMENDED)**

**Slide 11A: User Journey** (như đã có)
**Slide 11B: Admin Journey** (slide mới này)

**Lý do khuyến nghị tách riêng:**
- ✅ Dễ giải thích (không bị quá tải thông tin)
- ✅ Audience tập trung tốt hơn
- ✅ Flowcharts đủ lớn để đọc rõ
- ✅ Thời gian thuyết trình thoải mái hơn (40s/slide thay vì 1'20"/slide)

---

## 🎨 KÝ HIỆU VÀ MÀU SẮC

### **Admin Flowchart - Color Scheme:**

| Element | Màu | Mục đích |
|---------|-----|----------|
| **Admin Login & Dashboard** | `#3730A3` (Indigo-800) | Đậm hơn User flow |
| **Admin Actions** | `#F59E0B` (Amber-500) | Activate/Deactivate/Configure |
| **Critical Actions** | `#EF4444` (Red-500) | Maintenance mode, Cleanup |
| **Success/Logged** | `#10B981` (Green-500) | Audit logging, Success states |
| **Analytics** | `#8B5CF6` (Violet-500) | Reports và analytics |
| **Decision Diamonds** | `#F59E0B` (Amber-500) | Các điểm quyết định |

### **Icons cho Admin Flow:**

```
👤🔐 Admin Login
📊 Dashboard Overview
👥 User Management
📝 Audit Logs
⚙️ System Configuration
📈 Detailed Analytics
🔍 System Health Monitor
🧹 Cleanup & Maintenance
💾 Backup/Export
⚠️ Issue Handling
```

---

## 📊 SO SÁNH USER vs ADMIN FLOW

| Đặc điểm | User Flow | Admin Flow |
|----------|-----------|------------|
| **Mục đích chính** | Quản lý tài chính cá nhân | Giám sát & quản trị hệ thống |
| **Kiểu cấu trúc** | Sequential (tuần tự) | Branching (nhánh song song) |
| **Số bước chính** | 6 bước | 7 bước (4 nhánh song song) |
| **Decision points** | 2-3 | 4-5 |
| **Vòng lặp** | Ghi nhận giao dịch | Dashboard monitoring |
| **Automated actions** | Email alerts, Reports | Audit logging (mọi action) |
| **Complexity** | Medium | High |
| **Frequency** | Daily (hàng ngày) | Periodic (định kỳ giám sát) |
| **Color theme** | Light Indigo | Dark Indigo/Amber |

---

## 💡 TIPS VẼ ADMIN FLOWCHART

### **1. Branching Layout (Nhánh song song):**

Khác với User flow tuần tự, Admin flow có **4 nhánh song song** từ Dashboard:

```
            Dashboard
                │
        ┌───────┼───────┬───────┐
        │       │       │       │
        ▼       ▼       ▼       ▼
      User    Audit   Config  Analytics
      Mgmt    Logs
```

**Vẽ như cây phân nhánh** để thể hiện admin có nhiều lựa chọn tác vụ.

### **2. Highlight Audit Logging:**

Mỗi admin action (activate, deactivate, config) đều có:
- **Đường mũi tên nhỏ** đến "📝 Auto Audit Log"
- Hoặc **note text** "(Logged)" bên cạnh action

Để nhấn mạnh tính năng **audit trail tự động**.

### **3. Loop Back Mechanism:**

Admin có **vòng lặp lớn** quay về Dashboard:
```
Dashboard → Tasks → System Health → Cleanup → Dashboard
```

Thể hiện admin **giám sát liên tục**, không như user chỉ ghi nhận giao dịch.

### **4. Decision Points:**

Admin flow có nhiều quyết định:
- Cần thao tác user?
- Cần backup logs?
- Cần thay đổi config?
- Có vấn đề cần xử lý?
- Tiếp tục giám sát?

Dùng **hình thoi** (diamond) cho các decision points.

---

## 🎯 SCRIPT DIỄN THUYẾT (40 giây)

> "Hệ thống cũng có luồng hoạt động dành riêng cho admin. Admin đăng nhập với role đặc biệt và truy cập dashboard tổng quan với các metrics realtime.
>
> Từ dashboard, admin có thể thực hiện 4 nhóm tác vụ song song: Một là quản lý người dùng với tìm kiếm, lọc, kích hoạt hoặc vô hiệu hóa tài khoản. Hai là xem audit logs để theo dõi mọi hoạt động admin. Ba là cấu hình hệ thống như feature flags và maintenance mode. Bốn là xem analytics chi tiết về tài chính toàn hệ thống.
>
> Đặc biệt, mọi thao tác quan trọng của admin đều được ghi log tự động để đảm bảo accountability. Admin cũng có thể export logs ra JSON để backup, cleanup logs cũ, giám sát system health, và xử lý các vấn đề nếu phát hiện. Sau đó quay lại dashboard để tiếp tục vòng lặp giám sát."

---

## 🛠️ CÔNG CỤ VẼ (Same as User Flow)

### **Top 3:**

1. **Draw.io** - https://app.diagrams.net/ ⭐⭐⭐⭐⭐
   - FREE, web-based
   - Flowchart templates
   - Export PNG/SVG/PDF

2. **PowerPoint** - Built-in ⭐⭐⭐⭐
   - Insert → Shapes → Flowchart
   - SmartArt → Process
   - Easy alignment tools

3. **Lucidchart** - https://lucid.app/ ⭐⭐⭐⭐
   - Professional templates
   - Real-time collaboration
   - Free plan: 3 documents

---

## 📐 KÍCH THƯỚC KHUYẾN NGHỊ

### **Nếu vẽ 2 flowcharts trên 1 slide (16:9):**

- **Canvas**: 1920 x 1080 px
- **User Flow** (bên trái): 800 x 900 px area
- **Admin Flow** (bên phải): 800 x 900 px area
- **Gap giữa 2 flows**: 80-100 px
- **Title area**: 200 px from top
- **Margin**: 60 px all sides
- **Font size**:
  - Title: 32pt
  - Box text: 16-18pt
  - Arrow labels: 12-14pt

### **Nếu tách thành 2 slides riêng (RECOMMENDED):**

- **Canvas**: 1920 x 1080 px
- **Flowchart area**: 1600 x 900 px (centered)
- **Boxes**: 350 x 80 px each
- **Spacing**: 60-80 px between boxes
- **Font size**: 18-20pt (lớn hơn vì có nhiều không gian)

---

## 🎨 DEMO VISUAL (Mô tả cho artist vẽ)

```
┌─────────────────────────────────────────────────┐
│                                                 │
│         HÀNH TRÌNH QUẢN TRỊ VIÊN ADMIN          │
│                                                 │
│                [ADMIN LOGIN]                    │
│                 👤🔐                             │
│                      ↓                          │
│         ┌────────────────────────┐              │
│         │  Admin Dashboard       │              │
│         │  📊 System Overview    │              │
│         └──────┬─────────────────┘              │
│                │                                │
│        ┌───────┼───────┬────────┐               │
│        │       │       │        │               │
│        ▼       ▼       ▼        ▼               │
│     ┌────┐  ┌────┐  ┌────┐  ┌────┐             │
│     │User│  │Audit│ │Conf│  │Analy│            │
│     │Mgmt│  │Logs│  │ig  │  │tics│             │
│     └─┬──┘  └─┬──┘  └─┬──┘  └─┬──┘             │
│       │       │       │       │                 │
│       └───────┴───────┴───────┘                 │
│                 │                               │
│                 ▼                               │
│         ┌────────────────┐                      │
│         │ Actions        │                      │
│         │ (Logged 📝)    │                      │
│         └────────┬───────┘                      │
│                  ▼                              │
│         ┌────────────────┐                      │
│         │ System Health  │ ──YES──► ⚠️ Handle  │
│         │ Issues?        │                      │
│         └────────┬───────┘                      │
│             NO   │                              │
│                  ▼                              │
│         ┌────────────────┐                      │
│         │ Cleanup &      │ ───► 💾 Backup      │
│         │ Maintenance    │                      │
│         └────────┬───────┘                      │
│                  │                              │
│                  │ (Loop)                       │
│                  └────────► Back to Dashboard   │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## 📚 PHẦN BỔ SUNG: Admin Use Cases Chi Tiết

### **USE CASE 1: User Management**

```
Tác nhân: Admin
Tiền điều kiện: Admin đã login
Luồng chính:
1. Admin truy cập User Management
2. Hệ thống hiển thị danh sách users với pagination
3. Admin search/filter users
4. Admin chọn user cần thao tác
5. Admin activate hoặc deactivate
6. Hệ thống ghi audit log
7. Hệ thống hiển thị thông báo thành công
```

### **USE CASE 2: Audit Log Management**

```
Tác nhân: Admin
Tiền điều kiện: Admin đã login
Luồng chính:
1. Admin truy cập Audit Logs
2. Hệ thống hiển thị logs với filter options
3. Admin filter theo action type/time
4. Admin review logs
5. (Optional) Admin export logs to JSON
6. (Optional) Admin cleanup old logs (>90 days)
```

### **USE CASE 3: System Configuration**

```
Tác nhân: Admin
Tiền điều kiện: Admin đã login
Luồng chính:
1. Admin truy cập System Config
2. Hệ thống hiển thị các config hiện tại
3. Admin chọn config cần sửa
4. Admin update value
5. Hệ thống validate
6. Hệ thống ghi audit log
7. Hệ thống apply config mới
```

---

## ✅ TÓM TẮT

**Flowchart này là**: **Admin Journey Flowchart** (Sơ đồ hành trình quản trị viên)

**7 bước chính**:
1. **Admin Login** - Đăng nhập với role ADMIN
2. **Admin Dashboard** - Tổng quan hệ thống
3. **4 Tác vụ song song**:
   - User Management (👥 quản lý users)
   - Audit Logs (📝 xem & export logs)
   - System Config (⚙️ cấu hình hệ thống)
   - Detailed Analytics (📈 analytics chi tiết)
4. **System Health Monitor** - Giám sát sức khỏe hệ thống
5. **Issue Handling** - Xử lý vấn đề (nếu có)
6. **Cleanup & Maintenance** - Dọn dẹp và bảo trì
7. **Loop Back** - Quay lại dashboard giám sát

**Đặc điểm nổi bật**:
- ✅ **Branching structure** (4 nhánh song song từ Dashboard)
- ✅ **Auto audit logging** (mọi admin action được log tự động)
- ✅ **Export capabilities** (JSON backup cho audit logs)
- ✅ **Continuous monitoring loop** (vòng lặp giám sát liên tục)
- ✅ **Darker color scheme** (để phân biệt với User flow)
- ✅ **More decision points** (4-5 decisions vs 2-3 của User)

**Cách trình bày khuyến nghị**:
- ⭐ **Option A**: 2 slides riêng (11A: User, 11B: Admin) - RECOMMENDED
- Option B: 1 slide với 2 flowcharts side-by-side (nếu muốn so sánh trực tiếp)

**Thời gian vẽ**: 10-15 phút với Draw.io hoặc PowerPoint

Chúc bạn vẽ Admin flowchart thành công! 🎨🔐
