import React, { useEffect, useState } from "react";

const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbyrpOL3hzZZ3xM1IsdH_QcdbGBTfcwjIPoiB80hEO2ywjMKlbuVArpbm14pz7f_0-xGuw/exec"; // Replace with your Apps Script Web App URL

const Admin = () => {
  const [data, setData] = useState([]);
  const [editingRow, setEditingRow] = useState(null);
  const [editAmount, setEditAmount] = useState("");

  // Fetch data from Google Sheets
  const loadData = async () => {
    try {
      const res = await fetch(SCRIPT_URL);
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handle Update button click
  const handleUpdateClick = (row) => {
    setEditingRow(row.Name);
    setEditAmount(row.Amount);
  };

  // Save updated amount
  const handleSaveUpdate = async (name) => {
    const formData = new URLSearchParams();
    formData.append("Name", name);
    formData.append("Amount", editAmount);

    try {
      const res = await fetch(SCRIPT_URL, {
        method: "POST", // Apps Script will handle update logic
        body: formData,
      });
      const text = await res.text();
      alert(text);
      setEditingRow(null);
      setEditAmount("");
      loadData();
    } catch (err) {
      console.error("Error updating data:", err);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-lg border-0 rounded-4">
            <div className="card-header bg-success text-white text-center rounded-top-4">
              <h2 className="mb-0">💰 Collected Amount</h2>
            </div>

            <div className="card-footer bg-white">
              <h4 className="text-center mb-3">📊 Members Collection</h4>
              <table className="table table-bordered table-striped text-center">
                <thead className="table-success">
                  <tr>
                    <th>Name</th>
                    <th>Amount</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, idx) => (
                    <tr key={idx}>
                      <td>{row.Name}</td>
                      <td>
                        {editingRow === row.Name ? (
                          <input
                            type="number"
                            value={editAmount}
                            onChange={(e) => setEditAmount(e.target.value)}
                            className="form-control"
                          />
                        ) : (
                          row.Amount
                        )}
                      </td>
                      <td>
                        {editingRow === row.Name ? (
                          <button
                            className="btn btn-sm btn-success me-2"
                            onClick={() => handleSaveUpdate(row.Name)}
                          >
                            Save
                          </button>
                        ) : (
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => handleUpdateClick(row)}
                          >
                            Update
                          </button>
                        )}
                        {editingRow === row.Name && (
                          <button
                            className="btn btn-sm btn-secondary"
                            onClick={() => setEditingRow(null)}
                          >
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
