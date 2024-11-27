import { useEffect, useMemo, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const ExpandableGrid = ({ title, refId, mainTitle, paginated, itemsPerPage = 10, data, dataprops, searchPlaceholder, onRowClick, topActionButtons, bottomActionButtons, exportable, onRowDoubleClicked, searchable = false }) => {
    const gridRef = useRef();
    const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), []);
    const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), []);

    const defaultColDef = useMemo(() => {
        return {
            resizable: true,
            sortable: true,
            filter: true,
            wrapText: true,
            autoHeight: true,
            cellStyle: { textAlign: "center" }
        };
    }, []);

    return (
        <div style={containerStyle}>
            <div className="outer-div">
                <div className="grid-wrapper">
                    <div style={gridStyle} className="ag-theme-alpine" id='vpeGrid'>
                        <div style={{ width: '35%' }}>
                            <AgGridReact
                                id="expandable-grid"
                                ref={gridRef}
                                pagination={paginated}
                                paginationPageSize={itemsPerPage}
                                paginationPageSizeSelector={[5, 10, 20, 50, 100]}
                                rowData={data}
                                columnDefs={dataprops}
                                singleClickEdit={false}
                                rowSelection='multiple'
                                defaultColDef={defaultColDef}
                                enableRangeSelection={true}
                                onRowClicked={onRowClick || null}
                                domLayout='autoHeight'
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExpandableGrid;