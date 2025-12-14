class BudgetSettings {
  final int id;
  final int userId;
  final double warningThreshold;
  final double criticalThreshold;

  BudgetSettings({
    required this.id,
    required this.userId,
    required this.warningThreshold,
    required this.criticalThreshold,
  });

  factory BudgetSettings.fromJson(Map<String, dynamic> json) {
    return BudgetSettings(
      id: json['id'] as int,
      userId: json['userId'] as int,
      warningThreshold: (json['warningThreshold'] as num).toDouble(),
      criticalThreshold: (json['criticalThreshold'] as num).toDouble(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'warningThreshold': warningThreshold,
      'criticalThreshold': criticalThreshold,
    };
  }
}
