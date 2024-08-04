import React, { useEffect, useImperativeHandle, useRef, useState } from "react";
import { Multiselect } from "react-widgets";
const AgGridMultiSelectEditor = React.forwardRef((props, ref) => {
    const [value, setValue] = useState(props.value);
    const inputRef = useRef(null); // Use a separate ref for the input element

    useEffect(() => {
        // focus on input
        inputRef.current?.focus();
    }, []);

    /* Component Editor Lifecycle methods */
    useImperativeHandle(ref, () => ({
        getValue: () => value,
        isPopup: () => false
    }));

    return (
        <div className='dropdown-container ag-cell-edit-wrapper'>
            <Multiselect
                style={{ width: props?.colDef?.width + 'px' }}
                inputRef={inputRef} // Set inputRef as the ref for the input element
                value={value}
                data={props.options.map((option) => option)}
                onChange={setValue}
                containerClassName="custom-multiselect-container"
            />
        </div>

    );
});

export default AgGridMultiSelectEditor;
