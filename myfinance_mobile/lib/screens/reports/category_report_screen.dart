import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../../services/report_service.dart';
import '../../services/category_service.dart';
import '../../models/category_report.dart';
import '../../models/category.dart';

class CategoryReportScreen extends StatefulWidget {
  const CategoryReportScreen({super.key});

  @override
  State<CategoryReportScreen> createState() => _CategoryReportScreenState();
}

class _CategoryReportScreenState extends State<CategoryReportScreen> {
  final ReportService _reportService = ReportService();
  final CategoryService _categoryService = CategoryService();

  CategoryReport? _report;
  List<Category> _categories = [];
  bool _isLoading = true;
  bool _isLoadingReport = false;
  String _error = '';

  int? _selectedCategoryId;
  DateTime _startDate = DateTime.now().subtract(const Duration(days: 30));
  DateTime _endDate = DateTime.now();

  @override
  void initState() {
    super.initState();
    _loadCategories();
  }

  Future<void> _loadCategories() async {
    setState(() {
      _isLoading = true;
      _error = '';
    });

    final response = await _categoryService.getCategories();

    if (!mounted) return;

    setState(() {
      _isLoading = false;
      if (response.success && response.data != null) {
        _categories = response.data!;
        if (_categories.isNotEmpty) {
          _selectedCategoryId = _categories.first.id;
          _loadReport();
        }
      } else {
        _error = response.message;
      }
    });
  }

  Future<void> _loadReport() async {
    if (_selectedCategoryId == null) return;

    setState(() {
      _isLoadingReport = true;
      _error = '';
    });

    final startDateStr = DateFormat('yyyy-MM-dd').format(_startDate);
    final endDateStr = DateFormat('yyyy-MM-dd').format(_endDate);

    final response = await _reportService.getCategoryReport(
      categoryId: _selectedCategoryId!,
      startDate: startDateStr,
      endDate: endDateStr,
    );

    if (!mounted) return;

    setState(() {
      _isLoadingReport = false;
      if (response.success && response.data != null) {
        _report = response.data;
      } else {
        _error = response.message;
      }
    });
  }

  Future<void> _selectStartDate() async {
    final picked = await showDatePicker(
      context: context,
      initialDate: _startDate,
      firstDate: DateTime(2020),
      lastDate: _endDate,
    );

    if (picked != null && picked != _startDate) {
      setState(() => _startDate = picked);
      _loadReport();
    }
  }

  Future<void> _selectEndDate() async {
    final picked = await showDatePicker(
      context: context,
      initialDate: _endDate,
      firstDate: _startDate,
      lastDate: DateTime.now(),
    );

    if (picked != null && picked != _endDate) {
      setState(() => _endDate = picked);
      _loadReport();
    }
  }

  void _selectQuickRange(String range) {
    final now = DateTime.now();
    switch (range) {
      case 'thisMonth':
        _startDate = DateTime(now.year, now.month, 1);
        _endDate = now;
        break;
      case 'lastMonth':
        final lastMonth = DateTime(now.year, now.month - 1, 1);
        _startDate = lastMonth;
        _endDate = DateTime(now.year, now.month, 0);
        break;
      case 'last3Months':
        _startDate = DateTime(now.year, now.month - 3, now.day);
        _endDate = now;
        break;
      case 'thisYear':
        _startDate = DateTime(now.year, 1, 1);
        _endDate = now;
        break;
    }
    _loadReport();
  }

  String _formatCurrency(double amount) {
    final formatter = NumberFormat.currency(
      locale: 'vi_VN',
      symbol: '₫',
      decimalDigits: 0,
    );
    return formatter.format(amount);
  }

  String _formatDate(DateTime date) {
    return DateFormat('dd/MM/yyyy').format(date);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Báo cáo theo danh mục'),
        actions: [
          PopupMenuButton<String>(
            icon: const Icon(Icons.more_vert),
            onSelected: (value) {
              if (value == 'monthly') {
                Navigator.pushNamed(context, '/reports/monthly');
              } else if (value == 'yearly') {
                Navigator.pushNamed(context, '/reports/yearly');
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
                value: 'yearly',
                child: Row(
                  children: const [
                    Icon(Icons.date_range),
                    SizedBox(width: 8),
                    Text('Báo cáo năm'),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _error.isNotEmpty && _categories.isEmpty
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(Icons.error_outline, size: 64, color: Colors.red),
                      const SizedBox(height: 16),
                      Text(_error, style: const TextStyle(color: Colors.red)),
                      const SizedBox(height: 16),
                      ElevatedButton(
                        onPressed: _loadCategories,
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
                        // Category Selector
                        Card(
                          child: Padding(
                            padding: const EdgeInsets.all(16),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text(
                                  'Chọn danh mục',
                                  style: TextStyle(
                                    fontSize: 16,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                const SizedBox(height: 8),
                                DropdownButtonFormField<int>(
                                  initialValue: _selectedCategoryId,
                                  decoration: const InputDecoration(
                                    border: OutlineInputBorder(),
                                    contentPadding: EdgeInsets.symmetric(
                                      horizontal: 12,
                                      vertical: 8,
                                    ),
                                  ),
                                  items: _categories.map((category) {
                                    return DropdownMenuItem(
                                      value: category.id,
                                      child: Row(
                                        children: [
                                          Container(
                                            width: 8,
                                            height: 8,
                                            decoration: BoxDecoration(
                                              color: _parseColor(category.color),
                                              shape: BoxShape.circle,
                                            ),
                                          ),
                                          const SizedBox(width: 8),
                                          Text(category.name),
                                          const SizedBox(width: 4),
                                          Text(
                                            '(${category.type})',
                                            style: TextStyle(
                                              fontSize: 12,
                                              color: Colors.grey[600],
                                            ),
                                          ),
                                        ],
                                      ),
                                    );
                                  }).toList(),
                                  onChanged: (value) {
                                    if (value != null) {
                                      setState(() => _selectedCategoryId = value);
                                      _loadReport();
                                    }
                                  },
                                ),
                              ],
                            ),
                          ),
                        ),
                        const SizedBox(height: 16),

                        // Date Range Selector
                        Card(
                          child: Padding(
                            padding: const EdgeInsets.all(16),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text(
                                  'Khoảng thời gian',
                                  style: TextStyle(
                                    fontSize: 16,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                const SizedBox(height: 12),
                                Row(
                                  children: [
                                    Expanded(
                                      child: OutlinedButton.icon(
                                        onPressed: _selectStartDate,
                                        icon: const Icon(Icons.calendar_today),
                                        label: Text(_formatDate(_startDate)),
                                      ),
                                    ),
                                    const SizedBox(width: 8),
                                    const Text('→'),
                                    const SizedBox(width: 8),
                                    Expanded(
                                      child: OutlinedButton.icon(
                                        onPressed: _selectEndDate,
                                        icon: const Icon(Icons.calendar_today),
                                        label: Text(_formatDate(_endDate)),
                                      ),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 12),
                                Wrap(
                                  spacing: 8,
                                  children: [
                                    ActionChip(
                                      label: const Text('Tháng này'),
                                      onPressed: () => _selectQuickRange('thisMonth'),
                                    ),
                                    ActionChip(
                                      label: const Text('Tháng trước'),
                                      onPressed: () => _selectQuickRange('lastMonth'),
                                    ),
                                    ActionChip(
                                      label: const Text('3 tháng'),
                                      onPressed: () => _selectQuickRange('last3Months'),
                                    ),
                                    ActionChip(
                                      label: const Text('Năm nay'),
                                      onPressed: () => _selectQuickRange('thisYear'),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ),
                        ),
                        const SizedBox(height: 24),

                        // Report Content
                        if (_isLoadingReport)
                          const Center(
                            child: Padding(
                              padding: EdgeInsets.all(32),
                              child: CircularProgressIndicator(),
                            ),
                          )
                        else if (_report != null) ...[
                          // Summary Statistics
                          const Text(
                            'Tổng quan',
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 12),
                          _buildSummaryCard(),
                          const SizedBox(height: 24),

                          // Monthly Breakdown
                          if (_report!.monthlyBreakdown.isNotEmpty) ...[
                            const Text(
                              'Phân tích theo tháng',
                              style: TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            const SizedBox(height: 12),
                            _buildMonthlyBreakdownList(),
                          ],
                        ] else if (_error.isNotEmpty)
                          Center(
                            child: Padding(
                              padding: const EdgeInsets.all(32),
                              child: Text(
                                _error,
                                style: const TextStyle(color: Colors.red),
                                textAlign: TextAlign.center,
                              ),
                            ),
                          ),
                      ],
                    ),
                  ),
                ),
    );
  }

  Color _parseColor(String? colorString) {
    if (colorString == null || colorString.isEmpty) {
      return Colors.grey;
    }
    try {
      return Color(int.parse(colorString.substring(1, 7), radix: 16) + 0xFF000000);
    } catch (e) {
      return Colors.grey;
    }
  }

  Widget _buildSummaryCard() {
    final categoryColor = _categories
        .firstWhere((c) => c.id == _selectedCategoryId)
        .color;
    final color = _parseColor(categoryColor);

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            _buildSummaryRow(
              'Tổng số tiền',
              _formatCurrency(_report!.totalAmount),
              color,
              Icons.account_balance_wallet,
            ),
            const Divider(height: 24),
            _buildSummaryRow(
              'Số giao dịch',
              _report!.transactionCount.toString(),
              Colors.blue,
              Icons.receipt_long,
            ),
            const Divider(height: 24),
            _buildSummaryRow(
              'Trung bình',
              _formatCurrency(_report!.averageAmount),
              Colors.orange,
              Icons.trending_up,
            ),
            const Divider(height: 24),
            Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Nhỏ nhất',
                        style: TextStyle(
                          fontSize: 12,
                          color: Colors.grey[600],
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        _formatCurrency(_report!.minAmount),
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: Colors.green,
                        ),
                      ),
                    ],
                  ),
                ),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      Text(
                        'Lớn nhất',
                        style: TextStyle(
                          fontSize: 12,
                          color: Colors.grey[600],
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        _formatCurrency(_report!.maxAmount),
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: Colors.red,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSummaryRow(String label, String value, Color color, IconData icon) {
    return Row(
      children: [
        Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: color.withValues(alpha: 0.1),
            borderRadius: BorderRadius.circular(8),
          ),
          child: Icon(icon, color: color, size: 24),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                label,
                style: TextStyle(
                  fontSize: 12,
                  color: Colors.grey[600],
                ),
              ),
              const SizedBox(height: 4),
              Text(
                value,
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: color,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildMonthlyBreakdownList() {
    return Card(
      child: ListView.separated(
        shrinkWrap: true,
        physics: const NeverScrollableScrollPhysics(),
        itemCount: _report!.monthlyBreakdown.length,
        separatorBuilder: (context, index) => const Divider(height: 1),
        itemBuilder: (context, index) {
          final data = _report!.monthlyBreakdown[index];
          return ListTile(
            leading: CircleAvatar(
              backgroundColor: Colors.blue.withValues(alpha: 0.1),
              child: Text(
                '${index + 1}',
                style: const TextStyle(
                  color: Colors.blue,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
            title: Text(data.month),
            subtitle: Text('${data.count} giao dịch'),
            trailing: Text(
              _formatCurrency(data.amount),
              style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
              ),
            ),
          );
        },
      ),
    );
  }
}
