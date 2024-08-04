import { Button, Card, CardBody, CardTitle, Col, FormGroup, Label, Row } from "reactstrap";
import { expanded_constants_columns } from "./config/columns";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getConstantsHTTP, updateConstantsHTTP } from "../../../services/constant-service";
import Select from 'react-select';
import NeptuneAgGrid from "../../../components/ag-grid";
import { useSelector } from "react-redux";

const ConstantConfiguration = () => {
    const { userInfo } = useSelector(state => state.globalSlice);
    const [constantList, setConstantList] = useState([]);
    const [selectedConstant, setSelectedConstant] = useState(false);
    const [selectedList, setSelectedList] = useState([]);
    const [addNewRow, setAddNewRow] = useState(true);
    const [selectedMasterList, setSelectedMasterList] = useState([]);

    useEffect(() => {
        getAllConstants();
        //eslint-disable-next-line
    }, [])

    const getAllConstants = async () => {
        try {
            const { status, data } = await getConstantsHTTP();
            if (status === 200) {
                setConstantList(data);
                groupByProperty(data, 'Constant_Key');
            }
        } catch (e) {
            toast.error('Something went wrong');
        }
    }

    const groupByProperty = (data, property) => {
        const constants = Array.from(new Set(data.map(m => m[property])));
        const result = constants.map(m => { return { Constant_Key: m, constants: data.filter(f => f[property] === m) } });
        setConstantList(result);
    }

    const handleConstant = (data) => {
        setSelectedConstant(data);
        setSelectedList(JSON.parse(JSON.stringify(data?.value)));
        setSelectedMasterList(JSON.parse(JSON.stringify(data?.value)));
    }

    const handleAddNewConstant = () => {
        if (!addNewRow) return;
        const currDateTime = new Date().toLocaleString();
        const maxConsVal = Math.max(...selectedList.map(x => x.Constant_Value_ID));
        const exsitingConst = selectedList.find(x => x.Constant_Value_ID === maxConsVal);
        const newEntry = { ...exsitingConst };
        newEntry.Constant_Key = exsitingConst.Constant_Key
        newEntry.Constant_Value_ID = (exsitingConst.Constant_Value_ID) + 1;
        newEntry.Constant_Status = true;
        newEntry.Constant_Type = exsitingConst.Constant_Type;
        newEntry.Constant__Order = exsitingConst.Constant__Order + 1;
        newEntry.Filter = exsitingConst.Filter;
        newEntry.Constant_Value = '';
        newEntry.Constant_Desc = '';
        newEntry.Created_By = userInfo?.user?.User_ID;
        newEntry.Created_On = currDateTime;
        setSelectedList(prevState => [
            ...prevState, newEntry
        ]);
        setAddNewRow(false);
    }

    const handleUpdate = async () => {
        try {
            const payload = selectedList.filter(x => x.Constant_Key.toString().trim() !== '' && x.Constant_Value.toString().trim() !== '' && x.Constant__Order.toString().trim() !== '');
            if (!(checkDuplicateInObject('Constant_Value', payload) || checkDuplicateInObject('Constant__Order', payload))) {
                const { status } = await updateConstantsHTTP(payload);
                if (status === 200) {
                    getAllConstants();
                    toast.success('Constants updated successfully');
                    setAddNewRow(true);
                }
            } else {
                toast.error('Duplicate constant value/order');
            }
        } catch (e) {
            toast.error('Something went wrong');
        }
    }

    const checkDuplicateInObject = (propertyName, inputArray) => {
        let seenDuplicate = false;
        let testObject = {};
        //eslint-disable-next-line
        inputArray.map(function (item) {
            var itemPropertyName = item[propertyName].toString().toLowerCase();
            if (itemPropertyName in testObject) {
                seenDuplicate = true;
            }
            else {
                testObject[itemPropertyName] = itemPropertyName;
            }
        });
        return seenDuplicate;
    }

    const handleCancel = () => {
        setAddNewRow(true);
        setSelectedList(selectedMasterList);
    }

    return (
        <>
            <Card className="card_outer_padding" id="constant">
                <CardTitle>Constant Configuration</CardTitle>
                <CardBody>
                    <div className="app-inner-layout__wrapper">
                        <Row>
                            <Col md="4">
                                <FormGroup>
                                    <Label>Constant Name</Label>
                                    <Select
                                        name="constants-list"
                                        options={constantList.map(m => { return { label: m.Constant_Key, value: m.constants } })}
                                        value={selectedConstant}
                                        onChange={(value) => handleConstant(value)}
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                        {selectedList?.length > 0 ? <><Row>
                            <Col md={12}>
                                <NeptuneAgGrid
                                    data={selectedList}
                                    dataprops={expanded_constants_columns}
                                    paginated={true}
                                    itemsPerPage={5}
                                    searchable={true}
                                    exportable={true}
                                    topActionButtons={<Button color="primary" onClick={handleAddNewConstant}>Add new constant</Button>}
                                />
                            </Col>
                        </Row><br />
                            <div>
                                <Button color="primary" className="mr-2" onClick={handleUpdate}>
                                    Submit
                                </Button>&nbsp;
                                <Button color="primary" outline onClick={handleCancel}>
                                    Cancel
                                </Button>
                            </div>
                        </> : null}
                    </div>
                </CardBody>
            </Card>
        </>
    )
}

export default ConstantConfiguration;