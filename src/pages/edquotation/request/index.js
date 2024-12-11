import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { updateDigitalEDQuote } from "../../../services/ed-service"; // Import the update function
import { getDigitalQuoteDetail } from "../helper";
import { useSelector } from "react-redux";

const Request = () => {
  const navigate = useNavigate();
  const [edData, setEdData] = useState();
  const { digitalizeQuoteId } = useSelector((state) => state?.globalSlice);

  // Hardcoded vendor options, or this could come from edData or elsewhere
  const vendorOptions = ["NEC", "Vendor1", "Vendor2", "Vendor3"];

  useEffect(() => {
    if (digitalizeQuoteId) {
      getQuoteDetail(digitalizeQuoteId);
    }
  }, [digitalizeQuoteId]); // Single useEffect for API call when digitalizeQuoteId changes

  const getQuoteDetail = async (id) => {
    try {
      const quoteDetail = await getDigitalQuoteDetail(id);
      setEdData(quoteDetail?.quoteCreationResponse);
    } catch (error) {
      console.error("Error fetching quote detail:", error);
    }
  };

  const handleInputChange = (field, value) => {
    setEdData({
      ...edData,
      [field]: value,
    });
  };

  const handleSave = async () => {
    if (!edData.srfNumber) {
      toast.error("Please complete all required fields!");
      return;
    }
    // Prepare payload
    const payload = {
      loginUIID: sessionStorage.getItem("uiid"), // or dynamic value
      quoteNumber: edData.quoteNumber,
      assignee: edData.assignee,
      department: edData.department,
      opportunityID: edData.opportunityID,
      fixCDS: edData.fixCDS,
      businessCaseNumber: edData.businessCaseNumber,
      srfNumber: edData.srfNumber,
      status: edData.status,
      createdDate: edData.createdDate,
      vendor: edData.vendor,
      digitalizeQuoteId: edData.digitalizeQuoteId,
    };

    try {
      const response = await updateDigitalEDQuote(payload);
      if (response.statusCode === 200) {
        toast.success("Data updated successfully!");
        navigate("/neptune/edquotation/inbox");
      } else {
        toast.error(response.statusMessage || "Failed to update the record.");
      }
    } catch (error) {
      toast.error("An error occurred while updating the data.");
      console.error("Update Error: ", error);
    }
  };

  const handleSRFNumberClick = () => {
    navigate(`/neptune/srf/srfinbox`);
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
          <Accordion open={"1"}>
            <AccordionItem>
              <AccordionHeader targetId="1">
                <strong>Quotation Number</strong>
                {edData?.quoteNumber && (
                  <Badge color="success" style={{ marginLeft: "15px" }}>
                    {edData?.quoteNumber}
                  </Badge>
                )}
                {edData?.status && (
                  <Badge color="primary" style={{ marginLeft: "15px" }}>
                    {edData?.status}
                  </Badge>
                )}
              </AccordionHeader>
              <AccordionBody accordionId="1">
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
                            <Input
                              name={column.key}
                              id={column.key}
                              defaultValue={edData && edData[column.key]}
                              onClick={handleSRFNumberClick}
                              disabled={true}
                              style={{
                                fontSize: "13px",
                                padding: "8px",
                                color: "#007bff",
                                textDecoration: "underline",
                                border: "1px solid #ccc",
                                cursor: "pointer",
                                textAlign: "left",
                              }}
                            />
                          ) : column.key === "vendor" ? (
                            <Input
                              type="select"
                              name={column.key}
                              id={column.key}
                              defaultValue={edData && edData[column.key]}
                              onChange={(e) =>
                                handleInputChange(column.key, e.target.value)
                              }
                              disabled={edData?.statusCode !== 1}
                              style={{
                                fontSize: "13px",
                                padding: "8px",
                              }}
                            >
                              <option value="">Select Vendor</option>
                              {vendorOptions.map((vendor, index) => (
                                <option key={index} value={vendor}>
                                  {vendor}
                                </option>
                              ))}
                            </Input>
                          ) : (
                            <Input
                              name={column.key}
                              id={column.key}
                              defaultValue={edData && edData[column.key]}
                              onChange={(e) =>
                                handleInputChange(column.key, e.target.value)
                              }
                              disabled={true}
                              style={{
                                fontSize: "13px",
                                padding: "8px",
                              }}
                            />
                          )}
                        </FormGroup>
                      </Col>
                    ))}
                  </Row>
                ))}
                {edData?.statusCode === 1 ? (
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
                ) : null}
              </AccordionBody>
            </AccordionItem>
          </Accordion>
        </CardBody>
      </Card>
    </div>
  );
};

export default Request;
