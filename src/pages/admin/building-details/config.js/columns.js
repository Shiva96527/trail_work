export const building_details_columns = (handleConfigModal) => {
    return [
        {
            field: 'Building_Name', headerName: 'Building Name', minWidth: 300, cellRenderer: (v) => (
                <span className='link-style'
                    onClick={() => handleConfigModal(true, v.data)}
                >
                    {v.value}
                </span>
            )
        },
        { field: 'Lat', headerName: 'Lat', width: 90 },
        { field: 'Long', headerName: 'Long', width: 100 },
        { field: 'Street', headerName: 'Street' },
        { field: 'Area', headerName: 'Area' },
        { field: 'City', headerName: 'City' },
        { field: 'Postcode', headerName: 'Post Code' },
        { field: 'State', headerName: 'State' },
        { field: 'OTC', headerName: 'OTC' },
        { field: 'MRC', headerName: 'MRC' }
    ]
};