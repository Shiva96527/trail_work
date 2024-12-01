import { Button, Card, CardBody, CardTitle, Col, Row } from "reactstrap";
import NeptuneAgGrid from "../../../components/ag-grid";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { headerColumn } from "./config/columns";
import VendorCatalogueModal from "./vendor-catalogue-modal";
import {
  deleteVendor,
  getVendorGridData,
} from "../../../services/vendor-management-service";
import Swal from "sweetalert2";

const VendorManagement = () => {
  const [catalogueList, setCatalogueList] = useState([]);
  const [showCatalogueModal, setShowCatalogueModal] = useState(false);
  const [selectedCatalogue, setSelectedCatalogue] = useState(null);
  const [action, setAction] = useState(null);

  useEffect(() => {
    getAllCatalogues();
  }, []);

  const getAllCatalogues = async (fromModal = false) => {
    const payload = {
      type: "Grid",
      loginUIID: sessionStorage.getItem("uiid"),
    };
    try {
      const {
        data: { data: resultData, statusCode, statusMessage },
      } = await getVendorGridData(payload);
      if (statusCode === 200) {
        console.log("resultData", resultData);
        setCatalogueList(resultData);
        if (!fromModal) {
          toast.success(statusMessage);
        }
      }
    } catch (e) {
      toast.error("Something went wrong");
    }
  };

  const handleViewDetails = (data, action) => {
    action !== "Delete" && setShowCatalogueModal(true);
    setSelectedCatalogue(data);
    setAction(action);
  };

  const handleCatalogueModal = (status) => {
    setShowCatalogueModal(status);
    setSelectedCatalogue(null);
  };

  useEffect(() => {
    action === "Delete" && handleDelete();
  }, [action]);

  const handleDelete = () => {
    console.log('first')
    Swal.fire({
      title: `Are you sure to delete vendor?`,
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: "Yes",
      denyButtonText: "No",
    }).then((result) => {
      console.log("result", result);
      if (result.isConfirmed) {
        onDelete(selectedCatalogue);
      }
      if (result.isDenied) {
        setSelectedCatalogue(null);
        setAction(null);
      }
    });
  };

  const onDelete = async (state) => {
    let payload = {};
    payload["LoginUIID"] = sessionStorage.getItem("uiid");
    payload["vendorId"] = state.vendorId;
    try {
      const {
        data: { statusCode, statusMessage },
      } = await deleteVendor(payload);
      if (statusCode === 200) {
        toast.success(statusMessage);
        handleCatalogueModal(false);
        getAllCatalogues(true);
      } else {
        toast.error(statusMessage);
      }
    } catch (e) {
      toast.error("Something went wrong");
    }
  };

  return (
    <>
      <Card className="card_outer_padding">
        <CardTitle>Vendor management</CardTitle>
        <CardBody>
          <div className="app-inner-layout__wrapper">
            <Row>
              <Col md="12">
                <NeptuneAgGrid
                  topActionButtons={
                    <>
                      <Button
                        color="primary"
                        onClick={() => setShowCatalogueModal(true)}
                      >
                        +
                      </Button>
                      &nbsp;&nbsp;
                      {/* <label><Input type='checkbox' checked={filterActiveStatus} onChange={() => setFilterActiveStatus(prevState => !prevState)} />&nbsp;Active Catalogue Status</label> */}
                    </>
                  }
                  data={catalogueList}
                  dataprops={headerColumn(handleViewDetails)}
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
      {showCatalogueModal ? (
        <VendorCatalogueModal
          isOpen={showCatalogueModal}
          handleCatalogueModal={handleCatalogueModal}
          selectedCatalogue={selectedCatalogue}
          getAllCatalogues={getAllCatalogues}
        />
      ) : null}
    </>
  );
};

export default VendorManagement;
