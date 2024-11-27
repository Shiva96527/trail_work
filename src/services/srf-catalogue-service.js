import { onSrfApiCall } from "../data/commonApiCall"

export const getSrfWorkflowCatalogueHTTP = (payload) => {
    return onSrfApiCall({
        method: 'POST',
        url: '/UpgradeSRF/SRFWorkFlowCatalogueGirdData',
        data: payload
    })
}

export const updateSrfFormHTTP = (payload) => {
    return onSrfApiCall({
        method: 'POST',
        url: '/UpgradeSRF/SRFWorkFlowCatalogueIUD',
        data: payload
    })
}