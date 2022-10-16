import { ILoginResponse, ILoginUser } from "types";

export interface IAuthState {
  login: (payload: ILoginUser) => Promise<ILoginResponse>;
  logout: () => void;
}

export interface SignUpPayload {
  user_name: string;
  password: string;
}
