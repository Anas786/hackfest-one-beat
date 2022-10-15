import '../../../util/extensions/storage_ext.dart';
import '../../models/entities/token.dart';
import '../../models/entities/user.dart';
import 'storage_client.dart';

abstract class StorageRepository {
  Future<bool> saveAuthUser(User? user);

  Future<User?> getAuthUser();

  Future<bool> saveAuthToken(Token? token);

  Future<Token?> getAuthToken();

  Future<bool> clearAll();
}

class StorageRepositoryImpl implements StorageRepository {
  @override
  Future<bool> saveAuthUser(User? user) {
    return StorageClient.instance.saveAuthUser(user);
  }

  @override
  Future<User?> getAuthUser() {
    return StorageClient.instance.getAuthUser();
  }

  @override
  Future<bool> saveAuthToken(Token? token) {
    return StorageClient.instance.saveAuthToken(token);
  }

  @override
  Future<Token?> getAuthToken() {
    return StorageClient.instance.getAuthToken();
  }

  @override
  Future<bool> clearAll() {
    return StorageClient.instance.clear();
  }
}
