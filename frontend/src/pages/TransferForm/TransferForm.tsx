import React from "react";
import { Box, useTheme } from "@mui/material";

export const TransferForms = () => {
  const theme = useTheme();
  return (
    <Box sx={{ padding: "20px", backgroundColor: theme.palette.grey["100"], height: "100%" }}>
      Transfer Form
    </Box>
  );
};
