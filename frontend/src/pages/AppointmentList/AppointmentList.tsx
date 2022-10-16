import { Button, Card, Drawer, Table, Tooltip } from "antd";
import type { ColumnsType, TableProps } from "antd/es/table";
import { CreateAppointment } from "pages/AppointmentList/components/CreateAppointment";
import React, { useEffect, useMemo, useState } from "react";
import { fetchAppointments } from "services";
import { IAppointment } from "types";
import { formatDate, SHORTENED_DATE_FORMAT } from "utils/date";
import { EditOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { Transfer } from "./components/Transfer/Transfer";

const onChange: TableProps<IAppointment>["onChange"] = (pagination, filters, sorter, extra) => {
  console.log("params", pagination, filters, sorter, extra);
};

export const AppointmentList: React.FC = () => {
  const [appointments, setAppointments] = useState<Array<IAppointment>>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<IAppointment | null>(null);

  const navigate = useNavigate();

  const columns: ColumnsType<IAppointment> = useMemo(
    () => [
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
      {
        title: "Actions",
        render: (value, record) => (
          <div className="actions" style={{ cursor: "pointer" }}>
            <span
              className="update"
              onClick={() => navigate(`/appointments/${record.id}/${record.patient.id}`)}
            >
              <Tooltip title="Update Manufacturer">
                <EditOutlined />
              </Tooltip>
            </span>
          </div>
        ),
      },
      {
        title: "Transfer",
        render: (value, record) => (
          <Button
            onClick={() => {
              setShowTransfer(true);
              setSelectedAppointment(record);
            }}
          >
            Transfer
          </Button>
        ),
      },
    ],
    // eslint-disable-next-line
    [appointments]
  );

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
      <Drawer open={showTransfer} onClose={() => setShowTransfer(false)}>
        <Transfer closeDrawer={() => setShowTransfer(false)} appointment={selectedAppointment!} />
      </Drawer>
    </Card>
  );
};
