import { Button, Card, CardBody, Col, Modal, ModalBody, ModalHeader, Row } from "reactstrap";
import FormDropdown from "../../../../components/form-dropdown";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

const CloudSecurityDetailsModal = (
    {
        isOpen,
        selectedCloudSecurityDetails,
        onClose,
        serviceTypeDataInfoHandler,
        isManualCreatorRole,
        disableForm,
        isChannel,
        isActionBtnEnableFlag,
        isEnableAddUpdateBtnFlag
    }) => {
    const { CloudSecurityBundle } = selectedCloudSecurityDetails || {};

    const {
        control,
        handleSubmit,
        formState: { errors }
    } = useForm({
        defaultValues: {
            CloudSecurityBundle: CloudSecurityBundle || ''
        }
    })

    const handleCustomSubmit = (isUpdate) => {
        handleSubmit((data) => {
            Swal.fire({
                title: `Are you sure to ${selectedCloudSecurityDetails ? 'update' : 'submit'}?`,
                showDenyButton: true,
                showCancelButton: false,
                confirmButtonText: 'Yes',
                denyButtonText: 'No',
            }).then((result) => {
                if (result.isConfirmed) {
                    serviceTypeDataInfoHandler('Cloud Security', data, selectedCloudSecurityDetails, onClose, isUpdate ? true : false)
                }
            })
        })();
    }

    return (
        <>
            <Modal size="lg" isOpen={isOpen} backdrop={true}>
                <ModalHeader toggle={onClose}>Cloud Security Details</ModalHeader>
                <ModalBody>
                    <Card className="card_outer_padding">
                        <CardBody>
                            <form>
                                <fieldset disabled={(disableForm || !isManualCreatorRole || !isActionBtnEnableFlag || !isEnableAddUpdateBtnFlag) || isChannel === 'CPQ'}>
                                    <Row>
                                        <Col md={12}>
                                            <FormDropdown
                                                label="Bundle"
                                                type="textarea"
                                                rows={3}
                                                name="CloudSecurityBundle"
                                                control={control}
                                                errors={errors}
                                                data={["Bundle A", "Bundle B"]}
                                            />
                                        </Col>
                                    </Row>
                                </fieldset>
                            </form>
                            <div className="pull-right">
                                {((isChannel === "Neptune" && isManualCreatorRole && isActionBtnEnableFlag && isEnableAddUpdateBtnFlag) && !disableForm) && <Button color="primary" onClick={() => handleCustomSubmit(selectedCloudSecurityDetails?.LineItemId ? true : false)}>{selectedCloudSecurityDetails?.LineItemId ? 'Update' : 'Submit'}</Button>}&nbsp;
                                <Button color="primary" outline onClick={onClose}>Back</Button>
                            </div>
                        </CardBody>
                    </Card>
                </ModalBody>
            </Modal>
        </>
    )
}
export default CloudSecurityDetailsModal;