import { MultiSelectCellRenderer } from "../../../../components/multi-select-renderer"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEye } from "@fortawesome/free-solid-svg-icons"
import { EditableCellRenderer } from "../../srf-hld/financial-modal/config/columns"
import Swal from "sweetalert2"
import FileUploadRenderer from "../../../../components/file-upload-renderer"

export const workflow_columns = [
    { headerName: 'Status Code', field: 'WFStatusCode' },
    { headerName: 'Status Name', field: 'StatusName' },
    { headerName: 'Group Name', field: 'GroupName' },
    { headerName: 'Inbox Assigned To', field: 'AssignedTo' },
    { headerName: 'Latest Flag', field: 'LatestFlag' },
    { headerName: 'Comments', field: 'Remarks' },
    { headerName: 'Created By', field: 'CreatedBy' },
    { headerName: 'Created Date', field: 'CreatedDate' },
    { headerName: 'Modified By', field: 'ModifiedBy' },
    { headerName: 'Modified Date', field: 'ModifiedDate' },
    { headerName: 'Reopen By', field: 'ReopenBy' },
    { headerName: 'Reopen Date', field: 'ReopenDate' }
]

export const email_log_columns = [
    { headerName: 'Date & Time', field: 'EmailDate', minWidth: 250 },
    { headerName: 'To Email', field: 'ToEmail', minWidth: 250 },
    { headerName: 'CC Email', field: 'CCEmail', minWidth: 250 },
    { headerName: 'Subject', field: 'EmailSubject', minWidth: 250 },
    {
        headerName: 'Body', field: 'EmailBody', minWidth: 300, cellRenderer: (v) => {
            return <div dangerouslySetInnerHTML={{ __html: v?.data?.EmailBody }}></div>
        }
    }
]

export const voice_columns = (handleConfigModal) => {
    return [
        {
            field: 'LineItemId', headerName: 'Line Item ID', cellRenderer: (v) => (
                <span className='link-style'
                    onClick={() => handleConfigModal(v.data)}
                >
                    {v.value}
                </span>
            )
        },
        { headerName: 'Contract Period', field: 'ContractPeriod' },
        { headerName: 'Redundancy', field: 'Redundancy' },
        { headerName: 'Infra Redundancy', field: 'InfraRedundancy' }
    ]
}

export const service_dtls_columns = (handleConfigModal, isMpnService) => {
    return [
        {
            field: 'LineItemId', headerName: 'Line Item ID', minWidth: 250, cellRenderer: (v) => (
                <span className='link-style'
                    onClick={() => handleConfigModal(v.data)}
                >
                    {v.value}
                </span>
            )
        },
        { headerName: 'MPN ID', hide: !isMpnService, field: 'MPNID' },
        { headerName: 'MPN Link Type', hide: !isMpnService, field: 'MPNType' },
        { headerName: 'Contract Period', field: 'ContractPeriod' },
        { headerName: 'Redundancy', field: 'Redundancy' },
        { headerName: 'No.of IP', field: 'NoOfIP' }
    ]
}

export const mobile_columns = (handleConfigModal) => [
    {
        field: 'LineItemId', headerName: 'Line Item ID', minWidth: 250, cellRenderer: (v) => (
            <span className='link-style'
                onClick={() => handleConfigModal(v.data)}
            >
                {v.value}
            </span>
        )
    },
    { headerName: 'Mobile', field: 'Mobile' }
]

export const wifi_columns = (handleConfigModal) => [
    {
        field: 'LineItemId', headerName: 'Line Item ID', minWidth: 250, cellRenderer: (v) => (
            <span className='link-style'
                onClick={() => handleConfigModal(v.data)}
            >
                {v.value}
            </span>
        )
    },
    { headerName: 'No of AP', field: 'WifiNoofAP' },
    { headerName: 'Type of AP', field: 'WifiTypeofAP' },
    { headerName: 'Remarks', field: 'WifiRemarks' },
    { headerName: 'Service Address', field: 'WifiServiceAddress' }
]

export const iot_columns = (handleConfigModal) => [
    {
        field: 'LineItemId', headerName: 'Line Item ID', minWidth: 250, cellRenderer: (v) => (
            <span className='link-style'
                onClick={() => handleConfigModal(v.data)}
            >
                {v.value}
            </span>
        )
    },
    { headerName: 'IOT', field: 'IOT' },
    { headerName: 'Device Details', field: 'DeviceDetails' },
    { headerName: 'Service Address', field: 'ServiceAddress' },
    { headerName: 'Contract Period (In Years)', field: 'ContractPeriod' },
    { headerName: 'Contract Type', field: 'ContractType' },
]

export const cpe_columns = (handleConfigModal) => [
    {
        field: 'LineItemId', headerName: 'Line Item ID', minWidth: 250, cellRenderer: (v) => (
            <span className='link-style'
                onClick={() => handleConfigModal(v.data)}
            >
                {v.value}
            </span>
        )
    },
    { headerName: 'Managed Services Devices Proposed', field: 'CPEManagedServicesDevicesProposed' },
    { headerName: 'Configuration QoS/CoS requirement', field: 'CPEInfo_Config_QoS_CoS_Requirement' },
    { headerName: 'Contract Period (In Years)', field: 'ContractPeriod' }
]

export const security_columns = (handleConfigModal) => [
    {
        field: 'LineItemId', headerName: 'Line Item ID', minWidth: 250, cellRenderer: (v) => (
            <span className='link-style'
                onClick={() => handleConfigModal(v.data)}
            >
                {v.value}
            </span>
        )
    },
    { headerName: 'Security', field: 'Security' }
]

export const cloudsecurity_columns = (handleConfigModal) => [
    {
        field: 'LineItemId', headerName: 'Line Item ID', minWidth: 250, cellRenderer: (v) => (
            <span className='link-style'
                onClick={() => handleConfigModal(v.data)}
            >
                {v.value}
            </span>
        )
    },
    { headerName: 'Bundle', field: 'CloudSecurityBundle' }
]

export const address_columns = (handleConfigModal) => {
    return [
        {
            field: 'LineItemId', headerName: 'Line Item ID', minWidth: 250, cellRenderer: (v) => (
                <span className='link-style'
                    onClick={() => handleConfigModal(v.data)}
                >
                    {v.value}
                </span>
            )
        },
        { headerName: 'Service Type', field: 'ServiceType', minWidth: 170 },
        { headerName: 'Site Seq Id', field: 'SiteSeq', minWidth: 150 },
        { headerName: 'Site Name', field: 'SiteName', minWidth: 150 },
        { headerName: 'BandminWidth In Mbps', field: 'BandwidthInMbps', minWidth: 150 },
        { headerName: 'Building Type', field: 'BuildingType', minWidth: 150 },
        { headerName: 'Building Name', field: 'BuildingName', minWidth: 150 },
        { headerName: 'Address Line1', field: 'AddressLine1', minWidth: 150 },
        { headerName: 'Address Line2', field: 'AddressLine2', minWidth: 150 },
        { headerName: 'Address Line3', field: 'AddressLine3', minWidth: 150 },
        { headerName: 'City', field: 'City', minWidth: 150 },
        { headerName: 'State', field: 'State', minWidth: 150 },
        { headerName: 'Country', field: 'Country', minWidth: 150 },
        { headerName: 'Post Code', field: 'PostCode', minWidth: 150 },
        { headerName: 'SLA', field: 'SLA', minWidth: 150 },
        { headerName: 'Transmission', field: 'Transmission', minWidth: 150 },
        { headerName: 'Transmission Type', field: 'TransmissionType', minWidth: 150 },
        { headerName: 'Latitude', field: 'Latitude', minWidth: 150 },
        { headerName: 'Longitude', field: 'Longitude', minWidth: 150 },
        { headerName: 'Uplink BandminWidth In Mbps', field: 'UplinkBandwidthInMbps', minWidth: 150 },
        { headerName: 'Downlink BandminWidth In Mbps', field: 'DownlinkBandwidthInMbps', minWidth: 150 }
    ]
};

export const vas_columns = (handleConfigModal) => {
    return [
        {
            field: 'LineItemId', headerName: 'Line Item ID', minWidth: 250, cellRenderer: (v) => (
                <span className='link-style'
                    onClick={() => handleConfigModal(v.data)}
                >
                    {v.value}
                </span>
            )
        },
        { headerName: 'Service Type', field: 'ServiceType' },
        { headerName: 'Site Seq Id', field: 'SiteSeq' },
        { headerName: 'VAS Name', field: 'vasname' },
        { headerName: 'VAS Type', field: 'vastype' },
        { headerName: 'Model', field: 'vasmodel' }
    ]
}

export const specificinfo_columns = [
    { headerName: 'Line Item ID', field: 'LineItemId' },
    { headerName: 'Service Type', field: 'ServiceType' },
    { headerName: 'Name', field: 'name' },
    { headerName: 'Value', field: 'value' }
]

export const hldGroupAssignment_columns = (dropdownOptions, handleDataChange, hideActions, IntegrationID, allowUpload) => {
    return [
        {
            headerName: 'Service Types', minWidth: 200,
            field: 'ServiceType'
        },
        {
            headerName: 'Mandatory Groups', field: 'MandatoryGroup',
            cellRenderer: MultiSelectCellRenderer,
            handleDataChange: handleDataChange,
            cellEditorPopup: true,
            width: 400,
            suppressSizeToFit: true,
            disabled: !hideActions?.isActionBtnEnableFlag || hideActions?.WFStatusCode !== 2,
            multiSelectOptions: dropdownOptions?.['SRF HLD Group Region'] //['SRF HLD Group']
        },
        {
            headerName: 'Optional Groups',
            field: 'OptionGroup',
            cellRenderer: MultiSelectCellRenderer,
            handleDataChange: handleDataChange,
            suppressSizeToFit: true,
            width: 400,
            disabled: !hideActions?.isActionBtnEnableFlag || hideActions?.WFStatusCode !== 2,
            multiSelectOptions: dropdownOptions?.['SRF HLD Group Optional Region']//['SRF HLD Optional Group']
        },
        {
            headerName: 'File Upload',
            field: 'upload',
            cellRenderer: FileUploadRenderer,
            disabled: !hideActions?.isActionBtnEnableFlag || hideActions?.WFStatusCode !== 2,
            width: 200,
            suppressSizeToFit: true,
            IntegrationID: IntegrationID,
            allowUpload
        },
        {
            headerName: 'Remarks', field: 'GroupAssignmentRemarks',
            type: 'textarea',
            cellRenderer: EditableCellRenderer,
            handleDataChange: handleDataChange,
            minWidth: 400,
            disabled: !hideActions?.isActionBtnEnableFlag || hideActions?.WFStatusCode !== 2,
            cellEditorPopup: true,
            //multiSelectOptions: dropdownOptions?.['SRF HLD Group']
        },
    ]
}

export const hldGroupAssignment_approver_columns = (IntegrationID, allowUpload) => {
    return [
        {
            headerName: 'Service Types',
            field: 'ServiceType'
        },
        {
            headerName: 'File Upload',
            field: 'upload',
            cellRenderer: FileUploadRenderer,
            IntegrationID: IntegrationID,
            allowUpload
        }
    ]
}


const handleTooltipModal = (content) => {
    Swal.fire({
        title: "",
        html: `<div>${content}</div>`,
        showClass: {
            popup: '', // Disable show animation
            backdrop: '', // Disable backdrop animation
        },
        hideClass: {
            popup: '', // Disable hide animation
        },
    });
}

export const neptune_log_columns = [
    { headerName: 'Channel Reference ID', field: 'SRFChannelReferenceId', minWidth: 400 },
    {
        headerName: 'Parameters', field: 'Parameters', minWidth: 250, cellRenderer: (v) => (
            <>
                <FontAwesomeIcon
                    fontSize={'18px'}
                    color="#0d6efd"
                    className="font-awesome"
                    icon={faEye}
                    onClick={() => handleTooltipModal(v?.data?.Parameters)}
                />
            </>
        )
    },
    {
        headerName: 'Response', field: 'Response', minWidth: 250, cellRenderer: (v) => (
            <>
                <FontAwesomeIcon
                    fontSize={'18px'}
                    color="#0d6efd"
                    className="font-awesome"
                    icon={faEye}
                    onClick={() => handleTooltipModal(v?.data?.Response)}
                />
            </>
        )
    },
    { headerName: 'Host Name', field: 'HostName', minWidth: 250 },
    { headerName: 'IP Address', field: 'IPAddress', minWidth: 250 },
    { headerName: 'Created By', field: 'CreatedBy', minWidth: 150 },
    { headerName: 'Created Date', field: 'CreatedDate', minWidth: 150 }
]

export const cpqlog_columns = () => {
    return [
        { headerName: 'Channel Reference ID', field: 'SRFChannelReferenceId', minWidth: 400 },
        {
            headerName: 'Parameters', field: 'Parameters', minWidth: 250, cellRenderer: (v) => (
                <>
                    <FontAwesomeIcon
                        fontSize={'18px'}
                        color="#0d6efd"
                        className="font-awesome"
                        icon={faEye}
                        onClick={() => handleTooltipModal(v?.data?.Parameters)}
                    />
                </>
            )
        },
        {
            headerName: 'Response', field: 'Response', minWidth: 250, cellRenderer: (v) => (
                <>
                    <FontAwesomeIcon
                        fontSize={'18px'}
                        color="#0d6efd"
                        className="font-awesome"
                        icon={faEye}
                        onClick={() => handleTooltipModal(v?.data?.Response)}
                    />
                </>
            )
        },
        { headerName: 'Host Name', field: 'HostName', minWidth: 250 },
        { headerName: 'IP Address', field: 'IPAddress', minWidth: 250 },
        { headerName: 'Created By', field: 'CreatedBy', minWidth: 150 },
        { headerName: 'Created Date', field: 'CreatedDate', minWidth: 150 }
    ]
}

export const mobile_private_columns = (handleConfigModal) => {
    return [
        {
            field: 'LineItemId', headerName: 'Line Item ID', cellRenderer: (v) => (
                <span className='link-style'
                    onClick={() => handleConfigModal(v.data)}
                >
                    {v.value}
                </span>
            )
        },
        { headerName: 'MPN ID', field: 'MPNID' },
        { headerName: 'Contract Term', field: 'ContractPeriod' },
        { headerName: 'Solution Option', field: 'SolutionOption' },
        { headerName: 'Number of SIMS', field: 'NoOfSIMS' },
        { headerName: 'Compliance to EAR', field: 'CompliancetoEAR' },
        { headerName: 'Latency (ms)', field: 'LatencyMS' },
        { headerName: 'Types of Application & Use case', field: 'TypesofApplicationUseCase' },
        { headerName: 'QoS Requirement', field: 'QosRequirement' },
        { headerName: 'Existing MPN ID', field: 'ExistingMPNID' },
        { headerName: 'Other Remark', field: 'MPNRemarks' }
    ]
}

export const radio_access_network_columns = (handleConfigModal) => {
    return [
        {
            field: 'LineItemId', headerName: 'Line Item ID', cellRenderer: (v) => (
                <span className='link-style'
                    onClick={() => handleConfigModal(v.data)}
                >
                    {v.value}
                </span>
            )
        },
        { headerName: 'RAN ID', field: 'RANID' },
        { headerName: 'Contract Term', field: 'ContractPeriod' },
        { headerName: 'Technology', field: 'Technology' },
        { headerName: 'Number of UE', field: 'NoOfUE' },
        { headerName: 'Bands supported by UE', field: 'BandsSupportedbyUE' },
        { headerName: 'Coverage Requirement', field: 'CoverageRequirement' },
        { headerName: 'Other remark', field: 'RANRemarks' }
    ]
}

export const core_columns = (handleConfigModal) => {
    return [
        {
            field: 'LineItemId', headerName: 'Line Item ID', cellRenderer: (v) => (
                <span className='link-style'
                    onClick={() => handleConfigModal(v.data)}
                >
                    {v.value}
                </span>
            )
        },
        { headerName: 'Core ID', field: 'CoreID' },
        { headerName: 'Contract Term', field: 'ContractPeriod' },
        { headerName: 'Technology', field: 'Technology' },
        { headerName: 'Network Slicing Requirement', field: 'NetworkSlicingRequirement' },
        { headerName: 'Number of UE', field: 'NoOfUE' },
        { headerName: 'Whitelisting', field: 'Whitelisting' },
        { headerName: 'Other remark', field: 'CoreRemarks' }
    ]
}

export const mns_columns = (handleConfigModal) => {
    return [
        {
            field: 'LineItemId', headerName: 'Line Item ID', cellRenderer: (v) => (
                <span className='link-style'
                    onClick={() => handleConfigModal(v.data)}
                >
                    {v.value}
                </span>
            )
        },
        { headerName: 'Contract Term', field: 'ContractPeriod' },
        { headerName: 'MNSID', field: 'MNS ID' },
        { headerName: 'Provider Type', field: 'ProviderType' },
        { headerName: 'MNS Link Type', field: 'MNSLinkType' }
    ]
}

export const ms_columns = (handleConfigModal) => {
    return [
        {
            field: 'LineItemId', headerName: 'Line Item ID', cellRenderer: (v) => (
                <span className='link-style'
                    onClick={() => handleConfigModal(v.data)}
                >
                    {v.value}
                </span>
            )
        },
        { headerName: 'MS ID', field: 'MSID' },
        { headerName: 'Contract Term', field: 'ContractPeriod' },
        { headerName: 'MNS Link Type', field: 'MNSLinkType' }
    ]
}

export const mobile_site_address_columns = (hidden) => {
    return [
        { headerName: 'Mobile Address', field: 'MobileAddress', minWidth: 110 },
        { headerName: 'Latitude', field: 'Latitude', minWidth: 110 },
        { headerName: 'Longitude', field: 'Longitude', minWidth: 110 },
        { headerName: 'Status', field: 'MobileGCPStatus' },
        { headerName: 'GCP Latitude', field: 'GCPLatitude', hide: !hidden },
        { headerName: 'GCP Longitude', field: 'GCPLongitude', hide: !hidden },
        { headerName: 'Indoor Cell', field: 'GCPIndoorcell', hide: !hidden },
        { headerName: 'Indoor RSRP', field: 'GCPIndoorRSRP', hide: !hidden },
        { headerName: 'Blended Cell', field: 'GCPBlendedCell', hide: !hidden },
        { headerName: 'Blended RSRP', field: 'GCPBlendedRSRP', hide: !hidden },
        // { headerName: 'Indoor Coverage', field: 'GCPIndoorCoverage', hide: !hidden},               
        {
            field: 'GCPIndoorCoverage', headerName: 'Indoor Coverage', hide: !hidden, cellRenderer: (v) => (
                <span style={{ color: v?.data?.GCPIndoorCoverage === "Good" ? "green" : v?.data?.GCPIndoorCoverage === "Poor" ? "red" : "" }}>
                    <strong>{v?.data?.GCPIndoorCoverage}</strong></span>
            )
        },
        // { headerName: 'Blended Coverage', field: 'GCPBlendedCoverage', hide: !hidden }
        {
            field: 'GCPBlendedCoverage', headerName: 'Blended Coverage', hide: !hidden, cellRenderer: (v) => (
                <span style={{ color: v?.data?.GCPBlendedCoverage === "Good" ? "green" : v?.data?.GCPBlendedCoverage === "Poor" ? "red" : "" }}>
                    <strong>{v?.data?.GCPBlendedCoverage}</strong></span>
            )
        }
    ]
}


export const columnsToFetch = {
    A: 'MobileAddress',
    B: 'Latitude',
    C: 'Longitude'
};


export const exportToExcel = (tableId, fileName) => {
    const table = document.getElementById(tableId);
    if (!table) {
        console.error(`Table with ID ${tableId} not found.`);
        return;
    }
    const clonedTable = table.cloneNode(true);
    const excelDoc = document.implementation.createHTMLDocument();
    excelDoc.body.appendChild(clonedTable);
    const blob = new Blob([excelDoc.documentElement.outerHTML], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8',
    });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}


