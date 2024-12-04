import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

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
    field: "mmNumber",
    minWidth: 120, // Minimum width for this column
  },
  {
    headerName: "Description",
    field: "description",
    minWidth: 250, // Minimum width for this column
  },
  {
    headerName: "Quantity",
    field: "quantity",
    minWidth: 150, // Minimum width for this column
  },
  {
    headerName: "Unit Price",
    field: "unitPrice",
    minWidth: 180, // Minimum width for this column
  },
  {
    headerName: "Total Price",
    field: "totalPrice",
    minWidth: 180, // Minimum width for this column
  },
  {
    headerName: "Plant Code",
    field: "plantCode",
    minWidth: 300, // Minimum width for this column
  },
];
