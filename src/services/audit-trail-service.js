import { onApiCall } from "../data/commonApiCall"

export const getAllAuditsHTTP = (payload) => {
    return onApiCall({
        method: 'POST',
        url: `/AuditTrial/LogsByDate`,
        data: payload
    })
}