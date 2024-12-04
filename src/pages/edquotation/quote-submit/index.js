import React, { useState, useEffect } from "react";
import {
  Button,
  Input,
  Form,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCloudUploadAlt,
  faDownload,
  faSave,
  faToggleOff,
  faToggleOn,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import NeptuneAgGrid from "../../../components/ag-grid";
import { columns } from "./config/columns";

const QuoteSubmitPage = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [gridState, setGridState] = useState(null);
  const [toggleNonStandard, setToggleNonStandard] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  // Sample data for the grids (to display default rows with inputs and buttons)
  const gridData = [
    {
      mmNumber: "56003817",
      description: "SURVEY,DESIGN,PM",
      quantity: 1.0,
      unitPrice: "1,489.36",
      totalPrice: "1.489.36",
      plantCode: "FN57",
    },
  ];

  // Define custom cell renderer for the MM# column with button and input
  const mmCellRenderer = (params) => {
    return (
      <div>
        <Button>-</Button>
        <Input
          type="text"
          value={params.value}
          onChange={(e) => params.setValue(e.target.value)}
        />
      </div>
    );
  };

  // Define custom cell renderer for the Quantity and Plant Code columns with inputs
  const inputCellRenderer = (params) => {
    return (
      <Input
        type="text"
        value={params.value}
        onChange={(e) => params.setValue(e.target.value)}
      />
    );
  };

  // Retrieve grid state from localStorage on component mount
  useEffect(() => {
    const savedState = localStorage.getItem("gridState");
    if (savedState) {
      setGridState(JSON.parse(savedState));
    }
  }, []);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  // Open the confirmation modal
  const handleToggleConfirmation = () => setModalOpen(true);

  // Handle modal cancel
  const handleModalCancel = () => setModalOpen(false);

  // Handle modal confirm
  const handleModalConfirm = () => {
    setToggleNonStandard((prev) => !prev); // Toggle the state
    setModalOpen(false); // Close the modal
  };

  return (
    <div>
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

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
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
                  icon={faDownload}
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
                  icon={faCloudUploadAlt}
                  style={{ marginRight: "8px" }}
                />
                Upload
              </Button>
            </div>
          </div>
        </Row>
      </Form>

      <div style={{ position: "relative", margin: "20px" }}>
        {/* First Table - Quotation Details */}
        <NeptuneAgGrid
          data={gridData} // Use gridData as the data for the grid
          dataprops={columns} // Pass column definitions for Quotation Details
          topActionButtons={
            <div
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                color: "black",
                alignItems: "center",
                display: "flex",
              }}
            >
              Survey Details
            </div>
          }
          gridOptions={{
            domLayout: "autoHeight",
            paginationPageSize: 10,
            rowHeight: 50,
            noRowsOverlay: "No data to show", // Override no data message
            suppressExcelExport: true, // Disable Excel export button
            suppressCsvExport: true,
            suppressMenus: true, // Disable CSV export button
          }}
          style={{
            marginTop: "-10px", // Or position: relative + top: -20px
            paddingTop: "0", // Ensure no padding is affecting positioning
          }}
        />

        {/* Always visible - Implementation Costing Details Grid */}
        <div
          style={{
            fontSize: "18px",
            marginTop: "30px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <NeptuneAgGrid
            data={gridData} // Use gridData as the data for the grid
            dataprops={columns} // Pass column definitions for Implementation Costing
            topActionButtons={
              <>
                <div
                  style={{
                    fontSize: "18px",
                    fontWeight: "bold",
                    color: "black",
                    alignItems: "center",
                    display: "flex",
                  }}
                >
                  Implementation Costing Details
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span style={{ marginRight: "10px" }}>
                    Non-Standard Quotation
                  </span>
                  <FontAwesomeIcon
                    icon={toggleNonStandard ? faToggleOn : faToggleOff}
                    style={{
                      cursor: "pointer",
                      fontSize: "30px",
                      color: "#293897",
                    }}
                    onClick={handleToggleConfirmation} // Trigger confirmation modal
                  />
                </div>
              </>
            }
            gridOptions={{
              domLayout: "autoHeight",
              paginationPageSize: 10,
              rowHeight: 50,
              suppressExcelExport: true, // Disable Excel export button
              suppressCsvExport: true,
              suppressMenus: true, // Disable CSV export button
            }}
          />
        </div>

        {/* Render Non-Standard Quotation Grid when the toggle is on */}
        {toggleNonStandard && (
          <div
            style={{
              fontSize: "18px",
              marginTop: "30px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <NeptuneAgGrid
              data={gridData} // Use gridData as the data for the grid
              dataprops={columns} // Pass column definitions for Non-Standard Quotation
              topActionButtons={
                <div
                  style={{
                    fontSize: "18px",
                    fontWeight: "bold",
                    color: "black",
                    alignItems: "center",
                    display: "flex",
                  }}
                >
                  Non-Standard Quotation
                </div>
              }
              gridOptions={{
                domLayout: "autoHeight",
                paginationPageSize: 10,
                rowHeight: 50,
                // Override no data message
                suppressExcelExport: true, // Disable Excel export button
                suppressCsvExport: true,
                suppressMenus: true, // Disable CSV export button
              }}
            />
          </div>
        )}
      </div>

      <div style={{ textAlign: "left", marginTop: "30px", marginLeft: "20px" }}>
        <Button
          color="primary"
          style={{
            padding: "10px 20px",
            width: "160px",
            fontSize: "16px",
            border: "none",
            outline: "none",
            boxShadow: "none",
          }}
        >
          Submit
        </Button>
      </div>

      {/* Confirmation Modal */}
      <Modal isOpen={modalOpen} toggle={handleModalCancel}>
        <ModalHeader toggle={handleModalCancel}>
          {toggleNonStandard ? "Disable" : "Enable"} Non-Standard Quotation
        </ModalHeader>
        <ModalBody>
          Are you sure you want to {toggleNonStandard ? "disable" : "enable"}{" "}
          the Non-Standard Quotation section?
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={handleModalCancel}>
            Cancel
          </Button>
          <Button color="primary" onClick={handleModalConfirm}>
            {toggleNonStandard ? "Disable" : "Enable"}
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default QuoteSubmitPage;
