import { Accordion, AccordionBody, AccordionHeader, AccordionItem, Button, Card, CardBody, CardTitle, Col, FormGroup, Input, Label, Row } from "reactstrap";
import { useState } from "react";
import { toast } from "react-toastify";
import { generateSrfHTTP } from "../../../services/srf-service";
import { isAnyRequiredFieldEmpty } from "./config/schemas";
import { Spinner } from 'reactstrap'; // Import Spinner from reactstrap
import { useNavigate } from "react-router-dom";

const generatedModel = {
    Assignee: '',
    OpportunityID: '',
    FIXCAS: '',
    FixCDS: '',
    BC: '',
    SRF: ''
};

const CreateSrfEdInbox = () => {
    const [generatedSrfModel, setGenerateSrfModel] = useState({ ...generatedModel });
    const [open, setOpen] = useState('1');
    const [records, setRecords] = useState([]); // New state to store all submitted records
    const [isLoading, setIsLoading] = useState(false); // Loading state
    const navigate = useNavigate();

    const toggle = (id) => {
        if (open === id) {
            setOpen();
        } else {
            setOpen(id);
        }
    };

    const handleSrfChange = (e) => {
        const { name, value } = e.target;
        setGenerateSrfModel({ ...generatedSrfModel, [name]: value });
    };

    const handleGenerateSrfSubmit = async () => {
        const hasError = isAnyRequiredFieldEmpty(generatedSrfModel);
    
        if (hasError) {
            toast.error('Please fill in required fields.');
            return; // Don't proceed with submission if any required field is empty
        }

        setIsLoading(true); // Show the loading spinner when submitting
        
        // Prepare the payload with the form data
        const payload = {};
        const tempPayload = { ...generatedSrfModel };
        const commaSeparatedService = tempPayload?.TypeofService?.map(m => m.value).join(',');
        tempPayload.TypeofService = commaSeparatedService;
        payload['srfCreateInfoResponse'] = { ...tempPayload };
        payload['Action'] = 'Generate SRF';
        payload['LoginUIID'] = sessionStorage.getItem('uiid');
    
        try {
            const { data: { data: resultData, statusCode, statusMessage } } = await generateSrfHTTP(payload);
    
            if (statusCode === 200) {
                toast.success('Record created successfully'); 
                if (resultData) {
                    // Append the new record to the existing records array
                    setRecords((prevRecords) => {
                        const updatedRecords = [...prevRecords, { ...generatedSrfModel }];
                        navigate('/neptune/edquotation/inbox');
                        console.log('All Records:', updatedRecords);  
                        return updatedRecords;
                        
                    });
                }
            } else {
                toast.error(statusMessage || 'No data found'); 
            }
        } catch (e) {
            toast.error('Something went wrong'); 
        }

        setIsLoading(false); 

        setGenerateSrfModel({ ...generatedModel });
    };

    return (
        <>
            <Card className="card_outer_padding">
                <CardTitle>Create SRF</CardTitle>
                <CardBody>
                    <div className="app-inner-layout__wrapper">
                        <Accordion flush open={open} toggle={toggle}>
                            <AccordionItem>
                                <AccordionHeader targetId="1"><strong>SRF</strong></AccordionHeader>
                                <AccordionBody accordionId="1">
                                    <Row>
                                        <Col md={3}>
                                            <FormGroup>
                                                <Label for="srfNumber">SRF #</Label>
                                                <Input
                                                    name="SRF"
                                                    id="srfNumber"
                                                    value={generatedSrfModel?.SRF}
                                                    onChange={handleSrfChange}
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col md={3}>
                                            <FormGroup>
                                                <Label for="OpportunityCRMID">{`Opportunity/CRM ID`}<span className="required">*</span></Label>
                                                <Input
                                                    name="OpportunityID"
                                                    id="OpportunityCRMID"
                                                    value={generatedSrfModel?.OpportunityID}
                                                    onChange={handleSrfChange}
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col md={3}>
                                            <FormGroup>
                                                <Label for="AssigneeName">Assignee</Label>
                                                <Input
                                                    name="Assignee"
                                                    id="AssigneeName"
                                                    value={generatedSrfModel?.Assignee}
                                                    onChange={handleSrfChange}
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col md={3}>
                                            <FormGroup>
                                                <Label for="BC">BC</Label>
                                                <Input
                                                    name="BC"
                                                    id="BC"
                                                    value={generatedSrfModel?.BC}
                                                    onChange={handleSrfChange}
                                                />
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={3}>
                                            <FormGroup>
                                                <Label for="fixcasNumber">FIXCAS# SO#</Label>
                                                <Input
                                                    name="FIXCAS"
                                                    id="fixcasNumber"
                                                    value={generatedSrfModel?.FIXCAS}
                                                    onChange={handleSrfChange}
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col md={3}>
                                            <FormGroup>
                                                <Label for="fixcdsNumber">FIXCDS SO#</Label>
                                                <Input
                                                    name="FixCDS"
                                                    id="fixcdsNumber"
                                                    value={generatedSrfModel?.FixCDS}
                                                    onChange={handleSrfChange}
                                                />
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <div>
                                        <Button color="primary" onClick={handleGenerateSrfSubmit} disabled={isLoading}>
                                            {isLoading ? (
                                                <Spinner size="sm" /> // Display the spinner while loading
                                            ) : (
                                                'Submit'
                                            )}
                                        </Button>
                                    </div>
                                  {/* Display the list of submitted records */}
                                    {records.length > 0 && (
                                        <div className="mt-3">
                                            <h4>Submitted Records</h4>
                                            <div>
                                                {records.map((record, index) => (
                                                    <div key={index}>
                                                        <span>{index + 1}. </span>
                                                        SRF #: {record.SRF} | 
                                                        Opportunity ID: {record.OpportunityID} | 
                                                        Assignee: {record.Assignee} | 
                                                        BC: {record.BC} | 
                                                        FIXCAS: {record.FIXCAS} | 
                                                        FixCDS: {record.FixCDS}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </AccordionBody>
                            </AccordionItem>
                        </Accordion>
                    </div>
                </CardBody>
            </Card >
        </>
    );
};

export default CreateSrfEdInbox;
