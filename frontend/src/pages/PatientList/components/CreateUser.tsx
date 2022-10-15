import { Fragment } from "react";
import { Button, DatePicker, Form, Input, Radio } from "antd";
import { toast } from "react-toastify";
import { createPatient } from "services";
import { StyledLabel } from "pages/TransferForm/components/Label";
import { getFormattedDate } from "utils/date";
import { CreatePatientPayload } from "types";

interface ICreateUserProps {
  closeDrawer: () => void;
}

export const CreateUser = ({ closeDrawer }: ICreateUserProps) => {
  const [form] = Form.useForm<CreatePatientPayload>();

  const handleCreateUser = async () => {
    try {
      let payload = form.getFieldsValue();
      const parsedDob = getFormattedDate(payload.dob);
      payload = { ...payload, dob: parsedDob };
      const { status, message } = await createPatient(payload);
      if (status) {
        toast.success("User created successfully");
        closeDrawer();
      } else {
        toast.error(message);
      }
    } catch (e) {
      console.log(e);
      toast.error("User creation failed");
    }
  };

  return (
    <Fragment>
      <Form form={form} onFinish={handleCreateUser} style={{ minHeight: "490px" }}>
        <StyledLabel text="First Name" required={true} />
        <Form.Item
          name="first_name"
          rules={[
            {
              required: true,
              message: "Please enter patient's first name!",
            },
          ]}
        >
          <Input name="first_name" />
        </Form.Item>

        <StyledLabel text="Middle Name" />
        <Form.Item name="middle_name">
          <Input name="middle_name" />
        </Form.Item>

        <StyledLabel text="Last Name" required={true} />
        <Form.Item
          name="last_name"
          rules={[
            {
              required: true,
              message: "Please enter patient's first name!",
            },
          ]}
        >
          <Input name="last_name" />
        </Form.Item>

        <StyledLabel text="Email" />
        <Form.Item name="email">
          <Input name="email" />
        </Form.Item>

        <StyledLabel text="Phone" required={true} />
        <Form.Item
          name="phone"
          rules={[
            {
              required: true,
              message: "Please enter patient's phone!",
            },
          ]}
        >
          <Input name="phone" />
        </Form.Item>

        <StyledLabel text="CNIC" required={true} />
        <Form.Item
          name="nic"
          rules={[
            {
              required: true,
              message: "Please enter patient's CNIC #!",
            },
          ]}
        >
          <Input name="nic" />
        </Form.Item>

        <StyledLabel text="Date of Birth" required={true} />
        <Form.Item
          name="dob"
          rules={[
            {
              required: true,
              message: "Please enter your date of birth!",
            },
          ]}
        >
          <DatePicker style={{ width: "100%" }} name="dob" />
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
            <Radio name="gender" value="M">
              Male
            </Radio>
            <Radio name="gender" value="F">
              Female
            </Radio>
          </Radio.Group>
        </Form.Item>

        <StyledLabel text="Username" />
        <Form.Item name="username">
          <Input name="username" />
        </Form.Item>

        <StyledLabel text="Password" />
        <Form.Item name="password">
          <Input name="password" />
        </Form.Item>

        <Button type="primary" size="large" block htmlType="submit">
          Create Patient
        </Button>
      </Form>
    </Fragment>
  );
};
