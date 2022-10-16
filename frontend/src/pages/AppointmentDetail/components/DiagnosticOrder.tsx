import { Button, Form, Input, Select } from "antd";
import { BLOOD_TESTS_OPTIONS, IMAGING_TESTS_OPTIONS, URINE_TESTS_OPTIONS } from "constants/common";
import { StyledLabel } from "pages/TransferForm/components/Label";
import { postDiagnosticOrder } from "services";
import { toast } from "react-toastify";
const { Option } = Select;

interface IDiagnosticOrderProps {
  appointment_id: number;
  patient_id: number;
}

export const DiagnosticOrder = ({ appointment_id, patient_id }: IDiagnosticOrderProps) => {
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    try {
      const data = form.getFieldsValue();
      var formdata = new FormData();
      formdata.append("appointment_id", appointment_id.toString());
      formdata.append("notes", data.notes || "");
      formdata.append("blood_tests", data.blood_tests.join(","));
      formdata.append("urine_tests", data.urine_tests.join(","));
      formdata.append("imaging_tests", data.imaging_tests.join(","));

      await postDiagnosticOrder(formdata, patient_id);

      toast.success("Diagnostic Order Added successfully");
    } catch (e) {
      console.log(e);
      toast.error("Diagnostic Order Failed");
    }
  };

  return (
    <Form form={form} onFinish={handleSubmit} style={{ minHeight: "490px" }}>
      <StyledLabel text="Blood Tests" required={true} />
      <Form.Item
        name="blood_tests"
        rules={[
          {
            required: true,
            message: "Please enter blood tests!",
          },
        ]}
      >
        <Select
          mode="multiple"
          size="middle"
          placeholder="Please select Blood Tests"
          style={{ width: "100%" }}
        >
          {BLOOD_TESTS_OPTIONS.map(({ value, label }) => (
            <Option key={value} value={value}>
              {label}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <StyledLabel text="Urine Tests" required={true} />
      <Form.Item
        name="urine_tests"
        rules={[
          {
            required: true,
            message: "Please enter urine tests!",
          },
        ]}
      >
        <Select
          mode="multiple"
          size="middle"
          placeholder="Please select urine tests!"
          style={{ width: "100%" }}
        >
          {URINE_TESTS_OPTIONS.map(({ label, value }) => (
            <Option key={value} value={value}>
              {label}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <StyledLabel text="Imaging Tests" required={true} />
      <Form.Item
        name="imaging_tests"
        rules={[
          {
            required: true,
            message: "Please enter imaging tests!",
          },
        ]}
      >
        <Select
          mode="multiple"
          size="middle"
          placeholder="Please select imaging tests"
          style={{ width: "100%" }}
        >
          {IMAGING_TESTS_OPTIONS.map(({ label, value }) => (
            <Option key={value} value={value}>
              {label}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <StyledLabel text="Notes" />
      <Form.Item>
        <Input name="notes" />
      </Form.Item>

      <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Button type="primary" size="large" htmlType="submit" style={{ width: "240px" }}>
          Add
        </Button>
      </div>
    </Form>
  );
};
