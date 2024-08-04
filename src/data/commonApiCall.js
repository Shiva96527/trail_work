import { activateInterceptors, httpClient } from "./httpClient";
export const onApiCall = ({ method, url, data, body }) => {
    // const constructHeaders = () => {
    //     return {
    //         common: {
    //             "Content-Type": "application/json",
    //             "Authorization": "Bearer " + sessionStorage.getItem('token')
    //         },
    //     };
    // };
    // const headerValues = constructHeaders();
    // if (url.includes('uploadfile') || url.includes('EvaluatorUploadExcel') || url.includes('QuestionAttachmentSaveFile')) {
    //     headerValues.common['Content-Type'] = 'multipart/form-data';
    // }
    // const commonAxioxInstance = httpClient(process.env.REACT_APP_BASE_URL);
    // activateInterceptors(commonAxioxInstance);
    // return commonAxioxInstance.request({
    //     url,
    //     method,
    //     data,
    //     body,
    //     headers: headerValues
    // });
};

export const onSrfApiCall = ({ method, url, data, body }) => {
    const constructHeaders = () => {
        return {
            common: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + sessionStorage.getItem('token')
            },
        };
    };
    const headerValues = constructHeaders();
    if (url.includes('uploadfile') || url.includes('EvaluatorUploadExcel') || url.includes('QuestionAttachmentSaveFile')) {
        headerValues.common['Content-Type'] = 'multipart/form-data';
    }
    const srfAxiosInstance = httpClient(process.env.REACT_APP_SRF_URL);
    activateInterceptors(srfAxiosInstance);
    return srfAxiosInstance.request({
        url,
        method,
        data,
        body,
        headers: headerValues
    });
};


