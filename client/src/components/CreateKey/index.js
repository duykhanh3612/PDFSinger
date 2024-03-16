import React, { useState } from "react";
import Header from "../Header";
import Sidebar from "../Sidebar";
import TableKey from "../TableKey";
import { Button, Modal, Input, Radio } from "antd";

const CreateKey = () => {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [value, setValue] = useState(1);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };
  const onChange = (e) => {
    console.log("radio checked", e.target.value);
    setValue(e.target.value);
  };
  return (
    <div className="grid-container">
      <Header OpenSidebar={OpenSidebar} />
      <Sidebar
        openSidebarToggle={openSidebarToggle}
        OpenSidebar={OpenSidebar}
      />
      <div className="main-container">
        <Modal
          title=""
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <h3>Tiêu đề của khóa</h3>
          <Input />
          <h3>Mật khẩu của khóa</h3>
          <Input />
          <h3>Xác nhận mật khẩu</h3>
          <Input />
          <h3>Chọn loại mã hóa</h3>

          <Radio.Group onChange={onChange} value={value}>
            <Radio style={{ display: "block" }} value={1}>
              RSA (Rivest-Shamir-Adleman)
            </Radio>
            <Radio style={{ display: "block" }} value={2}>
              DSA (Digital Signature Algorithm)
            </Radio>
            <Radio style={{ display: "block" }} value={3}>
              Elliptic Curve Cryptography (ECC)
            </Radio>
            <Radio style={{ display: "block" }} value={4}>
              AES-Advanced Encryption Standard - 128bit
            </Radio>
            <Radio style={{ display: "block" }} value={5}>
              AES-Advanced Encryption Standard - 192bit
            </Radio>
            <Radio style={{ display: "block" }} value={6}>
              AES-Advanced Encryption Standard - 256bit
            </Radio>
          </Radio.Group>
        </Modal>
        <Button onClick={showModal} type="primary">
          Tạo khóa mới
        </Button>
        <TableKey />
      </div>
    </div>
  );
};

export default CreateKey;
