import React, { useState, useEffect } from "react";
import NeptuneAgGrid from "../../../components/ag-grid";
import { Col, Row } from "reactstrap";
import { email_log_columns } from "./config/columns";
import { useSelector } from "react-redux";

export default function EmailLogs() {
  const [emailList, setEmailList] = useState([]);
  const { globalEdData } = useSelector((state) => state?.globalSlice);

  useEffect(() => {
    // Check if email log data is already in sessionStorage
    const storedEmailList = JSON.parse(sessionStorage.getItem("emailList"));
    if (storedEmailList) {
      // If data exists in sessionStorage, load it
      setEmailList(storedEmailList);
    } else if (globalEdData?.mailLog) {
      // Otherwise, load it from globalEdData and save it to sessionStorage
      const mailLog = globalEdData?.mailLog;
      setEmailList(mailLog);
      sessionStorage.setItem("emailList", JSON.stringify(mailLog)); // Save data to sessionStorage
    }
  }, [globalEdData]);

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
