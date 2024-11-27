import { useEffect, useLayoutEffect, useState } from "react";
import { DropdownList, Multiselect } from "react-widgets";
import { Button, Card, CardBody, Col, FormGroup, Input, Label, Modal, ModalBody, ModalHeader, Row } from "reactstrap";
import { getDropdownByTypeHTTP } from "../../../../services/global-service";
import { toast } from "react-toastify";
import { updateSrfUsersHTTP } from "../../../../services/srf-service";

const SRFUserDetailModal = ({ isOpen, selectedUser, onClose, getAllUsers }) => {
    const [state, setState] = useState({
        MaxisId: '',
        DisplayName: '',
        WorkforceId: '',
        Department: '',
        Phone: '',
        Email: '',
        UserStatus: '',
        UserRoles: [],
        Gatekeeper: [],
        Groups: [],
        ReorgUserRole: [],
        ReorgHLDGroups: []
    });
    const [dropdownValues, setDropdownValues] = useState(null);
    useLayoutEffect(() => {
        getDropdowns();
    }, [])

    useEffect(() => {
        
        if (selectedUser) {
            
            const { MaxisId, DisplayName, Gatekeeper, WorkforceId, Department, Phone, Email,
                UserStatus, UserRoles, Groups, ReorgUserRole, ReorgHLDGroups } = selectedUser;
            setState({
                ...state,
                MaxisId,
                DisplayName,
                WorkforceId,
                Department,
                Phone,
                Email,
                UserStatus,
                Gatekeeper: Gatekeeper ? Gatekeeper?.split(',') : [],
                UserRoles: UserRoles ? UserRoles?.split(',') : [],
                Groups: Groups ? Groups?.split(',') : [],
                ReorgUserRole: ReorgUserRole ? ReorgUserRole?.split(',') : [],
                ReorgHLDGroups: ReorgHLDGroups ? ReorgHLDGroups?.split(',') : []
            })
        }
        //eslint-disable-next-line
    }, [selectedUser])

    const getDropdowns = async () => {
        const tempDropdown = {};
        const [oldUserRoles, oldGroups, roles, srfCatalogue] = await Promise.all([
            getDropdownByTypeHTTP({ DropDownType: 'User Roles', Filter1: 'Maxis', LoginUIID: sessionStorage.getItem('uiid') }),
            getDropdownByTypeHTTP({ DropDownType: 'SRF BIZ VERTICAL', Filter1: 'Maxis', LoginUIID: sessionStorage.getItem('uiid') }),
            getDropdownByTypeHTTP({ DropDownType: 'SRF User Roles', Filter1: 'Maxis', LoginUIID: sessionStorage.getItem('uiid') }),
            getDropdownByTypeHTTP({ DropDownType: 'SRF Workflow Catalogue DDL Values', LoginUIID: sessionStorage.getItem('uiid') })
        ]);
        if (roles) {
            const rolesList = roles?.data?.data?.[0]?.DropDownValue?.split(',')
            tempDropdown['userRoles'] = rolesList;
        }
        if (srfCatalogue) {
            srfCatalogue?.data?.data?.forEach(d => {
                tempDropdown[d.DropDownType] = d?.DropDownValue?.split(',');
            })
        }
        if (oldUserRoles) {
            oldUserRoles?.data?.data?.forEach(d => {
                tempDropdown[d.DropDownType] = d?.DropDownValue?.split(',');
            })
        }
        if (oldGroups) {
            oldGroups?.data?.data?.forEach(d => {
                tempDropdown[d.DropDownType] = d?.DropDownValue?.split(',');
            })
        }
        setDropdownValues(tempDropdown);
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setState({ ...state, [name]: value });
    }

    const handleSubmit = async () => {
        const payload = { ...state };
        payload.Gatekeeper = payload.Gatekeeper?.join(',');
        payload.Groups = payload.Groups?.join(',');
        payload.UserRoles = payload.UserRoles?.join(',');
        payload.ReorgUserRole = payload.ReorgUserRole?.join(',');
        payload.ReorgHLDGroups = payload.ReorgHLDGroups?.join(',');
        payload['Applications'] = null;
        payload['Action'] = 'Update';
        payload['LoginUIID'] = sessionStorage.getItem('uiid');
        try {
            const { data: { statusCode, statusMessage } } = await updateSrfUsersHTTP(payload);
            if (statusCode === 200) {
                toast.success(statusMessage);
                onClose(false);
                getAllUsers();
            }
        } catch (e) {
            toast.error('Something went wrong');
        }
    }

    return (
        <>
            <Modal size="xl" isOpen={isOpen} backdrop={true}>
                <ModalHeader>{'User Details'}</ModalHeader>
                <ModalBody>
                    <Card className="card_outer_padding">
                        <CardBody>
                            <Row>
                                <Col md={4}>
                                    <FormGroup>
                                        <Label for="MaxisID">Maxis ID</Label>
                                        <Input
                                            name="MaxisID"
                                            id="MaxisID"
                                            value={state?.MaxisId}
                                            disabled
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md={4}>
                                    <FormGroup>
                                        <Label for="Name">Name</Label>
                                        <Input
                                            name="Name"
                                            id="Name"
                                            value={state?.DisplayName}
                                            disabled
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md={4}>
                                    <FormGroup>
                                        <Label for="WorkforceID">Workforce ID</Label>
                                        <Input
                                            name="WorkforceID"
                                            id="WorkforceID"
                                            value={state?.WorkforceId}
                                            disabled
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={4}>
                                    <FormGroup>
                                        <Label for="Department">Department</Label>
                                        <Input
                                            name="Department"
                                            id="Department"
                                            value={state?.Department}
                                            disabled
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md={4}>
                                    <FormGroup>
                                        <Label for="Phone">Phone #</Label>
                                        <Input
                                            name="Phone"
                                            id="Phone"
                                            value={state?.Phone}
                                            disabled
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md={4}>
                                    <FormGroup>
                                        <Label for="Email">Email ID</Label>
                                        <Input
                                            name="Email"
                                            id="Email"
                                            value={state?.Email}
                                            disabled
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={4}>
                                    <FormGroup>
                                        <Label>User Status</Label>
                                        <DropdownList
                                            disabled
                                            id="status"
                                            value={state?.UserStatus}
                                            data={['Active', 'Pending Activation']}
                                            onChange={(v) => handleChange({ target: { name: 'UserStatus', value: v } })}
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                            {/* <Row>
                                <Col md={12}>
                                    <FormGroup>
                                        <Label>User Roles</Label>
                                        <Multiselect
                                            id="status"
                                            value={state?.UserRoles}
                                            data={dropdownValues?.['User Roles']}
                                            onChange={(v) => handleChange({ target: { name: 'UserRoles', value: v } })}
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={12}>
                                    <FormGroup>
                                        <Label>Groups</Label>
                                        <Multiselect
                                            id="Groups"
                                            value={state?.Groups}
                                            data={dropdownValues?.['SRF BIZ VERTICAL']}
                                            onChange={(v) => handleChange({ target: { name: 'Groups', value: v } })}
                                        />
                                    </FormGroup>
                                </Col>
                            </Row> */}
                            <Row>
                                <Col md={12}>
                                    <FormGroup>
                                        <Label>User Roles</Label>
                                        <Multiselect
                                            id="ReorgUserRole"
                                            value={state?.ReorgUserRole}
                                            data={dropdownValues?.userRoles}
                                            onChange={(v) => handleChange({ target: { name: 'ReorgUserRole', value: v } })}
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={12}>
                                    <FormGroup>
                                        <Label>Gatekeeper</Label>
                                        <Multiselect
                                            id="Gatekeeper"
                                            value={state?.Gatekeeper}
                                            data={dropdownValues?.['SRF Gate Keeper']}
                                            onChange={(v) => handleChange({ target: { name: 'Gatekeeper', value: v } })}
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={12}>
                                    <FormGroup>
                                        <Label>HLD Groups</Label>
                                        <Multiselect
                                            id="ReorgHLDGroups"
                                            value={state?.ReorgHLDGroups}
                                            data={dropdownValues?.['SRF HLD Combined Group']}
                                            onChange={(v) => handleChange({ target: { name: 'ReorgHLDGroups', value: v } })}
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <div className="pull-right">
                                <Button color="primary" onClick={handleSubmit}>Update</Button>&nbsp;
                                <Button color="primary" outline onClick={() => onClose(false)}>Back</Button>
                            </div>
                        </CardBody>
                    </Card>
                </ModalBody>
            </Modal>
        </>)
}
export default SRFUserDetailModal;