import '../../../di/injector.dart';
import '../../../ui/resources/app_strings.dart';
import '../../models/entities/facility.dart';
import '../../models/network/result.dart';
import '../base_repository.dart';
import '../remote/network_repository.dart';

abstract class FacilityRepository {
  Future<Result<List<Facility>>> getFacilities();
}

class FacilityRepositoryImpl extends BaseRepositoryImpl implements FacilityRepository {
  final _networkRepository = injector<NetworkRepository>();

  @override
  Future<Result<List<Facility>>> getFacilities() async {
    if (!await hasInternet()) {
      return Result.error(AppStrings.errorInternetUnavailable);
    }
    return await _networkRepository.getFacilities();
  }
}
