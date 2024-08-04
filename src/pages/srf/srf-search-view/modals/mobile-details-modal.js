import { useForm } from "react-hook-form";
import { Button, Card, CardBody, Col, Modal, ModalBody, ModalHeader, Row } from "reactstrap";
import FormInput from "../../../../components/form-input";
import { useSelector } from "react-redux";
import FormDropdown from "../../../../components/form-dropdown";
import useFileUpload from "../../../../shared/hooks/file-upload-hook";
import FormInputFile from "../../../../components/form-input-file";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import { useState } from "react";

const MobileDetailsModal = (
    {
        isOpen,
        selectedMobileDetails,
        onClose,
        attachments,
        serviceTypeDataInfoHandler,
        IntegrationID,
        WorkflowId,
        isManualCreatorRole,
        disableForm,
        isChannel,
        isActionBtnEnableFlag,
        isEnableAddUpdateBtnFlag
    }) => {
    const { srfDropdownOptions } = useSelector(state => state?.globalSlice);
    const { upload, viewFile, deleteFile } = useFileUpload();
    const [hasNewFile, setHasNewFile] = useState(false);

    const defaultValues = {
        LineItemId: selectedMobileDetails?.LineItemId || '',
        Mobile: selectedMobileDetails?.Mobile || '',
        MobileFileUpload: attachments?.['MobileFileUpload'] ? attachments?.['MobileFileUpload'] : null,
        fileDeleted: false
    }

    const {
        control,
        handleSubmit,
        setValue,
        getValues,
        watch,
        formState: { errors }
    } = useForm({
        defaultValues
    });

    watch('MobileFileUpload');

    const handleCustomSubmit = (isUpdate) => {
        handleSubmit((data) => {
            Swal.fire({
                title: `Are you sure to ${selectedMobileDetails ? 'update' : 'submit'}?`,
                showDenyButton: true,
                showCancelButton: false,
                confirmButtonText: 'Yes',
                denyButtonText: 'No',
            }).then(async (result) => {
                if (result.isConfirmed) {
                    const formData = { ...data };
                    delete formData.MobileFileUpload;
                    delete formData.fileDeleted;
                    if (getValues('fileDeleted')) {
                        await deleteFile('MobileFileUpload', attachments['MobileFileUpload']?.AID, () => null);
                        setValue('fileDeleted', false);
                    }
                    if (getValues('MobileFileUpload') && !getValues('fileDeleted') && hasNewFile) {
                        await upload({ target: { files: [getValues('MobileFileUpload')] } }, 'MobileFileUpload', 'MobileFileUpload', IntegrationID, setValue, WorkflowId, 'SRFMobile');
                        setValue('fileDeleted', false);
                    }
                    serviceTypeDataInfoHandler('Mobile', formData, selectedMobileDetails, onClose, isUpdate ? true : false)
                }
            })
        })();
    }

    const handleDeleteFile = () => {
        if ((disableForm || !isManualCreatorRole || !isActionBtnEnableFlag || !isEnableAddUpdateBtnFlag) || isChannel === 'CPQ') return;
        setValue('MobileFileUpload', '');
        setValue('fileDeleted', true);
    }

    return (
        <>
            <Modal isOpen={isOpen} backdrop={true} size="xl">
                <ModalHeader toggle={onClose}>Mobile Details</ModalHeader>
                <ModalBody>
                    <Card className="card_outer_padding">
                        <CardBody>
                            <form>
                                <fieldset disabled={(disableForm || !isManualCreatorRole || !isActionBtnEnableFlag || !isEnableAddUpdateBtnFlag) || isChannel === 'CPQ'}>
                                    <Row>
                                        <Col md={4}>
                                            <FormInput
                                                label="Line Item ID"
                                                name="LineItemId"
                                                control={control}
                                                errors={errors}
                                                disabled
                                            />
                                        </Col>
                                        <Col md={4}>
                                            {(!attachments?.['MobileFileUpload'] || getValues('fileDeleted')) ? <FormInputFile
                                                label="Data File Upload"
                                                name="MobileFileUpload"
                                                type="file"
                                                control={control}
                                                errors={errors}
                                                onChange={(e) => {
                                                    if (e.target.files[0]) {
                                                        setHasNewFile(true);
                                                    } else {
                                                        setHasNewFile(false);
                                                    }
                                                }}
                                            />
                                                :
                                                <><span className="link-style" onClick={() => viewFile(getValues('MobileFileUpload'))}>{getValues('MobileFileUpload')?.FileName}</span>
                                                    <FontAwesomeIcon icon={faTrash} color="red" onClick={handleDeleteFile} fontSize={'12px'} cursor={'pointer'} /></>}
                                        </Col>
                                    </Row>
                                    <hr />
                                    <Row>
                                        <Col md={6}>
                                            <FormDropdown
                                                label="Mobile"
                                                name="Mobile"
                                                control={control}
                                                errors={errors}
                                                data={srfDropdownOptions?.SRFDROPDOWNVALUES?.['SRF Mobile Service']?.dropdownValue}
                                            />
                                        </Col>
                                    </Row>
                                </fieldset>
                            </form>
                            <div className="pull-right">
                                {((isChannel === "Neptune" && isManualCreatorRole && isActionBtnEnableFlag && isEnableAddUpdateBtnFlag) && !disableForm) && <Button color="primary" onClick={() => handleCustomSubmit(selectedMobileDetails?.LineItemId ? true : false)}>{selectedMobileDetails?.LineItemId ? 'Update' : 'Submit'}</Button>}&nbsp;
                                <Button color="primary" outline onClick={onClose}>Back</Button>
                            </div>
                        </CardBody>
                    </Card>
                </ModalBody>
            </Modal>
        </>
    )
}
export default MobileDetailsModal;