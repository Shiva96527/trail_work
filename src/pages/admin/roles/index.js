import classNames from "classnames";
import { useEffect, useState } from "react";
import { Button, Card, CardBody, CardTitle, Col, FormGroup, Input, Label, Nav, NavItem, NavLink, Row, TabContent, TabPane } from "reactstrap";
import Select from 'react-select';
import { createRoleHTTP, getRoleMenuHTTP, getWebRolesByMenuHTTP, mapRoleHTTP } from "../../../services/role-service";
import { toast } from "react-toastify";
import { getAllRolesHTTP } from "../../../services/user-service";
import DeleteRolesModal from "./delete-roles-modal/delete-roles-modal";
const roleTypes = [
    { label: 'Web', value: false },
    { label: 'Mobile', value: true }
]
const Roles = () => {
    const [activeTab, setActiveTab] = useState('1');
    const [roleState, setRoleState] = useState({ Role_Type: '', Role_Name: '', Role_Description: '', Status: false });
    const [webRoleList, setWebRoleList] = useState([]);
    const [mobileRoleList, setMobileRoleList] = useState([]);
    const [webMenus, setWebMenus] = useState([]);
    const [webMenuList, setSelectedWebMenuList] = useState([]);
    const [mobileMenus, setMobileMenus] = useState([]);
    const [mobileMenuList, setMobileMenuList] = useState([]);
    const [mobileChildMenus, setMobileChildMenus] = useState([]);
    const [selectedWebRole, setSelectedWebRole] = useState(null);
    const [selectedMobileRole, setSelectedMobileRole] = useState(null);
    const [showDeleteRolesModal, setShowDeleteRolesModal] = useState(false);

    useEffect(() => {
        getAllRoles();
        getRolesByMenu();
    }, [])

    const toggle = (tab) => {
        setActiveTab(tab);
    }

    const getAllRoles = async () => {
        const defaultMobileRole = { label: 'No Mobile Roles', value: 0 };
        try {
            const { data, status } = await getAllRolesHTTP();
            if (status === 200) {
                const mobileRoles = data.filter(m => m.Role_Type === true)?.map(obj => { return { label: obj?.Role_Name, value: obj?.Role_ID } }) || [];
                mobileRoles.unshift(defaultMobileRole);
                setWebRoleList(data.filter(w => w.Role_Type === false && w.Role_ID !== 0)?.map(obj => { return { label: obj?.Role_Name, value: obj?.Role_ID } }) || []);
                setMobileRoleList([...mobileRoles]);
            }
        } catch (e) {
            toast.error('something went wrong');
        }
    }

    const handleRoleSave = async () => {
        const payload = {
            Role_Type: roleState?.Role_Type.toString(),
            Role_Name: roleState?.Role_Name,
            Role_Description: roleState?.Role_Description,
            Status: roleState?.Status
        }
        try {
            const { status } = await createRoleHTTP(payload);
            if (status === 200) {
                toast.success('Role created successfully');
            }
        } catch (e) {
            toast.error('Something went wrong');
        }
    }

    const getRolesByMenu = async () => {
        try {
            const [web, mobile] = await Promise.all([getWebRolesByMenuHTTP(1), getWebRolesByMenuHTTP(2)]);
            if (web?.data?.length > 0) {
                setWebMenus(web?.data);
            }
            if (mobile?.data?.length > 0) {
                setMobileMenus(JSON.parse(JSON.stringify(mobile.data.filter(f => f.Menu_Parent === null))));
                setMobileChildMenus(JSON.parse(JSON.stringify(mobile.data.filter(f => f.Menu_Parent !== null))));
            }
        } catch (e) {
            toast.error('something went wrong');
        }
    }

    const handleWebSelect = async (roleId) => {
        setSelectedWebRole(roleId)
        try {
            const { status, data } = await getRoleMenuHTTP(roleId?.value);
            if (status === 200) {
                setSelectedWebMenuList(data.map(m => m?.Menu_ID));
            }
        } catch (e) {
            toast.error('Something went wrong');
        }
    }

    const updateWebRoleMenus = (event, parentmenu) => {
        if (event.target.checked) {
            setSelectedWebMenuList([]);
            //clear exising action items
            for (let top of webMenus) {
                for (let child of top.ChildMenus.filter(f => f.Menu_ID === parentmenu)) {
                    for (let curr of webMenuList) {
                        if (child.ActionMenus.map(m => m.Menu_ID).indexOf(curr) !== -1) {
                            webMenuList.splice(webMenuList.indexOf(+curr), 1);
                        }
                    }
                }
            }
            //end:clear exising action items
            if (webMenuList.indexOf(+event.target.value) === -1) {
                webMenuList.push(+event.target.value);
            }
        } else {
            webMenuList.splice(webMenuList.indexOf(+event.target.value), 1);
        }
        if (webMenuList.indexOf(parentmenu) === -1) {
            webMenuList.push(parentmenu);
        }
        setSelectedWebMenuList(JSON.parse(JSON.stringify(webMenuList)));
    }

    const updateMobileRoleMenus = (e, parentmenu, ismulti, isparent) => {
        if (e.target.checked) {
            //clear exising action items
            if (ismulti === false) {
                //eslint-disable-next-line
                for (let top of mobileMenus.filter(f => f.Menu_ID === parentmenu)) {
                    for (let child of mobileChildMenus.filter(f => f.Menu_Parent === parentmenu)) {
                        for (let curr of mobileMenuList) {
                            if (child.Menu_ID === curr) {
                                mobileMenuList.splice(mobileMenuList.indexOf(+curr), 1);
                            }
                        }
                    }
                }
            }
            //end:clear exising action items
            if (mobileMenuList.indexOf(+e.target.value) === -1) {
                mobileMenuList.push(+e.target.value);
            }
            if (mobileMenuList.indexOf(parentmenu) === -1) {
                mobileMenuList.push(parentmenu);
            }
        }
        else {
            if (isparent === false) {
                mobileMenuList.splice(mobileMenuList.indexOf(+e.target.value), 1);
            }
            else {
                //eslint-disable-next-line
                for (let top of mobileMenus.filter(f => f.Menu_ID === parentmenu)) {
                    for (let child of mobileChildMenus.filter(f => f.Menu_Parent === parentmenu)) {
                        for (let curr of mobileMenuList) {
                            if (child.Menu_ID === curr) {
                                mobileMenuList.splice(mobileMenuList.indexOf(+curr), 1);
                            }
                        }
                    }
                }
                mobileMenuList.splice(mobileMenuList.indexOf(+e.target.value), 1);
            }
        }
        setMobileMenuList(JSON.parse(JSON.stringify(mobileMenuList)));
    }

    const submitPermission = async () => {
        const MapRoleMenuList = webMenuList.map(m => { return { Map_Role_Menu_ID: 0, Menu_ID: m, Role_ID: selectedWebRole?.value } })
        try {
            const { status } = await mapRoleHTTP(MapRoleMenuList);
            if (status === 200) {
                toast.success('Web Roles updated successfully');
                setWebMenus([]);
            }
        } catch (e) {
            toast.error('Something went wrong');
        }
    }

    const getMobileMenu = async (roleID) => {
        setMobileMenuList([]);
        setSelectedMobileRole(roleID);
        try {
            const { status, data } = await getRoleMenuHTTP(roleID?.value);
            if (status === 200) {
                setMobileMenuList(data.map(m => m?.Menu_ID));
            }
        } catch (e) {
            toast.error('Something went wrong');
        }
    }

    const submitMobilePermission = async () => {
        const MapRoleMenuList = mobileMenuList.map(m => { return { Map_Role_Menu_ID: 0, Menu_ID: m, Role_ID: selectedMobileRole?.value } })
        try {
            const { status } = await mapRoleHTTP(MapRoleMenuList);
            if (status === 200) {
                toast.success('Mobile Roles updated successfully');
                setMobileMenuList([]);
            }
        } catch (e) {
            toast.error('Something went wrong');
        }
    }

    return (
        <>
            <Nav tabs>
                <NavItem>
                    <NavLink
                        className={classNames({ active: activeTab === '1' })}
                        onClick={() => { toggle('1'); }}
                    >
                        Role
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink
                        className={classNames({ active: activeTab === '2' })}
                        onClick={() => { toggle('2'); }}
                    >
                        Web Permission
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink
                        className={classNames({ active: activeTab === '3' })}
                        onClick={() => { toggle('3'); }}
                    >
                        Mobile Permission
                    </NavLink>
                </NavItem>
            </Nav>
            <TabContent activeTab={activeTab}>
                <TabPane tabId="1">
                    <Card className="card_outer_padding">
                        <CardTitle>Role</CardTitle>
                        <CardBody>
                            <div className="app-inner-layout__wrapper">
                                <div className="pull-right">
                                    <Button color="danger" onClick={() => setShowDeleteRolesModal(true)}>Delete Roles</Button>
                                </div>
                                <Row>
                                    <Col md={4}>
                                        <FormGroup>
                                            <Label>Role Type<span className="required">*</span></Label>
                                            <Select
                                                name="Role_Type"
                                                value={roleState?.Role_Type}
                                                options={roleTypes}
                                                onChange={(v) => setRoleState({ ...roleState, Role_Type: v })}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col md={4}>
                                        <FormGroup>
                                            <Label>Role<span className="required">*</span></Label>
                                            <Input
                                                type="text"
                                                name="Role_Name"
                                                value={roleState?.Role_Name}
                                                onChange={(e) => setRoleState({ ...roleState, Role_Name: e.target.value })}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col md={4}>
                                        <FormGroup>
                                            <Label>Status<span className="required">*</span></Label><br />
                                            <Input
                                                type="checkbox"
                                                name="Role_Name"
                                                checked={roleState?.Status}
                                                onChange={(e) => setRoleState({ ...roleState, Status: !roleState.Status })}
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={4}>
                                        <FormGroup>
                                            <Label for="description">Description<span className="required">*</span></Label>
                                            <Input
                                                rows={3}
                                                type="textarea"
                                                className="form-control"
                                                name="Role_Description"
                                                id="description"
                                                value={roleState?.Role_Description}
                                                onChange={(e) => setRoleState({ ...roleState, Role_Description: e.target.value })}
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <div>
                                    <Button color="primary" className="mr-2" onClick={handleRoleSave}>
                                        Submit
                                    </Button>&nbsp;
                                    <Button color="primary" outline>
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </TabPane>
                <TabPane tabId="2">
                    <Card className="card_outer_padding">
                        <CardTitle>Permission</CardTitle>
                        <CardBody>
                            <div className="app-inner-layout__wrapper">
                                <Row>
                                    <Col md={4}>
                                        <FormGroup>
                                            <Label>Role<span className="required">*</span></Label>
                                            <Select
                                                name="Role"
                                                options={webRoleList}
                                                value={selectedWebRole}
                                                onChange={(v) => handleWebSelect(v)}
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    {webMenus?.length > 0 ? webMenus.map(w => {
                                        return <>
                                            <strong>{w?.Display_Name}</strong>
                                            {w?.ChildMenus?.map(c => {
                                                return <>
                                                    <div><Input type="checkbox" name={c?.Menu_ID} value={c?.Menu_ID} checked={webMenuList.indexOf(c.Menu_ID) !== -1} onChange={(e) => updateWebRoleMenus(e, w?.Menu_ID)} /> {c?.Display_Name}</div>
                                                    <div style={{ paddingLeft: '20px' }}>
                                                        {c.ActionMenus.map(actionItem => {
                                                            return <span><Input type="checkbox" name={c?.Menu_Id} value={actionItem?.Menu_ID} checked={webMenuList.indexOf(actionItem.Menu_ID) !== -1} onChange={(e) => updateWebRoleMenus(e, c?.Menu_ID)} /> {actionItem?.Display_Name}&nbsp;</span>
                                                        })}
                                                    </div>
                                                </>
                                            })}
                                        </>
                                    }) : null}
                                </Row><br />
                                <div>
                                    <Button color="primary" className="mr-2" onClick={submitPermission}>
                                        Submit
                                    </Button>&nbsp;
                                    <Button color="primary" outline>
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </TabPane>
                <TabPane tabId="3">
                    <Card className="card_outer_padding">
                        <CardTitle>Mobile Permission</CardTitle>
                        <CardBody>
                            <div className="app-inner-layout__wrapper">
                                <Row>
                                    <Col md={4}>
                                        <FormGroup>
                                            <Label>Role<span className="required">*</span></Label>
                                            <Select
                                                name="Role"
                                                options={mobileRoleList}
                                                value={selectedMobileRole}
                                                onChange={(data) => getMobileMenu(data)}
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    {mobileMenus?.length > 0 ? mobileMenus.map(topMenu => {
                                        return <>
                                            <div><Input type="checkbox" name={topMenu?.Menu_ID} value={topMenu?.Menu_ID} checked={mobileMenuList.indexOf(topMenu.Menu_ID) !== -1}
                                                onChange={(e) => updateMobileRoleMenus(e, topMenu.Menu_ID, false, true)}
                                            /> {topMenu?.Display_Name}</div>
                                            <div style={{ paddingLeft: '20px' }}>
                                                {topMenu.Display_Name !== 'Map View' ? (
                                                    <>
                                                        {mobileChildMenus.map((actionItem, index) => (
                                                            actionItem.Menu_Parent === topMenu.Menu_ID && (
                                                                <span key={index}>
                                                                    <Input
                                                                        type="checkbox"
                                                                        name={topMenu.Menu_ID}
                                                                        value={actionItem.Menu_ID}
                                                                        checked={mobileMenuList.includes(actionItem.Menu_ID)}
                                                                        onChange={(e) => updateMobileRoleMenus(e, topMenu.Menu_ID, true, false)}
                                                                    />
                                                                    {actionItem.Display_Name}
                                                                </span>
                                                            )
                                                        ))}
                                                    </>
                                                ) : (
                                                    <>
                                                        {mobileChildMenus.map((actionItem, index) => (
                                                            actionItem.Menu_Parent === topMenu.Menu_ID && (
                                                                <span key={index}>
                                                                    <input
                                                                        type="checkbox"
                                                                        className="form-group"
                                                                        name={topMenu.Menu_ID}
                                                                        value={actionItem.Menu_ID}
                                                                        checked={mobileMenuList.includes(actionItem.Menu_ID)}
                                                                        onChange={(e) => updateMobileRoleMenus(e, topMenu.Menu_ID, true, false)}
                                                                    />
                                                                    {actionItem.Display_Name}
                                                                </span>
                                                            )
                                                        ))}
                                                    </>
                                                )}
                                            </div>
                                        </>
                                    }) : null}
                                </Row><br />
                                <div>
                                    <Button color="primary" className="mr-2" onClick={submitMobilePermission}>
                                        Submit
                                    </Button>&nbsp;
                                    <Button color="primary" outline>
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </TabPane>
            </TabContent>
            {showDeleteRolesModal && <DeleteRolesModal isOpen={showDeleteRolesModal} onClose={() => setShowDeleteRolesModal(false)} />}
        </>
    )
}

export default Roles;