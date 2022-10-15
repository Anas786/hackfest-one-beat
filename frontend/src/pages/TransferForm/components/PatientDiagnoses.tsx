import { FC, useState } from "react";
import { Button, Form, Select } from "antd";
import { StyledLabel } from "./Label";
import { diagnoses } from "../utils/constants";
import { IDiagonosis } from "../utils/types";

const { Option } = Select;

interface PatientDiagnosesProps {
  handleAddPatientDiagnoses: (data: Array<any>) => void;
}

export const PatientDiagnoses: FC<PatientDiagnosesProps> = ({ handleAddPatientDiagnoses }) => {
  const [data, setData] = useState<Array<IDiagonosis>>([]);

  const handleChange = (values: any) => {
    setData(values);
  };

  const handleFormSubmit = () => {
    handleAddPatientDiagnoses(data);
  };

  return (
    <div>
      <h2>Patient Diagnostics</h2>
      <Form
        style={{
          minHeight: "544px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div>
          <Form.Item>
            <StyledLabel text="Diagnoses"></StyledLabel>
            <Select
              mode="multiple"
              size="middle"
              placeholder="Please provide your diagnoses for patient"
              defaultValue={data}
              style={{ width: "100%" }}
              onChange={handleChange}
            >
              {diagnoses.map((diagnosis) => (
                <Option key={diagnosis.id} value={diagnosis.name}>
                  {diagnosis.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </div>
        <Button block type="primary" size="large" htmlType="submit" onClick={handleFormSubmit}>
          Next
        </Button>
      </Form>
    </div>
  );
};
