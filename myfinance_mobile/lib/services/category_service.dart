import '../models/api_response.dart';
import '../models/category.dart';
import 'api_service.dart';

class CategoryService {
  final ApiService _api = ApiService();

  Future<ApiResponse<List<Category>>> getCategories({
    TransactionType? type,
  }) async {
    try {
      final queryParams = <String, dynamic>{};
      if (type != null) {
        queryParams['type'] = type == TransactionType.INCOME ? 'INCOME' : 'EXPENSE';
      }

      final response = await _api.get('/categories', queryParameters: queryParams);

      if (response.data['success'] == true) {
        final List<dynamic> dataList = response.data['data'] ?? [];
        final categories = dataList.map((e) => Category.fromJson(e)).toList();
        return ApiResponse(
          success: true,
          message: response.data['message'],
          data: categories,
        );
      }

      return ApiResponse(
        success: false,
        message: response.data['message'] ?? 'Không thể tải danh mục',
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

  Future<ApiResponse<Category>> getCategory(int id) async {
    try {
      final response = await _api.get('/categories/$id');

      if (response.data['success'] == true) {
        return ApiResponse(
          success: true,
          message: response.data['message'],
          data: Category.fromJson(response.data['data']),
        );
      }

      return ApiResponse(
        success: false,
        message: response.data['message'] ?? 'Không tìm thấy danh mục',
      );
    } catch (e) {
      return ApiResponse(
        success: false,
        message: 'Đã xảy ra lỗi: ${e.toString()}',
      );
    }
  }
}
