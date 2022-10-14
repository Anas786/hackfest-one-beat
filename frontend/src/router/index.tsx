import { FC } from "react";
import { Route, Routes } from "react-router-dom";
import { PortectedRoute, AdminRoute } from "./components";
import { ADMIN_ROUTES, PROTECTED_ROUTES, PUBLIC_ROUTES } from "./data/routes";

export const Router: FC = () => {
  return (
    <Routes>
      {/* PUBLIC ROUTES */}
      {PUBLIC_ROUTES.map((route) => (
        <Route key={route.path} path={route.path} element={route.element} />
      ))}

      {/* PROTECTED ROUTES */}
      <Route path="/" element={<PortectedRoute />}>
        {PROTECTED_ROUTES.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Route>

      {/* ADMIN ROUTES */}
      <Route path="/" element={<AdminRoute />}>
        {ADMIN_ROUTES.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Route>
    </Routes>
  );
};
