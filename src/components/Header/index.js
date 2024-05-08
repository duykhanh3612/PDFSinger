import React, { useState } from "react";
import { Link } from "react-router-dom";
import Head from "./Head";
import "./header.css";

const Header = () => {
  const [click, setClick] = useState(false);

  return (
    <>
      {/* <div className="" style={{display: 'flex'}}> */}
      <Head />

      {/* </div> */}
    </>
  );
};

export default Header;
