import React from "react";
import { Button, Form, Select } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { DIET_OPTIONS, IV_FLUIDS_OPTIONS, MEDICINES_OPTIONS } from "constants/common";
import { StyledLabel } from "pages/TransferForm/components/Label";
import { postMedicationOrder } from "services";
import { toast } from "react-toastify";
const { Option } = Select;

interface IMedicationOrderProps {
  appointment_id: number;
  patient_id: number;
}

export const MedicationOrder = ({ appointment_id, patient_id }: IMedicationOrderProps) => {
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    try {
      const data = form.getFieldsValue();
      await postMedicationOrder({
        ...data,
        meds: data.meds.join(","),
        appointment_id,
        patient_id,
      });
      toast.success("Medication Order Added successfully");
    } catch (e) {
      console.log(e);
      toast.error("Medication Order Add failed");
    }
  };
  return (
    <Form form={form} onFinish={handleSubmit} style={{ minHeight: "490px" }}>
      <StyledLabel text="Diet" required={true} />
      <Form.Item
        name="diet_id"
        rules={[
          {
            required: true,
            message: "Please enter diet!",
          },
        ]}
      >
        <Select size="middle" placeholder="Please select diet" style={{ width: "100%" }}>
          {DIET_OPTIONS.map(({ label, value }) => (
            <Option key={value} value={value}>
              {label}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <StyledLabel text="IV Fluid" required={true} />
      <Form.Item
        name="iv_fluid_id"
        rules={[
          {
            required: true,
            message: "Please enter iv fluid!",
          },
        ]}
      >
        <Select size="middle" placeholder="Please select iv fluid" style={{ width: "100%" }}>
          {IV_FLUIDS_OPTIONS.map(({ label, value }) => (
            <Option key={value} value={value}>
              {label}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <StyledLabel text="Medicines" required={true} />
      <Form.Item
        name="meds"
        rules={[
          {
            required: true,
            message: "Please enter medicines!",
          },
        ]}
      >
        <Select
          mode="multiple"
          size="middle"
          placeholder="Please select medicines"
          style={{ width: "100%" }}
        >
          {MEDICINES_OPTIONS.map((med) => (
            <Option key={med} value={med}>
              {med}
            </Option>
          ))}
        </Select>
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
