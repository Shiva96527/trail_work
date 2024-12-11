// config/columns.js
const workflow_columns = [
  { headerName: "Status Code", field: "wfStatusCode", minWidth: 200 },
  { headerName: "Status Name", field: "wfStatus", minWidth: 200 },
  { headerName: "Group Name", field: "groupName", minWidth: 200 },
  { headerName: "Revision", field: "revision", minWidth: 200 },
  { headerName: "Action", field: "wfAction", minWidth: 200 },
  { headerName: "Latest Flag", field: "latestFlag", minWidth: 200 },
  { headerName: "Comments", field: "remarks", minWidth: 200 },
  { headerName: "Created By", field: "createdBy", minWidth: 200 },
  { headerName: "Created Date", field: "createdDate", minWidth: 200 },
  { headerName: "Approved By", field: "approvedBy", minWidth: 200 },
  { headerName: "Approved Date", field: "approvedDate", minWidth: 200 },
  { headerName: "Rejected By", field: "rejectedBy", minWidth: 200 },
  { headerName: "Rejected Date", field: "rejectedDate", minWidth: 200 },
  { headerName: "Action By", field: "actionBy", minWidth: 200 },
  { headerName: "Action Date", field: "actionDate", minWidth: 200 },
];

export default workflow_columns;
