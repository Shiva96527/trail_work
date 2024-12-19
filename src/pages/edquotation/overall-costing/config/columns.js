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
  userIdentification
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
    // cellRenderer: (params) => {
    //   const { breakdown, priceBookValue } = params.data;
    //   let value = priceBookValue;

    //   // Logic to handle Non-Standard Quotation row
    //   if (toggleNonStandard && breakdown === "Non-Standard Quotation") {
    //     value = "2,000.00"; // Set value to 2000 if Non-Standard Quotation
    //   }

    //   return (
    //     <input
    //       type="text"
    //       value={value || ""}
    //       onChange={(e) => {
    //         const newValue = e.target.value;
    //         params.setValue(newValue); // Update the value in the grid
    //       }}
    //       style={{
    //         padding: "5px",
    //         border: "1px solid #ddd",
    //         borderRadius: "5px",
    //         width: "100%",
    //         backgroundColor: "white",
    //       }}
    //     />
    //   );
    // },
  },
  {
    headerName: "Quotation (RM)",
    field: "quatationRM",
    sortable: true,
    filter: true,
    width: 250,
    // cellRenderer: (params) => {
    //   return (
    //     <input
    //       type="text"
    //       value={params.value || ""} // Bind the value here
    //       onChange={(e) => {
    //         const newValue = e.target.value;
    //         params.setValue(newValue); // Update the value in the grid
    //       }}
    //       style={{
    //         padding: "5px",
    //         border: "1px solid #ddd",
    //         borderRadius: "5px",
    //         width: "100%",
    //       }}
    //     />
    //   );
    // },
  },
  {
    headerName: "Variance (RM)",
    field: "varianceRM",
    sortable: true,
    filter: true,
    width: 250,
    // cellRenderer: (params) => {
    //   return (
    //     <input
    //       type="text"
    //       value=""
    //       style={{
    //         padding: "5px",
    //         border: "1px solid #ddd",
    //         borderRadius: "5px",
    //         width: "100%",
    //       }}
    //     />
    //   );
    // },
  },
  {
    headerName: "Remarks",
    field: "remarks",
    cellRenderer: (params) => {
      return params?.data?.showApproveRejectButton === "Yes" && userIdentification !== "vendor"? (
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
      ) : null;
    },
    width: 250,
  },
  {
    headerName: "Actions",
    field: "action",
    cellRenderer: (params) => {
      console.log("]", params);
      return params?.data?.showApproveRejectButton === "Yes"  && userIdentification !== "vendor"? (
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
      ) : null;
    },
    width: 200,
  },
];
