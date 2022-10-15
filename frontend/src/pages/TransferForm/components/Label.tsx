import { FC } from "react";

interface StyledLabelProps {
  text: string;
  required?: boolean;
}

export const StyledLabel: FC<StyledLabelProps> = ({ text, required = false }) => {
  return (
    <p style={{ marginBottom: "6px" }}>
      {text}
      {required && <span style={{ color: "red" }}>*</span>}
    </p>
  );
};
