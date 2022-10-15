export interface ILoginUser {
  user_name: string;
  password: string;
}

export interface ISingleResponse<T> {
  message: string;
  status: boolean;
  data: T;
}

export interface ILoginResponse {
  token: IToken;
  user: IUser;
}

export interface ISignupUser {
  username: string;
  password: string;
}

export interface ISignupResponse {
  result: string;
  message: string;
}

export interface ICategory {
  id: 1;
  name: string;
  code: string;
  created_at: string;
  updated_at: string;
}

export interface IRole {
  id: string;
  name: string;
  code: string;
  created_at: string;
  updated_at: string;
}
export interface IToken {
  type: string;
  token: string;
  expires_at: string;
}

export interface IUser {
  id: string;
  mr_number: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  user_name: string;
  email: string;
  nic: string;
  phone: string;
  category_id: string;
  gender: string;
  dob: string;
  role_id: string;
  facility_id: string;
  degree_id: string;
  specialty_id: string;
  timezone_id: string;
  notify: string;
  two_step_verification: string;
  is_active: boolean;
  remember_me_token: string;
  created_at: string;
  updated_at: string;
  role?: IRole;
  category?: ICategory;
}

export interface IPatient extends IUser {}

export interface IDoctor extends IUser {
  specialty: {
    id: string;
    name: string;
    created_at: string;
    updated_at: string;
  };
  timezone: string;
  degree: {
    id: string;
    name: string;
    code: string;
    created_at: string;
    updated_at: string;
  };
}

export interface IResponse<T> {
  status: boolean;
  message: string;
  data: {
    meta: {
      total: number;
      per_page: number;
      current_page: number;
      last_page: number;
      first_page: number;
      first_page_url: string;
      last_page_url: string;
      next_page_url: string | null;
      previous_page_url: string | null;
    };
    data: T;
  };
}

export interface CreatePatientPayload {
  first_name: string;
  middle_name?: string;
  last_name: string;
  email?: string;
  phone: string;
  nic: string;
  dob: string;
  gender: IGender;
  user_name?: string;
  password?: string;
}

export type IGender = "M" | "F";

export interface CreatePatientResponse {
  id: number;
  mr_number: string;
  first_name: string;
  middle_name: null;
  last_name: string;
  user_name: string;
  email: null;
  phone: string;
  nic: string;
  gender: string;
  dob: string;
  role_id: number;
  category_id: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface IMedicalRecord {
  id: number;
  appointment_id: number;
  patient_id: number;
  temperature: number;
  glucose: number;
  bp_systolic: number;
  bp_diastolic: number;
  pulse: number;
  o2_level: number;
  other_allergies: any;
  notes: any;
  created_at: string;
  updated_at: string;
}

export interface IMedicationOrder {
  id: number;
  patient_id: number;
  appointment_id: number;
  diet_id: number;
  iv_fluid_id: number;
  notes: null;
  created_at: string;
  updated_at: string;
}

export interface IDiagnosticOrder {
  id: number;
  patient_id: number;
  appointment_id: number;
  notes: string;
  created_at: string;
  updated_at: string;
  blood_tests: Array<IBloodTest>;
  urine_tests: Array<IUrineTest>;
  imaging_tests: Array<IImagingTest>;
}

export interface IBloodTest {
  id: number;
  patient_diagnostic_order_id: number;
  blood_test_id: number;
  created_at: string;
  updated_at: string;
}

export interface IUrineTest {
  id: number;
  patient_diagnostic_order_id: number;
  urine_test_id: number;
  created_at: string;
  updated_at: string;
}

export interface IImagingTest {
  id: number;
  patient_diagnostic_order_id: number;
  imaging_test_id: number;
  created_at: string;
  updated_at: string;
}

export interface ISpecialConsult {
  id: number;
  patient_id: number;
  appointment_id: number;
  notes: null;
  created_at: string;
  updated_at: string;
  consults: Array<IConsult>;
}

export interface IConsult {
  id: number;
  patient_specialty_consult_id: number;
  consult_id: number;
  created_at: string;
  updated_at: string;
  consult: {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
  };
}
