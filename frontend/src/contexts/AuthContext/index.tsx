import { FC, ReactNode, useContext, createContext } from "react";
import { UserContext } from "contexts/UserContext";
import { INITIAL_AUTH_STATE } from "./constants";
import { INITIAL_USER_STATE } from "contexts/UserContext/constants";
import { loginUser } from "services/auth/auth";
import { IAuthState } from "./types";
import { ILoginResponse, ILoginUser } from "types";
import { toast } from "react-toastify";

export const AuthContext = createContext<IAuthState>(INITIAL_AUTH_STATE);

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const { userState, setUserState } = useContext(UserContext);

  const login = async (payload: ILoginUser): Promise<ILoginResponse> => {
    try {
      setUserState({ ...userState, isLoading: true });
      const logInResponse = await loginUser(payload);

      const { data } = logInResponse;

      const { token, user } = data;

      localStorage.setItem("token", token.token);
      localStorage.setItem("user", JSON.stringify(user));

      setUserState({ ...userState, user: user, isLoggedIn: true, isLoading: false });
      toast.success("Logged in successfully");
      return data;
    } catch (error) {
      // TODO handle error
      logout();
      console.log(error);
      throw new Error("Login failed.");
    }
  };

  const logout = () => {
    setUserState(INITIAL_USER_STATE);
    localStorage.clear();
  };

  return (
    <AuthContext.Provider
      value={{
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
