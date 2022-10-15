import { ISignupResponse, ILoginResponse, ISignupUser, ILoginUser } from "types";

export interface IAuthState {
  login: (payload: ISignupUser) => Promise<ISignupResponse>;
  signup: (payload: ILoginUser) => Promise<ILoginResponse>;
  logout: () => void;
}

export interface SignUpPayload {
  username: string;
  password: string;
}
