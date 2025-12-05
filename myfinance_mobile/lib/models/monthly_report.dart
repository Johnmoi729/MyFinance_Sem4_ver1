class MonthlyReport {
  final int year;
  final int month;
  final String monthName;

  // Summary totals
  final double totalIncome;
  final double totalExpense;
  final double netSavings;
  final double savingsRate; // Percentage

  // Comparisons
  final double? previousMonthIncome;
  final double? previousMonthExpense;
  final double? incomeChangePercent;
  final double? expenseChangePercent;

  // Category breakdowns
  final List<CategorySummary> incomeByCategory;
  final List<CategorySummary> expenseByCategory;

  // Top categories
  final List<CategorySummary> topExpenseCategories;
  final List<CategorySummary> topIncomeCategories;

  // Statistics
  final int totalTransactions;
  final double averageTransaction;
  final double largestExpense;
  final double largestIncome;

  MonthlyReport({
    required this.year,
    required this.month,
    required this.monthName,
    required this.totalIncome,
    required this.totalExpense,
    required this.netSavings,
    required this.savingsRate,
    this.previousMonthIncome,
    this.previousMonthExpense,
    this.incomeChangePercent,
    this.expenseChangePercent,
    required this.incomeByCategory,
    required this.expenseByCategory,
    required this.topExpenseCategories,
    required this.topIncomeCategories,
    required this.totalTransactions,
    required this.averageTransaction,
    required this.largestExpense,
    required this.largestIncome,
  });

  factory MonthlyReport.fromJson(Map<String, dynamic> json) {
    return MonthlyReport(
      year: json['year'] ?? 0,
      month: json['month'] ?? 0,
      monthName: json['monthName'] ?? '',
      totalIncome: _parseDouble(json['totalIncome']),
      totalExpense: _parseDouble(json['totalExpense']),
      netSavings: _parseDouble(json['netSavings']),
      savingsRate: _parseDouble(json['savingsRate']),
      previousMonthIncome: json['previousMonthIncome'] != null
          ? _parseDouble(json['previousMonthIncome'])
          : null,
      previousMonthExpense: json['previousMonthExpense'] != null
          ? _parseDouble(json['previousMonthExpense'])
          : null,
      incomeChangePercent: json['incomeChangePercent'] != null
          ? _parseDouble(json['incomeChangePercent'])
          : null,
      expenseChangePercent: json['expenseChangePercent'] != null
          ? _parseDouble(json['expenseChangePercent'])
          : null,
      incomeByCategory: (json['incomeByCategory'] as List<dynamic>?)
              ?.map((item) => CategorySummary.fromJson(item))
              .toList() ??
          [],
      expenseByCategory: (json['expenseByCategory'] as List<dynamic>?)
              ?.map((item) => CategorySummary.fromJson(item))
              .toList() ??
          [],
      topExpenseCategories: (json['topExpenseCategories'] as List<dynamic>?)
              ?.map((item) => CategorySummary.fromJson(item))
              .toList() ??
          [],
      topIncomeCategories: (json['topIncomeCategories'] as List<dynamic>?)
              ?.map((item) => CategorySummary.fromJson(item))
              .toList() ??
          [],
      totalTransactions: json['totalTransactions'] ?? 0,
      averageTransaction: _parseDouble(json['averageTransaction']),
      largestExpense: _parseDouble(json['largestExpense']),
      largestIncome: _parseDouble(json['largestIncome']),
    );
  }

  static double _parseDouble(dynamic value) {
    if (value == null) return 0.0;
    if (value is double) return value;
    if (value is int) return value.toDouble();
    if (value is String) return double.tryParse(value) ?? 0.0;
    return 0.0;
  }
}

class CategorySummary {
  final int categoryId;
  final String categoryName;
  final String? categoryColor;
  final String? categoryIcon;
  final double amount;
  final int transactionCount;
  final double percentage; // Percentage of total

  // Budget comparison fields
  final double? budgetAmount;
  final double? budgetDifference; // amount - budget
  final double? budgetUsagePercent; // (amount / budget) * 100

  CategorySummary({
    required this.categoryId,
    required this.categoryName,
    this.categoryColor,
    this.categoryIcon,
    required this.amount,
    required this.transactionCount,
    required this.percentage,
    this.budgetAmount,
    this.budgetDifference,
    this.budgetUsagePercent,
  });

  factory CategorySummary.fromJson(Map<String, dynamic> json) {
    return CategorySummary(
      categoryId: json['categoryId'] ?? 0,
      categoryName: json['categoryName'] ?? '',
      categoryColor: json['categoryColor'],
      categoryIcon: json['categoryIcon'],
      amount: _parseDouble(json['amount']),
      transactionCount: json['transactionCount'] ?? 0,
      percentage: _parseDouble(json['percentage']),
      budgetAmount: json['budgetAmount'] != null
          ? _parseDouble(json['budgetAmount'])
          : null,
      budgetDifference: json['budgetDifference'] != null
          ? _parseDouble(json['budgetDifference'])
          : null,
      budgetUsagePercent: json['budgetUsagePercent'] != null
          ? _parseDouble(json['budgetUsagePercent'])
          : null,
    );
  }

  static double _parseDouble(dynamic value) {
    if (value == null) return 0.0;
    if (value is double) return value;
    if (value is int) return value.toDouble();
    if (value is String) return double.tryParse(value) ?? 0.0;
    return 0.0;
  }
}
