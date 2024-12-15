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
    getQuoteDetail(digitalizeQuoteId);
  }, [digitalizeQuoteId]);

  const getQuoteDetail = async () => {
    const quoteDetail = await getDigitalQuoteDetail(digitalizeQuoteId);
    console.log(
      "quoteDetail,quoteDetail.mailLog",
      quoteDetail,
      quoteDetail.mailLog
    );
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
