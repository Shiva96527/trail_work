import { useForm } from "react-hook-form";
import { Button, Card, CardBody, Col, Modal, ModalBody, ModalHeader, Row } from "reactstrap";
import FormDropdown from "../../../../components/form-dropdown";
import FormInput from "../../../../components/form-input";
import { getDropdownByTypeHTTP } from "../../../../services/global-service";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";


const VASDetailsModal = (
    {
        isOpen,
        selectedVas,
        onClose,
        serviceTypeInfo,
        vasSubmitHandler,
        IntegrationID,
        SRFNumber,
        isManualCreatorRole,
        disableForm,
        isChannel,
        isActionBtnEnableFlag,
        isEnableAddUpdateBtnFlag
    }) => {
    const [dropdownOptions, setDropdownOptions] = useState(null);

    const defaultValues = {
        ServiceType: selectedVas?.ServiceType || '',
        LineItemId: selectedVas?.LineItemId || '',
        SiteSeq: selectedVas?.SiteSeq || '',
        vasname: selectedVas?.vasname || '',
        vastype: selectedVas?.vastype || '',
        vasmodel: selectedVas?.vasmodel || ''
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

    const serviceTypeWatch = watch('ServiceType');

    useEffect(() => {
        if (getValues('ServiceType')) {
            onServiceTypeChange(getValues('ServiceType'));
        }
        /*eslint-disable-next-line*/
    }, [serviceTypeWatch])

    const handleCustomSubmit = (isUpdate) => {
        handleSubmit((data) => {
            Swal.fire({
                title: `Are you sure to ${selectedVas ? 'update' : 'submit'}?`,
                showDenyButton: true,
                showCancelButton: false,
                confirmButtonText: 'Yes',
                denyButtonText: 'No',
            }).then((result) => {
                if (result.isConfirmed) {
                    vasSubmitHandler('Vas', data, selectedVas, onClose, isUpdate ? true : false)
                }
            })
        })();
    }

    const onServiceTypeChange = async (selectedServiceType) => {
        const options = await getDropdownByTypeHTTP({
            DropDownType: 'SRF VAS LineItem Value',
            Filter1: SRFNumber,
            Filter2: IntegrationID,
            Filter3: selectedServiceType
        });
        let tempDropdownOptions = {};
        options?.data?.data?.forEach(d => {
            const values = d?.DropDownValue;
            const property = d?.DropDownType;
            if (values) {
                const options = (values?.split(','));
                tempDropdownOptions[property] = options;
            }
        })
        setDropdownOptions(tempDropdownOptions);
    }


    const serviceTypeOptions = Array.from(new Set(Object.keys(serviceTypeInfo).map(m => m)));

    return (
        <>
            <Modal size="xl" isOpen={isOpen} backdrop={true}>
                <ModalHeader>VAS Details</ModalHeader>
                <ModalBody>
                    <Card className="card_outer_padding">
                        <CardBody>
                            <form>
                                <fieldset disabled={(disableForm || !isManualCreatorRole || !isActionBtnEnableFlag || !isEnableAddUpdateBtnFlag) || isChannel === 'CPQ'}>
                                    <Row>
                                        <Col md={4}>
                                            <FormDropdown
                                                label="Service Type"
                                                name="ServiceType"
                                                control={control}
                                                errors={errors}
                                                rules={{ required: 'Service Type is required' }}
                                                data={serviceTypeOptions}
                                            />
                                        </Col>
                                        <Col md={4}>
                                            <FormDropdown
                                                label="Line Item ID"
                                                name="LineItemId"
                                                control={control}
                                                errors={errors}
                                                rules={{ required: 'Line Item ID is required' }}
                                                data={dropdownOptions?.['SRF VAS LineItem Value']}
                                            />
                                        </Col>
                                        <Col md={4}>
                                            <FormDropdown
                                                label="VAS Name"
                                                name="vasname"
                                                control={control}
                                                errors={errors}
                                                rules={{ required: 'VAS Name is required' }}
                                                data={dropdownOptions?.['SRF VAS Name']}
                                            />
                                        </Col>
                                        <Col md={4}>
                                            <FormDropdown
                                                label="VAS Type"
                                                name="vastype"
                                                control={control}
                                                errors={errors}
                                                rules={{ required: 'VAS Type is required' }}
                                                data={dropdownOptions?.['SRF VAS Type']}
                                            />
                                        </Col>
                                        <Col md={4}>
                                            <FormInput
                                                label="Model"
                                                name="vasmodel"
                                                type="text"
                                                control={control}
                                                errors={errors}
                                            />
                                        </Col>
                                    </Row>
                                </fieldset>
                            </form>
                            <div className="pull-right">
                                {((isChannel === "Neptune" && isManualCreatorRole && isActionBtnEnableFlag && isEnableAddUpdateBtnFlag) && !disableForm) && <Button color="primary" onClick={() => handleCustomSubmit(selectedVas ? true : false)}>{selectedVas ? 'Update' : 'Submit'}</Button>}&nbsp;
                                <Button color="primary" outline onClick={() => onClose(false)}>Back</Button>
                            </div>
                        </CardBody>
                    </Card>
                </ModalBody>
            </Modal>
        </>
    )
}

export default VASDetailsModal;