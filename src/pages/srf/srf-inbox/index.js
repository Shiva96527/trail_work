import { Button, Card, CardBody, CardTitle, Col, Row } from "reactstrap";
import NeptuneAgGrid from "../../../components/ag-grid";
import { useState } from "react";
import { useEffect } from "react";
import { assignSRFHTTP, getSrfGridDataHTTP } from "../../../services/srf-service";
import { toast } from "react-toastify";
import { inbox_columns } from "./config/columns";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";
import AssignGroupModal from "../srf-group/modals/assign-modal";
import { useSelector } from "react-redux";

const SrfInbox = () => {
    const { userInfo } = useSelector(state => state?.globalSlice);
    const navigate = useNavigate();
    const [isManualCreatorRole, setIsManualCreatorRole] = useState(false);
    const [inboxList, setInboxList] = useState([]);
    const [assignModal, showAssignModal] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [assignTitle, setAssignTitle] = useState('');
    const [fromModule, setFromModule] = useState('');

    useEffect(() => {
        getInboxData();
        if (userInfo?.user?.ReorgUserRole?.includes('Manual SRF Creator')) {
            setIsManualCreatorRole(true);
        }
        /*eslint-disable-next-line*/
    }, [])

    const getInboxData = async () => {
        const payload = {
            LoginUIID: sessionStorage.getItem('uiid'),
            Action: 'Inbox'
        }
        try {
            const { data: { data: resultData, statusCode, statusMessage } } = await getSrfGridDataHTTP(payload);
            if (statusCode === 200) {
                setInboxList(resultData);
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
            path = '/neptune/srf/inboxhld';
        } else {
            path = '/neptune/srf/srfinbox/view';
        }
        navigate(path, {
            state: {
                IntegrationID: data?.IntegrationID, SRFNumber: data?.SRFNumber, GroupName: data?.GroupName,
                WorkflowId: data?.WorkflowId
            }
        })
    }

    const handleAssignment = (data, type) => {
        if (type === 'others') {
            setAssignTitle('Assign to others');
            setFromModule('inbox-reassign');
            setSelectedRow(data);
            showAssignModal(true);
        }
        else if  (type === 'move'){
            setAssignTitle('Move to Group Queue');
            setFromModule('inbox-movetogroup');
            handleAssignSrf(data)
        }
         else {
            setAssignTitle('Move to Group Queue');
            setFromModule('inbox-movetogroup');
            setSelectedRow(data);
            showAssignModal(true);
        }
       
    }

    const handleOnClose = (status) => {
        setAssignTitle('');
        showAssignModal(false);
        setSelectedRow(null);
        setFromModule('');
    }

    const handleAssignSrf = async (data) => {
        const payload = {
            Action: 'MyGroup',
            AssignUser: data?.GroupName,
            LoginUIID: sessionStorage.getItem('uiid'),
            SRFNumber: data?.SRFNumber,
            WorkflowId: data?.WorkflowId
        };
        try {
            const { data: { statusCode, statusMessage } } =
             await assignSRFHTTP(payload);
            if (statusCode === 200) {
                getInboxData();
                toast.success(statusMessage);
            }
        } catch (e) {
            toast.error('Something went wrong');
        }
    }

    const handleAssignmentAction = async (data, selecteddata) => {
        const payload = { LoginUIID: sessionStorage.getItem('uiid'),
         SRFNumber: selecteddata?.SRFNumber,
         WorkflowId: selecteddata?.WorkflowId
        };
        if (data?.fromModule === 'inbox-reassign') {
            payload['Action'] = 'AssignInbox';
        } else if (data?.fromModule === 'movetogroup'
        ||data?.fromModule ==='inbox-movetogroup') {
            payload['Action'] = 'MyGroup';
        }
        payload['AssignUser'] = data?.assignName;
        payload['GroupName'] = selecteddata?.GroupName;
        try {
            const { data: { statusCode, statusMessage } } = await assignSRFHTTP(payload);
            if (statusCode === 200) {
                toast.success(statusMessage);
                getInboxData();
                handleOnClose(false);
            } else {
                toast.error(statusMessage);
            }
        } catch (e) {
            toast.error('Something went wrong');
        }
    }

    return (
        <>
            <Card className="card_outer_padding">
                <CardTitle>Inbox</CardTitle>
                <CardBody>
                    <div className="app-inner-layout__wrapper">
                        <Row>
                            <Col md="12">
                                <NeptuneAgGrid
                                    topActionButtons={<>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <div style={{ display: 'inline-block' }}>
                                                {isManualCreatorRole && <Button color="primary" size="sm"><FontAwesomeIcon icon={faPlus} onClick={() => navigate('/neptune/srf/createsrf')} /></Button>}&nbsp;&nbsp;
                                                <Button color="primary" size="sm"><FontAwesomeIcon icon={faSearch} onClick={() => navigate('/neptune/srf/search')} /></Button>
                                                {/* <UncontrolledDropdown className="me-2" direction="down">
                                                    <DropdownToggle caret color="primary">
                                                        SRF
                                                    </DropdownToggle>
                                                    <DropdownMenu>
                                                        <DropdownItem onClick={() => navigate('/neptune/srf/createsrf')}>Create SRF</DropdownItem>
                                                        <DropdownItem onClick={() => navigate('/neptune/srf/search')}>Search SRF</DropdownItem>
                                                    </DropdownMenu>
                                                </UncontrolledDropdown> */}
                                            </div>
                                            {/* <div style={{ display: 'inline-block' }}>
                                                <DropdownList
                                                    placeholder="Username"
                                                    style={{ width: '200px' }}
                                                    data={dropdownOptions?.['Assign SRF']}
                                                />
                                            </div>
                                            <Button color="primary" style={{ marginLeft: '8px' }}>Reassign SRF</Button>
                                            <Button color="primary" style={{ marginLeft: '8px' }}>Move To Group Queue</Button> */}
                                        </div>
                                    </>}
                                    data={inboxList}
                                    dataprops={inbox_columns(handleViewDetails, handleAssignment)}
                                    paginated={true}
                                    itemsPerPage={10}
                                    searchable={true}
                                    exportable={true}
                                />
                            </Col>
                        </Row>
                    </div>
                </CardBody>
            </Card>
            {assignModal && <AssignGroupModal isOpen={assignModal} fromModule={fromModule} selectedData={selectedRow} onClose={handleOnClose} title={assignTitle} handleAssign={handleAssignmentAction} />}
        </>
    )
}
export default SrfInbox;