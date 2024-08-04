import { useEffect, useState } from "react";
import { Badge, Button, Card, CardBody, Col, Row } from "reactstrap";
import { toast } from "react-toastify";
import NeptuneAgGrid from "../../../../components/ag-grid";
import { capexcolumns, opexcolumns, vascolumns } from "./config/columns";
import { getFinancialDetailsHTTP, updateCostHTTP } from "../../../../services/srf-service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { useLocation } from "react-router-dom";
import AddNewCost from "./add-new-cost";

const SrfFinancialModal = ({ isOpen, selectedCost, getAllCost, onClose, hideActions, status }) => {
    const location = useLocation();
    const [details, setDetails] = useState(null);
    const [type, setType] = useState('');
    const [data, setData] = useState([]);

    useEffect(() => {
        if (!selectedCost) return;
        getFinancialDetails();
        /*eslint-disable-next-line*/
    }, [selectedCost])

    const getFinancialDetails = async () => {
        const payload = { ...selectedCost };
        payload['LoginUIID'] = sessionStorage.getItem('uiid');
        payload['Action'] = 'Edit';

        try {
            const { data: { data: resultData, statusCode, statusMessage } } = await getFinancialDetailsHTTP(payload);
            if (statusCode === 200) {
                toast.success(statusMessage);
                setDetails(resultData);
            } else {
                toast.error(statusMessage);
            }
        } catch (e) {
            toast.error('Something went wrong');
        }
    }

    const handleUpdateCost = async () => {
        const payload = {
            Action: 'SaveCost',
            IntegrationID: selectedCost?.IntegrationID,
            LoginUIID: sessionStorage.getItem('uiid'),
            SRFNumber: selectedCost?.SRFNumber,
            SessionID: generateSessionId(),
            capexCost: details?.capexCost,
            opexCost: details?.opexCost,
            vasCost: details?.vasCost,
            ServiceInfoID: selectedCost?.ServiceInfoID,
            SiteInfoID: selectedCost?.SiteInfoID,
            SiteSeq: selectedCost?.SiteSeq,
            GroupName: selectedCost?.GroupName
        }

        try {
            const { data: { statusCode, statusMessage } } = await updateCostHTTP(payload);
            if (statusCode === 200) {
                toast.success(statusMessage);
                onClose();
                getAllCost();
            } else {
                toast.error(statusMessage);
            }
        } catch (e) {
            toast.error('Something went wrong');
        }
    }

    const generateSessionId = () => {
        return (Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15));
    }

    const addNewRow = (name, data) => {
        setData([]);
        const existingRecord = JSON.parse(JSON.stringify(details));
        const tempData = { ...data };
        tempData['newRecord'] = true;
        tempData['CostDetailsID'] = 0;
        tempData['ID'] = 0;
        if (name === 'Capex') {
            existingRecord.capexCost.push(tempData);
        } else if (name === 'Opex') {
            existingRecord.opexCost.push(tempData);
        } else if (name === 'Vas') {
            existingRecord.vasCost.push(tempData);
        }
        setDetails(existingRecord);
        onAddNewCostClose();
    }

    const handleAddClick = (type) => {
        setType(type);
        if (type === 'Capex') {
            setData(details?.capexCost);
        } else if (type === 'Opex') {
            setData(details?.opexCost);
        } else if (type === 'Vas') {
            setData(details?.vasCost);
        }
    }

    const onAddNewCostClose = () => {
        setType('');
    }

    return (
        <>
            <fieldset disabled={location.pathname.includes('group') || status === 'HLD'}>
                <div>
                    <Badge color="success">{`SRF->${selectedCost?.SiteSeq}`}</Badge>&nbsp;&nbsp;
                    <Badge color={selectedCost?.SRFWorkFlowStatus === 'Cost is Not Available' ? 'danger' : 'success'}>{`Cost->${selectedCost?.SRFWorkFlowStatus}`}</Badge>&nbsp;&nbsp;
                    {!hideActions && (!location.pathname.includes('outboxhld') && status !== 'HLD') && <Button color="primary" onClick={handleUpdateCost}>Save Cost</Button>}
                </div>
                <Card className="card_outer_padding">
                    <CardBody>
                        <Row>
                            <Col md={4}>
                                <div className="srf-inner-title">
                                    CAPEX {!hideActions && (!location.pathname.includes('outboxhld') && status !== 'HLD') && <FontAwesomeIcon onClick={() => handleAddClick('Capex')} className="fa-cursor" icon={faAdd} />}
                                </div>
                                <NeptuneAgGrid
                                    refId={'srf-capex'}
                                    data={details?.capexCost}
                                    dataprops={capexcolumns}
                                    paginated={false}
                                    itemsPerPage={10}
                                    searchable={false}
                                    exportable={false}
                                />
                            </Col>
                            <Col md={4}>
                                <div className="srf-inner-title">
                                    OPEX {!hideActions && (!location.pathname.includes('outboxhld') && status !== 'HLD') && <FontAwesomeIcon className="fa-cursor" onClick={() => handleAddClick('Opex')} icon={faAdd} />}
                                </div>
                                <NeptuneAgGrid
                                    refId={'srf-capex'}
                                    data={details?.opexCost}
                                    dataprops={opexcolumns}
                                    paginated={false}
                                    itemsPerPage={10}
                                    searchable={false}
                                    exportable={false}
                                />
                            </Col>
                            <Col md={4}>
                                <div className="srf-inner-title">
                                    VAS {!hideActions && (!location.pathname.includes('outboxhld') && status !== 'HLD') && <FontAwesomeIcon className="fa-cursor" onClick={() => handleAddClick('Vas')} icon={faAdd} />}
                                </div>
                                <NeptuneAgGrid
                                    refId={'srf-capex'}
                                    data={details?.vasCost}
                                    dataprops={vascolumns}
                                    paginated={false}
                                    itemsPerPage={10}
                                    searchable={false}
                                    exportable={false}
                                />
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </fieldset>
            {type && <AddNewCost isOpen={type ? true : false} type={type} data={data} onClose={onAddNewCostClose} addNewRow={addNewRow} />}
        </>
    )
}
export default SrfFinancialModal;