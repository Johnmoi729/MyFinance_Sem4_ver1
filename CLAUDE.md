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

### 🟡 **FLOW 3: Budget Planning Module** [50% COMPLETED]

**✅ Phase 3A: Budget Management Foundation** [COMPLETED]
- ✅ Budget entity design (MySQL tables)
- ✅ Budget CRUD operations (Create/Read/Update/Delete)
- ✅ Budget-Category relationship (only EXPENSE categories)
- ✅ Monthly/Yearly budget planning
- ✅ Budget validation (prevent duplicates per category/period)
- ✅ Budget filtering system (category, year, month)
- ✅ Budget UI pages matching transaction design patterns
- ✅ Budget service layer with proper error handling

**🔲 Phase 3B: Budget Tracking & Warnings** [PENDING - NEXT PHASE]
- **Real-time Budget Tracking**:
  - Calculate actual spending vs budget limits per category
  - Display spending percentage (e.g., "75% of budget used")
  - Show remaining budget amounts
  - Visual progress bars for budget usage
  
- **Intelligent Warning System**:
  - Configurable threshold alerts (50%, 75%, 90% usage)
  - Over-budget notifications when limits exceeded
  - Predictive warnings based on spending patterns
  - Color-coded budget status (Green/Yellow/Red)
  
- **Budget Analytics**:
  - Monthly budget performance comparisons
  - Category spending trends vs budgets
  - Budget optimization suggestions
  - Historical budget vs actual analysis
  
- **Dashboard Integration**:
  - Budget overview widget on main dashboard
  - Quick budget status alerts
  - Summary cards showing total budgeted vs actual spending

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

// Phase 3B - Budget Analytics (Pending)
GET    /api/budgets/analytics/usage - Budget usage analytics
GET    /api/budgets/analytics/warnings - Budget warning status
GET    /api/budgets/analytics/performance - Budget performance metrics
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
- **Flow 3**: 🟡 Budget Planning - **50% Complete** (Phase 3A done, Phase 3B pending)
- **Flow 4**: ❌ Reports & Analytics - **0% Complete**

### Next Priority: Phase 3B - Budget Tracking & Warnings
**Immediate Tasks**:
1. Implement budget vs actual spending calculations
2. Create budget warning threshold system  
3. Add budget progress visualization components
4. Integrate budget status into dashboard
5. Develop budget analytics endpoints

**Technical Requirements**:
- New service methods for budget calculations
- Real-time budget status updates when transactions are added
- Enhanced frontend components for budget visualization  
- Database queries for budget performance analytics

### Long-term Roadmap
- Complete Flow 3B (Budget Tracking & Warnings)
- Begin Flow 4A (Basic Reporting)
- Implement Flow 4B (Advanced Analytics) 
- Add Flow 4C (Custom Reports)
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

This comprehensive documentation serves as the complete reference for the MyFinance project development and should be maintained as the project evolves.

# important-instruction-reminders
Do what has been asked; nothing more, nothing less.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (*.md) or README files. Only create documentation files if explicitly requested by the User.