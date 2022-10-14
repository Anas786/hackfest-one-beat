import 'package:get_it/get_it.dart';

import '../data/repositories/entities/auth/auth_repository.dart';
import '../data/repositories/local/storage_repository.dart';
import '../data/repositories/remote/network_repository.dart';

GetIt injector = GetIt.instance;

void setupDI() {
  injector.registerLazySingleton<NetworkRepository>(() => NetworkRepositoryImpl());
  injector.registerLazySingleton<StorageRepository>(() => StorageRepositoryImpl());
  injector.registerLazySingleton<AuthRepository>(() => AuthRepositoryImpl());
}
