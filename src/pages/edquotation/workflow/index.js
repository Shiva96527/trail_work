import React, { useState,useEffect } from "react";
import workflow_columns from "./config/column";
import NeptuneAgGrid from "../../../components/ag-grid";
import { getDigitalQuoteDetail } from "../helper";
import { useSelector } from "react-redux";

export default function EdQuotationWorkFlow() {
  const [workflowList, setWorkflowList] = useState([]);
  const { digitalizeQuoteId } = useSelector((state) => state?.globalSlice);

  useEffect(() => {
    getQuoteDetail(digitalizeQuoteId);
  }, []);

  useEffect(() => {
    getQuoteDetail(digitalizeQuoteId);
  }, [digitalizeQuoteId]);

  const getQuoteDetail = async () => {
    const quoteDetail = await getDigitalQuoteDetail(digitalizeQuoteId);
    console.log(
      "quoteDetail,quoteDetail.mailLog",
      quoteDetail,
      quoteDetail.mailLog
    );
    setWorkflowList(quoteDetail?.workFlowResponse);
  };

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
