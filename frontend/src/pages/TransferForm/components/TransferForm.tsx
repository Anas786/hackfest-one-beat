import { Form, Input, Radio } from "antd";
import { StyledLabel } from "./Label";

export const TransferForm = () => {
  return (
    <Form>
      <Form.Item>
        <StyledLabel text="Name" />
        <Input />
      </Form.Item>
      <Form.Item>
        <StyledLabel text="Date of Birth" />
        <Input />
      </Form.Item>
      <Form.Item>
        <StyledLabel text="CNIC Number" />
        <Input />
      </Form.Item>
      <Form.Item>
        <StyledLabel text="Gender" />
        <Radio.Group>
          <Radio value="male"> Male </Radio>
          <Radio value="femail"> Female </Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item>
        <StyledLabel text="Patient Email Address" />
        <Input />
      </Form.Item>
      <Form.Item>
        <StyledLabel text="Patient Cell Number" />
        <Input />
      </Form.Item>
    </Form>
  );
};
