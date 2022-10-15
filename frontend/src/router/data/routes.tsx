import { ProtectedPage } from "pages";
import { AppointmentList } from "pages/AppointmentList";
import { AppointmentDetail } from "pages/AppointmentDetail";
import { Dashboard } from "pages/Dashboard";
import { Login } from "pages/Login";
import { PatientsList } from "pages/PatientList";
import { TransferForms } from "pages/TransferForm";
import { IRoute } from "router/types";

export const PUBLIC_ROUTES: Array<IRoute> = [{ path: "/login", element: <Login /> }];

export const PROTECTED_ROUTES: Array<IRoute> = [{ path: "/protected", element: <ProtectedPage /> }];

export const ADMIN_ROUTES: Array<IRoute> = [
  { path: "dashboard", element: <Dashboard /> },
  { path: "patients", element: <PatientsList /> },
  { path: "appointments", element: <AppointmentList /> },
  { path: "transfer-forms", element: <TransferForms /> },
  { path: "appointments/:appointmentId/:patientId", element: <AppointmentDetail /> },
];
