import React, { useState, useEffect } from "react";
import { Button, Card, CardBody, CardTitle, Col, Row } from "reactstrap";
import NeptuneAgGrid from "../../../components/ag-grid";
import { inboxColumns } from "../config/columns";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getDigitalEDQuoteGrid } from "../../../services/ed-service";
import { setDigitalizeQuoteId } from "../../../redux/slices/globalSlice";
import { useDispatch } from "react-redux";

const TableComponent = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [gridData, setGridData] = useState([]);

  useEffect(() => {
    getEDQuoteList();
  }, []);

  const getEDQuoteList = async () => {
    const payload = {
      type: "group",
      loginUIID: sessionStorage.getItem("uiid"),
    };
    try {
      const {
        data: { data: resultData, statusCode, statusMessage },
      } = await getDigitalEDQuoteGrid(payload);
      if (statusCode === 200) {
        setGridData(resultData);
        toast.success(statusMessage);
      } else {
        toast.info(statusMessage);
      }
    } catch (e) {
      console.error("Error fetching grid data:", e);
      toast.error("Something went wrong while fetching data.");
    }
  };

  const handleAssignment = (row) => {
    dispatch(
      setDigitalizeQuoteId({ digitalizeQuoteId: row.digitalizeQuoteId })
    );

    // Navigate to the update page when clicking on action icons
    navigate("/neptune/edquotation/mygroup/detail", {
      state: {
        quoteDetail: row,
      },
    });
  };

  const columns = inboxColumns(handleAssignment);

  return (
    <>
      <Card className="card_outer_padding">
        <CardTitle>My Group</CardTitle>
        <CardBody>
          <Row>
            <Col md="12">
              <NeptuneAgGrid
                topActionButtons={
                  <>
                    {/* Bulk Upload Button Removed */}
                    {/* <Button color="success" size="sm" onClick={toggleExcelModal}>
                      Bulk Upload
                    </Button> */}
                  </>
                }
                data={gridData} // Use fetched data
                dataprops={columns}
                paginated
                itemsPerPage={10}
                searchable
                exportable
              />
            </Col>
          </Row>
        </CardBody>
      </Card>

      {/* Bulk Upload Modal Removed */}
      {/* <Modal isOpen={excelModal} toggle={toggleExcelModal}>
        <ModalHeader toggle={toggleExcelModal}>Bulk Upload</ModalHeader>
        <ModalBody>
          <div
            {...getRootProps()}
            style={{
              textAlign: "center",
              border: "2px dashed #ddd",
              padding: "20px",
              cursor: "pointer",
            }}
          >
            <input {...getInputProps()} />
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
            disabled={loading}
          >
            Cancel
          </Button>
          <Button color="primary" onClick={handleSubmit} disabled={loading}>
            {loading ? <Spinner size="sm" color="light" /> : "Submit"}
          </Button>
        </ModalFooter>
      </Modal> */}
    </>
  );
};

export default TableComponent;
