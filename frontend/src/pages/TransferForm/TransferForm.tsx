import { useState } from "react";
import { useTheme } from "@mui/material";
import {
  Stepper,
  TransferForm,
  PatientStatus,
  PatientDiagnostics,
  AdmissionPreferences,
} from "./components";
import { Card, Divider } from "antd";

export const TransferForms = () => {
  const theme = useTheme();
  const [step, setStep] = useState(0);
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Card style={{ width: "fit-content" }}>
        <div style={{ minHeight: "450px" }}>
          {step === 0 && <TransferForm />}
          {step === 1 && <PatientStatus />}
          {step === 2 && <PatientDiagnostics />}
          {step === 3 && <AdmissionPreferences />}
        </div>
        <Divider />
        <Stepper currentStep={step} setStep={setStep} />
      </Card>
    </div>
  );
};
