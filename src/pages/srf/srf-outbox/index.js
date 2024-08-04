import { Card, CardBody, CardTitle, Col, Row } from "reactstrap";
import NeptuneAgGrid from "../../../components/ag-grid";
import { useState } from "react";
import { useEffect } from "react";
import { getSrfGridDataHTTP } from "../../../services/srf-service";
import { toast } from "react-toastify";
import { outbox_columns } from "./config/columns";
import { useNavigate } from "react-router-dom";

const SrfOutbox = () => {
    const navigate = useNavigate();
    const [inboxList, setInboxList] = useState([]);

    useEffect(() => {
        getInboxData();
        // eslint-disable-next-line
    }, [])

    const getInboxData = async () => {
        const payload = {
            LoginUIID: sessionStorage.getItem('uiid'),
            Action: 'Outbox'
        }
        try {
            const { data: { data: resultData, statusCode, statusMessage } } = await getSrfGridDataHTTP(payload);
            if (statusCode === 200) {
                setInboxList(resultData);
                //toast.success(statusMessage);
            } else {
                toast.error(statusMessage);
            }
        } catch (e) {
            toast.error('Something went wrong');
        }
    }

    const handleViewDetails = (data) => {
        let path = '';
        if (data?.SRFWorkFlowStatus === 'HLD' || data?.SRFWorkFlowStatus === 'HLD Cost Pending' || data?.SRFWorkFlowStatus === 'HLD (Pending)') {
            path = '/neptune/srf/outboxhld';
        } else {
            path = '/neptune/srf/srfoutbox/view';
        }
        navigate(path, {
            state: {
                IntegrationID: data?.IntegrationID,
                SRFNumber: data?.SRFNumber,
                GroupName: data?.GroupName,
                WorkflowId: data?.WorkflowId,
                SRFWorkFlowStatus: data?.SRFWorkFlowStatus
            }
        })
    }

    return (
        <>
            <Card className="card_outer_padding">
                <CardTitle>Outbox</CardTitle>
                <CardBody>
                    <div className="app-inner-layout__wrapper">
                        <Row>
                            <Col md="12">
                                <NeptuneAgGrid
                                    data={inboxList}
                                    dataprops={outbox_columns(handleViewDetails)}
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
        </>
    )
}
export default SrfOutbox;