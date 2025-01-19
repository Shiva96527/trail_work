import React, { useState, useEffect } from "react";
import NeptuneAgGrid from "../../../components/ag-grid";
import { Col, Row } from "reactstrap";
import { email_log_columns } from "./config/columns";
import { useSelector } from "react-redux";
import { getDigitalQuoteDetail } from "../helper";

export default function EmailLogs() {
  const [emailList, setEmailList] = useState([]);
  const { digitalizeQuoteId } = useSelector((state) => state?.globalSlice);

  useEffect(() => {
    getQuoteDetail(
      digitalizeQuoteId || Number(sessionStorage.getItem("digitalizeQuoteId"))
    );
  }, [digitalizeQuoteId]);

  const getQuoteDetail = async (digitalizeQuoteId) => {
    const quoteDetail = await getDigitalQuoteDetail(digitalizeQuoteId);
    setEmailList(quoteDetail?.mailLog);
  };

  return (
    <Row className="m-3">
      <Col md={12}>
        <NeptuneAgGrid
          refId={"ed-email-workflow"}
          data={emailList}
          dataprops={email_log_columns}
          paginated={true}
          itemsPerPage={10}
          searchable={true}
          exportable={true}
        />
      </Col>
    </Row>
  );
}
