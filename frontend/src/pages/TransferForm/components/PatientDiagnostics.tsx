import { FC, useState } from "react";
import { Button, Form, Input } from "antd";
import { StyledLabel } from "./Label";

const { Search } = Input;

interface PatientDiagnosticsProps {
  handleAddPatienDiagnostics: (data: Array<any>) => void;
}

export const PatientDiagnostics: FC<PatientDiagnosticsProps> = ({ handleAddPatienDiagnostics }) => {
  const [data, setData] = useState<Array<any>>([]);

  const handleFormSubmit = () => {
    handleAddPatienDiagnostics(data);
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
            <StyledLabel text="Mode of Transportation"></StyledLabel>
            <Search
              placeholder="Search Diagnostics"
              onSearch={() => console.log("Make Api Call")}
              enterButton
            />
          </Form.Item>
        </div>
        <Button block type="primary" size="large" htmlType="submit" onClick={handleFormSubmit}>
          Next
        </Button>
      </Form>
    </div>
  );
};
