import 'package:http/http.dart' as http;

import '../../../util/constants/endpoints.dart';
import '../../../util/extensions/http_ext.dart';
import '../../enums/request_type.dart';
import '../../models/network/requests/auth_request.dart';
import '../../models/network/responses/auth_response.dart';
import '../../models/network/result.dart';
import '../base_repository.dart';
import 'network_client.dart';

abstract class NetworkRepository {
  Future<Result<AuthResponse>> register(RegisterRequest? request);

  Future<Result<AuthResponse>> login(AuthRequest? request);
}

class NetworkRepositoryImpl extends BaseRepositoryImpl implements NetworkRepository {
  @override
  Future<Result<AuthResponse>> register(RegisterRequest? request) async {
    try {
      final response = await NetworkClient.instance.request(
        RequestType.post,
        endpoint: Endpoints.register,
        body: request?.toJson(),
      );
      return _handleAuthResult(response);
    } catch (e) {
      return Result.fromError(e);
    }
  }

  @override
  Future<Result<AuthResponse>> login(AuthRequest? request) async {
    try {
      final response = await NetworkClient.instance.request(
        RequestType.post,
        endpoint: Endpoints.login,
        body: request?.toJson(),
      );
      return _handleAuthResult(response);
    } catch (e) {
      return Result.fromError(e);
    }
  }

  Result<AuthResponse> _handleAuthResult(http.Response? response) {
    return response.parse<AuthResponse>((data) {
      return data != null ? AuthResponse.fromJson(data) : null;
    });
  }
}
