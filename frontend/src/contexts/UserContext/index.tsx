import { FC, ReactNode, createContext, useState, useRef } from "react";
import { INITIAL_USER_CONTEXT, INITIAL_USER_STATE } from "./constants";
import { IUserContext, IUserState } from "./types";

export const UserContext = createContext<IUserContext>(INITIAL_USER_CONTEXT);

type UserProviderProps = {
  children: ReactNode;
};

export const UserProvider: FC<UserProviderProps> = ({ children }) => {
  const [value, setValue] = useState<IUserState>(INITIAL_USER_STATE);
  const userLoaded = useRef(true);

  if (!userLoaded.current) {
    return (
      <UserContext.Provider value={{ userState: value, setUserState: setValue }}>
        <></>
      </UserContext.Provider>
    );
  }

  return (
    <UserContext.Provider value={{ userState: value, setUserState: setValue }}>
      {children}
    </UserContext.Provider>
  );
};
