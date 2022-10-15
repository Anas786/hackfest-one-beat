import { useState } from "react";
import {
  Stepper,
  PatientInfo,
  PatientStatus,
  PatientDiagnoses,
  AdmissionPreferences,
} from "./components";
import { Button, Card, Divider } from "antd";
import { IAdmissionPreferences, IDiagonosis, IPatientInfo, IPatientStatus } from "./utils/types";

export const TransferForms = () => {
  const [step, setStep] = useState(0);
  const [patientInfo, setPatientInfo] = useState<IPatientInfo>();
  const [patientStatus, setPatientStatus] = useState<IPatientStatus>();
  const [patientDiagnoses, setPatientDiagnoses] = useState<Array<IDiagonosis>>();
  const [admissionPreferences, setAdmissionPreferences] = useState<IAdmissionPreferences>();

  const nextStep = () => setStep(step + 1);

  const handleAddPatientInfo = (data: IPatientInfo) => {
    setPatientInfo(data);
    nextStep();
  };

  const handleAddPatienStatus = (data: IPatientStatus) => {
    setPatientStatus(data);
    nextStep();
  };

  const handleAddPatientDiagnoses = (data: Array<any>) => {
    setPatientDiagnoses(data);
    nextStep();
  };

  const handleAddAdmissionPreferences = (data: IAdmissionPreferences) => {
    setAdmissionPreferences(data);
    nextStep();
  };

  const handleSumbit = () => {
    console.log(patientInfo);
    console.log(patientStatus);
    console.log(patientDiagnoses);
    console.log(admissionPreferences);
  };

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Card style={{ width: "fit-content" }}>
        <div>
          {step === 0 && <PatientInfo handleAddPatientInfo={handleAddPatientInfo} />}
          {step === 1 && <PatientStatus handleAddPatienStatus={handleAddPatienStatus} />}
          {step === 2 && <PatientDiagnoses handleAddPatientDiagnoses={handleAddPatientDiagnoses} />}
          {step === 3 && (
            <AdmissionPreferences handleAddAdmissionPreferences={handleAddAdmissionPreferences} />
          )}
          {step === 4 && (
            <div
              style={{
                minHeight: "544px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <h2>Finalize</h2>
              <p>All done! Submit!</p>
              <Button onClick={handleSumbit} type="primary" size="large" block>
                Submit
              </Button>
            </div>
          )}
        </div>
        <Divider />
        <Stepper currentStep={step} setStep={setStep} />
      </Card>
    </div>
  );
};
