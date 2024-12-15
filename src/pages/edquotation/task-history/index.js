import React, { useState, useEffect } from "react";
import workflow_columns from "./config/column";
import NeptuneAgGrid from "../../../components/ag-grid";
import { getDigitalQuoteDetail } from "../helper";
import { useSelector } from "react-redux";

export default function EdTaskHistory() {
  const [workflowList, setWorkflowList] = useState([]);
  const { digitalizeQuoteId } = useSelector((state) => state?.globalSlice);

  useEffect(() => {
    getQuoteDetail(digitalizeQuoteId);
  }, [digitalizeQuoteId]);

  const getQuoteDetail = async () => {
    const quoteDetail = await getDigitalQuoteDetail(digitalizeQuoteId);
    setWorkflowList(quoteDetail?.workFlowResponse);
  };

  return (
    <div
      style={{
        marginTop: "16px",
        marginLeft: "27px",
        marginRight: "27px",
      }}
    >
      <NeptuneAgGrid
        refId={"ed-workflow"}
        data={workflowList}
        dataprops={workflow_columns}
        paginated={false}
        itemsPerPage={10}
        searchable={true}
        exportable={true}
      />
    </div>
  );
}
