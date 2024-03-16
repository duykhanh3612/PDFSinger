import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import UploadFile from "./UploadFile";
import VerifyFile from "./VerifyFile";

export default function DashboardRoutes() {
  return (
    <Routes>
      <Route path="/dashboard" element={<Home />} />
      <Route path="/upload-file" element={<UploadFile />} />
      <Route path="/verify-file" element={<VerifyFile />} />
    </Routes>
  );
}
