import { useForm } from "react-hook-form";
import { Button, Card, CardBody, Col, Modal, ModalBody, ModalHeader, Row } from "reactstrap";
import FormInput from "../../../../components/form-input";
import { toast } from "react-toastify";

const AddNewCostModal = ({ isOpen, type, addNewRow, onClose, data: gridData }) => {
    const {
        control,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const searchProp = {
        Capex: 'name',
        Opex: 'name',
        Vas: 'vasname'
    }

    const onSubmit = (data) => {
        if (gridData?.findIndex(f => f?.[searchProp[type]]?.toLowerCase() === data?.[searchProp[type]]?.toLowerCase()) !== -1) {
            toast.error('Name is already available, Please enter new name');
            return;
        }
        addNewRow(type, data);
    }

    return (
        <>
            <Modal size="lg" isOpen={isOpen} backdrop={true}>
                <ModalHeader toggle={() => onClose()}>Add New Cost</ModalHeader>
                <ModalBody>
                    <Card className="card_outer_padding">
                        <CardBody>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <Row>
                                    <Col md={6}>
                                        <FormInput
                                            label="Name"
                                            name={type === 'Vas' ? 'vasname' : 'name'}
                                            type="text"
                                            control={control}
                                            errors={errors}
                                            rules={{ required: 'Name is required' }}
                                        />
                                    </Col>
                                    {/* <Col md={6}>
                                        <FormInput
                                            label="VAS Name"
                                            name="vasname"
                                            type="text"
                                            control={control}
                                            errors={errors}
                                            rules={{ required: type === 'Vas' ? 'VAS Name is required' : false }}
                                        />
                                    </Col> */}
                                    <Col md={6}>
                                        <FormInput
                                            label="Cost"
                                            name="cost"
                                            type="number"
                                            control={control}
                                            errors={errors}
                                            rules={{ required: 'Cost is required' }}
                                        />
                                    </Col>
                                </Row>
                                {type === 'Vas' ? <Row>
                                    <Col md={6}>
                                        <FormInput
                                            label="VAS Model"
                                            name="vasmodel"
                                            type="text"
                                            control={control}
                                            errors={errors}
                                            rules={{ required: type === 'Vas' ? 'VAS Model is required' : false }}
                                        />
                                    </Col>

                                    <Col md={6}>
                                        <FormInput
                                            label="VAS Type"
                                            name="vastype"
                                            type="text"
                                            control={control}
                                            errors={errors}
                                            rules={{ required: type === 'Vas' ? 'VAS type is required' : false }}
                                        />
                                    </Col>
                                </Row> : null}
                                <div className="pull-right">
                                    <Button color="primary" type="submit">Add</Button>&nbsp;
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

export default AddNewCostModal;