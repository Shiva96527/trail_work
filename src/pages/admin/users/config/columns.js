import { faKey } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Button } from "reactstrap"

export const userColumnData = (handleApproveUser, handleMapRoles) => {
    return [
        {
            field: 'User_Name', headerName: 'User Name'
        },
        { field: 'User_First_Name', headerName: 'User First Name' },
        { field: 'Department', headerName: 'Dept' },

        { field: 'Role_Name', headerName: 'Roles' },
        { field: 'Mobile_No', headerName: 'Mobile No' },
        {
            field: 'Status', headerName: 'Status', cellRenderer: (v) => (
                getStatusName(v?.data?.Status)
            )
        },
        {
            field: '', headerName: 'Approve/Reject', cellRenderer: (v) => {
                if (!v?.data?.Status) {
                    return <Button color="success" size="xs" onClick={() => handleApproveUser(v?.data, 1)}>Approve</Button>
                } else {
                    return <span>Approved</span>
                }
            }
        },
        {
            field: '', headerName: 'Map Roles', cellRenderer: (v) => {
                return <FontAwesomeIcon icon={faKey} style={{ cursor: 'pointer' }} onClick={() => handleMapRoles(v?.data, true)} />
            }
        },
    ]
}

const getStatusName = (status) => {
    if (status) {
        return <span style={{ color: 'green' }}>Active</span>
    } else {
        return <span style={{ color: 'red' }}>Inactive</span>
    }
}