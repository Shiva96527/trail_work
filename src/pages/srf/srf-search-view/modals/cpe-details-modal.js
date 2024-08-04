import { useForm } from "react-hook-form";
import { Button, Card, CardBody, Col, Label, Modal, ModalBody, ModalHeader, Row } from "reactstrap";
import FormMultiSelectDropdown from "../../../../components/form-multiselect-dropdown";
import FormDropdown from "../../../../components/form-dropdown";
import FormInput from "../../../../components/form-input";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";

const CPEDetailsModal = (
    { isOpen,
        selectedCPEDetails,
        onClose,
        serviceTypeDataInfoHandler,
        isManualCreatorRole,
        disableForm,
        isChannel,
        isActionBtnEnableFlag,
        isEnableAddUpdateBtnFlag
    }) => {
    const { srfDropdownOptions } = useSelector(state => state?.globalSlice);
    const defaultValues = {
        CPEManagedServicesDevicesProposed: selectedCPEDetails?.CPEManagedServicesDevicesProposed?.split(',') || [],
        CPEInfo_Config_QoS_CoS_Requirement: selectedCPEDetails?.CPEInfo_Config_QoS_CoS_Requirement,
        ContractPeriod: selectedCPEDetails?.ContractPeriod,
        RouterData: selectedCPEDetails?.RouterData,
        RouterVoice: selectedCPEDetails?.RouterVoice,
        RouterOthers: selectedCPEDetails?.RouterOthers,
        RouterPublic: selectedCPEDetails?.RouterPublic,
        RouterPrivate: selectedCPEDetails?.RouterPrivate,
        RouterNoOfOpticalElectrical: selectedCPEDetails?.RouterNoOfOpticalElectrical,
        RouterSecurityFeatures: selectedCPEDetails?.RouterSecurityFeatures,
        FirewallThroughputMbps: selectedCPEDetails?.FirewallThroughputMbps,
        FirewallConnectionsPerSecond: selectedCPEDetails?.FirewallConnectionsPerSecond,
        FirewallFWSecurityFeatures: selectedCPEDetails?.FirewallFWSecurityFeatures,
        FirewallHighAvailabilityConfiguration: selectedCPEDetails?.FirewallHighAvailabilityConfiguration,
        FirewallVPNMbps: selectedCPEDetails?.FirewallVPNMbps,
        FirewallAAAIntegrationRequired: selectedCPEDetails?.FirewallAAAIntegrationRequired,
        WanOptimizerOptimizedApplications: selectedCPEDetails?.WanOptimizerOptimizedApplications,
        WanOptimizerMSCR: selectedCPEDetails?.WanOptimizerMSCR,
        WanOptimizerLANPortQuantity: selectedCPEDetails?.WanOptimizerLANPortQuantity,
        WanOptimizerWANPortQuantity: selectedCPEDetails?.WanOptimizerWANPortQuantity,
        WanOptimizerInlineConfigService: selectedCPEDetails?.WanOptimizerInlineConfigService,
        WanOptimizerOutofPathConfigService: selectedCPEDetails?.WanOptimizerOutofPathConfigService,
        LoadBalancerType: selectedCPEDetails?.LoadBalancerType,
        LoadBalancingMethods: selectedCPEDetails?.LoadBalancingMethods,
        LoadBalancerSessionsThroughputNumbers: selectedCPEDetails?.LoadBalancerSessionsThroughputNumbers,
        LanSwitchNoofPorts: selectedCPEDetails?.LanSwitchNoofPorts,
        LanSwitchPOE: selectedCPEDetails?.LanSwitchPOE,
        IAMThroughputMbps: selectedCPEDetails?.IAMThroughputMbps,
        IAMNoofUsers: selectedCPEDetails?.IAMNoofUsers
    };
    const {
        control,
        handleSubmit,
        getValues,
        watch,
        formState: { errors }
    } = useForm({
        defaultValues
    });

    watch('CPEManagedServicesDevicesProposed');

    const handleCustomSubmit = (isUpdate) => {
        handleSubmit((data) => {
            Swal.fire({
                title: `Are you sure to ${selectedCPEDetails ? 'update' : 'submit'}?`,
                showDenyButton: true,
                showCancelButton: false,
                confirmButtonText: 'Yes',
                denyButtonText: 'No',
            }).then((result) => {
                if (result.isConfirmed) {
                    const payload = { ...data };
                    payload.CPEManagedServicesDevicesProposed = payload?.CPEManagedServicesDevicesProposed?.join(',');
                    serviceTypeDataInfoHandler('CPE', payload, selectedCPEDetails, onClose, isUpdate ? true : false)
                }
            })
        })();
    }

    return (
        <>
            <Modal size="xl" isOpen={isOpen} backdrop={true} className="custom-modal">
                <ModalHeader toggle={onClose}>CPE Details</ModalHeader>
                <ModalBody>
                    <Card className="card_outer_padding">
                        <CardBody>
                            <form>
                                <fieldset disabled={(disableForm || !isManualCreatorRole || !isActionBtnEnableFlag || !isEnableAddUpdateBtnFlag) || isChannel === 'CPQ'}>
                                    <Row>
                                        <Col md={4}>
                                            <FormMultiSelectDropdown
                                                label="Managed Services Devices Proposed"
                                                name="CPEManagedServicesDevicesProposed"
                                                control={control}
                                                errors={errors}
                                                rules={{ required: 'MAnaged Services Devices Proposed is required' }}
                                                data={["Router", "Firewall", "Wan Optimizer", "Load Balancer", "Lan Switch", "Internet Access Manager"]}

                                            />
                                        </Col>
                                        <Col md={4}>
                                            <FormDropdown
                                                label="Configuration QoS/CoS requirement"
                                                name="CPEInfo_Config_QoS_CoS_Requirement"
                                                control={control}
                                                errors={errors}
                                                data={["DSCP", "Application-CIR", "NAT"]}

                                            />
                                        </Col>
                                        <Col md={4}>
                                            <FormInput
                                                label="Contract Period (Years)"
                                                name="ContractPeriod"
                                                type="number"
                                                control={control}
                                                errors={errors}
                                                rules={{ required: 'Contract Period(Years) is required' }}

                                            />
                                        </Col>
                                    </Row>
                                    {getValues('CPEManagedServicesDevicesProposed')?.includes('Router') ? <>
                                        <div className="srf-inner-title">
                                            Router
                                        </div>
                                        <Label><strong>Customer VLAN assignment (if any)</strong></Label>
                                        <Row>
                                            <Col md={4}>
                                                <FormInput
                                                    label="Data"
                                                    name="RouterData"
                                                    control={control}
                                                    errors={errors}

                                                />
                                            </Col>
                                            <Col md={4}>
                                                <FormInput
                                                    label="Voice"
                                                    name="RouterVoice"
                                                    control={control}
                                                    errors={errors}

                                                />
                                            </Col>
                                            <Col md={4}>
                                                <FormInput
                                                    label="Others(VLAN)"
                                                    name="RouterOthers"
                                                    control={control}
                                                    errors={errors}

                                                />
                                            </Col>
                                        </Row>
                                        <Label><strong>Customer LAN IP Address (if any)</strong></Label>
                                        <Row>
                                            <Col md={4}>
                                                <FormInput
                                                    label="Public"
                                                    name="RouterPublic"
                                                    control={control}
                                                    errors={errors}

                                                />
                                            </Col>
                                            <Col md={4}>
                                                <FormInput
                                                    label="Private"
                                                    name="RouterPrivate"
                                                    control={control}
                                                    errors={errors}

                                                />
                                            </Col>
                                        </Row>
                                        <Label><strong>Ports/interfaces types</strong></Label>
                                        <Row>
                                            <Col md={4}>
                                                <FormInput
                                                    label="No.of optical & electrical"
                                                    name="RouterNoOfOpticalElectrical"
                                                    control={control}
                                                    errors={errors}

                                                />
                                            </Col>
                                            <Col md={4}>
                                                <FormInput
                                                    label="Security Features"
                                                    name="RouterSecurityFeatures"
                                                    control={control}
                                                    errors={errors}

                                                />
                                            </Col>
                                        </Row>
                                    </> : null}
                                    {getValues('CPEManagedServicesDevicesProposed')?.includes('Firewall') ? <>
                                        <div className="srf-inner-title">
                                            Firewall
                                        </div>
                                        <Row>
                                            <Col md={4}>
                                                <FormInput
                                                    label="Throughput (Mbps)"
                                                    name="FirewallThroughputMbps"
                                                    control={control}
                                                    errors={errors}

                                                />
                                            </Col>
                                            <Col md={4}>
                                                <FormInput
                                                    label="Connections Per Second"
                                                    name="FirewallConnectionsPerSecond"
                                                    control={control}
                                                    errors={errors}

                                                />
                                            </Col>
                                            <Col md={4}>
                                                <FormInput
                                                    label="FW Security Features"
                                                    name="FirewallFWSecurityFeatures"
                                                    control={control}
                                                    errors={errors}

                                                />
                                            </Col>
                                            <Col md={4}>
                                                <FormInput
                                                    label="High Availability (HA) configuration"
                                                    name="FirewallHighAvailabilityConfiguration"
                                                    control={control}
                                                    errors={errors}

                                                />
                                            </Col>
                                            <Col md={4}>
                                                <FormInput
                                                    label="VPN expected throughput (Mbps)"
                                                    name="FirewallVPNMbps"
                                                    control={control}
                                                    errors={errors}

                                                />
                                            </Col>
                                            <Col md={4}>
                                                <FormInput
                                                    label="AAA integration required?"
                                                    name="FirewallAAAIntegrationRequired"
                                                    control={control}
                                                    errors={errors}

                                                />
                                            </Col>
                                        </Row>
                                    </> : null}
                                    {getValues('CPEManagedServicesDevicesProposed')?.includes('Wan Optimizer') ? <>
                                        <div className="srf-inner-title">
                                            WAN Optimizer
                                        </div>
                                        <Row>
                                            <Col md={4}>
                                                <FormDropdown
                                                    label="Optimized Applications"
                                                    name="WanOptimizerOptimizedApplications"
                                                    control={control}
                                                    errors={errors}
                                                    data={srfDropdownOptions?.SRFDROPDOWNVALUES?.['SRF WAN Optimized']?.dropdownValue}

                                                />
                                            </Col>
                                            <Col md={4}>
                                                <FormInput
                                                    label="Max Simultaneous Connections Resiliency"
                                                    name="WanOptimizerMSCR"
                                                    control={control}
                                                    errors={errors}

                                                />
                                            </Col>
                                            <Col md={4}>
                                                <FormInput
                                                    label="LAN Port Quantity"
                                                    name="WanOptimizerLANPortQuantity"
                                                    control={control}
                                                    errors={errors}

                                                />
                                            </Col>
                                            <Col md={4}>
                                                <FormInput
                                                    label="WAN Port Quantity"
                                                    name="WanOptimizerWANPortQuantity"
                                                    control={control}
                                                    errors={errors}

                                                />
                                            </Col>
                                            <Col md={4}>
                                                <FormInput
                                                    label="In-line config/service"
                                                    name="WanOptimizerInlineConfigService"
                                                    control={control}
                                                    errors={errors}

                                                />
                                            </Col>
                                            <Col md={4}>
                                                <FormInput
                                                    label="Out of Path config/service"
                                                    name="WanOptimizerOutofPathConfigService"
                                                    control={control}
                                                    errors={errors}

                                                />
                                            </Col>
                                        </Row>
                                    </> : null}
                                    {getValues('CPEManagedServicesDevicesProposed')?.includes('Load Balancer') ? <>
                                        <div className="srf-inner-title">
                                            Load Balancer
                                        </div>
                                        <Row>
                                            <Col md={4}>
                                                <FormDropdown
                                                    label="Type"
                                                    name="LoadBalancerType"
                                                    control={control}
                                                    errors={errors}
                                                    data={srfDropdownOptions?.SRFDROPDOWNVALUES?.['SRF Load Balancer Type']?.dropdownValue}

                                                />
                                            </Col>
                                            <Col md={4}>
                                                <FormDropdown
                                                    label="Load Balancing Methods"
                                                    name="LoadBalancingMethods"
                                                    control={control}
                                                    errors={errors}
                                                    data={srfDropdownOptions?.SRFDROPDOWNVALUES?.['SRF Load Balancing Method']?.dropdownValue}

                                                />
                                            </Col>
                                            <Col md={4}>
                                                <FormInput
                                                    label="Sessions / Throughput Numbers"
                                                    name="LoadBalancerSessionsThroughputNumbers"
                                                    control={control}
                                                    errors={errors}

                                                />
                                            </Col>
                                        </Row>
                                    </> : null}
                                    {getValues('CPEManagedServicesDevicesProposed')?.includes('Lan Switch') ? <>
                                        <div className="srf-inner-title">
                                            LAN Switch
                                        </div>
                                        <Row>
                                            <Col md={4}>
                                                <FormInput
                                                    label="No. of Ports"
                                                    name="LanSwitchNoofPorts"
                                                    control={control}
                                                    errors={errors}

                                                />
                                            </Col>
                                            <Col md={4}>
                                                <FormDropdown
                                                    label="POE"
                                                    name="LanSwitchPOE"
                                                    control={control}
                                                    errors={errors}

                                                    data={["YES", "NO"]}
                                                />
                                            </Col>
                                        </Row>
                                    </> : null}
                                    {getValues('CPEManagedServicesDevicesProposed')?.includes('Internet Access Manager') ? <>
                                        <div className="srf-inner-title">
                                            Internet Access Manager
                                        </div>
                                        <Row>
                                            <Col md={4}>
                                                <FormInput
                                                    label="Throughput(mbps)"
                                                    name="IAMThroughputMbps"
                                                    control={control}
                                                    errors={errors}

                                                />
                                            </Col>
                                            <Col md={4}>
                                                <FormInput
                                                    label="No. of Users"
                                                    name="IAMNoofUsers"
                                                    control={control}
                                                    errors={errors}

                                                />
                                            </Col>
                                        </Row>
                                    </> : null}
                                </fieldset>
                            </form>
                            <div className="pull-right">
                                {((isChannel === "Neptune" && isManualCreatorRole && isActionBtnEnableFlag && isEnableAddUpdateBtnFlag) && !disableForm) && <Button color="primary" onClick={() => handleCustomSubmit(selectedCPEDetails?.LineItemId ? true : false)}>{selectedCPEDetails?.LineItemId ? 'Update' : 'Submit'}</Button>}&nbsp;
                                <Button color="primary" outline onClick={onClose}>Back</Button>
                            </div>
                        </CardBody>
                    </Card>
                </ModalBody>
            </Modal>
        </>
    )
}
export default CPEDetailsModal;