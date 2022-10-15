import { Card, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import React, { useEffect, useState } from "react";
import { fetchPatients } from "services/patients";
import { IPatient } from "types";

const columns: ColumnsType<IPatient> = [
  {
    title: "Name",
    dataIndex: "first_name",
  },
  {
    title: "Email",
    dataIndex: "email",
  },
  {
    title: "NIC",
    dataIndex: "nic",
  },
  {
    title: "Phone",
    dataIndex: "phone",
  },
  {
    title: "Gender",
    dataIndex: "gender",
  },
  {
    title: "DOB",
    dataIndex: "dob",
  },
];

export const PatientsList: React.FC = () => {
  const [patients, setPatients] = useState<Array<IPatient>>([]);

  useEffect(() => {
    const fetchList = async () => {
      console.log("FETCH LIST RAN");
      const data = await fetchPatients();

      setPatients(data);
    };
    fetchList();
  }, []);

  return (
    <Card>
      <Table columns={columns} dataSource={patients} />
    </Card>
  );
};
