import React from "react";
import { ButtonProps, Button as MUIButton, useTheme } from "@mui/material";
import { PulseLoader } from "react-spinners";

interface IButtonProps extends ButtonProps {
  isLoading?: boolean;
  children: React.ReactNode;
}

export const Button = (props: IButtonProps) => {
  const { isLoading = false, children, ...rest } = props;
  const theme = useTheme();
  return (
    <MUIButton sx={{ height: "36px" }} {...rest}>
      {isLoading ? <PulseLoader color={theme.palette.primary.light} size="8" /> : children}
    </MUIButton>
  );
};
