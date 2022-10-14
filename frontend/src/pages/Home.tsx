import { toast } from "react-toastify";
import { Typography } from "@mui/material";
import { Button } from "ui";

export const Home = () => {
  return (
    <>
      <Typography variant="h1">Home Page</Typography>
      <Button color="primary" variant="contained" onClick={() => toast.success("HELLO")}>
        Hello
      </Button>
    </>
  );
};
