import { FC } from "react";
import { Form, Input, Radio, DatePicker, Button } from "antd";
import { StyledLabel } from "./Label";
import { IPatientInfo } from "../utils/types";

interface PatientInfoProps {
  handleAddPatientInfo: (data: IPatientInfo) => void;
}

export const PatientInfo: FC<PatientInfoProps> = ({ handleAddPatientInfo }) => {
  const [form] = Form.useForm<IPatientInfo>();

  const handleFormSubmit = () => {
    const data = form.getFieldsValue();
    handleAddPatientInfo(data);
  };

  return (
    <div>
      <h2>Patient Information</h2>
      <Form form={form} onFinish={handleFormSubmit} style={{ minHeight: "490px" }}>
        <StyledLabel text="Name" required={true} />
        <Form.Item
          name="fullname"
          rules={[
            {
              required: true,
              message: "Please enter your name!",
            },
          ]}
        >
          <Input name="fullname" />
        </Form.Item>
        <StyledLabel text="Date of Birth" required={true} />
        <Form.Item
          name="dateofbirth"
          rules={[
            {
              required: true,
              message: "Please enter your date of birth!",
            },
          ]}
        >
          <DatePicker style={{ width: "100%" }} name="dateofbirth" />
        </Form.Item>
        <StyledLabel text="CNIC Number" required={true} />
        <Form.Item
          name="cnic"
          rules={[
            {
              required: true,
              message: "Please enter your CNIC number!",
            },
          ]}
        >
          <Input name="cnic" />
        </Form.Item>
        <StyledLabel text="Gender" required={true} />
        <Form.Item
          name="gender"
          rules={[
            {
              required: true,
              message: "Please select your gender!",
            },
          ]}
        >
          <Radio.Group>
            <Radio name="gender" value="male">
              Male
            </Radio>
            <Radio name="gender" value="femail">
              Female
            </Radio>
          </Radio.Group>
        </Form.Item>
        <StyledLabel text="Patient Email Address" />
        <Form.Item name="email">
          <Input name="email" />
        </Form.Item>
        <StyledLabel text="Patient Cell Number" required={true} />
        <Form.Item
          name="cell"
          rules={[
            {
              required: true,
              message: "Please enter your cell number!",
            },
          ]}
        >
          <Input name="cell" />
        </Form.Item>
        <Button type="primary" size="large" block htmlType="submit">
          Next
        </Button>
      </Form>
    </div>
  );
};
