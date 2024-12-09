import { statusMap } from "../../../../shared/config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExchangeAlt, faUser, faUserFriends } from "@fortawesome/free-solid-svg-icons";
export const group_columns = (handleConfigModal, handleAssignment) => {
    return [
        // { headerCheckboxSelection: true, checkboxSelection: true, width: 60, colId: 'checkbox' },
        {
            field: 'assign', headerName: 'Action', minWidth: 150, cellRenderer: (v) => {
                return <>
                    <FontAwesomeIcon icon={faUser} className="fa-cursor" fontSize={"14px"} data-toggle="tooltip" title="Assign to me" onClick={() => handleAssignment(v?.data, 'me')} />&nbsp;&nbsp;&nbsp;&nbsp;
                    <FontAwesomeIcon icon={faUserFriends} className="fa-cursor" fontSize={"14px"} data-toggle="tooltip" title="Assign to others" onClick={() => handleAssignment(v?.data, 'others')} />&nbsp;&nbsp;&nbsp;&nbsp;
                    {v?.data?.GroupNameCountFlag==='true' && v?.data?.SRFWorkFlowStatus === 'Submitted' && <FontAwesomeIcon icon={faExchangeAlt} fontSize={"14px"} className="fa-cursor" data-toggle="tooltip" title="Reassign Gatekeeper" onClick={() => handleAssignment(v?.data, 'reassign')} />}
                    {/* <FontAwesomeIcon icon={faExchangeAlt} fontSize={"14px"} className="fa-cursor" data-toggle="tooltip" title="Reassign Gatekeeper" onClick={() => handleAssignment(v?.data, 'reassign')} /> */}
                </>
            }
        },
        {
            field: 'SRFNumber', headerName: 'SRF #', cellStyle: { textAlign: 'left', padding: '0px' }, minWidth: 380, cellRenderer: (v) => (
                <span className='link-style'
                    onClick={() => handleConfigModal(v.data)}
                >
                    {v.value}
                </span>
            )
        },
        {
            field: 'SRFWorkFlowStatus', headerName: 'Status', minWidth: 180, cellRenderer: (v) => (
                <span style={{ color: statusMap[v?.data?.SRFWorkFlowStatus]?.color }}><strong>{v?.data?.SRFWorkFlowStatus}</strong></span>
            )
        },
        { field: 'ServiceType', headerName: 'Service Type', minWidth: 350 },
        { field: 'BizVertical', headerName: 'Biz Vertical', minWidth: 150 },
        { field: 'GroupName', headerName: 'Group Name', minWidth: 110 },
        { field: 'Channel', headerName: 'Channel', minWidth: 110 },
        { field: 'Requestor', minWidth: 150, headerName: 'Requestor' },
        { field: 'CreatedDate', headerName: 'Created Date', minWidth: 150 }
    ]
};