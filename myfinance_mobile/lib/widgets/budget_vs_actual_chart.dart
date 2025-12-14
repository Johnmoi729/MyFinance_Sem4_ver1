import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

class BudgetVsActualChart extends StatelessWidget {
  final List<BudgetComparisonData> budgets;

  const BudgetVsActualChart({
    super.key,
    required this.budgets,
  });

  String _formatCurrency(double amount) {
    return NumberFormat.currency(
      locale: 'vi_VN',
      symbol: '₫',
      decimalDigits: 0,
    ).format(amount);
  }

  Color _getUsageColor(double percentage) {
    if (percentage >= 100) return Colors.red;
    if (percentage >= 75) return Colors.orange;
    return Colors.green;
  }

  @override
  Widget build(BuildContext context) {
    if (budgets.isEmpty) {
      return Card(
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Center(
            child: Column(
              children: [
                Icon(
                  Icons.insert_chart_outlined,
                  size: 48,
                  color: Colors.grey[400],
                ),
                const SizedBox(height: 8),
                Text(
                  'Chưa có dữ liệu ngân sách',
                  style: TextStyle(
                    color: Colors.grey[600],
                    fontSize: 14,
                  ),
                ),
              ],
            ),
          ),
        ),
      );
    }

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(
                  Icons.bar_chart,
                  color: Colors.indigo[700],
                  size: 24,
                ),
                const SizedBox(width: 8),
                const Text(
                  'Ngân sách vs Thực tế',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            ...budgets.map((budget) => _buildBudgetRow(budget)),
          ],
        ),
      ),
    );
  }

  Widget _buildBudgetRow(BudgetComparisonData budget) {
    final usagePercentage = budget.budgetAmount > 0
        ? (budget.actualAmount / budget.budgetAmount * 100).clamp(0, 100).toDouble()
        : 0.0;
    final color = _getUsageColor(usagePercentage);
    final overBudget = budget.actualAmount > budget.budgetAmount;

    return Padding(
      padding: const EdgeInsets.only(bottom: 20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Category name and percentage
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Text(
                  budget.categoryName,
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                  ),
                  overflow: TextOverflow.ellipsis,
                ),
              ),
              Text(
                '${usagePercentage.toStringAsFixed(0)}%',
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.bold,
                  color: color,
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),

          // Progress bar
          Stack(
            children: [
              // Background (budget amount)
              Container(
                height: 24,
                decoration: BoxDecoration(
                  color: Colors.grey[200],
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              // Actual amount bar
              FractionallySizedBox(
                widthFactor: overBudget ? 1.0 : (usagePercentage / 100),
                child: Container(
                  height: 24,
                  decoration: BoxDecoration(
                    color: color,
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 6),

          // Amounts
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  Text(
                    'Thực tế: ',
                    style: TextStyle(
                      fontSize: 12,
                      color: Colors.grey[600],
                    ),
                  ),
                  Text(
                    _formatCurrency(budget.actualAmount),
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      color: color,
                    ),
                  ),
                ],
              ),
              Row(
                children: [
                  Text(
                    'Ngân sách: ',
                    style: TextStyle(
                      fontSize: 12,
                      color: Colors.grey[600],
                    ),
                  ),
                  Text(
                    _formatCurrency(budget.budgetAmount),
                    style: const TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ],
              ),
            ],
          ),
          if (overBudget)
            Padding(
              padding: const EdgeInsets.only(top: 4),
              child: Row(
                children: [
                  Icon(
                    Icons.warning_amber_rounded,
                    size: 14,
                    color: Colors.red[700],
                  ),
                  const SizedBox(width: 4),
                  Text(
                    'Vượt ${_formatCurrency(budget.actualAmount - budget.budgetAmount)}',
                    style: TextStyle(
                      fontSize: 11,
                      color: Colors.red[700],
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ],
              ),
            ),
        ],
      ),
    );
  }
}

class BudgetComparisonData {
  final String categoryName;
  final double budgetAmount;
  final double actualAmount;

  const BudgetComparisonData({
    required this.categoryName,
    required this.budgetAmount,
    required this.actualAmount,
  });
}
