import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog, faUserFriends } from "@fortawesome/free-solid-svg-icons";
import { statusMap } from "../../../shared/config"; // Update the path as needed

export const inboxColumns = (handleAssignment) => [
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
          title="Update ED"
          onClick={() => handleAssignment(v?.data, "others")} // Reassign action
        />
      </>
    ),
  },
  {
    field: "quoteNumber",
    headerName: "Quote #",
    minWidth: 250,
    cellStyle: { textAlign: "left", padding: "0px" },
    cellRenderer: (v) => (
      <span
        className="link-style"
        style={{ cursor: "pointer" }}
        onClick={() => handleAssignment(v?.data, "others")}
      >
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
  {
    field: "assignee",
    headerName: "Assignee",
    minWidth: 150,
  },
  {
    field: "department",
    headerName: "Department",
    minWidth: 200,
  },
  {
    field: "opportunityID",
    headerName: "Opportunity ID",
    minWidth: 230,
  },
  {
    field: "serviceOrderNumber",
    headerName: "Service Order #",
    minWidth: 230,
  },
  {
    field: "fixCasNumber",
    headerName: "FIXCAS #",
    minWidth: 250,
  },
  {
    field: "fixCdsNumber",
    headerName: "FIXCDS #",
    minWidth: 150,
  },
  {
    field: "businessCaseNumber",
    headerName: "BC #",
    minWidth: 230,
  },
  {
    field: "srfNumber",
    headerName: "SRF Number",
    minWidth: 250,
  },

  {
    field: "createdDate",
    headerName: "Created Date",
    minWidth: 200,
  },
  {
    field: "createdBy",
    headerName: "Created By",
    minWidth: 150,
  },
  {
    field: "vendor",
    headerName: "Vendor",
    minWidth: 150,
  },
  {
    field: "group",
    headerName: "Group",
    minWidth: 150,
  },
];
