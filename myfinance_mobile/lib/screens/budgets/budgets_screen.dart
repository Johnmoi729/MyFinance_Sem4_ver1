import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../../services/budget_service.dart';
import '../../models/budget.dart';

class BudgetsScreen extends StatefulWidget {
  const BudgetsScreen({super.key});

  @override
  State<BudgetsScreen> createState() => _BudgetsScreenState();
}

class _BudgetsScreenState extends State<BudgetsScreen> {
  final BudgetService _budgetService = BudgetService();

  List<BudgetUsage> _budgetUsage = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadBudgets();
  }

  Future<void> _loadBudgets() async {
    setState(() => _isLoading = true);

    final response = await _budgetService.getCurrentMonthUsage();
    if (response.success && response.data != null) {
      _budgetUsage = response.data!;
    }

    setState(() => _isLoading = false);
  }

  String _formatCurrency(double amount) {
    final formatter = NumberFormat.currency(
      locale: 'vi_VN',
      symbol: '₫',
      decimalDigits: 0,
    );
    return formatter.format(amount);
  }

  Color _getStatusColor(String status) {
    switch (status) {
      case 'SAFE':
        return Colors.green;
      case 'WARNING':
        return Colors.orange;
      case 'CRITICAL':
      case 'OVER_BUDGET':
        return Colors.red;
      default:
        return Colors.grey;
    }
  }

  String _getStatusText(String status) {
    switch (status) {
      case 'SAFE':
        return 'An toàn';
      case 'WARNING':
        return 'Cảnh báo';
      case 'CRITICAL':
        return 'Nguy hiểm';
      case 'OVER_BUDGET':
        return 'Vượt ngân sách';
      default:
        return status;
    }
  }

  @override
  Widget build(BuildContext context) {
    final now = DateTime.now();
    final monthName = DateFormat('MMMM yyyy', 'vi_VN').format(now);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Ngân sách'),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: _loadBudgets,
              child: _budgetUsage.isEmpty
                  ? const Center(
                      child: Text('Chưa có ngân sách nào cho tháng này'),
                    )
                  : ListView(
                      padding: const EdgeInsets.all(16),
                      children: [
                        Text(
                          'Ngân sách tháng ${monthName}',
                          style: const TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 16),
                        ..._budgetUsage.map((usage) => _buildBudgetCard(usage)),
                      ],
                    ),
            ),
    );
  }

  Widget _buildBudgetCard(BudgetUsage usage) {
    final statusColor = _getStatusColor(usage.status);
    final percentage = usage.usagePercentage.clamp(0.0, 100.0);

    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: Text(
                    usage.categoryName,
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: statusColor.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    _getStatusText(usage.status),
                    style: TextStyle(
                      color: statusColor,
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Đã chi: ${_formatCurrency(usage.actualSpent)}',
                  style: const TextStyle(fontSize: 14),
                ),
                Text(
                  '${percentage.toStringAsFixed(0)}%',
                  style: TextStyle(
                    color: statusColor,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            LinearProgressIndicator(
              value: percentage / 100,
              backgroundColor: Colors.grey[200],
              valueColor: AlwaysStoppedAnimation(statusColor),
              minHeight: 8,
            ),
            const SizedBox(height: 8),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Ngân sách: ${_formatCurrency(usage.budgetAmount)}',
                  style: TextStyle(
                    fontSize: 12,
                    color: Colors.grey[600],
                  ),
                ),
                Text(
                  'Còn lại: ${_formatCurrency(usage.remainingAmount)}',
                  style: TextStyle(
                    fontSize: 12,
                    color: usage.remainingAmount >= 0 ? Colors.green : Colors.red,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
