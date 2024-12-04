import React, { useState } from "react";
import { Button, Input, Table, Form, FormGroup, Row } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCloudUploadAlt,
  faDownload,
  faSave,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
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
    <div>
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

      <Form className="my-4">
        <Row className="row-cols-lg-auto g-3 align-items-center m-1">
          <Input
            type="text"
            placeholder="Enter OA#"
            style={{
              width: "220px",
              padding: "10px",
              marginRight: "15px",
              marginLeft: "15px",
            }}
          />
          <Button
            color="primary"
            style={{
              marginRight: "5px",
              backgroundColor: "#007bff",
            }}
          >
            <FontAwesomeIcon icon={faSave} style={{ marginRight: "8px" }} />
            Save
          </Button>
          {/* <Button
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
          </Button> */}

          <div
            style={{
              display: "flex",
              justifyContent: "space-between", // Space between the left and right buttons
              width: "79%",
            }}
          >
            <div style={{ display: "flex" }}>
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
                <FontAwesomeIcon
                  icon={faDownload}
                  style={{ marginRight: "8px" }}
                />
                Export
              </Button>
            </div>
          </div>
        </Row>
      </Form>
      {/* Table Section */}
      <div style={{ marginTop: "20px" }}>
        {/* First Table - Quotation Details */}

        <Table
          striped
          bordered
          style={{
            borderColor: "white",
            marginLeft: "15px",
            maxWidth: "calc(100% - 30px)",
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  width: "20%",
                  backgroundColor: "#293897",
                  color: "white",
                  padding: "12px",
                }}
              >
                MM#
              </th>
              <th
                style={{
                  width: "20%",
                  backgroundColor: "#293897",
                  color: "white",
                  padding: "12px",
                }}
              >
                Description
              </th>
              <th
                style={{
                  width: "20%",
                  backgroundColor: "#293897",
                  color: "white",
                  padding: "12px",
                }}
              >
                Quantity
              </th>
              <th
                style={{
                  width: "20%",
                  backgroundColor: "#293897",
                  color: "white",
                  padding: "12px",
                }}
              >
                Unit Price
              </th>
              <th
                style={{
                  width: "20%",
                  backgroundColor: "#293897",
                  color: "white",
                  padding: "12px",
                }}
              >
                Total Price
              </th>
              <th
                style={{
                  width: "20%",
                  backgroundColor: "#293897",
                  color: "white",
                  padding: "12px",
                }}
              >
                Plant Code
              </th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td
                style={{
                  backgroundColor: "#E6F0FF",
                  padding: "12px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                {/* + and - buttons with border and background colors */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    border: "1px solid #ddd",
                    borderRadius: "5px",
                    padding: "2px",
                    width: "100%",
                  }}
                >
                  <div
                    style={{
                      width: "30px",
                      height: "23px",
                      backgroundColor: "red",
                      color: "white",
                      textAlign: "center",
                      borderRadius: "5px",
                      cursor: "pointer",
                      marginRight: "10px",
                    }}
                  >
                    -
                  </div>
                  <input
                    type="text"
                    style={{
                      padding: "1px 1px",
                      border: "1px solid #ddd",
                      borderRadius: "5px",
                      flex: 1,
                    }}
                  />
                </div>
              </td>
              <td style={{ backgroundColor: "#E6F0FF", padding: "12px" }}></td>
              <td style={{ backgroundColor: "#E6F0FF", padding: "12px" }}>
                <input
                  type="text"
                  style={{
                    padding: "1px 1px",
                    border: "1px solid #ddd",
                    borderRadius: "5px",
                    flex: 1,
                  }}
                />
              </td>
              <td style={{ backgroundColor: "#E6F0FF", padding: "12px" }}></td>
              <td style={{ backgroundColor: "#F1F9FF", padding: "12px" }}></td>
              <td style={{ backgroundColor: "#E6F0FF", padding: "12px" }}>
                <input
                  type="text"
                  style={{
                    padding: "1px 1px",
                    border: "1px solid #ddd",
                    borderRadius: "5px",
                    flex: 1,
                  }}
                />
              </td>
            </tr>
            <tr>
              <td style={{ backgroundColor: "#F1F9FF", padding: "12px" }}></td>
              <td style={{ backgroundColor: "#F1F9FF", padding: "12px" }}></td>
              <td style={{ backgroundColor: "#F1F9FF", padding: "12px" }}></td>
              <td style={{ backgroundColor: "#F1F9FF", padding: "12px" }}></td>
              <td style={{ backgroundColor: "#F1F9FF", padding: "12px" }}></td>
            </tr>
          </tbody>
        </Table>

        {/* Second Table - Implementation Costing Details */}
        <div
          style={{
            fontSize: "15px",
            padding: "10px 15px",
            fontWeight: "bold",
            color: "black",
            marginBottom: "10px",
          }}
        >
          Implementation Costing Details
        </div>
        <Table
          striped
          bordered
          style={{
            borderColor: "white",
            marginLeft: "15px",
            maxWidth: "calc(100% - 30px)",
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  width: "20%",
                  backgroundColor: "#666666",
                  color: "white",
                  padding: "12px",
                }}
              >
                MM#
              </th>
              <th
                style={{
                  width: "20%",
                  backgroundColor: "#666666",
                  color: "white",
                  padding: "12px",
                }}
              >
                Description
              </th>
              <th
                style={{
                  width: "20%",
                  backgroundColor: "#666666",
                  color: "white",
                  padding: "12px",
                }}
              >
                Quantity
              </th>
              <th
                style={{
                  width: "20%",
                  backgroundColor: "#666666",
                  color: "white",
                  padding: "12px",
                }}
              >
                Unit Price
              </th>
              <th
                style={{
                  width: "20%",
                  backgroundColor: "#666666",
                  color: "white",
                  padding: "12px",
                }}
              >
                Total Price
              </th>
              <th
                style={{
                  width: "20%",
                  backgroundColor: "#666666",
                  color: "white",
                  padding: "12px",
                }}
              >
                Plant Code
              </th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td style={{ backgroundColor: "#e0e0e0", padding: "12px" }}></td>
              <td style={{ backgroundColor: "#e0e0e0", padding: "12px" }}></td>
              <td style={{ backgroundColor: "#e0e0e0", padding: "12px" }}></td>
              <td style={{ backgroundColor: "#e0e0e0", padding: "12px" }}></td>
              <td style={{ backgroundColor: "#e0e0e0", padding: "12px" }}></td>
              <td style={{ backgroundColor: "#e0e0e0", padding: "12px" }}></td>
            </tr>
            <tr>
              <td style={{ backgroundColor: "#f0f0f0", padding: "12px" }}></td>
              <td style={{ backgroundColor: "#f0f0f0", padding: "12px" }}></td>
              <td style={{ backgroundColor: "#f0f0f0", padding: "12px" }}></td>
              <td style={{ backgroundColor: "#f0f0f0", padding: "12px" }}></td>
              <td style={{ backgroundColor: "#f0f0f0", padding: "12px" }}></td>
              <td style={{ backgroundColor: "#f0f0f0", padding: "12px" }}></td>
            </tr>
          </tbody>
        </Table>

        {/* Third Table - Non Standard Quotation */}
        <div
          style={{
            fontSize: "15px",
            padding: "10px 15px",
            fontWeight: "bold",
            color: "black",
            marginBottom: "10px",
          }}
        >
          Non Standard Quotation
        </div>
        <Table
          striped
          bordered
          style={{
            borderColor: "white",
            marginLeft: "15px",
            maxWidth: "calc(100% - 30px)",
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  width: "20%",
                  backgroundColor: "#666666",
                  color: "white",
                  padding: "12px",
                }}
              >
                MM#
              </th>
              <th
                style={{
                  width: "20%",
                  backgroundColor: "#666666",
                  color: "white",
                  padding: "12px",
                }}
              >
                Description
              </th>
              <th
                style={{
                  width: "20%",
                  backgroundColor: "#666666",
                  color: "white",
                  padding: "12px",
                }}
              >
                Quantity
              </th>
              <th
                style={{
                  width: "20%",
                  backgroundColor: "#666666",
                  color: "white",
                  padding: "12px",
                }}
              >
                Unit Price
              </th>
              <th
                style={{
                  width: "20%",
                  backgroundColor: "#666666",
                  color: "white",
                  padding: "12px",
                }}
              >
                Total Price
              </th>
              <th
                style={{
                  width: "20%",
                  backgroundColor: "#666666",
                  color: "white",
                  padding: "12px",
                }}
              >
                Plant Code
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ backgroundColor: "#e0e0e0", padding: "12px" }}></td>
              <td style={{ backgroundColor: "#e0e0e0", padding: "12px" }}></td>
              <td style={{ backgroundColor: "#e0e0e0", padding: "12px" }}></td>
              <td style={{ backgroundColor: "#e0e0e0", padding: "12px" }}></td>
              <td style={{ backgroundColor: "#e0e0e0", padding: "12px" }}></td>
              <td style={{ backgroundColor: "#e0e0e0", padding: "12px" }}></td>
            </tr>
            <tr>
              <td style={{ backgroundColor: "#f0f0f0", padding: "12px" }}></td>
              <td style={{ backgroundColor: "#f0f0f0", padding: "12px" }}></td>
              <td style={{ backgroundColor: "#f0f0f0", padding: "12px" }}></td>
              <td style={{ backgroundColor: "#f0f0f0", padding: "12px" }}></td>
              <td style={{ backgroundColor: "#f0f0f0", padding: "12px" }}></td>
              <td style={{ backgroundColor: "#f0f0f0", padding: "12px" }}></td>
            </tr>
          </tbody>
        </Table>
      </div>

      {/* Accordion Section for Quote Details and Implementation Costing Details */}
      <Card style={{ border: "none" }}>
        <CardTitle style={{ textAlign: "center", marginTop: "-20px" }}>
          {/* {"Quote Submission"} */}
        </CardTitle>

        <Accordion
          open={accordionOpen}
          toggle={toggleAccordion}
          style={{ marginTop: "20px" }}
        >
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
              <Button
                color="primary"
                onClick={toggleImplementationCosting}
                style={{
                  marginLeft: "15px",
                  padding: "5px 10px",
                  fontSize: "14px",
                }}
                data-toggle="tooltip"
                title="Non-Standard Quotation"
              >
                <FontAwesomeIcon
                  icon={toggleCostingDetails ? faToggleOn : faToggleOff}
                  style={{ marginRight: "8px" }}
                />
              </Button>
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
