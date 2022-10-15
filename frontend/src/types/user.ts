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
