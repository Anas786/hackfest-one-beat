export interface IUserState {
  isLoading: boolean;
  isLoggedIn: boolean;
  refreshToken: string;
  accessToken: string;
  user: User;
}

export interface IUserContext {
  userState: IUserState;
  setUserState: (user: IUserState) => void;
}

export interface User {
  firstName: string;
  lastName: string;
  isAdmin: boolean;
}
