import { Card, CardBody, CardTitle, Col, Row } from "reactstrap";
import { user_group_mapping_column } from "./config/columns";
import { useEffect, useState } from "react";
import NeptuneAgGrid from "../../../components/ag-grid";
import { getUsersMappingListHTTP } from "../../../services/srf-service";
import { toast } from "react-toastify";

const UserGroupMapping = () => {
    const [list, setList] = useState([]);

    useEffect(() => {
        getUserGroups();
    }, [])


    const getUserGroups = async () => {
        const payload = {
            LoginUIID: sessionStorage.getItem('uiid'),
            Action: 'UserGroupMapping'
        }
        try {
            const { data: { data: resultData, statusCode, statusMessage } } = await getUsersMappingListHTTP(payload);
            if (statusCode === 200) {
                setList(resultData);
                toast.success(statusMessage);
            } else {
                toast.error(statusMessage);
            }
        } catch (e) {
            toast.error('Something went wrong');
        }
    }

    return (
        <>
            <Card className="card_outer_padding">
                <CardTitle>Users & Group Mapping</CardTitle>
                <CardBody>
                    <div className="app-inner-layout__wrapper">
                        <Row>
                            <Col md="12">
                                <NeptuneAgGrid
                                    data={list}
                                    dataprops={user_group_mapping_column}
                                    paginated={true}
                                    itemsPerPage={10}
                                    searchable={true}
                                    exportable={true}
                                />
                            </Col>
                        </Row>
                    </div>
                </CardBody>
            </Card>
        </>
    )
}

export default UserGroupMapping;