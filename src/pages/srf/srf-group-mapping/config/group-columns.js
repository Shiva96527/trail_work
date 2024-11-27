export const groupColumnData = (handleModal) => {
    return [
        {
            field: 'GroupName', headerName: 'Group Name', minWidth: 250, cellRenderer: (v) => (
                <span className='link-style'
                    onClick={() => handleModal(v.data)}
                >
                    {v.value}
                </span>
            )
        },
        { field: 'GateKeeper', headerName: 'Gate Keeper' },
        { field: 'ReviewHLDandCloseSRFGroups', headerName: 'Review HLD & Close SRF Groups' },
        { field: 'HLDGroup', headerName: 'HLD Group' },
        // { field: 'ManualSRFCreationAllowed', headerName: 'Manual SRF Creation' }
        
    ]
}
