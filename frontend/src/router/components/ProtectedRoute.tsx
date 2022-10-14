import { FC } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useProfile } from "hooks";

export const ProtectedRoute: FC = () => {
  const { userState } = useProfile();
  const { isLoggedIn } = userState;

  if (!isLoggedIn) return <Navigate to="/" replace />;

  return <Outlet />;
};
