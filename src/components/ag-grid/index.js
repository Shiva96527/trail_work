import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { Button, Input } from "reactstrap";
import { AgGridReact } from "ag-grid-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";  
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const NeptuneAgGrid = ({ refId, paginated, itemsPerPage = 10, data, dataprops, onRowClick, topActionButtons, exportable = true, onRowDoubleClicked, searchable = false, onSelectionChanged }) => {
    const gridRef = useRef();
    const [rowData, setRowData] = useState([]);
    const [columnDefs, setColumnDefs] = useState([]);
    const [searchText, setSearchText] = useState("");
    const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), []);
    const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), []);
    const [windowWidth, setWindowWidth] = useState();
    const navigate = useNavigate();  

    useEffect(() => {
        setRowData(data);
    }, [data]);

    useEffect(() => {
        if (dataprops) {
            setColumnDefs(dataprops);
            onGridReady();
        }
    }, [dataprops]);

    useEffect(() => {
        window.addEventListener('resize', function () {
            setWindowWidth(window.innerWidth);
        })
    }, []);

    useEffect(() => {
        if (windowWidth) {
            onGridReady();
        }
    }, [windowWidth]);

    const defaultColDef = useMemo(() => {
        return {
            resizable: true,
            sortable: true,
            filter: true,
            wrapText: true,
            autoHeight: true
        };
    }, []);

    const onGridReady = useCallback(() => {
        setTimeout(() => {
            if (gridRef?.current) {
                gridRef?.current?.api?.sizeColumnsToFit();
            }
        }, 10);
    }, []);

    const exportToExcel = () => {
        let { rowsToDisplay } = gridRef?.current?.api?.getModel();
        let data = rowsToDisplay.map(row => row.data);
        const options = {
            fileName: 'exported_data.xlsx',
            sheetName: 'My Data'
        }
        let workbook = new Workbook();
        let worksheet = workbook.addWorksheet(options?.sheetName);
        worksheet.columns = dataprops?.map((column) => {
            let headerCol = {
                header: column.headerName,
                key: column.field,
                width: 30,
            }
            return headerCol
        });

        // Fill data
        data.forEach((row) => {
            let newRow = {};
            dataprops.forEach((column) => {
                if (column?.valueGetter) {
                    newRow[column?.field] = column?.valueGetter(row);
                } else {
                    newRow[column?.field] = row[column?.field];
                }
            });
            worksheet.addRow(newRow);
        });

        // Set alignment for all rows (wrapText: true for the moment, but can be extended to other properties)
        let rowIndex = 1;
        for (rowIndex; rowIndex <= worksheet.rowCount; rowIndex++) {
            worksheet.getRow(rowIndex).alignment = { vertical: 'top', horizontal: 'left', wrapText: true };
        }

        // get cells of the header
        worksheet.getRow(1).eachCell((cell, colNumber) => {
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'F0F8FF' },
                bgColor: { argb: 'F0F8FF' }
            };
            cell.font = { color: { argb: '000000' } };
        });

        // Add filter to the header
        worksheet.autoFilter = {
            from: {
                row: 1,
                column: 1
            },
            to: {
                row: 1,
                column: dataprops.length
            }
        };

        // Save file
        workbook.xlsx.writeBuffer().then((data) => {
            let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            fs.saveAs(blob, options?.fileName);
        })
    };

    const onSearchInputChange = (event) => {
        setSearchText(event.target.value);
        applyGlobalSearch();
    };

    const applyGlobalSearch = () => {
        if (gridRef?.current?.api) {
            gridRef.current.api.setQuickFilter(searchText);
        }
    };

    const handleOnSelection = () => {
        if (gridRef) {
            const selectedRows = gridRef?.current?.api?.getSelectedRows();
            if (onSelectionChanged) {
                onSelectionChanged(selectedRows);
            }
        }
    };

    // Handle search button click (navigate to the search page)
    const handleSearchButtonClick = () => {
        navigate('/neptune/srf/search'); // Navigate to the search page
    };

    return (
        <div style={containerStyle}>
            <div className="outer-div">
                {(topActionButtons || searchable || exportable) && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                        {topActionButtons ? <div>{topActionButtons}</div> : <div></div>}
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            {searchable ? (
                                <>
                                    <Input
                                        type="text"
                                        placeholder="Global Search"
                                        value={searchText}
                                        onChange={onSearchInputChange}
                                        style={{ marginRight: '10px' }} 
                                    />
                                   
                                </>
                            ) : null}
                            {exportable ? <Button color="success" onClick={exportToExcel}>Export</Button> : null}
                        </div>
                    </div>
                )}
                <div className="grid-wrapper">
                    <div style={gridStyle} className="ag-theme-alpine" id="neptune-ag-grid">
                        <AgGridReact
                            key={refId}
                            id="vpe-grid"
                            ref={gridRef}
                            pagination={paginated}
                            paginationPageSize={itemsPerPage}
                            paginationPageSizeSelector={[5, 10, 20, 50, 100]}
                            rowData={rowData}
                            columnDefs={columnDefs}
                            singleClickEdit={false}
                            onRowDoubleClicked={onRowDoubleClicked}
                            onSelectionChanged={handleOnSelection}
                            rowSelection="multiple"
                            defaultColDef={defaultColDef}
                            onGridReady={onGridReady}
                            enableRangeSelection={true}
                            onRowClicked={onRowClick || null}
                            domLayout="autoHeight"
                            rowHeight={30}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
    
};

export default NeptuneAgGrid;

