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
    cellRenderer: (v) => (
      <span>
        {v?.value === "--"
          ? "--"
          : new Intl.NumberFormat("en-us", {
              currency: "MYR",
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(v?.value)}
      </span>
    ),
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
    type: "rightAligned",
    cellRenderer: (v) =>
      userIdentification !== "vendor" ? (
        <span>
          {new Intl.NumberFormat("en-us", {
            currency: "MYR",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(v?.value)}
        </span>
      ) : (
        "--"
      ),
  },
  {
    headerName: "Quotation (RM)",
    field: "quatationRM",
    sortable: true,
    filter: true,
    width: 250,
    type: "rightAligned",
    cellRenderer: (v) => (
      <span>
        {new Intl.NumberFormat("en-us", {
          currency: "MYR",
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(v?.value)}
      </span>
    ),
  },
  {
    headerName: "Variance (RM)",
    field: "varianceRM",
    sortable: true,
    filter: true,
    width: 250,
    type: "rightAligned",
    cellRenderer: (v) =>
      userIdentification !== "vendor" ? (
        <span>
          {new Intl.NumberFormat("en-us", {
            currency: "MYR",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(v?.value)}
        </span>
      ) : (
        "--"
      ),
  },
  {
    headerName: "Remarks",
    field: "remarks",
    cellRenderer: (params) => {
      return params?.data?.showApproveRejectButton === "Yes" ? (
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
      );
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
