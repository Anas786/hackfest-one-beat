import { IconType } from "react-icons";

export interface INavItem {
  label: string;
  path: string;
  icon: JSX.Element;
  show: boolean;
}
