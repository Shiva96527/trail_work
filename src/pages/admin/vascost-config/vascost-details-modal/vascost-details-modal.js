import { Button, Card, CardBody, Col, Modal, ModalBody, ModalHeader, Row } from "reactstrap";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { updateCostDetailsHTTP } from "../../../../services/cost-details-service";
import FormInput from "../../../../components/form-input";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";

const VASCostDetailsModal = ({ isOpen, selectedVas, setShowVasDetails, handleVasDetailsModal }) => {
    const { userInfo } = useSelector(state => state.globalSlice);

    const {
        control,
        handleSubmit,
        formState: { errors },
        getValues
    } = useForm({
        defaultValues: {
            VASBrand: selectedVas?.VASBrand || '',
            VASManaged: selectedVas?.VASManaged || '',
            VASPackage: selectedVas?.VASPackage || '',
            Col1: selectedVas?.VASCost || '',
            Col2: selectedVas?.Installation || '',
            VASServiceType: selectedVas?.VASServiceType || '',
            VASname: selectedVas?.VASname || '',
            VASType: selectedVas?.VASType || '',
            VASModel: selectedVas?.VASModel || '',
        }
    }
    );

    const handleCustomSubmit = () => {
        handleSubmit((data) => {
            Swal.fire({
                title: `Are you sure to update?`,
                showDenyButton: true,
                showCancelButton: false,
                confirmButtonText: 'Yes',
                denyButtonText: 'No',
            }).then((result) => {
                if (result.isConfirmed) {
                    handleUpdate(data);
                }
            })
        })();
    }

    const handleUpdate = async () => {
        const payload = { ...getValues() };
        payload['Id'] = selectedVas?.Id;
        payload['loginuser'] = userInfo?.user?.DisplayName;
        payload['type'] = 'CPQVasCost';
        payload['Action']= 'CPQVasCost';
        payload['LoginUIID']=sessionStorage.getItem('uiid')
        try {
            const { data, status } = await updateCostDetailsHTTP(payload);
            if (status === 200 && data) {
                toast.success('VAS details updated successfully');
                handleVasDetailsModal(false);
            }
        } catch (e) {
            toast.error('Something went wrong');
        }
    }

    return (
        <>
            <Modal size="lg" isOpen={isOpen} backdrop={true}>
                <ModalHeader>VAS Cost Catalogue</ModalHeader>
                <ModalBody>
                    <Card className="card_outer_padding">
                        <CardBody>
                            <div className="app-inner-layout__wrapper">
                                <Row>
                                    <Col md={4}>
                                        <FormInput
                                            label="VAS Service Type"
                                            name="VASServiceType"
                                            control={control}
                                            disabled
                                            errors={errors}
                                        />
                                    </Col>
                                    <Col md={4}>
                                        <FormInput
                                            label="VAS Name"
                                            name="VASname"
                                            control={control}
                                            disabled
                                            errors={errors}
                                        />
                                    </Col>
                                    <Col md={4}>
                                        <FormInput
                                            label="VAS Type"
                                            name="VASType"
                                            control={control}
                                            disabled
                                            errors={errors}
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={4}>
                                        <FormInput
                                            label="VAS Model"
                                            name="VASModel"
                                            control={control}
                                            disabled
                                            errors={errors}
                                        />
                                    </Col>
                                    <Col md={4}>
                                        <FormInput
                                            label="VAS Cost"
                                            name="Col1"
                                            control={control}
                                            errors={errors}
                                        />
                                    </Col>
                                    <Col md={4}>
                                        <FormInput
                                            label="Installation"
                                            name="Col2"
                                            control={control}
                                            rules={{ required: 'Installation is required' }}
                                            errors={errors}
                                        />
                                    </Col>
                                    {/* <Col md={4}>
                                        <FormInput
                                            label="VAS Brand"
                                            name="VASBrand"
                                            control={control}
                                            errors={errors}
                                        />
                                    </Col>
                                    <Col md={4}>
                                        <FormInput
                                            label="VAS Managed"
                                            name="VASManaged"
                                            control={control}
                                            errors={errors}
                                        />
                                    </Col> */}
                                </Row>
                                {/* <Row>
                                   <Col md={4}>
                                        <FormInput
                                            label="VAS Package"
                                            name="VASPackage"
                                            control={control}
                                            errors={errors}
                                        />
                                    </Col> 
                                    
                                </Row> */}
                                <div className="pull-right">
                                    <Button color="primary" className="mr-2" onClick={handleCustomSubmit}>
                                        Submit
                                    </Button>&nbsp;
                                    <Button color="primary" outline onClick={() => setShowVasDetails(false)}>
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </ModalBody>
            </Modal >
        </>
    )
}

export default VASCostDetailsModal;