import { onApiCall } from "../data/commonApiCall"

export const getConstantsHTTP = () => {
    return onApiCall({
        method: 'GET',
        url: `/Constants/all`
    })
}

export const updateConstantsHTTP = (payload) => {
    return onApiCall({
        method: 'POST',
        url: `/Constants/UpdateConstant/`,
        data: payload
    })
}
