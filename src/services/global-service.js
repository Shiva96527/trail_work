import { onApiCall, onSrfApiCall } from "../data/commonApiCall"

export const getCostApplicationDropdownHTTP = (payload) => {
    return onApiCall({
        method: 'GET',
        url: '/BindingQuote/GetBindingQuoteDropDowns/CostApplicationType'
    })
}

export const getDropdownByTypeHTTP = (payload) => {
    return onSrfApiCall({
        method: 'POST',
        url: '/dropdown/ddbytype',
        data: payload
    })
}

export const getDropdownsForConfigHTTP = (payload) => {
    return onSrfApiCall({
        method: 'POST',
        url: '/dropdown/ddgrid',
        data: payload
    })
}

export const updateDropdownHTTP = (payload) => {
    return onSrfApiCall({
        method: 'POST',
        url: '/dropdown/ddupdate',
        data: payload
    })
}

export const deleteDropdownHTTP = (payload) => {
    return onSrfApiCall({
        method: 'POST',
        url: '/dropdown/ddupdate',
        data: payload
    })
}

export const getMenuItemsHTTP = (payload) => {
    return onSrfApiCall({
        method: 'POST',
        url: '/menu/menugrid',
        data: payload
    })
}

