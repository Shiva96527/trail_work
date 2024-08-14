import { Card, CardBody, Modal, ModalBody, ModalHeader, Button, Col, Row } from "reactstrap";
import { useForm } from "react-hook-form";
import FormDropdown from "../../../../components/form-dropdown";
import FormInput from "../../../../components/form-input";
import FormInputFile from "../../../../components/form-input-file";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import useFileUpload from "../../../../shared/hooks/file-upload-hook";
import { useSelector } from "react-redux";
import FormMultiSelectDropdown from "../../../../components/form-multiselect-dropdown";
import Swal from "sweetalert2";
import { useState } from "react";

const getFileName = {
    DIA: 'DiaFileUpload',
    DPLC: 'DplcFileUpload',
    MPLS: 'MplsFileUpload',
    IPLC: "IplcFileUpload"
}

const moduleNames = {
    DIA: 'SRFDIA',
    DPLC: 'SRFDPLC',
    MPLS: 'SRFMPLS',
    IPLC: "SRFIPLC"
}


const ServiceTypeDetailsModal = (
    {
        isOpen,
        isActionBtnEnableFlag,
        isEnableAddUpdateBtnFlag,
        serviceTypeDataInfoHandler,
        ismpnService,
        selectedServiceType,
        onClose,
        panelName,
        attachments,
        IntegrationID,
        isChannel,
        disableForm,
        reloadPage,
        isManualCreatorRole,
        WorkflowId
    }) => {
    const { srfDropdownOptions } = useSelector(state => state?.globalSlice);
    const { upload, viewFile, deleteFile } = useFileUpload();
    const [hasNewFile, setHasNewFile] = useState(false);
    const defaultValues = {
        LineItemId: selectedServiceType?.LineItemId || '',
        ContractPeriod: selectedServiceType?.ContractPeriod || '',
        BGP: selectedServiceType?.BGP || '',
        Redundancy: selectedServiceType?.Redundancy || '',
        InfraRedundancy: selectedServiceType?.InfraRedundancy || '',
        RedundantPowerSupply: selectedServiceType?.RedundantPowerSupply || '',
        CPEInfo_Config_QoS_CoS_Requirement: selectedServiceType?.CPEInfo_Config_QoS_CoS_Requirement || '',
        PowerSupply: selectedServiceType?.PowerSupply || '',
        ClientFiberHandOff: selectedServiceType?.ClientFiberHandOff || '',
        WANIP: selectedServiceType?.WANIP || '',
        NoOfIP: selectedServiceType?.NoOfIP || '',
        AutoNego: selectedServiceType?.AutoNego || '',
        MTUSize: selectedServiceType?.MTUSize || '',
        DuplexSetting: selectedServiceType?.DuplexSetting || '',
        QoSCoSRequirement: selectedServiceType?.QoSCoSRequirement || '',
        TCPUDPRange: selectedServiceType?.TCPUDPRange || '',
        CPE: selectedServiceType?.CPE || '',
        DDOS: selectedServiceType?.DDOS || '',
        InfraResiliencyRequirement: selectedServiceType?.InfraResiliencyRequirement || '',
        SLASLG: selectedServiceType?.SLASLG || '',
        CustomerDeviceMaxis: selectedServiceType?.CustomerDeviceMaxis || '',
        DIATrafficProfiling: selectedServiceType?.DIATrafficProfiling ? selectedServiceType.DIATrafficProfiling.split(',') : [],
        DIATransitTrafficProfiling: selectedServiceType?.DIATransitTrafficProfiling || '',
        DIAPeeringTrafficProfiling: selectedServiceType?.DIAPeeringTrafficProfiling || '',
        DIACDNTrafficProfiling: selectedServiceType?.DIACDNTrafficProfiling || '',
        DIAIP: selectedServiceType?.DIAIP || '',
        DIAIPV4: selectedServiceType?.DIAIPV4 || '',
        DIAIPV6: selectedServiceType?.DIAIPV6 || '',
        DIAInternetRouting: selectedServiceType?.DIAInternetRouting || '',
        MPNType: selectedServiceType?.MPNType || '',
        MPNID: selectedServiceType?.MPNID || '',
        [getFileName[panelName]]: attachments[getFileName[panelName]] || null,
        fileDeleted: false
    }
    const {
        control,
        handleSubmit,
        getValues,
        setValue,
        watch,
        formState: { errors }
    } = useForm({
        defaultValues
    });

    watch('Redundancy');
    watch('DIATrafficProfiling');
    watch('DIAIP');
    watch(getFileName[panelName]);
    const disableFormCondition = (disableForm || !isManualCreatorRole || !isActionBtnEnableFlag || !isEnableAddUpdateBtnFlag) || isChannel === 'CPQ';

    const handleCustomSubmit = async (isUpdate) => {
        handleSubmit((data) => {
            Swal.fire({
                title: `Are you sure to ${selectedServiceType ? 'update' : 'submit'}?`,
                showDenyButton: true,
                showCancelButton: false,
                confirmButtonText: 'Yes',
                denyButtonText: 'No',
            }).then(async (result) => {
                if (result.isConfirmed) {
                    if (getValues('fileDeleted')) {
                        await deleteFile(getFileName[panelName], attachments[getFileName[panelName]]?.AID, () => null);
                        setValue('fileDeleted', false);
                    }
                    if (getValues([getFileName[panelName]]) && !getValues('fileDeleted') && hasNewFile) {
                        await upload({ target: { files: getValues([getFileName[panelName]]) } }, getFileName[panelName], getFileName[panelName], IntegrationID, () => null, WorkflowId, moduleNames[panelName]);
                        setValue('fileDeleted', false);
                    }
                    const tempPayload = { ...data };
                    tempPayload.DIATrafficProfiling = tempPayload.DIATrafficProfiling?.join(',');
                    serviceTypeDataInfoHandler(panelName, tempPayload, selectedServiceType, onClose, isUpdate ? true : false);
                }
            })
        })();
    }

    let isRedundancy = false;
    if (panelName === 'DIA') {
        if (getValues('Redundancy') === 'No Redundancy' || getValues('Redundancy') === '') {
            isRedundancy = true;
        }
    }

    const handleDeleteFile = () => {
        if (disableFormCondition) return;
        setValue(getFileName[panelName], '');
        setValue('fileDeleted', true);
    }

    return (
        <>
            <Modal size="xl" isOpen={isOpen} backdrop={true}>
                <ModalHeader toggle={() => onClose(false)}>{`${panelName} Details`}</ModalHeader>
                <ModalBody>
                    <Card className="card_outer_padding">
                        <CardBody>
                            <form>
                                <Row>
                                    <Col md={3}>
                                        <FormInput
                                            label='Line Item ID'
                                            name='LineItemId'
                                            type="text"
                                            control={control}
                                            errors={errors}
                                            disabled
                                            placeholder="**Auto-Generated**"
                                        />
                                    </Col>
                                    <Col md={3}>
                                        {(!attachments[getFileName[panelName]] || getValues('fileDeleted')) ? <FormInputFile
                                            label="Data File Upload"
                                            name={getFileName[panelName]}
                                            type="file"
                                            control={control}
                                            errors={errors}
                                            onChange={(e) => {
                                                if (e.target.files[0]) {
                                                    setHasNewFile(true);
                                                } else {
                                                    setHasNewFile(false);
                                                }
                                            }}
                                        />
                                            :
                                            <><span className="link-style" onClick={() => viewFile(getValues(getFileName[panelName]))}>{getValues(getFileName[panelName])?.FileName}</span>
                                                {!disableFormCondition && <FontAwesomeIcon icon={faTrash} color="red" onClick={handleDeleteFile} fontSize={'12px'} cursor={'pointer'} />}</>}
                                    </Col>
                                    {ismpnService && <>
                                        <Col md={3}>
                                            <FormInput
                                                label="MPN ID"
                                                name="MPNID"
                                                type="text"
                                                control={control}
                                                errors={errors}
                                                disabled
                                            />
                                        </Col>
                                        <Col md={3}>
                                            <FormInput
                                                label="MPN Link Type"
                                                name="MPNType"
                                                type="text"
                                                control={control}
                                                errors={errors}
                                                disabled
                                            />
                                        </Col>
                                    </>}
                                </Row>
                                <hr />
                                <fieldset disabled={disableFormCondition}>
                                    <Row>
                                        <Col md={3}>
                                            <FormInput
                                                label='Contract Period'
                                                name='ContractPeriod'
                                                type="number"
                                                control={control}
                                                errors={errors}
                                                rules={{ required: 'Contract Period is required' }}
                                            />
                                        </Col>
                                        <Col md={3}>
                                            <FormDropdown
                                                label='BGP'
                                                name='BGP'
                                                control={control}
                                                errors={errors}
                                                data={['No', 'YES']}
                                            />
                                        </Col>
                                        <Col md={3}>
                                            <FormDropdown
                                                label='Redundancy'
                                                name='Redundancy'
                                                control={control}
                                                errors={errors}
                                                rules={{ required: "Redundancy is required" }}
                                                data={srfDropdownOptions?.SRFDROPDOWNVALUES?.['SRF Data Redundancy']?.dropdownValue}
                                            />
                                        </Col>
                                        <Col md={3}>
                                            <FormDropdown
                                                label='Infra Redundancy'
                                                name='InfraRedundancy'
                                                control={control}
                                                errors={errors}
                                                disabled={isRedundancy}
                                                data={srfDropdownOptions?.SRFDROPDOWNVALUES?.['SRF Infra Redundancy']?.dropdownValue}
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={3}>
                                            <FormDropdown
                                                label='Redundant Power supply'
                                                name='RedundantPowerSupply'
                                                control={control}
                                                errors={errors}
                                                data={["NO", "YES"]}
                                            />
                                        </Col>
                                        <Col md={3}>
                                            <FormDropdown
                                                label='Power Supply Type'
                                                name='PowerSupply'
                                                control={control}
                                                errors={errors}
                                                data={["NO", "YES"]}
                                            />
                                        </Col>
                                        <Col md={3}>
                                            <FormDropdown
                                                label='Client Fiber hand-off'
                                                name='ClientFiberHandOff'
                                                control={control}
                                                errors={errors}
                                                data={srfDropdownOptions?.SRFDROPDOWNVALUES?.['SRF Client Fiber']?.dropdownValue}
                                            />
                                        </Col>
                                        <Col md={3}>
                                            <FormDropdown
                                                label='WAN IP'
                                                name='WANIP'
                                                control={control}
                                                errors={errors}
                                                data={["IPV4", "IPV6"]}
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={3}>
                                            <FormInput
                                                label='No.of IP'
                                                name='NoOfIP'
                                                type="number"
                                                control={control}
                                                errors={errors}
                                            />
                                        </Col>
                                        <Col md={3}>
                                            <FormDropdown
                                                label='Auto Nego'
                                                name='AutoNego'
                                                control={control}
                                                errors={errors}
                                                data={["NO", "YES"]}
                                            />
                                        </Col>
                                        <Col md={3}>
                                            <FormInput
                                                label='MTU Size'
                                                name='MTUSize'
                                                type="text"
                                                control={control}
                                                errors={errors}
                                            />
                                        </Col>
                                        <Col md={3}>
                                            <FormDropdown
                                                label='Duplex Setting'
                                                name='DuplexSetting'
                                                control={control}
                                                errors={errors}
                                                data={["Half Duplex", "Full Duplex"]}
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={3}>
                                            <FormDropdown
                                                label='Configuration QoS/CoS requirement'
                                                name='CPEInfo_Config_QoS_CoS_Requirement'
                                                control={control}
                                                errors={errors}
                                                data={srfDropdownOptions?.SRFDROPDOWNVALUES?.['SRF QoSCoS Requirement']?.dropdownValue}
                                            />
                                        </Col>
                                        <Col md={4}>
                                            <FormInput
                                                label='TCP/UDP ranges to be supported'
                                                name='TCPUDPRange'
                                                type="textarea"
                                                rows={3}
                                                control={control}
                                                errors={errors}
                                            />
                                        </Col>
                                        <Col md={4}>
                                            <FormInput
                                                label='CPE'
                                                name='CPE'
                                                type="textarea"
                                                rows={3}
                                                control={control}
                                                errors={errors}
                                            />
                                        </Col>
                                    </Row>
                                    {isChannel === 'Neptune' && <>
                                        <div className="srf-inner-title">
                                            Manual SRF (Internal Only)
                                        </div>
                                        <Row>
                                            <Col md={3}>
                                                <FormDropdown
                                                    label='DDOS'
                                                    name='DDOS'
                                                    control={control}
                                                    errors={errors}
                                                    data={["NO", "YES"]}
                                                />
                                            </Col>
                                            <Col md={3}>
                                                <FormDropdown
                                                    label='Infra Resiliency requirement'
                                                    name='InfraResiliencyRequirement'
                                                    control={control}
                                                    errors={errors}
                                                    data={srfDropdownOptions?.SRFDROPDOWNVALUES?.['SRF Infra Resiliency']?.dropdownValue}
                                                    disabled={isRedundancy}
                                                />
                                            </Col>
                                            <Col md={3}>
                                                <FormInput
                                                    label='SLA/SLG'
                                                    name='SLASLG'
                                                    type="text"
                                                    control={control}
                                                    errors={errors}
                                                />
                                            </Col>
                                            <Col md={3}>
                                                <FormDropdown
                                                    label='Customer device interfacing with Maxis'
                                                    name='CustomerDeviceMaxis'
                                                    control={control}
                                                    errors={errors}
                                                    rules={{ required: 'This field is required' }}
                                                    data={srfDropdownOptions?.SRFDROPDOWNVALUES?.['SRF Customer Device']?.dropdownValue}
                                                />
                                            </Col>
                                        </Row>
                                        {panelName === 'DIA' && <>
                                            <Row>
                                                <Col md={3}>
                                                    <FormMultiSelectDropdown
                                                        label="DIA Traffic Profiling"
                                                        name="DIATrafficProfiling"
                                                        control={control}
                                                        errors={errors}
                                                        data={srfDropdownOptions?.SRFDROPDOWNVALUES?.['SRF DIA Trafic']?.dropdownValue}
                                                    />
                                                </Col>
                                                <Col md={3}>
                                                    <FormInput
                                                        label='Transit Traffic Profiling (%)'
                                                        name='DIATransitTrafficProfiling'
                                                        type="text"
                                                        control={control}
                                                        errors={errors}
                                                        disabled={!getValues('DIATrafficProfiling').includes('Transit')}
                                                    />
                                                </Col>
                                                <Col md={3}>
                                                    <FormInput
                                                        label='Peering Traffic Profiling (%)'
                                                        name='DIAPeeringTrafficProfiling'
                                                        type="text"
                                                        control={control}
                                                        errors={errors}
                                                        disabled={!getValues('DIATrafficProfiling').includes('Peering')}
                                                    />
                                                </Col>
                                                <Col md={3}>
                                                    <FormInput
                                                        label='CDN Traffic Profiling (%)'
                                                        name='DIACDNTrafficProfiling'
                                                        type="text"
                                                        control={control}
                                                        errors={errors}
                                                        disabled={!getValues('DIATrafficProfiling').includes('CDN')}
                                                    />
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col md={3}>
                                                    <FormDropdown
                                                        label='DIA IP'
                                                        name='DIAIP'
                                                        control={control}
                                                        errors={errors}
                                                        data={srfDropdownOptions?.SRFDROPDOWNVALUES?.['SRF DIA IP']?.dropdownValue}
                                                    />
                                                </Col>
                                                <Col md={3}>
                                                    <FormInput
                                                        label='IPV4 - No. of IP required'
                                                        name='DIAIPV4'
                                                        type="text"
                                                        control={control}
                                                        errors={errors}
                                                        disabled={getValues('DIAIP') !== 'IPV4' && getValues('DIAIP') !== 'BOTH'}
                                                    />
                                                </Col>
                                                <Col md={3}>
                                                    <FormInput
                                                        label='IPV6 - No. of IP required'
                                                        name='DIAIPV6'
                                                        type="text"
                                                        control={control}
                                                        errors={errors}
                                                        disabled={getValues('DIAIP') !== 'IPV6' && getValues('DIAIP') !== 'BOTH'}
                                                    />
                                                </Col>
                                                <Col md={3}>
                                                    <FormDropdown
                                                        label='Internet Routing'
                                                        name='DIAInternetRouting'
                                                        control={control}
                                                        errors={errors}
                                                        data={srfDropdownOptions?.SRFDROPDOWNVALUES?.['SRF Internet Routing']?.dropdownValue}
                                                    />
                                                </Col>
                                            </Row>
                                        </>}
                                    </>}
                                </fieldset>
                                <div className="pull-right">
                                    {((isChannel === "Neptune" && isManualCreatorRole && isActionBtnEnableFlag && isEnableAddUpdateBtnFlag) && !disableForm) &&
                                        <Button color="primary" onClick={() => handleCustomSubmit(selectedServiceType ? true : false)}>{selectedServiceType ? 'Update' : 'Submit'}</Button>}&nbsp;
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
export default ServiceTypeDetailsModal;