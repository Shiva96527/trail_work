import { Card, CardBody, CardTitle, Col, Row } from "reactstrap";
import NeptuneAgGrid from "../../../components/ag-grid";
import { useMemo, useState } from "react";
import { useEffect } from "react";
import { assignSRFHTTP, assignToInboxFromGroupHTTP, getSrfGridDataHTTP } from "../../../services/srf-service";
import { toast } from "react-toastify";
import { group_columns } from "./config/columns";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import AssignGroupModal from "./modals/assign-modal";

const SrfGroup = () => {
    const { userInfo } = useSelector(state => state?.globalSlice);
    const navigate = useNavigate();
    const [groupList, setGroupList] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [assignModal, setAssignModal] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [fromModule, setFromModule] = useState('');

    useEffect(() => {
        getGroupData();
        // eslint-disable-next-line
    }, [])

    const getGroupData = async () => {
        const payload = {
            LoginUIID: sessionStorage.getItem('uiid'),
            Action: 'MyGroup'
        }
        try {
            const { data: { data: resultData, statusCode, statusMessage } } = await getSrfGridDataHTTP(payload);
            if (statusCode === 200) {
                setGroupList(resultData);
                //toast.success(statusMessage);
            } else {
                toast.error(statusMessage);
            }
        } catch (e) {
            toast.error('Something went wrong');
        }
    }

    const handleViewDetails = (data) => {
        let path = '';
        if (data?.SRFWorkFlowStatus === 'HLD' || data?.SRFWorkFlowStatus === 'HLD Cost Pending') {
            path = '/neptune/srf/groupboxhld';
        } else {
            path = '/neptune/srf/mygroup/view';
        }
        navigate(path, {
            state: {
                IntegrationID: data?.IntegrationID, SRFNumber: data?.SRFNumber, GroupName: data?.GroupName,
                WorkflowId: data?.WorkflowId
            }
        })
    }

    const handleAssignSrf = async (data) => {
        const payload = {
            Action: 'Inbox',
            AssignUser: userInfo?.user?.DisplayName,
            LoginUIID: sessionStorage.getItem('uiid'),
            SRFNumber: data?.SRFNumber,
            WorkflowId: data?.WorkflowId
        };
        try {
            const { data: { statusCode, statusMessage } } = await assignToInboxFromGroupHTTP(payload);
            if (statusCode === 200) {
                getGroupData();
                toast.success(statusMessage);
            }
        } catch (e) {
            toast.error('Something went wrong');
        }
    }

    const handleAssignment = (data, actionButton) => {
        console.log(data);
        console.log(actionButton);
        if (actionButton === 'me') {
            // Swal.fire({
            //     title: 'Are you sure to assign this SRF to you',
            //     showDenyButton: true,
            //     showCancelButton: false,
            //     confirmButtonText: 'Yes',
            //     denyButtonText: 'No',
            // }).then((result) => {
            //     if (result.isConfirmed) {
            //         handleAssignSrf(data);
            //     }
            // })
            handleAssignSrf(data);
            setFromModule('srfgroup-me');
        } else {
            setSelectedGroup(data);
            setAssignModal(true);
            if (actionButton === 'others') {
                setModalTitle('Assign to others');
                setFromModule('srfgroup-others');
            } else {
                setModalTitle('Reassign Gatekeeper');
                setFromModule('srfgroup-reassign');
            }
        }
    }

    const handleOnClose = (status) => {
        setAssignModal(status);
        setSelectedGroup(null);
    }

    const handleAssignmentAction = async (data, selecteddata) => {
        const payload = {
            LoginUIID: sessionStorage.getItem('uiid'),
            SRFNumber: selecteddata?.SRFNumber,
            WorkflowId: selecteddata?.WorkflowId
        };

        payload['AssignUser'] = data?.assignName;
        if (data?.fromModule === 'srfgroup-others') {
            payload['Action'] = 'AssignToOthers';
        } else if (data?.fromModule === 'srfreassign' || data?.fromModule === 'srfgroup-reassign') {
            payload['Action'] = 'Reassign Gatekeeper';
        } else if (data?.fromModule === 'srfgroup-me') {
            payload['AssignUser'] = userInfo?.user?.DisplayName;
            payload['Action'] = 'Inbox';
        }
        try {
            const { data: { statusCode, statusMessage } } = await assignSRFHTTP(payload);

            if (statusCode === 200) {
                toast.success(statusMessage);
                getGroupData();
                handleOnClose(false);
            }
        } catch (e) {
            toast.error('Something went wrong');
        }
    }

    const memoizedGrid = useMemo(() => (
        <NeptuneAgGrid
            data={groupList}
            dataprops={group_columns(handleViewDetails, handleAssignment)}
            paginated={true}
            itemsPerPage={10}
            searchable={true}
            exportable={true}
        />
        // eslint-disable-next-line
    ), [groupList]); // Only re-render if groupList changes

    return (
        <>
            <Card className="card_outer_padding">
                <CardTitle>My Group</CardTitle>
                <CardBody>
                    <div className="app-inner-layout__wrapper">
                        <Row>
                            <Col md="12">
                                {memoizedGrid}
                            </Col>
                        </Row>
                    </div>
                </CardBody>
            </Card>
            {assignModal && <AssignGroupModal isOpen={assignModal} fromModule={fromModule} selectedData={selectedGroup} onClose={handleOnClose} title={modalTitle} handleAssign={handleAssignmentAction} />}
        </>
    )
}
export default SrfGroup;