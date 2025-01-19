import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Spinner,
  Input,
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
import {
  getDigitalQuoteDetail,
  isComponentVisible,
  isActionApplicable,
} from "../helper";
import { useNavigate, useLocation } from "react-router-dom";
import { setToggleNonStandard } from "../../../redux/slices/globalSlice.js";

const QuoteSubmitPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  // const [modalOpen, setModalOpen] = useState(false);
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
    useState(null);
  const [filteredSurveyResponseToggled, setFilteredSurveyResponseToggled] =
    useState(false);
  const [
    filteredImplementationResponseToggled,
    setFilteredImplementationResponseToggled,
  ] = useState(false);
  const [
    filteredNonStandardResponseToggled,
    setFilteredNonStandardResponseToggled,
  ] = useState(false);
  const [edData, setEdData] = useState();
  const [uploadType, setUploadType] = useState(null);

  useEffect(() => {
    dispatch(setToggleNonStandard(false)); // Use the action to toggle the state
  }, []);

  useEffect(() => {
    getQuoteDetail(
      digitalizeQuoteId || Number(sessionStorage.getItem("digitalizeQuoteId"))
    );
  }, [digitalizeQuoteId]);

  const getQuoteDetail = async (digitalizeQuoteId) => {
    const quoteDetail = await getDigitalQuoteDetail(digitalizeQuoteId);
    setEdData(quoteDetail?.quoteCreationResponse);
    setSurveyResponse(quoteDetail?.surveyResponse);
    setImplementationResponse(quoteDetail?.implementationResponse);
    setNonStandardResponse(quoteDetail?.nonStandardResponse);
    if (quoteDetail?.nonStandardResponse?.length > 0) {
      dispatch(setToggleNonStandard(true));
    }
  };

  // Open the confirmation modal
  // const handleToggleConfirmation = () => setModalOpen(true);

  // // Handle modal cancel
  // const handleModalCancel = () => setModalOpen(false);

  // // Handle modal confirm
  // const handleModalConfirm = () => {
  //   // Dispatch the toggle action to Redux store
  //   dispatch(toggleNonStandardAction()); // Use the action to toggle the state
  //   setModalOpen(false); // Close the modal
  // };

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
      type: uploadType,
      digitalizeQuoteId,
    };
    try {
      const {
        data: { statusCode, statusMessage },
      } = await bulkUploadDigitalMM(payload);
      console.log("statusCode", statusCode, statusCode === 200, statusMessage);
      if (statusCode === 200) {
        toast.success(statusMessage);
        setFilteredImplementationResponseToggled(false);
        setFilteredNonStandardResponseToggled(false);
        setFilteredSurveyResponseToggled(false);
      } else {
        toast.info(statusMessage);
      }
    } catch (e) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
      toggleExcelModal();
      getQuoteDetail(Number(sessionStorage.getItem("digitalizeQuoteId")));
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
    setUploadType(uploadType);
    if (excelModal) setFileUploaded([]);
    setExcelModal(!excelModal);
  };

  const handleSubmit = async (type) => {
    let digitalizeRequestWireframeUploadRequest;
    let payload = {
      LoginUIID: sessionStorage.getItem("uiid"),
      type,
      digitalizeQuoteId,
    };
    if (type === "survey") {
      digitalizeRequestWireframeUploadRequest =
        filteredSurveyResponse?.length > 0
          ? filteredSurveyResponse
          : surveyResponse;
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
      payload = {
        ...payload,
        nonStandardQuotationFlag: toggleNonStandard ? "Yes" : "No",
      };
    }
    payload = {
      ...payload,
      digitalizeRequestWireframeUploadRequest,
    };
    try {
      const {
        data: { statusCode, statusMessage },
      } = await postDigitalizeQuoteSubmitForApprovalorReject(payload);
      if (statusCode === 200) {
        toast.success(statusMessage);
        navigate("/neptune/edquotation/inbox");
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
    let setFilteredResponse = null;
    let response = [];
    switch (type) {
      case "survey":
        setFilteredResponse = setFilteredSurveyResponse;
        response = filteredSurveyResponseToggled
          ? filteredSurveyResponse
          : surveyResponse;
        setFilteredSurveyResponseToggled(true);
        break;
      case "implementation":
        setFilteredResponse = setFilteredImplementationResponse;
        response = filteredImplementationResponseToggled
          ? filteredImplementationResponse
          : implementationResponse;
        setFilteredImplementationResponseToggled(true);
        break;
      case "nonstandard":
        setFilteredResponse = setFilteredNonStandardResponse;
        response = filteredNonStandardResponseToggled
          ? filteredNonStandardResponse
          : nonStandardResponse;
        setFilteredNonStandardResponseToggled(true);
        break;
    }
    console.log("response", response);
    setFilteredResponse(
      response.filter((e) => {
        return e.costDetailsId !== record.costDetailsId;
      })
    );
  };
  const toggleNonStandard = useSelector(
    (state) => state.globalSlice.toggleNonStandard
  );

  const handleNonStandardChange = (e) => {
    console.log("e.target.value", e.target.value);
    const value = e.target.value;
    if (value === "Yes") {
      dispatch(setToggleNonStandard(true));
    } else {
      dispatch(setToggleNonStandard(false));
    }
  };

  return (
    <div>
      <div style={{ position: "relative", margin: "20px" }}>
        {/* First Table - Quotation Details */}
        {isComponentVisible(edData?.showPanelStatusCodes, "2") ||
        isComponentVisible(edData?.showPanelStatusCodes, "3") ? (
          <>
            <NeptuneAgGrid
              data={
                filteredSurveyResponse?.length > 0 ||
                filteredSurveyResponseToggled
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
                  {edData?.statusCode === 2 &&
                  !isActionApplicable(location?.pathname) ? (
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
            {!isActionApplicable(location?.pathname) &&
            (filteredSurveyResponseToggled
              ? filteredSurveyResponse.length > 0
                ? true
                : false
              : surveyResponse.length > 0
              ? true
              : false)
              ? submitButton(
                  handleSubmit,
                  "survey",
                  edData?.statusCode !== 2 ? true : false
                )
              : null}
          </>
        ) : null}

        {/* Always visible - Implementation Costing Details Grid */}

        {isComponentVisible(edData?.showPanelStatusCodes, "4") ||
        isComponentVisible(edData?.showPanelStatusCodes, "5") ? (
          <>
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
                  filteredImplementationResponse?.length > 0 ||
                  filteredImplementationResponseToggled
                    ? filteredImplementationResponse
                    : implementationResponse
                } // Use gridData as the data for the grid
                dataprops={columns(
                  handleAssignment,
                  "implementation",
                  edData?.statusCode
                )} // Pass column definitions for Quotation Details
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
                        {edData?.statusCode === 4 &&
                        !isActionApplicable(location?.pathname) ? (
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
            </div>
            {!isActionApplicable(location?.pathname) &&
            (filteredImplementationResponseToggled
              ? filteredImplementationResponse.length > 0
                ? true
                : false
              : implementationResponse.length > 0
              ? true
              : false)
              ? submitButton(
                  handleSubmit,
                  "implementation",
                  edData?.statusCode !== 4 &&
                    (filteredImplementationResponse || implementationResponse)
                    ? true
                    : false
                )
              : null}
            <div style={{ marginBottom: "20px" }}></div>
          </>
        ) : null}

        {/* Non-Standard Quotation Section */}
        {isComponentVisible(edData?.showPanelStatusCodes, "6") ||
        isComponentVisible(edData?.showPanelStatusCodes, "7") ? (
          <div
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              color: "black",
              alignItems: "center",
              display: "flex",
              marginBottom: "8px",
            }}
          >
            <label style={{ marginRight: "10px", fontWeight: "bold" }}>
              Non-Standard Quotation:
            </label>
            {nonStandardResponse.length <= 0 &&
            (edData?.statusCode === 6 || edData?.statusCode === 7) &&
            !isActionApplicable(location?.pathname) ? (
              <Input
                type="select"
                style={{ width: "200px" }}
                onChange={handleNonStandardChange}
                value={toggleNonStandard ? "Yes" : "No"}
              >
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </Input>
            ) : null}

            {(edData?.statusCode === 6 || edData?.statusCode === 4) &&
            !isActionApplicable(location?.pathname)
              ? toggleNonStandard && ( // Only show button if toggleNonStandard is true
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
                )
              : null}
          </div>
        ) : null}

        {/* Render Non-Standard Quotation Grid when the toggle is on */}
        {(toggleNonStandard === "Yes" ||
          isComponentVisible(edData?.showPanelStatusCodes, "6") ||
          isComponentVisible(edData?.showPanelStatusCodes, "7")) && (
          <>
            <div
              style={{
                fontSize: "18px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <NeptuneAgGrid
                data={
                  filteredNonStandardResponse?.length > 0 ||
                  filteredNonStandardResponseToggled
                    ? filteredNonStandardResponse
                    : nonStandardResponse
                } // Use gridData as the data for the grid
                dataprops={columns(
                  handleAssignment,
                  "nonstandard",
                  edData?.statusCode
                )} // Pass column definitions for Quotation Details
                // dataprops={columns} // Pass column definitions for Non-Standard Quotation

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
            </div>
            {!isActionApplicable(location?.pathname) &&
            (filteredNonStandardResponseToggled
              ? filteredNonStandardResponse.length > 0
                ? true
                : false
              : nonStandardResponse.length > 0
              ? true
              : false) ? (
              !toggleNonStandard && edData?.statusCode !== 4 ? (
                <Button
                  onClick={() => handleSubmit("nonstandard")}
                  color="primary"
                  style={{
                    padding: "10px 20px",
                    width: "250px",
                    fontSize: "16px",
                    border: "none",
                    outline: "none",
                    boxShadow: "none",
                    marginTop: "30px",
                  }}
                >
                  Update as Not Required
                </Button>
              ) : (
                submitButton(
                  handleSubmit,
                  "nonstandard",
                  edData?.statusCode !== 6 ? true : false
                )
              )
            ) : null}
          </>
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
    </div>
  );
};

export default QuoteSubmitPage;
