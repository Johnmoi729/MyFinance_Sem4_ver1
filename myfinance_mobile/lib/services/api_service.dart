import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../config/api_config.dart';

class ApiService {
  static final ApiService _instance = ApiService._internal();
  factory ApiService() => _instance;

  late Dio _dio;
  final FlutterSecureStorage _storage = const FlutterSecureStorage();
  static const String _tokenKey = 'jwt_token';

  ApiService._internal() {
    _dio = Dio(BaseOptions(
      baseUrl: ApiConfig.baseUrl,
      connectTimeout: Duration(milliseconds: ApiConfig.connectTimeout),
      receiveTimeout: Duration(milliseconds: ApiConfig.receiveTimeout),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    ));

    // Add interceptor for JWT token
    _dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) async {
        final token = await getToken();
        if (token != null) {
          options.headers['Authorization'] = 'Bearer $token';
        }
        return handler.next(options);
      },
      onError: (error, handler) {
        // Handle 401 Unauthorized - token expired
        if (error.response?.statusCode == 401) {
          // Clear token and redirect to login
          clearToken();
        }
        return handler.next(error);
      },
    ));
  }

  // Token management
  Future<void> setToken(String token) async {
    await _storage.write(key: _tokenKey, value: token);
  }

  Future<String?> getToken() async {
    return await _storage.read(key: _tokenKey);
  }

  Future<void> clearToken() async {
    await _storage.delete(key: _tokenKey);
  }

  Future<bool> hasToken() async {
    final token = await getToken();
    return token != null && token.isNotEmpty;
  }

  // HTTP methods with proper error handling
  Future<Response> get(String path, {Map<String, dynamic>? queryParameters}) async {
    try {
      return await _dio.get(path, queryParameters: queryParameters);
    } on DioException catch (e) {
      // Return error response in a format that can be handled gracefully
      return _handleDioError(e);
    }
  }

  Future<Response> post(String path, {dynamic data}) async {
    try {
      return await _dio.post(path, data: data);
    } on DioException catch (e) {
      return _handleDioError(e);
    }
  }

  Future<Response> put(String path, {dynamic data}) async {
    try {
      return await _dio.put(path, data: data);
    } on DioException catch (e) {
      return _handleDioError(e);
    }
  }

  Future<Response> delete(String path) async {
    try {
      return await _dio.delete(path);
    } on DioException catch (e) {
      return _handleDioError(e);
    }
  }

  // Handle DioException and extract meaningful error messages
  Response _handleDioError(DioException error) {
    // If backend sent a response with error details, extract it
    if (error.response != null) {
      final responseData = error.response!.data;

      // Backend sends structured error responses
      if (responseData is Map<String, dynamic>) {
        return Response(
          requestOptions: error.requestOptions,
          statusCode: error.response!.statusCode,
          data: {
            'success': false,
            'message': responseData['message'] ?? _getDefaultErrorMessage(error.response!.statusCode),
            'data': null,
          },
        );
      }

      // Fallback for non-structured responses
      return Response(
        requestOptions: error.requestOptions,
        statusCode: error.response!.statusCode,
        data: {
          'success': false,
          'message': _getDefaultErrorMessage(error.response!.statusCode),
          'data': null,
        },
      );
    }

    // Network errors (no response from server)
    return Response(
      requestOptions: error.requestOptions,
      data: {
        'success': false,
        'message': _getNetworkErrorMessage(error.type),
        'data': null,
      },
    );
  }

  // Get user-friendly error messages based on status code
  String _getDefaultErrorMessage(int? statusCode) {
    switch (statusCode) {
      case 400:
        return 'Dữ liệu không hợp lệ';
      case 401:
        return 'Email hoặc mật khẩu không đúng';
      case 403:
        return 'Bạn không có quyền truy cập';
      case 404:
        return 'Không tìm thấy dữ liệu';
      case 500:
        return 'Lỗi máy chủ';
      case 503:
        return 'Dịch vụ tạm thời không khả dụng';
      default:
        return 'Đã xảy ra lỗi';
    }
  }

  // Get user-friendly error messages for network issues
  String _getNetworkErrorMessage(DioExceptionType type) {
    switch (type) {
      case DioExceptionType.connectionTimeout:
        return 'Kết nối quá thời gian chờ';
      case DioExceptionType.sendTimeout:
        return 'Gửi dữ liệu quá thời gian chờ';
      case DioExceptionType.receiveTimeout:
        return 'Nhận dữ liệu quá thời gian chờ';
      case DioExceptionType.connectionError:
        return 'Không thể kết nối đến máy chủ';
      case DioExceptionType.cancel:
        return 'Yêu cầu đã bị hủy';
      default:
        return 'Lỗi kết nối mạng';
    }
  }
}
