import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Row, Col, Card, Typography, Tabs } from "antd";
import { fetchPatientDetail } from "services/patients";
import { IPatient } from "types";
import { toast } from "react-toastify";
import { Loader } from "ui";
import { getDateString } from "utils/common";
import "./styles.css";

export const PatientDetail = () => {
  const { patientId } = useParams();
  const { Title, Paragraph } = Typography;
  const [loading, setLoading] = useState(false);
  const [patient, setPatient] = useState<IPatient>();

  useEffect(() => {
    if (!patientId) return;
    try {
      setLoading(true);
      (async () => {
        const { status, message, data } = await fetchPatientDetail(Number(patientId));
        if (status) setPatient(data);
        else toast.error(message);
      })();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  const items = [
    { label: "Contact Info", key: "item-1", children: PatientInfoPane(patient) }, // remember to pass the key prop
    { label: "Tab 2", key: "item-2", children: <h1>Hello</h1> },
  ];

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="layout-content">
      <div className="mb-24">
        <Card bordered={false} className="criclebox">
          <Title level={5}>{"Patient Information"}</Title>
          <Paragraph style={{ marginBottom: 5 }}>{"Detailed Patient Information"}</Paragraph>
          <Tabs defaultActiveKey="item-1" style={{ marginTop: 20 }} items={items}></Tabs>
        </Card>
      </div>
    </div>
  );
};

const PatientInfoPane = (patient?: IPatient) => {
  return (
    <Row gutter={[24, 0]}>
      <Col xs={24} sm={24} md={6} lg={6} xl={6}>
        <h5 className="detail-title">Name</h5>
        <p className="detail-description">
          {patient?.first_name} {patient?.last_name}
        </p>
      </Col>
      <Col xs={24} sm={24} md={6} lg={6} xl={6}>
        <h5 className="detail-title">Gender</h5>
        <p className="detail-description">{patient?.gender === "M" ? "Male" : "Female"}</p>
      </Col>
      <Col xs={24} sm={24} md={6} lg={6} xl={6}>
        <h5 className="detail-title">Contact Number</h5>
        <p className="detail-description">{patient?.phone}</p>
      </Col>
      <Col xs={24} sm={24} md={6} lg={6} xl={6}>
        <h5 className="detail-title">CNIC #</h5>
        <p className="detail-description">{patient?.nic}</p>
      </Col>
      <Col xs={24} sm={24} md={6} lg={6} xl={6}>
        <h5 className="detail-title">Date of Birth</h5>
        <p className="detail-description">{getDateString(patient?.dob)}</p>
      </Col>
      <Col xs={24} sm={24} md={6} lg={6} xl={6}>
        <h5 className="detail-title">Email</h5>
        <p className="detail-description">{patient?.email ? patient?.email : "---"}</p>
      </Col>
    </Row>
  );
};
