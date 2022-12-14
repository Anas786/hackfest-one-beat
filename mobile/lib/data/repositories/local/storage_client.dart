import '../../../util/constants/app_constants.dart';
import '../../../util/extensions/storage_ext.dart';
import '../../../util/utilities/json_utils.dart';
import '../../models/entities/token.dart';
import '../../models/entities/user.dart';

class StorageClient {
  const StorageClient._internal();

  static const StorageClient _instance = StorageClient._internal();

  static StorageClient get instance => _instance;

  Future<bool> saveAuthUser(User? user) async {
    final value = JsonUtils.toJson(user?.toJson());
    return await set(AppConstants.prefAuthUser, value);
  }

  Future<User?> getAuthUser() async {
    final value = await get(AppConstants.prefAuthUser) as String?;
    if (value == null) {
      return null;
    }
    return User.fromJson(JsonUtils.fromJson(value));
  }

  Future<bool> saveAuthToken(Token? token) async {
    final value = JsonUtils.toJson(token?.toJson());
    return await set(AppConstants.prefAuthToken, value);
  }

  Future<Token?> getAuthToken() async {
    final value = await get(AppConstants.prefAuthToken) as String?;
    if (value == null) {
      return null;
    }
    return Token.fromJson(JsonUtils.fromJson(value));
  }
}
