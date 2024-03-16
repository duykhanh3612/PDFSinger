import React, { useState } from "react";
import { MdCloudUpload } from "react-icons/md";
import "./style.css";

const Uploader = () => {
  const [pdf, setPdf] = useState(null);
  const [fileName, setFileName] = useState("No selected file");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      setPdf(URL.createObjectURL(file));
      setFileName(file.name);
    } else {
      // Handle invalid file type here if needed
    }
  };

  return (
    <main className="main-container">
      <form>
        <label htmlFor="pdf-upload" className="upload-button">
          <input
            type="file"
            accept=".pdf"
            id="pdf-upload"
            className="input-field"
            hidden
            onChange={handleFileChange}
          />
          {pdf ? (
            <embed src={pdf} width="200" height="200" type="application/pdf" />
          ) : (
            <MdCloudUpload color="#1475cf" size={60} />
          )}
          <span>{fileName}</span>
        </label>
      </form>
    </main>
  );
};

export default Uploader;
