import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../../services/report_service.dart';
import '../../models/yearly_report.dart';

class YearlyReportScreen extends StatefulWidget {
  const YearlyReportScreen({super.key});

  @override
  State<YearlyReportScreen> createState() => _YearlyReportScreenState();
}

class _YearlyReportScreenState extends State<YearlyReportScreen> {
  final ReportService _reportService = ReportService();

  YearlyReport? _report;
  bool _isLoading = true;
  String _error = '';
  int _selectedYear = DateTime.now().year;

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

    final response = await _reportService.getYearlyReport(_selectedYear);

    if (!mounted) return;

    setState(() {
      _isLoading = false;
      if (response.success && response.data != null) {
        _report = response.data;
      } else {
        _error = response.message;
      }
    });
  }

  Future<void> _selectYear() async {
    final currentYear = DateTime.now().year;
    final years = List.generate(10, (index) => currentYear - index);

    final selected = await showDialog<int>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Chọn năm'),
        content: SizedBox(
          width: double.maxFinite,
          child: ListView.builder(
            shrinkWrap: true,
            itemCount: years.length,
            itemBuilder: (context, index) {
              final year = years[index];
              return ListTile(
                title: Text(year.toString()),
                selected: year == _selectedYear,
                onTap: () => Navigator.pop(context, year),
              );
            },
          ),
        ),
      ),
    );

    if (selected != null && selected != _selectedYear) {
      setState(() => _selectedYear = selected);
      _loadReport();
    }
  }

  void _previousYear() {
    setState(() => _selectedYear--);
    _loadReport();
  }

  void _nextYear() {
    final currentYear = DateTime.now().year;
    if (_selectedYear < currentYear) {
      setState(() => _selectedYear++);
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
        title: const Text('Báo cáo năm'),
        actions: [
          IconButton(
            icon: const Icon(Icons.calendar_today),
            onPressed: _selectYear,
          ),
          PopupMenuButton<String>(
            icon: const Icon(Icons.more_vert),
            onSelected: (value) {
              if (value == 'monthly') {
                Navigator.pushNamed(context, '/reports/monthly');
              } else if (value == 'category') {
                Navigator.pushNamed(context, '/reports/category');
              }
            },
            itemBuilder: (context) => [
              PopupMenuItem(
                value: 'monthly',
                child: Row(
                  children: const [
                    Icon(Icons.calendar_month),
                    SizedBox(width: 8),
                    Text('Báo cáo tháng'),
                  ],
                ),
              ),
              PopupMenuItem(
                value: 'category',
                child: Row(
                  children: const [
                    Icon(Icons.category),
                    SizedBox(width: 8),
                    Text('Báo cáo danh mục'),
                  ],
                ),
              ),
            ],
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
                      const Icon(Icons.error_outline, size: 64, color: Colors.red),
                      const SizedBox(height: 16),
                      Text(_error, style: const TextStyle(color: Colors.red)),
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
                        // Year navigation
                        Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            IconButton(
                              icon: const Icon(Icons.chevron_left),
                              onPressed: _previousYear,
                            ),
                            TextButton(
                              onPressed: _selectYear,
                              child: Text(
                                'Năm $_selectedYear',
                                style: const TextStyle(fontSize: 18),
                              ),
                            ),
                            IconButton(
                              icon: const Icon(Icons.chevron_right),
                              onPressed: _selectedYear < DateTime.now().year
                                  ? _nextYear
                                  : null,
                            ),
                          ],
                        ),
                        const SizedBox(height: 16),

                        // Summary Cards
                        _buildSummaryCard('Thu nhập', _report!.totalIncome, Colors.green),
                        const SizedBox(height: 12),
                        _buildSummaryCard('Chi tiêu', _report!.totalExpense, Colors.red),
                        const SizedBox(height: 12),
                        _buildSummaryCard('Tiết kiệm', _report!.netSavings, Colors.blue),
                        const SizedBox(height: 12),
                        _buildSavingsRateCard(),
                        const SizedBox(height: 24),

                        // Monthly Trends
                        const Text(
                          'Xu hướng theo tháng',
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 12),
                        _buildMonthlyTrendsTable(),
                        const SizedBox(height: 24),

                        // Top Expense Categories
                        if (_report!.topExpenseCategories.isNotEmpty) ...[
                          const Text(
                            'Top 5 Danh Mục Chi Tiêu',
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 12),
                          ..._report!.topExpenseCategories.take(5).map(
                                (cat) => _buildCategoryTile(cat, Colors.red),
                              ),
                          const SizedBox(height: 24),
                        ],

                        // Top Income Categories
                        if (_report!.topIncomeCategories.isNotEmpty) ...[
                          const Text(
                            'Top 5 Danh Mục Thu Nhập',
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 12),
                          ..._report!.topIncomeCategories.take(5).map(
                                (cat) => _buildCategoryTile(cat, Colors.green),
                              ),
                        ],
                      ],
                    ),
                  ),
                ),
    );
  }

  Widget _buildSummaryCard(String title, double amount, Color color) {
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
              child: Icon(
                title == 'Thu nhập'
                    ? Icons.arrow_upward
                    : title == 'Chi tiêu'
                        ? Icons.arrow_downward
                        : Icons.savings,
                color: color,
                size: 28,
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: TextStyle(
                      fontSize: 14,
                      color: Colors.grey[600],
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    _formatCurrency(amount),
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

  Widget _buildSavingsRateCard() {
    final rate = _report!.savingsRate;
    final color = rate >= 0 ? Colors.green : Colors.red;

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Tỷ lệ tiết kiệm',
              style: TextStyle(
                fontSize: 14,
                color: Colors.grey[600],
              ),
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                Text(
                  '${rate.toStringAsFixed(1)}%',
                  style: TextStyle(
                    fontSize: 32,
                    fontWeight: FontWeight.bold,
                    color: color,
                  ),
                ),
                const SizedBox(width: 8),
                Icon(
                  rate >= 0 ? Icons.trending_up : Icons.trending_down,
                  color: color,
                  size: 32,
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMonthlyTrendsTable() {
    return Card(
      child: SingleChildScrollView(
        scrollDirection: Axis.horizontal,
        child: DataTable(
          columnSpacing: 24,
          headingRowColor: WidgetStateProperty.all(Colors.grey[100]),
          columns: const [
            DataColumn(label: Text('Tháng', style: TextStyle(fontWeight: FontWeight.bold))),
            DataColumn(label: Text('Thu nhập', style: TextStyle(fontWeight: FontWeight.bold))),
            DataColumn(label: Text('Chi tiêu', style: TextStyle(fontWeight: FontWeight.bold))),
            DataColumn(label: Text('Tiết kiệm', style: TextStyle(fontWeight: FontWeight.bold))),
          ],
          rows: _report!.monthlyData.map((data) {
            return DataRow(
              cells: [
                DataCell(Text(data.month)),
                DataCell(Text(
                  _formatCurrency(data.income),
                  style: const TextStyle(color: Colors.green),
                )),
                DataCell(Text(
                  _formatCurrency(data.expense),
                  style: const TextStyle(color: Colors.red),
                )),
                DataCell(Text(
                  _formatCurrency(data.netSavings),
                  style: TextStyle(
                    color: data.netSavings >= 0 ? Colors.blue : Colors.red,
                    fontWeight: FontWeight.bold,
                  ),
                )),
              ],
            );
          }).toList(),
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
            '💰',
            style: const TextStyle(fontSize: 20),
          ),
        ),
        title: Text(category.categoryName),
        subtitle: Text('${category.transactionCount} giao dịch'),
        trailing: Text(
          _formatCurrency(category.amount),
          style: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.bold,
            color: color,
          ),
        ),
      ),
    );
  }
}
