import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';
import 'package:intl/intl.dart';

class MonthlyTrendChart extends StatelessWidget {
  final List<MonthlyTrendData> trends;
  final String title;

  const MonthlyTrendChart({
    super.key,
    required this.trends,
    this.title = 'Xu hướng tháng gần đây',
  });

  String _formatCurrency(double amount) {
    final formatter = NumberFormat.compact(locale: 'vi_VN');
    return '${formatter.format(amount)}₫';
  }

  double _getMaxValue() {
    if (trends.isEmpty) return 0;
    final maxIncome = trends.map((t) => t.income).reduce((a, b) => a > b ? a : b);
    final maxExpense = trends.map((t) => t.expense).reduce((a, b) => a > b ? a : b);
    return (maxIncome > maxExpense ? maxIncome : maxExpense) * 1.1;
  }

  @override
  Widget build(BuildContext context) {
    if (trends.isEmpty) {
      return Card(
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Center(
            child: Column(
              children: [
                Icon(
                  Icons.show_chart,
                  size: 48,
                  color: Colors.grey[400],
                ),
                const SizedBox(height: 8),
                Text(
                  'Chưa có dữ liệu xu hướng',
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
                  Icons.trending_up,
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

            // Legend
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                _buildLegendItem('Thu nhập', Colors.green),
                const SizedBox(width: 16),
                _buildLegendItem('Chi tiêu', Colors.red),
              ],
            ),
            const SizedBox(height: 24),

            // Bar Chart
            SizedBox(
              height: 250,
              child: BarChart(
                BarChartData(
                  alignment: BarChartAlignment.spaceAround,
                  maxY: _getMaxValue(),
                  barTouchData: BarTouchData(
                    enabled: true,
                    touchTooltipData: BarTouchTooltipData(
                      getTooltipColor: (group) => Colors.grey[800]!,
                      tooltipPadding: const EdgeInsets.all(8),
                      getTooltipItem: (group, groupIndex, rod, rodIndex) {
                        final trend = trends[groupIndex];
                        final isIncome = rodIndex == 0;
                        final amount = isIncome ? trend.income : trend.expense;
                        return BarTooltipItem(
                          '${isIncome ? 'Thu' : 'Chi'}\n${_formatCurrency(amount)}',
                          const TextStyle(
                            color: Colors.white,
                            fontWeight: FontWeight.bold,
                            fontSize: 12,
                          ),
                        );
                      },
                    ),
                  ),
                  titlesData: FlTitlesData(
                    show: true,
                    bottomTitles: AxisTitles(
                      sideTitles: SideTitles(
                        showTitles: true,
                        getTitlesWidget: (value, meta) {
                          if (value.toInt() >= 0 && value.toInt() < trends.length) {
                            return Padding(
                              padding: const EdgeInsets.only(top: 8),
                              child: Text(
                                trends[value.toInt()].monthLabel,
                                style: const TextStyle(
                                  fontSize: 10,
                                  fontWeight: FontWeight.w500,
                                ),
                              ),
                            );
                          }
                          return const Text('');
                        },
                        reservedSize: 30,
                      ),
                    ),
                    leftTitles: AxisTitles(
                      sideTitles: SideTitles(
                        showTitles: true,
                        getTitlesWidget: (value, meta) {
                          return Text(
                            _formatCurrency(value),
                            style: const TextStyle(fontSize: 10),
                          );
                        },
                        reservedSize: 50,
                      ),
                    ),
                    topTitles: const AxisTitles(
                      sideTitles: SideTitles(showTitles: false),
                    ),
                    rightTitles: const AxisTitles(
                      sideTitles: SideTitles(showTitles: false),
                    ),
                  ),
                  borderData: FlBorderData(
                    show: true,
                    border: Border(
                      bottom: BorderSide(color: Colors.grey[300]!),
                      left: BorderSide(color: Colors.grey[300]!),
                    ),
                  ),
                  gridData: FlGridData(
                    show: true,
                    drawVerticalLine: false,
                    horizontalInterval: _getMaxValue() / 5,
                    getDrawingHorizontalLine: (value) {
                      return FlLine(
                        color: Colors.grey[200]!,
                        strokeWidth: 1,
                      );
                    },
                  ),
                  barGroups: _generateBarGroups(),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildLegendItem(String label, Color color) {
    return Row(
      children: [
        Container(
          width: 16,
          height: 16,
          decoration: BoxDecoration(
            color: color,
            borderRadius: BorderRadius.circular(4),
          ),
        ),
        const SizedBox(width: 6),
        Text(
          label,
          style: const TextStyle(
            fontSize: 12,
            fontWeight: FontWeight.w500,
          ),
        ),
      ],
    );
  }

  List<BarChartGroupData> _generateBarGroups() {
    return trends.asMap().entries.map((entry) {
      final index = entry.key;
      final trend = entry.value;

      return BarChartGroupData(
        x: index,
        barRods: [
          BarChartRodData(
            toY: trend.income,
            color: Colors.green,
            width: 12,
            borderRadius: const BorderRadius.only(
              topLeft: Radius.circular(4),
              topRight: Radius.circular(4),
            ),
          ),
          BarChartRodData(
            toY: trend.expense,
            color: Colors.red,
            width: 12,
            borderRadius: const BorderRadius.only(
              topLeft: Radius.circular(4),
              topRight: Radius.circular(4),
            ),
          ),
        ],
        barsSpace: 4,
      );
    }).toList();
  }
}

class MonthlyTrendData {
  final String monthLabel;
  final double income;
  final double expense;

  const MonthlyTrendData({
    required this.monthLabel,
    required this.income,
    required this.expense,
  });
}
