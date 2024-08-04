import { statusMap } from "../../../../shared/config";

export const outbox_columns = (handleConfigModal) => {
    return [
        {
            field: 'SRFNumber', headerName: 'SRF #', cellStyle: { textAlign: 'left', padding: '0px' }, minWidth: 380, cellRenderer: (v) => (
                <span className='link-style'
                    onClick={() => handleConfigModal(v.data)}
                >
                    {v.value}
                </span>
            )
        },
        {
            field: 'SRFWorkFlowStatus', headerName: 'Status', minWidth: 180, cellRenderer: (v) => (
                <span style={{ color: statusMap[v?.data?.SRFWorkFlowStatus]?.color }}><strong>{v?.data?.SRFWorkFlowStatus}</strong></span>
            )
        },
        { field: 'ServiceType', minWidth: 350, headerName: 'Service Type' },
        { field: 'BizVertical', minWidth: 110, headerName: 'Vertical' },
        { field: 'GroupName', headerName: 'Group Name', minWidth: 130, },
        { field: 'Requestor', minWidth: 140, headerName: 'Requestor' },
        { field: 'CreatedDate', headerName: 'Created Date', minWidth: 110, },
        { field: 'ApprovedBy', minWidth: 140, headerName: 'Approved By' },
        { field: 'ApprovedDate', minWidth: 110, headerName: 'Approved Date' }
    ]
};
