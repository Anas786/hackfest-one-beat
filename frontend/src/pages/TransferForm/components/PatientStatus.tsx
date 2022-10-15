import { FC } from "react";
import { Button, Form, Input } from "antd";
import { StyledLabel } from "./Label";
import { IPatientStatus } from "../utils/types";

interface PatientStatusProps {
  handleAddPatienStatus: (data: IPatientStatus) => void;
}

export const PatientStatus: FC<PatientStatusProps> = ({ handleAddPatienStatus }) => {
  const [form] = Form.useForm<IPatientStatus>();

  const handleFormSubmit = () => {
    const data = form.getFieldsValue();
    handleAddPatienStatus(data);
  };

  return (
    <div>
      <h2>Patient Status</h2>
      <Form
        form={form}
        onFinish={handleFormSubmit}
        style={{
          minHeight: "544px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div>
          <StyledLabel text="Mode of Transportation" required={true} />
          <Form.Item
            name="modeOfTransportaion"
            rules={[
              {
                required: true,
                message: "Please enter mode of transportaion!",
              },
            ]}
          >
            <Input name="modeOfTransportaion" />
          </Form.Item>
          <StyledLabel text="Code Status" required={true} />
          <Form.Item
            name="codeStatus"
            rules={[
              {
                required: true,
                message: "Please enter code status!",
              },
            ]}
          >
            <Input name="codeStatus" />
          </Form.Item>
          <StyledLabel text="Bed Type" required={true} />
          <Form.Item
            name="bedType"
            rules={[
              {
                required: true,
                message: "Please enter bed type!",
              },
            ]}
          >
            <Input name="bedType" />
          </Form.Item>
        </div>
        <Button block type="primary" size="large" htmlType="submit">
          Next
        </Button>
      </Form>
    </div>
  );
};
