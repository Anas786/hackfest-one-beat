import { FC } from "react";
import { UserProvider } from "contexts/UserContext";
import { BrowserRouter } from "react-router-dom";
import { Router } from "router";

const App: FC = () => {
  return (
    <UserProvider>
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </UserProvider>
  );
};

export default App;
