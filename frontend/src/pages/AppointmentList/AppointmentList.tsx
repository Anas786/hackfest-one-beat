import { Card, Table } from "antd";
import type { ColumnsType, TableProps } from "antd/es/table";
import React, { useEffect, useState } from "react";
import { fetchAppointments } from "services";
import { IAppointments } from "types";

interface DataType {
  key: React.Key;
  name: string;
  chinese: number;
  math: number;
  english: number;
}

const columns: ColumnsType<IAppointments> = [
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

const onChange: TableProps<IAppointments>["onChange"] = (pagination, filters, sorter, extra) => {
  console.log("params", pagination, filters, sorter, extra);
};

export const AppointmentList: React.FC = () => {
  const [appointments, setAppointments] = useState<Array<IAppointments>>([]);

  useEffect(() => {
    const fetchList = async () => {
      const list = await fetchAppointments();
      setAppointments(list);
    };
    fetchList();
  }, []);

  return (
    <Card>
      <Table columns={columns} dataSource={appointments} onChange={onChange} />
    </Card>
  );
};
