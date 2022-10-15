import axios from "axios";
import {
  ILoginResponse,
  ILoginUser,
  ISignupResponse,
  ISignupUser,
  ISingleResponse,
} from "types/user";
import { AUTH_API } from "./api";

export const loginUser = async (user: ILoginUser) => {
  const response = await axios.post<ISingleResponse<ILoginResponse>>(`${AUTH_API}/login`, user);
  return response.data;
};

export const signupUser = async (user: ISignupUser) => {
  const response = await axios.post<ISignupResponse>(`${AUTH_API}/signup`, user);
  return response.data;
};
