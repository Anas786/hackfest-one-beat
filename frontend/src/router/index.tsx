import { FC } from "react";
import { Route, Routes } from "react-router-dom";
import { MainLayout } from "layouts/MainLayout";
import { AdminRoute } from "./components";
import { ADMIN_ROUTES, PUBLIC_ROUTES } from "./data/routes";
import { NotFound } from "pages/404";

export const Router: FC = () => {
  return (
    <Routes>
      {/* PUBLIC ROUTES */}
      {PUBLIC_ROUTES.map((route) => (
        <Route key={route.path} path={route.path} element={route.element} />
      ))}

      {/* PROTECTED ROUTES
      <Route path="/" element={<PortectedRoute />}>
        {PROTECTED_ROUTES.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Route> */}

      {/* ADMIN ROUTES */}
      <Route
        path="/"
        element={
          <MainLayout>
            <AdminRoute />
          </MainLayout>
        }
      >
        {ADMIN_ROUTES.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
