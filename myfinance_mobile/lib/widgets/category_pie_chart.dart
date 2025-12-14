import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';
import 'package:intl/intl.dart';

class CategoryPieChart extends StatelessWidget {
  final List<CategoryExpenseData> expenses;
  final String title;

  const CategoryPieChart({
    super.key,
    required this.expenses,
    this.title = 'Chi tiêu theo danh mục',
  });

  String _formatCurrency(double amount) {
    return NumberFormat.currency(
      locale: 'vi_VN',
      symbol: '₫',
      decimalDigits: 0,
    ).format(amount);
  }

  Color _getCategoryColor(int index) {
    const colors = [
      Color(0xFFEF4444), // red
      Color(0xFFF59E0B), // amber
      Color(0xFF10B981), // emerald
      Color(0xFF3B82F6), // blue
      Color(0xFF8B5CF6), // violet
      Color(0xFFEC4899), // pink
      Color(0xFF14B8A6), // teal
      Color(0xFFF97316), // orange
    ];
    return colors[index % colors.length];
  }

  double _getTotalExpense() {
    return expenses.fold(0.0, (sum, item) => sum + item.amount);
  }

  @override
  Widget build(BuildContext context) {
    if (expenses.isEmpty) {
      return Card(
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Center(
            child: Column(
              children: [
                Icon(
                  Icons.pie_chart_outline,
                  size: 48,
                  color: Colors.grey[400],
                ),
                const SizedBox(height: 8),
                Text(
                  'Chưa có dữ liệu chi tiêu',
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

    final totalExpense = _getTotalExpense();

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(
                  Icons.pie_chart,
                  color: Colors.indigo[700],
                  size: 24,
                ),
                const SizedBox(width: 8),
                Text(
                  title,
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Text(
              'Tổng: ${_formatCurrency(totalExpense)}',
              style: TextStyle(
                fontSize: 14,
                color: Colors.grey[600],
                fontWeight: FontWeight.w500,
              ),
            ),
            const SizedBox(height: 24),

            // Pie Chart
            SizedBox(
              height: 200,
              child: PieChart(
                PieChartData(
                  sectionsSpace: 2,
                  centerSpaceRadius: 50,
                  sections: _generateSections(totalExpense),
                  borderData: FlBorderData(show: false),
                  pieTouchData: PieTouchData(
                    touchCallback: (FlTouchEvent event, pieTouchResponse) {},
                  ),
                ),
              ),
            ),
            const SizedBox(height: 24),

            // Legend
            Wrap(
              spacing: 12,
              runSpacing: 8,
              children: expenses.asMap().entries.map((entry) {
                final index = entry.key;
                final expense = entry.value;
                final percentage = (expense.amount / totalExpense * 100);
                final color = _getCategoryColor(index);

                return Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 10,
                    vertical: 6,
                  ),
                  decoration: BoxDecoration(
                    color: color.withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(
                      color: color.withValues(alpha: 0.3),
                      width: 1,
                    ),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Container(
                        width: 12,
                        height: 12,
                        decoration: BoxDecoration(
                          color: color,
                          shape: BoxShape.circle,
                        ),
                      ),
                      const SizedBox(width: 6),
                      Text(
                        '${expense.categoryName} (${percentage.toStringAsFixed(0)}%)',
                        style: const TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ],
                  ),
                );
              }).toList(),
            ),
          ],
        ),
      ),
    );
  }

  List<PieChartSectionData> _generateSections(double total) {
    return expenses.asMap().entries.map((entry) {
      final index = entry.key;
      final expense = entry.value;
      final percentage = (expense.amount / total * 100);
      final color = _getCategoryColor(index);

      return PieChartSectionData(
        color: color,
        value: expense.amount,
        title: '${percentage.toStringAsFixed(0)}%',
        radius: 60,
        titleStyle: const TextStyle(
          fontSize: 14,
          fontWeight: FontWeight.bold,
          color: Colors.white,
        ),
        badgeWidget: null,
      );
    }).toList();
  }
}

class CategoryExpenseData {
  final String categoryName;
  final double amount;

  const CategoryExpenseData({
    required this.categoryName,
    required this.amount,
  });
}
