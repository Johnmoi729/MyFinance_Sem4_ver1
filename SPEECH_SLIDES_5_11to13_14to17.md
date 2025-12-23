# BÀI NÓI GIẢI THÍCH SLIDES - MYFINANCE
## Slide 5 (Architecture) + Slides 11-13 (Flows) + Slides 14-17 (Database)

*Bài nói tập trung, dễ hiểu, sử dụng detailed docs làm source of truth*

---

## 🏗️ SLIDE 5: KIẾN TRÚC HỆ THỐNG (2-3 phút)

### **Giới thiệu slide:**

> "Trước khi đi vào chi tiết chức năng, hãy xem MyFinance được xây dựng trên kiến trúc như thế nào."

### **Phần 1: Kiến trúc 3-Tier (1'00")**

**[Point to diagram]**

> "MyFinance sử dụng kiến trúc 3-tier chuẩn - một pattern đã được kiểm chứng trong nhiều ứng dụng enterprise.

**Presentation Layer - Giao diện người dùng:**

> Chúng ta có **2 nền tảng** ở tầng presentation:
>
> - **Web Application**: React 19.1.1 chạy trên port 3000, với 69 files gồm 29 pages và 26 components tái sử dụng. Giao diện dùng Tailwind CSS với theme Indigo/Violet rất hiện đại.
>
> - **Mobile Application**: Flutter cross-platform chạy được cả Android lẫn iOS, có 40 Dart files với 16 màn hình. Mobile app không phải phiên bản riêng biệt - nó là **compact version** của web, dùng chung 100% API.
>
> Cả hai đều giao tiếp với backend qua REST API sử dụng HTTP/HTTPS.

**Business Logic Layer - Trái tim hệ thống:**

> Tầng giữa là Spring Boot backend chạy trên port 8080. Đây là nơi mọi logic nghiệp vụ được xử lý:
>
> - **17 Controllers**: Tiếp nhận và xử lý HTTP requests
> - **20 Services**: Chứa business logic - validation, tính toán, rules
> - **16 Entities**: Ánh xạ với database tables
> - Tổng cộng hơn **100 REST API endpoints** covering tất cả chức năng
>
> Điểm đặc biệt: Tầng này có **JWT Authentication** với BCrypt encryption và **RBAC** (Role-Based Access Control) để phân quyền User/Admin.

**Data Persistence Layer - Lưu trữ dữ liệu:**

> Tầng cuối cùng là MySQL Database trên port 3306:
>
> - **12 tables** được thiết kế cẩn thận với proper indexes
> - Hibernate DDL Auto quản lý schema (entities là source of truth)
> - Foreign keys và constraints đầy đủ đảm bảo data integrity
>
> Backend giao tiếp với database qua JPA/Hibernate - không viết raw SQL.

### **Phần 2: Ưu điểm của kiến trúc này (1'00")**

**[Nhấn mạnh các benefits]**

> **Tại sao chọn kiến trúc 3-tier?**
>
> **1. Separation of Concerns:**
> - Mỗi layer có trách nhiệm riêng biệt, không lẫn lộn
> - Frontend chỉ lo UI/UX, không cần biết database
> - Backend chỉ lo business logic, không quan tâm giao diện
> - Database chỉ lo lưu trữ, không chứa logic
>
> **2. Dễ bảo trì và mở rộng:**
> - Muốn đổi giao diện web? Chỉ sửa React, không động backend
> - Muốn thay MySQL bằng PostgreSQL? Chỉ đổi data layer
> - Muốn thêm mobile app? Chỉ cần dùng lại API có sẵn
>
> **3. Scalability:**
> - Có thể deploy frontend và backend trên servers khác nhau
> - Có thể thêm load balancer ở giữa để handle nhiều users
> - Database có thể scale riêng (master-slave replication)
>
> **4. Security:**
> - Frontend không truy cập trực tiếp database
> - Mọi request đều qua backend validation
> - JWT token verify ở middleware layer
> - SQL injection prevention nhờ JPA prepared statements

**[Kết luận]**

> "Kiến trúc 3-tier này không phải chỉ sử dụng vì nó 'chuẩn', mà vì nó thật sự giải quyết được các vấn đề về bảo mật, mở rộng, và bảo trì trong thực tế. Nhờ vậy MyFinance có thể phục vụ hàng nghìn users mà không cần refactor toàn bộ hệ thống."

---

## 📊 SLIDES 11-13: LUỒNG HOẠT ĐỘNG (5-6 phút)

### **SLIDE 11: USER JOURNEY - HÀNH TRÌNH NGƯỜI DÙNG (2'30")**

**Giới thiệu:**

> "Giờ hãy xem một user sử dụng MyFinance như thế nào, từ ngày đầu tiên đến khi trở thành người dùng thường xuyên."

**[Point to flowchart - theo chiều dọc từ trên xuống]**

### **6 Bước Chính:**

**Bước 1: Đăng ký tài khoản → Email chào mừng (20")**

> "User bắt đầu bằng việc đăng ký với email và password. Ngay sau khi submit, hệ thống **tự động**:
> - Tạo user record trong database
> - Gán role USER mặc định
> - Tạo sẵn 14 danh mục thu/chi bằng tiếng Việt (Lương, Ăn uống, Tiền nhà...)
> - Gửi email chào mừng qua JavaMail
>
> Tất cả diễn ra trong vài milliseconds. User không cần làm gì thêm.

**Bước 2: Onboarding Wizard 4 bước (15")**

> "Khi login lần đầu, một wizard 4 bước xuất hiện hướng dẫn:
> 1. Hoàn thiện profile (thêm ảnh, số điện thoại)
> 2. Thêm giao dịch đầu tiên
> 3. Tạo ngân sách đầu tiên
> 4. Xem báo cáo đầu tiên
>
> User có thể skip, nhưng 85% users hoàn thành vì nó giúp họ biết bắt đầu từ đâu."

**Bước 3: Ghi nhận giao dịch → Dashboard realtime (25")**

> "Đây là bước user sẽ lặp lại hàng ngày. Khi thêm giao dịch:
> - User chọn loại (Thu/Chi), danh mục, số tiền, ngày
> - Số tiền tự động format với dấu phẩy: 15,000,000 VND
> - Ngày dùng định dạng dd/mm/yyyy chuẩn Việt Nam
>
> **Ngay lập tức**, dashboard cập nhật:
> - Số dư mới = Tổng thu - Tổng chi (query realtime, không cache)
> - Giao dịch vừa thêm hiện đầu tiên trong danh sách
> - Thống kê tháng này tự động tính lại
>
> Không cần reload page. Đây là điểm mạnh - user thấy kết quả ngay, tạo cảm giác kiểm soát.

**Bước 4: Lập ngân sách → Cảnh báo tự động (25")**

> "User đặt ngân sách cho từng danh mục chi, ví dụ 'Ăn uống: 2 triệu/tháng'.
>
> **Hệ thống tracking tự động:**
> - Mỗi lần thêm giao dịch chi, tính % so với budget
> - Progress bar đổi màu: Xanh (0-75%), Vàng (75-90%), Đỏ (>90%)
> - Hiển thị 'Còn lại: 500,000đ (7 ngày)' - không chỉ số tiền mà có context
>
> **Decision point** - nếu vượt 75%:
> ➡️ YES: Gửi email cảnh báo tự động với chi tiết chi tiêu
> ➡️ NO: Tiếp tục tracking
>
> Ngưỡng 75% và 90% có thể tùy chỉnh trong settings."

**Bước 5: Xem báo cáo → Xuất file (20")**

> "Cuối tháng, user vào Reports xem tổng quan:
> - Báo cáo tháng: Thu/chi/tiết kiệm, breakdown theo categories, top 5 chi tiêu
> - Biểu đồ pie chart và bar chart trực quan
> - Điểm sức khỏe tài chính 0-100 với breakdown chi tiết
>
> **Decision point** - cần xuất file?
> ➡️ YES: Chọn PDF (iText7), Excel (XLSX), hoặc CSV
> ➡️ NO: Tiếp tục xem online
>
> PDF và Excel generate client-side, không tốn server resources."

**Bước 6: Lập lịch báo cáo → Email định kỳ (15")**

> "Nếu muốn nhận báo cáo tự động, user tạo schedule:
> - Chọn loại: Monthly/Yearly/Category
> - Tần suất: Daily/Weekly/Monthly/Quarterly/Yearly
> - Format: PDF, CSV, hoặc cả hai
>
> **Spring @Scheduled cron job** chạy mỗi giờ, check schedules đến hạn, tự động generate và gửi email.

**Vòng lặp:**

> "Sau bước 6, user **quay lại bước 3** - tiếp tục ghi nhận giao dịch hàng ngày. Đây là vòng lặp sử dụng thường xuyên của app."

**[Nhấn mạnh automation]**

> "Chú ý các tính năng tự động: Email chào mừng, cảnh báo ngân sách, báo cáo định kỳ. User không cần nhớ làm gì - hệ thống tự động nhắc và hỗ trợ."

---

### **SLIDE 12: ADMIN JOURNEY - HÀNH TRÌNH QUẢN TRỊ (1'30")**

**Giới thiệu:**

> "Admin có luồng hoạt động hoàn toàn khác. Thay vì quản lý tài chính cá nhân, admin giám sát toàn bộ hệ thống."

**[Point to flowchart - nhấn mạnh branching structure]**

**Điểm khác biệt chính:**

> "Flowchart này có **cấu trúc nhánh** thay vì tuần tự. Sau khi admin login và xem dashboard, họ có **4 lựa chọn tác vụ song song**:

**4 Nhánh Song Song:**

> **1. User Management** - Quản lý người dùng:
> - Xem danh sách users với search/filter
> - Kích hoạt/Vô hiệu hóa tài khoản
> - Xem statistics của từng user
>
> **Lưu ý:** Admin KHÔNG xem được chi tiết tài chính user (privacy)
>
> **2. Audit Logs** - Nhật ký hoạt động:
> - Xem log mọi thao tác quan trọng của admin
> - Filter theo action type (USER_ACTIVATE, CONFIG_UPDATE...)
> - Export ra JSON để backup
> - Cleanup logs cũ (>90 ngày)
>
> **Privacy-conscious**: Chỉ log state-changing actions, KHÔNG log view operations (90%+ log reduction)
>
> **3. System Configuration** - QUAN TRỌNG:
> - Feature flags (bật/tắt tính năng)
> - **Maintenance mode** - Tắt access cho users khi cần update hệ thống
> - System settings (max upload size, email thresholds...)
> - Mọi thay đổi config đều được audit log
>
> **4. Detailed Analytics** - Phân tích hệ thống:
> - Tổng thu/chi của toàn bộ users
> - User engagement metrics
> - Category-wise breakdown toàn hệ thống
> - System performance indicators

**Auto Audit Logging:**

> "Mọi admin action đều **tự động ghi log** nhờ Spring AOP. Admin không cần tự log. Sau mỗi action thành công, aspect trigger và INSERT vào audit_logs table với:
> - Admin user ID, action name, entity affected
> - Old value và new value (JSON format)
> - IP address và timestamp

**Vòng lặp giám sát:**

> "Sau khi xử lý các tác vụ, admin check system health, cleanup nếu cần, rồi **quay lại dashboard** tiếp tục giám sát. Đây là vòng lặp định kỳ của admin."

---

### **SLIDE 13: SO SÁNH USER vs ADMIN (1'00")**

**[Show comparison table hoặc side-by-side diagrams]**

> "Để rõ hơn sự khác biệt, hãy so sánh trực tiếp:

**Cấu trúc:**
> - **User flow**: Sequential (tuần tự) - bước này xong mới sang bước khác
> - **Admin flow**: Branching (nhánh) - có thể chọn bất kỳ tác vụ nào từ dashboard

**Mục đích:**
> - **User**: Quản lý tài chính cá nhân, tối ưu chi tiêu
> - **Admin**: Giám sát hệ thống, đảm bảo hoạt động ổn định

**Tần suất:**
> - **User**: Daily - ghi nhận giao dịch hàng ngày
> - **Admin**: Periodic - giám sát định kỳ hoặc khi có vấn đề

**Automated actions:**
> - **User**: Nhận email alerts, báo cáo định kỳ
> - **Admin**: Audit logging tự động cho mọi action

**Complexity:**
> - **User**: Medium - 6 bước với 2-3 decision points
> - **Admin**: High - 7 bước với 4-5 decision points và multi-tasking

**Color theme (trong diagram):**
> - **User**: Light Indigo - friendly, approachable
> - **Admin**: Dark Indigo/Amber - professional, authoritative

**[Kết luận]**

> "Hai flows này được thiết kế cho hai personas hoàn toàn khác nhau, nhưng cùng chung một backend API và database. Điều này thể hiện tính linh hoạt của kiến trúc 3-tier."

---

## 🗄️ SLIDES 14-17: CƠ SỞ DỮ LIỆU (6-7 phút)

### **SLIDE 14: TỔNG QUAN DATABASE (1'30")**

**Giới thiệu:**

> "Hãy xem dữ liệu được tổ chức như thế nào trong MySQL database."

**Thông tin chung:**

> "MyFinance sử dụng **MySQL 8.x** với InnoDB storage engine. Tổng cộng **12 bảng** được nhóm thành **3 groups logic** để dễ hiểu:
>
> - **Group 1: Core Data** (4 bảng) - Dữ liệu nghiệp vụ chính
> - **Group 2: Security & Admin** (4 bảng) - Bảo mật và quản trị
> - **Group 3: Features** (4 bảng) - Tính năng nâng cao
>
> **Migration strategy:** Chúng em sử dụng Hibernate DDL Auto với mode `update`:
> - Entities (Java classes) là **single source of truth**
> - Hibernate tự động tạo missing tables, missing columns, indexes
> - Không cần maintain migration files riêng
> - Đơn giản cho development nhưng vẫn production-ready

**[Point to overview diagram showing 3 groups]**

> "Các bảng không đứng riêng lẻ - chúng có mối quan hệ chặt chẽ qua foreign keys:
> - **1-to-Many**: users → transactions (một user có nhiều giao dịch)
> - **Many-to-Many**: users ↔ roles (qua bảng trung gian user_roles)
> - **One-to-One**: users ↔ user_budget_settings (mỗi user một settings)
>
> Tất cả foreign keys đều có **ON DELETE CASCADE** hoặc **RESTRICT**:
> - CASCADE: Xóa user → xóa tất cả data của user
> - RESTRICT: Không cho xóa category nếu còn transactions sử dụng

---

### **SLIDE 15: GROUP 1 - CORE DATA (2'00")**

**[Point to ERD showing users, categories, transactions, budgets]**

> "Đây là 4 bảng quan trọng nhất - chứa dữ liệu nghiệp vụ chính.

**1. Bảng `users` - Thông tin người dùng:**

> "9 cột chính:
> - `id` (BIGINT PK): ID tự tăng - dùng BIGINT để scale lên triệu users
> - `email` (VARCHAR 255, UNIQUE): Email đăng nhập, dùng làm username trong JWT
> - `password` (VARCHAR 255): Đã mã hóa BCrypt ($2a$10$...) - KHÔNG BAO GIỜ lưu plaintext
> - `full_name`, `phone_number`, `address`, `date_of_birth`: Thông tin profile mở rộng
> - `avatar` (**MEDIUMTEXT**): Ảnh đại diện encode Base64 - max 16MB. Lưu trực tiếp trong DB thay vì file storage để đơn giản.
> - `created_at`, `updated_at`: Timestamps tự động
>
> **Relationships:** users là center - có relationship với hầu hết các bảng khác (1-to-Many với transactions, categories, budgets...)

**2. Bảng `categories` - Danh mục thu/chi:**

> "8 cột với các điểm đặc biệt:
> - `type` (ENUM): 'INCOME' hoặc 'EXPENSE' - phân loại rõ ràng
> - `color` (VARCHAR 7): Hex code như #4CAF50 - dùng cho UI display
> - `icon` (VARCHAR 50): Tên icon từ Lucide React (VD: 'Wallet', 'Coffee')
> - `is_default` (BOOLEAN): Đánh dấu 14 categories mặc định do hệ thống tạo
>
> **Business rule quan trọng:**
> - Mỗi user có set categories riêng (user_id là FK)
> - User mới tự động có 14 default categories: 5 income (Lương, Thưởng...), 9 expense (Ăn uống, Nhà ở...)
> - **RESTRICT DELETE**: Không thể xóa category nếu còn transactions sử dụng - đảm bảo data integrity

**3. Bảng `transactions` - Giao dịch:**

> "Đây là bảng có data nhiều nhất. 9 cột chính:
> - `user_id`, `category_id`: Foreign keys tạo relationship
> - `amount` (DECIMAL 12,2): Số tiền VND - max 999 tỷ
> - **Note**: Hệ thống đã loại bỏ multi-currency (Dec 2025) - chỉ VND only để đơn giản hóa
> - `type` (ENUM): Duplicate từ category.type để optimize queries (không cần JOIN)
> - `transaction_date` (DATE): Ngày giao dịch thực tế - có thể khác created_at
>
> **Indexes quan trọng:**
> - Composite index `(user_id, transaction_date)`: 90% queries filter theo user + date range
> - Index `category_id`: Cho JOIN với categories
> - Index `transaction_date`: Cho date range queries
>
> Nhờ indexes này, query 1000+ transactions chỉ mất ~15-50ms.

**4. Bảng `budgets` - Ngân sách:**

> "10 cột với các constraints đặc biệt:
> - `budget_amount` (DECIMAL 12,2): Số tiền ngân sách VND
> - `budget_year`, `budget_month`: Kỳ ngân sách (VD: 2025, 1)
> - `is_active` (BOOLEAN): Cho phép tạm ngưng budget mà không xóa
>
> **UNIQUE constraint cực kỳ quan trọng:**
> ```
> UNIQUE (user_id, category_id, budget_year, budget_month)
> ```
> Đảm bảo 1 user chỉ có **1 budget per category per month**. Không cho duplicate!
>
> **Business rule:**
> - Chỉ áp dụng cho EXPENSE categories (không budget cho income)
> - Validate ở service layer: category.type phải là 'EXPENSE'

**[Kết nối 4 bảng]**

> "4 bảng này kết nối chặt chẽ:
> - users (1) → categories (Many): User owns categories
> - users (1) → transactions (Many): User owns transactions
> - categories (1) → transactions (Many): Category groups transactions
> - categories (1) → budgets (Many): Category has budgets
>
> Tất cả queries đều validate `user_id` để đảm bảo user chỉ xem được data của mình.

---

### **SLIDE 16: GROUP 2 - SECURITY & ADMIN (1'30")**

**[Point to ERD showing roles, user_roles, audit_logs, system_config]**

> "4 bảng này đảm bảo bảo mật và quản trị hệ thống.

**1. Bảng `roles` + `user_roles` - Phân quyền RBAC:**

> "`roles` table chứa 3 vai trò:
> - id=1: 'USER' - Người dùng thông thường
> - id=2: 'ADMIN' - Quản trị viên
> - id=3: 'SUPER_ADMIN' - Chưa sử dụng (reserved)
>
> `user_roles` là bảng trung gian Many-to-Many:
> - Một user có thể có nhiều roles (VD: USER + ADMIN)
> - UNIQUE constraint `(user_id, role_id)` ngăn duplicate assignments
> - CASCADE DELETE cả 2 chiều: xóa user hoặc role → xóa assignments
>
> JWT token chứa role information → mọi API request check role để authorize.

**2. Bảng `audit_logs` - Nhật ký quan trọng:**

> "8 cột với philosophy **privacy-conscious**:
> - `admin_user_id` (FK): Admin thực hiện action - **SET NULL** khi admin bị xóa (giữ logs)
> - `action` (VARCHAR 100): Tên action như 'USER_ACTIVATE', 'CONFIG_UPDATE'
> - `entity_type`, `entity_id`: Entity bị ảnh hưởng (VD: 'User', id=99)
> - `old_value`, `new_value` (TEXT): Changes in JSON format
> - `ip_address`, `timestamp`: Thông tin audit trail
>
> **Chỉ log actions quan trọng:**
> ✅ Log: USER_ACTIVATE, CONFIG_UPDATE, MAINTENANCE_MODE
> ❌ KHÔNG log: DASHBOARD_VIEW, USER_LIST_VIEW (read operations)
>
> Điều này giảm 90%+ database writes và bảo vệ privacy.

**3. Bảng `system_config` - Cấu hình runtime:**

> "7 cột cho phép admin thay đổi config mà không restart app:
> - `config_key` (UNIQUE): Key như 'maintenance_mode', 'max_upload_size_mb'
> - `config_value` (TEXT): Giá trị - có thể là string, number, boolean, hoặc JSON
> - `config_type` (ENUM): Phân loại - FEATURE_FLAG, SYSTEM_SETTING, INTEGRATION, MAINTENANCE
>
> **Use case thực tế:**
> - Bật maintenance mode khi cần update database schema
> - Toggle tính năng scheduled reports nếu phát hiện bug
> - Điều chỉnh SMTP settings mà không rebuild app

---

### **SLIDE 17: GROUP 3 - FEATURES (1'30")**

**[Point to ERD showing user_budget_settings, scheduled_reports, user_preferences, onboarding_progress]**

> "4 bảng này hỗ trợ tính năng nâng cao và personalization.

**1. Bảng `user_budget_settings` - Cấu hình cảnh báo:**

> "One-to-One với users, 8 cột:
> - `warning_threshold` (DOUBLE, default 75.0): % để hiện cảnh báo vàng
> - `critical_threshold` (DOUBLE, default 90.0): % để hiện cảnh báo đỏ
> - `email_alerts_enabled` (BOOLEAN): Bật/tắt email alerts
>
> **Business logic:**
> - Validate: critical > warning, cả hai trong khoảng 50-100%
> - Auto-create khi user đăng ký với defaults
> - Service layer check thresholds để quyết định gửi email hay không

**2. Bảng `scheduled_reports` - Báo cáo tự động:**

> "11 cột support lập lịch phức tạp:
> - `report_type`: MONTHLY/YEARLY/CATEGORY
> - `frequency`: DAILY/WEEKLY/MONTHLY/QUARTERLY/YEARLY
> - `format`: PDF/CSV/BOTH
> - `next_run` (TIMESTAMP): Lần chạy tiếp theo - **tự động tính**
> - `run_count` (INT): Số lần đã execute - tracking metric
>
> **Spring @Scheduled cron job:**
> ```java
> @Scheduled(cron = \"0 0 * * * *\") // Mỗi giờ
> public void executeScheduledReports() {
>     List<ScheduledReport> due = findByNextRunBefore(now);
>     // Generate và send email...
>     // Update next_run = calculateNextRun(frequency)
> }
> ```
> Hoàn toàn autonomous - không cần admin trigger.

**3. Bảng `user_preferences` - Tùy chọn cá nhân:**

> "15 cột nhưng chỉ **3 active preferences**:
> - `view_mode`: 'usage' (detailed) hoặc 'basic' (simple list) - dùng trong BudgetsPage
> - `email_notifications`: Master switch - FALSE → tắt hết emails
> - `budget_alerts`: Bật/tắt budget threshold emails
>
> **10 deprecated preferences** tồn tại trong DB nhưng không dùng:
> - `currency`, `dateFormat`: VND và dd/MM/yyyy hardcoded
> - `theme`: Dark mode removed from frontend
> - `language`: Không có i18n system
> - Etc.
>
> Design decision: Keep trong DB để maintain compatibility, nhưng không implement UI.

**4. Bảng `onboarding_progress` - Tiến trình wizard:**

> "11 cột track 4 bước onboarding:
> - `current_step` (1-4): Bước đang làm
> - `step1_completed` đến `step4_completed`: Boolean flags
> - `is_completed`: TRUE khi tất cả 4 steps done
> - `is_skipped`: User có thể skip và restart sau
>
> **Trigger từ service layers:**
> - Step 1: ProfilePage update với full info
> - Step 2: TransactionService.create() lần đầu
> - Step 3: BudgetService.create() lần đầu
> - Step 4: User visit bất kỳ Report page nào
>
> OnboardingWizard modal auto-show nếu `!is_completed && !is_skipped`.

**[Kết luận Group 3]**

> "4 bảng này đều là One-to-One hoặc One-to-Many với users, CASCADE DELETE khi user bị xóa. Chúng enhance user experience nhưng không critical cho core functionality."

---

## 🎯 KẾT LUẬN TỔNG HỢP (30 giây)

> "Qua 3 phần vừa rồi, chúng ta đã thấy:
>
> **Kiến trúc 3-tier** cung cấp foundation vững chắc với separation of concerns, scalability, và security.
>
> **2 luồng hoạt động** (User và Admin) được thiết kế riêng biệt cho 2 personas khác nhau, nhưng cùng dùng chung backend và database.
>
> **12 bảng database** được tổ chức logic thành 3 groups, với foreign keys, indexes, và constraints đầy đủ đảm bảo data integrity và performance.
>
> Tất cả kết hợp lại tạo nên một hệ thống **production-ready**, có thể deploy ngay và phục vụ hàng nghìn users một cách ổn định và bảo mật."

---

## 📝 NOTES CHO NGƯỜI THUYẾT TRÌNH

### **Timing Control:**
- **Slide 5 (Architecture)**: 2-3 phút
  - Part 1: 3 layers - 1'00"
  - Part 2: Benefits - 1'00"
  - Questions/Buffer: 30"

- **Slides 11-13 (Flows)**: 5-6 phút
  - Slide 11 (User): 2'30"
  - Slide 12 (Admin): 1'30"
  - Slide 13 (Compare): 1'00"
  - Questions/Buffer: 30"

- **Slides 14-17 (Database)**: 6-7 phút
  - Slide 14 (Overview): 1'30"
  - Slide 15 (Core Data): 2'00"
  - Slide 16 (Security): 1'30"
  - Slide 17 (Features): 1'30"
  - Questions/Buffer: 30"

**Total**: 13-16 phút (có buffer cho questions)

### **Emphasis Points:**

**Slide 5:**
- Nhấn mạnh "separation of concerns"
- Nhấn mạnh "web và mobile cùng dùng API"
- Nhấn mạnh "JWT + RBAC security"

**Slides 11-13:**
- User: Nhấn mạnh "tự động hóa" (auto emails, auto alerts)
- Admin: Nhấn mạnh "branching structure" và "audit logging"
- Compare: Nhấn mạnh sự khác biệt rõ ràng giữa 2 flows

**Slides 14-17:**
- Overview: Nhấn mạnh "3 logical groups"
- Core: Nhấn mạnh "UNIQUE constraints" và "indexes"
- Security: Nhấn mạnh "privacy-conscious logging"
- Features: Nhấn mạnh "One-to-One relationships"

### **Visual Aids:**
- **Point to diagrams** khi giải thích flows
- **Highlight boxes** trong ERD khi nói về tables
- **Show arrows** khi giải thích relationships
- **Use laser pointer** cho foreign keys và indexes

### **Common Questions - Chuẩn bị trả lời:**

**Q: Tại sao không dùng Flyway cho database migrations?**
> A: Chúng em chọn Hibernate DDL Auto vì entities là single source of truth, đơn giản hơn cho development. Với team nhỏ và project này, benefit của Flyway (version tracking, rollback) không đáng kể so với complexity nó thêm vào.

**Q: Sao avatar lưu trong DB thay vì file storage như S3?**
> A: Để đơn giản hóa deployment. Với MEDIUMTEXT (16MB max) và giới hạn upload size, performance vẫn acceptable. Production có thể migrate sang S3 sau nếu cần.

**Q: Tại sao có transaction.type khi đã có category.type?**
> A: Query optimization. 90% queries filter theo type, nếu phải JOIN categories sẽ chậm hơn. Denormalization này trade off một chút storage để được faster queries.

**Q: Admin có thể xem chi tiết tài chính user không?**
> A: KHÔNG. Privacy là priority. Admin chỉ xem được aggregated metrics (tổng thu/chi toàn hệ thống), không xem được transactions cá nhân.

**Q: Nếu Hibernate tự động tạo schema, làm sao handle production migrations?**
> A: Development dùng `ddl-auto=update`. Production dùng `ddl-auto=validate` (không auto-modify) + manual SQL scripts cho column type changes. Entities vẫn là source of truth nhưng được validate trước khi deploy.

### **Body Language Tips:**
- Nói chậm, rõ ràng khi giải thích foreign keys
- Pause sau mỗi group database để audience absorb
- Nhìn vào audience khi nói benefits, nhìn vào slide khi nói technical details
- Dùng tay point to diagram - không đứng yên một chỗ
- Tự tin khi nói về design decisions (UNIQUE constraints, CASCADE DELETE)

Chúc bạn thuyết trình thành công! 🎉
