import { useState } from 'react';
import { useEffect } from 'react';
import { DropdownList } from 'react-widgets/cjs';

export const dropdownColumnData = (handleDDDetails) => {
    return [
        {
            field: 'DropDownType', headerName: 'DD Type Name', cellRenderer: (v) => (
                //eslint-disable-next-line
                <span className='link-style'
                    onClick={() => handleDDDetails(v.data)}
                >
                    {v.value}
                </span>
            ),
        },
        {
            field: 'DropDownValue', headerName: 'DD Values', editable: true, cellEditor: DropdownListRenderer, // Use the custom cell renderer
            width: 300
        },
        {
            field: 'InActiveValue', headerName: 'Inactive Values', cellEditor: DropdownListRenderer, // Use the custom cell renderer
            width: 300
        },
        { field: 'CreatedBy', headerName: 'Created By' },
        { field: 'CreatedDate', headerName: 'Created Date' }
    ]
}

export const DropdownListRenderer = ({ value }) => {
    const [list, setList] = useState([]);
    useEffect(() => {
        if (value) {
            setList(value?.split(','));
        }
    }, [value])

    return (
        <DropdownList
            data={list}
            onChange={() => { return }}
        />
    );
};
