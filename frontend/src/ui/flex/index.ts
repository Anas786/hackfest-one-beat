import { Box } from "@mui/material";
import { styled } from "@mui/system";
import { IFlex } from "./types";

export const Flex = styled(Box)((theme: IFlex) => {
  const { sx } = theme;
  return { ...sx, display: "flex" };
});
