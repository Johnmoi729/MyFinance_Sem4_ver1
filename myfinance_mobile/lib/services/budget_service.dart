import '../models/api_response.dart';
import '../models/budget.dart';
import 'api_service.dart';

class BudgetService {
  final ApiService _api = ApiService();

  Future<ApiResponse<List<Budget>>> getBudgets({
    int? year,
    int? month,
  }) async {
    try {
      final queryParams = <String, dynamic>{};
      if (year != null) queryParams['year'] = year;
      if (month != null) queryParams['month'] = month;

      final response = await _api.get('/budgets', queryParameters: queryParams);

      if (response.data['success'] == true) {
        final List<dynamic> dataList = response.data['data'] ?? [];
        final budgets = dataList.map((e) => Budget.fromJson(e)).toList();
        return ApiResponse(
          success: true,
          message: response.data['message'],
          data: budgets,
        );
      }

      return ApiResponse(
        success: false,
        message: response.data['message'] ?? 'Không thể tải ngân sách',
        data: [],
      );
    } catch (e) {
      return ApiResponse(
        success: false,
        message: 'Đã xảy ra lỗi: ${e.toString()}',
        data: [],
      );
    }
  }

  Future<ApiResponse<List<Budget>>> getCurrentMonthBudgets() async {
    try {
      final response = await _api.get('/budgets/current');

      if (response.data['success'] == true) {
        final List<dynamic> dataList = response.data['data'] ?? [];
        final budgets = dataList.map((e) => Budget.fromJson(e)).toList();
        return ApiResponse(
          success: true,
          message: response.data['message'],
          data: budgets,
        );
      }

      return ApiResponse(
        success: false,
        message: response.data['message'] ?? 'Không thể tải ngân sách',
        data: [],
      );
    } catch (e) {
      return ApiResponse(
        success: false,
        message: 'Đã xảy ra lỗi: ${e.toString()}',
        data: [],
      );
    }
  }

  Future<ApiResponse<List<BudgetUsage>>> getCurrentMonthUsage() async {
    try {
      final response = await _api.get('/budgets/analytics/usage/current');

      if (response.data['success'] == true) {
        final List<dynamic> dataList = response.data['data'] ?? [];
        final usage = dataList.map((e) => BudgetUsage.fromJson(e)).toList();
        return ApiResponse(
          success: true,
          message: response.data['message'],
          data: usage,
        );
      }

      return ApiResponse(
        success: false,
        message: response.data['message'] ?? 'Không thể tải thống kê ngân sách',
        data: [],
      );
    } catch (e) {
      return ApiResponse(
        success: false,
        message: 'Đã xảy ra lỗi: ${e.toString()}',
        data: [],
      );
    }
  }

  Future<ApiResponse<BudgetWarningResponse>> getBudgetWarnings() async {
    try {
      final response = await _api.get('/budgets/analytics/warnings');

      if (response.data['success'] == true) {
        final warnings = BudgetWarningResponse.fromJson(response.data['data']);
        return ApiResponse(
          success: true,
          message: response.data['message'],
          data: warnings,
        );
      }

      return ApiResponse(
        success: false,
        message: response.data['message'] ?? 'Không thể tải cảnh báo ngân sách',
      );
    } catch (e) {
      return ApiResponse(
        success: false,
        message: 'Đã xảy ra lỗi: ${e.toString()}',
      );
    }
  }
}
