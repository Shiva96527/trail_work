import { useForm } from "react-hook-form";
import { Button, Card, CardBody, Col, Modal, ModalBody, ModalHeader, Row } from "reactstrap";
import FormInput from "../../../../components/form-input";
import Swal from "sweetalert2";

const SecurityDetailsModal = (
    {
        isOpen,
        selectedSecurityDetails,
        onClose,
        serviceTypeDataInfoHandler,
        isManualCreatorRole,
        disableForm,
        isChannel,
        isActionBtnEnableFlag,
        isEnableAddUpdateBtnFlag
    }) => {
    const { Security } = selectedSecurityDetails || {};

    const {
        control,
        handleSubmit,
        formState: { errors }
    } = useForm({
        defaultValues: {
            Security: Security || ''
        }
    })

    const handleCustomSubmit = (isUpdate) => {
        handleSubmit((data) => {
            Swal.fire({
                title: `Are you sure to ${selectedSecurityDetails ? 'update' : 'submit'}?`,
                showDenyButton: true,
                showCancelButton: false,
                confirmButtonText: 'Yes',
                denyButtonText: 'No',
            }).then((result) => {
                if (result.isConfirmed) {
                    serviceTypeDataInfoHandler('Security', data, selectedSecurityDetails, onClose, isUpdate ? true : false)
                }
            })
        })();
    }

    return (
        <>
            <Modal size="lg" isOpen={isOpen} backdrop={true}>
                <ModalHeader toggle={onClose}>Security Details</ModalHeader>
                <ModalBody>
                    <Card className="card_outer_padding">
                        <CardBody>
                            <form>
                                <fieldset disabled={(disableForm || !isManualCreatorRole || !isActionBtnEnableFlag || !isEnableAddUpdateBtnFlag) || isChannel === 'CPQ'}>
                                    <Row>
                                        <Col md={12}>
                                            <FormInput
                                                label="Security"
                                                type="textarea"
                                                rows={3}
                                                name="Security"
                                                control={control}
                                                errors={errors}
                                            />
                                        </Col>
                                    </Row>
                                </fieldset>
                            </form>
                            <div className="pull-right">
                                {((isChannel === "Neptune" && isManualCreatorRole && isActionBtnEnableFlag && isEnableAddUpdateBtnFlag) && !disableForm) && <Button color="primary" onClick={() => handleCustomSubmit(selectedSecurityDetails?.LineItemId ? true : false)}>{selectedSecurityDetails?.LineItemId ? 'Update' : 'Submit'}</Button>}&nbsp;
                                <Button color="primary" outline onClick={onClose}>Back</Button>
                            </div>
                        </CardBody>
                    </Card>
                </ModalBody>
            </Modal>
        </>
    )
}
export default SecurityDetailsModal;