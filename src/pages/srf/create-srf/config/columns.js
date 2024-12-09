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
    { headerName: 'URL', field: 'URL', minWidth: 250 },
    { headerName: 'Parameters', field: 'Parameters', minWidth: 250 },
    { headerName: 'Response', field: 'Response', minWidth: 250 },
    { headerName: 'Host Name', field: 'HostName', minWidth: 250 },
    { headerName: 'IP Address', field: 'IPAddress', minWidth: 250 },
    { headerName: 'Created By', field: 'CreatedBy', minWidth: 150 },
    { headerName: 'Created Date', field: 'CreatedDate', minWidth: 150 }
]

export const email_log_columns = [
    { headerName: 'Date & Time', field: '', minWidth: 250 },
    { headerName: 'To Email', field: '', minWidth: 250 },
    { headerName: 'CC Email', field: '', minWidth: 250 },
    { headerName: 'Subject', field: '', minWidth: 250 },
    { headerName: 'Body', field: '', minWidth: 250 }
]