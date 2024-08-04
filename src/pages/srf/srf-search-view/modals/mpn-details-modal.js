import { useForm } from "react-hook-form";
import { Button, Card, CardBody, Col, Modal, ModalBody, ModalHeader, Row } from "reactstrap";
import FormDropdown from "../../../../components/form-dropdown";
import FormInput from "../../../../components/form-input";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";

const MPNDetailsModal = ({ isOpen, selectedMPNDetails, onClose, isChannel, isPathNameFlag, wfStatusCode, dataInfoHandler }) => {
    const { srfDropdownOptions } = useSelector(state => state?.globalSlice);
    const defaultValues = {
        LineItemId: selectedMPNDetails ? selectedMPNDetails?.LineItemId : '',
        MPNID: selectedMPNDetails ? selectedMPNDetails?.MPNID : '',
        ContractPeriod: selectedMPNDetails ? selectedMPNDetails?.ContractPeriod : '',
        SolutionOption: selectedMPNDetails ? selectedMPNDetails?.SolutionOption : '',
        NoOfSIMS: selectedMPNDetails ? selectedMPNDetails?.NoOfSIMS : '',
        CompliancetoEAR: selectedMPNDetails ? selectedMPNDetails?.CompliancetoEAR : '',
        LatencyMS: selectedMPNDetails ? selectedMPNDetails?.LatencyMS : '',
        TypesofApplicationUseCase: selectedMPNDetails ? selectedMPNDetails?.TypesofApplicationUseCase : '',
        QosRequirement: selectedMPNDetails ? selectedMPNDetails?.QosRequirement : '',
        ExistingMPNID: selectedMPNDetails ? selectedMPNDetails?.ExistingMPNID : '',
        MPNRemarks: selectedMPNDetails ? selectedMPNDetails?.MPNRemarks : '',
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
                title: `Are you sure to ${selectedMPNDetails ? 'update' : 'submit'}?`,
                showDenyButton: true,
                showCancelButton: false,
                confirmButtonText: 'Yes',
                denyButtonText: 'No',
            }).then((result) => {
                if (result.isConfirmed) {
                    dataInfoHandler('MPN', data, selectedMPNDetails, onClose, true);
                }
            })
        })();
    }

    return (
        <>
            <Modal size="xl" isOpen={isOpen} backdrop={true}>
                <ModalHeader toggle={() => onClose(false)}>Mobile Private Network Details</ModalHeader>
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
                                            disabled={true}
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
                                            label="Contract Term"
                                            name="ContractPeriod"
                                            type="text"
                                            control={control}
                                            errors={errors}
                                            disabled={isChannel === "CPQ"}
                                            rules={{ required: 'Contract Term is required' }}
                                        />
                                    </Col>
                                    <Col md={3}>
                                        <FormDropdown
                                            label="Solution Option"
                                            name="SolutionOption"
                                            control={control}
                                            errors={errors}
                                            rules={{ required: 'Solution Option is required' }}
                                            data={srfDropdownOptions?.SRFDROPDOWNVALUES?.['MPN Solution Option']?.dropdownValue}
                                            disabled={!isPathNameFlag || ![2, 10].includes(wfStatusCode)}
                                        />
                                    </Col>
                                    <Col md={3}>
                                        <FormInput
                                            label="Number of SIMS"
                                            name="NoOfSIMS"
                                            type="number"
                                            control={control}
                                            errors={errors}
                                            rules={{ required: 'Number of SIMS is required' }}
                                            disabled={!isPathNameFlag || ![2, 10].includes(wfStatusCode)}
                                        />
                                    </Col>
                                    <Col md={3}>
                                        <FormDropdown
                                            label="Compliance to EAR"
                                            name="CompliancetoEAR"
                                            control={control}
                                            errors={errors}
                                            rules={{ required: 'Compliance to EAR is required' }}
                                            data={srfDropdownOptions?.SRFDROPDOWNVALUES?.['MPN Compliance EAR']?.dropdownValue}
                                            disabled={!isPathNameFlag || ![2, 10].includes(wfStatusCode)}
                                        />
                                    </Col>
                                    <Col md={3}>
                                        <FormInput
                                            label="Latency (ms)"
                                            name="LatencyMS"
                                            type="number"
                                            control={control}
                                            errors={errors}
                                            rules={{ required: 'Latency (ms)' }}
                                            disabled={!isPathNameFlag || ![2, 10].includes(wfStatusCode)}
                                        />
                                    </Col>
                                    <Col md={3}>
                                        <FormInput
                                            label="Types of Application & Use case"
                                            name="TypesofApplicationUseCase"
                                            type="text"
                                            control={control}
                                            errors={errors}
                                            rules={{ required: 'Types of Application & Use case is required' }}
                                            disabled={!isPathNameFlag || ![2, 10].includes(wfStatusCode)}
                                        />
                                    </Col>
                                    <Col md={3}>
                                        <FormInput
                                            label="QoS Requirement"
                                            name="QosRequirement"
                                            type="text"
                                            control={control}
                                            errors={errors}
                                            rules={{ required: 'QoS Requirement is required' }}
                                            disabled={!isPathNameFlag || ![2, 10].includes(wfStatusCode)}
                                        />
                                    </Col>
                                    <Col md={3}>
                                        <FormInput
                                            label="Existing MPN ID"
                                            name="ExistingMPNID"
                                            type="text"
                                            control={control}
                                            errors={errors}
                                            disabled={true}
                                        />
                                    </Col>
                                    <Col md={3}>
                                        <FormInput
                                            label="Other remark"
                                            name="MPNRemarks"
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
export default MPNDetailsModal;