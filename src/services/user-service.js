import { onApiCall, onSrfApiCall } from "../data/commonApiCall"

export const authenticateHTTP = (payload) => {
    return onSrfApiCall({
        method: 'POST',
        url: '/loginauth/UserAuthentication',
        data: payload
    })
}

export const getAllUsersHTTP = () => {
    return onApiCall({
        method: 'GET',
        url: '/UserList/All'
    })
}

export const approveUserHTTP = (payload) => {
    return onApiCall({
        method: 'POST',
        url: '/UserList/ApproveRejectUser',
        data: payload
    })
}

export const addNewUserHTTP = (userName) => {
    return onApiCall({
        method: 'GET',
        url: `/login/CreateUser/${userName}`
    })
}

export const getAllRolesHTTP = () => {
    return onApiCall({
        method: 'GET',
        url: '/RoleMaster/GetAll'
    })
}

export const getMappedRolesByUserIdHTTP = (userId) => {
    return onApiCall({
        method: 'GET',
        url: `/UserList/mapuserMultipleRole/${userId}`
    })
}

export const updateRolesHTTP = (payload) => {
    return onApiCall({
        method: 'POST',
        url: '/UserList/AssignMultipleRole',
        data: payload
    })
}

export const userDetailsUpdateHTTP = (payload) => {
    return onApiCall({
        method: 'POST',
        url: '/UserList/UserActiveInactive',
        data: payload
    })
}

export const validateUserCredentialHTTP = (payload) => {
    return onApiCall({
        method: 'POST',
        url: '/QRF/ValidLoginUserCredential',
        data: payload
    })
}

