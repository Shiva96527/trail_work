import React, { useState, useEffect } from "react";
import NeptuneAgGrid from "../../../components/ag-grid";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import { getDigitalQuoteDetail } from "../helper";
import { digitalizeQuoteOverallCostingApprovalReject } from "../../../services/ed-service.js";
import {
  totalInfoColumns,
  overallCostingGridColumn,
} from "./config/columns.js";

let surveyResponse, implementationResponse, nonStandardResponse;

const OverallCostingPage = () => {
  const [totalInfo, setTotalInfo] = useState([]);
  const [remarksWarning, setRemarksWarning] = useState({});
  const [workflowList, setWorkflowList] = useState([
    {
      breakdown: "Survey",
      priceBookValue: "12",
      quotation: "1,489.36",
      variance: "1345",
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
      breakdown: "Non Standard",
      priceBookValue: "",
      quotation: "",
      variance: "",
      remarks: "",
      isRejected: false,
    },
  ]);

  const { digitalizeQuoteId } = useSelector((state) => state?.globalSlice);

  useEffect(() => {
    getQuoteDetail(digitalizeQuoteId);
  }, [digitalizeQuoteId]);

  const getQuoteDetail = async () => {
    const quoteDetail = await getDigitalQuoteDetail(digitalizeQuoteId);
    setTotalInfo(constructSummaryTable(quoteDetail?.overallCosting));
  };

  const constructSummaryTable = (quotationSummary) => {
    const { balanceInSRFRM, totalQuotationRM, totalSRFCostRM } =
      quotationSummary || {};
    return [
      { label: "Total Quotation", value: totalQuotationRM },
      { label: "Total SRF Cost", value: totalSRFCostRM },
      { label: "Balance in SRF", value: balanceInSRFRM },
    ];
  };

  const handleApproveOrReject = async (params, action) => {
    const rowIndex = params.node.rowIndex;
    const rowData = workflowList[rowIndex];

    // Check if rejecting and remarks are empty
    if (action === "reject" && rowData.remarks.trim() === "") {
      setRemarksWarning((prev) => ({
        ...prev,
        [rowIndex]: true, // Set warning for the current row
      }));
      //return; // Prevent API call if remarks are empty
    } else {
      setRemarksWarning((prev) => ({
        ...prev,
        [rowIndex]: false, // Hide warning for the current row
      }));
    }
    // If remarks are entered, hide the warning

    // Prepare remarks based on the breakdown type
    let remarks = "";
    if (rowIndex === 0) {
      remarks = surveyResponse; // Use surveyResponse for Survey
    } else if (rowIndex === 1) {
      remarks = implementationResponse; // Use implementationResponse for Implementation
    } else if (rowIndex === 2) {
      remarks = nonStandardResponse; // Use nonStandardResponse for Non Standard
    }

    // Check for remarks again (after hiding the warning)
    if (action === "reject" || action === "approve") {
      if (remarks === "") {
        setRemarksWarning((prev) => ({
          ...prev,
          [rowIndex]: true, // Show warning if remarks are still empty
        }));
      } else {
        setRemarksWarning((prev) => ({
          ...prev,
          [rowIndex]: false, // Hide warning for the current row
        }));
      }
      //   //return; // Prevent API call if remarks are still empty

      // Prepare the payload for the API call
      const payload = {
        digitalizeQuoteId: digitalizeQuoteId,
        type: rowData.breakdown,
        remarks: remarks, // Use the correct remarks
        loginUIID: sessionStorage.getItem("uiid"), // Update with actual login ID
      };

      try {
        const response = await digitalizeQuoteOverallCostingApprovalReject(
          payload
        );

        if (response?.status === 200) {
          toast.success(
            `${action.charAt(0).toUpperCase() + action.slice(1)}d: ${
              rowData.breakdown
            }`
          );
        } else {
          toast.error("Something went wrong. Please try again.");
        }
      } catch (error) {
        console.error("Error in approval/rejection API call", error);
        toast.error("Error in approval/rejection. Please try again.");
      }
    }
  };

  const handleRemarksChange = (e, params) => {
    const rowIndex = params.node.rowIndex;

    // Update the appropriate remark variable based on rowIndex
    if (rowIndex === 0) {
      surveyResponse = e.target.value;
    } else if (rowIndex === 1) {
      implementationResponse = e.target.value;
    } else {
      nonStandardResponse = e.target.value;
    }

    // // Update the workflowList state to reflect the changed remarks
    // const updatedWorkflowList = [...workflowList];
    // updatedWorkflowList[rowIndex].remarks = e.target.value;
    // setWorkflowList(updatedWorkflowList);

    // If remarks are entered, remove the warning for the current row
    if (e.target.value.trim() !== "") {
      setRemarksWarning((prev) => ({
        ...prev,
        [rowIndex]: false, // Remove warning when remarks are entered
      }));
    }
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
      <div style={{ marginTop: "20px", marginBottom: "20px" }}>
        <NeptuneAgGrid
          refId="overall-costing"
          data={workflowList}
          dataprops={overallCostingGridColumn(
            handleApproveOrReject,
            handleRemarksChange,
            remarksWarning
          )}
          paginated={false}
          itemsPerPage={10}
          searchable={false}
          exportable={false}
        />
      </div>

      <ToastContainer />
    </div>
  );
};

export default OverallCostingPage;
