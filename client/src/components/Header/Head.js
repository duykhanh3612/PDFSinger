import React from "react";

const Head = () => {
  return (
    <>
      <section className="head">
        <div
          className="container"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div className="logo">
            <h1>SGU Encrypt</h1>
            <span>ENCRYPT AND DECRYPT PDF FILES </span>
          </div>
          <div className="btnLogin">
            <a href="/login">
              <button style={{ background: "#1eb2a6", color: "#eee" }}>
                Login
              </button>
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

export default Head;
