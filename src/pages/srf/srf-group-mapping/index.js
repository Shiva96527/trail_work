import { Button, Card, CardBody, CardTitle, Col, Row } from "reactstrap";
import NeptuneAgGrid from "../../../components/ag-grid";
import { groupColumnData } from "./config/group-columns";
import { useEffect, useState } from "react";
import SRFGroupDetailsModal from "./modal/srf-group-details-modal";
import { toast } from "react-toastify";
import { getAllGroupMappingHTTP } from "../../../services/srf-service";

const SRFGroupMapping = () => {
    const [groupList, setGroupList] = useState([]);
    const [showGroupDetails, setShowGroupDetails] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState(null);

    useEffect(() => {
        getGroups(true);
    }, [])

    const getGroups = async (show) => {
        const payload = {
            Action: 'GridData',
            LoginUIID: sessionStorage.getItem('uiid')
        }
        try {
            const { data: { data: resultData, statusCode, statusMessage } } = await getAllGroupMappingHTTP(payload);
            if (statusCode === 200) {
                setGroupList(resultData);
                if (show) {
                    toast.success(statusMessage);
                }
            } else {
                toast.error(statusMessage);
            }
        } catch (e) {
            toast.console.error('Something went wrong');
        }
    }
    const handleOnClose = (status) => {
        setShowGroupDetails(status);
        setSelectedGroup(null);
        getGroups();
    }

    const handleAddGroup = () => {
        setShowGroupDetails(true);
    }

    const handleOnClickRow = (data) => {
        setSelectedGroup(data);
        setShowGroupDetails(true);
    }

    return (
        <>
            <Card className="card_outer_padding">
                <CardTitle>SRF Group Mapping</CardTitle>
                <CardBody>
                    <div className="app-inner-layout__wrapper">
                        <Row>
                            <Col md="12">
                                <NeptuneAgGrid
                                    topActionButtons={<Button color="primary" onClick={handleAddGroup}>Add</Button>}
                                    data={groupList}
                                    dataprops={groupColumnData(handleOnClickRow)}
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
            {showGroupDetails && <SRFGroupDetailsModal isOpen={showGroupDetails} selectedGroup={selectedGroup} onClose={handleOnClose} />}
        </>
    )
}
export default SRFGroupMapping;