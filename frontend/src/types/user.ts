export interface ILoginUser {
  username: string;
  password: string;
}

export interface ILoginResponse {
  result: string;
  message: string;
}

export interface ISignupUser {
  username: string;
  password: string;
}

export interface ISignupResponse {
  result: string;
  message: string;
}

export interface IPatient {
  id: 2;
  first_name: string;
  middle_name: string;
  last_name: string;
  user_name: string;
  email: string;
  nic: string;
  phone: string;
  category_id: number;
  gender: string;
  dob: string;
  role_id: number;
  degree_id: string;
  specialty_id: string;
  timezone_id: string;
  notify: number;
  two_step_verification: string;
  is_active: boolean;
  remember_me_token: string;
  created_at: string;
  updated_at: string;
  timezone: string;
  role: IRole;
  category: ICategory;
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
