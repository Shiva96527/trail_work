export const cost_details_columns = (handleConfigModal, ddlValue) => {
    return [
        {
            field: 'CostName', headerName: 'Cost Name', minWidth: 150, cellRenderer: (v) => (
                <span className='link-style'
                    onClick={() => handleConfigModal(true, v.data)}
                >
                    {v.value}
                </span>
            )
        },
        { field: 'CostType', headerName: 'Cost Type' },
        { field: 'BuildingType', headerName: 'Building Type' },
        { field: 'Transmission', headerName: 'Transmission' },
        { field: 'CostWithoutManagedRouter', headerName: 'Cost Without Managed Service' },
        { field: 'CostWithManagedRouter', headerName: 'Cost With Managed Service' },
        // { field: 'WM', headerName: 'WM', hide: ddlValue === 'CPQ' },
        // { field: 'EM', headerName: 'EM', hide: ddlValue === 'CPQ' },
        // { field: 'KL', headerName: 'KL', hide: ddlValue === 'CPQ' },
        // { field: 'Sarawak', headerName: 'Sarawak', hide: ddlValue === 'CPQ' },
        // { field: 'Others', headerName: 'Others', hide: ddlValue === 'CPQ' }
    ]
};