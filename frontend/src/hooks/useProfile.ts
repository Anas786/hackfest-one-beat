import { useContext } from "react";
import { UserContext } from "contexts/UserContext";

export const useProfile = () => useContext(UserContext);
