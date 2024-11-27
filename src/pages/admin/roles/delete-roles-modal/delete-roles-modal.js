import { Button, Card, CardBody, Col, Modal, ModalBody, ModalHeader, Row } from "reactstrap";
import NeptuneAgGrid from "../../../../components/ag-grid";
import { useEffect, useState } from "react";
import { role_columns } from "./config/config";
import { toast } from "react-toastify";
import { getAllRolesHTTP } from "../../../../services/user-service";
import Swal from "sweetalert2";
import { deleteRoleHTTP } from "../../../../services/role-service";

const DeleteRolesModal = ({ isOpen, onClose }) => {
    const [roleList, setRoleList] = useState([]);

    useEffect(() => {
        getAllRoles();
    }, [])

    const getAllRoles = async () => {
        try {
            const { status, data } = await getAllRolesHTTP();
            if (status === 200) {
                setRoleList(data.filter(f => f.Role_ID !== 0));
            }
        } catch (e) {
            toast.error('Something went wrong');
        }
    }

    const deleteRole = (row) => {
        Swal.fire({
            title: 'Are you sure to delete?',
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: 'Yes',
            denyButtonText: 'No',
        }).then((result) => {
            if (result.isConfirmed) {
                deleteRoleById(row?.Role_ID);
            }
        })
    }

    const deleteRoleById = async (roleId) => {
        try {
            const { status } = await deleteRoleHTTP({ RoleId: roleId });
            if (status === 200) {
                toast.success('Role deleted successfully');
                getAllRoles();
            }
        } catch (e) {
            toast.error('Something went wrong');
        }
    }

    return (
        <>
            <Modal size="lg" isOpen={isOpen} backdrop={true}>
                <ModalHeader>Manage Roles</ModalHeader>
                <ModalBody>
                    <Card className="card_outer_padding">
                        <CardBody>
                            <div>
                                <Row>
                                    <span>Total Roles: {roleList.length}</span>
                                    <Col md="12">
                                        <NeptuneAgGrid
                                            data={roleList}
                                            dataprops={role_columns(deleteRole)}
                                            paginated={true}
                                            itemsPerPage={5}
                                            searchable={true}
                                            exportable={true}
                                        />
                                    </Col>
                                </Row><br />
                                <div className="pull-right">
                                    <Button color="danger" outline onClick={onClose}>Close</Button>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </ModalBody>
            </Modal>
        </>
    )
}
export default DeleteRolesModal;