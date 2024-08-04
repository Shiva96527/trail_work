import { onSrfApiCall } from "../data/commonApiCall"

export const getSrfGridDataHTTP = (payload) => {
    return onSrfApiCall({
        method: 'POST',
        url: '/upgradesrf/SrfGrid',
        data: payload
    })
}

export const getSrfSearchHTTP = (payload) => {
    return onSrfApiCall({
        method: 'POST',
        url: '/upgradesrf/srfsearchpanelgrid',
        data: payload
    })
}

export const generateSrfHTTP = (payload) => {
    return onSrfApiCall({
        method: 'POST',
        url: '/upgradesrf/SRFCreation',
        data: payload
    })
}

export const getSrfMailLogsHTTP = (payload) => {
    return onSrfApiCall({
        method: 'POST',
        url: '/mail/maillogs',
        data: payload
    })
}

export const getSrfHLDsHTTP = (payload) => {
    return onSrfApiCall({
        method: 'POST',
        url: '/upgradesrf/SrfHldGrid',
        data: payload
    })
}

export const getFinancialDetailsHTTP = (payload) => {
    return onSrfApiCall({
        method: 'POST',
        url: '/upgradesrf/SRFCapexOpexVasBySiteId',
        data: payload
    })
}

export const updateCostHTTP = (payload) => {
    return onSrfApiCall({
        method: 'POST',
        url: '/upgradesrf/SRFCapexOpexVasCostUpdate',
        data: payload
    })
}


export const getSrfByIdHTTP = (payload) => {
    return onSrfApiCall({
        method: 'POST',
        url: '/upgradesrf/SRFById',
        data: payload
    })
}

export const srfDeleteAttachmentHTTP = (payload) => {
    return onSrfApiCall({
        method: 'POST',
        url: '/general/deleteattachment',
        data: payload
    })
}

export const srfUploadAttachmentHTTP = (payload) => {
    return onSrfApiCall({
        method: 'POST',
        url: '/general/uploadfile',
        data: payload
    })
}

export const srfSaveWorkflowHTTP = (payload) => {
    return onSrfApiCall({
        method: 'POST',
        url: '/upgradesrf/SRFWorkFlowUpdate',
        data: payload
    })
}

export const getAllGroupMappingHTTP = (payload) => {
    return onSrfApiCall({
        method: 'POST',
        url: '/UpgradeSRF/SRFGroupCatalogueGirdData',
        data: payload
    })
}

export const updateGroupMappingHTTP = (payload) => {
    return onSrfApiCall({
        method: 'POST',
        url: '/UpgradeSRF/SRFGroupCatalogueIUD',
        data: payload
    })
}

export const assignToInboxFromGroupHTTP = (payload) => {
    return onSrfApiCall({
        method: 'POST',
        url: '/upgradesrf/SrfAssign',
        data: payload
    })
}

export const updateSrfWorkflowHTTP = (payload) => {
    return onSrfApiCall({
        method: 'POST',
        url: '/upgradesrf/SRFWorkFlowUpdate',
        data: payload
    })
}

export const getSrfUsersHTTP = (payload) => {
    return onSrfApiCall({
        method: 'POST',
        url: '/loginauth/usergrid',
        data: payload
    })
}


export const updateSrfUsersHTTP = (payload) => {
    return onSrfApiCall({
        method: 'POST',
        url: '/loginauth/userupdate',
        data: payload
    })
}

export const downloadSRFReportHTTP = (payload) => {
    return onSrfApiCall({
        method: 'POST',
        url: '/reports/downloadreport',
        data: payload
    })
}

export const assignSRFHTTP = (payload) => {
    return onSrfApiCall({
        method: 'POST',
        url: '/upgradesrf/SrfAssign',
        data: payload
    })
}

export const getUsersMappingListHTTP = (payload) => {
    return onSrfApiCall({
        method: 'POST',
        url: '/upgradesrf/SRFUserGroupMapping',
        data: payload
    })
}

export const syncSrfCPQHTTP = (payload) => {
    return onSrfApiCall({
        method: 'POST',
        url: '/upgradesrf/SrfSyncCPQDetails',
        data: payload
    })
}

export const syncGCPHTTP = (payload) => {
    return onSrfApiCall({
        method: 'POST',
        url: '/upgradesrf/SRFMobileGCPSiteGirdData',
        data: payload
    })
}

export const uploadMobileGCPHTTP = (payload) => {
    return onSrfApiCall({
        method: 'POST',
        url: '/upgradesrf/SRFMobileGCPSiteUpload',
        data: payload
    })
}