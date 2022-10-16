import React, { useEffect, useState } from "react";
import { Button, Card, Drawer, Table, TableProps, Tooltip, Input } from "antd";
import type { ColumnsType } from "antd/es/table";
import { Link } from "react-router-dom";
import { fetchPatients } from "services/patients";
import { IPatient } from "types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Loader } from "ui";
import { CreateUser } from "./components/CreateUser";
import * as Styled from "./styled";

const { Search } = Input;

const columns: ColumnsType<IPatient> = [
  {
    key: 1,
    title: "Name",
    dataIndex: "first_name",
  },
  {
    key: 2,
    title: "MR Number",
    dataIndex: "mr_number",
  },
  {
    key: 3,
    title: "NIC",
    dataIndex: "nic",
  },
  {
    key: 4,
    title: "Phone",
    dataIndex: "phone",
  },
  {
    key: 5,
    title: "Gender",
    dataIndex: "gender",
  },
  {
    key: 6,
    title: "DOB",
    dataIndex: "dob",
  },
  {
    key: 7,
    title: "Action",
    render: (record) => {
      const { id } = record;
      return (
        <Styled.ActionWrapper>
          <Link to={`${id}`} className="preview">
            <Tooltip title="View Patient">
              <FontAwesomeIcon icon={faEye} />
            </Tooltip>
          </Link>
          <span>
            <Tooltip title="Delete Patient">
              <FontAwesomeIcon icon={faTrash} onClick={() => console.log("Delete")} />
            </Tooltip>
          </span>
        </Styled.ActionWrapper>
      );
    },
  },
];

const onChange: TableProps<IPatient>["onChange"] = (pagination, filters, sorter, extra) => {
  console.log("params", pagination, filters, sorter, extra);
};

export const PatientsList: React.FC = () => {
  const [patients, setPatients] = useState<Array<IPatient>>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      setLoading(true);
      const fetchList = async () => {
        const data = await fetchPatients();
        setPatients(data);
      };
      fetchList();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <Card>
        <Loader />
      </Card>
    );
  }

  const onSearch = (value: string) => {
    value = value.trim();
    try {
      setLoading(true);
      const params =
        value.length === 0 ? {} : value.length === 8 ? { mr_number: value } : { nic: value };
      const fetchList = async () => {
        const data = await fetchPatients(params);
        console.log(data);
        setPatients(data);
      };
      fetchList();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div style={{ display: "flex", flexDirection: "row-reverse", gap: "10px" }}>
          <Button onClick={() => setShowAddModal(true)} style={{ height: "40px" }} type={"primary"}>Create User</Button>
          <Search placeholder="Search by MR # or CNIC #" onSearch={onSearch} style={{ maxWidth: "300px" }} enterButton="Search" size="large" />
        </div>
        <Table columns={columns} dataSource={patients} onChange={onChange} />
      </div>
      <Drawer open={showAddModal} onClose={() => setShowAddModal(false)}>
        <CreateUser closeDrawer={() => setShowAddModal(false)} />
      </Drawer>
    </Card>
  );
};
