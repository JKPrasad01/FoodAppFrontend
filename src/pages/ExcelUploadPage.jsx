import React from "react";
import ExcelUploader from "./ExcelUploader";
import axios from "axios";
import { uniAPi } from "../api/uniAPi";

export default function ExcelUploadPage() {
  const handleParsedData = (data) => {
    console.log("Parsed RestaurantDTO List:", data);
    uniAPi.post(`/restaurants/list`, data);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Upload Restaurant Excel</h1>
      <ExcelUploader onDataParsed={handleParsedData} />
    </div>
  );
}
