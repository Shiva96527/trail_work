import { Button, Card, CardBody, CardTitle, Col, Row } from "reactstrap";
import { dropdownColumnData } from "./config/columns";
import { useState } from "react";
import { toast } from "react-toastify";
import { useEffect } from "react";
import NeptuneAgGrid from "../../../components/ag-grid";
import { getDropdownsForConfigHTTP } from "../../../services/global-service";
import AddDropdownConfigModal from "./modals";
const DropdownConfig = () => {
    const [dropdownValues, setDropdownValues] = useState([]);
    const [showDDDetails, setShowDDDetails] = useState(false);
    const [selectedDD, setSelectedDD] = useState(null);

    useEffect(() => {
        getDropdowns();
    }, []);

    const getDropdowns = async () => {
        try {
            const { data: { data: resultData, statusCode } } = await getDropdownsForConfigHTTP({
                LoginUIID: sessionStorage.getItem('uiid'),
                Action: 'Grid'
            })
            if (statusCode === 200 && resultData) {
                setDropdownValues(resultData);
            }
        } catch (e) {
            toast.error("System error.");
        }
    }

    const handleDropdownDetails = (dd) => {
        setShowDDDetails(true);
        setSelectedDD(dd);
    }

    const closeModal = (v) => {
        setShowDDDetails(v);
        setSelectedDD(null);
        getDropdowns();
    }

    return (
        <Card className="card_outer_padding">
            <CardTitle>DropDown Configuration</CardTitle>
            <CardBody>
                <div className="app-inner-layout__wrapper">
                    <Row>
                        <Col md="12">
                            <NeptuneAgGrid
                                topActionButtons={<>
                                    <Button color="primary" onClick={() => setShowDDDetails(true)}>Add New Dropdown</Button>
                                </>}
                                data={dropdownValues}
                                dataprops={dropdownColumnData(handleDropdownDetails)}
                                paginated={true}
                                itemsPerPage={10}
                                searchable={true}
                                exportable={true}
                            />
                        </Col>
                    </Row>
                </div>
            </CardBody>
            {showDDDetails && <AddDropdownConfigModal title={`${selectedDD ? 'Edit' : 'Add'} Dropdown`} selectedDropdown={selectedDD} onOk={() => closeModal(false)} onCancel={() => closeModal(false)} isOpen={showDDDetails} />}
        </Card>
    )
}

export default DropdownConfig;