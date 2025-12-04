import 'category.dart';

class Transaction {
  final int id;
  final double amount;
  final String? currencyCode;
  final double? amountInBaseCurrency;
  final TransactionType type;
  final String? description;
  final DateTime transactionDate;
  final DateTime? createdAt;
  final DateTime? updatedAt;
  final Category category;

  Transaction({
    required this.id,
    required this.amount,
    this.currencyCode,
    this.amountInBaseCurrency,
    required this.type,
    this.description,
    required this.transactionDate,
    this.createdAt,
    this.updatedAt,
    required this.category,
  });

  factory Transaction.fromJson(Map<String, dynamic> json) {
    return Transaction(
      id: json['id'],
      amount: (json['amount'] as num).toDouble(),
      currencyCode: json['currencyCode'],
      amountInBaseCurrency: json['amountInBaseCurrency'] != null
          ? (json['amountInBaseCurrency'] as num).toDouble()
          : null,
      type: json['type'] == 'INCOME'
          ? TransactionType.INCOME
          : TransactionType.EXPENSE,
      description: json['description'],
      transactionDate: DateTime.parse(json['transactionDate']),
      createdAt: json['createdAt'] != null
          ? DateTime.parse(json['createdAt'])
          : null,
      updatedAt: json['updatedAt'] != null
          ? DateTime.parse(json['updatedAt'])
          : null,
      category: Category.fromJson(json['category']),
    );
  }
}

class TransactionRequest {
  final double amount;
  final String? currencyCode;
  final TransactionType type;
  final int categoryId;
  final String? description;
  final DateTime transactionDate;

  TransactionRequest({
    required this.amount,
    this.currencyCode,
    required this.type,
    required this.categoryId,
    this.description,
    required this.transactionDate,
  });

  Map<String, dynamic> toJson() {
    return {
      'amount': amount,
      'currencyCode': currencyCode ?? 'VND',
      'type': type == TransactionType.INCOME ? 'INCOME' : 'EXPENSE',
      'categoryId': categoryId,
      'description': description,
      'transactionDate': transactionDate.toIso8601String().split('T')[0],
    };
  }
}
