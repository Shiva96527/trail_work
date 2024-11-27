import { useEffect, useState } from "react";
import { Button, Card, CardBody, Col, Modal, ModalBody, ModalHeader, Row } from "reactstrap";
import { updateBuildingCostHTTP } from "../../../../services/building-details-service";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import FormInput from "../../../../components/form-input";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";

const BuildingModalDetails = ({ isOpen, selectedDetails, setShowBuildingDetails, handleBuildingDetailsModal }) => {
    const { userInfo } = useSelector(state => state.globalSlice);
    const [state, setState] = useState({ otc: '', mrc: '' });

    useEffect(() => {
        if (selectedDetails) {
            setState({ ...state, otc: selectedDetails?.OTC, mrc: selectedDetails?.MRC })
        }
        /*eslint-disable-next-line*/
    }, [])

    const {
        control,
        handleSubmit,
        formState: { errors },
        getValues
    } = useForm({
        defaultValues: {
            otc: selectedDetails?.OTC || '',
            mrc: selectedDetails?.MRC || '',
            Building_Name: selectedDetails?.Building_Name || '',
            Street: selectedDetails?.Street || '',
            Area: selectedDetails?.Area || '',
            City: selectedDetails?.City || '',
            Postcode: selectedDetails?.Postcode || '',
            State: selectedDetails?.State || '',
            Lat: selectedDetails?.Lat || '',
            Long: selectedDetails?.Long || '',
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
        const payload = {
            Col1: getValues('otc'),
            Col2: getValues('mrc'),
            Id: selectedDetails?.Building_Id,
            loginuser: userInfo?.user?.User_Name,
            Action: 'BuildingCost',
            LoginUIID: sessionStorage.getItem('uiid'),
        }
        try {
            const { data, status } = await updateBuildingCostHTTP(payload);
            if (status === 200 && data) {
                toast.success('Cost updated successfully');
                handleBuildingDetailsModal(false);
            }
        } catch (e) {
            toast.error('Something went wrong');
        }
    }

    return (
        <>
            <Modal size="lg" isOpen={isOpen} backdrop={true}>
                <ModalHeader>Building Details</ModalHeader>
                <ModalBody>
                    <Card className="card_outer_padding">
                        <CardBody>
                            <div className="app-inner-layout__wrapper">
                                <Row>
                                    <Col md={4}>
                                        <FormInput
                                            label="Building Name"
                                            type="textarea"
                                            rows={3}
                                            name="Building_Name"
                                            control={control}
                                            disabled
                                            errors={errors}
                                        />
                                    </Col>
                                    <Col md={4}>
                                        <FormInput
                                            label="Street"
                                            type="textarea"
                                            rows={3}
                                            name="Street"
                                            control={control}
                                            disabled
                                            errors={errors}
                                        />
                                    </Col>
                                    <Col md={4}>
                                        <FormInput
                                            label="Area"
                                            name="Area"
                                            control={control}
                                            disabled
                                            errors={errors}
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={4}>
                                        <FormInput
                                            label="City"
                                            name="City"
                                            control={control}
                                            disabled
                                            errors={errors}
                                        />
                                    </Col>
                                    <Col md={4}>
                                        <FormInput
                                            label="Post Code"
                                            name="Postcode"
                                            control={control}
                                            disabled
                                            errors={errors}
                                        />
                                    </Col>
                                    <Col md={4}>
                                        <FormInput
                                            label="State"
                                            name="State"
                                            control={control}
                                            disabled
                                            errors={errors}
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={4}>
                                        <FormInput
                                            label="Latitude"
                                            name="Latitude"
                                            control={control}
                                            disabled
                                            errors={errors}
                                        />
                                    </Col>
                                    <Col md={4}>
                                        <FormInput
                                            label="Longitude"
                                            name="Longitude"
                                            control={control}
                                            disabled
                                            errors={errors}
                                        />
                                    </Col>
                                    <Col md={4}>
                                        <FormInput
                                            label="OTC"
                                            name="otc"
                                            control={control}
                                            rules={{ required: 'OTC is required' }}
                                            errors={errors}
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={4}>
                                        <FormInput
                                            label="MRC"
                                            name="mrc"
                                            control={control}
                                            rules={{ required: 'MRC is required' }}
                                            errors={errors}
                                        />
                                    </Col>
                                </Row>
                                <div className="pull-right">
                                    <Button color="primary" className="mr-2" onClick={handleCustomSubmit}>
                                        Submit
                                    </Button>&nbsp;
                                    <Button color="primary" outline onClick={() => setShowBuildingDetails(false)}>
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

export default BuildingModalDetails;