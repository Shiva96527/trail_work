import { useEffect, useState } from "react";
import { DropdownList } from "react-widgets";
import { Button, Card, CardBody, Col, FormGroup, Label, Modal, ModalBody, ModalHeader, Row } from "reactstrap";
import { getDropdownByTypeHTTP } from "../../../../services/global-service";

const AssignGroupModal = ({ isOpen, selectedData, fromModule, onClose, title, handleAssign }) => {
    const [state, setState] = useState({ assignName: '', fromModule: '',bizVertical:'' });
    const [dropdownOptions, setDropdownOptions] = useState({});
    const [bizVerticalDropdownOptions, setBizVerticalDropdownOptions] = useState({});

    useEffect(() => {
        getDropdowns();
        getBizVerticalDropdowns();
        setState({ ...state, fromModule });
        setState({ ...state, bizVertical:selectedData?.BizVertical });
        // eslint-disable-next-line
    }, [fromModule])

    const getDropdowns = async () => {
        const type = fromModule === 'srfgroup-reassign' ? 'GroupName' :
            fromModule === 'srfgroup-others' || fromModule === 'inbox-reassign' ? 'AssignGateKeeper' :
                fromModule === 'inbox-movetogroup' ? 'AssignGateKeeper' :
                    '';
        const payload = {
            DropDownType: type,
            Filter1: selectedData?.SRFNumber,
            Filter2: selectedData?.GroupName,
            LoginUIID: sessionStorage.getItem('uiid'),
        }
        const { data: { data: resultData, statusCode } } = await getDropdownByTypeHTTP(payload);
        if (statusCode === 200) {
            let tempDropdownOptions = {};
            resultData.forEach(f => {
                tempDropdownOptions[f?.DropDownType] = f?.DropDownValue ? f?.DropDownValue?.split(',') : [];
            })
            setDropdownOptions(tempDropdownOptions);
        }
    }

    const getBizVerticalDropdowns = async () => {        
        const payload = {
            DropDownType: 'SRF BIZ VERTICAL',
            Filter1: selectedData?.SRFNumber,
            Filter2: selectedData?.GroupName,
            LoginUIID: sessionStorage.getItem('uiid'),
        }
        const { data: { data: resultData, statusCode } } = await getDropdownByTypeHTTP(payload);
        if (statusCode === 200) {
            let tempDropdownOptions = {};
            resultData.forEach(f => {
                tempDropdownOptions[f?.DropDownType] = f?.DropDownValue ? f?.DropDownValue?.split(',') : [];
            })
            setBizVerticalDropdownOptions(tempDropdownOptions);
        }
    }

    return (
        <>
            <Modal size="lg" isOpen={isOpen} backdrop={true}>
                <ModalHeader>{title}</ModalHeader>
                <ModalBody>
                    <Card className="card_outer_padding">
                        <CardBody>
                            <Row>
                                <Col md={2}>
                                    <Label><strong>SRF Number:</strong></Label>
                                </Col>
                                <Col md={6}>
                                    <Label>{selectedData?.SRFNumber}</Label>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={2}>
                                    <Label><strong>Biz Vertical:</strong></Label>
                                </Col>
                                <Col md={4}>
                                    <FormGroup>
                                        <DropdownList
                                            id="bizVertical"
                                            data={bizVerticalDropdownOptions?.['SRF BIZ VERTICAL']}
                                            value={state?.bizVertical}
                                             onChange={(v) => setState({ ...state, bizVertical: v })}
                                            //onChange={(v) => setState({...state, target: { name: 'bizVertical', value: v } })}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md={3}>
                                <Button color="primary" disabled={!state?.bizVertical} onClick={() => handleAssign(state, selectedData,'Update BizVertical')}>Update BizVertical</Button>&nbsp;
                                </Col>
                            </Row>
                            <Row>
                                <Col md={2}>
                                    <Label><strong>Group Name:</strong></Label>
                                </Col>
                                <Col md={6}>
                                    <Label>{selectedData?.GroupName}</Label>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={2}>
                                    <Label><strong>Assign To:</strong></Label>
                                </Col>
                                <Col md={4}>
                                    <FormGroup>
                                        <DropdownList
                                            id="assignTo"
                                            data={dropdownOptions?.['AssignGateKeeper'] || dropdownOptions?.['GroupName']}
                                            value={state?.assignName}
                                            onChange={(v) => setState({ ...state, assignName: v })}
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <div className="pull-right">
                                <Button color="primary" disabled={!state?.assignName} onClick={() => handleAssign(state, selectedData,'AssignUser')}>Assign</Button>&nbsp;
                                <Button color="primary" outline onClick={() => onClose(false)}>Back</Button>
                            </div>
                        </CardBody>
                    </Card>
                </ModalBody>
            </Modal>
        </>
    )
}

export default AssignGroupModal;