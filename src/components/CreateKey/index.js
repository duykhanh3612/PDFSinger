import React, { useEffect, useState } from "react";
import Header from "../Header";
import Sidebar from "../Sidebar";
import TableKey from "../TableKey";
import { Button, Modal, Input, Radio } from "antd";
import axios from "axios";
import toast from "react-hot-toast";

const init = ["", "RSA", "DSA", "ECC", "AES-128", "AES-192", "AES-256"];

const CreateKey = () => {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [value, setValue] = useState(1);
  const [title, setTitle] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [data, setData] = useState([]);
  const userData = JSON.parse(localStorage.getItem("user")) || [];
  const token = userData.token || "";
  // Create headers object with Authorization header
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json", // Assuming you're sending JSON data
  };

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    const data = {
      title: title,
      password: password,
      confirmPassword: passwordConfirm,
      encryptionType: init[value],
    };
    axios
      .post("http://localhost:3003/key/create", data, { headers: headers })
      .then((response) => {
        // console.log("Success:", response.data);
        // Handle successful registration (e.g., redirect to user profile)
        toast.success("Registration successful! Please proceed to login.", {
          position: "top-right",
        });
        fetchData()
        // Or: window.location.href = "/user/profile"; // Redirect to profile page
      })
      .catch((error) => {
        console.error("Error:", error.response.data);
        // Handle 400 Bad Request errors specifically
        if (error.response && error.response.status === 400) {
          toast.error(error.response.data.messagec, { position: "top-right" });
        } else {
          // Handle other errors (e.g., network errors, 500 Internal Server Error)
          toast.error("An unexpected error occurred. Please try again later.", {
            position: "top-right",
          });
        }
      });
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

  const fetchData = () => {
    axios
      .get("http://localhost:3003/key/getsig", { headers: headers })
      .then((response) => {
        console.log(response.data);
        setData(response.data.signatures);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="">
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
          <Input
            value={title}
            name="title"
            onChange={(e) => setTitle(e.target.value)}
          />
          <h3>Mật khẩu của khóa</h3>
          <Input
            value={password}
            name="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <h3>Xác nhận mật khẩu</h3>
          <Input
            value={passwordConfirm}
            name="paswordConfirm"
            onChange={(e) => setPasswordConfirm(e.target.value)}
          />
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
        <TableKey data={data} fetchData={fetchData} />
      </div>
    </div>
  );
};

export default CreateKey;
