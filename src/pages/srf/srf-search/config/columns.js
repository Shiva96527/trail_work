export const group_columns = (handleConfigModal) => {
    return [
        {
            field: 'SRFNumber', headerName: 'SRF #', minWidth: 380, cellRenderer: (v) => (
                <span className='link-style'
                    onClick={() => handleConfigModal(v.data)}
                >
                    {v.value}
                </span>
            )
        },
        { field: 'SRFWorkFlowStatus', headerName: 'Status' },
        { field: 'ServiceType', headerName: 'Service Type' },
        { field: 'BizVertical', headerName: 'Biz Vertical' },
        { field: 'GroupName', headerName: 'Group Name' },     
        { field: 'Channel', headerName: 'Channel' },        
        { field: 'AssignedTo',minWidth: 140, headerName: 'Assigned To' },   
        { field: 'Requestor', minWidth: 140, headerName: 'Requestor' },
        { field: 'CreatedDate', headerName: 'Created Date' }
    ]
};