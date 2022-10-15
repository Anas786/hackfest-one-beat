import { FC } from "react";

interface StyledLabelProps {
  text: string;
}

export const StyledLabel: FC<StyledLabelProps> = ({ text }) => {
  return <p style={{ marginBottom: "6px" }}>{text}</p>;
};
