import { ProtectedPage } from "pages";
import { AppointmentList } from "pages/AppointmentList";
import { AppointmentDetail } from "pages/AppointmentDetail";
import { Dashboard } from "pages/Dashboard";
import { Login } from "pages/Login";
import { PatientsList } from "pages/PatientList";
import { AdmissionsList } from "pages/Admissions";
import { PatientDetail } from "pages/UserDetail";
import { IRoute } from "router/types";
import { Home } from "pages/Home";

export const PUBLIC_ROUTES: Array<IRoute> = [{ path: "/login", element: <Login /> }];

export const PROTECTED_ROUTES: Array<IRoute> = [{ path: "/protected", element: <ProtectedPage /> }];

export const ADMIN_ROUTES: Array<IRoute> = [
  { path: "/", element: <Home /> },
  { path: "dashboard", element: <Dashboard /> },
  { path: "patients", element: <PatientsList /> },
  { path: "appointments", element: <AppointmentList /> },
  { path: "transfer-forms", element: <AdmissionsList /> },
  { path: "patients/:patientId", element: <PatientDetail /> },
  { path: "appointments/:appointmentId/:patientId", element: <AppointmentDetail /> },
];
