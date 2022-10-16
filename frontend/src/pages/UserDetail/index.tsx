import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Row, Col, Card, Typography, Tabs, Table } from "antd";
import {
  fetchDiagnosticOrders,
  fetchMedicalRecords,
  fetchMedicationOrders,
  fetchPatientDetail,
  fetchSpecialityConsults,
} from "services/patients";
import {
  IDiagnosticOrder,
  IMedicalRecord,
  IMedicationOrder,
  IPatient,
  ISpecialConsult,
} from "types";
import { toast } from "react-toastify";
import { Loader } from "ui";
import "./styles.css";
import { DIET_OPTIONS, IV_FLUIDS_OPTIONS } from "constants/common";

export const PatientDetail = () => {
  const { patientId } = useParams();
  const { Title, Paragraph } = Typography;
  const [loading, setLoading] = useState(false);
  const [patient, setPatient] = useState<IPatient>();
  const [medicalRecords, setMedicalRecords] = useState<Array<IMedicalRecord>>([]);
  const [medicationOrders, setMedicationOrders] = useState<Array<IMedicationOrder>>([]);
  const [diagnosticOrders, setDiagnosticOrders] = useState<Array<IDiagnosticOrder>>([]);
  const [specialConsults, setSpecialConsults] = useState<Array<ISpecialConsult>>([]);

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

  useEffect(() => {
    if (!patientId) return;
    const id = Number(patientId);
    (async () => {
      try {
        const [
          medicalRecordsResp,
          medicationOrdersResp,
          diagnosticOrdersResp,
          specialityConsultsResp,
        ] = await Promise.all([
          fetchMedicalRecords(id),
          fetchMedicationOrders(id),
          fetchDiagnosticOrders(id),
          fetchSpecialityConsults(id),
        ]);
        const _medicalRecords = medicalRecordsResp.data.data;
        const _medicationOrders = medicationOrdersResp.data.data;
        const _diagnosticOrders = diagnosticOrdersResp.data.data;
        const _specialConsults = specialityConsultsResp.data.data;
        setMedicalRecords(_medicalRecords);
        setMedicationOrders(_medicationOrders);
        setDiagnosticOrders(_diagnosticOrders);
        setSpecialConsults(_specialConsults);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [patient, patientId]);

  const items = [
    { label: "Contact Info", key: "item-1", children: PatientInfoPane(patient) },
    { label: "Medical Records", key: "item-2", children: MedicalRecordsPane(medicalRecords) },
    { label: "Medication Orders", key: "item-3", children: MedicationOrdersPane(medicationOrders) },
    { label: "Diagnostic Orders", key: "item-4", children: DiagnosticOrdersPane(diagnosticOrders) },
    { label: "Sepecial Consults", key: "item-5", children: SpecialConsultsPane(specialConsults) },
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
        <h5 className="detail-title">MR Number</h5>
        <p className="detail-description">{patient?.mr_number}</p>
      </Col>
      <Col xs={24} sm={24} md={6} lg={6} xl={6}>
        <h5 className="detail-title">Gender</h5>
        <p className="detail-description">{patient?.gender}</p>
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
        <p className="detail-description">{patient?.dob}</p>
      </Col>
      <Col xs={24} sm={24} md={6} lg={6} xl={6}>
        <h5 className="detail-title">Email</h5>
        <p className="detail-description">{patient?.email ? patient?.email : "---"}</p>
      </Col>
    </Row>
  );
};

const MedicalRecordsPane = (medicalRecords?: Array<IMedicalRecord>) => {
  const columns = [
    {
      key: 1,
      title: "Appointment Id",
      dataIndex: "appointment_id",
    },
    {
      key: 2,
      title: "Temperature",
      dataIndex: "temperature",
    },
    {
      key: 3,
      title: "Glucos",
      dataIndex: "glucos",
    },
    {
      key: 4,
      title: "BP Systolic",
      dataIndex: "bp_systolic",
    },
    {
      key: 5,
      title: "BP Diastolic",
      dataIndex: "bp_diastolic",
    },
    {
      key: 6,
      title: "Pulse",
      dataIndex: "pulse",
    },
    {
      key: 7,
      title: "O2 Level",
      dataIndex: "o2_level",
    },
  ];

  const onChange = () => {};

  return <Table columns={columns} dataSource={medicalRecords} onChange={onChange} />;
};

const MedicationOrdersPane = (medicationOrders?: Array<IMedicationOrder>) => {
  const columns = [
    {
      key: 1,
      title: "Appointment Id",
      dataIndex: "appointment_id",
    },
    {
      key: 2,
      title: "Diet Id",
      dataIndex: "diet_id",
      render: (_: any, record: any) => {
        const diet = DIET_OPTIONS.find((diet) => diet.value === record.diet_id);
        return diet?.label || record.diet_id;
      },
    },
    {
      key: 3,
      title: "IV Fluid Id",
      dataIndex: "iv_fluid_id",
      render: (_: any, record: any) => {
        const iv_fluid = IV_FLUIDS_OPTIONS.find((fluid) => fluid.value === record.iv_fluid_id);
        return iv_fluid?.label || record.diet_id;
      },
    },
    {
      key: 5,
      title: "Meds",
      dataIndex: "meds",
    },
    {
      key: 4,
      title: "Notes",
      dataIndex: "notes",
    },
  ];

  const onChange = () => {};

  return <Table columns={columns} dataSource={medicationOrders} onChange={onChange} />;
};

const DiagnosticOrdersPane = (diagnosticOrders?: Array<IDiagnosticOrder>) => {
  const columns = [
    {
      key: 1,
      title: "Appointment Id",
      dataIndex: "appointment_id",
    },
    {
      key: 3,
      title: "Blood Tests",
      dataIndex: "blood_tests",
      render: (value: any, record: any) =>
        record.blood_tests.reduce((acc: any, curr: any) => curr.blood_test.name + ", " + acc, ""),
    },
    {
      key: 4,
      title: "Imaging Tests",
      dataIndex: "imaging_tests",
      render: (value: any, record: any) =>
        record.imaging_tests.reduce(
          (acc: any, curr: any) => curr.imaging_test.name + ", " + acc,
          ""
        ),
    },
    {
      key: 5,
      title: "Urine Tests",
      dataIndex: "urine_tests",
      render: (value: any, record: any) =>
        record.urine_tests.reduce((acc: any, curr: any) => curr.urine_test.name + ", " + acc, ""),
    },
    {
      key: 2,
      title: "Notes",
      dataIndex: "notes",
    },
  ];

  const onChange = () => {};

  return <Table columns={columns} dataSource={diagnosticOrders} onChange={onChange} />;
};

const SpecialConsultsPane = (specialConsults?: Array<ISpecialConsult>) => {
  const columns = [
    {
      key: 1,
      title: "Appointment Id",
      dataIndex: "appointment_id",
    },
    {
      key: 3,
      title: "Special Consults",
      dataIndex: "special_consults",
      render: (value: any, record: any) =>
        record.consults.reduce((acc: any, curr: any) => curr.consult.name + ", " + acc, ""),
    },
    {
      key: 2,
      title: "Notes",
      dataIndex: "notes",
    },
  ];

  const onChange = () => {};

  return <Table columns={columns} dataSource={specialConsults} onChange={onChange} />;
};
