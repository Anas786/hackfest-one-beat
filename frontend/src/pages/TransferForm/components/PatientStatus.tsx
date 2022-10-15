import { FC, useEffect, useState } from "react";
import { Button, Form, Input, Select } from "antd";
import { StyledLabel } from "./Label";
import { IPatientStatus } from "../utils/types";
import { IBedType, ITransportationType } from "types";
import { getBedTypes, getTransportationTypes } from "services/auth/general";

const { Option } = Select;

interface PatientStatusProps {
  handleAddPatienStatus: (data: IPatientStatus) => void;
}

export const PatientStatus: FC<PatientStatusProps> = ({ handleAddPatienStatus }) => {
  const [form] = Form.useForm<IPatientStatus>();

  const [bedTypes, setBedTypes] = useState<Array<IBedType>>([]);
  const [transportationTypes, setTransportationTypes] = useState<Array<ITransportationType>>([]);

  useEffect(() => {
    (async () => {
      try {
        const [bedTypeResponse, tranportTypeResponse] = await Promise.all([
          getBedTypes(),
          getTransportationTypes(),
        ]);
        const { data: bedTypeRes } = bedTypeResponse;
        const { data: tranportTypeRes } = tranportTypeResponse;
        const { data: _bedTypes } = bedTypeRes;
        const { data: _transportTypes } = tranportTypeRes;
        setBedTypes(_bedTypes);
        setTransportationTypes(_transportTypes);
        console.log(bedTypeResponse, tranportTypeResponse);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  const handleFormSubmit = () => {
    const data = form.getFieldsValue();
    handleAddPatienStatus(data);
  };

  const handleChange = (value: any) => {
    console.log(value);
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
            <Select
              size="middle"
              placeholder="Please select bed type"
              onChange={handleChange}
              style={{ width: "100%" }}
            >
              {transportationTypes.map((transportationType) => (
                <Option key={transportationType.id} value={transportationType.name}>
                  {transportationType.name}
                </Option>
              ))}
            </Select>
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
            <Select
              size="middle"
              placeholder="Please select bed type"
              onChange={handleChange}
              style={{ width: "100%" }}
            >
              {bedTypes.map((bedType) => (
                <Option key={bedType.id} value={bedType.name}>
                  {bedType.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </div>
        <Button block type="primary" size="large" htmlType="submit">
          Next
        </Button>
      </Form>
    </div>
  );
};
