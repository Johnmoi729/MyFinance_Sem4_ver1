# THUYẾT TRÌNH DỰ ÁN MYFINANCE - BẢN CUỐI CÙNG
## Đề tài: Hệ Thống Quản Lý Tài Chính Cá Nhân

*Bản trình bày tối ưu - 18 slides với script diễn thuyết*

---

## 📌 SLIDE 1: TRANG BÌA

**Hình ảnh**: Logo MyFinance với gradient Indigo/Violet

### NỘI DUNG SLIDE:
```
MyFinance
HỆ THỐNG QUẢN LÝ TÀI CHÍNH CÁ NHÂN

Nhóm 2
Giảng viên hướng dẫn: Đặng Kim Thi
```

### SCRIPT DIỄN THUYẾT (15 giây):
> "Xin chào quý thầy cô và các bạn. Nhóm 2 chúng em xin trình bày đồ án với đề tài: MyFinance - Hệ thống quản lý tài chính cá nhân. Em là [Tên], thay mặt nhóm sẽ giới thiệu về dự án của chúng em."

---

## 📌 SLIDE 2: GIỚI THIỆU NHÓM

**Hình ảnh**: Ảnh các thành viên (nếu có) hoặc icons đại diện

### NỘI DUNG SLIDE:
```
THÀNH VIÊN NHÓM 2

• Hoàng Quý Dương - Team Lead & Backend Developer
  → Backend API, Database Design, Security System

• Trần Quang Huy Anh & Phạm Đức Trung - Frontend Developers
  → React Web Application, UI/UX Design

• Phạm Quang Hưng - Mobile Developer
  → Flutter Cross-Platform Application

• Phan Ngọc Hiếu - QA & Documentation
  → Testing, Documentation, Deployment Support
```

### SCRIPT DIỄN THUYẾT (30 giây):
> "Nhóm chúng em gồm 5 thành viên với phân công công việc rõ ràng. Em Dương phụ trách backend và database. Hai bạn Huy Anh và Trung phát triển giao diện web. Bạn Hưng làm ứng dụng mobile, và bạn Hiếu phụ trách testing cùng tài liệu. Tất cả đều có đóng góp quan trọng để hoàn thành dự án."

---

## 📌 SLIDE 3: VẤN ĐỀ VÀ GIẢI PHÁP

**Hình ảnh**: Icon/infographic về quản lý tài chính cá nhân

### NỘI DUNG SLIDE:
```
VẤN ĐỀ THỰC TẾ
❌ Khó theo dõi thu chi hàng tháng
❌ Không biết tiền tiêu vào đâu
❌ Vượt ngân sách mà không hay biết
❌ Thiếu công cụ phân tích tài chính

GIẢI PHÁP: MyFinance
✅ Ghi nhận mọi giao dịch dễ dàng
✅ Phân loại chi tiêu tự động
✅ Cảnh báo khi sắp vượt ngân sách
✅ Báo cáo trực quan, dễ hiểu
```

### SCRIPT DIỄN THUYẾT (45 giây):
> "Trong cuộc sống hiện đại, nhiều người gặp khó khăn khi quản lý tài chính cá nhân. Họ không biết mình đã tiêu bao nhiêu tiền, tiêu vào đâu, và thường xuyên vượt quá ngân sách dự định. Nhận thấy vấn đề này, nhóm em đã phát triển MyFinance - một hệ thống giúp người dùng dễ dàng ghi nhận thu chi, tự động phân loại các khoản, cảnh báo khi sắp vượt ngân sách, và cung cấp báo cáo trực quan để người dùng hiểu rõ tình hình tài chính của mình."

---

## 📌 SLIDE 4: TỔNG QUAN DỰ ÁN

**Hình ảnh**: Dashboard screenshot hoặc mockup giao diện chính

### NỘI DUNG SLIDE:
```
MỤC TIÊU DỰ ÁN
🎯 Xây dựng hệ thống quản lý tài chính hoàn chỉnh
🎯 Hỗ trợ đa nền tảng: Web & Mobile
🎯 Áp dụng công nghệ hiện đại & bảo mật cao

ĐỐI TƯỢNG SỬ DỤNG
👥 Cá nhân quản lý thu chi cá nhân
👨‍👩‍👧‍👦 Hộ gia đình theo dõi ngân sách chung
🎓 Sinh viên, người đi làm lập kế hoạch tài chính

PHẠM VI
• Web Application (React)
• Mobile Application (Flutter - Android/iOS)
• Admin Dashboard quản trị hệ thống
```

### SCRIPT DIỄN THUYẾT (40 giây):
> "Mục tiêu của dự án là xây dựng một hệ thống hoàn chỉnh, không chỉ dừng lại ở web mà còn có cả ứng dụng di động để người dùng có thể quản lý tài chính mọi lúc mọi nơi. Đối tượng sử dụng rất đa dạng, từ cá nhân, hộ gia đình, đến sinh viên và người đi làm. Dự án bao gồm ứng dụng web bằng React, ứng dụng mobile bằng Flutter hoạt động trên cả Android và iOS, và một trang quản trị dành cho admin."

---

## 📌 SLIDE 5: KIẾN TRÚC HỆ THỐNG

**Hình ảnh**: Sơ đồ 3-tier architecture đơn giản và rõ ràng

### NỘI DUNG SLIDE:
```
KIẾN TRÚC 3 LỚP

┌─────────────────────────────────┐
│    PRESENTATION LAYER           │
│  React Web     Flutter Mobile   │
│  (Port 3000)   (Android/iOS)    │
└──────────────┬──────────────────┘
               │ REST API
┌──────────────▼──────────────────┐
│    BUSINESS LOGIC LAYER         │
│   Spring Boot Backend           │
│   (Port 8080)                   │
│   • Authentication & Security   │
│   • Business Logic Processing   │
│   • Email & Report Generation   │
└──────────────┬──────────────────┘
               │ JDBC/JPA
┌──────────────▼──────────────────┐
│    DATA LAYER                   │
│   MySQL Database (Port 3306)    │
│   • 12 tables                   │
│   • Proper indexes & relations  │
└─────────────────────────────────┘
```

### SCRIPT DIỄN THUYẾT (35 giây):
> "Hệ thống được thiết kế theo kiến trúc 3 lớp chuẩn. Lớp presentation bao gồm giao diện web React và mobile Flutter, giao tiếp với backend qua REST API. Lớp business logic sử dụng Spring Boot, xử lý authentication, logic nghiệp vụ, và tạo email, báo cáo tự động. Lớp data dùng MySQL với 12 bảng được thiết kế tối ưu. Kiến trúc này đảm bảo tính bảo mật, dễ mở rộng và bảo trì."

---

## 📌 SLIDE 6: CÔNG NGHỆ SỬ DỤNG

**Hình ảnh**: Logos của các công nghệ chính

### NỘI DUNG SLIDE:
```
BACKEND                    FRONTEND WEB           MOBILE
🔧 Java 17                 ⚛️ React 19.1.1        📱 Flutter 3.x
🍃 Spring Boot 3.5.5       🎨 Tailwind CSS        🎯 Dart 3.x
🔒 Spring Security         📊 Recharts            📈 FL Chart
🗄️ MySQL 8.x               🔄 Context API         🔐 Secure Storage
📧 JavaMail + Thymeleaf    🎭 Lucide Icons        🌐 Dio HTTP Client
📄 iText7 (PDF)
📊 OpenCSV/XLSX (Export)

ĐẶC ĐIỂM NỔI BẬT
✨ JWT Authentication - Bảo mật cao
✨ RBAC (Role-Based Access Control)
✨ Responsive Design - Tương thích mọi thiết bị
✨ Real-time Updates - Cập nhật tức thời
✨ Automated Email System - Email tự động
```

### SCRIPT DIỄN THUYẾT (40 giây):
> "Dự án sử dụng stack công nghệ hiện đại. Backend dùng Java 17 với Spring Boot để xây dựng REST API bảo mật cao. Web frontend dùng React mới nhất với Tailwind CSS cho giao diện đẹp. Mobile app dùng Flutter để chạy được cả Android lẫn iOS từ một mã nguồn. Hệ thống có JWT authentication bảo mật, phân quyền RBAC, thiết kế responsive, cập nhật realtime, và gửi email tự động. Database dùng MySQL 8 với các index được tối ưu."

---

## 📌 SLIDE 7: CHỨC NĂNG CHÍNH - NGƯỜI DÙNG (1/2)

**Hình ảnh**: Screenshots các tính năng chính

### NỘI DUNG SLIDE:
```
1️⃣ QUẢN LÝ THU CHI
   • Ghi nhận giao dịch thu/chi nhanh chóng
   • 14 danh mục mặc định (tùy chỉnh được)
   • Tìm kiếm & lọc linh hoạt
   • Định dạng VND chuẩn Việt Nam

2️⃣ LẬP NGÂN SÁCH THÔNG MINH
   • Đặt ngân sách theo từng danh mục chi
   • Theo dõi tiến độ chi tiêu realtime
   • Thanh tiến trình trực quan (màu xanh/vàng/đỏ)
   • Tính toán số tiền còn lại tự động
```

### SCRIPT DIỄN THUYẾT (45 giây):
> "Chức năng đầu tiên là quản lý thu chi. Người dùng có thể ghi lại mọi giao dịch một cách dễ dàng, hệ thống cung cấp 14 danh mục mặc định phù hợp người Việt và cho phép tùy chỉnh thêm. Có tính năng tìm kiếm và lọc mạnh mẽ, định dạng tiền VND chuẩn.

Chức năng thứ hai là lập ngân sách thông minh. Người dùng đặt ngân sách cho từng danh mục chi, hệ thống sẽ theo dõi realtime họ đã chi bao nhiêu phần trăm. Thanh tiến trình có màu sắc rõ ràng: xanh là an toàn, vàng là cảnh báo, đỏ là vượt quá."

---

## 📌 SLIDE 8: CHỨC NĂNG CHÍNH - NGƯỜI DÙNG (2/2)

**Hình ảnh**: Report screenshots và email samples

### NỘI DUNG SLIDE:
```
3️⃣ CẢNH BÁO TỰ ĐỘNG
   • Email cảnh báo khi chi tiêu đạt 75%, 90%
   • Tùy chỉnh ngưỡng cảnh báo theo ý muốn
   • Thông báo trên dashboard ngay lập tức
   • Giúp kiểm soát chi tiêu hiệu quả

4️⃣ BÁO CÁO & PHÂN TÍCH
   • Báo cáo theo tháng/năm/danh mục
   • Biểu đồ trực quan dễ hiểu
   • Điểm sức khỏe tài chính (0-100)
   • Xuất file PDF, Excel, CSV
   • Lập lịch gửi báo cáo tự động qua email
```

### SCRIPT DIỄN THUYẾT (45 giây):
> "Điểm mạnh thứ ba là hệ thống cảnh báo tự động. Khi chi tiêu đạt 75% ngân sách, người dùng nhận email cảnh báo sớm. Đạt 90% sẽ có cảnh báo nghiêm trọng hơn. Ngưỡng này có thể tùy chỉnh linh hoạt theo nhu cầu từng người.

Chức năng báo cáo rất mạnh. Hệ thống tạo báo cáo theo tháng, năm, hoặc theo danh mục cụ thể. Có biểu đồ đẹp mắt, dễ hiểu. Đặc biệt có điểm sức khỏe tài chính từ 0 đến 100 để đánh giá tổng quan. Báo cáo có thể xuất ra PDF, Excel hoặc CSV, thậm chí lập lịch gửi email tự động."

---

## 📌 SLIDE 9: CHỨC NĂNG QUẢN TRỊ ADMIN

**Hình ảnh**: Admin dashboard screenshot

### NỘI DUNG SLIDE:
```
HỆ THỐNG QUẢN TRỊ TOÀN DIỆN

🔐 PHÂN QUYỀN (RBAC)
   • Vai trò: USER và ADMIN
   • Kiểm soát truy cập chặt chẽ
   • @RequiresAdmin annotation

👥 QUẢN LÝ NGƯỜI DÙNG
   • Xem danh sách users với search/filter
   • Kích hoạt/Vô hiệu hóa tài khoản
   • Thống kê người dùng

📊 PHÂN TÍCH HỆ THỐNG
   • Dashboard tổng quan tài chính
   • Xu hướng giao dịch
   • Sức khỏe hệ thống

📝 AUDIT LOGS
   • Ghi lại mọi thao tác quan trọng của admin
   • Xuất logs ra JSON để lưu trữ
   • Tự động xóa logs cũ
```

### SCRIPT DIỄN THUYẾT (40 giây):
> "Hệ thống có trang quản trị dành cho admin với nhiều tính năng mạnh mẽ. Có phân quyền RBAC chặt chẽ với vai trò User và Admin. Admin có thể quản lý người dùng, tìm kiếm, lọc, kích hoạt hoặc vô hiệu hóa tài khoản.

Có dashboard phân tích tổng quan về tài chính toàn hệ thống, xu hướng giao dịch, sức khỏe hệ thống. Đặc biệt có audit logs ghi lại mọi thao tác quan trọng của admin, có thể xuất ra file JSON, và tự động dọn dẹp logs cũ để tối ưu database."

---

## 📌 SLIDE 10: ĐẶC ĐIỂM NỔI BẬT

**Hình ảnh**: Infographic hoặc icon illustrations

### NỘI DUNG SLIDE:
```
ĐIỂM KHÁC BIỆT CỦA MYFINANCE

🌟 TỐI ƯU CHO NGƯỜI VIỆT
   → Tiền tệ VND duy nhất (không phức tạp)
   → Định dạng ngày dd/mm/yyyy (chuẩn VN)
   → 14 danh mục mặc định phù hợp người Việt

⚡ HIỆU SUẤT CAO
   → Realtime updates - Cập nhật tức thời
   → Proper database indexing
   → Optimized queries

🔒 BẢO MẬT TOÀN DIỆN
   → JWT với BCrypt encryption
   → Role-based access control (RBAC)
   → Audit logging đầy đủ

📱 ĐA NỀN TẢNG
   → Web responsive - Mọi trình duyệt
   → Mobile native - Android & iOS
   → Đồng bộ dữ liệu liền mạch
```

### SCRIPT DIỄN THUYẾT (40 giây):
> "MyFinance có nhiều điểm nổi bật. Thứ nhất, được tối ưu hoàn toàn cho người Việt với tiền tệ VND duy nhất, định dạng ngày tháng chuẩn Việt Nam, và 14 danh mục mặc định phù hợp thói quen chi tiêu người Việt.

Thứ hai, hiệu suất cao với cập nhật realtime, database có index tối ưu và queries được optimize kỹ. Thứ ba, bảo mật toàn diện với JWT, mã hóa BCrypt, phân quyền RBAC và audit logging. Cuối cùng, hỗ trợ đa nền tảng từ web responsive đến mobile native, dữ liệu đồng bộ liền mạch."

---

## 📌 SLIDE 11 - 13: LUỒNG HOẠT ĐỘNG CHÍNH

**Hình ảnh**: Flowchart đơn giản minh họa luồng sử dụng

### NỘI DUNG SLIDE:
```
HÀNH TRÌNH NGƯỜI DÙNG

1. ĐĂNG KÝ & ONBOARDING
   ↓
   → Tạo tài khoản, nhận email chào mừng
   → Wizard 4 bước hướng dẫn setup ban đầu

2. GHI NHẬN GIAO DỊCH
   ↓
   → Thêm thu/chi hàng ngày
   → Xem số dư realtime

3. LẬP NGÂN SÁCH
   ↓
   → Đặt giới hạn chi tiêu theo danh mục
   → Nhận cảnh báo tự động

4. XEM BÁO CÁO & PHÂN TÍCH
   ↓
   → Hiểu rõ tình hình tài chính
   → Điều chỉnh kế hoạch chi tiêu

5. NHẬN EMAIL ĐỊNH KỲ
   ↓
   → Tóm tắt tháng, cảnh báo, báo cáo theo lịch
```

### SCRIPT DIỄN THUYẾT (40 giây):
> "Hành trình người dùng rất rõ ràng. Đầu tiên họ đăng ký tài khoản, nhận email chào mừng và được hướng dẫn bằng wizard 4 bước. Sau đó ghi nhận các giao dịch thu chi hàng ngày và xem số dư realtime.

Tiếp theo lập ngân sách cho các danh mục chi, hệ thống sẽ tự động cảnh báo khi sắp vượt. Người dùng thường xuyên xem báo cáo và phân tích để hiểu rõ tình hình, từ đó điều chỉnh kế hoạch chi tiêu. Cuối cùng, họ nhận email định kỳ với tóm tắt tháng, cảnh báo và các báo cáo đã lập lịch."

---

## 📌 SLIDE 14 - 17: DATABASE - THIẾT KẾ TỔNG QUAN

**Hình ảnh**: ERD diagram đơn giản, dễ nhìn (không quá chi tiết)

### NỘI DUNG SLIDE:
```
CƠ SỞ DỮ LIỆU MYSQL - 12 BẢNG

NHÓM CORE (Dữ liệu chính)
📋 users - Thông tin người dùng
📁 categories - Danh mục thu/chi
💰 transactions - Giao dịch tài chính
💵 budgets - Ngân sách kế hoạch

NHÓM SECURITY & ADMIN
🔐 roles, user_roles - Phân quyền
📝 audit_logs - Nhật ký hệ thống
⚙️ system_config - Cấu hình

NHÓM FEATURES
⚡ user_budget_settings - Cấu hình cảnh báo
📅 scheduled_reports - Báo cáo tự động
🎯 user_preferences - Tùy chọn cá nhân
📚 onboarding_progress - Tiến trình onboarding

✅ Foreign keys, indexes, unique constraints đầy đủ
```

### SCRIPT DIỄN THUYẾT (35 giây):
> "Cơ sở dữ liệu gồm 12 bảng được chia thành 3 nhóm. Nhóm core chứa dữ liệu chính: users, categories, transactions và budgets. Nhóm security chứa roles, audit logs và system config để bảo mật và quản trị. Nhóm features chứa các bảng hỗ trợ tính năng nâng cao như cấu hình cảnh báo, báo cáo tự động, tùy chọn cá nhân và onboarding. Tất cả các bảng đều có foreign keys, indexes và constraints đầy đủ để đảm bảo tính toàn vẹn dữ liệu."

---

## 📌 SLIDE 18: KẾT QUẢ ĐẠT ĐƯỢC

**Hình ảnh**: Bảng thống kê hoặc infographic

### NỘI DUNG SLIDE:
```
THÀNH TỰU DỰ ÁN

📊 QUI MÔ CODE
   • Backend: 16 entities, 20 services, 17 controllers
   • Web: 69 files, 29 pages, 26 components
   • Mobile: 40 Dart files, 16 screens
   • Database: 12 bảng với proper design
   • API: 100+ REST endpoints

✅ HOÀN THÀNH
   • Flow 1-5: 100% (Authentication, Transaction,
     Budget, Reports, Admin)
   • Flow 6: 43% (UX Enhancement - 2/7 phases)
   • Overall: 95% completion

🎯 CHẤT LƯỢNG
   • Zero compilation errors
   • Enterprise-grade architecture
   • Production-ready code
   • Comprehensive documentation
```

### SCRIPT DIỄN THUYẾT (35 giây):
> "Kết quả đạt được rất ấn tượng. Về qui mô code, backend có 16 entities, 20 services và 17 controllers. Web có 69 files với 29 pages và 26 components tái sử dụng. Mobile có 40 files Dart với 16 màn hình. Database 12 bảng được thiết kế tốt. API có hơn 100 endpoints.

Về mức độ hoàn thành, Flow 1 đến 5 đạt 100%, Flow 6 đạt 43%. Tổng thể 95% hoàn thiện. Về chất lượng, code không có lỗi biên dịch, kiến trúc chuẩn enterprise, sẵn sàng deploy production."

---

## 📌 SLIDE 19: THÁCH THỨC VÀ CÁCH GIẢI QUYẾT

**Hình ảnh**: Icons minh họa challenges

### NỘI DUNG SLIDE:
```
NHỮNG THÁCH THỨC ĐÃ VƯỢT QUA

1️⃣ TÍCH HỢP EMAIL TỰ ĐỘNG
   ❌ Thách thức: Async processing, template engine
   ✅ Giải pháp: Spring @Async + Thymeleaf
   → 6 loại email tự động hoạt động hoàn hảo

2️⃣ BÁO CÁO THEO LỊCH
   ❌ Thách thức: Cron jobs, PDF/CSV generation
   ✅ Giải pháp: Spring @Scheduled + iText7 + OpenCSV
   → Tự động gửi báo cáo đúng giờ

3️⃣ ĐA NỀN TẢNG (WEB & MOBILE)
   ❌ Thách thức: Đồng bộ dữ liệu, consistent UX
   ✅ Giải pháp: REST API standard + Flutter Provider
   → Seamless synchronization

4️⃣ BẢO MẬT & AUDIT
   ❌ Thách thức: Security vulnerabilities, tracking
   ✅ Giải pháp: JWT + RBAC + AOP Logging
   → Enterprise-grade security
```

### SCRIPT DIỄN THUYẾT (45 giây):
> "Trong quá trình làm, nhóm gặp nhiều thách thức. Thách thức đầu tiên là tích hợp email tự động. Ban đầu khó với async processing và template engine, nhưng nhóm đã giải quyết bằng Spring Async và Thymeleaf, giờ có 6 loại email hoạt động hoàn hảo.

Thách thức thứ hai là báo cáo theo lịch với cron jobs và generate PDF. Đã giải quyết bằng Spring Scheduled, iText7 và OpenCSV. Thách thức thứ ba là đồng bộ dữ liệu giữa web và mobile, giải quyết bằng REST API chuẩn và Flutter Provider. Cuối cùng là bảo mật, đã implement JWT, RBAC và AOP logging để đạt chuẩn enterprise."

---

## 📌 SLIDE 20: QUYẾT ĐỊNH THIẾT KẾ QUAN TRỌNG

**Hình ảnh**: Decision tree hoặc comparison chart

### NỘI DUNG SLIDE:
```
CÁC QUYẾT ĐỊNH THIẾT KẾ CHÍNH

✂️ LOẠI BỎ MULTI-CURRENCY
   Lý do: Tập trung thị trường Việt Nam
   Lợi ích:
   • Giảm complexity hệ thống
   • Tiết kiệm 2-3 tuần testing
   • UX đơn giản hơn cho người Việt
   • Tránh lỗi conversion rates

🎨 CONTEXT API THAY VÌ REDUX
   Lý do: Phù hợp với quy mô dự án
   Lợi ích:
   • Ít boilerplate code
   • Dễ học, dễ maintain
   • React 19 optimize performance
   • Đủ mạnh cho mid-size app

📱 FLUTTER CHO MOBILE
   Lý do: Cross-platform development
   Lợi ích:
   • Một codebase cho Android & iOS
   • Performance gần native
   • Rich UI components
   • Tiết kiệm thời gian 50%
```

### SCRIPT DIỄN THUYẾT (40 giây):
> "Nhóm đã có những quyết định thiết kế quan trọng. Thứ nhất, loại bỏ multi-currency để tập trung thị trường Việt Nam. Điều này giảm complexity, tiết kiệm 2-3 tuần testing, UX đơn giản hơn và tránh lỗi conversion.

Thứ hai, dùng Context API thay vì Redux vì phù hợp với quy mô dự án, ít code rườm rà hơn, dễ maintain, và React 19 đã optimize performance cho Context. Thứ ba, chọn Flutter cho mobile vì cross-platform, một codebase chạy được cả Android và iOS, performance gần native, UI components phong phú, tiết kiệm 50% thời gian."

---

## 📌 SLIDE 21 - 22: HẠN CHẾ & HƯỚNG PHÁT TRIỂN

**Hình ảnh**: Roadmap timeline

### NỘI DUNG SLIDE:
```
HẠN CHẾ HIỆN TẠI

⚠️ Flow 6 chưa hoàn thiện (43% - không critical)
   • PWA capabilities
   • Advanced UI/UX polish
   • Performance optimization tools

⚠️ 2 Minor fixes được khuyến nghị
   • Hardcoded frontend URL (EmailService)
   • PDF resource leak mitigation (try-with-resources)
   → Có thể fix trong 15-25 phút

HƯỚNG PHÁT TRIỂN TƯƠNG LAI

🔮 Tính năng nâng cao
   • Financial goals (mục tiêu tiết kiệm)
   • Recurring transactions (giao dịch lặp)
   • Transaction attachments (đính kèm hóa đơn)

🔮 Tích hợp AI/ML
   • Dự đoán chi tiêu
   • Gợi ý tiết kiệm thông minh
   • Phân tích xu hướng

🔮 Social features
   • Chia sẻ báo cáo
   • So sánh với bạn bè (anonymous)
```

### SCRIPT DIỄN THUYẾT (35 giây):
> "Hệ thống vẫn còn một số hạn chế. Flow 6 mới hoàn thiện 43%, nhưng đó là các tính năng polish chứ không critical cho hoạt động. Có 2 minor fixes được khuyến nghị nhưng có thể sửa trong 15-25 phút.

Về hướng phát triển, trong tương lai có thể thêm financial goals, recurring transactions, đính kèm hóa đơn. Tích hợp AI để dự đoán chi tiêu, gợi ý tiết kiệm thông minh. Thêm social features như chia sẻ báo cáo và so sánh với bạn bè một cách ẩn danh."

---

## 📌 SLIDE 23: KẾT LUẬN

**Hình ảnh**: Summary infographic hoặc project logo

### NỘI DUNG SLIDE:
```
TÓM TẮT DỰ ÁN MYFINANCE

✨ THÀNH TỰU
   ✅ 95% hoàn thiện, production-ready
   ✅ Full-stack: Backend + Web + Mobile
   ✅ Enterprise-grade security & architecture
   ✅ Comprehensive features cho quản lý tài chính
   ✅ Tối ưu hoàn toàn cho người Việt

🎓 KIẾN THỨC ÁP DỤNG
   • Backend: Spring Boot, JPA, Security, JWT
   • Frontend: React, State Management, Responsive Design
   • Mobile: Flutter, Cross-platform development
   • Database: MySQL design, Optimization
   • DevOps: Git, API testing, Email integration

💼 GIÁ TRỊ THỰC TẾ
   • Giải quyết vấn đề thực tế của người dùng
   • Có thể deploy và sử dụng ngay
   • Nền tảng cho nhiều tính năng mở rộng

CẢM ƠN QUÝ THẦY CÔ VÀ CÁC BẠN!
❓ Sẵn sàng trả lời câu hỏi
```

### SCRIPT DIỄN THUYẾT (60 giây):
> "Tóm lại, MyFinance là một dự án hoàn chỉnh với 95% completion, sẵn sàng deploy production. Đây là hệ thống full-stack với backend Spring Boot, web React và mobile Flutter, có bảo mật và kiến trúc chuẩn enterprise, tính năng toàn diện và được tối ưu hoàn toàn cho người Việt.

Qua dự án này, nhóm đã áp dụng được nhiều kiến thức từ backend Spring Boot, JPA, Security, đến frontend React với state management và responsive design, mobile Flutter cross-platform, database MySQL design, và nhiều công cụ DevOps.

Giá trị thực tế là dự án giải quyết vấn đề cụ thể của người dùng, có thể deploy và sử dụng ngay, đồng thời là nền tảng tốt để mở rộng thêm nhiều tính năng.

Nhóm em xin cảm ơn quý thầy cô và các bạn đã lắng nghe. Chúng em sẵn sàng trả lời các câu hỏi!"

---

## 📌 SLIDE 24: DEMO THỰC TẾ

**Hình ảnh**: QR code hoặc link demo (nếu có)

### NỘI DUNG SLIDE:
```
CHUẨN BỊ DEMO

🔧 KHỞI ĐỘNG HỆ THỐNG
   Backend:  mvn spring-boot:run (port 8080)
   Frontend: npm start (port 3000)
   Mobile:   Flutter app on emulator/device

📱 CÁC TÌNH HUỐNG DEMO
   1. Đăng ký user mới → Onboarding wizard
   2. Thêm giao dịch thu/chi
   3. Tạo ngân sách → Nhận email cảnh báo
   4. Xem báo cáo tháng → Xuất PDF/Excel
   5. Admin: Quản lý users & analytics
   6. Mobile: Đồng bộ dữ liệu với web

💡 Tất cả tính năng hoạt động ổn định
   và đã được test kỹ lưỡng
```

### SCRIPT DIỄN THUYẾT (30 giây):
> "Chúng em đã chuẩn bị demo thực tế. Hệ thống khởi động bằng 3 lệnh đơn giản cho backend, frontend và mobile.

Trong demo, chúng em sẽ trình diễn đăng ký user mới với onboarding wizard, thêm giao dịch thu chi, tạo ngân sách và nhận email cảnh báo tự động, xem báo cáo và xuất file, trang admin quản lý users, và cuối cùng là ứng dụng mobile đồng bộ dữ liệu với web. Tất cả tính năng đã được test kỹ và hoạt động ổn định."

---

## 📌 PHỤ LỤC: CÂU HỎI THƯỜNG GẶP (BACKUP SLIDES)

### BACKUP SLIDE 1: Technical Q&A

**Q1: Tại sao chọn Spring Boot thay vì Node.js?**
> Spring Boot mature hơn, ecosystem phong phú, Spring Security mạnh mẽ, JPA/Hibernate tốt cho complex queries, phù hợp enterprise applications và có nhiều tài liệu tiếng Việt.

**Q2: Làm sao đảm bảo bảo mật dữ liệu người dùng?**
> Sử dụng JWT với expiration time, BCrypt cho password hashing, HTTPS cho API calls, RBAC cho authorization, audit logging mọi thao tác quan trọng, và validate input kỹ lưỡng.

**Q3: Mobile app đồng bộ với web như thế nào?**
> Cả hai đều gọi chung REST API backend, JWT token được lưu secure storage trên mobile và localStorage trên web, mỗi lần fetch data đều lấy từ server nên luôn đồng bộ.

---

### BACKUP SLIDE 2: Project Management Q&A

**Q4: Nhóm phân chia công việc và collaborate như thế nào?**
> Dùng Git/GitHub cho version control, tạo branches riêng cho từng feature, code review trước khi merge, họp online định kỳ, dùng Trello/Notion để track tasks.

**Q5: Thời gian hoàn thành dự án?**
> Tổng cộng khoảng [X] tháng từ analysis, design, development đến testing. Backend mất [Y] tháng, frontend web [Z] tháng, mobile [W] tháng, và integration + testing [V] tháng.

**Q6: Deployment plan cho production?**
> Backend deploy lên AWS EC2 hoặc Google Cloud Run, database dùng AWS RDS MySQL, frontend web deploy Vercel hoặc Netlify, mobile app publish lên Google Play và App Store.

---

# 🎯 HƯỚNG DẪN SỬ DỤNG

## Chuẩn bị slides:
1. **Sao chép nội dung từng slide** vào PowerPoint
2. **Thêm hình ảnh minh họa**:
   - Screenshots thực tế từ ứng dụng
   - Sơ đồ kiến trúc (vẽ bằng draw.io)
   - ERD diagram (export từ MySQL Workbench)
   - Icons từ Flaticon hoặc Font Awesome
3. **Theme**: Dùng màu Indigo/Violet matching với app
4. **Font**: Arial/Calibri, size 24-32pt

## Tips thuyết trình:
- **Timing**: 24 slides x 40 giây = 16 phút + 15 phút demo + 5 phút Q&A = 36 phút
- **Tự tin**: Nói chậm, rõ ràng, tự nhiên
- **Eye contact**: Nhìn vào thầy cô và khán giả
- **Backup**: Chuẩn bị video demo phòng khi technical issue
- **Practice**: Tập ít nhất 3-5 lần trước khi thuyết trình

Chúc bạn thuyết trình thành công! 🎉
