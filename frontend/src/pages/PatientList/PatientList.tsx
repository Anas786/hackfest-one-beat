import { Card, Table } from "antd";
import type { ColumnsType, TableProps } from "antd/es/table";
import React, { useEffect, useState } from "react";
import { fetchPatients } from "services/patients";
import { IPatient } from "types";

const columns: ColumnsType<IPatient> = [
  {
    title: "Name",
    dataIndex: "name",
  },
  {
    title: "Chinese Score",
    dataIndex: "chinese",
  },
  {
    title: "Math Score",
    dataIndex: "math",
  },
  {
    title: "English Score",
    dataIndex: "english",
  },
];

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
      <Table columns={columns} dataSource={patients} />
    </Card>
  );
};
