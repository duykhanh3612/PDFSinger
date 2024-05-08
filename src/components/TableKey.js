import React, { useState } from "react";
import { Table, Button, Input } from "antd";
import axios from "axios";
import toast from "react-hot-toast";
import { Modal } from "antd";

const TableKey = ({ data, fetchData }) => {
  const userData = JSON.parse(localStorage.getItem("user")) || [];
  const token = userData.token || "";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [currentRecord, setCurrentRecord] = useState("");
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json", // Assuming you're sending JSON data
  };

  const showModal = (record) => {
    setCurrentRecord(record);
    setIsModalOpen(true);
  };

  const handleOk = () => {
    axios
      .patch(
        "http://localhost:3003/key/edit-title",
        { record: currentRecord, newTitle: newTitle },
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

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const renderActions = (text, record) => (
    <span>
      <Button type="link" onClick={() => showModal(record.signatureId)}>
        Edit
      </Button>
      <Button
        type="dashed"
        danger
        onClick={() => handleDelete(record.signatureId)}
      >
        Delete
      </Button>
    </span>
  );

  const renderStatus = (text, record) => (
    <Button
      type="primary"
      danger={text === "inactive"}
      onClick={() => handleStatus(record.signatureId)}
    >
      {text}
    </Button>
  );

  const handleEdit = (record) => {};

  const handleDelete = (record) => {
    axios
      .post(
        "http://localhost:3003/key/delete-key",
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
  // Hàm gọi API để cập nhật dữ liệu
  const callUpdateApi = (newTitle) => {
    // Gọi API và trả về một Promise
    // Thực hiện các thao tác cập nhật dữ liệu ở đây, ví dụ:
    return fetch("your_update_api_url", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ newTitle }), // Truyền dữ liệu mới cho BE
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
    <>
      <Modal
        title="Edit Title"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <br />
        <Input
          name="newTitle"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
      </Modal>
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
    </>
  );
};

export default TableKey;
