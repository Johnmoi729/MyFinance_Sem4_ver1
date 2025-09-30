package com.myfinance.entity;

public enum RoleName {
    USER("USER", "Người dùng thông thường"),
    ADMIN("ADMIN", "Quản trị viên"),
    SUPER_ADMIN("SUPER_ADMIN", "Quản trị viên cấp cao");

    private final String code;
    private final String description;

    RoleName(String code, String description) {
        this.code = code;
        this.description = description;
    }

    public String getCode() {
        return code;
    }

    public String getDescription() {
        return description;
    }
}