import { Button, Form, Select } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { BED_TYPES, ETA, FACILITIES, TRANSPORTAT_TYPES } from "constants/common";
import { useProfile } from "hooks";
import { StyledLabel } from "pages/TransferForm/components/Label";
import React from "react";
import { toast } from "react-toastify";
import { createTransfer } from "services/admission/admission";
import { IAppointment } from "types";

const { Option } = Select;

interface ITransferProps {
  closeDrawer: () => void;
  appointment: IAppointment;
}

export const Transfer = ({ closeDrawer, appointment }: ITransferProps) => {
  const [form] = Form.useForm();
  const { userState } = useProfile();
  const { user: currentUser } = userState;

  const handleSubmit = async () => {
    try {
      const data = form.getFieldsValue();

      var formdata = new FormData();
      formdata.append("appointment_id", appointment.id.toString());
      formdata.append("referral_facility_id", currentUser.facility_id);
      formdata.append("patient_id", appointment.patient.id);
      formdata.append("facility_id", data.facility_id);
      formdata.append("transportation_id", data.transportation_id);
      formdata.append("bed_type_id", data.bed_type_id);
      formdata.append("eta", data.eta);
      formdata.append("diagnostics", "1,2");
      formdata.append("notes", data.notes || "");
      await createTransfer(formdata);
      toast.success("Transfer created successfully");
      closeDrawer();
    } catch (e) {
      toast.error("Appointment creation failed");
    }
  };

  return (
    <Form form={form} onFinish={handleSubmit} style={{ minHeight: "490px" }}>
      <StyledLabel text="Facility" required={true} />
      <Form.Item
        name="facility_id"
        rules={[
          {
            required: true,
            message: "Please enter facility!",
          },
        ]}
      >
        <Select size="middle" placeholder="Please select a Facility" style={{ width: "100%" }}>
          {FACILITIES.map((facility) => (
            <Option key={facility.id} value={facility.id}>
              {facility.name}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <StyledLabel text="Transportation" required={true} />
      <Form.Item
        name="transportation_id"
        rules={[
          {
            required: true,
            message: "Please enter transportation!",
          },
        ]}
      >
        <Select size="middle" placeholder="Please select transportation" style={{ width: "100%" }}>
          {TRANSPORTAT_TYPES.map((transportation) => (
            <Option key={transportation.id} value={transportation.id}>
              {transportation.name}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <StyledLabel text="Bed Types" required={true} />
      <Form.Item
        name="bed_type_id"
        rules={[
          {
            required: true,
            message: "Please enter bed type!",
          },
        ]}
      >
        <Select size="middle" placeholder="Please select bed type" style={{ width: "100%" }}>
          {BED_TYPES.map((bedType) => (
            <Option key={bedType.id} value={bedType.id}>
              {bedType.name}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <StyledLabel text="ETA" required={true} />
      <Form.Item
        name="eta"
        rules={[
          {
            required: true,
            message: "Please enter ETA!",
          },
        ]}
      >
        <Select size="middle" placeholder="Please select ETA" style={{ width: "100%" }}>
          {ETA.map((eta) => (
            <Option key={eta.id} value={eta.name}>
              {eta.name}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <StyledLabel text="Notes" />

      <Form.Item>
        <TextArea name="notes" />
      </Form.Item>

      <Button type="primary" size="large" block htmlType="submit">
        Create Appointment
      </Button>
    </Form>
  );
};
