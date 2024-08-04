import { Outlet } from "react-router-dom";
import NeptuneHeader from "../components/header";
const AdminLayout = () => {
    return <>
        <NeptuneHeader />
        <Outlet />
    </>
}
export default AdminLayout;