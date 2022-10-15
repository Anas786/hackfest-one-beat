import React, { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { removeAuthHeader, setAuthHeader } from "constants/axiosUtils";

interface IInterceptors {
  children: JSX.Element;
}

const Interceptors = ({ children }: IInterceptors) => {
  const navigate = useNavigate();

  useEffect(() => {
    axios.create({
      baseURL: process.env.REACT_APP_BE,
    });
    const cachedToken = localStorage.getItem("token") || "";
    if (cachedToken) setAuthHeader(cachedToken);
  }, []);

  useEffect(() => {
    axios.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        const message = error?.response?.data?.message;
        if (
          message === "jwt expired" ||
          message === "User is deactivated by admin" ||
          message === "jwt malformed"
        ) {
          localStorage.clear();
          removeAuthHeader();
          navigate("/login");
        }
        throw error;
      }
    );
  }, []);
  return children;
};

export default Interceptors;
