import '../../../di/injector.dart';
import '../../../ui/resources/app_strings.dart';
import '../../models/entities/appointment.dart';
import '../../models/entities/patient.dart';
import '../../models/network/requests/patient_request.dart';
import '../../models/network/result.dart';
import '../base_repository.dart';
import '../remote/network_repository.dart';

abstract class AppointmentRepository {
  Future<Result<List<Appointment>>> getAppointments(int? patientId);
}

class AppointmentRepositoryImpl extends BaseRepositoryImpl implements AppointmentRepository {
  final _networkRepository = injector<NetworkRepository>();

  @override
  Future<Result<List<Appointment>>> getAppointments(int? patientId) async {
    if (!await hasInternet()) {
      return Result.error(AppStrings.errorInternetUnavailable);
    }
    return await _networkRepository.getAppointments(patientId);
  }
}
