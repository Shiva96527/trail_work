import { Button, Card, CardBody, Col, FormGroup, Input, Label, Modal, ModalBody, ModalHeader, Row } from "reactstrap";
import { updateGroupMappingHTTP } from "../../../../services/srf-service";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import FormInput from "../../../../components/form-input";
import FormDropdown from "../../../../components/form-dropdown";
import { useEffect } from "react";
import Swal from "sweetalert2";
const groupName = {
    Gatekeeper: {
        Yes: 'GK_'
    },
    HldGroup: {
        Yes: 'HLD_'
    }
}
const SRFGroupDetailsModal = ({ isOpen, selectedGroup, onClose }) => {
    const {
        control,
        handleSubmit,
        formState: { errors },
        watch,
        setValue
    } = useForm({
        defaultValues: {
            GroupName: selectedGroup?.GroupName || '',
            Gatekeeper: selectedGroup?.GateKeeper || '',
            ReviewHLDandCloseSRFGroups: selectedGroup?.ReviewHLDandCloseSRFGroups || '',
            HldGroup: selectedGroup?.HLDGroup || 'No',
            SRFAssignment: selectedGroup?.SRFAssignment || '',
            // BizVertical: selectedGroup?.BizVertical && selectedGroup?.BizVertical?.split(',')?.map(m => { return { label: m, value: m } }) || [],
            //Region: selectedGroup?.Region && selectedGroup?.Region?.split(',')?.map(m => { return { label: m, value: m } }) || [],
            ManualSRFCreation: selectedGroup?.ManualSRFCreationAllowed || 'No',
            Version: 0,
            GroupID: selectedGroup?.GroupID || 0,
            originalGroupName: selectedGroup?.GroupName || ''
        }
    }
    );

    // Watch all form values
    const watchedValues = watch();
    const GatekeeperWatch = watch('Gatekeeper');
    const HldGroupWatch = watch('HldGroup');


    useEffect(() => {
        if (GatekeeperWatch) {
            if (groupName['Gatekeeper'][GatekeeperWatch]) {
                // setValue('GroupName', groupName['Gatekeeper'][GatekeeperWatch] + watchedValues.originalGroupName)
                setValue('GroupName', watchedValues.originalGroupName)
                setValue('ManualSRFCreation', 'No');
            }
        }
        if (HldGroupWatch) {
            if (groupName['HldGroup'][HldGroupWatch]) {
                // setValue('GroupName', groupName['HldGroup'][HldGroupWatch] + watchedValues.originalGroupName)
                setValue('GroupName', watchedValues.originalGroupName)
            }
        }
        if (!(watchedValues?.Gatekeeper === 'No' && watchedValues?.HldGroup === 'No')) {
            setValue('ManualSRFCreation', 'No');
        }
        if (!(watchedValues?.HldGroup === 'Yes' && watchedValues?.SRFAssignment === 'Region')) {
            setValue('Region', []);
        }
        if (!(watchedValues?.HldGroup === 'Yes' && watchedValues?.SRFAssignment === 'Biz Vertical')) {
            setValue('BizVertical', []);
        }
        if (watchedValues?.HldGroup !== 'Yes') {
            setValue('SRFAssignment', '');
        }
        /*eslint-disable-next-line*/
    }, [])

    const onSubmit = async (state) => {
        const payload = { ...state };
        payload['LoginUIId'] = sessionStorage.getItem('uiid');
        if (!selectedGroup) {
            payload['GroupID'] = 0;
            payload['Action'] = 'Add';
        } else {
            payload['GroupID'] = state.GroupID;
            payload['Action'] = 'Edit';
        }
        payload.BizVertical = payload?.BizVertical?.map(m => m.value)?.join(',') || '';
        payload.Region = payload?.Region?.map(m => m.value)?.join(',') || '';
        try {
            const { data: { statusCode, statusMessage } } = await updateGroupMappingHTTP(payload);
            if (statusCode === 200) {
                toast.success(statusMessage);
                onClose(false);
            } else {
                toast.error(statusMessage);
            }
        } catch (e) {
            toast.error('Something went wrong');
        }
    }

    const handleCustomSubmit = () => {
        handleSubmit((data) => {
            Swal.fire({
                title: `Are you sure to ${selectedGroup ? 'Update' : 'Submit'}?`,
                showDenyButton: true,
                showCancelButton: false,
                confirmButtonText: 'Yes',
                denyButtonText: 'No',
            }).then((result) => {
                if (result.isConfirmed) {
                    onSubmit(data);
                }
            })
        })();
    }

    return (
        <>
            <Modal size="xl" isOpen={isOpen} backdrop={true}>
                <ModalHeader>{`${selectedGroup ? 'Edit' : 'Add'} Group Details`}</ModalHeader>
                <ModalBody>
                    <Card className="card_outer_padding">
                        <CardBody>
                            <form>
                                <Row>
                                    <Col md={3}>
                                        <FormInput
                                            label="Group Name"
                                            name="GroupName"
                                            control={control}
                                            disabled={selectedGroup ? true : false}
                                            rules={{ required: 'Group name is required' }}
                                            errors={errors}
                                        />
                                    </Col>
                                    <Col md={3}>
                                        <FormDropdown
                                            label="Gatekeeper"
                                            name="Gatekeeper"
                                            control={control}
                                            errors={errors}
                                            data={['Yes', 'No']}
                                        />
                                    </Col>
                                    <Col md={3}>
                                        <FormDropdown
                                            label="Review HLD & Close SRF Groups"
                                            name="ReviewHLDandCloseSRFGroups"
                                            control={control}
                                            errors={errors}
                                            data={['Yes', 'No']}
                                        />
                                    </Col>
                                    <Col md={3}>
                                        <FormDropdown
                                            label="HLD Group"
                                            name="HldGroup"
                                            control={control}
                                            errors={errors}
                                            data={['Yes', 'No']}
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    {/* <Col md={3}>
                                        <FormMultiSelectDropdown
                                            label="Biz Vertical"
                                            name="BizVertical"
                                            control={control}
                                            disabled={!(watchedValues?.HldGroup === 'Yes' && watchedValues?.SRFAssignment === 'Biz Vertical')}
                                            errors={errors}
                                            data={srfDropdownOptions?.SRFDROPDOWNVALUES?.['SRF Biz Vertical']?.dropdownValue || []}
                                        />
                                    </Col>
                                    <Col md={3}>
                                        <FormMultiSelectDropdown
                                            label="Region"
                                            name="Region"
                                            control={control}
                                            disabled={!(watchedValues?.HldGroup === 'Yes' && watchedValues?.SRFAssignment === 'Region')}
                                            errors={errors}
                                            data={srfDropdownOptions?.SRFDROPDOWNVALUES?.['SRF Region']?.dropdownValue || []}
                                        />
                                    </Col> */}
                                    {/* <Col md={3}>
                                        <FormDropdown
                                            label="Manual SRF Creation Allowed"
                                            name="ManualSRFCreation"
                                            control={control}
                                            disabled={!(watchedValues?.Gatekeeper === 'No' && watchedValues?.HldGroup === 'No')}
                                            errors={errors}
                                            data={['Yes', 'No']}
                                        />
                                    </Col> */}
                                    <Col md={3}>
                                        <FormGroup>
                                            <Label for="Version">Version</Label>
                                            <Input
                                                id="Version"
                                                disabled
                                                value={selectedGroup?.GroupCatalogueVersion}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col md={3}>
                                        <FormDropdown
                                            label="SRF Assignment"
                                            name="SRFAssignment"
                                            control={control}
                                            errors={errors}
                                            disabled={watchedValues?.HldGroup !== 'Yes'}
                                            data={['Biz Vertical', 'Region', 'N/A']}
                                        />
                                    </Col>
                                </Row>
                                <hr />
                                {selectedGroup && <Row>
                                    <Col md={3}>
                                        <FormGroup>
                                            <Label for="CreatedBy">Created By</Label>
                                            <Input
                                                id="CreatedBy"
                                                disabled
                                                value={selectedGroup?.CreatedBy}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col md={3}>
                                        <FormGroup>
                                            <Label for="CreatedDate">Created Date</Label>
                                            <Input
                                                id="CreatedDate"
                                                disabled
                                                value={selectedGroup?.CreatedDate}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col md={3}>
                                        <FormGroup>
                                            <Label for="ModifiedBy">Modified By</Label>
                                            <Input
                                                id="ModifiedBy"
                                                disabled
                                                value={selectedGroup?.ModifiedBy}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col md={3}>
                                        <FormGroup>
                                            <Label for="ModifiedDate">Modified Date</Label>
                                            <Input
                                                id="ModifiedDate"
                                                disabled
                                                value={selectedGroup?.ModifiedDate}
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>}
                                <div className="pull-right">
                                    <Button color="primary" onClick={handleCustomSubmit}>{`${selectedGroup ? 'Update' : 'Submit'}`}</Button>&nbsp;
                                    <Button color="primary" outline onClick={() => onClose(false)}>Close</Button>
                                </div>
                            </form>
                        </CardBody>
                    </Card>
                </ModalBody>
            </Modal>
        </>
    )
}
export default SRFGroupDetailsModal;