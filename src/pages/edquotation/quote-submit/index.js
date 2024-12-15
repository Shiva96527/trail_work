import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Spinner,
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCloudUploadAlt,
  faDownload,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import NeptuneAgGrid from "../../../components/ag-grid";
import { columns, columnsToFetch } from "./config/columns";
import { toggleNonStandard as toggleNonStandardAction } from "../../../redux/slices/globalSlice.js";
import { toast } from "react-toastify";
import { getWorkbook, populateGrid, submitButton } from "./config/helper.js";
import {
  bulkUploadDigitalMM,
  postDigitalizeQuoteSubmitForApprovalorReject,
} from "../../../services/ed-service.js";
import { useDropzone } from "react-dropzone";
import { getDigitalQuoteDetail } from "../helper";

const QuoteSubmitPage = () => {
  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = useState(false);
  const [fileUploaded, setFileUploaded] = useState([]);
  const [loading, setLoading] = useState(false);
  const [excelModal, setExcelModal] = useState(false);
  const { digitalizeQuoteId } = useSelector((state) => state?.globalSlice);
  const [surveyResponse, setSurveyResponse] = useState(null);
  const [implementationResponse, setImplementationResponse] = useState(null);
  const [nonStandardResponse, setNonStandardResponse] = useState();
  const [filteredSurveyResponse, setFilteredSurveyResponse] = useState(null);
  const [filteredImplementationResponse, setFilteredImplementationResponse] =
    useState(null);
  const [filteredNonStandardResponse, setFilteredNonStandardResponse] =
    useState();
  const [edData, setEdData] = useState();

  // useEffect(() => {
  //   getQuoteDetail(digitalizeQuoteId);
  // }, []);

  useEffect(() => {
    getQuoteDetail(digitalizeQuoteId);
  }, [digitalizeQuoteId]);

  const getQuoteDetail = async () => {
    const quoteDetail = await getDigitalQuoteDetail(digitalizeQuoteId);
    setEdData(quoteDetail?.quoteCreationResponse);
    setSurveyResponse(quoteDetail?.surveyResponse);
    setImplementationResponse(quoteDetail?.implementationResponse);
    setNonStandardResponse(quoteDetail?.nonStandardResponse);
  };

  // Get toggle state from Redux
  const toggleNonStandard = useSelector(
    (state) => state.globalSlice.toggleNonStandard
  );

  // Inline styles for the custom toggle
  const toggleStyles = {
    container: {
      display: "inline-block",
      width: "50px",
      height: "25px",
      position: "relative",
      cursor: "pointer",
    },
    input: {
      appearance: "none",
      width: "100%",
      height: "100%",
      position: "absolute",
      top: 0,
      left: 0,
      margin: 0,
      opacity: 0,
      cursor: "pointer",
    },
    slider: {
      backgroundColor: toggleNonStandard ? "#293897" : "#ccc",
      borderRadius: "25px",
      position: "relative",
      transition: "background-color 0.3s ease",
      width: "100%",
      height: "100%",
    },
    knob: {
      content: '""',
      position: "absolute",
      top: "2px",
      left: toggleNonStandard ? "25px" : "2px",
      width: "21px",
      height: "21px",
      backgroundColor: "white",
      borderRadius: "50%",
      transition: "transform 0.3s ease, left 0.3s ease",
    },
  };

  // Open the confirmation modal
  const handleToggleConfirmation = () => setModalOpen(true);

  // Handle modal cancel
  const handleModalCancel = () => setModalOpen(false);

  // Handle modal confirm
  const handleModalConfirm = () => {
    // Dispatch the toggle action to Redux store
    dispatch(toggleNonStandardAction()); // Use the action to toggle the state
    setModalOpen(false); // Close the modal
  };

  const downloadTemplate = () => {
    window.location.href = "/mm_template.xlsx";
  };

  const handleFileUploadSubmit = async () => {
    if (fileUploaded.length === 0) {
      toast.error("Please upload at least one Excel file!");
      return;
    }

    setLoading(true);
    const workbook = await getWorkbook(fileUploaded);
    const rowData = populateGrid(workbook, columnsToFetch);
    const payload = {
      LoginUIID: sessionStorage.getItem("uiid"),
      digitalizeRequestWireframeUploadRequest: rowData,
      type: "Survey",
      digitalizeQuoteId,
    };
    try {
      const {
        data: { statusCode, statusMessage },
      } = await bulkUploadDigitalMM(payload);
      console.log("statusCode", statusCode, statusCode === 200, statusMessage);
      if (statusCode === 200) {
        toast.success(statusMessage);
      } else {
        toast.info(statusMessage);
      }
    } catch (e) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
      toggleExcelModal();
      getQuoteDetail();
    }
  };

  const deleteFile = (file) => {
    setFileUploaded((prevFiles) => prevFiles.filter((f) => f !== file));
  };

  const onDrop = (acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length > 0) {
      toast.error(
        "Some files were rejected. Please upload valid Excel files (.xls or .xlsx)."
      );
    }
    // Explicitly filter out any non-Excel files
    const validFiles = acceptedFiles.filter(
      (file) => file.name.endsWith(".xls") || file.name.endsWith(".xlsx")
    );
    if (validFiles.length > 0) {
      setFileUploaded((prev) => [...prev, ...validFiles]);
    } else {
      toast.error("Only Excel files are allowed!");
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: ".xls,.xlsx", // Ensure only .xls and .xlsx files are accepted
    onDropRejected: () =>
      toast.error("Invalid file type! Only Excel files are allowed."),
  });

  const toggleExcelModal = (uploadType) => {
    setExcelModal(!excelModal);
  };

  const handleSubmit = async (type) => {
    let digitalizeRequestWireframeUploadRequest;
    console.log("type", type);
    if (type === "survey") {
      digitalizeRequestWireframeUploadRequest =
        filteredSurveyResponse?.length > 0
          ? filteredSurveyResponse
          : surveyResponse;
      console.log("first", filteredSurveyResponse, surveyResponse);
    } else if (type === "implementation") {
      digitalizeRequestWireframeUploadRequest =
        filteredImplementationResponse?.length > 0
          ? filteredImplementationResponse
          : implementationResponse;
    } else {
      digitalizeRequestWireframeUploadRequest =
        filteredNonStandardResponse?.length > 0
          ? filteredNonStandardResponse
          : nonStandardResponse;
    }
    const payload = {
      LoginUIID: sessionStorage.getItem("uiid"),
      digitalizeRequestWireframeUploadRequest,
      type,
      digitalizeQuoteId,
    };
    console.log("payload", payload);
    try {
      const {
        data: { statusCode, statusMessage },
      } = await postDigitalizeQuoteSubmitForApprovalorReject(payload);
      console.log("statusCode", statusCode, statusCode === 200, statusMessage);
      if (statusCode === 200) {
        toast.success(statusMessage);
      } else {
        toast.info(statusMessage);
      }
    } catch (e) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleAssignment = (record, type) => {
    console.log("record,type", record, type);
    let setFilteredResponse = null;
    let response = [];
    switch (type) {
      case "survey":
        setFilteredResponse = setFilteredSurveyResponse;
        response = surveyResponse;
        break;
      case "implementation":
        setFilteredResponse = setFilteredImplementationResponse;
        response = implementationResponse;
        break;
      case "nonstandard":
        setFilteredResponse = setFilteredNonStandardResponse;
        response = nonStandardResponse;
        break;
    }
    setFilteredResponse(
      response.filter((e) => {
        return e.costDetailsId !== record.costDetailsId;
      })
    );
  };

  return (
    <div>
      <div style={{ position: "relative", margin: "20px" }}>
        {/* First Table - Quotation Details */}
        {edData?.statusCode >= 2 ? (
          <>
            <NeptuneAgGrid
              data={
                filteredSurveyResponse?.length > 0
                  ? filteredSurveyResponse
                  : surveyResponse
              } // Use gridData as the data for the grid
              dataprops={columns(
                handleAssignment,
                "survey",
                edData?.statusCode
              )} // Pass column definitions for Quotation Details
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
                  {edData?.statusCode === 2 ? (
                    <Button
                      color="primary"
                      style={{
                        marginLeft: "10px",
                        backgroundColor: "#007bff",
                      }}
                      onClick={() => toggleExcelModal("survey")}
                    >
                      <FontAwesomeIcon
                        icon={faCloudUploadAlt}
                        style={{ marginRight: "8px" }}
                      />
                      Upload
                    </Button>
                  ) : null}
                </div>
              }
              exportable={false}
              gridOptions={{
                domLayout: "autoHeight",
                paginationPageSize: 10,
                rowHeight: 50,
                noRowsOverlay: "No data to show", // Override no data message
                suppressExcelExport: false, // Disable Excel export button
                suppressCsvExport: false,
                suppressMenus: true, // Disable CSV export button
              }}
              style={{
                marginTop: "-10px", // Or position: relative + top: -20px
                paddingTop: "0", // Ensure no padding is affecting positioning
              }}
            />
            {submitButton(
              handleSubmit,
              "survey",
              edData?.statusCode !== 2 ? true : false
            )}
          </>
        ) : null}

        {/* Always visible - Implementation Costing Details Grid */}

        {edData?.statusCode === 4 ? (
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
              data={
                filteredImplementationResponse?.length > 0
                  ? filteredImplementationResponse
                  : implementationResponse
              } // Use gridData as the data for the grid
              dataprops={columns(handleAssignment, "implementation")} // Pass column definitions for Quotation Details
              // dataprops={columns} // Pass column definitions for Implementation Costing
              topActionButtons={
                <>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center", // Ensure text and toggle are vertically aligned
                      fontSize: "18px",
                      fontWeight: "bold",
                      color: "black",
                    }}
                  >
                    <span>
                      Implementation Costing Details{" "}
                      {edData?.statusCode === 4 ? (
                        <Button
                          color="primary"
                          style={{
                            marginLeft: "10px",
                            backgroundColor: "#007bff",
                          }}
                          onClick={() => toggleExcelModal("implementation")}
                        >
                          <FontAwesomeIcon
                            icon={faCloudUploadAlt}
                            style={{ marginRight: "8px" }}
                          />
                          Upload
                        </Button>
                      ) : null}
                    </span>
                    <div
                      style={{
                        ...toggleStyles.container,
                        transform: "scale(0.7)", // Reduce the size of the toggle
                        marginLeft: "10px", // Add space between the text and the toggle
                      }}
                      onClick={handleToggleConfirmation}
                      title="Non-Standard Quotation" // Tooltip text
                    >
                      <input
                        type="checkbox"
                        checked={toggleNonStandard}
                        onChange={(e) => e.stopPropagation()}
                        style={toggleStyles.input}
                      />
                      <div style={toggleStyles.slider}>
                        <div style={toggleStyles.knob}></div>
                      </div>
                    </div>
                  </div>
                </>
              }
              exportable={false}
              gridOptions={{
                domLayout: "autoHeight",
                paginationPageSize: 10,
                rowHeight: 50,
                suppressExcelExport: false, // Disable Excel export button
                suppressCsvExport: false,
                suppressMenus: true, // Disable CSV export button
              }}
            />
            {submitButton(handleSubmit, "implementation")}
          </div>
        ) : null}

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
              data={
                filteredNonStandardResponse?.length > 0
                  ? filteredNonStandardResponse
                  : nonStandardResponse
              } // Use gridData as the data for the grid
              dataprops={columns(handleAssignment, "nonstandard")} // Pass column definitions for Quotation Details
              // dataprops={columns} // Pass column definitions for Non-Standard Quotation
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
                  {edData?.statusCode === 6 || edData?.statusCode === 4 ? (
                    <Button
                      color="primary"
                      style={{
                        marginLeft: "10px",
                        backgroundColor: "#007bff",
                      }}
                      onClick={() => toggleExcelModal("nonstandard")}
                    >
                      <FontAwesomeIcon
                        icon={faCloudUploadAlt}
                        style={{ marginRight: "8px" }}
                      />
                      Upload
                    </Button>
                  ) : null}
                </div>
              }
              exportable={false}
              gridOptions={{
                domLayout: "autoHeight",
                paginationPageSize: 10,
                rowHeight: 50,
                suppressExcelExport: false, // Disable Excel export button
                suppressCsvExport: false,
                suppressMenus: true, // Disable CSV export button
              }}
            />
            {submitButton(handleSubmit, "nonstandard")}
          </div>
        )}
      </div>

      <Modal isOpen={excelModal} toggle={toggleExcelModal}>
        <ModalHeader toggle={toggleExcelModal}>
          <span style={{ flex: 1, textAlign: "center" }}>BOM Upload</span>
          {/* <Button
            color="link"
            onClick={downloadTemplate}
            style={{ padding: "0", color: "#293897" }}
          >
            <FontAwesomeIcon
              icon={faDownload}
              style={{ fontSize: "18px", marginLeft: "300px" }}
            />
          </Button> */}
          <a
            onClick={downloadTemplate}
            rel="noreferrer"
            target="_blank"
            style={{ padding: "0", color: "#293897", marginLeft: "150px" }}
          >
            Download Template
          </a>
        </ModalHeader>
        <ModalBody>
          <div
            {...getRootProps()}
            style={{
              textAlign: "center",
              border: "2px dashed #ddd",
              padding: "20px",
              cursor: "pointer",
              marginBottom: "20px",
              position: "relative",
            }}
          >
            <input
              {...getInputProps()}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                opacity: 0,
              }}
            />
            <FontAwesomeIcon
              icon={faCloudUploadAlt}
              style={{ fontSize: "30px", color: "#293897" }}
            />
            <p>Click or drag files here to upload</p>
          </div>
          <ul>
            {fileUploaded.map((file, index) => (
              <li
                key={index}
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                {file.name}
                <FontAwesomeIcon
                  icon={faTrashAlt}
                  style={{ color: "red", cursor: "pointer" }}
                  onClick={() => deleteFile(file)}
                />
              </li>
            ))}
          </ul>
        </ModalBody>
        <ModalFooter>
          <Button
            color="secondary"
            onClick={toggleExcelModal}
            style={{ width: "20%" }}
          >
            Cancel
          </Button>
          <Button
            color="primary"
            onClick={handleFileUploadSubmit}
            style={{ width: "20%" }}
          >
            {loading ? <Spinner size="sm" color="light" /> : "Submit"}
          </Button>
        </ModalFooter>
      </Modal>

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
