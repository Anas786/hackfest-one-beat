import { FC } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useProfile } from "hooks";
import { Layout } from "layouts";

export const AdminRoute: FC = () => {
  // const { userState } = useProfile();
  // const { isLoggedIn, user } = userState;
  // const { isAdmin } = user;

  // if (!isLoggedIn || !isAdmin) return <Navigate to="/" replace />;

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};
