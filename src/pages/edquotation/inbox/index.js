import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  Col,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Spinner,
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faPlus,
  faFileExcel,
  faDownload,
  faTrashAlt,
  faCloudUploadAlt,
} from "@fortawesome/free-solid-svg-icons";
import NeptuneAgGrid from "../../../components/ag-grid";
import { inboxColumns } from "../config/columns";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDropzone } from "react-dropzone";
import {
  getDigitalEDQuoteGrid,
  bulkUploadDigitalEDQuote,
} from "../../../services/ed-service";
import { getWorkbook, populateGrid } from "./config/helper";
import { columnsToFetch } from "./config/columns";
import { setDigitalizeQuoteId } from "../../../redux/slices/globalSlice";
import { useDispatch } from "react-redux";

const TableComponent = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [excelModal, setExcelModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fileUploaded, setFileUploaded] = useState([]);
  const [gridData, setGridData] = useState([]);

  useEffect(() => {
    getEDQuoteList();
  }, []);

  const getEDQuoteList = async (fromModal = false) => {
    const payload = {
      type: "inbox",
      loginUIID: sessionStorage.getItem("uiid"),
    };
    try {
      const {
        data: { data: resultData, statusCode, statusMessage },
      } = await getDigitalEDQuoteGrid(payload);
      if (statusCode === 200) {
        setGridData(resultData);
        toast.success(statusMessage);
      }
    } catch (e) {
      toast.error("Something went wrong");
    }
  };

  const toggleExcelModal = () => {
    setExcelModal(!excelModal);
  };

  const handleAssignment = (row) => {
    dispatch(
      setDigitalizeQuoteId({ digitalizeQuoteId: row.digitalizeQuoteId })
    );

    // Navigate to the update page when clicking on action icons
    navigate("/neptune/edquotation/detail", {
      state: {
        quoteDetail: row,
      },
    });
  };

  const columns = inboxColumns(handleAssignment);

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

  const downloadTemplate = () => {
    window.location.href = "/bulk_creation_template.xlsx";
  };

  const handleSubmit = async () => {
    if (fileUploaded.length === 0) {
      toast.error("Please upload at least one Excel file!");
      return;
    }

    setLoading(true);
    const workbook = await getWorkbook(fileUploaded);
    const rowData = populateGrid(workbook, columnsToFetch);
    const payload = {
      LoginUIID: sessionStorage.getItem("uiid"),
      digitalizeBulkRequest: rowData,
    };
    try {
      const {
        data: { statusCode, statusMessage },
      } = await bulkUploadDigitalEDQuote(payload);
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

  const deleteFile = (file) => {
    setFileUploaded((prevFiles) => prevFiles.filter((f) => f !== file));
  };

  return (
    <>
      <Card className="card_outer_padding">
        <CardTitle>Inbox</CardTitle>
        <CardBody>
          <div className="app-inner-layout__wrapper">
            <Row>
              <Col md="12">
                <NeptuneAgGrid
                  topActionButtons={
                    <>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <div style={{ display: "inline-block" }}>
                          <Button
                            color="primary"
                            size="sm"
                            data-toggle="tooltip"
                            title="Manual Quote"
                            onClick={() =>
                              navigate("/neptune/edquotation/create-ed")
                            }
                          >
                            <FontAwesomeIcon icon={faPlus} />
                          </Button>
                          &nbsp;&nbsp;
                          <Button
                            color="success"
                            size="sm"
                            onClick={toggleExcelModal}
                            data-toggle="tooltip"
                            title="Bulk upload"
                          >
                            <FontAwesomeIcon
                              icon={faFileExcel}
                              style={{ fontSize: "15px" }}
                            />
                          </Button>
                          &nbsp;&nbsp;
                          <Button
                            color="primary"
                            size="sm"
                            data-toggle="tooltip"
                            title="Search ED"
                          >
                            <FontAwesomeIcon
                              icon={faSearch}
                              onClick={() => navigate("/neptune/ed/search")}
                            />
                          </Button>
                          &nbsp;&nbsp;
                        </div>
                      </div>
                    </>
                  }
                  data={gridData}
                  dataprops={columns}
                  paginated={true}
                  itemsPerPage={10}
                  searchable={true}
                  exportable={true}
                />
              </Col>
            </Row>
          </div>
        </CardBody>
      </Card>

      <Modal isOpen={excelModal} toggle={toggleExcelModal} fullscreen="lg">
        <ModalHeader toggle={toggleExcelModal}>
          <span style={{ flex: 1, textAlign: "center" }}>
            Bulk Quotation Upload
          </span>
          {/* <Button
            color="link"
            onClick={downloadTemplate}
            style={{ padding: "0", color: "#293897" }}
          > */}
          <a
            onClick={downloadTemplate}
            rel="noreferrer"
            target="_blank"
            style={{ padding: "0", color: "#293897", marginLeft: "60px" }}
          >
            Download Template
          </a>

          {/* <FontAwesomeIcon
              icon={faDownload}
              style={{ fontSize: "18px", marginLeft: "220px" }}
            /> */}
          {/* </Button> */}
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
            onClick={handleSubmit}
            style={{ width: "20%" }}
          >
            {loading ? <Spinner size="sm" color="light" /> : "Submit"}
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default TableComponent;
