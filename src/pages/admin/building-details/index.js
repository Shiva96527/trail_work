import { Card, CardBody, CardTitle, Col, Row } from "reactstrap";
import NeptuneAgGrid from "../../../components/ag-grid";
import { building_details_columns } from "./config.js/columns";
import { useEffect, useMemo, useState } from "react";
import { getAllBuildingDetailsHTTP } from "../../../services/building-details-service";
import { toast } from "react-toastify";
import BuildingModalDetails from "./building-details-modal/building-details-modal";

const BuildingDetails = () => {
    const [buildingList, setBuildingList] = useState([]);
    const [showBuildingDetails, setShowBuildingDetails] = useState(false);
    const [selectedDetails, setSelectedDetails] = useState(null);

    useEffect(() => {
        getAllBuildingDetails();
    }, [])

    const getAllBuildingDetails = async () => {
        const payload = {
            Action: 'CPQ',
            LoginUIID: sessionStorage.getItem('uiid')
        }
        try {
            const { data: { data: resultData, statusCode, statusMessage } } = await getAllBuildingDetailsHTTP(payload)
            if (statusCode === 200 && resultData) {
                setBuildingList(resultData);
                toast.success(statusMessage);
            } else {
                toast.error(statusMessage);
            }
        } catch (e) {
            toast.error("System error.");
        }
    }

    const handleViewDetails = (status, data) => {
        setShowBuildingDetails(status);
        setSelectedDetails(data);
    }

    const handleBuildingDetailsModal = (status) => {
        setShowBuildingDetails(status);
        getAllBuildingDetails();
    }

    const memoizedGrid = useMemo(() => {
        return <NeptuneAgGrid
            data={buildingList}
            dataprops={building_details_columns(handleViewDetails)}
            paginated={true}
            itemsPerPage={10}
            searchable={true}
            exportable={true}
        />
    }, [buildingList])

    return (
        <>
            <Card className="card_outer_padding">
                <CardTitle>Building Details</CardTitle>
                <CardBody>
                    <div className="app-inner-layout__wrapper">
                        <Row>
                            <Col md="12">
                                {memoizedGrid}
                            </Col>
                        </Row>
                    </div>
                </CardBody>
            </Card>
            {showBuildingDetails && <BuildingModalDetails isOpen={showBuildingDetails} selectedDetails={selectedDetails} setShowBuildingDetails={setShowBuildingDetails} handleBuildingDetailsModal={handleBuildingDetailsModal} />}
        </>
    )
}

export default BuildingDetails;