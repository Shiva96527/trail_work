export const audit_trail_columns = (handleConfigModal) => {
    return [
        {
            field: 'Created_On', headerName: 'Date and Time', minWidth: 150, cellRenderer: (v) => (
                <span className='link-style'
                    onClick={() => handleConfigModal(v.data)}
                >
                    {v.value}
                </span>
            )
        },
        { field: 'User_Name', headerName: 'Login User Name' },
        { field: 'BuildingType', headerName: 'Building Type' },
        { field: 'Module', headerName: 'Module' },
        { field: 'Sub_Module', headerName: 'Sub Module' },
        { field: 'Activity_Type', headerName: 'Activity' },
        { field: 'Paramerters', headerName: 'Parameter' }
    ]
};