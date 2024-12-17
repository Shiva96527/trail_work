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
import { getDropdownByTypeHTTP } from "../../../services/global-service";

const Request = () => {
  const navigate = useNavigate();
  const [edData, setEdData] = useState();
  const { digitalizeQuoteId } = useSelector((state) => state?.globalSlice);
  const [vendorDropDownList, setVendorDropDownList] = useState([]);
  const [disable, setDisable] = useState(false);

  useEffect(() => {
    getDropdownValues();
  }, []);

  useEffect(() => {
    getQuoteDetail(digitalizeQuoteId);
  }, [digitalizeQuoteId]);

  const getQuoteDetail = async () => {
    try {
      const data = await getDigitalQuoteDetail(digitalizeQuoteId);
      setEdData(data?.quoteCreationResponse);
      console.log("first", data?.quoteCreationResponse);
      if (data?.statusCode !== 200) {
        toast.info(data?.statusMessage);
        setDisableStatus(data?.quoteCreationResponse);
      }
    } catch (e) {
      toast.error("Something went wrong");
    }
  };

  const setDisableStatus = (quote) => {
    if (quote.statusCode === 1) {
      setDisable(false);
      return;
    } else if (
      (quote.statusCode === 2 || quote.statusCode === 3) &&
      quote.enableVendorAssignment === "Yes"
    ) {
      setDisable(false);
      return;
    } else {
      setDisable(true);
    }
  };

  const getDropdownValues = async () => {
    try {
      const {
        data: { data: resultData, statusCode, statusMessage },
      } = await getDropdownByTypeHTTP({
        DropDownType: "EDVendorName",
        LoginUIID: sessionStorage.getItem("uiid"),
      });
      if (statusCode === 200) {
        const dropdowns = resultData?.reduce((acc, data) => {
          acc[data?.DropDownType] = {
            DDId: data?.DDId,
            dropdownType: data?.DropDownType,
            dropdownValue: data?.DropDownValue?.split(","),
          };
          return acc;
        }, {});
        setVendorDropDownList(dropdowns?.EDVendorName?.dropdownValue);
      } else {
        toast.error(statusMessage);
      }
    } catch (e) {
      toast.error("System error.");
    }
  };

  const handleInputChange = (field, value) => {
    setEdData({
      ...edData,
      [field]: value,
    });
  };

  const handleSave = async () => {
    if (!edData.vendor) {
      toast.error("Please complete vendor assignment!");
      return;
    }
    const type =
      edData.enableVendorAssignment === "Yes" && edData.statusCode === 2
        ? "vendorupdate"
        : "vendorsubmit";
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
      type,
    };
    try {
      // Call the updateDigitalEDQuote API
      const data = await updateDigitalEDQuote(payload);
      const {
        data: { statusCode, statusMessage },
      } = data;
      if (statusCode == 200) {
        toast.success(statusMessage);
        navigate("/neptune/edquotation/inbox");
      } else {
        toast.error(statusMessage || "Failed to update the record.");
      }
    } catch (error) {
      toast.error("An error occurred while updating the data.");
      console.error("Update Error: ", error);
    }
  };

  const handleSRFNumberClick = () => {
    console.log("clicked");
    // Navigate to the SRF platform page
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
          {/* Accordion for all labels */}
          <Accordion open={"1"} toggle={() => {}}>
            <AccordionItem>
              <AccordionHeader targetId="1">
                <strong>Quotation Number</strong>
                {/* Green badge with quote number */}
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
                              defaultValue={
                                (edData && edData[column.key]) || ""
                              }
                              onClick={handleSRFNumberClick}
                              disabled={true}
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
                            // Vendor Assignment as Dropdown using vendorDropDownList
                            <Input
                              type="select"
                              name={column.key}
                              id={column.key}
                              defaultValue={
                                (edData && edData[column.key]) || ""
                              }
                              value={edData && edData[column.key]}
                              onChange={(e) =>
                                handleInputChange(column.key, e.target.value)
                              }
                              disabled={disable}
                              style={{
                                fontSize: "13px", // Ensures font size is aligned with other inputs
                                padding: "8px", // Ensures padding is consistent
                              }}
                            >
                              <option value="">Select Vendor</option>
                              {/* Dynamically populate vendor options */}
                              {vendorDropDownList.map((vendor, index) => (
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
                              defaultValue={
                                (edData && edData[column.key]) || ""
                              }
                              onChange={(e) =>
                                handleInputChange(column.key, e.target.value)
                              }
                              disabled={true}
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
                {!disable ? (
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
                      disabled={disable}
                    >
                      Submit to Vendor
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
