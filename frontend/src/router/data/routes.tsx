import { ProtectedPage } from "pages";
import { AppointmentList } from "pages/AppointmentList";
import { Login } from "pages/Login";
import { PatientsList } from "pages/PatientList";
import { TestPage } from "pages/Test";
import { TransferForms } from "pages/TransferForm";
import { IRoute } from "router/types";

export const PUBLIC_ROUTES: Array<IRoute> = [
  { path: "/login", element: <Login /> },
  { path: "/test", element: <TestPage /> },
];

export const PROTECTED_ROUTES: Array<IRoute> = [{ path: "/protected", element: <ProtectedPage /> }];

export const ADMIN_ROUTES: Array<IRoute> = [
  { path: "patients", element: <PatientsList /> },
  { path: "appointments", element: <AppointmentList /> },
  { path: "transfer-forms", element: <TransferForms /> },
];
