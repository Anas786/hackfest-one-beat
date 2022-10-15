import React from "react";
import { Button, Form, Input } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { StyledLabel } from "pages/TransferForm/components/Label";
import { toast } from "react-toastify";
import { postMedicalOrder } from "services";

interface IMedicalRecordProps {
  appointment_id: number;
  patient_id: number;
}

export const MedicalRecord = ({ appointment_id, patient_id }: IMedicalRecordProps) => {
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    try {
      const data = form.getFieldsValue();
      const response = await postMedicalOrder({ ...data, appointment_id, patient_id });
      toast.success("Medical Record Added successfully");
    } catch (e) {
      console.log(e);
      toast.error("Medical Record Add failed");
    }
  };
  return (
    <Form form={form} onFinish={handleSubmit} style={{ minHeight: "490px" }}>
      <StyledLabel text="Temperature" />
      <Form.Item name="temperature">
        <Input name="temperature" />
      </Form.Item>

      <StyledLabel text="Glucose" required={true} />
      <Form.Item
        name="glucose"
        rules={[
          {
            required: true,
            message: "Please enter glucose",
          },
        ]}
      >
        <Input name="glucose" type="number" />
      </Form.Item>

      <StyledLabel text="BP Systolic" required={true} />
      <Form.Item
        name="bp_systolic"
        rules={[
          {
            required: true,
            message: "Please enter bp systolic",
          },
        ]}
      >
        <Input name="bp_systolic" type="number" />
      </Form.Item>

      <StyledLabel text="BP Diastolic" required={true} />
      <Form.Item
        name="bp_diastolic"
        rules={[
          {
            required: true,
            message: "Please enter bp diastolic!",
          },
        ]}
      >
        <Input name="bp_diastolic" type="number" />
      </Form.Item>

      <StyledLabel text="Pulse" required={true} />
      <Form.Item
        name="pulse"
        rules={[
          {
            required: true,
            message: "Please enter Pulse!",
          },
        ]}
      >
        <Input name="pulse" type="number" />
      </Form.Item>

      <StyledLabel text="Oxygen Level" required={true} />
      <Form.Item
        name="o2_level"
        rules={[
          {
            required: true,
            message: "Please enter oxygen level!",
          },
        ]}
      >
        <Input name="o2_level" type="number" />
      </Form.Item>

      <StyledLabel text="Other Alergies" />
      <Form.Item name="other_allergies">
        <Input name="other_allergies" />
      </Form.Item>

      <StyledLabel text="Notes" />
      <Form.Item>
        <TextArea name="notes" />
      </Form.Item>

      <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Button type="primary" size="large" htmlType="submit" style={{ width: "240px" }}>
          Add
        </Button>
      </div>
    </Form>
  );
};
