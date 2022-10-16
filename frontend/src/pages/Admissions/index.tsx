import React, { useEffect, useState } from "react";
import { Card, Table, TableProps, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import { IAdmissions } from "types";
import { Loader } from "ui";
import { fetchAdmissions } from "services/admissions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import * as Styled from "../Admissions/styled";

const columns: ColumnsType<IAdmissions> = [
  {
    key: 1,
    title: "Name",
    dataIndex: "patient",
    render: (_, record) => record.patient.first_name + record.patient.last_name,
  },
  {
    key: 2,
    title: "MR Number",
    dataIndex: "mr_number",
    render: (_, record) => record.patient.mr_number,
  },
  {
    key: 3,
    title: "NIC",
    dataIndex: "nic",
    render: (_, record) => record.patient.nic,
  },
  {
    key: 5,
    title: "Facility",
    dataIndex: "facility",
    render: (_, record) => record.facility.name,
  },
  {
    key: 6,
    title: "Bed Type",
    dataIndex: "bed_type",
    render: (_, record) => record.bed_type.name,
  },
  {
    key: 7,
    title: "Transportation",
    dataIndex: "transportation",
    render: (_, record) => record.transportation.name,
  },
  {
    key: 4,
    title: "ETA",
    dataIndex: "eta",
    render: (_, record) => record.eta,
  },
  {
    key: 9,
    title: "Action",
    render: (record) => {
      const { patient_id } = record;
      return (
        <Styled.ActionWrapper>
          <Link to={`/patients/${patient_id}`} className="preview">
            <Tooltip title="View Details">
              <FontAwesomeIcon icon={faEye} />
            </Tooltip>
          </Link>
        </Styled.ActionWrapper>
      );
    },
  },
];

const onChange: TableProps<IAdmissions>["onChange"] = (pagination, filters, sorter, extra) => {
  console.log("params", pagination, filters, sorter, extra);
};

export const AdmissionsList: React.FC = () => {
  const [admissions, setAdmissions] = useState<Array<IAdmissions>>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      setLoading(true);
      const fetchList = async () => {
        const response = await fetchAdmissions();
        setAdmissions(response.data.data);
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

  // const onSearch = (value: string) => {
  //   value = value.trim();
  //   try {
  //     setLoading(true);
  //     const params =
  //       value.length === 0 ? {} : value.length === 8 ? { mr_number: value } : { nic: value };
  //     const fetchList = async () => {
  //       const data = await fetchPatients(params);
  //       console.log(data);
  //       setPatients(data);
  //     };
  //     fetchList();
  //   } catch (error) {
  //     console.log(error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <Card>
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div style={{ display: "flex", flexDirection: "row-reverse", gap: "10px" }}>
          {/* <Search
            placeholder="Search by MR # or CNIC #"
            allowClear
            onSearch={onSearch}
            style={{ width: "300px" }}
          /> */}
        </div>
        <Table columns={columns} dataSource={admissions} onChange={onChange} />
      </div>
    </Card>
  );
};
