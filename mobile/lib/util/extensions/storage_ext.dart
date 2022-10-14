import 'package:shared_preferences/shared_preferences.dart';

import '../../data/repositories/local/storage_client.dart';

extension StorageExtension on StorageClient {
  Future<bool> set(String key, Object? value) async {
    SharedPreferences pref = await SharedPreferences.getInstance();
    if (value == null) {
      return await pref.remove(key);
    }

    if (value is int) return await pref.setInt(key, value);
    if (value is double) return await pref.setDouble(key, value);
    if (value is String) return await pref.setString(key, value);
    if (value is bool) return await pref.setBool(key, value);
    if (value is List<String>) return await pref.setStringList(key, value);
    throw UnsupportedError('Unsupported value type: $value');
  }

  Future<Object?> get(String key) async {
    SharedPreferences pref = await SharedPreferences.getInstance();
    if (pref.containsKey(key)) {
      return pref.get(key);
    }
    return null;
  }

  Future<bool> clear() async {
    SharedPreferences pref = await SharedPreferences.getInstance();
    return await pref.clear();
  }
}
