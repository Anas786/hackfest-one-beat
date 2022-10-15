import { Card, Table } from "antd";
import type { ColumnsType, TableProps } from "antd/es/table";
import React from "react";

interface DataType {
  key: React.Key;
  name: string;
  chinese: number;
  math: number;
  english: number;
}

const columns: ColumnsType<DataType> = [
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

const data: DataType[] = [
  {
    key: "1",
    name: "John Brown",
    chinese: 98,
    math: 60,
    english: 70,
  },
  {
    key: "2",
    name: "Jim Green",
    chinese: 98,
    math: 66,
    english: 89,
  },
  {
    key: "3",
    name: "Joe Black",
    chinese: 98,
    math: 90,
    english: 70,
  },
  {
    key: "4",
    name: "Jim Red",
    chinese: 88,
    math: 99,
    english: 89,
  },
];

const onChange: TableProps<DataType>["onChange"] = (pagination, filters, sorter, extra) => {
  console.log("params", pagination, filters, sorter, extra);
};

export const PatientsList: React.FC = () => (
  <Table columns={columns} dataSource={data} onChange={onChange} />
);
