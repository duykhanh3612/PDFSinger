import React from "react";
import {
  BsCart3,
  BsGrid1X2Fill,
  BsFillArchiveFill,
  BsFillGrid3X3GapFill,
  BsPeopleFill,
  BsListCheck,
  BsMenuButtonWideFill,
  BsFillGearFill,
} from "react-icons/bs";

function Sidebar({ openSidebarToggle, OpenSidebar }) {
  return (
    <aside id="sidebar" className={openSidebarToggle ? "" : ""}>
      <div className="sidebar-title">
        <div className="sidebar-brand">
          <h1 style={{ color: "#eee" }}>SGU TOOL</h1>
        </div>
        <span className="icon close_icon" onClick={OpenSidebar}>
          X
        </span>
      </div>

      <ul className="sidebar-list" style={{ display: "flex" }}>
        <li className="sidebar-list-item">
          <a href="/dashboard">
            <BsGrid1X2Fill className="icon" /> Trang Chủ
          </a>
        </li>
        <li className="sidebar-list-item">
          <a href="/key">
            <BsFillArchiveFill className="icon" /> Quản lý khóa
          </a>
        </li>
        <li className="sidebar-list-item">
          <a href="encode">
            <BsFillGrid3X3GapFill className="icon" /> Mã hóa file
          </a>
        </li>
        <li className="sidebar-list-item">
          <a href="">
            <BsPeopleFill className="icon" /> Kiểm chứng file
          </a>
        </li>
      </ul>
    </aside>
  );
}

export default Sidebar;
