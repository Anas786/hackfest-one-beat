export interface IPatientInfo {
  name: string;
  dateofbirth: string;
  cnic: string;
  gender: string;
  email: string;
  cell: string;
}

export interface IPatientStatus {
  modeOfTransportation: string;
  code: string;
  bedType: string;
}

export interface IAdmissionPreferences {
  admittingHospital: string;
  admittingGroup: string;
  admittingPhysician: string;
  doctodoc: string;
  patientEta: string;
}
