import React from "react";
import { Form, Select, Button } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { CONSULT_OPTIONS } from "constants/common";
import { StyledLabel } from "pages/TransferForm/components/Label";
import { postSpecialtyConsults } from "services";
import { toast } from "react-toastify";

const Option = Select;

interface ISpecialtyConsultsProps {
  appointment_id: number;
  patient_id: number;
}

export const SpecialtyConsults = ({ appointment_id, patient_id }: ISpecialtyConsultsProps) => {
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    try {
      const data = form.getFieldsValue();

      var formdata = new FormData();
      formdata.append("appointment_id", appointment_id.toString());
      formdata.append("notes", data.notes || "");
      formdata.append("consults", data.consults.join(","));

      const response = await postSpecialtyConsults(formdata, patient_id);
      toast.success("Specialty Consults Added successfully");
    } catch (e) {
      console.log(e);
      toast.error("Specialty Consults Add failed");
    }
  };

  return (
    <Form form={form} onFinish={handleSubmit} style={{ minHeight: "490px" }}>
      <StyledLabel text="Notes" />
      <Form.Item>
        <TextArea name="notes" />
      </Form.Item>

      <StyledLabel text="Consults" required={true} />
      <Form.Item
        name="consults"
        rules={[
          {
            required: true,
            message: "Please enter consults!",
          },
        ]}
      >
        <Select
          mode="multiple"
          size="middle"
          placeholder="Please select consults"
          style={{ width: "100%" }}
        >
          {CONSULT_OPTIONS.map(({ label, value }) => (
            <Option key={value} value={value}>
              {label}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Button type="primary" size="large" htmlType="submit">
        Add
      </Button>
    </Form>
  );
};
