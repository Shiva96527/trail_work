import React, { useState, useEffect } from "react";
import { Button, Card, CardBody, CardTitle, Col, Row } from "reactstrap";
import NeptuneAgGrid from "../../../components/ag-grid";
import { inboxColumns } from "../config/columns";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getDigitalEDQuoteGrid } from "../../../services/ed-service";
import { setDigitalizeQuoteId } from "../../../redux/slices/globalSlice";
import { useDispatch } from "react-redux";

const TableComponent = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [gridData, setGridData] = useState([]);

  useEffect(() => {
    getEDQuoteList();
  }, []);

  const getEDQuoteList = async () => {
    const payload = {
      type: "group",
      loginUIID: sessionStorage.getItem("uiid"),
    };
    try {
      const {
        data: { data: resultData, statusCode, statusMessage },
      } = await getDigitalEDQuoteGrid(payload);
      if (statusCode === 200) {
        setGridData(resultData);
        toast.success(statusMessage);
      } else {
        toast.info(statusMessage);
      }
    } catch (e) {
      console.error("Error fetching grid data:", e);
      toast.error("Something went wrong while fetching data.");
    }
  };

  const handleAssignment = (row) => {
    dispatch(
      setDigitalizeQuoteId({ digitalizeQuoteId: row.digitalizeQuoteId })
    );

    // Navigate to the update page when clicking on action icons
    navigate("/neptune/edquotation/mygroup/detail", {
      state: {
        quoteDetail: row,
      },
    });
  };

  const columns = inboxColumns(handleAssignment);

  return (
    <>
      <Card className="card_outer_padding">
        <CardTitle>My Group</CardTitle>
        <CardBody>
          <Row>
            <Col md="12">
              <NeptuneAgGrid
                topActionButtons={<></>}
                data={gridData} // Use fetched data
                dataprops={columns}
                paginated
                itemsPerPage={10}
                searchable
                exportable
              />
            </Col>
          </Row>
        </CardBody>
      </Card>
    </>
  );
};

export default TableComponent;
