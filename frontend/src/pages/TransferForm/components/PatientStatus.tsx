import { Form, Input } from "antd";
import { StyledLabel } from "./Label";

export const PatientStatus = () => {
  return (
    <Form>
      <Form.Item>
        <StyledLabel text="Mode of Transportation"></StyledLabel>
        <Input />
      </Form.Item>
      <Form.Item>
        <StyledLabel text="Code Status"></StyledLabel>
        <Input />
      </Form.Item>
      <Form.Item>
        <StyledLabel text="Bed Type"></StyledLabel>
        <Input />
      </Form.Item>
    </Form>
  );
};
