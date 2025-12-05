import '../models/api_response.dart';
import '../models/monthly_report.dart';
import 'api_service.dart';

class ReportService {
  final ApiService _api = ApiService();

  Future<ApiResponse<MonthlyReport>> getMonthlyReport(int year, int month) async {
    try {
      final response = await _api.get('/reports/monthly?year=$year&month=$month');

      if (response.data['success'] == true) {
        return ApiResponse(
          success: true,
          message: response.data['message'],
          data: MonthlyReport.fromJson(response.data['data']),
        );
      }

      return ApiResponse(
        success: false,
        message: response.data['message'] ?? 'Không thể lấy báo cáo tháng',
      );
    } catch (e) {
      return ApiResponse(
        success: false,
        message: _getErrorMessage(e),
      );
    }
  }

  Future<ApiResponse<MonthlyReport>> getCurrentMonthReport() async {
    final now = DateTime.now();
    return getMonthlyReport(now.year, now.month);
  }

  String _getErrorMessage(dynamic error) {
    if (error.toString().contains('SocketException')) {
      return 'Không thể kết nối đến máy chủ';
    }
    if (error.toString().contains('TimeoutException')) {
      return 'Kết nối quá thời gian chờ';
    }
    return 'Đã xảy ra lỗi: ${error.toString()}';
  }
}
