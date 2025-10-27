import React, { useState } from "react";
import * as XLSX from "xlsx";

export default function ExcelUploader({ onDataParsed }) {
  const [error, setError] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    // Changed to readAsArrayBuffer for modern file reading
    reader.onload = (evt) => {
      try {
        // Convert to Uint8Array from ArrayBuffer
        const data = new Uint8Array(evt.target.result);

        // Read workbook using 'array' type (changed from 'binary')
        const workbook = XLSX.read(data, { type: "array" });

        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const rawData = XLSX.utils.sheet_to_json(sheet);

        // Map Excel rows to RestaurantDTO with MenuDTO list
        const restaurantData = rawData.map((row) => ({
          restaurantId: row.restaurantId || null,
          restaurantName: row.restaurantName || "",
          restaurantProfile: row.restaurantProfile || "",
          cuisineType: row.cuisineType || "",
          restaurantAddress: row.restaurantAddress || "",
          rating: parseFloat(row.rating) || 0,
          openOrClosed: row.openOrClosed?.toString().toLowerCase() === "true",
          menuList: [
            {
              menuId: row.menuId || null,
              menuName: row.menuName || "",
              menuProfile: row.menuProfile || "",
              rating: parseFloat(row.menuRating) || 0,
              description: row.description || "",
              price: parseFloat(row.price) || 0,
            },
          ],
        }));

        // Group menus by restaurantId
        const grouped = Object.values(
          restaurantData.reduce((acc, curr) => {
            const id = curr.restaurantId;
            if (!acc[id]) {
              acc[id] = { ...curr, menuList: [] };
            }
            acc[id].menuList.push(...curr.menuList);
            return acc;
          }, {})
        );

        if (onDataParsed) onDataParsed(grouped);
      } catch (err) {
        console.error(err);
        setError("Invalid Excel format");
      }
    };

    // Changed from readAsBinaryString to readAsArrayBuffer
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="p-4 border rounded bg-white dark:bg-gray-800">
      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileUpload}
        className="mb-2"
      />
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
