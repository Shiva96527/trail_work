import { useForm } from "react-hook-form";
import { Button, Card, CardBody, Col, Modal, ModalBody, ModalHeader, Row } from "reactstrap";
import FormDropdown from "../../../../components/form-dropdown";
import FormInput from "../../../../components/form-input";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import FormMultiSelectDropdown from "../../../../components/form-multiselect-dropdown";

const RANDetailsModal = ({ isOpen, selectedRANDetails, onClose, isChannel, isPathNameFlag, wfStatusCode, dataInfoHandler }) => {
    const { srfDropdownOptions } = useSelector(state => state?.globalSlice);
    const defaultValues = {
        LineItemId: selectedRANDetails ? selectedRANDetails?.LineItemId : '',
        MPNID: selectedRANDetails ? selectedRANDetails?.MPNID : '',
        RANID: selectedRANDetails ? selectedRANDetails?.RANID : '',
        ContractPeriod: selectedRANDetails ? selectedRANDetails?.ContractPeriod : '',
        Technology: selectedRANDetails ? selectedRANDetails?.Technology : '',
        NoOfUE: selectedRANDetails ? selectedRANDetails?.NoOfUE : '',
        BandsSupportedbyUE: selectedRANDetails && selectedRANDetails?.BandsSupportedbyUE ? selectedRANDetails?.BandsSupportedbyUE?.split(',') : [],
        CoverageRequirement: selectedRANDetails ? selectedRANDetails?.CoverageRequirement : '',
        RANRemarks: selectedRANDetails ? selectedRANDetails?.RANRemarks : ''
    }
    const {
        control,
        handleSubmit,
        formState: { errors }
    } = useForm({
        defaultValues
    });

    const onSubmit = (data) => {
        handleSubmit((data) => {
            const tempData = { ...data };
            tempData.BandsSupportedbyUE = data?.BandsSupportedbyUE?.join(',');
            Swal.fire({
                title: `Are you sure to ${selectedRANDetails ? 'update' : 'submit'}?`,
                showDenyButton: true,
                showCancelButton: false,
                confirmButtonText: 'Yes',
                denyButtonText: 'No',
            }).then((result) => {
                if (result.isConfirmed) {
                    dataInfoHandler('RAN', tempData, selectedRANDetails, onClose, true);
                }
            })
        })();
    }

    return (
        <>
            <Modal size="xl" isOpen={isOpen} backdrop={true}>
                <ModalHeader toggle={onClose}>Radio Access Network Details</ModalHeader>
                <ModalBody>
                    <Card className="card_outer_padding">
                        <CardBody>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <Row>
                                    <Col md={3}>
                                        <FormInput
                                            label='Line Item ID'
                                            name='LineItemId'
                                            type="text"
                                            control={control}
                                            errors={errors}
                                            disabled
                                        />
                                    </Col>
                                    <Col md={3}>
                                        <FormInput
                                            label="MPN ID"
                                            name="MPNID"
                                            type="text"
                                            control={control}
                                            errors={errors}
                                            disabled={isChannel === "CPQ"}
                                        />
                                    </Col>
                                    <Col md={3}>
                                        <FormInput
                                            label="RAN ID"
                                            name="RANID"
                                            type="text"
                                            control={control}
                                            errors={errors}
                                            disabled={isChannel === "CPQ"}
                                        />
                                    </Col>
                                    <Col md={3}>
                                        <FormInput
                                            label="Contract Term"
                                            name="ContractPeriod"
                                            type="number"
                                            control={control}
                                            errors={errors}
                                            rules={{ required: 'Contract Term is required' }}
                                            disabled={isChannel === "CPQ"}
                                        />
                                    </Col>
                                    <Col md={3}>
                                        <FormDropdown
                                            label="Technology"
                                            name="Technology"
                                            control={control}
                                            errors={errors}
                                            rules={{ required: 'Technology is required' }}
                                            data={srfDropdownOptions?.SRFDROPDOWNVALUES?.['MPN Technology']?.dropdownValue}
                                            disabled={!isPathNameFlag || ![2, 10].includes(wfStatusCode)}
                                        />
                                    </Col>
                                    <Col md={3}>
                                        <FormInput
                                            label="Number of UE"
                                            name="NoOfUE"
                                            type="number"
                                            control={control}
                                            errors={errors}
                                            rules={{ required: 'Number of UE is required' }}
                                            disabled={!isPathNameFlag || ![2, 10].includes(wfStatusCode)}
                                        />
                                    </Col>
                                    <Col md={3}>
                                        <FormMultiSelectDropdown
                                            label="Bands supported by UE"
                                            name="BandsSupportedbyUE"
                                            control={control}
                                            errors={errors}
                                            rules={{ required: 'Bands supported by UE is required' }}
                                            data={srfDropdownOptions?.SRFDROPDOWNVALUES?.['MPN Bands Supported by UE']?.dropdownValue}
                                            disabled={!isPathNameFlag || ![2, 10].includes(wfStatusCode)}
                                        />
                                    </Col>
                                    <Col md={3}>
                                        <FormInput
                                            label="Coverage Requirement"
                                            name="CoverageRequirement"
                                            type="text"
                                            control={control}
                                            errors={errors}
                                            rules={{ required: 'Coverage Requirement is required' }}
                                            disabled={!isPathNameFlag || ![2, 10].includes(wfStatusCode)}
                                        />
                                    </Col>
                                    <Col md={3}>
                                        <FormInput
                                            label="Other remark"
                                            name="RANRemarks"
                                            type="textarea"
                                            rows={3}
                                            control={control}
                                            errors={errors}
                                            disabled={!isPathNameFlag || ![2, 10].includes(wfStatusCode)}
                                        />
                                    </Col>
                                </Row>
                                <div className="pull-right">
                                    {isPathNameFlag && [2, 10].includes(wfStatusCode) && <Button color="primary" type="submit">Update</Button>}&nbsp;
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
export default RANDetailsModal;