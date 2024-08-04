import { Button, Card, CardBody, Col, Modal, ModalBody, ModalHeader, Row } from "reactstrap";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { updateCostDetailsHTTP } from "../../../../services/cost-details-service";
import { useForm } from "react-hook-form";
import FormInput from "../../../../components/form-input";
import Swal from "sweetalert2";

const CostDetailsModal = ({ isOpen, selectedCost, setShowCostDetails, applicationType, handleCostDetailsModal }) => {
    const { userInfo } = useSelector(state => state.globalSlice);

    const {
        control,
        handleSubmit,
        formState: { errors },
        getValues
    } = useForm({
        defaultValues: {
            Col1: selectedCost?.CostWithoutManagedRouter || '',
            Col2: selectedCost?.CostWithManagedRouter || '',
            Col3: selectedCost?.WM || '',
            Col4: selectedCost?.EM || '',
            Col5: selectedCost?.KL || '',
            Col7: selectedCost?.Others || '',
            Col6: selectedCost?.Sarawak || '',
            CostName: selectedCost?.CostName || '',
            CostType: selectedCost?.CostType || '',
            BuildingType: selectedCost?.BuildingType || '',
            Transmission: selectedCost?.Transmission || ''
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
        payload['Id'] = selectedCost?.ID;
        payload['loginuser'] = userInfo?.user?.DisplayName;
        payload['type'] = 'CPQCost';        
        payload['Action']= 'CPQCost';
        payload['LoginUIID']=sessionStorage.getItem('uiid')

        try {
            const { data, status } = await updateCostDetailsHTTP(payload);
            if (status === 200 && data) {
                toast.success('Cost updated successfully');
                handleCostDetailsModal(false);
            }
        } catch (e) {
            toast.error('Something went wrong');
        }
    }

    // const handleCostForm = (e) => {
    //     const { name, value } = e.target;
    //     setState({ ...state, [name]: value });
    // }

    return (
        <>
            <Modal size="lg" isOpen={isOpen} backdrop={true}>
                <ModalHeader>Cost Catalogue(Capex,Opex)</ModalHeader>
                <ModalBody>
                    <Card className="card_outer_padding">
                        <CardBody>
                            <div className="app-inner-layout__wrapper">
                                <form>
                                    <Row>
                                        <Col md={4}>
                                            <FormInput
                                                label="Cost Name"
                                                name="CostName"
                                                control={control}
                                                disabled
                                                errors={errors}
                                            />
                                        </Col>
                                        <Col md={4}>
                                            <FormInput
                                                label="Cost Type"
                                                name="CostType"
                                                control={control}
                                                disabled
                                                errors={errors}
                                            />
                                        </Col>
                                        <Col md={4}>
                                            <FormInput
                                                label="Building Type"
                                                name="BuildingType"
                                                control={control}
                                                disabled
                                                errors={errors}
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={4}>
                                            <FormInput
                                                label="Transmission"
                                                name="Transmission"
                                                control={control}
                                                disabled
                                                errors={errors}
                                            />
                                        </Col>
                                        <Col md={4}>
                                            <FormInput
                                                label="Cost Without Managed Service"
                                                name="Col1"
                                                control={control}
                                                errors={errors}
                                                rules={{ required: true }}
                                            />
                                        </Col>
                                        <Col md={4}>
                                            <FormInput
                                                label="Cost With Managed Service"
                                                name="Col2"
                                                control={control}
                                                errors={errors}
                                                rules={{ required: true }}
                                            />
                                        </Col>
                                    </Row>
                                    {/* {applicationType !== 'CPQ' ? <>
                                        <Row>
                                            <Col md={4}>
                                                <FormInput
                                                    label="WM"
                                                    name="Col3"
                                                    control={control}
                                                    errors={errors}
                                                />
                                            </Col>
                                            <Col md={4}>
                                                <FormInput
                                                    label="EM"
                                                    name="Col4"
                                                    control={control}
                                                    errors={errors}
                                                />
                                            </Col>
                                            <Col md={4}>
                                                <FormInput
                                                    label="KL"
                                                    name="Col5"
                                                    control={control}
                                                    rules={{ required: 'KL is required' }}
                                                    errors={errors}
                                                />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={4}>
                                                <FormInput
                                                    label="Sarawak"
                                                    name="Col6"
                                                    control={control}
                                                    rules={{ required: 'Sarawak is required' }}
                                                    errors={errors}
                                                />
                                            </Col>
                                            <Col md={4}>
                                                <FormInput
                                                    label="Others"
                                                    name="Col7"
                                                    control={control}
                                                    rules={{ required: 'Others is required' }}
                                                    errors={errors}
                                                />
                                            </Col>
                                        </Row>
                                    </> : null} */}
                                    <div className="pull-right">
                                        <Button color="primary" className="mr-2" onClick={handleCustomSubmit}>
                                            Submit
                                        </Button>&nbsp;
                                        <Button color="primary" outline onClick={() => setShowCostDetails(false)}>
                                            Back
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </CardBody>
                    </Card>
                </ModalBody>
            </Modal >
        </>
    )
}

export default CostDetailsModal;