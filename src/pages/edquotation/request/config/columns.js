// config/columns.js
const columns = [
  [
    { label: "Quote #", key: "quoteNumber" },
    { label: "Assignee", key: "assignee" },
    { label: "Department", key: "department" },
    { label: "Opportunity ID", key: "opportunityID" },
  ],
  [
    { label: "FIXCDS #", key: "fixCdsNumber" },
    { label: "FIXCAS #", key: "fixCasNumber" },
    { label: "Business Case #", key: "businessCaseNumber" },
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
    {
      label: "ENS PIC",
      key: "ensPIC",
    },
  ],
];

export default columns;
