import { Tabs, Card } from "antd";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { DiagnosticOrder } from "./components/DiagnosticOrder";
import { MedicalRecord } from "./components/MedicalRecord";
import { MedicationOrder } from "./components/MedicationOrder";
import { SpecialtyConsults } from "./components/SpecialtyConsults";

const { TabPane } = Tabs;

export const AppointmentDetail = () => {
  const [activeKey, setActiveKey] = useState("medicalRecord");
  const { appointmentId = "", patientId = "" } = useParams();

  const parsedId = parseInt(appointmentId);
  const parsedPatientId = parseInt(patientId);
  return (
    <Card>
      <Tabs activeKey={activeKey} onChange={(key) => setActiveKey(key)}>
        <TabPane key="medicalRecord" tab="Medical Record">
          <MedicalRecord appointment_id={parsedId} patient_id={parsedPatientId} />
        </TabPane>
        <TabPane key="medicationOrder" tab="Medication Order">
          <MedicationOrder appointment_id={parsedId} patient_id={parsedPatientId} />
        </TabPane>
        <TabPane key="diagnosticOrder" tab="Diagnostic Order">
          <DiagnosticOrder appointment_id={parsedId} patient_id={parsedPatientId} />
        </TabPane>
        <TabPane key="specialtyConsults" tab="Specialty Consults">
          <SpecialtyConsults appointment_id={parsedId} patient_id={parsedPatientId} />
        </TabPane>
      </Tabs>
    </Card>
  );
};
