import XLSX from 'xlsx';

export const getWorkbook = async (event) => {
    const fileList = event.target.files;
    // no file has been selected
    if (Object.keys(fileList).length === 0) return;
    const file = fileList[0]; // single file upload
    const bstr = await read_file(file);
    const workBook = XLSX.read(bstr, { type: 'binary' });
    return workBook;
}

const read_file = (file) => {
    return new Promise((resolve, reject) => {
        var fr = new FileReader();
        fr.onload = (e) => {
            resolve(fr.result);
        };
        fr.readAsBinaryString(file);
    });
}

export const populateGrid = (workbook, columns) => {
    // our data is in the first sheet
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    var rowData = [];
    // start at the 2nd row - the first row are the headers
    var rowIndex = 2;
    // iterate over the worksheet pulling out the columns we're expecting
    while (worksheet['A' + rowIndex]) {
        var row = {};
        //eslint-disable-next-line
        Object.keys(columns).forEach(function (column) {
            row[columns[column]] = worksheet[column + rowIndex]?.w;
        });
        rowData.push(row);
        rowIndex++;
    }
    return rowData;
}
