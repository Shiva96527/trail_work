import { onApiCall } from "../data/commonApiCall"

export const createRoleHTTP = (payload) => {
    return onApiCall({
        method: 'GET',
        url: '/RoleMaster/CreateRole'
    })
}

export const getWebRolesByMenuHTTP = (roleId) => {
    return onApiCall({
        method: 'GET',
        url: `/RoleMaster/GetMenu/${roleId}`
    })
}

export const getRoleMenuHTTP = (roleId) => {
    return onApiCall({
        method: 'GET',
        url: `/RoleMaster/GetByRoleId/${roleId}`
    })
}

export const mapRoleHTTP = (payload) => {
    return onApiCall({
        method: 'POST',
        url: `/RoleMaster/MapRoleMenu`,
        data: payload
    })
}

export const deleteRoleHTTP = (payload) => {
    return onApiCall({
        method: 'POST',
        url: `/RoleMaster/DeleteByRoleId`,
        data: payload
    })
}