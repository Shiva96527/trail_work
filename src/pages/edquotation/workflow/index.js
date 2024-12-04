import React, { useState } from "react";
import workflow_columns from "./config/column";
import NeptuneAgGrid from "../../../components/ag-grid";

export default function EdQuotationWorkFlow() {
  const [workflowList, setWorkflowList] = useState([]);
  return (
    <div
      style={{
        marginTop: "30px",
        marginLeft: "15px",
        marginRight: "15px",
      }}
    >
      <NeptuneAgGrid
        refId={"ed-workflow"}
        data={workflowList}
        dataprops={workflow_columns}
        paginated={false}
        itemsPerPage={10}
        searchable={false}
        exportable={false}
      />
    </div>
  );
}
