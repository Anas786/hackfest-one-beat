import 'package:flutter/material.dart';

import '../../util/utilities/internet_utils.dart';
import '../models/entities/token.dart';
import 'local/storage_client.dart';

abstract class BaseRepository {
  Future<bool> hasInternet();

  Future<Token?> getAuthToken();
}

abstract class BaseRepositoryImpl implements BaseRepository {
  @override
  @protected
  Future<bool> hasInternet() async {
    return await InternetUtils.isInternetAvailable();
  }

  @override
  @protected
  Future<Token?> getAuthToken() async {
    return await StorageClient.instance.getAuthToken();
  }
}
