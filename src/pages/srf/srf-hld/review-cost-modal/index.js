import { useEffect, useLayoutEffect, useState } from "react";
import { Button, Card, CardBody, Col, Modal, ModalBody, ModalHeader, Row } from "reactstrap";
import useDropdownFilter from "../../../../shared/hooks/dropdownFilterHook";
import { updateSrfWorkflowHTTP } from "../../../../services/srf-service";
import { toast } from "react-toastify";
import FormDropdown from "../../../../components/form-dropdown";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";

const ReviewCostModal = ({ state: routerState, isOpen, onClose, onSuccess, srfDetails, reviewCostData }) => {
    const { srfDropdownOptions } = useSelector(state => state?.globalSlice);
    const [getDropdownByType] = useDropdownFilter();
    const [dropdownOptions, setDropdownOptions] = useState({});
    const [showRegion, setShowRegion] = useState(false);
    const {
        control,
        handleSubmit,
        getValues,
        watch,
        formState: { errors },
    } = useForm()

    watch('MandatoryGroup');
    const serviceTypeWatch = watch('ServiceType');

    useEffect(() => {
        if (getValues('ServiceType')) {
            getGroupNames();
        }
        // eslint-disable-next-line
    }, [serviceTypeWatch])

    const getGroupNames = async () => {
        const groupOptions = await getDropdownByType({
            DropDownType: 'ReviewerAddGroup',
            Filter1: srfDetails?.SRFNumber,
            Filter2: getValues('ServiceType'),
            Filter3: routerState?.WorkflowId
        });
        groupOptions?.value?.forEach(d => {
            const values = d?.DropDownValue;
            const property = d?.DropDownType;
            if (values) {
                const options = (values?.split(','));
                setDropdownOptions({ ...dropdownOptions, [property]: options });
            }
        })
    }

    useLayoutEffect(() => {
        getDropdowns();
        if (reviewCostData?.findIndex(f => f.HLDGroup?.toLowerCase() === 'radio') !== -1) {
            setShowRegion(false);
        } else {
            setShowRegion(true);
        }
        /*eslint-disable-next-line*/
    }, [])

    const onSubmit = async () => {
        const payload = {
            Action: 'Reviewer HLD Group Assignment',
            IntegrationID: routerState?.IntegrationID,
            LoginUIID: sessionStorage.getItem('uiid'),
            Remarks: '',
            SRFNumber: routerState?.SRFNumber,
            SessionID: generateSessionId(),
            srfHLDGroupAssignmentRequest: getValues() ? [getValues()] : null,
            WorkflowId: routerState?.WorkflowId,
            GroupName: getValues('MandatoryGroup')
        }
        if (getValues('MandatoryGroup') !== 'Radio') {
            payload.srfHLDGroupAssignmentRequest.Region = '';
        }
        try {
            const { data: { statusCode, statusMessage } } = await updateSrfWorkflowHTTP(payload);
            if (statusCode === 200) {
                toast.success(statusMessage);
                onSuccess();
            }
            else
            {
                toast.warning(statusMessage);
            }
        } catch (e) {
            toast.error('Something went wrong');
        }
    }

    const getDropdowns = async () => {
        const options = await getDropdownByType({ DropDownType: 'SRF WorkFlow Catalogue DDL Values' });
        let tempDropdownOptions = {};
        options?.value?.forEach(d => {
            const values = d?.DropDownValue;
            const property = d?.DropDownType;
            if (values) {
                const options = (values?.split(','));
                tempDropdownOptions[property] = options;
            }
        })
        const serviceOptions = await getDropdownByType({ DropDownType: 'HLDGroupServiceType', Filter1: srfDetails?.SRFNumber, Filter2: srfDetails?.IntegrationID });
        serviceOptions?.value?.forEach(d => {
            const values = d?.DropDownValue;
            const property = d?.DropDownType;
            if (values) {
                const options = (values?.split(','));
                tempDropdownOptions[property] = options;
            }
        })
        setDropdownOptions(tempDropdownOptions);
    }



    const generateSessionId = () => {
        return (Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15));
    }

    return (
        <>
            <Modal size="lg" isOpen={isOpen} backdrop={true}>
                <ModalHeader>Add Group</ModalHeader>
                <ModalBody>
                    <Card className="card_outer_padding">
                        <CardBody>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <Row>
                                    <Col md={6}>
                                        <FormDropdown
                                            label="Service Type"
                                            name="ServiceType"
                                            control={control}
                                            errors={errors}
                                            rules={{ required: 'Service type is required' }}
                                            data={dropdownOptions['HLDGroupServiceType']}
                                        />
                                    </Col>
                                    <Col md={6}>
                                        <FormDropdown
                                            label="Group Name"
                                            name="MandatoryGroup"
                                            control={control}
                                            errors={errors}
                                            rules={{ required: 'Group Name is required' }}
                                            data={dropdownOptions?.['ReviewerAddGroup']}
                                        />
                                    </Col>
                                    {showRegion && getValues('MandatoryGroup') === 'Radio' ? <Col md={6}>
                                        <FormDropdown
                                            label="Region"
                                            name="Region"
                                            control={control}
                                            errors={errors}
                                            rules={{ required: 'Region is required' }}
                                            data={srfDropdownOptions?.SRFDROPDOWNVALUES?.['SRF Region']?.dropdownValue}
                                        />
                                    </Col> : null}
                                </Row>
                                <div className="pull-right">
                                    <Button color="primary" type="submit">Submit</Button>&nbsp;
                                    <Button color="primary" outline onClick={() => onClose(false)}>Back</Button>
                                </div>
                            </form>
                        </CardBody>
                    </Card>
                </ModalBody>
            </Modal>
        </>
    )
}

export default ReviewCostModal;