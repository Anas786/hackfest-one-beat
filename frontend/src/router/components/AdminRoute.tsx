import { FC } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useProfile } from "hooks";

export const AdminRoute: FC = () => {
  // const { userState } = useProfile();
  // const { isLoggedIn, user } = userState;
  // const { isAdmin } = user;

  // if (!isLoggedIn || !isAdmin) return <Navigate to="/" replace />;

  return <Outlet />;
};
