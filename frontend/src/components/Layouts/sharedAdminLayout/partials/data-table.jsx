import React from "react";
import { Tooltip, Progress, Table, Tag, Space } from "antd";
function AdminDataTable({ data, columns, pagination }) {
  console.log(pagination, data);
  return (
    <div className="ant-list-box table-responsive">
      <Table
        columns={columns}
        dataSource={data}
        pagination={{ ...pagination }}
      />
    </div>
  );
}

export default AdminDataTable;
