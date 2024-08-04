import { useEffect, useState } from "react";
import { Button, Card, CardBody, CardTitle, Col, FormGroup, Input, Label, Row } from "reactstrap";
import { getAllAuditsHTTP } from "../../../services/audit-trail-service";
import { toast } from "react-toastify";
import { audit_trail_columns } from "./config/columns";
import NeptuneAgGrid from "../../../components/ag-grid";
import moment from "moment";
import AuditModalDetails from "./audit-details-modal/audit-details-modal";

const AuditTrail = () => {
    const [auditList, setAuditList] = useState([]);
    const [state, setState] = useState({ StartDate: null, EndDate: moment(new Date()).format('YYYY-MM-DD') });
    const [showAuditModal, setShowAuditModal] = useState(false);
    const [selectedAudit, setSelectedAudit] = useState(null);

    useEffect(() => {
        // getAllAudits();
    }, [])

    const getAllAudits = async () => {

        const payload = {
            fromDate: moment(new Date(state?.StartDate)).format('DD-MM-YYYY'),
            // toDate: moment(new Date(state?.EndDate)).format('DD-MM-YYYY')
        }
        try {
            const { status, data } = await getAllAuditsHTTP(payload);
            if (status === 200) {
                setAuditList(data);
                toast.success('Fetched all the audits successfully');
            }
        } catch (e) {
            toast.error('Something went wrong');
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setState({ ...state, [name]: value });
    }

    const handleAuditModal = (status) => {
        setShowAuditModal(status);
    }

    const handleOpenAuditModal = (data) => {
        setShowAuditModal(true);
        setSelectedAudit(data);
    }


    return (
        <>
            <Card className="card_outer_padding">
                <CardTitle>Audit Trail</CardTitle>
                <CardBody>
                    <div className="app-inner-layout__wrapper">
                        <Row>
                            <Col md={3}>
                                <FormGroup>
                                    <Label for="StartDate">Start Date</Label>
                                    <Input
                                        type="date"
                                        name="StartDate"
                                        id="StartDate"
                                        onChange={handleInputChange}
                                        value={state.StartDate ? state.StartDate : null}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md={3}>
                                <FormGroup>
                                    <Label for="EndDate">End Date</Label>
                                    <Input
                                        type="date"
                                        name="EndDate"
                                        id="EndDate"
                                        onChange={handleInputChange}
                                        value={state.EndDate ? state.EndDate : null}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md={2}>
                                <Button color="primary" style={{marginTop:'30px'}} onClick={getAllAudits}>Get</Button>
                            </Col>
                        </Row>
                        <Row>
                            <span>Total Audits: {auditList.length}</span>
                            <Col md="12">
                                <NeptuneAgGrid
                                    data={auditList}
                                    dataprops={audit_trail_columns(handleOpenAuditModal)}
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
            {showAuditModal && <AuditModalDetails isOpen={showAuditModal} selectedAudit={selectedAudit} handleAuditModal={handleAuditModal} />}
        </>
    )
}

export default AuditTrail;