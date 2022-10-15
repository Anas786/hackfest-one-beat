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
