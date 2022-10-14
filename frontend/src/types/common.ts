import { IconType } from "react-icons";

export interface INavItem {
  label: "Patients" | "Appointments" | "Transfer Forms";
  path: string;
  icon: JSX.Element;
}
