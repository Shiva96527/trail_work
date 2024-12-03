import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Import useNavigate hook
import { Card, CardBody, CardTitle, Button, Table } from "reactstrap";
import { toast } from "react-toastify";
import columns from "./config/columns";


const UpdateSrfEdInbox = () => {
  const { state } = useLocation();
  const navigate = useNavigate(); // Initialize navigate
  const [edData, setEdData] = useState(state || {});
  const [isUpdated, setIsUpdated] = useState(false); // Tracks if the update button was clicked

  // Vendor options for the dropdown
  const vendorOptions = [
    { value: 'vendor1', label: 'Vendor 1' },
    { value: 'vendor2', label: 'Vendor 2' },
    { value: 'vendor3', label: 'Vendor 3' },
  ];

  useEffect(() => {
    console.log('state', state)
    if (!state) toast.error("No ED data found!");
  }, [state]);

  const handleInputChange = (field, value) => {
    setEdData({
      ...edData,
      [field]: value,
    });
  };

  const handleSave = () => {
    if (!edData.srfNumber) {
      toast.error("Please complete all required fields!");
      return;
    }

    console.log("Updated SRF Data:", edData);
    toast.success("Data updated successfully!");
    setIsUpdated(true); // Show updated records after the button is clicked
    navigate('/neptune/edquotation/inbox');
  };

  return (
    <div
      style={{
        margin: "40px auto", // Centers the card and ensures consistent spacing
        width: "90%",
        maxWidth: "1200px", // Restricts the card's maximum width
        position: "relative", // To position the Back button absolutely inside the div
      }}
    >
      <Card style={{ border: "none" }}> {/* Removed border from the Card */}
        {/* Title */}
        <CardTitle style={{ textAlign: "center", marginTop: "20px" }}>
          {edData.quoteNumber || "Loading..."}
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
              border: "1px solid black", // Set the table border to black
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
                          border: "1px solid black", // Black border for the table cells
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
                          border: "1px solid black", // Black border for the table cells
                          padding: "10px",
                          width: "33.3%",
                        }}
                      >
                        {column.key === 'vendor' ? (
                          // Dropdown for vendor assignment
                          <select
                            value={edData[column.key] || ''}
                            onChange={(e) =>
                              handleInputChange(column.key, e.target.value)
                            }
                            style={{
                              textAlign: "center",
                              outline: "none",
                              padding: "8px", // Increased padding for better readability
                              width: "100%",
                              border: "1px solid lightgrey", // Light grey border for dropdown
                            }}
                          >
                            <option value=""></option>
                            {vendorOptions.map((vendor) => (
                              <option key={vendor.value} value={vendor.value}>
                                {vendor.label}
                              </option>
                            ))}
                          </select>
                        ) : (
                          // Default editable input for other fields
                          <input
                            type="text"
                            value={edData[column.key] || ""}
                            onChange={(e) =>
                              handleInputChange(column.key, e.target.value)
                            }
                            style={{
                              textAlign: "center",
                              width: "100%",
                              outline: "none",
                              padding: "8px", // Increased padding for input fields
                              border: "1px solid lightgrey", // Light grey border for input fields
                            }}
                          />
                        )}
                      </td>
                    </>
                  ))}
                </tr>
              ))}
            </tbody>
          </Table>

          {/* Back Button positioned at the top right */}
          <Button
            color="primary"
            onClick={() => navigate(-1)} // Go back to the previous page
            style={{
              position: "absolute", // Positioning the button
              top: "20px",
              right: "20px",
              padding: "10px 20px",
              fontSize: "16px",
              border: "none", // Removed border
              outline: "none",
              boxShadow: "none", // Removed box-shadow
            }}
          >
            Back
          </Button>

          {/* Update Button */}
          <div style={{ textAlign: "center", marginTop: "30px" }}>
            <Button
              color="primary"
              onClick={handleSave}
              style={{
                padding: "10px 20px",
                width: "160px",
                fontSize: "16px",
                border: "none", // Removed border
                outline: "none",
                boxShadow: "none", // Removed box-shadow
              }}
            >
              Submit to vendor
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
                {Object.entries(edData)
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
