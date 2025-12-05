import 'package:flutter/material.dart';
import '../../services/category_service.dart';
import '../../models/category.dart';

class CategoriesScreen extends StatefulWidget {
  const CategoriesScreen({super.key});

  @override
  State<CategoriesScreen> createState() => _CategoriesScreenState();
}

class _CategoriesScreenState extends State<CategoriesScreen>
    with SingleTickerProviderStateMixin {
  final CategoryService _categoryService = CategoryService();
  late TabController _tabController;

  List<Category> _incomeCategories = [];
  List<Category> _expenseCategories = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
    _loadCategories();
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  Future<void> _loadCategories() async {
    setState(() => _isLoading = true);

    final incomeResponse = await _categoryService.getCategories(
      type: TransactionType.INCOME,
    );
    final expenseResponse = await _categoryService.getCategories(
      type: TransactionType.EXPENSE,
    );

    if (incomeResponse.success && incomeResponse.data != null) {
      _incomeCategories = incomeResponse.data!;
    }
    if (expenseResponse.success && expenseResponse.data != null) {
      _expenseCategories = expenseResponse.data!;
    }

    setState(() => _isLoading = false);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Danh mục'),
        bottom: TabBar(
          controller: _tabController,
          tabs: const [
            Tab(text: 'Chi tiêu'),
            Tab(text: 'Thu nhập'),
          ],
        ),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : TabBarView(
              controller: _tabController,
              children: [
                _buildCategoryList(_expenseCategories, TransactionType.EXPENSE),
                _buildCategoryList(_incomeCategories, TransactionType.INCOME),
              ],
            ),
    );
  }

  Widget _buildCategoryList(List<Category> categories, TransactionType type) {
    if (categories.isEmpty) {
      return Center(
        child: Text(
          type == TransactionType.INCOME
              ? 'Chưa có danh mục thu nhập'
              : 'Chưa có danh mục chi tiêu',
        ),
      );
    }

    return RefreshIndicator(
      onRefresh: _loadCategories,
      child: ListView.builder(
        padding: const EdgeInsets.all(8),
        itemCount: categories.length,
        itemBuilder: (context, index) {
          final category = categories[index];
          return _buildCategoryCard(category);
        },
      ),
    );
  }

  Widget _buildCategoryCard(Category category) {
    Color categoryColor;
    try {
      categoryColor = Color(int.parse(category.color?.replaceFirst('#', '0xFF') ?? '0xFF6366F1'));
    } catch (e) {
      categoryColor = Colors.indigo;
    }

    return Card(
      margin: const EdgeInsets.symmetric(vertical: 4, horizontal: 8),
      child: ListTile(
        leading: CircleAvatar(
          backgroundColor: categoryColor.withValues(alpha: 0.2),
          child: Icon(
            _getIconForCategory(category.icon),
            color: categoryColor,
          ),
        ),
        title: Text(
          category.name,
          style: const TextStyle(fontWeight: FontWeight.bold),
        ),
        subtitle: Text(
          category.type == TransactionType.INCOME ? 'Thu nhập' : 'Chi tiêu',
        ),
        trailing: category.isDefault == true
            ? Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: Colors.grey[200],
                  borderRadius: BorderRadius.circular(12),
                ),
                child: const Text(
                  'Mặc định',
                  style: TextStyle(fontSize: 12),
                ),
              )
            : null,
      ),
    );
  }

  IconData _getIconForCategory(String? iconName) {
    // Map icon names to Material icons
    final iconMap = {
      'salary': Icons.work,
      'bonus': Icons.card_giftcard,
      'investment': Icons.trending_up,
      'gift': Icons.redeem,
      'other_income': Icons.attach_money,
      'food': Icons.restaurant,
      'transport': Icons.directions_car,
      'shopping': Icons.shopping_bag,
      'entertainment': Icons.movie,
      'health': Icons.medical_services,
      'education': Icons.school,
      'bills': Icons.receipt,
      'home': Icons.home,
      'other_expense': Icons.money_off,
    };

    return iconMap[iconName] ?? Icons.category;
  }
}
