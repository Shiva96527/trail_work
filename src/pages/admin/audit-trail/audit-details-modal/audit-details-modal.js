import { useEffect, useState } from "react";
import { Button, Card, CardBody, Col, FormGroup, Input, Label, Modal, ModalBody, ModalHeader, Row } from "reactstrap";

const AuditModalDetails = ({ isOpen, selectedAudit, handleAuditModal }) => {
    const [state, setState] = useState({ otc: '', mrc: '' });

    useEffect(() => {
        if (selectedAudit) {
            setState({ ...state, otc: selectedAudit?.OTC, mrc: selectedAudit?.MRC })
        }
        // eslint-disable-next-line
    }, [])


    return (
        <>
            <Modal size="lg" isOpen={isOpen} backdrop={true}>
                <ModalHeader>View Logs</ModalHeader>
                <ModalBody>
                    <Card className="card_outer_padding">
                        <CardBody>
                            <div className="app-inner-layout__wrapper">
                                <Row>
                                    <Col md={4}>
                                        <FormGroup>
                                            <Label for="ActionType">Action Type</Label>
                                            <Input
                                                rows={3}
                                                type="textarea"
                                                className="form-control"
                                                name="ActionType"
                                                id="ActionType"
                                                disabled
                                                value={selectedAudit?.Action_Type_Value}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col md={4}>
                                        <FormGroup>
                                            <Label for="Source_IP">Source IP</Label>
                                            <Input
                                                rows={3}
                                                type="textarea"
                                                className="form-control"
                                                name="Source_IP"
                                                id="Source_IP"
                                                disabled
                                                value={selectedAudit?.Source_IP}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col md={4}>
                                        <FormGroup>
                                            <Label for="Module">Module</Label>
                                            <Input
                                                name="Module"
                                                id="Module"
                                                disabled
                                                value={selectedAudit?.Module}
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={4}>
                                        <FormGroup>
                                            <Label for="Sub_Module">Sub Module</Label>
                                            <Input
                                                name="Sub_Module"
                                                id="Sub_Module"
                                                disabled
                                                value={selectedAudit?.Sub_Module}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col md={4}>
                                        <FormGroup>
                                            <Label for="URL">URL</Label>
                                            <Input
                                                name="URL"
                                                id="URL"
                                                disabled
                                                value={selectedAudit?.URL}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col md={4}>
                                        <FormGroup>
                                            <Label for="Activity">Activity</Label>
                                            <Input
                                                rows={3}
                                                type="textarea"
                                                className="form-control"
                                                name="Activity"
                                                id="Activity"
                                                disabled
                                                value={selectedAudit?.Activity}
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={4}>
                                        <FormGroup>
                                            <Label for="User_Name">User Name</Label>
                                            <Input
                                                name="User_Name"
                                                id="User_Name"
                                                disabled
                                                value={selectedAudit?.User_Name}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col md={4}>
                                        <FormGroup>
                                            <Label for="Created_On">Date And Time</Label>
                                            <Input
                                                name="Created_On"
                                                id="Created_On"
                                                disabled
                                                value={selectedAudit?.Created_On}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col md={4}>
                                        <FormGroup>
                                            <Label for="Source_Type">Source Type</Label>
                                            <Input
                                                type="text"
                                                name="Source_Type"
                                                id="Source_Type"
                                                disabled
                                                value={selectedAudit?.Source_Type}
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={4}>
                                        <FormGroup>
                                            <Label for="Source_App">Source App</Label>
                                            <Input
                                                name="Source_App"
                                                id="Source_App"
                                                type="text"
                                                disabled
                                                value={selectedAudit?.Source_App}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col md={8}>
                                        <FormGroup>
                                            <Label for="Paramerters">Parameters</Label>
                                            <Input
                                                name="Paramerters"
                                                id="Paramerters"
                                                type="textarea"
                                                rows={3}
                                                disabled
                                                value={selectedAudit?.Paramerters}
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <div className="pull-right">
                                    <Button color="primary" outline onClick={() => handleAuditModal(false)}>
                                        Close
                                    </Button>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </ModalBody>
            </Modal >
        </>
    )
}

export default AuditModalDetails;