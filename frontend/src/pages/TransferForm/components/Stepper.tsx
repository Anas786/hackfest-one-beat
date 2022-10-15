import { Steps } from "antd";
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
    description: "",
  },
  {
    key: 1,
    title: "Patient Status",
    description: "",
  },
  {
    key: 2,
    title: "Patient Diagnostics",
    description: "",
  },
  {
    key: 3,
    title: "Admission Preferences",
    description: "",
  },
  {
    key: 4,
    title: "Submit",
    description: "",
  },
];

export const Stepper: React.FC<StepperProps> = ({ currentStep, setStep }) => (
  <div style={{ paddingTop: "20px" }}>
    <Steps progressDot current={currentStep}>
      {STEPS.map((step) => (
        <Step
          key={step.key}
          style={{ cursor: "pointer" }}
          onClick={() => {
            if (true) setStep(step.key);
          }}
          title={step.title}
          description={step.description}
        />
      ))}
    </Steps>
  </div>
);
