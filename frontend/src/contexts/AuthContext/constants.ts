import { IAuthState } from "./types";

export const INITIAL_AUTH_STATE: IAuthState = {
  login: async () => EMPTY_LOGIN_RESPONSE,
  signup: async () => EMPTY_SIGNUP_RESPONSE,
  logout: () => {},
};

export const EMPTY_LOGIN_RESPONSE = {
  result: "failed",
  message: "Incorrect credentials",
};

export const EMPTY_SIGNUP_RESPONSE = {
  result: "failed",
  message: "User already exists",
};
