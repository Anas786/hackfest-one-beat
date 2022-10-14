import { IUserContext, IUserState, User } from "./types";

export const EMPTY_USER: User = {
  firstName: "",
  lastName: "",
  isAdmin: false,
};

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
