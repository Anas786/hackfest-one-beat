import { FC } from "react";
import { UserProvider } from "contexts/UserContext";
import { BrowserRouter } from "react-router-dom";
import { Router } from "router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App: FC = () => {
  return (
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
  );
};

export default App;
