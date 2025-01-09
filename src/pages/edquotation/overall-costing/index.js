import React, { useState, useEffect } from "react";
import NeptuneAgGrid from "../../../components/ag-grid";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import {
  totalInfoColumns,
  overallCostingGridColumn,
} from "./config/columns.js";
import { isActionApplicable } from "../helper";
import { postDigitalizeQuoteOverallCostingApprovalorReject } from "../../../services/ed-service.js";
import { useNavigate, useLocation } from "react-router-dom";

const OverallCostingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [totalInfo, setTotalInfo] = useState([]);
  const [summaryList, setSummaryList] = useState([]);

  const { digitalizeQuoteId } = useSelector((state) => state?.globalSlice);
  const [userIdentification, setUserIdentification] = useState(null);
  const globalEdData = useSelector((state) => state.globalSlice.globalEdData);

  const [surveyData, setSurveyData] = useState({});
  const [implementationData, setImplementationData] = useState({});
  const [nonStandardData, setNonStandardData] = useState({});

  useEffect(() => {
    // To restore previously saved user and survey data from sessionStorage
    const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
    const savedSurveyData =
      JSON.parse(sessionStorage.getItem("surveyData")) || {};
    const savedImplementationData =
      JSON.parse(sessionStorage.getItem("implementationData")) || {};
    const savedNonStandardData =
      JSON.parse(sessionStorage.getItem("nonStandardData")) || {};

    setUserIdentification(userInfo?.UserIdentification);
    setSurveyData(savedSurveyData);
    setImplementationData(savedImplementationData);
    setNonStandardData(savedNonStandardData);

    // Handle Total Information Data
    const savedTotalInfo = JSON.parse(sessionStorage.getItem("totalInfo"));
    if (savedTotalInfo) {
      setTotalInfo(savedTotalInfo); // Load from sessionStorage if available
    } else {
      const totalInfoData = constructSummaryTable(
        globalEdData?.overallCosting,
        userInfo?.UserIdentification
      );
      setTotalInfo(totalInfoData);
      sessionStorage.setItem("totalInfo", JSON.stringify(totalInfoData));
    }

    // Handle Summary List Data
    const savedSummaryList = JSON.parse(sessionStorage.getItem("summaryList"));
    if (savedSummaryList && savedSummaryList.length > 0) {
      setSummaryList(savedSummaryList); // Load from sessionStorage if available
    } else {
      const summaryListData = constructBreakdownGridData(
        globalEdData?.overallCostingGridList
      );
      setSummaryList(summaryListData);
      sessionStorage.setItem("summaryList", JSON.stringify(summaryListData));
    }
  }, [globalEdData]);

  // Construct summary table data for Total Info grid
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

  // Ensure data exists before using .map()
  const constructBreakdownGridData = (breakdownData) => {
    if (breakdownData && Array.isArray(breakdownData)) {
      return breakdownData.map((item) => item);
    }
    return []; // Return an empty array if data is undefined or not an array
  };

  const handleApproveOrReject = async (params, action) => {
    //Track the remarks you type for each stage (Survey, Implementation, or Non-Standard Tasks).
    //Update the respective data object in the app's state.
    //Save the updated data into sessionStorage so it remains available even if the page is refreshed.
    const breakDownLabel = params?.node?.data?.breakDown;
    let remarks = "";
    let type = "";
    if (breakDownLabel?.toLowerCase() === "survey") {
      if (action !== "approve" && !surveyData.remarks) {
        toast.error("Please enter remarks");
        return;
      } else {
        remarks = surveyData.remarks;
        type = "Survey";
      }
    } else if (breakDownLabel?.toLowerCase() === "implementation") {
      if (action !== "approve" && !implementationData.remarks) {
        toast.error("Please enter remarks");
        return;
      } else {
        remarks = implementationData.remarks;
        type = "Implementation";
      }
    } else {
      if (action !== "approve" && !nonStandardData.remarks) {
        toast.error("Please enter remarks");
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
    const breakDownLabel = params?.node?.data?.breakDown;
    const value = e?.target?.value;

    if (breakDownLabel?.toLowerCase() === "survey") {
      setSurveyData((prevState) => {
        const updatedData = { ...prevState, remarks: value };
        sessionStorage.setItem("surveyData", JSON.stringify(updatedData));
        return updatedData;
      });
    } else if (breakDownLabel?.toLowerCase() === "implementation") {
      setImplementationData((prevState) => {
        const updatedData = { ...prevState, remarks: value };
        sessionStorage.setItem(
          "implementationData",
          JSON.stringify(updatedData)
        );
        return updatedData;
      });
    } else {
      setNonStandardData((prevState) => {
        const updatedData = { ...prevState, remarks: value };
        sessionStorage.setItem("nonStandardData", JSON.stringify(updatedData));
        return updatedData;
      });
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
    </div>
  );
};

export default OverallCostingPage;
