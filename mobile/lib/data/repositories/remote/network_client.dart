import 'dart:async';

import 'package:enum_to_string/enum_to_string.dart';
import 'package:http/http.dart' as http;

import '../../../ui/resources/app_strings.dart';
import '../../../util/constants/app_constants.dart';
import '../../../util/constants/endpoints.dart';
import '../../../util/extensions/numeric_ext.dart';
import '../../../util/utilities/json_utils.dart';
import '../../../util/utilities/log_utils.dart';
import '../../enums/request_type.dart';

class NetworkClient {
  const NetworkClient._internal();

  static const NetworkClient _instance = NetworkClient._internal();

  static NetworkClient get instance => _instance;

  Future<http.Response?> request(
    RequestType requestType, {
    required String endpoint,
    String? token,
    Map<String, dynamic>? params,
    dynamic body,
  }) async {
    http.Response? response;
    final uri = _getRequestUri(endpoint, params);

    try {
      final headers = _getHeaders(token);
      final payload = JsonUtils.toJson(body);
      const timeLimit = Duration(seconds: AppConstants.apiTimeout);

      // Log request
      _logRequest(
        EnumToString.convertToString(requestType),
        uri,
        token: token,
        body: body,
      );

      // Initiate http request
      if (requestType == RequestType.get) {
        response = await http
            .get(uri, headers: headers)
            .timeout(timeLimit, onTimeout: _timeoutCallback);
      } else if (requestType == RequestType.post) {
        response = await http
            .post(uri, headers: headers, body: payload)
            .timeout(timeLimit, onTimeout: _timeoutCallback);
      } else if (requestType == RequestType.put) {
        response = await http
            .put(uri, headers: headers, body: payload)
            .timeout(timeLimit, onTimeout: _timeoutCallback);
      } else if (requestType == RequestType.patch) {
        response = await http
            .patch(uri, headers: headers, body: payload)
            .timeout(timeLimit, onTimeout: _timeoutCallback);
      } else if (requestType == RequestType.delete) {
        response = await http
            .delete(uri, headers: headers, body: payload)
            .timeout(timeLimit, onTimeout: _timeoutCallback);
      }
    } catch (e) {
      // Log error response
      _logResponse(uri, exception: e);
      rethrow;
    }

    // Log success response
    _logResponse(uri, response: response);

    return response;
  }

  FutureOr<http.Response> _timeoutCallback() {
    throw TimeoutException(AppStrings.errorTimeout);
  }

  Uri _getRequestUri(String endpoint, Map<String, dynamic>? params) {
    final requestUrl = '${Endpoints.baseUrl}$endpoint';
    return Uri.parse(requestUrl).replace(queryParameters: params);
  }

  Map<String, String> _getHeaders(String? token) {
    final headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    if (token?.isNotEmpty ?? false) {
      headers['Authorization'] = 'Bearer $token';
    }
    return headers;
  }

  void _logRequest(
    String requestType,
    Uri uri, {
    String? token,
    dynamic body,
  }) {
    final requestMap = <String, dynamic>{};
    requestMap['Method'] = requestType.toUpperCase();
    requestMap['URL'] = uri.toString();
    requestMap['Headers'] = _getHeaders(token);
    if (body != null) {
      requestMap['Body'] = body;
    }
    LogUtils.info(requestMap);
  }

  void _logResponse(
    Uri uri, {
    http.Response? response,
    dynamic exception,
  }) {
    final responseMap = <String, dynamic>{};
    responseMap['URL'] = uri.toString();
    if (response != null) {
      responseMap['Response'] = {
        'status': '${response.statusCode} - ${response.reasonPhrase}',
        'body': JsonUtils.fromJson(response.body),
      };
    }
    if (exception != null) {
      responseMap['Exception'] = exception.toString();
      LogUtils.error(responseMap);
      return;
    }
    if (response?.statusCode.isBetween(200, 299) == true) {
      LogUtils.info(responseMap);
    } else {
      LogUtils.error(responseMap);
    }
  }
}
