import '../../../data/models/entities/appointment.dart';
import '../../../data/models/network/requests/appointment_request.dart';
import '../../../data/models/network/result.dart';
import '../../../data/repositories/entities/appointment_repository.dart';
import '../../../di/injector.dart';
import '../base_view_model.dart';

class AppointmentViewModel extends BaseViewModel {
  var _repository = injector<AppointmentRepository>();

  set repository(AppointmentRepository repository) {
    _repository = repository;
  }

  List<Appointment>? _appointments;
  List<Appointment>? get appointments => _appointments;

  Future<Result<List<Appointment>>> getAppointments(int? patientId) async {
    toggleLoading(true);
    final result = await _repository.getAppointments(patientId);
    _appointments = result.data;
    toggleLoading(false);
    notifyListeners();
    return result;
  }

  Future<Result<Appointment>> create(AppointmentRequest? request) async {
    toggleLoading(true);
    final result = await _repository.create(request);
    toggleLoading(false);
    return result;
  }
}
