import { Layout, Menu } from "antd";
import React, { ReactNode, useState } from "react";
import { ReactComponent as Logo } from "images/logo.svg";
import "./styles.css";
import { INavItem } from "types";
import { GiHospitalCross } from "react-icons/gi";
import { BiArrowFromLeft, BiArrowToLeft } from "react-icons/bi";
import { ImCalendar } from "react-icons/im";
import { FaHandHoldingMedical } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";

const { Header, Sider, Content } = Layout;

interface MainLayoutProps {
  children: ReactNode;
}

export const NAV_ITEMS: INavItem[] = [
  { label: "Patients", path: "/patients", icon: <GiHospitalCross /> },
  { label: "Test", path: "/test", icon: <GiHospitalCross /> },
  { label: "Appointments", path: "/appointments", icon: <ImCalendar /> },
  { label: "Transfer Forms", path: "/transfer-forms", icon: <FaHandHoldingMedical /> },
];

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const { pathname } = location;

  return (
    <Layout style={{ height: "100vh" }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <Logo className="logo" height={80} width={"100%"} />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["/patients"]}
          items={NAV_ITEMS.map((item) => {
            return {
              key: item.path,
              icon: item.icon,
              onClick: () => navigate(item.path),
              label: item.label,
            };
          })}
        />
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 0, display: "flex" }}>
          <div onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? <BiArrowFromLeft fontSize={32} /> : <BiArrowToLeft fontSize={32} />}
          </div>
          <h2>{NAV_ITEMS.find((item) => item.path === pathname)?.label}</h2>
        </Header>
        <Content
          className="site-layout-background"
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};