import '../models/api_response.dart';
import '../models/user.dart';
import 'api_service.dart';

class AuthService {
  final ApiService _api = ApiService();

  Future<ApiResponse<LoginResponse>> login(String email, String password) async {
    try {
      final response = await _api.post('/auth/login', data: {
        'email': email,
        'password': password,
      });

      if (response.data['success'] == true) {
        final loginResponse = LoginResponse.fromJson(response.data['data']);
        await _api.setToken(loginResponse.token);
        return ApiResponse(
          success: true,
          message: response.data['message'],
          data: loginResponse,
        );
      }

      return ApiResponse(
        success: false,
        message: response.data['message'] ?? 'Đăng nhập thất bại',
      );
    } catch (e) {
      return ApiResponse(
        success: false,
        message: _getErrorMessage(e),
      );
    }
  }

  Future<ApiResponse<User>> register(
    String email,
    String password,
    String fullName,
    String? phoneNumber,
  ) async {
    try {
      final response = await _api.post('/auth/register', data: {
        'email': email,
        'password': password,
        'fullName': fullName,
        'phoneNumber': phoneNumber,
      });

      if (response.data['success'] == true) {
        return ApiResponse(
          success: true,
          message: response.data['message'],
          data: User.fromJson(response.data['data']),
        );
      }

      return ApiResponse(
        success: false,
        message: response.data['message'] ?? 'Đăng ký thất bại',
      );
    } catch (e) {
      return ApiResponse(
        success: false,
        message: _getErrorMessage(e),
      );
    }
  }

  Future<ApiResponse<User>> getProfile() async {
    try {
      final response = await _api.get('/auth/profile');

      if (response.data['success'] == true) {
        return ApiResponse(
          success: true,
          message: response.data['message'],
          data: User.fromJson(response.data['data']),
        );
      }

      return ApiResponse(
        success: false,
        message: response.data['message'] ?? 'Không thể lấy thông tin',
      );
    } catch (e) {
      return ApiResponse(
        success: false,
        message: _getErrorMessage(e),
      );
    }
  }

  Future<ApiResponse<User>> updateProfile(String fullName, String? phoneNumber) async {
    try {
      final response = await _api.put('/auth/profile', data: {
        'fullName': fullName,
        'phoneNumber': phoneNumber,
      });

      if (response.data['success'] == true) {
        return ApiResponse(
          success: true,
          message: response.data['message'],
          data: User.fromJson(response.data['data']),
        );
      }

      return ApiResponse(
        success: false,
        message: response.data['message'] ?? 'Không thể cập nhật thông tin',
      );
    } catch (e) {
      return ApiResponse(
        success: false,
        message: _getErrorMessage(e),
      );
    }
  }

  Future<ApiResponse<void>> changePassword(
    String currentPassword,
    String newPassword,
  ) async {
    try {
      final response = await _api.post('/auth/change-password', data: {
        'currentPassword': currentPassword,
        'newPassword': newPassword,
      });

      return ApiResponse(
        success: response.data['success'] == true,
        message: response.data['message'] ?? 'Đổi mật khẩu thành công',
      );
    } catch (e) {
      return ApiResponse(
        success: false,
        message: _getErrorMessage(e),
      );
    }
  }

  Future<void> logout() async {
    await _api.clearToken();
  }

  Future<bool> isLoggedIn() async {
    return await _api.hasToken();
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
