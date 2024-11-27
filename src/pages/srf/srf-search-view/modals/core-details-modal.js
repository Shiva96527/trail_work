import { useForm } from "react-hook-form";
import { Button, Card, CardBody, Col, Modal, ModalBody, ModalHeader, Row } from "reactstrap";
import FormDropdown from "../../../../components/form-dropdown";
import FormInput from "../../../../components/form-input";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";

const CoreDetailsModal = ({ isOpen, selectedCoreDetails, onClose, isChannel, isPathNameFlag, wfStatusCode, dataInfoHandler }) => {
    const { srfDropdownOptions } = useSelector(state => state?.globalSlice);
    const defaultValues = {
        LineItemId: selectedCoreDetails ? selectedCoreDetails?.LineItemId : '',
        MPNID: selectedCoreDetails ? selectedCoreDetails?.MPNID : '',
        CoreID: selectedCoreDetails ? selectedCoreDetails?.CoreID : '',
        ContractPeriod: selectedCoreDetails ? selectedCoreDetails?.ContractPeriod : '',
        Technology: selectedCoreDetails ? selectedCoreDetails?.Technology : '',
        NetworkSlicingRequirement: selectedCoreDetails ? selectedCoreDetails?.NetworkSlicingRequirement : '',
        NoOfUE: selectedCoreDetails ? selectedCoreDetails?.NoOfUE : '',
        Whitelisting: selectedCoreDetails ? selectedCoreDetails?.Whitelisting : '',
        CoreRemarks: selectedCoreDetails ? selectedCoreDetails?.CoreRemarks : ''
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
            Swal.fire({
                title: `Are you sure to ${selectedCoreDetails ? 'update' : 'submit'}?`,
                showDenyButton: true,
                showCancelButton: false,
                confirmButtonText: 'Yes',
                denyButtonText: 'No',
            }).then((result) => {
                if (result.isConfirmed) {
                    dataInfoHandler('Core', data, selectedCoreDetails, onClose, true);
                }
            })
        })();
    }

    return (
        <>
            <Modal size="xl" isOpen={isOpen} backdrop={true}>
                <ModalHeader toggle={onClose}>Core Details</ModalHeader>
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
                                            label="Core ID"
                                            name="CoreID"
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
                                            label="Network Slicing Requirement"
                                            name="NetworkSlicingRequirement"
                                            type="text"
                                            rules={{ required: 'Network Slicing Requirement is required' }}
                                            control={control}
                                            errors={errors}
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
                                        />
                                    </Col>
                                    <Col md={3}>
                                        <FormInput
                                            label="Whitelisting"
                                            name="Whitelisting"
                                            type="text"
                                            control={control}
                                            errors={errors}
                                            rules={{ required: 'Whitelisting is required' }}
                                        />
                                    </Col>
                                    <Col md={3}>
                                        <FormInput
                                            label="Other remark"
                                            name="CoreRemarks"
                                            type="textarea"
                                            rows={3}
                                            control={control}
                                            errors={errors}
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
export default CoreDetailsModal;