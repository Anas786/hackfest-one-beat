import { FC, useEffect } from "react";
import { UserProvider } from "contexts/UserContext";
import { BrowserRouter } from "react-router-dom";
import { Router } from "router";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "@mui/system";
import { theme } from "ui/theme";
import "antd/dist/antd.min.css";

import "react-toastify/dist/ReactToastify.css";
import "./Global.css";
import { AuthProvider } from "contexts/AuthContext";
import Interceptors from "Interceptor";

const App: FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <UserProvider>
        <AuthProvider>
          <BrowserRouter>
            <Interceptors>
              <>
                <ToastContainer
                  position="top-right"
                  autoClose={3000}
                  hideProgressBar={false}
                  newestOnTop={false}
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                  theme="light"
                />
                <Router />
              </>
            </Interceptors>
          </BrowserRouter>
        </AuthProvider>
      </UserProvider>
    </ThemeProvider>
  );
};

export default App;
