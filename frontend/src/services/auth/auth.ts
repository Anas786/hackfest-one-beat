import axios from "axios";
import { ILoginUser } from "types/user";
import { AUTH_API } from "./api";

export const loginUser = async (user: ILoginUser) => {
  const response = await axios.post(`${AUTH_API}/login`, user);
  return response.data;
};
