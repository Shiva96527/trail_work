import React, { useState, useEffect } from "react";
import NeptuneAgGrid from "../../../components/ag-grid";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import {
  totalInfoColumns,
  overallCostingGridColumn,
} from "./config/columns.js";
import { getDigitalQuoteDetail } from "../helper";
import { postDigitalizeQuoteOverallCostingApprovalorReject } from "../../../services/ed-service.js";
import { useNavigate } from "react-router-dom";

var surveyData = {};
var implementationData = {};
var nonStandardData = {};

const OverallCostingPage = () => {
  const navigate = useNavigate();

  const [totalInfo, setTotalInfo] = useState([]);

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
      breakdown: "Non-Standard Quotation",
      priceBookValue: "",
      quotation: "",
      variance: "",
      remarks: "",
      isRejected: false,
    },
  ]);

  const [isUpdateEnabled, setIsUpdateEnabled] = useState(true);

  const { digitalizeQuoteId } = useSelector((state) => state?.globalSlice);
  // const [surveyData, setSurveyData] = useState(null);

  useEffect(() => {
    getQuoteDetail(digitalizeQuoteId);
  }, [digitalizeQuoteId]);

  const getQuoteDetail = async () => {
    const quoteDetail = await getDigitalQuoteDetail(digitalizeQuoteId);
    setTotalInfo(constructSummaryTable(quoteDetail?.overallCosting));
    setWorkflowList(
      constructBreakdownGridData(quoteDetail?.overallCostingGridList)
    );
  };

  const constructSummaryTable = (quotationSummary) => {
    const { balanceInSRFRM, totalQuotationRM, totalSRFCostRM } =
      quotationSummary || {};
    return [
      { label: "Total Quotation", value: totalQuotationRM },
      {
        label: "Total SRF Cost",
        value: totalSRFCostRM,
      },
      {
        label: "Balance in SRF",
        value: balanceInSRFRM,
      },
    ];
  };

  const constructBreakdownGridData = (breakdownData) => {
    return breakdownData.map((item) => {
      return item;
    });
  };

  const handleApproveOrReject = async (params, action) => {
    const rowIndex = params.node.rowIndex;
    let remarks = "";
    let type = "";
    if (rowIndex === 0) {
      if (action !== "approve" && !surveyData.remarks) {
        toast.error("Remarks must!!!");
        return;
      } else {
        remarks = surveyData.remarks;
        type = "Survey";
      }
    } else if (rowIndex === 1) {
      if (action !== "approve" && !implementationData.remarks) {
        toast.error("Remarks must!!!");
        return;
      } else {
        remarks = implementationData.remarks;
        type = "Implementation";
      }
    } else {
      if (action !== "approve" && !nonStandardData.remarks) {
        toast.error("Remarks must!!!");
        return;
      } else {
        remarks = nonStandardData.remarks;
        type = "NonStandard";
      }
    }
    const payload = {
      LoginUIID: sessionStorage.getItem("uiid"),
      remarks,
      type,
      action,
      digitalizeQuoteId,
    };
    try {
      const {
        data: { statusCode, statusMessage },
      } = await postDigitalizeQuoteOverallCostingApprovalorReject(payload);
      if (statusCode === 200) {
        toast.success(statusMessage);
        navigate("/neptune/edquotation/inbox");
      } else {
        toast.error(statusMessage);
      }
    } catch (e) {
      toast.error("Something went wrong");
    }
  };

  const handleRemarksChange = (e, params) => {
    const rowIndex = params.node.rowIndex;
    if (rowIndex === 0) {
      surveyData = {
        ...params?.data,
        remarks: e?.target?.value,
      };
    } else if (rowIndex === 1) {
      implementationData = {
        ...params?.data,
        remarks: e?.target?.value,
      };
    } else {
      nonStandardData = {
        ...params?.data,
        remarks: e?.target?.value,
      };
    }
  };

  // const validateBeforeUpdate = useCallback((updatedData) => {
  //   const hasEmptyRemarks = updatedData.some(
  //     (item) => item.isRejected && !item.remarks.trim()
  //   );
  //   setIsUpdateEnabled(!hasEmptyRemarks); // Disable if any rejected row has empty remarks
  // }, []);

  // const handleCalculateVariance = () => {
  //   const updatedData = workflowList.map((item) => {
  //     if (item.priceBookValue && item.quotation) {
  //       const priceBookValue = parseFloat(item.priceBookValue);
  //       const quotation = parseFloat(item.quotation);
  //       item.variance = (quotation - priceBookValue).toFixed(2);
  //     } else {
  //       item.variance = "";
  //     }
  //     return item;
  //   });
  //   setWorkflowList(updatedData);
  //   toast.success("Variance calculated successfully!");
  // };

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
            handleRemarksChange
          )}
          paginated={false}
          itemsPerPage={10}
          searchable={false}
          exportable={false}
        />
      </div>

      {/* Calculate Variance Button */}
      {/* <div style={{ position: "fixed", left: "20px" }}>
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
      </div> */}

      {/* Update Button */}
      {/* <div style={{ position: "fixed", left: "180px" }}>
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
      </div> */}

      <ToastContainer />
    </div>
  );
};

export default OverallCostingPage;
