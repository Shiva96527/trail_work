import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Card,
  CardBody,
  Button,
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionBody,
  Row,
  Col,
  FormGroup,
  Label,
  Input,
  Badge,
} from "reactstrap";
import { toast } from "react-toastify";
import columns from "./config/columns";

const Request = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  console.log("field,value", state);
  const [edData, setEdData] = useState(state || {});
  const [isUpdated, setIsUpdated] = useState(false);
  const [open, setOpen] = useState("1");

  // Hardcoded vendor options, or this could come from edData or elsewhere
  const vendorOptions = ["NEC", "Vendor1", "Vendor2", "Vendor3"];

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
    setOpen(open === id ? null : id);
  };

  const handleSRFNumberClick = () => {
    // Navigate to the SRF platform page
    navigate(`/neptune/srf/srfinbox`);
  };

  const handleServiceOrderNumberClick = () => {
    // Navigate to the Service Order platform page
    navigate(`/neptune/general/usergroupmapping`);
  };

  return (
    <div
      style={{
        margin: "40px auto",
        width: "98%",
        maxWidth: "1500px",
        position: "relative",
      }}
    >
      <Card style={{ border: "none" }}>
        <CardBody style={{ padding: "0" }}>
          {/* Accordion for all labels */}
          <Accordion open={open} toggle={toggleAccordion}>
            <AccordionItem>
              <AccordionHeader targetId="1">
                <strong>Quotation Number</strong>
                {/* Green badge with quote number */}
                {edData?.quoteNumber && (
                  <Badge color="success" style={{ marginLeft: "15px" }}>
                    {edData?.quoteNumber}
                  </Badge>
                )}
              </AccordionHeader>
              <AccordionBody accordionId="1">
                {/* Loop through columns and render inputs */}
                {columns.map((columnGroup, index) => (
                  <Row
                    key={index}
                    style={{ marginTop: index > 0 ? "20px" : "0" }}
                  >
                    {columnGroup.map((column, colIndex) => (
                      <Col md={3} key={colIndex}>
                        <FormGroup>
                          <Label for={column.key}>{column.label}</Label>
                          {column.key === "srfNumber" ? (
                            // Keep the SRF Number as an Input box, but add a clickable link behavior
                            <Input
                              name={column.key}
                              id={column.key}
                              value={edData[column.key] || ""}
                              onClick={handleSRFNumberClick}
                              readOnly
                              style={{
                                fontSize: "13px", // Ensures font size is aligned with other inputs
                                padding: "8px", // Ensures padding is consistent
                                color: "#007bff", // Link color
                                textDecoration: "underline", // Underline the link
                                border: "1px solid #ccc", // Keep consistent with other inputs
                                cursor: "pointer", // Makes it clear the input is clickable
                                textAlign: "left", // Aligns content to the left, like other inputs
                              }}
                            />
                          ) : column.key === "serviceOrderNumber" ? (
                            // Service Order Number - Displaying as a clickable input field
                            <Input
                              name={column.key}
                              id={column.key}
                              value={edData[column.key] || ""}
                              onClick={handleServiceOrderNumberClick}
                              readOnly
                              style={{
                                fontSize: "13px", // Ensures font size is aligned with other inputs
                                padding: "8px", // Ensures padding is consistent
                                color: "#007bff", // Link color
                                textDecoration: "underline", // Underline the link
                                border: "1px solid #ccc", // Keep consistent with other inputs
                                cursor: "pointer", // Makes it clear the input is clickable
                                textAlign: "left", // Aligns content to the left, like other inputs
                              }}
                            />
                          ) : column.key === "vendor" ? (
                            // Vendor Assignment as Dropdown using vendorOptions
                            <Input
                              type="select"
                              name={column.key}
                              id={column.key}
                              value={edData[column.key] || ""}
                              onChange={(e) =>
                                handleInputChange(column.key, e.target.value)
                              }
                              style={{
                                fontSize: "13px", // Ensures font size is aligned with other inputs
                                padding: "8px", // Ensures padding is consistent
                              }}
                            >
                              <option value="">Select Vendor</option>
                              {/* Dynamically populate vendor options */}
                              {vendorOptions.map((vendor, index) => (
                                <option key={index} value={vendor}>
                                  {vendor}
                                </option>
                              ))}
                            </Input>
                          ) : (
                            // Default Input for other fields
                            <Input
                              name={column.key}
                              id={column.key}
                              value={edData[column.key] || ""}
                              onChange={(e) =>
                                handleInputChange(column.key, e.target.value)
                              }
                              style={{
                                fontSize: "13px", // Ensures font size is aligned with other inputs
                                padding: "8px", // Ensures padding is consistent
                              }}
                            />
                          )}
                        </FormGroup>
                      </Col>
                    ))}
                  </Row>
                ))}

                {/* Place the "Submit to Vendor" button inside AccordionBody */}
                <div style={{ textAlign: "left", marginTop: "30px" }}>
                  <Button
                    color="primary"
                    onClick={handleSave}
                    style={{
                      padding: "10px 20px",
                      width: "160px",
                      fontSize: "16px",
                      border: "none",
                      outline: "none",
                      boxShadow: "none",
                    }}
                  >
                    Submit to vendor
                  </Button>
                </div>
              </AccordionBody>
            </AccordionItem>
          </Accordion>

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
              <p
                style={{
                  textAlign: "left",
                  fontSize: "12px",
                  whiteSpace: "pre-wrap",
                }}
              >
                {Object.entries(edData)
                  .filter(([key, value]) => value)
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

export default Request;
