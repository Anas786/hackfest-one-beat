import '../../../../di/injector.dart';
import '../../../../ui/resources/app_strings.dart';
import '../../../models/entities/patient.dart';
import '../../../models/network/requests/patient_request.dart';
import '../../../models/network/result.dart';
import '../../base_repository.dart';
import '../../remote/network_repository.dart';

abstract class PatientRepository {
  Future<Result<Patient>> create(PatientRequest? request);
}

class PatientRepositoryImpl extends BaseRepositoryImpl implements PatientRepository {
  final _networkRepository = injector<NetworkRepository>();

  @override
  Future<Result<Patient>> create(PatientRequest? request) async {
    if (!await hasInternet()) {
      return Result.error(AppStrings.errorInternetUnavailable);
    }
    return await _networkRepository.createPatient(request);
  }
}
