import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button, Card, CardBody, Col, Form, FormGroup, Input, Label, Modal, ModalBody, ModalHeader, Row } from "reactstrap";
import { updateRolesHTTP } from "../../../../services/user-service";
import Select from 'react-select';
import { toast } from "react-toastify";
import useGetRoleInfo from "../hooks/get-role-info-hook";

const UserRoleModal = ({ isOpen, handleUserModal, selectedUser, getAllUsers }) => {
    const [getAllRoles, webRoleList, mobileRoleList, selectedWebRoles, selectedMobileRole] = useGetRoleInfo({ selectedUser });
    const { userInfo } = useSelector(state => state.globalSlice);
    const [state, setState] = useState({ webRoles: selectedWebRoles || [], mobileRoles: selectedMobileRole || '' });


    useEffect(() => {
        getAllRoles();
        //eslint-disable-next-line
    }, [isOpen])

    useEffect(() => {
        if (selectedMobileRole || selectedWebRoles) {
            setState({ ...state, webRoles: selectedWebRoles || [], mobileRoles: selectedMobileRole || null });
        }
        //eslint-disable-next-line
    }, [selectedWebRoles, selectedMobileRole])

    const handleSave = async () => {
        const payload = {
            loginusername: userInfo?.user?.User_Name,
            mobileRoleId: state?.mobileRoles?.value,
            roleId: state?.webRoles?.map(m => m.value),
            userId: selectedUser?.User_ID
        }
        try {
            const { status, Message } = await updateRolesHTTP(payload);
            if (status === 200) {
                toast.success('Successfully assigned role..!');
                handleUserModal(false);
                getAllUsers();
            } else {
                toast.error(Message);
            }
        } catch (e) {
            toast.error('Something went wrong');
        }
    }

    return (
        <>
            <Modal size="lg" isOpen={isOpen} backdrop={true}>
                <ModalHeader>Assign Roles</ModalHeader>
                <ModalBody>
                    <Card className="card_outer_padding">
                        <CardBody>
                            <Form>
                                <Row>
                                    <Col md={4}>
                                        <FormGroup>
                                            <Label for="userName">User Name</Label>
                                            <span className="required">*</span>
                                            <Input
                                                type="text"
                                                name="userName"
                                                id="userName"
                                                disabled
                                                value={selectedUser?.User_Name}
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={12}>
                                        <FormGroup>
                                            <Label for="webRoles">Web Roles</Label>
                                            <span className="required">*</span>
                                            <Select
                                                isMulti
                                                value={state?.webRoles}
                                                options={webRoleList}
                                                onChange={(data) => setState({ ...state, webRoles: data })}
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={12}>
                                        <FormGroup>
                                            <Label for="mobileRoles">Mobile Roles</Label>
                                            <span className="required">*</span>
                                            <Select
                                                value={state?.mobileRoles}
                                                options={mobileRoleList}
                                                onChange={(data) => setState({ ...state, mobileRoles: data })}
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <div className="pull-right">
                                    <Button color="primary" className="mr-2" onClick={handleSave}>
                                        Submit
                                    </Button>&nbsp;&nbsp;
                                    <Button color="primary" outline className="mr-2" onClick={() => handleUserModal(false)}>
                                        Close
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

export default UserRoleModal;