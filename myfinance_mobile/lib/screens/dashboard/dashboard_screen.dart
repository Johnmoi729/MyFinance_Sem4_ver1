import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../../providers/auth_provider.dart';
import '../../services/transaction_service.dart';
import '../../services/budget_service.dart';
import '../../models/transaction.dart';
import '../../models/budget.dart';
import '../../models/category.dart';
import '../../widgets/personalized_greeting.dart';
import '../../widgets/financial_health_score.dart';
import '../../widgets/budget_vs_actual_chart.dart';
import '../../widgets/category_pie_chart.dart';
import '../../widgets/monthly_trend_chart.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  final TransactionService _transactionService = TransactionService();
  final BudgetService _budgetService = BudgetService();

  List<Transaction> _recentTransactions = [];
  List<BudgetUsage> _budgetUsage = [];
  BudgetWarningResponse? _budgetWarnings;
  bool _isLoading = true;
  double _totalIncome = 0;
  double _totalExpense = 0;
  List<CategoryExpenseData> _categoryExpenses = [];
  List<MonthlyTrendData> _monthlyTrends = [];

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    setState(() => _isLoading = true);

    // Load recent transactions
    final transactionsResponse = await _transactionService.getRecentTransactions();
    if (transactionsResponse.success && transactionsResponse.data != null) {
      _recentTransactions = transactionsResponse.data!;
    }

    // Load all transactions for summary
    final allTransactionsResponse = await _transactionService.getTransactions();
    if (allTransactionsResponse.success && allTransactionsResponse.data != null) {
      final allTransactions = allTransactionsResponse.data!;

      _totalIncome = allTransactions
          .where((t) => t.type == TransactionType.INCOME)
          .fold(0.0, (sum, t) => sum + t.amount);
      _totalExpense = allTransactions
          .where((t) => t.type == TransactionType.EXPENSE)
          .fold(0.0, (sum, t) => sum + t.amount);

      // Calculate category expenses (top 5)
      final Map<String, double> categoryMap = {};
      for (final transaction in allTransactions.where((t) => t.type == TransactionType.EXPENSE)) {
        final categoryName = transaction.category.name;
        categoryMap[categoryName] = (categoryMap[categoryName] ?? 0) + transaction.amount;
      }

      final sortedCategories = categoryMap.entries.toList()
        ..sort((a, b) => b.value.compareTo(a.value));

      _categoryExpenses = sortedCategories
          .take(5)
          .map((entry) => CategoryExpenseData(
                categoryName: entry.key,
                amount: entry.value,
              ))
          .toList();

      // Calculate monthly trends (last 6 months)
      final now = DateTime.now();
      final Map<String, Map<String, double>> monthlyMap = {};

      for (int i = 5; i >= 0; i--) {
        final month = DateTime(now.year, now.month - i, 1);
        final monthKey = DateFormat('MM/yyyy').format(month);
        monthlyMap[monthKey] = {'income': 0.0, 'expense': 0.0};
      }

      for (final transaction in allTransactions) {
        final monthKey = DateFormat('MM/yyyy').format(transaction.transactionDate);
        if (monthlyMap.containsKey(monthKey)) {
          if (transaction.type == TransactionType.INCOME) {
            monthlyMap[monthKey]!['income'] =
                (monthlyMap[monthKey]!['income'] ?? 0) + transaction.amount;
          } else {
            monthlyMap[monthKey]!['expense'] =
                (monthlyMap[monthKey]!['expense'] ?? 0) + transaction.amount;
          }
        }
      }

      _monthlyTrends = monthlyMap.entries.map((entry) {
        final parts = entry.key.split('/');
        final monthLabel = 'T${parts[0]}';
        return MonthlyTrendData(
          monthLabel: monthLabel,
          income: entry.value['income'] ?? 0.0,
          expense: entry.value['expense'] ?? 0.0,
        );
      }).toList();
    }

    // Load budget usage
    final budgetResponse = await _budgetService.getCurrentMonthUsage();
    if (budgetResponse.success && budgetResponse.data != null) {
      _budgetUsage = budgetResponse.data!;
    }

    // Load budget warnings
    final warningsResponse = await _budgetService.getBudgetWarnings();
    if (warningsResponse.success && warningsResponse.data != null) {
      _budgetWarnings = warningsResponse.data;
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

  void _showBudgetWarningsSheet() {
    if (_budgetWarnings == null || _budgetWarnings!.alerts.isEmpty) return;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) => DraggableScrollableSheet(
        initialChildSize: 0.6,
        minChildSize: 0.4,
        maxChildSize: 0.9,
        expand: false,
        builder: (context, scrollController) => Column(
          children: [
            // Handle bar
            Container(
              margin: const EdgeInsets.only(top: 8, bottom: 16),
              width: 40,
              height: 4,
              decoration: BoxDecoration(
                color: Colors.grey[300],
                borderRadius: BorderRadius.circular(2),
              ),
            ),
            // Header
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'Cảnh báo ngân sách',
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.close),
                    onPressed: () => Navigator.pop(context),
                  ),
                ],
              ),
            ),
            // Summary
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              child: Row(
                children: [
                  if (_budgetWarnings!.warningCount > 0)
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                      decoration: BoxDecoration(
                        color: Colors.orange.withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Text(
                        '${_budgetWarnings!.warningCount} Cảnh báo',
                        style: const TextStyle(
                          color: Colors.orange,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  const SizedBox(width: 8),
                  if (_budgetWarnings!.overBudgetCount > 0)
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                      decoration: BoxDecoration(
                        color: Colors.red.withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Text(
                        '${_budgetWarnings!.overBudgetCount} Vượt ngân sách',
                        style: const TextStyle(
                          color: Colors.red,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                ],
              ),
            ),
            const Divider(),
            // Alerts list
            Expanded(
              child: ListView.builder(
                controller: scrollController,
                padding: const EdgeInsets.all(16),
                itemCount: _budgetWarnings!.alerts.length,
                itemBuilder: (context, index) {
                  final alert = _budgetWarnings!.alerts[index];
                  final color = alert.alertLevel == 'RED' ? Colors.red : Colors.orange;

                  return Card(
                    margin: const EdgeInsets.only(bottom: 12),
                    child: ListTile(
                      leading: CircleAvatar(
                        backgroundColor: color.withValues(alpha: 0.1),
                        child: Icon(
                          alert.alertType == 'OVER_BUDGET'
                              ? Icons.error
                              : Icons.warning_amber_rounded,
                          color: color,
                        ),
                      ),
                      title: Text(
                        alert.categoryName,
                        style: const TextStyle(fontWeight: FontWeight.bold),
                      ),
                      subtitle: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const SizedBox(height: 4),
                          Text(alert.message),
                          const SizedBox(height: 8),
                          LinearProgressIndicator(
                            value: (alert.usagePercentage / 100).clamp(0.0, 1.0),
                            backgroundColor: Colors.grey[200],
                            valueColor: AlwaysStoppedAnimation(color),
                          ),
                          const SizedBox(height: 4),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                '${_formatCurrency(alert.actualSpent)} / ${_formatCurrency(alert.budgetAmount)}',
                                style: TextStyle(
                                  fontSize: 12,
                                  color: Colors.grey[600],
                                ),
                              ),
                              Text(
                                '${alert.usagePercentage.toStringAsFixed(0)}%',
                                style: TextStyle(
                                  fontSize: 12,
                                  fontWeight: FontWeight.bold,
                                  color: color,
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                      onTap: () {
                        Navigator.pop(context);
                        Navigator.pushNamed(context, '/budgets');
                      },
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = context.watch<AuthProvider>();
    final user = authProvider.user;

    return Scaffold(
      appBar: AppBar(
        title: const Text('MyFinance'),
        actions: [
          // Budget warnings indicator
          if (_budgetWarnings != null &&
              (_budgetWarnings!.warningCount > 0 || _budgetWarnings!.overBudgetCount > 0))
            Stack(
              children: [
                IconButton(
                  icon: const Icon(Icons.warning_amber_rounded),
                  color: _budgetWarnings!.overBudgetCount > 0 ? Colors.red : Colors.orange,
                  onPressed: _showBudgetWarningsSheet,
                ),
                Positioned(
                  right: 8,
                  top: 8,
                  child: Container(
                    padding: const EdgeInsets.all(4),
                    decoration: BoxDecoration(
                      color: _budgetWarnings!.overBudgetCount > 0 ? Colors.red : Colors.orange,
                      shape: BoxShape.circle,
                    ),
                    constraints: const BoxConstraints(
                      minWidth: 16,
                      minHeight: 16,
                    ),
                    child: Text(
                      '${_budgetWarnings!.warningCount + _budgetWarnings!.overBudgetCount}',
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                      ),
                      textAlign: TextAlign.center,
                    ),
                  ),
                ),
              ],
            ),
          IconButton(
            icon: const Icon(Icons.person),
            onPressed: () {
              Navigator.pushNamed(context, '/profile');
            },
          ),
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _loadData,
          ),
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () async {
              await authProvider.logout();
              if (context.mounted) {
                Navigator.pushReplacementNamed(context, '/login');
              }
            },
          ),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: _loadData,
              child: SingleChildScrollView(
                physics: const AlwaysScrollableScrollPhysics(),
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Personalized Greeting
                    PersonalizedGreeting(
                      userName: user?.fullName ?? '',
                    ),
                    const SizedBox(height: 24),

                    // Summary cards
                    Row(
                      children: [
                        Expanded(
                          child: _buildSummaryCard(
                            'Thu nhập',
                            _formatCurrency(_totalIncome),
                            Colors.green,
                            Icons.arrow_upward,
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: _buildSummaryCard(
                            'Chi tiêu',
                            _formatCurrency(_totalExpense),
                            Colors.red,
                            Icons.arrow_downward,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    _buildSummaryCard(
                      'Số dư',
                      _formatCurrency(_totalIncome - _totalExpense),
                      Colors.blue,
                      Icons.account_balance_wallet,
                    ),
                    const SizedBox(height: 24),

                    // Financial Health Score
                    FinancialHealthScore(
                      totalIncome: _totalIncome,
                      totalExpense: _totalExpense,
                      budgetsOnTrack: _budgetUsage.where((b) => b.usagePercentage < 100).length,
                      totalBudgets: _budgetUsage.length,
                    ),
                    const SizedBox(height: 24),

                    // Budget usage section
                    if (_budgetUsage.isNotEmpty) ...[
                      const Text(
                        'Ngân sách tháng này',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 12),
                      ..._budgetUsage.take(3).map((usage) => _buildBudgetCard(usage)),
                      const SizedBox(height: 16),
                      BudgetVsActualChart(
                        budgets: _budgetUsage.take(5).map((usage) => BudgetComparisonData(
                          categoryName: usage.categoryName,
                          budgetAmount: usage.budgetAmount,
                          actualAmount: usage.actualSpent,
                        )).toList(),
                      ),
                      const SizedBox(height: 24),
                    ],

                    // Category Pie Chart
                    if (_categoryExpenses.isNotEmpty) ...[
                      CategoryPieChart(
                        expenses: _categoryExpenses,
                      ),
                      const SizedBox(height: 24),
                    ],

                    // Monthly Trend Chart
                    if (_monthlyTrends.isNotEmpty) ...[
                      MonthlyTrendChart(
                        trends: _monthlyTrends,
                      ),
                      const SizedBox(height: 24),
                    ],

                    // Reports button
                    Card(
                      child: InkWell(
                        onTap: () {
                          Navigator.pushNamed(context, '/reports/monthly');
                        },
                        child: const Padding(
                          padding: EdgeInsets.all(16),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Row(
                                children: [
                                  Icon(Icons.assessment, color: Colors.blue),
                                  SizedBox(width: 12),
                                  Text(
                                    'Xem báo cáo tháng',
                                    style: TextStyle(
                                      fontSize: 16,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ],
                              ),
                              Icon(Icons.chevron_right, color: Colors.grey),
                            ],
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(height: 24),

                    // Recent transactions
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text(
                          'Giao dịch gần đây',
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        TextButton(
                          onPressed: () {
                            Navigator.pushNamed(context, '/transactions');
                          },
                          child: const Text('Xem tất cả'),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    if (_recentTransactions.isEmpty)
                      const Center(
                        child: Padding(
                          padding: EdgeInsets.all(32),
                          child: Text('Chưa có giao dịch nào'),
                        ),
                      )
                    else
                      ..._recentTransactions
                          .take(5)
                          .map((t) => _buildTransactionTile(t)),
                  ],
                ),
              ),
            ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          Navigator.pushNamed(context, '/transactions/add');
        },
        tooltip: 'Thêm giao dịch',
        child: const Icon(Icons.add),
      ),
      bottomNavigationBar: BottomNavigationBar(
        type: BottomNavigationBarType.fixed,
        currentIndex: 0,
        onTap: (index) {
          switch (index) {
            case 0:
              break; // Already on dashboard
            case 1:
              Navigator.pushNamed(context, '/transactions');
              break;
            case 2:
              Navigator.pushNamed(context, '/budgets');
              break;
            case 3:
              Navigator.pushNamed(context, '/categories');
              break;
          }
        },
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.dashboard),
            label: 'Tổng quan',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.receipt_long),
            label: 'Giao dịch',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.pie_chart),
            label: 'Ngân sách',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.category),
            label: 'Danh mục',
          ),
        ],
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
      elevation: 2,
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
              child: Icon(icon, color: color),
            ),
            const SizedBox(width: 12),
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
                      fontSize: 16,
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

  Widget _buildBudgetCard(BudgetUsage usage) {
    Color statusColor;
    switch (usage.status) {
      case 'SAFE':
        statusColor = Colors.green;
        break;
      case 'WARNING':
        statusColor = Colors.orange;
        break;
      case 'CRITICAL':
      case 'OVER_BUDGET':
        statusColor = Colors.red;
        break;
      default:
        statusColor = Colors.grey;
    }

    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  usage.categoryName,
                  style: const TextStyle(fontWeight: FontWeight.bold),
                ),
                Text(
                  '${usage.usagePercentage.toStringAsFixed(0)}%',
                  style: TextStyle(
                    color: statusColor,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            LinearProgressIndicator(
              value: (usage.usagePercentage / 100).clamp(0.0, 1.0),
              backgroundColor: Colors.grey[200],
              valueColor: AlwaysStoppedAnimation(statusColor),
            ),
            const SizedBox(height: 4),
            Text(
              '${_formatCurrency(usage.actualSpent)} / ${_formatCurrency(usage.budgetAmount)}',
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

  Widget _buildTransactionTile(Transaction transaction) {
    final isIncome = transaction.type == TransactionType.INCOME;
    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      child: ListTile(
        leading: CircleAvatar(
          backgroundColor: isIncome
              ? Colors.green.withValues(alpha: 0.1)
              : Colors.red.withValues(alpha: 0.1),
          child: Icon(
            isIncome ? Icons.arrow_upward : Icons.arrow_downward,
            color: isIncome ? Colors.green : Colors.red,
          ),
        ),
        title: Text(transaction.category.name),
        subtitle: Text(
          transaction.description ?? DateFormat('dd/MM/yyyy').format(transaction.transactionDate),
        ),
        trailing: Text(
          '${isIncome ? '+' : '-'}${_formatCurrency(transaction.amount)}',
          style: TextStyle(
            color: isIncome ? Colors.green : Colors.red,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
    );
  }
}
