import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons"; // Import faTrash icon

export const columns = [
  {
    field: "assign",
    headerName: "Action",
    minWidth: 50,
    cellRenderer: (v) => (
      <>
        <FontAwesomeIcon
          icon={faTrash}
          className="fa-cursor"
          fontSize={"14px"}
          data-toggle="tooltip"
          title="Update ED"
          // onClick={() => handleAssignment(v?.data, "others")} // Reassign action
        />
      </>
    ),
  },
  {
    headerName: "MM#",
    field: "mmNo",
    minWidth: 120,
    cellRenderer: (params) => (
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
    ),
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
    cellRenderer: (params) => (
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
    ),
  },
  {
    headerName: "Unit Price",
    field: "price",
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
    cellRenderer: (params) => (
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
    ),
  },
];

export const columnsToFetch = {
  A: "oa",
  B: "mmNo",
  C: "qty",
  D: "plantCode",
};
