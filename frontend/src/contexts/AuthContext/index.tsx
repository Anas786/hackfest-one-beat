import { FC, ReactNode, useContext, createContext } from "react";
import { UserContext } from "contexts/UserContext";
import { INITIAL_AUTH_STATE } from "./constants";
import { INITIAL_USER_STATE } from "contexts/UserContext/constants";
import { loginUser, signupUser } from "services/auth/auth";
import { IAuthState } from "./types";
import { ILoginResponse, ILoginUser, ISignupResponse, ISignupUser } from "types";

export const AuthContext = createContext<IAuthState>(INITIAL_AUTH_STATE);

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const { userState, setUserState } = useContext(UserContext);

  const signup = async (payload: ISignupUser): Promise<ISignupResponse> => {
    try {
      setUserState({ ...userState, isLoading: true });
      const signUpResponse = await signupUser(payload);
      const { result, message } = signUpResponse;
      console.log(message);
      if (result === "failed") {
        logout();
        return signUpResponse;
      }
      setUserState({ ...userState, isLoading: false });
      return signUpResponse;
    } catch (error) {
      // TODO handle error
      logout();
      throw new Error("Signup failed.");
    }
  };

  const login = async (payload: ILoginUser): Promise<ILoginResponse> => {
    try {
      setUserState({ ...userState, isLoading: true });
      const loginResponse = await loginUser(payload);
      const { result, message } = loginResponse;
      console.log(message);
      if (result === "failed") {
        logout();
        return loginResponse;
      }
      setUserState({ ...userState, isLoggedIn: true, isLoading: false });
      return loginResponse;
    } catch (error) {
      // TODO handle error
      logout();
      throw new Error("Login failed.");
    }
  };

  const logout = () => {
    setUserState(INITIAL_USER_STATE);
  };

  return (
    <AuthContext.Provider
      value={{
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};