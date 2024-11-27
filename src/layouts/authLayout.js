import { Outlet } from "react-router-dom";
import NeptuneHeader from "../components/header";
const AuthLayout = () => {
    return <div className="auth-layout-container">
        <NeptuneHeader />
        <Outlet />
    </div>
}
export default AuthLayout;