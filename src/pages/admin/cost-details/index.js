import { Card, CardBody, CardTitle, Col, Row } from "reactstrap";
import NeptuneAgGrid from "../../../components/ag-grid";
import { cost_details_columns } from "./config.js/columns";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import BuildingModalDetails from "./cost-details-modal/cost-details-modal";
import { useSelector } from "react-redux";
import { getCostDetailsHTTP } from "../../../services/cost-details-service";

const CostDetails = () => {
    const { userInfo } = useSelector(state => state.globalSlice);
    const [costList, setCostList] = useState([]);
    const [showCostDetails, setShowCostDetails] = useState(false);
    const [selectedCost, setSelectedCost] = useState(null);
    const [applicationType] = useState(null);

    useEffect(() => {
        // if (!isValidated) {
        //     validateUser();
        // } else {
        // getDropdownValues();
        getAllCostList();
        // }
    }, [userInfo])

    // useEffect(() => {
    //     if (applicationTypeList?.length > 0) {
    //         setApplicationType({ label: 'CPQ', value: 'CPQ' });
    //         getAllCostList('CPQ');
    //     }
    // }, [applicationTypeList])

    // const handleCostDetailsType = (value) => {
    //     setApplicationType(value);
    //     getAllCostList(value?.value);
    // }

    // const getDropdownValues = async () => {
    //     try {
    //         const { status, data } = await getCostApplicationDropdownHTTP();
    //         if (status === 200) {
    //             setApplicationTypeList(data?.map(m => { return { label: m?.Constant_Value, value: m?.Constant_Value } }));
    //         }
    //     } catch (e) {
    //         toast.error('Unable to get status values');
    //     }
    // }

    // const validateUser = () => {
    //     let passwordInput;
    //     console.log(userInfo);
    //     Swal.fire({
    //         title: 'Validate',
    //         html: `
    //           <input type="password" id="validate-password" class="swal2-input" placeholder="Password">
    //         `,
    //         confirmButtonText: 'Validate',
    //         focusConfirm: false,
    //         didOpen: () => {
    //             const popup = Swal.getPopup();
    //             passwordInput = popup.querySelector('#validate-password');
    //             passwordInput.onkeyup = (event) => event.key === 'Enter' && Swal.clickConfirm()
    //         },
    //         preConfirm: () => {
    //             const password = passwordInput.value
    //             if (!password) {
    //                 Swal.showValidationMessage(`Please enter the password`)
    //             }
    //             console.log(userInfo);
    //             validatePassword(password, Swal);
    //         },
    //     })
    // }

    // const validatePassword = async (password) => {
    //     const payload = { username: userInfo?.user?.User_Name, password };
    //     try {
    //         const { status, data: { message } } = await validateUserCredentialHTTP(payload);
    //         if (status === 200 && message === 'Valid username & password') {
    //             setIsValidated(true);
    //         } else {
    //             Swal.showValidationMessage('Invalid Credentials');
    //         }
    //     } catch (e) {
    //         toast.error('Invalid user credential');
    //     }
    // }

    const getAllCostList = async () => {
        const payload = {
            Action: 'CPQ',
            LoginUIID: sessionStorage.getItem('uiid')
        }
        try {
            const { data: { data: resultData, statusCode, statusMessage } } = await getCostDetailsHTTP(payload);
            if (statusCode === 200 && resultData) {
                setCostList(resultData);
                toast.success(statusMessage);
            } else {
                toast.error(statusMessage);
            }
        } catch (e) {
            toast.error("System error.");
        }
    }

    const handleViewDetails = (status, data) => {
        setShowCostDetails(status);
        setSelectedCost(data);
    }

    const handleCostDetailsModal = (status) => {
        setShowCostDetails(status);
        getAllCostList();
    }

    return (
        <>
            {true ? <Card className="card_outer_padding">
                <CardTitle>Cost Catalogue(Capex,Opex)</CardTitle>
                <CardBody>
                    <div className="app-inner-layout__wrapper">
                        {/* <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <Col md={3}>
                                <FormGroup>
                                    <Select
                                        value={applicationType}
                                        options={applicationTypeList}
                                        onChange={(v) => handleCostDetailsType(v)}
                                    />
                                </FormGroup>
                            </Col>
                        </div> */}
                        <Row>
                            <Col md="12">
                                <NeptuneAgGrid
                                    data={costList}
                                    dataprops={cost_details_columns(handleViewDetails, applicationType?.value)}
                                    paginated={true}
                                    itemsPerPage={10}
                                    searchable={true}
                                    exportable={true}
                                />
                            </Col>
                        </Row>
                    </div>
                </CardBody>
            </Card> : null}
            {showCostDetails && <BuildingModalDetails isOpen={showCostDetails} selectedCost={selectedCost} setShowCostDetails={setShowCostDetails} applicationType={applicationType?.value} handleCostDetailsModal={handleCostDetailsModal} />}
        </>
    )
}

export default CostDetails;