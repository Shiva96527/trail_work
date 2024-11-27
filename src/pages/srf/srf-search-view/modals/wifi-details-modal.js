import { useForm } from "react-hook-form";
import { Button, Card, CardBody, Col, Modal, ModalBody, ModalHeader, Row } from "reactstrap";
import FormDropdown from "../../../../components/form-dropdown";
import FormInput from "../../../../components/form-input";
import FormInputFile from "../../../../components/form-input-file";
import useFileUpload from "../../../../shared/hooks/file-upload-hook";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { useState } from "react";

const WifiDetailsModal = (
    {
        isOpen,
        selectedWifiDetails,
        IntegrationID,
        attachments,
        onClose,
        WorkflowId,
        serviceTypeDataInfoHandler,
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
        LineItemId: selectedWifiDetails?.LineItemId || '',
        WifiNoofAP: selectedWifiDetails?.WifiNoofAP || '',
        WifiTypeofAP: selectedWifiDetails?.WifiTypeofAP || '',
        WifiRemarks: selectedWifiDetails?.WifiRemarks || '',
        WifiServiceAddress: selectedWifiDetails?.WifiServiceAddress || '',
        WifiFileUpload: selectedWifiDetails?.LineItemId ? attachments?.['WifiFileUpload'] : null,
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

    watch('WifiFileUpload');
    const disableFormCondition = (disableForm || !isManualCreatorRole || !isActionBtnEnableFlag || !isEnableAddUpdateBtnFlag) || isChannel === 'CPQ';

    const handleCustomSubmit = (isUpdate) => {
        handleSubmit((data) => {
            Swal.fire({
                title: `Are you sure to ${selectedWifiDetails ? 'update' : 'submit'}?`,
                showDenyButton: true,
                showCancelButton: false,
                confirmButtonText: 'Yes',
                denyButtonText: 'No',
            }).then(async (result) => {
                if (result.isConfirmed) {
                    if (getValues('fileDeleted')) {
                        await deleteFile('WifiFileUpload', attachments['WifiFileUpload']?.AID, () => null);
                        setValue('fileDeleted', false);
                    }
                    if (getValues('WifiFileUpload') && !getValues('fileDeleted') && hasNewFile) {
                        await upload({ target: { files: [getValues('WifiFileUpload')] } }, 'WifiFileUpload', 'WifiFileUpload', IntegrationID, setValue, WorkflowId, 'SRFWifi');
                        setValue('fileDeleted', false);
                    }
                    serviceTypeDataInfoHandler('Wifi', data, selectedWifiDetails, onClose, isUpdate ? true : false);
                }
            })
        })();
    }

    const handleDeleteFile = () => {
        if (disableFormCondition) return;
        setValue('WifiFileUpload', '');
        setValue('fileDeleted', true);
    }

    return (
        <>
            <Modal size="xl" isOpen={isOpen} backdrop={true}>
                <ModalHeader toggle={onClose}>Wifi Details</ModalHeader>
                <ModalBody>
                    <Card className="card_outer_padding">
                        <CardBody>
                            <form>
                                <Row>
                                    <Col md={4}>
                                        <FormInput
                                            label='Line Item ID'
                                            name='LineItemId'
                                            type="text"
                                            control={control}
                                            errors={errors}
                                            disabled
                                        />
                                    </Col>
                                    <Col md={4}>
                                        {(!attachments['WifiFileUpload'] || getValues('fileDeleted')) ? <FormInputFile
                                            label="Data File Upload"
                                            name="WifiFileUpload"
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
                                            <><span className="link-style" onClick={() => viewFile(getValues('WifiFileUpload'))}>{getValues('WifiFileUpload')?.FileName}</span>
                                                {disableFormCondition && <FontAwesomeIcon icon={faTrash} color="red" onClick={handleDeleteFile} fontSize={'12px'} cursor={'pointer'} />}</>}
                                    </Col>
                                </Row>
                                <hr />
                                <fieldset disabled={disableFormCondition}>
                                    <Row>
                                        <Col md={3}>
                                            <FormInput
                                                label='No Of AP'
                                                name='WifiNoofAP'
                                                type="text"
                                                control={control}
                                                errors={errors}
                                            />
                                        </Col>
                                        <Col md={3}>
                                            <FormDropdown
                                                label='Type Of AP'
                                                name='WifiTypeofAP'
                                                control={control}
                                                errors={errors}
                                                data={srfDropdownOptions?.SRFDROPDOWNVALUES?.['SRF Wifi Type']?.dropdownValue}
                                            />
                                        </Col>
                                        <Col md={3}>
                                            <FormInput
                                                label='Service Address'
                                                name='WifiServiceAddress'
                                                type="text"
                                                control={control}
                                                errors={errors}
                                            />
                                        </Col>
                                        <Col md={3}>
                                            <FormInput
                                                label='Remarks'
                                                name='WifiRemarks'
                                                type="textarea"
                                                rows={3}
                                                control={control}
                                                errors={errors}
                                            />
                                        </Col>
                                    </Row>
                                </fieldset>
                                <div className="pull-right">
                                    {((isChannel === "Neptune" && isManualCreatorRole && isActionBtnEnableFlag && isEnableAddUpdateBtnFlag) && !disableForm) && <Button color="primary" onClick={() => handleCustomSubmit(selectedWifiDetails?.LineItemId ? true : false)}>{selectedWifiDetails?.LineItemId ? 'Update' : 'Submit'}</Button>}&nbsp;
                                    <Button color="primary" outline onClick={onClose}>Back</Button>
                                </div>
                            </form>
                        </CardBody>
                    </Card>
                </ModalBody>
            </Modal>
        </>
    )
}
export default WifiDetailsModal;