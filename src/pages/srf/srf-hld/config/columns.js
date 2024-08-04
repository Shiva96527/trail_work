import { Button } from "reactstrap";
import { statusMap } from "../../../../shared/config";
import { EditableCellRenderer } from "../financial-modal/config/columns";

export const financial_info_columns = (handleConfigModal, isMpnService) => {
    return [
        {
            field: 'SiteSeq', headerName: 'Site Item ID', minWidth: 250, cellRenderer: (v) => (
                <span className='link-style'
                    onClick={() => handleConfigModal(v.data)}
                >
                    {v.value}
                </span>
            )
        },
        { field: 'ServiceType', minWidth: 200, headerName: 'Service Type' },
        { headerName: 'MPN ID', hide: !isMpnService, minWidth: 110, field: 'MPNID' },
        { headerName: 'MPN Link Type', hide: !isMpnService, minWidth: 110, field: 'MPNType' },
        { field: 'BuildingType', minWidth: 110, headerName: 'Building Type' },
        { field: 'SLA', headerName: 'SLA', minWidth: 110 },
        { field: 'Transmission', minWidth: 140, headerName: 'Transmission' },
        { field: 'TransmissionType', headerName: 'Transmission Type', minWidth: 110 },
        { field: 'SiteAddress', minWidth: 400, headerName: 'Address' },
        {
            field: 'SRFWorkFlowStatus', headerName: 'Status', minWidth: 150, cellRenderer: (v) => (
                <span style={{ color: statusMap[v?.data?.SRFWorkFlowStatus]?.color }}>{v?.data?.SRFWorkFlowStatus}</span>
            )
        },
        {
            field: 'Cost', minWidth: 140, headerName: 'Total Cost', cellRenderer: (v) => (
                <span>MYR {new Intl.NumberFormat('en-us', {
                    currency: "MYR",
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }).format(v?.data?.Cost)}</span>
            )
        },
    ]
};

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

export const neptune_log_columns = [
    { headerName: 'Channel Reference ID', field: 'SRFChannelReferenceId', minWidth: 400 },
    { headerName: 'Parameters', field: 'Parameters', minWidth: 250 },
    { headerName: 'Response', field: 'Response', minWidth: 250 },
    { headerName: 'Host Name', field: 'HostName', minWidth: 250 },
    { headerName: 'IP Address', field: 'IPAddress', minWidth: 250 },
    { headerName: 'Created By', field: 'CreatedBy', minWidth: 150 },
    { headerName: 'Created Date', field: 'CreatedDate', minWidth: 150 }
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

export const hldGroupAssignment_columns_hld = [
    { headerName: 'Service Types', field: 'ServiceType' },
    { headerName: 'Mandatory Groups', field: 'MandatoryGroup' },
    { headerName: 'Cost', field: 'Cost', editable: true },
    {
        headerName: 'Optional Groups',
        field: 'OptionGroup',
        width: 400,
        suppressSizeToFit: true
    },
]

export const review_cost_columns_hld = (handleReviewCostRowClick, handleAction, hideActions) => {
    return [
        {
            headerName: 'HLD Group', field: 'HLDGroup', cellRenderer: (v) => (
                <span className='link-style'
                    onClick={() => handleReviewCostRowClick(v.data)}
                >
                    {v.value}
                </span>)
        },
        { headerName: 'Service Type', field: 'ServiceType' },
        { headerName: 'HLD Group Status', field: 'HLDGroupStatus', editable: true },
        { headerName: 'Remarks', hide: !hideActions, field: 'Remarks', type: 'textarea', cellRenderer: EditableCellRenderer },
        {
            headerName: 'Action', hide: !hideActions, cellRenderer: (v) => {
                if (['Not Involved', 'Pending Cost Update', 'HLD Cost Pending'].indexOf(v?.data?.HLDGroupStatus) >= 0) {
                    return <Button color="danger" size="sm" onClick={() => handleAction(v?.data, 'Reviewer Drop')}>Drop</Button>
                } else if (v?.data?.HLDGroupStatus === 'Cost Updated') {
                    return <Button color="success" size="sm" onClick={() => handleAction(v?.data, 'Reviewer Reopen')}>Reopen</Button>
                }
            }
        }
    ]
}

export const additional_info_columns = (handleDownloadFile) => [
    { headerName: 'Group Name', field: 'GroupName', minWidth: 250 },
    { headerName: 'Executive Summary', field: 'ExecutiveSummary', minWidth: 250 },
    { headerName: 'High Level Solution', field: 'HighLevelSolution', minWidth: 250 },
    { headerName: 'Technical Risk Assessment', field: 'TechnicalRiskAssessment', minWidth: 250 },
    { headerName: 'Timelines', field: 'Timelines', minWidth: 250 },
    {
        headerName: 'HLD File Upload', field: 'HLDFileUpload', width: 250, suppressSizeToFit: true, cellRenderer: (v) => {
            return <span className="link-style" onClick={() => {
                const { HLDFileUpload: file, HLDFileUploadPath: path } = v?.data || {};
                handleDownloadFile({ file, path });
            }}>{v?.data?.HLDFileUpload}</span>
        }
    },
    {
        headerName: 'Financial File Upload', field: 'FinancialFileUpload', width: 150, suppressSizeToFit: true, cellRenderer: (v) => {
            return <span className="link-style" onClick={() => {
                const { FinancialFileUpload: file, FinancialFileUploadPath: path } = v?.data || {};
                handleDownloadFile({ file, path });
            }}>{v?.data?.FinancialFileUpload}</span>
        }
    }
]