import '../../../../di/injector.dart';
import '../../../../ui/resources/app_strings.dart';
import '../../../models/entities/user.dart';
import '../../../models/network/requests/auth_request.dart';
import '../../../models/network/responses/auth_response.dart';
import '../../../models/network/result.dart';
import '../../base_repository.dart';
import '../../local/storage_repository.dart';
import '../../remote/network_repository.dart';

abstract class AuthRepository {
  Future<Result<AuthResponse>> register(RegisterRequest? request);

  Future<Result<AuthResponse>> login(AuthRequest? request);

  Future<User?> getAuthUser();

  Future<void> logout();

  Future<void> updateAuthInfo(AuthResponse? response);
}

class AuthRepositoryImpl extends BaseRepositoryImpl implements AuthRepository {
  final _networkRepository = injector<NetworkRepository>();
  final _storageRepository = injector<StorageRepository>();

  @override
  Future<Result<AuthResponse>> register(RegisterRequest? request) async {
    if (!await hasInternet()) {
      return Result.error(AppStrings.errorInternetUnavailable);
    }
    return await _networkRepository.register(request);
  }

  @override
  Future<Result<AuthResponse>> login(AuthRequest? request) async {
    if (!await hasInternet()) {
      return Result.error(AppStrings.errorInternetUnavailable);
    }
    return await _networkRepository.login(request);
  }

  @override
  Future<User?> getAuthUser() async {
    return await _storageRepository.getAuthUser();
  }

  @override
  Future<void> logout() async {
    return await updateAuthInfo(null);
  }

  @override
  Future<void> updateAuthInfo(AuthResponse? response) async {
    await _storageRepository.saveAuthUser(response?.user);
    await _storageRepository.saveAuthToken(response?.token);
  }
}
