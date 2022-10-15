import { Card, Table, TableProps } from "antd";
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

const onChange: TableProps<IPatient>["onChange"] = (pagination, filters, sorter, extra) => {
  console.log("params", pagination, filters, sorter, extra);
};

export const PatientsList: React.FC = () => {
  const [patients, setPatients] = useState<Array<IPatient>>([]);

  useEffect(() => {
    const fetchList = async () => {
      const data = await fetchPatients();
      setPatients(data);
    };
    fetchList();
  }, []);

  return (
    <Card>
      <Table columns={columns} dataSource={patients} onChange={onChange} />
    </Card>
  );
};
