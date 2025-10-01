#!/usr/bin/env python3
"""
Script to remove unnecessary VIEW audit logs from admin controllers
Following the audit logging policy: don't log non-actionable read operations
"""

import re
import os

# Controllers to process
controllers = [
    r"MyFinance Backend\src\main\java\com\myfinance\controller\AdminAnalyticsController.java",
    r"MyFinance Backend\src\main\java\com\myfinance\controller\AdminAuditController.java",
    r"MyFinance Backend\src\main\java\com\myfinance\controller\AdminConfigController.java",
    r"MyFinance Backend\src\main\java\com\myfinance\controller\AdminMigrationController.java",
    r"MyFinance Backend\src\main\java\com\myfinance\controller\AdminUserController.java",
]

# Actions that should be removed (read-only operations)
view_actions = [
    "ADMIN_ACTIVITY_VIEW",
    "ANALYTICS_SUMMARY_VIEW",
    "ANALYTICS_VIEW",
    "AUDIT_LOG_DETAIL_VIEW",
    "AUDIT_LOG_VIEW",
    "AUDIT_STATISTICS_VIEW",
    "CONFIG_DETAIL_VIEW",
    "CONFIG_LIST_VIEW",
    "FEATURE_FLAGS_VIEW",
    "MAINTENANCE_MODE_VIEW",
    "RECENT_AUDIT_VIEW",
    "USER_DETAIL_VIEW",
    "USER_LIST_VIEW",
    "USER_STATISTICS_VIEW",
]

def remove_audit_log_block(content, action):
    """Remove auditService.logAdminAction block for given action"""
    # Pattern to match the entire auditService.logAdminAction block
    pattern = r'\s*auditService\.logAdminAction\(\s*' \
              r'authentication\.getName\(\),\s*' \
              r'"' + re.escape(action) + r'",\s*' \
              r'.*?\);'

    # Use DOTALL to match across multiple lines
    content = re.sub(pattern, '', content, flags=re.DOTALL)
    return content

def add_comment(content, action):
    """Add explanatory comment where audit log was removed"""
    # Find the location where we should add comment
    # Look for the return statement after where the log would have been
    comment_text = "\n            // No audit log for view operations - non-actionable data\n"
    return content

def process_file(filepath):
    """Process a single Java file"""
    if not os.path.exists(filepath):
        print(f"Skipping {filepath} - file not found")
        return

    print(f"Processing {filepath}...")

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content
    changes_made = 0

    # Remove each VIEW action's audit log
    for action in view_actions:
        if action in content:
            content_before = content
            content = remove_audit_log_block(content, action)
            if content != content_before:
                changes_made += 1
                print(f"  - Removed {action}")

    # Write back if changes were made
    if changes_made > 0:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"  [OK] Saved {changes_made} changes to {os.path.basename(filepath)}")
    else:
        print(f"  No changes needed for {os.path.basename(filepath)}")

# Main execution
if __name__ == "__main__":
    base_path = r"D:\P1\Java_Project_Collections\MyFinance-Project"

    print("=" * 60)
    print("Removing VIEW audit logs from admin controllers")
    print("=" * 60)

    for controller in controllers:
        filepath = os.path.join(base_path, controller)
        process_file(filepath)

    print("\n" + "=" * 60)
    print("Cleanup complete!")
    print("=" * 60)
