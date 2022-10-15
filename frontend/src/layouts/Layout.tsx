import React from "react";
import { Box } from "@mui/material";
import { PRIMARY_GRADIENT } from "constants/colors";
import { Button } from "ui";
import { INavItem } from "types";
import { FaHandHoldingMedical } from "react-icons/fa";
import { GiHospitalCross } from "react-icons/gi";
import { ImCalendar } from "react-icons/im";
import { useLocation, useNavigate } from "react-router-dom";

interface ILayout {
  children: JSX.Element;
}

export const NAV_ITEMS: INavItem[] = [
  { label: "Patients", path: "/patients", icon: <GiHospitalCross /> },
  { label: "Appointments", path: "/appointments", icon: <ImCalendar /> },
  { label: "Transfer Forms", path: "/transfer-forms", icon: <FaHandHoldingMedical /> },
];

export const Layout = ({ children }: ILayout) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  return (
    <Box sx={{ width: "100vw", height: "100vh" }}>
      <Box
        sx={{
          display: "flex",
          gap: "16px",
          height: "60px",
          justifyContent: "center",
          alignItems: "center",
          padding: "0 30px",
          background: PRIMARY_GRADIENT,
        }}
      >
        {NAV_ITEMS.map(({ label, path, icon }) => (
          <Button
            key={`${label}-${path}`}
            variant="contained"
            color={path === pathname ? "primary" : "secondary"}
            onClick={() => navigate(path)}
          >
            <Box
              sx={{ display: "flex", gap: "6px", justifyContent: "center", alignItems: "center" }}
            >
              {icon}
              {label}
            </Box>
          </Button>
        ))}
      </Box>
      <Box sx={{ height: "92vh" }}>{children}</Box>
    </Box>
  );
};
