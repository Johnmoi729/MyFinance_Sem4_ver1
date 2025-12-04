# MyFinance Database Setup

This directory contains the complete database initialization script for the MyFinance application.

**Last Updated**: October 28, 2025

## Files

### `complete-database-init.sql`
Complete database initialization script that includes:
- **Flow 1**: User authentication and management tables (with extended profile: avatar, address, date of birth)
- **Flow 2**: Categories and transactions tables
- **Flow 3**: Budget planning and user budget settings tables
- **Flow 4**: Reports and scheduled reports tables
- **Flow 5**: Admin system (roles, audit logs, system configuration) tables
- **Flow 6A**: UX enhancements (user preferences, onboarding progress) tables

This script can be used to:
1. Create a fresh MyFinance database from scratch
2. Understand the complete database schema
3. Set up development or production environments
4. Reference for manual database updates

## Database Migration Strategy

**MyFinance uses Hibernate DDL** (`spring.jpa.hibernate.ddl-auto=update`), NOT Flyway migrations.

### For Fresh Installation:
```sql
-- Run this in MySQL/MariaDB to create the complete database
source complete-database-init.sql;
```

### For Existing Database:
The Spring Boot application will automatically create tables from JPA entities when it starts.
- Hibernate will create new tables automatically
- Hibernate will add new columns to existing tables
- **Manual SQL required** for: column type changes, data migrations, complex schema updates

## Database Schema Overview

### Core Tables (12 tables):

#### Flow 1: Authentication & User Management
- `users` - User accounts, authentication, extended profile (avatar, address, date of birth)

#### Flow 2: Categories & Transactions
- `categories` - Transaction categories (income/expense)
- `transactions` - Financial transactions

#### Flow 3: Budget Planning
- `budgets` - Budget planning per category/month
- `user_budget_settings` - Budget threshold settings (warning/critical alerts)

#### Flow 4: Reports & Analytics
- `scheduled_reports` - Automated report generation and email delivery

#### Flow 5: Admin System
- `roles` - User roles (USER, ADMIN, SUPER_ADMIN)
- `user_roles` - User-role assignments
- `audit_logs` - System activity audit trail (privacy-conscious logging)
- `system_config` - System-wide configuration settings

#### Flow 6A: UX Enhancement
- `user_preferences` - User preferences (display, notifications, privacy - 19 settings)
- `onboarding_progress` - 4-step onboarding wizard tracking

## Default Data

The script automatically creates:
- Default user roles (USER, ADMIN, SUPER_ADMIN)
- Essential system configurations
- Proper indexes for performance
- Foreign key constraints for data integrity

## Notes

- All tables use `IF NOT EXISTS` for safe re-execution
- Uses `INSERT IGNORE` for default data to prevent duplicates
- Includes comprehensive indexing for optimal performance
- Compatible with Spring Boot JPA entities