import { IToken, IUser } from "types";
import { IUserContext, IUserState } from "./types";

export const EMPTY_USER: IUser = {
  id: "",
  mr_number: "",
  first_name: "",
  middle_name: "",
  last_name: "",
  user_name: "",
  email: "",
  nic: "",
  phone: "",
  category_id: "",
  gender: "",
  dob: "",
  role_id: "",
  facility_id: "",
  degree_id: "",
  specialty_id: "",
  timezone_id: "",
  notify: "",
  two_step_verification: "",
  is_active: false,
  remember_me_token: "",
  created_at: "",
  updated_at: "",
};

export const EMPTY_TOKEN: IToken = { expires_at: "", token: "", type: "" };

export const INITIAL_USER_STATE: IUserState = {
  isLoggedIn: false,
  isLoading: false,
  accessToken: "",
  refreshToken: "",
  user: EMPTY_USER,
};

export const INITIAL_USER_CONTEXT: IUserContext = {
  userState: INITIAL_USER_STATE,
  setUserState: (user: IUserState) => {},
};
