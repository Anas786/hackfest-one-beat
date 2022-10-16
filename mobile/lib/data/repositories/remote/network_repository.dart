import '../../../util/constants/endpoints.dart';
import '../../../util/extensions/http_ext.dart';
import '../../enums/request_type.dart';
import '../../models/entities/appointment.dart';
import '../../models/entities/facility.dart';
import '../../models/entities/patient.dart';
import '../../models/network/requests/appointment_request.dart';
import '../../models/network/requests/auth_request.dart';
import '../../models/network/requests/patient_request.dart';
import '../../models/network/responses/auth_response.dart';
import '../../models/network/result.dart';
import '../base_repository.dart';
import 'network_client.dart';

abstract class NetworkRepository {
  Future<Result<AuthResponse>> login(AuthRequest? request);

  Future<Result<Patient>> createPatient(PatientRequest? request);

  Future<Result<List<Appointment>>> getAppointments(int? patientId);

  Future<Result<Appointment>> createAppointment(AppointmentRequest? request);

  Future<Result<List<Facility>>> getFacilities();
}

class NetworkRepositoryImpl extends BaseRepositoryImpl
    implements NetworkRepository {
  @override
  Future<Result<AuthResponse>> login(AuthRequest? request) async {
    try {
      final response = await NetworkClient.instance.request(
        RequestType.post,
        endpoint: Endpoints.login,
        body: request?.toJson(),
      );
      return response.parse<AuthResponse>((data) {
        return data != null ? AuthResponse.fromJson(data) : null;
      });
    } catch (e) {
      return Result.fromError(e);
    }
  }

  @override
  Future<Result<Patient>> createPatient(PatientRequest? request) async {
    try {
      final response = await NetworkClient.instance.request(
        RequestType.post,
        endpoint: Endpoints.patients,
        body: request?.toJson(),
      );
      return response.parse<Patient>((data) {
        return data != null ? Patient.fromJson(data) : null;
      });
    } catch (e) {
      return Result.fromError(e);
    }
  }

  @override
  Future<Result<List<Appointment>>> getAppointments(int? patientId) async {
    try {
      final response = await NetworkClient.instance.request(
        RequestType.get,
        endpoint: Endpoints.appointments,
        token: await getAuthToken(),
        body: {'patient_id': patientId},
      );
      return response.parse<List<Appointment>>((data) {
        return Appointment.fromJsonAsList(data);
      });
    } catch (e) {
      return Result.fromError(e);
    }
  }

  @override
  Future<Result<Appointment>> createAppointment(
    AppointmentRequest? request,
  ) async {
    try {
      final response = await NetworkClient.instance.request(
        RequestType.post,
        endpoint: Endpoints.appointments,
        token: await getAuthToken(),
        body: request?.toJson(),
      );
      return response.parse<Appointment>((data) {
        return data != null ? Appointment.fromJson(data) : null;
      });
    } catch (e) {
      return Result.fromError(e);
    }
  }

  @override
  Future<Result<List<Facility>>> getFacilities() async {
    try {
      final response = await NetworkClient.instance.request(
        RequestType.get,
        endpoint: Endpoints.facilities,
        token: await getAuthToken(),
      );
      return response.parse<List<Facility>>((data) {
        return Facility.fromJsonAsList(data);
      });
    } catch (e) {
      return Result.fromError(e);
    }
  }
}
