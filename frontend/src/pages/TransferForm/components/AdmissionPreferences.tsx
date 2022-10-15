import { FC } from "react";
import { Button, Form, Input } from "antd";
import { StyledLabel } from "./Label";
import { IAdmissionPreferences } from "../utils/types";

interface AdmissionPreferencesProps {
  handleAddAdmissionPreferences: (data: IAdmissionPreferences) => void;
}

export const AdmissionPreferences: FC<AdmissionPreferencesProps> = ({
  handleAddAdmissionPreferences,
}) => {
  const [form] = Form.useForm<IAdmissionPreferences>();

  const handleFormSubmit = () => {
    const data = form.getFieldsValue();
    handleAddAdmissionPreferences(data);
  };

  return (
    <div>
      <h2>Admission Preferences</h2>
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
          <StyledLabel text="Preferred Admitting Hosptial" required={true} />
          <Form.Item
            name="admittingHospitla"
            rules={[
              {
                required: true,
                message: "Please enter admitting hospital!",
              },
            ]}
          >
            <Input name="admittingHospitla" />
          </Form.Item>
          <StyledLabel text="Preferred Admitting Group" required={true} />
          <Form.Item
            name="admittingGroup"
            rules={[
              {
                required: true,
                message: "Please enter admitting group!",
              },
            ]}
          >
            <Input name="admittingGroup" />
          </Form.Item>
          <StyledLabel text="Preferred Admitting Physician" />
          <Form.Item name="admittingPhysician">
            <Input name="admittingPhysician" />
          </Form.Item>
          <StyledLabel text="Doc to Doc" />
          <Form.Item name="doctodoc">
            <Input name="doctodoc" />
          </Form.Item>
          <StyledLabel text="Patient ETA" required={true} />
          <Form.Item
            name="patientEta"
            rules={[
              {
                required: true,
                message: "Please enter patient's ETA!",
              },
            ]}
          >
            <Input name="patientEta" />
          </Form.Item>
        </div>
        <Button block size="large" htmlType="submit" type="primary">
          Next
        </Button>
      </Form>
    </div>
  );
};
