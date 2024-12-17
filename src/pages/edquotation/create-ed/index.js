import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
  Button,
  Card,
  CardBody,
  CardTitle,
  Col,
  FormGroup,
  Input,
  Label,
  Row,
  Spinner,
} from "reactstrap";
import { useState } from "react";
import { toast } from "react-toastify";
import { createDigitalEDQuote } from "../../../services/ed-service";
import { isAnyRequiredFieldEmpty } from "./config/schemas";
import { useNavigate } from "react-router-dom";

const generatedModel = {
  assignee: "",
  opportunityID: "",
  fixCasNumber: "",
  fixCdsNumber: "",
  businessCaseNumber: "",
  srfNumber: "",
};

const CreateEd = () => {
  const [generatedEdModel, setGenerateEdModel] = useState({
    ...generatedModel,
  });
  const [open, setOpen] = useState("1");
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  const toggle = (id) => {
    if (open === id) {
      setOpen();
    } else {
      setOpen(id);
    }
  };

  const handleEdChange = (e) => {
    const { name, value } = e.target;
    setGenerateEdModel({ ...generatedEdModel, [name]: value });
  };

  const handleEdSubmit = async () => {
    const hasError = isAnyRequiredFieldEmpty(generatedEdModel);

    if (hasError) {
      toast.error("Please fill in required fields.");
      return; // Don't proceed with submission if any required field is empty
    }

    setIsLoading(true); // Show the loading spinner when submitting

    // Prepare the payload with the form data
    const payload = {
      loginUIID: sessionStorage.getItem("uiid"), // or dynamic value
      assignee: generatedEdModel.assignee,
      opportunityID: generatedEdModel.opportunityID,
      fixCasNumber: generatedEdModel.fixCasNumber,
      fixCdsNumber: generatedEdModel.fixCdsNumber,
      businessCaseNumber: generatedEdModel.businessCaseNumber,
      srfNumber: generatedEdModel.srfNumber,
    };
    try {
      const data = await createDigitalEDQuote(payload);
      const {
        data: { statusCode, statusMessage },
      } = data;
      if (statusCode === 200) {
        navigate("/neptune/edquotation/inbox");
        toast.success(statusMessage);
      } else {
        toast.error(statusMessage);
      }
    } catch (e) {
      toast.error("Something went wrong");
    }

    setIsLoading(false);
  };

  return (
    <>
      <Card className="card_outer_padding">
        <div
          className="d-flex justify-content-between align-items-center"
          style={{ margin: "25px 0px" }}
        >
          <CardTitle className="mx-auto">Create ED Quotation</CardTitle>
          <Button
            color="primary"
            onClick={() => navigate(-1)}
            style={{ padding: "10px 20px" }}
          >
            Back
          </Button>
        </div>
        <CardBody>
          <div className="app-inner-layout__wrapper">
            <Accordion flush open={open} toggle={toggle}>
              <AccordionItem>
                <AccordionHeader targetId="1">
                  <strong>ED Quotation</strong>
                </AccordionHeader>
                <AccordionBody accordionId="1">
                  <Row>
                    <Col md={3}>
                      <FormGroup>
                        <Label for="srfNumber">SRF #</Label>
                        <Input
                          name="srfNumber"
                          id="srfNumber"
                          value={generatedEdModel?.srfNumber}
                          onChange={handleEdChange}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={3}>
                      <FormGroup>
                        <Label for="OpportunityCRMID">
                          {`Opportunity/CRM ID`}
                          <span className="required">*</span>
                        </Label>
                        <Input
                          name="opportunityID"
                          id="opportunityID"
                          value={generatedEdModel?.opportunityID}
                          onChange={handleEdChange}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={3}>
                      <FormGroup>
                        <Label for="AssigneeName">
                          Assignee(Maxis ID)
                          <span className="required">*</span>
                        </Label>
                        <Input
                          name="assignee"
                          id="assignee"
                          value={generatedEdModel?.assignee}
                          onChange={handleEdChange}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={3}>
                      <FormGroup>
                        <Label for="BC">BC #</Label>
                        <Input
                          name="businessCaseNumber"
                          id="businessCaseNumber"
                          value={generatedEdModel?.businessCaseNumber}
                          onChange={handleEdChange}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={3}>
                      <FormGroup>
                        <Label for="fixcasNumber">FIXCAS #</Label>
                        <Input
                          name="fixCasNumber"
                          id="fixCasNumber"
                          value={generatedEdModel?.fixCasNumber}
                          onChange={handleEdChange}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={3}>
                      <FormGroup>
                        <Label for="fixcdsNumber">FIXCDS #</Label>
                        <Input
                          name="fixCdsNumber"
                          id="fixCdsNumber"
                          value={generatedEdModel?.fixCdsNumber}
                          onChange={handleEdChange}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <div>
                    <Button
                      color="primary"
                      onClick={handleEdSubmit}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Spinner size="sm" /> // Display the spinner while loading
                      ) : (
                        "Submit for Vendor Assignment"
                      )}
                    </Button>
                  </div>
                </AccordionBody>
              </AccordionItem>
            </Accordion>
          </div>
        </CardBody>
      </Card>
    </>
  );
};

export default CreateEd;
