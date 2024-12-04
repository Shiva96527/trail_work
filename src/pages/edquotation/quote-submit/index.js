import React, { useState } from "react";

import {
  Accordion,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
  Button,
  Card,
  Table,
  Badge,
  CardBody,
  CardTitle,
  Col,
  FormGroup,
  Input,
  Label,
  Row,
} from "reactstrap";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCloudUploadAlt,
  faDownload,
  faSave,
  faToggleOff,
  faToggleOn,
} from "@fortawesome/free-solid-svg-icons";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useLocation } from "react-router-dom";
import columns from "./config/columns";

const QuoteSubmitPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [quoteData, setQuoteData] = useState(state || {});
  const [isUpdated, setIsUpdated] = useState(false);
  const [accordionOpen, setAccordionOpen] = useState("1"); // Set the first accordion open by default
  const [toggleCostingDetails, setToggleCostingDetails] = useState(false); // State for toggle
  const [modalOpen, setModalOpen] = useState(false); // State for modal visibility

  // Vendor options for the dropdown
  const vendorOptions = [
    { value: "vendor1", label: "Vendor 1" },
    { value: "vendor2", label: "Vendor 2" },
    { value: "vendor3", label: "Vendor 3" },
  ];

  const handleInputChange = (field, value) => {
    setQuoteData({
      ...quoteData,
      [field]: value,
    });
  };

  const handleSave = () => {
    if (!quoteData.mmNumber) {
      toast.error("Please complete all required fields!");
      return;
    }

    console.log("Updated Quote Data:", quoteData);
    toast.success("Quote submitted successfully!");
    setIsUpdated(true);
    navigate("/quotes/inbox");
  };

  const toggleAccordion = (id) => {
    setAccordionOpen(accordionOpen === id ? null : id);
  };

  const toggleImplementationCosting = () => {
    // When toggle is clicked, show confirmation modal
    setModalOpen(true);
  };

  const handleModalConfirm = () => {
    // If user confirms, open the third accordion
    setToggleCostingDetails((prevState) => !prevState);
    setAccordionOpen("3"); // Open the "Non-Standard Quotation" accordion
    setModalOpen(false); // Close the modal
  };

  const handleModalCancel = () => {
    // If user cancels, close the modal without changing the accordion state
    setModalOpen(false);
  };

  return (
    <div style={{ margin: "40px auto", width: "98%", maxWidth: "2000px" }}>
      {/* Title Section */}
      <div
        style={{
          fontSize: "18px",
          backgroundColor: "#293897",
          color: "white",
          padding: "5px 100px",
          display: "inline-block",
          marginTop: "30px",
          marginLeft: "15px",
          borderTopLeftRadius: "10px",
          borderTopRightRadius: "10px",
          border: "none",
          boxShadow: "none",
          width: "auto",
        }}
      >
        Quotation details
        {/* Back Button positioned at the top right */}
        <Button
          color="primary"
          onClick={() => navigate(-1)} // Go back to the previous page
          style={{
            position: "absolute", // Positioning the button
            top: "70px",
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
      </div>

      <div
        style={{
          fontSize: "15px",
          padding: "10px 15px",
          color: "black",
          fontWeight: "normal",
        }}
      >
        Survey Costing details
      </div>

      {/* OA# Input Section */}
      <div
        style={{ display: "flex", alignItems: "center", marginBottom: "15px" }}
      >
        <label
          style={{
            padding: "6px 110px",
            backgroundColor: "#293897",
            color: "white",
            border: "1px solid #ddd",
            borderRadius: "0px",
            fontWeight: "bold",
            textAlign: "center",
            marginRight: "10px",
            marginLeft: "15px",
          }}
        >
          OA#
        </label>

        <Input
          type="text"
          style={{
            width: "220px",
            padding: "10px",
            marginRight: "15px",
            marginLeft: "15px",
          }}
        />

        <Button color="primary">
          <FontAwesomeIcon icon={faSave} style={{ marginRight: "8px" }} />
          Save
        </Button>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between", // Space between the left and right buttons
          marginBottom: "15px",
          width: "100%", // Ensure the div stretches across the full width
        }}
      >
        {/* Left Buttons */}
        <div style={{ display: "flex", marginLeft: "15px" }}>
          <Button
            color="primary"
            style={{
              marginRight: "10px",
              backgroundColor: "#007bff",
            }}
          >
            <FontAwesomeIcon
              icon={faDownload} // Change the icon for the second left button
              style={{ marginRight: "8px" }}
            />
            Download Template
          </Button>
          <Button
            color="primary"
            style={{
              marginRight: "10px",
              backgroundColor: "#007bff",
            }}
          >
            <FontAwesomeIcon
              icon={faCloudUploadAlt} // You can change the icon for the left button
              style={{ marginRight: "8px" }}
            />
            Upload
          </Button>
        </div>

        {/* Right Buttons */}
        <div style={{ display: "flex", marginRight: "15px" }}>
          <Button
            color="primary"
            style={{
              backgroundColor: "#007bff",
            }}
          >
            <FontAwesomeIcon icon={faDownload} style={{ marginRight: "8px" }} />
            Export
          </Button>
        </div>
      </div>

      {/* Table Section */}

      {/* Accordion Section for Quote Details and Implementation Costing Details */}
      <Card style={{ border: "none" }}>
        <CardTitle style={{ textAlign: "center", marginTop: "-20px" }}>
          {"Quote Submission"}
        </CardTitle>

        <Accordion open={accordionOpen} toggle={toggleAccordion}>
          {/* Quote Details Accordion */}
          <AccordionItem>
            <AccordionHeader targetId="1">
              <strong>Survey Costing Details</strong>&nbsp;&nbsp;
              <Badge color="success">{quoteData?.quoteNumber}</Badge>
              &nbsp;&nbsp;
              {quoteData?.assignedTo && (
                <Badge color="info">
                  {"Assigned to->" + quoteData?.assignedTo}
                </Badge>
              )}
            </AccordionHeader>
            <AccordionBody accordionId="1">
              <fieldset>
                {columns.map((row, rowIndex) => (
                  <Row key={rowIndex} style={{ marginBottom: "20px" }}>
                    {row.map(
                      (column, colIndex) =>
                        column.label && (
                          <Col md={3} key={colIndex}>
                            <FormGroup>
                              <Label for={column.key}>{column.label}</Label>
                              {column.key === "vendor" ? (
                                <Input
                                  id={column.key}
                                  type="select"
                                  value={quoteData[column.key] || ""}
                                  onChange={(e) =>
                                    handleInputChange(
                                      column.key,
                                      e.target.value
                                    )
                                  }
                                  style={{ fontSize: "13px" }}
                                >
                                  <option value=""></option>
                                  {vendorOptions.map((vendor) => (
                                    <option
                                      key={vendor.value}
                                      value={vendor.value}
                                    >
                                      {vendor.label}
                                    </option>
                                  ))}
                                </Input>
                              ) : (
                                <Input
                                  id={column.key}
                                  type="text"
                                  value={quoteData[column.key] || ""}
                                  onChange={(e) =>
                                    handleInputChange(
                                      column.key,
                                      e.target.value
                                    )
                                  }
                                  style={{ fontSize: "14px" }}
                                />
                              )}
                            </FormGroup>
                          </Col>
                        )
                    )}
                  </Row>
                ))}
              </fieldset>
            </AccordionBody>
          </AccordionItem>

          {/* Implementation Costing Details Accordion */}
          <AccordionItem>
            <AccordionHeader targetId="2">
              <strong>Implementation Costing Details</strong>

              <FontAwesomeIcon
                icon={toggleCostingDetails ? faToggleOn : faToggleOff}
                style={{ marginRight: "8px" }}
              />
            </AccordionHeader>
            <AccordionBody accordionId="2">
              {/* Content of Implementation Costing Details */}
              <fieldset>
                {columns.map((row, rowIndex) => (
                  <Row key={rowIndex} style={{ marginBottom: "20px" }}>
                    {row.map(
                      (column, colIndex) =>
                        column.label && (
                          <Col md={3} key={colIndex}>
                            <FormGroup>
                              <Label for={column.key}>{column.label}</Label>
                              {column.key === "vendor" ? (
                                <Input
                                  id={column.key}
                                  type="select"
                                  value={quoteData[column.key] || ""}
                                  onChange={(e) =>
                                    handleInputChange(
                                      column.key,
                                      e.target.value
                                    )
                                  }
                                  style={{ fontSize: "13px" }}
                                >
                                  <option value=""></option>
                                  {vendorOptions.map((vendor) => (
                                    <option
                                      key={vendor.value}
                                      value={vendor.value}
                                    >
                                      {vendor.label}
                                    </option>
                                  ))}
                                </Input>
                              ) : (
                                <Input
                                  id={column.key}
                                  type="text"
                                  value={quoteData[column.key] || ""}
                                  onChange={(e) =>
                                    handleInputChange(
                                      column.key,
                                      e.target.value
                                    )
                                  }
                                  style={{ fontSize: "14px" }}
                                />
                              )}
                            </FormGroup>
                          </Col>
                        )
                    )}
                  </Row>
                ))}
              </fieldset>
            </AccordionBody>
          </AccordionItem>

          {/* Non-Standard Quotation Accordion */}
          <AccordionItem
            style={{ display: toggleCostingDetails ? "block" : "none" }}
          >
            <AccordionHeader targetId="3">
              <strong>Non-Standard Quotation</strong>
            </AccordionHeader>
            <AccordionBody accordionId="3">
              {/* Content for Non-Standard Quotation */}
              <fieldset>
                {columns.map((row, rowIndex) => (
                  <Row key={rowIndex} style={{ marginBottom: "20px" }}>
                    {row.map(
                      (column, colIndex) =>
                        column.label && (
                          <Col md={3} key={colIndex}>
                            <FormGroup>
                              <Label for={column.key}>{column.label}</Label>
                              {column.key === "vendor" ? (
                                <Input
                                  id={column.key}
                                  type="select"
                                  value={quoteData[column.key] || ""}
                                  onChange={(e) =>
                                    handleInputChange(
                                      column.key,
                                      e.target.value
                                    )
                                  }
                                  style={{ fontSize: "13px" }}
                                >
                                  <option value=""></option>
                                  {vendorOptions.map((vendor) => (
                                    <option
                                      key={vendor.value}
                                      value={vendor.value}
                                    >
                                      {vendor.label}
                                    </option>
                                  ))}
                                </Input>
                              ) : (
                                <Input
                                  id={column.key}
                                  type="text"
                                  value={quoteData[column.key] || ""}
                                  onChange={(e) =>
                                    handleInputChange(
                                      column.key,
                                      e.target.value
                                    )
                                  }
                                  style={{ fontSize: "14px" }}
                                />
                              )}
                            </FormGroup>
                          </Col>
                        )
                    )}
                  </Row>
                ))}
              </fieldset>
            </AccordionBody>
          </AccordionItem>
        </Accordion>
      </Card>

      {/* Confirmation Modal for Implementation Costing Details */}
      <Modal isOpen={modalOpen} toggle={() => setModalOpen(!modalOpen)}>
        <ModalHeader toggle={() => setModalOpen(!modalOpen)}>
          {toggleCostingDetails ? "Disable" : "Enable"} Non-Standard Quotation
        </ModalHeader>
        <ModalBody>
          Are you sure you want to {toggleCostingDetails ? "disable" : "enable"}{" "}
          Non-Standard Quotation details?
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={handleModalCancel}>
            Cancel
          </Button>
          <Button color="primary" onClick={handleModalConfirm}>
            {toggleCostingDetails ? "Disable" : "Enable"}
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default QuoteSubmitPage;
