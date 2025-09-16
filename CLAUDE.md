# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MyFinance is a full-stack personal finance management application with:
- **Backend**: Spring Boot REST API with MySQL database, JWT authentication, and comprehensive financial transaction management
- **Frontend**: React application with Tailwind CSS for responsive UI

## Architecture

### Backend (MyFinance Backend)
- **Framework**: Spring Boot 3.5.5 with Java 17
- **Database**: MySQL with JPA/Hibernate ORM
- **Authentication**: JWT-based security with Spring Security
- **Package Structure**:
  - `config/` - Security, database, and web configuration
  - `controller/` - REST API endpoints (AuthController, TransactionController)
  - `dto/` - Data transfer objects for requests/responses
  - `entity/` - JPA entities
  - `repository/` - Data access layer
  - `service/` - Business logic layer
  - `security/` - JWT and authentication utilities
  - `exception/` - Custom exception handling
  - `util/` - Common utilities

### Frontend (myfinance-frontend)
- **Framework**: React 19.1.1 with Create React App
- **Routing**: React Router DOM v7
- **Styling**: Tailwind CSS
- **Testing**: React Testing Library with Jest
- **Structure**:
  - `components/` - Reusable UI components (auth, common, transaction)
  - `pages/` - Route-based page components (auth, dashboard, transactions)
  - `context/` - React context providers
  - `hooks/` - Custom React hooks
  - `services/` - API communication layer
  - `utils/` - Helper functions

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
- Testing utilities for component testing

## Important Implementation Details

### Default Categories
- New users automatically get 14 default categories (5 income, 9 expense)
- Categories include common Vietnamese financial categories with colors and icons
- Created via `CategoryService.createDefaultCategoriesForUser()` during registration

### Transaction Management
- Full CRUD operations for transactions with proper validation
- Category-transaction relationship enforced at service layer
- Transaction filtering by type (INCOME/EXPENSE)
- Recent transactions display on dashboard

### Frontend State Management
- `TransactionContext` provides centralized transaction state management
- Real-time balance calculations (income - expenses)
- Automatic data refresh after CRUD operations
- Proper React Router navigation (no window.location usage)

## Security Notes

- JWT tokens configured with custom secret key
- Token expiration set to 24 hours (86400000ms)
- Spring Security handles authentication and authorization
- CORS configuration in WebConfig for frontend communication
- Proper user authorization on all transaction operations