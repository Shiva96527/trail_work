import {
  Button,
  Card,
  CardBody,
  Col,
  FormGroup,
  Input,
  Label,
  Row,
} from "reactstrap";
import NeptuneAgGrid from "../../../components/ag-grid";
import { useLayoutEffect, useState } from "react";
import { getSrfSearchHTTP } from "../../../services/srf-service";
import { toast } from "react-toastify";
import { inboxColumns } from "../config/columns";
import { DatePicker, DropdownList, Multiselect } from "react-widgets";
import { useNavigate } from "react-router-dom";
import useDropdownFilter from "../../../shared/hooks/dropdownFilterHook";

const initialState = {
  quoteNumber: "",
  assignee: "",
  department: "",
  opportunity: "",
  serviceOrderNumber: "",
  fixCds: "",
  businessCaseNumber: "",
  srfNumber: "",
  status: "",
  startDate: null,
  endDate: null,
  requestor: "",
  vendor: "",
};

const EdSearch = () => {
  const navigate = useNavigate();
  const [getDropdownByType] = useDropdownFilter();
  const [searchList, setSearchList] = useState([]);
  const [state, setState] = useState(initialState);
  const [dropdownOptions, setDropdownOptions] = useState({});

  useLayoutEffect(() => {
    getDropdowns();
    // eslint-disable-next-line
  }, []);

  const getDropdowns = async () => {
    const options = await getDropdownByType({
      DropDownType: "SRF WorkFlow Catalogue DDL Values",
    });
    let tempDropdownOptions = {};
    options?.value?.forEach((d) => {
      const values = d?.DropDownValue;
      const property = d?.DropDownType;
      if (values) {
        const options = values?.split(",");
        tempDropdownOptions[property] = options;
      }
    });
    setDropdownOptions(tempDropdownOptions);
  };

  const getSearchData = async () => {
    const payload = {
      ...state,
      ...{ Action: "Search", LoginUIID: sessionStorage.getItem("uiid") },
    };
    try {
      const {
        data: { data: resultData, statusCode, statusMessage },
      } = await getSrfSearchHTTP(payload);
      if (statusCode === 200) {
        setSearchList(resultData);
        toast.success(statusMessage);
      } else {
        toast.error(statusMessage);
      }
    } catch (e) {
      toast.error("Something went wrong");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
  };

  const resetFilter = () => {
    setState({ ...initialState });
    setSearchList([]);
  };

  const handleViewDetails = (data) => {
    let path = "";
    if (
      data?.SRFWorkFlowStatus === "HLD" ||
      data?.SRFWorkFlowStatus === "HLD Cost Pending"
    ) {
      path = "/neptune/srf/inboxhld";
    } else {
      path = "/neptune/srf/search/view";
    }
    navigate(path, {
      state: {
        IntegrationID: data?.IntegrationID,
        SRFNumber: data?.SRFNumber,
        GroupName: data?.GroupName,
        WorkflowId: data?.WorkflowId || 0,
        SRFWorkFlowStatus: data?.SRFWorkFlowStatus,
      },
    });
    //navigate('/neptune/srf/srfinbox/view', { state: { IntegrationID: data?.IntegrationID, SRFNumber: data?.SRFNumber } })
  };

  return (
    <>
      <Card className="card_outer_padding">
        <CardBody>
          <div className="app-inner-layout__wrapper">
            <Card className="card_outer_padding">
              <strong>ED Search</strong>
              <br />
              <Row>
                <Col md={3}>
                  <FormGroup>
                    <Label for="srfNumber">Quote #</Label>
                    <Input
                      name="srfNumber"
                      id="srfNumber"
                      value={state?.srfNumber}
                      onChange={handleChange}
                    />
                  </FormGroup>
                </Col>
                <Col md={3}>
                  <FormGroup>
                    <Label for="assignee">Assignee</Label>
                    <Input
                      name="assignee"
                      id="assignee"
                      value={state?.assignee}
                      onChange={handleChange}
                    />
                  </FormGroup>
                </Col>
                <Col md={3}>
                  <FormGroup>
                    <Label for="department">Department</Label>
                    <DropdownList
                      data={[
                        "Planner",
                        "Engineering",
                        "Account Manager",
                        "Presales",
                        "Planner Admin",
                        "Solution Architect",
                      ]}
                      value={state?.department}
                      onChange={(v) =>
                        handleChange({ target: { name: "group", value: v } })
                      }
                    />
                  </FormGroup>
                </Col>
                <Col md={3}>
                  <FormGroup>
                    <Label for="opportunity">Opportunity ID</Label>
                    <Input
                      name="opportunity"
                      id="opportunity"
                      value={state?.opportunity}
                      onChange={handleChange}
                    />
                  </FormGroup>
                </Col>
                <Col md={3}>
                  <FormGroup>
                    <Label for="serviceOrderNumber">Service Order #</Label>
                    <Input
                      name="serviceOrderNumber"
                      id="serviceOrderNumber"
                      value={state?.serviceOrderNumber}
                      onChange={handleChange}
                    />
                  </FormGroup>
                </Col>
                <Col md={3}>
                  <FormGroup>
                    <Label for="fixCds">Fix CDS #</Label>
                    <Input
                      name="fixCds"
                      id="fixCds"
                      value={state?.fixCds}
                      onChange={handleChange}
                    />
                  </FormGroup>
                </Col>
                <Col md={3}>
                  <FormGroup>
                    <Label for="businessCaseNumber">Business Case #</Label>
                    <Input
                      name="businessCaseNumber"
                      id="businessCaseNumber"
                      value={state?.businessCaseNumber}
                      onChange={handleChange}
                    />
                  </FormGroup>
                </Col>
                <Col md={3}>
                  <FormGroup>
                    <Label for="srfNumber">SRF #</Label>
                    <Input
                      name="srfNumber"
                      id="srfNumber"
                      value={state?.srfNumber}
                      onChange={handleChange}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md={3}>
                  <FormGroup>
                    <Label for="status">Status</Label>
                    <DropdownList
                      data={[
                        "Draft",
                        "Submitted",
                        "Assigned",
                        "SRF Rejected",
                        "SRF Dropped",
                        "HLD",
                        "HLD(MNS/MS)",
                        "LLD Submitted",
                        "LLD Rejected",
                        "LLD Closed",
                        "MPN Submitted",
                        "MPN Assigned",
                        "MPN Rejected",
                        "SRF Rejected(CPQ)",
                        "Closed",
                      ]}
                      value={state?.status}
                      onChange={(v) =>
                        handleChange({ target: { name: "status", value: v } })
                      }
                    />
                  </FormGroup>
                </Col>
                <Col md={3}>
                  <FormGroup>
                    <Label for="requestor">{`Requester(Maxis Id)`}</Label>
                    <Input
                      name="requestor"
                      id="requestor"
                      value={state?.requestor}
                      onChange={handleChange}
                    />
                  </FormGroup>
                </Col>
                <Col md={3}>
                  <FormGroup>
                    <Label>Submitted Start Date</Label>
                    <DatePicker
                      defaultValue={new Date()}
                      valueEditFormat={{ dateStyle: "short" }}
                      valueDisplayFormat={{ dateStyle: "medium" }}
                      onChange={(date) =>
                        handleChange({
                          target: { name: "StartDate", value: date },
                        })
                      }
                    />
                  </FormGroup>
                </Col>
                <Col md={3}>
                  <FormGroup>
                    <Label>Submitted End Date</Label>
                    <DatePicker
                      defaultValue={new Date()}
                      valueEditFormat={{ dateStyle: "short" }}
                      valueDisplayFormat={{ dateStyle: "medium" }}
                      onChange={(date) =>
                        handleChange({
                          target: { name: "EndDate", value: date },
                        })
                      }
                    />
                  </FormGroup>
                </Col>
              </Row>
              <div>
                <Button
                  color="primary"
                  className="mr-2"
                  onClick={getSearchData}
                >
                  Show Data
                </Button>
                &nbsp;
                <Button color="danger" outline onClick={resetFilter}>
                  Reset Data
                </Button>
              </div>
            </Card>
            <Row>
              <Col md="12">
                <NeptuneAgGrid
                  data={searchList}
                  dataprops={inboxColumns(handleViewDetails)}
                  paginated={true}
                  itemsPerPage={10}
                  searchable={true}
                  exportable={true}
                />
              </Col>
            </Row>
          </div>
        </CardBody>
      </Card>
    </>
  );
};
export default EdSearch;
