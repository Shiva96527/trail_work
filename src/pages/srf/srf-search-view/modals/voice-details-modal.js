import { Button, Card, CardBody, Col, Label, Modal, ModalBody, ModalHeader, Row } from "reactstrap";
import FormMultiSelectDropdown from "../../../../components/form-multiselect-dropdown";
import { useForm } from "react-hook-form";
import FormInput from "../../../../components/form-input";
import FormDropdown from "../../../../components/form-dropdown";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";

const VoiceDetailsModal = (
    {
        isOpen,
        selectedVoiceDetails,
        onClose,
        serviceTypeDataInfoHandler,
        isManualCreatorRole,
        disableForm,
        isChannel,
        isActionBtnEnableFlag,
        isEnableAddUpdateBtnFlag
    }) => {
    const { srfDropdownOptions } = useSelector(state => state?.globalSlice);
    const defaultValues = {
        VoiceType: selectedVoiceDetails?.VoiceType ? selectedVoiceDetails.VoiceType.split(',') : [],
        LineItemId: selectedVoiceDetails?.LineItemId || '',
        ContractPeriod: selectedVoiceDetails?.ContractPeriod || '',
        Redundancy: selectedVoiceDetails?.Redundancy || '',
        InfraRedundancy: selectedVoiceDetails?.InfraRedundancy || '',
        InfraResiliencyrequirement: selectedVoiceDetails?.InfraResiliencyrequirement || '',
        SLASLG: selectedVoiceDetails?.SLASLG || '',
        License: selectedVoiceDetails?.License || '',
        ServiceAddress: selectedVoiceDetails?.ServiceAddress || '',
        PhoneDevice: selectedVoiceDetails?.PhoneDevice || '',
        IPPBXOthers: selectedVoiceDetails?.IPPBXOthers || '',
        VoicePRIChannel: selectedVoiceDetails?.VoicePRIChannel || '',
        VoicePRIFeature: selectedVoiceDetails?.VoicePRIFeature || '',
        VoiceUcaaSChannel: selectedVoiceDetails?.VoiceUcaaSChannel || '',
        VoiceUcaaFeature: selectedVoiceDetails?.VoiceUcaaFeature || '',
        VoiceSingleChannel: selectedVoiceDetails?.VoiceSingleChannel || '',
        VoiceSingleFeature: selectedVoiceDetails?.VoiceSingleFeature || '',
        VoiceBVEChannel: selectedVoiceDetails?.VoiceBVEChannel || '',
        VoiceBVEFeature: selectedVoiceDetails?.VoiceBVEFeature || '',
        VoiceSIPTrunkChannel: selectedVoiceDetails?.VoiceSIPTrunkChannel || '',
        VoiceSIPTrunkFeature: selectedVoiceDetails?.VoiceSIPTrunkFeature || ''
    }
    const {
        control,
        handleSubmit,
        watch,
        getValues,
        formState: { errors }
    } = useForm({
        defaultValues
    });
    const voiceTypeControls = {
        PRI: { channel: 'VoicePRIChannel', feature: 'VoicePRIFeature' },
        UCaas: { channel: 'VoiceUcaaSChannel', feature: 'VoiceUcaaFeature' },
        Single: { channel: 'VoiceSingleChannel', feature: 'VoiceSingleFeature' },
        BVE: { channel: 'VoiceBVEChannel', feature: 'VoiceBVEFeature' },
        'SIP Trunk': { channel: 'VoiceSIPTrunkChannel', feature: 'VoiceSIPTrunkFeature' },
    }
    watch('VoiceType');

    const handleCustomSubmit = (isUpdate) => {
        handleSubmit((data) => {
            Swal.fire({
                title: `Are you sure to ${selectedVoiceDetails ? 'update' : 'submit'}?`,
                showDenyButton: true,
                showCancelButton: false,
                confirmButtonText: 'Yes',
                denyButtonText: 'No',
            }).then((result) => {
                if (result.isConfirmed) {
                    const tempData = { ...data };
                    tempData.VoiceType = tempData?.VoiceType?.join('');
                    serviceTypeDataInfoHandler('Voice', tempData, selectedVoiceDetails, onClose, isUpdate ? true : false);
                }
            })
        })();
    }


    return (
        <>
            <Modal size="xl" isOpen={isOpen} backdrop={true} className="custom-modal">
                <ModalHeader toggle={onClose}>Voice Details</ModalHeader>
                <ModalBody>
                    <Card className="card_outer_padding">
                        <CardBody>
                            <form>
                                <fieldset disabled={(disableForm || !isManualCreatorRole || !isActionBtnEnableFlag || !isEnableAddUpdateBtnFlag) || isChannel === 'CPQ'}>
                                    <Row>
                                        <Col md={4}>
                                            <FormMultiSelectDropdown
                                                label="Voice Type"
                                                name="VoiceType"
                                                control={control}
                                                errors={errors}
                                                rules={{ required: 'Voice Type is required' }}
                                                data={["Single", "BVE", "SIP Trunk", "PRI", "UCaas"]}
                                            />
                                        </Col>
                                    </Row>
                                    {getValues('VoiceType')?.map(v => {
                                        return <Row>
                                            <Label><strong>{v}</strong></Label>
                                            <Col md={4}>
                                                <FormInput
                                                    label={`${v} Channel`}
                                                    name={voiceTypeControls[v]?.channel}
                                                    type="text"
                                                    control={control}
                                                    errors={errors}
                                                />
                                            </Col>
                                            <Col md={4}>
                                                <FormInput
                                                    label={`${v} Feature`}
                                                    name={voiceTypeControls[v]?.feature}
                                                    type="text"
                                                    control={control}
                                                    errors={errors}
                                                />
                                            </Col>
                                        </Row>
                                    })}
                                    <div className="srf-inner-title">
                                        Common
                                    </div>
                                    <Row>
                                        <Col md={3}>
                                            <FormInput
                                                label="Line Item ID"
                                                name="LineItemId"
                                                type="text"
                                                control={control}
                                                errors={errors}
                                                disabled
                                                placeholder="**Auto-Generated**"
                                            />
                                        </Col>
                                        <Col md={3}>
                                            <FormInput
                                                label="Contract Period"
                                                name="ContractPeriod"
                                                type="number"
                                                control={control}
                                                errors={errors}
                                                rules={{ required: 'Contract Period is required' }}
                                            />
                                        </Col>
                                        <Col md={3}>
                                            <FormDropdown
                                                label='Redundancy'
                                                name='Redundancy'
                                                control={control}
                                                errors={errors}
                                                rules={{ required: "Redundancy is required" }}
                                                data={srfDropdownOptions?.SRFDROPDOWNVALUES?.['SRF Data Redundancy']?.dropdownValue}
                                            />
                                        </Col>
                                        <Col md={3}>
                                            <FormDropdown
                                                label='Infra Redundancy'
                                                name='InfraRedundancy'
                                                control={control}
                                                errors={errors}
                                                rules={{ required: 'Infra Redundancy Period is required' }}
                                                data={srfDropdownOptions?.SRFDROPDOWNVALUES?.['SRF Infra Redundancy']?.dropdownValue}
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={3}>
                                            <FormDropdown
                                                label='Infra Resiliency requirement'
                                                name='InfraResiliencyRequirement'
                                                control={control}
                                                errors={errors}
                                                rules={{ required: 'Infra Resiliency requirement Period is required' }}
                                                data={srfDropdownOptions?.SRFDROPDOWNVALUES?.['SRF Infra Resiliency']?.dropdownValue}
                                            />
                                        </Col>
                                        <Col md={3}>
                                            <FormInput
                                                label="SLA/SLG"
                                                name="SLASLG"
                                                type="text"
                                                control={control}
                                                errors={errors}
                                            />
                                        </Col>
                                        <Col md={3}>
                                            <FormInput
                                                label="License"
                                                name="License"
                                                type="text"
                                                control={control}
                                                errors={errors}
                                            />
                                        </Col>
                                        <Col md={3}>
                                            <FormInput
                                                label="Service Address"
                                                name="ServiceAddress"
                                                type="text"
                                                control={control}
                                                errors={errors}
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={3}>
                                            <FormInput
                                                label="Phones/device"
                                                name="PhoneDevice"
                                                type="text"
                                                control={control}
                                                errors={errors}
                                            />
                                        </Col>
                                        <Col md={3}>
                                            <FormInput
                                                label="IP-PBX/Others"
                                                name="IPPBXOthers"
                                                type="textarea"
                                                rows={3}
                                                control={control}
                                                errors={errors}
                                            />
                                        </Col>
                                    </Row>
                                </fieldset>
                                <div className="pull-right">
                                    {((isChannel === "Neptune" && isManualCreatorRole && isActionBtnEnableFlag && isEnableAddUpdateBtnFlag) && !disableForm) && <Button color="primary" onClick={() => handleCustomSubmit(selectedVoiceDetails?.LineItemId ? true : false)}>{selectedVoiceDetails?.LineItemId ? 'Update' : 'Submit'}</Button>}&nbsp;
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

export default VoiceDetailsModal;