import { useState } from "react";
import { srfDeleteAttachmentHTTP, srfUploadAttachmentHTTP } from "../../services/srf-service";
import { toast } from "react-toastify";

const useFileUpload = () => {
    const [fileStatus, setFileStatus] = useState(false);

    const upload = async (e, property, columnName, IntegrationID, setValue, WorkflowId, moduleName) => {
        const formData = new FormData();
        formData.append('File', e.target.files[0]);
        formData.append('RID', IntegrationID);
        formData.append('AID', 0);
        formData.append('ModuleID', WorkflowId ? WorkflowId : 0);
        formData.append('ModuleName', moduleName);
        formData.append('ColumnName', columnName);
        formData.append('LoginUIID', sessionStorage.getItem('uiid'));
        formData.append('SessionID', generateSessionId());
        try {
            const { data: { data: resultData, statusCode, statusMessage } } = await srfUploadAttachmentHTTP(formData);
            if (statusCode === 200) {
                toast.success(statusMessage);
                setValue(property, resultData);
                setFileStatus(true);
            } else {
                toast.error(statusMessage);
            }
        } catch (e) {
            toast.error('Something went wrong');
        }
    }

    const viewFile = async (file) => {
        if (file) {
            const url = await file.Url;
            const link = document.createElement("a");
            link.href = url;
            link.target = "_blank";
            link.type = "application/octet-stream";
            link.download = file.OriginalName;
            link.click();
            // destroy link
            link.remove();
        }
    };

    const deleteFile = async (property, AID, setValue) => {
        const payload = {
            AID: AID,
            LoginUIID: sessionStorage.getItem('uiid'),
            ModuleID: 0
        }
        try {
            const { data: { statusCode, statusMessage } } = await srfDeleteAttachmentHTTP(payload);
            if (statusCode === 200) {
                toast.success(statusMessage);
                setValue(property, null);
                setFileStatus(true);
                return true;
            } else {
                toast.error(statusMessage);
            }
        } catch (e) {
            toast.error('Something went wrong');
        }
    };

    const generateSessionId = () => {
        return (Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15));
    }

    return { upload, viewFile, deleteFile, fileStatus }
}

export default useFileUpload;