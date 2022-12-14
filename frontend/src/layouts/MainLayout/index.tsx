import { Button, Layout, Menu } from "antd";
import React, { ReactNode, useState } from "react";
import { ReactComponent as Logo } from "images/logo-light.svg";
import "./styles.css";
import { INavItem } from "types";
import { GiHospitalCross } from "react-icons/gi";
import { ImCalendar } from "react-icons/im";
import { FaDashcube, FaHandHoldingMedical } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { useAuth, useProfile } from "hooks";

const { Header, Sider, Content } = Layout;

interface MainLayoutProps {
  children: ReactNode;
}

export const NAV_ITEMS: INavItem[] = [
  { label: "Dashboard", path: "/dashboard", icon: <FaDashcube />, show: true },
  { label: "Patients", path: "/patients", icon: <GiHospitalCross />, show: true },
  { label: "Appointments", path: "/appointments", icon: <ImCalendar />, show: true },
  { label: "Transfer Forms", path: "/transfer-forms", icon: <FaHandHoldingMedical />, show: true },
  {
    label: "Patient Information",
    path: "/patients/",
    icon: <FaHandHoldingMedical />,
    show: false,
  },
];

export const HOSPITAL_NAV_ITEMS: INavItem[] = [
  { label: "Dashboard", path: "/dashboard", icon: <FaDashcube />, show: true },
  { label: "Transfer Forms", path: "/transfer-forms", icon: <FaHandHoldingMedical />, show: true },
  {
    label: "Patient Information",
    path: "/patients/",
    icon: <FaHandHoldingMedical />,
    show: false,
  },
];

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const { pathname } = location;

  const { userState } = useProfile();
  const { user } = userState;
  const { category } = user;
  const name = category?.name;

  return (
    <Layout style={{ height: "100vh" }}>
      <Sider width={"250"} collapsedWidth={80} trigger={null} collapsible collapsed={collapsed}>
        <Logo className="logo" height={80} width={"100%"} />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[pathname]}
          items={(name === "Hospital" ? HOSPITAL_NAV_ITEMS : NAV_ITEMS)
            .filter((item) => item.show)
            .map((item) => {
              return {
                key: item.path,
                icon: item.icon,
                onClick: () => navigate(item.path),
                label: item.label,
              };
            })}
        />
        <div style={{ position: "relative", height: name === "Hospital" ? "75vh" : "65vh" }}>
          <Button
            style={{
              position: "absolute",
              margin: "16px",
              bottom: "10px",
              left: 0,
              right: 0,
              color: "white",
            }}
            onClick={logout}
            type={"primary"}
          >
            Logout
          </Button>
        </div>
      </Sider>
      <Layout className="site-layout">
        <Header
          className="site-layout-background"
          style={{
            padding: 0,
            display: "flex",
            alignItems: "baseline",
            gap: "12px",
            paddingLeft: "12px",
          }}
        >
          {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
            className: "trigger",
            onClick: () => setCollapsed(!collapsed),
          })}
          <h2>{NAV_ITEMS.find((item) => pathname.includes(item.path))?.label}</h2>
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            height: "100%",
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};
