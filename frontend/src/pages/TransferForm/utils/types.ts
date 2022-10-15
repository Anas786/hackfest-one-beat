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

export interface IFacility {
  id: number;
  name: string;
  address: string;
  address2: null;
  zip: string;
  city: string;
  state: string;
  country_id: number;
  latitude: string;
  longitude: string;
  facility_type_id: number;
  phone: string;
  email: string;
  representative_name: string;
  representative_phone: string;
  representative_email: string;
  is_active: number;
  created_at: string;
  updated_at: string;
}

export interface IBedType {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface ITransportationType {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface IDiagonosis {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}
