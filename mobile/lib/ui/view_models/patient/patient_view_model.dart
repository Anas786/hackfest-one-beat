import '../../../data/models/entities/patient.dart';
import '../../../data/models/network/requests/patient_request.dart';
import '../../../data/models/network/result.dart';
import '../../../data/repositories/entities/patient/patient_repository.dart';
import '../../../di/injector.dart';
import '../base_view_model.dart';

class PatientViewModel extends BaseViewModel {
  var _repository = injector<PatientRepository>();

  set repository(PatientRepository repository) {
    _repository = repository;
  }

  Future<Result<Patient>> create(PatientRequest? request) async {
    toggleLoading(true);
    final result = await _repository.create(request);
    toggleLoading(false);
    return result;
  }
}
