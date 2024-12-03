import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardTitle, Button, Row, Col, FormGroup, Label, Input, Badge, Accordion, AccordionItem, AccordionHeader, AccordionBody } from "reactstrap";
import { toast } from "react-toastify";
import columns from "./config/columns"; // Import columns from your config

const UpdateSrfEdInbox = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [edData, setEdData] = useState(state || {});
  const [isUpdated, setIsUpdated] = useState(false);
  const [accordionOpen, setAccordionOpen] = useState("1");

  // Vendor options for the dropdown
  const vendorOptions = [
    { value: "vendor1", label: "Vendor 1" },
    { value: "vendor2", label: "Vendor 2" },
    { value: "vendor3", label: "Vendor 3" },
  ];

  useEffect(() => {
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
    setIsUpdated(true);
    navigate("/neptune/edquotation/inbox");
  };

  const toggleAccordion = (id) => {
    setAccordionOpen(accordionOpen === id ? null : id);
  };

  return (
    <div style={{ margin: "40px auto", width: "98%", maxWidth: "2000px" }}> {/* Increased width and centered */}
      <Card style={{ border: "none" }}>
        <CardTitle style={{ textAlign: "center", marginTop: "-20px" }}> {/* Title moved up */}
          {"Inbox View"}
          <Button
            color="primary"
            onClick={() => navigate(-1)} // Navigate to the previous page
            style={{
              position: "absolute",
             
              right: "20px",
              padding: "5px 10px",
              fontSize: "16px",
            }}
          >
            Back
          </Button>
        </CardTitle>

        <Accordion open={accordionOpen} toggle={toggleAccordion}>
          <AccordionItem>
            <AccordionHeader targetId="1">
              <strong>SRF Details</strong>&nbsp;&nbsp;
              <Badge color="success">{edData?.srfNumber}</Badge>&nbsp;&nbsp;
              {edData?.assignedTo && (
                <Badge color="info">{"Assigned to->" + edData?.assignedTo}</Badge>
              )}
            </AccordionHeader>
            <AccordionBody accordionId="1">
              <fieldset>
                {/* Loop through each row in columns */}
                {columns.map((row, rowIndex) => (
                  <Row key={rowIndex} style={{ marginBottom: "20px" }}>
                    {/* Loop through each column in the row */}
                    {row.map((column, colIndex) => (
                      column.label && ( // Only render if the label exists
                        <Col md={3} key={colIndex}> {/* Each column takes up 3/12 width = 4 columns per row */}
                          <FormGroup>
                            <Label for={column.key}>{column.label}</Label>
                            {column.key === "vendor" ? (
                              // Vendor dropdown with matching font size
                              <Input
                                id={column.key}
                                type="select"
                                value={edData[column.key] || ""}
                                onChange={(e) =>
                                  handleInputChange(column.key, e.target.value)
                                }
                                style={{
                                  fontSize: "13px", // Ensure font size is consistent
                                }}
                              >
                                <option value=""></option>
                                {vendorOptions.map((vendor) => (
                                  <option key={vendor.value} value={vendor.value}>
                                    {vendor.label}
                                  </option>
                                ))}
                              </Input>
                            ) : (
                              // Regular text input for other fields
                              <Input
                                id={column.key}
                                type="text"
                                value={edData[column.key] || ""}
                                onChange={(e) =>
                                  handleInputChange(column.key, e.target.value)
                                }
                                style={{
                                  fontSize: "14px", // Same font size for input fields
                                }}
                              />
                            )}
                          </FormGroup>
                        </Col>
                      )
                    ))}
                  </Row>
                ))}
              </fieldset>

              <div style={{ textAlign: "left", marginTop: "30px" }}>
                <Button
                  color="primary"
                  onClick={handleSave}
                  style={{
                    padding: "10px 20px",
                    width: "100px",
                    fontSize: "16px",
                  }}
                >
                  Update
                </Button>
              </div>
            </AccordionBody>
          </AccordionItem>
        </Accordion>
      </Card>
    </div>
  );
};

export default UpdateSrfEdInbox;
