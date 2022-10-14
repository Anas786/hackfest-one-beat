import React, { useState } from "react";
import { Box, Card, Input, useTheme } from "@mui/material";
import { Button } from "ui";
import { useNavigate } from "react-router-dom";
import { ReactComponent as Logo } from "images/logo.svg";
import { toast } from "react-toastify";
import { ILoginUser } from "types/user";
import { loginUser } from "services/auth/auth";

export const Login = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [user, setUser] = useState<ILoginUser>({ username: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      await loginUser(user);
      navigate("/admissions");
      toast.success("Logged In Successfully");
    } catch (e) {
      toast.error("Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "12px",
        background: "linear-gradient(90deg, #853BEF 0%, #f35b9c 35%, #f59d62 100%)",
      }}
    >
      <Card
        sx={{
          backgroundColor: theme.palette.grey["100"],
          display: "flex",
          flexDirection: "column",
          padding: "20px",
          gap: "16px",
        }}
      >
        <Logo />
        <Input
          placeholder="Enter username"
          value={user.username}
          name="username"
          onChange={handleChange}
        />
        <Input
          placeholder="Enter password"
          name="password"
          type="password"
          value={user.password}
          onChange={handleChange}
        />
        <Button variant="contained" color="primary" onClick={handleLogin} isLoading={isLoading}>
          Login
        </Button>
      </Card>
    </Box>
  );
};
