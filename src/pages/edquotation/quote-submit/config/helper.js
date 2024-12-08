import XLSX from "xlsx";

export const getWorkbook = async (fileList) => {
  // no file has been selected
  const file = fileList[0]; // single file upload
  const bstr = await read_file(file);
  const workBook = XLSX.read(bstr, { type: "binary" });
  return workBook;
};

const read_file = (file) => {
  return new Promise((resolve, reject) => {
    var fr = new FileReader();
    fr.onload = (e) => {
      resolve(fr.result);
    };
    fr.readAsBinaryString(file);
  });
};

export const populateGrid = (workbook, columns) => {
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  var rowData = [];
  var rowIndex = 2;

  while (true) {
    let isRowEmpty = true;
    var row = {};
    Object.keys(columns).forEach(function (column) {
      const cellValue = worksheet[column + rowIndex]?.w;
      row[columns[column]] = cellValue || "";
      if (cellValue) {
        isRowEmpty = false;
      }
    });
    if (isRowEmpty) {
      break;
    }
    rowData.push(row);
    rowIndex++;
  }
  return rowData;
};