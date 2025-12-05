import 'category.dart';

class Budget {
  final int id;
  final Category category;
  final double budgetAmount;
  final String? currencyCode;
  final double? budgetAmountInBaseCurrency;
  final int budgetYear;
  final int budgetMonth;
  final String? budgetPeriod;
  final String? description;
  final bool? isActive;
  final bool? isCurrentMonth;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  Budget({
    required this.id,
    required this.category,
    required this.budgetAmount,
    this.currencyCode,
    this.budgetAmountInBaseCurrency,
    required this.budgetYear,
    required this.budgetMonth,
    this.budgetPeriod,
    this.description,
    this.isActive,
    this.isCurrentMonth,
    this.createdAt,
    this.updatedAt,
  });

  factory Budget.fromJson(Map<String, dynamic> json) {
    return Budget(
      id: json['id'],
      category: Category.fromJson(json['category']),
      budgetAmount: (json['budgetAmount'] as num).toDouble(),
      currencyCode: json['currencyCode'],
      budgetAmountInBaseCurrency: json['budgetAmountInBaseCurrency'] != null
          ? (json['budgetAmountInBaseCurrency'] as num).toDouble()
          : null,
      budgetYear: json['budgetYear'],
      budgetMonth: json['budgetMonth'],
      budgetPeriod: json['budgetPeriod'],
      description: json['description'],
      isActive: json['isActive'],
      isCurrentMonth: json['isCurrentMonth'],
      createdAt: json['createdAt'] != null
          ? DateTime.parse(json['createdAt'])
          : null,
      updatedAt: json['updatedAt'] != null
          ? DateTime.parse(json['updatedAt'])
          : null,
    );
  }
}

class BudgetUsage {
  final int budgetId;
  final String categoryName;
  final double budgetAmount;
  final double actualSpent;
  final double remainingAmount;
  final double usagePercentage;
  final String status;
  final String? statusMessage;

  BudgetUsage({
    required this.budgetId,
    required this.categoryName,
    required this.budgetAmount,
    required this.actualSpent,
    required this.remainingAmount,
    required this.usagePercentage,
    required this.status,
    this.statusMessage,
  });

  factory BudgetUsage.fromJson(Map<String, dynamic> json) {
    return BudgetUsage(
      budgetId: json['budgetId'],
      categoryName: json['categoryName'],
      budgetAmount: (json['budgetAmount'] as num).toDouble(),
      actualSpent: (json['actualSpent'] as num).toDouble(),
      remainingAmount: (json['remainingAmount'] as num).toDouble(),
      usagePercentage: (json['usagePercentage'] as num).toDouble(),
      status: json['status'],
      statusMessage: json['statusMessage'],
    );
  }
}

class BudgetWarningResponse {
  final int totalBudgets;
  final int warningCount;
  final int overBudgetCount;
  final List<BudgetAlert> alerts;

  BudgetWarningResponse({
    required this.totalBudgets,
    required this.warningCount,
    required this.overBudgetCount,
    required this.alerts,
  });

  factory BudgetWarningResponse.fromJson(Map<String, dynamic> json) {
    return BudgetWarningResponse(
      totalBudgets: json['totalBudgets'] ?? 0,
      warningCount: json['warningCount'] ?? 0,
      overBudgetCount: json['overBudgetCount'] ?? 0,
      alerts: (json['alerts'] as List<dynamic>?)
              ?.map((item) => BudgetAlert.fromJson(item))
              .toList() ??
          [],
    );
  }
}

class BudgetAlert {
  final int budgetId;
  final String categoryName;
  final String? categoryColor;
  final String alertType; // WARNING, OVER_BUDGET
  final String alertLevel; // YELLOW, RED
  final double budgetAmount;
  final double actualSpent;
  final double usagePercentage;
  final String message;
  final int budgetYear;
  final int budgetMonth;

  BudgetAlert({
    required this.budgetId,
    required this.categoryName,
    this.categoryColor,
    required this.alertType,
    required this.alertLevel,
    required this.budgetAmount,
    required this.actualSpent,
    required this.usagePercentage,
    required this.message,
    required this.budgetYear,
    required this.budgetMonth,
  });

  factory BudgetAlert.fromJson(Map<String, dynamic> json) {
    return BudgetAlert(
      budgetId: json['budgetId'] ?? 0,
      categoryName: json['categoryName'] ?? '',
      categoryColor: json['categoryColor'],
      alertType: json['alertType'] ?? '',
      alertLevel: json['alertLevel'] ?? '',
      budgetAmount: (json['budgetAmount'] as num?)?.toDouble() ?? 0.0,
      actualSpent: (json['actualSpent'] as num?)?.toDouble() ?? 0.0,
      usagePercentage: (json['usagePercentage'] as num?)?.toDouble() ?? 0.0,
      message: json['message'] ?? '',
      budgetYear: json['budgetYear'] ?? 0,
      budgetMonth: json['budgetMonth'] ?? 0,
    );
  }
}
