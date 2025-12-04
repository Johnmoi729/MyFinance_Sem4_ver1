# Database Schema Management Strategy

**Last Updated**: October 28, 2025
**Migration Approach**: Hibernate DDL Auto (NOT Flyway)

---

## 📋 OVERVIEW

MyFinance uses **Hibernate DDL Auto** for automatic database schema management. The database schema is managed entirely through JPA @Entity classes, not SQL migration files.

### Current Configuration

```properties
# application.properties
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

### What This Means

| Aspect | Details |
|--------|---------|
| **Migration Framework** | ❌ None (No Flyway, No Liquibase) |
| **Schema Source** | ✅ JPA @Entity classes are the source of truth |
| **Table Creation** | ✅ Automatic on first startup |
| **Column Addition** | ✅ Automatic when new fields added to entities |
| **Column Modification** | ⚠️ Manual SQL required |
| **Data Migration** | ⚠️ Manual SQL required |

---

## 🏗️ HOW HIBERNATE DDL WORKS

### On Application Startup

1. **Hibernate reads all @Entity classes** in `com.myfinance.entity` package
2. **Compares entities to database schema**
3. **Automatically creates:**
   - Missing tables
   - Missing columns
   - Indexes defined in @Index annotations
4. **Does NOT automatically modify:**
   - Existing column types
   - Existing column constraints
   - Existing data

### Example: How User.java Creates the users Table

```java
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(name = "avatar", columnDefinition = "MEDIUMTEXT")
    private String avatar;  // Hibernate creates this column automatically

    // ... other fields
}
```

**Result**: On first startup, Hibernate creates the `users` table with all these columns automatically.

---

## 📊 CURRENT DATABASE SCHEMA (12 TABLES)

All tables below were created by Hibernate from @Entity classes:

### Flow 1: Authentication & User Management
- ✅ `users` - Created from `User.java` entity
  - Extended profile fields: `address`, `date_of_birth`, `avatar` (MEDIUMTEXT)

### Flow 2: Categories & Transactions
- ✅ `categories` - Created from `Category.java` entity
- ✅ `transactions` - Created from `Transaction.java` entity

### Flow 3: Budget Planning
- ✅ `budgets` - Created from `Budget.java` entity
- ✅ `user_budget_settings` - Created from `UserBudgetSettings.java` entity

### Flow 4: Reports & Analytics
- ✅ `scheduled_reports` - Created from `ScheduledReport.java` entity

### Flow 5: Admin System
- ✅ `roles` - Created from `Role.java` entity
- ✅ `user_roles` - Created from `UserRole.java` entity
- ✅ `audit_logs` - Created from `AuditLog.java` entity
- ✅ `system_config` - Created from `SystemConfig.java` entity

### Flow 6A: UX Enhancement
- ✅ `user_preferences` - Created from `UserPreferences.java` entity
- ✅ `onboarding_progress` - Created from `OnboardingProgress.java` entity

---

## 📁 DATABASE REFERENCE FILES

### complete-database-init.sql

**Location**: `database/complete-database-init.sql`
**Purpose**: Reference documentation and fresh installation script
**Last Updated**: October 28, 2025 (includes Flow 6A)

**Use Cases**:
1. ✅ **Reference Documentation** - See complete schema structure
2. ✅ **Fresh Installation** - Create database manually without Spring Boot
3. ✅ **Development Setup** - Quick database initialization for new developers

**When to Use**:
```bash
# For fresh development environment
mysql -u root -p < database/complete-database-init.sql

# Then start Spring Boot - Hibernate will validate schema matches entities
```

**When NOT to Use**:
- ❌ On existing database with data (will cause conflicts)
- ❌ For production deployments (use Hibernate auto-update instead)

---

## 🔄 SCHEMA UPDATE WORKFLOW

### Adding New Fields (Automatic)

When you add a new field to an entity:

```java
// UserPreferences.java
@Entity
public class UserPreferences {
    // Existing fields...

    @Column(name = "new_setting")
    private String newSetting;  // Add this field
}
```

**What Happens**:
1. Restart Spring Boot application
2. Hibernate detects new field
3. **Automatically runs**: `ALTER TABLE user_preferences ADD COLUMN new_setting VARCHAR(255)`
4. ✅ Done! No manual SQL needed

### Modifying Existing Columns (Manual)

When you change a column type in an entity:

```java
// User.java - Changed columnDefinition
@Column(name = "avatar", columnDefinition = "MEDIUMTEXT")
private String avatar;  // Was TEXT, now MEDIUMTEXT
```

**What Happens**:
1. Restart Spring Boot - Hibernate does NOT auto-modify column type
2. ⚠️ **Manual SQL Required**:
   ```sql
   ALTER TABLE users MODIFY COLUMN avatar MEDIUMTEXT;
   ```
3. Restart again - Now entity matches database

**Why Manual?**
- Changing column types can cause data loss
- Hibernate plays it safe and requires manual intervention

---

## 🛠️ MANUAL MIGRATION EXAMPLES

### Example 1: Expand Column Size (Completed October 28, 2025)

**Situation**: Avatar column too small (TEXT = 64KB) for base64 images

**Entity Change**:
```java
// Before
@Column(name = "avatar", columnDefinition = "TEXT")
private String avatar;

// After
@Column(name = "avatar", columnDefinition = "MEDIUMTEXT")
private String avatar;
```

**Manual SQL Required**:
```sql
USE myfinance;
ALTER TABLE users MODIFY COLUMN avatar MEDIUMTEXT COMMENT 'Base64 encoded avatar image (max 16MB)';
```

**Result**: ✅ Avatar uploads now work (up to 16MB)

### Example 2: Add New Table (Automatic)

**Situation**: Adding Flow 6A features

**Entity Created**:
```java
@Entity
@Table(name = "user_preferences")
public class UserPreferences {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", unique = true)
    private Long userId;

    // ... 19 preference fields
}
```

**What Happened**:
1. Restart Spring Boot
2. Hibernate detected new entity
3. **Automatically created** `user_preferences` table with all 19 columns
4. ✅ No manual SQL needed

---

## ⚠️ IMPORTANT LIMITATIONS

### What Hibernate CAN Do

✅ Create new tables
✅ Add new columns
✅ Create indexes
✅ Set up foreign keys
✅ Handle @ManyToOne, @OneToMany relationships

### What Hibernate CANNOT Do

❌ Modify existing column types (TEXT → MEDIUMTEXT)
❌ Rename columns (requires manual SQL)
❌ Migrate existing data
❌ Complex schema refactoring
❌ Drop columns (safety feature)

### When Manual SQL is Required

1. **Column Type Changes**: TEXT → MEDIUMTEXT, INT → BIGINT, etc.
2. **Column Renames**: `old_name` → `new_name`
3. **Data Migrations**: Moving data between tables
4. **Complex Constraints**: Check constraints, custom triggers
5. **Index Modifications**: Changing existing indexes

---

## 🎯 RECOMMENDED PRACTICES

### For Development

1. ✅ Keep `spring.jpa.hibernate.ddl-auto=update`
2. ✅ Let Hibernate create tables/columns automatically
3. ✅ Use `complete-database-init.sql` for fresh setups
4. ✅ Run manual SQL for column type changes
5. ✅ Test schema changes locally before production

### For Production

1. ✅ Keep `spring.jpa.hibernate.ddl-auto=update`
2. ✅ Hibernate will add new columns automatically
3. ⚠️ Run manual SQL for column modifications **before** deployment
4. ✅ Backup database before any manual schema changes
5. ✅ Test schema updates on staging environment first

### Schema Change Checklist

**Before deploying entity changes:**

- [ ] New tables/columns? → ✅ Hibernate handles automatically
- [ ] Column type changes? → ⚠️ Run manual ALTER TABLE first
- [ ] Data migration needed? → ⚠️ Write and test migration script
- [ ] Tested on staging? → ✅ Required before production
- [ ] Database backup? → ✅ Always before manual changes

---

## 📚 MIGRATION HISTORY

### October 28, 2025: Flyway Removed

**What Changed**:
- ❌ Deleted `MyFinance Backend/src/main/resources/db/migration/` folder
- ❌ Removed V1__Complete_Database_Schema.sql
- ❌ Removed V2__Add_Flow6A_Features.sql
- ❌ Removed V3__Extend_Avatar_Column.sql
- ✅ Updated `complete-database-init.sql` to include all Flows 1-6A
- ✅ Updated documentation to reflect Hibernate DDL approach

**Why Removed**:
- Flyway was never installed in `pom.xml`
- Migration files never executed (dormant)
- Hibernate DDL already handled all schema creation
- Simplified architecture - entities are single source of truth

**Impact**:
- ✅ No functional changes (migrations never ran anyway)
- ✅ Cleaner codebase (removed unused files)
- ✅ Clearer documentation (reflects actual implementation)

### Schema Evolution Timeline

| Date | Change | Method |
|------|--------|--------|
| Sep 2025 | Flows 1-5 tables | Hibernate auto-created from entities |
| Oct 28, 2025 | Flow 6A tables added | Hibernate auto-created from new entities |
| Oct 28, 2025 | Avatar column expanded | Manual SQL: TEXT → MEDIUMTEXT |
| Future | Flow 6B-6G features | Hibernate will auto-create from entities |

---

## 🔍 VERIFICATION

### Check What Hibernate Created

```sql
-- Show all tables
SHOW TABLES;

-- Show structure of users table
DESCRIBE users;

-- Verify avatar column size
SHOW FULL COLUMNS FROM users LIKE 'avatar';
-- Should show: Type = mediumtext

-- Count records in each table
SELECT
    (SELECT COUNT(*) FROM users) as users_count,
    (SELECT COUNT(*) FROM user_preferences) as user_preferences_count,
    (SELECT COUNT(*) FROM onboarding_progress) as onboarding_progress_count,
    (SELECT COUNT(*) FROM scheduled_reports) as scheduled_reports_count;
```

---

## 📖 SUMMARY

### Current Approach: Hibernate DDL Auto

**Advantages**:
- ✅ No migration framework dependencies
- ✅ Entities are single source of truth
- ✅ Automatic table/column creation
- ✅ Simpler development workflow
- ✅ No version tracking overhead

**Trade-offs**:
- ⚠️ Manual SQL for column type changes
- ⚠️ No automatic rollback capability
- ⚠️ Requires discipline for production changes

### Files to Reference

1. **Entity Classes** (`MyFinance Backend/src/main/java/com/myfinance/entity/`)
   - Source of truth for database schema
   - Review entities to understand current schema

2. **complete-database-init.sql** (`database/complete-database-init.sql`)
   - Reference documentation
   - Fresh installation script
   - Updated October 28, 2025 with Flow 6A

3. **database/README.md**
   - Quick reference guide
   - Usage instructions

---

**Remember**: With Hibernate DDL, your @Entity classes define the schema. No migration files needed!

