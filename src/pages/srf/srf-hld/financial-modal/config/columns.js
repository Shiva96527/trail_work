import { Input } from "reactstrap";

export const EditableCellRenderer = (props) => {
    const { value, api, colDef } = props;
    const handleInputChange = (e) => {
        const newValue = e.target.value;
        const selectedRow = api.getSelectedRows()[0];
        if (selectedRow) {
            selectedRow[props.colDef.field] = newValue;
        }
        api.applyTransaction({ update: [selectedRow] });
    };
    if (colDef?.type === 'textarea') {
        return <Input type="textarea" disabled={colDef?.disabled ? true : false} rows={3} cols={5} value={value || ''} onChange={handleInputChange} />;
    } else {
        return <Input type={colDef?.type || 'text'} disabled={colDef?.disabled ? true : false} value={value || ''} onChange={handleInputChange} />;
    }
};

export const capexcolumns = [
    { headerName: 'Name', field: 'name' },
    { headerName: 'Cost', field: 'cost', type: 'number', cellRenderer: EditableCellRenderer },
]

export const opexcolumns = [
    { headerName: 'Name', field: 'name' },
    { headerName: 'Cost', field: 'cost', type: 'number', cellRenderer: EditableCellRenderer },
]

export const vascolumns = [
    { headerName: 'Name', field: 'vasname', },
    { headerName: 'VAS Model', field: 'vasmodel' },
    { headerName: 'VAS Type', field: 'vastype' },
    { headerName: 'Cost', field: 'cost', type: 'number', cellRenderer: EditableCellRenderer }
]

