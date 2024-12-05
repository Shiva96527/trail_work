import React, { useState, useCallback, useEffect } from "react";
import NeptuneAgGrid from "../../../components/ag-grid";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector, useDispatch } from "react-redux";
import { toggleNonStandard as toggleNonStandardAction } from "../../../redux/slices/globalSlice.js";
import { workflowColumns } from "./config/columns.js";
// Columns for Total Info Grid
const totalInfoColumns = [
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

const QuoteReviewPage = () => {
  const [totalInfo, setTotalInfo] = useState([
    { label: "Total Quotation (RM)", value: "1,489.36" },
    {
      label: "Total SRF Cost (RM)",
      value: "*not visible for vendor view*",
      style: { color: "gray" },
    },
    {
      label: "Balance in SRF (RM)",
      value: "*not visible for vendor view*",
      style: { color: "gray" },
    },
  ]);

  const [workflowList, setWorkflowList] = useState([
    {
      breakdown: "Survey",
      priceBookValue: "*not visible for vendor view*",
      quotation: "1,489.36",
      variance: "*not visible for vendor view*",
      remarks: "",
      isRejected: false,
    },
    {
      breakdown: "Implementation",
      priceBookValue: "",
      quotation: "",
      variance: "",
      remarks: "",
      isRejected: false,
    },
    {
      breakdown: "Non-Standard Quotation",
      priceBookValue: "",
      quotation: "",
      variance: "",
      remarks: "",
      isRejected: false,
    },
  ]);

  const [isUpdateEnabled, setIsUpdateEnabled] = useState(true);

  // Get the value of toggleNonStandard from the global state
  const toggleNonStandard = useSelector(
    (state) => state.globalSlice.toggleNonStandard
  );

  const handleApprove = useCallback(
    (params) => {
      const updatedData = [...workflowList];
      const rowIndex = params.node.rowIndex;
      updatedData[rowIndex] = {
        ...updatedData[rowIndex],
        isRejected: false,
        remarks: "",
      };
      setWorkflowList(updatedData);
      validateBeforeUpdate(updatedData);
      toast.success(`Approved: ${params.data.breakdown}`);
    },
    [workflowList]
  );

  const handleReject = useCallback(
    (params) => {
      const updatedData = [...workflowList];
      const rowIndex = params.node.rowIndex;
      updatedData[rowIndex] = { ...updatedData[rowIndex], isRejected: true };
      setWorkflowList(updatedData);
      validateBeforeUpdate(updatedData); // Check if any rejected row is missing remarks
      toast.error(`Rejected: ${params.data.breakdown}`);
      toast.error(`Remarks are required when rejecting.`);
    },
    [workflowList]
  );

  const handleRemarksChange = useCallback(
    (e, params) => {
      const updatedData = [...workflowList];
      const rowIndex = params.node.rowIndex;
      updatedData[rowIndex] = {
        ...updatedData[rowIndex],
        remarks: e.target.value,
      };
      setWorkflowList(updatedData);
      validateBeforeUpdate(updatedData); // Revalidate after remarks change
    },
    [workflowList]
  );

  const validateBeforeUpdate = useCallback((updatedData) => {
    const hasEmptyRemarks = updatedData.some(
      (item) => item.isRejected && !item.remarks.trim()
    );
    setIsUpdateEnabled(!hasEmptyRemarks); // Disable if any rejected row has empty remarks
  }, []);

  const handleCalculateVariance = () => {
    const updatedData = workflowList.map((item) => {
      if (item.priceBookValue && item.quotation) {
        const priceBookValue = parseFloat(item.priceBookValue);
        const quotation = parseFloat(item.quotation);
        item.variance = (quotation - priceBookValue).toFixed(2);
      } else {
        item.variance = "";
      }
      return item;
    });
    setWorkflowList(updatedData);
    toast.success("Variance calculated successfully!");
  };

  return (
    <div style={{ marginTop: "30px", marginLeft: "15px", marginRight: "15px" }}>
      {/* First Grid (Total Info) */}
      <div style={{ marginTop: "20px" }}>
        <NeptuneAgGrid
          refId="total-info"
          data={totalInfo}
          dataprops={totalInfoColumns}
          paginated={false}
          itemsPerPage={10}
          searchable={false}
          exportable={false}
        />
      </div>

      {/* Second Grid (Workflow) */}
      <div style={{ marginTop: "20px" }}>
        <NeptuneAgGrid
          refId="quote-review"
          data={workflowList}
          dataprops={workflowColumns(
            handleApprove,
            handleReject,
            handleRemarksChange,
            toggleNonStandard
          )}
          paginated={false}
          itemsPerPage={10}
          searchable={false}
          exportable={false}
        />
      </div>

      {/* Calculate Variance Button */}
      <div style={{ position: "fixed", bottom: "90px", left: "20px" }}>
        <button
          onClick={handleCalculateVariance}
          style={{
            padding: "7px 14px",
            backgroundColor: "#293897",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          Calculate Variance
        </button>
      </div>

      {/* Update Button */}
      <div style={{ position: "fixed", bottom: "90px", left: "180px" }}>
        <button
          onClick={() => toast.success("Update clicked successfully!")}
          disabled={!isUpdateEnabled}
          style={{
            padding: "7px 14px",
            backgroundColor: "#293897",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: isUpdateEnabled ? "pointer" : "not-allowed",
            fontSize: "14px",
          }}
        >
          Update
        </button>
      </div>

      <ToastContainer />
    </div>
  );
};

export default QuoteReviewPage;
