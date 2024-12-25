import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons"; // Import faTrash icon

export const columns = (handleAssignment, type, statusCode) => [
  {
    field: "assign",
    headerName: "Action",
    minWidth: 50,
    cellRenderer: (v) => {
      return (type === "survey" && statusCode === 2) ||
        (type === "implementation" && statusCode === 4) ||
        (type === "nonstandard" && statusCode === 6) ? (
        <FontAwesomeIcon
          icon={faTrash}
          className="fa-cursor"
          fontSize={"14px"}
          data-toggle="tooltip"
          title="Delete row"
          onClick={() => handleAssignment(v?.data, type)} // Reassign action
        />
      ) : null;
    },
  },
  {
    headerName: "MM#",
    field: "mmNo",
    minWidth: 120,
  },
  {
    headerName: "Description",
    field: "description",
    minWidth: 250,
  },
  {
    headerName: "Quantity",
    field: "qty",
    minWidth: 150,
    cellRenderer: (params) => {
      return (type === "survey" && statusCode === 2) ||
        (type === "implementation" && statusCode === 4) ||
        (type === "nonstandard" && statusCode === 6) ? (
        <input
          type="number"
          value={params.value}
          onChange={(e) => params.setValue(e.target.value)}
          style={{
            width: "100%",
            border: "1px solid #ccc",
            borderRadius: "4px",
            padding: "4px",
          }}
        />
      ) : (
        <span>{params.value}</span>
      );
    },
  },
  {
    headerName: "Unit Price",
    field: "unitPrice",
    minWidth: 180,
  },
  {
    headerName: "Total Price",
    field: "totalPrice",
    minWidth: 180,
  },
  {
    headerName: "Plant Code",
    field: "plantCode",
    minWidth: 300,
    cellRenderer: (params) => {
      return (type === "survey" && statusCode === 2) ||
        (type === "implementation" && statusCode === 4) ||
        (type === "nonstandard" && statusCode === 6) ? (
        <input
          type="text"
          value={params.value}
          onChange={(e) => params.setValue(e.target.value)}
          style={{
            width: "100%",
            border: "1px solid #ccc",
            borderRadius: "4px",
            padding: "4px",
          }}
        />
      ) : (
        <span>{params.value}</span>
      );
    },
  },
];

export const columnsToFetch = {
  A: "oa",
  B: "mmNo",
  C: "mmDescription",
  D: "qty",
  E: "unitPrice",
  F: "plantCode",
};
