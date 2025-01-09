import React, { useState, useEffect } from "react";
import workflow_columns from "./config/column";
import NeptuneAgGrid from "../../../components/ag-grid";
import { isActionApplicable } from "../helper";
import { useSelector } from "react-redux";
import { Button } from "reactstrap";
import { postDigitalizeQuoteOverallCostingApprovalorReject } from "../../../services/ed-service.js";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useNavigate, useLocation } from "react-router-dom";

export default function EdTaskHistory() {
  const navigate = useNavigate();
  const location = useLocation();
  const [workflowList, setWorkflowList] = useState([]);
  const [enableDropButtonFlag, setEnableDropButtonFlag] = useState([]);
  const { digitalizeQuoteId } = useSelector((state) => state?.globalSlice);
  const [remarks, setRemarks] = useState(null);
  const globalEdData = useSelector((state) => state.globalSlice.globalEdData);

  useEffect(() => {
    // Check if workflow list is already in sessionStorage
    const storedWorkflowList = JSON.parse(
      sessionStorage.getItem("workflowList")
    );
    if (storedWorkflowList) {
      // If data exists in sessionStorage, load it
      setWorkflowList(storedWorkflowList);
    } else if (globalEdData?.workFlowResponse) {
      // Otherwise, load it from globalEdData and save it to sessionStorage
      const workFlowResponse = globalEdData?.workFlowResponse;
      setWorkflowList(workFlowResponse);
      sessionStorage.setItem("workflowList", JSON.stringify(workFlowResponse)); // Save data to sessionStorage
    }
    // Retrieve enableDropButtonFlag from sessionStorage if it exists
    const storedEnableDropButtonFlag = JSON.parse(
      sessionStorage.getItem("enableDropButtonFlag")
    );
    if (storedEnableDropButtonFlag !== null) {
      setEnableDropButtonFlag(storedEnableDropButtonFlag);
    } else {
      // If not found, use globalEdData to set and persist it
      const dropButtonFlag =
        globalEdData?.quoteCreationResponse?.enableDropButtonFlag;
      setEnableDropButtonFlag(dropButtonFlag);
      sessionStorage.setItem(
        "enableDropButtonFlag",
        JSON.stringify(dropButtonFlag)
      );
    }
  }, [globalEdData]);

  const handleDrop = () => {
    Swal.fire({
      title: "Are you sure to drop quotation?",
      showDenyButton: true,
      confirmButtonText: "Yes",
      denyButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        postDrop();
      } else if (result.isDenied) {
        Swal.fire("Cancelled drop quotation", "", "info");
      }
    });
  };

  const postDrop = async () => {
    const payload = {
      LoginUIID: sessionStorage.getItem("uiid"),
      type: "Drop Request",
      action: "Drop",
      digitalizeQuoteId,
      remarks,
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

  const handleRemarksChange = (e) => {
    setRemarks(e?.target?.value);
  };

  return (
    <div
      style={{
        marginTop: "24px",
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
        topActionButtons={
          <>
            {enableDropButtonFlag === "Yes" &&
            !isActionApplicable(location?.pathname) ? (
              <>
                <input
                  type="text"
                  onChange={(e) => handleRemarksChange(e)}
                  placeholder="Drop Remarks"
                  style={{
                    padding: "5px",
                    border: "1px solid #ddd",
                    borderRadius: "5px",
                  }}
                />
                <Button
                  color="danger"
                  size="sm"
                  data-toggle="tooltip"
                  title="Drop"
                  onClick={handleDrop}
                  style={{ margin: "5px" }}
                >
                  Drop
                </Button>
              </>
            ) : null}
          </>
        }
      />
    </div>
  );
}
