import { ISignupResponse, ILoginResponse, ISignupUser, ILoginUser } from "types";

export interface IAuthState {
  login: (payload: ILoginUser) => Promise<ILoginResponse>;
  signup: (payload: ISignupUser) => Promise<ISignupResponse>;
  logout: () => void;
}

export interface SignUpPayload {
  username: string;
  password: string;
}
