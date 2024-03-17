import React, { useState } from "react";
import Header from "../Header";
import Sidebar from "../Sidebar";
import Uploader from "../Uploader";
import { Space } from "antd";

const Encode = () => {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  return (
    <div className="grid-container">
      <Header OpenSidebar={OpenSidebar} />
      <Sidebar
        openSidebarToggle={openSidebarToggle}
        OpenSidebar={OpenSidebar}
      />
      <div className="main-container">
        <Uploader />
        <Space direction="horizontal"></Space>
      </div>
    </div>
  );
};

export default Encode;
