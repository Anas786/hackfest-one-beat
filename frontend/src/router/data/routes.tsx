import { AdminPage, Home, ProtectedPage } from "pages";
import { IRoute } from "router/types";

export const PUBLIC_ROUTES: Array<IRoute> = [{ path: "/", element: <Home /> }];

export const PROTECTED_ROUTES: Array<IRoute> = [{ path: "/protected", element: <ProtectedPage /> }];

export const ADMIN_ROUTES: Array<IRoute> = [{ path: "/admin", element: <AdminPage /> }];
