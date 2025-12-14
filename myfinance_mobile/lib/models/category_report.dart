class CategoryReport {
  final int categoryId;
  final String categoryName;
  final String categoryType;
  final String startDate;
  final String endDate;
  final double totalAmount;
  final int transactionCount;
  final double averageAmount;
  final double minAmount;
  final double maxAmount;
  final List<MonthlyBreakdown> monthlyBreakdown;

  CategoryReport({
    required this.categoryId,
    required this.categoryName,
    required this.categoryType,
    required this.startDate,
    required this.endDate,
    required this.totalAmount,
    required this.transactionCount,
    required this.averageAmount,
    required this.minAmount,
    required this.maxAmount,
    required this.monthlyBreakdown,
  });

  factory CategoryReport.fromJson(Map<String, dynamic> json) {
    return CategoryReport(
      categoryId: json['categoryId'] as int,
      categoryName: json['categoryName'] as String,
      categoryType: json['categoryType'] as String,
      startDate: json['startDate'] as String,
      endDate: json['endDate'] as String,
      totalAmount: (json['totalAmount'] as num).toDouble(),
      transactionCount: json['transactionCount'] as int,
      averageAmount: (json['averageAmount'] as num).toDouble(),
      minAmount: (json['minAmount'] as num).toDouble(),
      maxAmount: (json['maxAmount'] as num).toDouble(),
      monthlyBreakdown: (json['monthlyBreakdown'] as List)
          .map((e) => MonthlyBreakdown.fromJson(e))
          .toList(),
    );
  }
}

class MonthlyBreakdown {
  final String month;
  final double amount;
  final int count;

  MonthlyBreakdown({
    required this.month,
    required this.amount,
    required this.count,
  });

  factory MonthlyBreakdown.fromJson(Map<String, dynamic> json) {
    return MonthlyBreakdown(
      month: json['month'] as String,
      amount: (json['amount'] as num).toDouble(),
      count: json['count'] as int,
    );
  }
}
