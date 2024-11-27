import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { statusMap } from "../../../../shared/config";
import { faCog, faUserFriends } from "@fortawesome/free-solid-svg-icons";

export const inbox_columns = (handleConfigModal, handleAssignment) => {
    return [
        {
            field: 'assign', headerName: 'Action', minWidth: 150, cellRenderer: (v) => {
                return <>
                    <FontAwesomeIcon icon={faUserFriends} className="fa-cursor" fontSize={"14px"} data-toggle="tooltip" title="Reassign SRF" onClick={() => handleAssignment(v?.data, 'others')} />&nbsp;&nbsp;&nbsp;&nbsp;
                    {v?.data?.SRFWorkFlowStatus === 'Assigned' ? <FontAwesomeIcon icon={faCog} className="fa-cursor" fontSize={"14px"} data-toggle="tooltip" title="Move to Group Queue" onClick={() => handleAssignment(v?.data, 'move')} /> : null}
                </>
            }
        },
        {
            field: 'SRFNumber', headerName: 'SRF #', minWidth: 380, cellStyle: { textAlign: 'left', padding: '0px' }, cellRenderer: (v) => (
                <span className='link-style'
                    onClick={() => handleConfigModal(v.data)}
                >
                    {v.value}
                </span>
            )
        },
        {
            field: 'SRFWorkFlowStatus', headerName: 'Status', minWidth: 200, cellRenderer: (v) => (
                <span style={{ color: statusMap[v?.data?.SRFWorkFlowStatus]?.color }}><strong>{v?.data?.SRFWorkFlowStatus}</strong></span>
            )
        },
        { field: 'ServiceType', minWidth: 350, headerName: 'Service Type' },
        { field: 'BizVertical', minWidth: 110, headerName: 'Vertical' },
        { field: 'GroupName', minWidth: 150, headerName: 'Group Name' },
        { field: 'Requestor', minWidth: 140, headerName: 'Requestor' },
        { field: 'CreatedDate', minWidth: 200, headerName: 'Created Date' },
        { field: 'ApprovedBy', minWidth: 140, headerName: 'Approved By' },
        { field: 'ApprovedDate', minWidth: 110, headerName: 'Approved Date' }
    ]
};
