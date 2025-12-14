import 'package:flutter/material.dart';

class FinancialHealthScore extends StatelessWidget {
  final double totalIncome;
  final double totalExpense;
  final int budgetsOnTrack;
  final int totalBudgets;

  const FinancialHealthScore({
    super.key,
    required this.totalIncome,
    required this.totalExpense,
    this.budgetsOnTrack = 0,
    this.totalBudgets = 0,
  });

  // Calculate financial health score (0-100)
  double _calculateScore() {
    double score = 0;

    // 1. Savings Rate (40 points)
    if (totalIncome > 0) {
      final savingsRate = ((totalIncome - totalExpense) / totalIncome) * 100;
      if (savingsRate >= 30) {
        score += 40;
      } else if (savingsRate >= 20) {
        score += 30;
      } else if (savingsRate >= 10) {
        score += 20;
      } else if (savingsRate >= 0) {
        score += 10;
      }
    }

    // 2. Expense Ratio (30 points)
    if (totalIncome > 0) {
      final expenseRatio = (totalExpense / totalIncome) * 100;
      if (expenseRatio <= 50) {
        score += 30;
      } else if (expenseRatio <= 70) {
        score += 20;
      } else if (expenseRatio <= 90) {
        score += 10;
      }
    }

    // 3. Net Savings (20 points)
    final netSavings = totalIncome - totalExpense;
    if (netSavings > 0) {
      if (netSavings >= totalIncome * 0.3) {
        score += 20;
      } else if (netSavings >= totalIncome * 0.2) {
        score += 15;
      } else if (netSavings >= totalIncome * 0.1) {
        score += 10;
      } else {
        score += 5;
      }
    }

    // 4. Budget Adherence (10 points)
    if (totalBudgets > 0) {
      final adherenceRate = (budgetsOnTrack / totalBudgets) * 100;
      if (adherenceRate >= 90) {
        score += 10;
      } else if (adherenceRate >= 70) {
        score += 7;
      } else if (adherenceRate >= 50) {
        score += 5;
      } else {
        score += 2;
      }
    }

    return score.clamp(0, 100);
  }

  String _getHealthRating(double score) {
    if (score >= 80) return 'Xuất sắc';
    if (score >= 60) return 'Tốt';
    if (score >= 40) return 'Trung bình';
    return 'Cần cải thiện';
  }

  Color _getHealthColor(double score) {
    if (score >= 80) return Colors.green;
    if (score >= 60) return Colors.lightGreen;
    if (score >= 40) return Colors.orange;
    return Colors.red;
  }

  @override
  Widget build(BuildContext context) {
    final score = _calculateScore();
    final rating = _getHealthRating(score);
    final color = _getHealthColor(score);

    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            color.withValues(alpha: 0.1),
            color.withValues(alpha: 0.05),
          ],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: color.withValues(alpha: 0.3),
          width: 1,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(
                Icons.favorite,
                color: color,
                size: 24,
              ),
              const SizedBox(width: 8),
              const Text(
                'Sức khỏe tài chính',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),
          Row(
            children: [
              // Circular progress indicator
              SizedBox(
                width: 100,
                height: 100,
                child: Stack(
                  fit: StackFit.expand,
                  children: [
                    CircularProgressIndicator(
                      value: score / 100,
                      strokeWidth: 10,
                      backgroundColor: Colors.grey[200],
                      valueColor: AlwaysStoppedAnimation<Color>(color),
                    ),
                    Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text(
                            score.toInt().toString(),
                            style: TextStyle(
                              fontSize: 32,
                              fontWeight: FontWeight.bold,
                              color: color,
                            ),
                          ),
                          const Text(
                            '/100',
                            style: TextStyle(
                              fontSize: 14,
                              color: Colors.grey,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 24),
              // Score details
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 12,
                        vertical: 6,
                      ),
                      decoration: BoxDecoration(
                        color: color.withValues(alpha: 0.2),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Text(
                        rating,
                        style: TextStyle(
                          color: color,
                          fontWeight: FontWeight.bold,
                          fontSize: 16,
                        ),
                      ),
                    ),
                    const SizedBox(height: 12),
                    _buildScoreBreakdown(),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildScoreBreakdown() {
    final savingsRate = totalIncome > 0
        ? ((totalIncome - totalExpense) / totalIncome) * 100
        : 0.0;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildBreakdownItem(
          'Tỷ lệ tiết kiệm',
          '${savingsRate.toStringAsFixed(1)}%',
          savingsRate >= 20 ? Colors.green : Colors.orange,
        ),
        const SizedBox(height: 6),
        if (totalBudgets > 0)
          _buildBreakdownItem(
            'Ngân sách',
            '$budgetsOnTrack/$totalBudgets',
            budgetsOnTrack >= totalBudgets * 0.7 ? Colors.green : Colors.orange,
          ),
      ],
    );
  }

  Widget _buildBreakdownItem(String label, String value, Color color) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: TextStyle(
            fontSize: 13,
            color: Colors.grey[600],
          ),
        ),
        Text(
          value,
          style: TextStyle(
            fontSize: 13,
            fontWeight: FontWeight.bold,
            color: color,
          ),
        ),
      ],
    );
  }
}
