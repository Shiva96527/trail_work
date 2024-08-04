import { useEffect, useState } from "react";
import { getAllRolesHTTP, getMappedRolesByUserIdHTTP } from "../../../../services/user-service";
import { toast } from "react-toastify";

const useGetRoleInfo = ({ selectedUser }) => {
    const [webRoleList, setWebRoleList] = useState([]);
    const [mobileRoleList, setMobileRoleList] = useState([]);
    const [selectedWebRoles, setSelectedWebRoles] = useState(null);
    const [selectedMobileRole, setSelectedMobileRole] = useState(null);

    useEffect(() => {
        if (mobileRoleList?.length > 0) {
            const result = mobileRoleList?.find(f => f.value === selectedUser?.Mobile_Role_Id);
            setSelectedMobileRole(result);
        }
        //eslint-disable-next-line
    }, [mobileRoleList])

    const getAllRoles = async () => {
        const defaultMobileRole = { label: 'No Mobile Roles', value: 0 };
        try {
            const { data, status } = await getAllRolesHTTP();
            if (status === 200) {
                await getAssignedRoles();
                const mobileRoles = data.filter(m => m.Role_Type === true)?.map(obj => { return { label: obj?.Role_Name, value: obj?.Role_ID } }) || [];
                mobileRoles.unshift(defaultMobileRole);
                setWebRoleList(data.filter(w => w.Role_Type === false && w.Role_ID !== 0)?.map(obj => { return { label: obj?.Role_Name, value: obj?.Role_ID } }) || []);
                setMobileRoleList([...mobileRoles]);
            }
        } catch (e) {
            toast.error('something went wrong');
        }
    }
    const getAssignedRoles = async () => {
        try {
            const { data, status, Message } = await getMappedRolesByUserIdHTTP(selectedUser?.User_ID);
            if (status === 200) {
                toast.success(Message);
                const result = data?.map(m => { return { label: m?.Role_Name, value: m?.Role_ID } });
                setSelectedWebRoles(result);
            } else {
                toast.error(Message);
            }
        } catch (e) {
            toast.error('Something went wrong');
        }
    }

    return [getAllRoles, webRoleList, mobileRoleList, selectedWebRoles, selectedMobileRole];
}

export default useGetRoleInfo;