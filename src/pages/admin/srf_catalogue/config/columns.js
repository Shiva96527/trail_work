export const srf_catalogue_columns = (handleConfigModal) => {
    return [
        {
            field: 'ServiceType', headerName: 'Service Type', minWidth: 150, cellRenderer: (v) => (
                <span className='link-style'
                    onClick={() => handleConfigModal(v.data)}
                >
                    {v.value}
                </span>
            )
        },
        { field: 'GateKeeperGroups', headerName: 'Gatekeeper' },
        { field: 'HLDGroups', headerName: 'HLD Mandatory Groups' },
        { field: 'HLDOptionalGroups', headerName: 'HLD Optional Groups' },
        { field: 'ReviewHLDandCloseSRFGroups', headerName: 'Review HLD & Close SRF Groups' },
        { field: 'ProviderType', headerName: 'Provider Type' },
        { field: 'Platform', headerName: 'SRF Channel' },
        { field: 'CatalogueStatus', headerName: 'Status' },
        { field: 'CatalogueVersion', headerName: 'Version' }
    ]
};