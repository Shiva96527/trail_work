import { Input } from "reactstrap";
import useFileUpload from "../../shared/hooks/file-upload-hook";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

const FileUploadRenderer = (props) => {
    const { upload, viewFile, deleteFile } = useFileUpload();
    const [showUpload, setShowUpload] = useState(true);
    const { colDef, data, api } = props;

    const uploadSetValue = (property, data) => {
        const selectedRow = api.getSelectedRows()[0];
        if (selectedRow) {
            selectedRow['GatekeeperFileUpload'] = data?.FileName;
            selectedRow['AID'] = data?.AID;
            api.applyTransaction({ update: [selectedRow] });
            setShowUpload(false);
        }
    }

    const deleteAction = () => {
        const selectedRow = api.getSelectedRows()[0];
        if (selectedRow) {
            selectedRow['GatekeeperFileUpload'] = '';
            api.applyTransaction({ update: [selectedRow] });
            setShowUpload(true);
        }
    }

    return (
        <>
            {(!data?.GatekeeperFileUpload && colDef?.allowUpload && showUpload) ? (
                <Input
                    disabled={colDef?.disabled}
                    type="file"
                    name="HLDGroupAssignment"
                    onChange={(e) => upload(e, 'HLDGroupAssignment', 'GroupAssignmentData', colDef?.IntegrationID, uploadSetValue, data?.HGAID, 'HLDGroupAssignment')}
                />
            ) : (
                <>
                    {data?.GatekeeperFileUpload && (
                        <span className="link-style" onClick={() => viewFile({ Url: data?.GatekeeperFileUploadPath, OriginalName: data?.GatekeeperFileUpload })}>
                            {data?.GatekeeperFileUpload}
                        </span>
                    )}
                    {data?.GatekeeperFileUpload && colDef?.allowUpload && !colDef?.disabled && (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                            <FontAwesomeIcon icon={faTrash} color="red" onClick={() => deleteFile('HLDGroupAssignment', data?.AID, deleteAction)} fontSize={'12px'} cursor={'pointer'} />
                        </div>
                    )}
                </>
            )}
        </>
    );

}

export default FileUploadRenderer;