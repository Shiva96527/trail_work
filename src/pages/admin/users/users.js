import { Button, Card, CardBody, CardTitle, Col, Input, InputGroup, InputGroupText, PopoverBody, PopoverHeader, Row, UncontrolledPopover } from "reactstrap";
import { userColumnData } from "./config/columns";
import { useState } from "react";
import { BiSave } from "react-icons/bi";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { addNewUserHTTP, approveUserHTTP, getAllUsersHTTP } from "../../../services/user-service";
import NeptuneAgGrid from "../../../components/ag-grid";
import UserRoleModal from "./user-modal/user-role-modal";
import UserDetailsModal from "./user-modal/user-details-modal";

const Users = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [newUser, setNewUser] = useState('');
    const [isUserOpen, setIsUserOpen] = useState(false);
    const [isUserDetailsOpen, setIsUserDetailsOpen] = useState(false);

    useEffect(() => {
        getAllUsers();
    }, [])

    const addNewUser = async () => {
        try {
            const { data, status } = await addNewUserHTTP(newUser);
            if (status === 200) {
                toast.success(data?.Message);
                getAllUsers();
                document.getElementById('modal-close').click();
                setNewUser('');
            } else {
                toast.error(data?.Message);
            }
        } catch (e) {
            toast.error("System error.");
        }
    }

    const getAllUsers = async () => {
        try {
            const { data, status } = await getAllUsersHTTP()
            if (status === 200 && data) {
                setUsers(data);
            }
        } catch (e) {
            toast.error("System error.");
        }
    }

    const handleApproveUser = async (item, approveStatus) => {
        try {
            if (item.Role_Name === '' || item.Role_Name == null) {
                toast.info('Before approve, please assign a Role for the user..!');
                return;
            }
            const userUpdateStatus = await approveUserHTTP(item.User_ID, approveStatus);
            console.log(userUpdateStatus);
            getAllUsers();
        } catch (error) {
            toast.error('Server Error');
        }
    };

    const handleUserModal = (status) => {
        setIsUserOpen(status)
    }

    const handleUserDetailsModal = (status) => {
        setIsUserDetailsOpen(status)
    }

    const handleMapRoles = (user, showUserModal) => {
        setSelectedUser(user);
        setIsUserOpen(showUserModal);
    }

    const onRowClicked = (data) => {
        setIsUserDetailsOpen(true);
        setSelectedUser(data?.data);
    }

    return (
        <Card className="card_outer_padding">
            <CardTitle>List of Users</CardTitle>
            <CardBody>
                <div className="app-inner-layout__wrapper">
                    <Row>
                        <Col md="12">
                            <NeptuneAgGrid
                                data={users}
                                dataprops={userColumnData(handleApproveUser, handleMapRoles)}
                                paginated={true}
                                itemsPerPage={10}
                                searchable={true}
                                onRowDoubleClicked={onRowClicked}
                                topActionButtons={
                                    <Button color="primary" id="addNewUser"
                                        className="mb-0">
                                        Add User
                                    </Button>
                                }
                            />
                        </Col>
                    </Row>
                    <UncontrolledPopover
                        placement="right"
                        target="addNewUser"
                        trigger="legacy"
                    >
                        <PopoverHeader>
                            New User
                        </PopoverHeader>
                        <PopoverBody>
                            <Row>
                                <Col md={12}>
                                    <InputGroup className="mt-2">
                                        <Input type="text" placeholder="Maxis ID"
                                            value={newUser} onChange={(e) => setNewUser(e.target.value)} />
                                        <InputGroupText>
                                            <BiSave style={{ cursor: 'pointer' }} onClick={addNewUser} />
                                        </InputGroupText>
                                    </InputGroup>
                                </Col>
                            </Row>
                        </PopoverBody>
                    </UncontrolledPopover>

                </div>
            </CardBody>
            <div id="modal-close"></div>
            {isUserOpen && <UserRoleModal
                isOpen={isUserOpen}
                handleUserModal={handleUserModal}
                selectedUser={selectedUser}
                getAllUsers={getAllUsers}
            />}
            {isUserDetailsOpen && <UserDetailsModal
                isOpen={isUserDetailsOpen}
                handleUserDetailsModal={handleUserDetailsModal}
                selectedUser={selectedUser}
                getAllUsers={getAllUsers}
            />}
        </Card>
    )
}

export default Users;