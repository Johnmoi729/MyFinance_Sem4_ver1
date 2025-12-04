import '../models/api_response.dart';
import '../models/transaction.dart';
import '../models/category.dart';
import 'api_service.dart';

class TransactionService {
  final ApiService _api = ApiService();

  Future<ApiResponse<List<Transaction>>> getTransactions({
    TransactionType? type,
  }) async {
    try {
      final queryParams = <String, dynamic>{};
      if (type != null) {
        queryParams['type'] = type == TransactionType.INCOME ? 'INCOME' : 'EXPENSE';
      }

      final response = await _api.get('/transactions', queryParameters: queryParams);

      if (response.data['success'] == true) {
        final List<dynamic> dataList = response.data['data'] ?? [];
        final transactions = dataList.map((e) => Transaction.fromJson(e)).toList();
        return ApiResponse(
          success: true,
          message: response.data['message'],
          data: transactions,
        );
      }

      return ApiResponse(
        success: false,
        message: response.data['message'] ?? 'Không thể tải giao dịch',
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

  Future<ApiResponse<List<Transaction>>> getRecentTransactions() async {
    try {
      final response = await _api.get('/transactions/recent');

      if (response.data['success'] == true) {
        final List<dynamic> dataList = response.data['data'] ?? [];
        final transactions = dataList.map((e) => Transaction.fromJson(e)).toList();
        return ApiResponse(
          success: true,
          message: response.data['message'],
          data: transactions,
        );
      }

      return ApiResponse(
        success: false,
        message: response.data['message'] ?? 'Không thể tải giao dịch',
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

  Future<ApiResponse<Transaction>> createTransaction(TransactionRequest request) async {
    try {
      final response = await _api.post('/transactions/add', data: request.toJson());

      if (response.data['success'] == true) {
        return ApiResponse(
          success: true,
          message: response.data['message'],
          data: Transaction.fromJson(response.data['data']),
        );
      }

      return ApiResponse(
        success: false,
        message: response.data['message'] ?? 'Không thể tạo giao dịch',
      );
    } catch (e) {
      return ApiResponse(
        success: false,
        message: 'Đã xảy ra lỗi: ${e.toString()}',
      );
    }
  }

  Future<ApiResponse<Transaction>> updateTransaction(int id, TransactionRequest request) async {
    try {
      final response = await _api.put('/transactions/$id', data: request.toJson());

      if (response.data['success'] == true) {
        return ApiResponse(
          success: true,
          message: response.data['message'],
          data: Transaction.fromJson(response.data['data']),
        );
      }

      return ApiResponse(
        success: false,
        message: response.data['message'] ?? 'Không thể cập nhật giao dịch',
      );
    } catch (e) {
      return ApiResponse(
        success: false,
        message: 'Đã xảy ra lỗi: ${e.toString()}',
      );
    }
  }

  Future<ApiResponse<void>> deleteTransaction(int id) async {
    try {
      final response = await _api.delete('/transactions/$id');

      return ApiResponse(
        success: response.data['success'] == true,
        message: response.data['message'] ?? 'Đã xóa giao dịch',
      );
    } catch (e) {
      return ApiResponse(
        success: false,
        message: 'Đã xảy ra lỗi: ${e.toString()}',
      );
    }
  }
}
