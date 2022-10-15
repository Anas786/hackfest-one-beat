import '../../../util/constants/app_constants.dart';
import '../../../util/utilities/datetime_utils.dart';
import '../base_entity.dart';
import 'doctor.dart';
import 'facility.dart';
import 'patient.dart';

class Appointment extends BaseEntity {
  @override
  int? id;
  String? code;
  int? userId;
  int? facilityId;
  String? appointmentDate;
  String? appointmentTime;
  int? doctorId;
  int? status;
  Patient? patient;
  Facility? facility;
  Doctor? doctor;

  Appointment({
    this.id,
    this.code,
    this.userId,
    this.facilityId,
    this.appointmentDate,
    this.appointmentTime,
    this.doctorId,
    this.status,
    this.patient,
    this.facility,
    this.doctor,
  }) : super(id: id);

  String? get readableAppointmentDate {
    return DateTimeUtils.format(
      AppConstants.readableDayFormat,
      DateTimeUtils.parse(appointmentDate),
    );
  }

  static List<Appointment>? fromJsonAsList(dynamic data) {
    if (data == null) {
      return null;
    }
    return List<Appointment>.from(data.map((x) => Appointment.fromJson(x)));
  }

  Appointment.fromJson(Map<String, dynamic> json) {
    id = json['id'];
    code = json['code'];
    userId = json['user_id'];
    facilityId = json['facility_id'];
    appointmentDate = json['appointment_date'];
    appointmentTime = json['appointment_time'];
    doctorId = json['doctor_id'];
    status = json['status'];
    patient =
        json['patient'] != null ? Patient.fromJson(json['patient']) : null;
    facility =
        json['facility'] != null ? Facility.fromJson(json['facility']) : null;
    doctor = json['doctor'] != null ? Doctor.fromJson(json['doctor']) : null;
  }

  @override
  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = super.toJson();
    data['code'] = code;
    data['user_id'] = userId;
    data['facility_id'] = facilityId;
    data['appointment_date'] = appointmentDate;
    data['appointment_time'] = appointmentTime;
    data['doctor_id'] = doctorId;
    data['status'] = status;
    if (patient != null) {
      data['patient'] = patient!.toJson();
    }
    if (facility != null) {
      data['facility'] = facility!.toJson();
    }
    if (doctor != null) {
      data['doctor'] = doctor!.toJson();
    }
    return data;
  }
}
