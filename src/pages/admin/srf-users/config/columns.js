export const srfUsersColumns = (handleUserDetails) => {
    return [
        {
            field: 'MaxisId', headerName: 'Maxis ID', minWidth: 150, cellRenderer: (v) => (
                <span className='link-style'
                    onClick={() => handleUserDetails(v.data)}
                >
                    {v.value}
                </span>
            ),
        },
        { field: 'DisplayName', headerName: 'User Name', minWidth: 200, },
        { field: 'UserIdentification', headerName: 'Identification', minWidth: 120, },
        { field: 'Department', headerName: 'Dept', minWidth: 200, },
        { field: 'UserStatus', headerName: 'Status', minWidth: 170, },
        { field: 'Email', headerName: 'Email ID', minWidth: 220, },
        { field: 'Phone', headerName: 'Phone', minWidth: 120, },
        { field: 'CreatedBy', headerName: 'Created By', minWidth: 110, },
        { field: 'CreatedDate', headerName: 'Created At', minWidth: 110, }
    ]
}