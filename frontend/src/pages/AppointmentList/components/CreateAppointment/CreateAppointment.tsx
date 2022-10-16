import { useEffect, useState } from "react";
import { Button, DatePicker, Form, Select, TimePicker } from "antd";
import { StyledLabel } from "pages/TransferForm/components/Label";
import { IDoctor, IPatient } from "types";
import { facilities } from "pages/TransferForm/utils/constants";
import { fetchDoctors } from "services/doctor";
import { createAppointment, fetchPatients } from "services";
import { toast } from "react-toastify";
import { getFormattedDate, getFormattedTime } from "utils/date";
const { Option } = Select;

interface ICreateAppointmentProps {
  closeDrawer: () => void;
}

export const CreateAppointment = ({ closeDrawer }: ICreateAppointmentProps) => {
  const [form] = Form.useForm();

  const [doctors, setDoctors] = useState<Array<IDoctor>>([]);
  const [patients, setPatients] = useState<Array<IPatient>>([]);

  const handleCreateAppointment = async () => {
    try {
      const { appointment_date, appointment_time, ...rest } = form.getFieldsValue();
      const parsedData = {
        ...rest,
        appointment_date: getFormattedDate(appointment_date._d),
        appointment_time: getFormattedTime(appointment_time._d),
      };
      await createAppointment(parsedData);
      toast.success("Appointment created successfully");
      closeDrawer();
    } catch (e) {
      console.log(e);
      toast.error("Appointment creation failed");
    }
  };

  useEffect(() => {
    const fetchSelecorsData = async () => {
      try {
        const doctors = await fetchDoctors();
        const patients = await fetchPatients();
        setDoctors(doctors);
        setPatients(patients);
      } catch (error) {
        console.log(error);
      }
    };
    fetchSelecorsData();
  }, []);

  return (
    <>
      <Form form={form} onFinish={handleCreateAppointment} style={{ minHeight: "490px" }}>
        <StyledLabel text="Patient" required={true} />
        <Form.Item
          name="patient_id"
          rules={[
            {
              required: true,
              message: "Please enter admitting patient!",
            },
          ]}
        >
          <Select size="middle" placeholder="Please select a Patient" style={{ width: "100%" }}>
            {patients.map((patient) => (
              <Option key={patient.id} value={patient.id}>
                {patient.first_name} {patient.last_name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <StyledLabel text="Doctor" required={true} />
        <Form.Item
          name="doctor_id"
          rules={[
            {
              required: true,
              message: "Please enter Doctor!",
            },
          ]}
        >
          <Select size="middle" placeholder="Please select doctor" style={{ width: "100%" }}>
            {doctors.map((doctor) => (
              <Option key={doctor.id} value={doctor.id}>
                {doctor.first_name} {doctor.last_name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <StyledLabel text="Facility" required={true} />
        <Form.Item
          name="facility_id"
          rules={[
            {
              required: true,
              message: "Please enter admitting hospital!",
            },
          ]}
        >
          <Select size="middle" placeholder="Please select facility" style={{ width: "100%" }}>
            {facilities.map((facility) => (
              <Option key={facility.id} value={facility.id}>
                {facility.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <StyledLabel text="Appointment Date" required={true} />
        <Form.Item
          name="appointment_date"
          rules={[
            {
              required: true,
              message: "Please enter your appointment date!",
            },
          ]}
        >
          <DatePicker style={{ width: "100%" }} name="appointment" />
        </Form.Item>

        <StyledLabel text="Appointment Time" required={true} />
        <Form.Item
          name="appointment_time"
          rules={[
            {
              required: true,
              message: "Please enter your Appointment Date!",
            },
          ]}
        >
          <TimePicker style={{ width: "100%" }} name="appointment_time" />
        </Form.Item>

        <Button type="primary" size="large" block htmlType="submit">
          Create Appointment
        </Button>
      </Form>
    </>
  );
};
