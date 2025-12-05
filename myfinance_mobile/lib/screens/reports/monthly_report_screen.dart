import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../../services/report_service.dart';
import '../../models/monthly_report.dart';

class MonthlyReportScreen extends StatefulWidget {
  const MonthlyReportScreen({super.key});

  @override
  State<MonthlyReportScreen> createState() => _MonthlyReportScreenState();
}

class _MonthlyReportScreenState extends State<MonthlyReportScreen> {
  final ReportService _reportService = ReportService();

  MonthlyReport? _report;
  bool _isLoading = true;
  String _error = '';
  DateTime _selectedDate = DateTime.now();

  @override
  void initState() {
    super.initState();
    _loadReport();
  }

  Future<void> _loadReport() async {
    setState(() {
      _isLoading = true;
      _error = '';
    });

    final response = await _reportService.getMonthlyReport(
      _selectedDate.year,
      _selectedDate.month,
    );

    if (response.success && response.data != null) {
      setState(() {
        _report = response.data;
        _isLoading = false;
      });
    } else {
      setState(() {
        _error = response.message;
        _isLoading = false;
      });
    }
  }

  Future<void> _selectMonth() async {
    final picked = await showDatePicker(
      context: context,
      initialDate: _selectedDate,
      firstDate: DateTime(2020),
      lastDate: DateTime.now(),
      initialDatePickerMode: DatePickerMode.year,
    );

    if (picked != null && picked != _selectedDate) {
      setState(() {
        _selectedDate = picked;
      });
      _loadReport();
    }
  }

  void _previousMonth() {
    setState(() {
      _selectedDate = DateTime(_selectedDate.year, _selectedDate.month - 1);
    });
    _loadReport();
  }

  void _nextMonth() {
    final now = DateTime.now();
    final nextMonth = DateTime(_selectedDate.year, _selectedDate.month + 1);
    if (nextMonth.isBefore(now) || nextMonth.month == now.month) {
      setState(() {
        _selectedDate = nextMonth;
      });
      _loadReport();
    }
  }

  String _formatCurrency(double amount) {
    final formatter = NumberFormat.currency(
      locale: 'vi_VN',
      symbol: '₫',
      decimalDigits: 0,
    );
    return formatter.format(amount);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Báo cáo tháng'),
        actions: [
          IconButton(
            icon: const Icon(Icons.calendar_today),
            onPressed: _selectMonth,
          ),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _error.isNotEmpty
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        _error,
                        style: const TextStyle(color: Colors.red),
                        textAlign: TextAlign.center,
                      ),
                      const SizedBox(height: 16),
                      ElevatedButton(
                        onPressed: _loadReport,
                        child: const Text('Thử lại'),
                      ),
                    ],
                  ),
                )
              : RefreshIndicator(
                  onRefresh: _loadReport,
                  child: SingleChildScrollView(
                    physics: const AlwaysScrollableScrollPhysics(),
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        // Month selector
                        Card(
                          child: Padding(
                            padding: const EdgeInsets.all(8),
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                IconButton(
                                  icon: const Icon(Icons.chevron_left),
                                  onPressed: _previousMonth,
                                ),
                                TextButton(
                                  onPressed: _selectMonth,
                                  child: Text(
                                    'Tháng ${_selectedDate.month}/${_selectedDate.year}',
                                    style: const TextStyle(
                                      fontSize: 18,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ),
                                IconButton(
                                  icon: const Icon(Icons.chevron_right),
                                  onPressed: _nextMonth,
                                ),
                              ],
                            ),
                          ),
                        ),
                        const SizedBox(height: 16),

                        if (_report != null) ...[
                          // Summary cards
                          _buildSummaryCard(
                            'Thu nhập',
                            _formatCurrency(_report!.totalIncome),
                            Colors.green,
                            Icons.arrow_upward,
                          ),
                          const SizedBox(height: 8),
                          _buildSummaryCard(
                            'Chi tiêu',
                            _formatCurrency(_report!.totalExpense),
                            Colors.red,
                            Icons.arrow_downward,
                          ),
                          const SizedBox(height: 8),
                          _buildSummaryCard(
                            'Tiết kiệm',
                            _formatCurrency(_report!.netSavings),
                            _report!.netSavings >= 0 ? Colors.blue : Colors.orange,
                            Icons.savings,
                          ),
                          const SizedBox(height: 16),

                          // Savings rate
                          Card(
                            child: Padding(
                              padding: const EdgeInsets.all(16),
                              child: Column(
                                children: [
                                  const Text(
                                    'Tỷ lệ tiết kiệm',
                                    style: TextStyle(
                                      fontSize: 16,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                  const SizedBox(height: 8),
                                  Text(
                                    '${_report!.savingsRate.toStringAsFixed(1)}%',
                                    style: TextStyle(
                                      fontSize: 32,
                                      fontWeight: FontWeight.bold,
                                      color: _report!.savingsRate >= 20
                                          ? Colors.green
                                          : _report!.savingsRate >= 10
                                              ? Colors.orange
                                              : Colors.red,
                                    ),
                                  ),
                                  const SizedBox(height: 8),
                                  LinearProgressIndicator(
                                    value: (_report!.savingsRate / 100).clamp(0.0, 1.0),
                                    backgroundColor: Colors.grey[200],
                                    valueColor: AlwaysStoppedAnimation(
                                      _report!.savingsRate >= 20
                                          ? Colors.green
                                          : _report!.savingsRate >= 10
                                              ? Colors.orange
                                              : Colors.red,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                          const SizedBox(height: 16),

                          // Statistics
                          Row(
                            children: [
                              Expanded(
                                child: _buildStatCard(
                                  'Giao dịch',
                                  _report!.totalTransactions.toString(),
                                  Icons.receipt_long,
                                ),
                              ),
                              const SizedBox(width: 8),
                              Expanded(
                                child: _buildStatCard(
                                  'Trung bình',
                                  _formatCurrency(_report!.averageTransaction),
                                  Icons.calculate,
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 16),

                          // Top expense categories
                          if (_report!.topExpenseCategories.isNotEmpty) ...[
                            const Text(
                              'Chi tiêu nhiều nhất',
                              style: TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            const SizedBox(height: 8),
                            ..._report!.topExpenseCategories
                                .take(5)
                                .map((cat) => _buildCategoryTile(cat, Colors.red)),
                            const SizedBox(height: 16),
                          ],

                          // Top income categories
                          if (_report!.topIncomeCategories.isNotEmpty) ...[
                            const Text(
                              'Thu nhập nhiều nhất',
                              style: TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            const SizedBox(height: 8),
                            ..._report!.topIncomeCategories
                                .take(5)
                                .map((cat) => _buildCategoryTile(cat, Colors.green)),
                          ],
                        ],
                      ],
                    ),
                  ),
                ),
    );
  }

  Widget _buildSummaryCard(
    String title,
    String amount,
    Color color,
    IconData icon,
  ) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: color.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(icon, color: color, size: 28),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: TextStyle(
                      color: Colors.grey[600],
                      fontSize: 14,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    amount,
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                      color: color,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatCard(String label, String value, IconData icon) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            Icon(icon, color: Colors.grey[600]),
            const SizedBox(height: 8),
            Text(
              value,
              style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              label,
              style: TextStyle(
                fontSize: 12,
                color: Colors.grey[600],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildCategoryTile(CategorySummary category, Color color) {
    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      child: ListTile(
        leading: CircleAvatar(
          backgroundColor: color.withValues(alpha: 0.1),
          child: Text(
            category.categoryIcon ?? '💰',
            style: const TextStyle(fontSize: 20),
          ),
        ),
        title: Text(category.categoryName),
        subtitle: Text('${category.transactionCount} giao dịch'),
        trailing: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.end,
          children: [
            Text(
              _formatCurrency(category.amount),
              style: TextStyle(
                fontWeight: FontWeight.bold,
                color: color,
              ),
            ),
            Text(
              '${category.percentage.toStringAsFixed(1)}%',
              style: TextStyle(
                fontSize: 12,
                color: Colors.grey[600],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
