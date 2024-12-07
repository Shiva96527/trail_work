// config/columns.js
const columns = [
  [
    { label: "Quote #", key: "quoteNumber" },
    { label: "Assignee", key: "assignee" },
    { label: "Department", key: "department" },
    { label: "Opportunity ID", key: "opportunityID" },
  ],
  [
    { label: "Service Order #", key: "serviceOrderNumber" },
    { label: "FIXCDS #", key: "fixCdsNumber" },
    { label: "Business Case #", key: "businessCaseNumber" },
    { label: "SRF #", key: "srfNumber" },
  ],
  [
    { label: "FIXCAS #", key: "fixCasNumber" },
    { label: "Status", key: "status" },
    { label: "Created Date", key: "createdDate" },
    { label: "Created By", key: "createdBy" },
  ],
  [
    {
      label: "Vendor Assignment",
      key: "vendor",
    },
    { label: "Group", key: "group" },
  ],
];

export default columns;
