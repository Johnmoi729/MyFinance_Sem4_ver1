enum TransactionType { INCOME, EXPENSE }

class Category {
  final int id;
  final String name;
  final TransactionType type;
  final String? color;
  final String? icon;
  final bool? isDefault;

  Category({
    required this.id,
    required this.name,
    required this.type,
    this.color,
    this.icon,
    this.isDefault,
  });

  factory Category.fromJson(Map<String, dynamic> json) {
    return Category(
      id: json['id'],
      name: json['name'],
      type: json['type'] == 'INCOME'
          ? TransactionType.INCOME
          : TransactionType.EXPENSE,
      color: json['color'],
      icon: json['icon'],
      isDefault: json['isDefault'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'type': type == TransactionType.INCOME ? 'INCOME' : 'EXPENSE',
      'color': color,
      'icon': icon,
      'isDefault': isDefault,
    };
  }
}
