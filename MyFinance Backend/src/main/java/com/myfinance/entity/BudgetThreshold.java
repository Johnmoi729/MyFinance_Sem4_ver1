package com.myfinance.entity;

public enum BudgetThreshold {
    WARNING_75(75.0, "Cảnh báo khi sử dụng 75% ngân sách"),
    WARNING_80(80.0, "Cảnh báo khi sử dụng 80% ngân sách"),
    WARNING_85(85.0, "Cảnh báo khi sử dụng 85% ngân sách"),
    WARNING_90(90.0, "Cảnh báo khi sử dụng 90% ngân sách"),
    WARNING_95(95.0, "Cảnh báo khi sử dụng 95% ngân sách");

    private final double percentage;
    private final String description;

    BudgetThreshold(double percentage, String description) {
        this.percentage = percentage;
        this.description = description;
    }

    public double getPercentage() {
        return percentage;
    }

    public String getDescription() {
        return description;
    }

    public static BudgetThreshold fromPercentage(double percentage) {
        for (BudgetThreshold threshold : values()) {
            if (Math.abs(threshold.percentage - percentage) < 0.01) {
                return threshold;
            }
        }
        return WARNING_75; // Default
    }

    public static BudgetThreshold getDefault() {
        return WARNING_75;
    }
}