import React from "react";
import { Box, Card, Input, Typography, useTheme } from "@mui/material";
import { Button } from "ui";

export const Login = () => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        backgroundColor: theme.palette.primary.light,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "12px",
      }}
    >
      <Card sx={{ display: "flex", flexDirection: "column", padding: "36px", gap: "12px" }}>
        <Typography variant="h2" textAlign="center">
          Sign In
        </Typography>
        <Input placeholder="Enter email" />
        <Input placeholder="Enter password" type="password" />
        <Button variant="contained" color="secondary">
          Login
        </Button>
      </Card>
    </Box>
  );
};
