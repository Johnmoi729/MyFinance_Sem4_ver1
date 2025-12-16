# DATABASE DETAILED DOCUMENTATION
## MyFinance - Cơ sở dữ liệu chi tiết với giải thích đầy đủ

*Tài liệu này cung cấp giải thích chi tiết về mọi bảng, cột, và mối quan hệ trong database MyFinance*

---

## 📊 TỔNG QUAN DATABASE

### Thông tin chung

| Thông tin | Chi tiết |
|-----------|----------|
| **Database Engine** | MySQL 8.x |
| **Migration Strategy** | Hibernate DDL Auto (`spring.jpa.hibernate.ddl-auto=update`) |
| **Character Set** | utf8mb4 (hỗ trợ tiếng Việt và emoji) |
| **Collation** | utf8mb4_unicode_ci |
| **Số bảng** | 12 bảng chính |
| **JPA Entities** | 16 entities (một số one-to-one với bảng) |
| **Storage Engine** | InnoDB (hỗ trợ foreign keys và transactions) |

### Kiến trúc Migration

MyFinance **KHÔNG sử dụng Flyway** hoặc Liquibase. Thay vào đó:

```properties
# application.properties
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

**Hibernate DDL Auto hoạt động như thế nào:**
1. Khi ứng dụng khởi động, Hibernate đọc tất cả `@Entity` classes
2. So sánh với database schema hiện tại
3. **Tự động tạo**: Missing tables, missing columns, indexes
4. **KHÔNG tự động**: Modify column types, rename columns, drop columns
5. **Cần manual SQL**: Column type changes, data migrations

**Ưu điểm:**
- ✅ Entities là single source of truth
- ✅ Không cần maintain migration files
- ✅ Đơn giản cho development
- ✅ Tự động sync schema với code

**Nhược điểm:**
- ⚠️ Cần manual SQL cho column type changes
- ⚠️ Không có version tracking
- ⚠️ Không có automatic rollback

---

## 📋 DANH SÁCH 12 BẢNG CHÍNH

| STT | Tên bảng | Flow | Số cột | Mục đích chính | Relationships |
|-----|----------|------|--------|----------------|---------------|
| 1 | `users` | Flow 1 | 9 | Lưu thông tin người dùng | 1-to-Many với hầu hết các bảng |
| 2 | `roles` | Flow 5 | 4 | Định nghĩa vai trò (USER/ADMIN) | Many-to-Many với users qua user_roles |
| 3 | `user_roles` | Flow 5 | 3 | Gán vai trò cho users | Many-to-One với users và roles |
| 4 | `categories` | Flow 2 | 8 | Danh mục thu/chi | 1-to-Many với transactions, budgets |
| 5 | `transactions` | Flow 2 | 9 | Giao dịch thu/chi | Many-to-One với users, categories |
| 6 | `budgets` | Flow 3 | 10 | Ngân sách theo danh mục | Many-to-One với users, categories |
| 7 | `user_budget_settings` | Flow 3 | 8 | Cấu hình ngưỡng cảnh báo | One-to-One với users |
| 8 | `scheduled_reports` | Flow 4 | 11 | Lịch báo cáo tự động | Many-to-One với users |
| 9 | `audit_logs` | Flow 5 | 8 | Nhật ký hoạt động admin | Many-to-One với users (admin) |
| 10 | `system_config` | Flow 5 | 7 | Cấu hình hệ thống | No relationships (standalone) |
| 11 | `user_preferences` | Flow 6 | 15 | Tùy chọn người dùng | One-to-One với users |
| 12 | `onboarding_progress` | Flow 6 | 11 | Tiến trình onboarding | One-to-One với users |

---

## 🔑 CHI TIẾT TỪNG BẢNG

---

### 1. BẢNG `users` (Flow 1: Authentication & User Management)

**Mục đích**: Lưu trữ thông tin tài khoản người dùng và profile mở rộng

**Schema:**

```sql
CREATE TABLE users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT 'ID tự tăng',
  email VARCHAR(255) UNIQUE NOT NULL COMMENT 'Email đăng nhập (unique)',
  password VARCHAR(255) NOT NULL COMMENT 'Mật khẩu đã mã hóa (BCrypt)',
  full_name VARCHAR(255) COMMENT 'Họ và tên đầy đủ',
  phone_number VARCHAR(20) COMMENT 'Số điện thoại (optional)',
  address VARCHAR(255) COMMENT 'Địa chỉ (optional)',
  date_of_birth DATE COMMENT 'Ngày sinh (optional)',
  avatar MEDIUMTEXT COMMENT 'Avatar Base64 (max 16MB)',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Ngày tạo tài khoản',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Ngày cập nhật cuối'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Chi tiết các cột:**

| Cột | Type | Constraints | Mô tả chi tiết |
|-----|------|-------------|----------------|
| `id` | BIGINT | PK, AUTO_INCREMENT | ID duy nhất cho mỗi user. Dùng BIGINT để scale lên hàng triệu users |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL | Email đăng nhập. Dùng làm username trong JWT authentication. Validate format bằng Spring Validation |
| `password` | VARCHAR(255) | NOT NULL | Mật khẩu đã mã hóa bằng BCrypt ($2a$10$...). Không bao giờ lưu plaintext password |
| `full_name` | VARCHAR(255) | Nullable | Họ tên đầy đủ người dùng. Hiển thị trong dashboard và emails |
| `phone_number` | VARCHAR(20) | Nullable | Số điện thoại. Dùng VARCHAR để hỗ trợ country codes (+84, +1, etc.) |
| `address` | VARCHAR(255) | Nullable | Địa chỉ đầy đủ. Optional field cho extended profile |
| `date_of_birth` | DATE | Nullable | Ngày sinh (YYYY-MM-DD). Dùng để tính tuổi hoặc personalized greetings |
| `avatar` | MEDIUMTEXT | Nullable | Avatar image encoded as Base64 string. MEDIUMTEXT = 16MB max. Lưu trữ trực tiếp trong DB thay vì file storage |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Timestamp tạo tài khoản. Tự động set khi INSERT |
| `updated_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Timestamp cập nhật cuối. Tự động update khi có UPDATE |

**Indexes:**
```sql
CREATE UNIQUE INDEX idx_users_email ON users(email); -- Tự động từ UNIQUE constraint
CREATE INDEX idx_users_created_at ON users(created_at); -- Để query users mới
```

**Relationships:**
- **1-to-Many** với `categories` (user_id)
- **1-to-Many** với `transactions` (user_id)
- **1-to-Many** với `budgets` (user_id)
- **1-to-Many** với `scheduled_reports` (user_id)
- **1-to-Many** với `user_roles` (user_id)
- **1-to-One** với `user_budget_settings` (user_id)
- **1-to-One** với `user_preferences` (user_id)
- **1-to-One** với `onboarding_progress` (user_id)
- **1-to-Many** với `audit_logs` (admin_user_id) - Optional

**Business Rules:**
1. Email phải unique - không cho phép trùng
2. Password tối thiểu 8 ký tự (validate ở service layer)
3. Khi user bị xóa (CASCADE DELETE):
   - Tất cả categories của user bị xóa
   - Tất cả transactions của user bị xóa
   - Tất cả budgets của user bị xóa
   - User settings, preferences, onboarding progress bị xóa
4. Default role USER được gán tự động khi registration

**JPA Entity Mapping:**
```java
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(name = "full_name")
    private String fullName;

    @Column(name = "phone_number")
    private String phoneNumber;

    private String address;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Column(name = "avatar", columnDefinition = "MEDIUMTEXT")
    private String avatar;

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

---

### 2. BẢNG `roles` (Flow 5: Admin System)

**Mục đích**: Định nghĩa các vai trò trong hệ thống RBAC (Role-Based Access Control)

**Schema:**

```sql
CREATE TABLE roles (
  id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT 'ID vai trò',
  name VARCHAR(50) UNIQUE NOT NULL COMMENT 'Tên vai trò (USER/ADMIN/SUPER_ADMIN)',
  description TEXT COMMENT 'Mô tả vai trò',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Ngày tạo'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Chi tiết các cột:**

| Cột | Type | Constraints | Mô tả chi tiết |
|-----|------|-------------|----------------|
| `id` | BIGINT | PK, AUTO_INCREMENT | ID vai trò. Fixed IDs: 1=USER, 2=ADMIN, 3=SUPER_ADMIN |
| `name` | VARCHAR(50) | UNIQUE, NOT NULL | Tên vai trò: "USER", "ADMIN", "SUPER_ADMIN" |
| `description` | TEXT | Nullable | Mô tả quyền hạn của vai trò |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Timestamp tạo role |

**Default Data:**
```sql
INSERT INTO roles (id, name, description) VALUES
(1, 'USER', 'Người dùng thông thường - Quản lý tài chính cá nhân'),
(2, 'ADMIN', 'Quản trị viên - Quản lý users, xem audit logs, cấu hình hệ thống'),
(3, 'SUPER_ADMIN', 'Quản trị viên cấp cao - Full access to all admin functions');
```

**Relationships:**
- **Many-to-Many** với `users` qua bảng `user_roles`

**Business Rules:**
1. Tên role phải unique
2. Không được xóa role nếu còn users đang sử dụng
3. Default role "USER" được gán cho mọi user mới

---

### 3. BẢNG `user_roles` (Flow 5: Admin System)

**Mục đích**: Bảng trung gian cho Many-to-Many relationship giữa users và roles

**Schema:**

```sql
CREATE TABLE user_roles (
  id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT 'ID',
  user_id BIGINT NOT NULL COMMENT 'ID người dùng',
  role_id BIGINT NOT NULL COMMENT 'ID vai trò',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Ngày gán vai trò',
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_role (user_id, role_id) COMMENT 'Mỗi user chỉ có 1 role type'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Chi tiết các cột:**

| Cột | Type | Constraints | Mô tả chi tiết |
|-----|------|-------------|----------------|
| `id` | BIGINT | PK, AUTO_INCREMENT | ID duy nhất cho mỗi role assignment |
| `user_id` | BIGINT | FK → users.id, NOT NULL | ID người dùng được gán role |
| `role_id` | BIGINT | FK → roles.id, NOT NULL | ID vai trò được gán |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Timestamp khi role được gán |

**Indexes:**
```sql
CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX idx_user_roles_role_id ON user_roles(role_id);
CREATE UNIQUE INDEX unique_user_role ON user_roles(user_id, role_id);
```

**Relationships:**
- **Many-to-One** với `users` (user_id) - CASCADE DELETE
- **Many-to-One** với `roles` (role_id) - CASCADE DELETE

**Business Rules:**
1. Một user có thể có nhiều roles (USER + ADMIN)
2. UNIQUE constraint đảm bảo không duplicate role assignment
3. Khi user bị xóa → tất cả role assignments bị xóa (CASCADE)
4. Khi role bị xóa → tất cả assignments của role đó bị xóa (CASCADE)

---

### 4. BẢNG `categories` (Flow 2: Transaction & Category Management)

**Mục đích**: Danh mục phân loại giao dịch thu/chi

**Schema:**

```sql
CREATE TABLE categories (
  id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT 'ID danh mục',
  user_id BIGINT NOT NULL COMMENT 'ID người dùng sở hữu',
  name VARCHAR(255) NOT NULL COMMENT 'Tên danh mục',
  type ENUM('INCOME', 'EXPENSE') NOT NULL COMMENT 'Loại: Thu hoặc Chi',
  color VARCHAR(7) COMMENT 'Màu sắc (Hex code: #RRGGBB)',
  icon VARCHAR(50) COMMENT 'Tên icon (Lucide React)',
  is_default BOOLEAN DEFAULT FALSE COMMENT 'Danh mục mặc định của hệ thống',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Chi tiết các cột:**

| Cột | Type | Constraints | Mô tả chi tiết |
|-----|------|-------------|----------------|
| `id` | BIGINT | PK, AUTO_INCREMENT | ID duy nhất cho mỗi category |
| `user_id` | BIGINT | FK → users.id, NOT NULL | Owner của category. Mỗi user có categories riêng |
| `name` | VARCHAR(255) | NOT NULL | Tên danh mục (VD: "Lương", "Tiền nhà", "Ăn uống") |
| `type` | ENUM | 'INCOME' hoặc 'EXPENSE' | Phân loại Thu (INCOME) hoặc Chi (EXPENSE) |
| `color` | VARCHAR(7) | Nullable | Màu hiển thị UI (Hex code: #4CAF50, #F44336) |
| `icon` | VARCHAR(50) | Nullable | Tên icon từ Lucide React (VD: "Wallet", "Home", "Coffee") |
| `is_default` | BOOLEAN | DEFAULT FALSE | TRUE nếu là 1 trong 14 default categories |
| `created_at` | TIMESTAMP | AUTO | Timestamp tạo category |
| `updated_at` | TIMESTAMP | AUTO | Timestamp cập nhật cuối |

**14 Default Vietnamese Categories:**

**Income Categories (5):**
1. Lương (Salary) - Banknote icon, Green
2. Thưởng (Bonus) - Gift icon, Green
3. Đầu tư (Investment) - TrendingUp icon, Green
4. Bán hàng (Sales) - ShoppingBag icon, Green
5. Thu nhập khác (Other Income) - PlusCircle icon, Green

**Expense Categories (9):**
1. Ăn uống (Food & Drink) - Coffee icon, Red
2. Tiền nhà (Rent) - Home icon, Orange
3. Di chuyển (Transportation) - Car icon, Blue
4. Mua sắm (Shopping) - ShoppingCart icon, Purple
5. Giải trí (Entertainment) - Film icon, Pink
6. Y tế (Healthcare) - Heart icon, Red
7. Giáo dục (Education) - BookOpen icon, Indigo
8. Tiết kiệm (Savings) - PiggyBank icon, Green
9. Chi phí khác (Other Expense) - MoreHorizontal icon, Gray

**Indexes:**
```sql
CREATE INDEX idx_categories_user_id ON categories(user_id);
CREATE INDEX idx_categories_type ON categories(type);
CREATE INDEX idx_categories_user_type ON categories(user_id, type); -- Composite index
```

**Relationships:**
- **Many-to-One** với `users` (user_id) - CASCADE DELETE
- **1-to-Many** với `transactions` (category_id) - RESTRICT DELETE
- **1-to-Many** với `budgets` (category_id) - RESTRICT DELETE (chỉ EXPENSE categories)

**Business Rules:**
1. Mỗi user có set categories riêng biệt
2. User mới tự động có 14 default categories
3. Không thể xóa category nếu còn transactions hoặc budgets sử dụng (RESTRICT)
4. Budget chỉ áp dụng cho EXPENSE categories (không budget cho INCOME)
5. Tên category không cần unique (2 users có thể có category cùng tên)

---

### 5. BẢNG `transactions` (Flow 2: Transaction Management)

**Mục đích**: Lưu trữ tất cả giao dịch thu/chi của users

**Schema:**

```sql
CREATE TABLE transactions (
  id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT 'ID giao dịch',
  user_id BIGINT NOT NULL COMMENT 'ID người dùng',
  category_id BIGINT NOT NULL COMMENT 'ID danh mục',
  amount DECIMAL(12,2) NOT NULL COMMENT 'Số tiền (VND)',
  -- ❌ REMOVED: currency_code, amount_in_base_currency (December 5, 2025)
  type ENUM('INCOME', 'EXPENSE') NOT NULL COMMENT 'Loại giao dịch',
  description TEXT COMMENT 'Mô tả giao dịch',
  transaction_date DATE NOT NULL COMMENT 'Ngày giao dịch',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Ngày tạo record',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Chi tiết các cột:**

| Cột | Type | Constraints | Mô tả chi tiết |
|-----|------|-------------|----------------|
| `id` | BIGINT | PK, AUTO_INCREMENT | ID duy nhất cho mỗi transaction |
| `user_id` | BIGINT | FK → users.id, NOT NULL | Owner của transaction |
| `category_id` | BIGINT | FK → categories.id, NOT NULL | Danh mục của transaction |
| `amount` | DECIMAL(12,2) | NOT NULL | Số tiền VND (max 999,999,999,999.99 VND = 999 tỷ) |
| `type` | ENUM | 'INCOME' hoặc 'EXPENSE' | Loại giao dịch (duplicate từ category.type cho query optimization) |
| `description` | TEXT | Nullable | Mô tả chi tiết giao dịch (VD: "Mua đồ ăn trưa Phở Hà Nội") |
| `transaction_date` | DATE | NOT NULL | Ngày giao dịch thực tế (YYYY-MM-DD, có thể khác created_at) |
| `created_at` | TIMESTAMP | AUTO | Timestamp tạo record trong DB |
| `updated_at` | TIMESTAMP | AUTO | Timestamp cập nhật cuối |

**Note về Multi-Currency Removal:**
- ❌ `currency_code VARCHAR(3)` - ĐÃ XÓA (December 5, 2025)
- ❌ `amount_in_base_currency DECIMAL(12,2)` - ĐÃ XÓA
- Tất cả amounts giờ là VND only, không cần conversion

**Indexes:**
```sql
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_category_id ON transactions(category_id);
CREATE INDEX idx_transactions_date ON transactions(transaction_date);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_user_date ON transactions(user_id, transaction_date); -- Composite
```

**Relationships:**
- **Many-to-One** với `users` (user_id) - CASCADE DELETE
- **Many-to-One** với `categories` (category_id) - RESTRICT DELETE

**Business Rules:**
1. Amount phải > 0 (validate ở service layer)
2. transaction_date không được trong tương lai quá xa
3. type phải khớp với category.type (validate ở service layer)
4. Không thể xóa category nếu có transactions (RESTRICT)
5. Khi user bị xóa → tất cả transactions bị xóa (CASCADE)

**Common Queries:**
```sql
-- Tổng thu/chi của user trong tháng
SELECT type, SUM(amount) as total
FROM transactions
WHERE user_id = ?
  AND YEAR(transaction_date) = ?
  AND MONTH(transaction_date) = ?
GROUP BY type;

-- Recent transactions
SELECT * FROM transactions
WHERE user_id = ?
ORDER BY transaction_date DESC, created_at DESC
LIMIT 10;

-- Transactions theo category
SELECT c.name, t.amount, t.transaction_date
FROM transactions t
JOIN categories c ON t.category_id = c.id
WHERE t.user_id = ?
  AND t.category_id = ?
ORDER BY t.transaction_date DESC;
```

---

### 6. BẢNG `budgets` (Flow 3: Budget Planning)

**Mục đích**: Lập kế hoạch ngân sách theo danh mục và tháng

**Schema:**

```sql
CREATE TABLE budgets (
  id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT 'ID ngân sách',
  user_id BIGINT NOT NULL COMMENT 'ID người dùng',
  category_id BIGINT NOT NULL COMMENT 'ID danh mục (chỉ EXPENSE)',
  budget_amount DECIMAL(12,2) NOT NULL COMMENT 'Số tiền ngân sách (VND)',
  -- ❌ REMOVED: currency_code, budget_amount_in_base_currency (December 5, 2025)
  budget_year INT NOT NULL COMMENT 'Năm ngân sách (VD: 2025)',
  budget_month INT NOT NULL COMMENT 'Tháng ngân sách (1-12)',
  description TEXT COMMENT 'Mô tả ngân sách',
  is_active BOOLEAN DEFAULT TRUE COMMENT 'Kích hoạt/Vô hiệu hóa',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
  UNIQUE KEY unique_user_category_period (user_id, category_id, budget_year, budget_month)
    COMMENT 'Đảm bảo 1 budget per category per month'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Chi tiết các cột:**

| Cột | Type | Constraints | Mô tả chi tiết |
|-----|------|-------------|----------------|
| `id` | BIGINT | PK, AUTO_INCREMENT | ID duy nhất cho mỗi budget |
| `user_id` | BIGINT | FK → users.id, NOT NULL | Owner của budget |
| `category_id` | BIGINT | FK → categories.id, NOT NULL | Danh mục (chỉ EXPENSE categories) |
| `budget_amount` | DECIMAL(12,2) | NOT NULL | Số tiền ngân sách VND cho tháng |
| `budget_year` | INT | NOT NULL | Năm (VD: 2025) |
| `budget_month` | INT | NOT NULL | Tháng (1-12) |
| `description` | TEXT | Nullable | Ghi chú về ngân sách (VD: "Tháng này cần tiết kiệm") |
| `is_active` | BOOLEAN | DEFAULT TRUE | TRUE = đang áp dụng, FALSE = tạm ngưng |
| `created_at` | TIMESTAMP | AUTO | Timestamp tạo budget |
| `updated_at` | TIMESTAMP | AUTO | Timestamp cập nhật cuối |

**Indexes:**
```sql
CREATE INDEX idx_budgets_user_id ON budgets(user_id);
CREATE INDEX idx_budgets_category_id ON budgets(category_id);
CREATE INDEX idx_budgets_year_month ON budgets(budget_year, budget_month);
CREATE UNIQUE INDEX unique_user_category_period
  ON budgets(user_id, category_id, budget_year, budget_month);
```

**Relationships:**
- **Many-to-One** với `users` (user_id) - CASCADE DELETE
- **Many-to-One** với `categories` (category_id) - RESTRICT DELETE

**Business Rules:**
1. **Chỉ EXPENSE categories**: Budget chỉ áp dụng cho danh mục chi tiêu
2. **UNIQUE per month**: Mỗi user chỉ có 1 budget per category per month
3. **budget_amount > 0**: Validate ở service layer
4. **budget_month 1-12**: Validate ở service layer
5. **is_active flag**: Cho phép temporarily disable budget mà không xóa
6. Khi user bị xóa → tất cả budgets bị xóa (CASCADE)
7. Không thể xóa category nếu có active budgets (RESTRICT)

**Budget Tracking Logic:**
```sql
-- Tính tổng chi tiêu actual của category trong tháng
SELECT SUM(amount) as actual_spending
FROM transactions
WHERE user_id = ?
  AND category_id = ?
  AND type = 'EXPENSE'
  AND YEAR(transaction_date) = ?
  AND MONTH(transaction_date) = ?;

-- So sánh với budget
SELECT
  b.budget_amount,
  COALESCE(SUM(t.amount), 0) as actual_spending,
  (COALESCE(SUM(t.amount), 0) / b.budget_amount * 100) as usage_percentage,
  (b.budget_amount - COALESCE(SUM(t.amount), 0)) as remaining
FROM budgets b
LEFT JOIN transactions t ON t.category_id = b.category_id
  AND t.user_id = b.user_id
  AND YEAR(t.transaction_date) = b.budget_year
  AND MONTH(t.transaction_date) = b.budget_month
  AND t.type = 'EXPENSE'
WHERE b.user_id = ?
  AND b.budget_year = ?
  AND b.budget_month = ?
GROUP BY b.id;
```

---

### 7. BẢNG `user_budget_settings` (Flow 3: Budget Warning System)

**Mục đích**: Cấu hình ngưỡng cảnh báo ngân sách cho từng user

**Schema:**

```sql
CREATE TABLE user_budget_settings (
  id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT 'ID',
  user_id BIGINT UNIQUE NOT NULL COMMENT 'ID người dùng (One-to-One)',
  warning_threshold DOUBLE NOT NULL DEFAULT 75.0 COMMENT 'Ngưỡng cảnh báo (%)',
  critical_threshold DOUBLE NOT NULL DEFAULT 90.0 COMMENT 'Ngưỡng nghiêm trọng (%)',
  notifications_enabled BOOLEAN NOT NULL DEFAULT TRUE COMMENT 'Bật/tắt thông báo',
  email_alerts_enabled BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'Bật/tắt email alerts',
  daily_summary_enabled BOOLEAN NOT NULL DEFAULT TRUE COMMENT 'Bật/tắt tóm tắt hàng ngày',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Chi tiết các cột:**

| Cột | Type | Default | Mô tả chi tiết |
|-----|------|---------|----------------|
| `id` | BIGINT | AUTO | ID duy nhất |
| `user_id` | BIGINT | NOT NULL, UNIQUE | ID người dùng (One-to-One relationship) |
| `warning_threshold` | DOUBLE | 75.0 | % chi tiêu để hiển thị cảnh báo vàng (50-100%) |
| `critical_threshold` | DOUBLE | 90.0 | % chi tiêu để hiển thị cảnh báo đỏ (50-100%) |
| `notifications_enabled` | BOOLEAN | TRUE | Master switch cho tất cả notifications |
| `email_alerts_enabled` | BOOLEAN | FALSE | Gửi email khi vượt ngưỡng |
| `daily_summary_enabled` | BOOLEAN | TRUE | Gửi tóm tắt ngân sách hàng ngày |
| `created_at` | TIMESTAMP | AUTO | Timestamp tạo settings |
| `updated_at` | TIMESTAMP | AUTO | Timestamp cập nhật cuối |

**Indexes:**
```sql
CREATE UNIQUE INDEX idx_user_budget_settings_user_id ON user_budget_settings(user_id);
```

**Relationships:**
- **One-to-One** với `users` (user_id) - CASCADE DELETE

**Business Rules:**
1. **One-to-One**: Mỗi user chỉ có 1 settings record
2. **Threshold validation**:
   - warning_threshold: 50% ≤ value ≤ 100%
   - critical_threshold: 50% ≤ value ≤ 100%
   - critical_threshold > warning_threshold
3. **Default creation**: Tự động tạo với defaults khi user đăng ký
4. **Master switch**: notifications_enabled OFF → tắt hết notifications
5. Khi user bị xóa → settings bị xóa (CASCADE)

**Warning Logic:**
```java
// In BudgetService.java
public BudgetWarningLevel checkBudgetWarning(Budget budget, double actualSpending) {
    UserBudgetSettings settings = getSettingsForUser(budget.getUserId());
    double usagePercentage = (actualSpending / budget.getBudgetAmount()) * 100;

    if (usagePercentage >= 100) {
        return BudgetWarningLevel.OVER_BUDGET;
    } else if (usagePercentage >= settings.getCriticalThreshold()) {
        return BudgetWarningLevel.CRITICAL; // Red alert
    } else if (usagePercentage >= settings.getWarningThreshold()) {
        return BudgetWarningLevel.WARNING; // Yellow warning
    } else {
        return BudgetWarningLevel.GOOD; // Green, OK
    }
}
```

---

### 8. BẢNG `scheduled_reports` (Flow 4: Reports & Automation)

**Mục đích**: Lưu cấu hình lịch báo cáo tự động

**Schema:**

```sql
CREATE TABLE scheduled_reports (
  id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT 'ID schedule',
  user_id BIGINT NOT NULL COMMENT 'ID người dùng',
  report_type ENUM('MONTHLY', 'YEARLY', 'CATEGORY') NOT NULL COMMENT 'Loại báo cáo',
  frequency ENUM('DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY') NOT NULL
    COMMENT 'Tần suất gửi',
  format ENUM('PDF', 'CSV', 'BOTH') NOT NULL COMMENT 'Định dạng file',
  email_delivery BOOLEAN NOT NULL DEFAULT TRUE COMMENT 'Gửi qua email',
  is_active BOOLEAN NOT NULL DEFAULT TRUE COMMENT 'Kích hoạt schedule',
  last_run TIMESTAMP NULL COMMENT 'Lần chạy cuối cùng',
  next_run TIMESTAMP NULL COMMENT 'Lần chạy tiếp theo (tự động tính)',
  run_count INT DEFAULT 0 COMMENT 'Số lần đã chạy',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Chi tiết các cột:**

| Cột | Type | Options | Mô tả chi tiết |
|-----|------|---------|----------------|
| `id` | BIGINT | PK | ID duy nhất cho mỗi schedule |
| `user_id` | BIGINT | FK, NOT NULL | Owner của schedule |
| `report_type` | ENUM | MONTHLY/YEARLY/CATEGORY | Loại báo cáo sẽ generate |
| `frequency` | ENUM | DAILY/WEEKLY/MONTHLY/QUARTERLY/YEARLY | Tần suất gửi báo cáo |
| `format` | ENUM | PDF/CSV/BOTH | Định dạng export |
| `email_delivery` | BOOLEAN | DEFAULT TRUE | Gửi báo cáo qua email |
| `is_active` | BOOLEAN | DEFAULT TRUE | Bật/tắt schedule |
| `last_run` | TIMESTAMP | Nullable | Timestamp lần chạy cuối (NULL nếu chưa chạy bao giờ) |
| `next_run` | TIMESTAMP | Nullable | Timestamp lần chạy tiếp theo (tự động tính) |
| `run_count` | INT | DEFAULT 0 | Đếm số lần đã execute |
| `created_at` | TIMESTAMP | AUTO | Timestamp tạo schedule |
| `updated_at` | TIMESTAMP | AUTO | Timestamp cập nhật cuối |

**Indexes:**
```sql
CREATE INDEX idx_scheduled_reports_user_id ON scheduled_reports(user_id);
CREATE INDEX idx_scheduled_reports_next_run ON scheduled_reports(next_run); -- For cron job query
CREATE INDEX idx_scheduled_reports_active ON scheduled_reports(is_active);
```

**Relationships:**
- **Many-to-One** với `users` (user_id) - CASCADE DELETE

**Business Rules:**
1. **Spring @Scheduled cron job**: Chạy mỗi giờ (`@Scheduled(cron = "0 0 * * * *")`)
2. **Auto next_run calculation**: Sau mỗi lần chạy, tự động tính next_run dựa vào frequency
3. **is_active flag**: Cho phép pause schedule mà không xóa
4. **Email check**: Chỉ gửi email nếu email_delivery = TRUE và user.emailNotifications = TRUE
5. Khi user bị xóa → tất cả schedules bị xóa (CASCADE)

**Cron Job Logic:**
```java
@Scheduled(cron = "0 0 * * * *") // Chạy mỗi giờ at minute 0
public void executeScheduledReports() {
    LocalDateTime now = LocalDateTime.now();

    // Find schedules đến hạn
    List<ScheduledReport> dueReports = scheduledReportRepository
        .findByIsActiveTrueAndNextRunBefore(now);

    for (ScheduledReport report : dueReports) {
        try {
            // Generate report
            byte[] reportFile = generateReport(report);

            // Send email if enabled
            if (report.isEmailDelivery()) {
                emailService.sendScheduledReport(report, reportFile);
            }

            // Update metadata
            report.setLastRun(now);
            report.setNextRun(calculateNextRun(now, report.getFrequency()));
            report.setRunCount(report.getRunCount() + 1);
            scheduledReportRepository.save(report);

        } catch (Exception e) {
            logger.error("Failed to execute scheduled report: " + report.getId(), e);
        }
    }
}
```

**Next Run Calculation:**
```java
private LocalDateTime calculateNextRun(LocalDateTime from, Frequency frequency) {
    return switch (frequency) {
        case DAILY -> from.plusDays(1);
        case WEEKLY -> from.plusWeeks(1);
        case MONTHLY -> from.plusMonths(1);
        case QUARTERLY -> from.plusMonths(3);
        case YEARLY -> from.plusYears(1);
    };
}
```

---

### 9. BẢNG `audit_logs` (Flow 5: Admin System)

**Mục đích**: Ghi nhật ký các hoạt động admin quan trọng (privacy-conscious logging)

**Schema:**

```sql
CREATE TABLE audit_logs (
  id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT 'ID log',
  admin_user_id BIGINT COMMENT 'ID admin thực hiện action (nullable)',
  action VARCHAR(100) NOT NULL COMMENT 'Tên action (VD: USER_ACTIVATE)',
  entity_type VARCHAR(50) COMMENT 'Loại entity bị ảnh hưởng (VD: User)',
  entity_id BIGINT COMMENT 'ID entity bị ảnh hưởng',
  old_value TEXT COMMENT 'Giá trị trước khi thay đổi (JSON)',
  new_value TEXT COMMENT 'Giá trị sau khi thay đổi (JSON)',
  ip_address VARCHAR(45) COMMENT 'IP address của admin',
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Thời điểm action',
  FOREIGN KEY (admin_user_id) REFERENCES users(id) ON DELETE SET NULL
    COMMENT 'SET NULL để giữ logs khi admin bị xóa'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Chi tiết các cột:**

| Cột | Type | Constraints | Mô tả chi tiết |
|-----|------|-------------|----------------|
| `id` | BIGINT | PK, AUTO_INCREMENT | ID duy nhất cho mỗi log entry |
| `admin_user_id` | BIGINT | FK → users.id, Nullable | Admin thực hiện action. NULL nếu admin đã bị xóa |
| `action` | VARCHAR(100) | NOT NULL | Tên action (VD: "USER_ACTIVATE", "CONFIG_UPDATE") |
| `entity_type` | VARCHAR(50) | Nullable | Loại entity (VD: "User", "SystemConfig") |
| `entity_id` | BIGINT | Nullable | ID của entity bị thay đổi |
| `old_value` | TEXT | Nullable | Giá trị cũ (JSON format) |
| `new_value` | TEXT | Nullable | Giá trị mới (JSON format) |
| `ip_address` | VARCHAR(45) | Nullable | IP address (IPv4: 15 chars, IPv6: 45 chars) |
| `timestamp` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Thời điểm action xảy ra |

**Action Types (Privacy-Conscious - chỉ log actions quan trọng):**

**✅ Log these (State-changing operations):**
- `USER_ACTIVATE` - Kích hoạt tài khoản user
- `USER_DEACTIVATE` - Vô hiệu hóa tài khoản user
- `CONFIG_CREATE` - Tạo system config mới
- `CONFIG_UPDATE` - Cập nhật system config
- `CONFIG_DELETE` - Xóa system config
- `MAINTENANCE_MODE_ENABLE` - Bật maintenance mode
- `MAINTENANCE_MODE_DISABLE` - Tắt maintenance mode
- `AUDIT_LOG_EXPORT` - Export audit logs
- `AUDIT_LOG_CLEANUP` - Cleanup old logs

**❌ KHÔNG log these (Read operations):**
- DASHBOARD_VIEW, USER_LIST_VIEW, USER_DETAIL_VIEW (browsing không cần log)
- ANALYTICS_VIEW, AUDIT_LOG_VIEW (circular logging)
- CONFIG_LIST_VIEW, FEATURE_FLAGS_VIEW (read-only)

**Indexes:**
```sql
CREATE INDEX idx_audit_logs_admin_user_id ON audit_logs(admin_user_id);
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
```

**Relationships:**
- **Many-to-One** với `users` (admin_user_id) - SET NULL (giữ logs khi admin bị xóa)

**Business Rules:**
1. **Privacy-conscious**: Chỉ log actions quan trọng, KHÔNG log view operations (90%+ log reduction)
2. **SET NULL on DELETE**: Khi admin bị xóa, admin_user_id = NULL nhưng log vẫn giữ
3. **JSON format**: old_value và new_value lưu dưới dạng JSON cho flexibility
4. **IP tracking**: Lưu IP để detect suspicious activities
5. **Immutable**: Audit logs KHÔNG BAO GIỜ được update, chỉ INSERT

**Logging Example:**
```java
@Aspect
@Component
public class AuditLoggingAspect {

    @AfterReturning(pointcut = "@annotation(RequiresAdmin)", returning = "result")
    public void logAdminAction(JoinPoint joinPoint, Object result) {
        Long adminUserId = getCurrentAdminUserId();
        String action = determineAction(joinPoint);

        // CHỈ log nếu là state-changing action
        if (isStateChangingAction(action)) {
            AuditLog log = AuditLog.builder()
                .adminUserId(adminUserId)
                .action(action)
                .entityType(extractEntityType(joinPoint))
                .entityId(extractEntityId(joinPoint))
                .ipAddress(getCurrentIpAddress())
                .timestamp(LocalDateTime.now())
                .build();

            auditLogRepository.save(log);
        }
    }
}
```

---

### 10. BẢNG `system_config` (Flow 5: Admin System)

**Mục đích**: Lưu cấu hình hệ thống có thể thay đổi runtime

**Schema:**

```sql
CREATE TABLE system_config (
  id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT 'ID config',
  config_key VARCHAR(100) UNIQUE NOT NULL COMMENT 'Key duy nhất (VD: maintenance_mode)',
  config_value TEXT NOT NULL COMMENT 'Giá trị config (có thể là JSON)',
  config_type ENUM('FEATURE_FLAG', 'SYSTEM_SETTING', 'INTEGRATION', 'MAINTENANCE') NOT NULL
    COMMENT 'Phân loại config',
  description TEXT COMMENT 'Mô tả config',
  is_active BOOLEAN NOT NULL DEFAULT TRUE COMMENT 'Kích hoạt config',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Chi tiết các cột:**

| Cột | Type | Constraints | Mô tả chi tiết |
|-----|------|-------------|----------------|
| `id` | BIGINT | PK, AUTO_INCREMENT | ID duy nhất |
| `config_key` | VARCHAR(100) | UNIQUE, NOT NULL | Key duy nhất (VD: "maintenance_mode", "max_upload_size") |
| `config_value` | TEXT | NOT NULL | Giá trị (có thể là string, number, boolean, JSON) |
| `config_type` | ENUM | FEATURE_FLAG/SYSTEM_SETTING/INTEGRATION/MAINTENANCE | Phân loại để dễ quản lý |
| `description` | TEXT | Nullable | Mô tả chi tiết config |
| `is_active` | BOOLEAN | DEFAULT TRUE | Bật/tắt config |
| `created_at` | TIMESTAMP | AUTO | Timestamp tạo config |
| `updated_at` | TIMESTAMP | AUTO | Timestamp cập nhật cuối |

**Config Types:**

**1. FEATURE_FLAG** - Bật/tắt tính năng:
```json
{
  "config_key": "enable_scheduled_reports",
  "config_value": "true",
  "config_type": "FEATURE_FLAG",
  "description": "Enable/disable scheduled report generation"
}
```

**2. SYSTEM_SETTING** - Cấu hình hệ thống:
```json
{
  "config_key": "max_upload_size_mb",
  "config_value": "16",
  "config_type": "SYSTEM_SETTING",
  "description": "Maximum avatar upload size in MB"
}
```

**3. INTEGRATION** - Cấu hình integration:
```json
{
  "config_key": "smtp_server",
  "config_value": "{\"host\":\"sandbox.smtp.mailtrap.io\",\"port\":2525}",
  "config_type": "INTEGRATION",
  "description": "SMTP server configuration"
}
```

**4. MAINTENANCE** - Maintenance mode:
```json
{
  "config_key": "maintenance_mode",
  "config_value": "false",
  "config_type": "MAINTENANCE",
  "description": "System-wide maintenance mode"
}
```

**Indexes:**
```sql
CREATE UNIQUE INDEX idx_system_config_key ON system_config(config_key);
CREATE INDEX idx_system_config_type ON system_config(config_type);
CREATE INDEX idx_system_config_active ON system_config(is_active);
```

**Relationships:**
- Không có foreign keys (standalone table)

**Business Rules:**
1. **config_key phải unique**: Không được trùng
2. **Runtime changeable**: Admin có thể update config mà không cần restart app
3. **Type validation**: Service layer validate config_value dựa vào config_type
4. **Audit logged**: Mọi thay đổi config đều được log vào audit_logs
5. **JSON support**: config_value có thể chứa JSON cho complex configs

---

### 11. BẢNG `user_preferences` (Flow 6: UX Enhancement)

**Mục đích**: Lưu tùy chọn cá nhân hóa của user

**Schema:**

```sql
CREATE TABLE user_preferences (
  id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT 'ID',
  user_id BIGINT UNIQUE NOT NULL COMMENT 'ID người dùng (One-to-One)',
  -- Display Preferences (7 fields - mostly deprecated)
  language VARCHAR(10) DEFAULT 'vi' COMMENT 'Ngôn ngữ (deprecated - no i18n)',
  currency VARCHAR(10) DEFAULT 'VND' COMMENT 'Tiền tệ (deprecated - VND hardcoded)',
  date_format VARCHAR(20) DEFAULT 'dd/MM/yyyy' COMMENT 'Định dạng ngày (deprecated)',
  timezone VARCHAR(50) DEFAULT 'Asia/Ho_Chi_Minh' COMMENT 'Timezone (deprecated)',
  theme VARCHAR(20) DEFAULT 'light' COMMENT 'Theme (deprecated - no dark mode UI)',
  items_per_page INT DEFAULT 10 COMMENT 'Số items mỗi page (deprecated - hardcoded)',
  view_mode VARCHAR(20) DEFAULT 'detailed' COMMENT '✅ ACTIVE: List view mode (usage/basic)',
  -- Notification Preferences (6 fields - 3 active)
  email_notifications BOOLEAN DEFAULT TRUE COMMENT '✅ ACTIVE: Master email switch',
  budget_alerts BOOLEAN DEFAULT TRUE COMMENT '✅ ACTIVE: Budget threshold emails',
  transaction_reminders BOOLEAN DEFAULT TRUE COMMENT 'deprecated - feature not exist',
  weekly_summary BOOLEAN DEFAULT FALSE COMMENT 'deprecated - auto-sent to all',
  monthly_summary BOOLEAN DEFAULT TRUE COMMENT 'deprecated - auto-sent to all',
  goal_reminders BOOLEAN DEFAULT FALSE COMMENT 'deprecated - goal feature not exist',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Chi tiết 3 Active Preferences:**

| Preference | Type | Default | Mô tả | Status |
|-----------|------|---------|-------|--------|
| `view_mode` | VARCHAR(20) | 'detailed' | List view mode: "usage" (với analytics) hoặc "basic" (simple list). Dùng trong BudgetsPage | ✅ ACTIVE |
| `email_notifications` | BOOLEAN | TRUE | Master switch cho tất cả emails. Nếu FALSE → không gửi email nào | ✅ ACTIVE |
| `budget_alerts` | BOOLEAN | TRUE | Gửi email khi vượt budget threshold (75%/90%). Chỉ hoạt động nếu email_notifications = TRUE | ✅ ACTIVE |

**10 Deprecated Preferences** (tồn tại trong DB nhưng không dùng):
1. `language` - Không có i18n system
2. `currency` - VND hardcoded (multi-currency removed)
3. `date_format` - dd/MM/yyyy hardcoded
4. `timezone` - Asia/Ho_Chi_Minh hardcoded
5. `theme` - Dark mode removed from frontend
6. `items_per_page` - Pagination hardcoded to 10
7. `transaction_reminders` - Feature doesn't exist
8. `weekly_summary` - Auto-sent to all users (not preference-based)
9. `monthly_summary` - Auto-sent to all users (not preference-based)
10. `goal_reminders` - Goal feature doesn't exist

**Indexes:**
```sql
CREATE UNIQUE INDEX idx_user_preferences_user_id ON user_preferences(user_id);
```

**Relationships:**
- **One-to-One** với `users` (user_id) - CASCADE DELETE

**Business Rules:**
1. **One-to-One**: Mỗi user có đúng 1 preferences record
2. **Auto-create on registration**: Tạo với defaults khi user đăng ký
3. **Master email switch**: email_notifications = FALSE → tắt hết emails
4. Khi user bị xóa → preferences bị xóa (CASCADE)

---

### 12. BẢNG `onboarding_progress` (Flow 6: UX Enhancement)

**Mục đích**: Theo dõi tiến trình onboarding 4 bước cho user mới

**Schema:**

```sql
CREATE TABLE onboarding_progress (
  id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT 'ID',
  user_id BIGINT UNIQUE NOT NULL COMMENT 'ID người dùng (One-to-One)',
  current_step INT DEFAULT 1 COMMENT 'Bước hiện tại (1-4)',
  steps_completed INT DEFAULT 0 COMMENT 'Số bước đã hoàn thành (0-4)',
  step1_completed BOOLEAN DEFAULT FALSE COMMENT 'Hoàn thiện profile',
  step2_completed BOOLEAN DEFAULT FALSE COMMENT 'Thêm giao dịch đầu tiên',
  step3_completed BOOLEAN DEFAULT FALSE COMMENT 'Tạo ngân sách đầu tiên',
  step4_completed BOOLEAN DEFAULT FALSE COMMENT 'Xem báo cáo đầu tiên',
  is_completed BOOLEAN DEFAULT FALSE COMMENT 'Hoàn thành toàn bộ onboarding',
  is_skipped BOOLEAN DEFAULT FALSE COMMENT 'User đã skip onboarding',
  completed_at TIMESTAMP NULL COMMENT 'Thời điểm hoàn thành',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**4 bước Onboarding:**

| Bước | Tên | Trigger | Mô tả |
|------|-----|---------|-------|
| 1 | Complete Profile | ProfilePage update | User điền đầy đủ: full_name, phone_number, avatar |
| 2 | Add First Transaction | Create transaction | User tạo giao dịch thu hoặc chi đầu tiên |
| 3 | Create First Budget | Create budget | User lập ngân sách cho 1 category |
| 4 | View First Report | Open report page | User xem báo cáo tháng/năm/category |

**Chi tiết các cột:**

| Cột | Type | Default | Mô tả chi tiết |
|-----|------|---------|----------------|
| `id` | BIGINT | AUTO | ID duy nhất |
| `user_id` | BIGINT | UNIQUE, NOT NULL | One-to-One với users |
| `current_step` | INT | 1 | Bước đang thực hiện (1-4) |
| `steps_completed` | INT | 0 | Counter: số bước đã hoàn thành |
| `step1_completed` | BOOLEAN | FALSE | Hoàn thiện profile |
| `step2_completed` | BOOLEAN | FALSE | Giao dịch đầu tiên |
| `step3_completed` | BOOLEAN | FALSE | Ngân sách đầu tiên |
| `step4_completed` | BOOLEAN | FALSE | Báo cáo đầu tiên |
| `is_completed` | BOOLEAN | FALSE | TRUE khi tất cả 4 steps xong |
| `is_skipped` | BOOLEAN | FALSE | TRUE nếu user skip wizard |
| `completed_at` | TIMESTAMP | NULL | Timestamp hoàn thành (NULL nếu chưa xong) |
| `created_at` | TIMESTAMP | AUTO | Timestamp tạo |
| `updated_at` | TIMESTAMP | AUTO | Timestamp cập nhật cuối |

**Indexes:**
```sql
CREATE UNIQUE INDEX idx_onboarding_progress_user_id ON onboarding_progress(user_id);
```

**Relationships:**
- **One-to-One** với `users` (user_id) - CASCADE DELETE

**Business Rules:**
1. **One-to-One**: Mỗi user có đúng 1 onboarding record
2. **Auto-create on registration**: Tạo khi user đăng ký
3. **Auto-show wizard**: OnboardingWizard modal hiện tự động nếu !is_completed && !is_skipped
4. **Step completion**: Trigger từ các service layers khi user thực hiện actions
5. **Skip option**: User có thể skip, sau đó restart từ settings
6. **Progress calculation**: `(steps_completed / 4) * 100`%
7. Khi user bị xóa → onboarding progress bị xóa (CASCADE)

**Business Logic:**
```java
public void completeStep(Long userId, int stepNumber) {
    OnboardingProgress progress = findByUserId(userId);

    // Update specific step
    switch (stepNumber) {
        case 1 -> progress.setStep1Completed(true);
        case 2 -> progress.setStep2Completed(true);
        case 3 -> progress.setStep3Completed(true);
        case 4 -> progress.setStep4Completed(true);
    }

    // Recalculate counters
    int completed = 0;
    if (progress.isStep1Completed()) completed++;
    if (progress.isStep2Completed()) completed++;
    if (progress.isStep3Completed()) completed++;
    if (progress.isStep4Completed()) completed++;

    progress.setStepsCompleted(completed);

    // Check if all done
    if (completed == 4) {
        progress.setCompleted(true);
        progress.setCompletedAt(LocalDateTime.now());
    }

    // Update current_step to next incomplete step
    progress.setCurrentStep(calculateNextStep(progress));

    save(progress);
}
```

---

## 📊 ENTITY RELATIONSHIP DIAGRAM (FULL)

**Comprehensive ER Diagram showing all 12 tables and relationships:**

```
┌────────────────────────────────────────────────────────────────────────────────┐
│                        MYFINANCE DATABASE SCHEMA                               │
│                         12 Tables - Complete Relationships                     │
└────────────────────────────────────────────────────────────────────────────────┘


┌──────────────────────┐
│      users           │◄──────────────────┐
├──────────────────────┤                   │ Many-to-Many
│ • id (PK)            │                   │ (via user_roles)
│ • email (UK)         │                   │
│ • password           │       ┌───────────┴─────────┐
│ • full_name          │       │                     │
│ • phone_number       │       │          ┌──────────▼─────────┐
│ • address            │       │          │     roles          │
│ • date_of_birth      │       │          ├────────────────────┤
│ • avatar (MEDIUMTEXT)│       │          │ • id (PK)          │
│ • created_at         │       │          │ • name (UK)        │
│ • updated_at         │       │          │   (USER/ADMIN/     │
└───────┬──────────────┘       │          │    SUPER_ADMIN)    │
        │                      │          │ • description      │
        │ 1                    │ Many     │ • created_at       │
        │                      │          └────────────────────┘
        │                      │
        │              ┌───────▼─────────┐
        │              │   user_roles    │
        │              ├─────────────────┤
        │              │ • id (PK)       │
        │              │ • user_id (FK)  │
        │              │ • role_id (FK)  │
        │              │ • created_at    │
        │              └─────────────────┘
        │
        ├──────────────────┬─────────────────┬──────────────────┬─────────────────┐
        │ 1                │ 1               │ 1                │ 1               │ 1
        │                  │                 │                  │                 │
        │ Many             │ Many            │ Many             │ 1-to-1          │ 1-to-1
┌───────▼──────────┐  ┌───▼────────────┐  ┌─▼────────────┐  ┌─▼─────────────┐  ┌─▼─────────────┐
│  categories      │  │  transactions  │  │   budgets    │  │user_budget    │  │user_preferences│
├──────────────────┤  ├────────────────┤  ├──────────────┤  │  _settings    │  ├────────────────┤
│ • id (PK)        │  │ • id (PK)      │  │ • id (PK)    │  ├───────────────┤  │ • id (PK)      │
│ • user_id (FK)   │◄─┤ • user_id (FK) │  │ • user_id(FK)│  │ • id (PK)     │  │ • user_id(FK UK)│
│ • name           │  │ • category_id  │  │ • category_id│  │ • user_id(FKUK│  │ • viewMode     │
│ • type           │  │   (FK)         │  │   (FK)       │  │ • warning...  │  │ • emailNot...  │
│   (INCOME/       │  │ • amount       │  │ • budget...  │  │ • critical... │  │ • budgetAlerts │
│    EXPENSE)      │  │ • type         │  │ • budget_year│  │ • notif...    │  │ • ... (10 more)│
│ • color          │  │ • description  │  │ • budget_    │  │ • email...    │  │ • created_at   │
│ • icon           │  │ • trans...date │  │   month      │  │ • daily...    │  │ • updated_at   │
│ • is_default     │  │ • created_at   │  │ • description│  │ • created_at  │  └────────────────┘
│ • created_at     │  │ • updated_at   │  │ • is_active  │  │ • updated_at  │
│ • updated_at     │  └────────────────┘  │ • created_at │  └───────────────┘
└──────────────────┘                      │ • updated_at │
        ▲                                 └──────────────┘      ┌────────────────┐
        │                                         ▲             │ onboarding_    │
        │ 1                                       │ 1           │   progress     │
        │                                         │             ├────────────────┤
        │                                         │             │ • id (PK)      │
        └─────────────────────────────────────────┘             │ • user_id(FKUK)│◄──┐
                                                                │ • current_step │   │
                                                                │ • steps_compl..│   │
        ┌───────────────────────────────────────────┐           │ • step1-4...   │   │
        │                                           │           │ • is_completed │   │
        │ Many                                      │ Many      │ • is_skipped   │   │ 1-to-1
        │                                           │           │ • completed_at │   │
┌───────▼──────────────┐              ┌─────────────▼────────┐ │ • created_at   │   │
│ scheduled_reports    │              │    audit_logs        │ │ • updated_at   │   │
├──────────────────────┤              ├──────────────────────┤ └────────────────┘   │
│ • id (PK)            │              │ • id (PK)            │                      │
│ • user_id (FK)       │              │ • admin_user_id (FK) │◄─────────────────────┘
│ • report_type        │              │   (SET NULL)         │
│ • frequency          │              │ • action             │
│ • format             │              │ • entity_type        │
│ • email_delivery     │              │ • entity_id          │
│ • is_active          │              │ • old_value (JSON)   │
│ • last_run           │              │ • new_value (JSON)   │
│ • next_run           │              │ • ip_address         │
│ • run_count          │              │ • timestamp          │
│ • created_at         │              └──────────────────────┘
│ • updated_at         │
└──────────────────────┘

                           ┌────────────────────┐
                           │  system_config     │ (Standalone - No FKs)
                           ├────────────────────┤
                           │ • id (PK)          │
                           │ • config_key (UK)  │
                           │ • config_value     │
                           │ • config_type      │
                           │ • description      │
                           │ • is_active        │
                           │ • created_at       │
                           │ • updated_at       │
                           └────────────────────┘

LEGEND:
─────── : Foreign Key Relationship
◄────── : Direction of relationship (arrow points to referenced table)
PK      : Primary Key
FK      : Foreign Key
UK      : Unique Key (One-to-One if FK+UK)
```

---

## 🔗 FOREIGN KEY CONSTRAINTS SUMMARY

**Cascade Behaviors:**

| Child Table | Parent Table | FK Column | ON DELETE | Lý do |
|------------|--------------|-----------|-----------|-------|
| `user_roles` | `users` | user_id | CASCADE | Xóa user → xóa all role assignments |
| `user_roles` | `roles` | role_id | CASCADE | Xóa role → xóa all assignments |
| `categories` | `users` | user_id | CASCADE | Xóa user → xóa all categories |
| `transactions` | `users` | user_id | CASCADE | Xóa user → xóa all transactions |
| `transactions` | `categories` | category_id | RESTRICT | Không cho xóa category nếu có transactions |
| `budgets` | `users` | user_id | CASCADE | Xóa user → xóa all budgets |
| `budgets` | `categories` | category_id | RESTRICT | Không cho xóa category nếu có budgets |
| `user_budget_settings` | `users` | user_id | CASCADE | Xóa user → xóa settings |
| `scheduled_reports` | `users` | user_id | CASCADE | Xóa user → xóa all schedules |
| `audit_logs` | `users` | admin_user_id | SET NULL | Giữ logs khi admin bị xóa |
| `user_preferences` | `users` | user_id | CASCADE | Xóa user → xóa preferences |
| `onboarding_progress` | `users` | user_id | CASCADE | Xóa user → xóa onboarding |

---

## 📈 PERFORMANCE OPTIMIZATION

### Indexes Summary

**All Foreign Keys have indexes** (tự động hoặc explicit):
```sql
-- users table
CREATE UNIQUE INDEX idx_users_email ON users(email);

-- categories table
CREATE INDEX idx_categories_user_id ON categories(user_id);
CREATE INDEX idx_categories_type ON categories(type);
CREATE INDEX idx_categories_user_type ON categories(user_id, type);

-- transactions table
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_category_id ON transactions(category_id);
CREATE INDEX idx_transactions_date ON transactions(transaction_date);
CREATE INDEX idx_transactions_user_date ON transactions(user_id, transaction_date);

-- budgets table
CREATE INDEX idx_budgets_user_id ON budgets(user_id);
CREATE INDEX idx_budgets_category_id ON budgets(category_id);
CREATE INDEX idx_budgets_year_month ON budgets(budget_year, budget_month);
CREATE UNIQUE INDEX unique_user_category_period
  ON budgets(user_id, category_id, budget_year, budget_month);

-- scheduled_reports table
CREATE INDEX idx_scheduled_reports_user_id ON scheduled_reports(user_id);
CREATE INDEX idx_scheduled_reports_next_run ON scheduled_reports(next_run);

-- audit_logs table
CREATE INDEX idx_audit_logs_admin_user_id ON audit_logs(admin_user_id);
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp);

-- system_config table
CREATE UNIQUE INDEX idx_system_config_key ON system_config(config_key);
```

### Query Optimization Tips

**1. Sử dụng Composite Indexes:**
```sql
-- Tốt: Composite index for user + date range queries
SELECT * FROM transactions
WHERE user_id = ? AND transaction_date BETWEEN ? AND ?;
-- Uses: idx_transactions_user_date

-- Tốt: Composite index for user + category type
SELECT * FROM categories
WHERE user_id = ? AND type = 'EXPENSE';
-- Uses: idx_categories_user_type
```

**2. Avoid SELECT *:**
```sql
-- Xấu
SELECT * FROM transactions WHERE user_id = ?;

-- Tốt
SELECT id, amount, description, transaction_date
FROM transactions WHERE user_id = ?;
```

**3. Use JPA @EntityGraph để tránh N+1:**
```java
@EntityGraph(attributePaths = {"category"})
@Query("SELECT t FROM Transaction t WHERE t.userId = :userId")
List<Transaction> findByUserIdWithCategory(@Param("userId") Long userId);
```

---

## ✅ KÊNH VÀ TOOLS ĐỂ VISUALIZE DATABASE

### Recommended Tools:

1. **MySQL Workbench** (Free, Official)
   - Reverse Engineer: Database → Create ERD tự động
   - Export as PNG/SVG/PDF
   - Zoom in/out support

2. **dbdiagram.io** (Free, Web-based)
   - DBML syntax → Beautiful diagrams
   - Export as PDF/PNG
   - Shareable links

3. **Draw.io** (Free, Web-based)
   - Manual drawing nhưng professional
   - Export as PNG/SVG/PDF

4. **DBeaver** (Free, Multi-DB)
   - ERD visualization
   - SQL execution
   - Data browsing

---

# KẾT LUẬN

Tài liệu này cung cấp giải thích chi tiết về:
- ✅ 12 bảng với mọi cột và constraints
- ✅ Relationships và foreign keys
- ✅ Business rules và validation
- ✅ Indexes và performance optimization
- ✅ JPA entity mappings
- ✅ Common queries và use cases
- ✅ Migration strategy (Hibernate DDL Auto)
- ✅ ASCII ER diagram có thể zoom

**Sử dụng tài liệu này để:**
1. Hiểu rõ database schema
2. Tạo visual diagrams cho thuyết trình
3. Trả lời câu hỏi về database design
4. Debug issues liên quan đến data
5. Plan future schema changes

Chúc bạn thành công với bài thuyết trình! 🚀
