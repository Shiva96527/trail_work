import { Navigate } from "react-router-dom";
import UnauthLayout from "../layouts/unauthLayout";
import AuthLayout from "../layouts/authLayout";
import Login from "../pages/login";
import Users from "../pages/admin/users/users";
import AdminLayout from "../layouts/adminLayout";
import BuildingDetails from "../pages/admin/building-details";
import CostDetails from "../pages/admin/cost-details";
import VASCostConfig from "../pages/admin/vascost-config";
import Roles from "../pages/admin/roles";
import ConstantConfiguration from "../pages/admin/constant-configuration";
import AuditTrail from "../pages/admin/audit-trail";
import SRFCatalogueWorkflow from "../pages/admin/srf_catalogue";
import SrfInbox from "../pages/srf/srf-inbox";
import SrfGroup from "../pages/srf/srf-group";
import SrfSearch from "../pages/srf/srf-search";
import SrfOutbox from "../pages/srf/srf-outbox";
import SrfSearchView from "../pages/srf/srf-search-view";
import SRFHLD from "../pages/srf/srf-hld";
import SRFGroupMapping from "../pages/srf/srf-group-mapping";
import SRFUsers from "../pages/admin/srf-users";
import SRFReport from "../pages/reports/srf-report";
import DropdownConfig from "../pages/admin/dropdown-configuration";
import UserGroupMapping from "../pages/general/user-group-mapping";
import EdQuotationInbox from '../pages/edquotation/inbox';
import TaskHistory from '../pages/edquotation/task-history';
import MyGroup from '../pages/edquotation/my-group';
import CreateSrfEdInbox from "../pages/srf/create-srf-ed-inbox"; 
import UpdateSrfEdInbox from "../pages/srf/update-srf";
import QuoteSubmitPage from "../pages/srf/quote-submit";
import QuoteReviewPage from "../pages/srf/quote-review";

export const approutes = (isAuth) => {
    const routes = [
        {
            path: '/', element: <UnauthLayout />, children: [
                { path: '', element: <Navigate to="/login" /> },
                { path: '/login', element: <Login /> }
            ]
        },
        {
            path: '/admin', element: isAuth ? <AdminLayout /> : <Navigate to={'/login'} />, children: [
                { path: '/admin/users', element: <Users /> },
                { path: '/admin/srfusers', element: <SRFUsers /> },
                { path: '/admin/buildingdetails', element: <BuildingDetails /> },
                { path: '/admin/costdetails', element: <CostDetails /> },
                { path: '/admin/vascostconfig', element: <VASCostConfig /> },
                { path: '/admin/roles', element: <Roles /> },
                { path: '/admin/constants', element: <ConstantConfiguration /> },
                { path: '/admin/audits', element: <AuditTrail /> },
                { path: '/admin/groupmapping', element: <SRFGroupMapping /> },
                { path: '/admin/srfcatalogue', element: <SRFCatalogueWorkflow /> },
                { path: '/admin/dropdownconfig', element: <DropdownConfig /> },
             
            ]
        },
        {
            path: '/neptune', element: isAuth ? <AuthLayout /> : <Navigate to={'/login'} />, children: [
                { path: '', element: <SrfInbox /> },
                { path: '/neptune/srf/srfinbox', element: <SrfInbox /> },
                { path: '/neptune/srf/srfinbox/view', element: <SrfSearchView /> },
                { path: '/neptune/srf/search/view', element: <SrfSearchView /> },
                { path: '/neptune/srf/inboxhld', element: <SRFHLD /> },
                { path: '/neptune/srf/groupboxhld', element: <SRFHLD /> },
                { path: '/neptune/srf/outboxhld', element: <SRFHLD /> },
                { path: '/neptune/srf/srfoutbox', element: <SrfOutbox /> },
                { path: '/neptune/srf/srfoutbox/view', element: <SrfSearchView /> },
                { path: '/neptune/srf/mygroup', element: <SrfGroup /> },
                { path: '/neptune/srf/search', element: <SrfSearch /> },
                { path: '/neptune/srf/createsrf', element: <SrfSearchView /> },
                { path: '/neptune/srf/mygroup/view', element: <SrfSearchView /> },
                { path: '/neptune/reports/srfreport', element: <SRFReport /> },
                { path: '/neptune/general/usergroupmapping', element: <UserGroupMapping /> },
                { path: '/neptune/edquotation/inbox', element: <EdQuotationInbox /> },
                { path: '/neptune/edquotation/taskhistory', element: <TaskHistory /> },
                { path: '/neptune/edquotation/mygroup', element: <MyGroup /> },
                { path: '/neptune/srf/create-srf-ed-inbox', element: <CreateSrfEdInbox /> },
                { path: '/neptune/srf/update-srf-ed-inbox/:srfNumber', element: <UpdateSrfEdInbox /> },
                { path: '/neptune/srf/quotesubmit', element: <QuoteSubmitPage /> },
                { path: '/neptune/srf/quotereview', element: <QuoteReviewPage /> },
            ]
        }   
    ];
    return routes;
}

