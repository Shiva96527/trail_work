import React, { useState } from "react";
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
  faCheckCircle,
  faClipboardCheck,
} from "@fortawesome/free-solid-svg-icons";
import NeptuneAgGrid from "../../../components/ag-grid";
import { inboxColumns } from "../config/columns";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDropzone } from "react-dropzone";

const dummyData = [
  {
    quoteNumber: "QT_01/2024/06/01",
    assignee: "Prem01",
    department: "NETWORK ROLLOUT",
    opportunityID: "OPP_104569",
    serviceOrderNumber: "99345765234",
    fixCDS: "3423113",
    businessCaseNumber: "BC2400693",
    srfNumber: "SRF32727_D_MOBILE",
    status: "Vendor Assignment",
    createdDate: "4/3/2024",
    createdBy: "Shiva",
    vendor: "NEC",
  },
  {
    quoteNumber: "QT_02/2024/06/02",
    assignee: "Prem02",
    department: "NETWORK ROLLOUT",
    opportunityID: "OPP_104580",
    serviceOrderNumber: "99345765143",
    fixCDS: "3425113",
    businessCaseNumber: "BC2400793",
    srfNumber: "SRF32727_S_MOBILE",
    status: "Vendor Assignment",
    createdDate: "6/3/2024",
    createdBy: "PREM",
    vendor: "NEC",
  },
  {
    quoteNumber: "QT_03/2024/06/03",
    assignee: "Prem03",
    department: "NETWORK ROLLOUT",
    opportunityID: "OPP_104580",
    serviceOrderNumber: "99345765143",
    fixCDS: "3425113",
    businessCaseNumber: "BC2400793",
    srfNumber: "SRF32727_S_MOBILE3",
    status: "Vendor Assignment",
    createdDate: "6/3/2024",
    createdBy: "PREM",
    vendor: "NEC",
  },
];

const TableComponent = () => {
  const navigate = useNavigate();
  const [excelModal, setExcelModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fileUploaded, setFileUploaded] = useState([]);

  const toggleExcelModal = () => {
    setExcelModal(!excelModal);
  };

  const handleAssignment = (row, actionType) => {
    console.log("Action type:", actionType, "for row:", row);

    // Navigate to the update page when clicking on action icons
    if (actionType === "others" || actionType === "move") {
      navigate(`/neptune/srf/update-srf-ed-inbox/${row.srfNumber}`, {
        state: {
          srfNumber: row.srfNumber,
          assignee: row.assignee,
          opportunityID: row.opportunityID,
          serviceOrderNumber: row.serviceOrderNumber,
          fixCDS: row.fixCDS,
          businessCaseNumber: row.businessCaseNumber,
          status: row.status,
          department: row.department,
          vendor: row.vendor,
        },
      });
    }
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
    window.location.href = "/sample_template.xls";
  };

  const convertFileToBytes = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const arrayBuffer = reader.result;
        const byteArray = new Uint8Array(arrayBuffer);
        resolve(byteArray);
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsArrayBuffer(file);
    });
  };

  const handleSubmit = async () => {
    if (fileUploaded.length === 0) {
      toast.error("Please upload at least one Excel file!");
      return;
    }

    setLoading(true);

    try {
      console.log("Uploaded Files:", fileUploaded);

      const fileBytesArray = await Promise.all(
        fileUploaded.map((file) => convertFileToBytes(file))
      );

      console.log("Converted Byte Arrays:", fileBytesArray);

      const payload = fileBytesArray.map((bytes, index) => ({
        fileName: fileUploaded[index].name,
        fileBytes: bytes,
      }));

      console.log("Payload with bytes:", payload);

      setTimeout(() => {
        setLoading(false);
        toast.success("File uploaded successfully!");
        setFileUploaded([]);
        setExcelModal(false);
      }, 2000);
    } catch (error) {
      setLoading(false);
      toast.error("Failed to process files. Please try again.");
      console.error("Error processing files:", error);
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
                            onClick={() =>
                              navigate("/neptune/srf/create-srf-ed-inbox")
                            }
                          >
                            <FontAwesomeIcon icon={faPlus} />
                          </Button>
                          &nbsp;&nbsp;
                          <Button color="primary" size="sm">
                            <FontAwesomeIcon
                              icon={faSearch}
                              onClick={() => navigate("/neptune/ed/search")}
                            />
                          </Button>
                          &nbsp;&nbsp;
                          <Button
                            color="success"
                            size="sm"
                            onClick={toggleExcelModal}
                          >
                            <FontAwesomeIcon
                              icon={faFileExcel}
                              style={{ fontSize: "15px" }}
                            />
                          </Button>
                          &nbsp;&nbsp;
                          {/* Additional Submit Icons */}
                          <Button
                            color="secondary"
                            size="sm"
                            onClick={() => navigate("/neptune/srf/quotesubmit")}
                          >
                            <FontAwesomeIcon
                              icon={faCheckCircle}
                              style={{ fontSize: "15px" }}
                            />
                          </Button>
                          &nbsp;&nbsp;
                          <Button
                            color="danger"
                            size="sm"
                            onClick={() => navigate("/neptune/srf/quotereview")}
                          >
                            <FontAwesomeIcon
                              icon={faClipboardCheck}
                              style={{ fontSize: "15px" }}
                            />
                          </Button>
                          &nbsp;&nbsp;
                        </div>
                      </div>
                    </>
                  }
                  data={dummyData}
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

      <Modal isOpen={excelModal} toggle={toggleExcelModal}>
        <ModalHeader toggle={toggleExcelModal}>
          <span style={{ flex: 1, textAlign: "center" }}>Bulk Upload</span>
          <Button
            color="link"
            onClick={downloadTemplate}
            style={{ padding: "0", color: "#293897" }}
          >
            <FontAwesomeIcon
              icon={faDownload}
              style={{ fontSize: "18px", marginLeft: "300px" }}
            />
          </Button>
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
