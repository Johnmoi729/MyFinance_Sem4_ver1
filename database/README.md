# MyFinance Database Setup

This directory contains the complete database initialization script for the MyFinance application.

## Files

### `complete-database-init.sql`
Complete database initialization script that includes:
- **Flow 1**: User authentication and management tables
- **Flow 2**: Categories and transactions tables
- **Flow 3**: Budget planning and user budget settings tables
- **Flow 5**: Admin system (roles, audit logs, system configuration) tables

This script can be used to:
1. Create a fresh MyFinance database from scratch
2. Understand the complete database schema
3. Set up development or production environments

## Usage

### For Fresh Installation:
```sql
-- Run this in MySQL to create the complete database
source complete-database-init.sql;
```

### For Existing Database:
The Spring Boot application will automatically handle migrations using Flyway.
The migration file is located at:
`MyFinance Backend/src/main/resources/db/migration/V1__Complete_Database_Schema.sql`

## Database Schema Overview

### Core Tables:
- `users` - User accounts and authentication
- `categories` - Transaction categories (income/expense)
- `transactions` - Financial transactions
- `budgets` - Budget planning per category/month
- `user_budget_settings` - Budget threshold settings

### Admin Tables:
- `roles` - User roles (USER, ADMIN, SUPER_ADMIN)
- `user_roles` - User-role assignments
- `audit_logs` - System activity audit trail
- `system_config` - System-wide configuration settings

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