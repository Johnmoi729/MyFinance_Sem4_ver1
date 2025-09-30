# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**MyFinance** - Personal Finance Management Web Application
- **Goal**: Help users track income/expenses, categorize spending, set budgets, and generate financial reports
- **Target**: Simple, user-friendly interface accessible on multiple platforms
- **Security**: Secure data with synchronization capabilities

MyFinance is a full-stack personal finance management application with:
- **Backend**: Spring Boot REST API with MySQL database, JWT authentication, and comprehensive financial transaction management
- **Frontend**: React application with Tailwind CSS for responsive UI

---

## Technical Architecture

### Core Technology Stack
- **Frontend**: ReactJS + Tailwind CSS + ShadCN UI + React Query + Zustand
- **Backend**: Java Spring Boot + Spring Security + JPA/Hibernate + MySQL
- **Authentication**: JWT + Refresh Tokens
- **Charts**: Recharts (frontend visualization)
- **API Documentation**: Swagger/OpenAPI 3
- **Development**: Postman, GitHub, Hot reload

### Backend (MyFinance Backend)
- **Framework**: Spring Boot 3.5.5 with Java 17
- **Database**: MySQL with JPA/Hibernate ORM
- **Authentication**: JWT-based security with Spring Security
- **Package Structure**:
  - `config/` - Security, database, and web configuration
  - `controller/` - REST API endpoints (AuthController, TransactionController, BudgetController)
  - `dto/` - Data transfer objects for requests/responses
  - `entity/` - JPA entities (User, Transaction, Category, Budget)
  - `repository/` - Data access layer
  - `service/` - Business logic layer
  - `security/` - JWT and authentication utilities
  - `exception/` - Custom exception handling
  - `util/` - Common utilities

### Frontend (myfinance-frontend)
- **Framework**: React 19.1.1 with Create React App
- **Routing**: React Router DOM v7
- **Styling**: Tailwind CSS with responsive design
- **Testing**: React Testing Library with Jest
- **Structure**:
  - `components/` - Reusable UI components (auth, common, transaction, budget)
  - `pages/` - Route-based page components (auth, dashboard, transactions, budgets)
  - `context/` - React context providers (Auth, Transaction, Budget, Category)
  - `hooks/` - Custom React hooks
  - `services/` - API communication layer
  - `utils/` - Helper functions

---

## 📋 DEVELOPMENT ROADMAP

### 🟢 **FLOW 1: Authentication & User Management** [COMPLETED]

**Phase 1A: Core Authentication**
- ✅ User registration with email validation
- ✅ Login/logout functionality with JWT tokens
- ✅ Password encryption (BCrypt)
- ✅ JWT token management (access + refresh tokens)
- ✅ User session handling

**Phase 1B: User Profile & Security**
- ✅ User profile management
- ✅ Password change functionality
- ✅ Account settings
- ✅ Security middleware and request validation

**Phase 1C: Dashboard Foundation**
- ✅ Main dashboard layout
- ✅ Navigation structure
- ✅ User greeting and basic stats display
- ✅ Responsive design implementation

---

### 🟢 **FLOW 2: Transaction & Category Management** [COMPLETED]

**Phase 2A: Category System**
- ✅ Create/Edit/Delete categories
- ✅ Default Vietnamese categories (14 categories: 5 income, 9 expense)
- ✅ Category icons and color coding
- ✅ Category filtering by type (INCOME/EXPENSE)
- ✅ Category validation and user ownership

**Phase 2B: Transaction Management**
- ✅ Add/Edit/Delete transactions
- ✅ Transaction categorization
- ✅ Date selection and validation
- ✅ Amount input with Vietnamese currency formatting
- ✅ Transaction descriptions and notes

**Phase 2C: Transaction Features**
- ✅ Transaction listing with pagination
- ✅ Search and filtering capabilities
- ✅ Transaction type filtering (Income/Expense)
- ✅ Date range filtering with Vietnamese date format (dd/mm/yyyy)
- ✅ Category-based filtering
- ✅ Real-time balance calculations
- ✅ Recent transactions display

---

### 🟢 **FLOW 3: Budget Planning Module** [COMPLETED]

**✅ Phase 3A: Budget Management Foundation** [COMPLETED]
- ✅ Budget entity design (MySQL tables)
- ✅ Budget CRUD operations (Create/Read/Update/Delete)
- ✅ Budget-Category relationship (only EXPENSE categories)
- ✅ Monthly/Yearly budget planning
- ✅ Budget validation (prevent duplicates per category/period)
- ✅ Budget filtering system (category, year, month)
- ✅ Budget UI pages matching transaction design patterns
- ✅ Budget service layer with proper error handling

**✅ Phase 3B: Budget Tracking & Warnings** [COMPLETED]
- **Real-time Budget Tracking**:
  - ✅ Calculate actual spending vs budget limits per category
  - ✅ Display spending percentage with visual progress bars
  - ✅ Show remaining budget amounts with status messages
  - ✅ Color-coded budget status (Green/Yellow/Red)
  - ✅ Real-time updates when transactions change

- **Intelligent Warning System**:
  - ✅ Configurable threshold alerts (user-customizable 50-100%)
  - ✅ Over-budget notifications when limits exceeded
  - ✅ Multi-level warnings (Warning/Critical/Over-budget)
  - ✅ User settings page for threshold configuration
  - ✅ Default thresholds: 75% warning, 90% critical

- **Budget Analytics & Visualization**:
  - ✅ Budget usage analytics with comprehensive DTOs
  - ✅ Budget warning system with alert management
  - ✅ Budget performance metrics and trends
  - ✅ Visual progress components (BudgetProgressBar, BudgetStatusBadge)
  - ✅ Budget usage cards with detailed information
  - ✅ Warning alert components with action buttons

- **Dashboard Integration**:
  - ✅ Budget overview widget on main dashboard (3-column layout)
  - ✅ Real-time budget status alerts and summaries
  - ✅ Quick access to budget warnings and management
  - ✅ Integration with existing quick actions

---

### 🔲 **FLOW 4: Reports & Analytics Module** [NOT STARTED]

**Phase 4A: Basic Reporting**
- **Monthly/Yearly Reports**:
  - Income vs Expense summary reports
  - Category-wise spending breakdown
  - Monthly spending trends
  - Year-over-year comparison
  - Export functionality (PDF/CSV)

**Phase 4B: Advanced Analytics**
- **Visual Analytics**:
  - Pie charts for expense categories
  - Bar charts for monthly trends
  - Line charts for spending patterns
  - Budget vs actual spending visualizations
  - Interactive charts with drill-down capabilities

- **Financial Insights**:
  - Spending pattern analysis
  - Category performance insights
  - Budget efficiency reports
  - Financial health scoring
  - Automated recommendations

**Phase 4C: Custom Reports**
- **Custom Report Builder**:
  - User-defined date ranges
  - Custom category combinations
  - Flexible filtering options
  - Scheduled report generation
  - Report sharing capabilities

---

### 🟡 **FLOW 5: Admin System & Management** [IN PROGRESS]

**✅ Phase 5A: Foundation & Security** [COMPLETED]
- **Role-Based Access Control (RBAC)**:
  - ✅ Role entities (USER, ADMIN, SUPER_ADMIN)
  - ✅ Permission-based authorization system
  - ✅ Enhanced JWT with roles and permissions
  - ✅ User role assignment functionality

- **Database Schema Extensions**:
  - ✅ roles, user_roles, system_config, audit_logs tables
  - ✅ Migration scripts for existing users
  - ✅ Role-based database indexes
  - ✅ Audit trail infrastructure

- **Security Infrastructure**:
  - ✅ Admin authentication middleware (@RequiresAdmin annotation)
  - ✅ Permission validation (AdminAuthorizationAspect)
  - ✅ Audit logging aspect for sensitive operations
  - ⚠️ IP-based access restrictions (logging only, no restrictions)

**✅ Phase 5B: Core Admin Features** [COMPLETED]
- **User Management Dashboard**:
  - ✅ User overview and statistics (backend & frontend)
  - ✅ Search, filter, and pagination (frontend implemented)
  - ✅ User account actions (activate/deactivate frontend)
  - ✅ User activity monitoring and details (backend APIs)

- **System Analytics & Insights**:
  - ✅ Financial metrics dashboard (backend APIs)
  - ✅ User behavior analytics (backend APIs)
  - ✅ System health monitoring (backend APIs)
  - ✅ Admin dashboard with key metrics (frontend implemented)

- **Basic Configuration Panel**:
  - ✅ Feature flag management (backend APIs)
  - ✅ System-wide settings (backend APIs)
  - ✅ Default category management (existing from Flow 2)
  - ✅ Maintenance mode controls (backend APIs)

**🔲 Phase 5C: Advanced Admin Features** [NOT STARTED]
- **Security & Audit Management**:
  - Comprehensive audit log viewer
  - Security event monitoring
  - Permission management interface
  - Data privacy and GDPR compliance tools

- **Financial Overview & Business Intelligence**:
  - Advanced transaction analytics
  - Budget effectiveness analysis
  - User financial health insights
  - Custom report generation and export

- **System Configuration & Integration**:
  - Advanced system settings
  - Third-party integration management
  - API key and external service configuration
  - Performance monitoring and optimization tools

**Phase 5D: Optional Extensions** [FUTURE]
- **Multi-Tenant Management**: Organization support, white-label options
- **Advanced Analytics**: ML insights, prediction models, anomaly detection
- **Communication Tools**: In-app messaging, email campaigns, notifications
- **Advanced Security**: 2FA, penetration testing, advanced session management

---

## 🗄️ DATABASE SCHEMA

### Core Tables (Implemented)
```sql
-- Users table
users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Categories table  
categories (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  name VARCHAR(255) NOT NULL,
  type ENUM('INCOME', 'EXPENSE') NOT NULL,
  color VARCHAR(7), -- Hex color code
  icon VARCHAR(50),
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Transactions table
transactions (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  category_id BIGINT NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  type ENUM('INCOME', 'EXPENSE') NOT NULL,
  description TEXT,
  transaction_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT
);

-- Budgets table
budgets (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  category_id BIGINT NOT NULL,
  budget_amount DECIMAL(12,2) NOT NULL,
  budget_year INT NOT NULL,
  budget_month INT NOT NULL, -- 1-12
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
  UNIQUE KEY unique_user_category_period (user_id, category_id, budget_year, budget_month)
);

-- User Budget Settings table (Flow 3B)
user_budget_settings (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT UNIQUE NOT NULL,
  warning_threshold DOUBLE NOT NULL DEFAULT 75.0, -- Percentage for warning alerts
  critical_threshold DOUBLE NOT NULL DEFAULT 90.0, -- Percentage for critical alerts
  notifications_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  email_alerts_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  daily_summary_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### Future Tables (Phase 4)
```sql
-- Reports table (Phase 4)
reports (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  report_type VARCHAR(50) NOT NULL,
  parameters JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- User Settings table (Phase 4)
user_settings (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT UNIQUE NOT NULL,
  theme ENUM('LIGHT', 'DARK') DEFAULT 'LIGHT',
  language VARCHAR(5) DEFAULT 'vi',
  currency VARCHAR(3) DEFAULT 'VND',
  notifications BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

---

## 🔌 API ENDPOINT STRUCTURE

### Authentication Endpoints
```
POST /api/auth/login - User login
POST /api/auth/register - User registration
POST /api/auth/refresh-token - Refresh JWT token
GET  /api/auth/profile - Get user profile
PUT  /api/auth/profile - Update user profile
POST /api/auth/change-password - Change password
POST /api/auth/forgot-password - Request password reset
POST /api/auth/reset-password - Reset password
POST /api/auth/verify-token - Verify JWT token
```

### Category Endpoints
```
GET    /api/categories - Get user categories (with type filter)
POST   /api/categories - Create new category
GET    /api/categories/{id} - Get category by ID
PUT    /api/categories/{id} - Update category
DELETE /api/categories/{id} - Delete category
```

### Transaction Endpoints
```
GET    /api/transactions - Get user transactions (with filters)
POST   /api/transactions - Create new transaction
GET    /api/transactions/{id} - Get transaction by ID
PUT    /api/transactions/{id} - Update transaction
DELETE /api/transactions/{id} - Delete transaction
GET    /api/transactions/recent - Get recent transactions
GET    /api/transactions/filter - Advanced filtering
GET    /api/transactions/search?searchTerm={term} - Search transactions
```

### Budget Endpoints
```
GET    /api/budgets - Get user budgets (with filters: year, month, categoryId)
POST   /api/budgets - Create new budget
GET    /api/budgets/{id} - Get budget by ID
PUT    /api/budgets/{id} - Update budget
DELETE /api/budgets/{id} - Delete budget
GET    /api/budgets/current - Get current month budgets
GET    /api/budgets/period/{year}/{month} - Get budgets for specific period
GET    /api/budgets/test - Debug endpoint for troubleshooting

// Budget Analytics (Phase 3B - Completed)
GET    /api/budgets/analytics/usage - All budget usage analytics
GET    /api/budgets/analytics/usage/current - Current month budget usage
GET    /api/budgets/analytics/warnings - Budget warning alerts
GET    /api/budgets/analytics/performance - Budget performance metrics
GET    /api/budgets/analytics/dashboard - Dashboard budget summary
```

### Budget Settings Endpoints (Phase 3B)
```
GET    /api/budget-settings - Get user budget threshold settings
PUT    /api/budget-settings - Update user budget threshold settings
POST   /api/budget-settings/reset - Reset settings to defaults
```

### Admin Endpoints (Phase 5A & 5B - Completed)
```
// Admin Setup & Authentication
POST   /api/admin/setup/create-admin - Create admin user
POST   /api/admin/setup/promote-user/{userId} - Promote user to admin
GET    /api/admin/setup/check-admin-exists - Check if admin exists

// User Management Dashboard
GET    /api/admin/users - Get users with pagination, search, filtering
GET    /api/admin/users/{userId} - Get user details
PUT    /api/admin/users/{userId}/status - Update user status (activate/deactivate)
GET    /api/admin/users/statistics - Get user statistics

// Admin Dashboard & Analytics
GET    /api/admin/dashboard - Admin dashboard summary
GET    /api/admin/dashboard/user-activity - User activity trends
GET    /api/admin/dashboard/transaction-trends - Transaction analytics
GET    /api/admin/dashboard/system-health - System health status
GET    /api/admin/dashboard/audit-summary - Audit log summary

// System Configuration Management
GET    /api/admin/config - List system configurations
POST   /api/admin/config - Create configuration
PUT    /api/admin/config/{configKey} - Update configuration
DELETE /api/admin/config/{configKey} - Delete configuration
GET    /api/admin/config/maintenance-mode - Get maintenance status
PUT    /api/admin/config/maintenance-mode - Set maintenance mode
GET    /api/admin/config/feature-flags - Get feature flags

// Audit Management
GET    /api/admin/audit - List audit logs with advanced filtering
GET    /api/admin/audit/{auditId} - Get audit log details
GET    /api/admin/audit/statistics - Audit statistics
GET    /api/admin/audit/admin-activity/{adminUserId} - Admin activity logs
GET    /api/admin/audit/recent - Recent audit activities
GET    /api/admin/audit/export - Export audit logs (placeholder)
```

### Reports Endpoints (Phase 4 - Future)
```
GET    /api/reports/summary/{period} - Get financial summary
GET    /api/reports/category-breakdown - Category spending breakdown
GET    /api/reports/trends - Spending trends analysis
POST   /api/reports/custom - Generate custom report
GET    /api/reports/export/{format} - Export reports (PDF/CSV)
```

---

## Development Commands

### Backend
```bash
cd "MyFinance Backend"
mvn spring-boot:run          # Start development server on port 8080
mvn test                     # Run tests
mvn clean package            # Build JAR file
mvn clean compile            # Compile source code
```

### Frontend
```bash
cd myfinance-frontend
npm start                    # Start development server on port 3000
npm test                     # Run tests in watch mode
npm run build                # Build for production
```

## Database Configuration

- **Development**: MySQL database `myfinance` on localhost:3306
- **Connection**: Username `root`, empty password (development setup)
- **Schema**: Auto-generated via Hibernate DDL with `spring.jpa.hibernate.ddl-auto=update`

## Admin Access

### Default Admin Credentials
- **Email**: `admin@myfinance.com`
- **Password**: `admin123`
- **Role**: `ADMIN`

### Creating Admin User
```bash
# Create admin user via API
POST http://localhost:8080/api/admin/setup/create-admin
Content-Type: application/x-www-form-urlencoded

email=admin@myfinance.com
password=admin123
fullName=System Administrator
roleType=ADMIN

# Login as admin
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
    "email": "admin@myfinance.com",
    "password": "admin123"
}

# Access admin endpoints (use JWT token from login)
GET http://localhost:8080/api/admin/dashboard
Authorization: Bearer your_jwt_token
```

## Key Technologies

### Backend Stack
- Spring Boot Starters: Web, Data JPA, Security, Validation
- MySQL Connector
- JWT (jsonwebtoken 0.11.5)
- Lombok for boilerplate reduction
- Spring Boot DevTools for development

### Frontend Stack
- React with modern hooks and functional components
- React Router for client-side routing
- Tailwind CSS for utility-first styling
- React Query for API state management
- Testing utilities for component testing

## Important Implementation Details

### Default Categories
- New users automatically get 14 default categories (5 income, 9 expense)
- Categories include common Vietnamese financial categories with colors and icons
- Created via `CategoryService.createDefaultCategoriesForUser()` during registration
- Automatic timestamp management with @PrePersist and @PreUpdate annotations
- Transaction dependency validation prevents category deletion when transactions exist

### Transaction Management
- Full CRUD operations for transactions with proper validation
- Category-transaction relationship enforced at service layer
- Transaction filtering by type (INCOME/EXPENSE), category, date range
- Recent transactions display on dashboard
- Vietnamese date format support (dd/mm/yyyy)

### Budget Management
- Budget planning for expense categories only
- Monthly/yearly budget periods
- Duplicate prevention per category/period combination
- Advanced filtering by category, year, month
- Soft delete with is_active flag (isActive field)
- Budget period calculations with isCurrentMonth() business logic
- Debug endpoints for development troubleshooting

### Frontend State Management
- **Context Providers**: AuthContext, TransactionContext, BudgetContext, CategoryContext
- **Object-oriented API Service Layer**: Base ApiService class with specialized service classes
- Real-time balance calculations (income - expenses)
- Automatic data refresh after CRUD operations
- Proper React Router navigation (no window.location usage)
- Vietnamese date formatting with custom VietnameseDateInput component (dd/mm/yyyy)

## Security Notes

- JWT tokens configured with custom secret key
- Token expiration set to 24 hours (86400000ms)
- Spring Security handles authentication and authorization
- CORS configuration in WebConfig for frontend communication
- Proper user authorization on all transaction and budget operations
- User ownership validation patterns across all services (manual userId foreign keys)
- EAGER fetching for category relationships to prevent N+1 queries
- SQL injection prevention with JPA/Hibernate
- XSS protection with input validation
- Vietnamese error messages for better user experience

---

## 🎯 CURRENT STATUS & NEXT STEPS

### Current Status
- **Flow 1**: ✅ Authentication & Dashboard - **100% Complete**
- **Flow 2**: ✅ Transactions & Categories - **100% Complete**
- **Flow 3**: ✅ Budget Planning - **100% Complete** (All phases completed)
- **Flow 4**: ❌ Reports & Analytics - **0% Complete**
- **Flow 5**: ❌ Admin System & Management - **0% Complete** (NEW ADDITION)

### Next Priority: Flow 5A - Admin System Foundation
**Immediate Tasks**:
1. Implement RBAC (Role-Based Access Control) system
2. Create admin database schema (roles, user_roles, audit_logs)
3. Enhance JWT with roles and permissions
4. Build admin authentication and authorization
5. Create admin API endpoints structure

**Technical Requirements**:
- Database schema extensions with proper migrations
- Security enhancements with permission-based access control
- Admin-specific API controllers with proper authorization
- Audit logging infrastructure for admin actions
- Admin frontend routing and layout structure

### Long-term Roadmap
- Complete Flow 5A (Admin Foundation & Security)
- Begin Flow 5B (Core Admin Features)
- Implement Flow 5C (Advanced Admin Features)
- Optional: Flow 4A (Basic Reporting) integration with admin
- Optional: Flow 5D (Advanced Admin Extensions)
- Performance optimization and testing
- Production deployment preparation

---

## 📝 Important Implementation Notes

### Code Style & Conventions
- **Backend**: Follow Spring Boot conventions, use Lombok annotations
- **Frontend**: Use functional components with hooks, Tailwind utility classes
- **Database**: Use snake_case for columns, camelCase for Java fields
- **API**: RESTful design, consistent error handling, proper HTTP status codes
- **Security**: Always validate user ownership of resources

### Testing Strategy
- **Backend**: Unit tests for services, integration tests for controllers
- **Frontend**: Component tests with React Testing Library
- **API**: Test all endpoints with Postman collections
- **Database**: Test data integrity and constraint validation

### Deployment Considerations
- **Environment Variables**: Database credentials, JWT secrets
- **CORS**: Configure for production domain
- **Database**: Migration strategy for production
- **Monitoring**: Logging and error tracking setup

---

## 🏛️ **COMPREHENSIVE CODE PATTERNS & ARCHITECTURE GUIDE**

This section documents all established patterns and conventions in the MyFinance codebase to ensure consistency in future development.

### 🎯 **Backend Patterns**

#### **Controller Pattern**
```java
@RestController
@RequestMapping("/api/[entity]")
@RequiredArgsConstructor
@Slf4j  // Only when logging is needed
public class EntityController {
    private final EntityService entityService;
    private final JwtUtil jwtUtil;

    @PostMapping
    public ResponseEntity<ApiResponse<EntityResponse>> createEntity(
            @Valid @RequestBody EntityRequest request,
            @RequestHeader("Authorization") String authHeader) {

        Long userId = extractUserIdFromToken(authHeader);
        EntityResponse response = entityService.createEntity(request, userId);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Vietnamese success message", response));
    }

    private Long extractUserIdFromToken(String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        return jwtUtil.extractUserId(token);
    }
}
```

**Controller Conventions:**
- Use `@RestController` + `@RequestMapping("/api/prefix")`
- `@RequiredArgsConstructor` for dependency injection
- Consistent JWT token extraction: `extractUserIdFromToken(authHeader)`
- All responses wrapped in `ApiResponse<T>`
- Vietnamese success/error messages
- HTTP status codes: 201 (creation), 200 (success), 404 (not found), 400 (bad request)

#### **Service Layer Pattern**
```java
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional  // On class or methods as needed
public class EntityService {
    private final EntityRepository entityRepository;
    private final RelatedRepository relatedRepository;

    public EntityResponse createEntity(EntityRequest request, Long userId) {
        // 1. Validate input and user permissions
        // 2. Check business rules
        // 3. Create and populate entity
        // 4. Save to repository
        // 5. Map to response DTO
        return mapToEntityResponse(savedEntity);
    }

    // Always validate user ownership
    private Entity validateUserOwnership(Long entityId, Long userId) {
        return entityRepository.findByIdAndUserId(entityId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Vietnamese error message"));
    }
}
```

#### **Entity Design Pattern**
```java
@Entity
@Table(name = "entity_table", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "business_key"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Entity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    @NotNull
    private Long userId;  // Manual FK for security

    @ManyToOne(fetch = FetchType.EAGER)  // EAGER for frequently accessed
    @JoinColumn(name = "category_id", nullable = false)
    @NotNull
    private Category category;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

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

#### **DTO Pattern**
```java
// Request DTO
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EntityRequest {
    @NotNull(message = "Vietnamese validation message")
    @Positive(message = "Vietnamese validation message")
    private BigDecimal amount;

    @NotBlank(message = "Vietnamese validation message")
    private String description;
}

// Response DTO
@Data
@Builder
public class EntityResponse {
    private Long id;
    private BigDecimal amount;
    private String description;
    private CategoryResponse category;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
```

### 🎨 **Frontend Patterns**

#### **React Component Pattern**
```javascript
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEntityContext } from '../../context/EntityContext';

const EntityPage = () => {
    const navigate = useNavigate();
    const { entities, loading, error, fetchEntities, clearError } = useEntityContext();
    const [localState, setLocalState] = useState(initialState);

    // useCallback for expensive operations
    const handleAction = useCallback(async (data) => {
        try {
            await someAsyncOperation(data);
            // Handle success
        } catch (err) {
            console.error('Error:', err);
        }
    }, [dependency]);

    // useEffect with proper dependencies
    useEffect(() => {
        fetchEntities();
    }, []); // Empty for mount-only, or specific dependencies

    if (loading) {
        return (
            <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <p className="mt-2 text-gray-600">Đang tải...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Page content */}
            </div>
        </div>
    );
};

export default EntityPage;
```

#### **Context Provider Pattern**
```javascript
import React, { createContext, useContext, useState, useCallback } from 'react';
import { entityAPI } from '../services/api';
import { useAuth } from './AuthContext';

const EntityContext = createContext();

export const useEntity = () => {
    const context = useContext(EntityContext);
    if (!context) {
        throw new Error('useEntity must be used within an EntityProvider');
    }
    return context;
};

export const EntityProvider = ({ children }) => {
    const { user } = useAuth();
    const [entities, setEntities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchEntities = useCallback(async (filters = {}) => {
        if (!user) return;

        setLoading(true);
        setError('');

        try {
            const response = await entityAPI.getEntities(filters);
            if (response && response.success) {
                setEntities(response.data || []);
            } else {
                setEntities([]);
                setError(response.message || 'Vietnamese error message');
            }
        } catch (err) {
            setError(err.message || 'Vietnamese error message');
            setEntities([]);
        } finally {
            setLoading(false);
        }
    }, [user]);

    const clearError = useCallback(() => {
        setError('');
    }, []);

    const value = {
        entities,
        loading,
        error,
        fetchEntities,
        clearError
    };

    return (
        <EntityContext.Provider value={value}>
            {children}
        </EntityContext.Provider>
    );
};
```

#### **API Service Pattern**
```javascript
// services/api.js
class EntityAPI extends ApiService {
    async createEntity(entityData) {
        try {
            const response = await this.post('/api/entities', entityData);
            return response;
        } catch (error) {
            return {
                success: false,
                message: 'Vietnamese error message'
            };
        }
    }

    async getEntities(filters = {}) {
        try {
            const params = new URLSearchParams();
            Object.keys(filters).forEach(key => {
                if (filters[key]) params.append(key, filters[key]);
            });

            const queryString = params.toString();
            const url = queryString ? `/api/entities?${queryString}` : '/api/entities';
            const response = await this.get(url);
            return response;
        } catch (error) {
            return {
                success: false,
                message: 'Vietnamese error message',
                data: []
            };
        }
    }
}

// Export singleton instance
const entityAPI = new EntityAPI();
export { entityAPI };
```

### 🎨 **UI/UX Patterns**

#### **Tailwind CSS Conventions**
```javascript
// Color System
const colorPatterns = {
    primary: 'bg-blue-500 hover:bg-blue-600 text-white',
    success: 'bg-green-100 text-green-700 border-green-300',
    danger: 'bg-red-100 text-red-700 border-red-300',
    warning: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    neutral: 'bg-gray-50 text-gray-600'
};

// Component Patterns
const componentStyles = {
    card: 'bg-white rounded-lg shadow-md p-6',
    button: 'px-4 py-2 rounded-lg font-medium transition-colors',
    input: 'w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500',
    container: 'max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8'
};
```

#### **Form Patterns**
```javascript
const FormPage = () => {
    const [formData, setFormData] = useState(initialFormData);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        clearError(); // Clear error on input change
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Process form data
            await submitForm(formData);
            // Handle success (navigate, show message, etc.)
        } catch (err) {
            setError(err.message || 'Vietnamese error message');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            )}

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vietnamese Label *
                </label>
                <input
                    type="text"
                    name="fieldName"
                    value={formData.fieldName}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="Vietnamese placeholder"
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white py-2 px-4 rounded-md font-medium transition-colors"
            >
                {loading ? 'Đang xử lý...' : 'Vietnamese Action'}
            </button>
        </form>
    );
};
```

### 🔒 **Security Patterns**

#### **User Ownership Validation**
```java
// Service Layer - Always validate ownership
public EntityResponse updateEntity(Long entityId, EntityRequest request, Long userId) {
    Entity entity = entityRepository.findByIdAndUserId(entityId, userId)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy dữ liệu"));

    // Update logic...
    return mapToResponse(savedEntity);
}
```

#### **JWT Token Management**
```javascript
// Frontend - Check token validity
isAuthenticated() {
    const token = this.getAuthToken();
    if (!token) return false;

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Date.now() / 1000;
        return payload.exp > currentTime;
    } catch (error) {
        return false;
    }
}
```

### 📊 **Error Handling Patterns**

#### **Backend Error Handling**
```java
@ControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleResourceNotFound(ResourceNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error(ex.getMessage()));
    }
}
```

#### **Frontend Error Handling**
```javascript
// API Service Level
try {
    const response = await this.post('/api/endpoint', data);
    return response;
} catch (error) {
    return {
        success: false,
        message: 'Vietnamese error message specific to operation'
    };
}

// Component Level
{error && (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {error}
    </div>
)}
```

### 🌐 **Internationalization Pattern**

#### **Vietnamese Localization**
```javascript
// All user-facing text should be in Vietnamese
const messages = {
    loading: 'Đang tải...',
    saving: 'Đang lưu...',
    success: 'Thành công!',
    error: 'Đã xảy ra lỗi',
    confirm: 'Bạn có chắc chắn?',
    cancel: 'Hủy',
    save: 'Lưu',
    edit: 'Chỉnh sửa',
    delete: 'Xóa'
};

// Date formatting
const formatVietnameseDate = (date) => {
    return new Date(date).toLocaleDateString('vi-VN');
};

// Currency formatting
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
};
```

### 🚀 **Performance Patterns**

#### **React Performance**
```javascript
// Use useCallback for expensive operations
const expensiveOperation = useCallback(async (data) => {
    // Expensive logic
}, [dependency]);

// Use useMemo for expensive calculations
const expensiveValue = useMemo(() => {
    return complexCalculation(data);
}, [data]);

// Parallel API calls
const loadData = useCallback(async () => {
    const [data1, data2, data3] = await Promise.all([
        api.getData1(),
        api.getData2(),
        api.getData3()
    ]);
}, []);
```

#### **Backend Performance**
```java
// Use EAGER fetching for frequently accessed relationships
@ManyToOne(fetch = FetchType.EAGER)
@JoinColumn(name = "category_id")
private Category category;

// Use @Transactional for data consistency
@Transactional
public EntityResponse createEntity(EntityRequest request, Long userId) {
    // Transactional logic
}
```

---

This comprehensive documentation serves as the complete reference for the MyFinance project development and should be maintained as the project evolves.

# important-instruction-reminders
Do what has been asked; nothing more, nothing less.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (*.md) or README files. Only create documentation files if explicitly requested by the User.