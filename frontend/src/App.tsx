import { FC } from "react";
import { UserProvider } from "contexts/UserContext";
import { BrowserRouter } from "react-router-dom";
import { Router } from "router";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "@mui/system";
import { theme } from "ui/theme";
import "antd/dist/antd.min.css";

import "react-toastify/dist/ReactToastify.css";
import "./Global.css";

const App: FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <UserProvider>
        <BrowserRouter>
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
        </BrowserRouter>
      </UserProvider>
    </ThemeProvider>
  );
};

export default App;
