import { FC } from "react";
import { Button, Form, Input, Select } from "antd";
import { StyledLabel } from "./Label";
import { IAdmissionPreferences } from "../utils/types";
import { facilities, ETA } from "../utils/constants";

const { Option } = Select;

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
            <Select size="middle" placeholder="Please select facility" style={{ width: "100%" }}>
              {facilities.map((facility) => (
                <Option key={facility.id} value={facility.name}>
                  {facility.name}
                </Option>
              ))}
            </Select>
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
            <Select
              size="middle"
              placeholder="Please select patient's ETA"
              style={{ width: "100%" }}
            >
              {ETA.map((eta) => (
                <Option key={eta.id} value={eta.id}>
                  {eta.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </div>
        <Button block size="large" htmlType="submit" type="primary">
          Next
        </Button>
      </Form>
    </div>
  );
};
