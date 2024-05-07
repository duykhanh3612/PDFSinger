import React from "react";
import { Table, Button } from "antd";
import axios from "axios";

const TableKey = ({ data, fetchData }) => {
  const userData = JSON.parse(localStorage.getItem("user")) || [];
  const token = userData.token || "";
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json", // Assuming you're sending JSON data
  };
  const renderActions = (text, record) => (
    <span>
      <Button type="link" onClick={() => handleEdit(record.signatureId)}>
        Edit
      </Button>
      <Button type="dashed" onClick={() => handleDelete(record.signatureId)}>
        Delete
      </Button>
    </span>
  );

  const renderStatus = (text, record) => (
    <Button type="primary" onClick={() => handleStatus(record.signatureId)}>
      {text}
    </Button>
  );

  const handleEdit = (record) => {
    // Xử lý chỉnh sửa
    console.log("Chỉnh sửa cho dòng:", record);
  };

  const handleDelete = (record) => {
    // Xử lý xóa
    console.log("Xóa cho dòng:", record);
  };

  const handleStatus = (record) => {
    axios
      .post(
        "http://localhost:3003/key/change-status",
        { record: record },
        {
          // Gửi record như một object có key là 'record'
          headers: headers,
        }
      )
      .then((response) => {
        console.log(response.data);
        fetchData();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const columns = [
    {
      title: "Tiêu đề",
      dataIndex: "signatureNames",
      width: 350,
    },
    {
      title: "Thuật toán mã hóa",
      dataIndex: "encryptionType",
      width: 150,
    },
    {
      title: "Ngày tạo",
      dataIndex: "created_at",
      width: 140,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: 70,
      render: renderStatus,
    },
    {
      title: "Thao tác",
      dataIndex: "operation",
      width: 160,
      render: renderActions,
    },
  ];

  return (
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
};

export default TableKey;
