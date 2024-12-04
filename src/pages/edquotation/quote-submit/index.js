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
      mmNumber: "",
      description: "",
      quantity: "",
      unitPrice: "",
      totalPrice: "",
      plantCode: "",
    },
    {
      mmNumber: "",
      description: "",
      quantity: "",
      unitPrice: "",
      totalPrice: "",
      plantCode: "",
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
      <Button
        color="primary"
        onClick={() => navigate(-1)} // Go back to the previous page
        style={{
          position: "absolute",
          top: "70px",
          right: "20px",
          padding: "10px 20px",
          fontSize: "16px",
          border: "none",
          outline: "none",
          boxShadow: "none",
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

      <div style={{ position: "relative" }}>
        {/* First Table - Quotation Details */}
        <div
          style={{
            fontSize: "18px",
            padding: "10px 15px",
            fontWeight: "bold",
            color: "black",
          }}
        >
          Quotation Details
        </div>

        <NeptuneAgGrid
          data={gridData} // Use gridData as the data for the grid
          dataprops={columns} // Pass column definitions for Quotation Details
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

        {/* Second Table - Implementation Costing Details */}
        <div
          style={{
            fontSize: "18px",
            padding: "10px 15px",
            fontWeight: "bold",
            color: "black",
            marginTop: "30px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>Implementation Costing Details</span>

          {/* Toggle Button for Non-Standard Quotation */}
          <div style={{ display: "flex", alignItems: "center" }}>
            <span style={{ marginRight: "10px" }}>Non-Standard Quotation</span>
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
        </div>

        {/* Always visible - Implementation Costing Details Grid */}
        <NeptuneAgGrid
          data={gridData} // Use gridData as the data for the grid
          dataprops={columns} // Pass column definitions for Implementation Costing
          gridOptions={{
            domLayout: "autoHeight",
            paginationPageSize: 10,
            rowHeight: 50,

            suppressExcelExport: true, // Disable Excel export button
            suppressCsvExport: true,
            suppressMenus: true, // Disable CSV export button
          }}
        />

        {/* Render Non-Standard Quotation Grid when the toggle is on */}
        {toggleNonStandard && (
          <>
            <div
              style={{
                fontSize: "18px",
                padding: "10px 15px",
                fontWeight: "bold",
                color: "black",
                marginTop: "30px",
              }}
            >
              Non-Standard Quotation
            </div>

            <NeptuneAgGrid
              data={gridData} // Use gridData as the data for the grid
              dataprops={columns} // Pass column definitions for Non-Standard Quotation
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
          </>
        )}
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
