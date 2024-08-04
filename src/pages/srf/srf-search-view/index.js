import { DropdownList } from "react-widgets";
import { Accordion, AccordionBody, AccordionHeader, AccordionItem, Badge, Button, Card, CardBody, Col, FormGroup, Input, Label, Row } from "reactstrap";
import NeptuneAgGrid from "../../../components/ag-grid";
import { address_columns, cloudsecurity_columns, cpe_columns, cpqlog_columns, service_dtls_columns, email_log_columns, iot_columns, mobile_columns, neptune_log_columns, security_columns, specificinfo_columns, vas_columns, voice_columns, wifi_columns, workflow_columns, hldGroupAssignment_columns, mobile_private_columns, radio_access_network_columns, core_columns, mns_columns, ms_columns, hldGroupAssignment_approver_columns, mobile_site_address_columns, columnsToFetch, exportToExcel } from "./config/columns";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { generateSrfHTTP, getSrfByIdHTTP, getSrfMailLogsHTTP, syncGCPHTTP, syncSrfCPQHTTP, updateSrfWorkflowHTTP, uploadMobileGCPHTTP } from "../../../services/srf-service";
import { useLocation, useNavigate } from "react-router-dom";
import AddressDetailsModal from "./modals/address-details-modal";
import VASDetailsModal from "./modals/vas-details-modal";
import ServiceTypeDetailsModal from './modals/service-type-details-modal'
import useDropdownFilter from "../../../shared/hooks/dropdownFilterHook";
import VoiceDetailsModal from "./modals/voice-details-modal";
import MobileDetailsModal from "./modals/mobile-details-modal";
import WifiDetailsModal from "./modals/wifi-details-modal";
import IOTDetailsModal from "./modals/iot-details-modal";
import CPEDetailsModal from "./modals/cpe-details-modal";
import SecurityDetailsModal from "./modals/security-details-modal";
import CloudSecurityDetailsModal from "./modals/cloud-security-details-modal";
import MPNDetailsModal from "./modals/mpn-details-modal";
import RANDetailsModal from "./modals/ran-details-modal";
import CoreDetailsModal from "./modals/core-details-modal";
import FormInput from "../../../components/form-input";
import { useForm } from "react-hook-form";
import FormMultiSelectDropdown from "../../../components/form-multiselect-dropdown";
import FormDropdown from "../../../components/form-dropdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDoubleDown, faAngleDoubleUp, faRefresh, faRemove } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import { getWorkbook, populateGrid } from "./config/getDataFromExcel";
import site_address_template from '../../../assets/site_address_template.xlsx';
import XLSX from 'xlsx';

const defaultValues = {
    SRFNumber: '',
    OpportunityCRMID: '',
    CustomerName: '',
    ExistingCircuitId: '',
    BizVertical: '',
    Requestor: '',
    AccountManager: '',
    TypeofService: [],
    NetworkType: '',
    RequestType: '',
    BandType: '',
    BusinessApplication: '',
    ImpactCusBusiness: '',
    IPSLARequirement: '',
    ChannelReferenceId: '',
    Channel: ''
}
const InboxSearchView = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { state } = location;
    const { userInfo, srfDropdownOptions } = useSelector(state => state?.globalSlice);
    const [getDropdownByType] = useDropdownFilter();
    const [workflowList, setWorkflowList] = useState([]);
    const [neptuneList, setNeptuneList] = useState([]);
    const [emailList, setEmailList] = useState([]);
    const [vasList, setVasList] = useState([]);
    const [specificInfoList, setSpecificInfoList] = useState([]);
    const [cpqList, setCpqList] = useState([]);
    const [addressList, setAddressList] = useState([]);
    const [hldAssignmentGroupList, setHldAssignmentGroupList] = useState([]);
    const [serviceTypeInfo, setServiceTypeInfo] = useState(null);
    const [open, setOpen] = useState(['1']);
    const [isHld, setIsHld] = useState(false);
    const [showAddressDetails, setShowAddressDetails] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [showVasDetails, setShowVasDetails] = useState(false);
    const [selectedVas, setSelectedVas] = useState(null);
    const [selectedVoiceDetails, setSelectedVoiceDetails] = useState(null);
    const [selectedMobileDetails, setSelectedMobileDetails] = useState(null);
    const [selectedWifiDetails, setSelectedWifiDetails] = useState(null);
    const [selectedIOTDetails, setSelectedIOTDetails] = useState(null);
    const [selectedCPEDetails, setSelectedCPEDetails] = useState(null);
    const [selectedSecurityDetails, setSelectedSecurityDetails] = useState(null);
    const [selectedCloudSecurityDetails, setSelectedCouldSecurityDetails] = useState(null);
    const [showServiceTypeDetails, setShowServiceTypeDetails] = useState(false);
    const [selectedServiceType, setSelectedServiceType] = useState(null);
    const [selectedMPNDetails, setSelectedMPNDetails] = useState(null);
    const [selectedRANDetails, setSelectedRANDetails] = useState(null);
    const [selectedCoreDetails, setSelectedCoreDetails] = useState(null);
    const [srfDetails, setSrfDetails] = useState({ IsChannel: '', StatusName: '', SRFNumber: '', WFStatusCode: null, ServiceType: '', WorkflowId: 0, isActionBtnEnableFlag: false });
    const [remarks, setRemarks] = useState('');
    const [dropdownOptions, setDropdownOptions] = useState({});
    const [showRegion, setShowRegion] = useState(false);
    const [hldDataChanged, setHldDataChanged] = useState({ changed: false });
    const [region, setRegion] = useState('');
    const [panelName, setPanelName] = useState('');
    const [attachments, setAttachments] = useState();
    const [siteInfoServiceInfo, setSiteInfoServiceInfo] = useState(null);
    const [isPathNameFlag, setIsPathNameFlag] = useState('');
    const [disableForm, setDisableForm] = useState(false);
    const [isManualCreatorRole, setIsManualCreatorRole] = useState(false);
    const [manualRemarks, setManualRemarks] = useState('');
    const [ismpnService, setIsMpnService] = useState(false);
    const [showAAV, setShowAAV] = useState(false);
    const [gcpData, setMobileGcpData] = useState([]);
    const [showGcpColumns, setShowGcpColumns] = useState(false);
    const [errorMessages, setErrorMessages] = useState({
        region: '',
        remarks: '',
        hldAssignment: ''
    })
    const [gcpColumnsError, setGcpColumnError] = useState('');
    const [mobileTemplate, setMobileTemplate] = useState(null);
    const { control: mpnControl, watch: mpnWatch, getValues: mpnGetValues, handleSubmit: mnsHandleSubmit, formState: { errors: mpnError } } = useForm({ PreviousSRFNumber: '' });
    const { control: ranControl, watch: ranWatch, getValues: ranGetValues, handleSubmit: ranHandleSubmit, formState: { errors: ranError } } = useForm({ PreviousSRFNumber: '' });
    const { control: coreControl, watch: coreWatch, getValues: coreGetValues, handleSubmit: coreHandleSubmit, formState: { errors: coreError } } = useForm({ PreviousSRFNumber: '' });
    mpnWatch();
    ranWatch();
    coreWatch();
    const { control: generateSrfControl, watch: generateSrfWatch, setValue: generateSrfSetValue, getValues: generateSrfGetValues, handleSubmit: generateSrfHandleSubmit, formState: { errors: generateSrfError } } = useForm({ defaultValues });
    generateSrfWatch('NetworkType');
    generateSrfWatch('TypeofService');
    generateSrfWatch('IntegrationID');
    generateSrfWatch('SRFNumber');
    const [gcpSyncFlag, setGCPSyncFlag] = useState(false);

    useEffect(() => {
        if (state) {
            getSrfById(null, true);
        }
        getDropdowns();
        /*eslint-disable-next-line*/
    }, [])

    useEffect(() => {
        if (userInfo?.user?.ReorgUserRole?.includes('Manual SRF Creator')) {
            setIsManualCreatorRole(true);
        }
        if ((location.pathname.includes('srfinbox/view') &&
            !location.pathname.includes('/search/view')) ||
            location.pathname.includes('createsrf')) {
            setIsPathNameFlag(true);
        } else {
            setIsPathNameFlag(false);
        }
        /*eslint-disable-next-line*/
    }, [userInfo])

    useEffect(() => {
        if (userInfo && !state) {
            //setGenerateSrfModel({ ...generatedSrfModel, Requestor: userInfo?.user?.MaxisId });
            generateSrfSetValue('Requestor', userInfo?.user?.MaxisId)
        }
        /*eslint-disable-next-line*/
    }, [userInfo?.user])

    useEffect(() => {
        if (hldAssignmentGroupList.length > 0) {
            const canShowRegion = hldAssignmentGroupList?.some(s => {
                const optionGroup = s?.OptionGroup?.split(',');
                const mandatoryGroup = s?.MandatoryGroup?.split(',');
                const hasRadioInMandatoryGroup = mandatoryGroup && mandatoryGroup.includes('Radio');
                const hasRadioInOptionGroup = optionGroup && optionGroup.includes('Radio');
                return (hasRadioInMandatoryGroup || hasRadioInOptionGroup);
            });

            setShowRegion(canShowRegion);
            if (!canShowRegion) {
                setRegion('');
            }
            const isMandatoryFilled = hldAssignmentGroupList?.every(s => s.MandatoryGroup !== '');
            if (isMandatoryFilled) {
                setErrorMessages({ ...errorMessages, hldAssignment: '' });
            }
        }
        /*eslint-disable-next-line*/
    }, [hldDataChanged, hldAssignmentGroupList])

    const handleExpansion = (type) => {
        setOpen([]);
        if (type === 'all') {
            setOpen(Array(25).fill().map((_, i) => (i + 1).toString()));
        }
    }

    const handleDataChange = (data) => {
        setHldDataChanged({ ...data });
    }

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

    const getSrfById = async (afterSave, shouldRefreshMainForm) => {
        const payload = {
            LoginUIID: sessionStorage.getItem('uiid'),
            Action: 'Edit',
            IntegrationID: state?.IntegrationID || afterSave?.IntegrationID,
            SRFNumber: state?.SRFNumber || afterSave?.SRFNumber,
            WorkflowId: state?.WorkflowId || afterSave?.WorkflowId || srfDetails?.WorkflowId || 0
        }
        try {
            const { data: { data: resultData, statusCode, statusMessage } } = await getSrfByIdHTTP(payload);
            if (statusCode === 200) {
                if (resultData?.srfCreateInfoResponse) {
                    const { SRFNumber, OpportunityCRMID, CustomerName, ExistingCircuitId, BizVertical, Requestor, AccountManager, TypeofService, NetworkType, RequestType, BandType, BusinessApplication, ImpactCusBusiness, IPSLARequirement, Channel, ChannelReferenceId } = resultData?.srfCreateInfoResponse;
                    //setGenerateSrfModel({ ...generatedSrfModel, SRFNumber, OpportunityCRMID, CustomerName, ExistingCircuitId, BizVertical, Requestor, AccountManager, TypeofService: TypeofService?.split(',').map(v => { return { label: v, value: v } }), NetworkType, RequestType, BandType, BusinessApplication, ImpactCusBusiness, IPSLARequirement, Channel, ChannelReferenceId });
                    const srfFieldsToSet = {
                        SRFNumber, OpportunityCRMID, CustomerName, ExistingCircuitId, BizVertical, Requestor, AccountManager, TypeofService: TypeofService?.split(',').map(v => v), NetworkType, RequestType, BandType, BusinessApplication, ImpactCusBusiness, IPSLARequirement, Channel, ChannelReferenceId
                    }
                    if (shouldRefreshMainForm) {
                        Object.entries(srfFieldsToSet).forEach(([fieldName, value]) => {
                            generateSrfSetValue(fieldName, value || '');
                        })
                    }
                }
                const { IsChannel, StatusName, WFStatusCode, Remarks, ServiceType, AssignedTo } = resultData?.srfActionWorkFlowResponse || {};
                let serviceInfo = {};
                serviceInfo = resultData?.dataInfo.reduce((acc, data, index) => {
                    const { ServiceType, ...rest } = data;
                    if (!acc[ServiceType]) {
                        acc[ServiceType] = [rest];
                    } else {
                        acc[ServiceType].push(rest);
                    }
                    return acc;
                }, {})
                let siteInfoServiceInfo = {};
                siteInfoServiceInfo['mpnlist'] = resultData?.siteInfoResponse.filter(x => x.ServiceType === "MPN" || x.ServiceType === "Mobile Private Network")
                siteInfoServiceInfo['ranlist'] = resultData?.siteInfoResponse.filter(x => x.ServiceType === "RAN" || x.ServiceType === "Radio Access Network")
                siteInfoServiceInfo['corelist'] = resultData?.siteInfoResponse.filter(x => x.ServiceType === "Core" || x.ServiceType === "CORE")
                siteInfoServiceInfo['mnslist'] = resultData?.siteInfoResponse.filter(x => x.ServiceType === "MNS" || x.ServiceType === "Managed Network Services")
                siteInfoServiceInfo['mslist'] = resultData?.siteInfoResponse.filter(x => x.ServiceType === "MS" || x.ServiceType === "Managed Solution")
                setSiteInfoServiceInfo({ ...siteInfoServiceInfo });
                setIsMpnService(ServiceType === 'MPN');
                const attachmentsLocal = {};
                resultData?.SRFAttachments?.forEach(f => {
                    const { ColumnName } = f;
                    attachmentsLocal[ColumnName] = f;
                })
                setAttachments(attachmentsLocal);
                setServiceTypeInfo(serviceInfo);
                setSrfDetails({
                    ...srfDetails,
                    IsChannel,
                    AssignedTo,
                    StatusName,
                    SRFNumber: resultData?.SRFNumber,
                    WFStatusCode,
                    ServiceType: resultData?.srfActionWorkFlowResponse?.ServiceType,
                    IntegrationID: resultData?.IntegrationID,
                    WorkflowId: afterSave?.WorkflowId || state?.WorkflowId,
                    isActionBtnEnableFlag: resultData?.srfCreateInfoResponse?.isActionBtnEnableFlag === 'Yes' ? true : false,
                    isEnableAddUpdateBtnFlag: resultData?.srfCreateInfoResponse?.isEnableAddUpdateBtnFlag === 'Yes' ? true : false
                });
                setWorkflowList(resultData?.srfActionWorkFlowHistory);
                setNeptuneList(resultData?.srfCPQLogHistory);
                getSrfMailLogs(resultData?.IntegrationID);
                if (resultData?.srfActionWorkFlowResponse?.StatusName.includes('HLD') ||resultData?.srfActionWorkFlowResponse?.StatusName.includes('Cost Updated') || resultData?.srfActionWorkFlowResponse?.StatusName.includes('Closed')) {
                    setIsHld(true);
                }
                getCustomerUploadedData("CustomerUploadedData");
                setVasList(resultData?.siteInfoVAS || []);
                setSpecificInfoList(resultData?.specificInfo || []);
                setCpqList(resultData?.srfCPQLogHistory || []);
                setAddressList(resultData?.siteInfoResponse || []);
                setOpen(prevState => [...prevState, '21']);
                setRemarks(Remarks);
                setHldAssignmentGroupList(resultData?.srfHLDGroupAssignmentResponse);
                const assignmentGroupList = resultData?.srfHLDGroupAssignmentResponse;
                const canShowRegion = assignmentGroupList?.some(s => {
                    const optionGroup = s?.OptionGroup?.split(',');
                    const mandatoryGroup = s?.MandatoryGroup?.split(',');
                    const hasRadioInMandatoryGroup = mandatoryGroup && mandatoryGroup.includes('Radio');
                    const hasRadioInOptionGroup = optionGroup && optionGroup.includes('Radio');
                    return (hasRadioInMandatoryGroup || hasRadioInOptionGroup);
                });

                setShowRegion(canShowRegion);
                if (srfDetails?.IsChannel === "CPQ"
                    || location.pathname.includes('group')
                    // || location.pathname.includes('srfinbox/view')
                ) {
                    setDisableForm(true)
                }
                else {
                    setDisableForm(false)
                }
                setShowAAV(true);
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

    // const handleSrfChange = (e) => {
    //     const { name, value } = e.target;
    //     setGenerateSrfModel({ ...generatedSrfModel, [name]: value });
    // }

    const handleGenerateSrfSubmit = async () => {
        const payload = {};
        const tempPayload = { ...generateSrfGetValues() };
        const commaSeparatedService = tempPayload?.TypeofService?.join(',');
        tempPayload.TypeofService = commaSeparatedService;
        payload['srfCreateInfoResponse'] = { ...tempPayload };
        payload['Action'] = 'Generate SRF';
        payload['SessionID'] = generateSessionId();
        payload['LoginUIID'] = sessionStorage.getItem('uiid');
        delete payload?.srfCreateInfoResponse?.Channel;
        delete payload?.srfCreateInfoResponse?.ChannelReferenceId;
        delete payload?.srfCreateInfoResponse?.SRFNumber;
        try {
            const { data: { data: resultData, statusCode, statusMessage } } = await generateSrfHTTP(payload);
            if (statusCode === 200) {
                toast.success(statusMessage);
                if (resultData) {
                    if (resultData?.srfCreateInfoResponse) {
                        const { SRFNumber,
                            OpportunityCRMID,
                            CustomerName,
                            ExistingCircuitId,
                            BizVertical,
                            Requestor,
                            AccountManager,
                            TypeofService,
                            NetworkType,
                            RequestType,
                            BandType,
                            BusinessApplication,
                            ImpactCusBusiness,
                            IPSLARequirement,
                            Channel,
                            ChannelReferenceId
                        } = resultData?.srfCreateInfoResponse;
                        //setGenerateSrfModel({ ...generatedSrfModel, SRFNumber, OpportunityCRMID, CustomerName, ExistingCircuitId, BizVertical, Requestor, AccountManager, TypeofService: TypeofService?.split(',').map(v => { return { label: v, value: v } }), NetworkType, RequestType, BandType, BusinessApplication, ImpactCusBusiness, IPSLARequirement, Channel, ChannelReferenceId });
                        const srfFieldsToSet = {
                            SRFNumber, OpportunityCRMID, CustomerName, ExistingCircuitId, BizVertical, Requestor, AccountManager, TypeofService: TypeofService?.split(',').map(v => v), NetworkType, RequestType, BandType, BusinessApplication, ImpactCusBusiness, IPSLARequirement, Channel, ChannelReferenceId
                        }
                        Object.entries(srfFieldsToSet).forEach(([fieldName, value]) => {
                            generateSrfSetValue(fieldName, value);
                        })
                    }
                    setWorkflowList(resultData?.srfActionWorkFlowHistory);
                    setNeptuneList(resultData?.srfCPQLogHistory);
                    setEmailList(getSrfMailLogs(resultData?.IntegrationID));
                    getSrfById(resultData, true);
                    setShowAAV(true);
                    setSrfDetails({
                        ...srfDetails,
                        isActionBtnEnableFlag: resultData?.srfCreateInfoResponse?.isActionBtnEnableFlag === 'Yes' ? true : false,
                        isEnableAddUpdateBtnFlag: resultData?.srfCreateInfoResponse?.isEnableAddUpdateBtnFlag === 'Yes' ? true : false
                    })
                }
            }
        } catch (e) {
            toast.error('Something went wrong');
        }
    }

    const generateSessionId = () => {
        return (Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15));
    }

    const showServiceType = (type) => {
        if (generateSrfGetValues('TypeofService') && srfDetails?.SRFNumber) {
            const serviceTypes = generateSrfGetValues('TypeofService');
            if (serviceTypes.indexOf(type) !== -1) {
                return true;
            }
            return false
        }
    }

    const handleNavigate = () => {
        navigate('/neptune/srf/inboxhld', { state: { IntegrationID: state?.IntegrationID, SRFNumber: state?.SRFNumber, GroupName: state?.GroupName, WorkflowId: state?.WorkflowId } });
    }

    const handleAddressClose = (status) => {
        setSelectedAddress(null);
        setShowAddressDetails(status);
    }

    const handleOnClickAddress = (data) => {
        setSelectedAddress(data);
        setShowAddressDetails(true);
    }

    const handleOnClickVas = (data) => {
        setSelectedVas(data);
        setShowVasDetails(true);
    }

    const handleVasClose = (status) => {
        setSelectedVas(null);
        setShowVasDetails(status);
    }

    const handleOnClickServiceType = (data, panelName) => {
        setSelectedServiceType(data);
        setShowServiceTypeDetails(true);
        setPanelName(panelName);
    }

    const handleServiceTypeClose = (status) => {
        setSelectedServiceType(null);
        setShowServiceTypeDetails(status);
        setPanelName('');
    }

    const handleMpnRowClick = (data) => {
        setSelectedMPNDetails(data);
    }

    const handleRanRowClick = (data) => {
        setSelectedRANDetails(data);
    }

    const handleCoreClick = (data) => {
        setSelectedCoreDetails(data);
    }

    const handleMnsRowClick = () => {

    }

    const handleMsRowClick = () => {

    }

    const handleRemarksSave = (e) => {
        setRemarks(e.target.value);
        setErrorMessages({ ...errorMessages, remarks: '' });
    }

    const handleConfirmation = (action) => {
        Swal.fire({
            title: `Are you sure to ${action}?`,
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: 'Yes',
            denyButtonText: 'No',
        }).then((result) => {
            if (result.isConfirmed) {
                handleWorkflow(action);
            }
        })
    }

    const handleWorkflow = async (action) => {
        if (action === 'Approve') {
            const isMandatoryFilled = hldAssignmentGroupList?.every(s => s.MandatoryGroup !== '');
            if (!isMandatoryFilled) {
                //toast.error('Please select Mandatory groups for all Records in HLD Group Assignment');
                setErrorMessages({ ...errorMessages, hldAssignment: 'Please select atleast one Mandatory groups for all the service type in HLD Group Assignment' })
                return;
            }
            if (showRegion) {
                if (!region) {
                    //toast.error('Please select the Region');
                    setErrorMessages({ ...errorMessages, region: 'Please select the Region' });
                    return;
                } else {
                    setErrorMessages({ ...errorMessages, region: '' });
                }
            }
        }
        if (action === 'Submit') {
            if (addressList.length === 0) {
                toast.info("Please add address before submit SRF")
                return;
            }
        }

        if (action === 'Reject' || action === 'Reject to CPQ') {
            if (!remarks) {
                //toast.error('Please enter the remarks');
                setErrorMessages({ ...errorMessages, remarks: 'Please enter the remarks' });
                return;
            }
        }
        const payload = {
            Action: action,
            IntegrationID: state?.IntegrationID || srfDetails?.IntegrationID,
            LoginUIID: sessionStorage.getItem('uiid'),
            Remarks: remarks ? remarks : manualRemarks,
            SRFNumber: state?.SRFNumber || srfDetails?.SRFNumber,
            SessionID: generateSessionId(),
            srfHLDGroupAssignmentRequest: hldAssignmentGroupList,
            WorkflowId: state?.WorkflowId || srfDetails?.WorkflowId
        }
        if (action === 'Reject to CPQ') {
            delete payload.srfHLDGroupAssignmentRequest;
        }
        if (region.length > 0) {
            payload['Region'] = region;
        }
        if (action === 'Save as Draft' || action === 'Submit') {
            delete payload.srfHLDGroupAssignmentRequest;
            const srfFields = { ...generateSrfGetValues() };
            srfFields.TypeofService = srfFields.TypeofService?.join(',');
            payload['srfCreateInfoResponse'] = srfFields;
        }
        try {
            const { data: { statusCode, statusMessage } } = await updateSrfWorkflowHTTP(payload);
            if (statusCode === 200) {
                toast.success(statusMessage);
                navigate(-1);
            } else {
                toast.error(statusMessage);
            }
        } catch (e) {
            toast.error('Something went wrong');
        }
    }

    const handleCustomSubmit = (action) => {
        if (action === 'MPN') {
            mnsHandleSubmit((data) => srfSyncCPQDetails(data, action))();
        } else if (action === 'RAN') {
            ranHandleSubmit((data) => srfSyncCPQDetails(data, action))();
        } else if (action === 'Core') {
            coreHandleSubmit((data) => srfSyncCPQDetails(data, action))();
        }
    }


    const srfSyncCPQDetails = async (data, action) => {
        const payload = {
            Action: action,
            SessionID: generateSessionId(),
            LoginUIID: sessionStorage.getItem('uiid'),
            SRFNumber: data?.PreviousSRFNumber,
            AssignUser: generateSrfGetValues('SRFNumber') ? generateSrfGetValues('SRFNumber') : state.SRFNumber
        }

        try {
            const { data: { data: resultData, statusCode, statusMessage } } = await syncSrfCPQHTTP(payload);
            if (statusCode === 200) {
                toast.success(statusMessage);
                setSyncedValuesToServices(resultData, action);
            } else {
                toast.error('Something went wrong');
            }
        } catch (e) {
            toast.error('Something went wrong');
        }
    }

    const setSyncedValuesToServices = async (afterSave, serviceType) => {
        const payload = {
            LoginUIID: sessionStorage.getItem('uiid'),
            Action: 'Edit',
            IntegrationID: state?.IntegrationID || afterSave?.IntegrationID,
            SRFNumber: state?.SRFNumber || afterSave?.SRFNumber,
            WorkflowId: state?.WorkflowId || afterSave?.WorkflowId || srfDetails?.WorkflowId || 0
        }
        try {
            const { data: { data: resultData, statusCode } } = await getSrfByIdHTTP(payload);
            if (statusCode === 200) {
                let siteInfoServiceInfo = {};
                if (serviceType === 'MPN') {
                    siteInfoServiceInfo['mpnlist'] = resultData?.siteInfoResponse.filter(x => x.ServiceType === "MPN" || x.ServiceType === "Mobile Private Network")
                } else if (serviceType === 'RAN') {
                    siteInfoServiceInfo['ranlist'] = resultData?.siteInfoResponse.filter(x => x.ServiceType === "RAN" || x.ServiceType === "Radio Access Network")
                } else if (serviceType === 'Core') {
                    siteInfoServiceInfo['corelist'] = resultData?.siteInfoResponse.filter(x => x.ServiceType === "Core" || x.ServiceType === "CORE");
                }
                setSiteInfoServiceInfo({ ...siteInfoServiceInfo });
            }
        } catch (e) {
            toast.error('Unable to sync');
        }
    }

    const dataInfoHandler = async (action, data, rowData, onClose, isUpdate) => {
        const payload = {
            siteInfoResponse: data,
            SiteId: rowData?.SiteId || 0,
            ServiceInfoId: rowData?.ServiceInfoId || 0,
            Action: 'Address',
            ServiceType: action,
            BtnActionType: isUpdate ? (action === "RAN" || action === "MPN" || action === "Core") ? "MPNUpdate" : "Edit" : 'Add',
            SessionID: generateSessionId(),
            LoginUIID: sessionStorage.getItem('uiid'),
            SRFNumber: generateSrfGetValues('SRFNumber') ? generateSrfGetValues('SRFNumber') : srfDetails?.SRFNumber,
            IntegrationID: generateSrfGetValues('IntegrationID') ? generateSrfGetValues('IntegrationID') : srfDetails?.IntegrationID,
        }
        try {
            const { data: { statusCode, statusMessage } } = await generateSrfHTTP(payload);
            if (statusCode === 200) {
                toast.success(statusMessage);
                onClose();
                getSrfById({ IntegrationID: srfDetails?.IntegrationID, SRFNumber: srfDetails?.SRFNumber, WorkflowId: srfDetails?.WorkflowId }, false);
            }
        } catch (e) {
            toast.error('Something went wrong');
        }
    }

    const vasSubmitHandler = async (action, data, rowData, onClose, isUpdate) => {
        const payload = {
            siteInfoVAS: data,
            Action: action,
            SiteId: rowData?.SiteId || 0,
            ServiceInfoId: rowData?.ServiceInfoId || 0,
            BtnActionType: isUpdate ? "Edit" : "Add",
            SessionID: generateSessionId(),
            LoginUIID: sessionStorage.getItem('uiid'),
            SRFNumber: generateSrfGetValues('SRFNumber') ? generateSrfGetValues('SRFNumber') : srfDetails?.SRFNumber,
            IntegrationID: generateSrfGetValues('IntegrationID') ? generateSrfGetValues('IntegrationID') : srfDetails?.IntegrationID
        }
        try {
            const { data: { statusCode, statusMessage } } = await generateSrfHTTP(payload);
            if (statusCode === 200) {
                toast.success(statusMessage);
                onClose();
                getSrfById({ IntegrationID: srfDetails?.IntegrationID, SRFNumber: srfDetails?.SRFNumber, WorkflowId: srfDetails?.WorkflowId }, false);
            } else {
                toast.error(statusMessage);
            }
        } catch (e) {
            toast.error('Something went wrong');
        }
    }

    const serviceTypeDataInfoHandler = async (action, data, rowData, onClose, isUpdate) => {
        const payload = {
            dataInfo: data,
            Action: 'DataInfo',
            SiteId: rowData?.SiteId,
            ServiceType: action,
            BtnActionType: isUpdate ? (action === "RAN" || action === "MPN" || action === "Core") ? "MPNUpdate" : "Edit" : 'Add',
            SessionID: generateSessionId(),
            LoginUIID: sessionStorage.getItem('uiid'),
            SRFNumber: generateSrfGetValues('SRFNumber') ? generateSrfGetValues('SRFNumber') : srfDetails?.SRFNumber,
            IntegrationID: generateSrfGetValues('IntegrationID') ? generateSrfGetValues('IntegrationID') : srfDetails?.IntegrationID,
            ServiceInfoId: rowData?.ServiceInfoId ? rowData?.ServiceInfoId : 0,
        }
        try {
            const { data: { statusCode, statusMessage } } = await generateSrfHTTP(payload);
            if (statusCode === 200) {
                toast.success(statusMessage);
                onClose();
                getSrfById({ IntegrationID: srfDetails?.IntegrationID, SRFNumber: srfDetails?.SRFNumber, WorkflowId: srfDetails?.WorkflowId }, false);
            } else {
                toast.error(statusMessage);
            }
        } catch (e) {
            toast.error('Something went wrong');
        }

    }

    const reloadPage = () => {
        getSrfById(null, true);
    }

    const handleSetRegion = (value) => {
        setRegion(value);
        setErrorMessages({ ...errorMessages, region: '' });
    }

    const handleRejectedSrf = async (action) => {
        Swal.fire({
            title: `Are you sure to ${action}?`,
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: 'Yes',
            denyButtonText: 'No',
        }).then(async (result) => {
            if (result.isConfirmed) {
                const payload = {
                    Remarks: manualRemarks,
                    Action: action,
                    SessionID: generateSessionId(),
                    LoginUIID: sessionStorage.getItem('uiid'),
                    SRFNumber: srfDetails?.SRFNumber,
                    IntegrationID: srfDetails?.IntegrationID,
                    WorkflowId: srfDetails?.WorkflowId
                }
                try {
                    const { data: { statusCode, statusMessage } } = await updateSrfWorkflowHTTP(payload);
                    if (statusCode === 200) {
                        toast.success(statusMessage);
                        navigate(-1);
                    } else {
                        toast.error(statusMessage);
                    }
                } catch (e) {
                    toast.error('Something went wrong');
                }
            }
        })
    }

    const getCustomerUploadedData = async () => {
        const payload = {
            Action: "CustomerUploadedData",
            SRFNumber: state?.SRFNumber,
            LoginUIID: sessionStorage.getItem('uiid')
        }
        try {
            const { data: { data: resultData, statusCode, statusFlag } } = await syncGCPHTTP(payload);
            if (statusCode === 200) {
                //  toast.success(statusMessage);
                setMobileGcpData(resultData);
                if (statusFlag === "Yes") {
                    setShowGcpColumns(false);
                    setGCPSyncFlag(true)
                }
                else {
                    setShowGcpColumns(true);
                    setGCPSyncFlag(false)
                }
            }
        } catch (e) {
            toast.error('Something went wrong');
            setShowGcpColumns(false);
        }
    }

    // const getSyncData = async () => {
    //     const payload = {
    //         Action: "CustomerUploadedData",
    //         // SRFNumber: srfDetails?.SRFNumber,
    //         SRFNumber: state?.SRFNumber,
    //         LoginUIID: sessionStorage.getItem('uiid')
    //     }
    //     try {
    //         const { data: { data: resultData, statusCode, statusMessage } } = await syncGCPHTTP(payload);
    //         if (statusCode === 200) {
    //             toast.success(statusMessage);
    //             setMobileGcpData(resultData);
    //             setShowGcpColumns(true);
    //         }
    //     } catch (e) {
    //         toast.error('Something went wrong');
    //     }
    // }
    const expectedColumns = ['MobileAddress', 'Latitude', 'Longitude'];

    const validateColumnNames = (e) => {
        setGcpColumnError('');
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            const validTypes = [
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'application/vnd.ms-excel',
            ];
            const fileExtension = file.name.split('.').pop();
            const validExtensions = ['xlsx', 'xls'];

            if (!validTypes.includes(file.type) || !validExtensions.includes(fileExtension)) {
                setGcpColumnError('Invalid file type. Please upload an Excel file.');
                return false;
            }
            const reader = new FileReader();
            reader.onload = (event) => {
                const data = new Uint8Array(event.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                const sheetData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
                if (sheetData.length > 0) {
                    const actualColumns = sheetData[0];
                    if (JSON.stringify(expectedColumns) === JSON.stringify(actualColumns)) {
                        handleFileUpload(e);
                    } else {
                        setGcpColumnError(`Invalid column names. Expected: ${JSON.stringify(expectedColumns)}, Found: ${JSON.stringify(actualColumns)}`);
                    }
                }
            };
            reader.readAsArrayBuffer(file);
        }
    };

    const handleFileUpload = async (e) => {
        setMobileGcpData([]);
        setShowGcpColumns(false);
        setMobileTemplate(e.target.files[0]);
        const fileList = e.target.files;
        if (Object.keys(fileList).length === 0) return;
        const workbook = await getWorkbook(e);
        const rowData = populateGrid(workbook, columnsToFetch);
        const payload = {
            Action: "Upload",
            Status: 'New',
            SRFNumber: srfDetails?.SRFNumber,
            LoginUIID: sessionStorage.getItem('uiid'),
            srfMobileExcelDataRequest: rowData
        }
        try {
            const { data: { statusCode } } = await uploadMobileGCPHTTP(payload);
            if (statusCode === 200) {
                toast.success("System will process the GCP integration in the scheduler . Upon sync , system will send the notification for further action.");
                setMobileGcpData(rowData);
                setShowGcpColumns(false);
                getCustomerUploadedData();
            }
        } catch (e) {
            toast.error('Something went wrong');
        }
    }

    const clearMobileFile = () => {
        const doc = document.getElementById('siteAddressFileUpload');
        if (doc) {
            doc.value = '';
        }
        setMobileTemplate(null);
    }

    // const handleSync = () => {
    //     getSyncData();
    // }

    const memoizedGrid = useMemo(() => (
        <NeptuneAgGrid
            refId={'srf-specific'}
            data={hldAssignmentGroupList}
            dataprops={hldGroupAssignment_columns(dropdownOptions, handleDataChange, { disableForm, isManualCreatorRole, isActionBtnEnableFlag: srfDetails?.isActionBtnEnableFlag, WFStatusCode: srfDetails?.WFStatusCode }, srfDetails?.IntegrationID, true)}
            paginated={false}
            itemsPerPage={10}
            searchable={false}
            exportable={false}
        />
        // eslint-disable-next-line
    ), [hldAssignmentGroupList, dropdownOptions, disableForm, isManualCreatorRole, srfDetails?.isActionBtnEnableFlag]); // Only re-render if groupList changes
    const path = location.pathname;
    const title = path.includes('inbox') ? 'Inbox View' : path.includes('outbox') ? 'Outbox View' : path.includes('group') ? 'Group View' : null;
    return (
        <>
            <Card className="card_outer_padding">
                <div className="srfhld-title-container">
                    <div style={{ flex: 1 }}> {/* This will make the h4 take up remaining space */}
                        <span className="card-title" style={{ textAlign: 'center', margin: 0 }}>{!state ? 'Create SRF' : title}</span>
                    </div>
                    <div className="srfhld-title-pull-right">
                        <FontAwesomeIcon icon={faAngleDoubleDown} className="font-awersome" onClick={() => handleExpansion('all')} />&nbsp;&nbsp;
                        <FontAwesomeIcon icon={faAngleDoubleUp} className="font-awersome" onClick={() => handleExpansion('collapse')} />&nbsp;&nbsp;
                        <Button color="primary" onClick={() => navigate(-1)}>Back</Button>&nbsp;
                        <Button color="primary" onClick={() => window.location.reload()}><FontAwesomeIcon icon={faRefresh} /></Button>
                    </div>
                </div><br />
                <CardBody className="accordions-card-body">
                    <div className="app-inner-layout__wrapper">
                        <Accordion flush open={open} toggle={toggle}>
                            <AccordionItem>
                                <AccordionHeader targetId="1"><strong>SRF</strong>&nbsp;&nbsp;
                                    <Badge color="primary">{srfDetails?.StatusName}</Badge>&nbsp;&nbsp;<Badge color="success">{srfDetails?.SRFNumber}</Badge>&nbsp;&nbsp;{isHld ? <span className="style-cursor"><span className="link-style" onClick={handleNavigate}>HLD</span></span> : null} {srfDetails?.AssignedTo && <Badge color="info">{'Assigned to->' + srfDetails?.AssignedTo}</Badge>}</AccordionHeader>
                                <AccordionBody accordionId="1">
                                    <form onSubmit={generateSrfHandleSubmit(handleGenerateSrfSubmit)}>
                                        <fieldset disabled={(!(srfDetails?.StatusName === "" || srfDetails?.StatusName === "Draft" || srfDetails?.StatusName === 'SRF Rejected') || !srfDetails?.isActionBtnEnableFlag) && state}>
                                            <Row>
                                                <Col md={3}>
                                                    <FormInput
                                                        label="SRF #"
                                                        name="SRFNumber"
                                                        control={generateSrfControl}
                                                        errors={generateSrfError}
                                                        disabled
                                                    />
                                                </Col>
                                                <Col md={3}>
                                                    <FormInput
                                                        label={`Opportunity/CRM ID`}
                                                        name="OpportunityCRMID"
                                                        control={generateSrfControl}
                                                        errors={generateSrfError}
                                                        rules={{ required: 'Opportunity/CRM ID is required' }}
                                                    />
                                                </Col>
                                                <Col md={3}>
                                                    <FormInput
                                                        label="Customer Name"
                                                        name="CustomerName"
                                                        control={generateSrfControl}
                                                        errors={generateSrfError}
                                                        rules={{ required: 'Customer Name is required' }}
                                                    />
                                                </Col>
                                                <Col md={3}>
                                                    <FormInput
                                                        label="Existing circuit id If any"
                                                        name="ExistingCircuitId"
                                                        control={generateSrfControl}
                                                        errors={generateSrfError}
                                                    />
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col md={3}>
                                                    <FormDropdown
                                                        label="Biz Vertical"
                                                        name="BizVertical"
                                                        control={generateSrfControl}
                                                        errors={generateSrfError}
                                                        rules={{ required: 'Biz Vertical is required' }}
                                                        data={srfDropdownOptions?.SRFDROPDOWNVALUES?.['SRF Biz Vertical']?.dropdownValue}
                                                    />
                                                </Col>
                                                <Col md={3}>
                                                    <FormInput
                                                        label="Account Manager"
                                                        name="AccountManager"
                                                        control={generateSrfControl}
                                                        errors={generateSrfError}
                                                    />
                                                </Col>
                                                <Col md={3}>
                                                    <FormInput
                                                        label="Requestor"
                                                        name="Requestor"
                                                        control={generateSrfControl}
                                                        rules={{ required: 'Requestor is required' }}
                                                        errors={generateSrfError}
                                                        disabled
                                                    />
                                                </Col>
                                                <Col md={3}>
                                                    <FormMultiSelectDropdown
                                                        label="Service Type"
                                                        name="TypeofService"
                                                        control={generateSrfControl}
                                                        errors={generateSrfError}
                                                        rules={{ required: 'Service Type is required' }}
                                                        data={srfDropdownOptions?.SRFDROPDOWNVALUES?.['SRF Service Type']?.dropdownValue}
                                                    />
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col md={3}>
                                                    <FormDropdown
                                                        label="Network Type"
                                                        name="NetworkType"
                                                        control={generateSrfControl}
                                                        errors={generateSrfError}
                                                        data={srfDropdownOptions?.SRFDROPDOWNVALUES?.['SRF NETWORK TYPE']?.dropdownValue}
                                                    />
                                                </Col>
                                                <Col md={3}>
                                                    <FormDropdown
                                                        label="Request Type"
                                                        name="RequestType"
                                                        control={generateSrfControl}
                                                        errors={generateSrfError}
                                                        data={srfDropdownOptions?.SRFDROPDOWNVALUES?.['SRF Request Type']?.dropdownValue}
                                                    />
                                                </Col>
                                                <Col md={3}>
                                                    <FormDropdown
                                                        label="Band Type"
                                                        name="BandType"
                                                        control={generateSrfControl}
                                                        errors={generateSrfError}
                                                        data={srfDropdownOptions?.SRFDROPDOWNVALUES?.['SRF Band Type']?.dropdownValue}
                                                        disabled={generateSrfGetValues('NetworkType') !== 'VSAT'}
                                                    />
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col md={6}>
                                                    <FormInput
                                                        type="textarea"
                                                        rows={3}
                                                        label="List of Business application / service to be used by customer on the requested Maxis link"
                                                        name="BusinessApplication"
                                                        control={generateSrfControl}
                                                        errors={generateSrfError}
                                                    />
                                                </Col>
                                                <Col md={6}>
                                                    <FormInput
                                                        type="textarea"
                                                        rows={3}
                                                        label="How does the requested Maxis link impact customer business /application?"
                                                        name="ImpactCusBusiness"
                                                        control={generateSrfControl}
                                                        errors={generateSrfError}
                                                    />
                                                </Col>
                                                <Col md={5}>
                                                    <FormInput
                                                        type="textarea"
                                                        rows={3}
                                                        label="Mandatory IPSLA requirement (if there is any)i.e. Latency, Jitter, Packet Loss"
                                                        name="IPSLARequirement"
                                                        control={generateSrfControl}
                                                        errors={generateSrfError}
                                                    />
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col md={3}>
                                                    <FormInput
                                                        className="channel-highlight"
                                                        label="Channel"
                                                        name="Channel"
                                                        control={generateSrfControl}
                                                        errors={generateSrfError}
                                                        disabled
                                                    />
                                                </Col>
                                                <Col md={3}>
                                                    <FormInput
                                                        label="Channel Reference ID"
                                                        name="ChannelReferenceId"
                                                        control={generateSrfControl}
                                                        errors={generateSrfError}
                                                        disabled
                                                    />
                                                </Col>
                                            </Row>
                                        </fieldset>
                                        {!srfDetails?.SRFNumber && <div>
                                            <Button color="primary" type="submit">Generate SRF</Button>
                                        </div>}
                                    </form>
                                </AccordionBody>
                            </AccordionItem>
                            {showServiceType('DIA') ? <AccordionItem>
                                <AccordionHeader targetId="2"><strong>DIA</strong></AccordionHeader>
                                <AccordionBody accordionId="2">
                                    {open.includes('2') ? <Row>
                                        <Col md={12}>
                                            <NeptuneAgGrid
                                                refId={'srf-voice'}
                                                topActionButtons={srfDetails?.IsChannel !== 'CPQ' && (srfDetails?.isActionBtnEnableFlag && srfDetails?.isEnableAddUpdateBtnFlag) && <Button color="primary" onClick={() => handleOnClickServiceType(null, 'DIA')}>Add</Button>}
                                                data={serviceTypeInfo?.['DIA']}
                                                dataprops={service_dtls_columns((data) => handleOnClickServiceType(data, 'DIA'), ismpnService)}
                                                paginated={false}
                                                itemsPerPage={10}
                                                searchable={false}
                                                exportable={false}
                                            />
                                        </Col>
                                    </Row> : null}
                                </AccordionBody>
                            </AccordionItem> : null}
                            {showServiceType('DPLC') ? <AccordionItem>
                                <AccordionHeader targetId="3"><strong>DPLC</strong></AccordionHeader>
                                <AccordionBody accordionId="3">
                                    {open.includes('3') ? <Row>
                                        <Col md={12}>
                                            <NeptuneAgGrid
                                                refId={'srf-voice'}
                                                topActionButtons={srfDetails?.IsChannel !== 'CPQ' && (srfDetails?.isActionBtnEnableFlag && srfDetails?.isEnableAddUpdateBtnFlag) && <Button color="primary" onClick={() => handleOnClickServiceType(null, 'DPLC')}>Add</Button>}
                                                data={serviceTypeInfo?.['DPLC']}
                                                dataprops={service_dtls_columns((data) => handleOnClickServiceType(data, 'DPLC'), ismpnService)}
                                                paginated={false}
                                                itemsPerPage={10}
                                                searchable={false}
                                                exportable={false}
                                            />
                                        </Col>
                                    </Row> : null}
                                </AccordionBody>
                            </AccordionItem> : null}
                            {showServiceType('MPLS') ? <AccordionItem>
                                <AccordionHeader targetId="4"><strong>MPLS</strong></AccordionHeader>
                                <AccordionBody accordionId="4">
                                    {open.includes('4') ? <Row>
                                        <Col md={12}>
                                            <NeptuneAgGrid
                                                refId={'srf-voice'}
                                                topActionButtons={srfDetails?.IsChannel !== 'CPQ' && (srfDetails?.isActionBtnEnableFlag && srfDetails?.isEnableAddUpdateBtnFlag) && <Button color="primary" onClick={() => handleOnClickServiceType(null, 'MPLS')}>Add</Button>}
                                                data={serviceTypeInfo?.['MPLS']}
                                                dataprops={service_dtls_columns((data) => handleOnClickServiceType(data, 'MPLS'), ismpnService)}
                                                paginated={false}
                                                itemsPerPage={10}
                                                searchable={false}
                                                exportable={false}
                                            />
                                        </Col>
                                    </Row> : null}
                                </AccordionBody>
                            </AccordionItem> : null}
                            {showServiceType('IPLC') ? <AccordionItem>
                                <AccordionHeader targetId="5"><strong>IPLC</strong></AccordionHeader>
                                <AccordionBody accordionId="5">
                                    {open.includes('5') ? <Row>
                                        <Col md={12}>
                                            <NeptuneAgGrid
                                                refId={'srf-voice'}
                                                topActionButtons={srfDetails?.IsChannel !== 'CPQ' && (srfDetails?.isActionBtnEnableFlag && srfDetails?.isEnableAddUpdateBtnFlag) && <Button color="primary" onClick={() => handleOnClickServiceType(null, 'IPLC')}>Add</Button>}
                                                data={serviceTypeInfo?.['IPLC']}
                                                dataprops={service_dtls_columns((data) => handleOnClickServiceType(data, 'IPLC'), ismpnService)}
                                                paginated={false}
                                                itemsPerPage={10}
                                                searchable={false}
                                                exportable={false}
                                            />
                                        </Col>
                                    </Row> : null}
                                </AccordionBody>
                            </AccordionItem> : null}

                            {showServiceType('Mobile Private Network') || showServiceType('MPN') ? <AccordionItem>
                                <AccordionHeader targetId="6"><strong>Mobile Private Network</strong></AccordionHeader>
                                <AccordionBody accordionId="6">
                                    {open.includes('6') ? <Row>
                                        <Col md={12}>
                                            <NeptuneAgGrid
                                                refId={'srf-mpn'}
                                                data={siteInfoServiceInfo['mpnlist']}
                                                dataprops={mobile_private_columns(handleMpnRowClick)}
                                                paginated={false}
                                                itemsPerPage={10}
                                                searchable={false}
                                                exportable={false}
                                            />
                                        </Col>
                                    </Row> : null}<br />
                                    <form>
                                        <Row>
                                            <Col md={3}>
                                                <FormInput
                                                    label="Previous SRF#"
                                                    type="number"
                                                    name="PreviousSRFNumber"
                                                    control={mpnControl}
                                                    errors={mpnError}
                                                    rules={{ required: 'Previos SRF# is required' }}
                                                    disabled={!isPathNameFlag || ![2, 10, 9].includes(srfDetails?.WFStatusCode)}
                                                />
                                            </Col>
                                            <Col md={3}>
                                                <Button style={{ marginTop: '31px' }} color="primary" disabled={!mpnGetValues('PreviousSRFNumber')} onClick={() => handleCustomSubmit('MPN')}>Sync from Previous SRF</Button>
                                            </Col>
                                        </Row>
                                    </form>
                                </AccordionBody>
                            </AccordionItem> : null}
                            {showServiceType('Radio Access Network') || showServiceType('RAN') ? <AccordionItem>
                                <AccordionHeader targetId="7"><strong>Radio Access Network</strong></AccordionHeader>
                                <AccordionBody accordionId="7">
                                    {open.includes('7') ? <Row>
                                        <Col md={12}>
                                            <NeptuneAgGrid
                                                refId={'srf-mpn'}
                                                data={siteInfoServiceInfo['ranlist']}
                                                dataprops={radio_access_network_columns(handleRanRowClick)}
                                                paginated={false}
                                                itemsPerPage={10}
                                                searchable={false}
                                                exportable={false}
                                            />
                                        </Col>
                                    </Row> : null}<br />
                                    <form>
                                        <Row>
                                            <Col md={3}>
                                                <FormInput
                                                    label="Previous SRF#"
                                                    name="PreviousSRFNumber"
                                                    type="number"
                                                    control={ranControl}
                                                    errors={ranError}
                                                    rules={{ required: 'Previos SRF# is required' }}
                                                    disabled={!isPathNameFlag || ![2, 10].includes(srfDetails?.WFStatusCode)}
                                                />
                                            </Col>
                                            <Col md={2}>
                                                <Button style={{ marginTop: '31px' }} color="primary" disabled={!ranGetValues('PreviousSRFNumber')} onClick={() => handleCustomSubmit('RAN')}>Sync from Previous SRF</Button>
                                            </Col>
                                        </Row>
                                    </form>
                                </AccordionBody>
                            </AccordionItem> : null}
                            {showServiceType('Core') ? <AccordionItem>
                                <AccordionHeader targetId="8"><strong>Core</strong></AccordionHeader>
                                <AccordionBody accordionId="8">
                                    {open.includes('8') ? <Row>
                                        <Col md={12}>
                                            <NeptuneAgGrid
                                                refId={'srf-mpn'}
                                                data={siteInfoServiceInfo['corelist']}
                                                dataprops={core_columns(handleCoreClick)}
                                                paginated={false}
                                                itemsPerPage={10}
                                                searchable={false}
                                                exportable={false}
                                            />
                                        </Col>
                                    </Row> : null}<br />
                                    <form>
                                        <Row>
                                            <Col md={3}>
                                                <FormInput
                                                    label="Previous SRF#"
                                                    name="PreviousSRFNumber"
                                                    type="number"
                                                    control={coreControl}
                                                    errors={coreError}
                                                    rules={{ required: 'Previous SRF# is required' }}
                                                    disabled={(!isPathNameFlag || ![2, 10].includes(srfDetails?.WFStatusCode))}
                                                />
                                            </Col>
                                            <Col md={2}>
                                                <Button style={{ marginTop: '31px' }} color="primary" disabled={!coreGetValues('PreviousSRFNumber')} onClick={() => handleCustomSubmit('Core')}>Sync from Previous SRF</Button>
                                            </Col>
                                        </Row>
                                    </form>
                                </AccordionBody>
                            </AccordionItem> : null}
                            {showServiceType('Managed Network Service') || showServiceType('MNS') ? <AccordionItem>
                                <AccordionHeader targetId="9"><strong>Mobile Network Service</strong></AccordionHeader>
                                <AccordionBody accordionId="9">
                                    {open.includes('9') ? <Row>
                                        <Col md={12}>
                                            <NeptuneAgGrid
                                                refId={'srf-mpn'}
                                                data={siteInfoServiceInfo['mnslist']}
                                                dataprops={mns_columns(handleMnsRowClick)}
                                                paginated={false}
                                                itemsPerPage={10}
                                                searchable={false}
                                                exportable={false}
                                            />
                                        </Col>
                                    </Row> : null}
                                </AccordionBody>
                            </AccordionItem> : null}
                            {showServiceType('Managed Solutions') || showServiceType('MS') ? <AccordionItem>
                                <AccordionHeader targetId="10"><strong>Managed Solutions</strong></AccordionHeader>
                                <AccordionBody accordionId="10">
                                    {open.includes('10') ? <Row>
                                        <Col md={12}>
                                            <NeptuneAgGrid
                                                refId={'srf-mpn'}
                                                data={siteInfoServiceInfo['mslist']}
                                                dataprops={ms_columns(handleMsRowClick)}
                                                paginated={false}
                                                itemsPerPage={10}
                                                searchable={false}
                                                exportable={false}
                                            />
                                        </Col>
                                    </Row> : null}
                                </AccordionBody>
                            </AccordionItem> : null}
                            {(showServiceType('Voice') || showServiceType('PRI') || showServiceType('UCaaS') || showServiceType('Single') || showServiceType('BVE') || showServiceType('SIP Trunk')) ? <AccordionItem>
                                <AccordionHeader targetId="11"><strong>Voice</strong></AccordionHeader>
                                <AccordionBody accordionId="11">
                                    {open.includes('11') ? <Row>
                                        <Col md={12}>
                                            <NeptuneAgGrid
                                                refId={'srf-voice'}
                                                topActionButtons={srfDetails?.IsChannel !== 'CPQ' && srfDetails?.isActionBtnEnableFlag && <Button color="primary" onClick={() => setSelectedVoiceDetails({})}>Add</Button>}
                                                data={serviceTypeInfo?.['Voice']}
                                                dataprops={voice_columns((data) => setSelectedVoiceDetails(data))}
                                                paginated={false}
                                                itemsPerPage={10}
                                                searchable={false}
                                                exportable={false}
                                            />
                                        </Col>
                                    </Row> : null}
                                </AccordionBody>
                            </AccordionItem> : null}
                            {showServiceType('Mobile') ? <AccordionItem>
                                <AccordionHeader targetId="12"><strong>Mobile</strong></AccordionHeader>
                                <AccordionBody accordionId="12">
                                    {open.includes('12') ? <>
                                        <Row>
                                            <Col md={2}>
                                                <Label>Data Preparation</Label>
                                            </Col>
                                            <Col md={3}>
                                                <a href={site_address_template} rel="noreferrer" download={"site_address_template"} target="_blank">Download Template</a>
                                            </Col>
                                        </Row><br />
                                        <Row>
                                            <Col md={2}>
                                                <Label>Upload Site Address with Lat&Long(Excel)</Label>

                                            </Col>
                                            <Col md={4} style={{ display: 'flex' }}>
                                                <Input id="siteAddressFileUpload" accept=".xlsx, .xls" disabled={srfDetails?.StatusName !== 'Draft' || !srfDetails?.StatusName || mobileTemplate} type="file" onChange={validateColumnNames} />
                                                {mobileTemplate && <FontAwesomeIcon icon={faRemove} style={{ paddingLeft: '10px', paddingTop: '15px', cursor: 'pointer' }} color="red" onClick={clearMobileFile} />}
                                                {/* <span className={fileUploadMessage.type === 'success' ? 'file-upload-message-success' : 'file-upload-message-error'}>{fileUploadMessage.message}</span> */}
                                            </Col>
                                            {
                                                gcpSyncFlag === true &&
                                                <span style={{ color: "blue", fontWeight: "bold", fontSize: "10px", fontStyle: 'italic' }}>System will process the GCP integration in the scheduler. Upon sync, system will send the notification for further action.</span>
                                            }
                                            <span className="required">{gcpColumnsError}</span>
                                        </Row><br />
                                        {gcpData?.length > 0 ? <Row>
                                            <div className="pull-right">
                                                <Button color="primary" onClick={() => exportToExcel('gcp-table', 'download.xls')}>Export</Button>
                                            </div>
                                            <table border={1} id="gcp-table">
                                                <tbody>
                                                    <tr className="gcp-custom-table-header">
                                                        <th colSpan={4}>Neptune</th>
                                                        {showGcpColumns && <th colSpan={8}>GCP</th>}
                                                    </tr>
                                                    <tr className="gcp-custom-table-header">
                                                        {mobile_site_address_columns(showGcpColumns)?.map(h => (
                                                            !h?.hide && <td>{h?.headerName}</td>
                                                        ))}
                                                    </tr>
                                                    {gcpData?.map(m => (
                                                        <tr>
                                                            {mobile_site_address_columns(showGcpColumns)?.map(d => (
                                                                !d?.hide && <td style={{ color: (d?.field === 'GCPIndoorCoverage' || d?.field === 'GCPBlendedCoverage') && m?.[d?.field] === 'Good' ? 'green' : m?.[d?.field] === 'Poor' ? 'red' : '' }}>{m?.[d?.field]}</td>
                                                            ))}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </Row> : null}<br />
                                        <Row>
                                            <Col md={6}>
                                                {/* <Button color="primary" onClick={handleSync}>Sync Mobile coverage data from GCP</Button> */}
                                                {/* <Button color="primary" onClick={handleSync}>View GCP Sync Mobile Data</Button> */}
                                            </Col>
                                        </Row>
                                        <hr />
                                        <Row>
                                            <Col md={12}>
                                                <NeptuneAgGrid
                                                    refId={'srf-mobile'}
                                                    topActionButtons={srfDetails?.IsChannel !== 'CPQ' && (srfDetails?.isActionBtnEnableFlag && srfDetails?.isEnableAddUpdateBtnFlag) && <Button color="primary" onClick={() => setSelectedMobileDetails({})}>Add</Button>}
                                                    data={serviceTypeInfo?.['Mobile']}
                                                    dataprops={mobile_columns((data) => setSelectedMobileDetails(data))}
                                                    paginated={false}
                                                    itemsPerPage={10}
                                                    searchable={false}
                                                    exportable={false}
                                                />
                                            </Col>
                                        </Row>
                                    </> : null}
                                </AccordionBody>
                            </AccordionItem> : null}
                            {showServiceType('Wifi') ? <AccordionItem>
                                <AccordionHeader targetId="13"><strong>Wifi</strong></AccordionHeader>
                                <AccordionBody accordionId="13">
                                    {open.includes('13') ? <Row>
                                        <Col md={12}>
                                            <NeptuneAgGrid
                                                refId={'srf-Wifi'}
                                                topActionButtons={srfDetails?.IsChannel !== 'CPQ' && (srfDetails?.isActionBtnEnableFlag && srfDetails?.isEnableAddUpdateBtnFlag) && <Button color="primary" onClick={() => setSelectedWifiDetails({})}>Add</Button>}
                                                data={serviceTypeInfo?.['Wifi']}
                                                dataprops={wifi_columns((data) => setSelectedWifiDetails(data))}
                                                paginated={false}
                                                itemsPerPage={10}
                                                searchable={false}
                                                exportable={false}
                                            />
                                        </Col>
                                    </Row> : null}
                                </AccordionBody>
                            </AccordionItem> : null}
                            {showServiceType('IOT') ? <AccordionItem>
                                <AccordionHeader targetId="14"><strong>IOT</strong></AccordionHeader>
                                <AccordionBody accordionId="14">
                                    {open.includes('14') ? <Row>
                                        <Col md={12}>
                                            <NeptuneAgGrid
                                                refId={'srf-iot'}
                                                topActionButtons={srfDetails?.IsChannel !== 'CPQ' && (srfDetails?.isActionBtnEnableFlag && srfDetails?.isEnableAddUpdateBtnFlag) && <Button color="primary" onClick={() => setSelectedIOTDetails({})}>Add</Button>}
                                                data={serviceTypeInfo?.['IOT']}
                                                dataprops={iot_columns((data) => setSelectedIOTDetails(data))}
                                                paginated={false}
                                                itemsPerPage={10}
                                                searchable={false}
                                                exportable={false}
                                            />
                                        </Col>
                                    </Row> : null}
                                </AccordionBody>
                            </AccordionItem> : null}
                            {showServiceType('CPE') ? <AccordionItem>
                                <AccordionHeader targetId="15"><strong>CPE</strong></AccordionHeader>
                                <AccordionBody accordionId="15">
                                    {open.includes('15') ? <Row>
                                        <Col md={12}>
                                            <NeptuneAgGrid
                                                refId={'srf-iot'}
                                                topActionButtons={srfDetails?.IsChannel !== 'CPQ' && (srfDetails?.isActionBtnEnableFlag && srfDetails?.isEnableAddUpdateBtnFlag) && <Button color="primary" onClick={() => setSelectedCPEDetails({})}>Add</Button>}
                                                data={serviceTypeInfo?.['CPE']}
                                                dataprops={cpe_columns((data) => setSelectedCPEDetails(data))}
                                                paginated={false}
                                                itemsPerPage={10}
                                                searchable={false}
                                                exportable={false}
                                            />
                                        </Col>
                                    </Row> : null}
                                </AccordionBody>
                            </AccordionItem> : null}
                            {showServiceType('Security') ? <AccordionItem>
                                <AccordionHeader targetId="16"><strong>Security</strong></AccordionHeader>
                                <AccordionBody accordionId="16">
                                    {open.includes('16') ? <Row>
                                        <Col md={12}>
                                            <NeptuneAgGrid
                                                refId={'srf-security'}
                                                topActionButtons={srfDetails?.IsChannel !== 'CPQ' && (srfDetails?.isActionBtnEnableFlag && srfDetails?.isEnableAddUpdateBtnFlag) && <Button color="primary" onClick={() => setSelectedSecurityDetails({})}>Add</Button>}
                                                data={serviceTypeInfo?.['Security']}
                                                dataprops={security_columns((data) => setSelectedSecurityDetails(data))}
                                                paginated={false}
                                                itemsPerPage={10}
                                                searchable={false}
                                                exportable={false}
                                            />
                                        </Col>
                                    </Row> : null}
                                </AccordionBody>
                            </AccordionItem> : null}
                            {showServiceType('Cloud Security') ? <AccordionItem>
                                <AccordionHeader targetId="17"><strong>Cloud Security</strong></AccordionHeader>
                                <AccordionBody accordionId="17">
                                    {open.includes('17') ? <Row>
                                        <Col md={12}>
                                            <NeptuneAgGrid
                                                refId={'srf-cloudsecurity'}
                                                topActionButtons={srfDetails?.IsChannel !== 'CPQ' && (srfDetails?.isActionBtnEnableFlag && srfDetails?.isEnableAddUpdateBtnFlag) && <Button color="primary" onClick={() => setSelectedCouldSecurityDetails({})}>Add</Button>}
                                                data={serviceTypeInfo?.['Cloud Security']}
                                                dataprops={cloudsecurity_columns((data) => setSelectedCouldSecurityDetails(data))}
                                                paginated={false}
                                                itemsPerPage={10}
                                                searchable={false}
                                                exportable={false}
                                            />
                                        </Col>
                                    </Row> : null}
                                </AccordionBody>
                            </AccordionItem> : null}
                            {showAAV ? <><AccordionItem>
                                <AccordionHeader targetId="18"><strong>Address</strong></AccordionHeader>
                                <AccordionBody accordionId="18">
                                    {open.includes('18') ? <Row>
                                        <Col md={12}>
                                            <NeptuneAgGrid
                                                refId={'srf-address'}
                                                topActionButtons={srfDetails?.IsChannel !== 'CPQ' && (srfDetails?.isActionBtnEnableFlag && srfDetails?.isEnableAddUpdateBtnFlag) && <Button color="primary" onClick={() => handleOnClickAddress(null)}>Add</Button>}
                                                data={addressList}
                                                dataprops={address_columns(handleOnClickAddress)}
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
                                    <AccordionHeader targetId="19"><strong>VAS</strong></AccordionHeader>
                                    <AccordionBody accordionId="19">
                                        {open.includes('19') ? <Row>
                                            <Col md={12}>
                                                <NeptuneAgGrid
                                                    refId={'srf-vas'}
                                                    topActionButtons={srfDetails?.IsChannel !== 'CPQ' && (srfDetails?.isActionBtnEnableFlag && srfDetails?.isEnableAddUpdateBtnFlag) && <Button color="primary" onClick={() => handleOnClickVas(null)}>Add VAS</Button>}
                                                    data={vasList}
                                                    dataprops={vas_columns(handleOnClickVas)}
                                                    paginated={false}
                                                    itemsPerPage={10}
                                                    searchable={false}
                                                    exportable={false}
                                                />
                                            </Col>
                                        </Row> : null}
                                    </AccordionBody>
                                </AccordionItem>
                                {srfDetails?.IsChannel === 'CPQ' && <AccordionItem>
                                    <AccordionHeader targetId="20"><strong>Specific Info</strong></AccordionHeader>
                                    <AccordionBody accordionId="20">
                                        {open.includes('20') ? <Row>
                                            <Col md={12}>
                                                <NeptuneAgGrid
                                                    refId={'srf-specific'}
                                                    data={specificInfoList}
                                                    dataprops={specificinfo_columns}
                                                    paginated={false}
                                                    itemsPerPage={10}
                                                    searchable={false}
                                                    exportable={false}
                                                />
                                            </Col>
                                        </Row> : null}
                                    </AccordionBody>
                                </AccordionItem>}
                                <AccordionItem>
                                    <AccordionHeader targetId="21"><strong>HLD Group Assignment & Approval/Rejection</strong></AccordionHeader>
                                    <AccordionBody accordionId="21">
                                        {
                                            (srfDetails?.StatusName !== 'Draft' && srfDetails?.StatusName !== 'SRF Rejected') || srfDetails?.StatusName === '' || srfDetails?.StatusName === null ?
                                                <>
                                                    {/* <div className="srf-inner-title">
                                                    HLD Group Assignment
                                                </div> */}
                                                    {open.includes('21') && dropdownOptions ? <Row>
                                                        <Col md={12}>
                                                            {memoizedGrid}
                                                        </Col>
                                                        {errorMessages?.hldAssignment && <span className="required">{errorMessages?.hldAssignment}</span>}
                                                    </Row> : null}
                                                    <br />
                                                    {showRegion ? <Row>
                                                        <Col md={4}>
                                                            <FormGroup>
                                                                <Label>Region<span className="required">*</span></Label>
                                                                <DropdownList
                                                                    data={srfDropdownOptions?.SRFDROPDOWNVALUES?.['SRF Region']?.dropdownValue}
                                                                    onChange={handleSetRegion}
                                                                    disabled={(disableForm || !srfDetails?.isActionBtnEnableFlag) && !isManualCreatorRole}
                                                                />
                                                                {errorMessages?.region && <span className="required">{errorMessages?.region}</span>}
                                                            </FormGroup>
                                                        </Col>
                                                    </Row> : null}
                                                    <Row>
                                                        <Col md={12}>
                                                            <FormGroup>
                                                                <Label for="Remarks">Additional Remarks{srfDetails?.StatusName === 'Assigned' && <span className="required">*</span>}</Label>
                                                                <Input
                                                                    type="textarea"
                                                                    rows={4}
                                                                    id="Remarks"
                                                                    value={remarks}
                                                                    onChange={handleRemarksSave}
                                                                    disabled={(!location.pathname.includes('srfinbox') || srfDetails?.StatusName !== 'Assigned') && srfDetails?.StatusName !== 'Closed'}
                                                                />
                                                                {errorMessages?.remarks && <span className="required">{errorMessages?.remarks}</span>}
                                                            </FormGroup>
                                                        </Col>
                                                    </Row>
                                                    {srfDetails?.isActionBtnEnableFlag && <>
                                                        {/* Status 5 is closed */}
                                                        {
                                                            (srfDetails?.WFStatusCode !== 5 && !location.pathname.includes('mygroup')) &&
                                                            <div>
                                                                {
                                                                    ((srfDetails?.WFStatusCode === 0 || srfDetails?.WFStatusCode === 1) && srfDetails?.IsChannel === 'Neptune') &&
                                                                    <><Button color="primary">Submit</Button>&nbsp;</>
                                                                }
                                                                {
                                                                    (srfDetails?.WFStatusCode === 2) &&
                                                                    <><Button color="primary" onClick={() => handleConfirmation('Approve')}>Approve</Button>&nbsp;</>
                                                                }
                                                                {
                                                                    (srfDetails?.WFStatusCode === 2 && srfDetails?.IsChannel === 'Neptune') &&
                                                                    <><Button color="danger" onClick={() => handleConfirmation('Reject')}>Reject (Manual SRF)</Button>&nbsp;</>
                                                                }
                                                                {
                                                                    (((srfDetails?.WFStatusCode === 2) && srfDetails?.IsChannel === 'CPQ')) &&
                                                                    <><Button color="danger" onClick={() => handleConfirmation('Reject to CPQ')}>Reject to CPQ</Button>&nbsp;</>
                                                                }
                                                                {
                                                                    (((srfDetails?.WFStatusCode === 9) && srfDetails?.IsChannel === 'CPQ')) &&
                                                                    <><Button color="primary" onClick={() => handleConfirmation('Resubmit MPN MiniTaks')}>Resubmit</Button>&nbsp;</>
                                                                }
                                                            </div>

                                                        }
                                                        {
                                                            (srfDetails?.WFStatusCode === 5 && srfDetails?.IsChannel !== 'CPQ') &&
                                                            < div >
                                                                <Button color="primary" onClick={() => handleRejectedSrf('ReOpen')}>Reopen to GateKeeper</Button>
                                                            </div>
                                                        }
                                                    </>}
                                                </> :
                                                <>
                                                    <Row>
                                                        <Col md={12}>
                                                            <FormGroup>
                                                                <Label for="Remarks">Remarks</Label>
                                                                <Input
                                                                    type="textarea"
                                                                    rows={4}
                                                                    id="Remarks"
                                                                    disabled={!isPathNameFlag}
                                                                    value={manualRemarks}
                                                                    onChange={(e) => setManualRemarks(e.target.value)}
                                                                />
                                                            </FormGroup>
                                                        </Col>
                                                    </Row>
                                                    {(srfDetails?.isActionBtnEnableFlag && srfDetails?.StatusName !== 'SRF Rejected') ? <div>
                                                        <Button color="primary" onClick={() => handleConfirmation('Save as Draft')}>Save as Draft</Button>&nbsp;
                                                        <Button color="primary" onClick={() => handleConfirmation('Submit')}>Submit</Button>
                                                    </div> : (srfDetails?.isActionBtnEnableFlag && srfDetails?.StatusName === 'SRF Rejected') ?
                                                        <div>
                                                            <Button color="primary" onClick={() => handleRejectedSrf('ReOpen')}>Reopen to GateKeeper</Button>&nbsp;
                                                            <Button color="danger" onClick={() => handleRejectedSrf('Drop')}>Drop/Delete</Button>
                                                        </div> :
                                                        null
                                                    }
                                                </>
                                        }
                                    </AccordionBody>
                                </AccordionItem>
                            </> : null}
                            {hldAssignmentGroupList?.length > 0 ? <AccordionItem>
                                <AccordionHeader targetId="22"><strong>Gatekeeper File Upload</strong></AccordionHeader>
                                <AccordionBody accordionId="22">
                                    {open.includes('22') && dropdownOptions ? <Row>
                                        <Col md={6}>
                                            <NeptuneAgGrid
                                                refId={'srf-specific'}
                                                data={hldAssignmentGroupList}
                                                dataprops={hldGroupAssignment_approver_columns(srfDetails?.IntegrationID, false)}
                                                paginated={false}
                                                itemsPerPage={10}
                                                searchable={false}
                                                exportable={false}
                                            />
                                        </Col>
                                        {errorMessages?.hldAssignment && <span className="required">{errorMessages?.hldAssignment}</span>}
                                    </Row> : null}
                                </AccordionBody>
                            </AccordionItem> : null}
                            <AccordionItem>
                                <AccordionHeader targetId="23"><strong>Workflow</strong></AccordionHeader>
                                <AccordionBody accordionId="23">
                                    {open.includes('23') ? <Row>
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
                            {srfDetails?.IsChannel !== 'Neptune' ? <AccordionItem>
                                <AccordionHeader targetId="24"><strong>CPQ Log</strong></AccordionHeader>
                                <AccordionBody accordionId="24">
                                    {open.includes('24') ? <Row>
                                        <Col md={12}>
                                            <NeptuneAgGrid
                                                refId={'srf-cpqList'}
                                                data={cpqList}
                                                dataprops={cpqlog_columns}
                                                paginated={false}
                                                itemsPerPage={10}
                                                searchable={false}
                                                exportable={false}
                                            />
                                        </Col>
                                    </Row> : null}
                                </AccordionBody>
                            </AccordionItem> :
                                <AccordionItem>
                                    <AccordionHeader targetId="25"><strong>Neptune Log</strong></AccordionHeader>
                                    <AccordionBody accordionId="25">
                                        {open.includes('25') ? <Row>
                                            <Col md={12}>
                                                <NeptuneAgGrid
                                                    refId={'srf-workflow'}
                                                    data={neptuneList}
                                                    dataprops={neptune_log_columns}
                                                    paginated={false}
                                                    itemsPerPage={10}
                                                    searchable={false}
                                                    exportable={false}
                                                />
                                            </Col>
                                        </Row> : null}
                                    </AccordionBody>
                                </AccordionItem>}
                            <AccordionItem>
                                <AccordionHeader targetId="26"><strong>Email Logs</strong></AccordionHeader>
                                <AccordionBody accordionId="26">
                                    {open.includes('26') ? <Row>
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
            {showAddressDetails && <AddressDetailsModal
                disableForm={disableForm}
                isManualCreatorRole={isManualCreatorRole}
                isActionBtnEnableFlag={srfDetails?.isActionBtnEnableFlag}
                isEnableAddUpdateBtnFlag={srfDetails?.isEnableAddUpdateBtnFlag}
                isChannel={srfDetails?.IsChannel}
                dataInfoHandler={dataInfoHandler}
                serviceTypeInfo={serviceTypeInfo}
                isOpen={showAddressDetails}
                selectedAddress={selectedAddress}
                onClose={handleAddressClose}
                userInfo={userInfo?.user}
                SDWAN={generateSrfWatch('TypeofService').includes('SDWAN')}
                wfStatusCode={srfDetails?.WFStatusCode}
            />
            }
            {
                showVasDetails && <VASDetailsModal
                    disableForm={disableForm}
                    isManualCreatorRole={isManualCreatorRole}
                    isActionBtnEnableFlag={srfDetails?.isActionBtnEnableFlag}
                    isEnableAddUpdateBtnFlag={srfDetails?.isEnableAddUpdateBtnFlag}
                    isChannel={srfDetails?.IsChannel}
                    vasSubmitHandler={vasSubmitHandler}
                    serviceTypeInfo={serviceTypeInfo}
                    isOpen={showVasDetails}
                    selectedVas={selectedVas}
                    onClose={handleVasClose}
                    IntegrationID={srfDetails?.IntegrationID}
                    SRFNumber={srfDetails?.SRFNumber}
                />
            }
            {
                showServiceTypeDetails && <ServiceTypeDetailsModal
                    reloadPage={reloadPage}
                    ismpnService={ismpnService}
                    isActionBtnEnableFlag={srfDetails?.isActionBtnEnableFlag}
                    isEnableAddUpdateBtnFlag={srfDetails?.isEnableAddUpdateBtnFlag}
                    disableForm={disableForm}
                    isManualCreatorRole={isManualCreatorRole}
                    serviceTypeDataInfoHandler={serviceTypeDataInfoHandler}
                    isChannel={srfDetails?.IsChannel}
                    WorkflowId={srfDetails?.WorkflowId}
                    IntegrationID={srfDetails?.IntegrationID}
                    attachments={attachments}
                    panelName={panelName}
                    isOpen={showServiceTypeDetails}
                    selectedServiceType={selectedServiceType}
                    onClose={handleServiceTypeClose}
                />
            }
            {
                selectedVoiceDetails && <VoiceDetailsModal
                    disableForm={disableForm}
                    isManualCreatorRole={isManualCreatorRole}
                    isActionBtnEnableFlag={srfDetails?.isActionBtnEnableFlag}
                    isEnableAddUpdateBtnFlag={srfDetails?.isEnableAddUpdateBtnFlag}
                    isChannel={srfDetails?.IsChannel}
                    serviceTypeDataInfoHandler={serviceTypeDataInfoHandler}
                    WorkflowId={state?.WorkflowId || srfDetails?.WorkflowId}
                    isOpen={selectedVoiceDetails ? true : false}
                    selectedVoiceDetails={selectedVoiceDetails}
                    onClose={() => setSelectedVoiceDetails(null)}
                />
            }
            {
                selectedMobileDetails && <MobileDetailsModal
                    reloadPage={reloadPage}
                    disableForm={disableForm}
                    isManualCreatorRole={isManualCreatorRole}
                    isActionBtnEnableFlag={srfDetails?.isActionBtnEnableFlag}
                    isEnableAddUpdateBtnFlag={srfDetails?.isEnableAddUpdateBtnFlag}
                    isChannel={srfDetails?.IsChannel}
                    attachments={attachments}
                    IntegrationID={srfDetails?.IntegrationID}
                    serviceTypeDataInfoHandler={serviceTypeDataInfoHandler}
                    isOpen={selectedMobileDetails ? true : false}
                    srfNumber={srfDetails?.SRFNumber}
                    selectedMobileDetails={selectedMobileDetails}
                    onClose={() => setSelectedMobileDetails(null)}
                />
            }
            {
                selectedWifiDetails && <WifiDetailsModal
                    reloadPage={reloadPage}
                    disableForm={disableForm}
                    isManualCreatorRole={isManualCreatorRole}
                    isActionBtnEnableFlag={srfDetails?.isActionBtnEnableFlag}
                    isEnableAddUpdateBtnFlag={srfDetails?.isEnableAddUpdateBtnFlag}
                    isChannel={srfDetails?.IsChannel}
                    serviceTypeDataInfoHandler={serviceTypeDataInfoHandler}
                    WorkflowId={state?.WorkflowId || srfDetails?.WorkflowId}
                    IntegrationID={state?.IntegrationID}
                    attachments={attachments}
                    isOpen={selectedWifiDetails ? true : false}
                    selectedWifiDetails={selectedWifiDetails}
                    onClose={() => setSelectedWifiDetails(null)}
                />
            }
            {
                selectedIOTDetails && <IOTDetailsModal
                    reloadPage={reloadPage}
                    disableForm={disableForm}
                    isManualCreatorRole={isManualCreatorRole}
                    isActionBtnEnableFlag={srfDetails?.isActionBtnEnableFlag}
                    isEnableAddUpdateBtnFlag={srfDetails?.isEnableAddUpdateBtnFlag}
                    isChannel={srfDetails?.IsChannel}
                    serviceTypeDataInfoHandler={serviceTypeDataInfoHandler}
                    WorkflowId={state?.WorkflowId || srfDetails?.WorkflowId}
                    IntegrationID={state?.IntegrationID}
                    attachments={attachments}
                    isOpen={selectedIOTDetails ? true : false}
                    selectedIOTDetails={selectedIOTDetails}
                    onClose={() => setSelectedIOTDetails(null)}
                />
            }
            {
                selectedCPEDetails && <CPEDetailsModal
                    disableForm={disableForm}
                    isManualCreatorRole={isManualCreatorRole}
                    isActionBtnEnableFlag={srfDetails?.isActionBtnEnableFlag}
                    isEnableAddUpdateBtnFlag={srfDetails?.isEnableAddUpdateBtnFlag}
                    isChannel={srfDetails?.IsChannel}
                    serviceTypeDataInfoHandler={serviceTypeDataInfoHandler}
                    isOpen={selectedCPEDetails ? true : false}
                    selectedCPEDetails={selectedCPEDetails}
                    onClose={() => setSelectedCPEDetails(null)}
                />
            }
            {
                selectedSecurityDetails && <SecurityDetailsModal
                    disableForm={disableForm}
                    isManualCreatorRole={isManualCreatorRole}
                    isActionBtnEnableFlag={srfDetails?.isActionBtnEnableFlag}
                    isEnableAddUpdateBtnFlag={srfDetails?.isEnableAddUpdateBtnFlag}
                    isChannel={srfDetails?.IsChannel}
                    serviceTypeDataInfoHandler={serviceTypeDataInfoHandler}
                    isOpen={selectedSecurityDetails ? true : false}
                    selectedSecurityDetails={selectedSecurityDetails}
                    onClose={() => setSelectedSecurityDetails(null)}
                />
            }
            {
                selectedCloudSecurityDetails && <CloudSecurityDetailsModal
                    disableForm={disableForm}
                    isManualCreatorRole={isManualCreatorRole}
                    isActionBtnEnableFlag={srfDetails?.isActionBtnEnableFlag}
                    isEnableAddUpdateBtnFlag={srfDetails?.isEnableAddUpdateBtnFlag}
                    isChannel={srfDetails?.IsChannel}
                    serviceTypeDataInfoHandler={serviceTypeDataInfoHandler}
                    isOpen={selectedCloudSecurityDetails ? true : false}
                    selectedCloudSecurityDetails={selectedCloudSecurityDetails}
                    onClose={() => setSelectedCouldSecurityDetails(null)}
                />
            }
            {
                selectedMPNDetails && <MPNDetailsModal
                    disableForm={disableForm}
                    dataInfoHandler={dataInfoHandler}
                    isChannel={srfDetails?.IsChannel}
                    isPathNameFlag={isPathNameFlag}
                    wfStatusCode={srfDetails?.WFStatusCode}
                    isOpen={selectedMPNDetails ? true : false}
                    selectedMPNDetails={selectedMPNDetails}
                    onClose={() => setSelectedMPNDetails(false)}
                />
            }
            {
                selectedRANDetails && <RANDetailsModal
                    disableForm={disableForm}
                    dataInfoHandler={dataInfoHandler}
                    isChannel={srfDetails?.IsChannel}
                    isPathNameFlag={isPathNameFlag}
                    wfStatusCode={srfDetails?.WFStatusCode}
                    isOpen={selectedRANDetails ? true : false}
                    selectedRANDetails={selectedRANDetails}
                    onClose={() => setSelectedRANDetails(false)}
                />
            }
            {
                selectedCoreDetails && <CoreDetailsModal
                    disableForm={disableForm}
                    dataInfoHandler={dataInfoHandler}
                    isChannel={srfDetails?.IsChannel}
                    isPathNameFlag={isPathNameFlag}
                    wfStatusCode={srfDetails?.WFStatusCode}
                    isOpen={selectedCoreDetails ? true : false}
                    selectedCoreDetails={selectedCoreDetails}
                    onClose={() => setSelectedCoreDetails(false)}
                />
            }
        </>
    )
}

export default InboxSearchView;