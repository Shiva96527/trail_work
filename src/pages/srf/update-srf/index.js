import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Card, CardBody, CardTitle, Button, Table } from "reactstrap";
import { toast } from "react-toastify";
import columns from "./config/columns";

const UpdateSrfEdInbox = () => {
  const { state } = useLocation();
  const [srfData, setSrfData] = useState(state || {});
  const [isUpdated, setIsUpdated] = useState(false); // Tracks if the update button was clicked

  useEffect(() => {
    if (!state) toast.error("No SRF data found!");
  }, [state]);

  const handleInputChange = (field, value) => {
    setSrfData({
      ...srfData,
      [field]: value,
    });
  };

  const handleSave = () => {
    if (!srfData.srfNumber) {
      toast.error("Please complete all required fields!");
      return;
    }

    console.log("Updated SRF Data:", srfData);
    toast.success("Data updated successfully!");
    setIsUpdated(true); // Show updated records after the button is clicked
  };

  return (
    <div
      style={{
        margin: "40px auto", // Centers the card and ensures consistent spacing
        width: "90%",
        maxWidth: "1200px", // Restricts the card's maximum width
      }}
    >
      <Card style={{ border: "none" }}> {/* Removed border from the Card */}
        {/* Title */}
        <CardTitle style={{ textAlign: "center", marginTop: "20px" }}>
          {srfData.srfNumber || "Loading..."}
        </CardTitle>

        {/* Table */}
        <CardBody style={{ padding: "0" }}> {/* Removed border from CardBody and adjusted padding */}
          <Table
            bordered // Kept the border for the table
            style={{
              marginTop: "50px",
              width: "100%",
              borderCollapse: "collapse",
              tableLayout: "fixed",
            }}
          >
            <tbody>
              {columns.map((row, rowIndex) => (
                <tr key={rowIndex} style={{ height: "60px" }}>
                  {row.map((column, cellIndex) => (
                    <>
                      {/* Key Cell */}
                      <td
                        key={`key-${cellIndex}`}
                        style={{
                          backgroundColor: "#f5f5f5",
                          fontWeight: "bold",
                          textAlign: "center",
                          verticalAlign: "middle",
                          border: "2px solid grey", // Border added here for each cell
                          padding: "10px",
                          width: "33.3%",
                        }}
                      >
                        {column.label}
                      </td>

                      {/* Value Cell */}
                      <td
                        key={`value-${cellIndex}`}
                        style={{
                          textAlign: "center",
                          verticalAlign: "middle",
                          border: "2px solid grey", // Border added here for each cell
                          padding: "10px",
                          width: "33.3%",
                        }}
                      >
                        <div
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(e) =>
                            handleInputChange(column.key, e.target.textContent.trim())
                          }
                          style={{
                            display: "inline-block",
                            width: "100%",
                            textAlign: "center",
                            outline: "none",
                          }}
                        >
                          {srfData[column.key] || ""}
                        </div>
                      </td>
                    </>
                  ))}
                </tr>
              ))}
            </tbody>
          </Table>

          {/* Update Button */}
          <div style={{ textAlign: "center", marginTop: "30px" }}>
            <Button
              color="primary"
              onClick={handleSave}
              style={{
                padding: "10px 20px",
                width: "100px",
                fontSize: "16px",
                border: "none", // Removed border
                outline: "none",
                boxShadow: "none", // Removed box-shadow
              }}
            >
              Update
            </Button>
          </div>

          {/* Display Updated Data */}
          {isUpdated && (
            <div
              style={{
                marginTop: "40px",
                textAlign: "center",
                padding: "20px",
                border: "2px solid #ddd",
                borderRadius: "8px",
                width: "80%",
                margin: "40px auto",
                backgroundColor: "#f9f9f9",
                minHeight: "50px",
              }}
            >
              <h5>Updated Record</h5>
              <p style={{ textAlign: "left", fontSize: "14px", whiteSpace: "pre-wrap" }}>
                {Object.entries(srfData)
                  .filter(([key, value]) => value) // Only show non-empty fields
                  .map(([key, value]) => `${key}: ${value}`)
                  .join(" | ")}
              </p>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default UpdateSrfEdInbox;
