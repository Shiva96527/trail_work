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
  remarksWarning,
  setRemarksWarning
) => [
  {
    headerName: "Breakdown",
    field: "breakdown",
    sortable: true,
    filter: true,
    width: 200,
  },
  {
    headerName: "Price Book Value (RM)",
    field: "priceBookValue",
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
    field: "quotation",
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
    field: "variance",
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
      const rowData = params.data;
      //  const rowIndex = params.node.rowIndex;
      const isWarningVisible = remarksWarning[params.node.rowIndex] || false; // Check if warning should be shown

      return (
        <div style={{ position: "relative" }}>
          <input
            type="text"
            defaultValue={rowData.remarks}
            placeholder="Approval/Rejection Remarks"
            onBlur={(e) => {
              // Call handleRemarksChange when input changes
              handleRemarksChange(e, params); // Update the remarks value
              // Clear the warning after entering remarks

              // setRemarksWarning((prev) => ({
              //   ...prev,
              //   [rowIndex]: false, // Set warning to false for this row after input
              // }));
            }}
            style={{
              width: "100%",
              border: "1px solid #ccc",
              borderRadius: "4px",
              padding: "4px",
            }}
          />
          {/* Display the warning below the input field */}
          {isWarningVisible && (
            <div
              style={{
                color: "red",
                fontSize: "12px",
                marginTop: "4px", // Ensure it's below the input box
              }}
            >
              Please enter remarks before rejecting.
            </div>
          )}
        </div>
      );
    },
    width: 250,
  },
  {
    headerName: "Actions",
    field: "actions",
    cellRenderer: (params) => (
      <div>
        <button
          onClick={() => handleApproveOrReject(params, "approve")}
          style={{
            backgroundColor: "#28a745", // Green
            color: "black",
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
            color: "black",
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
    ),
    width: 200,
  },
];
