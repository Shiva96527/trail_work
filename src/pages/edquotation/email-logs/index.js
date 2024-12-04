import React,{useState} from "react";
import NeptuneAgGrid from "../../../components/ag-grid";
import { Col, Row } from "reactstrap";
import { email_log_columns } from "./config/columns";

export default function EmailLogs() {
  const [emailList, setEmailList] = useState([]);
  return (
    <Row className="m-3">
      <Col md={12}>
        <NeptuneAgGrid
          refId={"srf-workflow"}
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
