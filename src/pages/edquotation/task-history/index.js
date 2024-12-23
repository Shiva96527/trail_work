import React, { useState, useEffect } from "react";
import workflow_columns from "./config/column";
import NeptuneAgGrid from "../../../components/ag-grid";
import { getDigitalQuoteDetail, isActionApplicable } from "../helper";
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

  useEffect(() => {
    getQuoteDetail(digitalizeQuoteId);
  }, [digitalizeQuoteId]);

  const getQuoteDetail = async () => {
    try {
      const quoteDetail = await getDigitalQuoteDetail(digitalizeQuoteId);
      setEnableDropButtonFlag(
        quoteDetail?.quoteCreationResponse?.enableDropButtonFlag
      );
      setWorkflowList(quoteDetail?.workFlowResponse);
    } catch (e) {
      toast.error("Something went wrong");
      navigate("/neptune/edquotation/inbox");
    }
  };

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
