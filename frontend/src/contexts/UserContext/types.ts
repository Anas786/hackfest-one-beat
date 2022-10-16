import { IUser } from "types";

export interface IUserState {
  isLoading: boolean;
  isLoggedIn: boolean;
  refreshToken: string;
  accessToken: string;
  user: IUser;
}

export interface IUserContext {
  userState: IUserState;
  setUserState: (user: IUserState) => void;
}

export interface User {
  id: number;
  first_name: string;
  middle_name?: string;
  last_name: string;
  user_name: string;
  email: string;
  phone?: string;
  category_id: number;
  role_id: number;
  degree_id?: string;
  npi?: string;
  specialty_id?: string;
  timezone_id?: string;
  notify: number;
  two_step_verification: number;
  is_active: number;
  is_real: number;
  remember_me_token?: string;
  created_at: string;
  updated_at: string;
  role: {
    id: number;
    name: string;
    code: string;
    category_id: number;
    created_at: string;
    updated_at: string;
  };
  category: {
    id: number;
    name: string;
    code: string;
    created_at: string;
    updated_at: string;
  };
}
