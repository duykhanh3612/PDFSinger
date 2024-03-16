import React from "react";
import { Table } from "antd";
const columns = [
  {
    title: "Tiêu đề",
    dataIndex: "title",
    width: 250,
  },
  {
    title: "Thuật toán mã hóa",
    dataIndex: "algorithm",
    width: 250,
  },
  {
    title: "Ngày tạo",
    dataIndex: "created_at",
    width: 200,
  },
  { title: "Trạng thái", dataIndex: "status", width: 100 },
];

const data = [];

const TableKey = () => (
  <Table
    columns={columns}
    dataSource={data}
    pagination={{
      pageSize: 20,
    }}
    scroll={{
      y: 440,
    }}
  />
);
export default TableKey;
