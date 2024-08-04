import { DropdownList } from "react-widgets";
import { Accordion, AccordionBody, AccordionHeader, AccordionItem, Button, Card, CardBody, CardTitle, Col, FormGroup, Input, Label, Row } from "reactstrap";
import NeptuneAgGrid from "../../../components/ag-grid";
import { email_log_columns, neptune_log_columns, workflow_columns } from "./config/columns";
import { useState } from "react";
import { createSrfSchema, isAnyRequiredFieldEmpty } from "./config/schemas";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { generateSrfHTTP, getSrfMailLogsHTTP } from "../../../services/srf-service";
import Select from 'react-select';

const generatedModel = {
    OpportunityCRMID: '',
    CustomerName: '',
    ExistingCircuitId: '',
    BizVertical: '',
    Requestor: '',
    AccountManager: '',
    TypeofService: '',
    NetworkType: '',
    RequestType: '',
    BandType: '',
    BusinessApplication: '',
    ImpactCusBusiness: '',
    IPSLARequirement: ''
}
const CreateSRF = () => {
    const { userInfo, srfDropdownOptions } = useSelector(state => state?.globalSlice);
    const [workflowList, setWorkflowList] = useState([]);
    const [neptuneList, setNeptuneList] = useState([]);
    const [emailList, setEmailList] = useState([]);
    const [generatedSrfModel, setGenerateSrfModel] = useState({ ...generatedModel });
    const [open, setOpen] = useState('1');

    useEffect(() => {
        setGenerateSrfModel({ ...generatedSrfModel, Requestor: userInfo?.user?.MaxisId });
    }, [userInfo?.user])

    const getSrfMailLogs = async (integrationId) => {
        const payload = {
            ModuleName: 'SRF',
            ModuleId: integrationId,
            LoginUIID: sessionStorage.getItem('uiid')
        }
        try {
            const { data: { data: resultData, statusCode, statusMessage } } = await getSrfMailLogsHTTP(payload);
            if (statusCode === 200) {
                setEmailList(resultData);
            } else {
                toast.error(statusMessage);
            }
        } catch (e) {
            toast.error('Something went wrong');
        }
    }

    const toggle = (id) => {
        if (open === id) {
            setOpen();
        } else {
            setOpen(id);
        }
    };

    const handleSrfChange = (e) => {
        const { name, value } = e.target;
        setGenerateSrfModel({ ...generatedSrfModel, [name]: value });
    }

    const handleGenerateSrfSubmit = async () => {
        const hasError = isAnyRequiredFieldEmpty(generatedSrfModel);
        if (hasError) {
            toast.error('Please enter all mandatory fields');
            return;
        }
        const payload = {};
        const tempPayload = { ...generatedSrfModel };
        const commaSeparatedService = tempPayload?.TypeofService?.map(m => m.value).join(',');
        tempPayload.TypeofService = commaSeparatedService;
        payload['srfCreateInfoResponse'] = { ...tempPayload };
        payload['Action'] = 'Generate SRF';
        payload['SessionID'] = generateSessionId();
        payload['LoginUIID'] = sessionStorage.getItem('uiid');
        try {
            const { data: { data: resultData, statusCode, statusMessage } } = await generateSrfHTTP(payload);
            if (statusCode === 200) {
                toast.success(statusMessage);
                if (resultData) {
                    setWorkflowList(resultData?.srfActionWorkFlowHistory);
                    setNeptuneList(resultData?.srfCPQLogHistory);
                    setEmailList(getSrfMailLogs(resultData?.IntegrationID));
                }
            }
        } catch (e) {
            toast.error('Something went wrong');
        }
    }

    const generateSessionId = () => {
        return (Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15));
    }

    return (
        <>
            <Card className="card_outer_padding">
                <CardTitle>Create SRF</CardTitle>
                <CardBody>
                    <div className="app-inner-layout__wrapper">
                        <Accordion flush open={open} toggle={toggle}>
                            <AccordionItem>
                                <AccordionHeader targetId="1"><strong>SRF</strong></AccordionHeader>
                                <AccordionBody accordionId="1">
                                    <Row>
                                        <Col md={3}>
                                            <FormGroup>
                                                <Label for="srfNumber">SRF #</Label>
                                                <Input
                                                    name="srfNo"
                                                    id="srfNumber"
                                                    disabled
                                                    placeholder="**Auto-generated**"
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col md={3}>
                                            <FormGroup>
                                                <Label for="OpportunityCRMID">{`Opportunity/CRM ID`}<span className="required">*</span></Label>
                                                <Input
                                                    name="OpportunityCRMID"
                                                    id="OpportunityCRMID"
                                                    value={generatedSrfModel?.OpportunityCRMID}
                                                    onChange={handleSrfChange}
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col md={3}>
                                            <FormGroup>
                                                <Label for="CustomerName">Customer Name<span className="required">*</span></Label>
                                                <Input
                                                    name="CustomerName"
                                                    id="CustomerName"
                                                    value={generatedSrfModel?.CustomerName}
                                                    onChange={handleSrfChange}
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col md={3}>
                                            <FormGroup>
                                                <Label for="ExistingCircuitId">Existing circuit id If any</Label>
                                                <Input
                                                    name="ExistingCircuitId"
                                                    id="ExistingCircuitId"
                                                    value={generatedSrfModel?.ExistingCircuitId}
                                                    onChange={handleSrfChange}
                                                />
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={3}>
                                            <FormGroup>
                                                <Label for="BizVertical">Biz Vertical<span className="required">*</span></Label>
                                                <DropdownList
                                                    data={srfDropdownOptions?.SRFDROPDOWNVALUES?.['SRF Biz Vertical']?.dropdownValue}
                                                    value={generatedSrfModel?.BizVertical}
                                                    onChange={(v) => handleSrfChange({ target: { name: 'BizVertical', value: v } })}
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col md={3}>
                                            <FormGroup>
                                                <Label for="AccountManager">Account Manager<span className="required">*</span></Label>
                                                <Input
                                                    name="AccountManager"
                                                    id="AccountManager"
                                                    value={generatedSrfModel?.AccountManager}
                                                    onChange={handleSrfChange}
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col md={3}>
                                            <FormGroup>
                                                <Label for="Requestor">Requestor<span className="required">*</span></Label>
                                                <Input
                                                    name="Requestor"
                                                    id="Requestor"
                                                    disabled
                                                    value={generatedSrfModel?.Requestor}
                                                    onChange={handleSrfChange}
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col md={3}>
                                            <FormGroup>
                                                <Label for="TypeofService">Service Type<span className="required">*</span></Label>
                                                <Select
                                                    className="react-select-wrapper"
                                                    isMulti
                                                    options={srfDropdownOptions?.SRFDROPDOWNVALUES?.['SRF Service Type']?.dropdownValue?.map(m => { return { label: m, value: m } })}
                                                    value={generatedSrfModel?.TypeofService}
                                                    onChange={(v) => handleSrfChange({ target: { name: 'TypeofService', value: v } })}
                                                />
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={3}>
                                            <FormGroup>
                                                <Label for="NetworkType">Network Type</Label>
                                                <Input
                                                    name="NetworkType"
                                                    id="NetworkType"
                                                    value={generatedSrfModel?.NetworkType}
                                                    onChange={handleSrfChange}
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col md={3}>
                                            <FormGroup>
                                                <Label for="RequestType">Request Type</Label>
                                                <DropdownList
                                                    data={srfDropdownOptions?.SRFDROPDOWNVALUES?.['SRF Request Type']?.dropdownValue}
                                                    value={generatedSrfModel?.RequestType}
                                                    onChange={(v) => handleSrfChange({ target: { name: 'RequestType', value: v } })}
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col md={3}>
                                            <FormGroup>
                                                <Label for="BandType">Band Type</Label>
                                                <DropdownList
                                                    data={srfDropdownOptions?.SRFDROPDOWNVALUES?.['SRF Band Type']?.dropdownValue}
                                                    value={generatedSrfModel?.BandType}
                                                    onChange={(v) => handleSrfChange({ target: { name: 'BandType', value: v } })}
                                                />
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={4}>
                                            <FormGroup>
                                                <Label for="BusinessApplication">List of Business application / service to be used by customer on the requested Maxis link</Label>
                                                <Input
                                                    type="textarea"
                                                    rows={3}
                                                    name="BusinessApplication"
                                                    id="BusinessApplication"
                                                    value={generatedSrfModel?.BusinessApplication}
                                                    onChange={handleSrfChange}
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col md={4}>
                                            <FormGroup>
                                                <Label for="ImpactCusBusiness">How does the requested Maxis link impact customer business /application?</Label>
                                                <Input
                                                    type="textarea"
                                                    rows={3}
                                                    name="ImpactCusBusiness"
                                                    id="ImpactCusBusiness"
                                                    value={generatedSrfModel?.ImpactCusBusiness}
                                                    onChange={handleSrfChange}
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col md={4}>
                                            <FormGroup>
                                                <Label for="IPSLARequirement">Mandatory IPSLA requirement (if there is any)i.e. Latency, Jitter, Packet Loss</Label>
                                                <Input
                                                    type="textarea"
                                                    rows={3}
                                                    name="IPSLARequirement"
                                                    id="IPSLARequirement"
                                                    value={generatedSrfModel?.IPSLARequirement}
                                                    onChange={handleSrfChange}
                                                />
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={3}>
                                            <FormGroup>
                                                <Label for="Channel">Channel</Label>
                                                <Input
                                                    name="Channel"
                                                    id="Channel"
                                                    disabled
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col md={3}>
                                            <FormGroup>
                                                <Label for="ChannelReference">Channel Reference ID</Label>
                                                <Input
                                                    name="ChannelReference"
                                                    id="ChannelReference"
                                                    disabled
                                                />
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <div>
                                        <Button color="primary" onClick={handleGenerateSrfSubmit}>Generate SRF</Button>
                                    </div>
                                </AccordionBody>
                            </AccordionItem>
                            <AccordionItem>
                                <AccordionHeader targetId="2"><strong>Workflow</strong></AccordionHeader>
                                <AccordionBody accordionId="2">
                                    {open === '2' ? <Row>
                                        <Col md={12}>
                                            <NeptuneAgGrid
                                                refId={'srf-workflow'}
                                                data={workflowList}
                                                dataprops={workflow_columns}
                                                paginated={false}
                                                itemsPerPage={10}
                                                searchable={false}
                                                exportable={false}
                                            />
                                        </Col>
                                    </Row> : null}
                                </AccordionBody>
                            </AccordionItem>
                            <AccordionItem>
                                <AccordionHeader targetId="3"><strong>Neptune Log</strong></AccordionHeader>
                                <AccordionBody accordionId="3">
                                    {open === '3' ? <Row>
                                        <Col md={12}>
                                            <NeptuneAgGrid
                                                refId={'srf-workflow'}
                                                data={neptuneList}
                                                dataprops={neptune_log_columns}
                                                paginated={true}
                                                itemsPerPage={10}
                                                searchable={true}
                                                exportable={true}
                                            />
                                        </Col>
                                    </Row> : null}
                                </AccordionBody>
                            </AccordionItem>
                            <AccordionItem>
                                <AccordionHeader targetId="4"><strong>Email Logs</strong></AccordionHeader>
                                <AccordionBody accordionId="4">
                                    {open === '4' ? <Row>
                                        <Col md={12}>
                                            <NeptuneAgGrid
                                                refId={'srf-workflow'}
                                                data={emailList}
                                                dataprops={email_log_columns}
                                                paginated={true}
                                                itemsPerPage={10}
                                                searchable={true}
                                                exportable={true}
                                            />
                                        </Col>
                                    </Row> : null}
                                </AccordionBody>
                            </AccordionItem>
                        </Accordion>
                    </div>
                </CardBody>
            </Card >
        </>
    )
}

export default CreateSRF;