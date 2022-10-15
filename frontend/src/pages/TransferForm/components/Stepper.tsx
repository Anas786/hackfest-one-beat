import { Divider, Steps } from "antd";
import React, { SetStateAction } from "react";

const { Step } = Steps;

interface StepperProps {
  currentStep: number;
  setStep: React.Dispatch<SetStateAction<number>>;
}

const STEPS = [
  {
    key: 0,
    title: "Register Patient",
    description: "Description",
  },
  {
    key: 1,
    title: "Patient Status",
    description: "Description",
  },
  {
    key: 2,
    title: "Patient Diagnostics",
    description: "Description",
  },
  {
    key: 3,
    title: "Admission Preferences",
    description: "Description",
  },
];

export const Stepper: React.FC<StepperProps> = ({ currentStep, setStep }) => (
  <div style={{ paddingTop: "20px" }}>
    <Steps progressDot current={currentStep}>
      {STEPS.map((step) => (
        <Step
          style={{ cursor: "pointer" }}
          onClick={() => setStep(step.key)}
          title={step.title}
          description={step.description}
        />
      ))}
    </Steps>
  </div>
);
