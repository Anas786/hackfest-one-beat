import '../../base_model.dart';

class AppointmentRequest implements BaseModel {
  int? patientId;
  int? facilityId;
  int? doctorId;
  String? appointmentDate;
  String? appointmentTime;

  AppointmentRequest({
    this.patientId,
    this.facilityId,
    this.doctorId,
    this.appointmentDate,
    this.appointmentTime,
  });

  @override
  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    json['patient_id'] = patientId;
    json['facility_id'] = facilityId;
    json['doctor_id'] = doctorId;
    json['appointment_date'] = appointmentDate;
    json['appointment_time'] = appointmentTime;
    return json;
  }
}
