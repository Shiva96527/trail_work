import { Card, CardBody, CardTitle, Col, Input, Label, Row } from "reactstrap";
import { useState } from "react";
import { useEffect } from "react";
import { toast } from "react-toastify";
import NeptuneAgGrid from "../../../components/ag-grid";
import { srfUsersColumns } from "./config/columns";
import { getSrfUsersHTTP } from "../../../services/srf-service";
import SRFUserDetailModal from "./modal/srf-user-detail-modal";
const SRFUsers = () => {
    const [userMaster, setUserMaster] = useState([]);
    const [users, setUsers] = useState([]);
    const [showUserDetails, setShowUserDetails] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [statuses, setStatuses] = useState({ Active: false, 'Pending Activation': false, Inactive: false });

    useEffect(() => {
        getAllUsers();
        //eslint-disable-next-line
    }, [])

    useEffect(() => {
        const result = userMaster.filter(f => (statuses?.Active && f.UserStatus === 'Active') || (statuses?.['Pending Activation'] && f.UserStatus === 'Pending Activation') || (statuses?.Inactive && f.UserStatus === 'Inactive'))
        setUsers(result);
        //eslint-disable-next-line
    }, [statuses])

    const getAllUsers = async () => {
        try {
            const { data: { data: resultData, statusCode } } = await getSrfUsersHTTP({
                LoginUIID: sessionStorage.getItem('uiid')
            })
            if (statusCode === 200 && resultData) {
                setUserMaster(resultData);
                setUsers(JSON.parse(JSON.stringify(resultData)).filter(f => f.UserStatus === 'Active'));
                setStatuses({ ...statuses, Active: true });
            }
        } catch (e) {
            toast.error("System error.");
        }
    }

    const filterUsers = (e) => {
        const { value, checked } = e.target;
        setStatuses({ ...statuses, [value]: checked })
    }

    const handleOnClickRow = (user) => {
        
        setShowUserDetails(true);
        setSelectedUser(user);
    }

    const handleOnCloseModal = (status) => {
        setShowUserDetails(status);
        setSelectedUser(null);
    }

    return (
        <Card className="card_outer_padding">
            <CardTitle>Users</CardTitle>
            <CardBody>
                <div className="app-inner-layout__wrapper">
                    <Row>
                        <Col md="12">
                            <NeptuneAgGrid
                                topActionButtons={<>
                                    <Input type="checkbox" value={"Active"} checked={statuses?.Active} onChange={filterUsers} />&nbsp;<Label><b>Active</b></Label>&nbsp;&nbsp;
                                    {/* <Input type="checkbox" value={"Pending Activation"} checked={statuses?.['Pending Activation']} onChange={filterUsers} />&nbsp;<Label><b>Pending Activation</b></Label>&nbsp;&nbsp;
                                    <Input type="checkbox" value={"Inactive"} checked={statuses?.Inactive} onChange={filterUsers} />&nbsp;<Label><b>Inactive</b></Label> */}
                                </>}
                                data={users}
                                dataprops={srfUsersColumns(handleOnClickRow)}
                                paginated={true}
                                itemsPerPage={10}
                                searchable={true}
                                exportable={true}
                            />
                        </Col>
                    </Row>

                    {/* <UncontrolledPopover
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
                    </UncontrolledPopover> */}
                </div>
            </CardBody>
            <div id="modal-close"></div>
            {showUserDetails && <SRFUserDetailModal isOpen={showUserDetails} selectedUser={selectedUser} onClose={handleOnCloseModal} getAllUsers={getAllUsers} />}
        </Card>
    )
}

export default SRFUsers;