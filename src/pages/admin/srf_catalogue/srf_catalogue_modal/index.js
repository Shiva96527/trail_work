import { useLayoutEffect, useState } from "react";
import { Button, Card, CardBody, Col, Modal, ModalBody, ModalHeader, Row } from "reactstrap";
import useDropdownFilter from "../../../../shared/hooks/dropdownFilterHook";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import ReactTooltip from "react-tooltip";
import { useForm } from "react-hook-form";
import FormDropdown from "../../../../components/form-dropdown";
import FormMultiSelectDropdown from "../../../../components/form-multiselect-dropdown";
import { updateSrfFormHTTP } from "../../../../services/srf-catalogue-service";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const SrfCatalogueModal = ({ isOpen, selectedCatalogue, handleCatalogueModal, getAllCatalogues }) => {
    const [getDropdownByType] = useDropdownFilter();
    const [dropdownOptions, setDropdownOptions] = useState({});
    const {
        control,
        handleSubmit,
        getValues,
        watch,
        formState: { errors }
    } = useForm({
        defaultValues: {
            Platform: selectedCatalogue?.Platform || '',
            ServiceType: selectedCatalogue?.ServiceType || '',
            GateKeeperGroups: selectedCatalogue?.GateKeeperGroups || '',
            ProviderType: selectedCatalogue?.ProviderType || '',
            HLDGroups: selectedCatalogue?.HLDGroups?.replace(/\s/g, '') ? selectedCatalogue?.HLDGroups?.split(',') : [],
            HLDOptionalGroups: selectedCatalogue?.HLDOptionalGroups?.replace(/\s/g, '') ? selectedCatalogue?.HLDOptionalGroups?.split(',') : [],
            ReviewHLDandCloseSRFGroups: selectedCatalogue?.ReviewHLDandCloseSRFGroups || ''
        }
    }
    );
    const [tooltipContent, setTooltipContent] = useState('');
    watch('HLDOptionalGroups');
    watch('HLDGroups');

    useLayoutEffect(() => {
        getDropdowns();
        /*eslint-disable-next-line*/
    }, [])

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
        setDropdownOptions(tempDropdownOptions);
    }

    const updateTooltipContent = (content) => {
        setTooltipContent(content);
    };

    const onSubmit = async (state) => {
        const payload = { ...state };
        payload['LoginUIID'] = sessionStorage.getItem('uiid');
        payload.HLDGroups = payload?.HLDGroups.join(',');
        payload.HLDOptionalGroups = payload?.HLDOptionalGroups.join(',');
        payload['Action'] = 'Add';
        payload['CatalogueID'] = 0;
        if (selectedCatalogue) {
            payload['CatalogueID'] = selectedCatalogue?.CatalogueID;
            payload['Action'] = 'Edit';
        }
        try {
            const { data: { statusCode, statusMessage } } = await updateSrfFormHTTP(payload);
            if (statusCode === 200) {
                toast.success(statusMessage);
                handleCatalogueModal(false);
                getAllCatalogues(true);
            } else {
                toast.error(statusMessage);
            }
        } catch (e) {
            toast.error('Something went wrong')
        }
    }

    const handleCustomSubmit = () => {
        handleSubmit((data) => {
            Swal.fire({
                title: `Are you sure to ${selectedCatalogue ? 'Update' : 'Submit'}?`,
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
                <ModalHeader>SRF Service Type Workflow Catalogue</ModalHeader>
                <ModalBody>
                    <Card className="card_outer_padding">
                        <CardBody>
                            <div className="app-inner-layout__wrapper">
                                <fieldset disabled={selectedCatalogue?.CatalogueStatus === 'Inactive'}>
                                    <form>
                                        <Row>
                                            <Col md={4}>
                                                <FormDropdown
                                                    label="SRF Channel (SRF Creation)"
                                                    name="Platform"
                                                    control={control}
                                                    errors={errors}
                                                    disabled={selectedCatalogue!==null}
                                                    rules={{ required: 'Please select SRF Channel' }}
                                                    data={['CPQ', 'Manual']}
                                                />
                                            </Col>
                                            <Col md={4}>
                                                <FormDropdown
                                                    label="Service Type"
                                                    name="ServiceType"
                                                    control={control}
                                                    errors={errors}
                                                    rules={{ required: 'Please select Service Type' }}
                                                    data={dropdownOptions?.['SRF Service Type']}
                                                />
                                            </Col>
                                            <Col md={4}>
                                                <FormDropdown
                                                    label={
                                                        <>
                                                            <FontAwesomeIcon
                                                                data-tip={tooltipContent}
                                                                data-for="registerTip"
                                                                color="#0d6efd"
                                                                onMouseEnter={() => updateTooltipContent('This Gatekeeper group will view SRF in Groupbox and perform these actions . Assign to me, Reject to CPQ,  MPN Technical  Parameters Update, Select HLD Groups, Approve')}
                                                                onMouseLeave={() => updateTooltipContent('')}
                                                                className="font-awesome"
                                                                icon={faInfoCircle} />Gatekeeper
                                                        </>
                                                    }
                                                    name="GateKeeperGroups"
                                                    control={control}
                                                    errors={errors}
                                                    rules={{ required: 'Please select Gatekeeper' }}
                                                    data={dropdownOptions?.['SRF Gate Keeper']}
                                                />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={4}>
                                                <FormMultiSelectDropdown
                                                    label={
                                                        <>
                                                            <FontAwesomeIcon color="#0d6efd" data-tip={tooltipContent} data-for="registerTip"
                                                                onMouseEnter={() => updateTooltipContent('The HLD Groups allowed to Submit the Cost for review , Update as Not involved in submitted SRF but not allowed to Reject to CPQ.')}
                                                                onMouseLeave={() => updateTooltipContent('')}
                                                                className="font-awesome" icon={faInfoCircle} />HLD Mandatory Groups
                                                        </>
                                                    }
                                                    name="HLDGroups"
                                                    control={control}
                                                    errors={errors}
                                                    rules={{ required: 'Please select HLD Groups' }}
                                                    data={dropdownOptions?.['SRF HLD Group']?.filter(f => getValues('HLDOptionalGroups')?.indexOf(f) === -1) || []}
                                                />
                                            </Col>
                                            <Col md={4}>
                                                <FormMultiSelectDropdown
                                                    label={
                                                        <>
                                                            <FontAwesomeIcon color="#0d6efd" data-tip={tooltipContent} data-for="registerTip"
                                                                onMouseEnter={() => updateTooltipContent('The HLD Groups allowed to Submit the Cost for review , Update as Not involved in submitted SRF but not allowed to Reject to CPQ.')}
                                                                onMouseLeave={() => updateTooltipContent('')}
                                                                className="font-awesome" icon={faInfoCircle} />HLD Optional Groups
                                                        </>
                                                    }
                                                    name="HLDOptionalGroups"
                                                    control={control}
                                                    errors={errors}
                                                    data={dropdownOptions?.['SRF HLD Optional Group']?.filter(f => getValues('HLDGroups')?.indexOf(f) === -1) || []}
                                                />
                                            </Col>
                                            <Col md={4}>
                                                <FormDropdown
                                                    label={
                                                        <>
                                                            <FontAwesomeIcon color="#0d6efd" data-tip={tooltipContent} data-for="registerTip"
                                                                onMouseEnter={() => updateTooltipContent('The Review HLD & Close SRF Group perform these actions , Reroute to HLD Groups for HLD amendment , Remove HLD groups,  Add additional HLD groups and Close the SRF')}
                                                                onMouseLeave={() => updateTooltipContent('')}
                                                                className="font-awesome" icon={faInfoCircle} />Review HLD & Close SRF Groups
                                                        </>
                                                    }
                                                    name="ReviewHLDandCloseSRFGroups"
                                                    control={control}
                                                    errors={errors}
                                                    rules={{ required: 'Review HLD & Close SRF Groups is required' }}
                                                    data={dropdownOptions?.['SRF Gate Keeper'] || []}
                                                />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={3}>
                                                <FormDropdown
                                                    label={
                                                        <>
                                                            <FontAwesomeIcon data-tip={tooltipContent} color="#0d6efd" data-for="registerTip"
                                                                onMouseEnter={() => updateTooltipContent('This provider type applicable for Monaco project.')}
                                                                onMouseLeave={() => updateTooltipContent('')}
                                                                className="font-awesome" icon={faInfoCircle} />Provider Type (Monaco Project)
                                                        </>
                                                    }
                                                    name="ProviderType"
                                                    control={control}
                                                    errors={errors}
                                                    data={dropdownOptions?.['SRF Provider Type']}
                                                />
                                            </Col>
                                        </Row>
                                        <hr />
                                        <div className="pull-right">
                                            {selectedCatalogue?.CatalogueStatus !== 'Inactive' ? <Button color="primary" onClick={handleCustomSubmit}>
                                                {selectedCatalogue ? 'Update' : 'Submit'}
                                            </Button> : null}&nbsp;
                                            <Button color="primary" outline onClick={() => handleCatalogueModal(false)}>
                                                Close
                                            </Button>
                                        </div>
                                    </form>
                                </fieldset>
                            </div>
                        </CardBody>
                        <Col md={4}>
                            <ReactTooltip id="registerTip" className="custom-tooltip" place="top" effect="solid" getContent={() => tooltipContent} />
                        </Col>
                    </Card>
                </ModalBody>
            </Modal >
        </>
    )
}

export default SrfCatalogueModal;