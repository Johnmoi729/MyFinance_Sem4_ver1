package com.myfinance.entity;

public enum BudgetStatus {
    GREEN("Trong giới hạn"),
    YELLOW("Cảnh báo"),
    RED("Vượt ngân sách");

    private final String displayName;

    BudgetStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    public static BudgetStatus fromUsagePercentage(double usagePercentage) {
        if (usagePercentage >= 100.0) {
            return RED;
        } else if (usagePercentage >= 75.0) {
            return YELLOW;
        } else {
            return GREEN;
        }
    }
}