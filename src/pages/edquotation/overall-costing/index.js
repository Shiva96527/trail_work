import React, { useState, useEffect } from "react";
import NeptuneAgGrid from "../../../components/ag-grid";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import {
  totalInfoColumns,
  overallCostingGridColumn,
} from "./config/columns.js";
import { getDigitalQuoteDetail,isActionApplicable } from "../helper";
import { postDigitalizeQuoteOverallCostingApprovalorReject } from "../../../services/ed-service.js";
import { useNavigate,useLocation } from "react-router-dom";

var surveyData = {};
var implementationData = {};
var nonStandardData = {};

const OverallCostingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [totalInfo, setTotalInfo] = useState([]);
  const [summaryList, setsummaryList] = useState([]);

  const { digitalizeQuoteId } = useSelector((state) => state?.globalSlice);
  const [userIdentification, setUserIdentification] = useState(null);

  useEffect(() => {
    getQuoteDetail(digitalizeQuoteId);
  }, [digitalizeQuoteId]);

  const getQuoteDetail = async () => {
    const quoteDetail = await getDigitalQuoteDetail(digitalizeQuoteId);
    const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
    setUserIdentification(userInfo?.UserIdentification); // Get the UserIdentification value
    setTotalInfo(
      constructSummaryTable(
        quoteDetail?.overallCosting,
        userInfo?.UserIdentification
      )
    );
    setsummaryList(
      constructBreakdownGridData(quoteDetail?.overallCostingGridList)
    );
  };

  const constructSummaryTable = (quotationSummary, userIdentification) => {
    const { balanceInSRFRM, totalQuotationRM, totalSRFCostRM } =
      quotationSummary || {};
    return [
      { label: "Total Quotation", value: totalQuotationRM },
      {
        label: "Total SRF Cost",
        value: userIdentification !== "vendor" ? totalSRFCostRM : "--",
      },
      {
        label: "Balance in SRF",
        value: userIdentification !== "vendor" ? balanceInSRFRM : "--",
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
        toast.error("Please enter remarks!!!");
        return;
      } else {
        remarks = surveyData.remarks;
        type = "Survey";
      }
    } else if (rowIndex === 1) {
      if (action !== "approve" && !implementationData.remarks) {
        toast.error("Please enter remarks!!!");
        return;
      } else {
        remarks = implementationData.remarks;
        type = "Implementation";
      }
    } else {
      if (action !== "approve" && !nonStandardData.remarks) {
        toast.error("Please enter remarks!!!");
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
  //   const updatedData = summaryList.map((item) => {
  //     if (item.priceBookValue && item.quotation) {
  //       const priceBookValue = parseFloat(item.priceBookValue);
  //       const quotation = parseFloat(item.quotation);
  //       item.variance = (quotation - priceBookValue).toFixed(2);
  //     } else {
  //       item.variance = "";
  //     }
  //     return item;
  //   });
  //   setsummaryList(updatedData);
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
          data={summaryList}
          dataprops={overallCostingGridColumn(
            handleApproveOrReject,
            handleRemarksChange,
            userIdentification,
            !isActionApplicable(location?.pathname)
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
    </div>
  );
};

export default OverallCostingPage;
