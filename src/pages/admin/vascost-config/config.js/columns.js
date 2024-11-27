export const vascost_config_columns = (handleConfigModal) => {
    return [
        {
            field: 'VASServiceType', headerName: 'VAS Service Type', minWidth: 150, cellRenderer: (v) => (
                <span className='link-style'
                    onClick={() => handleConfigModal(true, v.data)}
                >
                    {v.value}
                </span>
            )
        },
        { field: 'VASname', headerName: 'VAS Name' },
        { field: 'VASType', headerName: 'VAS Type' },
        { field: 'VASModel', headerName: 'VAS Model' },
        { field: 'VASBrand', headerName: 'VAS Brand' },
        { field: 'VASManaged', headerName: 'VAS Managed' },
        { field: 'VASPackage', headerName: 'VAS Package' },
        { field: 'VASCost', headerName: 'VAS Cost' },
        { field: 'Installation', headerName: 'Installation' }
    ]
};