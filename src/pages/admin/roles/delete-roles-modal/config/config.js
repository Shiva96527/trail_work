import { faTrashAlt } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export const role_columns = (deleteRole) => {
    return [
        { field: 'Role_Name', headerName: 'Role Name' },
        { field: 'Role_Description', headerName: 'Decription' },
        { field: 'Status', headerName: 'Status' },
        {
            field: '', headerName: 'Delete', cellRenderer: (v) => {
                return <FontAwesomeIcon icon={faTrashAlt} style={{ cursor: 'pointer' }} color="red" onClick={() => deleteRole(v?.data)} />
            }
        },
    ]
}