import { Button, Card, CardBody, Col, Form, FormGroup, Input, Label, Modal, ModalBody, ModalHeader, Row } from "reactstrap";
import Select from 'react-select';
import useGetRoleInfo from "../hooks/get-role-info-hook";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { userDetailsUpdateHTTP } from "../../../../services/user-service";

const UserDetailsModal = ({ selectedUser, isOpen, handleUserDetailsModal }) => {
    const [getAllRoles, webRoleList, mobileRoleList, selectedWebRoles, selectedMobileRole] = useGetRoleInfo({ selectedUser });
    const [state, setState] = useState({ webRoles: selectedWebRoles || [], mobileRoles: selectedMobileRole || '', status: '', mobile: '' });
    const statusOptions = [{ label: 'Active', value: '1' }, { label: 'Inactive', value: '2' }];
    useEffect(() => {
        getAllRoles();
        //eslint-disable-next-line
    }, [isOpen])

    useEffect(() => {
        if (selectedMobileRole || selectedWebRoles) {
            setState({ ...state, webRoles: selectedWebRoles || [], mobileRoles: selectedMobileRole || null, status: selectedUser?.Status ? '1' : '2', mobile: selectedUser?.Mobile_No });
        }
        //eslint-disable-next-line
    }, [selectedWebRoles, selectedMobileRole])

    const decideSubmit = () => {
        const payloads = [];
        if (selectedUser?.Mobile_No !== state?.mobile) {
            payloads.push(userDetailsUpdateHTTP({
                Email: selectedUser?.Email,
                Mobile_No: selectedUser?.Mobile_No,
                Status: state?.status,
                User_ID: selectedUser?.User_ID,
                User_Name: selectedUser?.User_Name,
                type: 'MobileNoUpdate'
            }));
        }
        if (selectedUser?.Status !== (state?.status === '1' ? true : false)) {
            payloads.push(userDetailsUpdateHTTP({
                Email: selectedUser?.Email,
                Mobile_No: selectedUser?.Mobile_No,
                Status: state?.status,
                User_ID: selectedUser?.User_ID,
                User_Name: selectedUser?.User_Name,
                type: 'StatusUpdate'
            }));
        }
        if (payloads.length === 0) {
            return;
        }
        handleSave(payloads);
    }

    const handleSave = async (payloads) => {
        try {
            const [req1, req2] = await Promise.all(payloads);
            if (payloads.length > 1) {
                if (req1 && req2) {
                    toast.success('Details updated successfully');
                } else {
                    toast.error('Something went wrong');
                }
            } else {
                if (req1) {
                    toast.success('Details updated successfully');
                } else {
                    toast.error('Something went wrong');
                }
            }
        } catch (e) {
            toast.error('Something went wrong');
        }
    }
    return (
        <>
            <Modal size="lg" isOpen={isOpen} backdrop={true}>
                <ModalHeader>View Role</ModalHeader>
                <ModalBody>
                    <Card className="card_outer_padding">
                        <CardBody>
                            <Form>
                                <Row>
                                    <Col md={4}>
                                        <FormGroup>
                                            <Label for="userId">User ID</Label>
                                            <Input
                                                type="text"
                                                name="userId"
                                                id="userId"
                                                disabled
                                                value={selectedUser?.User_Name}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col md={4}>
                                        <FormGroup>
                                            <Label for="name">User First Name</Label>
                                            <Input
                                                type="text"
                                                name="name"
                                                id="name"
                                                disabled
                                                value={selectedUser?.User_First_Name}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col md={4}>
                                        <FormGroup>
                                            <Label for="department">Department</Label>
                                            <Input
                                                type="text"
                                                name="department"
                                                disabled
                                                id="department"
                                                value={selectedUser?.Department}
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={4}>
                                        <FormGroup>
                                            <Label for="mobile">Mobile No</Label>
                                            <Input
                                                type="text"
                                                name="mobile"
                                                id="mobile"
                                                value={state?.mobile}
                                                onChange={(e) => setState({ ...state, mobile: e.target.value })}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col md={4}>
                                        <FormGroup>
                                            <Label for="email">Email</Label>
                                            <Input
                                                type="text"
                                                name="email"
                                                disabled
                                                id="email"
                                                value={selectedUser?.Email}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col md={4}>
                                        <FormGroup>
                                            <Label for="email">Status</Label>
                                            <Select
                                                value={statusOptions?.find(f => f.value === state?.status)}
                                                options={statusOptions}
                                                onChange={(v) => setState({ ...state, status: v.value })}
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={8}>
                                        <FormGroup>
                                            <Label for="roles">Web Roles</Label>
                                            <Select
                                                isDisabled
                                                isMulti
                                                value={state?.webRoles}
                                                options={webRoleList}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col md={4}>
                                        <FormGroup>
                                            <Label for="mobileRoles">Mobile Roles</Label>
                                            <Select
                                                isDisabled
                                                value={state?.mobileRoles || 0}
                                                options={mobileRoleList}
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <div className="pull-right">
                                    <Button color="primary" className="mr-2" onClick={decideSubmit}>
                                        Submit
                                    </Button>&nbsp;
                                    <Button color="primary" outline onClick={() => handleUserDetailsModal(false)}>
                                        Cancel
                                    </Button>
                                </div>
                            </Form>
                        </CardBody>
                    </Card>
                </ModalBody>
            </Modal>
        </>
    )
}

export default UserDetailsModal;