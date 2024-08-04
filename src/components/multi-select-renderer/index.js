import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Multiselect } from "react-widgets";

export const MultiSelectCellRenderer = ({ value, api, colDef, data }) => {
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [options, setOptions] = useState([]);

    useEffect(() => {
        if (colDef.multiSelectOptions && colDef.multiSelectOptions.length > 0) {
            if (!value) return;
            const splitted = value?.split(',');
            const selected = colDef.multiSelectOptions.filter(f => splitted.indexOf(f) !== -1);
            setSelectedOptions(selected);
        }
        //eslint-disable-next-line
    }, [colDef, value])

    const handleSelectChange = (selectedOptions) => {
        const tempSelected = JSON.parse(JSON.stringify(selectedOptions));
        setSelectedOptions(tempSelected);

        // Get the selected row
        const selectedRow = api.getSelectedRows()[0];

        // Check if a row is selected
        if (selectedRow) {
            // Update the data field in the selected row
            selectedRow[colDef.field] = tempSelected?.join(',');

            // Log the updated row to the console
            console.log('Updated Row:', selectedRow);

            // Apply the transaction to update the row
            api.applyTransaction({ update: [selectedRow] });
        } else {
            console.error('No row selected');
        }

        // Call the handleDataChange function if provided
        if (colDef?.handleDataChange) {
            colDef.handleDataChange({ changed: true });
        }
    };

    const getOptions = (v) => {
        if (v) {
            let result = [];
            if (colDef?.field === 'MandatoryGroup') {
                result = colDef.multiSelectOptions?.filter(f => !data?.OptionGroup?.split(',')?.includes(f));
            } else if (colDef?.field === 'OptionGroup') {
                result = colDef.multiSelectOptions?.filter(f => !data?.MandatoryGroup?.split(',')?.includes(f));
            }
            setOptions(result);
        } else {
            setOptions([]);
        }
    }

    return (
        <div style={{ position: 'relative' }}>
            <Multiselect
                value={selectedOptions}
                data={options}
                onChange={handleSelectChange}
                disabled={colDef?.disabled}
                onToggle={(v) => getOptions(v)}
                containerClassName="custom-multiselect-container"
            />
            {selectedOptions.length > 0 && (
                <button
                    onClick={() => handleSelectChange([])}
                    style={{
                        position: 'absolute',
                        right: '15px',
                        top: '7px',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                    }}
                >
                    <FontAwesomeIcon icon={faTimesCircle} color="gray" />
                </button>
            )}
        </div>
    );
};