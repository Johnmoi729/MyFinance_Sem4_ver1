class YearlyReport {
  final int year;
  final double totalIncome;
  final double totalExpense;
  final double netSavings;
  final double savingsRate;
  final List<MonthlyData> monthlyData;
  final List<CategorySummary> topExpenseCategories;
  final List<CategorySummary> topIncomeCategories;

  YearlyReport({
    required this.year,
    required this.totalIncome,
    required this.totalExpense,
    required this.netSavings,
    required this.savingsRate,
    required this.monthlyData,
    required this.topExpenseCategories,
    required this.topIncomeCategories,
  });

  factory YearlyReport.fromJson(Map<String, dynamic> json) {
    return YearlyReport(
      year: json['year'] as int,
      totalIncome: (json['totalIncome'] as num).toDouble(),
      totalExpense: (json['totalExpense'] as num).toDouble(),
      netSavings: (json['netSavings'] as num).toDouble(),
      savingsRate: (json['savingsRate'] as num).toDouble(),
      monthlyData: (json['monthlyData'] as List)
          .map((e) => MonthlyData.fromJson(e))
          .toList(),
      topExpenseCategories: (json['topExpenseCategories'] as List)
          .map((e) => CategorySummary.fromJson(e))
          .toList(),
      topIncomeCategories: (json['topIncomeCategories'] as List)
          .map((e) => CategorySummary.fromJson(e))
          .toList(),
    );
  }
}

class MonthlyData {
  final String month;
  final double income;
  final double expense;
  final double netSavings;

  MonthlyData({
    required this.month,
    required this.income,
    required this.expense,
    required this.netSavings,
  });

  factory MonthlyData.fromJson(Map<String, dynamic> json) {
    return MonthlyData(
      month: json['month'] as String,
      income: (json['income'] as num).toDouble(),
      expense: (json['expense'] as num).toDouble(),
      netSavings: (json['netSavings'] as num).toDouble(),
    );
  }
}

class CategorySummary {
  final String categoryName;
  final double amount;
  final int transactionCount;

  CategorySummary({
    required this.categoryName,
    required this.amount,
    required this.transactionCount,
  });

  factory CategorySummary.fromJson(Map<String, dynamic> json) {
    return CategorySummary(
      categoryName: json['categoryName'] as String,
      amount: (json['amount'] as num).toDouble(),
      transactionCount: json['transactionCount'] as int,
    );
  }
}
