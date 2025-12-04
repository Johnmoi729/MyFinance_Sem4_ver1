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
