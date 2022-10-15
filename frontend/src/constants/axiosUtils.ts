import axios, { AxiosRequestConfig } from "axios";

export const apiClient = axios.create({
  baseURL: process.env.REACT_APP_BE,
  timeout: 30000,
});

apiClient.interceptors.request.use(
  async (config: AxiosRequestConfig) => {
    const token = localStorage.getItem("token");
    if (config.headers) {
      config.headers.Authorization = "bearer " + token;
    }
    return config;
  },
  (err: any) => {
    return Promise.reject(err);
  }
);
