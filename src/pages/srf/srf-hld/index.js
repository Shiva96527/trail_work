import { Accordion, AccordionBody, AccordionHeader, AccordionItem, Badge, Button, Card, CardBody, Col, FormGroup, Input, Label, Row } from "reactstrap";
import { additional_info_columns, email_log_columns, financial_info_columns, review_cost_columns_hld, workflow_columns } from "./config/columns";
import { cpqlog_columns } from "../srf-search-view/config/columns";
import { useEffect, useRef, useState } from "react";
import NeptuneAgGrid from "../../../components/ag-grid";
import { getSrfByIdHTTP, getSrfHLDsHTTP, getSrfMailLogsHTTP, srfDeleteAttachmentHTTP, srfSaveWorkflowHTTP, srfUploadAttachmentHTTP, updateSrfWorkflowHTTP,SrfWMCPQCostUpdateAPI } from "../../../services/srf-service";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import SrfFinancialModal from "./financial-modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDoubleDown, faAngleDoubleUp, faRefresh, faTrash } from "@fortawesome/free-solid-svg-icons";
import ReviewCostModal from "./review-cost-modal";
import { useForm } from "react-hook-form";
import FormInput from "../../../components/form-input";
import FormInputFile from "../../../components/form-input-file";
import useFileUpload from "../../../shared/hooks/file-upload-hook";
import Swal from "sweetalert2";

const SRFHLD = () => {
    const financialRef = useRef();
    const navigate = useNavigate();
    const location = useLocation();
    const { state } = location;
    const { viewFile } = useFileUpload();
    const [open, setOpen] = useState(['1']);
    const [financialList, setFinancialList] = useState([]);
    const [cpqLogList, setCpqLogList] = useState([]);
    const [emailList, setEmailList] = useState([]);
    const [workflowList, setWorkflowList] = useState([]);
    const [srfDetails, setSrfDetails] = useState({ IsChannel: '', StatusName: '', SRFNumber: '', Status: '', ServiceType: '', WFStatusCode: 1, isActionBtnEnableFlag: false });
    const [selectedCost, setSelectedCost] = useState(null);
    const [showFinancialModal, setShowFinancialModal] = useState(false);
    const [showReviewCostModal, setShowReviewCostModal] = useState(false);
    const [hldReviewCostList, setHldReviewCostList] = useState([]);
    const [hideActions, setHideActions] = useState(false);
    const [srfAdditionalInfoList, setSRFAdditionalInfoList] = useState([]);
    const [srfReviewerAdditionalInfoList, setReviewerSRFAdditionalInfoList] = useState([]);
    const [localState, setLocalState] = useState(null);
    const [ismpnService, setIsMpnService] = useState(false);
    const [rejectRemarks, setRejectRemarks] = useState('');
    const [remarksError, setRemarksError] = useState('');
    const {
        control,
        handleSubmit,
        setValue,
        getValues,
        watch,
        formState: { errors },
    } = useForm({
        defaultValues: {
            ExecutiveSummary: '',
            HighLevelSolution: '',
            TechnicalRiskAssessment: '',
            Timelines: '',
            hldFile: null,
            financialFile: null,
            Remarks:''
            financialFile: null,
            Remarks:''
        }
    })

    const watchedValues = watch();

    useEffect(() => {
        if (watchedValues?.hldFile) {
            console.log(watchedValues?.hldFile);
        }
    }, [watchedValues?.hldFile])

    useEffect(() => {
        const local = JSON.parse(localStorage.getItem('reviewCostState'));
        if (local) {
            local.state.WorkflowId = local.WorkflowId;
            local.state.GroupName = local.GroupName;
        }
        if (state || local) {
            const stateObj = state ? state : local ? local?.state : null;
            if (stateObj) {
                setLocalState(stateObj);
            }
        }
        /*eslint-disable-next-line*/
    }, [state, localStorage.getItem('reviewCostState')])

    useEffect(() => {
        if (localState) {
            getSrfById();
        }
        /*eslint-disable-next-line*/
    }, [localState])

    useEffect(() => {
        if ((location.pathname.includes('group') || !srfDetails?.isActionBtnEnableFlag)
            || StatusName === 'Closed') {
            setHideActions(true);
        }
        else {
            setHideActions(false);
        }
        /*eslint-disable-next-line*/
    }, [localState, srfDetails])

    useEffect(() => {
        return () => {
            localStorage.clear();
        }
    }, [])

    // function getParameterByName(name, url = window.location.href) {
    //     name = name.replace(/[\[\]]/g, '\\$&');
    //     var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    //         results = regex.exec(url);
    //     if (!results) return null;
    //     if (!results[2]) return '';
    //     return decodeURIComponent(results[2].replace(/\+/g, ' '));
    // }

    const gerSrfHldGrid = async (StatusName) => {
        if (!localState) return;
        const payload = {
            LoginUIID: sessionStorage.getItem('uiid'),
            Action: 'Edit',
            IntegrationID: localState?.IntegrationID,
            SRFNumber: localState?.SRFNumber,
            GroupName: localState?.GroupName,
            SRFWorkFlowStatus: StatusName ? StatusName : srfDetails?.StatusName,
            WorkflowId: localState?.WorkflowId
        }
        try {
            const { data: { data: resultData, statusCode, statusMessage } } = await getSrfHLDsHTTP(payload);
            if (statusCode === 200) {
                setFinancialList(resultData);
            } else {
                toast.error(statusMessage);
            }
        } catch (e) {
            toast.error('Something went wrong');
        }
    }

    const getSrfById = async () => {
        if (!localState) return;
        const payload = {
            LoginUIID: sessionStorage.getItem('uiid'),
            Action: 'Edit',
            IntegrationID: localState?.IntegrationID,
            SRFNumber: localState?.SRFNumber,
            WorkflowId: localState?.WorkflowId ? localState?.WorkflowId : 0
        }
        try {
            const { data: { data: resultData, statusCode, statusMessage } } = await getSrfByIdHTTP(payload);
            if (statusCode === 200) {
                const { IsChannel, StatusName, ServiceType, WFStatusCode, AssignedTo } = resultData?.srfActionWorkFlowResponse || {};
                const { ExecutiveSummary, HighLevelSolution, TechnicalRiskAssessment, Timelines,Remarks } = resultData?.srfCreateInfoResponse;
                const { ExecutiveSummary, HighLevelSolution, TechnicalRiskAssessment, Timelines,Remarks } = resultData?.srfCreateInfoResponse;
                const attachments = { hldFile: null, financialFile: null };
                resultData?.SRFAttachments?.forEach(f => {
                    const { ColumnName } = f;
                    if (ColumnName === 'HLDFileUpload') {
                        attachments.hldFile = f;
                    } else if (ColumnName === 'FinancialFileUpload') {
                        attachments.financialFile = f;
                    }
                })
                setIsMpnService(ServiceType === 'MPN');
                setValue('ExecutiveSummary', ExecutiveSummary);
                setValue('HighLevelSolution', HighLevelSolution);
                setValue('TechnicalRiskAssessment', TechnicalRiskAssessment);
                setValue('Timelines', Timelines);
                setValue('Remarks', Remarks);
                setValue('Remarks', Remarks);
                setValue('hldFile', attachments?.hldFile || null);
                setValue('financialFile', attachments?.financialFile || null);
                //setAdditionalInfo({ ...additionalInfo, ExecutiveSummary, HighLevelSolution, TechnicalRiskAssessment, Timelines, hldFile: attachments?.hldFile ? attachments?.hldFile : null, financialFile: attachments?.financialFile ? attachments?.financialFile : null });
                setSrfDetails({
                    ...srfDetails,
                    AssignedTo,
                    IsChannel,
                    StatusName,
                    SRFNumber: resultData?.SRFNumber,
                    Status: StatusName,
                    ServiceType: ServiceType,
                    WFStatusCode, isActionBtnEnableFlag: resultData?.srfCreateInfoResponse?.isActionBtnEnableFlag === 'Yes' ? true : false
                });
                setWorkflowList(resultData?.srfActionWorkFlowHistory);
                setCpqLogList(resultData?.srfCPQLogHistory);
                getSrfMailLogs(resultData?.IntegrationID);
                setHldReviewCostList(resultData?.srfHLDReviewCostResponse);
                setSRFAdditionalInfoList(resultData?.srfAdditionalInfoResponse);
                setReviewerSRFAdditionalInfoList(resultData?.srfAdditionalInfoReviewerResponse);
                gerSrfHldGrid(StatusName);
            } else {
                toast.error(statusMessage);
            }
        } catch (e) {
            toast.error('Something went wrong');
        }
    }

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
        const isOpen = open.includes(id);
        setOpen(prevOpenAccordions => {
            if (isOpen) {
                return prevOpenAccordions.filter(item => item !== id);
            } else {
                return [...prevOpenAccordions, id];
            }
        });
    };

    const handleFinancialModal = (data) => {
        const { IntegrationID, SRFNumber, ServiceInfoID, SiteInfoID,
            SiteSeq } = data;
        setSelectedCost({
            IntegrationID,
            SRFNumber, ServiceInfoID, SiteInfoID, SiteSeq,
            SRFWorkFlowStatus:srfDetails?.StatusName, //Main status
             GroupName: localState?.GroupName
        });
        setShowFinancialModal(true);
    }

    const handleNavigate = (path) => {
        navigate(path, { state: { IntegrationID: localState?.IntegrationID, SRFNumber: localState?.SRFNumber, GroupName: localState?.GroupName, WorkflowId: localState?.WorkflowId } });
    }

    const handleViewFile = (file) => {
        if (file) {
            const link = document.createElement("a");
            link.href = file.Url;
            link.target = "_blank";
            link.type = "application/octet-stream";
            link.download = file.OriginalName;
            link.click();
            // destroy link
            link.remove();
        }
    };

    const handleDeleteFile = async (property) => {
        const payload = {
            AID: getValues(property)?.AID,
            LoginUIID: sessionStorage.getItem('uiid'),
            ModuleID: 0
        }
        try {
            const { data: { statusCode, statusMessage } } = await srfDeleteAttachmentHTTP(payload);
            if (statusCode === 200) {
                toast.success(statusMessage);
                setValue(property, null);
                //setAdditionalInfo({ ...additionalInfo, [property]: null });
            } else {
                toast.error(statusMessage);
            }
        } catch (e) {
            toast.error('Something went wrong');
        }
    };

    const handleFileChange = async (e, property, columnName) => {
        const formData = new FormData();
        formData.append('File', e.target.files[0]);
        formData.append('RID', localState?.IntegrationID);
        formData.append('AID', 0);
        formData.append('ModuleID', localState?.WorkflowId ? localState?.WorkflowId : 0);
        formData.append('ModuleName', 'SRFHLD');
        formData.append('ColumnName', columnName);
        formData.append('LoginUIID', sessionStorage.getItem('uiid'));
        formData.append('SessionID', generateSessionId());
        try {
            const { data: { data: resultData, statusCode, statusMessage } } = await srfUploadAttachmentHTTP(formData);
            if (statusCode === 200) {
                toast.success(statusMessage);
                setValue(property, resultData);
                //setAdditionalInfo({ ...additionalInfo, [property]: resultData });
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

    const workFlowSave = async (data, action) => {
        const { ExecutiveSummary, HighLevelSolution, TechnicalRiskAssessment, Timelines,Remarks } = data;
        const { ExecutiveSummary, HighLevelSolution, TechnicalRiskAssessment, Timelines,Remarks } = data;
        const payload = {
            ExecutiveSummary,
            HighLevelSolution,
            IntegrationID: localState?.IntegrationID,
            SRFNumber: localState?.SRFNumber,
            TechnicalRiskAssessment,
            Timelines,
            Remarks,
            Remarks,
            WorkflowId: localState?.WorkflowId,
            srfCreateInfoResponse: {
                ExecutiveSummary,
                HighLevelSolution,
                TechnicalRiskAssessment,
                Timelines,
                Remarks
                Timelines,
                Remarks
            },
            srfLLDCatalogueResponse: ''
        };
        payload['sessionId'] = generateSessionId();
        payload['Action'] = action;
        payload['LoginUIID'] = sessionStorage.getItem('uiid');
        if (action === 'Reject to CPQ' || action === 'Reject to MPN') {
            if (!rejectRemarks) {
                setRemarksError('Please enter remarks');
                return;
            }
            payload['Remarks'] = rejectRemarks;
        }
        try {
            const { data: { statusCode, statusMessage } } = await srfSaveWorkflowHTTP(payload);
            if (statusCode === 200) {
                toast.success(statusMessage);
                if (action !== 'Save Additional Info') {
                    navigate(-1);
                }
            } else {
                toast.error(statusMessage);
            }
        } catch (e) {
            toast.error('Something went wrong');
        }
    }

    const cpqCostRejectHandler = async (data, action) => {
        
        
        if (action === 'Reject to CPQ' || action === 'Reject to MPN') {
            if (!rejectRemarks) {
                setRemarksError('Please enter remarks');
                return;
            }        }
      
        const payload = {           
            Action: action,
            WorkflowId: localState?.WorkflowId,
            ApiKey: "nssmt3sak4jhyf9bv6sxkv8brbtqwukkfzkx",
            SRFReferenceNumber: localState?.SRFNumber,
            IntegrationID: localState?.IntegrationID,
            SRF_UserID: sessionStorage.getItem('uiid'),
            rejectremarks: rejectRemarks
        };
        try {
            const { data: { statusCode, statusMessage } } = await SrfWMCPQCostUpdateAPI(payload);
            if (statusCode === 200||statusCode === 0||statusCode === "0") {
                toast.success(statusMessage);
                if (action !== 'Save Additional Info') {
                    navigate(-1);
                }
            } else {
                toast.error(statusMessage);
            }
        } catch (e) {
            toast.error('Something went wrong');
        }
    }

    const handleExpansion = (type) => {
        setOpen([]);
        if (type === 'all') {
            setOpen(Array(7).fill().map((_, i) => (i + 1).toString()));
        }
    }

    const handleAddReview = () => {
        setShowReviewCostModal(true);
    }

    const handleReviewCloseModal = (status) => {
        setShowReviewCostModal(status);
    }

    const handleReviewCostRowClick = (data) => {
        const currentUrl = window.location.href;
        localStorage.setItem('reviewCostState', JSON.stringify({ state, WorkflowId: data?.WorkflowId, GroupName: data?.HLDGroup }));
        window.open(`${currentUrl}`, '_blank');
    }

    const handleGroupAddition = () => {
        setShowReviewCostModal(false);
        getSrfById();
    }

    const handleReviewerAction = async (rowData, action) => {
        if (!rowData?.Remarks) {
            toast.error('Remarks is required');
            return;
        }
        const payload = {
            Action: action,
            IntegrationID: localState?.IntegrationID,
            LoginUIID: sessionStorage.getItem('uiid'),
            Remarks: rowData?.Remarks,
            SRFNumber: localState?.SRFNumber,
            SessionID: generateSessionId(),
            srfHLDGroupAssignmentRequest: null,
            WorkflowId: rowData?.WorkflowId
        }
        try {
            const { data: { statusCode, statusMessage } } = await updateSrfWorkflowHTTP(payload);
            if (statusCode === 200) {
                toast.success(statusMessage);
                getSrfById();
                //navigate(-1);
            } else {
                toast.error(statusMessage);
            }
        } catch (e) {
            toast.error('Something went wrong');
        }
    }

    const handleCustomSubmit = (action) => {
        Swal.fire({
            title: `Are you sure to ${action}?`,
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: 'Yes',
            denyButtonText: 'No',
        }).then((result) => {
            if (result.isConfirmed) {
                if (action === 'Submit for Review') {
                    handleSubmit((data) => workFlowSave(data, action))();
                }
                if (action === 'Not Involved') {
                    debugger;
                var remarks=getValues('Remarks')
                if(remarks===undefined||remarks===null||remarks==='')
                {
                    toast.error('Please enter remarks');
                    return;
                }
                workFlowSave({ ...getValues() }, action);
                }
                 else {
                    workFlowSave({ ...getValues() }, action);
                }
            }
        })
    }

    const cpqUpdateCostandCloseSRFHandler = async (data, action) => {
        
        debugger;
        const payload = {           
            Action: action,
            WorkflowId: localState?.WorkflowId,
            ApiKey: "nssmt3sak4jhyf9bv6sxkv8brbtqwukkfzkx",
            SRFReferenceNumber: localState?.SRFNumber,
            IntegrationID: localState?.IntegrationID,
            SRF_UserID: sessionStorage.getItem('uiid'),
            rejectremarks: rejectRemarks
        };
        try {
            const { data: { statusCode, statusMessage } } = await SrfWMCPQCostUpdateAPI(payload);
            if (statusCode === 200||statusCode === 0||statusCode === "0") {
                toast.success(statusMessage);
                navigate(-1);
            } else {
                toast.error(statusMessage);
            }
        } catch (e) {
            toast.error('Something went wrong');
        }
    }

    const handleDownloadFile = (data) => {
        const payload = {
            Url: data?.path,
            OriginalName: data?.file
        }
        viewFile(payload);
    }

    const { StatusName, WFStatusCode } = srfDetails;
    const path = location.pathname;
    const title = path.includes('inbox') ? 'Inbox View' : path.includes('outbox') ? 'Outbox View' : path.includes('group') ? 'Group View' : null;
    return (
        <>
            <Card className="card_outer_padding">
                <div className="srfhld-title-container">
                    <div style={{ flex: 1 }}> {/* This will make the h4 take up remaining space */}
                        <span className="card-title" style={{ textAlign: 'center', margin: 0 }}>{title}</span>
                    </div>
                    <div className="srfhld-title-pull-right">
                        <FontAwesomeIcon icon={faAngleDoubleDown} className="font-awersome" onClick={() => handleExpansion('all')} />&nbsp;&nbsp;
                        <FontAwesomeIcon icon={faAngleDoubleUp} className="font-awersome" onClick={() => handleExpansion('collapse')} />&nbsp;&nbsp;
                        <Button color="primary" onClick={() => navigate(-1)}>Back</Button>&nbsp;
                        <Button color="primary" onClick={() => window.location.reload()}><FontAwesomeIcon icon={faRefresh} /></Button>
                    </div>
                </div><br />
                <CardBody className="accordions-card-body">
                    <div>
                        <span style={{ fontSize: '15px' }} className="link-style" onClick={() => handleNavigate('/neptune/srf/srfinbox/view')}>{srfDetails?.SRFNumber}</span>
                        &nbsp;&nbsp;<Badge className="style-cursor" color="primary"><span>{`Status->${srfDetails?.StatusName}`}</span></Badge>&nbsp;&nbsp;<Badge color="success">{`Group->${localState?.GroupName}`}</Badge>&nbsp;&nbsp;{srfDetails?.AssignedTo && <Badge color="info">{'Assigned to->' + srfDetails?.AssignedTo}</Badge>}
                    </div><br />
                    <div className="app-inner-layout__wrapper">
                        <Accordion flush open={open} toggle={toggle}>
                            {
                                <AccordionItem innerRef={financialRef}>
                                    <AccordionHeader targetId="1"><strong>Financial Info</strong></AccordionHeader>
                                    <AccordionBody accordionId="1">
                                        {open.includes('1') ? <Row>
                                            <Col md={12}>
                                                <NeptuneAgGrid
                                                    refId={'srf-financial'}
                                                    data={financialList}
                                                    dataprops={financial_info_columns(handleFinancialModal, ismpnService)}
                                                    paginated={false}
                                                    itemsPerPage={10}
                                                    searchable={false}
                                                    exportable={false}
                                                />
                                            </Col>
                                        </Row> : null}
                                        <br />
                                        <fieldset disabled={hideActions}>
                                            {showFinancialModal && <SrfFinancialModal status={srfDetails?.StatusName} hideActions={hideActions} isOpen={showFinancialModal} onClose={() => setShowFinancialModal(false)} selectedCost={selectedCost} getAllCost={gerSrfHldGrid} />}
                                        </fieldset>
                                        {/* <div className="srf-inner-title">
                                        HLD Cost Update
                                    </div>
                                    {open.includes('1') ? <Row>
                                        <Col md={12}>
                                            <NeptuneAgGrid
                                                refId={'srf-specific'}
                                                data={hldAssignmentGroupList}
                                                dataprops={hldGroupAssignment_columns_hld}
                                                paginated={true}
                                                itemsPerPage={10}
                                                searchable={true}
                                                exportable={true}
                                            />
                                        </Col>
                                    </Row> : null}
                                    <br />
                                    <div>
                                        <Button color="primary">Submit for Review</Button>&nbsp;
                                        <Button color="danger">Not Involved</Button>
                                    </div> */}
                                    </AccordionBody>
                                </AccordionItem>
                            }
                            {
                                ((srfDetails?.StatusName === "HLD" || srfDetails?.StatusName === "Closed") || (location.pathname.includes('outbox') && srfDetails?.StatusName === "HLD (Pending)")) &&
                                <AccordionItem>
                                    <AccordionHeader targetId="2"><strong>Review Cost</strong></AccordionHeader>
                                    <AccordionBody accordionId="2">
                                        <fieldset>
                                            {open.includes('2') ? <Row>
                                                <Col md={12}>
                                                    <NeptuneAgGrid
                                                        topActionButtons={(!hideActions || (location.pathname.includes('outbox') && srfDetails?.StatusName !== 'HLD')) && <Button color="primary" onClick={handleAddReview}>Add Group</Button>}
                                                        refId={'srf-review-cost'}
                                                        data={hldReviewCostList}
                                                        dataprops={review_cost_columns_hld(handleReviewCostRowClick, handleReviewerAction, (!hideActions || location.pathname.includes('outbox')))} // && srfDetails?.StatusName !== 'HLD' this condition is not needed for hld case
                                                        paginated={false}
                                                        itemsPerPage={10}
                                                        searchable={false}
                                                        exportable={false}
                                                    />
                                                </Col>
                                            </Row> : null}
                                        </fieldset>
                                    </AccordionBody>
                                </AccordionItem>
                            }
                            <AccordionItem>
                                <AccordionHeader targetId="3"><strong>Additional Info</strong></AccordionHeader>
                                <AccordionBody accordionId="3">
                                    <fieldset disabled={location.pathname.includes('outbox')}>
                                        <form>
                                            {(srfDetails?.StatusName === "HLD Cost Pending") ? <>
                                                <Row>
                                                    <Col md={6}>
                                                        <FormInput
                                                            label="Executive Summary"
                                                            name="ExecutiveSummary"
                                                            type="textarea"
                                                            rows={4}
                                                            disabled={hideActions}
                                                            control={control}
                                                            rules={{ required: 'Executive summary is required' }}
                                                            errors={errors}
                                                        />
                                                    </Col>
                                                    <Col md={6}>
                                                        <FormInput
                                                            label="High Level Solution"
                                                            name="HighLevelSolution"
                                                            type="textarea"
                                                            rows={4}
                                                            disabled={hideActions}
                                                            control={control}
                                                            rules={{ required: 'High Level Solution is required' }}
                                                            errors={errors}
                                                        />
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col md={6}>
                                                        <FormInput
                                                            label="Technical Risk Assessment"
                                                            name="TechnicalRiskAssessment"
                                                            type="textarea"
                                                            rows={4}
                                                            disabled={hideActions}
                                                            control={control}
                                                            errors={errors}
                                                        />
                                                    </Col>
                                                    <Col md={6}>
                                                        <FormInput
                                                            label="Timelines"
                                                            name="Timelines"
                                                            type="textarea"
                                                            rows={4}
                                                            disabled={hideActions}
                                                            rules={{ required: 'Timelines is required' }}
                                                            control={control}
                                                            errors={errors}
                                                        />
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col md={6}>
                                                        {!getValues('hldFile') ?
                                                            <FormInputFile
                                                                label="HLD File Upload"
                                                                id="fileInputhld"
                                                                name="hldFile"
                                                                type="file"
                                                                disabled={hideActions}
                                                                control={control}
                                                                errors={errors}
                                                                onChange={(e) => handleFileChange(e, 'hldFile', 'HLDFileUpload')}
                                                            />
                                                            :
                                                            <><span className="link-style" onClick={() => handleViewFile(getValues('hldFile'))}>{getValues('hldFile')?.FileName}</span>
                                                                <FontAwesomeIcon icon={faTrash} color="red" onClick={() => handleDeleteFile('hldFile')} fontSize={'12px'} cursor={'pointer'} /></>
                                                        }
                                                    </Col>
                                                    <Col md={6}>
                                                        <FormGroup>
                                                            {!getValues('financialFile') ?
                                                                <FormInputFile
                                                                    label="Financial File Upload"
                                                                    id="fileInputfinancial"
                                                                    name="financialFile"
                                                                    type="file"
                                                                    disabled={hideActions}
                                                                    control={control}
                                                                    errors={errors}
                                                                    onChange={(e) => handleFileChange(e, 'financialFile', 'FinancialFileUpload')}
                                                                />
                                                                :
                                                                <><span className="link-style" onClick={() => handleViewFile(getValues('financialFile'))}>{getValues('financialFile')?.FileName}</span>
                                                                    <FontAwesomeIcon icon={faTrash} color="red" onClick={() => handleDeleteFile('financialFile')} fontSize={'12px'} cursor={'pointer'} /></>
                                                            }
                                                        </FormGroup>
                                                    </Col>
                                                    <Col md={6}>
                                                        <FormInput
                                                            label="Remarks"
                                                            name="Remarks"
                                                            type="textarea"
                                                            rows={4}
                                                            disabled={hideActions}
                                                            rules={{ required: 'Remarks is required' }}
                                                            control={control}
                                                            errors={errors}
                                                        />
                                                    </Col>
                                                    <Col md={6}>
                                                        <FormInput
                                                            label="Remarks"
                                                            name="Remarks"
                                                            type="textarea"
                                                            rows={4}
                                                            disabled={hideActions}
                                                            rules={{ required: 'Remarks is required' }}
                                                            control={control}
                                                            errors={errors}
                                                        />
                                                    </Col>
                                                </Row>
                                            </> :
                                                <Row>
                                                    <Col md={12}>
                                                        <NeptuneAgGrid
                                                            refId={'srf-review-cost'}
                                                            data={srfReviewerAdditionalInfoList}
                                                            dataprops={additional_info_columns(handleDownloadFile)}
                                                            paginated={false}
                                                            itemsPerPage={10}
                                                            searchable={false}
                                                            exportable={false}
                                                        />
                                                    </Col>
                                                </Row>
                                            }
                                            <br />
                                            {(!location.pathname.includes('outbox') && !hideActions) && <div>
                                                {(srfDetails?.StatusName === 'HLD Cost Pending' && srfDetails?.StatusName !== 'Closed') &&
                                                    <Button color="primary" onClick={() => handleCustomSubmit('Save Additional Info')}>Save Additional Info</Button>
                                                }&nbsp;
                                                {
                                                    srfDetails?.StatusName === "HLD Cost Pending" &&
                                                    <Button color="primary" onClick={() => handleCustomSubmit('Submit for Review')}>
                                                        Submit for Review</Button>}&nbsp;
                                                {
                                                    srfDetails?.StatusName === "HLD Cost Pending" &&
                                                    <Button color="danger" onClick={() => handleCustomSubmit('Not Involved')}>Not Involved</Button>
                                                }
                                                {
                                                    srfDetails?.StatusName === "HLD" && srfDetails?.IsChannel === 'CPQ' &&
                                                    <Button color="primary" onClick={() => handleCustomSubmit('Update Cost and Close SRF')}>Submit Cost to CPQ & Close SRF</Button>
                                                }
                                                {
                                                    srfDetails?.StatusName === "HLD" && srfDetails?.IsChannel === 'Neptune' &&
                                                    <Button color="primary" onClick={() => handleCustomSubmit('Manual Update Cost and Close SRF')}>Submit Cost & Close SRF</Button>
                                                }
                                            </div>}
                                        </form>
                                    </fieldset>
                                </AccordionBody>
                            </AccordionItem>
                            {/* {(WFStatusCode === 4 && srfDetails?.StatusName === 'HLD' && srfDetails?.IsChannel === 'CPQ' && location.pathname.includes('inbox')) ? <AccordionItem>
                                <AccordionHeader targetId="4"><strong>Reject SRF</strong></AccordionHeader>
                                <AccordionBody accordionId="4">
                                    <Row>
                                        <Col md={12}>
                                            <FormGroup>
                                                <Label for="Remarks">Remarks<span className="required">*</span></Label>
                                                <Input
                                                    type="textarea"
                                                    rows={4}
                                                    id="Remarks"
                                                    disabled={!location.pathname.includes('inbox')}
                                                    value={rejectRemarks}
                                                    onChange={(e) => setRejectRemarks(e.target.value)}
                                                />
                                                {remarksError && <span className="required">{remarksError}</span>}
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    {location.pathname.includes('inbox') &&
                                        <div>
                                            {
                                                <Button color="danger" onClick={() => cpqCostRejectHandler(getValues(), 'Reject to CPQ')}>Reject to CPQ</Button>
                                            }
                                        </div>}
                                </AccordionBody>
                            </AccordionItem> : null} */}
                             {((WFStatusCode===4 ||WFStatusCode===3) && (srfDetails?.StatusName==='HLD'||srfDetails?.StatusName==='HLD (Pending)') && srfDetails?.IsChannel === 'CPQ' && (location.pathname.includes('inbox')||location.pathname.includes('outbox'))) ? <AccordionItem>
                            {/* {([3,4].includes(WFStatusCode) && ['HLD','HLD (Pending)'].includes(srfDetails?.StatusName) && srfDetails?.IsChannel === 'CPQ' && ['inbox','outbox'].includes(location.pathname) )? <AccordionItem> */}
                                <AccordionHeader targetId="4"><strong>Reject SRF</strong></AccordionHeader>
                                <AccordionBody accordionId="4">
                                    <Row>
                                        <Col md={12}>
                                            <FormGroup>
                                                <Label for="Remarks">Remarks<span className="required">*</span></Label>
                                                <Input
                                                    type="textarea"
                                                    rows={4}
                                                    id="Remarks"
                                                    // disabled={!location.pathname.includes('inbox')}
                                                   // disabled={!['inbox','outbox'].includes(location.pathname)}
                                                    value={rejectRemarks}
                                                    onChange={(e) => setRejectRemarks(e.target.value)}
                                                />
                                                {remarksError && <span className="required">{remarksError}</span>}
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    {(location.pathname.includes('inbox')||location.pathname.includes('outbox')) &&
                                        <div>
                                            {
                                                <Button color="danger" onClick={() => cpqCostRejectHandler(getValues(), 'Reject to CPQ')}>Reject to CPQ</Button>
                                            }
                                        </div>}
                                </AccordionBody>
                            </AccordionItem> : null}

                            {/* Reject option only for Reviewer */}
                            {/* {(WFStatusCode === 3 && srfDetails?.StatusName === 'HLD Cost Pending' && srfDetails?.IsChannel === 'CPQ' && location.pathname.includes('inbox')) ? <AccordionItem>
                                <AccordionHeader targetId="5"><strong>Reject SRF</strong></AccordionHeader>
                                <AccordionBody accordionId="5">
                                    <Row>
                                        <Col md={12}>
                                            <FormGroup>
                                                <Label for="Remarks">Remarks<span className="required">*</span></Label>
                                                <Input
                                                    type="textarea"
                                                    rows={4}
                                                    id="Remarks"
                                                    disabled={!location.pathname.includes('inbox')}
                                                    value={rejectRemarks}
                                                    onChange={(e) => setRejectRemarks(e.target.value)}
                                                />
                                                {remarksError && <span className="required">{remarksError}</span>}
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    {location.pathname.includes('inbox') &&
                                        <div>
                                            {
                                                ismpnService &&
                                                <Button color="danger" onClick={() => workFlowSave(getValues(), 'Reject to MPN')}>Reject to Enterprise</Button>
                                            }&nbsp;
                                        </div>}
                                </AccordionBody>
                            </AccordionItem> : null} */}
                            <AccordionItem>
                                <AccordionHeader targetId="6"><strong>Workflow</strong></AccordionHeader>
                                <AccordionBody accordionId="6">
                                    {open.includes('6') ? <Row>
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
                                <AccordionHeader targetId="7"><strong>CPQ Log</strong></AccordionHeader>
                                <AccordionBody accordionId="7">
                                    {open.includes('7') ? <Row>
                                        <Col md={12}>
                                            <NeptuneAgGrid
                                                refId={'srf-workflow'}
                                                data={cpqLogList}
                                                dataprops={cpqlog_columns()}
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
                                <AccordionHeader targetId="8"><strong>Email Logs</strong></AccordionHeader>
                                <AccordionBody accordionId="8">
                                    {open.includes('8') ? <Row>
                                        <Col md={12}>
                                            <NeptuneAgGrid
                                                refId={'srf-workflow'}
                                                data={emailList}
                                                dataprops={email_log_columns}
                                                paginated={false}
                                                itemsPerPage={10}
                                                searchable={false}
                                                exportable={false}
                                            />
                                        </Col>
                                    </Row> : null}
                                </AccordionBody>
                            </AccordionItem>
                        </Accordion>
                    </div>
                </CardBody>
            </Card >
            {/* {showFinancialModal && <SrfFinancialModal isOpen={showFinancialModal} onClose={() => setShowFinancialModal(false)} selectedCost={selectedCost} getAllCost={gerSrfHldGrid} />
            } */}
            {showReviewCostModal && <ReviewCostModal srfDetails={srfDetails} state={state} reviewCostData={hldReviewCostList} isOpen={showReviewCostModal} onClose={handleReviewCloseModal} onSuccess={handleGroupAddition} />}
        </>
    )
}
export default SRFHLD;