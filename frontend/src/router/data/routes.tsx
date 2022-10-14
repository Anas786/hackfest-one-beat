import { ProtectedPage } from "pages";
import { Login } from "pages/Login";
import { PatientsList } from "pages/PatientList";
import { IRoute } from "router/types";

export const PUBLIC_ROUTES: Array<IRoute> = [{ path: "/login", element: <Login /> }];

export const PROTECTED_ROUTES: Array<IRoute> = [{ path: "/protected", element: <ProtectedPage /> }];

export const ADMIN_ROUTES: Array<IRoute> = [{ path: "patients", element: <PatientsList /> }];
