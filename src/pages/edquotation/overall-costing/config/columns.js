export const totalInfoColumns = [
  {
    headerName: "Title",
    field: "label",
    sortable: true,
    filter: true,
    width: 300,
  },
  {
    headerName: "Value (RM)",
    field: "value",
    sortable: true,
    filter: true,
    width: 1100,
  },
];

//

export const overallCostingGridColumn = (
  handleApproveOrReject,
  handleRemarksChange,
  userIdentification,
  isActionApplicable
) => [
  {
    headerName: "Breakdown",
    field: "breakDown",
    sortable: true,
    filter: true,
    width: 200,
  },
  {
    headerName: "Price Book Value (RM)",
    field: "priceBookValueRM",
    sortable: true,
    filter: true,
    width: 250,
    cellRenderer: (params) =>
      userIdentification !== "vendor" ? <span>{params.value}</span> : "--",
  },
  {
    headerName: "Quotation (RM)",
    field: "quatationRM",
    sortable: true,
    filter: true,
    width: 250,
  },
  {
    headerName: "Variance (RM)",
    field: "varianceRM",
    sortable: true,
    filter: true,
    width: 250,
    cellRenderer: (params) =>
      userIdentification !== "vendor" ? <span>{params.value}</span> : "--",
  },
  {
    headerName: "Remarks",
    field: "remarks",
    cellRenderer: (params) => {
      console.log("first", params?.data?.showApproveRejectButton);
      return isActionApplicable ? (
        params?.data?.showApproveRejectButton === "Yes" &&
        userIdentification !== "vendor" ? (
          <input
            type="text"
            onChange={(e) => handleRemarksChange(e, params)}
            placeholder="Approval/Rejection Remarks"
            style={{
              padding: "5px",
              border: "1px solid #ddd",
              borderRadius: "5px",
              width: "100%",
            }}
          />
        ) : (
          <span>{params?.data?.remarks}</span>
        )
      ) : null;
    },
    width: 250,
  },
  {
    headerName: "Actions",
    field: "action",
    cellRenderer: (params) => {
      return isActionApplicable ? (
        params?.data?.showApproveRejectButton === "Yes" &&
        userIdentification !== "vendor" ? (
          <div>
            <button
              onClick={() => handleApproveOrReject(params, "approve")}
              style={{
                backgroundColor: "#28a745", // Green
                color: "white",
                border: "none",
                borderRadius: "10px",
                padding: "6px 12px",
                cursor: "pointer",
                fontSize: "12px",
                marginRight: "5px",
              }}
            >
              Approve
            </button>
            <button
              onClick={() => handleApproveOrReject(params, "reject")}
              style={{
                backgroundColor: "#dc3545", // Red
                color: "white",
                border: "none",
                borderRadius: "10px",
                padding: "6px 12px",
                cursor: "pointer",
                fontSize: "12px",
              }}
            >
              Reject
            </button>
          </div>
        ) : null
      ) : null;
    },
    width: 200,
  },
];
