import { Card, CardBody, CardTitle, Col, Row } from "reactstrap";
import NeptuneAgGrid from "../../../components/ag-grid";
import { vascost_config_columns } from "./config.js/columns";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { getVASCostDetailsHTTP } from "../../../services/cost-details-service";
import VASCostDetailsModal from "./vascost-details-modal/vascost-details-modal";

const VASCostConfig = () => {
    const { userInfo } = useSelector(state => state.globalSlice);
    const [costList, setCostList] = useState([]);
    const [showVasDetails, setShowVasDetails] = useState(false);
    const [selectedVas, setSelectedVas] = useState(null);
    // const [isValidated, setIsValidated] = useState(false);

    useEffect(() => {
        // if (!isValidated) {
        //     validateUser();
        // } else {
        getAllVasCostList();
        // }
    }, [userInfo])

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

    const getAllVasCostList = async () => {
        const payload = {
            Action: 'CPQ',
            LoginUIID: sessionStorage.getItem('uiid')
        }
        try {
            const { data: { data: resultData, statusCode, statusMessage } } = await getVASCostDetailsHTTP(payload);
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
        setShowVasDetails(status);
        setSelectedVas(data);
    }

    const handleVasDetailsModal = (status) => {
        setShowVasDetails(status);
        getAllVasCostList();
    }

    return (
        <>
            {true ? <Card className="card_outer_padding">
                <CardTitle>VAS Cost Catalogue</CardTitle>
                <CardBody>
                    <div className="app-inner-layout__wrapper">
                        <Row>
                            <Col md="12">
                                <NeptuneAgGrid
                                    data={costList}
                                    dataprops={vascost_config_columns(handleViewDetails)}
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
            {showVasDetails && <VASCostDetailsModal isOpen={showVasDetails} selectedVas={selectedVas} setShowVasDetails={setShowVasDetails} handleVasDetailsModal={handleVasDetailsModal} />}
        </>
    )
}

export default VASCostConfig;