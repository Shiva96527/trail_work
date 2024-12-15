import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog, faUserFriends } from "@fortawesome/free-solid-svg-icons";
import { statusMap } from "../../../shared/config"; // Update the path as needed

export const inboxColumns = (handleAssignment) => [
  {
    field: "quoteNumber",
    headerName: "Quote #",
    minWidth: 250,
    cellStyle: { textAlign: "left", padding: "0px" },
    cellRenderer: (v) => (
      <span
        className="link-style"
        style={{ cursor: "pointer" }}
        onClick={() => handleAssignment(v?.data)}
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
