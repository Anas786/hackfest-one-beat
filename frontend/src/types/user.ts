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

export interface IPatient extends Omit<IUser, "mr_number"> {}

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
