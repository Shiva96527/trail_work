import React from "react";
import { Button, Card, CardBody, Col, Modal, ModalBody, ModalHeader, Row } from "reactstrap";
import { toast } from "react-toastify";
import { deleteDropdownHTTP, updateDropdownHTTP } from "../../../../services/global-service";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import FormInput from "../../../../components/form-input";
import FormMultiSelectDropdown from "../../../../components/form-multiselect-dropdown";

const AddDropdownConfigModal = ({ isOpen, selectedDropdown, title, onOk, onCancel }) => {
    const defaultValues = {
        DropDownType: selectedDropdown?.DropDownType || '',
        DropDownValue: selectedDropdown?.DropDownValue?.split(',') || [],
        InActiveValue: selectedDropdown?.InActiveValue || ''
    }
    const {
        control,
        handleSubmit,
        formState: { errors },
        getValues,
        setValue
    } = useForm({
        defaultValues
    })

    const handleCustomSubmit = () => {
        handleSubmit((data) => onSubmit(data))();
    }

    const onSubmit = async () => {
        const payload = { ...getValues() };
        if (typeof (payload?.DropDownValue) !== 'string') {
            payload.DropDownValue = payload?.DropDownValue?.join(',');
        }
        payload['Action'] = selectedDropdown ? 'Update' : 'Insert';
        payload['LoginUIID'] = sessionStorage.getItem('uiid');
        if (selectedDropdown) {
            payload['DDId'] = selectedDropdown?.DDId;
        }
        try {
            const { data: { data: resultData, statusCode, statusMessage } } = await updateDropdownHTTP(payload)
            if (statusCode === 200 && resultData) {
                toast.success(`Dropdown ${selectedDropdown ? 'updated' : 'added'} successfully`);
            } else {
                toast.error(statusMessage);
            }
        } catch (e) {
            toast.error("System error.");
        } finally {
            onOk();
        }
    }

    const confirmDelete = async () => {
        Swal.fire({
            title: 'Are you sure to Delete?',
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: 'Yes',
            denyButtonText: 'No',
        }).then((result) => {
            if (result.isConfirmed) {
                handleDelete();
            }
        })
    }

    const handleDelete = async () => {
        const payload = { DDId: selectedDropdown?.DDId, Action: 'Delete', DropDownType: selectedDropdown?.DropDownType, LoginUIID: sessionStorage.getItem('uiid') };
        try {
            const { data: { data: resultData, statusCode, statusMessage } } = await deleteDropdownHTTP(payload)
            if (statusCode === 200 && resultData) {
                toast.success('Dropdown deleted successfully');
            } else {
                toast.error(statusMessage);
            }
        } catch (e) {
            toast.error("System error.");
        } finally {
            onOk();
        }
    }

    const handleCreate = (name) => {
        if (!name) return;
        setValue('DropDownValue', [...getValues('DropDownValue'), name]);
    }

    return (
        <div>
            <Modal size="lg" isOpen={isOpen} backdrop={true}>
                <ModalHeader>{title}</ModalHeader>
                <ModalBody>
                    <Card className="card_outer_padding">
                        <CardBody>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <Row>
                                    <Col md={12}>
                                        <FormInput
                                            label="DropDown Type"
                                            name="DropDownType"
                                            control={control}
                                            placeholder="DD Name"
                                            rules={{ required: 'Dropdown Type is required' }}
                                            errors={errors}
                                        />
                                    </Col>
                                    <Col md={12}>
                                        {selectedDropdown ? <FormMultiSelectDropdown
                                            label="Values"
                                            allowCreate
                                            createOption="Create Dropdown Value"
                                            name="DropDownValue"
                                            control={control}
                                            errors={errors}
                                            onCreate={handleCreate}
                                            rules={{ required: 'Values are required' }}
                                        /> : <FormInput
                                            label="Values"
                                            name="DropDownValue"
                                            control={control}
                                            placeholder="comma separated values"
                                            rules={{ required: 'Values are required' }}
                                            errors={errors}
                                        />}
                                    </Col>
                                    <Col md={12}>
                                        <FormInput
                                            label="InActive Values"
                                            name="InActiveValue"
                                            control={control}
                                            errors={errors}
                                            placeholder="comma separated values"
                                        />
                                    </Col>
                                </Row>
                                <div className="pull-right">
                                    <Button color="primary" className="mr-2" onClick={handleCustomSubmit}>
                                        {selectedDropdown ? 'Update' : 'Save'}
                                    </Button>&nbsp;&nbsp;
                                    <Button color="primary" onClick={onCancel}>
                                        Cancel
                                    </Button>&nbsp;&nbsp;
                                    {selectedDropdown ? <Button color="danger" onClick={confirmDelete}>
                                        Delete
                                    </Button> : null}
                                </div>
                            </form>
                        </CardBody>
                    </Card>
                </ModalBody>
            </Modal>
        </div>
    );
};

export default AddDropdownConfigModal;
