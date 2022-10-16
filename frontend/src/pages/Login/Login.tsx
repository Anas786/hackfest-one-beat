import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Card, Input, useTheme } from "@mui/material";
import { useAuth, useProfile } from "hooks";
import { Button } from "ui";
import { ILoginUser } from "types/user";
import { PRIMARY_GRADIENT } from "constants/colors";
import { ReactComponent as Logo } from "images/logo.svg";

export const Login = () => {
  const [user, setUser] = useState<ILoginUser>({ user_name: "", password: "" });

  const theme = useTheme();
  const navigate = useNavigate();
  const { userState } = useProfile();
  const { login } = useAuth();

  const { isLoading } = userState;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/dashboard");
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setUser({ ...user, [e.target.name]: e.target.value });

  const handleLogin = async () => {
    const response = await login(user);
    if (response.user) navigate("/dashboard");
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
        background: PRIMARY_GRADIENT,
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
          value={user.user_name}
          name="user_name"
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
