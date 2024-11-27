import { Button, Card, CardBody, CardTitle, Col, Row } from "reactstrap";
import NeptuneAgGrid from "../../../components/ag-grid";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getSrfWorkflowCatalogueHTTP } from "../../../services/srf-catalogue-service";
import { srf_catalogue_columns } from "./config/columns";
import SrfCatalogueModal from "./srf_catalogue_modal";

const SRFCatalogueWorkflow = () => {
    const [catalogueList, setCatalogueList] = useState([]);
    const [catalogueMasterList, setCatalogueMasterList] = useState([]);
    const [showCatalogueModal, setShowCatalogueModal] = useState(false);
    const [selectedCatalogue, setSelectedCatalogue] = useState(null);
    const [filterActiveStatus, setFilterActiveStatus] = useState(null);
    useEffect(() => {
        getAllCatalogues();
    }, [])

    useEffect(() => {
        if (filterActiveStatus) {
            setCatalogueList([...catalogueMasterList?.filter(f => f.CatalogueStatus === 'Active')]);
        } else {
            setCatalogueList([...catalogueMasterList?.filter(f => f.CatalogueStatus === 'Inactive')]);
        }
        //eslint-disable-next-line
    }, [filterActiveStatus])

    const getAllCatalogues = async (fromModal = false) => {
        const payload = {
            Action: 'GridData',
            LoginUIID: sessionStorage.getItem('uiid')
        }
        try {
            const { data: { data: resultData, statusCode, statusMessage } } = await getSrfWorkflowCatalogueHTTP(payload);
            if (statusCode === 200) {
                setCatalogueList(resultData?.filter(m => m?.CatalogueStatus === 'Active'));
                setCatalogueMasterList(JSON.parse(JSON.stringify(resultData)));
                setFilterActiveStatus(true);
                if (!fromModal) {
                    toast.success(statusMessage);
                }
            }
        } catch (e) {
            toast.error('Something went wrong');
        }
    }

    const handleViewDetails = (data) => {
        setShowCatalogueModal(true);
        setSelectedCatalogue(data);
    }

    const handleCatalogueModal = (status, data) => {
        setShowCatalogueModal(status)
        setSelectedCatalogue(null);
    }

    return (
        <>
            <Card className="card_outer_padding">
                <CardTitle>SRF Service Type Workflow Catalogue</CardTitle>
                <CardBody>
                    <div className="app-inner-layout__wrapper">
                        <Row>
                            <Col md="12">
                                <NeptuneAgGrid
                                    topActionButtons={
                                        <>
                                            <Button color="primary" onClick={() => setShowCatalogueModal(true)}>Add</Button>&nbsp;&nbsp;
                                            {/* <label><Input type='checkbox' checked={filterActiveStatus} onChange={() => setFilterActiveStatus(prevState => !prevState)} />&nbsp;Active Catalogue Status</label> */}
                                        </>}
                                    data={catalogueList}
                                    dataprops={srf_catalogue_columns(handleViewDetails)}
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
            {showCatalogueModal ? <SrfCatalogueModal isOpen={showCatalogueModal} handleCatalogueModal={handleCatalogueModal} selectedCatalogue={selectedCatalogue} getAllCatalogues={getAllCatalogues} /> : null}
        </>
    )
}

export default SRFCatalogueWorkflow;