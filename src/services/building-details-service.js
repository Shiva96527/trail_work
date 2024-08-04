import { onSrfApiCall } from "../data/commonApiCall"

export const getAllBuildingDetailsHTTP = (payload) => {
    return onSrfApiCall({
        method: 'POST',
        url: `/upgradesrf/GetOnnetBuildingCost`,
        data: payload
    })
}

export const updateBuildingCostHTTP = (payload) => {
    return onSrfApiCall({
        method: 'POST',
        url: `/upgradesrf/UpdateCPQConfigCost`,
        data: payload
    })
}