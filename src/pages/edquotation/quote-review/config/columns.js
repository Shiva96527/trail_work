export const totalInfoColumns = [
  {
    headerName: "Label",
    field: "label",
    sortable: true,
    filter: true,
    width: 300,
  },
  {
    headerName: "Value",
    field: "value",
    sortable: true,
    filter: true,
    width: 1100,
  },
];

export const workflowColumns = (
  handleApprove,
  handleReject,
  handleRemarksChange,
  toggleNonStandard
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
    cellRenderer: (params) => {
      const { breakdown, priceBookValue } = params.data;
      let value = priceBookValue;

      // Logic to handle Non-Standard Quotation row
      if (toggleNonStandard && breakdown === "Non-Standard Quotation") {
        value = "2,000.00"; // Set value to 2000 if Non-Standard Quotation
      }

      return (
        <input
          type="text"
          value={value || ""}
          onChange={(e) => {
            const newValue = e.target.value;
            params.setValue(newValue); // Update the value in the grid
          }}
          style={{
            padding: "5px",
            border: "1px solid #ddd",
            borderRadius: "5px",
            width: "100%",
            backgroundColor: "white",
          }}
        />
      );
    },
  },
  {
    headerName: "Quotation (RM)",
    field: "quotation",
    sortable: true,
    filter: true,
    width: 250,
    cellRenderer: (params) => {
      return (
        <input
          type="text"
          value={params.value || ""} // Bind the value here
          onChange={(e) => {
            const newValue = e.target.value;
            params.setValue(newValue); // Update the value in the grid
          }}
          style={{
            padding: "5px",
            border: "1px solid #ddd",
            borderRadius: "5px",
            width: "100%",
          }}
        />
      );
    },
  },
  {
    headerName: "Variance (RM)",
    field: "variance",
    sortable: true,
    filter: true,
    width: 250,
    cellRenderer: (params) => {
      return (
        <input
          type="text"
          value=""
          style={{
            padding: "5px",
            border: "1px solid #ddd",
            borderRadius: "5px",
            width: "100%",
          }}
        />
      );
    },
  },
  {
    headerName: "Actions",
    field: "actions",
    cellRenderer: (params) => (
      <div>
        <button
          onClick={() => handleApprove(params)}
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
          onClick={() => handleReject(params)}
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
  {
    headerName: "Remarks",
    field: "remarks",
    cellRenderer: (params) => (
      <input
        type="text"
        value={params.value || ""} // Bind the value here
        onChange={(e) => handleRemarksChange(e, params)}
        placeholder="Approval/Rejection Remarks"
        style={{
          padding: "5px",
          border: "1px solid #ddd",
          borderRadius: "5px",
          width: "100%",
        }}
      />
    ),
    width: 250,
  },
];
