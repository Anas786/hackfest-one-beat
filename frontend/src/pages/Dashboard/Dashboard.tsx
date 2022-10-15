import React from "react";
import "./Dashboard.css";
import { CounterCard } from "./Components/CounterCard";

import { Card, Col, Row, Typography, Radio } from "antd";
import Echart from "../../components/Layouts/sharedAdminLayout/partials/chart/EChart";
import LineChart from "../../components/Layouts/sharedAdminLayout/partials/chart/LineChart";
import AdminAnalayticsCard from "../../components/Layouts/sharedAdminLayout/partials/analytics-card";
import {
  faUser,
  faUserCheck,
  faUsers,
  faUserSlash,
} from "@fortawesome/free-solid-svg-icons";
import DonutChart from "components/Layouts/sharedAdminLayout/partials/chart/DonutChart";

export const Dashboard = () => {
  const analytics = [
    {
      title: "Total Patients",
      thumb: faUser,
      amount: 50,
    },
    {
      title: "Admitted",
      thumb: faUsers,
      amount: 33,
    },
    {
      title: "Shifted to Hospital",
      thumb: faUserCheck,
      amount: 12,
    },
    {
      title: "Discharged",
      thumb: faUserSlash,
      amount: "30",
    },
  ];
  return (
    <>
      <div className="layout-content">
        <Row className="rowgap-vbox" gutter={[24, 0]}>
          {analytics.map((item, index) => (
            <Col
              xs={24}
              sm={24}
              md={12}
              lg={6}
              xl={6}
              className="mb-24"
              key={index}
            >
              <AdminAnalayticsCard
                title={item.title}
                thumb={item.thumb}
                total={item.amount}
              />
            </Col>
          ))}
        </Row>

        <Row gutter={[24, 0]} className="mt-20">
          <Col xs={24} sm={24} md={12} lg={12} xl={10} className="mb-24">
            <Card bordered={false} className="criclebox h-full">
              <Echart totalUsers={50} totalProjects={44} totalClinics={11} />
            </Card>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} xl={14} className="mb-24">
            <Card bordered={false} className="criclebox h-full">
              <LineChart />
            </Card>
          </Col>
        </Row>

        <Row gutter={[24, 0]} className="mt-20">
          <Col xs={24} sm={24} md={12} lg={12} xl={10} className="mb-24">
            <Card bordered={false} className="criclebox h-full">
              <DonutChart 
                type={"donut"} 
                title={"Patiens In Queue"} 
                percent={"+33%"} 
                options={{ labels: ["Appointment", "Admits", "Pending Test Results","Shifted to Hospital"] }}
                series={[10, 5, 3, 2]}  
              />
            </Card>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} xl={14} className="mb-24">
            <Card bordered={false} className="criclebox h-full">
              <DonutChart 
                type={"pie"} 
                title={"Reported Disease Types"} 
                percent={"+40%"} 
                options={{ labels: ["Back Pain", "Chest Pain", "Dengue", "Other"] }}
                series={[10, 5, 3, 2]}  
              />
            </Card>
          </Col>
        </Row>
        
      </div>
    </>
  );
};
