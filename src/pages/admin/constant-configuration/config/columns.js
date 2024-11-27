import React from 'react';
import { Input } from 'reactstrap';
const EditableCellRenderer = (props) => {
    const { value, api } = props;
    const handleInputChange = (e) => {
        const newValue = e.target.value;
        const selectedRow = api.getSelectedRows()[0];
        if (selectedRow) {
            selectedRow[props.colDef.field] = newValue;
        }
        api.applyTransaction({ update: [selectedRow] });
    };
    return <Input type="text" value={value} onChange={handleInputChange} />;
};

export const expanded_constants_columns = [
    { field: 'Constant_Value_ID', headerName: 'Value ID' },
    { field: 'Constant_Value', headerName: 'Value', cellRenderer: EditableCellRenderer },
    { field: 'Constant_Desc', headerName: 'Description', cellRenderer: EditableCellRenderer },
    { field: 'Constant__Order', headerName: 'Order', cellRenderer: EditableCellRenderer },
    { field: 'Constant_Status', headerName: 'Status', editable: true },
];

export const constant_config_columns = (handleConfigModal) => {
    return [
        {
            field: 'Constant_Key', headerName: 'Key', width: 500, suppressSizeToFit: true, cellRenderer: (v) => (
                <span className='link-style'
                    onClick={() => handleConfigModal(true, v.data)}
                >
                    {v.value}
                </span>
            )
        }
    ];
}
