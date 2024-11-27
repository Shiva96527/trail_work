import { useEffect, useState } from "react";
import { Button, Card, CardBody, CardTitle, Col, Row } from "reactstrap";
import useDropdownFilter from "../../../shared/hooks/dropdownFilterHook";
import { toast } from "react-toastify";
import { downloadSRFReportHTTP } from "../../../services/srf-service";
import { useForm } from "react-hook-form";
import FormDropdown from "../../../components/form-dropdown";
import FormInput from "../../../components/form-input";

const SRFReport = () => {
    const [getDropdownByType] = useDropdownFilter();
    const [dropdownOptions, setDropdownOptions] = useState(null);

    const {
        control,
        handleSubmit,
        getValues,
        reset,
        formState: { errors }
    } = useForm({
        defaultValues: {
            ReportName: '',
            ReportType: '',
            SRFStatus: '',
            Year: '',
            Week: '',
            EndWeek: '',
            SRFChannel: ''
        }
    });


    useEffect(() => {
        getDropdowns();
        /*eslint-disable-next-line*/
    }, [])

    const getDropdowns = async () => {
        const options = await getDropdownByType({ DropDownType: 'SRF Report DDL Values' });
        let tempDropdownOptions = {};
        options?.value?.forEach(d => {
            const values = d?.DropDownValue;
            const property = d?.DropDownType;
            if (values) {
                const options = values?.split(',');
                tempDropdownOptions[property] = options;
            }
        })
        setDropdownOptions(tempDropdownOptions);
    }

    const handleDownload = async () => {
        const payload = { ...getValues() }
        payload['LoginUIID'] = sessionStorage.getItem('uiid');
        payload.Week = +payload.Week;
        payload.EndWeek = +payload.EndWeek;
        try {
            const { data: { data: resultData, statusCode, statusMessage } } = await downloadSRFReportHTTP(payload);
            if (statusCode === 200) {
                var element = document.createElement('a');
                element.setAttribute('href', 'data:text/plain;base64,' + encodeURIComponent(resultData?.Uploaded_File));
                element.setAttribute('download', resultData.FileName);
                element.style.display = 'none';
                document.body.appendChild(element);
                element.click();
                document.body.removeChild(element);
                toast.success(statusMessage);
            }
            else {
                toast.error(statusMessage);
            }
        } catch (e) {
            toast.error('System error.');
        }
    }

    return (
        <>
            <Card className="card_outer_padding">
                <CardTitle>SRF Report</CardTitle>
                <CardBody>
                    <div className="app-inner-layout__wrapper">
                        <form onSubmit={handleSubmit(handleDownload)}>
                            <Row>
                                <Col md={4}>
                                    <FormDropdown
                                        label='Report List'
                                        name='ReportName'
                                        control={control}
                                        rules={{ required: 'Report List is required' }}
                                        errors={errors}
                                        data={dropdownOptions?.['SRF Report Name']}
                                    />
                                </Col>
                                <Col md={4}>
                                    <FormDropdown
                                        label='Report Type'
                                        name='ReportType'
                                        control={control}
                                        rules={{ required: 'Report Type is required' }}
                                        errors={errors}
                                        data={dropdownOptions?.['SRF Report Type']}
                                    />
                                </Col>
                                <Col md={4}>
                                    <FormDropdown
                                        label='SRF Status'
                                        name='SRFStatus'
                                        control={control}
                                        rules={{ required: 'SRF Status is required' }}
                                        errors={errors}
                                        data={dropdownOptions?.['SRF Report Status']}
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col md={4}>
                                    <FormDropdown
                                        label='Year'
                                        name='Year'
                                        control={control}
                                        rules={{ required: 'Year is required' }}
                                        errors={errors}
                                        data={dropdownOptions?.['SRF Report Year']}
                                    />
                                </Col>
                                <Col md={4}>
                                    <FormInput
                                        label='Week'
                                        name='Week'
                                        type="number"
                                        control={control}
                                        rules={{ required: 'Week is required' }}
                                        errors={errors}
                                    />
                                </Col>
                                <Col md={4}>
                                    <FormInput
                                        label='End Week'
                                        name='EndWeek'
                                        type="number"
                                        control={control}
                                        rules={{ required: 'End Week is required' }}
                                        errors={errors}
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col md={4}>
                                    <FormDropdown
                                        label='SRF Channel'
                                        name='SRFChannel'
                                        control={control}
                                        rules={{ required: 'SRF Channel is required' }}
                                        errors={errors}
                                        data={dropdownOptions?.['SRF Report Channel']}
                                    />
                                </Col>
                            </Row>
                            <div>
                                <Button color="primary" type="submit">Download in Excel</Button>&nbsp;
                                <Button color="danger" outline onClick={() => reset()}>Reset</Button>
                            </div>
                        </form>
                    </div>
                </CardBody>
            </Card>
        </>
    )
}

export default SRFReport;