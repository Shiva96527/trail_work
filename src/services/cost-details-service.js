import { onSrfApiCall } from "../data/commonApiCall"

export const getCostDetailsHTTP = (payload) => {
    return onSrfApiCall({
        method: 'POST',
        url: `/upgradesrf/GetCPQConfiCostCalculation`,
        data: payload
    })
}

export const updateCostDetailsHTTP = (payload) => {
    return onSrfApiCall({
        method: 'POST',
        url: `/upgradesrf/UpdateCPQConfigCost`,
        data: payload
    })
}

export const getVASCostDetailsHTTP = (payload) => {
    return onSrfApiCall({
        method: 'POST',
        url: `/upgradesrf/GetCPQVasCostCalculation`,
        data: payload
    })
}