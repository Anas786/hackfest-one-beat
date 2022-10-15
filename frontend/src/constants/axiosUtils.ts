import axios from "axios";

export const setAuthHeader = (token: string) => {
  axios.defaults.headers.common.Authorization = `bearer ${token}`;
};

export const removeAuthHeader = () => {
  axios.defaults.headers.common.Authorization = undefined;
};
