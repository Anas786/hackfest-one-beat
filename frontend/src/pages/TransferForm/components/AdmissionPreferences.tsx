import { Form, Input } from "antd";
import { StyledLabel } from "./Label";

export const AdmissionPreferences = () => {
  return (
    <Form>
      <Form.Item>
        <StyledLabel text="Preferred Admitting Hosptial" />
        <Input />
      </Form.Item>
      <Form.Item>
        <StyledLabel text="Preferred Admitting Group" />
        <Input />
      </Form.Item>
      <Form.Item>
        <StyledLabel text="Preferred Admitting Physician" />
        <Input />
      </Form.Item>
      <Form.Item>
        <StyledLabel text="Doc to Doc" />
        <Input />
      </Form.Item>
      <Form.Item>
        <StyledLabel text="Patient ETA" />
        <Input />
      </Form.Item>
    </Form>
  );
};
