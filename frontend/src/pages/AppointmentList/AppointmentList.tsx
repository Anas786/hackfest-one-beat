import { Button, Card, Drawer, Table, Tooltip } from "antd";
import type { ColumnsType, TableProps } from "antd/es/table";
import { CreateAppointment } from "pages/CreateAppointment";
import React, { useEffect, useState } from "react";
import { fetchAppointments } from "services";
import { IAppointment } from "types";
import { formatDate, SHORTENED_DATE_FORMAT } from "utils/date";

interface DataType {
  key: React.Key;
  name: string;
  chinese: number;
  math: number;
  english: number;
}

const columns: ColumnsType<IAppointment> = [
  {
    title: "Appointment Code",
    dataIndex: "code",
  },
  {
    title: "Appointment Date",
    dataIndex: "appointment_date",
    render: (value, record) => formatDate(record?.appointment_date, SHORTENED_DATE_FORMAT),
  },
  {
    title: "Appointment Time",
    dataIndex: "appointment_time",
  },
  {
    title: "Doctor Name",
    render: (value, record) =>
      (record?.doctor?.first_name || "") + " " + (record?.doctor?.last_name || ""),
  },
  {
    title: "MR Number",
    dataIndex: "patient.mr_number",
    render: (value, record) => record?.patient?.mr_number,
  },
  {
    title: "Patient Name",
    render: (value, record) =>
      (record?.patient?.first_name || "") + " " + (record?.patient?.last_name || ""),
  },
  // {
  //   title: "Actions",
  //   render: (value, record) => (
  //     <div className="actions">
  //       <span className="update" onClick={() => handleUpdateModal(record)}>
  //         <Tooltip title="Update Manufacturer">
  //           <EditOutline />
  //         </Tooltip>
  //       </span>
  //     </div>
  //   ),
  // },
];

const onChange: TableProps<IAppointment>["onChange"] = (pagination, filters, sorter, extra) => {
  console.log("params", pagination, filters, sorter, extra);
};

export const AppointmentList: React.FC = () => {
  const [appointments, setAppointments] = useState<Array<IAppointment>>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    const fetchList = async () => {
      const list = await fetchAppointments();
      setAppointments(list);
    };
    fetchList();
  }, []);

  return (
    <Card>
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div style={{ display: "flex", flexDirection: "row-reverse" }}>
          <Button onClick={() => setShowAddModal(true)}>Create Appointment</Button>
        </div>
        <Table columns={columns} dataSource={appointments} onChange={onChange} />
      </div>
      <Drawer open={showAddModal} onClose={() => setShowAddModal(false)}>
        <CreateAppointment closeDrawer={() => setShowAddModal(false)} />
      </Drawer>
    </Card>
  );
};
