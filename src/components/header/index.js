import React, { useEffect, useState } from 'react';
import {
    NavbarToggler,
    NavbarBrand,
    Nav,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Navbar,
    NavItem,
    NavLink,
    UncontrolledCollapse
} from 'reactstrap';
import logo from '../../assets/img/logo.png';
import { BsBorderWidth } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import { FiLogOut } from 'react-icons/fi';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';

const letterStyle = {
    display: "inline-block",
    fontSize: "1em",
    width: "2.5em",
    height: "2.5em",
    lineHeight: "2.5em",
    textAlign: "center",
    borderRadius: "50%",
    background: "rgb(246, 82, 129)",
    verticalAlign: "middle",
    color: "white",
    marginBottom: '5.5px',
    marginRight: '5px'
};

const NeptuneHeader = () => {
    const navigate = useNavigate();
    const { userInfo, menuItems } = useSelector(state => state.globalSlice);
    const [displayName, setDisplayName] = useState('');
    const [generalMenus, setGeneralMenus] = useState(false);
    const [edquotationMenus, setEdquotationMenus] = useState(false);
    const [reportMenus, setReportMenus] = useState(false);
    const [showAdministrator, setShowAdministrator] = useState(false);
    const [isAdminVisible, setIsAdminVisible] = useState(false);
    const [isGeneralVisible, setIsGeneralVisible] = useState(false);
    const [isEdQuotationVisible, setIsEdQuotationVisible] = useState(false);
    const [isreportMenusVisible, setIsReportMenusVisible] = useState(false);
    const [activeTab, setActiveTab] = useState('');

    useEffect(() => {
        
        setDisplayName(getInitials(userInfo?.user?.DisplayName));
        if (menuItems?.find(f => f?.MenuName === 'Administrator')) {
            setIsAdminVisible(true);
        }
        if (menuItems?.find(f => f.MenuName === 'General')) {
            setIsGeneralVisible(true);
        }
        if (menuItems?.find(f => f?.MenuName === 'EdQuotation')) {
            setIsEdQuotationVisible(true);  // Show ED Quotation menu if present
        }
        if (menuItems?.find(f => f.MenuName === 'Reports')) {
            setIsReportMenusVisible(true);
        }
    }, [userInfo, menuItems]);

    const getInitials = (name) => {
        if (name) {
            const names = name?.split(' ');
            return names[0]?.charAt(0) + names[1]?.charAt(0);
        }
        return '';
    };

    const handleLogout = () => {
        Swal.fire({
            title: 'Are you sure to logout?',
            showDenyButton: true,
            confirmButtonText: 'Yes',
            denyButtonText: 'No',
        }).then((result) => {
            if (result.isConfirmed) {
                setTimeout(() => {
                    sessionStorage.clear();
                    localStorage.clear();
                    navigate('/');
                }, 10);
            } else if (result.isDenied) {
                Swal.fire('Cancelled logout', '', 'info');
            }
        });
    };

    const handleNavClick = (url, tab) => {
        navigate(url);
        setActiveTab(tab);
    };

    const truncateDisplayName = (displayName) => {
        const maxLength = 2; // Adjust the maximum length as needed
        if (displayName.length > maxLength) {
            return displayName.substring(0, maxLength); // Truncate and append ellipsis
        }
        return displayName;
    };

    return (
        <div id="after-login-header">
            <Navbar className="login-header-color" expand="lg">
                <NavbarBrand style={{ cursor: 'pointer' }} onClick={() => navigate('/neptune')}>
                    <img src={logo} height={'45px'} alt='app-logo' />
                </NavbarBrand>
                <NavbarToggler id='toggler'>
                    <BsBorderWidth size={25} color="#fff" />
                </NavbarToggler>
                <UncontrolledCollapse toggler='#toggler' navbar className='left-menu'>
                    <Nav className="ml-auto" navbar>
                        <NavItem>
                            <NavLink
                                href="#"
                                className={activeTab === 'Inbox' ? 'nav-active' : ''}
                                onClick={() => handleNavClick('/neptune/srf/srfinbox', 'Inbox')}
                            >
                                Inbox
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                href="#"
                                className={activeTab === 'My Group' ? 'nav-active' : ''}
                                onClick={() => handleNavClick('/neptune/srf/mygroup', 'My Group')}
                            >
                                My Group
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                href="#"
                                className={activeTab === 'Outbox' ? 'nav-active' : ''}
                                onClick={() => handleNavClick('/neptune/srf/srfoutbox', 'Outbox')}
                            >
                                Outbox
                            </NavLink>
                        </NavItem>
                        {isAdminVisible && (
                            <UncontrolledDropdown
                                nav
                                inNavbar
                                isOpen={showAdministrator}
                                onMouseEnter={() => setShowAdministrator(true)}
                                onMouseLeave={() => setShowAdministrator(false)}
                            >
                                <DropdownToggle nav caret className="cmsmenus">
                                    Administrator
                                </DropdownToggle>
                                <DropdownMenu>
                                    <DropdownItem onClick={() => navigate('/admin/srfusers')}>
                                        Users
                                    </DropdownItem>
                                    <DropdownItem onClick={() => navigate('/admin/dropdownconfig')}>
                                        Dropdown Configuration
                                    </DropdownItem>
                                    <DropdownItem onClick={() => navigate('/admin/srfcatalogue')}>
                                        SRF Workflow Catalogue
                                    </DropdownItem>
                                    <DropdownItem onClick={() => navigate('/admin/groupmapping')}>
                                        SRF Group Mapping
                                    </DropdownItem>
                                    <DropdownItem onClick={() => navigate('/admin/buildingdetails')}>
                                        Building Details
                                    </DropdownItem>
                                    <DropdownItem onClick={() => navigate('/admin/costdetails')}>
                                        {'Cost Catalogue(Capex,Opex)'}
                                    </DropdownItem>
                                    <DropdownItem onClick={() => navigate('/admin/vascostconfig')}>
                                        VAS Cost Catalogue
                                    </DropdownItem>
                                </DropdownMenu>
                            </UncontrolledDropdown>
                        )}
                        {isreportMenusVisible &&(
                        <UncontrolledDropdown
                            nav
                            inNavbar
                            isOpen={reportMenus}
                            onMouseEnter={() => setReportMenus(true)}
                            onMouseLeave={() => setReportMenus(false)}
                        >
                            <DropdownToggle nav caret className="cmsmenus">
                                Reports
                            </DropdownToggle>
                            <DropdownMenu>
                                <DropdownItem onClick={() => navigate('/neptune/reports/srfreport')}>
                                    SRF Report
                                </DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown>
                       )}
                       {isGeneralVisible && (
                            <UncontrolledDropdown
                                nav
                                inNavbar
                                isOpen={generalMenus}
                                onMouseEnter={() => setGeneralMenus(true)}
                                onMouseLeave={() => setGeneralMenus(false)}
                            >
                                <DropdownToggle nav caret className="cmsmenus">
                                    General
                                </DropdownToggle>
                                <DropdownMenu>
                                    <DropdownItem onClick={() => navigate('/neptune/general/usergroupmapping')}>
                                        Users & Group Mapping
                                    </DropdownItem>
                                </DropdownMenu>
                            </UncontrolledDropdown>
                        )}
                               {isEdQuotationVisible && (
                            <UncontrolledDropdown
                                nav
                                inNavbar
                                isOpen={edquotationMenus}
                                onMouseEnter={() => setEdquotationMenus(true)} // Same hover behavior as other menus
                                onMouseLeave={() => setEdquotationMenus(false)} // Same hover behavior as other menus
                            >
                                <DropdownToggle nav caret className="cmsmenus">
                                    ED Quotation
                                </DropdownToggle>
                                <DropdownMenu>
                                    <DropdownItem onClick={() => navigate('/neptune/edquotation/inbox')}>
                                        ED Inbox
                                    </DropdownItem>
                                    <DropdownItem onClick={() => navigate('/neptune/edquotation/mygroup')}>
                                        My Group
                                    </DropdownItem>
                                    <DropdownItem onClick={() => navigate('/neptune/vendor/management')}>
                                        Vendor Management
                                    </DropdownItem>
                                </DropdownMenu>
                            </UncontrolledDropdown>
                        )}
                    </Nav>
                    <span onClick={() => handleLogout()} style={{ cursor: 'pointer', color: '#fff', fontSize: '14px' }}>
                        <p style={letterStyle} title={displayName}>{truncateDisplayName(displayName)}</p>
                        {userInfo?.user?.DisplayName}&nbsp;&nbsp;&nbsp; <FiLogOut />
                    </span>
                </UncontrolledCollapse>
                
            </Navbar>
        </div>
    );
};

export default NeptuneHeader;
