import { Button, Card, CardBody, Col, FormGroup, Input, Label, Row } from "reactstrap";
import NeptuneAgGrid from "../../../components/ag-grid";
import { useLayoutEffect, useState } from "react";
import { getSrfSearchHTTP } from "../../../services/srf-service";
import { toast } from "react-toastify";
import { group_columns } from "./config/columns";
import { DropdownList, Multiselect } from "react-widgets";
import { useNavigate } from "react-router-dom";
import useDropdownFilter from "../../../shared/hooks/dropdownFilterHook";
const initialState = {
    srfNo: '',
    requestor: '',
    customer: '',
    opportunity: '',
    status: '',
    group: '',
    serviceType: []
}
const SrfSearch = () => {
    const navigate = useNavigate();
    const [getDropdownByType] = useDropdownFilter();
    const [searchList, setSearchList] = useState([]);
    const [state, setState] = useState(initialState);
    const [dropdownOptions, setDropdownOptions] = useState({});

    useLayoutEffect(() => {
        getDropdowns();
        // eslint-disable-next-line
    }, [])

    const getDropdowns = async () => {
        const options = await getDropdownByType({ DropDownType: 'SRF WorkFlow Catalogue DDL Values' });
        let tempDropdownOptions = {};
        options?.value?.forEach(d => {
            const values = d?.DropDownValue;
            const property = d?.DropDownType;
            if (values) {
                const options = (values?.split(','));
                tempDropdownOptions[property] = options;
            }
        })
        setDropdownOptions(tempDropdownOptions);
    }


    const getSearchData = async () => {
        const payload = {
            SRFNumber: state?.srfNo,
            AccountNumber: state?.requestor,
            Customer: state?.customer,
            GroupName: state?.group,
            OpportunityCRMID: state?.opportunity,
            StatusName: state?.status,
            ServiceType: state?.serviceType?.join(','),
            Action: "Search",
            LoginUIID: sessionStorage.getItem('uiid')
        }
        try {
            const { data: { data: resultData, statusCode, statusMessage } } = await getSrfSearchHTTP(payload);
            if (statusCode === 200) {
                setSearchList(resultData);
                toast.success(statusMessage);
            } else {
                toast.error(statusMessage);
            }
        } catch (e) {
            toast.error('Something went wrong');
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setState({ ...state, [name]: value });
    }

    const resetFilter = () => {
        setState({ ...initialState });
        setSearchList([]);
    }

    const handleViewDetails = (data) => {
        let path = '';
        if (data?.SRFWorkFlowStatus === 'HLD' || data?.SRFWorkFlowStatus === 'HLD Cost Pending') {
            path = '/neptune/srf/inboxhld';
        } else {
            path = '/neptune/srf/search/view';
        }
        navigate(path, {
            state: {
                IntegrationID: data?.IntegrationID, SRFNumber: data?.SRFNumber, GroupName: data?.GroupName,
                WorkflowId: data?.WorkflowId || 0, SRFWorkFlowStatus: data?.SRFWorkFlowStatus
            }
        })
        //navigate('/neptune/srf/srfinbox/view', { state: { IntegrationID: data?.IntegrationID, SRFNumber: data?.SRFNumber } })
    }

    return (
        <>
            <Card className="card_outer_padding">
                <CardBody>
                    <div className="app-inner-layout__wrapper">
                        <Card className="card_outer_padding">
                            <strong>SRF Search</strong><br />
                            <Row>
                                <Col md={3}>
                                    <FormGroup>
                                        <Label for="srfNumber">SRF #</Label>
                                        <Input
                                            name="srfNo"
                                            id="srfNumber"
                                            value={state?.srfNo}
                                            onChange={handleChange}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md={3}>
                                    <FormGroup>
                                        <Label for="requestor">{`Requester(Maxis Id)`}</Label>
                                        <Input
                                            name="requestor"
                                            id="requestor"
                                            value={state?.requestor}
                                            onChange={handleChange}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md={3}>
                                    <FormGroup>
                                        <Label for="customer">Customer</Label>
                                        <Input
                                            name="customer"
                                            id="customer"
                                            value={state?.customer}
                                            onChange={handleChange}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md={3}>
                                    <FormGroup>
                                        <Label for="opportunity">Opportunity ID</Label>
                                        <Input
                                            name="opportunity"
                                            id="opportunity"
                                            value={state?.opportunity}
                                            onChange={handleChange}
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={3}>
                                    <FormGroup>
                                        <Label for="status">Status</Label>
                                        <DropdownList
                                            data={["Draft", "Submitted", "Assigned", "SRF Rejected", "SRF Dropped", "HLD", "HLD(MNS/MS)"
                                                , "LLD Submitted", "LLD Rejected", "LLD Closed", "MPN Submitted", "MPN Assigned", "MPN Rejected"
                                                , "SRF Rejected(CPQ)", "Closed"]}
                                            value={state?.status}
                                            onChange={(v) => handleChange({ target: { name: 'status', value: v } })}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md={3}>
                                    <FormGroup>
                                        <Label for="groupName">Group Name</Label>
                                        <DropdownList
                                            data={["Planner", "Engineering", "Account Manager", "Presales", "Planner Admin", "Solution Architect"]}
                                            value={state?.group}
                                            onChange={(v) => handleChange({ target: { name: 'group', value: v } })}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md={3}>
                                    <FormGroup>
                                        <Label for="ServiceType">Service Type</Label>
                                        <Multiselect
                                            name="ServiceType"
                                            value={state?.serviceType}
                                            data={dropdownOptions?.['SRF Service Type']}
                                            onChange={(v) => handleChange({ target: { name: 'serviceType', value: v } })}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md={3}>
                                    <FormGroup>
                                        <Label>Submitted Start Date</Label>
                                        <Input type="date" />
                                    </FormGroup>
                                </Col>
                                <Col md={3}>
                                    <FormGroup>
                                        <Label>Submitted End Date</Label>
                                        <Input type="date" />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <div>
                                <Button color="primary" className="mr-2" onClick={getSearchData}>
                                    Show Data
                                </Button>&nbsp;
                                <Button color="danger" outline onClick={resetFilter}>
                                    Reset Data
                                </Button>
                            </div>
                        </Card>
                        <Row>
                            <Col md="12">
                                <NeptuneAgGrid
                                    data={searchList}
                                    dataprops={group_columns(handleViewDetails)}
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
export default SrfSearch;