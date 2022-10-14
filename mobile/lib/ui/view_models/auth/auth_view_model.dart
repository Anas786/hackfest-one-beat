import '../../../data/models/entities/user.dart';
import '../../../data/models/network/requests/auth_request.dart';
import '../../../data/models/network/responses/auth_response.dart';
import '../../../data/models/network/result.dart';
import '../../../data/repositories/entities/auth/auth_repository.dart';
import '../../../di/injector.dart';
import '../base_view_model.dart';

class AuthViewModel extends BaseViewModel {
  var _repository = injector<AuthRepository>();

  set repository(AuthRepository repository) {
    _repository = repository;
  }

  User? _user;
  User? get user => _user;

  Future<Result<User>> register(RegisterRequest? request) async {
    toggleLoading(true);
    final result = await _repository.register(request);
    return _handleAuthResult(result);
  }

  Future<Result<User>> login(AuthRequest? request) async {
    toggleLoading(true);
    final result = await _repository.login(request);
    return _handleAuthResult(result);
  }

  Future<User?> getAuthUser() async {
    toggleLoading(true);
    _user = await _repository.getAuthUser();
    toggleLoading(false);
    return _user;
  }

  Future<Result<User>> _handleAuthResult(Result<AuthResponse> result) async {
    toggleLoading(false);
    await _updateAuthInfo(result.data);
    if (result.isSuccess) {
      return Result.success(result.data!.user);
    }
    return Result.error(result.errorMessage);
  }

  Future<void> logout() async {
    _user = null;
    await _repository.logout();
    notifyListeners();
  }

  Future<void> _updateAuthInfo(AuthResponse? response) async {
    _user = response?.user;
    await _repository.updateAuthInfo(response);
    notifyListeners();
  }
}
