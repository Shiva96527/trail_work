export const email_log_columns = [
  { headerName: "Receiver", field: "toEmail", minWidth: 250 },
  { headerName: "Subject", field: "emailsubject", minWidth: 250 },
  {
    headerName: "Body",
    field: "emailBody",
    minWidth: 300,
    cellRenderer: (v) => {
      console.log('v', v)
      return (
        <div dangerouslySetInnerHTML={{ __html: v?.data?.emailBody }}></div>
      );
    },
  },
  { headerName: "CC Email", field: "ccEmail", minWidth: 250 },
  { headerName: "Created By", field: "createdBy", minWidth: 250 },
  { headerName: "Created Date", field: "createdDate", minWidth: 250 },
];
