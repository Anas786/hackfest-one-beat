import { toast } from "react-toastify";
import { Button } from "Ui";

export const Home = () => {
  return (
    <>
      <h1>Home Page</h1>
      <Button variant="contained" onClick={() => toast.success("HELLO")}>
        Hello
      </Button>
    </>
  );
};
