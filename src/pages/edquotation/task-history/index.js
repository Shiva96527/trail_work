import React, { useState } from "react";
import { 
    Button, Card, CardBody, CardTitle, Col, Row, 
    Modal, ModalHeader, ModalBody, ModalFooter, Spinner 
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faFileExcel, faDownload, faTrashAlt, faCloudUploadAlt } from "@fortawesome/free-solid-svg-icons";
import NeptuneAgGrid from "../../../components/ag-grid";
import { inboxColumns } from "./config.js/columns";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDropzone } from "react-dropzone";


// Dummy data
const dummyData = [
    {
        srfNumber: "SRF_QT_01/2024/06/01",
        status: "Vendor Assignment",
        department: "NETWORK ROLLOUT",
        vertical: "Mobile",
        groupName: "Network Ops",
        requestor: "Prem",
        createdDate: "2024-06-01",
        approvedBy: "Manager",
        approvedDate: "2024-06-02",
    },
    {
        srfNumber: "SRF_QT_02/2024/06/02",
        status: "Assigned",
        department: "IT Operations",
        vertical: "Enterprise",
        groupName: "IT Ops",
        requestor: "Shiva",
        createdDate: "2024-06-02",
        approvedBy: "Team Lead",
        approvedDate: "2024-06-03",
    },
];

const TableComponent = () => {
    const navigate = useNavigate();
    const [excelModal, setExcelModal] = useState(false);
    const [loading, setLoading] = useState(false); // Loading state for submit
    const [fileUploaded, setFileUploaded] = useState([]); // State for uploaded files

    const toggleExcelModal = () => {
        setExcelModal(!excelModal);
    };

    const columns = inboxColumns(); // Assuming you have the correct columns function

    // Handle file drop event for bulk upload
    const onDrop = (acceptedFiles, rejectedFiles) => {
        if (rejectedFiles.length > 0) {
            toast.error('Some files were rejected. Please upload valid Excel files.');
        }
        setFileUploaded((prev) => [...prev, ...acceptedFiles]);
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: [
            '.xls',
            '.xlsx',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ],
    });

    // Function to download the template
    const downloadTemplate = () => {
        window.location.href = "/sample_template.xls";
    };

    // Function to handle file conversion to bytes
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

    // Function to handle file upload submission
    const handleSubmit = async () => {
        if (fileUploaded.length === 0) {
            toast.error('Please upload at least one Excel file!');
            return;
        }

        setLoading(true);

        try {
            // Log the uploaded files for debugging
            console.log('Uploaded Files:', fileUploaded);

            // Convert each file to bytes
            const fileBytesArray = await Promise.all(
                fileUploaded.map((file) => convertFileToBytes(file))
            );

            // Log the byte arrays to check the conversion
            console.log('Converted Byte Arrays:', fileBytesArray);

            // Store bytes in a payload object
            const payload = fileBytesArray.map((bytes, index) => ({
                fileName: fileUploaded[index].name,
                fileBytes: bytes,
            }));

            // Log the payload to the console
            console.log('Payload with bytes:', payload); // Logs the payload with filenames and byte arrays

            // Simulate API call
            setTimeout(() => {
                setLoading(false);
                toast.success('Files uploaded successfully!');
                setFileUploaded([]); 
                setExcelModal(false); // Close modal after submission
            }, 2000);
        } catch (error) {
            setLoading(false);
            toast.error('Failed to process files. Please try again.');
            console.error('Error processing files:', error);
        }
    };

    // Function to delete a file from the uploaded list
    const deleteFile = (file) => {
        setFileUploaded(prevFiles => prevFiles.filter(f => f !== file));
    };

    return (
        <>
        <Card className="card_outer_padding">
            <CardTitle>Task History</CardTitle>
            <CardBody>
                <div className="app-inner-layout__wrapper">
                    <Row>
                        <Col md="12">
                            <NeptuneAgGrid
                                topActionButtons={<>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <div style={{ display: 'inline-block' }}>
                                            <Button color="primary" size="sm" onClick={() => navigate('/neptune/srf/createsrf')}>
                                                <FontAwesomeIcon icon={faPlus} />
                                            </Button>&nbsp;&nbsp;
                                            <Button color="success" size="sm" onClick={toggleExcelModal}>
                                                <FontAwesomeIcon icon={faFileExcel} style={{ fontSize: '15px' }}/>
                                            </Button>&nbsp;&nbsp;
                                        </div>
                                    </div>
                                </>}
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

        {/* Excel Upload Modal */}
        <Modal isOpen={excelModal} toggle={toggleExcelModal}>
            <ModalHeader toggle={toggleExcelModal}>
                <span style={{ flex: 1, textAlign: 'center' }}>Bulk Upload</span>
                <Button color="link" onClick={downloadTemplate} style={{ padding: '0' , color: '#293897'}}>
                    <FontAwesomeIcon icon={faDownload} style={{ fontSize: '18px', marginLeft: '300px' }} />
                </Button>
            </ModalHeader>
            <ModalBody>
                <div {...getRootProps()} style={{
                        textAlign: 'center', 
                        border: '2px dashed #ddd', 
                        padding: '20px', 
                        cursor: 'pointer', 
                        marginBottom: '20px',
                        position: 'relative'
                    }}>
                    <input {...getInputProps()} style={{
                        position: 'absolute', 
                        top: 0, left: 0, 
                        width: '100%', height: '100%', opacity: 0 
                    }} />
                    <FontAwesomeIcon icon={faCloudUploadAlt} style={{ fontSize: '30px', color: '#293897' }} />
                    <p>Click or drag files here to upload</p>
                </div>
                {fileUploaded.length > 0 && (
                    <div style={{ marginTop: '20px' }}>
                        <ul>
                            {fileUploaded.map((file, index) => (
                                <li key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span>{file.name}</span>
                                    <Button color="link" onClick={() => deleteFile(file)} style={{ color: '#293897' }}>
                                        <FontAwesomeIcon icon={faTrashAlt} />
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </ModalBody>
            <ModalFooter>
                <Button color="secondary" onClick={toggleExcelModal}>Cancel</Button>
                <Button
                    color="primary"
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    {loading ? <Spinner size="sm" color="light" /> : "Submit"}
                </Button>
            </ModalFooter>
        </Modal>
        </>
    );
};

export default TableComponent;
