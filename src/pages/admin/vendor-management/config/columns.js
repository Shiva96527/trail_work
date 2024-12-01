import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faUserFriends } from "@fortawesome/free-solid-svg-icons";

export const headerColumn = (handleAssignment) => [
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
          title="Update Vendor"
          onClick={() => handleAssignment(v?.data,"Update")} // Update action
        />
        &nbsp;&nbsp;&nbsp;&nbsp;
        <FontAwesomeIcon
          icon={faTrash}
          className="fa-cursor"
          color="red"
          fontSize={"14px"}
          data-toggle="tooltip"
          title="Delete Vendor"
          onClick={() => handleAssignment(v?.data,"Delete")} // Delete action
        />
      </>
    ),
  },
  {
    field: "vendorId",
    headerName: "Vendor ID",
    minWidth: 130,
  },
  {
    field: "vendorCode",
    headerName: "Vendor Code",
    minWidth: 150,
  },
  {
    field: "vendorName",
    headerName: "Vendor Name",
    minWidth: 250,
  },
  {
    field: "createdBy",
    headerName: "Created By",
    minWidth: 250,
  },
  {
    field: "createdDate",
    headerName: "Created Date",
    minWidth: 130,
  },
];
