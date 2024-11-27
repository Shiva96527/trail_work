import { Button, Card, CardBody, Modal, ModalBody, ModalHeader } from "reactstrap";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { Col, Row } from "reactstrap";
import FormDropdown from "../../../../components/form-dropdown";
import FormInput from "../../../../components/form-input";
import Swal from "sweetalert2";

const AddressDetailsModal = ({
    isOpen,
    selectedAddress,
    onClose,
    serviceTypeInfo,
    dataInfoHandler,
    disableForm,
    isActionBtnEnableFlag,
    isEnableAddUpdateBtnFlag,
    SDWAN,
    isManualCreatorRole,
    isChannel,
    wfStatusCode
}) => {
    const { srfDropdownOptions } = useSelector(state => state?.globalSlice);
    const defaultValues = {
        ServiceType: selectedAddress ? selectedAddress?.ServiceType : '',
        LineItemId: selectedAddress ? selectedAddress?.LineItemId : '',
        SiteSeq: selectedAddress ? selectedAddress?.SiteSeq : '',
        SiteName: selectedAddress ? selectedAddress?.SiteName : '',
        BandwidthInMbps: selectedAddress ? selectedAddress?.BandwidthInMbps : '',
        BuildingType: selectedAddress ? selectedAddress?.BuildingType : '',
        BuildingName: selectedAddress ? selectedAddress?.BuildingName : '',
        AddressLine1: selectedAddress ? selectedAddress?.AddressLine1 : '',
        AddressLine2: selectedAddress ? selectedAddress?.AddressLine2 : '',
        AddressLine3: selectedAddress ? selectedAddress?.AddressLine3 : '',
        City: selectedAddress ? selectedAddress?.City : '',
        State: selectedAddress ? selectedAddress?.State : '',
        Country: selectedAddress ? selectedAddress?.Country : '',
        PostCode: selectedAddress ? selectedAddress?.PostCode : '',
        SLA: selectedAddress ? selectedAddress?.SLA : '',
        Transmission: selectedAddress ? selectedAddress?.Transmission : '',
        TransmissionType: selectedAddress ? selectedAddress?.TransmissionType : '',
        Latitude: selectedAddress ? selectedAddress?.Latitude : '',
        Longitude: selectedAddress ? selectedAddress?.Longitude : '',
        UplinkBandwidthInMbps: selectedAddress ? selectedAddress?.UplinkBandwidthInMbps : '',
        DownlinkBandwidthInMbps: selectedAddress ? selectedAddress?.DownlinkBandwidthInMbps : '',
        SDWANPackage: selectedAddress ? selectedAddress?.SDWANPackage : '',
        SDWANMerakiHardwareModel: selectedAddress ? selectedAddress?.SDWANMerakiHardwareModel : '',
        SDWANMerakiSoftwareLicense: selectedAddress ? selectedAddress?.SDWANMerakiSoftwareLicense : '',
        SDWANInfra1: selectedAddress ? selectedAddress?.SDWANInfra1 : '',
        SDWANInfra2: selectedAddress ? selectedAddress?.SDWANInfra2 : '',
        SDWANBackup: selectedAddress ? selectedAddress?.SDWANBackup : '',
    }
    const {
        control,
        handleSubmit,
        getValues,
        watch,
        formState: { errors }
    } = useForm({
        defaultValues
    });

    watch('ServiceType');

    const handleCustomSubmit = (isUpdate) => {
        handleSubmit((data) => {
            Swal.fire({
                title: `Are you sure to ${selectedAddress ? 'update' : 'submit'}?`,
                showDenyButton: true,
                showCancelButton: false,
                confirmButtonText: 'Yes',
                denyButtonText: 'No',
            }).then((result) => {
                if (result.isConfirmed) {
                    dataInfoHandler('Address', data, selectedAddress, onClose, isUpdate ? true : false)
                }
            })
        })();
    }
    const serviceTypeOptions = Array.from(new Set(Object.keys(serviceTypeInfo).map(m => m)));
    const lineItemIdOptions = serviceTypeInfo[getValues('ServiceType')]?.map(m => m?.LineItemId);
    const isCoreRan = (selectedAddress?.ServiceType === "RAN" || selectedAddress?.ServiceType === "Radio Access Network") || (selectedAddress?.ServiceType === "Core" || selectedAddress?.ServiceType === "CORE");
    const isDisabled = (disableForm || !isManualCreatorRole || !isActionBtnEnableFlag || !isEnableAddUpdateBtnFlag) || isChannel === 'CPQ';
    return (
        <>
            <Modal isOpen={isOpen} backdrop={true} className="custom-modal">
                <ModalHeader toggle={() => onClose(false)}>Address Details</ModalHeader>
                <ModalBody>
                    <Card className="card_outer_padding">
                        <CardBody>
                            <form>
                                <fieldset>
                                    <Row>
                                        <Col md={3}>
                                            <FormDropdown
                                                label="Service Type"
                                                name="ServiceType"
                                                control={control}
                                                errors={errors}
                                                rules={{ required: 'Service Type is required' }}
                                                data={serviceTypeOptions}
                                                disabled={isDisabled}
                                            />
                                        </Col>
                                        <Col md={3}>
                                            <FormDropdown
                                                label="Line Item ID"
                                                name="LineItemId"
                                                control={control}
                                                errors={errors}
                                                rules={{ required: 'Line Item ID is required' }}
                                                data={lineItemIdOptions}
                                                disabled={isDisabled}
                                            />
                                        </Col>
                                        <Col md={3}>
                                            <FormInput
                                                label="Site Seq Id"
                                                name="SiteSeq"
                                                type="text"
                                                control={control}
                                                errors={errors}
                                                disabled
                                            />
                                        </Col>
                                        <Col md={3}>
                                            <FormInput
                                                label="Site Name"
                                                name="SiteName"
                                                type="text"
                                                control={control}
                                                errors={errors}
                                                disabled={isDisabled}
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={3}>
                                            <FormInput
                                                label="Bandwidth In Mbps"
                                                name="BandwidthInMbps"
                                                type="number"
                                                control={control}
                                                errors={errors}
                                                disabled={isDisabled}
                                                rules={{ required: 'Bandwidth In Mbps is required' }}
                                            />
                                        </Col>
                                        <Col md={3}>
                                            <FormDropdown
                                                label="Building Type"
                                                name="BuildingType"
                                                control={control}
                                                errors={errors}
                                                rules={{ required: 'Building Type is required' }}
                                                data={["Onnet", "Offnet"]}
                                                disabled={isDisabled}
                                            />
                                        </Col>
                                        <Col md={3}>
                                            <FormInput
                                                label="Building Name"
                                                name="BuildingName"
                                                type="text"
                                                control={control}
                                                errors={errors}
                                                disabled={isDisabled}
                                            />
                                        </Col>
                                        <Col md={3}>
                                            <FormInput
                                                label="Address Line 1"
                                                name="AddressLine1"
                                                type="text"
                                                control={control}
                                                errors={errors}
                                                disabled={isDisabled}
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={3}>
                                            <FormInput
                                                label="Address Line 2"
                                                name="AddressLine2"
                                                type="text"
                                                control={control}
                                                errors={errors}
                                                disabled={isDisabled}
                                            />
                                        </Col>
                                        <Col md={3}>
                                            <FormInput
                                                label="Address Line 3"
                                                name="AddressLine3"
                                                type="text"
                                                control={control}
                                                errors={errors}
                                                disabled={isDisabled}
                                            />
                                        </Col>
                                        <Col md={3}>
                                            <FormInput
                                                label="City"
                                                name="City"
                                                type="text"
                                                control={control}
                                                errors={errors}
                                                disabled={isDisabled}
                                            />
                                        </Col>
                                        <Col md={3}>
                                            <FormInput
                                                label="State"
                                                name="State"
                                                type="text"
                                                control={control}
                                                errors={errors}
                                                disabled={isDisabled}
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={3}>
                                            <FormInput
                                                label="Country"
                                                name="Country"
                                                type="text"
                                                control={control}
                                                errors={errors}
                                                disabled={isDisabled}
                                            />
                                        </Col>
                                        <Col md={3}>
                                            <FormInput
                                                label="PostCode"
                                                name="PostCode"
                                                type="text"
                                                control={control}
                                                errors={errors}
                                                disabled={isDisabled}
                                            />
                                        </Col>
                                        <Col md={3}>
                                            <FormDropdown
                                                label="SLA"
                                                name="SLA"
                                                control={control}
                                                errors={errors}
                                                rules={{ required: 'SLA is required' }}
                                                data={srfDropdownOptions?.SRFDROPDOWNVALUES?.['SRF SLA']?.dropdownValue}
                                                disabled={isDisabled}
                                            />
                                        </Col>
                                        <Col md={3}>
                                            <FormDropdown
                                                label="Transmission"
                                                name="Transmission"
                                                control={control}
                                                errors={errors}
                                                rules={{ required: 'Transmission is required' }}
                                                data={srfDropdownOptions?.SRFDROPDOWNVALUES?.['SRF Transmission']?.dropdownValue}
                                                disabled={isDisabled}
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={3}>
                                            <FormDropdown
                                                label="Transmission Type"
                                                name="TransmissionType"
                                                control={control}
                                                errors={errors}
                                                rules={{ required: 'Transmission is required' }}
                                                data={srfDropdownOptions?.SRFDROPDOWNVALUES?.['SRF Transmission Type']?.dropdownValue}
                                                disabled={isDisabled}
                                            />
                                        </Col>
                                        <Col md={3}>
                                            <FormInput
                                                label="Latitude"
                                                name="Latitude"
                                                type="number"
                                                control={control}
                                                errors={errors}
                                                rules={{ required: isChannel === 'Neptune' ? 'Latitude is required' : false }}
                                                disabled={isDisabled}
                                            />
                                        </Col>
                                        <Col md={3}>
                                            <FormInput
                                                label="Longitude"
                                                name="Longitude"
                                                type="number"
                                                control={control}
                                                errors={errors}
                                                rules={{ required: isChannel === 'Neptune' ? 'Latitude is required' : false }}
                                                disabled={isDisabled}
                                            />
                                        </Col>
                                        <Col md={3}>
                                            <FormInput
                                                label="Uplink Bandwidth In Mbps"
                                                name="UplinkBandwidthInMbps"
                                                type="number"
                                                control={control}
                                                errors={errors}
                                                rules={{ required: isCoreRan }}
                                                disabled={!isCoreRan && selectedAddress}
                                            />
                                        </Col>
                                        <Col md={3}>
                                            <FormInput
                                                label="Downlink Bandwidth In Mbps"
                                                name="DownlinkBandwidthInMbps"
                                                type="number"
                                                control={control}
                                                errors={errors}
                                                rules={{ required: isCoreRan }}
                                                disabled={!isCoreRan && selectedAddress}
                                            />
                                        </Col>
                                    </Row>
                                    {
                                        SDWAN &&
                                        <>
                                            <hr />
                                            <Row>
                                                <Col md={3}>
                                                    <FormInput
                                                        label="SDWAN Package"
                                                        name="SDWANPackage"
                                                        type="text"
                                                        control={control}
                                                        errors={errors}
                                                        disabled={isDisabled}
                                                    />
                                                </Col>
                                                <Col md={3}>
                                                    <FormInput
                                                        label="SDWAN Meraki Hardware Model"
                                                        name="SDWANMerakiHardwareModel"
                                                        type="text"
                                                        control={control}
                                                        errors={errors}
                                                        disabled={isDisabled}
                                                    />
                                                </Col>
                                                <Col md={3}>
                                                    <FormInput
                                                        label="SDWAN Meraki Software Model"
                                                        name="SDWANMerakiSoftwareLicense"
                                                        type="text"
                                                        control={control}
                                                        errors={errors}
                                                        disabled={isDisabled}
                                                    />
                                                </Col>
                                                <Col md={3}>
                                                    <FormInput
                                                        label="SDWAN Infra1"
                                                        name="SDWANInfra1"
                                                        type="text"
                                                        control={control}
                                                        errors={errors}
                                                        disabled={isDisabled}
                                                    />
                                                </Col>
                                                <Col md={3}>
                                                    <FormInput
                                                        label="SDWAN Infra2"
                                                        name="SDWANInfra2"
                                                        type="text"
                                                        control={control}
                                                        errors={errors}
                                                        disabled={isDisabled}
                                                    />
                                                </Col>
                                                <Col md={3}>
                                                    <FormInput
                                                        label="SDWAN Backup"
                                                        name="SDWANBackup"
                                                        type="text"
                                                        control={control}
                                                        errors={errors}
                                                        disabled={isDisabled}
                                                    />
                                                </Col>
                                            </Row>
                                        </>
                                    }
                                </fieldset>
                                <div className="pull-right">
                                    {
                                        ((selectedAddress && isCoreRan && [2].includes(wfStatusCode)) || (selectedAddress && isManualCreatorRole && isChannel === 'Neptune' && [0].includes(wfStatusCode))) &&
                                        <Button color="primary" onClick={() => handleCustomSubmit(true)}>{'Update'}</Button>}&nbsp;
                                    {!selectedAddress && <Button color="primary" onClick={() => handleCustomSubmit(false)}>Submit</Button>}&nbsp;
                                    <Button color="primary" outline onClick={() => onClose()}>Back</Button>
                                </div>
                            </form>
                        </CardBody>
                    </Card>
                </ModalBody>
            </Modal>
        </>
    )
}

export default AddressDetailsModal;