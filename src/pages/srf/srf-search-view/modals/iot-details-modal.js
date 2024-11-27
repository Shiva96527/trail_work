import { useForm } from "react-hook-form";
import { Button, Card, CardBody, Col, Modal, ModalBody, ModalHeader, Row } from "reactstrap";
import FormInput from "../../../../components/form-input";
import FormMultiSelectDropdown from "../../../../components/form-multiselect-dropdown";
import FormDropdown from "../../../../components/form-dropdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FormInputFile from "../../../../components/form-input-file";
import useFileUpload from "../../../../shared/hooks/file-upload-hook";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { useState } from "react";

const IOTDetailsModal = (
    {
        isOpen,
        selectedIOTDetails,
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
        LineItemId: selectedIOTDetails?.LineItemId || '',
        IOT: selectedIOTDetails?.IOT?.split(',') || [],
        DeviceDetails: selectedIOTDetails?.DeviceDetails || '',
        ServiceAddress: selectedIOTDetails?.ServiceAddress || '',
        ContractPeriod: selectedIOTDetails?.ContractPeriod || '',
        ContractType: selectedIOTDetails?.ContractType ? selectedIOTDetails?.ContractType?.split(',') : [],
        IotFileUpload: attachments['IotFileUpload'] || null,
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

    const disableFormCondition = (disableForm || !isManualCreatorRole || !isActionBtnEnableFlag || !isEnableAddUpdateBtnFlag) || isChannel === 'CPQ';

    watch('IotFileUpload');

    const handleCustomSubmit = (isUpdate) => {
        handleSubmit((data) => {
            Swal.fire({
                title: `Are you sure to ${selectedIOTDetails ? 'update' : 'submit'}?`,
                showDenyButton: true,
                showCancelButton: false,
                confirmButtonText: 'Yes',
                denyButtonText: 'No',
            }).then(async (result) => {
                if (result.isConfirmed) {
                    if (getValues('fileDeleted')) {
                        await deleteFile('IotFileUpload', attachments['IotFileUpload']?.AID, () => null);
                        setValue('fileDeleted', false);
                    }
                    if (getValues('IotFileUpload') && !getValues('fileDeleted') && hasNewFile) {
                        await upload({ target: { files: [getValues('IotFileUpload')] } }, 'IotFileUpload', 'IotFileUpload', IntegrationID, setValue, WorkflowId, 'SRFIOT');
                        setValue('fileDeleted', false);
                    }
                    const tempPayload = { ...data };
                    tempPayload.IOT = tempPayload?.IOT?.join(',');
                    tempPayload.ContractType = tempPayload?.ContractType?.join(',');
                    serviceTypeDataInfoHandler('IOT', tempPayload, selectedIOTDetails, onClose, isUpdate ? true : false)
                }
            })
        })();
    }

    const handleDeleteFile = () => {
        if (disableFormCondition) return;
        setValue('IotFileUpload', '');
        setValue('fileDeleted', true);
    }

    return (
        <>
            <Modal size="xl" isOpen={isOpen} backdrop={true}>
                <ModalHeader toggle={onClose}>IOT Details</ModalHeader>
                <ModalBody>
                    <Card className="card_outer_padding">
                        <CardBody>
                            <form onSubmit={handleSubmit()}>
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
                                        {(!attachments['IotFileUpload'] || getValues('fileDeleted')) ? <FormInputFile
                                            label="Data File Upload"
                                            name="IotFileUpload"
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
                                            <><span className="link-style" onClick={() => viewFile(getValues('IotFileUpload'))}>{getValues('IotFileUpload')?.FileName}</span>
                                                {disableFormCondition && <FontAwesomeIcon icon={faTrash} color="red" onClick={handleDeleteFile} fontSize={'12px'} cursor={'pointer'} />}</>}
                                    </Col>
                                </Row>
                                <fieldset disabled={disableFormCondition}>
                                    <Row>
                                        <Col md={4}>
                                            <FormMultiSelectDropdown
                                                label="IOT"
                                                name="IOT"
                                                control={control}
                                                errors={errors}
                                                data={srfDropdownOptions?.SRFDROPDOWNVALUES?.['SRF IOT Type']?.dropdownValue}
                                            />
                                        </Col>
                                        <Col md={4}>
                                            <FormInput
                                                label="Device Details"
                                                name="DeviceDetails"
                                                control={control}
                                                errors={errors}
                                            />
                                        </Col>
                                        <Col md={4}>
                                            <FormInput
                                                label="Service Address"
                                                name="ServiceAddress"
                                                control={control}
                                                errors={errors}
                                            />
                                        </Col>
                                        <Col md={4}>
                                            <FormDropdown
                                                label="Contract Period (In Years)"
                                                name="ContractPeriod"
                                                type="number"
                                                control={control}
                                                errors={errors}
                                                rules={{ required: 'Contract Period is required' }}
                                                data={srfDropdownOptions?.SRFDROPDOWNVALUES?.['SRF IOT Contract Period']?.dropdownValue}
                                            />
                                        </Col>
                                        <Col md={4}>
                                            <FormMultiSelectDropdown
                                                label="Contract Type"
                                                name="ContractType"
                                                control={control}
                                                errors={errors}
                                                data={srfDropdownOptions?.SRFDROPDOWNVALUES?.['SRF IOT Contract Type']?.dropdownValue}
                                            />
                                        </Col>
                                    </Row>
                                </fieldset>
                            </form>
                            <div className="pull-right">
                                {((isChannel === "Neptune" && isManualCreatorRole && isActionBtnEnableFlag && isEnableAddUpdateBtnFlag) && !disableForm) && <Button color="primary" onClick={() => handleCustomSubmit(selectedIOTDetails?.LineItemId ? true : false)}>{selectedIOTDetails?.LineItemId ? 'Update' : 'Submit'}</Button>}&nbsp;
                                <Button color="primary" outline onClick={onClose}>Back</Button>
                            </div>
                        </CardBody>
                    </Card>
                </ModalBody>
            </Modal>
        </>
    )
}
export default IOTDetailsModal;