import { EMPTY_TOKEN, EMPTY_USER } from "contexts/UserContext/constants";
import { ILoginResponse } from "types";
import { IAuthState } from "./types";

export const INITIAL_AUTH_STATE: IAuthState = {
  login: async () => EMPTY_LOGIN_RESPONSE,
  signup: async () => EMPTY_SIGNUP_RESPONSE,
  logout: () => {},
};

export const EMPTY_LOGIN_RESPONSE: ILoginResponse = {
  user: EMPTY_USER,
  token: EMPTY_TOKEN,
};

export const EMPTY_SIGNUP_RESPONSE = {
  result: "failed",
  message: "User already exists",
};
