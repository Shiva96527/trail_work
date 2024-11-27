import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { statusMap } from "../../../../shared/config"; // Update the path as needed
import { faCog, faUserFriends } from "@fortawesome/free-solid-svg-icons";

export const inboxColumns = (handleConfigModal, handleAssignment) => [
    {
        field: "assign",
        headerName: "Action",
        minWidth: 150,
        cellRenderer: (v) => (
            <>
                <FontAwesomeIcon
                    icon={faUserFriends}
                    className="fa-cursor"
                    fontSize={"14px"}
                    data-toggle="tooltip"
                    title="Reassign SRF"
                    onClick={() => handleAssignment(v?.data, "others")}
                />
                &nbsp;&nbsp;&nbsp;&nbsp;
                {v?.data?.status === "Assigned" && (
                    <FontAwesomeIcon
                        icon={faCog}
                        className="fa-cursor"
                        fontSize={"14px"}
                        data-toggle="tooltip"
                        title="Move to Group Queue"
                        onClick={() => handleAssignment(v?.data, "move")}
                    />
                )}
            </>
        ),
    },
    {
        field: "srfNumber",
        headerName: "SRF #",
        minWidth: 380,
        cellStyle: { textAlign: "left", padding: "0px" },
        cellRenderer: (v) => (
            <span className="link-style" onClick={() => handleConfigModal(v.data)}>
                {v.value}
            </span>
        ),
    },
    {
        field: "status",
        headerName: "Status",
        minWidth: 200,
        cellRenderer: (v) => (
            <span style={{ color: statusMap[v?.data?.status]?.color }}>
                <strong>{v?.data?.status}</strong>
            </span>
        ),
    },
    { field: "department", minWidth: 350, headerName: "Service Type" },
    { field: "vertical", minWidth: 110, headerName: "Vertical" },
    { field: "groupName", minWidth: 150, headerName: "Group Name" },
    { field: "requestor", minWidth: 140, headerName: "Requestor" },
    { field: "createdDate", minWidth: 200, headerName: "Created Date" },
    { field: "approvedBy", minWidth: 140, headerName: "Approved By" },
    { field: "approvedDate", minWidth: 110, headerName: "Approved Date" },
];

