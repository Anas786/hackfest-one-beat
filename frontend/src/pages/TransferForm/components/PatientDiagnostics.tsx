import { Form, Input } from "antd";
import { StyledLabel } from "./Label";

const { Search } = Input;

export const PatientDiagnostics = () => {
  return (
    <Form>
      <Form.Item>
        <StyledLabel text="Mode of Transportation"></StyledLabel>
        <Search
          placeholder="Search Diagnostics"
          onSearch={() => console.log("Make Api Call")}
          enterButton
        />
      </Form.Item>
    </Form>
  );
};
