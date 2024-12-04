// config/columns.js
const columns = [
  [
    { label: "Quote #", key: "quoteNumber" },
    { label: "Assignee", key: "assignee" },
    { label: "Department", key: "department" },
    { label: "Opportunity ID", key: "opportunityID" },
  ],
  [
    { label: "Service Order Number", key: "serviceOrderNumber" },
    { label: "FIXCDS #", key: "fixCDS" },
    { label: "Business Case Number", key: "businessCaseNumber" },
    { label: "SRF #", key: "srfNumber" },
  ],
  [
    { label: "Status", key: "status" },
    { label: "Created Date", key: "createdDate" },
    { label: "Created By", key: "createdBy" },
    { label: "Group", key: "group" },
  ],
  [
    {
      label: "Vendor Assignment",
      key: "vendor",
    },
    { label: "FIXCAS #", key: "fixCAS" },
  ],
];

export default columns;
